import { observer } from 'mobx-react';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { MemberCard } from '../../../components/Member/Card';
import { i18n, t } from '../../../models/Base/Translation';
import { PersonnelModel } from '../../../models/Personnel';

type CommitteePageProps = RouteProps<{ name: string }> &
  Pick<PersonnelModel, 'allItems'>;

const nameMap = {
  advisory: '顾问委员会',
  'legal-advisory': '法律咨询委员会',
};

export const getServerSideProps = compose<{ name: string }, CommitteePageProps>(
  router,
  errorLogger,
  translator(i18n),
  async ({ params }) => {
    const department = nameMap[params!.name as keyof typeof nameMap];

    if (!department) return { notFound: true, props: {} as CommitteePageProps };

    const allItems = await new PersonnelModel().getAll({
      department,
      passed: true,
    });

    return { props: JSON.parse(JSON.stringify({ allItems })) };
  },
);

const titleMap = () => ({
  advisory: t('advisory_council'),
  'legal-advisory': t('legal_advisory_council'),
});

const CommitteePage: FC<CommitteePageProps> = observer(
  ({ route: { params }, allItems }) => {
    const title = titleMap()[params!.name as keyof ReturnType<typeof titleMap>];

    return (
      <Container className="py-5">
        <PageHead title={title} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/department">
            {t('department')}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{title}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="mb-5 text-center">{title}</h1>

        <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3">
          {allItems.map(({ id, position, recipient, recipientAvatar }) => (
            <li
              key={id as string}
              className="d-flex flex-column align-items-center gap-2 position-relative"
            >
              <MemberCard
                name={recipient + ''}
                nickname={position + ''}
                avatar={recipientAvatar}
              />
            </li>
          ))}
        </ul>
      </Container>
    );
  },
);
export default CommitteePage;
