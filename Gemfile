source "https://rubygems.org"

# 因为 GitHub Pages 对 Jekyll 的自动构建只接受给定的几个插件，也不允许运行本地脚本，所以不采用这一方案
#require 'json'
#require 'open-uri'
#github_pages_versions = JSON.parse(open('https://pages.github.com/versions.json').read)
#github_pages_version = github_pages_versions['github-pages']
#gem "github-pages", github_pages_version, group: :jekyll_plugins

gem "jekyll", "~> 3.8.5"
group :jekyll_plugins do
  gem "jekyll-coffeescript"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0" if Gem.win_platform?

