import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { ZodiacBar } from '../../components/Base/ZodiacBar';
import { PageHead } from '../../components/Layout/PageHead';
import { t } from '../../models/Base/Translation';

const ElectionPage: FC = observer(() => (
  <Container className="my-5">
    <PageHead title={t('general_election')} />
    <h1 className="text-center my-5">{t('general_election')}</h1>

    <ZodiacBar
      startYear={2014}
      itemOf={year => ({ title: year, link: `/election/${year}` })}
    />
  </Container>
));

export default ElectionPage;
