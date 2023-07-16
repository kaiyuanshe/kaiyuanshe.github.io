import { FC } from 'react';
import { Badge, Card, CardProps } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { Personnel } from '../../models/Personnel';
import { i18n } from '../../models/Translation';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

const { t } = i18n;

export interface ElectorCardProps extends CardProps, Omit<Personnel, 'id'> {
  order: number;
}

export const ElectionCard: FC<ElectorCardProps> = ({
  createdAt,
  recipient,
  recipientAvatar,
  applicants,
  department,
  position,
  award,
  reason,
  approvers,
  rejecters,
  passed,
  order,
  ...props
}) => (
  <Card {...props}>
    <Card.Header className="d-flex justify-content-between">
      <time dateTime={new Date(createdAt as number).toJSON()}>
        {formatDate(createdAt as number, 'YYYY-MM-DD')}
      </time>
      <span>{(applicants as string[])?.join('、')} 提名</span>
    </Card.Header>

    <Card.Img
      className="rounded-0"
      loading="lazy"
      src={fileURLOf(recipientAvatar)}
    />
    <Card.Body>
      <Card.Title as="h3">
        <a
          className="stretched-link text-decoration-none"
          href={`/person/${recipient}`}
        >
          {recipient}
        </a>
      </Card.Title>
      <Card.Subtitle>
        {award ? (
          <>
            授予
            <span>{award}</span>
          </>
        ) : (
          <>
            担任
            <span>{department}</span>
            <span>{position}</span>
          </>
        )}
      </Card.Subtitle>
      <hr />
      <h4 className="fs-5">提名理由</h4>

      <Card.Text>{reason}</Card.Text>
    </Card.Body>

    <Card.Footer
      as="ul"
      className="list-unstyled d-flex justify-content-between align-items-center"
    >
      <li className="text-success">
        ✔ <strong>{(approvers as string[])?.length || 0}</strong>
      </li>
      {passed && (
        <Badge as="li" bg="info">
          {order}
        </Badge>
      )}
      <li className="text-danger">
        ❌ <strong>{(rejecters as string[])?.length || 0}</strong>
      </li>
    </Card.Footer>
  </Card>
);
