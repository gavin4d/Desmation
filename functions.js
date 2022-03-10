var config = [30,1,30,0,1,0.034482758620689655,1920,1080,1,16,9];
var configIds = ['framerate','duration','numFrames','initalValue','finalValue','step','xPixels','yPixels','gscale','xMathSize','yMathSize'];

var backgroundColor = 'ffffff';
var gridColor = '000000';
var xPixels;
var xMathSize;
var fnId;
var AnimateVarName;

var selectedTab = "none";

var zip = JSZip();

var frameNumber = 0;

function onDesmosChange() {

    expressionArray = calculator.getExpressions();

    //for (var i = 0; i < expressionArray.length; i++) console.log(expressionArray[i]);

    var expressionColors = document.getElementById('expression-colors');
    expressionColors.innerHTML = '';

    var dropDown = document.getElementById('animationVar');
    var selected_string = dropDown.value;
    //if (dropDown.value != null) selected_string = dropDown.value.getAttribute("string");
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
            } else {
                isSlider = false;
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
                dropDown.appendChild(listElement);
                if (string == selected_string) dropDown.value = string;
            }
        }
    }

}

function onGridColorChange() {
    var graphPaper = document.getElementsByClassName('dcg-container')[0];
    backgroundColor = document.getElementById('bcolor').value;
    gridColor = document.getElementById('gcolor').value;
    if(document.getElementById('bcolorupdate').checked) {
        graphPaper.setAttribute('style', 'font-size:16px;background: ' + backgroundColor + ';color: #000000;');
    } else {
        graphPaper.setAttribute('style', 'font-size:16px;background: #ffffff;color: #000000;');
    }
}

function onColorChange() {
    
    calculator.observeEvent('change', function(){}); 
    var expressionColors = document.getElementById('expression-colors').children;
    for (var i = 0; i < expressionColors.length; i++) {
        var item = expressionColors.item(i);
        if (item.nodeName == 'INPUT') {
            //console.log(calculator.getExpressions());
            calculator.setExpression({
                id: item.getAttribute('fnId'),
                color: item.value
            });
            //console.log(item.getAttribute('value'));
        }
    }
    calculator.observeEvent('change', onDesmosChange);

}

function downloadZip() {

    var indicator = document.getElementById('record-indicator');
    indicator.textContent = 'Generating download...';
    zip.generateAsync({type:"blob"}).then(function (blob) {
        download(URL.createObjectURL(blob), "output.zip");
        indicator.textContent = 'Downloaded';
    }, function (err) {
        indicator.textContent = err;
    });
}

function download (path, filename) {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function captureScreenshot () {
    document.getElementById('calculator').style.display = 'none';
    document.getElementById('image').style.display = 'inherit';

    onGridColorChange();

    var indicator = document.getElementById('record-indicator');
    indicator.textContent = 'Capturing image...';

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: config[6]/config[8],
        height: config[7]/config[8],
        targetPixelRatio: config[8],
        mathBounds: { left: (-config[9]/2), right: (config[9]/2), top: (config[10]/2), bottom:(-config[10]/2) }
    }, displayImage);
}

function displayImage(data) {
    var indicator = document.getElementById('record-indicator');
    var image = document.getElementById('image');
    image.innerHTML = data;
    changeSvgColors(image);
    zip.file('preview.svg', image.innerHTML);
    indicator.textContent = 'Preview captured';
}

//download(URL.createObjectURL(new Blob([changeSvgColors(data)], {type: "image/svg"})), "output.svg")

function record() {

    calculator.setExpression({
        id: fnId,
        latex: AnimateVarName + '=' + (config[3] + frameNumber*config[5])
    });

    calculator.asyncScreenshot({
        mode: 'stretch',
        format: 'svg',
        width: config[6]/config[8],
        height: config[7]/config[8],
        targetPixelRatio: config[8],
        mathBounds: { left: (-config[9]/2), right: (config[9]/2), top: (config[10]/2), bottom:(-config[10]/2) }
    }, recordRepeat);

}

function recordRepeat(data) {

    var image = document.getElementById("image");
    image.innerHTML = data;

    //sessionStorage.setItem('Frame_'+ ('0000' + frameNumber).slice(-4), data);
    changeSvgColors(image);
    zip.file('frames/frame_'+ ('00000' + frameNumber).slice(-5) + '.svg', image.innerHTML);

    
    frameNumber ++;

    if (frameNumber < config[2]) {

        record();

    } else {
        frameNumber = 0;
        zip.file('Convert to mp4.sh', 'ffmpeg -r '+ config[0] +' -i frames/frame_%05d.svg -c:v libx264 output.mp4');
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

    classArray = svg.getElementsByClassName('dcg-svg-tickmark');
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

function onMouseOver(sender) {
    
    if (sender.id != selectedTab) {
            sender.style.backgroundColor = '#182c48';
    }

}

function onMouseOut(sender) {
    
    if (sender.id != selectedTab) {
            sender.style.backgroundColor = '#1D3557';
    }

}

function onButtonPress(id) {

    var edit_button = document.getElementById('edit-button');
    var help_button = document.getElementById('help-button');
    var color_button = document.getElementById('color-button');
    var start_record_button = document.getElementById('start-record-button');

    var settings = document.getElementById('settings');
    var calculator = document.getElementById('calculator');
    var record = document.getElementById('record');
    var color_settings = document.getElementById('color-settings');
    var help = document.getElementById('help');
    var instructions = document.getElementById('instructions');

    edit_button.style.backgroundColor = '#1D3557';
    help_button.style.backgroundColor = '#1D3557';
    color_button.style.backgroundColor = '#1D3557';
    start_record_button.style.backgroundColor = '#1D3557';

    document.getElementById('image').style.display = 'none';

    if (selectedTab == id) {
        settings.style.display = 'none';
        calculator.style.display = 'inherit';
        record.style.display = 'none';
        color_settings.style.display = 'none';
        help.style.display = 'none';
        instructions.style.display = 'none';
        document.getElementsByClassName('l-nav')[0].style.width = '0px';
        document.getElementsByClassName('l-page')[0].style.left = '60px';
        selectedTab = "none";
    } else {

        selectedTab = id;

        document.getElementsByClassName('l-nav')[0].style.width = '200px';
        document.getElementsByClassName('l-page')[0].style.left = '260px';
        
        document.getElementById(id).style.backgroundColor = '#2C405D';

        if (id == "edit-button") {
            settings.style.display = 'inherit';
            calculator.style.display = 'inherit';
            record.style.display = 'none';
            color_settings.style.display = 'none';
            help.style.display = 'none';
            instructions.style.display = 'none';
        } else if (id == "color-button") {
            settings.style.display = 'none';
            calculator.style.display = 'inherit';
            record.style.display = 'none';
            color_settings.style.display = 'inherit';
            help.style.display = 'none';
            instructions.style.display = 'none';
        } else if (id == "start-record-button") {
            settings.style.display = 'none';
            calculator.style.display = 'inherit';
            record.style.display = 'inherit';
            color_settings.style.display = 'none';
            help.style.display = 'none';
            instructions.style.display = 'none';
        } else if (id == "help-button") {
            settings.style.display = 'none';
            calculator.style.display = 'none';
            record.style.display = 'none';
            color_settings.style.display = 'none';
            help.style.display = 'inherit';
            instructions.style.display = 'inherit';
        }
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