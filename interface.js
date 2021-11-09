var lastChange = [0,1];
var keepDuration = true;

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
    document.getElementById('calculator').style.display = 'none';
    document.getElementById('image').style.display = 'inherit'

    backgroundColor = document.getElementById('bcolor').value;
    gridColor = document.getElementById('gcolor').value;

    var dropDown = document.getElementById('animationVar');
    fnId = dropDown.options[dropDown.selectedIndex].getAttribute('fnId');
    AnimateVarName = dropDown.options[dropDown.selectedIndex].getAttribute('string');

    var indicator = document.getElementById('record-indicator');
    indicator.textContent = 'Recording...';

    zip.remove('output');

    record()
    
}

var btnElt5 = document.getElementById('download-button');
btnElt5.addEventListener('click', downloadZip);

var expressionColors = document.getElementById('expression-colors');
expressionColors.addEventListener('change', onColorChange);
//document.getElementById('bcolor').addEventListener('change', onColorChange);
//document.getElementById('gcolor').addEventListener('change', onColorChange);

calculator.observeEvent('change', onDesmosChange);

var configForm = document.getElementById('config');
configForm.addEventListener('change', configChange)

function configChange() {

    var change = null;
    var oldConfig;

    //lockDuration = document.getElementById('lockDuration').checked;

    for (var i = 0; i < configIds.length; i++) {
        oldConfig = config[i];
        config[i] = parseFloat(document.getElementById(configIds[i]).value);

        if (config[i] != oldConfig && !isNaN(config[i])) {
            change = configIds[i];
        }

        //console.log(config[i]);

    }    

    if (change != null) {

        switch (change) {

            case 'framerate':
                if (keepDuration) { // change number of frames
                    config[2] = Math.floor(config[1]*config[0]);
                    document.getElementById(configIds[2]).textContent = config[2];
                } else { // change duration
                    config[1] = config[2]/config[0];
                    document.getElementById(configIds[1]).value = config[1];
                }
                break;
            case 'duration':
                keepDuration = true;
                if (lastChange[0] != 0) {
                    lastChange[1] = lastChange[0]
                    lastChange[0] = 0
                }
                var changeNumber = lastChange[0];
                if (lastChange[0] == 0) changeNumber = lastChange[1];
                // change number of frames
                config[2] = Math.floor(config[1]*config[0]);
                document.getElementById(configIds[2]).textContent = config[2];
                // change final value and step
                if (changeNumber == 1) {
                    // change step size
                    config[5] = (config[4]-config[3])/(config[2]-1);
                    document.getElementById(configIds[5]).value = config[5];
                } else {
                    // change final value
                    config[4] = config[3]+config[5]*(config[2]-1);
                    document.getElementById(configIds[4]).value = config[4];
                }
                break;
            /*case 'numFrames':
                keepDuration = false;
                if (lastChange[0] != 0) {
                    lastChange[1] = lastChange[0];
                    lastChange[0] = 0;
                }
                // change duration
                config[1] = config[2]/config[0];
                document.getElementById(configIds[1]).value = config[1];
                break;*/
            case 'initalValue':
                var changeNumber = lastChange[0];
                if (lastChange[0] == 0) changeNumber = lastChange[1];
                if (changeNumber == 1) {
                    // change step size
                    config[5] = (config[4]-config[3])/(config[2]-1);
                    document.getElementById(configIds[5]).value = config[5];
                } else {
                    // change final value
                    config[4] = config[3]+config[5]*(config[2]-1);
                    document.getElementById(configIds[4]).value = config[4];
                }
                break;
            case 'finalValue':
                if (lastChange[0] != 1) {
                    lastChange[1] = lastChange[0];
                    lastChange[0] = 1;
                }
                var changeNumber = lastChange[0];
                if (lastChange[0] == 1) changeNumber = lastChange[1];
                if (changeNumber == 0) {
                    // change step size
                    config[5] = (config[4]-config[3])/(config[2]-1);
                    document.getElementById(configIds[5]).value = config[5];
                } else {
                    // change number of frames
                    config[2] = Math.floor((config[4]-config[3])/config[5])+1;
                    document.getElementById(configIds[2]).textContent = config[2];
                    // change duration
                    config[1] = config[2]/config[0];
                    document.getElementById(configIds[1]).value = config[1];
                }

                break;
            case 'step':
                if (lastChange[0] != 2) {
                    lastChange[1] = lastChange[0];
                    lastChange[0] = 2;
                }
                var changeNumber = lastChange[0];
                if (lastChange[0] == 2) changeNumber = lastChange[1];
                if (changeNumber == 0) {
                    // change final value
                    config[4] = config[3]+config[5]*(config[2]-1);
                    document.getElementById(configIds[4]).value = config[4];
                } else {
                    // change number of frames
                    config[2] = Math.floor((config[4]-config[3])/config[5]);
                    document.getElementById(configIds[2]).textContent = config[2];
                    // change duration
                    config[1] = config[2]/config[0];
                    document.getElementById(configIds[1]).value = config[1];
                }
                break;


        }

        //console.log(lastChange)

    }


    
}
