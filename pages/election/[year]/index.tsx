import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { Component } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Day, isEmpty } from 'web-utility';

import { ElectorCard } from '../../../components/Election/ElectorCard';
import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, t } from '../../../models/Base/Translation';
import userStore from '../../../models/Base/User';
import {
  ElectionTarget,
  Personnel,
  PersonnelModel,
} from '../../../models/Personnel';
import { VoteForm } from './candidate/[recipient]/poster/[position]';

const SessionBox = dynamic(
  () => import('../../../components/Layout/SessionBox'),
  { ssr: false },
);

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

const SectionOrder = [
  '理事',
  '正式成员',
  '志愿者',
  '开源之星',
  'COSCon 之星',
  '社区合作之星',
  '中国开源先锋 33 人',
];

@observer
export default class ElectionYearPage extends Component<ElectionYearPageProps> {
  get sections() {
    const { group } = this.props;

    return SectionOrder.map(title => [title, group[title]] as const).filter(
      ([_, list]) => list,
    );
  }

  renderGroup(target: string, list: Personnel[]) {
    const [startedAt] = list
      .map(({ createdAt }) => createdAt as number)
      .sort((a, b) => +new Date(a) - +new Date(b));
    const open = +new Date(startedAt) + 16.5 * Day < Date.now();

    return (
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
                { score: a0, approvers: a1, rejecters: a2, createdAt: a3 },
                { score: b0, approvers: b1, rejecters: b2, createdAt: b3 },
              ) =>
                +b0! - +a0! ||
                (b1 as string[])?.length - (a1 as string[])?.length ||
                (a2 as string[])?.length - (b2 as string[])?.length ||
                +new Date(a3 as string) - +new Date(b3 as string),
            )
            .map(({ id, approvers, rejecters, ...item }, index) => (
              <Col as="li" key={id + ''} id={item.recipient as string}>
                <ElectorCard
                  className="h-100"
                  {...item}
                  approvers={open && approvers}
                  rejecters={open && rejecters}
                  order={open ? index + 1 : undefined}
                />
              </Col>
            ))}
        </Row>
      </section>
    );
  }

  render() {
    const { year } = this.props.route.params!;

    const title = `${year} ${t('election')}`,
      passed = +year < new Date().getFullYear();

    const mobilePhone = userStore.session?.mobilePhone.replace(/^\+\d\d/, '');

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <div
          className="d-flex flex-wrap justify-content-center gap-3 py-3 sticky-top bg-white"
          style={{ top: '5rem' }}
        >
          <Button
            variant="warning"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnVxuTa41nb80lCy7H9GXrkb?prefill_%E7%9B%AE%E6%A0%87%E9%83%A8%E9%97%A8=%E7%90%86%E4%BA%8B%E4%BC%9A&prefill_%E7%9B%AE%E6%A0%87%E8%81%8C%E4%BD%8D=%E7%90%86%E4%BA%8B"
            disabled={passed}
          >
            {t('director_nomination')}
          </Button>
          <SessionBox>
            <Button
              variant="danger"
              target="_blank"
              href={`${VoteForm.理事}?prefill_登记手机号=${mobilePhone}`}
              disabled={passed}
            >
              {t('director_election_voting')}
            </Button>
          </SessionBox>
          <Button
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcn20SIKJgdsHH9AEGEMYFPwf?prefill_%E7%94%B3%E8%AF%B7%E8%81%8C%E4%BD%8D=%E6%AD%A3%E5%BC%8F%E6%88%90%E5%91%98"
            disabled={passed}
          >
            {t('member_application')}
          </Button>
          <SessionBox>
            <Button
              variant="success"
              target="_blank"
              href={`${VoteForm.正式成员}?prefill_登记手机号=${mobilePhone}`}
              disabled={passed}
            >
              {t('member_application_voting')}
            </Button>
          </SessionBox>
        </div>

        {this.sections.map(([target, list]) => this.renderGroup(target, list))}
      </Container>
    );
  }
}
