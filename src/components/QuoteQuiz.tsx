"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Answers = Record<string, string | string[]>;
const steps = [
  "TVs",
  "TV sizes",
  "Wall",
  "Mount",
  "Mount ready",
  "Wires",
  "Fireplace",
  "Soundbar",
  "ZIP",
  "Date",
  "Review",
  "Contact",
  "Photos",
];
const options: Record<string, Array<[string, string]>> = {
  tvCount: [
    ["1", "1 TV"],
    ["2", "2 TVs"],
    ["3", "3 TVs"],
    ["4", "4+ TVs"],
  ],
  wallType: [
    ["drywall", "Drywall / wood studs"],
    ["metal-studs", "Metal studs"],
    ["plaster", "Plaster"],
    ["brick", "Brick"],
    ["concrete", "Concrete"],
    ["tile-stone", "Tile, stone, marble, or specialty wall"],
  ],
  mountType: [
    ["fixed", "Fixed"],
    ["tilting", "Tilting"],
    ["full-motion", "Full-motion"],
  ],
  hasMount: [
    ["yes", "Yes, I have a compatible mount"],
    ["no", "No, I need Apex to supply one"],
    ["not-sure", "Not sure"],
  ],
  wireConcealment: [
    ["none", "No concealment"],
    ["raceway", "External raceway"],
    ["in-wall", "In-wall concealment"],
  ],
  aboveFireplace: [
    ["no", "No"],
    ["yes", "Yes, above a fireplace"],
  ],
  soundbar: [
    ["none", "No additional device"],
    ["wall", "Wall-mounted soundbar"],
    ["mount", "Soundbar attached to TV mount"],
  ],
};
const sizes: Array<[string, string]> = [
  ["under-55", "Under 55 inches"],
  ["55-64", "55–64 inches"],
  ["65-74", "65–74 inches"],
  ["75-84", "75–84 inches"],
  ["85+", "85 inches or larger"],
  ["98-100", "98–100 inches"],
  ["Samsung Frame", "Samsung Frame TV"],
];
function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function")
    window.gtag("event", event, params);
}

export function QuoteQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [estimate, setEstimate] = useState<{
    low: number | null;
    high: number | null;
    needsReview: boolean;
    notes: string[];
  } | null>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const started = useRef(false);
  useEffect(() => { if (!started.current) { track("quiz_start"); started.current = true; } }, []);
  const tvCount = Number(answers.tvCount || 1);
  const canContinue = useMemo(
    () =>
      step === 1
        ? Array.isArray(answers.tvSizes) && answers.tvSizes.length === tvCount
        : step === 8
          ? Boolean(answers.zip)
          : step === 9
            ? Boolean(answers.preferredDate)
            : step === 11
              ? ["name", "phone", "email"].every((key) => Boolean(answers[key]))
              : step === 10 || step === 12 ||
                Boolean(
                  answers[
                    [
                      "tvCount",
                      "tvSizes",
                      "wallType",
                      "mountType",
                      "hasMount",
                      "wireConcealment",
                      "aboveFireplace",
                      "soundbar",
                    ][step]
                  ],
                ),
    [answers, step, tvCount],
  );
  const next = async () => {
    if (!canContinue) return;
    track("quiz_step_complete", {
      step_number: step + 1,
      step_name: steps[step],
    });
    if (step === 7) {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvSizes: answers.tvSizes,
          wallType: answers.wallType,
          mountType: answers.mountType,
          hasMount: answers.hasMount,
          wireConcealment: answers.wireConcealment,
          aboveFireplace: answers.aboveFireplace,
          soundbar: answers.soundbar,
        }),
      });
      const result = await response.json();
      setEstimate(result);
      track("estimate_viewed", {
        estimate_type: result.needsReview ? "photo_review" : "range",
      });
    }
    setStep((value) => value + 1);
  };
  const submit = async () => {
    setStatus("sending");
    const data = new FormData();
    Object.entries(answers).forEach(([key, value]) => {
      if (key === "photos" && Array.isArray(value))
        value.forEach((file) => data.append("photos", file));
      else data.append(key, Array.isArray(value) ? value.join(", ") : value);
    });
    data.set("tvSize", (answers.tvSizes as string[]).join(", "));
    data.set("mountAvailable", String(answers.hasMount));
    data.set(
      "preferredDate",
      `${answers.preferredDate || "Not specified"} ${answers.preferredTime || ""}`.trim(),
    );
    data.set(
      "notes",
      `Quiz details: mount ${answers.mountType}; fireplace ${answers.aboveFireplace}; soundbar ${answers.soundbar}; wire concealment ${answers.wireConcealment}.`,
    );
    const response = await fetch("/api/quote", { method: "POST", body: data });
    if (!response.ok) {
      setStatus("error");
      setError(
        (await response.json()).error || "We could not send your request.",
      );
      return;
    }
    track("quote_submitted", { submission_type: "quiz" });
    setStatus("success");
  };
  if (status === "success")
    return (
      <div className="quiz-confirmation">
        <p className="eyebrow eyebrow-dark">REQUEST RECEIVED</p>
        <h3>Thank you—we have your project details.</h3>
        <p>
          Final pricing will be confirmed after we review wall conditions,
          photos, TV details, and requested extras. We will follow up; no
          availability has been promised.
        </p>
      </div>
    );
  const choose = (key: string, value: string) =>
    setAnswers((current) => ({ ...current, [key]: value }));
  return (
    <div className="quote-quiz" aria-live="polite">
      <div className="quiz-progress">
        <span>Step {Math.min(step + 1, 12)} of 12</span>
        <div>
          <i style={{ width: `${((step + 1) / 12) * 100}%` }} />
        </div>
      </div>
      <p className="eyebrow eyebrow-dark">YOUR PRELIMINARY QUOTE</p>
      {step === 0 && (
        <Question
          title="How many TVs would you like mounted?"
          optionKey="tvCount"
          choose={choose}
          value={String(answers.tvCount || "")}
          choices={options.tvCount}
        />
      )}
      {step === 1 && (
        <div>
          <h3>What size is each TV?</h3>
          {Array.from({ length: tvCount }, (_, index) => (
            <label className="quiz-select" key={index}>
              TV {index + 1}
              <select
                value={((answers.tvSizes as string[]) || [])[index] || ""}
                onChange={(event) => {
                  const next = [...((answers.tvSizes as string[]) || [])];
                  next[index] = event.target.value;
                  setAnswers({ ...answers, tvSizes: next });
                }}
              >
                <option value="">Select size</option>
                {sizes.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      {step >= 2 && step <= 7 && (
        <Question
          title={
            [
              "What type of wall are we working with?",
              "Which mount style do you prefer?",
              "Do you already have a compatible mount?",
              "How would you like cables handled?",
              "Is this installation above a fireplace?",
              "Would you like a soundbar or device mounted?",
            ][step - 2]
          }
          optionKey={
            [
              "wallType",
              "mountType",
              "hasMount",
              "wireConcealment",
              "aboveFireplace",
              "soundbar",
            ][step - 2]
          }
          choose={choose}
          value={String(
            answers[
              [
                "wallType",
                "mountType",
                "hasMount",
                "wireConcealment",
                "aboveFireplace",
                "soundbar",
              ][step - 2]
            ] || "",
          )}
          choices={
            options[
              [
                "wallType",
                "mountType",
                "hasMount",
                "wireConcealment",
                "aboveFireplace",
                "soundbar",
              ][step - 2]
            ]
          }
        />
      )}
      {step === 8 && (
        <Field
          title="What is the project ZIP code?"
          type="text"
          value={String(answers.zip || "")}
          onChange={(value) => choose("zip", value)}
        />
      )}
      {step === 9 && (
        <div>
          <h3>What date and time do you prefer?</h3>
          <p className="quiz-note">
            This is a preference only. Availability is confirmed by Apex after
            review.
          </p>
          <Field
            title="Preferred date"
            type="date"
            value={String(answers.preferredDate || "")}
            onChange={(value) => choose("preferredDate", value)}
          />
          <label className="quiz-select">
            Preferred time
            <select
              value={String(answers.preferredTime || "")}
              onChange={(event) => choose("preferredTime", event.target.value)}
            >
              <option value="">Choose a time window</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Flexible</option>
            </select>
          </label>
        </div>
      )}
      {step === 10 && estimate && (
        <div><h3>Review your installation</h3><div className="estimate-box"><p>{tvCount} TV{tvCount > 1 ? "s" : ""}: {(answers.tvSizes as string[]).join(", ")}</p><p>Wall: {answers.wallType}; mount: {answers.mountType}; mount available: {answers.hasMount}</p><p>Wires: {answers.wireConcealment}; fireplace: {answers.aboveFireplace}; soundbar: {answers.soundbar}</p><p>Preferred date: {answers.preferredDate} {answers.preferredTime}</p><strong>{estimate.needsReview ? "This installation needs photo review before we can provide a reliable estimate." : estimate.low === estimate.high ? `Starting estimate: $${estimate.low}` : `$${estimate.low}–$${estimate.high} preliminary estimate`}</strong><p>Final pricing is confirmed after reviewing the wall, TV, mount, access, and requested services.</p>{estimate.notes.map((note) => <p key={note}>{note}</p>)}</div><p className="quiz-note">Use Back to edit any answer before continuing.</p></div>
      )}
      {step === 11 && (
        <div>
          <h3>Where should we send your quote?</h3>
          <Field
            title="Full name"
            type="text"
            value={String(answers.name || "")}
            onChange={(value) => choose("name", value)}
          />
          <Field
            title="Phone"
            type="tel"
            value={String(answers.phone || "")}
            onChange={(value) => choose("phone", value)}
          />
          <Field
            title="Email"
            type="email"
            value={String(answers.email || "")}
            onChange={(value) => choose("email", value)}
          />
        </div>
      )}
      {step === 12 && (
        <div>
          <h3>Add project photos (optional)</h3>
          <p className="quiz-note">
            Photos help confirm wall conditions and fireplace or specialty-wall
            requirements. JPG, PNG, or WebP; up to 5 files, 1 MB each.
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) =>
              setAnswers({
                ...answers,
                photos: Array.from(
                  event.target.files || [],
                ) as unknown as string[],
              })
            }
          />
          {estimate && (
            <div className="estimate-box">
              <strong>{estimate.needsReview ? "This installation needs photo review before we can provide a reliable estimate." : estimate.low === estimate.high ? `Starting estimate: $${estimate.low}` : `$${estimate.low}–$${estimate.high} preliminary estimate`}</strong>
              <p>Final pricing is confirmed after reviewing the wall, TV, mount, access, and requested services.</p>
              {estimate.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
            </div>
          )}
        </div>
      )}
      <div className="quiz-actions">
        {step > 0 && (
          <button
            className="button button-outline-dark"
            type="button"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {step < 12 ? (
          <div><button
            className="button button-primary"
            type="button"
            disabled={!canContinue}
            onClick={next}
          >
            Continue
          </button><p className="quiz-note">No obligation. Preferred dates are requests and will be confirmed by Apex.</p></div>
        ) : (
          <button
            className="button button-primary"
            type="button"
            onClick={submit}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send my quote"}
          </button>
        )}
      </div>
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function Question({
  title,
  optionKey,
  choices,
  value,
  choose,
}: {
  title: string;
  optionKey: string;
  choices: Array<[string, string]>;
  value: string;
  choose: (key: string, value: string) => void;
}) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="quiz-options">
        {choices.map(([option, label]) => (
          <button
            key={option}
            type="button"
            className={value === option ? "selected" : ""}
            onClick={() => choose(optionKey, option)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
function Field({
  title,
  type,
  value,
  onChange,
}: {
  title: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="quiz-select">
      {title}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
