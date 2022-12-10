import type { FC } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { TimeDistance, text2color } from 'idea-react';

import { TimeOption } from '../data';
import { fileURLOf } from '../../pages/api/lark/file/[id]';
import type { Activity } from '../../pages/api/activity';

export interface ActivityCardProps extends Activity {
  className?: string;
}

export const ActivityCard: FC<ActivityCardProps> = ({
  className = '',
  organizers,
  name,
  startTime,
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
    <Card.Body className="d-flex flex-column">
      <Card.Title as="h3" className="h4 flex-fill">
        <a
          className="text-decoration-none text-secondary"
          href={link as string}
        >
          {name}
        </a>
      </Card.Title>

      <Row className="mt-24">
        <Col className="text-start">
          <Card.Text className="mt-4 text-truncate" title={location + ''}>
            <span className="me-3">{city}</span>
            {location}
          </Card.Text>
        </Col>
      </Row>
      <Row as="footer" className="small mt-3">
        <Col>
          {(organizers as string[])?.map(organizer => (
            <Badge
              key={organizer}
              className="me-2 text-decoration-none"
              bg={text2color(organizer, ['light'])}
              as="a"
              href={`/search?keywords=${organizer}`}
            >
              {organizer}
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
