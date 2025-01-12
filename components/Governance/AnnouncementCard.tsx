import { TableCellAttachment } from 'mobx-lark';
import { FC } from 'react';
import { Card, CardProps } from 'react-bootstrap';

import { Announcement } from '../../models/Personnel/Announcement';
import { FileList } from '../Activity';

export type AnnouncementCardProps = Announcement &
  Omit<CardProps, 'id' | 'title' | 'content'>;

export const AnnouncementCard: FC<AnnouncementCardProps> = ({
  id,
  title,
  content,
  files,
  publishedAt,
  ...props
}) => (
  <Card {...props}>
    <Card.Header>{title + ''}</Card.Header>
    <Card.Body>
      <Card.Text
        className="overflow-auto"
        style={{ maxWidth: '18rem', maxHeight: '20rem' }}
        dangerouslySetInnerHTML={{ __html: content + '' }}
      />
      {files && <FileList data={files as TableCellAttachment[]} />}
    </Card.Body>
    <Card.Footer className="d-flex justify-content-between">
      <div />
      <time dateTime={new Date(publishedAt as number).toJSON()}>
        {new Date(publishedAt as number).toLocaleString()}
      </time>
    </Card.Footer>
  </Card>
);
