import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import {
  OpenCollaborationLandscape,
  OpenCollaborationLandscapeProps,
} from '../../components/Organization/LandScape';
import { i18n, t } from '../../models/Base/Translation';
import { OrganizationModel } from '../../models/Community/Organization';
import { solidCache } from '../api/base';

export const getServerSideProps = compose<{}, OpenCollaborationLandscapeProps>(
  solidCache,
  translator(i18n),
  async () => {
    const tagMap = await new OrganizationModel().groupAllByTags();

    return { props: JSON.parse(JSON.stringify({ tagMap })) };
  },
);

const LandscapePage: FC<OpenCollaborationLandscapeProps> = observer(props => (
  <Container className="mb-5">
    <PageHead title={t('China_NGO_Landscape')} />

    <h1 className="my-5 text-center">{t('China_NGO_Landscape')}</h1>

    <OpenCollaborationLandscape {...props} />
  </Container>
));

export default LandscapePage;
