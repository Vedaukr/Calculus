;
/*
*
* Module Latex
* Functions, which return latex text of formulas
* 
*/

(function(){
	

	const latexMatrix = (matr, bracket) => {
		
		bracket = bracket || 'p';
		
		let matrix = '';

		matrix += '\\begin\{' + bracket + 'matrix\}';

		for(let i = 0; i < matr.length; i++){
			for(let j = 0; j < matr[0].length; j++){
				matrix += matr[i][j];
				if(j != matr[0].length - 1) matrix += '\&'; 
			}

			matrix += '\\\\';
		}

		matrix += '\\end\{' + bracket + 'matrix\}';

		return matrix;
	}

	window.latexMatrix = latexMatrix;

	const latexBrackets = (expr) => ('\\left\(' + expr + '\\right\)');

	window.latexBrackets = latexBrackets;

	const latexFraction = (num, denum) => ('\\ \{' + num + ' \\over' + denum + '\}');

	window.latexFraction = latexFraction;

	const latexSqrt = (expr) => ('\\ \\sqrt \{' + expr + '\}');

	window.latexSqrt = latexSqrt;

	const latexBlock = (expr) => ('\{' + expr + '\}');

	window.latexBlock = latexBlock;

	const latexFormula = (expr, block) => {
		if(block) return '\$\$' + expr + '\$\$';
		else return '\$' + expr + '\$';
	}

	window.latexFormula = latexFormula;


})()
;
