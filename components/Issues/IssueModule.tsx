import { marked } from 'marked';
import { FC, useState } from 'react';
import { Card, Col, Collapse, Row } from 'react-bootstrap';

import type { Issue } from '../../models/Repository';
import styles from './IssueModule.module.less';

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
        <Card.Body as={Row} xs={1} sm={2} xl={2} className="g-2">
          {issues.map(({ title, body, html_url }) => (
            <Col key={title}>
              <Card className="h-100" bg="light" text="dark">
                <Card.Header
                  as="a"
                  href={html_url}
                  className="text-decoration-none text-secondary text-truncation-lines"
                  target="_blank"
                  rel="noreferrer"
                >
                  {title}
                </Card.Header>
                <Card.Body
                  className={styles.fixImg}
                  dangerouslySetInnerHTML={{ __html: marked(body || '') }}
                />
              </Card>
            </Col>
          ))}
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default IssueModule;
