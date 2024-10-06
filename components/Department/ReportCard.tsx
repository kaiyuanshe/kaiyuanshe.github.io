import { observer } from 'mobx-react';
import { FC } from 'react';
import { Card } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import { Report } from '../../models/Governance/Report';

export const ReportCard: FC<Report> = observer(
  ({ plan, progress, product, problem, meeting }) => (
    <Card>
      <Card.Header as="h3">{meeting?.toString()}</Card.Header>
      <Card.Body as="dl" className="mb-0">
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
    </Card>
  ),
);
