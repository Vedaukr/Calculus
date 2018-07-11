;

/*
*
* Module Fractions
* Interface of fractions implemented by function Fraction
* let frac = new Fraction(num, denum);  
*
*/

(function(){

	gcd = (a, b) => {
		
		a = Math.abs(a);
		b = Math.abs(b);

		if(a == 0) return b;
		if(b == 0) return a;

		return gcd(Math.max(a, b) % Math.min(a, b), Math.min(a, b));
	}

	window.gcd = gcd;

	gcm = (a, b) => a * b / gcd(a, b);

	window.gcm = gcm; 

	const Fraction = function(num, denum){
		if(denum === 0) throw new Error();
		this.num = num;
		this.denum = denum;
		this.sign = this.num*this.denum < 0 ? '-' : ''; 
		this.normalize();
	}

	window.Fraction = Fraction;

	Fraction.prototype.normalize = function(){
		let GCD = gcd(this.num, this.denum);
		this.num /= GCD;
		this.denum /= GCD;
		this.sign = this.num*this.denum < 0 ? '-' : '';
		if(this.num < 0 && this.denum < 0){
			this.num = Math.abs(this.num);
			this.denum = Math.abs(this.denum);
		}
	}

	Fraction.prototype.equals = function(frac){
		return this.num == frac.num && this.denum == frac.denum;
	}

	Fraction.prototype.toString = function(){
		
		/*
		* Returns string
		* /frac {num}{denum}
		* which is latex formula of fraction	
		*/

		if(this.denum == 1) return this.sign + Math.abs(this.num);
		if(this.num == 0) return '0';
		
		let result = '';

		result += this.sign;

		let num = '{' + Math.abs(this.num) + '}';
		let denum = '{' + Math.abs(this.denum) + '}';

		result += '\\frac' + num + denum;

		return result;
	}

	Fraction.prototype.invert = function(){
		if(this.num == 0) throw new Error();
		let temp = this.num;
		this.num = this.denum;
		this.denum = temp;
	}

	const addFractions = (frac1, frac2) => {
		if(frac1 instanceof Fraction && frac2 instanceof Fraction){
		 	let newNum = frac1.num * frac2.denum + frac1.denum * frac2.num;  // a/b + c/d = (a*d + b*c) / b*d
		 	let newDenum = frac1.denum * frac2.denum;
		 	return new Fraction(newNum, newDenum);
		}
	}

	window.addFractions = addFractions;

	const diffFractions = (frac1, frac2) => {
		if(frac1 instanceof Fraction && frac2 instanceof Fraction){
		 	let newNum = frac1.num * frac2.denum - frac1.denum * frac2.num;  // a/b - c/d = (a*d - b*c) / b*d
		 	let newDenum = frac1.denum * frac2.denum;
		 	return new Fraction(newNum, newDenum);
		}
	}

	window.diffFractions = diffFractions;

	const multiplyFractions = (frac1, frac2) => {
		if(frac1 instanceof Fraction && frac2 instanceof Fraction){
		 	let newNum = frac1.num * frac2.num;  // a/b * c/d = a*c / b*d
		 	let newDenum = frac1.denum * frac2.denum;
		 	return new Fraction(newNum, newDenum);
		}
	}

	window.multiplyFractions = multiplyFractions;

	const divideFractions = (frac1, frac2) => {
		if(frac1 instanceof Fraction && frac2 instanceof Fraction){
		 	let newNum = frac1.num * frac2.denum;  // a/b / c/d = a*d / b*c
		 	let newDenum = frac1.denum * frac2.num;
		 	return new Fraction(newNum, newDenum);
		}
	}

	window.divideFractions = divideFractions;

	const addFractionsArray = (fractionsArray) => {
		fractionsArray = fractionsArray.filter(item => item instanceof Fraction);
		return fractionsArray.reduce( (acumulator, current) => addFractions(acumulator, current), new Fraction(0, 1));
	}

	window.addFractionsArray = addFractionsArray;

	const multiplyFractionsArray = (fractionsArray) => {
		fractionsArray = fractionsArray.filter(item => item instanceof Fraction);
		return fractionsArray.reduce( (acumulator, current) => multiplyFractions(acumulator, current), new Fraction(1, 1));
	}

	window.multiplyFractionsArray = multiplyFractionsArray;

	const addRowsOfFractions = (row1, row2) => {
		let newRow = [];
		for(let i = 0; i < row1.length; i++){
			newRow[i] = addFractions(row1[i], row2[i]);
		}
		return newRow;
	}

	window.addRowsOfFractions = addRowsOfFractions;

	const multiplyRowByFraction = (row, frac) => {
		let newRow = [];
		for(let i = 0; i < row.length; i++){
			newRow[i] = multiplyFractions(row[i], frac);
		}
		return newRow;
	}

	window.multiplyRowByFraction = multiplyRowByFraction;

	const numberToFraction = (number) => {

		if(isNaN(number)) throw new Error();

		if(number == Math.floor(number)) return new Fraction(number, 1);
		
		let shift = 0;
		
		while(number != Math.floor(number)){
			number *= 10;
			shift++;
		}
		
		return new Fraction(number, Math.pow(10, shift));
	}

	window.numberToFraction = numberToFraction;

	const stringToFraction = (string) => {
		if(string.indexOf('/') + 1){
			let arr = string.split('/');
			return new Fraction(parseInt(arr[0], 10), parseInt(arr[1], 10));
		}
		else return numberToFraction(parseFloat(string));
	}

	window.stringToFraction = stringToFraction;

})()
;

