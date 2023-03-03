import { FC } from 'react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';

import PageHead from '../../components/PageHead';
import { MemberStatic } from '../../components/Member/Static';
import { withTranslation } from '../api/base';
import { i18n } from '../../models/Translation';
import { MemberModel } from '../../models/Member';
import { AnchorJump } from '../../components/data';

export const getServerSideProps = withTranslation(async () => {
  const data = await new MemberModel().getStatic();

  return {
    props: { membersStaticData: JSON.parse(JSON.stringify(data)) }, // will be passed to the page component as props
  };
});

const MembersPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ membersStaticData }) => {
    const { groupMap, otherGroupList } = membersStaticData;
    const { t } = i18n;
    const { query } = useRouter();
    AnchorJump(query.anchor as string);

    return (
      <Container className="my-4">
        <PageHead title={t('our_members')} />

        <h1 className="w-100 my-5 text-center">{t('our_members')}</h1>

        <MemberStatic
          membersGroup={groupMap}
          otherMembersList={otherGroupList}
        />
      </Container>
    );
  });

export default MembersPage;
