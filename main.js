const rfr = require ('rfr');
const has = require ('has-own-property-x');

const PxSys         = rfr ('classes/PxSys/PxSys.js');
const PxSysColorset = rfr ('classes/PxSysColorset.js');
const PxSysScreen   = rfr ('classes/PxSysScreen.js');


module.exports =
{
	PxSys,

	createPxSys ( screenWidth, screenHeight, defaultValues = {}, maxColors )
	{
		if ( !has (defaultValues, 'colorID') )
		{
			defaultValues.colorID = 0;
		}

		const screen   = new PxSysScreen ({ width: screenWidth, height: screenHeight, defaultValues });
		const colorset = new PxSysColorset (maxColors);
		const pxObject = new PxSys ({ screen, colorset });

		return pxObject;
	},
};
