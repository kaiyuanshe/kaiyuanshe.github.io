import { Card, Badge, Button } from 'react-bootstrap';
import { Icon } from 'idea-react';

import { text2color } from './utility';
import { Organization } from '../pages/api/organization';

export const OrganizationCard = ({
  name,
  logos,
  type,
  tags,
  summary,
  email,
  link,
  codeLink,
  wechatName,
}: Organization) => (
  <Card className="text-start">
    <Card.Img
      variant="top"
      style={{ height: '30vh', objectFit: 'contain' }}
      src={
        (logos instanceof Array
          ? logos[0]?.link
          : logos && (logos as string).split(/\s+/)[0]) || ''
      }
    />
    <Card.Body>
      <Card.Title>
        {name} <Badge bg={text2color(type as string)}>{type}</Badge>
      </Card.Title>
      <Card.Text className="text-end">
        {(tags as string)?.split(',').map(tag => (
          <Badge key={tag} bg={text2color(tag)} className="me-2">
            {tag}
          </Badge>
        ))}
      </Card.Text>
      <Card.Text>{(summary as string)?.slice(0, 100)}</Card.Text>
    </Card.Body>
    <Card.Footer className="d-flex justify-content-around">
      {email && (
        <Button
          title="E-mail"
          size="sm"
          variant="warning"
          href={`mailto:${email}`}
        >
          <Icon name="mailbox2" />
        </Button>
      )}
      {link && (
        <Button title="WWW" size="sm" target="_blank" href={link as string}>
          <Icon name="globe2" />
        </Button>
      )}
      {codeLink && (
        <Button
          title="Git"
          size="sm"
          variant="dark"
          target="_blank"
          href={codeLink as string}
        >
          <Icon name="github" />
        </Button>
      )}
      {wechatName && (
        <Button
          title="WeChat"
          size="sm"
          variant="success"
          target="_blank"
          href={`https://weixin.sogou.com/weixin?type=1&query=${wechatName}`}
        >
          <Icon name="chat-fill" />
        </Button>
      )}
    </Card.Footer>
  </Card>
);
