import { calculateEstimate, type PricingInput } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = await request.json() as PricingInput;
    if (!Array.isArray(input.tvSizes) || !input.tvSizes.length) return Response.json({ error: "Missing installation details." }, { status: 400 });
    return Response.json(calculateEstimate(input));
  } catch { return Response.json({ error: "Unable to calculate an estimate." }, { status: 400 }); }
}
