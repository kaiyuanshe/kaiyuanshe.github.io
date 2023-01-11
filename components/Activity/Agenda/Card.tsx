import { FC } from 'react';
import { Card, Image } from 'react-bootstrap';

import { Agenda } from '../../../models/Agenda';
import { TableCellAttachment } from '../../../pages/api/lark/core';

export const AgendaCard: FC<Agenda> = ({
  title,
  mentors,
  mentorAvatars,
  startTime,
  endTime,
}) => (
  <Card className="h-100">
    <div className="d-flex">
      {(mentorAvatars as unknown as TableCellAttachment[])?.map(
        ({ attachmentToken }) => (
          <Image
            key={attachmentToken}
            fluid
            loading="lazy"
            src={`/api/lark/file/${attachmentToken}`}
          />
        ),
      )}
    </div>
    <Card.Body className="d-flex flex-column justify-content-end">
      <Card.Title>{title}</Card.Title>

      <ul className="list-unstyled">
        <li>👨‍🎓 {(mentors as string[]).join(' ')}</li>
        <li>
          🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
          {new Date(+endTime!).toLocaleString()}
        </li>
      </ul>
    </Card.Body>
  </Card>
);
