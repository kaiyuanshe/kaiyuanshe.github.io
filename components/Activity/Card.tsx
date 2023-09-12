import { text2color, TimeDistance } from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import type { FC } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

import type { Activity } from '../../models/Activity';
import { blobURLOf } from '../../models/Base';
import { TimeOption } from '../data';

export interface ActivityCardProps extends Activity {
  className?: string;
}

export const ActivityCard: FC<ActivityCardProps> = ({
  className = '',
  id,
  organizers,
  name,
  startTime,
  database,
  link,
  city,
  location,
  image,
}: ActivityCardProps) => (
  <Card className={`shadow-sm ${className}`}>
    <div className="position-relative w-100" style={{ paddingBottom: '56%' }}>
      <div className="position-absolute top-0 left-0 w-100 h-100">
        <Card.Img
          className="h-100 object-fit-cover"
          style={{ objectPosition: 'top left' }}
          src={blobURLOf(image)}
        />
      </div>
    </div>
    <Card.Body className="d-flex flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a
          className="text-decoration-none text-secondary text-truncate-lines"
          href={database ? `/activity/${id}` : link + ''}
        >
          {name}
        </a>
      </Card.Title>

      <Row className="mt-2 flex-fill">
        <Col className="text-start">
          <Card.Text
            className="mt-1 text-truncate"
            title={(location as TableCellLocation)?.full_address}
          >
            <span className="me-1">{city}</span>
            {(location as TableCellLocation)?.full_address}
          </Card.Text>
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <Col xs={8}>
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
        <Col className="text-end" xs={4}>
          <TimeDistance {...TimeOption} date={startTime as number} />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
