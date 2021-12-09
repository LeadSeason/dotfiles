#!/usr/bin/python

import os
import sys
import imghdr

if len(sys.argv) == 1:
    os.system("/usr/bin/cat")

arg_list = ""
img_list = []
txt_list = []

for x in sys.argv[1::]:
    if x.startswith("-") or x.startswith("--"):
        arg_list += f" {x}"

for x in sys.argv[1::]:
    if imghdr.what(x) in ["png", "jpg", "jpeg", "webm", "gif"] and os.environ["TERM"] == "xterm-kitty":
        os.system(f"kitty +kitten icat --align=left '{x}'")
    else:
        os.system(f"/usr/bin/cat {arg_list} '{x}'")
