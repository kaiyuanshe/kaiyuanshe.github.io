import { text2color } from 'idea-react';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { t } from '../../models/Base/Translation';
import { OKR } from '../../models/Governance/OKR';

export const OKRCard: FC<OKR> = observer(
  ({
    createdAt,
    department,
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

      <Card.Body className="overflow-auto" style={{ maxHeight: '25rem' }}>
        <Card.Title as="h4">{t('key_results')}</Card.Title>
        <Card.Text>
          <ol>
            {[firstResult, secondResult, thirdResult].map(
              result => result && <li key={result + ''}>{result + ''}</li>,
            )}
          </ol>
        </Card.Text>
        <Card.Title as="h4">{textJoin(t('quarterly'), t('plan'))}</Card.Title>
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
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <time dateTime={new Date(createdAt as number).toJSON()}>
          {formatDate(createdAt as number)}
        </time>
        <Badge bg={text2color(department + '', ['light'])}>
          {department + ''}
        </Badge>
      </Card.Footer>
    </Card>
  ),
);
