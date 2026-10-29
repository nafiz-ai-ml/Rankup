import { redirect } from "next/navigation";

export default function PrivacyRedirectPage() {
  redirect("/rules#privacy");
}

