var SYNTAX = {};

SYNTAX['halt'] = [];
SYNTAX['nop'] = [];

SYNTAX['rrmovq'] = ['rA', 'rB'];
SYNTAX['cmovle'] = ['rA', 'rB'];
SYNTAX['cmovl'] = ['rA', 'rB'];
SYNTAX['cmove'] = ['rA', 'rB'];
SYNTAX['cmovne'] = ['rA', 'rB'];
SYNTAX['cmovge'] = ['rA', 'rB'];
SYNTAX['cmovg'] = ['rA', 'rB'];

SYNTAX['irmovq'] = ['V', 'rB'];
SYNTAX['rmmovq'] = ['rA', 'D(rB)'];
SYNTAX['mrmovq'] = ['D(rB)', 'rA'];

SYNTAX['addq'] = ['rA', 'rB'];
SYNTAX['subq'] = ['rA', 'rB'];
SYNTAX['xorq'] = ['rA', 'rB'];
SYNTAX['andq'] = ['rA', 'rB'];

SYNTAX['jmp'] = ['Dest'];
SYNTAX['jle'] = ['Dest'];
SYNTAX['jl'] = ['Dest'];
SYNTAX['je'] = ['Dest'];
SYNTAX['jne'] = ['Dest'];
SYNTAX['jge'] = ['Dest'];
SYNTAX['jg'] = ['Dest'];

SYNTAX['call'] = ['Dest'];
SYNTAX['ret'] = [];
SYNTAX['pushq'] = ['rA'];
SYNTAX['popq'] = ['rA'];

SYNTAX['iaddq'] = ['V', 'rB'];
SYNTAX['isubq'] = ['V', 'rB'];
SYNTAX['ixorq'] = ['V', 'rB'];
SYNTAX['iandq'] = ['V', 'rB'];

SYNTAX['brk'] = [];
SYNTAX['brkle'] = [];
SYNTAX['brkl'] = [];
SYNTAX['brke'] = [];
SYNTAX['brkne'] = [];
SYNTAX['brkge'] = [];
SYNTAX['brkg'] = [];

