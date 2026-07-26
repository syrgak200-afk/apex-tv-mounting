export type PricingInput = { tvSizes: string[]; wallType: string; mountType: string; hasMount: string; wireConcealment: string; aboveFireplace: string; soundbar: string };
export type Estimate = { low: number | null; high: number | null; needsReview: boolean; notes: string[] };

const add = (total: { low: number; high: number }, low: number, high = low) => { total.low += low; total.high += high; };

/** Server-only source of truth for preliminary Apex estimates. */
export function calculateEstimate(input: PricingInput): Estimate {
  const total = { low: 0, high: 0 };
  const notes: string[] = [];
  let needsReview = false;
  for (const size of input.tvSizes) {
    if (["85+", "98-100", "Samsung Frame"].includes(size)) needsReview = true;
    add(total, 89);
    if (size === "75-84") { needsReview = true; notes.push("75-inch and larger TVs may require two technicians and photo review."); }
  }
  if (input.mountType === "tilting") add(total, 10, 30);
  if (input.mountType === "full-motion") add(total, 40, 100);
  if (input.hasMount === "no") notes.push("A mount supplied by Apex is an additional cost to be confirmed.");
  if (input.wallType === "plaster") add(total, 40, 100);
  if (["brick", "concrete"].includes(input.wallType)) add(total, 60, 150);
  if (["metal-studs", "tile-stone"].includes(input.wallType)) needsReview = true;
  if (input.wireConcealment === "raceway") add(total, 25);
  if (input.wireConcealment === "in-wall") add(total, 65, 85);
  if (input.aboveFireplace === "yes") { add(total, 75, 175); notes.push("Above-fireplace installations require photos and wall-condition review."); }
  if (input.soundbar === "wall") add(total, 50, 100);
  if (input.soundbar === "mount") add(total, 60, 120);
  if (input.tvSizes.length > 1) notes.push("A multiple-TV discount may be available after review.");
  if (needsReview) return { low: null, high: null, needsReview: true, notes: ["This project needs photo review before we can provide a reliable estimate.", ...notes] };
  return { low: total.low, high: total.high, needsReview: false, notes };
}
