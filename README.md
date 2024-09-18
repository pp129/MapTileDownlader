# Map Tile Downloader

基于 electron 和 OpenLayers 的地图瓦片下载器。感谢[MapDownload](https://github.com/Hxy1992/MapDownload.git)项目提供的思路。核心逻辑和操作基本一致，只是更新了底座和地图交互用ol重写，按需只截取部分功能。

> [!Important]
>
> 请使用 Node.js v16+ 版本
>
> [![Required Node.JS >= v16](https://img.shields.io/static/v1?label=node&message=%3E=16.13&logo=node.js&color)](https://nodejs.org/about/releases/) [![Required npm >= v8](https://img.shields.io/static/v1?label=npm&message=%3E=8.1&logo=npm&color)](https://github.com/npm/cli/releases)

---

## Get started

```bash
# 安装依赖(依赖较大，使用国内镜像)
npm install

# 启动
npm run watch

# 构建web
npm run build

# 构建应用
npm run compile

```
