export const API_HOST = process.env.API_HOST || "http://localhost:8005";
export const FILE_HOST = process.env.FILE_HOST || "http://localhost:8005";

export const INTERNAL_API_HOST = process.env.INTERNAL_API_HOST || API_HOST;
export const INTERNAL_FILE_HOST = process.env.INTERNAL_FILE_HOST || FILE_HOST;

export const INCLUDED_MODULES = process.env.NEXT_PUBLIC_INCLUDED_MODULES?.split(",");

export const ALLOW_DOWNLOAD_PROJECT_OUTPUT = Boolean(
  +(process.env.NEXT_PUBLIC_ALLOW_DOWNLOAD_PROJECT_OUTPUT ?? 0),
);

export const ALLOW_EXPORT_MODELS = Boolean(
  +(process.env.NEXT_PUBLIC_ALLOW_EXPORT_MODELS ?? 0),
);

export const ALLOW_DELETE_MODELS = Boolean(
  +(process.env.NEXT_PUBLIC_ALLOW_DELETE_MODELS ?? 0),
);

export const clientConfig = {
  INTERNAL_API_HOST,
  INTERNAL_FILE_HOST,
  API_HOST,
  FILE_HOST,
};
