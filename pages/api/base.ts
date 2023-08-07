import { HTTPError } from 'koajax';
import { parseLanguageHeader } from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Second } from 'web-utility';

import { i18n } from '../../models/Translation';

export type NextAPI = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>;

export function safeAPI(handler: NextAPI): NextAPI {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      if (!(error instanceof HTTPError)) {
        console.error(error);

        res.status(400);
        return res.send({ message: (error as Error).message });
      }
      let { message, status, body } = error;

      res.status(status);
      res.statusMessage = message;

      if (body instanceof ArrayBuffer)
        try {
          body = new TextDecoder().decode(new Uint8Array(body));
          console.error(body);

          body = JSON.parse(body);
          console.error(body);
        } catch {}

      res.send(body);
    }
  };
}

export type Middleware<I extends DataObject, O extends DataObject = {}> = (
  context: GetServerSidePropsContext<I>,
  next: () => Promise<GetServerSidePropsResult<O>>,
) => Promise<GetServerSidePropsResult<O>>;

export function compose<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(...middlewares: Middleware<I, O>[]) {
  return (context => {
    const [first, ...rest] = middlewares;

    const next = async () =>
      (await rest.shift()?.(context, next)) ||
      ({ props: {} } as GetServerSidePropsResult<O>);

    return first(context, next);
  }) as F;
}

interface AsyncCache {
  expiredAt?: number;
  data?: GetServerSidePropsResult<DataObject>;
  buffer?: Promise<GetServerSidePropsResult<DataObject>>;
}

const serverRenderCache: Record<string, AsyncCache> = {};

export function cache<I extends DataObject, O extends DataObject = {}>(
  interval = 30 * Second,
) {
  return (async (context, next) => {
    const { resolvedUrl } = context;
    const cache = (serverRenderCache[resolvedUrl] ||= {}),
      title = `[SSR cache] ${resolvedUrl}`;
    const { data, expiredAt = 0 } = cache;

    if ((!data || expiredAt < Date.now()) && !cache.buffer) {
      console.time(title);

      cache.buffer = next().then(data => {
        delete cache.buffer;
        cache.data = data;
        cache.expiredAt = Date.now() + interval;

        console.timeEnd(title);
        console.log(cache);

        return data;
      });
    }
    return data || cache.buffer;
  }) as Middleware<I, O>;
}

export async function errorLogger<
  I extends DataObject,
  O extends DataObject = {},
>(
  context: GetServerSidePropsContext<I>,
  next: () => Promise<GetServerSidePropsResult<O>>,
): Promise<GetServerSidePropsResult<O>> {
  try {
    return await next();
  } catch (error) {
    console.error(error);

    const { status } = error as HTTPError;

    if (status === 404) return { notFound: true, props: {} as O };

    throw error;
  }
}

export interface RouteProps<T extends ParsedUrlQuery = {}> {
  route: Pick<
    GetServerSidePropsContext<T>,
    'resolvedUrl' | 'params' | 'query' | 'locales'
  >;
}

export async function router<I extends DataObject, O extends DataObject = {}>(
  context: GetServerSidePropsContext<I>,
  next: () => Promise<GetServerSidePropsResult<O>>,
) {
  const options = (await next()) || ({} as GetServerSidePropsResult<{}>),
    { resolvedUrl, params, query, locales } = context;

  return {
    ...options,
    props: {
      ...('props' in options ? options.props : {}),
      route: JSON.parse(
        JSON.stringify({ resolvedUrl, params, query, locales }),
      ),
    },
  } as GetServerSidePropsResult<RouteProps<I> & O>;
}

export async function translator<
  I extends DataObject,
  O extends DataObject = {},
>(
  context: GetServerSidePropsContext<I>,
  next: () => Promise<GetServerSidePropsResult<O>>,
) {
  const { language = '' } = context.req.cookies,
    languages = parseLanguageHeader(
      context.req.headers['accept-language'] || '',
    );
  await i18n.loadLanguages([language, ...languages].filter(Boolean));

  return ((await next()) || {
    props: {},
  }) as GetServerSidePropsResult<O>;
}
