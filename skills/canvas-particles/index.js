// Lightweight Canvas Particle System Skill

export default class CanvasParticleSkill {
  constructor(trAeApi = null) {
    this.api = trAeApi;
    this.emitters = new Map();
    this._nextId = 1;
  }

  init() {
    if (this.api && typeof this.api.log === 'function') {
      this.api.log('CanvasParticleSkill initialized');
    }
  }

  _generateId() {
    return `particles-${this._nextId++}`;
  }

  createEmitter(canvas, options = {}) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      console.warn('[CanvasParticleSkill] createEmitter: canvas element required');
      return null;
    }
    const ctx = canvas.getContext('2d');
    const id = this._generateId();
    const emitter = {
      id,
      canvas,
      ctx,
      options: Object.assign({
        maxParticles: 200,
        emitRate: 20, // particles per second
        spread: Math.PI * 2,
        angle: -Math.PI/2,
        speed: 50,
        gravity: 0,
        size: [2,6],
        color: 'rgba(255,255,255,0.8)',
        life: [1,3],
        bounds: { x: 0, y: 0, w: canvas.width, h: canvas.height },
        collideWithBounds: true
      }, options),
      particles: [],
      _lastEmit: performance.now(),
      _raf: null,
      running: false
    };

    const step = (now) => {
      const dt = Math.min(0.05, (now - (emitter._prev || now))/1000);
      emitter._prev = now;
      this._updateEmitter(emitter, dt);
      emitter._raf = requestAnimationFrame(step);
    };

    emitter._step = step;
    this.emitters.set(id, emitter);
    return id;
  }

  _randomBetween(a,b){ return a + Math.random()*(b-a); }

  _spawnParticle(emitter){
    const o = emitter.options;
    if (emitter.particles.length >= o.maxParticles) return;
    const angle = o.angle + (Math.random()-0.5) * o.spread;
    const speed = this._randomBetween(o.speed*0.5, o.speed*1.5);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const life = this._randomBetween(o.life[0]||1, o.life[1]||1);
    const size = this._randomBetween(o.size[0]||2, o.size[1]||4);
    const p = {
      x: (o.x !== undefined ? o.x : emitter.canvas.width/2),
      y: (o.y !== undefined ? o.y : emitter.canvas.height/2),
      vx, vy,
      life, age: 0,
      size,
      color: o.color
    };
    emitter.particles.push(p);
  }

  _updateEmitter(emitter, dt){
    const o = emitter.options;
    const now = performance.now();
    const emitInterval = 1000 / (o.emitRate||10);
    // emit new particles
    if (o.emit) {
      if (now - emitter._lastEmit >= emitInterval) {
        const count = Math.max(1, Math.floor((now - emitter._lastEmit)/emitInterval));
        for (let i=0;i<count;i++) this._spawnParticle(emitter);
        emitter._lastEmit = now;
      }
    }

    // update particles
    const ctx = emitter.ctx;
    ctx.clearRect(0,0,emitter.canvas.width, emitter.canvas.height);
    for (let i = emitter.particles.length -1; i>=0; i--) {
      const p = emitter.particles[i];
      p.vy += o.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.age += dt;
      const lifeRatio = Math.max(0, 1 - p.age / p.life);
      // draw
      ctx.beginPath();
      ctx.fillStyle = this._modulateAlpha(p.color, lifeRatio);
      ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI*2);
      ctx.fill();

      // bounds collision
      if (o.collideWithBounds) {
        const b = o.bounds || {x:0,y:0,w:emitter.canvas.width,h:emitter.canvas.height};
        if (p.x <= b.x || p.x >= b.x + b.w) { p.vx *= -0.6; p.x = Math.max(b.x, Math.min(b.x + b.w, p.x)); }
        if (p.y <= b.y || p.y >= b.y + b.h) { p.vy *= -0.6; p.y = Math.max(b.y, Math.min(b.y + b.h, p.y)); }
      }

      if (p.age >= p.life) {
        emitter.particles.splice(i,1);
      }
    }
  }

  _modulateAlpha(color, t){
    // crude support for rgba(...) or hex: return rgba with alpha * t
    try {
      if (color.startsWith('rgba')){
        const parts = color.replace(/rgba|\(|\)|\s/g,'').split(',');
        const alpha = parseFloat(parts[3]||1) * t;
        return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
      } else if (color.startsWith('rgb(')){
        const parts = color.replace(/rgb|\(|\)|\s/g,'').split(',');
        const alpha = t;
        return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
      } else if (color.startsWith('#')){
        // hex -> rgb
        const hex = color.replace('#','');
        const bigint = parseInt(hex.length===3 ? hex.split('').map(c=>c+c).join('') : hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${t})`;
      }
    } catch(e) {}
    return color;
  }

  start(id){
    const emitter = this.emitters.get(id);
    if (!emitter) return false;
    if (emitter.running) return true;
    emitter.options.emit = true;
    emitter.running = true;
    emitter._prev = performance.now();
    emitter._lastEmit = performance.now();
    emitter._raf = requestAnimationFrame(emitter._step);
    return true;
  }

  stop(id){
    const emitter = this.emitters.get(id);
    if (!emitter) return false;
    emitter.options.emit = false;
    emitter.running = false;
    if (emitter._raf) cancelAnimationFrame(emitter._raf);
    emitter._raf = null;
    return true;
  }

  updateParams(id, params = {}){
    const emitter = this.emitters.get(id);
    if (!emitter) return false;
    Object.assign(emitter.options, params);
    return true;
  }

  destroy(id){
    const emitter = this.emitters.get(id);
    if (!emitter) return false;
    this.stop(id);
    this.emitters.delete(id);
    return true;
  }
}

// Auto-register with Trae adapter
import TraeAdapter from '../trae-adapter.js';
const _adapter2 = TraeAdapter.get();
if (_adapter2 && typeof _adapter2.registerSkill === 'function') {
  _adapter2.registerSkill('canvas-particles', CanvasParticleSkill);
}
