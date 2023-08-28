import { Loading } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import {
  cache,
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Badge, Container } from 'react-bootstrap';

import PageHead from '../../../components/PageHead';
import { ActivityModel } from '../../../models/Activity';
import { i18n } from '../../../models/Translation';

export const getServerSideProps = compose<{ id: string }>(
  cache(),
  router,
  errorLogger,
  translator(i18n),
);

const { t } = i18n;
