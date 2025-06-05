"use server";

import { cookies, headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { INTERNAL_API_HOST } from "../config/env";
import { jsonToBase64 } from "../utils/encoding";
import { log } from "../utils/logger";

export async function apiLogin(formData: FormData) {
  const forwardIP = (await headers()).get("x-forwarded-for");
  const ua = (await headers()).get("user-agent");
  const host = (await headers()).get("host");
  const isRemember = formData.get("remember");

  const expires = !isRemember ? undefined : Date.now() + 7 * 24 * 60 * 60 * 1000;

  return fetch(`${INTERNAL_API_HOST}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
    headers: {
      "content-type": "application/json",
      "x-user-agent": ua ?? "",
      "x-forwarded-for": forwardIP ?? "",
    },
    cache: "no-cache",
  })
    .then((res) => {
      log(`LOGIN >> ${formData.get("username")}: ${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(async (json) => {
      if (json.accessToken) {
        const cookieStore = cookies();
        if (isRemember) {
          (await cookieStore).set(`${host}:re`, `${isRemember}`, {
            httpOnly: true,
            expires,
          });
        }
        (await cookieStore).set(`${host}:at`, json.accessToken, {
          httpOnly: true,
          expires,
        });
        (await cookieStore).set(`${host}:rt`, json.refreshToken, {
          httpOnly: true,
          expires,
        });
        (await cookieStore).set(`${host}:ut`, jsonToBase64(json.profile), {
          httpOnly: true,
          expires,
        });
        redirect("/", RedirectType.replace);
      } else {
        redirect(`/login/?error=${json.message}`, RedirectType.replace);
      }
    });
}
