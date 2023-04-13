import { TableCellAttachment } from 'mobx-lark';
import { FC } from 'react';
import { Card, Image } from 'react-bootstrap';

import { Agenda } from '../../../models/Agenda';
import { blobURLOf } from '../../../models/Base';

export const AgendaCard: FC<Agenda> = ({
  title,
  mentors,
  mentorAvatars,
  startTime,
  endTime,
}) => (
  <Card className="h-100">
    <div className="d-flex">
      {(mentorAvatars as unknown as TableCellAttachment[])?.map(file => (
        <Card.Img
          key={file.attachmentToken}
          className="object-fit-cover"
          style={{ height: '25rem' }}
          loading="lazy"
          src={blobURLOf([file])}
        />
      ))}
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
