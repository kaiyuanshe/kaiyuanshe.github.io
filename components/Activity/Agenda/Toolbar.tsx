import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button } from 'react-bootstrap';
import ICalendarLink from 'react-icalendar-link';
import { TimeData } from 'web-utility';

import { Agenda } from '../../../models/Activity/Agenda';
import { isServer } from '../../../models/Base';
import { i18n } from '../../../models/Base/Translation';

const { t } = i18n;

export interface AgendaToolbarProps extends Agenda {
  activityId: string;
  location: string;
}

export const AgendaToolbar: FC<AgendaToolbarProps> = observer(
  ({
    activityId,
    location,
    id,
    title,
    summary,
    startTime,
    endTime,
    mentors,
  }) => (
    <div className="d-flex gap-3">
      <Button
        size="sm"
        variant="warning"
        href={`/activity/${activityId}/agenda/${id}/invitation`}
      >
        {t('share')}
      </Button>

      {!isServer() && (
        <ICalendarLink
          className="btn btn-primary btn-sm"
          filename={`${title}.ics`}
          event={{
            title: title as string,
            description: summary as string,
            startTime: new Date(startTime as TimeData).toJSON(),
            endTime: new Date(endTime as TimeData).toJSON(),
            location,
            attendees: mentors as string[],
          }}
        >
          {t('calendar')}
        </ICalendarLink>
      )}
    </div>
  ),
);
