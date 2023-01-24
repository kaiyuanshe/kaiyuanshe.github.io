import { Icon, text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { Elector } from '../../models/Elector';
import { i18n } from '../../models/Translation';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

const { t } = i18n;

export interface ElectorCardProps extends Elector {
  className?: string;
  href?: string;
}

@observer
export class ElectorCard extends PureComponent<ElectorCardProps> {
  renderItem(label: Parameters<typeof t>[0], tags: string[] | null) {
    return (
      tags?.[0] && (
        <li className="my-2 d-flex align-items-center">
          <span className="text-nowrap flex-fill">{t(label)}</span>
          <span className="text-end">
            {tags.map(tag => (
              <Badge className="ms-2" key={tag} bg={text2color(tag, ['light'])}>
                {tag}
              </Badge>
            ))}
          </span>
        </li>
      )
    );
  }

  renderVote(positive = 0, negative = 0, sum = 0) {
    return (
      <>
        <Icon name="ticket-perforated-fill" />
        <strong className="text-success mx-2">{positive}</strong>-
        <strong className="text-danger mx-2">{negative}</strong>=
        <strong className="text-primary mx-2">{sum}</strong>
      </>
    );
  }

  render() {
    const {
      className,
      href,
      name,
      gender,
      photo,
      lastLevel,
      lastCommittee,
      lastWorkGroup,
      lastProjectGroup,
      electionTarget,
      councilPositiveVoteCount,
      councilNegativeVoteCount,
      regularPositiveVoteCount,
      regularNegativeVoteCount,
      councilVoteCount,
      regularVoteCount,
    } = this.props;

    return (
      <Card className={className}>
        {photo && (
          <Card.Img
            variant="top"
            className="object-fit-cover"
            style={{ objectPosition: 'top center', maxHeight: '20rem' }}
            loading="lazy"
            src={fileURLOf(photo)}
          />
        )}
        <Card.Body>
          <Card.Title as="h3">
            {href ? (
              <a className="text-decoration-none stretched-link" href={href}>
                {name}
              </a>
            ) : (
              name
            )}
            <Icon
              className={`ms-2 small text-${
                gender === '女' ? 'danger' : 'primary'
              }`}
              name={`gender-${gender === '女' ? 'female' : 'male'}`}
            />
          </Card.Title>

          <ul className="list-unstyled">
            <li className="my-2 d-flex align-items-center">
              <span className="text-nowrap flex-fill">{t('last_level')}</span>

              <Badge bg={text2color(lastLevel + '', ['light'])}>
                {lastLevel}
              </Badge>
            </li>
            {this.renderItem('last_committee', lastCommittee as string[])}
            {this.renderItem('last_work_group', lastWorkGroup as string[])}
            {this.renderItem(
              'last_project_group',
              lastProjectGroup as string[],
            )}
          </ul>
        </Card.Body>
        <Card.Footer className="text-center">
          {electionTarget === '理事'
            ? this.renderVote(
                +councilPositiveVoteCount!,
                +councilNegativeVoteCount!,
                +councilVoteCount!,
              )
            : this.renderVote(
                +regularPositiveVoteCount!,
                +regularNegativeVoteCount!,
                +regularVoteCount!,
              )}
        </Card.Footer>
      </Card>
    );
  }
}
