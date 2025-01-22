import { Loading } from 'idea-react';
import { computed, when } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, t } from '../../../models/Base/Translation';
import userStore from '../../../models/Base/User';
import { ElectionModel } from '../../../models/Personnel/Election';
import { VoteForm } from './candidate/[recipient]/poster/[position]';

const SessionBox = dynamic(
  () => import('../../../components/Layout/SessionBox'),
  { ssr: false },
);

export const getServerSideProps = compose(router, translator(i18n));

@observer
export default class ElectionVotePage extends Component<
  RouteProps<{ year: string }>
> {
  electionStore = new ElectionModel();

  electionName = `KYS-administration-${this.props.route.params!.year}`;

  @computed
  get formData() {
    const { currentVoteTicket } = this.electionStore;

    if (!currentVoteTicket) return;

    const data = Object.entries(currentVoteTicket).map(([name, value]) => [
      `prefill_${name}`,
      value!,
    ]);
    return new URLSearchParams(data);
  }

  async componentDidMount() {
    await when(() => !!userStore.session);

    await this.electionStore.signVoteTicket(this.electionName);
  }

  renderVoteForm = (formData: URLSearchParams) => (
    <Row xs={1} sm={2}>
      <Col>
        <h2 className="text-center">{t('director_election_voting')}</h2>
        <iframe
          className="w-100 vh-100 border-0"
          src={`${VoteForm.理事}?${formData}`}
        />
      </Col>
      <Col>
        <h2 className="text-center">{t('member_application_voting')}</h2>
        <iframe
          className="w-100 vh-100 border-0"
          src={`${VoteForm.正式成员}?${formData}`}
        />
      </Col>
    </Row>
  );

  render() {
    const { props, electionStore, formData } = this;
    const { year } = props.route.params!,
      electionVoting = textJoin(t('election'), t('voting'));

    const title = `${year} ${electionVoting}`,
      loading = electionStore.uploading > 0;

    return (
      <Container className="my-4">
        <PageHead title={title} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/election">{t('election')}</Breadcrumb.Item>
          <Breadcrumb.Item href={`/election/${year}`}>{year}</Breadcrumb.Item>
          <Breadcrumb.Item active>{electionVoting}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-center">{title}</h1>

        {loading && <Loading />}

        <SessionBox autoCover>
          {formData && this.renderVoteForm(formData)}
        </SessionBox>
      </Container>
    );
  }
}
