import { FC } from 'react';
import { Card, OverlayTrigger,Popover, Row } from 'react-bootstrap';

import styles from './IssueCard.module.less';
interface IssueCardProps {
  issue: any;
}

const IssueCard: FC<IssueCardProps> = ({ issue }) => {
  const popover = () => {
    if (issue.body) {
      return (
        <Popover id={issue.id}>
          <Popover.Header as="h3">
            <a className={styles.my_a} href={issue.html_number} target="_blank" rel="noreferrer">
              {issue.title}
            </a>
          </Popover.Header>
          <Popover.Body>{issue.body}</Popover.Body>
        </Popover>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div>
      <Card.Title>
        <OverlayTrigger placement="top" overlay={popover()}>
          <a className={styles.my_a} href={issue.html_url} target="_blank" rel="noreferrer">
            {issue.title}
          </a>
        </OverlayTrigger>
      </Card.Title>
    </div>
  );
};

export default IssueCard;
