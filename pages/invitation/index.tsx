import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Translation';

const InvitationPage: FC = observer(() => {
  return (
    <Container className="py-5">
      <PageHead title="邀请函" />
    </Container>
  );
});

export default InvitationPage;
