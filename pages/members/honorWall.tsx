import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { scrollTo } from 'web-utility';

import PageHead from '../../components/PageHead';
import { HonorWallModel } from '../../models/HonorWall';
import { i18n } from '../../models/Translation';
import { withTranslation } from '../api/base';

export const getServerSideProps = withTranslation(async () => {
  const data = await new HonorWallModel().getStatic();
console.log(data)
  return {
    props: { five: "1212"}, // will be passed to the page component as props
  };
});


  const HonorWallPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ five }) => {
    const { t } = i18n;
    return (
      <Container className="my-4">
        <PageHead title={t('honor_wall')} />

        <h1 className="w-100 my-5 text-center">{t('honor_wall')}</h1>
      </Container>
    );
  });
export default HonorWallPage;
