name: canvas-particles
id: canvas-particles
version: 1.0.0
author: LWZ220215
description: "Canvas Particle System Skill — 在 Trae 中生成与管理 Canvas 粒子系统，支持参数配置、碰撞检测与运行时更新"
license: MIT
entrypoint: runtime/index.js
icon: icon.png
commands:
  - name: createEmitter
    description: 在指定 Canvas 上创建一个粒子发射器并返回发射器 id
    parameters:
      - name: canvasSelector
        type: string
        description: CSS 选择器，指向 Canvas 元素
      - name: options
        type: object
        description: 发射器参数（emitRate, speed, spread, color, size, life 等）
  - name: start
    description: 开始发射器
    parameters:
      - name: id
        type: string
  - name: stop
    description: 停止发射器
    parameters:
      - name: id
        type: string
  - name: updateParams
    description: 更新发射器参数
    parameters:
      - name: id
        type: string
      - name: params
        type: object
  - name: destroy
    description: 销毁发射器并释放资源
    parameters:
      - name: id
        type: string
when_to_use: |
  当演示需要视觉特效（粒子、火花、爆炸、烟雾、雨雪效果）并希望通过 Trae 智能体动态控制参数时使用。
output_interpretation: |
  命令返回 { success: boolean, data?: any, error?: string }，例如 createEmitter 返回 { success:true, data:{ id: "particles-1" } }
examples: |
  const skillClass = window.TraeSkills['canvas-particles'];
  const skill = skillClass && new skillClass(platformApi);
  await skill.init();
  const emitterId = skill.createEmitter(document.querySelector('#demo-canvas'), { x:400,y:150, emitRate:50 });
  skill.start(emitterId);
