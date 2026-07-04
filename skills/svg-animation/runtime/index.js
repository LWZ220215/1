// Trae runtime wrapper entry for svg-animation

import SVGAnimationSkill from '../index.js';

// Trae 要求：默认导出一个工厂函数或暴露 create() 方法供平台实例化
export const meta = {
  id: 'svg-animation',
  name: 'SVG Animation Engine Skill',
  version: '1.0.0'
};

export function create(platformApi = null) {
  return new SVGAnimationSkill(platformApi);
}

export default { meta, create };
