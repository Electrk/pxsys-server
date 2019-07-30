const has = require ('has');


const defaultPacketHandlers =
{
	// dataArray: appName, appVersion, pxSysVersion, loginKey[, adminKey]

	CL_AUTH_INFO ( pxSocket, dataArray )
	{
		const authFields = ['appName', 'appVersion', 'pxSysVersion', 'loginKey', 'adminKey'];
		const length     = authFields.length;
		const authInfo   = {};

		for ( let i = 0;  i < length;  i++ )
		{
			if ( i >= dataArray.length )
			{
				break;
			}

			authInfo[authFields[i]] = dataArray[i];
		}

		this.authenticate (pxSocket, authInfo);
	}
};


module.exports = defaultPacketHandlers;
