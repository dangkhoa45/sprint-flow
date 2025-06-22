export function jsonToBase64<T = unknown>(data: T) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function jsonFromBase64<T = unknown>(data: string) {
  return JSON.parse(Buffer.from(data, 'base64').toString()) as T;
}
