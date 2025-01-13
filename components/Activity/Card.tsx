import { TimeDistance } from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { type Activity, ActivityModel } from '../../models/Activity';
import { LarkImage } from '../Base/LarkImage';
import { TagNav } from '../Base/TagNav';
import { TimeOption } from '../data';

export interface ActivityCardProps extends Activity {
  className?: string;
}

export const ActivityCard: FC<ActivityCardProps> = ({
  className = '',
  id,
  host,
  name,
  startTime,
  city,
  location,
  image,
  ...activity
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '23rem' }}
  >
    <div className="position-relative w-100" style={{ paddingBottom: '56%' }}>
      <div className="position-absolute top-0 left-0 w-100 h-100">
        <LarkImage
          className="card-img-top h-100 object-fit-cover"
          style={{ objectPosition: 'top left' }}
          src={image}
        />
      </div>
    </div>
    <Card.Body className="d-flex flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a
          className="text-decoration-none text-secondary text-truncate-lines"
          href={ActivityModel.getLink({ id, ...activity })}
        >
          {name as string}
        </a>
      </Card.Title>

      <Row className="mt-2 flex-fill">
        <Col className="text-start">
          <Card.Text
            className="mt-1 text-truncate"
            title={(location as TableCellLocation)?.full_address}
          >
            <span className="me-1">{city as string}</span>

            {(location as TableCellLocation)?.full_address}
          </Card.Text>
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <Col xs={8}>
          <TagNav
            list={host as string[]}
            linkOf={organizer => `/search/activity?keywords=${organizer}`}
          />
        </Col>
        <Col className="text-end" xs={4}>
          <TimeDistance {...TimeOption} date={startTime as number} />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
