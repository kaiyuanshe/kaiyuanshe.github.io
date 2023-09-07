import { OverlayBox } from 'idea-react';
import { FC } from 'react';
import { Card } from 'react-bootstrap';

import type { Issue } from '../../models/Repository';
import styles from './IssueCard.module.less';
interface IssueCardProps {
  issue: Issue;
}

const IssueCard: FC<IssueCardProps> = ({
  issue: { title, body, html_url },
}) => {
  return (
    <Card.Title className="m-0">
      <OverlayBox title={title} detail={body} placement="bottom">
        <a
          className={styles.link}
          href={html_url}
          target="_blank"
          rel="noreferrer"
        >
          {title}
        </a>
      </OverlayBox>
    </Card.Title>
  );
};

export default IssueCard;
