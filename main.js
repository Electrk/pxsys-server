const rfr = require ('rfr');
const has = require ('has');

const PxSys       = rfr ('classes/PxSys/PxSys.js');
const PxSysScreen = rfr ('classes/PxSysScreen.js');


module.exports =
{
	PxSys,
	PxSysScreen,

	createPxSys ( width, height, defaultValues = {} )
	{
		if ( !has (defaultValues, 'colorID') )
		{
			defaultValues.colorID = 0;
		}

		const screen = new PxSysScreen (width, height, defaultValues);
		return new PxSys (screen);
	},
};
