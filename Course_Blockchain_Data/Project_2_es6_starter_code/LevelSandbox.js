/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    async getLevelDBData(key){
        try {
            let value = await this.db.get(key);
            return JSON.parse(value);
        } catch (err) {
            console.log('Not found!', err);
        }
    }

    // Add data to levelDB with key and value (Promise)
    async addLevelDBData(key, value) {
        try {
            return await this.db.put(key, JSON.stringify(value));
        } catch (err) {
            console.log('Block ' + key + ' submission failed', err);
        }
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise((resolve, reject) => {
            let i = 0;
            this.db.createReadStream().on('data', function (data) {
                i++;
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(i);
            });
        }); 
    }
    
    getBlocks() {
        return new Promise((resolve, reject) => {
            let blockList = [];
            this.db.createReadStream().on('data', function (data) {
                blockList.push(JSON.parse(data));
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(blockList);
            });
        }); 
    }

}

module.exports.LevelSandbox = LevelSandbox;
