// Simple Trae adapter helper
// This file provides a tiny adapter that tries to register skills with a global `Trae` object
// or exposes a minimal register function for platforms that call scripts directly.

const TraeAdapter = (function(){
  function getGlobal() {
    if (typeof window !== 'undefined') {
      return window;
    }
    return null;
  }

  function registerSkill(name, SkillClass){
    const g = getGlobal();
    if (!g) return false;
    if (g.Trae && typeof g.Trae.registerSkill === 'function') {
      g.Trae.registerSkill(name, SkillClass);
      return true;
    }
    // fallback: attach to TraeSkills map
    g.TraeSkills = g.TraeSkills || {};
    g.TraeSkills[name] = SkillClass;
    return true;
  }

  function get(){
    const g = getGlobal();
    if (!g) return null;
    return {
      registerSkill: registerSkill,
      skills: g.TraeSkills || {}
    };
  }

  return { get, registerSkill };
})();

export default TraeAdapter;
