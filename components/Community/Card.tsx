import type { FC } from 'react';
import { Card } from 'react-bootstrap';

import { Community } from '../../models/Community';

export const CommunityCard: FC<Community> = ({ name }: Community) => (
  <Card className="border-0 align-items-center position-relative">
    <Card.Img
      style={{ width: '8rem' }}
      variant="top"
      src="/image/KCC.JPEG"
      alt={name + ''}
    />
    <Card.Body>
      <Card.Title
        as="a"
        className="fs-6 stretched-link"
        href={`community/${name}` || '#'}
      >
        {name}
      </Card.Title>
    </Card.Body>
  </Card>
);
