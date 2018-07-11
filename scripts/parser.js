/*
*
* Module Parser
*
*/
;
(function(){

	const AccessibleFunctions = {
		'sin': Math.sin,
		'cos': Math.cos,
		'tg': Math.tan
	}

	const TokenTypes = {
		number: "Number",
		variable: "Variable",
		openBracket: "OpenBracket", 
		closeBracket: "CloseBracket", 
		multiplication: "Multiplication",
		division: "Division",
		addition: "Addition",
		substraction: "Substraction",
		exponentiation: "Exponentiation",
		function: "Function"
	}

	const TokenPriority = {
		"Number": 10,
		"Variable": 10,
		"Multiplication": 4,
		"Division": 4,
		"Addition": 1,
		"Substraction": 1,
		"Exponentiation": 6,
		"Function": 9
	}

	const AST = function(Root){
		this.root = Root;
	}

	const ASTNode = function(type, value){
		this.type = type;
		this.value = value;
		this.children = [];
	}

	const newAST = (type, value) => {
		return new AST(new ASTNode(type, value));
	}

	const Token = function(type, value){
		this.type = type;
		this.value = value;
		this.priority = TokenPriority[type];
	}

	const isNumber = (char) => !isNaN(+char);

	const isAlpha = (char) => !!(char.search(/[a-z]/i) + 1);

	const getTokens = (expr) => {
		let result = {
			variable: '',
			tokens: []
		};

		let tokens = result.tokens;

		expr = expr.replace(/\s/g, '');

		for(let i = 0; i < expr.length; i++){

			let current = expr[i];
			
			if( current == '+' ){
				tokens.push(new Token(TokenTypes.addition, current));
				continue;
			}
			
			if( current == '-' ){
				tokens.push(new Token(TokenTypes.substraction, current));
				continue;
			}
			
			if( current == '*' ){
				tokens.push(new Token(TokenTypes.multiplication, current));
				continue;
			}
			
			if( current == '/' ){
				tokens.push(new Token(TokenTypes.division, current));
				continue;
			}
			
			if( current == '^' ){
				tokens.push(new Token(TokenTypes.exponentiation, current));
				continue;
			}
			
			if( current == '(' ){
				tokens.push(new Token(TokenTypes.openBracket, current));
				continue;
			}
			
			if( current == ')' ){
				tokens.push(new Token(TokenTypes.closeBracket, current));
				continue;
			}

			if(isNumber(current)){
				let number = current;
				while(isNumber(expr[i + 1]) || expr[i + 1] == '.'){
					number += expr[i + 1];
					i++;
				}
				number = parseFloat(number);
				tokens.push(new Token(TokenTypes.number, number));
				continue;
			}

			if(isAlpha(current)){
				let name = current;
				while(isAlpha(expr[i + 1])){
					name += expr[i + 1];
					i++;
				}

			}

		}


	}
 


})()
;