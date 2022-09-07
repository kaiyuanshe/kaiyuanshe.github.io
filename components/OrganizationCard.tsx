import { Card, CardProps, Badge, Button } from 'react-bootstrap';
import { text2color, Icon } from 'idea-react';
import type { TableCellMedia } from 'lark-ts-sdk';

import { Organization } from '../models/Organization';

export type OrganizationCardProps = Omit<Organization, 'id'> & CardProps;

export function OrganizationCard({
  name,
  logos,
  type,
  tags,
  summary,
  email,
  link,
  codeLink,
  wechatName,
  ...props
}: OrganizationCardProps) {
  const logo =
    logos instanceof Array &&
    logos[0] &&
    `/api/lark/file/${(logos[0] as TableCellMedia).file_token}`;

  return (
    <Card {...props}>
      <Card.Img
        variant="top"
        style={{ height: '30vh', objectFit: 'contain' }}
        loading="lazy"
        src={`https://communitymap01.blob.core.chinacloudapi.cn/$web/${(
          name + ''
        ).replace(/\s+/g, '-')}.png`}
        onError={({ currentTarget: image }) => (image.src = logo || '')}
      />
      <Card.Body>
        <Card.Title>
          {name}{' '}
          <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>
        </Card.Title>
        <Card.Text className="text-end">
          {(tags as string[])?.map(tag => (
            <Badge key={tag} bg={text2color(tag, ['light'])} className="me-2">
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
            href={`https://open.weixin.qq.com/qr/code?username=${wechatName}`}
          >
            <Icon name="chat-fill" />
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}
