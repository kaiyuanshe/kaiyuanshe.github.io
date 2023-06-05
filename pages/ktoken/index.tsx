import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container, Button } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

export const getServerSideProps = withTranslation();

const KTokenPage: FC = observer(() => {
  const { t } = i18n;

  return (
    <>
      <PageHead title={t('china_open_source_landscape')} />

      <Container>
        <header className="d-flex justify-content-between align-items-center">
          <h1 className="my-4">{t('KToken')}</h1>
        </header>

      </Container>
    </>
  );
});

export default KTokenPage;