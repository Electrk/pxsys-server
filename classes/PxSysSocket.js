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

		this.isAuthed = false;
		this.isAdmin  = false;

		this._socket = tcpSocket;
	}

	delete ()
	{
		this._socket.end ();
		delete this._socket;
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

	getTCPSocket ()
	{
		return this._socket;
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
