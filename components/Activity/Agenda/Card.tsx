import { TableCellAttachment } from 'mobx-lark';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Card, Carousel } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import { AgendaToolbar, AgendaToolbarProps } from './Toolbar';

const renderCardImage = (file: TableCellAttachment) => {
  return (
    <Card.Img
      key={file.attachmentToken}
      className="m-auto object-fit-cover"
      style={{ height: '25rem' }}
      loading="lazy"
      src={blobURLOf([file])}
    />
  );
};

@observer
export class AgendaCard extends Component<AgendaToolbarProps> {
  renderAvatarImages() {
    const { mentorAvatars } = this.props;

    return (
      <div className="d-flex">
        {(mentorAvatars as TableCellAttachment[])?.[1] ? (
          <Carousel className="w-100">
            {(mentorAvatars as unknown as TableCellAttachment[])?.map(file => (
              <Carousel.Item key={file.attachmentToken}>
                {renderCardImage(file)}
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          (mentorAvatars as unknown as TableCellAttachment[])?.map(file =>
            renderCardImage(file),
          )
        )}
      </div>
    );
  }

  render() {
    const {
      activityId,
      id,
      title,
      mentors,
      mentorAvatars,
      startTime,
      endTime,
      ...props
    } = this.props;

    return (
      <Card className="h-100">
        {this.renderAvatarImages()}

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
    );
  }
}
