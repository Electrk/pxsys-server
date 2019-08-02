const assert = require ('assert');
const rfr    = require ('rfr');

const { defaultValue } = rfr ('utility/miscellaneous.js');


const defaultMessage = function ( message, valueName = 'Value', defaultMessageEnd )
{
	return defaultValue (message, `${valueName} must be ${defaultMessageEnd}`);
};

const instanceOfAssert = function ( instance, classObj, valueName = 'Object', message )
{
	message = defaultMessage (message, valueName, `an instance of ${classObj.name}!`);
	check   = instance instanceof classObj;

	assert.ok (check, message);
}

const integerTypeAssert = function ( value, valueName = 'Value', message )
{
	message = defaultMessage (message, valueName, 'an integer!');
	check   = Number.isInteger (value);

	assert.ok (check, message);
};

const numberTypeAssert = function ( value, valueName = 'Value', message )
{
	message = defaultMessage (message, valueName, 'a number!');
	check   = typeof value === 'number'  &&  !isNaN (value);

	assert.ok (check, message);
};

const stringTypeAssert = function ( value, valueName = 'Value', message )
{
	message = defaultMessage (message, valueName, 'a string!');
	check   = typeof value === 'string';

	assert.ok (check, message);
};

const objectTypeAssert = function ( value, valueName = 'Value', message )
{
	message = defaultMessage (message, valueName, 'a non-array object!');
	check   = typeof value === 'object'  &&  !Array.isArray (value);

	assert.ok (check, message);
};

const arrayTypeAssert = function ( value, valueName = 'Value', message )
{
	message = defaultMessage (message, valueName, 'an array!');
	check   = Array.isArray (value);

	assert.ok (check, message);
};

const functionTypeAssert = function ( value, valueName = 'Value', message )
{
	message = defaultMessage (message, valueName, 'a function!');
	check   = typeof value === 'function';

	assert.ok (check, message);
}

const notNullAssert = function ( value, valueName = 'Value', message )
{
	message = defaultValue (message, `${valueName} is null!`);
	check   = value !== null;

	assert.ok (check, message);
};


module.exports =
{
	instanceOfAssert,

	numberTypeAssert,
	integerTypeAssert,
	stringTypeAssert,
	objectTypeAssert,
	arrayTypeAssert,
	functionTypeAssert,

	notNullAssert,
};
