#!/bin/bash

cd src

# 执行清缓存，生成网页操作
hexo clean
hexo generate

if [[ $TRAVIS_BRANCH == 'master' ]]
  # 替换同目录下的_config.yml文件中gh_token字符串为travis后台刚才配置的变量，注意此处sed命令用了双引号。单引号无效！
  sed -i "s/gh_token/${GH_TOKEN}/g" ./_config.yml
  hexo deploy
fi
