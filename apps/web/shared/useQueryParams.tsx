import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { combineQueryParams, extractQueryParams, ParamObject } from "../utils/query";

function useQueryParams<T = ParamObject>(
  defaultValue?: Partial<T>,
): [T, (newValue: Partial<T>) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramString = `${searchParams}`;

  const value = useMemo(() => {
    const extractedValue = extractQueryParams(
      paramString,
      defaultValue as Partial<ParamObject>,
    );
    return {
      ...defaultValue,
      ...extractedValue,
    } as T;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramString]);

  const setValue = useCallback(
    (newValue: Partial<T>) => {
      const params = combineQueryParams(paramString, newValue as ParamObject);
      router.push(`?${params}`);
    },
    [router, paramString],
  );

  return [value, setValue];
}

export default useQueryParams;
