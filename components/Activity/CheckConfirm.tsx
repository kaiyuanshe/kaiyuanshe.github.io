import { CheckEventInput } from '@kaiyuanshe/kys-service';
import { SpinnerButton } from 'idea-react';
import {
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from 'mobx';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';

import { ActivityModel } from '../../models/Activity';
import { CheckEventModel } from '../../models/Activity/CheckEvent';
import userStore from '../../models/Base/User';

const SessionBox = dynamic(() => import('../Layout/SessionBox'), {
  ssr: false,
});

export interface CheckConfirmProps extends CheckEventInput {
  mobilePhone: string;
  store: CheckEventModel;
}

@observer
export class CheckConfirm extends PureComponent<CheckConfirmProps> {
  activityStore = new ActivityModel();
  checkEventStore = this.props.store;

  @computed
  get loading() {
    const { downloading, currentAgenda } = this.activityStore,
      { uploading } = this.checkEventStore;
    const { downloading: aDownloading = 0 } = currentAgenda || {};

    return downloading > 0 || aDownloading > 0 || uploading > 0;
  }

  private disposer?: IReactionDisposer;

  componentDidMount() {
    this.disposer = reaction(() => userStore.session, this.checkAuthorization);

    if (this.props.mobilePhone) this.checkAuthorization();
  }

  componentWillUnmount() {
    this.disposer?.();
  }

  checkAuthorization = async () => {
    const { session } = userStore,
      { activityId, agendaTitle } = this.props;

    if (!session) return;

    await this.activityStore.getOne(activityId);

    return this.activityStore.currentAgenda!.checkAuthorization(
      agendaTitle,
      session.mobilePhone,
    );
  };

  render() {
    const { props, loading } = this;
    const { mobilePhone, ...meta } = props,
      { currentAuthorized } = this.activityStore.currentAgenda || {};

    return (
      <SessionBox>
        <SpinnerButton
          size="sm"
          variant="danger"
          loading={loading}
          disabled={!currentAuthorized}
          onClick={() => this.checkEventStore.updateOne(meta)}
        >
          确认打卡
        </SpinnerButton>
      </SessionBox>
    );
  }
}
