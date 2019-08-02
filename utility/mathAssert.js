const assert = require ('assert');
const rfr    = require ('rfr');

const { defaultValue } = rfr ('utility/miscellaneous.js');


const minAssert = ( value, min, valueName = 'Value', message ) =>
{
	message = defaultValue (message, `${valueName} must be greater than or equal to ${min}`);
	assert.ok (value >= min, message);
}

const maxAssert = ( value, max, valueName = 'Value', message ) =>
{
	message = defaultValue (message, `${valueName} must be less than or equal to ${max}`);
	assert.ok (value <= max, message);
}

const clampAssert = ( value, min, max, valueName, message ) =>
{
	minAssert (value, min, valueName, message);
	maxAssert (value, max, valueName, message);
};


module.exports = { minAssert, maxAssert, clampAssert };
