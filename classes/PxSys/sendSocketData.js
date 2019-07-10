module.exports = ( PxSys ) =>
{
	PxSys.prototype.sendSocketError = function ( pxSocket, errorType, errorCode, ...errorArgs )
	{
		let type = errorType;
		let code = errorCode;

		if ( typeof errorType === 'string' )
		{
			type = this._commandCodes.get (errorType);
		}

		if ( typeof errorCode === 'string' )
		{
			code = this._errorCodes.get (errorCode);
		}

		pxSocket.sendCommand (type, code, ...errorArgs);
	};

	PxSys.prototype.sendSocketCommand = function  ( pxSocket, command, ...commandArgs )
	{
		let code = command;

		if ( typeof command === 'string' )
		{
			code = this._commandCodes.get (command);
		}

		let args = commandArgs;

		for ( let i = 0;  i < args.length;  i++ )
		{
			let currArg = args[i];

			if ( typeof currArg === 'boolean' )
			{
				args[i] = currArg ? 1 : 0;
			}
		}

		pxSocket.sendCommand (code, ...args);
	};

	PxSys.prototype.sendCommandToAll = function ( command, ...commandArgs )
	{
		const px = this;

		this._socketManager.forEach (function ( pxSocket )
		{
			px.sendSocketCommand (pxSocket, command, ...commandArgs);
		});
	};
};
