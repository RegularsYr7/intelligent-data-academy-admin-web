# 智慧数据学院管理平台（Rainy-data-school）

## 项目综述

- **项目类型**：基于 Vue 3 + Vite 的单页管理平台。
- **目标场景**：为高校智能数据学院提供教务、活动、社区、组织等综合业务管理能力，覆盖学生行为数据、任务签到、活动运营与权限控制。
- **主要特性**：模块化业务划分、列表 + 表单的 CRUD 模式、统一的字典标签体系、基于角色的权限控制、批量导出以及文件上传支持。

## 技术栈

- **框架**：Vue 3.5 + Vue Router 4 + Pinia 3
- **构建工具**：Vite 6（ESM 模式）
- **UI 库**：Element Plus 2（含暗色主题支持）
- **可视化**：ECharts 5
- **富文本 & 上传**：@vueup/vue-quill、image-upload、file-saver
- **辅助库**：Axios、js-cookie、nprogress、@vueuse/core、splitpanes 等

## 运行与构建

```
# 安装依赖
npm install

# 本地开发（默认 http://localhost:80 ）
npm run dev

# 生产构建输出到 dist/
npm run build:prod

# 预览生产构建
npm run preview
```

> 接口代理默认指向 `http://gitmanagentserver.rainyweb.cn`，开发时通过 `/dev-api` 代理转发，可在 `vite.config.js` 修改。

## 目录结构速览

```
├── src/
│   ├── api/                  # 后端接口封装（规则化 CRUD）
│   ├── assets/               # 静态资源、全局样式、SVG 图标
│   ├── components/           # 通用组件（分页、上传、字典标签等）
│   ├── directive/            # 自定义指令（权限、重复点击等）
│   ├── layout/               # 主体布局与子组件
│   ├── plugins/              # Element Plus、缓存、权限等插件
│   ├── router/               # 路由定义（基于 meta 控制缓存、权限）
│   ├── store/                # Pinia 状态管理（用户、标签页、字典）
│   ├── utils/                # 请求封装、权限工具、字典解析、验证器
│   └── views/                # 业务模块页面（活动、签到、社区等）
├── public/                   # 静态入口资源
├── vite/                     # Vite 插件封装（自动导入、SVG、压缩等）
└── bin/                      # Windows 构建脚本
```

## 核心功能模块

- **登录与权限**：基于 token 的鉴权流程，`permission.js` 负责路由守卫、动态路由加载，指令 `v-hasPermi` 控制按钮级别权限。
- **仪表盘 & 统计**：`src/views/index.vue` 提供整体概览与快速入口。
- **活动管理**（`views/activityManagent`）：活动 CRUD、报名信息、参与者记录、动态过滤、统计展示。
- **签到任务**（`views/attendanceManagement`）：任务配置、签到记录、签到明细对话框、数据导出。
- **社区管理**（`views/communityManagement`）：帖子列表、评论/点赞/收藏详情、数据维护、内容审核。
- **组织管理**（`views/organizationalManagement`）：组织档案、成员管理（可展开编辑成员信息）、级联学校/学院/班级。
- **反馈 & 定量管理**：表单收集与量化指标维护。
- **系统设置**：角色、部门、菜单、字典、参数配置等后台支撑功能。

## 字典与数据驱动

- 使用 `useDict` 钩子获取字典数据，统一放置在 `@/utils/dict.js` 与后端 `/system/dict/data` 接口。
- `DictTag` 组件负责将字典值渲染为标签，针对特殊场景可通过自定义 `getDictLabel` 方法转换。
- 所有查询条件、表单、表格列均应优先使用字典保持前后端一致性。

## API 约定

- 每个业务模块在 `src/api/<domain>` 下维护 RESTful 接口封装：`list`、`get`、`add`、`update`、`del`。
- 请求基于 Axios 二次封装 `@/utils/request.js`，默认捕获错误并通过 Element Plus Message 展示。
- 导出功能统一调用 `proxy.download(url, params, filename)`。

## 权限体系

- 菜单、按钮权限由后端下发，前端通过 `store/modules/permission` 管理。
- `v-hasPermi` 指令结合 `usePermission` 钩子实现按钮级别控制。
- 动态路由在登录后通过 `generateRoutes` 注入，确保用户只访问拥有权限的菜单。

## UI 规范

- 搜索表单：采用两列或四列栅格，label 宽度统一为 140px。
- 表格：开启 `show-overflow-tooltip`，并根据内容设置 `min-width` 或 `width`，固定选择列和操作列。
- 弹窗：业务表单对话框宽度 1000px，详情对话框 1000-1400px；复杂信息支持展开行或分页。
- 字典展示：统一使用标签（`el-tag` / `dict-tag`），避免原始值与格式化值重复显示。

## 构建产物 & 部署

- `npm run build:prod` 输出内容位于 `dist/`，包含按需拆分的静态资源。
- 可通过 `npm run preview` 在本地验证打包结果。
- 生产部署需同时配置后端域名、静态资源服务器（Nginx）以及 HTTPS / 安全策略。

## 开发约定

- 新增页面遵循 “列表 + 搜索 + 分页 + 弹窗” 模式，使用统一工具函数 `resetForm`、`addDateRange`。
- 表格列自定义渲染时不要同时声明 `prop` 与 `template`，以免造成双重渲染。
- 对话框中的嵌套表单应使用 `ref` 标记并在关闭时 `reset()`，保持组件状态干净。
- 若需要拓展 Element Plus 组件，优先在 `src/plugins` 或 `src/components` 中封装复用。

## 常用命令与脚本

- `bin/run-web.bat`：快速运行开发环境。
- `bin/build.bat`：一键生产构建。
- `bin/package.bat`：生产构建并打包压缩。

## 维护建议

- **字典 / 配置同步**：新增业务字段需同步维护后端字典、前端 `useDict` 调用、表单校验。
- **权限调整**：变更菜单或按钮权限时，需同步更新后端角色配置与前端指令引用。
- **性能优化**：列表页尽量开启分页缓存与懒加载，图表使用 `destroy` / `resize` 保证资源释放。
- **测试流程**：建议在开发环境执行功能自测 → 运行 `npm run build:prod` 验证 → 提交 Git 记录。

## 参考资料

- [Vue 官方文档](https://cn.vuejs.org/)
- [Element Plus 文档](https://element-plus.gitee.io/zh-CN/)
- [Vite 配置指南](https://cn.vitejs.dev/)
- [RuoYi-Vue 项目](https://gitee.com/y_project/RuoYi-Vue)
