const logMessage = function ( type = 'log', ...args )
{
	if ( type !== 'log'  &&  type !== 'warn'  &&  type !== 'error' )
	{
		return;
	}

	const timestamp = new Date ().toLocaleString ();
	const message   = `<${timestamp}> [PxSys]`;

	console[type] (message, ...args);
};

const logger =
{
	log ( ...args )
	{
		logMessage ('log', ...args);
	},

	warn ( ...args )
	{
		logMessage ('warn', ...args);
	},

	error ( ...args )
	{
		logMessage ('error', ...args);
	},
};


module.exports = logger;
