echo catalog
call tsc -p ./catalog
echo minium.fader
call tsc -p ./filters/minium.fader/audio
call tsc -p ./filters/minium.fader/ui
echo minium.equalizer
call tsc -p ./filters/minium.equalizer/audio
call tsc -p ./filters/minium.equalizer/ui
echo minium.compressor
call tsc -p ./filters/minium.compressor/audio
call tsc -p ./filters/minium.compressor/ui
echo minium.reverberator
call tsc -p ./filters/minium.reverberator/audio
call tsc -p ./filters/minium.reverberator/ui
echo minium.pitch
call tsc -p ./performers/minium.pitch/audio
call tsc -p ./performers/minium.pitch/gui
echo minium.percussion
call tsc -p ./samplers/minium.percussion/drm
call tsc -p ./samplers/minium.percussion/gui
echo alphaTabImport
call tsc -p ./actions/alphaTabImport
echo minium.writer
call tsc -p ./actions/minium.writer
echo dx7
call tsc -p ./performers/dx7minium/synth
call tsc -p ./performers/dx7minium/ui
echo tr808
call tsc -p ./samplers/tr808/plugin
call tsc -p ./samplers/tr808/ui
echo minium.baredit
call tsc -p ./actions/minium.baredit
echo miniumshare
call tsc -p ./actions/miniumshare
pause
