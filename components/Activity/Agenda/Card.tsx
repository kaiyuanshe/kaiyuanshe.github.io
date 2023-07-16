import { text2color } from 'idea-react';
import { TableCellAttachment } from 'mobx-lark';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Badge, Card, Carousel } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import { AgendaToolbar, AgendaToolbarProps } from './Toolbar';

@observer
export class AgendaCard extends Component<AgendaToolbarProps> {
  renderCardImage = (file: TableCellAttachment) => (
    <Card.Img
      key={file.attachmentToken}
      className="m-auto object-fit-cover"
      style={{ height: '25rem' }}
      loading="lazy"
      src={blobURLOf([file])}
    />
  );

  renderAvatarImages() {
    const { mentorAvatars } = this.props;

    return (
      <>
        {(mentorAvatars as TableCellAttachment[])?.[1] ? (
          <Carousel className="w-100">
            {(mentorAvatars as TableCellAttachment[]).map(file => (
              <Carousel.Item key={file.attachmentToken}>
                {this.renderCardImage(file)}
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          (mentorAvatars as TableCellAttachment[])?.map(file =>
            this.renderCardImage(file),
          )
        )}
      </>
    );
  }

  render() {
    const { activityId, id, type, title, mentors, startTime, endTime } =
      this.props;

    return (
      <Card className="h-100">
        {this.renderAvatarImages()}

        <Card.Body className="d-flex flex-column justify-content-end">
          <Card.Title as="h3" className="h5 d-flex align-items-center gap-2">
            <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>
            <a
              className="text-decoration-none text-secondary text-truncate"
              href={`/activity/${activityId}/agenda/${id}`}
              title={title as string}
            >
              {title}
            </a>
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
          <AgendaToolbar {...{ ...this.props, activityId }} />
        </Card.Footer>
      </Card>
    );
  }
}
