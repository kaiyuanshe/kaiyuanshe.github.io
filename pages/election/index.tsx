import { observer } from 'mobx-react';
import Link from 'next/link';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

const ElectionPage: FC = observer(() => (
  <Container className="my-5">
    <PageHead title={t('general_election')} />
    <h1 className="text-center my-5">{t('general_election')}</h1>

    <ol className="list-inline d-flex flex-wrap justify-content-between">
      {Array.from(
        { length: new Date().getFullYear() + 1 - 2014 },
        (_, index) => (
          <li key={index} className="list-inline-item border rounded">
            <Link
              className="text-decoration-none d-inline-block p-3"
              href={`/election/${2014 + index}`}
            >
              {2014 + index}
            </Link>
          </li>
        ),
      )}
    </ol>
  </Container>
));

export default ElectionPage;
