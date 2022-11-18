import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';
import { Loading } from 'idea-react';

import PageHead from '../../components/PageHead';
import membersStore from '../../models/Member';
import { MemberStatic } from '../../components/Member/Static';

export async function getServerSideProps() {
  return {
    props: { membersStaticData: JSON.parse(JSON.stringify(await membersStore.getStatic())) }, // will be passed to the page component as props
  };
}
export default function MembersPage({
  membersStaticData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { downloading } = membersStore;
  const { groupMap, otherGroupList } = membersStaticData;
  return (
    <Container className="my-4">
      {downloading > 0 && <Loading />}
      <PageHead title="正式成员" />

      <h1 className="w-100 my-5 text-center">正式成员</h1>
      <MemberStatic membersGroup={groupMap} otherMembersList={otherGroupList} />
    </Container>
  );
}
