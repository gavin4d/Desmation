var backgroundColor = 'bbbb00';
var framerate = 30;
var xPixels = 800;
var yPixels = 800;
var xMathSize = 10;
var yMathSize = 10;
var numFrames = 10;
var initalValue = 0;
var step = 1;

var zip = JSZip();

var frameNumber = 0;

function downloadZip() {
    zip.generateAsync({type:"blob"}).then(function (blob) {
        download(URL.createObjectURL(blob), "output.zip")
    }, function (err) {
        btnElt5.text(err);
    })
}

const download = (path, filename) => {
    // Create a new link
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;

    // Append to the DOM
    document.body.appendChild(anchor);

    // Trigger `click` event
    anchor.click();

    // Remove element from DOM
    document.body.removeChild(anchor);
}; 

function captureScreenshot () {

    backgroundColor = document.getElementById('bcolor').value
    xPixels = document.getElementById('xPixels').value
    yPixels = document.getElementById('yPixels').value
    xMathSize = document.getElementById('xMathSize').value
    yMathSize = document.getElementById('yMathSize').value
    
    updateViewSettings(false);

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: xPixels,
        height: yPixels,
        mathBounds: { left: (-xMathSize/2), right: (xMathSize/2), top: (yMathSize/2), bottom:(-yMathSize/2) }
    }, function (data) {download(URL.createObjectURL(new Blob([changeSvgColors(data, backgroundColor, '000000')], {type: "image/svg"})), "output.svg")});

    updateViewSettings(true);

}

function record() {

    calculator.setExpression({
        id: '2',
        latex: 'a=' + (initalValue + frameNumber*step)
    });

    updateViewSettings(false);

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: xPixels,
        height: yPixels,
        mathBounds: { left: (-xMathSize/2), right: (xMathSize/2), top: (yMathSize/2), bottom:(-yMathSize/2) }
    }, recordRepeat);

    updateViewSettings(true);

}

function recordRepeat(data) {

    //sessionStorage.setItem('Frame_'+ ('0000' + frameNumber).slice(-4), data);
    var newData = changeSvgColors(data, backgroundColor, '000000')
    zip.file('frame_'+ ('00000' + frameNumber).slice(-5) + '.svg', newData);

    document.getElementById("image").innerHTML = newData;
    
    frameNumber ++;

    if (frameNumber < numFrames) {

        record()

    } else {
        frameNumber = 0
        zip.file('Convert to mp4.sh', 'ffmpeg -r '+ framerate +' -i frame_%05d.svg -c:v libx264 output.mp4');
    }

}

function updateViewSettings(boolean) {

    calculator.updateSettings({
        //showXAxis : boolean,
        //showYAxis : boolean,
        //showGrid : boolean
    });

}

function changeSvgColors(svgData, backgroundColor, gridColor) {

    return svgData.replace('<rect fill="white', '<rect fill="#' + backgroundColor).replace('<path fill="none" stroke="rgb(0,0,0)', '<path fill="none" stroke="#' + gridColor);
    // really bad code that doesn't check what it is changing 
    // and relies on the formatting provided by desmos
    //TODO: fix this bad code
}