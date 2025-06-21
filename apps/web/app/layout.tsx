import "../public/globals.css";
import { cookies, headers } from "next/headers";
import AppProvider from "../provider/AppProvider";
import { User } from "../types/user";
import { jsonFromBase64 } from "../utils/encoding";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host");
  const userToken = (await cookies()).get(`${host}:ut`)?.value;
  const currentUser = userToken ? jsonFromBase64<User>(userToken) : undefined;
  return (
    <html lang="en">
      <body>
        <AppProvider currentUser={currentUser}>{children}</AppProvider>
      </body>
    </html>
  );
}
