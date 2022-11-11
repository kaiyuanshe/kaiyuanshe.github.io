# 开源社官网

[React][1] project scaffold based on [TypeScript][2], [Next.js][3] & [Bootstrap][4]. And this project bootstrapped with [`create-next-app`][5].

[![NPM Dependency](https://david-dm.org/kaiyuanshe/kaiyuanshe.github.io.svg)][6]
[![CI & CD](https://github.com/kaiyuanshe/kaiyuanshe.github.io/workflows/CI%20&%20CD/badge.svg)][7]

## 主要功能

### 开源社博客

- 测试入口：https://kaiyuanshe.vercel.app/
- 后端服务：https://github.com/kaiyuanshe/service

### 中国开源地图

- 访问入口：https://kaiyuanshe.vercel.app/organization
- 数据录入：https://kaiyuanshe.feishu.cn/share/base/shrcnPgQoUZzkpWB2W4dp2QQvbd
- 数据存储：https://kaiyuanshe.feishu.cn/base/bascnUAyhKLADcw3HyNW5OefrMd?table=tblXlmfjCsoq0sHf&view=vewdl3c59K

#### 开源协作

申请加入**开源社志愿者**，填表后组长会联系你加入飞书组织：https://kaiyuanshe.feishu.cn/share/base/shrcnfO89tYlYIjZpS5PXJBaK2f

## Technology stack

- Language: [TypeScript v4][2]
- Component engine: [Nextjs v12][3]
- Component suite: [Bootstrap v5][4]
- Test framework: [Jest][8] + [Playwright][9]
- CI / CD: GitHub [Actions][10] + [Vercel][11]

## Getting Started

First, run the development server:

```bash
npm run dev
# or
npm i pnpm -g
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes][12] can be accessed on http://localhost:3000/api/hello. This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes][12] instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation][13] - learn about Next.js features and API.
- [Learn Next.js][14] - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository][15] - your feedback and contributions are welcome!

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform][11] from the creators of Next.js.

Check out our [Next.js deployment documentation][16] for more details.

### Docker

```shell
docker build -t kys-ows:latest .
docker rm -f kys-ows
docker run --name kys-ows -p 3000:3000 -d kys-ows:latest
```

## End-to-End testing

### NPM script

```shell
pnpm e2e
```

### VS Code

press <key>F5</key>

### Learn more

1. Runner & Assert framework: [Jest][8]
2. Browser Operation library: [Playwright][9] & [its community][17]

[1]: https://reactjs.org/
[2]: https://www.typescriptlang.org/
[3]: https://nextjs.org/
[4]: https://getbootstrap.com/
[5]: https://github.com/vercel/next.js/tree/canary/packages/create-next-app
[6]: https://david-dm.org/kaiyuanshe/kaiyuanshe.github.io
[7]: https://github.com/kaiyuanshe/kaiyuanshe.github.io/actions
[8]: https://jestjs.io/
[9]: https://playwright.dev/
[10]: https://github.com/features/actions
[11]: https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme
[12]: https://nextjs.org/docs/api-routes/introduction
[13]: https://nextjs.org/docs
[14]: https://nextjs.org/learn
[15]: https://github.com/vercel/next.js/
[16]: https://nextjs.org/docs/deployment
[17]: https://playwright.tech/
