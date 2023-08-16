import { TableCellValues } from 'mobx-lark';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import { Activity, ActivityModel } from '../../../models/Activity';
import { i18n } from '../../../models/Translation';
import PageHead from '../../components/PageHead';
