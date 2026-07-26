import assert from "node:assert/strict";
import test from "node:test";
import { calculateEstimate, estimatePresentation, type PricingInput } from "./pricing-rules";

const standard: PricingInput = {
  tvSizes: ["65-74"],
  wallType: "drywall",
  mountType: "fixed",
  hasMount: "yes",
  wireConcealment: "none",
  aboveFireplace: "no",
  soundbar: "none",
};

test("standard $89 uses starting_at", () => {
  const result = calculateEstimate(standard);
  assert.equal(result.status, "estimated");
  assert.equal(result.pricingDisplay, "starting_at");
  assert.equal(result.confidence, "high");
  assert.equal(result.min, 89);
  assert.equal(result.max, 89);
  assert.ok(result.summary.length > 0);
  assert.ok(Array.isArray(result.nextQuestions));
});

test("two standard TVs total $178", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["55-64", "65-74"] });
  assert.equal(result.min, 178);
  assert.equal(result.max, 178);
});

test("tilt returns a range", () => {
  const result = calculateEstimate({ ...standard, mountType: "tilting" });
  assert.equal(result.pricingDisplay, "range");
  assert.deepEqual([result.min, result.max], [99, 119]);
});

test("full-motion is a custom quote", () => {
  const result = calculateEstimate({ ...standard, mountType: "full-motion" });
  assert.equal(result.status, "custom_quote");
  assert.ok(result.customReasons.some((reason) => reason.includes("Full-motion")));
});

test("brick is a custom quote with a brick reason", () => {
  const result = calculateEstimate({ ...standard, wallType: "brick" });
  assert.equal(result.status, "custom_quote");
  assert.ok(result.customReasons.some((reason) => reason.includes("Brick")));
});

test("concrete is a custom quote", () => {
  const result = calculateEstimate({ ...standard, wallType: "concrete" });
  assert.equal(result.status, "custom_quote");
});

test("fireplace is a custom quote with its required photo checklist", () => {
  const result = calculateEstimate({ ...standard, aboveFireplace: "yes" });
  assert.equal(result.status, "custom_quote");
  assert.deepEqual(result.requiredPhotos, ["Full wall photo", "Fireplace and mantel photo", "Outlet location photo", "TV model label photo", "Desired mounting area photo"]);
});

test("Frame TV is a custom quote with its required photo checklist", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["Samsung Frame"] });
  assert.equal(result.status, "custom_quote");
  assert.ok(result.requiredPhotos.includes("One Connect Box photo"));
  assert.ok(result.requiredPhotos.includes("Recessed-box area photo"));
});

test("75-inch TVs show a human-review warning while retaining an estimate", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["75-84"] });
  assert.equal(result.status, "estimated");
  assert.equal(result.requiresHumanReview, true);
  assert.ok(result.notes.some((note) => note.includes("75–84")));
  assert.ok(result.requiredPhotos.includes("TV model label photo"));
});

test("85-inch TVs require a custom quote", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["85-97"] });
  assert.equal(result.status, "custom_quote");
});

test("98-inch TVs require a custom quote", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["98+"] });
  assert.equal(result.status, "custom_quote");
});

test("raceway is included as a starting-at amount", () => {
  const result = calculateEstimate({ ...standard, wireConcealment: "raceway" });
  assert.deepEqual([result.pricingDisplay, result.min, result.max], ["starting_at", 114, 114]);
});

test("in-wall concealment returns a range and electrical-safety note", () => {
  const result = calculateEstimate({ ...standard, wireConcealment: "in-wall" });
  assert.deepEqual([result.pricingDisplay, result.min, result.max], ["range", 154, 174]);
  assert.ok(result.notes.some((note) => note.includes("Electrical outlet work is not included")));
});

test("multi-TV unmounting does not inherit mounting adjustments", () => {
  const result = calculateEstimate({ ...standard, serviceType: "tv-unmounting", tvSizes: ["55-64", "75-84"], mountType: "full-motion", wireConcealment: "in-wall" });
  assert.deepEqual([result.min, result.max, result.pricingDisplay], [178, 178, "starting_at"]);
});

test("wall patching uses $40–$60 per location", () => {
  const result = calculateEstimate({ serviceType: "wall-patching", patchLocations: 2 });
  assert.deepEqual([result.min, result.max], [80, 120]);
});

test("TV stand assembly is $200", () => {
  const result = calculateEstimate({ serviceType: "tv-stand-assembly" });
  assert.deepEqual([result.min, result.max], [200, 200]);
});

test("bed assembly is $200", () => {
  const result = calculateEstimate({ serviceType: "bed-assembly" });
  assert.deepEqual([result.min, result.max], [200, 200]);
});

test("moving below three hours uses the $297 minimum", () => {
  const result = calculateEstimate({ serviceType: "moving", movingHours: 1 });
  assert.deepEqual([result.min, result.max], [297, 297]);
});

test("moving above three hours uses the requested hours", () => {
  const result = calculateEstimate({ serviceType: "moving", movingHours: 4 });
  assert.deepEqual([result.min, result.max], [396, 396]);
});

test("invalid values are rejected by Zod validation", () => {
  assert.throws(() => calculateEstimate({ ...standard, wallType: "paper" } as never));
  assert.throws(() => calculateEstimate({ ...standard, tvSizes: [] }));
});

test("a custom TV never returns a partial total", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["65-74", "85-97"] });
  assert.deepEqual([result.min, result.max, result.lineItems], [null, null, []]);
});

test("required photos are deduplicated across combined review conditions", () => {
  const result = calculateEstimate({ ...standard, tvSizes: ["Samsung Frame"], aboveFireplace: "yes" });
  assert.equal(result.requiredPhotos.length, new Set(result.requiredPhotos).size);
  assert.equal(result.requiredPhotos.filter((photo) => photo === "Full wall photo").length, 1);
});

test("UI presentation never renders $89–$89", () => {
  const result = calculateEstimate(standard);
  const presentation = estimatePresentation(result);
  assert.deepEqual(presentation, { label: "Estimated starting price", amount: "$89" });
  assert.doesNotMatch(presentation.amount, /\$89–\$89/);
});
