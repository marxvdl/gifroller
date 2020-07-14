#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const gifroller = require('./gifroller');

/*
 * Check command line arguments.
 */
function usage() {
    console.log(
        `Usage: gifroller [OPTIONS] INPUT OUTPUT

Options:
    --vstep=X    Vertical step size = X (default=0)
    --hstep=X    Horizontal step size = X (default=0)

    --vframes=X  Number of frames in vertical roll (overrides vstep)
    --hframes=X  Number of frames in horizontal roll (overrides hstep)

    --delay=N   Duration of each frame in hundreths of a second (default=10)
    --reverse    Invert the standard loop direction
`);

    process.exit(1);
}

if (argv['_'].length != 2) usage();
const input = argv['_'][0];
const output = argv['_'][1];
const vstep = argv['vstep'];
const hstep = argv['hstep'];
const vframes = argv['vframes'];
const hframes = argv['hframes'];
const delay = argv['delay'];
const reverse = argv['reverse'];

if (
    gifroller(
        {
            input: input,
            output: output,
            vstep: vstep,
            hstep: hstep,
            vframes: vframes,
            hframes: hframes,
            delay: delay,
            reverse: reverse
        })
) {
    console.log("Done!");
};
