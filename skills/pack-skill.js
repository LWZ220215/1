/*
Packaging helper script (Node.js)
Usage:
  node skills/pack-skill.js ./skills/svg-animation ./dist/svg-animation.skill
  node skills/pack-skill.js ./skills/canvas-particles ./dist/canvas-particles.skill

This script zips the skill folder preserving structure to a .skill (zip) file.
*/

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

if (require.main === module) {
  const src = process.argv[2];
  const out = process.argv[3];
  if (!src || !out) {
    console.error('Usage: node pack-skill.js <skill-folder> <out.zip>');
    process.exit(2);
  }
  pack(src, out).then(()=>console.log('Packed', out)).catch(e=>{console.error(e); process.exit(1);});
}

function pack(srcFolder, outFile) {
  return new Promise((resolve, reject)=>{
    const output = fs.createWriteStream(outFile);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', ()=>resolve());
    archive.on('error', err=>reject(err));
    archive.pipe(output);
    archive.directory(srcFolder, false);
    archive.finalize();
  });
}

module.exports = { pack };
