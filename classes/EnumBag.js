const rfr = require ('rfr');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { stringTypeAssert }   = rfr ('utility/typeAssert.js');


class EnumBag
{
	constructor ( ...names )
	{
		this._enums = new Map ();
		this._names = new Map ();
		this._index = 0;

		this.add (...names);
	}

	add ( ...names )
	{
		const length = names.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let name = names[i];

			stringTypeAssert (name, '', 'Command names must be strings!');

			this._names.set (this._index, name);
			this._enums.set (name, this._index++);
		}
	}

	has ( name )
	{
		return this._enums.has (name);
	}

	hasName ( index )
	{
		return this.names.has (index);
	}

	get ( name )
	{
		return this._enums.get (name);
	}

	getName ( index )
	{
		return this._names.get (index);
	}
}


module.exports = EnumBag;
