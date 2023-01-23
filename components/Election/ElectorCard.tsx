import { Icon, text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Badge, Card } from 'react-bootstrap';

import { Elector } from '../../models/Elector';
import { i18n } from '../../models/Translation';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

const { t } = i18n;

export interface ElectorCardProps extends Elector {
  className?: string;
}

export const ElectorCard: FC<ElectorCardProps> = observer(
  ({
    className,
    name,
    gender,
    photo,
    lastLevel,
    lastCommittee,
    lastWorkGroup,
    lastProjectGroup,
  }) => (
    <Card className={className}>
      {photo && (
        <Card.Img
          variant="top"
          className="object-fit-cover"
          style={{ maxHeight: '20rem' }}
          src={fileURLOf(photo)}
        />
      )}
      <Card.Body>
        <Card.Title as="h3">
          {name}

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
          {(lastCommittee as string[])?.[0] && (
            <li className="my-2 d-flex align-items-center">
              <span className="text-nowrap flex-fill">
                {t('last_committee')}
              </span>
              <span className="text-end">
                {(lastCommittee as string[]).map(committee => (
                  <Badge
                    className="ms-2"
                    key={committee}
                    bg={text2color(committee, ['light'])}
                  >
                    {committee}
                  </Badge>
                ))}
              </span>
            </li>
          )}
          {(lastWorkGroup as string[])?.[0] && (
            <li className="my-2 d-flex align-items-center">
              <span className="text-nowrap flex-fill">
                {t('last_work_group')}
              </span>
              <span className="text-end">
                {(lastWorkGroup as string[]).map(workGroup => (
                  <Badge
                    className="ms-2"
                    key={workGroup}
                    bg={text2color(workGroup, ['light'])}
                  >
                    {workGroup}
                  </Badge>
                ))}
              </span>
            </li>
          )}
          {(lastProjectGroup as string[])?.[0] && (
            <li className="my-2 d-flex align-items-center">
              <span className="text-nowrap flex-fill">
                {t('last_project_group')}
              </span>
              <span className="text-end">
                {(lastProjectGroup as string[]).map(projectGroup => (
                  <Badge
                    className="ms-2"
                    key={projectGroup}
                    bg={text2color(projectGroup, ['light'])}
                  >
                    {projectGroup}
                  </Badge>
                ))}
              </span>
            </li>
          )}
        </ul>
      </Card.Body>
    </Card>
  ),
);
