import { Resend } from "resend";

export const runtime = "nodejs";

const recipient = "Apextvmountla@gmail.com";
const maximumImages = 5;
const maximumImageBytes = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function escapeHtml(text: string) {
  return text.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured.");
    return Response.json({ error: "Quote requests are temporarily unavailable." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const fields = {
      name: value(formData, "name"),
      phone: value(formData, "phone"),
      email: value(formData, "email"),
      zip: value(formData, "zip"),
      tvSize: value(formData, "tvSize"),
      wallType: value(formData, "wallType"),
      mountAvailable: value(formData, "mountAvailable"),
      wireConcealment: value(formData, "wireConcealment"),
      preferredDate: value(formData, "preferredDate") || "Not specified",
      notes: value(formData, "notes") || "Not provided",
    };

    const requiredValues = [fields.name, fields.phone, fields.email, fields.zip, fields.tvSize, fields.wallType, fields.mountAvailable, fields.wireConcealment];
    if (requiredValues.some((field) => !field)) {
      return Response.json({ error: "Please complete all required quote fields." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(fields.email) || fields.phone.length < 7 || !/^[0-9A-Za-z -]{3,12}$/.test(fields.zip)) {
      return Response.json({ error: "Please provide a valid email, phone number, and ZIP code." }, { status: 400 });
    }

    const images = formData.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (images.length > maximumImages) {
      return Response.json({ error: `Please upload no more than ${maximumImages} images.` }, { status: 400 });
    }

    for (const image of images) {
      if (!acceptedImageTypes.has(image.type) || image.size > maximumImageBytes) {
        return Response.json({ error: "Photos must be JPG, PNG, or WebP files under 5 MB each." }, { status: 400 });
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const rows = [
      ["Full name", fields.name], ["Phone", fields.phone], ["Email", fields.email], ["ZIP code", fields.zip],
      ["TV size", fields.tvSize], ["Wall type", fields.wallType], ["Mount available", fields.mountAvailable],
      ["Wire concealment", fields.wireConcealment], ["Preferred date", fields.preferredDate], ["Project notes", fields.notes],
    ];
    const text = ["New Apex TV Mounting quote request", "", ...rows.map(([label, field]) => `${label}: ${field}`), "", `Attached images: ${images.length}`].join("\n");
    const html = `<h1>New Apex TV Mounting quote request</h1><table>${rows.map(([label, field]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(field).replace(/\n/g, "<br />")}</td></tr>`).join("")}</table><p><strong>Attached images:</strong> ${images.length}</p>`;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Apex TV Mounting <onboarding@resend.dev>",
      to: [recipient],
      replyTo: fields.email,
      subject: `Quote request from ${fields.name}`,
      text,
      html,
      attachments: await Promise.all(images.map(async (image) => ({ filename: image.name, content: Buffer.from(await image.arrayBuffer()).toString("base64") }))),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "We could not send your request. Please call or email us directly." }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Quote request error:", error);
    return Response.json({ error: "We could not send your request. Please try again or contact us directly." }, { status: 500 });
  }
}
