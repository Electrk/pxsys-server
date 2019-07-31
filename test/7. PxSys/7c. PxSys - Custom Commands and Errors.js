const rfr = require ('rfr');

const { Socket }         = require ('net');
const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSys         = rfr ('classes/PxSys/PxSys.js');
const PxSysColorset = rfr ('classes/PxSysColorset.js');
const PxSysScreen   = rfr ('classes/PxSysScreen.js');

const { PXSYS_VERSION } = rfr ('miscellaneous/constants.js');


describe ('PxSys - Custom Commands and Errors', function ()
{
	const screen   = new PxSysScreen ({ width: 160, height: 120, defaultValues: { colorID: 0 } });
	const colorset = new PxSysColorset (64);
	const pxObject = new PxSys ({ screen, colorset });

	it (`should add custom commands properly`, function ()
	{
		const prevIndex   = pxObject._commandCodes._index;
		const commandCode = pxObject.addCommand ('CS_RANDOM_TEST');

		expect (commandCode).to.equal (prevIndex);
		expect (pxObject.getCommandString (commandCode)).to.equal ('CS_RANDOM_TEST');
	});

	it (`should add custom errors properly`, function ()
	{
		const prevIndex = pxObject._errorCodes._index;
		const errorCode = pxObject.addError ('CS_RANDOM_ERROR');

		expect (errorCode).to.equal (prevIndex);
		expect (pxObject.getErrorString (errorCode)).to.equal ('CS_RANDOM_ERROR');
	});
});
