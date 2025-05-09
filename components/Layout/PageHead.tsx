import { observer } from 'mobx-react';
import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';
import { useContext } from 'react';

import { I18nContext } from '../../models/Base/Translation';
import { Summary } from '../../utility/configuration';

export type PageHeadProps = PropsWithChildren<Partial<Record<'title' | 'description', string>>>;

export const PageHead: FC<PageHeadProps> = observer(
  ({ title = '', description = Summary, children }) => {
    const { t } = useContext(I18nContext);

    return (
      <Head>
        <title>{`${title ? `${title} - ` : ''}${t('KaiYuanShe')}`}</title>

        {description && <meta name="description" content={description} />}

        {children}
      </Head>
    );
  },
);
