import type { FC } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { TimeDistance, text2color } from 'idea-react';

import { TimeOption } from './data';
import { fileURLOf } from '../pages/api/lark/file/[id]';
import type { Activity } from '../models/Activity';

export interface ActivityCardProps extends Activity {
  className?: string;
}

export interface Organizer {
  text: string;
  table_id: string;
  type: string;
  record_ids: string[];
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
  image,
}: ActivityCardProps) => (
  <Card className={`shadow-sm ${className}`}>
    <Card.Img
      variant="top"
      style={{ height: '30vh', objectFit: 'cover' }}
      src={fileURLOf(image)}
    />
    <Card.Body>
      <Card.Title as="h3" className="h4">
        <a
          className="text-decoration-none stretched-link text-secondary"
          href={link as string}
        >
          {name}
        </a>
      </Card.Title>
      <Row className="mt-24">
        <Col className="text-start">
          {city}&nbsp;&nbsp;{location}
        </Col>
      </Row>
      <Row as="footer" className="small mt-3">
        <Col>
          {(organizers as Organizer[])?.map((item: Organizer) => (
            <Badge
              key={item.text}
              className="me-2"
              bg={text2color(item.text, ['light'])}
            >
              {item.text}
            </Badge>
          ))}
        </Col>
        <Col className="text-end">
          {
            <TimeDistance
              className="me-3"
              {...TimeOption}
              date={startTime as number}
            />
          }
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
