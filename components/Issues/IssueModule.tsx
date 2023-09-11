import { marked } from 'marked';
import { FC, useState } from 'react';
import { Card, Collapse, ListGroup, Row } from 'react-bootstrap';

import type { Issue } from '../../models/Repository';

interface IssueModuleProps {
  title: string;
  issues: Issue[];
}

const IssueModule: FC<IssueModuleProps> = ({ title, issues }) => {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <Card className="p-0" bg="light" text="dark">
      <Card.Header as="h3" onClick={() => setIsExpand(!isExpand)}>
        {title}
      </Card.Header>

      <Collapse in={isExpand}>
        <Card.Body>
          <Row xs={1} sm={2} xl={2}>
            {issues.map(({ title: issue_title, body, html_url }) => (
              <div key={issue_title} style={{ padding: '10px' }}>
                <Card className="p-0 h-100" bg="light" text="dark">
                  <Card.Header>
                    <a
                      href={html_url}
                      className="text-decoration-none text-secondary text-truncation-lines"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {issue_title}
                    </a>
                  </Card.Header>
                  <Card.Body>
                    <article
                      dangerouslySetInnerHTML={{
                        __html: marked((body as string) || ''),
                      }}
                    />
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Row>
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default IssueModule;
