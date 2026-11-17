# 电商后台管理系统

[![Vue](https://img.shields.io/badge/Vue-2.6.12-4FC08D?logo=vuedotjs&logoColor=white)](https://v2.vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element%20UI-2.13.2-409EFF)](https://element.eleme.cn/#/zh-CN)
[![Vue CLI](https://img.shields.io/badge/Vue%20CLI-4.5.7-35495E)](https://cli.vuejs.org/)

这是一个用 Vue 2 和 Element UI 写的电商后台管理前端，按登录、用户、权限、商品、订单、报表逐步做完，适合当作学习记录来看。npm 包名是 `shoppingmanage`，页面顶栏文案是「电商后台管理系统」，浏览器标签标题也是 `shoppingmanage`。

仓库里只有浏览器端页面。所有业务请求都发到写死的地址 `http://127.0.0.1:8888/api/private/v1/`，后端代码不在这个仓库里。

登录页和顶栏使用的头像是 `src/assets/logo.png`：

![登录与顶栏头像](src/assets/logo.png)

仓库里没有界面截图。

## 页面与路由

路由定义在 `src/router/index.js`，使用 Vue Router 的默认 hash 模式，地址形如 `http://127.0.0.1:8080/#/login`。除登录页外，进入任何路由前都会检查 `sessionStorage` 里有没有 `token`，没有就回到 `/login`。这里只判断本地有没有这段字符串。

| 路径 | 页面 | 代码里已经做的事 |
| --- | --- | --- |
| `/` | — | 重定向到 `/login` |
| `/login` | `Login.vue` | 表单校验后 `POST login`。成功后把 `res.data.token` 写入 `sessionStorage`，再进入 `/home`。表单初始值是用户名 `admin`、密码 `123456` |
| `/home` | `Home.vue` | 顶栏、可折叠侧边栏。菜单来自 `GET menus`，图标按菜单 id 写死：`125` 用户、`103` 权限、`101` 商品、`102` 订单、`145` 报表。退出会清空 `sessionStorage` |
| `/welcome` | `Welcome.vue` | `/home` 的默认子页面，只显示文字 `welcome` |
| `/users` | `user/User.vue` | 用户搜索、分页、添加、修改邮箱和手机、启用/禁用、删除、分配角色 |
| `/rights` | `power/Rights.vue` | 权限列表（名称、路径、等级） |
| `/roles` | `power/Roles.vue` | 角色的增删改，展开查看三级权限，删除单个权限，用树勾选后分配权限 |
| `/categories` | `goods/Cate.vue` | 三级分类的树形表格、分页，以及分类的添加、修改、删除 |
| `/params` | `goods/Params.vue` | 只给第三级分类维护「动态参数」和「静态属性」，可编辑参数名和可选值标签 |
| `/goods` | `goods/List.vue` | 商品搜索、分页、删除。编辑按钮没有绑定点击事件 |
| `/goods/add` | `goods/Add.vue` | 分步填写基本信息、动态参数、静态属性、图片和富文本，然后 `POST goods`。图片上传地址是 `http://127.0.0.1:8888/api/private/v1/upload` |
| `/orders` | `order/Order.vue` | 订单分页列表、付款状态、发货状态。地址级联数据来自本地 `citydata.js`。物流请求写死为 `/kuaidi/1106975712662` |
| `/reports` | `report/Report.vue` | 用 ECharts 4 画折线图，数据来自 `GET reports/type/1`，再与页面里的标题、坐标轴配置合并 |

接口返回值在各页面里都按 `{ meta: { status, msg }, data }` 读取。`main.js` 给 axios 设置了上述基地址，并在请求头 `Authorization` 中带上 `sessionStorage` 里的 token。同文件还注册了全局日期过滤器 `dateFormat`（`年-月-日 时:分:秒`）、树形表格组件 `tree-table` 和 `vue-quill-editor`。

`vue.config.js` 只关闭了保存时的 ESLint（`lintOnSave: false`），没有配置 `devServer.proxy`。浏览器会直接请求 `127.0.0.1:8888`，因此后端需要允许来自开发服务器源站的跨域请求。

## 技术栈

版本下面两列分别是 `package.json` 的范围，以及 `package-lock.json` 里锁定的版本。

| 用途 | 依赖 | 声明范围 | lock 版本 |
| --- | --- | --- | --- |
| 界面 | `vue` | `^2.6.11` | 2.6.12 |
| 路由 | `vue-router` | `^3.2.0` | 3.4.6 |
| 状态 | `vuex` | `^3.4.0` | 3.5.1 |
| 组件库 | `element-ui` | `^2.4.5` | 2.13.2 |
| HTTP | `axios` | `^0.20.0` | 0.20.0 |
| 图表 | `echarts` | `^4.9.0` | 4.9.0 |
| 富文本 | `vue-quill-editor`（带上 `quill` 1.3.7） | `^3.0.6` | 3.0.6 |
| 树形表格 | `vue-table-with-tree-grid` | `^0.2.4` | 0.2.4 |
| 工具 | `lodash` | `^4.17.20` | 4.17.20 |
| 脚手架 | `@vue/cli-service` | `~4.5.0` | 4.5.7 |
| 样式 | `less` / `less-loader` | `^3.12.2` / `^7.0.2` | less 3.12.2 |
| 语法 | `@babel/core` 等（由 CLI 带入） | — | — |
| 检查 | `eslint` | `^6.7.2` | 6.8.0 |

`package.json` 里还有 `loadsh@0.0.4`。源码没有引用它；添加商品用 `lodash.cloneDeep`，报表用 `lodash.merge`。

Vuex 已经在入口挂上，但 `src/store/index.js` 的 `state`、`mutations`、`actions`、`modules` 都是空对象，页面数据放在各自组件里。

浏览器范围见 `.browserslistrc`：`> 1%`、`last 2 versions`、`not dead`。

## 目录

```text
.
├── public
│   ├── favicon.ico
│   └── index.html              # 挂载点 #app，标题取包名 shoppingmanage
├── src
│   ├── main.js                 # axios 基地址、拦截器、全局组件和日期过滤器
│   ├── App.vue                 # 只放一个 router-view
│   ├── plugins/element.js      # 全量引入 Element UI
│   ├── router/index.js         # 路由表和登录守卫
│   ├── store/index.js          # 空的 Vuex 实例
│   ├── assets
│   │   ├── logo.png            # 登录头像和顶栏图标
│   │   ├── css/global.css      # 最小宽度 1366px，以及面包屑、表格、编辑器高度
│   │   └── fonts/              # iconfont 字体与示例页
│   └── components
│       ├── Login.vue
│       ├── Home.vue
│       ├── Welcome.vue
│       ├── user/User.vue
│       ├── power/Rights.vue
│       ├── power/Roles.vue
│       ├── goods/Cate.vue
│       ├── goods/Params.vue
│       ├── goods/List.vue
│       ├── goods/Add.vue
│       ├── order/Order.vue
│       ├── order/citydata.js  # 省市区静态数据
│       └── report/Report.vue
├── babel.config.js
├── vue.config.js
├── package.json
├── package-lock.json           # 包地址指向 http://npm.6tiantian.com:4873
└── yarn.lock                   # 包地址指向 registry.npm.taobao.org
```

## 环境要求

- 需要能跑 Vue CLI 4 的 Node.js。官方 CLI 4.5 的引擎要求是 Node.js `>= 8.9`。
- 需要一个实现上述路径和 `{ meta, data }` 响应格式的后端，监听 `127.0.0.1:8888`。本仓库不提供这个服务。登录表单预填的 `admin` / `123456` 能不能用，由后端决定。
- 页面最小宽度是 1366px，窄窗口会出现横向滚动。

## 安装与运行

`package.json` 里的脚本：

```bash
npm run serve    # vue-cli-service serve，开发服务器，默认端口 8080
npm run build    # 生产构建，输出到 dist/
npm run lint     # vue-cli-service lint
```

`yarn serve`、`yarn build`、`yarn lint` 对应同一组脚本。

### 安装依赖

仓库同时有两份旧的锁文件：

- `package-lock.json`（lockfileVersion 1）里的 tarball 地址是 `http://npm.6tiantian.com:4873`。
- `yarn.lock` 里的 tarball 地址是 `https://registry.npm.taobao.org`。

在本环境（Linux，Node.js v22.23.4，npm 10.9.9）上：

- `npm ci` 会按 lock 去下载。该源对 `@vue/cli-service@4.5.7`、`@vue/cli-plugin-babel@4.5.7` 等多个包返回 HTTP 500，安装以 `ECONNRESET` 结束，依赖没有装完。
- `yarn.lock` 使用的淘宝旧域名没有响应，本次没有用 yarn 安装成功。

本次能装完并跑起来的方式，是不读取这两份 lock，改由官方源按 `package.json` 的版本范围安装。验证时先把两个 lock 文件移出目录，执行下面的命令，确认能启动后再把原 lock 文件移回（`npm install` 会写出新的 `package-lock.json`，验证时已丢弃，没有提交）：

```bash
npm install --registry https://registry.npmjs.org
```

这样装到的是范围内较新的版本，和 lock 不完全相同：Vue 2.7.16、`@vue/cli-service` 4.5.19、Element UI 2.15.14、webpack 4.47.0。安装过程中 `@achrinza/node-ipc@9.2.2` 提示当前 Node 不在它声明的 `8 || 10 || 12 || 14 || 16 || 17` 之内，安装仍然完成。

### 开发服务器

```bash
npm run serve
```

默认地址是 `http://127.0.0.1:8080/`，打开后会进入 `/#/login`。

本次验证：编译成功（约 3 秒），未设置 `NODE_OPTIONS`。`/`、`/js/app.js`、`/js/chunk-vendors.js` 均为 HTTP 200，页面标题为 `shoppingmanage`。本机 `8888` 端口没有配套后端，登录和各业务接口没有联调。

### 生产构建

```bash
npm run build
```

本次构建成功，产物在 `dist/`（已被 `.gitignore` 忽略）。构建给出体积警告：`dist/js/chunk-vendors.*.js` 约 2.11 MiB（gzip 约 665 KiB），入口合计约 2.55 MiB。

### 代码检查

```bash
npm run lint
```

本次执行未通过，报告 59 个 error，主要是 `eqeqeq`（`==` / `!=`），另外 `.eslintrc.js` 里有两段重复的 `extends`。Vue CLI 的 `lint` 会尝试自动改写源文件；这次检查产生的改动已经还原，业务代码保持原样。

## 阅读代码时会碰到的行为

这些都是当前源码的实际行为：

- 商品列表的编辑按钮没有点击处理函数。
- 订单页的搜索框没有绑定输入值和查询方法。「修改地址」对话框的「确定」只关闭对话框，不提交接口。物流进度不使用当前行的订单号，固定请求 `/kuaidi/1106975712662`。
- 权限列表的等级标签文字是「标签一」「标签二」「标签三」。
- 添加用户时，如果返回状态不是 201，页面会先提示失败，接着仍然提示成功并关闭对话框（失败分支没有 `return`）。
- 查询和修改用户信息使用的是 `User.vue` 里单独 import 的 `axios`。`main.js` 改的是 axios 默认实例的 `baseURL` 和拦截器，这两处请求仍会带上同一基地址和 token。
- 添加商品时，基本信息页必须选满三级分类才能离开；动态参数和静态属性按所选第三级分类拉取。

## 参考

- [Vue CLI 配置说明](https://cli.vuejs.org/config/)
- [Vue 2 文档](https://v2.vuejs.org/)
- [Element UI 2 文档](https://element.eleme.cn/#/zh-CN)
- [Vue Router 3](https://v3.router.vuejs.org/zh/)
- [ECharts 4](https://echarts.apache.org/v4/zh/index.html)
