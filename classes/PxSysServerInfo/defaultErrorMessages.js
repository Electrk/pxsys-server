const defaultErrorMessages =
{
	CL_BAD_LOGIN: 'Invalid login key.',
	CL_BAD_ADMIN: 'Invalid admin key.',

	CL_BAD_PX_VER:  'Your PxSys version is not a number!',
	CL_BAD_APP_VER: 'Your application version is not a number!',

	CS_PX_VER_NEW: 'This server is running a newer version of PxSys.',
	CS_PX_VER_OLD: 'This server is running an older version of PxSys.',

	CS_APP_NAME_MM: 'This server is running a different application.',

	CS_APP_VER_NEW: 'This server is running a newer version of the application.',
	CS_APP_VER_OLD: 'This server is running an older version of the application.',
};


module.exports = Object.freeze (defaultErrorMessages);
