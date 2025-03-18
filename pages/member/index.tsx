import { observer } from 'mobx-react';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { MemberGroup } from '../../components/Member/Group';
import { i18n, t } from '../../models/Base/Translation';
import { PersonnelModel } from '../../models/Personnel';

type MemberPageProps = Pick<PersonnelModel, 'group'>;

export const getServerSideProps = compose<{}, MemberPageProps>(
  cache(),
  errorLogger,
  translator(i18n),
  async () => {
    const group = await new PersonnelModel().getGroup(
      {
        position: ['正式成员', '组长', '副组长'],
        passed: true,
      },
      ['department'],
    );

    return { props: JSON.parse(JSON.stringify({ group })) };
  },
);

const MemberPage: FC<MemberPageProps> = observer(
  ({ group: { '': unGrouped = [], ...group } }) => (
    <Container className="py-5">
      <PageHead title={t('正式成员')} />

      <h1 className="text-center">{t('正式成员')}</h1>

      {[...Object.entries(group), ['', unGrouped] as const].map(
        ([name, list]) => (
          <MemberGroup key={name} {...{ name, list }} />
        ),
      )}
    </Container>
  ),
);

export default MemberPage;
