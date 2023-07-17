import 'array-unique-proposal';

import { Avatar } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { TimeData } from 'web-utility';

import PageHead from '../../components/PageHead';
import { Personnel, PersonnelModel } from '../../models/Personnel';
import { i18n } from '../../models/Translation';
import { withErrorLog, withTranslation } from '../api/base';
import { fileURLOf } from '../api/lark/file/[id]';

export const getServerSideProps = withErrorLog<
  {},
  Pick<PersonnelModel, 'group'>
>(
  withTranslation(async () => {
    const group = await new PersonnelModel().getGroup(
      {
        position: ['正式成员', '组长', '副组长'],
        passed: true,
      },
      ['department'],
    );
    return { props: JSON.parse(JSON.stringify({ group })) };
  }),
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
      <Avatar size={5} src={fileURLOf(recipientAvatar)} />
      <a
        className="text-decoration-none stretched-link"
        href={`/person/${recipient}`}
      >
        {position}{' '}
        {(position as string).includes('组长') &&
          `(${new Date(createdAt as TimeData).getFullYear()})`}{' '}
        {recipient}
      </a>
    </li>
  );

  render() {
    const { group } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={t('正式成员')} />

        <h1 className="text-center">{t('正式成员')}</h1>

        {Object.entries(group).map(([department, list]) => (
          <section key={department} id={department}>
            <h2 className="text-center my-5">{department}</h2>

            <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3">
              {list.uniqueBy('recipient').map(this.renderMember)}
            </ul>
          </section>
        ))}
      </Container>
    );
  }
}
