// Trae runtime wrapper entry for canvas-particles

import CanvasParticleSkill from '../index.js';

export const meta = {
  id: 'canvas-particles',
  name: 'Canvas Particle System Skill',
  version: '1.0.0'
};

export function create(platformApi = null) {
  return new CanvasParticleSkill(platformApi);
}

export default { meta, create };
