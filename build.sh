#!/bin/bash
# Compiles the .jsx source files to plain .js (drops the in-browser Babel).
# Re-run this after editing any .jsx file, then commit the updated .js.
cd "$(dirname "$0")"
node -e "
const b=require('@babel/core'),fs=require('fs');
['portfolio','work-index','project','about'].forEach(n=>{
  const s=fs.readFileSync(n+'.jsx','utf8');
  const o=b.transformSync(s,{presets:['@babel/preset-react'],compact:true}).code;
  fs.writeFileSync(n+'.js',o);
  console.log('built '+n+'.js ('+(o.length/1024|0)+'KB)');
});"
