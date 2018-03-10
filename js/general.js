// General constants and functions
var INSTRUCTION_LEN = [1, 1, 2, 10,
                       10, 10, 2, 9,
                       9, 1, 2, 2,
                       10, 1, 1, 1],
	num2reg = ['%rax', '%rcx', '%rdx', '%rbx','%rsp', '%rbp', '%rsi', '%rdi', "%r8x", "%r9x", "%r10x", "%r11x", "%r12x", "%r13x", "%r14x"],
	inst2num = {
		'halt': 0,
		'nop': 1,

		'rrmovq': 2,
		'cmovle': 2,
		'cmovl': 2,
		'cmove': 2,
		'cmovne': 2,
		'cmovge': 2,
		'cmovg': 2,

		'irmovq': 3,
		'rmmovq': 4,
		'mrmovq': 5,

		'addq': 6,
		'subq': 6,
		'andq': 6,
		'xorq': 6,

		'jmp': 7,
		'jle': 7,
		'jl': 7,
		'je': 7,
		'jne': 7,
		'jge': 7,
		'jg': 7,

		'call': 8,
		'ret': 9,
		'pushq': 10,
		'popq': 11,

	        'iaddq': 12,
	        'isubq': 12,
	        'iandq': 12,
                'ixorq': 12,  

		'brk': 15,
		'brkle': 15,
		'brkl': 15,
		'brke': 15,
		'brkne': 15,
		'brkge': 15,
		'brkg': 15
	},
	inst2fn = {
		'addq': 0,
		'subq': 1,
		'andq': 2,
		'xorq': 3,

		'rrmovq': 0,
		'cmovle': 1,
		'cmovl': 2,
		'cmove': 3,
		'cmovne': 4,
		'cmovge': 5,
		'cmovg': 6,

		'jmp': 0,
		'jle': 1,
		'jl': 2,
		'je': 3,
		'jne': 4,
		'jge': 5,
		'jg': 6,

	        'iaddq': 0,
	        'isubq': 1,
	        'iandq': 2,
                'ixorq': 3,  
	    
		'brk': 0,
		'brkle': 1,
		'brkl': 2,
		'brke': 3,
		'brkne': 4,
		'brkge': 5,
		'brkg': 6
	};

function print(x){
	return console.log(x);
}

function printRegisters(registers){
	print(reg2str(registers));
}

function reg2str(registers){
	var result = ''
	for (r in registers) {
		if (r.length === 1) {
			result += (num2reg[r] + ': ' + registers[r].toString(16));
		} else {
			result += (r + ': ' + registers[r].toString(16));
		}
		result += '\n';
	}
	return result;
}

function printMemory(){//TODO 64 bit
	var i = 0,
		str = '';
	for(b in MEMORY){
		if (i % 8 === 0 && i > 0) {
			print('PC = ' + (i - 8) + ' | ' + str);
			str = '';
		}
		str += num2hex(MEMORY[b]);
		i++;
	} 
	//print(MEMORY);
}

function num2hex(num){
	var result = num.toString(16);
	return result.length % 2 === 1 ? '0' + result : result;
}

function toBigEndian(hexstr){
	var i, result = '';
	if(hexstr.length % 2 === 1){
		hexstr = '0' + hexstr;
	}
	for (i = hexstr.length; i > 0; i -= 2){
		result += hexstr.substr(i - 2, 2);
	}
	return result;
}

function toLittleEndian(hexstr){
	return toBigEndian(hexstr);
}

function hexstr2num(h){
	return parseInt(x, 16);
}

// Parse a number that is either in base 10 or in base 16 with '0x' in front.
function parseNumberLiteral (str) {
	if(str.length > 2 && str.substr(0, 2) === '0x') {
		str = str.substr(2);
		var high = 0;
		var low = 0;
		if(str.length > 8) {
			high = parseInt(str.substr(0, str.length - 8), 16);
			low = parseInt(str.substr(str.length - 8), 16);
		}
		else {
			high = 0;
			low = parseInt(str, 16);
		}

		if(isNaN(low) || isNaN(high)) {
			throw new Error('Not a number: ' + str);
		}
		return new UInt64(high, low);
	}
	else {

		if (isNaN(str)) {
			throw new Error('Not a number (numbers > 2^32 must be in hex): ' + str);
		}
		else {
			var int = parseInt(str, 10);
			if(isNaN(int)) {
				int = 0;
			}
			return new UInt64(int);
		}
	}
}

function padHex(num, width){
	var result = num ? num.toString(16) : '0';
	//var result = num.toBool() ? num.toString(16) : '0';
	while (result.length < width) {
		result = '0' + result;
	}
	return result;
}
