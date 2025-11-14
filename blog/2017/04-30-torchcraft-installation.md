---
title: TorchCraft installation
tags:
    - projects
    - dsp2017
    - starcraft
    - bwapi
image: images/posts_thumbnails/torchcraft_installing.jpg

description: What's up with my project? Weakly, I'm agonizing over setting up TorchCraft to get it working.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

This whole week I was wondering what path to take for my bot project. I wanted to use Deeplearning4j, but this library conflicts with BWMirror, which requires Java 32-Bit. An alternative is to rewrite the entire project from BWMirror to JNIBWAPI. The second alternative is to rewrite the project to C++, which I am not very interested in because I don't feel good in this language. I mean, not in Java either, but writing in Java is easier to learn. However, I finally decided to take up TorchCraft. Of course, I lose the opportunity to participate in SSCAIT, but I think it will be better to finally do something related to reinforcement learning using a ready-made environment. If I had to do the same in Java, it would take me a lot of time.

<!-- truncate -->

## Installation on Linux
It took me a while to install Torch, Lua and TorchCraft. As it happens, when using the instructions on [the project website](https://github.com/TorchCraft/TorchCraft/blob/master/docs/user/installation.md) something didn't work. After quite a long time of thinking about what to do to set everything up, I came to the conclusion that it is best to install Torch using the instructions from [this website](http://torch.ch/docs/getting-started.html#_).

Going back to [TorchCraft installation description](https://github.com/TorchCraft/TorchCraft/blob/master/docs/user/installation.md) instead of:
```bash
git clone git@github.com:torchcraft/torchcraft.git --recursive
```

You need to clone:
```bash
git clone https://github.com/TorchCraft/TorchCraft.git --recursive
```

## Installation on Windows
Here it was quite simple, because everything was limited to copying files. I used **BVEnv.exe** from the manual.

## Tying everything together
I installed everything. Time to launch it. On the Linux virtual machine, you need to run the following in the console:
```bash
th simple_exe.lua -t $server_ip
```
Instead of **$server_ip** you need to substitute the host IP. To do this, you need to use the `ipconfig` command in Windows and substitute one of the addresses that appear. There's probably nothing else you need to do in Linux.

It's worse on Windows. I ran **BVEnv.exe** and there's one thing I can't figure out, which is that after running this file, something like this is displayed:
```
Welcome to the Brood War TorchCraft Environment.
Compiled on Mar 18 2017, 07:48:54.
<Config Info>
  loaded: 1
  current path: C:/StarCraft/bwapi-data/torchcraft.ini
general
  port = 0
  log_path = C:/tc_data/torchcraft_log_cpp_port_
  display_log = 0
  img_mode = raw
  window_mode = windows
  window_mode_custom =
  img_save_path = C:/tc_data/output_
starcraft
  assume_on = 0
  launcher = injectory
  custom_launcher =

C:/StarCraft//TorchCraft/\BWEnv\bin\injectory.x86.exe --launch C:/StarCraft/\StarCraft.exe --inject C:/StarCraft/\bwapi-data\BWAPI.dll
While running command:
        00996F98
CreateProcess failed: 2
Connecting...
```

The path to Starcraft is incorrect, it is in a completely different place. I couldn't find out whether it is possible to pass any arguments to BWEnv.exe. The code shows that there is no such thing, so I will have to change and recompile this project.

## Summary
I didn't get much done this week. That's the life, I always have to be stopped by some stupid technical problems. I'll try to put it together in the near future. To make things more funny, something went wrong with the bot's Java project, and I didn't change anything in the code. When I try to compile the bot, I get the following error: `Exception in thread "main" java.lang.UnsatisfiedLinkError: \{path\}\bwapi_bridge2_5.dll: Can't find dependent libraries`, even though all DLLs are where they were and it worked before. How it's even possible?

As a consolation, I must say that my bot, despite its simplicity, is doing well on the SSCAIT ladder. I achieved a 60% winratio (39 wins, 42 losses), which in my opinion is a good result for such a simple bot.
