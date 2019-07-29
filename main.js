const SHA26 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA26(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.hash = this.calculateHash();
            this.nonce++;
        }

        console.log("Block mined: "+ this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, '28/07/2019', "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let blockChain = new BlockChain();

console.log("Mining a block...");
blockChain.addBlock(new Block(1, '28/07/2019', { amount:7 }));

console.log("Mining a block...");
blockChain.addBlock(new Block(2, '28/07/2019', { amount:10 }));

console.log(JSON.stringify(blockChain, null, 5));
console.log('\nIs blockchian valid: ' + blockChain.isChainValid());

console.log('\nTampering a block...');
blockChain.chain[1].data = { amount:12 };

console.log('\nIs blockchian valid: ' + blockChain.isChainValid());


