import { text2color } from 'idea-react';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import { OKR } from '../../models/Governance/OKR';

export const OKRCard: FC<OKR> = observer(
  ({
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
    </Card>
  ),
);
