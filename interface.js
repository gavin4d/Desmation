var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt,{
    expressions : true,
    border : true,
    zoomButtons : true,
    pasteGraphLink : true});

var btnElt = document.getElementById('screenshot-button');
btnElt.addEventListener('click', captureScreenshot);

var btnElt4 = document.getElementById('record-button');
btnElt4.addEventListener('click', record);

var btnElt5 = document.getElementById('download-button');
btnElt5.addEventListener('click', downloadZip);

calculator.setExpression({ id: '1', latex: 'y=ax^2' });