import 'array-unique-proposal';

import { observer } from 'mobx-react';
import { compose, errorLogger, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { MemberCard } from '../../../components/Member/Card';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import { PersonnelModel } from '../../../models/Personnel';

type HonorPageProps = RouteProps<{ name: string }> & Pick<PersonnelModel, 'group'>;

const nameMap = {
  'Open-Source-star': '开源之星',
  'excellent-volunteer': '年度优秀志愿者',
  'COSCon-star': 'COSCon 之星',
  'community-cooperation-star': '社区合作之星',
  'China-Open-Source-pioneer': '中国开源先锋33人',
};

export const getServerSideProps = compose<{ name: string }, HonorPageProps>(
  router,
  errorLogger,
  async ({ params }) => {
    const award = nameMap[params!.name as keyof typeof nameMap];

    if (!award) return { notFound: true, props: {} as HonorPageProps };

    const group = await new PersonnelModel().getYearGroup({ award, passed: true }, ['createdAt']);
    for (const year in group)
      group[year] = group[year].filter(({ recipient }) => recipient).uniqueBy('recipient');

    return { props: JSON.parse(JSON.stringify({ group })) };
  },
);

const titleMap = ({ t }: typeof i18n) => ({
  'Open-Source-star': t('stars_of_open_source'),
  'excellent-volunteer': t('excellent_volunteer_of_the_year'),
  'COSCon-star': t('stars_of_COSCon'),
  'community-cooperation-star': t('stars_of_community_partnership'),
  'China-Open-Source-pioneer': t('china_open_source_pioneer'),
});

const HonorPage: FC<HonorPageProps> = observer(({ route: { params }, group }) => {
  const i18n = useContext(I18nContext);
  const { t } = i18n,
    title = titleMap(i18n)[params!.name as keyof ReturnType<typeof titleMap>];

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
                    avatar={recipientAvatar}
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
