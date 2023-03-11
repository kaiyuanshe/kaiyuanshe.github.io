import { FC, useEffect } from 'react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { scrollTo } from 'web-utility';

import PageHead from '../../components/PageHead';
import { MemberStatic } from '../../components/Member/Static';
import { withTranslation } from '../api/base';
import { i18n } from '../../models/Translation';
import { MemberModel } from '../../models/Member';

export const getServerSideProps = withTranslation(async () => {
  const data = await new MemberModel().getStatic();

  return {
    props: { membersStaticData: JSON.parse(JSON.stringify(data)) }, // will be passed to the page component as props
  };
});

// export function scrollTo(
//   selector: string,
//   offset?: number|string,
//   align?: ScrollLogicalPosition,
//   justify?: ScrollLogicalPosition,
//   root?: Element
// ) {
//   const [_, ID] = /^#(.+)/.exec(selector) || [];

//   if (ID === 'top') window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
//   else
//       (root || document)
//           .querySelector(ID ? `[id="${ID}"]` : selector)
//           ?.scrollIntoView({
//               behavior: 'smooth',
//               block: align,
//               inline: justify
//           });
//             //window.scrollBy(0,-offset)

// }
const MembersPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ membersStaticData }) => {
    const { groupMap, otherGroupList } = membersStaticData;
    const { t } = i18n;
    const { query } = useRouter();
    useEffect(() => {
      scrollTo('#' + query!.anchor);
    });

    return (
      <Container className="my-4">
        <PageHead title={t('our_members')} />

        <h1 className="w-100 my-5 text-center">{t('our_members')}</h1>

        <MemberStatic
          membersGroup={groupMap}
          otherMembersList={otherGroupList}
          query={query}
        />
      </Container>
    );
  });

export default MembersPage;
