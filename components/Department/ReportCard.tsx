import { FC } from 'react';
import { Card } from 'react-bootstrap';

import { Report } from '../../models/Governance/Report';

export const ReportCard: FC<Report> = ({
  plan,
  progress,
  product,
  problem,
  meeting,
}) => (
  <Card>
    <Card.Header as="h3">{meeting?.toString()}</Card.Header>
    <Card.Body as="dl" className="mb-0">
      <Card.Title as="dt">计划</Card.Title>
      <Card.Text as="dd">{plan?.toString()}</Card.Text>
      <Card.Title as="dt">进度</Card.Title>
      <Card.Text as="dd">{progress?.toString()}</Card.Text>
      <Card.Title as="dt">产出</Card.Title>
      <Card.Text as="dd">{product?.toString()}</Card.Text>
      <Card.Title as="dt">疑难</Card.Title>
      <Card.Text as="dd">{problem?.toString()}</Card.Text>
    </Card.Body>
  </Card>
);
