import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { MemberCard } from '../../components/Member/Card';
import { blobURLOf } from '../../models/Base';
import { i18n } from '../../models/Base/Translation';
import { PersonnelModel } from '../../models/Personnel';

export const getServerSideProps = compose<{}, Pick<PersonnelModel, 'group'>>(
  errorLogger,
  translator(i18n),
  async () => {
    const group = await new PersonnelModel().getYearGroup(
      { award: '中国开源先锋33人' },
      ['createdAt'],
    );
    return { props: JSON.parse(JSON.stringify({ group })) };
  },
);

const { t } = i18n;

const Pioneer: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ group }) => (
    <Container className="py-5">
      <PageHead title={t('china_open_source_pioneer')} />

      <Breadcrumb>
        <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('community_development')}</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {t('china_open_source_pioneer')}
        </Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-center">{t('china_open_source_pioneer')}</h1>

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

export default Pioneer;
