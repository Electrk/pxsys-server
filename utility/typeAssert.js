const assert = require ('assert');


const instanceOfAssert = ( instance, classObj, valueName = 'Object', message = null ) =>
{
	if ( message === null )
	{
		message = `${valueName} must be an instance of the ${classObj.name} class!`;
	}

	assert.ok (instance instanceof classObj, message);
}

const integerTypeAssert = ( value, valueName = 'Value', message = `${valueName} must be an integer!` ) =>
{
	assert.ok (Number.isInteger (value), message);
};

const numberTypeAssert = ( value, valueName = 'Value', message = `${valueName} must be a number!` ) =>
{
	assert.strictEqual (typeof value, 'number', message);
	assert.ok (!isNaN (value), message);
};

const stringTypeAssert = ( value, valueName = 'Value', message = `${valueName} must be a string!` ) =>
{
	assert.strictEqual (typeof value, 'string', message);
};

const objectTypeAssert = ( value, valueName = 'Value', message = `${valueName} must be a non-array object!` ) =>
{
	const check = (typeof value === 'object'  &&  !Array.isArray (value));

	assert.ok (check, message);
};

const arrayTypeAssert = ( value, valueName = 'Value', message = `${valueName} must be an array!` ) =>
{
	assert.ok (Array.isArray (value), message);
};

const notNullAssert = ( value, valueName = 'Value', message = `${valueName} is null!` ) =>
{
	assert.notStrictEqual (value, null, message);
};


module.exports =
{
	instanceOfAssert,

	numberTypeAssert,
	integerTypeAssert,
	stringTypeAssert,
	objectTypeAssert,
	arrayTypeAssert,

	notNullAssert,
};
