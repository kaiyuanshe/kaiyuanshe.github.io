import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { Card } from 'react-bootstrap';

import { Agenda } from '../../../models/Activity/Agenda';
import { blobURLOf } from '../../../models/Base';
import { TimeRange } from '../../Base/TimeRange';
import { ActivityPeople } from '../People';
import styles from './Timeline.module.less';

export interface ForumTimelineProps {
  activityId: TableCellValue;
  agendas: Agenda[];
}

/**
 * @see {@link https://mdbootstrap.com/docs/standard/extended/timeline/#section-timeline-gradient-bg}
 */
const ForumTimeline: FC<ForumTimelineProps> = ({ activityId, agendas }) => (
  <div className={styles.timeline}>
    {agendas.map(
      ({ id, title, startTime, endTime, summary, mentors, mentorAvatars }) => (
        <div
          key={id as string}
          className={`position-relative ${styles.timelineItem} ${styles.right}`}
        >
          <Card>
            <Card.Body className="p-4">
              <h3 className="h5">
                <a
                  className="text-decoration-none stretched-link"
                  href={`/activity/${activityId}/agenda/${id}`}
                >
                  {title as string}
                </a>
              </h3>
              <span className="small text-muted">
                <TimeRange {...{ startTime, endTime }} />
              </span>
              <ActivityPeople
                names={mentors as string[]}
                avatars={(mentorAvatars as TableCellValue[])?.map(file =>
                  blobURLOf([file] as TableCellValue),
                )}
              />
              <p className="mt-2 mb-0">{summary as string}</p>
            </Card.Body>
          </Card>
        </div>
      ),
    )}
  </div>
);
export default ForumTimeline;
