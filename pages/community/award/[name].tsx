import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import PageHead from '../../../components/Layout/PageHead';
import { MemberCard } from '../../../components/Member/Card';
import { blobURLOf } from '../../../models/Base';
import { i18n } from '../../../models/Base/Translation';
import { PersonnelModel } from '../../../models/Personnel';

type CommitteePageProps = RouteProps<{ name: string }> &
  Pick<PersonnelModel, 'group'>;

const nameMap = {
  'COSCon-star': 'COSCon 之星',
  'community-cooperation-star': '社区合作之星',
  'Open-Source-star': '开源之星',
  'China-Open-Source-pioneer': '中国开源先锋33人',
};

export const getServerSideProps = compose<{ name: string }, CommitteePageProps>(
  router,
  errorLogger,
  translator(i18n),
  async ({ params }) => {
    const award = nameMap[params!.name as keyof typeof nameMap];

    if (!award) return { notFound: true, props: {} as CommitteePageProps };

    const group = await new PersonnelModel().getYearGroup({ award }, [
      'createdAt',
    ]);
    return { props: JSON.parse(JSON.stringify({ group })) };
  },
);

const { t } = i18n;

const titleMap = () => ({
  'community-cooperation-star': t('community_cooperation_star'),
  'Open-Source-star': t('open_source_star'),
  'COSCon-star': t('COSCon_star'),
  'China-Open-Source-pioneer': t('china_open_source_pioneer'),
});

const HonorPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ route: { params }, group }) => {
    const title = titleMap()[params!.name as keyof ReturnType<typeof titleMap>];

    return (
      <Container className="py-5">
        <PageHead title={title} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item>{t('community_development')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{title}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="mb-5 text-center">{title}</h1>

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
    );
  });

export default HonorPage;
