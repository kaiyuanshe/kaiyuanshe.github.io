import { OverlayBox } from 'idea-react';
import { FC } from 'react';
import { Card } from 'react-bootstrap';

import styles from './IssueCard.module.less';
interface IssueCardProps {
  issue: any;
}

const IssueCard: FC<IssueCardProps> = ({ issue }) => {
  const args = {
    title: issue.title,
    detail: issue.body,
  };

  return (
    <div>
      <Card.Title className={styles.margin0}>
        <OverlayBox {...args} placement="top">
          <a
            className={styles.link}
            href={issue.html_url}
            target="_blank"
            rel="noreferrer"
          >
            {issue.title}
          </a>
        </OverlayBox>
      </Card.Title>
    </div>
  );
};

export default IssueCard;
