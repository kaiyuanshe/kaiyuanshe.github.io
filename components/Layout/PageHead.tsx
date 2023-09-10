import { observer } from 'mobx-react';
import Head from 'next/head';
import type { FC } from 'react';

import { i18n } from '../../models/Base/Translation';

export type PageHeadProps = Partial<Record<'title' | 'description', string>>;

const { t } = i18n,
  Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY;

const PageHead: FC<PageHeadProps> = observer(
  ({ title, description = Summary, children }) => (
    <Head>
      <title>
        {title && `${title} - `}
        {t('KaiYuanShe')}
      </title>

      {description && <meta name="description" content={description} />}

      {children}
    </Head>
  ),
);

export default PageHead;
