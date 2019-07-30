const rfr = require ('rfr');
const has = require ('has-own-property-x');

const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSysServerInfo      = rfr ('classes/PxSysServerInfo/PxSysServerInfo.js');
const defaultErrorMessages = rfr ('classes/PxSysServerInfo/defaultErrorMessages.js');

const { PXSYS_VERSION } = rfr ('miscellaneous/constants.js');


describe ('PxSysServerInfo', function ()
{
	const dummyInfo = { loginKey: 'login', adminKey: 'admin', appVersion: 1, appName: 'App', pxSysVersion: 1 };

	it (`should throw an error when a required field is missing`, function ()
	{
		const requiredInfo = ['appName', 'appVersion', 'loginKey', 'adminKey'];
		const length = requiredInfo.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let leaveOutField = requiredInfo[i];
			let testInfo      = {};

			for ( let j = 0;  j < length;  j++ )
			{
				let field = requiredInfo[j];

				if ( field === leaveOutField )
				{
					continue;
				}

				testInfo[field] = dummyInfo[field];
			}

			expect (() => new PxSysServerInfo (testInfo)).to.throw (AssertionError);
		}
	});

	it (`should throw an error when appVersion is not a number`, function ()
	{
		const badDummyInfo = { ...dummyInfo, appVersion: 'version number one' };

		expect (() => new PxSysServerInfo (badDummyInfo)).to.throw (AssertionError);
	});

	it (`when validating, should list out missing required fields`, function ()
	{
		const serverInfo   = new PxSysServerInfo (dummyInfo);
		const requiredInfo = ['appName', 'appVersion', 'pxSysVersion', 'loginKey'];
		const length       = requiredInfo.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let leaveOutField = requiredInfo[i];
			let testInfo      = {};

			for ( let j = 0;  j < length;  j++ )
			{
				let field = requiredInfo[j];

				if ( field === leaveOutField )
				{
					continue;
				}

				testInfo[field] = dummyInfo[field];
			}

			let errorList = serverInfo.validateInfo (testInfo).getErrors ();
			
			for ( let i = 0;  i < errorList.length - 1;  i += 2 )
			{
				let errorCode = errorList[i];
				let errorMsg  = errorList[i + 1];

				expect (errorCode).to.equal (serverInfo._errorCodes.get ('CL_MISSING_INFO'));
				expect (errorMsg).to.equal (`Missing required fields: \`${leaveOutField}\``);
			}
		}

		let testInfo  = { ...dummyInfo };

		delete testInfo.loginKey;
		delete testInfo.appVersion;

		let errorList = serverInfo.validateInfo (testInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_MISSING_INFO'));
		expect (errorList[1]).to.equal ('Missing required fields: `appVersion`, `loginKey`');
	});

	it (`should throw an error when the login key is not a string`, function ()
	{
		expect (() => new PxSysServerInfo ({ ...dummyInfo, loginKey: [] })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, loginKey: {} })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, loginKey: 555.1 })).to.throw (AssertionError);
	});

	it (`should throw an error when the admin key is not a string`, function ()
	{
		expect (() => new PxSysServerInfo ({ ...dummyInfo, adminKey: null })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, adminKey: function () {} })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, adminKey: undefined })).to.throw (AssertionError);
	});

	it (`should throw an error when the application name is not a string`, function ()
	{
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appName: TypeError })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appName: true })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appName: { 9: ['a', 'b'] } })).to.throw (AssertionError);
	});

	it (`should throw an error when the application version is not a number`, function ()
	{
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appVersion: NaN })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appVersion: [2] })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appVersion: '1' })).to.throw (AssertionError);
		expect (() => new PxSysServerInfo ({ ...dummyInfo, appVersion: '1.205' })).to.throw (AssertionError);

		expect (() => new PxSysServerInfo ({ ...dummyInfo, appVersion: 1.205 })).to.not.throw (AssertionError);
	});

	it (`should return an error when the application names don't match`, function ()
	{
		let serverInfo   = new PxSysServerInfo (dummyInfo);
		let badDummyInfo = { ...dummyInfo, appName: 'SomethingElse' };
		let errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (serverInfo._errorCodes.getName (errorList[0])).to.equal ('CS_APP_NAME_MM');
		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CS_APP_NAME_MM'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CS_APP_NAME_MM);
	});

	it (`should return an error when the client's login key is wrong`, function ()
	{
		let serverInfo   = new PxSysServerInfo (dummyInfo);
		let badDummyInfo = { ...dummyInfo, loginKey: 'bad password' };
		let errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_LOGIN'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_LOGIN);

		badDummyInfo.loginKey = [];

		errorList = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_LOGIN'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_LOGIN);

		serverInfo   = new PxSysServerInfo ({ ...dummyInfo, loginKey: '15' });
		badDummyInfo = { ...dummyInfo, loginKey: 15 };
		errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_LOGIN'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_LOGIN);
	});

	it (`should return an error when the client's admin key is wrong`, function ()
	{
		let serverInfo   = new PxSysServerInfo (dummyInfo);
		let badDummyInfo = { ...dummyInfo, adminKey: 'gggggggggggg' };
		let errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_ADMIN'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_ADMIN);

		badDummyInfo.adminKey = -.1;

		errorList = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_ADMIN'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_ADMIN);

		serverInfo   = new PxSysServerInfo ({ ...dummyInfo, adminKey: '-.02' });
		badDummyInfo = { ...dummyInfo, adminKey: -.02 };
		errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_ADMIN'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_ADMIN);
	});

	it (`should return an error when the client's PxSys version is not a number`, function ()
	{
		let serverInfo   = new PxSysServerInfo (dummyInfo);
		let badDummyInfo = { ...dummyInfo, pxSysVersion: 'gggggggggggg' };
		let errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_PX_VER'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_PX_VER);
	});

	it (`should return an error when the client's application version is not a number`, function ()
	{
		let serverInfo   = new PxSysServerInfo (dummyInfo);
		let badDummyInfo = { ...dummyInfo, appVersion: {} };
		let errorList    = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_APP_VER'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_APP_VER);

		badDummyInfo.appVersion = NaN;

		errorList = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CL_BAD_APP_VER'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CL_BAD_APP_VER);
	});

	it (`should return proper errors when there's a client/server PxSys version mismatch`, function ()
	{
		let serverInfo = new PxSysServerInfo (dummyInfo);
		let errorList  = serverInfo.validateInfo ({ ...dummyInfo, pxSysVersion: PXSYS_VERSION - 1 }).getErrors ();

		expect (serverInfo._errorCodes.getName (errorList[0])).to.equal ('CS_PX_VER_NEW');
		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CS_PX_VER_NEW'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CS_PX_VER_NEW);

		errorList = serverInfo.validateInfo ({ ...dummyInfo, pxSysVersion: PXSYS_VERSION + 1 }).getErrors ();

		expect (serverInfo._errorCodes.getName (errorList[0])).to.equal ('CS_PX_VER_OLD');
		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CS_PX_VER_OLD'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CS_PX_VER_OLD);
	});

	it (`should return proper errors when there's a client/server application version mismatch`, function ()
	{
		let serverInfo = new PxSysServerInfo (dummyInfo);
		let errorList  = serverInfo.validateInfo ({ ...dummyInfo, appVersion: dummyInfo.appVersion - 1 }).getErrors ();

		expect (serverInfo._errorCodes.getName (errorList[0])).to.equal ('CS_APP_VER_NEW');
		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CS_APP_VER_NEW'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CS_APP_VER_NEW);

		errorList = serverInfo.validateInfo ({ ...dummyInfo, appVersion: dummyInfo.appVersion + 1 }).getErrors ();

		expect (serverInfo._errorCodes.getName (errorList[0])).to.equal ('CS_APP_VER_OLD');
		expect (errorList[0]).to.equal (serverInfo._errorCodes.get ('CS_APP_VER_OLD'));
		expect (errorList[1]).to.equal (defaultErrorMessages.CS_APP_VER_OLD);
	});

	it (`should not require the client to input an admin key`, function ()
	{
		let serverInfo   = new PxSysServerInfo (dummyInfo);
		let badDummyInfo = { ...dummyInfo };

		delete badDummyInfo.adminKey;

		let errorList = serverInfo.validateInfo (badDummyInfo).getErrors ();

		expect (errorList.length).to.equal (0);
	});
});
