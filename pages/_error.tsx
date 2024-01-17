import * as Sentry from '@sentry/nextjs';
import type { NextPage } from 'next';
import type { ErrorProps } from 'next/error';
import Error from 'next/error';

const CustomErrorComponent: NextPage<ErrorProps> = ({ statusCode }) => (
  <Error statusCode={statusCode} />
);

CustomErrorComponent.getInitialProps = async contextData => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};

export default process.env.NODE_ENV === 'development' ||
!process.env.SENTRY_AUTH_TOKEN
  ? Error
  : CustomErrorComponent;
