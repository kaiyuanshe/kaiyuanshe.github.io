# 开源社官网

这是一个基于 Jekyll 的静态网站源码。

## 搭建本地环境

首先确保你正确安装了 Ruby，能够找到 `gem` 命令。

先安装 bundler 这一依赖管理工具，如果网速不佳请尝试[更换 RubyGems 国内源](https://gems.ruby-china.com/)。

```bash
gem install bundler
```

每次更新了项目源码后，请运行以下命令更新依赖。

```bash
bundle install
```

## 预览与构建

使用以下命令运行本地预览程序，根据配置，通过 `http://127.0.0.1:4000/` 访问生成后的网站。

```bash
bundle exec jekyll serve
```

使用以下命令生成网页代码，根据配置，生成结果在 dist 目录下。

```bash
bundle exec jekyll build
```

## 目录结构

请对照 `_config.yml` 观察目录结构。

以下内容都在 src 目录下。

- `_includes` 和 `_layouts` 负责提供布局，前者存放可复用的部分页面元素，后者存放有层次关系的网页结构。
- `_drafts` `_posts` 这些对应于配置中 collections 节，如果需要更多分类，依样画葫芦即可。
- `_data` 里面的文件负责[提供数据](http://jekyllcn.com/docs/datafiles/)，Jekyll 读取 yaml json csv 格式的文件，将其保存在全局变量 `site.data.xxx` 内（xxx 是文件名）供各处使用。
- `_plugins` 存放 rb 脚本，称为[插件](http://jekyllcn.com/docs/plugins/)。这些插件会在生成页面前被加载，可以提供变量、过滤器、模板标签，也可以生成页面，支持新的标记语言。

## 处理文件的依据

Jekyll 是通过文本文件的头部内容来将文件分为两类：Page、StaticFile。

有 [YAML 头信息](http://jekyllcn.com/docs/frontmatter/)的被视为 Page，否则便是 StaticFile。Page 会被解析渲染，StaticFile 会被原样输出。

最简单的头信息是：

```yaml
---
---
```

Page 的头信息被存储到变量 `page` 里。

StaticFile 的文件信息会被存储到变量 `site.static_files` 里，格式参见[这里](http://jekyllcn.com/docs/static-files/)。

## 模板语法

Jekyll 默认使用的是 [Liquid 模板语言](https://help.shopify.com/en/themes/liquid)。

- 使用变量：`{{ site.data.analyics.ga }}`
- 使用过滤器：`{{ site.time | date_to_xmlschema }}`
- 使用标签：`{% include header.html %}`

Jekyll 提供的模板变量可以参见[这里](http://jekyllcn.com/docs/variables/)。

Jekyll 增加的过滤器和标签可以参见[这里](http://jekyllcn.com/docs/templates/)。

模板根据 yaml 头信息中的 layout 值来层层渲染，每一层的模板中的 `{{ content }}` 表示里面一层的输出。

## 参考手册

- Jekyll 中文网 http://jekyllcn.com/
- Bundler 中文网 https://www.bundler.cn/
