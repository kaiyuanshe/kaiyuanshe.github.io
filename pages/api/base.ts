import { merge } from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import { parse, stringify } from 'qs';
import { HTTPError } from 'koajax';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { parseLanguageHeader } from 'mobx-i18n';

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
        return res.end(error);
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

interface RouteProps<T extends ParsedUrlQuery> {
  route: Pick<
    GetServerSidePropsContext<T>,
    'resolvedUrl' | 'params' | 'query' | 'locales'
  >;
}

export function withRoute<
  R extends Record<string, any>,
  P extends Record<string, any> = {},
  O extends GetServerSideProps<P, R> = GetServerSideProps<P, R>,
>(
  origin?: O,
): GetServerSideProps<RouteProps<R> & InferGetServerSidePropsType<O>, R> {
  return async context => {
    const options =
        (await origin?.(context)) || ({} as GetServerSidePropsResult<{}>),
      { resolvedUrl, params, query, locales } = context;

    return {
      ...options,
      props: {
        ...('props' in options ? options.props : {}),
        route: JSON.parse(
          JSON.stringify({ resolvedUrl, params, query, locales }),
        ),
      },
    } as GetServerSidePropsResult<
      RouteProps<R> & InferGetServerSidePropsType<O>
    >;
  };
}

export function withTranslation<
  R extends Record<string, any>,
  P extends Record<string, any> = {},
  O extends GetServerSideProps<P, R> = GetServerSideProps<P, R>,
>(
  origin?: O,
): GetServerSideProps<RouteProps<R> & InferGetServerSidePropsType<O>, R> {
  return async context => {
    const { language = '' } = context.req.cookies,
      languages = parseLanguageHeader(
        context.req.headers['accept-language'] || '',
      );
    await i18n.loadLanguages([language, ...languages].filter(Boolean));

    return ((await origin?.(context)) || {
      props: {},
    }) as GetServerSidePropsResult<
      RouteProps<R> & InferGetServerSidePropsType<O>
    >;
  };
}

export function mergeQuery(path: string, ...data: Record<string, any>[]) {
  const [route, query] = path.split('?');

  return `${route}?${stringify(merge(parse(query), ...data), {
    encodeValuesOnly: true,
  })}`;
}
