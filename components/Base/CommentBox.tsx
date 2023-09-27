import Giscus, { GiscusProps } from '@giscus/react';
import { observer } from 'mobx-react';
import { FC } from 'react';

import { i18n } from '../../models/Base/Translation';

export const CommentBox: FC<Partial<GiscusProps>> = observer(props => {
  const { currentLanguage } = i18n;

  return (
    <Giscus
      {...props}
      repo="kaiyuanshe/kaiyuanshe.github.io"
      repoId="MDEwOlJlcG9zaXRvcnkxMzEwMDg4MTI="
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="bottom"
      theme="light"
      lang={
        currentLanguage?.startsWith('zh-')
          ? currentLanguage
          : currentLanguage?.split('-')[0]
      }
    />
  );
});
