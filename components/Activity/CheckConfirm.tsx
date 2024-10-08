import { CheckEventInput } from '@kaiyuanshe/kys-service';
import { SpinnerButton } from 'idea-react';
import { computed, IReactionDisposer, reaction } from 'mobx';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { NewData } from 'mobx-restful';
import dynamic from 'next/dynamic';
import { Component } from 'react';

import { ActivityModel } from '../../models/Activity';
import { CheckEventModel } from '../../models/Activity/CheckEvent';
import { t } from '../../models/Base/Translation';
import userStore from '../../models/Base/User';

const SessionBox = dynamic(() => import('../Layout/SessionBox'), {
  ssr: false,
});

export interface CheckConfirmProps extends NewData<CheckEventInput> {
  user: number;
  store: CheckEventModel;
}

@observer
export class CheckConfirm extends Component<CheckConfirmProps> {
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

  async componentDidMount() {
    this.disposer = reaction(() => userStore.session, this.checkAuthorization);

    if (!this.props.user) return;

    if (await this.checkAuthorization()) this.handleCheck();
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

  handleCheck = async () => {
    const { store, ...meta } = this.props;

    await this.checkEventStore.updateOne(meta);

    alert(t('punch_in_successfully'));
  };

  render() {
    const { loading } = this;
    const { currentAuthorized } = this.activityStore.currentAgenda || {};

    return (
      <SessionBox>
        <SpinnerButton
          size="sm"
          variant="danger"
          loading={loading}
          disabled={!currentAuthorized}
          onClick={this.handleCheck}
        >
          {textJoin(t('confirm'), t('punch_in'))}
        </SpinnerButton>
      </SessionBox>
    );
  }
}
