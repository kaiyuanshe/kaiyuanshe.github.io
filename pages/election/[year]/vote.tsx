import { Loading } from 'idea-react';
import { computed, when } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import dynamic from 'next/dynamic';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import userStore from '../../../models/Base/User';
import { ElectionModel } from '../../../models/Personnel/Election';
import { VoteForm } from './candidate/[recipient]/poster/[position]';

const SessionBox = dynamic(() => import('../../../components/Layout/SessionBox'), { ssr: false });

export const getServerSideProps = compose(router);

@observer
export default class ElectionVotePage extends ObservedComponent<
  RouteProps<{ year: string }>,
  typeof i18n
> {
  static contextType = I18nContext;

  electionStore = new ElectionModel();

  electionName = `KYS-administration-${this.props.route.params!.year}`;

  @computed
  get formData() {
    const { ticketMap } = this.electionStore;

    const list = Object.entries(ticketMap).map(([name, ticket]) => [
      name,
      new URLSearchParams(Object.entries(ticket).map(([key, value]) => [`prefill_${key}`, value!])),
    ]);

    return Object.fromEntries(list);
  }

  async componentDidMount() {
    await when(() => !!userStore.session);

    await this.electionStore.signVoteTicket(`${this.electionName}-director`);
    await this.electionStore.signVoteTicket(`${this.electionName}-member`);
  }

  renderVoteForm({
    [`${this.electionName}-director`]: director,
    [`${this.electionName}-member`]: member,
  }: ElectionVotePage['formData']) {
    const { t } = this.observedContext;

    return (
      <Row xs={1} sm={2}>
        <Col>
          <h2 className="text-center">{t('director_election_voting')}</h2>
          {director && (
            <iframe className="w-100 vh-100 border-0" src={`${VoteForm.理事}?${director}`} />
          )}
        </Col>
        <Col>
          <h2 className="text-center">{t('member_application_voting')}</h2>
          {member && (
            <iframe className="w-100 vh-100 border-0" src={`${VoteForm.正式成员}?${member}`} />
          )}
        </Col>
      </Row>
    );
  }

  render() {
    const { t } = this.observedContext,
      { props, electionStore, formData } = this;
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

        <SessionBox autoCover>{this.renderVoteForm(formData)}</SessionBox>
      </Container>
    );
  }
}
