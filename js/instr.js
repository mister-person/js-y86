var INSTR = {};

INSTR[0] = function () {
	STAT = 'HLT';
	//print("Program halted");
};
INSTR[1] = function () {
	//NOP
};
INSTR[2] = function () {
	switch(this.fn) {
		case 0:
			// RRMOVQ
			REG[this.rB] = getRegister(this.rA);
			break;
		case 1:
			// CMOVLE
			if (SF === 1 || ZF === 1) {
				REG[this.rB] = getRegister(this.rA);
			}
			break;
		case 2:
			// CMOVL
			if (SF === 1) {
				REG[this.rB] = getRegister(this.rA);
			}
			break;
		case 3:
			// CMOVE
			if (ZF === 1) {
				REG[this.rB] = getRegister(this.rA);
			}
			break;
		case 4:
			// CMOVNE
			if (ZF === 0) {
				REG[this.rB] = getRegister(this.rA);
			}
			break;
		case 5:
			// CMOVGE
			if (SF === 0 || ZF === 1) {
				getRegister(this.rB) = getRegister(this.rA);
			}
			break;
		case 6:
			// CMOVG
			if (SF === 0 && ZF === 0) {
				REG[this.rB] = getRegister(this.rA);
			}
			break;
	}
};
INSTR[3] = function () {//IRMOVQ
	REG[this.rB] = this.V;
};
INSTR[4] = function () {//RMMOVQ
        var valA = getRegister(this.rA);
        var valB = UInt64(0); // valB is zero if rB is not used
        if(this.rB != 15) valB = getRegister(this.rB); 
        var valE = valB.add(this.D);
	ST(valE, valA, 8);
};
INSTR[5] = function () {//MRMOVQ
        var valB = UInt64(0); // valB is zero if rB is not used
        if(this.rB != 15) valB = getRegister(this.rB); 
        var valE = valB.add(this.D);
	REG[this.rA] = LD(valE);
};
INSTR[6] = function () {//OPQ
	var valA = getRegister(this.rA),
		valB = getRegister(this.rB),
		sgnA, sgnB, sgnR, signBit = new UInt64(0x80000000, 0);
	switch(this.fn) {
		case 0:
			sgnA = (valA.and(signBit)).toBool();
			sgnB = (valB.and(signBit)).toBool();
			REG[this.rB] = REG[this.rB].add(getRegister(this.rA));
			sgnR = (getRegister(this.rB).and(signBit)).toBool();
			OF = +(sgnA && sgnB && !sgnR ||
			       !sgnA && !sgnB && sgnR)
			break;
		case 1:
			sgnA = (valA.and(signBit)).toBool();
			sgnB = (valB.and(signBit)).toBool();
			REG[this.rB] = REG[this.rB].sub(getRegister(this.rA));
			sgnR = (getRegister(this.rB).and(signBit)).toBool();
			OF = +(sgnA && sgnB && !sgnR ||
			       !sgnA && !sgnB && sgnR)
			break;
		case 2:
			REG[this.rB] = getRegister(this.rA).and(getRegister(this.rB));
			break;
		case 3:
			REG[this.rB] = getRegister(this.rA).xor(getRegister(this.rB));
			break;
	}
	SF = (getRegister(this.rB).and(signBit)).toBool() ? 1 : 0;
	ZF = getRegister(this.rB).is0() ? 1 : 0;
};
INSTR[7] = function ()  {//JXX
	switch(this.fn) {
		case 0:
			// JMP
			PC = this.Dest.low;
			break;
		case 1:
			// JLE
			if (SF === 1 || ZF === 1) {
				PC = this.Dest.low;
			}
			break;
		case 2:
			// JL
			if (SF === 1) {
				PC = this.Dest.low;
			}
			break;
		case 3:
			// JE
			if (ZF === 1) {
				PC = this.Dest.low;
			}
			break;
		case 4:
			// JNE
			if (ZF === 0) {
				PC = this.Dest.low;
			}
			break;
		case 5:
			// JGE
			if (SF === 0 || ZF === 1) {
				PC = this.Dest.low;
			}
			break;
		case 6:
			// JG
			if (SF === 0 && ZF === 0) {
				PC = this.Dest.low;
			}
			break;

	}
};
INSTR[8] = function () {//CALL
	var valB = getRegister(4),
		valE = valB.sub(new UInt64(8));
	ST(valE, new UInt64(PC), 8);
	REG[4] = valE;
	PC = this.Dest.low;
};
INSTR[9] = function () {//RET
	var valA = getRegister(4),
		valB = getRegister(4),
		valE = valB.add(new UInt64(8)),
		valM = LD(valA);
		REG[4] = valE;
		PC = valM.low;
};
INSTR[10] = function () {//PUSHQ
	//console.log("asdf1 " + this.rA)
	var valA = getRegister(this.rA);
	var valB = getRegister(4),
		valE = valB.sub(new UInt64(8));
	//console.log("PUSH " + valE + " " + valA + " " + valB.sub(new UInt64(4)) + " " + PC)
	ST(valE, valA, 8);
	REG[4] = valE;
};
INSTR[11] = function () {//POPQ
	var valA = getRegister(4),
		valB = getRegister(4),
		valE = valB.add(new UInt64(8)),
		valM = LD(valA);
	REG[4] = valE;
	REG[this.rA] = valM;
};

INSTR[12] = function () { // iaddl, isubl, iandl, ixorl
    var valA = this.V;
    var valB = getRegister(this.rB);
    var sgnA, sgnB, sgnR, signBit = new UInt64(0x80000000, 0);
    switch(this.fn) {
    case 0:
	sgnA = (valA.and(signBit)).toBool();
	sgnB = (valB.and(signBit)).toBool();
	REG[this.rB] = REG[this.rB].add(valA);
	sgnR = (getRegister(this.rB).and(signBit)).toBool();
	OF = +(sgnA && sgnB && !sgnR ||
	       !sgnA && !sgnB && sgnR)
	break;
    case 1:
	sgnA = (valA.and(signBit)).toBool();
	sgnB = (valB.and(signBit)).toBool();
	REG[this.rB] = REG[this.rB].sub(valA);
	sgnR = (getRegister(this.rB).and(signBit)).toBool();
	OF = +(sgnA && sgnB && !sgnR ||
	       !sgnA && !sgnB && sgnR)
	break;
    case 2:
	REG[this.rB] = valA.and(getRegister(this.rB));
	break;
    case 3:
	REG[this.rB] = valA.xor(getRegister(this.rB));
	break;
    }
	SF = getRegister(this.rB).and(0x80000000).toBool() ? 1 : 0;
	ZF = getRegister(this.rB).is0() ? 1 : 0;
};

INSTR[15] = function () {
	switch(this.fn) {
		case 0:
			// BRK
			STAT = 'DBG';
			break;
		case 1:
			// BRKLE
			if (SF === 1 || ZF === 1) {
				STAT = 'DBG';
			}
			break;
		case 2:
			// BRKL
			if (SF === 1) {
				STAT = 'DBG';
			}
			break;
		case 3:
			// BRKE
			if (ZF === 1) {
				STAT = 'DBG';
			}
			break;
		case 4:
			// BRKNE
			if (ZF === 0) {
				STAT = 'DBG';
			}
			break;
		case 5:
			// BRKGE
			if (SF === 0 || ZF === 1) {
				STAT = 'DBG';
			}
			break;
		case 6:
			// BRKG
			if (SF === 0 && ZF === 0) {
				STAT = 'DBG';
			}
			break;
	}
};
