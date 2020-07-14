const gm = require('gm');
const fs = require('fs');
const tmp = require('tmp');

module.exports = function (options) {

    //Parse options
    if (options.delay === undefined) options.delay = 10;
    if (options.input === undefined) throw ("Error: input file no specified");
    if (options.output === undefined) throw ("Error: output file no specified");
    if (options.reverse === undefined) options.reverse = false;

    if (!fs.existsSync(options.input)) {
        throw ("Error: file not found: " + options.input);
    }

    //Start by reading the source image
    let imageWidth = undefined;
    let imageHeight = undefined;
    gm(options.input)
        .size((err, value) => {
            if (err) {
                throw (err);
            }
            else {
                if (value === undefined) {
                    throw ("Error: Could not read image in " + options.input);
                }
                else {
                    imageWidth = value.width;
                    imageHeight = value.height;

                    if (options.hframes !== undefined)
                        options.hstep = imageWidth / options.hframes;

                    if (options.vframes !== undefined)
                        options.vstep = imageHeight / options.vframes;

                    if (options.hstep === undefined) options.hstep = 0;
                    if (options.vstep === undefined) options.vstep = 0;

                    // If the image was correctly read, do all the rest:
                    checkSizeErrors();
                    return generateGif();
                }
            }
        });

    /**
     * Do a lot of checks to ensure that the values of horizontal and vertical steps make sense.
     */
    function checkSizeErrors() {
        let sizeErrors = [];

        if (!Number.isFinite(options.hstep) || (options.hstep < 0)) {
            sizeErrors.push(`Error: Horizontal step ${options.hstep} is invalid, must be a positive number`);
        }

        if (options.hstep > imageWidth) {
            sizeErrors.push(`Error: Horizontal step ${options.hstep} is invalid, cannot be higher than image width (${imageWidth})`);
        }

        if (!Number.isFinite(options.vstep) || (options.vstep < 0)) {
            sizeErrors.push(`Error: Vertical step ${options.vstep} is invalid, must be a positive number`);
        }

        if (options.vstep > imageHeight) {
            sizeErrors.push(`Error: Vertical step ${options.vstep} is invalid, cannot be higher than image height (${imageWidth})`);
        }

        if (sizeErrors.length != 0) {
            throw (sizeErrors);
        }
    }

    /*
     * Creates each individual frame.
     */
    function generateGif() {
        let frames = [];
        let offsetX = 0;
        let offsetY = 0;

        let startedFrames = 0;
        let completedFrames = 0;

        // Process each frame s
        do {
            const tmpobj = tmp.fileSync(
                {
                    prefix: 'frame' + startedFrames
                }
            );

            gm(options.input)
                .roll(offsetX, offsetY)
                .write(tmpobj.name, err => {
                    if (err) {
                        throw (err);
                    }
                    else {
                        frames.push(tmpobj.name);
                        if (++completedFrames == startedFrames) {
                            frames.sort((a, b) => {
                                return a.match(/frame(\d+)/)[1] - b.match(/frame(\d+)/)[1];
                            })
                            if(options.reverse){
                                frames.reverse();
                            }
                            return assembleGif(frames);
                        }
                    }
                });

            offsetX += options.hstep;
            offsetY += options.vstep;

            if ((options.hstep === 0) && (options.vstep === 0))
                break;

            startedFrames++;

        } while ((offsetX < imageWidth - 1) && (offsetY < imageHeight - 1));

    }

    /*
     * Assembles the final gif animation.
     */
    function assembleGif(frames) {
        let gif = gm();
        for (frame of frames) {
            gif = gif.in(frame);
        }
        gif
            .delay(options.delay)
            .write(options.output, err => {
                if (err) {
                    throw (err);
                }
                else {
                    return removeTemporatyFiles(frames);
                }
            });
    }

    /*
     * Deletes the temporary frame images
     */
    function removeTemporatyFiles(frames) {
        for (frame of frames) {
            fs.unlinkSync(frame);
        }
        return true;
    }

    // https://stackoverflow.com/a/10835227/641312
    function isPositiveInteger(n) {
        return n >>> 0 === parseFloat(n);
    }
}