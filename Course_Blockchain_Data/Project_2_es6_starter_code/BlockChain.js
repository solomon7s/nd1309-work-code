/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    async generateGenesisBlock(){
        let height = await this.getBlockHeight();
        if ( !height) {
            let block =  new Block.Block('This is Solomon GenesisBlock #0')
            this.addBlock(block);
        }
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return this.bd.getBlocksCount();
    }

    // Add new block
    async addBlock(block) {
        block.height = await this.getBlockHeight();
        if (block.height > 0) {
            let previousBlock  = await this.bd.getLevelDBData(block.height -1 );
            block.previoushash = previousBlock.hash;
            
        }
        block.time = new Date().getTime().toString().slice(0,-3);
        block.hash = this.hashBlock(block);
        console.log('block data', block);
        this.bd.addLevelDBData(block.height, block);
        return block;
    }

    addDataBlock(data) {
        let block =  new Block.Block(data)
        return this.addBlock(block);
    }

    // Get Block By Height
    getBlock(height) {
        return this.bd.getLevelDBData(height);
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        let block = this.bd.getBlock(height);
        return block.hash === this.hashBlock(block);
        
    }

    // Validate Blockchain
    async validateChain() {
        let list = await this.bd.getBlocks();
        let errList = [];
        let genesisBlock = list[0];
        if ( block.hash !== this.hashBlock() ) {
            errList.push(`invalid integrety for Genesis Block`);
        }
        for( let i = 1, {length} = list; i < length; i++) {
            let block = list[i];
            if ( block.hash !== this.hashBlock() ) {
                errList.push(`invalid integrety for block #${i}`);
            } else {
                let previousBlock = list[i-1];
                if(block.previoushash !== previousBlock.hash) {
                    errList.push(`invalid chain link for block #${i}`);
                }
            }
        }
        if (errList.length > 0 ) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
            return false;
        }
        return true;
    }

    hashBlock( block ) {
        return SHA256(JSON.stringify(block)).toString()
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;
