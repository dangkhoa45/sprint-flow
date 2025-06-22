/* eslint-disable @typescript-eslint/no-explicit-any */
export function jsonForm<T extends Record<string, unknown>>(
  form: HTMLFormElement
) {
  const formData = new FormData(form);
  const jsonData = {} as Record<string, unknown>;
  formData.forEach((value, key) => (jsonData[key] = value));
  return jsonData as T;
}

export function json2Form(data: any) {
  const formData = new FormData();
  const formAppend = (keys: string[], value: any) => {
    if (typeof value == 'object') {
      for (const key in value) {
        formAppend([...keys, key], value[key]);
      }
    } else {
      formData.append(
        keys.map((k, i) => (i == 0 ? k : `[${k}]`)).join(''),
        value
      );
    }
  };
  for (const key in data) {
    formAppend([key], data[key]);
  }
  return formData;
}
