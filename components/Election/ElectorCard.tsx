import { marked } from 'marked';
import { FC, useContext } from 'react';
import { Accordion, Badge, Card, CardProps } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { I18nContext } from '../../models/Base/Translation';
import { Personnel } from '../../models/Personnel';
import { LarkImage } from '../Base/LarkImage';

export interface ElectorCardProps extends CardProps, Omit<Personnel, 'id'> {
  order?: number;
}

export const ElectorCard: FC<ElectorCardProps> = ({
  style,
  createdAt,
  recipient,
  recipientAvatar,
  applicants,
  department,
  position,
  award,
  reason,
  contribution,
  proposition,
  recommenders,
  recommendation1,
  recommendation2,
  approvers,
  rejecters,
  passed,
  order,
  ...props
}) => {
  const { t } = useContext(I18nContext);

  return (
    <Card
      {...props}
      style={{
        ...style,
        contentVisibility: 'auto',
        containIntrinsicHeight: '42rem',
      }}
    >
      <Card.Header className="d-flex justify-content-between">
        <time dateTime={new Date(createdAt as number).toJSON()}>
          {formatDate(createdAt as number, 'YYYY-MM-DD')}
        </time>
        {(applicants as string[])?.[0] && (
          <span>
            {(applicants as string[]).join(', ')} {t('nominated')}
          </span>
        )}
      </Card.Header>

      <LarkImage
        className="card-img-top object-fit-contain"
        style={{ height: '20rem' }}
        src={recipientAvatar}
      />
      <Card.Body className="position-relative">
        <Card.Title as="h3">
          <a
            className="stretched-link text-decoration-none"
            href={`/election/${new Date(createdAt as string).getFullYear()}/candidate/${recipient}/poster/${position}`}
          >
            {recipient as string}
          </a>
        </Card.Title>
        <Card.Subtitle>
          {award
            ? `${t('grant')} ${award as string}`
            : `${t('take_charge_of')} ${department as string} ${position as string}`}
        </Card.Subtitle>
      </Card.Body>

      <Accordion flush>
        {[
          { title: t('nomination_reason'), content: reason as string },
          {
            title: t('previous_term_contribution'),
            content: contribution as string,
          },
          { title: t('this_term_proposition'), content: proposition as string },
          {
            title: `${applicants} ${t('recommendation')}`,
            content: recommendation1 as string,
          },
          {
            title: `${recommenders} ${t('recommendation')}`,
            content: recommendation2 as string,
          },
        ].map(
          ({ title, content }) =>
            content && (
              <Accordion.Item key={title} eventKey={title}>
                <Accordion.Header>{title}</Accordion.Header>

                <Accordion.Body
                  className="overflow-auto"
                  style={{ maxHeight: '20rem' }}
                  dangerouslySetInnerHTML={{ __html: marked(content) }}
                />
              </Accordion.Item>
            ),
        )}
      </Accordion>

      <Card.Footer
        as="ul"
        className="list-unstyled d-flex justify-content-between align-items-center"
      >
        <li className="text-success">
          ✔ <strong>{(approvers as string[])?.length}</strong>
        </li>
        {passed && (
          <Badge as="li" bg="info">
            {order}
          </Badge>
        )}
        <li className="text-danger">
          ❌ <strong>{(rejecters as string[])?.length}</strong>
        </li>
      </Card.Footer>
    </Card>
  );
};
