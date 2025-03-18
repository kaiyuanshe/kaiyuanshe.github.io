import { ShareBox } from 'idea-react';
import { marked } from 'marked';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import {
  cache,
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { QRCodeSVG } from 'qrcode.react';
import { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { LarkImage } from '../../../../../../components/Base/LarkImage';
import { PageHead } from '../../../../../../components/Layout/PageHead';
import { API_Host } from '../../../../../../models/Base';
import { i18n, t } from '../../../../../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../../../../../models/Personnel';

type PageParams = Record<'year' | 'recipient' | 'position', string>;

type CandidatePosterProps = RouteProps<PageParams> & Personnel;

export const getServerSideProps = compose<PageParams, CandidatePosterProps>(
  errorLogger,
  cache(),
  router,
  translator(i18n),
  async ({ params }) => {
    const { year, recipient, position } = params!;
    const {
      [recipient]: [props],
    } = await new PersonnelModel().getGroup(
      { recipient, position },
      ['recipient'],
      +year,
    );

    return props ? JSON.parse(JSON.stringify({ props })) : { notFound: true };
  },
);

export const VoteForm = {
  common:
    'https://kaiyuanshe.feishu.cn/share/base/form/shrcnVYqyX5w8wTNiCLeH7Ziy1g',
  理事: 'https://kaiyuanshe.feishu.cn/share/base/form/shrcnFARtfFj3P3LrlbKqXYvoxb',
  正式成员:
    'https://kaiyuanshe.feishu.cn/share/base/form/shrcnXIXPn0lOt4YomFsvhjnzjf',
};

@observer
export default class CandidatePoster extends Component<CandidatePosterProps> {
  rootURL = `${API_Host}/election/${this.props.route.params!.year}`;
  sharePath = `/candidate/${this.props.recipient}/poster/${this.props.position}`;

  renderContent(title: string, subTitle: string) {
    const {
      overview,
      applicants,
      recipientAvatar,
      position,
      reason,
      contribution,
      proposition,
      recommenders,
      recommendation1,
      recommendation2,
    } = this.props;

    return (
      <Container
        className="d-flex flex-column gap-3 py-5"
        style={{
          background: `url(/api/lark/file/SC8ibClWyoi5usxY8KtcnpCgntg) center no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <header className="d-flex gap-3 align-items-center justify-content-center">
          <h1>
            {title}
            <br />
            {subTitle}
          </h1>

          <LarkImage
            className="object-fit-contain"
            style={{ width: '5rem', height: '5rem' }}
            src={recipientAvatar}
            roundedCircle
          />
        </header>
        {[
          { title: t('nomination_reason'), content: reason as string },
          {
            title: t('previous_term_contribution'),
            content: contribution as string,
          },
          {
            title: t('this_term_proposition'),
            content: proposition as string,
          },
          {
            title: `${applicants} ${t('recommendation')}`,
            content: recommendation1 as string,
          },
          {
            title: `${recommenders} ${t('recommendation')}`,
            content: recommendation2 as string,
          },
        ].map(
          ({ title, content }) =>
            content && (
              <section key={title}>
                <h2>{title}</h2>
                <article
                  dangerouslySetInnerHTML={{ __html: marked(content) }}
                  className="text-break"
                />
              </section>
            ),
        )}
        <Row as="footer" className="text-center">
          <Col xs={6}>
            <QRCodeSVG value={`${this.rootURL}#${position}`} />
            <div className="my-3">
              {textJoin(position as string, t('candidate'))}
            </div>
          </Col>
          <Col xs={6}>
            <QRCodeSVG
              value={`${VoteForm[position as keyof typeof VoteForm] || VoteForm.common}?prefill_赞成=${overview}`}
            />
            <div className="my-3">{t('vote_for_me')}</div>
          </Col>
          <Col xs={12}>{t('press_to_share')}</Col>
        </Row>
      </Container>
    );
  }

  render() {
    const { route, recipient, position } = this.props;
    const { year } = route.params!;
    const title = `${t('KaiYuanShe')} ${year}`,
      subTitle = `${textJoin(position as string, t('candidate'))} ${recipient}`;

    return (
      <>
        <PageHead title={subTitle} />

        <ShareBox
          title={`${title} ${subTitle}`}
          url={this.rootURL + this.sharePath}
        >
          {this.renderContent(title, subTitle)}
        </ShareBox>
      </>
    );
  }
}
