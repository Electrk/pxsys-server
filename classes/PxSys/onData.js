const rfr = require ('rfr');
const has = require ('has-own-property-x');

const { integerTypeAssert } = rfr ('utility/typeAssert.js');


module.exports = ( PxSys ) =>
{
	PxSys.prototype._onData = function ( pxSocket, data )
	{
		if ( this.isDeleted )
		{
			return;
		}

		const dataString = data.toString ();
		let dataJSON;

		this.log ('Received:', dataString);

		try
		{
			dataJSON = JSON.parse (dataString);

			if ( !has (dataJSON, 'packetType') )
			{
				throw new Error ('Packet missing `packetType` property!');
			}

			if ( !has (dataJSON, 'data') )
			{
				throw new Error ('Packet missing `data` property!');
			}

			integerTypeAssert (dataJSON.packetType, 'packetType');
		}
		catch ( error )
		{
			this.sendSocketError (pxSocket, 'CL_ERROR', 'CL_MALFORMED_PACKET', error.message);
			return;
		}

		const packetType = this.getCommandString (dataJSON.packetType);

		if ( !pxSocket.isAuthed  &&  packetType !== 'CL_AUTH_INFO' )
		{
			this.sendSocketError (pxSocket, 'CL_ERROR', 'CL_NOT_AUTHED');
			return;
		}

		switch ( packetType )
		{
			case 'CL_AUTH_INFO':
			{
				this.authenticate (pxSocket, dataJSON.data);
				break;
			}
		}
	};
};
