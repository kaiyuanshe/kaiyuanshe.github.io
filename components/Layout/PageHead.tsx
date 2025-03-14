import { observer } from 'mobx-react';
import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';

import { t } from '../../models/Base/Translation';

export type PageHeadProps = PropsWithChildren<
  Partial<Record<'title' | 'description', string>>
>;

const Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY;

export const PageHead: FC<PageHeadProps> = observer(
  ({ title, description = Summary, children }) => (
    <Head>
      <title>{`${title ? `${title} - ` : ''}${t('KaiYuanShe')}`}</title>

      {description && <meta name="description" content={description} />}

      {children}
    </Head>
  ),
);
