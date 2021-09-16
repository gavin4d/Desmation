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

    calculator.updateSettings({
        showXAxis : false,
        showYAxis : false,
        showGrid : false
    });

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: 800,
        height: 800,
        mathBounds: { left: -5, right: 5, top: 5, bottom:-5 }
    }, function (data) {download(URL.createObjectURL(new Blob([data], {type: "image/svg"})), "output.svg")});

    calculator.updateSettings({
        showXAxis : true,
        showYAxis : true,
        showGrid : true
    });

}

function record() {

    calculator.setExpression({
        id: '2',
        latex: 'a=' + frameNumber
    });

    updateViewSettings(false)

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: 800,
        height: 800,
        mathBounds: { left: -5, right: 5, top: 5, bottom:-5 }
    }, recordRepeat);

    updateViewSettings(true)

}

function recordRepeat(data) {

    //sessionStorage.setItem('Frame_'+ ('0000' + frameNumber).slice(-4), data);
    zip.file('frame_'+ ('00000' + frameNumber).slice(-5) + '.svg', data);

    document.getElementById("image").innerHTML = data;
    
    frameNumber ++;

    if (frameNumber < 10) {

        record()

    } else {
        frameNumber = 0
        zip.file('Convert to mp4.sh', 'ffmpeg -r 10 -i frame_%05d.svg -c:v libx264 output.mp4');
    }

}

function updateViewSettings(boolean) {

    calculator.updateSettings({
        showXAxis : boolean,
        showYAxis : boolean,
        showGrid : boolean
    });

}