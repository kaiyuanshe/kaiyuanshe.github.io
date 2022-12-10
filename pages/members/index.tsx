import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import { i18n } from '../../models/Translation';
import PageHead from '../../components/PageHead';
import { MemberStatic } from '../../components/Member/Static';
import membersStore from '../../models/Member';

export async function getServerSideProps() {
  const data = await membersStore.getStatic();

  return {
    props: { membersStaticData: JSON.parse(JSON.stringify(data)) }, // will be passed to the page component as props
  };
}

export default function MembersPage({
  membersStaticData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { groupMap, otherGroupList } = membersStaticData;
  return (
    <Container className="my-4">
      <PageHead title="正式成员" />

      <h1 className="w-100 my-5 text-center">正式成员</h1>

      <MemberStatic membersGroup={groupMap} otherMembersList={otherGroupList} />
    </Container>
  );
}
