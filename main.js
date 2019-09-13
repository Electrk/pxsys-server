const path = require ('path');
const rfr  = require ('rfr');
const has  = require ('has');

rfr.setRoot (path.resolve (__dirname, './'));

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

		return new PxSys (new PxSysScreen (width, height, defaultValues));
	},
};
