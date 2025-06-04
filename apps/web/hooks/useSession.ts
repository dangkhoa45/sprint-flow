import useAxios from "axios-hooks";
import { ErrorResponse, LoginResponse } from "../types/login";

function useSession() {
  return useAxios<Omit<LoginResponse, "token">, never, ErrorResponse>(
    {
      url: "http://localhost:8005/api/auth/check-session",
      method: "POST",
    },
    {
      useCache: false,
    },
  );
}

export default useSession;
