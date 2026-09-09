import { ServiceForm } from "@/components/service-form";
import { createService } from "@/lib/luxora/services-actions";

export default function NewServicePage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Add Service</h1>
      <div className="mt-6">
        <ServiceForm action={createService} submitLabel="Create Service" />
      </div>
    </div>
  );
}
