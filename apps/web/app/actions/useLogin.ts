"use client";
import useAxios from "axios-hooks";
import { ErrorResponse, LoginPayload, LoginResponse } from "../../types/login";

function useLogin() {
  return useAxios<LoginResponse, LoginPayload, ErrorResponse>(
    {
      url: "http://localhost:3005/api/auth/login",
      method: "POST",
    },
    { manual: true },
  );
}

export default useLogin;
