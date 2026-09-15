import { redirect } from "next/navigation";

export default function PaymentsSettingsRedirectPage() {
  redirect("/dashboard/payments?tab=methods");
}
