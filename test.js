const { Socket }      = require ('net');
const { createPxSys } = require ('./main.js');


const pxObject = createPxSys (160, 120);

pxObject.createServer (23, '127.0.0.1');
// setTimeout (() => pxObject.destroyServer (), 5000);

pxObject.onServer ('connection', () => console.log ('aw shit here we go again'));
