// Lightweight SVG Animation Engine Skill

export default class SVGAnimationSkill {
  constructor(trAeApi = null) {
    this.api = trAeApi;
    this.animations = new Map();
    this._nextId = 1;
  }

  init() {
    // optional init hook for Trae platform
    if (this.api && typeof this.api.log === 'function') {
      this.api.log('SVGAnimationSkill initialized');
    }
  }

  _generateId() {
    return `svg-anim-${this._nextId++}`;
  }

  createAnimation(options = {}) {
    // options: svg (SVGElement), targetSelector, type: 'transform'|'path', pathSelector,
    // transform: {translate:[x,y], rotate:deg, scale:[sx,sy]}, duration(ms), easing (fn), loop
    const id = this._generateId();
    const anim = {
      id,
      svg: options.svg || null,
      target: options.svg ? (options.svg.querySelector(options.targetSelector) || null) : null,
      type: options.type || 'transform',
      path: options.pathSelector && options.svg ? options.svg.querySelector(options.pathSelector) : null,
      duration: options.duration || 1000,
      easing: options.easing || (t => t),
      loop: !!options.loop,
      params: options.transform || {},
      _raf: null,
      _start: null,
      _pausedAt: null,
      playing: false
    };

    if (!anim.target) {
      console.warn('[SVGAnimationSkill] createAnimation: target element not found for', options.targetSelector);
    }

    this.animations.set(id, anim);
    return id;
  }

  _applyTransform(target, translate = [0,0], rotate = 0, scale = [1,1]){
    if (!target) return;
    const tx = translate[0] || 0;
    const ty = translate[1] || 0;
    const sx = scale[0] || 1;
    const sy = scale[1] || 1;
    const transform = `translate(${tx}, ${ty}) rotate(${rotate}) scale(${sx}, ${sy})`;
    target.setAttribute('transform', transform);
  }

  play(id) {
    const anim = this.animations.get(id);
    if (!anim) return;
    if (anim.playing) return;
    anim.playing = true;
    const start = anim._pausedAt ? (performance.now() - anim._pausedAt) : performance.now();
    anim._start = start;

    const step = (now) => {
      const elapsed = now - anim._start;
      let t = Math.min(1, elapsed / anim.duration);
      t = anim.easing(t);

      if (anim.type === 'path' && anim.path && anim.target) {
        try {
          const len = anim.path.getTotalLength();
          const pt = anim.path.getPointAtLength(len * t);
          this._applyTransform(anim.target, [pt.x, pt.y]);
        } catch (e) {
          // some SVGs may throw if not in DOM
        }
      } else if (anim.type === 'transform' && anim.target) {
        const from = anim.params.from || {translate:[0,0], rotate:0, scale:[1,1]};
        const to = anim.params.to || {translate:[0,0], rotate:0, scale:[1,1]};
        const interp = (a,b) => a + (b - a) * t;
        const tx = interp(from.translate[0]||0, to.translate[0]||0);
        const ty = interp(from.translate[1]||0, to.translate[1]||0);
        const rot = interp(from.rotate||0, to.rotate||0);
        const sx = interp(from.scale ? from.scale[0] : 1, to.scale ? to.scale[0] : 1);
        const sy = interp(from.scale ? from.scale[1] : 1, to.scale ? to.scale[1] : 1);
        this._applyTransform(anim.target, [tx, ty], rot, [sx, sy]);
      }

      if (elapsed >= anim.duration) {
        if (anim.loop) {
          anim._start = performance.now();
        } else {
          anim.playing = false;
          cancelAnimationFrame(anim._raf);
          anim._raf = null;
          return;
        }
      }
      anim._raf = requestAnimationFrame(step);
    };

    anim._raf = requestAnimationFrame(step);
  }

  pause(id) {
    const anim = this.animations.get(id);
    if (!anim || !anim.playing) return;
    anim.playing = false;
    anim._pausedAt = performance.now() - anim._start;
    if (anim._raf) cancelAnimationFrame(anim._raf);
    anim._raf = null;
  }

  stop(id) {
    const anim = this.animations.get(id);
    if (!anim) return;
    anim.playing = false;
    anim._start = null;
    anim._pausedAt = null;
    if (anim._raf) cancelAnimationFrame(anim._raf);
    anim._raf = null;
  }

  updateParams(id, params = {}) {
    const anim = this.animations.get(id);
    if (!anim) return false;
    Object.assign(anim, params);
    return true;
  }

  destroy(id) {
    const anim = this.animations.get(id);
    if (!anim) return false;
    this.stop(id);
    this.animations.delete(id);
    return true;
  }
}

// Auto-register with Trae if adapter available
import TraeAdapter from '../trae-adapter.js';
const _adapter = TraeAdapter.get();
if (_adapter && typeof _adapter.registerSkill === 'function') {
  _adapter.registerSkill('svg-animation', SVGAnimationSkill);
}
