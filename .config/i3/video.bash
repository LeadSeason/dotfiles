#!/usr/bin/bash

rm -f ~/.cache/vidcap.mp4 ~/.cache/vidcap.ogv

read -r X Y W H < <(slop -l -c 0.3,0.4,0.6,0.4 -f '%x %y %w %h');

recordmydesktop -x=$X -y=$Y --width=$W --height=$H --no-sound -o ~/.cache/vidcap.ogv;
notify-send -i none Recorder "Screen recorder has stoped"
ffmpeg -i ~/.cache/vidcap.ogv -vcodec libx264 ~/.cache/vidcap.mp4;
python3 ~/.local/bin/timhostuploader ~/.cache/vidcap.mp4;

rm -f ~/.cache/vidcap.mp4 ~/.cache/vidcap.ogv
