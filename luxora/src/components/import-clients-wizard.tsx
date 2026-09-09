"use client";

import { useState } from "react";
import Link from "next/link";
import Papa from "papaparse";

type PendingRow = { full_name: string; phone: string; email: string; birthday: string };
type ImportResult = {
  imported: number;
  duplicates: { row: { full_name: string }; existing: { id: string; full_name: string } }[];
};

type ContactsNavigator = Navigator & {
  contacts?: {
    select: (
      properties: string[],
      options?: { multiple?: boolean },
    ) => Promise<{ name?: string[]; tel?: string[]; email?: string[] }[]>;
  };
};

const FIELD_OPTIONS = [
  { value: "", label: "— Don't import —" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "fullName", label: "Full Name" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "birthday", label: "Birthday" },
];

export function ImportClientsWizard() {
  const [step, setStep] = useState<"choose" | "map" | "preview" | "done">("choose");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [pendingRows, setPendingRows] = useState<PendingRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contactsSupported =
    typeof navigator !== "undefined" && !!(navigator as ContactsNavigator).contacts?.select;

  function handleFile(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvHeaders(results.meta.fields ?? []);
        setCsvRows(results.data);
        setStep("map");
      },
    });
  }

  function buildPreviewFromMapping() {
    const rows: PendingRow[] = csvRows.map((row) => {
      const get = (field: string) => {
        const col = Object.keys(mapping).find((c) => mapping[c] === field);
        return col ? (row[col] ?? "").trim() : "";
      };
      const first = get("firstName");
      const last = get("lastName");
      const full = get("fullName");
      return {
        full_name: full || [first, last].filter(Boolean).join(" "),
        phone: get("phone"),
        email: get("email"),
        birthday: get("birthday"),
      };
    });
    setPendingRows(rows.filter((r) => r.full_name));
    setStep("preview");
  }

  async function handleContactsImport() {
    const contacts = (navigator as ContactsNavigator).contacts;
    if (!contacts) return;
    try {
      const picked = await contacts.select(["name", "tel", "email"], { multiple: true });
      const rows: PendingRow[] = picked
        .map((c) => ({
          full_name: (c.name ?? []).join(" ").trim(),
          phone: c.tel?.[0] ?? "",
          email: c.email?.[0] ?? "",
          birthday: "",
        }))
        .filter((r) => r.full_name);
      setPendingRows(rows);
      setStep("preview");
    } catch {
      // user cancelled the picker — no-op
    }
  }

  async function confirmImport() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/clients/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: pendingRows }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Import failed.");
        return;
      }
      setResult(data);
      setStep("done");
    } catch {
      setError("Import failed. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "choose") {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">Import from CSV</h2>
          <p className="mt-1 text-sm text-ink">Upload a CSV export from your previous system.</p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="mt-4 text-sm text-charcoal"
          />
        </div>

        {contactsSupported ? (
          <div className="rounded-sm border border-border bg-white p-6">
            <h2 className="font-display text-lg text-charcoal">Import from Phone Contacts</h2>
            <p className="mt-1 text-sm text-ink">
              You&apos;ll choose exactly which contacts to share — nothing is copied automatically.
            </p>
            <button
              type="button"
              onClick={handleContactsImport}
              className="mt-4 rounded-sm border border-border px-4 py-2 text-sm font-medium text-charcoal transition hover:border-gold-deep"
            >
              Choose Contacts
            </button>
          </div>
        ) : null}

        <p className="text-sm text-ink">
          Prefer to add clients one at a time?{" "}
          <Link href="/dashboard/clients/new" className="font-medium text-gold-deep underline underline-offset-2">
            Add a client manually
          </Link>
          .
        </p>
      </div>
    );
  }

  if (step === "map") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">Map your columns</h2>
        <div className="flex flex-col gap-3">
          {csvHeaders.map((header) => (
            <div key={header} className="grid grid-cols-2 items-center gap-3">
              <span className="text-sm text-charcoal">{header}</span>
              <select
                value={mapping[header] ?? ""}
                onChange={(e) => setMapping((m) => ({ ...m, [header]: e.target.value }))}
                className="rounded-sm border border-border bg-white px-3 py-2 text-sm text-charcoal"
              >
                {FIELD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={buildPreviewFromMapping}
          className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
        >
          Preview Import
        </button>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg text-charcoal">
          Preview — {pendingRows.length} client{pendingRows.length === 1 ? "" : "s"}
        </h2>
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {pendingRows.slice(0, 10).map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 text-charcoal">{r.full_name}</td>
                  <td className="px-4 py-2 text-ink">{r.phone || "—"}</td>
                  <td className="px-4 py-2 text-ink">{r.email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pendingRows.length > 10 ? (
          <p className="text-xs text-ink/60">Showing first 10 of {pendingRows.length}.</p>
        ) : null}

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep("choose")}
            className="rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-charcoal hover:border-gold-deep"
          >
            Back
          </button>
          <button
            type="button"
            onClick={confirmImport}
            disabled={submitting}
            className="rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-60"
          >
            {submitting ? "Importing…" : `Import ${pendingRows.length} Client${pendingRows.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-lg text-charcoal">Import complete</h2>
      <p className="text-sm text-charcoal">{result?.imported ?? 0} client(s) imported.</p>

      {result && result.duplicates.length > 0 ? (
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-sm font-medium text-charcoal">
            {result.duplicates.length} possible duplicate{result.duplicates.length === 1 ? "" : "s"} skipped
          </p>
          <p className="mt-1 text-xs text-ink">
            These matched an existing client by phone or email — nothing was merged automatically.
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {result.duplicates.map((d, i) => (
              <li key={i} className="text-ink">
                {d.row.full_name} → matches{" "}
                <Link
                  href={`/dashboard/clients/${d.existing.id}`}
                  className="font-medium text-gold-deep underline underline-offset-2"
                >
                  {d.existing.full_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link
        href="/dashboard/clients"
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
      >
        View Clients
      </Link>
    </div>
  );
}
