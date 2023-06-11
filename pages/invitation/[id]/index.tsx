import { Icon } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { MouseEvent, PureComponent, FC } from 'react';
import { Button, Col, Container, Nav, Offcanvas, Row } from 'react-bootstrap';

import PageHead from '../../../components/PageHead';
import { Activity, ActivityModel } from '../../../models/Activity';
import { AgendaModel } from '../../../models/Agenda';
import { blobURLOf } from '../../../models/Base';
import { i18n } from '../../../models/Translation';
import { withErrorLog } from '../../api/base';

const invitationCard: FC = observer(() => {
  return <Container className="py-5"></Container>;
});

export default invitationCard;
