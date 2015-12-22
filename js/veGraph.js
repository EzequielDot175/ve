


var VeGraph = function(id){
    /**
     * Private
     */
    var element = document.getElementById(id);
    var canvas = element.getContext('2d');
    var paddingBottom = 90;
    var paddingTop = 50;
    var paddingLeft = 100;
    var paddingRight = 50;
    var hColumns = 50;
    var valueOnPosition = [];
    var realValueOnPosition = [];
    var realValuePercentPosition = [];
    var percent100 = {drawn : false};
    var infoBox = {
        box : document.getElementById("box-nufarm-canvas"),
        percent : document.getElementById("percent-box-nufarm"),
        number : document.getElementById("number-box-nufarm"),
    }




    var pointerX = [];
    var pointerY = [];
    var lines = [];

    this.color =  "rgba(0,0,0,0.5)";


    var formatNumber = function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? ',' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;
    }


    this.drawLine = function(x,y,relativeX,relativeX){
        rX = x + relativeX;
        canvas.save();
        canvas.beginPath();
        canvas.lineWidth = 0.1;
        canvas.strokeStyle = "rgba(77,77,77,0.5)";
        canvas.setLineDash([4,1]);
        canvas.moveTo(x, this.Y(y));
        canvas.lineTo(rX, this.Y(y));
        canvas.stroke();
        canvas.closePath();
    }
    this.setDataLine = function(object){
        try{
            if (object.labels.length != object.data.length) {
                throw "La cantidad de labels es distinta a la de los datos seteados.";
            };

            this.setBackground(object.color);
            this.setPointersX(object.labels);
            this.setPointersY(object.data);
            this.setRealData(object.realData);
            this.setLines();
            this.pointerInfo();

        }catch(e){
            console.error('Error', e);
        }


    }

    this.displayBox = function(x,y,percent,number){
        infoBox.box.style.display = "block";
        infoBox.box.style.top = (y - 50)+"px";
        infoBox.box.style.left = (x - 25)+"px";
        infoBox.number.innerHTML = formatNumber(number) || 0;
        infoBox.percent.innerHTML = percent || 0;
    }
    this.hiddeBox = function(){
        infoBox.box.style.display = "none";
    }

    this.setRealData = function (data) {
        for(i = 0; i < data.length; i++){
            realValueOnPosition.push(data[i]);
        }
    }


    this.setBackground = function(color){
        if(color != "" && color != undefined){
            this.color = color;
        }
    }
    this.drawGraphLine = function(){
        var length = pointerX.length;

        if (percent100.x != undefined && !percent100.drawn) {
            this.drawBoxAlert();
        }
        this.setTotals();

        /**
         * Draw Pointers
         */
        for (var i = 0; i < length; i++) {
            this.drawPoints(pointerX[i],pointerY[i]);
            if(pointerY[i] != undefined && pointerX[i] != undefined){
                valueOnPosition.push({position:{x: pointerX[i],y:pointerY[i]} });
            }
        };




    }



    this.drawBoxAlert = function(){

        var text = "SUPERA PORCENTAJE DE FACTURACION TOTAL PERIODO ANTERIOR";

        var line100percent = this.Y( paddingBottom + (hColumns * 2) );

        /*  BOX */

        canvas.save();
        canvas.beginPath();
        canvas.fillStyle = "rgba(234,234,234,0.6)";
        canvas.shadowBlur = 5;
        canvas.shadowColor = "rgba(238,238,238,0.5)";
        canvas.fillRect(percent100.x ,line100percent - 30,344,23);
        canvas.closePath();

        /* GRADIENT 0 TO 100 % */
        canvas.restore();
        canvas.save();
        canvas.beginPath();
        canvas.fillStyle = "rgba(91,91,91,0.1)";
        canvas.fillRect(paddingLeft,line100percent,element.width,hColumns * 2);
        canvas.closePath();

        /* TEXT BOX */

        canvas.restore();
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(percent100.x,percent100.y - hColumns);
        canvas.font = "9px sans-serif";
        canvas.fillStyle = "#565756";
        canvas.fillText(text,percent100.x + 10,line100percent - 15 );
        canvas.closePath();




    }

    this.setTotals = function(){

        /* REFERENCES */

        if(realValueOnPosition.length == 16){

            var lastPercent = realValuePercentPosition[realValuePercentPosition.length - 1];
            var middleRealVar = realValueOnPosition[(realValueOnPosition.length / 2) - 1]

            console.info('Reporting realValueOnPosition:', realValueOnPosition);
            console.info('Reporting realValuePercentPosition:', realValuePercentPosition);
            //var maxpercent =

            var columnX = pointerX[pointerX.length - 1];
            var bottomText = formatNumber(middleRealVar);
            var percentText = lastPercent+"%";
            var widthText = canvas.measureText(bottomText).width;
            var widthPercentText = canvas.measureText(percentText).width;
            canvas.save();
            canvas.beginPath();
            canvas.font = "bold 12px sans-serif";
            canvas.fillStyle = "#000000";
            canvas.fillText(bottomText,columnX - (widthText / 2),this.Y(paddingBottom) + 20);
            canvas.fillText(percentText,columnX - (widthPercentText / 2),this.Y(paddingBottom) + 35);
            canvas.closePath();
        }


        /* CIRCLES REFERENCES */
        this.drawReference("P.TOTAL",0,0.5);
        this.drawReference("P.CLAVE",100,1);
    }

    this.drawReference = function (text, toLeft,opacity) {
        canvas.save();
        canvas.beginPath();
        canvas.fillStyle = "rgba(141,42,144,"+opacity+")";
        canvas.arc(paddingLeft + toLeft,this.Y(paddingBottom) + 50,10,0,Math.PI * 2,false);
        canvas.closePath();
        canvas.fill();

        canvas.beginPath();
        canvas.font = "bold 11px sans-serif";
        canvas.fillStyle = "#666666";
        canvas.fillText(text,paddingLeft + 20 + toLeft,this.Y(paddingBottom) + 55);
        canvas.closePath();
        canvas.fill();
    }

    this.reset = function(){
        canvas.clearRect(0,0,element.width,element.height);
    }

    this.pointerInfo = function(){
        elem = document.getElementById("area");
        var pointerInfo = this.getPointerInfo;
        var funcs = {
            y : this.Y,
            d : this.displayBox,
            h : this.hiddeBox
        };


        element.onmousemove = function(event){
            console.log(event);
            var x = {
                canvas: event.offsetX,
                real: event.clientX - 350
            };
            var y = {
                canvas: event.offsetY,
                real: event.clientY - 380
            };

            pointerInfo(x,y,funcs);
        }
        element.onclick = function(){
            funcs.h();
        }
    }

    this.getPointerInfo = function (x,y,helpers) {


        for(i = 0;i < valueOnPosition.length; i++){
            var elemY = helpers.y(valueOnPosition[i].position.y);
            var elemX = valueOnPosition[i].position.x;

            var posX = (x.canvas + 5 >= elemX && x.canvas <= elemX + 5  );
            var posY = (y.canvas + 5 >= elemY && y.canvas <= elemY + 5  );

            if(posX && posY){
                helpers.d(x.real,y.real,realValuePercentPosition[i]+"%" ,realValueOnPosition[i]);
            }
        }
    }

    this.setPointersX = function(columns){
        var columns = columns.length;
        var workSpace =  element.width - paddingLeft - paddingRight;
        var widthColumns = workSpace / columns;

        for (var i = 1; i < columns + 1; i++) {
            pointerX.push((i * widthColumns) + widthColumns );
        };
    }
    this.setPointersY = function(data){
        pointerY = [];
        for (var i = 0; i < data.length; i++) {
            realValuePercentPosition.push(data[i]);
            var point = data[i] + paddingBottom;
            pointerY.push(point);
        };
    }
    this.setLines = function(){

        lines.push({moveToX: paddingLeft, moveToY: this.Y()});
        canvas.restore();
        canvas.beginPath();

        canvas.moveTo(paddingLeft,  this.Y(90));
        canvas.setLineDash([]);
        canvas.lineTo(pointerX[0], this.Y(pointerY[0]) );

        for(i = 0; i < pointerX.length; i++){
            if (pointerX[i+1] != undefined) {
                canvas.lineTo(pointerX[i+1] ,this.Y(pointerY[i+1]));
            }
        }
        var last_y = pointerY[pointerY.length - 1];

        canvas.lineTo(element.width,this.Y(last_y));
        canvas.lineTo(element.width,this.Y(paddingBottom));

        canvas.closePath();
        canvas.fillStyle = this.color;
        canvas.fill();


    }

    this.drawPoints = function(x,y){
        canvas.save();
        canvas.beginPath();
        canvas.fillStyle = "#5B5B5B";
        canvas.arc(x,this.Y(y),5,0,2*Math.PI);
        canvas.fill();
    }
    this.drawTextPercentages = function(y,text){
        var fontSize = 14;
        var widthText = canvas.measureText(text).width;
        var alignLeft = (paddingLeft / 2) - (widthText );
        var alignTop = y - 3.3;
        var bold = function(text){
            if(text == "100%"){
                return "bold ";
            }else{
                return "";
            }
        }
        console.log(text);
        canvas.save();
        canvas.beginPath();
        canvas.font = bold(text)+fontSize+"px sans-serif";
        canvas.fillText(text,alignLeft + 35,this.Y(alignTop));
        canvas.closePath();
    }

    this.setPercentages = function(num){
        var columns = Math.ceil(num / hColumns);
        element.height = (columns * hColumns) + paddingBottom + paddingTop;
        /**
         * First
         */
        this.drawLine(paddingLeft,90,0,element.width);
        this.drawTextPercentages(90, 0 );

        if (num >= 100) {
        }

        for (var i = 1; i < columns + 1; i++) {
            var newY = (i * hColumns) + paddingBottom ;
            this.drawLine(paddingLeft, newY, 0, element.width );

            if (num >= 100) {
                percent100.x = paddingLeft;
                percent100.y = newY;
            }
            this.drawTextPercentages(newY, this.textPercentage(i) );
        };


    }



    this.textPercentage = function(index){
        var percentage = index * 50;
        return percentage+"%";
    }

    this.Y = function(value){
        return Math.abs(value - element.height);
    }
}
