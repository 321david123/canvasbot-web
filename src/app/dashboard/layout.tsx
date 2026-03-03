import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardWrapper } from "./components/dashboard-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Estudiante";

  return <DashboardWrapper userName={name}>{children}</DashboardWrapper>;
}
