#!/bin/bash

set -ex

# setup git config
git config user.name "juniwang"
git config user.email "wangjunbo924@hotmail.com"

# copy CNAME to avoid maintenance of multiple CNAME files
cp CNAME ./src/source/

# install gems
cd ./src
npm install -g hexo-cli
npm install

# gem for deploy if it's master branch
if [ '$TRAVIS_BRANCH' == 'master' ]; then
  npm install hexo-deployer-git --save
fi
