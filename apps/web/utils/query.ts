export type ParamValue = string | number | boolean | undefined;
export type ParamValueList = (string | number)[];
export type ParamObject = Record<string, ParamValue | ParamValueList>;

export function buildQueryString(options?: ParamObject): string {
  if (!options) return '';

  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(`${key}[]`, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  return `?${searchParams.toString()}`;
}

export function extractQueryParams(
  pathOrParamString: string,
  defaultValue?: Partial<ParamObject>
) {
  const params: ParamObject = {};
  const paramString = pathOrParamString.includes('?')
    ? pathOrParamString.split('?')[1]
    : pathOrParamString;
  const searchParams = new URLSearchParams(paramString);

  searchParams.forEach((value, key) => {
    const parsedValue = isNaN(Number(value)) ? value : Number(value);
    if (!params[key] || !Array.isArray(params[key])) {
      params[key] = parsedValue;
    } else {
      params[key].push(parsedValue);
    }
  });

  return { ...defaultValue, ...params };
}

export function combineQueryParams(
  paramString: string,
  replacement: ParamObject
) {
  const searchParams = new URLSearchParams(paramString);

  Object.entries(replacement).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      searchParams.delete(key);
    } else if (Array.isArray(value)) {
      searchParams.delete(key);
      value.forEach(item => searchParams.append(`${key}[]`, String(item)));
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}
