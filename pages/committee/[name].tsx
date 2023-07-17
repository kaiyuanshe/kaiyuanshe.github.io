import { Avatar } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { PersonnelModel } from '../../models/Personnel';
import { i18n } from '../../models/Translation';
import { withRoute, withTranslation } from '../api/base';
import { fileURLOf } from '../api/lark/file/[id]';

type CommitteePageProps = Pick<PersonnelModel, 'allItems'>;

const nameMap = {
  consultant: '顾问委员会',
  'legal-advisory': '法律咨询委员会',
};

export const getServerSideProps = withRoute<
  { name: string },
  CommitteePageProps
>(
  withTranslation(async ({ params }) => {
    const department = nameMap[params!.name as keyof typeof nameMap];

    if (!department) return { notFound: true, props: {} as CommitteePageProps };

    const allItems = await new PersonnelModel().getAll({ department });

    return { props: JSON.parse(JSON.stringify({ allItems })) };
  }),
);

const { t } = i18n;

const titleMap = () => ({
  consultant: t('consultant_committee'),
  'legal-advisory': t('legal_advisory_committee'),
});

const CommitteePage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(({ route: { params }, allItems }) => {
  const title = titleMap()[params!.name as keyof ReturnType<typeof titleMap>];

  return (
    <Container className="py-5">
      <PageHead title={title} />

      <h1 className="mb-5 text-center">{title}</h1>

      <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3">
        {allItems.map(({ id, position, recipient, recipientAvatar }) => (
          <li
            key={id as string}
            className="d-flex flex-column align-items-center gap-2 position-relative"
          >
            <Avatar size={5} src={fileURLOf(recipientAvatar)} />
            <a
              className="text-decoration-none stretched-link"
              href={`/person/${recipient}`}
            >
              {position} {recipient}
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
});

export default CommitteePage;
