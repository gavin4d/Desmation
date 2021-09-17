var backgroundColor = 'ffffff';
var gridColor = '000000'
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

function download (path, filename) {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}; 

function captureScreenshot () {

    backgroundColor = document.getElementById('bcolor').value
    gridColor = document.getElementById('gcolor').value;
    xPixels = parseInt(document.getElementById('xPixels').value)
    yPixels = parseInt(document.getElementById('yPixels').value)
    xMathSize = document.getElementById('xMathSize').value
    yMathSize = document.getElementById('yMathSize').value
    
    updateViewSettings(false);

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: xPixels,
        height: yPixels,
        mathBounds: { left: (-xMathSize/2), right: (xMathSize/2), top: (yMathSize/2), bottom:(-yMathSize/2) }
    }, function (data) {download(URL.createObjectURL(new Blob([changeSvgColors(data)], {type: "image/svg"})), "output.svg")});

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
    var newData = changeSvgColors(data);
    zip.file('output/frame_'+ ('00000' + frameNumber).slice(-5) + '.svg', newData);

    document.getElementById("image").innerHTML = newData;
    
    frameNumber ++;

    if (frameNumber < numFrames) {

        record()

    } else {
        frameNumber = 0
        zip.file('output/Convert to mp4.sh', 'ffmpeg -r '+ framerate +' -i frame_%05d.svg -c:v libx264 output.mp4');
    }

}

function updateViewSettings(boolean) {

    calculator.updateSettings({
        //showXAxis : boolean,
        //showYAxis : boolean,
        //showGrid : boolean
    });

}

function changeSvgColors(svgData) {

    return svgData.replace('<rect fill="white', '<rect fill="#' + backgroundColor)
    .replace('fill="none" stroke="rgb(0,0,0)', 'fill="none" stroke="#' + gridColor)
    .replace('<text fill="none" stroke="#ffffff', '<text fill="none" stroke="#' + backgroundColor)
    .replace('<text fill="#000000" stroke="none"', '<text fill="#' + gridColor + '" stroke="none"');
    // really bad code that doesn't check what it is changing 
    // and relies on the formatting provided by desmos
    //TODO: fix this bad code
}