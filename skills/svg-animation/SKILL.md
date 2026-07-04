name: svg-animation
id: svg-animation
version: 1.0.0
author: LWZ220215
description: "SVG Animation Engine Skill — 在 Trae 中创建、编辑和控制 SVG 格式动画，支持 transform 与 path 动画（平移、旋转、缩放、路径运动）"
license: MIT
entrypoint: runtime/index.js
icon: icon.png
commands:
  - name: createAnimation
    description: 创建一个 SVG 动画实例并返回动画 id
    parameters:
      - name: svgSelector
        type: string
        description: CSS 选择器，指向 SVG 根元素
      - name: targetSelector
        type: string
        description: CSS 选择器，指向需要动画的 SVG 子元素（如 #ship）
      - name: type
        type: string
        enum: [path, transform]
        description: 动画类型，path：沿 path 运动；transform：变换插值
      - name: duration
        type: integer
        description: 持续时间（毫秒）
      - name: loop
        type: boolean
        description: 是否循环
  - name: play
    description: 播放指定动画
    parameters:
      - name: id
        type: string
        description: createAnimation 返回的动画 id
  - name: pause
    description: 暂停指定动画
    parameters:
      - name: id
        type: string
  - name: stop
    description: 停止指定动画并重置状态
    parameters:
      - name: id
  - name: updateParams
    description: 更新动画参数（如 duration、easing、目标选择器）
    parameters:
      - name: id
        type: string
      - name: params
        type: object
when_to_use: |
  当演示或交互场景需要在 Trae UI 中展示基于矢量图的平滑动画（例如角色沿曲线路径运动、缩放、旋转等）时使用。
output_interpretation: |
  所有命令返回标准 JSON 响应：{ success: boolean, data?: any, error?: string }
examples: |
  // 创建并播放路径动画示例
  const skillClass = window.TraeSkills['svg-animation'];
  const skill = skillClass && new skillClass(platformApi);
  await skill.init();
  const animId = skill.createAnimation({ svg: document.querySelector('#demo-svg'), targetSelector:'#ship', type:'path', pathSelector:'#demo-path', duration:4000, loop:true });
  skill.play(animId);
