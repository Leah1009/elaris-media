"use client";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export function CalendarFiltersForm({
  view,
  date,
  locations,
  staff,
  services,
  selected,
}: {
  view: string;
  date: string;
  locations: { id: string; name: string }[];
  staff: { id: string; full_name: string }[];
  services: { id: string; name: string }[];
  selected: { locationId?: string; staffId?: string; serviceId?: string; status?: string };
}) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-center gap-2"
      onChange={(e) => e.currentTarget.requestSubmit()}
    >
      <input type="hidden" name="view" value={view} />
      <input type="hidden" name="date" value={date} />

      {locations.length > 1 ? (
        <select
          name="locationId"
          defaultValue={selected.locationId ?? ""}
          className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal"
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      ) : null}

      <select
        name="staffId"
        defaultValue={selected.staffId ?? ""}
        className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal"
      >
        <option value="">All Staff</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.full_name}
          </option>
        ))}
      </select>

      <select
        name="serviceId"
        defaultValue={selected.serviceId ?? ""}
        className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal"
      >
        <option value="">All Services</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        name="status"
        defaultValue={selected.status ?? ""}
        className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
