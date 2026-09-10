"use client";

import Link from "next/link";
import { useActionState } from "react";
import { formatInTimeZone } from "@/lib/luxora/timezone";
import { formatCents } from "@/lib/luxora/money";
import {
  deleteAppointment,
  recordDepositPayment,
  sendAppointmentConfirmation,
} from "@/lib/luxora/appointments-actions";
import { AppointmentStatusForm } from "@/components/appointment-status-form";
import type { ActionState } from "@/lib/luxora/actions";
import type { CalendarAppointment } from "@/components/calendar-day-grid";

const MESSAGE_STATUS_LABELS: Record<string, string> = {
  sent: "Sent",
  failed: "Failed to send",
  skipped_no_consent: "Skipped — no consent on file",
  provider_not_configured: "Not sent — no provider connected",
};

export function AppointmentDetailModal({
  appointment,
  timezone,
  onClose,
}: {
  appointment: CalendarAppointment;
  timezone: string;
  onClose: () => void;
}) {
  const [paymentState, paymentAction, paymentPending] = useActionState<ActionState, FormData>(
    recordDepositPayment,
    null,
  );

  const remainingCents = Math.max(0, appointment.depositAmountCents - appointment.depositPaidCents);
  const confirmationSent = appointment.messages.some((m) => m.status === "sent");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-charcoal">{appointment.client?.full_name ?? "Client"}</h2>
            <p className="text-sm text-ink/60">
              {formatInTimeZone(new Date(appointment.startAt), timezone, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {formatInTimeZone(new Date(appointment.startAt), timezone, { hour: "numeric", minute: "2-digit" })}–
              {formatInTimeZone(new Date(appointment.endAt), timezone, { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <button onClick={onClose} className="text-sm text-ink/50 hover:text-charcoal" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {appointment.services.map((s) => (
            <span
              key={s.name}
              className="rounded-full px-2 py-0.5 text-xs text-charcoal"
              style={{ backgroundColor: `${s.color}33` }}
            >
              {s.name}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 items-center gap-3 text-sm">
          <p className="text-ink/60">Status</p>
          <div className="justify-self-end">
            <AppointmentStatusForm appointmentId={appointment.id} currentStatus={appointment.status} />
          </div>
        </div>

        {appointment.notes ? (
          <div className="mt-4 rounded-sm border border-border bg-cream-deep p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Notes</p>
            <p className="mt-1 text-sm text-charcoal">{appointment.notes}</p>
          </div>
        ) : null}

        <div className="mt-4 rounded-sm border border-border p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Confirmation</p>
            <form
              action={sendAppointmentConfirmation}
              onSubmit={() => {
                onClose();
              }}
            >
              <input type="hidden" name="appointmentId" value={appointment.id} />
              <button type="submit" className="text-xs font-medium text-gold-deep underline underline-offset-2">
                Send confirmation
              </button>
            </form>
          </div>
          <p className="mt-1 text-sm text-charcoal">
            {confirmationSent ? "A confirmation message has been sent." : "No confirmation message sent yet."}
          </p>
          {appointment.messages.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {appointment.messages.map((m) => (
                <li key={m.id} className="text-xs text-ink/60">
                  <span className="uppercase">{m.channel}</span> ·{" "}
                  {new Date(m.createdAt).toLocaleString()} — {MESSAGE_STATUS_LABELS[m.status] ?? m.status}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {appointment.depositAmountCents > 0 ? (
          <div className="mt-4 rounded-sm border border-border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Deposit</p>
            <div className="mt-1 grid grid-cols-2 gap-1 text-sm">
              <p className="text-ink/60">Required</p>
              <p className="text-right text-charcoal">{formatCents(appointment.depositAmountCents)}</p>
              <p className="text-ink/60">Paid</p>
              <p className="text-right text-charcoal">{formatCents(appointment.depositPaidCents)}</p>
              <p className="font-medium text-ink/60">Remaining</p>
              <p className="text-right font-medium text-charcoal">{formatCents(remainingCents)}</p>
            </div>

            {remainingCents > 0 ? (
              <form action={paymentAction} className="mt-3 flex flex-wrap items-end gap-2">
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <div className="flex flex-col gap-1">
                  <label htmlFor="amount" className="text-xs text-ink/60">
                    Amount
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={(remainingCents / 100).toFixed(2)}
                    className="w-24 rounded-sm border border-border px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="method" className="text-xs text-ink/60">
                    Method
                  </label>
                  <select id="method" name="method" defaultValue="cash" className="rounded-sm border border-border px-2 py-1.5 text-sm">
                    <option value="cash">Cash</option>
                    <option value="zelle">Zelle</option>
                    <option value="cash_app">Cash App</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={paymentPending}
                  className="rounded-sm bg-charcoal px-3 py-1.5 text-sm font-medium text-white hover:bg-charcoal-soft disabled:opacity-60"
                >
                  {paymentPending ? "Saving…" : "Record payment"}
                </button>
                {paymentState?.error ? <p className="w-full text-xs text-danger">{paymentState.error}</p> : null}
              </form>
            ) : (
              <p className="mt-2 text-sm text-charcoal">Deposit paid in full.</p>
            )}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/calendar/${appointment.id}/edit`}
              className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-charcoal hover:border-gold-deep"
            >
              Edit
            </Link>
            <Link
              href={`/dashboard/checkout/${appointment.id}`}
              className="rounded-sm bg-gold-deep px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
          <form
            action={deleteAppointment}
            onSubmit={(e) => {
              if (!window.confirm("Delete this appointment? This cannot be undone.")) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <button type="submit" className="rounded-sm border border-danger px-4 py-2 text-sm font-medium text-danger hover:bg-danger/5">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
