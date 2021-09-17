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

    var image = document.getElementById("image");
    image.innerHTML = data;

    //sessionStorage.setItem('Frame_'+ ('0000' + frameNumber).slice(-4), data);
    changeSvgColors(image);
    zip.file('output/frame_'+ ('00000' + frameNumber).slice(-5) + '.svg', image.innerHTML);

    
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

function changeSvgColors(svg) {

    var background = svg.getElementsByClassName('dcg-svg-background')[0];
    background.setAttribute('fill', '#' + backgroundColor);
    
    var classArray = svg.getElementsByClassName('dcg-svg-minor-gridline');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].setAttribute('stroke', '#' + gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-major-gridline');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].setAttribute('stroke', '#' + gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-axis-line');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].setAttribute('stroke', '#' + gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-axis-value');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].childNodes[0].setAttribute('stroke', '#' + backgroundColor);
        classArray[i].childNodes[1].setAttribute('fill', '#' + gridColor);
    }
    
}