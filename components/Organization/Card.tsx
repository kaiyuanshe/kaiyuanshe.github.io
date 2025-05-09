import { Icon } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { HTMLAttributes } from 'react';
import { Button, Card, CardProps, Image } from 'react-bootstrap';

import { i18n, I18nContext } from '../../models/Base/Translation';
import { Organization } from '../../models/Community/Organization';
import { LarkImage } from '../Base/LarkImage';
import { TagNav } from '../Base/TagNav';

export interface OrganizationCardProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>,
    Omit<Organization, 'id'>,
    CardProps {
  onSwitch?: (filter: Partial<Pick<Organization, 'type' | 'tags' | 'city'>>) => any;
}

@observer
export class OrganizationCard extends ObservedComponent<OrganizationCardProps, typeof i18n> {
  static contextType = I18nContext;

  @observable
  accessor showQRC = false;

  renderIcon() {
    const { email, link, codeLink, wechatName } = this.props;

    return (
      <div className="d-flex justify-content-around">
        {email && (
          <Button title="E-mail" size="sm" variant="warning" href={`mailto:${email}`}>
            <Icon name="mailbox2" />
          </Button>
        )}
        {link && (
          <Button title="WWW" size="sm" target="_blank" href={link as string}>
            <Icon name="globe2" />
          </Button>
        )}
        {codeLink && (
          <Button title="Git" size="sm" variant="dark" target="_blank" href={codeLink as string}>
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
    const { t } = this.observedContext,
      { name, logos, type, tags, summary, wechatName, onSwitch, ...props } = this.props;

    return (
      <Card
        {...props}
        style={{
          ...props.style,
          contentVisibility: 'auto',
          containIntrinsicHeight: '36rem',
        }}
      >
        <LarkImage
          className="card-img-top object-fit-contain"
          style={{ height: '30vh' }}
          src={logos}
        />
        <Card.Body>
          <Card.Title>
            {name as string}
            <TagNav
              className="ms-2"
              list={[type as string]}
              onCheck={
                onSwitch &&
                (() =>
                  confirm(t('confirm_community_type_filter', { type })) &&
                  onSwitch({ type: type as string }))
              }
            />
          </Card.Title>

          {tags && (
            <TagNav
              className="justify-content-end"
              list={tags as string[]}
              onCheck={
                onSwitch &&
                (tag =>
                  confirm(t('confirm_community_tag_filter', { tag })) && onSwitch({ tags: [tag] }))
              }
            />
          )}
          <Card.Text
            className="d-none d-sm-block text-wrap overflow-auto"
            style={{ minHeight: '5rem', maxHeight: '10rem' }}
          >
            {summary as string}
          </Card.Text>
        </Card.Body>

        <Card.Footer>
          {this.renderIcon()}

          {this.showQRC && (
            <Image
              className="mt-2"
              src={`https://open.weixin.qq.com/qr/code?username=${wechatName}`}
              alt={wechatName as string}
              fluid
            />
          )}
        </Card.Footer>
      </Card>
    );
  }
}
