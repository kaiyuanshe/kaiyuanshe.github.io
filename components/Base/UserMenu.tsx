import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import userStore from '../../models/Base/User';
import SessionBox from '../Layout/SessionBox';

const UserMenu: FC = observer(() => {
  const { id, mobilePhone, nickName } = userStore.session || {};

  return id ? (
    <DropdownButton title={nickName || mobilePhone}>
      <Dropdown.Item href={`/user/${id}`}>
        {t('Open_Source_Passport')}
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => userStore.signOut()}>
        {t('exit')}
      </Dropdown.Item>
    </DropdownButton>
  ) : (
    <SessionBox>
      <Button>{t('sign_in')}</Button>
    </SessionBox>
  );
});
export default UserMenu;
