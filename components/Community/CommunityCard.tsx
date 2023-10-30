import type { FC } from 'react';
import { Card } from 'react-bootstrap';

import { Community } from '../../models/Community';
import { LarkImage } from '../Base/LarkImage';

export const CommunityCard: FC<Community> = ({ name, logo }) => (
  <Card className="border-0 align-items-center position-relative">
    <LarkImage
      className="card-img-top"
      style={{ width: '8rem' }}
      src={logo}
      alt={name + ''}
    />
    <Card.Body>
      <Card.Title
        as="a"
        className="fs-6 text-decoration-none stretched-link"
        href={`/community/${name}`}
      >
        {name as string}
      </Card.Title>
    </Card.Body>
  </Card>
);
