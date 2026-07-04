（可选）技能打包与发布说明

1. 确保每个技能目录包含：
   - SKILL.md（YAML） — 平台识别的技能元数据与命令定义
   - runtime/index.js — Trae 运行时入口（导出 meta 与 create 工厂）
   - index.js — 技能实现（类定义）
   - README.md、demo/（可选）、icon.png（可选）

2. 打包：
   - 安装依赖：npm install archiver
   - 运行：node skills/pack-skill.js ./skills/svg-animation ./dist/svg-animation.skill
   - 将生成的 .skill 或 .zip 上传到 Trae 平台创建技能

3. 验证：
   - 在 Trae 创建技能页面上传 .skill 文件，确保 SKILL.md 能被解析并显示名称、描述与命令
   - 在平台控制台创建并测试调用 create/play/start 等命令
