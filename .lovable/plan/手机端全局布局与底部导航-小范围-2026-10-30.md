# 手机端全局布局与底部导航（小范围）

## 范围
只改手机端（< 768px）全局布局与导航；桌面端、功能、数据、编辑器均不变。

## 做什么
1. **新增手机底部导航**（新组件 `MobileTabBar`）：首页 `/`、探索 `/explore`、创作 `/create`（居中凸起的深色圆形按钮）、收藏集 `/collections`、我的 `/profile`。使用真实链接跳转，当前页高亮；仅 `md:hidden` 显示；底部留出 iPhone 安全区域（`env(safe-area-inset-bottom)`）。
2. **顶部导航手机端精简**：`SiteNav` 在手机上只保留 Logo + 「日历」入口（替代「开始记录」按钮，保证日历仍可访问），缩小高度与边距；桌面端完全不变。日志仍通过「我的」和卡片进入。
3. **全局挂载**：在根布局里渲染一次 `MobileTabBar`；根视口 meta 加 `viewport-fit=cover`。
4. **全局防溢出与间距**（`styles.css`，仅手机断点）：`html, body { overflow-x: hidden }`；页面底部留出导航高度 + 安全区的空白；页脚手机端缩小上外边距。
5. **各页手机边距微调**：首页、探索、收藏集、合集详情、日志详情、我的、日历的顶部留白（`pt-40` → 手机端 `pt-28`）、大标题字号、左右边距统一为 `px-5`；探索页网格手机端行高调小。创作页只确保不被底部导航遮挡，编辑器不改。

## 涉及文件
- 新增：`src/components/MobileTabBar.tsx`
- 修改：`src/components/SiteNav.tsx`、`src/components/SiteFooter.tsx`、`src/routes/__root.tsx`、`src/styles.css`，以及上述页面路由文件中仅与手机间距相关的 class

## 验证
用 393×852 视口逐页截图：无横向滚动、底部导航可点击跳转、内容不被遮挡；再以 1280 宽确认桌面无变化。
