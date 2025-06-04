"use server";

import { cookies, headers } from "next/headers";
import { User } from "../types/user";
import { jsonFromBase64 } from "../utils/encoding";

export async function getCurrentUser() {
  const host = (await headers()).get("host");
  const userToken = (await cookies()).get(`${host}:ut`)?.value;
  return userToken ? jsonFromBase64<User>(userToken) : undefined;
}
