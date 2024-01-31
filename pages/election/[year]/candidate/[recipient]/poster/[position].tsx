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
import { FC } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { LarkImage } from '../../../../../../components/Base/LarkImage';
import { ShareBox } from '../../../../../../components/Base/ShareBox';
import PageHead from '../../../../../../components/Layout/PageHead';
import { API_Host } from '../../../../../../models/Base';
import { i18n } from '../../../../../../models/Base/Translation';
import { Personnel, PersonnelModel } from '../../../../../../models/Personnel';

const { t } = i18n;

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

const CandidatePoster: FC<CandidatePosterProps> = observer(
  ({
    route: { params },
    overview,
    applicants,
    recipient,
    recipientAvatar,
    position,
    reason,
    contribution,
    proposition,
    recommenders,
    recommendation1,
    recommendation2,
  }) => {
    const { year } = params!;
    const title = `${t('KaiYuanShe')} ${year}`,
      subTitle = `${textJoin(position as string, t('candidate'))} ${recipient}`;

    return (
      <>
        <PageHead title={subTitle} />

        <ShareBox
          title={`${title} ${subTitle}`}
          url={`${API_Host}/election/${year}/candidate/${recipient}/poster/${position}`}
        >
          <Container
            className="d-flex flex-column gap-3 p-5"
            style={{
              backgroundImage: `url(/api/lark/file/SC8ibClWyoi5usxY8KtcnpCgntg)`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
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
                roundedCircle
                className="object-fit-contain"
                style={{ width: '5rem', height: '5rem' }}
                src={recipientAvatar}
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
                    />
                  </section>
                ),
            )}
            <Row as="footer" className="text-center">
              <Col xs={6}>
                <QRCodeSVG value={`${API_Host}/election/${year}#${position}`} />
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
        </ShareBox>
      </>
    );
  },
);

export default CandidatePoster;
