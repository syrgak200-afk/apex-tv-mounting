import { z } from "zod";
import {
  CUSTOM_WALL_DETAILS,
  ELECTRICAL_SAFETY_NOTE,
  FIREPLACE_PHOTOS,
  FRAME_TV_PHOTOS,
  IN_WALL_CONCEALMENT,
  LARGE_TV_PHOTOS,
  PRIMARY_MOUNTING_PRICE,
  RACEWAY_PRICE,
  WALL_TYPES,
} from "./business-knowledge";

const tvSizeSchema = z.enum([
  "under-55",
  "55-64",
  "65-74",
  "75-84",
  "85-97",
  "98+",
  "Samsung Frame",
]);

export const PricingInputSchema = z.object({
  serviceType: z
    .enum([
      "tv-mounting",
      "tv-unmounting",
      "wall-patching",
      "tv-stand-assembly",
      "bed-assembly",
      "moving",
    ])
    .default("tv-mounting"),
  tvSizes: z.array(tvSizeSchema).default([]),
  wallType: z.enum(WALL_TYPES).default("drywall"),
  mountType: z.enum(["fixed", "tilting", "full-motion"]).default("fixed"),
  hasMount: z.enum(["yes", "no", "not-sure"]).default("yes"),
  wireConcealment: z.enum(["none", "raceway", "in-wall"]).default("none"),
  aboveFireplace: z.enum(["yes", "no"]).default("no"),
  soundbar: z.enum(["none", "wall", "mount"]).default("none"),
  patchLocations: z.number().int().positive().default(1),
  movingHours: z.number().positive().optional(),
  outsidePrimaryArea: z.boolean().default(false),
});

export type PricingInput = z.input<typeof PricingInputSchema>;
export type ValidatedPricingInput = z.output<typeof PricingInputSchema>;

export const PricingConfigurationSchema = z.object({
  standardMounting: z.object({ min: z.number().positive(), max: z.number().positive() }),
  tiltMount: z.object({ min: z.number().positive(), max: z.number().positive() }),
  raceway: z.object({ min: z.number().positive(), max: z.number().positive() }),
  inWallConcealment: z.object({ min: z.number().positive(), max: z.number().positive() }),
  tvUnmounting: z.object({ min: z.number().positive(), max: z.number().positive() }),
  wallPatching: z.object({ min: z.number().positive(), max: z.number().positive() }),
  tvStandAssembly: z.object({ min: z.number().positive(), max: z.number().positive() }),
  bedAssembly: z.object({ min: z.number().positive(), max: z.number().positive() }),
  movingHourly: z.object({ min: z.number().positive(), max: z.number().positive(), minimumHours: z.number().int().positive() }),
});

/** Validated, server-only business configuration. It is the sole source for approved amounts. */
export const PRICING_CONFIGURATION = PricingConfigurationSchema.parse({
  standardMounting: { min: PRIMARY_MOUNTING_PRICE, max: PRIMARY_MOUNTING_PRICE },
  tiltMount: { min: 10, max: 30 },
  raceway: { min: RACEWAY_PRICE, max: RACEWAY_PRICE },
  inWallConcealment: IN_WALL_CONCEALMENT,
  tvUnmounting: { min: PRIMARY_MOUNTING_PRICE, max: PRIMARY_MOUNTING_PRICE },
  wallPatching: { min: 40, max: 60 },
  tvStandAssembly: { min: 200, max: 200 },
  bedAssembly: { min: 200, max: 200 },
  movingHourly: { min: 99, max: 99, minimumHours: 3 },
});

export const EstimateResultSchema = z.object({
  status: z.enum(["estimated", "custom_quote"]),
  pricingDisplay: z.enum(["starting_at", "range", "custom_quote"]),
  confidence: z.enum(["high", "medium", "requires_review"]),
  currency: z.literal("USD"),
  min: z.number().nonnegative().nullable(),
  max: z.number().nonnegative().nullable(),
  lineItems: z.array(z.object({ label: z.string(), min: z.number().nonnegative(), max: z.number().nonnegative() })),
  notes: z.array(z.string()),
  customReasons: z.array(z.string()),
  requiredPhotos: z.array(z.string()),
  requiresHumanReview: z.boolean(),
  summary: z.string(),
  nextQuestions: z.array(z.string()),
});

export type EstimateResult = z.infer<typeof EstimateResultSchema>;

type PriceLine = { label: string; min: number; max: number };
const unique = (items: string[]) => [...new Set(items)];
const photoList = (...lists: string[][]) => unique(lists.flat());

function nextQuestions(input: ValidatedPricingInput, requiresReview: boolean) {
  const questions: string[] = [];
  if (requiresReview) questions.push("Can you upload the requested photos of the wall, TV, and intended mounting area?");
  if (input.hasMount !== "yes") questions.push("Do you have a photo or link for the mount you plan to use?");
  if (input.aboveFireplace === "yes") questions.push("Can you include the fireplace, mantel, and outlet in one photo?");
  if (input.tvSizes.includes("Samsung Frame")) questions.push("Can you include the One Connect Box and recessed-box area in your photos?");
  return unique(questions);
}

function customQuote(reasons: string[], requiredPhotos: string[], notes: string[] = [], questions: string[] = []): EstimateResult {
  return EstimateResultSchema.parse({
    status: "custom_quote",
    pricingDisplay: "custom_quote",
    confidence: "requires_review",
    currency: "USD",
    min: null,
    max: null,
    lineItems: [],
    notes: unique(notes),
    customReasons: unique(reasons),
    requiredPhotos: unique(requiredPhotos),
    requiresHumanReview: true,
    summary: "Photos are needed before we can provide a reliable estimate for this installation.",
    nextQuestions: unique(questions),
  });
}

function estimated(lineItems: PriceLine[], notes: string[] = [], requiredPhotos: string[] = [], requiresHumanReview = false, questions: string[] = []): EstimateResult {
  const min = lineItems.reduce((total, line) => total + line.min, 0);
  const max = lineItems.reduce((total, line) => total + line.max, 0);
  return EstimateResultSchema.parse({
    status: "estimated",
    pricingDisplay: min === max ? "starting_at" : "range",
    confidence: requiresHumanReview ? "requires_review" : min === max ? "high" : "medium",
    currency: "USD",
    min,
    max,
    lineItems,
    notes: unique(notes),
    customReasons: [],
    requiredPhotos: unique(requiredPhotos),
    requiresHumanReview,
    summary: min === max ? "Estimated starting price based on the installation details provided." : "Preliminary estimate based on the installation details provided.",
    nextQuestions: unique(questions),
  });
}

function travelNote(input: ValidatedPricingInput) {
  return input.outsidePrimaryArea ? ["A travel adjustment may apply for locations outside our primary service area. We will always confirm this before scheduling."] : [];
}

function calculateMounting(input: ValidatedPricingInput): EstimateResult {
  if (!input.tvSizes.length) throw new z.ZodError([{ code: z.ZodIssueCode.custom, path: ["tvSizes"], message: "At least one TV size is required." }]);

  const reasons: string[] = [];
  const photos: string[] = [];
  const notes: string[] = travelNote(input);
  const customWall = input.wallType !== "drywall" ? CUSTOM_WALL_DETAILS[input.wallType] : undefined;
  if (customWall) { reasons.push(customWall.reason); photos.push(...customWall.photos); }
  if (input.mountType === "full-motion") {
    reasons.push("Full-motion mounts require photo review to confirm stud location, mount compatibility, and the mounting approach.");
    photos.push("Full wall photo", "Mount photo", "Desired mounting area photo", "Outlet location photo");
  }
  if (input.hasMount !== "yes") {
    reasons.push("Mount supply or compatibility needs review before we can provide a reliable estimate.");
    photos.push("TV model label photo", "Mount photo", "Full wall photo");
  }
  if (input.aboveFireplace === "yes") {
    reasons.push("Above-fireplace installations require photo review to confirm wall conditions, mantel clearance, and placement.");
    photos.push(...FIREPLACE_PHOTOS);
  }
  if (input.soundbar !== "none") {
    reasons.push("Soundbar mounting requires photo review until separate pricing is approved.");
    photos.push("Full wall photo", "Soundbar and device photo", "Desired mounting area photo", "Outlet location photo");
  }
  for (const size of input.tvSizes) {
    if (size === "Samsung Frame") {
      reasons.push("Samsung Frame TV installations require photo review to confirm One Connect routing and recessed-box planning.");
      photos.push(...FRAME_TV_PHOTOS);
    }
    if (size === "85-97") {
      reasons.push("85–97 inch TVs require photo review before we can provide a reliable estimate.");
      photos.push(...LARGE_TV_PHOTOS);
    }
    if (size === "98+") {
      reasons.push("98 inch and larger TVs require photo review before we can provide a reliable estimate.");
      photos.push(...LARGE_TV_PHOTOS);
    }
    if (size === "75-84") {
      notes.push("75–84 inch TVs may require additional handling. Please include photos for human review.");
      photos.push(...LARGE_TV_PHOTOS);
    }
  }
  if (input.wireConcealment === "in-wall") notes.push(ELECTRICAL_SAFETY_NOTE);
  if (reasons.length) return customQuote(reasons, photoList(photos), notes, nextQuestions(input, true));

  const lines: PriceLine[] = input.tvSizes.map(() => ({ label: "Standard TV mounting", ...PRICING_CONFIGURATION.standardMounting }));
  if (input.mountType === "tilting") lines.push({ label: "Tilt-mount installation", ...PRICING_CONFIGURATION.tiltMount });
  if (input.wireConcealment === "raceway") lines.push({ label: "External raceway", ...PRICING_CONFIGURATION.raceway });
  if (input.wireConcealment === "in-wall") {
    lines.push({ label: "In-wall wire concealment", ...PRICING_CONFIGURATION.inWallConcealment });
  }
  const requiresHumanReview = input.tvSizes.includes("75-84");
  return estimated(lines, notes, photos, requiresHumanReview, nextQuestions(input, requiresHumanReview));
}

function calculateNonMounting(input: ValidatedPricingInput): EstimateResult {
  const travel = travelNote(input);
  switch (input.serviceType) {
    case "tv-unmounting":
      if (!input.tvSizes.length) throw new z.ZodError([{ code: z.ZodIssueCode.custom, path: ["tvSizes"], message: "At least one TV size is required." }]);
      return estimated(input.tvSizes.map(() => ({ label: "TV unmounting", ...PRICING_CONFIGURATION.tvUnmounting })), travel, [], false, nextQuestions(input, false));
    case "wall-patching":
      return estimated(Array.from({ length: input.patchLocations }, () => ({ label: "Small wall patching", ...PRICING_CONFIGURATION.wallPatching })), travel, [], false, nextQuestions(input, false));
    case "tv-stand-assembly":
      return estimated([{ label: "TV stand assembly", ...PRICING_CONFIGURATION.tvStandAssembly }], travel, [], false, nextQuestions(input, false));
    case "bed-assembly":
      return estimated([{ label: "Bed assembly", ...PRICING_CONFIGURATION.bedAssembly }], travel, [], false, nextQuestions(input, false));
    case "moving": {
      if (!input.movingHours) throw new z.ZodError([{ code: z.ZodIssueCode.custom, path: ["movingHours"], message: "Moving hours are required." }]);
      const billedHours = Math.max(PRICING_CONFIGURATION.movingHourly.minimumHours, input.movingHours);
      const amount = billedHours * PRICING_CONFIGURATION.movingHourly.min;
      return estimated([{ label: `Moving (${billedHours} hour${billedHours === 1 ? "" : "s"})`, min: amount, max: amount }], ["Moving is billed at $99 per hour with a 3-hour minimum.", ...travel], [], false, nextQuestions(input, false));
    }
    default:
      return calculateMounting(input);
  }
}

/** Server-side source of truth for validated preliminary estimates. */
export function calculateEstimate(rawInput: PricingInput): EstimateResult {
  const input = PricingInputSchema.parse(rawInput);
  return input.serviceType === "tv-mounting" ? calculateMounting(input) : calculateNonMounting(input);
}

/** Presentation follows the server-selected display mode and never derives a price range client-side. */
export function estimatePresentation(estimate: EstimateResult): { label: string; amount: string } {
  if (estimate.pricingDisplay === "custom_quote") return { label: "", amount: "This installation needs photo review before we can provide a reliable estimate." };
  if (estimate.pricingDisplay === "starting_at") return { label: "Estimated starting price", amount: `$${estimate.min}` };
  return { label: "Preliminary estimate", amount: `$${estimate.min}–$${estimate.max}` };
}
