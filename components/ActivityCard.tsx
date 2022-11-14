import type { FC } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { TimeDistance, text2color } from 'idea-react';

import { TimeOption } from './data';
import { fileURLOf } from '../pages/api/lark/file/[id]';
import type { Activity } from '../models/Activity';

export interface ActivityCardProps extends Activity {
  className?: string;
}

export const ActivityCard: FC<ActivityCardProps> = ({
  className = '',
  organizers,
  name,
  startTime,
  endTime,
  link,
  city,
  location,
}: ActivityCardProps) => (
  <Card className={`shadow-sm ${className}`}>
    <Card.Img
      variant="top"
      style={{ height: '30vh', objectFit: 'cover' }}
      src={className}
    />
    <Card.Body>
      <Card.Title as="h3" className="h4">
        <a
          className="text-decoration-none stretched-link text-secondary"
          href={`/activity/${name}`}
        >
          {name}
        </a>
      </Card.Title>

      <Row className="mt-3">
        <Col className="text-end">{city}</Col>
      </Row>
      <Row as="footer" className="small mt-3">
        <Col>
          {(organizers + '').split(/\s+/).map(name => (
            <Badge key={name} className="me-2" bg={text2color(name, ['light'])}>
              {name}
            </Badge>
          ))}
        </Col>
        <Col className="text-end">
          <TimeDistance
            className="me-3"
            {...TimeOption}
            date={startTime as number}
          />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
