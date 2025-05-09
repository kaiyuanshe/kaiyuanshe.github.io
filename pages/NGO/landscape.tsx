import { observer } from 'mobx-react';
import { compose } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import {
  OpenCollaborationLandscape,
  OpenCollaborationLandscapeProps,
} from '../../components/Organization/LandScape';
import { I18nContext } from '../../models/Base/Translation'; // Added
import { OrganizationModel } from '../../models/Community/Organization';
import { solidCache } from '../api/base';

export const getServerSideProps = compose<{}, OpenCollaborationLandscapeProps>(
  solidCache,
  async () => {
    const tagMap = await new OrganizationModel().groupAllByTags();

    return { props: JSON.parse(JSON.stringify({ tagMap })) };
  },
);

const LandscapePage: FC<OpenCollaborationLandscapeProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="mb-5">
      <PageHead title={t('China_NGO_Landscape')} />

      <h1 className="my-5 text-center">{t('China_NGO_Landscape')}</h1>

      <OpenCollaborationLandscape {...props} />
    </Container>
  );
});
export default LandscapePage;
