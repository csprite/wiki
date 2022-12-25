---
title: Building from source
---
# Building from source
**Note**: Since i hadn't documented how to the build csprite v0.1.x, i've documented it now on the basis of how it was built on github actions using the `.github/workflows/ci.yml` file.

### Quick links:
- [Windows](#windows)
- [Linux](#linux)
- [macOS](#macos)

## Windows

1. install [msys2](https://www.msys2.org/)
2. install required dependencies in msys2 mingw64 shell:

```bash
pacman -S mingw-w64-x86_64-clang mingw-w64-x86_64-glfw mingw-w64-x86_64-python mingw-w64-x86_64-python-numpy mingw-w64-x86_64-python-pillow scons make git
```
**Note**: If you want to build for x32 bit system replace the `x86_64` from above packages with `i686`

3. Get the source code: `git clone https://github.com/pegvin/csprite --recursive -b v0.1.0`
4. Generate required assets: `python3 tools/create_icons.py && python3 tools/create_assets.py`
5. Build the source:
	- Debug: `make all CC=clang`
	- Release: `make release CC=clang`

## Linux
1. Install dependencies
	- Debian:
		- `apt install libglfw3 libglfw3-dev git scons`
		- `python3 -m pip install --upgrade Pillow`
		- `python3 -m pip install --upgrade numpy`

2. Get the source code: `git clone https://github.com/pegvin/csprite --recursive -b v0.1.0`
3. Generate required assets: `python3 tools/create_icons.py && python3 tools/create_assets.py`
4. Build the source:
	- Debug: `make all`
	- Release: `make release`

# macOS
1. Install deps with homebrew & pip: `brew install scons dylibbundler glfw && python3 -m pip install --upgrade Pillow && python3 -m pip install --upgrade numpy`
2. Get the source code: `git clone https://github.com/pegvin/csprite --recursive`
3. Generate required assets: `python3 tools/create_icons.py && python3 tools/create_assets.py`
4. Build The Source:
	- Debug: `make all`
	- Release: `make release`

