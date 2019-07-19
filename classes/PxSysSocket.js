const rfr = require ('rfr');

const { Socket } = require ('net');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class PxSysSocket
{
	constructor ( tcpSocket, config = {} )
	{
		const { isAuthed = false, isAdmin = false } = config;

		requiredArgsAssert ({ tcpSocket });
		instanceOfAssert (tcpSocket, Socket);

		this.isDeleted = false;
		this.isAuthed  = false;
		this.isAdmin   = false;

		this._socket = tcpSocket;
	}

	delete ()
	{
		if ( this.isDeleted )
		{
			return;
		}

		this._socket.end ();
		delete this._socket;

		this.isDeleted = true;
	}

	on ( event, listener )
	{
		const pxSocket = this;

		const onEvent = function ( ...args )
		{
			listener (...args);
		};

		return this._socket.on (event, onEvent.bind (this));
	}

	off ( event, listener )
	{
		return this._socket.off (event, listener);
	}

	sendCommand ( command, ...args )
	{
		this._writeLine (`${command}\t${args.join ('\t')}`);
	}

	// ------------------------------------------------


	_write ( str = '' )
	{
		this._socket.write (str);
	}

	_writeLine ( str = '' )
	{
		this._socket.write (`${str}\r\n`);
	}
}


module.exports = PxSysSocket;
