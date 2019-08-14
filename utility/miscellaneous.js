const assert = require ('assert');
const has    = require ('has');


const hasMulti = ( obj, ...properties ) =>
{
	const length = properties.length;

	for ( let i = 0;  i < length;  i++ )
	{
		if ( !has (obj, properties[i]) )
		{
			return false;
		}
	}

	return true;
};

const requiredArgsAssert = ( argsObj = {}, functionName = null ) =>
{
	for ( let i in argsObj )
	{
		let errorMessage = `Missing required argument \`${i}\``;

		if ( functionName !== null )
		{
			errorMessage = `${functionName} () - ${errorMessage}`;
		}

		assert.ok (argsObj[i] !== null  &&  typeof argsObj[i] !== 'undefined', errorMessage);
	}
};

const defaultValue = ( value, defaultValue, testNaN = false ) =>
{
	if ( value === null  ||  typeof value === 'undefined' )
	{
		return defaultValue;
	}

	if ( testNaN  &&  isNaN (value) )
	{
		return defaultValue;
	}

	return value;
};


module.exports = { hasMulti, requiredArgsAssert, defaultValue };
