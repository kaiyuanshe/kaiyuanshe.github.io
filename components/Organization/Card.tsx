import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { HTMLAttributes, PureComponent } from 'react';
import { Card, CardProps, Badge, Button, Image } from 'react-bootstrap';
import { text2color, Icon } from 'idea-react';

import { blobURLOf } from '../../models/Base';
import { Organization } from '../../models/Organization';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

export interface OrganizationCardProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>,
    Omit<Organization, 'id'>,
    CardProps {
  onSwitch?: (
    filter: Partial<Pick<Organization, 'type' | 'tags' | 'city'>>,
  ) => any;
}

@observer
export class OrganizationCard extends PureComponent<OrganizationCardProps> {
  @observable
  showQRC = false;

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
            onClick={() => (this.showQRC = !this.showQRC)}
          >
            <Icon name="chat-fill" />
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { name, logos, type, tags, summary, wechatName, onSwitch, ...props } =
      this.props;

    const logo = fileURLOf(logos);

    return (
      <Card {...props}>
        <Card.Img
          variant="top"
          style={{ height: '30vh', objectFit: 'contain' }}
          loading="lazy"
          src={blobURLOf(logos)}
          onError={({ currentTarget: image }) =>
            logo && !image.src.endsWith(logo) && (image.src = logo || '')
          }
        />
        <Card.Body>
          <Card.Title>
            {name}
            <Badge
              className="ms-2"
              bg={text2color(type as string, ['light'])}
              style={{ cursor: 'pointer' }}
              onClick={
                onSwitch &&
                (() =>
                  confirm(`确定筛选「${type}」类型的开源组织？`) &&
                  onSwitch({ type: type as string }))
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
                onClick={
                  onSwitch &&
                  (() =>
                    confirm(`确定筛选「${tag}」领域的开源组织？`) &&
                    onSwitch({ tags: [tag] }))
                }
              >
                {tag}
              </Badge>
            ))}
          </Card.Text>

          <Card.Text
            className="d-none d-sm-block text-wrap overflow-auto"
            style={{ minHeight: '5rem', maxHeight: '10rem' }}
          >
            {summary}
          </Card.Text>
        </Card.Body>

        <Card.Footer>
          {this.renderIcon()}

          {this.showQRC && (
            <Image
              fluid
              className="mt-2"
              src={`https://open.weixin.qq.com/qr/code?username=${wechatName}`}
            />
          )}
        </Card.Footer>
      </Card>
    );
  }
}
