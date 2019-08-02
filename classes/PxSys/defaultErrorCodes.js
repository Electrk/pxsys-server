const defaultErrorCodes =
[
	'CL_GENERIC',
	'SV_GENERIC',
	'CS_GENERIC',

	/* CL_ is for errors on the client side */

	// The packet you have sent was malformed
	'CL_MALFORMED_PACKET',

	// The data you have sent was malformed
	'CL_MALFORMED_DATA',

	// Unknown packet type
	'CL_UNK_PACKET_TYPE',

	// You have not authenticated with the server yet
	'CL_NOT_AUTHED',

	// You're not the admin, dummy
	'CL_NOT_ADMIN',

	/* SV_ is for errors on the server side */

	// TODO

	/* CS_ is for errors that aren't specific to either side */

	// TODO
];


module.exports = Object.freeze (defaultErrorCodes);
