export const Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY,
  DefaultImage = process.env.NEXT_PUBLIC_LOGO!;

export const isServer = () => typeof window === 'undefined';

export const { VERCEL_URL } = process.env;

export const API_Host = isServer()
  ? VERCEL_URL
    ? `https://${VERCEL_URL}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const CACHE_HOST = process.env.NEXT_PUBLIC_CACHE_HOST!;

export const KYS_SERVICE_HOST = process.env.NEXT_PUBLIC_KYS_SERVICE_HOST;

export const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!;

export const KCC_BASE_ID = process.env.NEXT_PUBLIC_KCC_BASE_ID!;
