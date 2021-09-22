var backgroundColor = 'ffffff';
var gridColor = '000000'
var framerate = 30;
var xPixels = 800;
var yPixels = 800;
var xMathSize = 10;
var yMathSize = 10;
var numFrames = 100;
var initalValue = 0;
var step = 1;
var fnId;
var AnimateVarName;

var zip = JSZip();

var frameNumber = 0;

function onDesmosChange() {

    expressionArray = calculator.getExpressions();

    //for (var i = 0; i < expressionArray.length; i++) console.log(expressionArray[i]);

    var expressionColors = document.getElementById('expression-colors');
    expressionColors.innerHTML = '';

    var dropDown = document.getElementById('animationVar');
    dropDown.innerHTML = '';

    for (var i = 0; i < expressionArray.length; i++) {

        var colorItem1 = document.createElement('label');
        colorItem1.setAttribute('for', 'color' + (i+1));
        colorItem1.innerText = (i+1) + ': ';
        expressionColors.appendChild(colorItem1);
        var colorItem2 = document.createElement('input');
        colorItem2.setAttribute('type', 'color');
        colorItem2.setAttribute('id', 'color' + (i+1));
        colorItem2.setAttribute('name', 'color' + (i+1));
        colorItem2.setAttribute('value', expressionArray[i].color);
        colorItem2.setAttribute('fnId', expressionArray[i].id);
        expressionColors.appendChild(colorItem2);
        var colorItem3 = document.createElement('br');
        expressionColors.appendChild(colorItem3);

        //if (colorItem != null) {
        //    console.log(colorItem)
        //    colorItem.setAttribute("value", expressionArray[i].color);
        //}

        var isSlider = true;
        var string = expressionArray[i].latex;
        if (string != null) {
            string = string.replace(/\\ /g, "");
            var testString = '';
            if (string.includes('=')) {
                testString = string.slice(string.indexOf('=') + 1);
                string = string.slice(0, string.indexOf('='));
            }
            for (var j = 0; j < testString.length; j++) {
                if (!"-1234567890.".includes(testString.charAt(i))) {
                    isSlider = false;
                }
            }
            if (isSlider) {
                var listElement = document.createElement('option');
                listElement.setAttribute("string", string);
                listElement.setAttribute("fnId", expressionArray[i].id);
                listElement.innerText = string.replace(/\\/g, "");
                dropDown.appendChild(listElement)
            }
        }
    }


}

function onColorChange() {
    
    calculator.observeEvent('change', function(){}); 
    var expressionColors = document.getElementById('expression-colors').children;
    for (var i = 0; i < expressionColors.length; i++) {
        var item = expressionColors.item(i);
        if (item.nodeName == 'INPUT') {
            console.log(calculator.getExpressions());
            calculator.setExpression({
                id: item.getAttribute('fnId'),
                color: item.value
            });
            console.log(item.getAttribute('value'));
        };
    }
    calculator.observeEvent('change', onDesmosChange);

}


function downloadZip() {

    var indicator = document.getElementById('record-indicator');
    indicator.textContent = 'Generating download...';
    zip.generateAsync({type:"blob"}).then(function (blob) {
        download(URL.createObjectURL(blob), "output.zip")
        indicator.textContent = 'Downloaded';
    }, function (err) {
        indicator.textContent = err;
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
    document.getElementById('calculator').style.display = 'none';
    document.getElementById('image').style.display = 'inherit'

    backgroundColor = document.getElementById('bcolor').value
    gridColor = document.getElementById('gcolor').value;
    xPixels = parseInt(document.getElementById('xPixels').value)
    yPixels = parseInt(document.getElementById('yPixels').value)
    xMathSize = document.getElementById('xMathSize').value
    yMathSize = document.getElementById('yMathSize').value

    var indicator = document.getElementById('record-indicator');
    indicator.textContent = 'Capturing image...';

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: xPixels,
        height: yPixels,
        mathBounds: { left: (-xMathSize/2), right: (xMathSize/2), top: (yMathSize/2), bottom:(-yMathSize/2) }
    }, function (data) {
        var image = document.getElementById('image')
        image.innerHTML = data;
        changeSvgColors(image);
        zip.file('output/frame_00000.svg', image.innerHTML);
        indicator.textContent = 'Ready to download';
    });

}

//download(URL.createObjectURL(new Blob([changeSvgColors(data)], {type: "image/svg"})), "output.svg")

function record() {

    calculator.setExpression({
        id: fnId,
        latex: AnimateVarName + '=' + (initalValue + frameNumber*step)
    });

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: xPixels,
        height: yPixels,
        mathBounds: { left: (-xMathSize/2), right: (xMathSize/2), top: (yMathSize/2), bottom:(-yMathSize/2) }
    }, recordRepeat);

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
        var indicator = document.getElementById('record-indicator');
        indicator.textContent = 'Ready to download';
    }

}

function changeSvgColors(svg) {

    var background = svg.getElementsByClassName('dcg-svg-background')[0];
    background.setAttribute('fill', backgroundColor);
    
    var classArray = svg.getElementsByClassName('dcg-svg-minor-gridline');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].setAttribute('stroke', gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-major-gridline');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].setAttribute('stroke', gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-axis-line');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].setAttribute('stroke', gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-axis-value');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].childNodes[0].setAttribute('stroke', backgroundColor);
        classArray[i].childNodes[1].setAttribute('fill', gridColor);
    }

    classArray = svg.getElementsByClassName('dcg-svg-polar-axis-value');
    for (i = 0; i < classArray.length; i++) {
        classArray[i].childNodes[0].setAttribute('stroke', backgroundColor);
        classArray[i].childNodes[1].setAttribute('fill', gridColor);
    }
    
}




/// Unused:


/*function updateViewSettings(boolean) {

    calculator.updateSettings({
        showXAxis : boolean,
        showYAxis : boolean,
        showGrid : boolean
    });

}*/