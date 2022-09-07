import { config } from '@amap/amap-react';

config.key = process.env.NEXT_PUBLIC_AMAP_KEY!;

if (typeof window !== 'undefined')
  // @ts-ignore
  window._AMapSecurityConfig = {
    securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECRET,
  };
