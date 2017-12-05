const INIT  = 0b00000001;
const SET   = 0b00000010;
const SAVE  = 0b00000100;
const MUL   = 0b00000101;
const SUB   = 0b00000111;
const ADD   = 0b00001000;
const DIV   = 0b00001001;
const PRN   = 0b00000110;
const HALT  = 0b00000000;

class CPU {
    constructor() {
        this.mem = new Array(256);
        this.mem.fill(0);

        this.reg = new Array(256);
        this.reg.fill(0);

        this.reg.PC = 0;

        this.curReg = 0;

        this.buildBranchTable();
    }


    buildBranchTable() {
        let bt = {
            [INIT]: this.INIT,
            [SET]: this.SET,
            [SAVE]: this.SAVE,
            [MUL]: this.MUL,
            [SUB]: this.SUB,
            [ADD]: this.ADD,
            [DIV]: this.DIV,
            [PRN]: this.PRN,
            [HALT]: this.HALT
        };
        // bt[INIT] = this.INIT;
        // bt[SET] = this.SET;

        this.branchTable = bt;
    }

    /**
     * Poke values into memory
     */
    poke (address, value) {
        this.mem[address] = value;
    }

    /**
     * Peek value from memory
     */
    peek (address) {
        return this.mem[address];
    }

    /**
     * startClock
     */
    startClock() {
        this.clock = setInterval(() => { this.tick(); }, 500);
    }

    /**
     * stop the clock
     *
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * tick
     *
     */
    tick() {
        // run instructions...
        const currentInstruction = this.mem[this.reg.PC];
        console.log(currentInstruction);

        const handler = this.branchTable[currentInstruction];

        if (handler === undefined) {
            console.error('ERROR: invalid instruction ' + currentInstruction);
            this.stopClock();
            return;
        }

        handler.call(this); // set this explicitly in handler
    }

    /**
     * Init
     *
     */
    INIT() {
        console.log('INIT');

        this.curReg = 0;

        this.reg.PC++; // go to next instruction
    }

    /**
     * set the current register location
     * @method SET
     */
    SET() {
        console.log('SET');
        const reg = this.mem[this.reg.PC + 1];

        this.curReg = reg;
        this.reg.PC += 2;
    }

    /**
     * Save the value in the inext instruction line to the current register location
     * @method SAVE
     */
    SAVE() {
        console.log('SAVE');
        this.reg[this.curReg] = this.mem[this.reg.PC + 1];
        this.reg.PC += 2;
    }

    /**
     * multiply the next two concurrent values in memory and place them into current register location
     * @method MULL
     */
    MUL() {
        console.log('MUL');
        const val1 = this.reg[this.mem[this.reg.PC + 1]];
        const val2 = this.reg[this.mem[this.reg.PC + 2]];
        this.reg[this.curReg] = val2 * val1;

        this.reg.PC += 3;
    }

    SUB() {
        console.log('SUB');
        const val1 = this.reg[this.mem[this.reg.PC + 1]];
        const val2 = this.reg[this.mem[this.reg.PC + 2]];
        this.reg[this.curReg] = val1 - val2;

        this.reg.PC += 3;
    }

    ADD() {
        console.log('ADD');
        const val1 = this.reg[this.mem[this.reg.PC + 1]];
        const val2 = this.reg[this.mem[this.reg.PC + 2]];
        this.reg[this.curReg] = val2 + val1;

        this.reg.PC += 3;
    }

    DIV() {
        console.log('DIV');
        const val1 = this.reg[this.mem[this.reg.PC + 1]];
        const val2 = this.reg[this.mem[this.reg.PC + 2]];
        this.reg[this.curReg] = val1 / val2;

        this.reg.PC += 3;
    }

    /**
     * print the current number.
     * @method PRN
     */
    PRN() {
        console.log('OUTPUT: ', this.reg[this.curReg]);
        this.reg.PC++;
    }

    /**
     * halt the current program in memory.
     * @method HALT
     */
    HALT() {
        console.log('HALT');
        this.stopClock();
    }
}

module.exports = CPU;