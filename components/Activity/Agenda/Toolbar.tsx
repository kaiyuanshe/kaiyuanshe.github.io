import { OverlayBox } from 'idea-react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';
import { Button, Stack, StackProps } from 'react-bootstrap';
import ICalendarLink from 'react-icalendar-link';
import { TimeData } from 'web-utility';

import { Agenda } from '../../../models/Activity/Agenda';
import { API_Host, isServer } from '../../../models/Base';
import { i18n } from '../../../models/Base/Translation';
import userStore from '../../../models/Base/User';

const SessionBox = dynamic(() => import('../../Layout/SessionBox'), {
    ssr: false,
  }),
  { t } = i18n;

export interface AgendaToolbarProps
  extends Omit<StackProps, 'id' | 'title'>,
    Agenda {
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
        <OverlayBox
          trigger="click"
          placement="bottom"
          title="请该打卡点工作人员扫码"
          detail={
            <QRCodeCanvas
              className="d-block m-auto"
              value={`${API_Host}/activity/${activityId}/agenda/${id}?mobilePhone=${userStore.session?.mobilePhone}`}
            />
          }
        >
          <Button size="sm" variant="warning">
            打卡
          </Button>
        </OverlayBox>
      </SessionBox>

      {children}
    </Stack>
  ),
);
