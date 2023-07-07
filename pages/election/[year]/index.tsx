import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import { ElectorCard } from '../../../components/Election/ElectorCard';
import PageHead from '../../../components/PageHead';
import {
  ELECTION_BASE_ID,
  ELECTION_TABLE_ID,
  ElectionTarget,
  Elector,
  ElectorModel,
} from '../../../models/Elector';
import { i18n } from '../../../models/Translation';
import { withRoute, withTranslation } from '../../api/base';

export const getServerSideProps = withRoute<
  { year: string },
  { electorGroup: Record<ElectionTarget, Elector[]> }
>(
  withTranslation(async ({ params }) => {
    const electorStore = new ElectorModel(ELECTION_BASE_ID, ELECTION_TABLE_ID);

    const electorGroup = await electorStore.getGroup(+params!.year);

    return { props: { electorGroup } };
  }),
);

const { t } = i18n;

const ElectionPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ route, electorGroup }) => {
    const { year } = route.params!;

    const title = `${year} ${t('election')}`;

    const passed = +new Date(`${year}-03-01`) <= Date.now();

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <div className="d-flex justify-content-center gap-3 my-3">
          <Button
            variant="success"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnbqCtt9p9QkYFO1YAUGnMJh"
            disabled={passed}
          >
            选民登记
          </Button>
          <Button
            variant="warning"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnbqCtt9p9QkYFO1YAUGnMJh"
            disabled={passed}
          >
            理事竞选
          </Button>
          <Button
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnbqCtt9p9QkYFO1YAUGnMJh"
            disabled={passed}
          >
            正式成员申请
          </Button>
          <Button
            variant="danger"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnehPTKXtDsoKVfv0mKGZwge"
            disabled={passed}
          >
            选举投票
          </Button>
        </div>

        {Object.entries(electorGroup).map(([target, list]) => (
          <section key={target}>
            <h2 className="my-5 text-center">
              {textJoin(t(target as ElectionTarget), t('candidate'))}
            </h2>

            <Row as="ul" className="list-unstyled g-4" xs={1} sm={2} lg={3}>
              {list
                .sort(
                  (
                    { councilVoteCount: a1, regularVoteCount: a2 },
                    { councilVoteCount: b1, regularVoteCount: b2 },
                  ) => +b1! - +a1! || +b2! - +a2!,
                )
                .map(item => (
                  <Col as="li" key={item.id + ''}>
                    <ElectorCard
                      className="h-100"
                      href={`/election/${year}/elector/${item.id}`}
                      {...item}
                    />
                  </Col>
                ))}
            </Row>
          </section>
        ))}
      </Container>
    );
  });

export default ElectionPage;
