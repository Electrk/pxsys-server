const defaultErrorCodes =
[
	'CL_GENERIC',
	'SV_GENERIC',
	'CS_GENERIC',

	/* CL_ is for errors on the client side */

	// Missing required authentication information
	'CL_MISSING_INFO',

	// Invalid login credentials
	'CL_BAD_LOGIN',

	// Invalid admin credentials
	'CL_BAD_ADMIN',

	/* SV_ is for errors on the server side */

	// TODO

	/* CS_ is for errors that aren't specific to either side */

	// The server's PxSys version is older than the client's version
	'CS_PX_VER_OLD',

	// The server's PxSys version is newer than the client's version
	'CS_PX_VER_NEW',

	// The server's application version is older than the client's version
	'CS_APP_VER_OLD',

	// The server's application version is newer than the client's version
	'CS_APP_VER_NEW',

	// App client/server name mismatch
	'CS_APP_NAME_MM',

	// Colorset client/server size mismatch
	'CS_COLORSET_MM',
];


module.exports = Object.freeze (defaultErrorCodes);
