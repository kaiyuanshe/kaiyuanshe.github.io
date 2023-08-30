import { FC, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import IssueCard from './IssueCard';

interface IssueModuleProps {
  title: string;
  issues: any;
}

const IssueModule: FC<IssueModuleProps> = ({ title, issues }) => {
  useEffect(() => {
    console.log('here==!!', title, issues);
  });
  return (
    <Card bg="light" text="dark" style={{ padding: 0 }}>
      <Card.Header>{title}</Card.Header>
      <ListGroup variant="flush">
        {issues.map((issue: any) => (
          <ListGroup.Item key={issue.title} variant="secondary">
            <IssueCard issue={issue}></IssueCard>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default IssueModule;
