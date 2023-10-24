import { Icon, text2color } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HTMLAttributes, PureComponent } from 'react';
import { Badge, Button, Card, CardProps, Image } from 'react-bootstrap';

import { Organization } from '../../models/Community/Organization';
import { LarkImage } from '../Base/LarkImage';

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
  constructor(props: OrganizationCardProps) {
    super(props);
    makeObservable(this);
  }

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

    return (
      <Card {...props}>
        <LarkImage
          className="card-img-top object-fit-contain"
          style={{ height: '30vh' }}
          src={logos}
        />
        <Card.Body>
          <Card.Title>
            {name}
            <Badge
              className="ms-2"
              bg={text2color(type + '', ['light'])}
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

          <Card.Text className="d-flex flex-wrap justify-content-end gap-2">
            {(tags as string[])?.map(tag => (
              <Badge
                key={tag}
                bg={text2color(tag, ['light'])}
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
              alt={wechatName as string}
            />
          )}
        </Card.Footer>
      </Card>
    );
  }
}
