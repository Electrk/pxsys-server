const rfr = require ('rfr');
const has = require ('has-own-property-x');

const EnumBag   = rfr ('classes/EnumBag.js');
const ErrorList = rfr ('classes/ErrorList.js');

const { numberTypeAssert, stringTypeAssert } = rfr ('utility/typeAssert.js');
const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { PXSYS_VERSION }      = rfr ('miscellaneous/constants.js');

const defaultErrorCodes    = require ('./defaultErrorCodes.js');
const defaultErrorMessages = require ('./defaultErrorMessages.js');


class PxSysServerInfo
{
	constructor ( info = {} )
	{
		const { loginKey, adminKey, appVersion, appName } = info;

		requiredArgsAssert ({ loginKey, adminKey, appVersion, appName });

		stringTypeAssert (loginKey, 'loginKey');
		stringTypeAssert (adminKey, 'adminKey');
		stringTypeAssert (appName, 'appName');
		numberTypeAssert (appVersion, 'appVersion');

		this.isDeleted  = false;
		this.appVersion = appVersion;
		this.appName    = appName;

		this._errorCodes     = new EnumBag (...defaultErrorCodes);
		this._errorMessages  = { ...defaultErrorMessages };
		this._loginKey       = loginKey;
		this._adminKey       = adminKey;
	}

	delete ()
	{
		if ( this.isDeleted )
		{
			return;
		}

		delete this.appVersion;
		delete this.appName;
		delete this._errorCodes;
		delete this._errorMessages;
		delete this._loginKey;
		delete this._adminKey;

		this.isDeleted = true;
	}

	validateInfo ( info = {} )
	{
		if ( this.isDeleted )
		{
			return null;
		}

		const { loginKey, pxSysVersion, appVersion, appName, adminKey } = info;

		const errors = new ErrorList (this._errorCodes, this._errorMessages);

		const required = ['loginKey', 'pxSysVersion', 'appVersion', 'appName'];
		const length   = required.length;

		const missing = [];

		for ( let i = 0;  i < length;  i++ )
		{
			let field = required[i];

			if ( !has (info, field) )
			{
				missing.push (field);
			}
		}

		if ( missing.length >= 1 )
		{
			errors.push ('CL_MISSING_INFO', `Missing required fields: \`${missing.join ('`, `')}\``);
		}
		else if ( appName !== this.appName )
		{
			// If they're not even using the same application, why bother checking anything else?

			errors.push ('CS_APP_NAME_MM');
		}
		else
		{
			if ( loginKey !== this._loginKey )
			{
				errors.push ('CL_BAD_LOGIN');
			}

			if ( has (info, 'adminKey')  &&  adminKey !== this._adminKey)
			{
				errors.push ('CL_BAD_ADMIN');
			}

			if ( isNaN (pxSysVersion) )
			{
				errors.push ('CL_BAD_PX_VER');
			}
			else if ( pxSysVersion < PXSYS_VERSION )
			{
				errors.push ('CS_PX_VER_NEW');
			}
			else if ( pxSysVersion > PXSYS_VERSION )
			{
				errors.push ('CS_PX_VER_OLD');
			}

			if ( isNaN (appVersion) )
			{
				errors.push ('CL_BAD_APP_VER');
			}
			else if ( appVersion < this.appVersion )
			{
				errors.push ('CS_APP_VER_NEW');
			}
			else if ( appVersion > this.appVersion )
			{
				errors.push ('CS_APP_VER_OLD');
			}
		}

		return errors;
	}
}


module.exports = PxSysServerInfo;
