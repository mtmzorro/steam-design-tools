# Steam Design Tools
> 一个 Steam 个人资料页背景图和展柜设计增强 Chrome 扩展工具

<img src="doc/assets/img/app.png" width="825" height="630" alt="app" />

## 功能

* 存储 Steam 市场中的背景图物品。
* 存储 Steam 个人库存中的背景图物品。
* 将存储中的背景图物品应用于 Steam 个人资料页进行实时预览。
* 扩展个人资料页中展柜（艺术品、截图）功能，直接在展柜替换本地图片实时预览。

## 功能预览

**存储 Steam 市场中的背景图物品，并在个人资料页预览**

![Feature-1](/doc/assets/img/feature-1.gif)

**存储 Steam 个人库存中的背景图物品，并在个人资料页预览**

![Feature-2](/doc/assets/img/feature-2.gif)

**展柜（艺术品、截图）替换本地图片实时预览，按钮提示当前图片尺寸**
![Feature-3](/doc/assets/img/feature-3.gif)

## 开发

```bash
git clone https://github.com/mtmzorro/steam-design-tools.git

cd steam-design-tools

yarn install

# Start project 
yarn start

# Build Chrome Extension 
yarn build
```