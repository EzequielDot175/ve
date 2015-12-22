'use strict';

class canvasHelpers {


	y(n){
		return Math.abs(n - this.height);
	}

	x(n){
		return Math.abs(n - this.width);
	}


	drawLine(l,b,x,y){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = "#4D4D4D";
		this.ctx.moveTo(l, this.y(b));
		this.ctx.lineTo(x,this.y(y));
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawDottedLine(l,b,x,y){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.setLineDash([4,4]);
		this.ctx.moveTo(l, this.y(b));
		this.ctx.lineTo(x,this.y(y));
		this.ctx.lineWidth = 0.3;
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	}

	getMeasure(text,size){
		this.ctx.save();
		this.ctx.font = size+"px sans-serif";
		var font = this.ctx.measureText(text).width;
		this.ctx.restore();
		return font;
	}

	drawText(l,b,text,size,prefix,color){
		var prefix = prefix || "";
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = color || "#000000";
		this.ctx.font = prefix+" "+size+"px sans-serif";
		this.ctx.fillText(text,l,this.y(b))
		this.ctx.closePath();
		this.ctx.restore();
	}

	drawCircle(x, y, r,c){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = c || "#000000";
		this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.restore();
	}

	drawRectGradient(x,y,w,h,c){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = c || "#000000";
		this.ctx.fillRect(x,y,w,h,c);
		this.ctx.closePath();
		this.ctx.restore();
	}

	drawRectGradientWithShadow(x,y,w,h,c){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = c || "#000000";
		this.ctx.shadowColor = 'rgba(0,0,0,0.1)';
		this.ctx.shadowBlur = 3;
		this.ctx.shadowOffsetX = 2;
		this.ctx.shadowOffsetY = 2;
		this.ctx.fillRect(x,y,w,h,c);
		this.ctx.closePath();
		this.ctx.restore();
	}

	MathAng(p1,p2){
		return 180*Math.atan2(p2.y - p1.y, p2.x- p1.x)/Math.PI;
	}

	formatNumber(num) {
		var p = parseFloat(num).toFixed(2).split(".");
		return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
			return  num + (i && !(i % 3) ? "." : "") + acc;
		}, "") ;
	}

	sqr(x)
	{
		return x * x;
	}

	//Distancia enter dos puntos (al cuadrado)
	distBetweenPointsSquared(v, w)
	{
		return this.sqr(v.x - w.x) + this.sqr(v.y - w.y);
	}

	clearCanvas(){
		this.ctx.clearRect(0,0,this.width,this.height);
	}

}

class veCanvas extends canvasHelpers{


	constructor(id){
		super();
		this.init(id);

	}


	init(id){
		var elm = document.getElementById(id || 'nufarm');
		this.elm = elm;
		this.ctx = this.elm.getContext("2d");
		this.height = elm.height;
		this.width = elm.width;
		this.columns = 8;
		this.coordinates = {
			columns: {
				x : [],
				y : []
			}
		}
		this.info = {
			total : [],
			clave : []
		}
		this.pointers = {
			total: []
		};

		this._SetMonths();
	}
	setWorkSpace(p){
		var init = {
			paddingLeft: p.paddingLeft || this.width * 0.30,
			paddingBottom: p.paddingBottom || this.width * 0.10,
			paddingTop: p.paddingTop || 0
		}
		init.graphSpace = {
			h : this.height - init.paddingBottom,
			w : this.width - init.paddingLeft,
			x : init.paddingLeft,
			y : this.y(init.paddingBottom)
		}
		this.workspace = init;
		//this.setColumnProperties();
	}

	setColumnProperties(params){
		var init = {
			hColumns : params.hColumn || 50
		}
		this.columnProperties = init;
	}

	minWorkCol(num){
		if(num < 2){
			return 2;
		}else{
			return num;
		}
	}

	setMaxPercent(c){
		var p = [];
		for (var i = 0; i < c.length; i++) {
			p.push(c[i].percent);
		};
		var maxPercent = Math.max.apply(null,p);
		this.columnProperties.maxColPercent = Math.ceil(maxPercent / 50) * 50;
		this.columnProperties.maxWorkCol = this.minWorkCol(Math.ceil(maxPercent / 50) );
		this.columnProperties.maxRealPercent = maxPercent;
	}
	getScale(n){

		var result = (n * (this.columnProperties.hColumns * 2)) / 100;

		// var scale = (this.columnProperties.hColumns / 50);
		// console.info('Reporting scale * n:', scale * n);
		// return scale * n;
		return result;
	}



	displayinfo(event){
		var cursor = {
			x : event.offsetX - this.workspace.paddingLeft,
			y : this.y(event.offsetY +  this.workspace.paddingBottom),
			original:{
				x : event.offsetX,
				y : event.offsetY,
			}
		}
		this.clearCanvas();
		this._WorkSpace();
		this._PointInfo(cursor);
		//console.log(cursor);
		//
		//document.getElementById("cursor").innerHTML = " CURSOR X["+cursor.x+"] | Y["+(cursor.y)+"]";
	}


	data(p){
		this.setMaxPercent(p.total);
		this.info.total = p.total;
		this.info.clave = p.clave;
		this.info.lastColumnCharged = p.lastColumnCharged;
	}

	_PresentOnArea(n,range){
		if(n >= range.from && n <= range.to){
			return true;
		}else{
			return false;
		}
	}

	_drawInfoBox(percent,value,x,y){
		/*if(percent == 0){
		 return;
		 }*/
		/**
		 * Percent Text
		 */
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.fillStyle = "rgba(66,66,66,0.7)";
		this.ctx.fillRect(x,y,50,34);
		this.ctx.closePath();
		this.ctx.restore();

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(x + 14, y + 34);
		this.ctx.fillStyle = "rgba(66,66,66,0.7)";
		this.ctx.lineTo(x + 14 + 11, y + 34 + 6);
		this.ctx.lineTo(x + 14 + 22, y + 34 );
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.restore();

		/**
		 * Percent Text
		 */
		this.ctx.save();
		this.ctx.font="bold 10px sans-serif";
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillText(percent+"%",x - ((this.getMeasure(percent+"%",10) / 2) - 25),y + 13);
		this.ctx.restore();

		/**
		 * White Line
		 */
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(x + 10, y + 16);
		this.ctx.strokeStyle = "rgba(255,255,255,0.5)";
		this.ctx.lineTo(x + 40, y + 16);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();

		/**
		 * Real Value Text
		 */
		this.ctx.save();
		this.ctx.font="bold 10px sans-serif";
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillText(this.formatNumber(value),x - ((this.getMeasure(this.formatNumber(value),10) / 2) - 25),y + 27);
		this.ctx.restore();
	}

	_PointInfo(cursor){
		var merge = this.pointers.total.concat(this.pointers.clave);
		var range = 5;

		//console.log("================================");
		/*for (var i = 0; i < merge.length; i++) {
		 document.getElementById(i).innerHTML = "X["+(merge[i].x - this.workspace.paddingLeft)+"] | Y["+merge[i].y+"] | PERCENT["+merge[i].perc+"] ";
		 };*/

		for (var i = 0; i < merge.length; i++) {

			//var objY = this.y(this.getScale(merge[i].y) );
			//var objX = merge[i].x + this.workspace.paddingLeft;
			var objY = merge[i].y;
			var objX = (merge[i].x - this.workspace.paddingLeft);
			var onAreaX = {from: (objX - range), to:  (objX + range)};
			var onAreaY = {from: (objY - range), to:  (objY + range)};

			if( ( this._PresentOnArea(cursor.x,onAreaX) && this._PresentOnArea(cursor.y,onAreaY) ) ){
				this._drawInfoBox(merge[i].perc,merge[i].val,cursor.original.x - 25,cursor.original.y - 45);
			}
		};
		//console.info('Reporting newCursor:', newCursor);
	}
	_SetMonths(){

		var months = new Array ("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");
		var rangePeriod = new Array ("agosto","septiembre","octubre","noviembre","diciembre","enero","febrero","marzo");
		var date = new Date();
		var nMonth = date.getMonth();

		this.period = {
			months: months,
			rangePeriod: rangePeriod,
			columnActive : rangePeriod.indexOf(months[nMonth])
		}

	}

	_Pointers(c,n){


		//console.info('Reporting c:', c);
		//console.info('Reporting n:', n);
		var d = [];
		for (var i = 0; i < this.coordinates.columns.x.length; i++) {

			//var ind = Math.abs()
			if(c[i].value != undefined && c[i].value == 0){

				d.push({

					x: this.x(this.coordinates.columns.x[i]),
					y:  this.getScale(c[i].percent),
					val: 0,
					perc: 0
				});
			}else{
				d.push({

					x: this.x(this.coordinates.columns.x[i]),
					y:  this.getScale(c[i].percent),
					val: c[i].value,
					perc: c[i].percent
				});
			}

		};
		this.pointers[n] = d.reverse();
	}

	_getPercentUnderPercent(hpercent, oldPercent){
		if(oldPercent == 0){
			return 0;
		}else{
			return (oldPercent * hpercent) / 100;
		}
	}

	_PointersOnPercentOf(reference,collection){

		console.info('Reporting ['+reference+']:', this.info[reference]);
		console.info('Reporting ['+collection+']:', this.info[collection]);

		var d = [];
		var c = this.info[collection];
		var t = this.info[reference];
		for (var i = 0; i < this.coordinates.columns.x.length; i++) {
			var falsePercent = this.info[reference]

			//var ind = Math.abs()
			if(c[i].value != undefined && c[i].value == 0){

				d.push({

					x: this.x(this.coordinates.columns.x[i]),
					y:  this.getScale(this._getPercentUnderPercent(t[i].percent,c[i].percent)) ,
					val: 0,
					perc: 0
				});
			}else{
				d.push({

					x: this.x(this.coordinates.columns.x[i]),
					y:  this.getScale(this._getPercentUnderPercent(t[i].percent,c[i].percent)),
					val: c[i].value,
					perc: c[i].percent
				});
			}

		};
		this.pointers[collection] = d.reverse();
	}

	_ColumnsX(){
		var x = [];
		var widthColumns = this.workspace.graphSpace.w / this.columns;
		var tmp = 0;
		for (var i = 0; i < this.columns; i++) {
			x.push(tmp + this.workspace.paddingLeft)
			tmp += widthColumns;
		};
		this.coordinates.columns.x = x;
	}
	_ColumnsY(){
		var y = [];
		var tmp = this.columnProperties.hColumns;
		for (var i = 0; i < this.columnProperties.maxWorkCol; i++) {
			//if(i > 0){
			y.push(tmp);
			//}
			tmp += this.columnProperties.hColumns  ;
		};
		this.coordinates.columns.y = y;
	}

	_ReziseElement(){
		var newHeight = (this.columnProperties.maxWorkCol * this.columnProperties.hColumns) + this.columnProperties.hColumns;
		newHeight += this.workspace.paddingTop;
		newHeight += this.workspace.paddingBottom;
		this.elm.height = newHeight;
		this.height = newHeight;
	}
	_DrawPoints(n,c){
		for (var i = 0; i < this.pointers[n].length; i++) {
			var p = this.pointers[n][i];
			this.drawCircle(p.x ,this.y(p.y + this.workspace.paddingBottom) ,4,c);
		};
	}

	_DrawRectOneHundredGradient(){
		this.drawRectGradient(
			this.workspace.paddingLeft,
			this.y(this.workspace.paddingBottom + (this.columnProperties.hColumns * 2)),
			this.width - this.workspace.paddingLeft,
			this.columnProperties.hColumns * 2,
			"rgba(91,91,91,0.1)");
	}
	_DrawRectExceedOneHundred(){
		if(this.columnProperties.maxRealPercent >= 100){

			/**
			 * Draw box
			 */
			this.drawRectGradientWithShadow(
				this.workspace.paddingLeft,
				this.y(this.workspace.paddingBottom + (this.columnProperties.hColumns * 2)) - 32,
				364,
				25,
				"rgba(234,234,234,0.6)");
			/**
			 * Draw Text
			 */
			this.drawText(this.workspace.paddingLeft + 10,
				this.workspace.paddingBottom + (this.columnProperties.hColumns * 2) + 15,
				"SUPERA PORCENTAJE DE FACTURACIÓN TOTAL PERÍODO ANTERIOR",
				9,
				null,
				"rgba(0,0,0,0.6)"
			);
			/**
			 * Draw arrow bottom
			 */
			var l = this.workspace.paddingLeft;
			var b = this.y(this.workspace.paddingBottom + (this.columnProperties.hColumns * 2));
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.fillStyle = "rgba(234,234,234,0.6)";
			this.ctx.moveTo(l + 44, b - 7);
			this.ctx.lineTo(l + 44 + 11, b + 6 - 7);
			this.ctx.lineTo(l + 44 + 22, b - 7);
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.restore();

		}
	}
	_DrawReferences(){
		var y = this.y(this.workspace.paddingBottom) + 45;
		var x = this.workspace.paddingLeft;
		this.drawCircle(x + 10, y, 10,"rgba(141,42,141,0.5)");
		this.drawCircle(x + 100, y, 10,"#8D2A90");
		this.drawText(x + 30,this.workspace.paddingBottom - 50,"P. TOTAL",11,null,"#666666");
		this.drawText(x + 120 ,this.workspace.paddingBottom - 50,"P. CLAVE",11,null,"#666666");
	}


	_DrawMax(){

		var x =   this.coordinates.columns.x[this.info.lastColumnCharged - 1];
		var maxYColumn = (this.columnProperties.maxColPercent / 50) - 1;

		var widthContent = 50;

		this.drawLine(
			x + 11 ,
			this.workspace.paddingBottom,
			x + 11,
			this.y(this.coordinates.columns.y[maxYColumn] + this.workspace.paddingTop)
		);

		var font = 12;
		var num = this.pointers.total[this.info.lastColumnCharged - 1].val;
		var numMeasure = ((widthContent - this.getMeasure(this.formatNumber(num),font)) / 2);

		var perc = this.pointers.clave[this.info.lastColumnCharged - 1].perc+"%";
		var percMeasure = ((widthContent - this.getMeasure(perc,font)) / 2)

		this.drawText(x + numMeasure,this.workspace.paddingBottom - 20,this.formatNumber(num),12,"bold","#434343");
		this.drawText(x + percMeasure,this.workspace.paddingBottom - 35,perc,12,"bold","#434343");
	}

	_DrawLinePoints(n,color){

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.moveTo(this.workspace.paddingLeft,this.y(this.workspace.paddingBottom));
		// 0 to n
		//this.ctx.lineTo(this.pointers[n][0].x,this.y(this.pointers[n][0].y + this.workspace.paddingBottom));
		var initPoints = {
			x: this.workspace.paddingLeft,
			y: this.y(this.pointers[n][0].y + this.workspace.paddingBottom)
		}
		var endInitPoints = {
			x: this.pointers[n][0].x,
			y: this.y(this.pointers[n][0].y + this.workspace.paddingBottom)
		}

		this.ctx.quadraticCurveTo(
			initPoints.x,
			this.y(this.MathAng(initPoints,endInitPoints) + this.workspace.paddingBottom),
			endInitPoints.x,
			endInitPoints.y
		);
//		console.info('Reporting MathAng:', );


		for (var i = 0; i < this.pointers[n].length; i++) {

			if(this.pointers[n][i + 1] != undefined){



				//this.ctx.lineTo(this.pointers[n][i + 1].x,this.y(this.pointers[n][i + 1].y + this.workspace.paddingBottom));
				this.ctx.quadraticCurveTo(
					this.pointers[n][i].x + 55,
					this.y(this.pointers[n][i + 1].y) - this.workspace.paddingBottom ,
					this.pointers[n][i + 1].x ,
					this.y(this.pointers[n][i + 1].y + this.workspace.paddingBottom)
				);

				this.ctx.quadraticCurveTo(
					this.pointers[n][i].x - 20,
					this.y(this.pointers[n][i + 1].y) - this.workspace.paddingBottom ,
					this.pointers[n][i + 1].x ,
					this.y(this.pointers[n][i + 1].y + this.workspace.paddingBottom)
				);



			}



		};

		this.ctx.lineTo(this.width,this.y(this.pointers[n][ this.pointers[n].length - 1 ].y + this.workspace.paddingBottom));

		// go to bottom workspace
		this.ctx.lineTo(this.width, this.y(this.workspace.paddingBottom));

		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.restore();
	}

	_WorkSpace(){

		//initial dashed line
		this.drawDottedLine(this.workspace.paddingLeft,
			this.workspace.paddingBottom,
			this.width,
			this.workspace.paddingBottom);
		// 0%
		var measure = this.getMeasure("0%",14);
		this.drawText(this.workspace.paddingLeft - measure - 5 ,this.workspace.paddingBottom - 2  ,"0%",14);

		// rest percents
		var tmp = 0;
		for (var i = 0; i < this.coordinates.columns.y.length; i++) {
			var relToBottom = this.workspace.paddingBottom + this.coordinates.columns.y[i];
			var relToLeft = this.workspace.paddingLeft;

			tmp += 50;
			var text = tmp+"%";

			var measure = this.getMeasure(text,14);

			this.drawDottedLine(relToLeft,
				relToBottom,
				this.width,
				relToBottom);

			if(tmp == 100){
				this.drawText(relToLeft - measure - 5 ,relToBottom - 2  ,text,14,"bold");
				this._DrawRectOneHundredGradient();
			}else{
				this.drawText(relToLeft - measure - 5 ,relToBottom - 2  ,text,14);
			}
		};

		// draw pointers "total"

		this._DrawLinePoints("total","rgba(141,42,141,0.5)");
		this._DrawLinePoints("clave","rgba(141,42,141,0.5)");
		this._DrawPoints("total","#5B5B5B");
		this._DrawPoints("clave","#5B5B5B");
		this._DrawRectExceedOneHundred();
		this._DrawReferences();
		this._DrawMax();

	}



	commit(){
		this._ReziseElement();
		this._ColumnsX();
		this._ColumnsY();
		this._Pointers(this.info.total,"total");
		this._PointersOnPercentOf("total","clave");
		//this._Pointers(this.info.clave,;
		//console.info('MyCanvas :', this);

	}

	draw(){
		this.clearCanvas();
		this._WorkSpace();
		this._SetMonths();
	}



}
