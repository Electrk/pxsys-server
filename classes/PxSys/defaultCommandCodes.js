const defaultCommandCodes =
[
	'CL_ERROR',
	'SV_ERROR',
	'CS_ERROR',

	/* CL_ is for commands sent from client to server */

	// When a client sends login/auth credentials (TODO)
	'CL_AUTH_INFO',

	/* SV_ is for commands sent from server to client (TODO) */

	// The server's authentication response:
	//
	//   If successful:
	//     <SUCCESS (1) ISADMIN (0 or 1)>
	//
	//   If unsuccessful:
	//     <FAILURE (0) ERRORLIST (ERRORCODE ERRORMESSAGE, ERRORCODE ERRORMESSAGE, ...)

	'SV_AUTH_RESPONSE',

	// When the server sends the colorset data (TODO)
	'SV_COLORSET',

	// Setting pixel data
	//   x y key value
	'SV_PIXEL_DATA',

	/* CS_ is for commands shared by both */

	// TODO?
];


module.exports = Object.freeze (defaultCommandCodes);
