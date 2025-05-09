import { observer } from 'mobx-react';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';

import { ReportCard } from '../../../components/Department/ReportCard';
import { MeetingCard } from '../../../components/Governance/MeetingCard';
import { PageHead } from '../../../components/Layout/PageHead';
import { MemberTitle } from '../../../components/Member/Title';
import { I18nContext } from '../../../models/Base/Translation';
import { Meeting, MeetingModel } from '../../../models/Governance/Meeting';
import { Report, ReportModel } from '../../../models/Governance/Report';

interface MeetingDetailPageProps {
  meeting: Meeting;
  reports: Report[];
}

export const getServerSideProps = compose<{ id: string }, MeetingDetailPageProps>(
  cache(),
  errorLogger,
  async ({ params }) => {
    const meeting = await new MeetingModel().getOne(params!.id);
    const reports = await new ReportModel().getAll({ meeting: meeting.title });

    return {
      props: JSON.parse(JSON.stringify({ meeting, reports })),
    };
  },
);

const MeetingDetailPage: FC<MeetingDetailPageProps> = observer(({ meeting, reports }) => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="py-5">
      <PageHead title={meeting.title + ''} />

      <Breadcrumb>
        <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('open_governance')}</Breadcrumb.Item>
        <Breadcrumb.Item href="/governance/meeting">{t('meeting_calendar')}</Breadcrumb.Item>
        <Breadcrumb.Item active>{meeting.title + ''}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col xs={12} md={4} className="d-flex flex-column gap-4">
          <MeetingCard {...meeting} />
        </Col>
        <Col xs={12} md={8}>
          <MemberTitle title={t('monthly_report')} count={reports.length} />

          <Row as="ol" className="list-unstyled g-3" xs={1} md={2}>
            {reports.map(item => (
              <Col key={item.id as string} as="li">
                <ReportCard {...item} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
});
export default MeetingDetailPage;
