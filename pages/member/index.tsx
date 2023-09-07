import 'array-unique-proposal';

import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { TimeData } from 'web-utility';

import { MemberCard } from '../../components/Member/Card';
import { MemberTitle } from '../../components/Member/Title';
import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { fileURLOf } from '../api/lark/file/[id]';

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

@observer
export default class MemberPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderMember = ({
    id,
    createdAt,
    position,
    recipient,
    recipientAvatar,
  }: Personnel) => (
    <li
      key={id as string}
      className="d-flex flex-column align-items-center gap-2 position-relative"
    >
      <MemberCard
        name={recipient + ''}
        nickname={`${position}${
          (position as string).includes('组长')
            ? `(${new Date(createdAt as TimeData).getFullYear()})`
            : ''
        }`}
        avatar={fileURLOf(recipientAvatar)}
      />
    </li>
  );

  render() {
    const { group } = this.props;
    return (
      <Container className="py-5">
        <PageHead title={t('正式成员')} />

        <h1 className="text-center">{t('正式成员')}</h1>

        {Object.entries(group)
          .sort(([a], [b]) => (a ? -1 : b ? 1 : 0))
          .map(([department, list]) => {
            list = list.uniqueBy(({ recipient }) => recipient + '');

            return (
              <section key={department} id={department}>
                <MemberTitle
                  className="my-5"
                  title={department || t('unclassified')}
                  count={list.length}
                />
                <ul className="list-unstyled d-flex flex-wrap gap-3">
                  {list.map(this.renderMember)}
                </ul>
              </section>
            );
          })}
      </Container>
    );
  }
}
