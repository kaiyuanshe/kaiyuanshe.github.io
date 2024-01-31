import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { isEmpty } from 'web-utility';

import { ElectorCard } from '../../../components/Election/ElectorCard';
import PageHead from '../../../components/Layout/PageHead';
import { i18n } from '../../../models/Base/Translation';
import { ElectionTarget, PersonnelModel } from '../../../models/Personnel';
import { VoteForm } from './candidate/[recipient]/poster/[position]';

type ElectionYearPageProps = RouteProps<{ year: string }> &
  Pick<PersonnelModel, 'group'>;

export const getServerSideProps = compose<
  { year: string },
  ElectionYearPageProps
>(router, errorLogger, translator(i18n), async ({ params }) => {
  const group = await new PersonnelModel().getGroup(
    {},
    ['position', 'award'],
    +params!.year,
  );

  return {
    notFound: isEmpty(group),
    props: JSON.parse(JSON.stringify({ group })),
  };
});

const { t } = i18n,
  SectionOrder = [
    '理事',
    '正式成员',
    '志愿者',
    '开源之星',
    'COSCon 之星',
    '社区合作之星',
    '中国开源先锋 33 人',
  ];

const ElectionYearPage: FC<ElectionYearPageProps> = observer(
  ({ route, group }) => {
    const { year } = route.params!;

    const title = `${year} ${t('election')}`,
      passed = +year < new Date().getFullYear();

    const sections = SectionOrder.map(
      title => [title, group[title]] as const,
    ).filter(([_, list]) => list);

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <div className="d-flex flex-wrap justify-content-center gap-3 my-3">
          <Button
            variant="warning"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnVxuTa41nb80lCy7H9GXrkb?prefill_%E7%9B%AE%E6%A0%87%E9%83%A8%E9%97%A8=%E7%90%86%E4%BA%8B%E4%BC%9A&prefill_%E7%9B%AE%E6%A0%87%E8%81%8C%E4%BD%8D=%E7%90%86%E4%BA%8B"
            disabled={passed}
          >
            {t('director_nomination')}
          </Button>
          <Button
            variant="danger"
            target="_blank"
            href={VoteForm.理事}
            disabled={passed}
          >
            {t('director_election_voting')}
          </Button>
          <Button
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcn20SIKJgdsHH9AEGEMYFPwf?prefill_%E7%94%B3%E8%AF%B7%E8%81%8C%E4%BD%8D=%E6%AD%A3%E5%BC%8F%E6%88%90%E5%91%98"
            disabled={passed}
          >
            {t('member_application')}
          </Button>
          <Button
            variant="success"
            target="_blank"
            href={VoteForm.正式成员}
            disabled={passed}
          >
            {t('member_application_voting')}
          </Button>
        </div>

        {sections.map(([target, list]) => (
          <section key={target} id={target}>
            <h2 className="my-5 text-center">
              <a className="text-decoration-none" href={`#${target}`}>
                {textJoin(t(target as ElectionTarget) || '', t('candidate'))}
              </a>
            </h2>

            <Row as="ul" className="list-unstyled g-4" xs={1} sm={2} lg={3}>
              {list
                .sort(
                  (
                    { approvers: a1, rejecters: a2, createdAt: a3 },
                    { approvers: b1, rejecters: b2, createdAt: b3 },
                  ) =>
                    (b1 as string[])?.length - (a1 as string[])?.length ||
                    (a2 as string[])?.length - (b2 as string[])?.length ||
                    +new Date(a3 as string) - +new Date(b3 as string),
                )
                .map(({ id, ...item }, index) => (
                  <Col as="li" key={id + ''} id={item.recipient as string}>
                    <ElectorCard
                      className="h-100"
                      {...item}
                      order={index + 1}
                    />
                  </Col>
                ))}
            </Row>
          </section>
        ))}
      </Container>
    );
  },
);

export default ElectionYearPage;
