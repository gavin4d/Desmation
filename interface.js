var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt,{
    expressions : true,
    border : true,
    zoomButtons : true,
    pasteGraphLink : true
});

var btnElt = document.getElementById('screenshot-button');
btnElt.addEventListener('click', captureScreenshot);

var btnElt4 = document.getElementById('record-button');
btnElt4.addEventListener('click', startRecord);

function startRecord() {

    backgroundColor = document.getElementById('bcolor').value;
    framerate = document.getElementById('framerate').value;
    xPixels = parseInt(document.getElementById('xPixels').value);
    yPixels = parseInt(document.getElementById('yPixels').value);
    xMathSize = document.getElementById('xMathSize').value;
    yMathSize = document.getElementById('yMathSize').value;
    numFrames = parseInt(document.getElementById('numFrames').value);
    initalValue = parseFloat(document.getElementById('initalValue').value);
    step = parseFloat(document.getElementById('step').value);

    record()
    
}

var btnElt5 = document.getElementById('download-button');
btnElt5.addEventListener('click', downloadZip);

calculator.setExpression({ id: '1', latex: 'y=ax^2' });