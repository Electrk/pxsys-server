const rfr = require ('rfr');
const has = require ('has-own-property-x');

const EnumBag = rfr ('classes/EnumBag.js');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class ErrorList
{
	constructor ( errorCodes, errorMessages = {} )
	{
		requiredArgsAssert ({ errorCodes });
		instanceOfAssert (errorCodes, EnumBag, 'errorCodes');

		this._errorCodes    = errorCodes;
		this._errorMessages = errorMessages;
		this._errorList     = [];
	}

	push ( errorCode, errorMessage = null )
	{
		requiredArgsAssert ({ errorCode });

		let code    = errorCode;
		let message = errorMessage;

		if ( typeof errorCode === 'string' )
		{
			code = this._errorCodes.get (code);
		}

		if ( errorMessage === null )
		{
			const codeString = this._errorCodes.getName (code);

			if ( has (this._errorMessages, codeString) )
			{
				message = this._errorMessages[codeString];
			}
			else
			{
				message = '';
			}
		}

		this._errorList.push (code, message);
	}

	pop ()
	{
		if ( this._codeList.length <= 0 )
		{
			return [];
		}

		const message = this._errorList.pop ();
		const code    = this._errorList.pop ();

		return [code, message];
	}

	getErrors ()
	{
		const errors = [];
		const length = this._errorList.length;

		for ( let i = 0;  i < length;  i += 2 )
		{
			let code    = this._errorList[i];
			let message = this._errorList[i + 1];

			errors.push (code, message);
		}

		return errors;
	}

	getLength ()
	{
		return this._errorList.length;
	}
}


module.exports = ErrorList;
