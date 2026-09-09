import { ImportClientsWizard } from "@/components/import-clients-wizard";

export default function ImportClientsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-charcoal">Import Clients</h1>
      <p className="mt-1 text-sm text-ink">
        Bring your existing clients into Luxora from a CSV file or your phone contacts.
      </p>
      <div className="mt-6">
        <ImportClientsWizard />
      </div>
    </div>
  );
}
