import { TableCellAttachment } from 'mobx-lark';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Card, Carousel } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import { AgendaToolbar, AgendaToolbarProps } from './Toolbar';

export const AgendaCard: FC<AgendaToolbarProps> = observer(
  ({
    activityId,
    id,
    title,
    mentors,
    mentorAvatars,
    startTime,
    endTime,
    ...props
  }) => (
    <Card className="h-100">
      <div className="d-flex">
        {(mentorAvatars as TableCellAttachment[])?.[1] ? (
          <Carousel className="w-100">
            {(mentorAvatars as unknown as TableCellAttachment[])?.map(file => (
              <Carousel.Item key={file.attachmentToken}>
                <Card.Img
                  key={file.attachmentToken}
                  className="m-auto object-fit-cover"
                  style={{ height: '25rem' }}
                  loading="lazy"
                  src={blobURLOf([file])}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          (mentorAvatars as unknown as TableCellAttachment[])?.map(file => (
            <Card.Img
              key={file.attachmentToken}
              className="object-fit-cover"
              style={{ height: '25rem' }}
              loading="lazy"
              src={blobURLOf([file])}
            />
          ))
        )}
      </div>

      <Card.Body className="d-flex flex-column justify-content-end">
        <Card.Title
          as="a"
          className="text-decoration-none text-secondary text-truncation-lines"
          href={`/activity/${activityId}/agenda/${id}`}
        >
          {title}
        </Card.Title>

        <ul className="list-unstyled">
          <li>👨‍🎓 {(mentors as string[]).join(' ')}</li>
          <li>
            🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
            {new Date(+endTime!).toLocaleString()}
          </li>
        </ul>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <AgendaToolbar
          {...{
            activityId,
            id,
            title,
            mentors,
            mentorAvatars,
            startTime,
            endTime,
            ...props,
          }}
        />
      </Card.Footer>
    </Card>
  ),
);
