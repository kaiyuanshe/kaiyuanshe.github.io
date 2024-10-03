import { text2color } from 'idea-react';
import { FC } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { OKR } from '../../models/Governance/OKR';

export const OKRCard: FC<OKR> = ({
  object,
  firstResult,
  secondResult,
  thirdResult,
  planQ1,
  planQ2,
  planQ3,
  planQ4,
}) => (
  <Card>
    <Card.Header as="h3">{object?.toString()}</Card.Header>
    <Card.Body>
      <Card.Title as="h4">关键结果</Card.Title>
      <Card.Text>
        <ol>
          {[firstResult, secondResult, thirdResult].map(
            result => result && <li key={result + ''}>{result + ''}</li>,
          )}
        </ol>
      </Card.Text>
      <Card.Title as="h4">季度计划</Card.Title>
      <Card.Text>
        <ol className="list-unstyled">
          {[planQ1, planQ2, planQ3, planQ4].map((plan, index) => (
            <li key={index}>
              <Badge bg={text2color(`Q${index + 1}`, ['light'])}>
                Q{index + 1}
              </Badge>{' '}
              {plan?.toString()}
            </li>
          ))}
        </ol>
      </Card.Text>
    </Card.Body>
  </Card>
);
