import { observer } from 'mobx-react';
import { FC } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import userStore from '../../models/Base/User';
import { guard } from '../Layout/SessionBox';

const UserMenu: FC = observer(() => {
  const { uuid, mobilePhone, nickName } = userStore.session || {};

  return uuid ? (
    <DropdownButton title={nickName || mobilePhone}>
      <Dropdown.Item href={`/user/${uuid}`}>开源护照</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        onClick={async () => {
          await guard.logout();
          userStore.signOut();
        }}
      >
        退出
      </Dropdown.Item>
    </DropdownButton>
  ) : (
    <></>
  );
});
export default UserMenu;
