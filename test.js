const { Socket }      = require ('net');
const { createPxSys } = require ('./main.js');


const pxObject = createPxSys (160, 120);

pxObject.createServer (23, '127.0.0.1');
pxObject.onServer ('connection', socket =>
{
	console.log (`New connection: ${socket.remoteAddress}:${socket.remotePort}`);

	pxObject.setScreenPixel (Math.round (Math.random () * 160), Math.round (Math.random () * 120), 'colorID', Math.round (Math.random () * 16));
	pxObject.sendScreenData ();
});
