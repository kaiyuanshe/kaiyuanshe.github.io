import { observer } from 'mobx-react';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { MemberCard } from '../../components/Member/Card';
import { blobURLOf } from '../../models/Base';
import { i18n, t } from '../../models/Base/Translation';
import { PersonnelModel } from '../../models/Personnel';

type CouncilPageProps = Pick<PersonnelModel, 'group'>;

export const getServerSideProps = compose<{}, CouncilPageProps>(
  errorLogger,
  translator(i18n),
  async () => {
    const group = await new PersonnelModel().getYearGroup(
      {
        position: ['理事', '理事长', '副理事长'],
        passed: true,
      },
      ['createdAt'],
    );

    return { props: JSON.parse(JSON.stringify({ group })) };
  },
);

const CouncilPage: FC<CouncilPageProps> = observer(({ group }) => (
  <Container className="py-5">
    <PageHead title={t('board_of_directors')} />
    <Breadcrumb>
      <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
      <Breadcrumb.Item href="/department">{t('department')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{t('board_of_directors')}</Breadcrumb.Item>
    </Breadcrumb>
    <h1 className="text-center">{t('board_of_directors')}</h1>

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
                  avatar={blobURLOf(recipientAvatar)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
  </Container>
));

export default CouncilPage;
