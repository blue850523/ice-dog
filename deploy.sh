#!/usr/bin/env sh

# 發生錯誤時終止
set -e

# 打包編譯
npm run build

# 進入打包後的 dist 目錄
cd dist

# 如果之前有 .git 先刪掉
rm -rf .git

# 初始化 git 並提交
git init
git checkout -b main
git add -A
git commit -m 'deploy'

# 部署到 https://blue850523.github.io/ice-dog
git push -f git@github.com:blue850523/ice-dog.git main:gh-pages

cd -