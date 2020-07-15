# gifroller

**gifroller** is both a command line utility and a JavaScript library for Node.js that converts static images into animated gifs like this:

![example](https://raw.githubusercontent.com/marxvdl/gifroller/master/example-output.gif)

## Pre-Requisites

Before using **gifroller**, you will need the `graphicsmagick` library installed on your system.

On Ubuntu, use `apt`:

    sudo apt install graphicsmagick

On Mac OS X, use [Homebrew](http://mxcl.github.io/homebrew/):

    brew install graphicsmagick

## Installing

To install **gifroller** globally on the system (useful if you want it as a command line app), use:

    npm i -g gifroller

To install it only in your project, use:

    npm i --save gifroller

## Command line app

    Usage: gifroller [OPTIONS] INPUT OUTPUT

    Options:
        --vstep=X    Vertical step size = X (default=0)
        --hstep=X    Horizontal step size = X (default=0)

        --vframes=X  Number of frames in vertical roll (overrides vstep)
        --hframes=X  Number of frames in horizontal roll (overrides hstep)

        --delay=N   Duration of each frame in hundreths of a second (default=10)
        --reverse    Invert the standard loop direction

The order of the arguments does not matter (except for input and output).

For example, the animation on top of this page was generated with:

    npx gifroller ./input.png example.gif --hframes=30 --reverse --delay=8

## Node.js library

To use **gifroller** in your Node.js code, just import `gifroller` and call it using an *options* object. The parameters on this object are the same as the ones in the command line utility.


```javascript
const gifroller = require('gifroller');

gifroller({
    input: 'input.png',
    output: 'example.gif',
    hframes: 30,
    reverse: true,
    delay: 8
});
```