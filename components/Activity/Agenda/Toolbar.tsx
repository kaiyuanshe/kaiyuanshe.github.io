import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { Button, Stack, StackProps } from 'react-bootstrap';
import ICalendarLink from 'react-icalendar-link';
import { TimeData } from 'web-utility';

import { Agenda } from '../../../models/Activity/Agenda';
import { I18nContext } from '../../../models/Base/Translation';
import { isServer } from '../../../utility/configuration';

export interface AgendaToolbarProps extends Omit<StackProps, 'id' | 'title'>, Agenda {
  activityId: string;
}

const AgendaToolbar: FC<AgendaToolbarProps> = observer(
  ({
    activityId,
    location,
    id,
    title,
    summary,
    startTime,
    endTime,
    mentors,
    children,
    ...props
  }) => {
    const { t } = useContext(I18nContext);

    return (
      <Stack direction="horizontal" gap={3} {...props}>
        <Button
          size="sm"
          variant="success"
          href={`/activity/${activityId}/agenda/${id}/invitation`}
        >
          {t('share')}
        </Button>

        {!isServer() && (
          // @ts-expect-error https://github.com/josephj/react-icalendar-link/issues/41#issuecomment-1584173370
          <ICalendarLink
            className="btn btn-primary btn-sm"
            filename={`${title}.ics`}
            event={{
              title: title as string,
              description: summary as string,
              startTime: new Date(startTime as TimeData).toJSON(),
              endTime: new Date(endTime as TimeData).toJSON(),
              location: location as string,
              attendees: mentors as string[],
              url: `https://kaiyuanshe.cn/activity/${activityId}/agenda/${id}`,
            }}
          >
            {t('calendar')}
          </ICalendarLink>
        )}

        {children}
      </Stack>
    );
  },
);
export default AgendaToolbar;
