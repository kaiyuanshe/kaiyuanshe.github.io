import { FC, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

import type { Issue } from '../../models/Repository';
import IssueCard from './IssueCard';

interface IssueModuleProps {
  title: string;
  issues: Issue[];
}

const IssueModule: FC<IssueModuleProps> = ({ title, issues }) => {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <Card bg="light" text="dark" style={{ padding: 0 }}>
      <Card.Header onClick={() => setIsExpand(!isExpand)}>{title}</Card.Header>

      {isExpand ? (
        <ListGroup variant="flush">
          {issues.map(issue => (
            <ListGroup.Item key={issue.title} variant="secondary">
              <IssueCard issue={issue}></IssueCard>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : null}
    </Card>
  );
};

export default IssueModule;
