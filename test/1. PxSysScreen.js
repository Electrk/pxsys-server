const rfr = require ('rfr');

const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSysScreen = rfr ('classes/PxSysScreen.js');


describe ('PxSysScreen', function ()
{
	const width         = 161;
	const height        = 123;
	const defaultValues = { colorID: 0 };
	const screen        = new PxSysScreen ({ width, height, defaultValues });

	it (`should be ${width} pixels wide`, function ()
	{
		expect (screen.width).to.equal (width);
	});

	it (`should be ${height} pixels high`, function ()
	{
		expect (screen.height).to.equal (height);
	});

	it (`width should match videoMemory array length`, function ()
	{
		expect (screen.width).to.equal (screen._videoMemory.length);
	});

	it (`height should match videoMemory subarray length`, function ()
	{
		expect (screen.height).to.equal (screen._videoMemory[0].length);
	});

	it (`all pixel value colorIDs should be ${defaultValues.colorID}`, function ()
	{
		screen.forEach (function ( x, y, pixel )
		{
			expect (pixel.colorID).to.equal (defaultValues.colorID);
		});
	});

	const valuesToChange =
	[
		[2, 5, 'test', '8'],
		[30, 64, 'bob', -12.4321],
		[128, 56, '5555555556', '..............'],
		[89, 32, '/', 0x54],
	];

	it (`should properly set pixel values`, function ()
	{
		const length = valuesToChange.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let change = valuesToChange[i];
			let x      = change[0];
			let y      = change[1];
			let field  = change[2];
			let value  = change[3];

			screen.setPixel (x, y, field, value);

			expect (screen.getPixel (x, y)).to.have.own.property (field);
			expect (screen._videoMemory[x][y]).to.have.own.property (field);
			expect (screen.getPixel (x, y)[field]).to.equal (screen._videoMemory[x][y][field]);
			expect (screen.getPixel (x, y)[field]).to.equal (value);
			expect (screen._videoMemory[x][y][field]).to.equal (value);
		}
	});

	it (`should properly add changed values to changed array`, function ()
	{
		const changed = screen._changedPixels;
		const length  = changed.length;

		expect (valuesToChange.length).to.equal (length);

		for ( let i = 0;  i < length;  i++ )
		{
			let toChange = valuesToChange[i];
			let pixel    = changed[i];

			expect (pixel[0]).to.equal (toChange[0]);
			expect (pixel[1]).to.equal (toChange[1]);
			expect (pixel[2]).to.equal (toChange[2]);
			expect (pixel[3]).to.equal (toChange[3]);
		}
	});

	it (`should throw an error when you try to set a pixel with an invalid coordinate`, function ()
	{
		expect (() => screen.setPixel (width, height, 't', 'b')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, height, 't', 'b')).to.throw (AssertionError);
		expect (() => screen.setPixel (width, 0, 't', 'b')).to.throw (AssertionError);
		expect (() => screen.setPixel (-1, -1, 't', 'b')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, -1, 't', 'b')).to.throw (AssertionError);
		expect (() => screen.setPixel (-1, 0, 't', 'b')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, 't', 'b')).to.not.throw (AssertionError);
	});

	it (`should throw an error when you try to set a pixel with an invalid key`, function ()
	{
		expect (() => screen.setPixel (0, 0, 5, '...')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, -1213, '...')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, 0.0029, '...')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, [], '...')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, {}, '...')).to.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, 'aaaa', '...')).to.not.throw (AssertionError);
		expect (() => screen.setPixel (0, 0, 'colorID', 5)).to.not.throw (AssertionError);
	});
});
