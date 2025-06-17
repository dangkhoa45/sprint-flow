"use server";

import { cookies, headers } from "next/headers";
import { INTERNAL_API_HOST } from "../config/env";
import { LoginApiResponse } from "../types/login";
import { jsonToBase64 } from "../utils/encoding";
import { log } from "../utils/logger";

export async function apiLogin(formData: FormData): Promise<LoginApiResponse> {
  const forwardIP = (await headers()).get("x-forwarded-for");
  const ua = (await headers()).get("user-agent");
  const host = (await headers()).get("host");
  const isRemember = formData.get("remember");

  const expiresDate = !isRemember ? undefined : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    const response = await fetch(`${INTERNAL_API_HOST}/api/auth/login`, {
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
    });

    log(`LOGIN >> ${formData.get("username")}: ${response.status} ${response.statusText}`);
    
    const json = await response.json();

    if (response.ok && json.accessToken) {
      const cookieStore = cookies();
      
      console.log('🍪 Setting cookies for host:', host);
      console.log('🔑 Access token:', json.accessToken.substring(0, 20) + '...');
      
      if (isRemember) {
        (await cookieStore).set(`${host}:re`, `${isRemember}`, {
          httpOnly: true,
          expires: expiresDate,
        });
      }
      (await cookieStore).set(`${host}:at`, json.accessToken, {
        httpOnly: true,
        expires: expiresDate,
      });
      (await cookieStore).set(`${host}:rt`, json.refreshToken, {
        httpOnly: true,
        expires: expiresDate,
      });
      (await cookieStore).set(`${host}:ut`, jsonToBase64(json.profile), {
        httpOnly: true,
        expires: expiresDate,
      });
      
      console.log('✅ Cookies set successfully');
      
      // Return user data instead of redirecting
      return {
        success: true,
        user: json.profile,
        accessToken: json.accessToken,
      };
    } else {
      return {
        success: false,
        error: json.message || "Đăng nhập thất bại",
      };
    }
  } catch (error) {
    console.error("Login API error:", error);
    return {
      success: false,
      error: "Không thể kết nối đến server. Vui lòng thử lại sau.",
    };
  }
}
