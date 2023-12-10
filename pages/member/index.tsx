import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { MemberGroup } from '../../components/Member/Group';
import { i18n } from '../../models/Base/Translation';
import { PersonnelModel } from '../../models/Personnel';

export const getServerSideProps = compose<{}, Pick<PersonnelModel, 'group'>>(
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

const { t } = i18n;

const MemberPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ group }) => (
    <Container className="py-5">
      <PageHead title={t('正式成员')} />

      <h1 className="text-center">{t('正式成员')}</h1>

      {Object.entries(group)
        .sort(([a], [b]) => (a ? -1 : b ? 1 : 0))
        .map(([name, list]) => (
          <MemberGroup key={name} {...{ name, list }} />
        ))}
    </Container>
  ));

export default MemberPage;
