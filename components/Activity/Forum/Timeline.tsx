import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { Chrono } from 'react-chrono';

import { Agenda } from '../../../models/Activity/Agenda';
import { blobURLOf } from '../../../models/Base';
import { TimeRange } from '../../Base/TimeRange';

export interface ForumTimelineProps {
  activityId: TableCellValue;
  agendas: Agenda[];
}

const ForumTimeline: FC<ForumTimelineProps> = ({ activityId, agendas }) => (
  <Chrono
    items={agendas.map(
      ({ id, title, summary, startTime, endTime, mentorAvatars }) => ({
        title: <TimeRange {...{ startTime, endTime }} />,
        cardTitle: title,
        url: `/activity/${activityId}/agenda/${id}`,
        cardDetailedText: summary,
        media: {
          type: 'IMAGE',
          source: { url: blobURLOf(mentorAvatars) },
        },
      }),
    )}
    mode="VERTICAL_ALTERNATING"
    disableToolbar
  />
);
export default ForumTimeline;
