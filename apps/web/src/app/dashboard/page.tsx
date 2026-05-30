import { auth } from "@darasa-lako/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect('/login');
  } else {
    return redirect('/dashboard/overview');
  }
}
