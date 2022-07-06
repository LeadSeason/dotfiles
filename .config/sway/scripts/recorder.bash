#!/usr/bin/bash

read -r reg < <(slurp)

if [ -z "$reg" ]; then
		echo "Canseled by user"
		exit 1
fi

rm -f ~/.cache/vidcap-unencoded.mp4 ~/.cache/vidcap.mp4

wf-recorder -g "$reg" -f ~/.cache/vidcap-unencoded.mp4
notify-send -i none Recorder "Screen recording stopped"
ffmpeg -i ~/.cache/vidcap-unencoded.mp4 -vf yadif,format=yuv420p -c:v libx264 -crf 18 -bf 2 -c:a aac -q:a 1 -ac 2 -ar 48000 -use_editlist 0 -movflags +faststart ~/.cache/vidcap.mp4
python3 ~/.local/bin/timhostuploader ~/.cache/vidcap.mp4

rm -f ~/.cache/vidcap.mp4 ~/.cache/vidcap-unencoded.mp4
