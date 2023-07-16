import { Avatar } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { PersonnelModel } from '../../models/Personnel';
import { i18n } from '../../models/Translation';
import { withErrorLog } from '../api/base';
import { fileURLOf } from '../api/lark/file/[id]';

export const getServerSideProps = withErrorLog<
  {},
  Pick<PersonnelModel, 'group'>
>(async () => {
  const group = await new PersonnelModel().getYearGroup({ position: '理事' }, [
    'createdAt',
  ]);

  return { props: JSON.parse(JSON.stringify({ group })) };
});

const { t } = i18n;

const CouncilPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ group }) => (
    <Container className="py-5">
      <PageHead title={t('council')} />

      <h1 className="text-center">{t('council')}</h1>

      {Object.entries(group)
        .sort(([a], [b]) => +b - +a)
        .map(([year, list]) => (
          <section key={year} id={year}>
            <h2 className="text-center my-5">{year}</h2>

            <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3">
              {list.map(({ id, position, recipient, recipientAvatar }) => (
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
          </section>
        ))}
    </Container>
  ));

export default CouncilPage;
