const express = require('express');
const bodyParser = require('body-parser');
const BC = require('./BlockChain');
const app = express();
const port = 3000;

const BlockChain = new BC.Blockchain();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.json());

app.get('/block/:height', async (req, res) => {
    let block = await BlockChain.getBlock(req.params.height);
    res.send(block);
})

app.post('/block', async (req, res) => {
    let block = await BlockChain.addDataBlock(req.body.data);
    res.send(block);
})