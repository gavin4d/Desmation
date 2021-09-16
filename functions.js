

        var elt = document.getElementById('calculator');
        var calculator = Desmos.GraphingCalculator(elt,{
            expressions : true,
            border : true,
            zoomButtons : true,
            pasteGraphLink : true});

        var frameNumber = 0;

        var btnElt = document.getElementById('screenshot-button');
        btnElt.addEventListener('click', captureScreenshot);
        
        var btnElt2 = document.getElementById('view-button');
        btnElt2.addEventListener('click', loadFrame);

        var btnElt3 = document.getElementById('save-button');
        btnElt3.addEventListener('click', saveFrame);

        var btnElt4 = document.getElementById('record-button');
        btnElt4.addEventListener('click', record);
            
        calculator.setExpression({ id: '1', latex: 'y=x^2' });

        function setImageSrc(data) {

            var img = document.getElementById('image');
            img.innerHTML = data;

        }

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
        }, setImageSrc);

        calculator.updateSettings({
            showXAxis : true,
            showYAxis : true,
            showGrid : true
        });

        }

        function saveFrame(name) {
        //console.log(calculator.getExpressions());
        calculator.setExpression({
            id: '2',
            color: '#bbbbbb'
        });

        var data = document.getElementById("image").innerHTML;
        //console.log(data);
        sessionStorage.setItem("img", data);

        }

        function loadFrame() {

        var data = sessionStorage.getItem("img");
        //console.log(data);
        var img = document.getElementById('image');
        img.innerHTML = data;

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

        sessionStorage.setItem('Frame_'+ ('0000' + frameNumber).slice(-4), data);

        document.getElementById("image").innerHTML = data;
        
        frameNumber ++;

        if (frameNumber < 10) {

            record()

        } else {
            frameNumber = 0
        }

        }

        function updateViewSettings(boolean) {

        calculator.updateSettings({
            showXAxis : boolean,
            showYAxis : boolean,
            showGrid : boolean
        });

        }