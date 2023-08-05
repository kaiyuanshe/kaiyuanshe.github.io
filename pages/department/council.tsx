import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { MemberCard } from '../../components/Member/Card';
import PageHead from '../../components/PageHead';
import { PersonnelModel } from '../../models/Personnel';
import { i18n } from '../../models/Translation';
import { withErrorLog, withTranslation } from '../api/base';
import { fileURLOf } from '../api/lark/file/[id]';

export const getServerSideProps = withErrorLog<
  {},
  Pick<PersonnelModel, 'group'>
>(
  withTranslation(async () => {
    const group = await new PersonnelModel().getYearGroup(
      {
        position: ['理事', '理事长', '副理事长'],
        passed: true,
      },
      ['createdAt'],
    );

    return { props: JSON.parse(JSON.stringify({ group })) };
  }),
);

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
                  <MemberCard
                    name={recipient + ''}
                    nickname={position + ''}
                    avatar={fileURLOf(recipientAvatar)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
    </Container>
  ));

export default CouncilPage;
