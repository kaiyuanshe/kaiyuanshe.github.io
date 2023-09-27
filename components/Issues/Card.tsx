import { Icon, Nameplate, text2color } from 'idea-react';
import { marked } from 'marked';
import { FC } from 'react';
import { Badge, Card, CardProps, Stack } from 'react-bootstrap';

import { Issue } from '../../models/Repository';

export type IssueCardProps = Issue & Omit<CardProps, 'id' | 'body'>;

export const IssueCard: FC<IssueCardProps> = ({
  bg = 'light',
  text = 'dark',
  id,
  number,
  title,
  labels,
  body,
  html_url,
  user,
  comments,
  created_at,
  ...props
}) => (
  <Card {...{ ...props, bg, text }}>
    <Card.Header
      as="h4"
      className="d-flex justify-content-between align-items-center gap-3"
    >
      <a
        className="text-decoration-none text-secondary text-truncate"
        title={title}
        href={html_url}
        target="_blank"
        rel="noreferrer"
      >
        #{number} {title}
      </a>
      <Stack direction="horizontal" gap={2}>
        {labels.map(
          label =>
            typeof label === 'object' && (
              <Badge
                key={label.name}
                className="fs-6"
                {...(label.color
                  ? {
                      bg: '',
                      style: { background: `#${label.color}` },
                    }
                  : {
                      bg: text2color(label.name || '', ['light']),
                    })}
              >
                {label.name}
              </Badge>
            ),
        )}
      </Stack>
    </Card.Header>
    <Card.Body
      as="article"
      dangerouslySetInnerHTML={{ __html: marked(body || '') }}
    />
    <Card.Footer className="d-flex justify-content-between align-items-center">
      {user && <Nameplate name={user.name || ''} avatar={user.avatar_url} />}

      <Stack direction="horizontal" gap={2}>
        <Icon name="chat-left-text" />
        {comments}
      </Stack>

      <time dateTime={created_at}>{new Date(created_at).toLocaleString()}</time>
    </Card.Footer>
  </Card>
);
