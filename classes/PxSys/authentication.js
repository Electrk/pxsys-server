const rfr = require ('rfr');
const has = require ('has-own-property-x');

const { PXSYS_VERSION } = rfr ('miscellaneous/constants.js');


module.exports = ( PxSys ) =>
{
	PxSys.prototype.authenticate = function ( pxSocket, data )
	{
		const errors  = this._serverInfo.validateInfo (data);
		const success = errors.getLength () <= 0;
		const isAdmin = has (data, 'adminKey')  &&  success;

		pxSocket.isAuthed = success;
		pxSocket.isAdmin  = isAdmin;

		if ( success )
		{
			this.sendSocketCommand (pxSocket, 'SV_AUTH_RESPONSE', success, isAdmin);
		}
		else
		{
			this.sendSocketCommand (pxSocket, 'SV_AUTH_RESPONSE', success, ...errors.getErrors ());
		}
	};
};
