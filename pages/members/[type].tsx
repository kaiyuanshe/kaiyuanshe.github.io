import { FC } from 'react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { MemberStatic } from '../../components/Member/Static';
import { withTranslation } from '../api/base';
import { i18n } from '../../models/Translation';
import { MemberModel} from '../../models/Member';

export const getServerSideProps =withTranslation(async ({ params }) => {
  const data = await new MemberModel().getStatic(params!.type);
  return {
    props: { membersStaticData: JSON.parse(JSON.stringify(data)), type:params!.type }, // will be passed to the page component as props
  };
});

const MembersPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ membersStaticData, type }) => {
    const { groupMap, otherGroupList } = membersStaticData;
    const Title = type.replace(/[A-Z]/g,(match:string) => ("_"+match.toLowerCase()));
    const { t } = i18n;

    return (
      <Container className="my-4">
        <PageHead title={t(Title)} />

        <h1 className="w-100 my-5 text-center">{t(Title)}</h1>

        <MemberStatic
          membersGroup={groupMap}
          showMore={false}
          otherMembersList={otherGroupList}
        />
      </Container>
    );
  });

export default MembersPage;
