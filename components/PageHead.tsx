import type { PropsWithChildren } from 'react';
import Head from 'next/head';

export type PageHeadProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

const Name = process.env.NEXT_PUBLIC_SITE_NAME;

export default function PageHead({
  title,
  description = 'React project scaffold based on TypeScript, Next.js & Bootstrap.',
  children,
}: PageHeadProps) {
  return (
    <Head>
      <title>
        {title}
        {title && ' - '}
        {Name}
      </title>

      {description && <meta name="description" content={description} />}

      {children}
    </Head>
  );
}
