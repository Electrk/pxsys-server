const defaultPacketHandlers =
{
	// dataArray: appName, appVersion, pxSysVersion, loginKey[, adminKey]

	CL_AUTH_INFO ( pxSocket, dataArray )
	{
		if ( dataArray.length < 4 )
		{
			this.sendSocketError (pxSocket, 'CL_ERROR', 'CL_MALFORMED_DATA', 'Missing required data.');
			return;
		}

		const authInfo =
		{
			appName:      dataArray[0],
			appVersion:   dataArray[1],
			pxSysVersion: dataArray[2],
			loginKey:     dataArray[3],
		};

		if ( dataArray.length >= 5 )
		{
			authInfo.adminKey = dataArray[4];
		}

		this.authenticate (pxSocket, authInfo);
	}
};


module.exports = defaultPacketHandlers;
