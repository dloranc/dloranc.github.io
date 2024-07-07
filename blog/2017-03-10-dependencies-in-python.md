---
title: Dependencies in Python

tags:
    - recipes
    - dsp2017
    - python
    - pip
    - virtualenv
image: images/posts_thumbnails/python_dependencies.jpg

description: As I am not particularly proficient in Python some things are new to me. This time a post about how dependencies management look in Python compared to other languages I know.
---
I use JavaScript and PHP on a daily basis at work. In these languages there are package managers `npm` (and more) and `composer` that allow easy dependency management for each project. So far, I've been writing fairly simple scripts in Python and didn't need any package manager. For upcoming projects, I decided to see what the deal is with dependency management in Python.

<!-- truncate -->

## pip (Pip Installs Packages)

Pip is the standard package manager in Python. Below I list the basic commands.

```bash
pip install <package>           # package installation
pip install <package> --upgrade # update a package
pip uninstall                   # uninstalls packages
pip list                        # displays list of installed packages
pip list --outdated             # displays list of outdated packages
pip show                        # displays details about a package
pip freeze                      # displays list of installed packages in requirements.txt file format
pip install -r requirements.txt # installs dependencies from the requirements.txt file
```

When creating a project, it is a good idea to provide in the `requirements.txt` file a list of dependencies that are required to run the project. An example `requirements.txt` file looks as follows:

```
matplotlib==1.3.1
numpy==1.12.0
scikit-learn==0.18.1
```

We can see that the list contains package names and their versions separated by `==` characters.

## pipreqs

However, what if we already have a project and need to create a list of dependencies? Do we have to play around with pulling them from the list obtained with the `pip freeze` command? With help comes the `pipreqs` library.

We install it:

```bash
pip install pipreqs
```

And then we run the command, specifying as a parameter the directory with the project, where we want to get a list of dependencies:

```bash
pipreqs project_directory/
```

## virtualenv

That's all nice, but the bare `pip` has one major drawback - it installs all packages in global space (it's like using `npm install -g <package>`. In case we have several projects and these need different versions of the same library to run we have a problem. The solution is to use the `virtualenv` library. It allows you to create isolated environments with Python and dependencies. Let's see how it works.

To install `virtualenv` type in the console:

```bash
pip install virtualenv
```

Install virtualenv in the project directory:

```bash
virtualenv env            # env is the name of the directory where the environment will be
virtualenv -p python3 env # when we want to use Python 3
```

The env directory will be created. Let's list all files:

```shell-session
$ ls env/
bin include lib local pip-selfcheck.json
```

The `env/bin/` directory contains what we are most interested in, namely the local version of Python and pip.

Ok, let's test `virtualenv`. Installing the library in `virtualenv` looks as follows:

```bash
env/bin/pip install requests
```

Let's verify that this environment is indeed isolated from the main one:

```shell-session
$ env/bin/pip list
appdirs (1.4.3)
packaging (16.8)
pip (9.0.1)
pyparsing (2.2.0)
requests (2.13.0)
setuptools (34.3.1)
six (1.10.0)
wheel (0.29.0)
```

## Making it easier to work with virtualenv

What if we don't want to keep typing `env/bin/pip` and similar commands pertaining to our environment?

First, for testing purposes, we will use the `which` command, which displays the directory where the program being run is stored:

```bash
which python
```

The result of calling this command will most likely be the following path (or similar):

```bash
/usr/bin/python
```

Ok, we change Python and the rest to that of our created environment:

```bash
source env/bin/activate
```

The above command starts a script in the current shell instance that will replace the environment variables with those from the virtual environment.

Type `which python` again in the console and you get something like:

```bash
/home/Dawid/python_projects/virtualenv_test/env/bin/python
```

The above command starts a script in the current shell instance that will replace the environment variables with those from the virtual environment.

Type `which python` again in the console and you get something like:

## Podsumowanie

That's it, we learned the basic use of `pip` and `virtualenv`. I will write about creating packages and sending them to PyPI the next time. I also must admit that I was very surprised that `pip` does not allow the separation of libraries for each project and it requires the installation of a special package. Strange, I have different experiences when it comes to PHP and JS. I bet it's because of some historical events.
