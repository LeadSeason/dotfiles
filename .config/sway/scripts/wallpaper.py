from datetime import datetime
from time import sleep as s
import os
import signal
import subprocess
import dbus

os.system("pkill swaybg")
old_id = int

os.system("killall -q swaybg &")


while True:
    i = int(str(int(datetime.now().strftime("%H")) / 2).split(".")[0]) + 1
    if not old_id == i:
        image = f"/home/leadseason/.config/sway/wallpaper/dear-{i}.jpg"
        print(image)

        jobs = []
        for pid in os.popen("pgrep swaybg"):
            jobs.append(int(pid))
        for pid in jobs[:-1]:
            os.kill(pid, signal.SIGKILL)

        os.system(f"swaybg -i{image} &")
        old_id = i

    s(2)
