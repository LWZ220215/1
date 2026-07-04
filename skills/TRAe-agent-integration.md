# Trae Skill integration guide (agent-side example)

This file shows a minimal example how a Trae agent or platform can load and instantiate the skills packaged above.

Example (browser):

```js
// assume skill scripts are loaded into the page or provided by the platform
async function loadSkill(skillName) {
  // platform-specific loader: check global Trae API first
  const Trae = window.Trae;
  if (Trae && typeof Trae.getSkillClass === 'function') {
    return Trae.getSkillClass(skillName);
  }
  // fallback to global map created by trae-adapter
  return window.TraeSkills && window.TraeSkills[skillName];
}

async function demo() {
  const SVGClass = await loadSkill('svg-animation');
  if (!SVGClass) return console.error('SVG skill not found');
  const svgSkill = SVGClass.create ? SVGClass.create(window.platformApi) : new SVGClass(window.platformApi);
  await svgSkill.init();
  const id = svgSkill.createAnimation({ svg: document.querySelector('#demo-svg'), targetSelector:'#ship', type:'path', pathSelector:'#demo-path', duration:4000, loop:true });
  svgSkill.play(id);
}

window.demo = demo;
```
