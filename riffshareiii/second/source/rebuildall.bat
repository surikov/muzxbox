rem echo %cd%
echo mzxbx
call tsc -p .\mzxbx\mzxbxlib
echo tilelevel
call tsc -p .\tilelevel\tilelevelsrc
echo application
call tsc -p .\application
cd plugins
call .\rebuildplugins.bat
rem call javascript-obfuscator ..\minium\js\mzxbxlib.js --output ..\minium\js\mzxbxlib.js
rem del ..\minium\js\mzxbxlib.js.map
rem del ..\minium\js\mzxbxlib.d.ts
pause
rem npm install -g javascript-obfuscator
