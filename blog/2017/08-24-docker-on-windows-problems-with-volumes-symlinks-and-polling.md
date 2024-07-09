---
title: Docker on Windows - problems with volumes, symlinks and connectivity
tags:
    - problems
    - docker
image: images/posts_thumbnails/docker_on_windows_problems_with_volumes_symlinks_and_connection.png

description: I've recently started learning Docker (I know, late a bit) and have encountered a few problems with it. Unfortunately, Windows doesn't like Docker very much.
---

I started learning docker a few days ago. So far I have used Vagrant for virtualization, but it didn't sit very well with me. But I don't want to talk about that. I haven't quite grasped docker yet, but after a few attempts and one project, I've found that it's a cool thing to do. However, I'm not going to create any tutorial. If you are interested in one, I invite you to check the [docker-curriculum.com](https://docker-curriculum.com/). It's pretty cool and does a good job of explaining the basics.

While playing around with docker, I encountered a few problems and that's what this post will be about.

<!-- truncate -->

## Volumes

While trying to work with a simple project, I found that the container could not see the files, even though I had set the appropriate *volumes* in `docker-compose.yml`. Trying to fire up *bash* in the container with something like `-v "$PWD/":/var/www/html` set also failed. It turned out that [the problem is Windows](https://docs.docker.com/compose/gettingstarted/#step-6-re-build-and-run-the-app-with-compose). Since I can't use *Hyper-V* because I don't have *Windows 10 Professional* I have to use *Docker Toolbox*. After two hours of struggle, it turned out that in docker the files are visible only if they are in any subdirectory `c:\Users`. Somehow VirtualBox works that way, they made it so. On the regular docker for Windows [in the documentation](https://docs.docker.com/docker-for-windows/#shared-drives), I saw that you can fix the issue in the GUI by making each partition accessible.

One thing puzzles me. Since you're using containers to have an isolated environment, maybe this should somehow apply to file systems? Because that way the isolation is not complete.

## Symlinks

The second issue is also related to Windows. After calling the command in the container:

```bash
npm install <package_name> --save-dev
```

NPM throws something like:

```bash
npm ERR! code EPROTO
npm ERR! errno -71
npm ERR! syscall symlink
npm ERR! EPROTO: protocol error, symlink '../uglify-js/bin/uglifyjs' -> 'var/www/html/node_modules/.bin/uglifyjs'
```

Well, yes, it is impossible to do symlinks in a container, because docker does not embrace it, despite the fact that on Windows it is possible to do symlinks (the so-called `junction`). The solution turned out to be adding the `--no-bin-links` switch to the command:

```bash
npm install <package_name> --save-dev --no-bin-links
```

What's worse is that this most likely won't work in other cases, so I'll have to find some other way.

Maybe I'll finally install the Linux? :-)
