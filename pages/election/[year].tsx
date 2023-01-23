import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { ElectorCard } from '../../components/Election/ElectorCard';
import PageHead from '../../components/PageHead';
import {
  ELECTION_BASE_ID,
  ELECTION_TABLE_ID,
  Elector,
  ElectorModel,
} from '../../models/Elector';
import { i18n } from '../../models/Translation';
import { withRoute, withTranslation } from '../api/base';

type TargetName = '理事' | '正式成员';

export const getServerSideProps = withRoute<
  { year: string },
  { electorGroup: Record<TargetName, Elector[]> }
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
    const title = `${route.params!.year} ${t('election')}`;

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        {Object.entries(electorGroup).map(([target, list]) => (
          <section key={target}>
            <h2 className="my-5 text-center">
              {textJoin(t(target as TargetName), t('candidate'))}
            </h2>

            <Row as="ul" className="list-unstyled g-4" xs={1} sm={2} lg={3}>
              {list.map(item => (
                <Col as="li" key={item.id + ''}>
                  <ElectorCard className="h-100" {...item} />
                </Col>
              ))}
            </Row>
          </section>
        ))}
      </Container>
    );
  });

export default ElectionPage;
