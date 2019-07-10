const assert = require ('assert');


const minAssert = ( value, min, valueName = 'Value', message = null ) =>
{
	if ( message === null )
	{
		message = `${valueName} must be greater than or equal to ${min}`;
	}

	assert.ok (value >= min, message);
}

const maxAssert = ( value, max, valueName = 'Value', message = null ) =>
{
	if ( message === null )
	{
		message = `${valueName} must be less than or equal to ${max}`;
	}

	assert.ok (value <= max, message);
}

const clampAssert = ( value, min, max, valueName, message ) =>
{
	minAssert (value, min, valueName, message);
	maxAssert (value, max, valueName, message);
};


module.exports = { minAssert, maxAssert, clampAssert };
