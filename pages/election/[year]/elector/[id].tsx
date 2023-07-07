import { marked } from 'marked';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { CommentBox } from '../../../../components/CommentBox';
import { ElectorCard } from '../../../../components/Election/ElectorCard';
import PageHead from '../../../../components/PageHead';
import {
  ELECTION_BASE_ID,
  ELECTION_TABLE_ID,
  ElectionTarget,
  Elector,
  ElectorModel,
} from '../../../../models/Elector';
import { i18n } from '../../../../models/Translation';
import { withRoute, withTranslation } from '../../../api/base';

export const getServerSideProps = withRoute<
  Record<'year' | 'id', string>,
  Elector
>(
  withTranslation(async ({ params }) => {
    const electorStore = new ElectorModel(ELECTION_BASE_ID, ELECTION_TABLE_ID);

    return { props: await electorStore.getOne(params!.id) };
  }),
);

const { t } = i18n;

const ElectorPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ route, ...elector }) => {
    const title = `${route.params!.year} ${t('election')} ${textJoin(
      t(elector.electionTarget as ElectionTarget),
      t('candidate'),
    )}`;

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <Row className="my-5 g-4">
          <Col xs={12} md={4}>
            <ElectorCard {...elector} />
          </Col>
          <Col xs={12} md={8}>
            <h2>{t('last_committee')}</h2>

            {elector.lastCommitteeSummary && (
              <section
                dangerouslySetInnerHTML={{
                  __html: marked(elector.lastCommitteeSummary + ''),
                }}
              />
            )}
            <h2>{t('last_work_group')}</h2>

            {elector.lastWorkGroupSummary && (
              <section
                dangerouslySetInnerHTML={{
                  __html: marked(elector.lastWorkGroupSummary + ''),
                }}
              />
            )}
            <h2>{t('last_project_group')}</h2>

            {elector.lastProjectGroupSummary && (
              <section
                dangerouslySetInnerHTML={{
                  __html: marked(elector.lastProjectGroupSummary + ''),
                }}
              />
            )}
            <h2>{t('next_term_plan')}</h2>

            {elector.nextTermPlan && (
              <section
                dangerouslySetInnerHTML={{
                  __html: marked(elector.nextTermPlan + ''),
                }}
              />
            )}
          </Col>
        </Row>

        <CommentBox category="Polls" categoryId="DIC_kwDOB88JLM4COLSZ" />
      </Container>
    );
  });

export default ElectorPage;
