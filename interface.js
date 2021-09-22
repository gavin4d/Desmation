var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt,{
    border : false,
    pasteGraphLink : true
});

var btnElt = document.getElementById('screenshot-button');
btnElt.addEventListener('click', captureScreenshot);

var btnElt4 = document.getElementById('record-button');
btnElt4.addEventListener('click', startRecord);

function startRecord() {

    backgroundColor = document.getElementById('bcolor').value;
    gridColor = document.getElementById('gcolor').value;
    framerate = document.getElementById('framerate').value;
    xPixels = parseInt(document.getElementById('xPixels').value);
    yPixels = parseInt(document.getElementById('yPixels').value);
    xMathSize = document.getElementById('xMathSize').value;
    yMathSize = document.getElementById('yMathSize').value;
    numFrames = parseInt(document.getElementById('numFrames').value);
    initalValue = parseFloat(document.getElementById('initalValue').value);
    step = parseFloat(document.getElementById('step').value);

    var dropDown = document.getElementById('animationVar');
    fnId = dropDown.options[dropDown.selectedIndex].getAttribute('fnId');
    AnimateVarName = dropDown.options[dropDown.selectedIndex].getAttribute('string');

    record()
    
}

var btnElt5 = document.getElementById('download-button');
btnElt5.addEventListener('click', downloadZip);

var expressionColors = document.getElementById('expression-colors');
expressionColors.addEventListener('change', onColorChange);

calculator.setExpression({ id: '1', latex: 'y=ax^2' });
calculator.observeEvent('change', onDesmosChange);