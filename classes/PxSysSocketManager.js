const rfr  = require ('rfr');
const has  = require ('has');

const PxSysSocket = rfr ('classes/PxSysSocket.js');


class PxSysSocketManager
{
	constructor ()
	{
		this._sockets = new Set ();
		this._events  = new Map ();
	}

	delete ()
	{
		const events  = this._events;
		const sockets = this._sockets;

		for ( let eventName of events )
		{
			events.get (eventName).clear ();
		}

		this.forEach (socket =>
		{
			socket.delete ();
		});

		events.clear ();
		sockets.clear ();

		delete this._events;
		delete this._sockets;
	}

	addSocket ( tcpSocket )
	{
		const pxSocket = new PxSysSocket (tcpSocket);
		const manager  = this;

		pxSocket.on ('close', () =>
		{
			manager.removeSocket (pxSocket);
		});

		this._applyAllEventListeners (pxSocket);
		this._sockets.add (pxSocket);

		return pxSocket;
	}

	removeSocket ( pxSocket )
	{
		this._sockets.delete (pxSocket);
		pxSocket.delete ();
	}

	forEach ( callback )
	{
		const sockets = this._sockets;

		for ( let socket of sockets )
		{
			callback (socket, id, sockets);
		}
	}

	forEachEventListener ( event, callback )
	{
		if ( !this._events.has (event) )
		{
			return;
		}

		const eventSet = this._events.get (event);

		for ( let cb of eventSet )
		{
			callback (cb);
		}
	}

	on ( event, listener )
	{
		const events = this._events;

		if ( !events.has (event) )
		{
			event.set (event, new Set ());
		}

		const eventSet = event.get (event);

		if ( !eventSet.has (listener) )
		{
			eventSet.add (listener);
		}

		this.forEach (socket =>
		{
			socket.on (event, listener);
		});

		return listener;
	}

	off ( event, listener )
	{
		const events = this._events;

		if ( !events.has (event) )
		{
			return;
		}

		this.forEach (socket =>
		{
			socket.off (event, listener);
		});

		event.get (event).delete (listener);

		return listener;
	}

	sendCommand ( command, ...args )
	{
		this.forEach (socket =>
		{
			socket.sendCommand (command, ...args);
		});
	}

	// ------------------------------------------------


	_applyEventListener ( event, socket )
	{
		this.forEachEventListener (event, callback =>
		{
			socket.on (event, callback);
		});
	}

	_applyAllEventListeners ( socket )
	{
		const events = this._events;

		for ( let eventName of events )
		{
			this._applyEventListener (eventName, socket);
		}
	}
}


module.exports = PxSysSocketManager;
