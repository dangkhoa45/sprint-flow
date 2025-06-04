import { redirect } from "next/navigation";
import { getCurrentUser } from "../hooks/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user?.role) return redirect("/login");
}
