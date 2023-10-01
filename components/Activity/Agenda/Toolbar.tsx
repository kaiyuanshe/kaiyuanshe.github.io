import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Button, Stack, StackProps } from 'react-bootstrap';
import ICalendarLink from 'react-icalendar-link';
import { TimeData } from 'web-utility';

import { Agenda } from '../../../models/Activity/Agenda';
import { API_Host, isServer } from '../../../models/Base';
import { i18n } from '../../../models/Base/Translation';
import userStore from '../../../models/Base/User';
import { QRCodeButton } from '../../Base/QRCodeButton';

const SessionBox = dynamic(() => import('../../Layout/SessionBox'), {
    ssr: false,
  }),
  { t } = i18n;

export interface AgendaToolbarProps
  extends Omit<StackProps, 'id' | 'title'>,
    Agenda {
  activityId: string;
  location: string;
  checked?: boolean;
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
    checked,
    children,
    ...props
  }) => (
    <Stack direction="horizontal" gap={3} {...props}>
      <Button
        size="sm"
        variant="success"
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

      <SessionBox>
        <QRCodeButton
          title="请该打卡点工作人员扫码"
          value={`${API_Host}/activity/${activityId}/agenda/${id}?user=${userStore.session?.id}`}
          disabled={checked}
        >
          打卡
        </QRCodeButton>
      </SessionBox>

      {children}
    </Stack>
  ),
);
