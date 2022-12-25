---
title: Building from source
---
# Building from source

### Quick links:
- [Windows](#windows)
- [Linux](#linux)
- [macOS](#macos)

## Windows

1. install [msys2](https://www.msys2.org/)
2. install required dependencies in msys2 mingw64 shell:

```bash
pacman -S make git mingw-w64-x86_64-clang mingw-w64-x86_64-SDL2 mingw-w64-x86_64-python mingw-w64-x86_64-python-numpy mingw-w64-x86_64-python-pillow
```
**Note**: If you want to build for x32 bit system replace the `x86_64` from above packages with `i686`

3. Get The Source Code: `git clone https://github.com/pegvin/csprite --recursive`
4. Generate Required Assets: `make gen-assets`

**Note**: in my case i had `pillow` & `numpy` installed from above command but python did not found them, in that case i had to manually run each script with `python3w` command like this:

```bash
python3w.exe tools/create_icons.py
python3w.exe tools/create_assets.py
```

5. Generate RC For Windows: `make gen-rc Arch=x86_64` (or replace `x86_64` with `i686` if your target system is x32)
6. Build The Source:
	- Debug: `make all`
	- Release: `make BUILD_TARGET=release WINDRES_TARGET=pe-x86-64` (or replace `pe-x86-64` with `pe-i386` if your target system is x32)

#### Notes
- `WINDRES_TARGET` isn't need on x64 machines as it's default
- `Arch` isn't need on x64 machines as it's default

## Linux

1. Install SDL2 On Arch & it's children you can just install it using pacman: `sudo pacman -S sdl2` but on debian & it's children the repositories are older than my grandma so we need to [build SDL2 from source](https://wiki.libsdl.org/SDL2/Installation):

```bash
git clone https://github.com/libsdl-org/SDL
cd SDL
mkdir build
cd build
../configure
make
sudo make install
```

2. Install Other Dependencies:
	- Arch: `pacman -S gcc make python3 python-numpy python-pillow`
	- Debian:
		- `apt install gcc g++ make python3 python3-pip`
		- `python3 -m pip install --upgrade Pillow`
		- `python3 -m pip install --upgrade numpy`

3. Get The Source Code: `git clone https://github.com/pegvin/csprite --recursive`
4. Generate Required Assets: `make gen-assets`
5. Build The Source:
	- Debug: `make all SDL2_STATIC_LINK=0`
	- Release: `make all BUILD_TARGET=release SDL2_STATIC_LINK=0`

# macOS
1. Install deps with homebrew: `brew install sdl2 pillow numpy`
2. Get the source code: `git clone https://github.com/pegvin/csprite --recursive`
3. Generate Required Assets: `make gen-assets`
4. Build The Source:
	- Debug: `make all`
	- Release: `make all BUILD_TARGET=release`
