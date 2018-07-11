;

/*
*
* Module Graphs
* Implements object Graph, which allows drawing gpahs 
* of functions
*
* Usage:
* let graph = new Graph(init);  // Init obj described below
* graph.drawGraph();
*
*
*/

(function(){

	/*
	* Color constants:
	*/

	const COLOR_GRAPH = "#00ff00";
	const COLOR_AXES = "#000";
	const COLOR_BACKGROUND = "#eee";
	const COLOR_GRID = "#ddd";
	const COLOR_ASYMP = "#555";
	const COLOR_AXES_FONT = "#000";

	/*
	* Other constants:
	*/

	const shift = 0.001;
	const maxDiff = 10000;
	const numberOfSteps = 2000;
	const AXES_FONT = "bold 10px Arial";;

	/*
	* Accessory functions:
	*
	* avg - Takes an array of numbers and returns average  
	*
	* (left/right)Derivative - Takes function, variable and shift, returns derivative
	*
	* checkAsymp - Cheks if function acts here like asymptote 
	*
	* fracPart - Returns fraction part of a number
	*  	
	*/

	const avg = (arr) => {
		return arr.reduce( (acc, current) => (acc + current) , 0) / arr.length;
	}

	const leftDerivative = (f, x, shift) => (f(x - shift) - f(x))/shift;
	const rightDerivative = (f, x, shift) => (f(x + shift) - f(x))/shift;

	const checkAsymp = (f, x, shift) => Math.abs(leftDerivative(f, x, shift) - rightDerivative(f, x, shift) ) > maxDiff;

	const fracPart = (x) => (x - Math.floor(x));

	function decimalAdjust(type, value, exp) {
	    // Если степень не определена, либо равна нулю...
	    if (typeof exp === 'undefined' || +exp === 0) {
	      return Math[type](value);
	    }
	    value = +value;
	    exp = +exp;
	    // Если значение не является числом, либо степень не является целым числом...
	    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
	      return NaN;
	    }
	    // Сдвиг разрядов
	    value = value.toString().split('e');
	    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	    // Обратный сдвиг
	    value = value.toString().split('e');
	    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	  // Десятичное округление к ближайшему
	  if (!Math.round10) {
	    Math.round10 = function(value, exp) {
	      return decimalAdjust('round', value, exp);
	    };
	  }
	  // Десятичное округление вниз
	  if (!Math.floor10) {
	    Math.floor10 = function(value, exp) {
	      return decimalAdjust('floor', value, exp);
	    };
	  }
	  // Десятичное округление вверх
	  if (!Math.ceil10) {
	    Math.ceil10 = function(value, exp) {
	      return decimalAdjust('ceil', value, exp);
	  };
	}

	const getStart = (min, step) => {
		if(min == 0) return 0;
		if(min < 0){
			let start = 0;
			while(start > min) start -= step;
			return start + step;
		}
		if(min > 0){
			let start = 0;
			while(start < min) start += step;
			return start;
		}
	}

	/*
	*
	* @constuctor
	* Creates Graph object
	* Init object:
	*
	* .canvas        - DOMcanvas
	*
	* .XGridStep  
	* .YGridStep  
	* .gridStatus    - Grid on/off
	*   
	* .minX|   
	* .maxX|   		 - Scope of calculations
	* .minY|   
	* .maxY|         
	*
	* .func          - Function, which graph to draw   
	*
	*/

	const Graph = function(init){
		
		this.canvas = init.canvas;
		this.ctx = init.canvas.getContext("2d");

		this.canvasWidth = this.canvas.canvasWidth   || 500;
		this.canvasHeight = this.canvas.canvasHeight || 500;

		this.XGridStep = init.XGridStep    || 1;
		this.YGridStep = init.YGridStep    || 1;	
		this.gridStatus = init.gridStatus;	

		this.minX = init.minX;
		this.minY = init.minY;
		this.maxX = init.maxX;
		this.maxY = init.maxY;

		this.step = (this.maxX - this.minX)/numberOfSteps;

		this.scaleX = this.maxX - this.minX;
		this.scaleY = this.maxY - this.minY;

		this.originX = this.canvasWidth * (-this.minX)/this.scaleX;
		this.originY = this.canvasHeight * (this.maxY)/this.scaleY;

		this.moveVector = new Vector(this.originX, this.originY);
		this.transformMatrix = new Matrix(new Vector(this.scaleX/this.canvasWidth, 0), new Vector(0, -this.scaleY/this.canvasHeight)).getInverse();

		this.func = init.func;

		console.log(this);

	}

	/*
	*
	* Draw methods:
	*
	*/

	Graph.prototype.drawAsymp = function(x){
		
		let ctx = this.ctx;
		let canvasHeight = this.canvasHeight;

		ctx.strokeStyle = COLOR_GRAPH;
		ctx.stroke();

		ctx.beginPath()
		ctx.strokeStyle = COLOR_ASYMP;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasHeight);
		ctx.stroke();

		ctx.strokeStyle = COLOR_GRAPH;
		ctx.beginPath();
	}

	Graph.prototype.drawAxes = function(){
    	
    	let arrow = 8;
		let ctx = this.ctx;

		let originX = this.originX;
		let originY = this.originY;

		let canvasHeight = this.canvasHeight;
		let canvasWidth  = this.canvasWidth;

		let minX = this.minX;
		let minY = this.minY;
		let maxX = this.maxX;
		let maxY = this.maxY;

		let gridStep = this.gridStep;

		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "left";

		ctx.fillStyle = COLOR_AXES_FONT;
		ctx.font = AXES_FONT;

		ctx.fillText("y", originX + 7, 20);
		ctx.fillText("x", canvasWidth - 30, originY - 7);

		if(minX <= 0 && maxX >= 0){
			ctx.beginPath();
			ctx.moveTo(originX, 0);
			ctx.lineTo(originX, canvasHeight);
			ctx.strokeStyle = COLOR_AXES;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(originX - arrow/2, arrow);
			ctx.lineTo(originX, 0);
			ctx.lineTo(originX + arrow/2, arrow);
			ctx.stroke();

		}
		
		if(minY <= 0 && maxY >= 0){
			ctx.beginPath();
			ctx.moveTo(0, originY);
			ctx.lineTo(canvasWidth, originY);
			ctx.strokeStyle = COLOR_AXES;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(canvasWidth - arrow, originY - arrow/2);
			ctx.lineTo(canvasWidth, originY);
			ctx.lineTo(canvasWidth - arrow, originY + arrow/2);
			ctx.stroke();
		}
	}

	Graph.prototype.drawGrid = function(){
		let ctx = this.ctx;

		let originX = this.originX;
		let originY = this.originY;

		let scaleX = this.scaleX;
		let scaleY = this.scaleY;

		let canvasHeight = this.canvasHeight;
		let canvasWidth  = this.canvasWidth;

		let minX = this.minX;
		let minY = this.minY;
		let maxX = this.maxX;
		let maxY = this.maxY;

		let XGridStep = this.XGridStep;
		let YGridStep = this.YGridStep;

		let transformMatrix = this.transformMatrix;
		let moveVector = this.moveVector;

		ctx.strokeStyle = COLOR_GRID;

		let startX = getStart(minX, XGridStep);
		let startY = getStart(minY, YGridStep);

		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		ctx.fillStyle = COLOR_AXES_FONT;
		ctx.font = AXES_FONT;

		let num = 0;

		for(let x = startX; x <= maxX; x+=XGridStep){

			num++;
			
			ctx.beginPath();
			
			let startVector = new Vector(x, minY);
			let endVector = new Vector(x, maxY);

			startVector.transform(transformMatrix).add(moveVector);
			endVector.transform(transformMatrix).add(moveVector);
			
			ctx.moveTo(startVector.x, startVector.y);
			ctx.lineTo(endVector.x, endVector.y);

			ctx.stroke();

			if(x == minX || x == maxX || num % 2 == 0) continue;
			
			ctx.fillText(Math.round10(x, -2), startVector.x, startVector.y - 5);
			ctx.fillText(Math.round10(x, -2), endVector.x, endVector.y + 5);

		}

		num = 0;

		for(let y = startY; y <= maxY; y+=YGridStep){

			num++;

			ctx.beginPath();
			
			let startVector = new Vector(minX, y);
			let endVector = new Vector(maxX, y);

			startVector.transform(transformMatrix).add(moveVector);
			endVector.transform(transformMatrix).add(moveVector);
			
			ctx.moveTo(startVector.x, startVector.y);
			ctx.lineTo(endVector.x, endVector.y);
			
			ctx.stroke();

			if(y == 0 || y == minY || y == maxY || num % 2 == 0) continue;
			ctx.fillText(Math.round10(y, -2), startVector.x + 10, startVector.y);
			ctx.fillText(Math.round10(y, -2), endVector.x - 10, endVector.y);
		}




	}

	Graph.prototype.drawGraph = function(){
		let ctx = this.ctx;

		let originX = this.originX;
		let originY = this.originY;

		let scaleX = this.scaleX;
		let scaleY = this.scaleY;

		let canvasHeight = this.canvasHeight;
		let canvasWidth  = this.canvasWidth;

		let minX = this.minX;
		let minY = this.minY;
		let maxX = this.maxX;
		let maxY = this.maxY;

		let step = this.step;
		let f = this.func;

		ctx.fillStyle = COLOR_BACKGROUND;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		if(this.gridStatus) this.drawGrid();

		ctx.strokeStyle = COLOR_GRAPH;

		let asymp = [];

		ctx.beginPath();

		let transformMatrix = this.transformMatrix;
		let moveVector = this.moveVector;

		let valueVector = new Vector(minX, f(minX));
		valueVector.transform(transformMatrix).add(moveVector);
		
		ctx.moveTo(valueVector.x, valueVector.y);

		for(let x = minX + step; x <= maxX; x += step){


			let value = f(x);
			let valueVector = new Vector(x, value);
			
			valueVector.transform(transformMatrix).add(moveVector);

			if(checkAsymp(f, x, shift)){
				asymp.push(valueVector.x);
			}

			else{

		    	if(asymp.length){
		    		console.log("drawing x = ", x, value);
		    		this.drawAsymp(avg(asymp));
		    		asymp = [];

		    		ctx.beginPath();
		    		ctx.moveTo(valueVector.x, valueVector.y);
		    	}

		    	if(isNaN(value)){
					ctx.moveTo(valueVector.x, valueVector.y);
			    	continue;
			    }

			    ctx.lineTo(valueVector.x, valueVector.y);;
		    }


		}

		ctx.stroke();
		this.drawAxes();
	}

	/*
	* @constuctor
	* Creates vector-column with coordinates x, y
	*/

	const Vector = function(x, y){
		
		this.x = x;
		this.y = y;

	}

	Vector.prototype.add = function(vector){
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	Vector.prototype.multiply = function(constant){
		this.x *= constant;
		this.y *= constant;
		return this;
	}

	Vector.prototype.transform = function(matrix){
		this.x = matrix.i.x * this.x + matrix.j.x * this.y;
		this.y = matrix.i.y * this.x + matrix.j.y * this.y;
		return this;
	}

	/*
	* @constructor
	* Creates matrix from two vector-columns i, j
	*/

	const Matrix = function(i, j){
		
		this.i = i;
		this.j = j;
	
	}

	Matrix.prototype.getArray = function(){
		return [[this.i.x, this.j.x],
				[this.i.y, this.j.y]];
	}

	Matrix.prototype.add = function(matrix){
		this.i.add(matrix.i);
		this.j.add(matrix.j);
		return this;
	}

	Matrix.prototype.multiply = function(constant){
		this.i.multiply(constant);
		this.j.multiply(constant);
		return this;
	} 

	Matrix.prototype.determinate = function(){
		return this.i.x * this.j.y - this.j.x * this.i.y;
	}

	Matrix.prototype.getInverse = function(){
		let det = this.determinate();
		
		if(det == 0) throw new Error("This matrix has no inverse");
		
		let newI = new Vector( this.j.y, -this.i.y);
		let newJ = new Vector(-this.j.x,  this.i.x);

		let newMatrix = new Matrix(newI, newJ);

		newMatrix.multiply(1/det);
		
		return newMatrix;
	}

	window.Graph = Graph;

})()
;
