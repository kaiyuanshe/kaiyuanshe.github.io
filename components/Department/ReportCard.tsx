import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { t } from '../../models/Base/Translation';
import { Report } from '../../models/Governance/Report';

export const ReportCard: FC<Report> = observer(
  ({ createdAt, department, plan, progress, product, problem, meeting }) => (
    <Card>
      <Card.Header as="h3">{meeting?.toString()}</Card.Header>
      <Card.Body
        as="dl"
        className="mb-0 overflow-auto"
        style={{ maxHeight: '25rem' }}
      >
        <Card.Title as="dt">{t('plan')}</Card.Title>
        <Card.Text
          as="dd"
          dangerouslySetInnerHTML={{ __html: plan?.toString() || '' }}
        />
        <Card.Title as="dt">{t('progress')}</Card.Title>
        <Card.Text
          as="dd"
          dangerouslySetInnerHTML={{ __html: progress?.toString() || '' }}
        />
        <Card.Title as="dt">{t('product')}</Card.Title>
        <Card.Text
          as="dd"
          dangerouslySetInnerHTML={{ __html: product?.toString() || '' }}
        />
        <Card.Title as="dt">{t('problem')}</Card.Title>
        <Card.Text
          as="dd"
          dangerouslySetInnerHTML={{ __html: problem?.toString() || '' }}
        />
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <time dateTime={new Date(createdAt as number).toJSON()}>
          {formatDate(createdAt as number)}
        </time>
        <Badge bg={text2color(department + '', ['light'])}>
          {department + ''}
        </Badge>
      </Card.Footer>
    </Card>
  ),
);
