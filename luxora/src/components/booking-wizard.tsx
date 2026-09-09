"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/luxora/money";

type ServiceOption = {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  deposit_required: boolean;
};
type StaffOption = { id: string; full_name: string; title: string | null };
type StaffServiceRow = { staff_id: string; service_id: string };
type FormFieldRow = {
  id: string;
  label: string;
  field_type: string;
  options: string[] | null;
  required: boolean;
  sort_order: number;
};
export type FormOption = {
  id: string;
  name: string;
  service_id: string | null;
  trigger: string;
  form_fields: FormFieldRow[];
};

type Step = "services" | "staff" | "date" | "time" | "info" | "review" | "done";

type Slot = { time: string; staffId: string };
type ClientMatch = { id: string; display_name: string; total_visits: number };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingWizard({
  slug,
  services,
  staff,
  staffServices,
  forms,
}: {
  slug: string;
  services: ServiceOption[];
  staff: StaffOption[];
  staffServices: StaffServiceRow[];
  forms: FormOption[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("services");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [matchedClient, setMatchedClient] = useState<ClientMatch | null>(null);
  const [matchConfirmed, setMatchConfirmed] = useState<boolean | null>(null);
  const [checkingMatch, setCheckingMatch] = useState(false);

  const [formAnswers, setFormAnswers] = useState<Record<string, Record<string, string>>>({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eligibleStaff = useMemo(() => {
    if (selectedServiceIds.length === 0) return staff;
    return staff.filter((s) =>
      selectedServiceIds.every((sid) => staffServices.some((r) => r.staff_id === s.id && r.service_id === sid)),
    );
  }, [staff, staffServices, selectedServiceIds]);

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalMinutes = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price_cents, 0);
  const anyDepositRequired = selectedServices.some((s) => s.deposit_required);

  const isFirstVisit = matchConfirmed === true ? (matchedClient?.total_visits ?? 0) === 0 : true;
  const applicableForms = forms.filter(
    (f) =>
      (f.service_id === null || selectedServiceIds.includes(f.service_id)) &&
      (f.trigger === "every_appointment" || (f.trigger === "first_visit_only" && isFirstVisit)),
  );

  async function loadSlots(nextDate: string, staffId: string) {
    setLoadingSlots(true);
    setSelectedSlot(null);
    try {
      const qs = new URLSearchParams({
        serviceIds: selectedServiceIds.join(","),
        date: nextDate,
      });
      if (staffId !== "any") qs.set("staffId", staffId);
      const res = await fetch(`/api/public/${slug}/availability?${qs.toString()}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
      setLocationId(data.locationId ?? null);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function checkClientMatch() {
    if (!phone && !email) return;
    setCheckingMatch(true);
    try {
      const qs = new URLSearchParams();
      if (phone) qs.set("phone", phone);
      if (email) qs.set("email", email);
      const res = await fetch(`/api/public/${slug}/check-client?${qs.toString()}`);
      const data = await res.json();
      setMatchedClient(data.match ?? null);
      setMatchConfirmed(data.match ? null : true);
    } finally {
      setCheckingMatch(false);
    }
  }

  function updateAnswer(formId: string, fieldId: string, value: string) {
    setFormAnswers((prev) => ({ ...prev, [formId]: { ...prev[formId], [fieldId]: value } }));
  }

  async function submitBooking() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/${slug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceIds: selectedServiceIds,
          staffId: selectedSlot?.staffId,
          locationId,
          date,
          time: selectedSlot?.time,
          clientId: matchConfirmed === true ? matchedClient?.id : undefined,
          newClient:
            matchConfirmed === true
              ? undefined
              : { fullName, phone, email },
          notes,
          formSubmissions: applicableForms.map((f) => ({
            form_id: f.id,
            answers: formAnswers[f.id] ?? {},
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not complete booking.");
        if (res.status === 409) {
          setStep("time");
          loadSlots(date, selectedStaffId);
        }
        return;
      }
      const params = new URLSearchParams({
        date,
        time: selectedSlot?.time ?? "",
        services: selectedServices.map((s) => s.name).join(", "),
      });
      router.push(`/b/${slug}/book/confirmed?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "services") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">1. Select Service</h2>
        <div className="flex flex-col gap-2">
          {services.map((s) => (
            <label key={s.id} className="flex items-center justify-between rounded-sm border border-border bg-white p-3 text-sm">
              <span className="flex items-center gap-2 text-charcoal">
                <input
                  type="checkbox"
                  checked={selectedServiceIds.includes(s.id)}
                  onChange={(e) =>
                    setSelectedServiceIds((prev) =>
                      e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id),
                    )
                  }
                  className="h-4 w-4 accent-gold-deep"
                />
                {s.name} · {s.duration_minutes} min
              </span>
              <span className="text-ink">{formatCents(s.price_cents)}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={selectedServiceIds.length === 0}
          onClick={() => setStep("staff")}
          className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === "staff") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">2. Select Professional</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 rounded-sm border border-border bg-white p-3 text-sm text-charcoal">
            <input
              type="radio"
              name="staff"
              checked={selectedStaffId === "any"}
              onChange={() => setSelectedStaffId("any")}
              className="h-4 w-4 accent-gold-deep"
            />
            Any Available
          </label>
          {eligibleStaff.map((s) => (
            <label key={s.id} className="flex items-center gap-2 rounded-sm border border-border bg-white p-3 text-sm text-charcoal">
              <input
                type="radio"
                name="staff"
                checked={selectedStaffId === s.id}
                onChange={() => setSelectedStaffId(s.id)}
                className="h-4 w-4 accent-gold-deep"
              />
              {s.full_name}
              {s.title ? ` — ${s.title}` : ""}
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setStep("services")} className="rounded-sm border border-border px-5 py-2.5 text-sm text-charcoal">
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("date");
              loadSlots(date, selectedStaffId);
            }}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal-soft"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "date" || step === "time") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">3. Select Date &amp; Time</h2>
        <input
          type="date"
          value={date}
          min={todayStr()}
          onChange={(e) => {
            setDate(e.target.value);
            loadSlots(e.target.value, selectedStaffId);
          }}
          className="w-fit rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal"
        />

        {loadingSlots ? (
          <p className="text-sm text-ink">Loading available times…</p>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-sm border px-3 py-2 text-sm ${
                  selectedSlot?.time === slot.time
                    ? "border-gold-deep bg-cream-deep text-charcoal"
                    : "border-border bg-white text-charcoal hover:border-gold-deep"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink">No availability on this date. Try another day.</p>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep("staff")} className="rounded-sm border border-border px-5 py-2.5 text-sm text-charcoal">
            Back
          </button>
          <button
            type="button"
            disabled={!selectedSlot}
            onClick={() => setStep("info")}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal-soft disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "info") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">4. Your Information</h2>
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal"
        />
        <input
          placeholder="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={checkClientMatch}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal"
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={checkClientMatch}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal"
        />

        {checkingMatch ? <p className="text-sm text-ink">Checking…</p> : null}

        {matchedClient && matchConfirmed === null ? (
          <div className="rounded-sm border border-gold-deep bg-cream-deep p-4">
            <p className="text-sm text-charcoal">
              Welcome back, {matchedClient.display_name} 👋 <br />
              We found an existing profile. Is this you?
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setMatchConfirmed(true)}
                className="rounded-sm bg-charcoal px-4 py-1.5 text-sm text-white"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setMatchConfirmed(false)}
                className="rounded-sm border border-border px-4 py-1.5 text-sm text-charcoal"
              >
                No
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep("time")} className="rounded-sm border border-border px-5 py-2.5 text-sm text-charcoal">
            Back
          </button>
          <button
            type="button"
            disabled={!fullName || (!phone && !email) || (matchedClient !== null && matchConfirmed === null)}
            onClick={() => setStep("review")}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal-soft disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">5. Confirm Appointment</h2>

        <div className="rounded-sm border border-border bg-white p-4 text-sm">
          <p className="text-charcoal">{selectedServices.map((s) => s.name).join(", ")}</p>
          <p className="mt-1 text-ink">
            {date} at {selectedSlot?.time} · {totalMinutes} min
          </p>
          <p className="mt-1 font-medium text-charcoal">{formatCents(totalPrice)}</p>
        </div>

        {anyDepositRequired ? (
          <p className="rounded-sm border border-border bg-cream-deep p-3 text-xs text-charcoal">
            This service requires a deposit. Online deposit collection isn&apos;t enabled yet — the
            business will follow up with you directly about it.
          </p>
        ) : null}

        {applicableForms.map((form) => (
          <div key={form.id} className="rounded-sm border border-border bg-white p-4">
            <p className="text-sm font-medium text-charcoal">{form.name}</p>
            <div className="mt-3 flex flex-col gap-3">
              {[...form.form_fields]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((field) => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <label className="text-sm text-charcoal">
                      {field.label}
                      {field.required ? <span className="text-gold-deep"> *</span> : null}
                    </label>
                    {field.field_type === "textarea" ? (
                      <textarea
                        required={field.required}
                        onChange={(e) => updateAnswer(form.id, field.id, e.target.value)}
                        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
                      />
                    ) : field.field_type === "checkbox" || field.field_type === "consent" ? (
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          required={field.required}
                          onChange={(e) => updateAnswer(form.id, field.id, e.target.checked ? "yes" : "")}
                          className="h-4 w-4 accent-gold-deep"
                        />
                        I agree
                      </label>
                    ) : field.field_type === "multiple_choice" ? (
                      <select
                        required={field.required}
                        onChange={(e) => updateAnswer(form.id, field.id, e.target.value)}
                        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
                      >
                        <option value="">—</option>
                        {(field.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.field_type === "date" ? (
                      <input
                        type="date"
                        required={field.required}
                        onChange={(e) => updateAnswer(form.id, field.id, e.target.value)}
                        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
                      />
                    ) : field.field_type === "signature" ? (
                      <input
                        placeholder="Type your full name to sign"
                        required={field.required}
                        onChange={(e) => updateAnswer(form.id, field.id, e.target.value)}
                        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
                      />
                    ) : (
                      <input
                        type="text"
                        required={field.required}
                        onChange={(e) => updateAnswer(form.id, field.id, e.target.value)}
                        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}

        <textarea
          placeholder="Notes for the business (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal"
        />

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep("info")} className="rounded-sm border border-border px-5 py-2.5 text-sm text-charcoal">
            Back
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={submitBooking}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal-soft disabled:opacity-60"
          >
            {submitting ? "Booking…" : "Confirm Appointment"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
