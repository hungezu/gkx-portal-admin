# 国科信门户管理系统

基于 Figma Make 原型复刻的响应式后台管理前端，包含活动、审批、组织权限、菜单、资源与报告等模块。

## 本地运行

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
pnpm preview
```

## GitHub Pages 发布

仓库已包含 `.github/workflows/deploy.yml`。推送到 GitHub 的 `main` 分支后，在仓库：

1. 打开 **Settings → Pages**。
2. 将 **Source** 设为 **GitHub Actions**。
3. 等待 Actions 中的 `Deploy to GitHub Pages` 完成。

页面使用相对资源路径，支持发布到 `https://<用户名>.github.io/<仓库名>/`。

## 主要交互

- 左侧导航展开、收起与多模块切换
- 顶部全局搜索、消息通知与用户菜单
- 活动新增/编辑/查看/删除弹窗
- 内容与表单审批详情、通过与驳回
- 用户、角色、权限配置弹窗
- 资源上传弹窗与网格视图
- 响应式移动端侧栏
