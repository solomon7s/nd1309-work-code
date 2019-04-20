/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data){
		// Add your Block properties
		this.hash = '';
		this.time = 0;
		this.height = 0;
		this.body = data;
		this.previoushash = '';
	}


}

module.exports.Block = Block;
