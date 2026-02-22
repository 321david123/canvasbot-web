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

  const createdAt = new Date(user.created_at);
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const isNewUser = createdAt > fiveMinAgo;

  return (
    <DashboardWrapper userName={name} isNewUser={isNewUser}>
      {children}
    </DashboardWrapper>
  );
}
