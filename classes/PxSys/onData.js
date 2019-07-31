const rfr = require ('rfr');
const has = require ('has-own-property-x');

const { integerTypeAssert, stringTypeAssert, functionTypeAssert } = rfr ('utility/typeAssert.js');


module.exports = ( PxSys ) =>
{
	PxSys.prototype.addPacketHandler = function ( packetType, callback )
	{
		stringTypeAssert (packetType, 'packetType');
		functionTypeAssert (callback, 'callback');

		const boundCallback = callback.bind (this);

		if ( !this._packetHandlers.has (packetType) )
		{
			this._packetHandlers.set (packetType, new Set ());
		}

		const handlerSet = this._packetHandlers.get (packetType);

		if ( !handlerSet.has (boundCallback) )
		{
			handlerSet.add (boundCallback);
		}

		return boundCallback;
	};

	PxSys.prototype._onData = function ( pxSocket, data )
	{
		if ( this.isDeleted )
		{
			return;
		}

		const dataString = data.toString ().replace (/\r?\n|\r/g, '');
		const dataArray  = dataString.split ('\t');

		if ( dataArray.length <= 0  ||  parseInt (dataArray[0]) != dataArray[0] )
		{
			this.sendSocketError (pxSocket, 'CL_ERROR', 'CL_MALFORMED_PACKET', 'Missing packet type!');
			return;
		}

		const packetType = this.getCommandString (parseInt (dataArray[0]));

		if ( !pxSocket.isAuthed  &&  packetType !== 'CL_AUTH_INFO' )
		{
			const errorMsg = 'You have not authenticated with the server yet!';
			this.sendSocketError (pxSocket, 'CL_ERROR', 'CL_NOT_AUTHED', errorMsg);

			return;
		}

		// Remove packet type because we don't need it anymore
		dataArray.shift ();

		if ( this._packetHandlers.has (packetType) )
		{
			const handlers = this._packetHandlers.get (packetType);

			for ( let handlerFunction of handlers )
			{
				handlerFunction (pxSocket, dataArray);
			}
		}
		else
		{
			this.sendSocketError (pxSocket, 'CL_ERROR', 'CL_UNK_PACKET_TYPE', 'Unknown packet type.');
		}
	};
};
