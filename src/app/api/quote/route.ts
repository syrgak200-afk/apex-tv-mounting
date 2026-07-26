import { Resend } from "resend";

export const runtime = "nodejs";

const recipient = "Apextvmountla@gmail.com";
const companyName = "Apex TV Mounting & Installation";
const companyPhone = "(714) 766-1943";
const companyPhoneHref = "+17147661943";
const maximumImages = 5;
const maximumImageBytes = 1024 * 1024;
const maximumTotalImageBytes = 4 * 1024 * 1024;
const duplicateWindowMs = 60_000;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const recentSubmissions = new Map<string, number>();

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function escapeHtml(text: string) {
  return text.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function duplicateKey(email: string, phone: string) {
  return `${email.toLowerCase()}|${phone.replace(/\D/g, "")}`;
}

function cleanDuplicateStore(now: number) {
  for (const [key, timestamp] of recentSubmissions) {
    if (now - timestamp >= duplicateWindowMs) recentSubmissions.delete(key);
  }
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
    if (value(formData, "website")) {
      return Response.json({ success: true });
    }
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
    if (images.length > maximumImages) return Response.json({ error: `Please upload no more than ${maximumImages} images.` }, { status: 400 });
    if (images.reduce((total, image) => total + image.size, 0) > maximumTotalImageBytes) {
      return Response.json({ error: "Project photos must total 4 MB or less." }, { status: 400 });
    }
    for (const image of images) {
      if (!acceptedImageTypes.has(image.type) || image.size > maximumImageBytes) {
        return Response.json({ error: "Photos must be JPG, PNG, or WebP files under 1 MB each." }, { status: 400 });
      }
    }

    const now = Date.now();
    cleanDuplicateStore(now);
    const requestKey = duplicateKey(fields.email, fields.phone);
    if (recentSubmissions.has(requestKey)) {
      return Response.json({ error: "We already received this request. Please wait a minute before submitting again." }, { status: 429 });
    }

    const selectedServices = [
      "TV Mounting",
      fields.wireConcealment === "Yes" ? "Wire Concealment" : "",
      fields.mountAvailable === "No" ? "Mount Consultation" : "",
    ].filter(Boolean);
    const sender = process.env.RESEND_FROM_EMAIL ?? "Apex TV Mounting <onboarding@resend.dev>";
    const resend = new Resend(process.env.RESEND_API_KEY);
    const rows = [
      ["Full name", fields.name], ["Phone", fields.phone], ["Email", fields.email], ["ZIP code", fields.zip],
      ["TV size", fields.tvSize], ["Wall type", fields.wallType], ["Mount available", fields.mountAvailable],
      ["Wire concealment", fields.wireConcealment], ["Preferred date", fields.preferredDate], ["Selected services", selectedServices.join(", ")], ["Project notes", fields.notes],
    ];
    const adminText = ["New Apex TV Mounting quote request", "", ...rows.map(([label, field]) => `${label}: ${field}`), "", `Attached images: ${images.length}`].join("\n");
    const adminHtml = `<h1>New Apex TV Mounting quote request</h1><table>${rows.map(([label, field]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(field).replace(/\n/g, "<br />")}</td></tr>`).join("")}</table><p><strong>Attached images:</strong> ${images.length}</p>`;

    const { error: adminError } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: fields.email,
      subject: `Quote request from ${fields.name}`,
      text: adminText,
      html: adminHtml,
      attachments: await Promise.all(images.map(async (image) => ({ filename: image.name, content: Buffer.from(await image.arrayBuffer()).toString("base64") }))),
    });

    if (adminError) {
      console.error("Admin quote notification failed:", adminError);
      return Response.json({ error: "We could not send your request. Please call or email us directly." }, { status: 502 });
    }

    recentSubmissions.set(requestKey, now);
    const firstName = fields.name.split(/\s+/)[0] || "there";
    const confirmationText = `Hi ${firstName},\n\nThank you for contacting ${companyName}. We received your quote request and will contact you shortly.\n\nYour request:\nPhone: ${fields.phone}\nZIP code: ${fields.zip}\nTV size: ${fields.tvSize}\nWall type: ${fields.wallType}\nPreferred date: ${fields.preferredDate}\nSelected services: ${selectedServices.join(", ")}\n\nQuestions? Call ${companyPhone}.\n\n${companyName}`;
    const confirmationHtml = `<div style="margin:0;background:#f5f2ea;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#13221f"><div style="max-width:560px;margin:0 auto;background:#ffffff"><div style="background:#173c35;color:#ffffff;padding:30px"><div style="font-weight:900;letter-spacing:.14em;font-size:22px">APEX</div><div style="font-size:9px;letter-spacing:.25em;margin-top:6px">TV MOUNTING</div></div><div style="padding:32px"><p style="margin:0 0 16px;color:#60744f;font-weight:700;font-size:11px;letter-spacing:.16em">REQUEST RECEIVED</p><h1 style="font-size:30px;line-height:1.1;margin:0 0 18px">Thank you, ${escapeHtml(firstName)}.</h1><p style="line-height:1.6">We received your quote request for ${companyName} and will contact you shortly.</p><div style="margin:26px 0;background:#f5f2ea;padding:20px"><p style="margin:0 0 12px;font-weight:700">Your request</p><p style="margin:7px 0"><strong>Phone:</strong> ${escapeHtml(fields.phone)}</p><p style="margin:7px 0"><strong>ZIP code:</strong> ${escapeHtml(fields.zip)}</p><p style="margin:7px 0"><strong>TV size:</strong> ${escapeHtml(fields.tvSize)}</p><p style="margin:7px 0"><strong>Wall type:</strong> ${escapeHtml(fields.wallType)}</p><p style="margin:7px 0"><strong>Preferred date:</strong> ${escapeHtml(fields.preferredDate)}</p><p style="margin:7px 0"><strong>Selected services:</strong> ${escapeHtml(selectedServices.join(", "))}</p></div><p style="line-height:1.6">Need to reach us sooner? <a href="tel:${companyPhoneHref}" style="color:#173c35;font-weight:700">${companyPhone}</a></p><p style="margin:26px 0 0;font-weight:700">${companyName}</p></div></div></div>`;

    try {
      const { error: confirmationError } = await resend.emails.send({
        from: sender,
        to: [fields.email],
        subject: "We received your Apex TV Mounting request",
        text: confirmationText,
        html: confirmationHtml,
      });
      if (confirmationError) console.error("Customer confirmation email failed:", confirmationError);
    } catch (error) {
      console.error("Customer confirmation email failed unexpectedly:", error);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Quote request error:", error);
    return Response.json({ error: "We could not send your request. Please try again or contact us directly." }, { status: 500 });
  }
}
