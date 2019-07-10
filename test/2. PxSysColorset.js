const rfr = require ('rfr');

const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSysColorset = rfr ('classes/PxSysColorset.js');


describe ('PxSysColorset', function ()
{
	const maxColors = 64;
	const colorset  = new PxSysColorset (maxColors);

	it (`color array length should match maxColors (${maxColors})`, function ()
	{
		expect (colorset._colors.length).to.equal (maxColors);
	});

	const colorsToChange =
	[
		[0, '255 128 123 255'],
		[56, '255 255 255 128'],
		[23, '6 3 12 0'],
		[7, '1 1 1 255'],
		[1, '5 5 5 255'],
	];

	it (`should set colors properly`, function ()
	{
		const length = colorsToChange.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let change   = colorsToChange[i];
			let colorID  = change[0];
			let colorStr = change[1];

			colorset.setColor (colorID, colorStr);
			expect (colorset.getColor (colorID)).to.equal (colorStr);
		}
	});

	it (`should get the correct color ID from the color string`, function ()
	{
		const length = colorsToChange.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let change   = colorsToChange[i];
			let colorID  = change[0];
			let colorStr = change[1];

			expect (colorset.getColorID (colorStr)).to.equal (colorID);
		}
	});

	it (`should properly convert a color object to a string`, function ()
	{
		const length = colorsToChange.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let change   = colorsToChange[i];
			let colorID  = change[0];
			let colorStr = change[1];

			expect (colorset.getColorString (colorID)).to.equal (colorStr);
		}
	});

	it (`should throw an error when you try to set an invalid color ID`, function ()
	{
		expect (() => colorset.setColor (maxColors, '1 1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor (-1, '1 1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor ('asdasd', '1 1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor (0.0000523, '1 1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor ([], '1 1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor ({}, '1 1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, '1 1 1 1')).to.not.throw (AssertionError);
		expect (() => colorset.setColor (6, '1 1 1 1')).to.not.throw (AssertionError);
		expect (() => colorset.setColor (maxColors - 1, '1 1 1 1')).to.not.throw (AssertionError);
	});

	it (`should throw an error when you try to set an invalid color`, function ()
	{
		expect (() => colorset.setColor (0, '1 1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, '1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, '1')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, '')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, null)).to.throw (AssertionError);
		expect (() => colorset.setColor (0, undefined)).to.throw (AssertionError);
		expect (() => colorset.setColor (0, 324234)).to.throw (AssertionError);
		expect (() => colorset.setColor (0, [])).to.throw (AssertionError);
		expect (() => colorset.setColor (0, 'a a a a')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, 'b g m s a')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, '1  1 1')).to.throw (AssertionError);
		expect (() => colorset.setColor (0, '0.5 0.01 .2 1.0')).to.not.throw (AssertionError);
	});
});
