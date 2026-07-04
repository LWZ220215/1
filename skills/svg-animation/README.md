# SVG Animation Engine Skill

此目录包含一个轻量级的 SVG 动画引擎技能示例，供 Trae 平台集成与演示使用。

主要特性：
- 基本变换动画：平移、旋转、缩放
- 路径动画：基于 <path> 的 getPointAtLength 实现沿路径运动
- 动画创建/编辑/播放/暂停/停止 API
- 可以通过 Trae 的注册接口注册（见 ../trae-adapter.js）

使用方法（示例）：

```js
import SVGAnimationSkill from '../../skills/svg-animation/index.js';
const skill = new SVGAnimationSkill(trAeApi); // Trae 平台可能传入一个 api 对象
skill.init();
const animId = skill.createAnimation({
  svg: document.querySelector('#demo-svg'),
  targetSelector: '#ship',
  type: 'path',
  pathSelector: '#demo-path',
  duration: 4000,
  loop: true
});
skill.play(animId);
```

更多细节见 README 与 demo/svg-demo.html。
