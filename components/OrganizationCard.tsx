import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Card, CardProps, Badge, Button } from 'react-bootstrap';
import { text2color, Icon } from 'idea-react';
import { QRCodeSVG } from 'qrcode.react';
import type { TableCellMedia } from 'lark-ts-sdk';

import { Organization } from '../models/Organization';

export interface OrganizationCardProps
  extends Omit<Organization, 'id'>,
    CardProps {
  onSwitch?: (filter: Partial<Record<'type' | 'tag', string>>) => any;
}

@observer
export class OrganizationCard extends PureComponent<OrganizationCardProps> {
  @observable
  QRC_URI = '';

  renderQRC() {
    const { QRC_URI } = this;

    return (
      QRC_URI && <QRCodeSVG className="d-block mx-auto my-2" value={QRC_URI} />
    );
  }

  renderIcon() {
    const { email, link, codeLink, wechatName } = this.props;

    return (
      <div className="d-flex justify-content-around">
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
            onClick={() =>
              (this.QRC_URI = this.QRC_URI
                ? ''
                : `https://open.weixin.qq.com/qr/code?username=${wechatName}`)
            }
          >
            <Icon name="chat-fill" />
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { name, logos, type, tags, summary, onSwitch, ...props } = this.props;

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
            <Badge
              bg={text2color(type as string, ['light'])}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                confirm(`确定筛选「${type}」类型的开源组织？`) &&
                onSwitch?.({ type: type as string })
              }
            >
              {type}
            </Badge>
          </Card.Title>
          <Card.Text className="text-end">
            {(tags as string[])?.map(tag => (
              <Badge
                key={tag}
                bg={text2color(tag, ['light'])}
                className="me-2"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  confirm(`确定筛选「${tag}」领域的开源组织？`) &&
                  onSwitch?.({ tag })
                }
              >
                {tag}
              </Badge>
            ))}
          </Card.Text>
          <Card.Text className="overflow-auto" style={{ maxHeight: '10rem' }}>
            {summary}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          {this.renderIcon()}
          {this.renderQRC()}
        </Card.Footer>
      </Card>
    );
  }
}
