# PxSys Server
> Server-side rendering for Blockland.

Lets you create a screen of any size and send pixel data over to clients via TCP.  Mostly used to create dynamic screens out of bricks, since JavaScript is *exponentially* faster than TorqueScript.

It's also optimized to only send over the values that were changed.


## Usage

Here is a bare-bones server setup example:

```js
const { createPxSys } = require ('PxSys');

// Create a PxSys object with a screen width of 320 and a height of 240
const pxObject = createPxSys (320, 240);
// Start a PxSysServer listening on 127.0.0.1:23
pxObject.createServer (23, '127.0.0.1');

// Handle a new socket connection
pxObject.onServer ('connection', socket =>
{
	// Send the screen's width and height to the socket
	pxObject.sendScreenData (socket);
	// Send all current pixel data to the socket
	pxObject.sendPixelData (socket);
});
```

Each pixel contains various key-value pairs that store data for various fields, like `colorID`, `printID`, `colorPrintID` (more on this in [Additional Information](#additional-information)), etc.  By default they only have a `colorID` field that's `0` by default.

To set a specific field for a specific pixel, use `pxObject.setScreenPixel (x, y, key, value);`

When you're done, call `pxObject.sendChangedPixels ();` to send only the pixels and only the fields in those pixels that were changed.

If you want to send all pixel data regardless of whether they were changed or not, use `pxObject.sendPixelData ();`


## API


#### `createPxSys (width, height[, defaultValues]);`

Creates a `PxSys` instance with an internal `PxSysScreen` instance attached to it.

| Argument     | Description |
| ----------- | ----------- |
| width       | The width of the internal `PxSysScreen` object.  |
| height      | The height of the internal `PxSysScreen` object. |
| defaultValues | An object containing the default values for pixels for the internal `PxSysScreen` object.  Default is `{ colorID: 0 }` |


#### `PxSys::createServer (port, address[, callbacks]);`

Starts up an internal `PxSysServer` instance for handling connections.

| Argument     | Description |
| ----------- | ----------- |
| port       | The port to listen to. |
| address      | The address to listen to. |
| callbacks | An object containing callbacks for the server.  Supported callbacks are `onStart` and `onEnd` |


#### `PxSys::destroyServer ([callback]);`

Destroys the internal server with an optional callback for when it's done.


#### `PxSys::onServer (event, callback);`

Adds a callback to the internal TCP server.  Uses the default `net` server so it supports all callbacks for that.


#### `PxSys::offServer (event, callback);`

Removes a callback from the internal TCP server.


#### `PxSys::sendCommand (socket, command[, ...args]);`

Send a command to a specific client with whatever arguments.


#### `PxSys::sendError (socket, errorCommand, errorCode[, errorMessage, data]);`

Send an error to a specific client with an optional error message and whatever additional data.


#### `PxSys::sendCommandToAll (command[, ...args]);`

Send a command to all clients with whatever arguments.


#### `PxSys::sendErrorToAll (errorCommand, errorCode[, errorMessage, data]);`

Send an error to all clients with an optional error message and whatever additional data.


#### `PxSys::sendScreenData ([socket]);`

Send screen width and height (`SV_SCREEN_SIZE`) to a specific client, or to all of them if `socket` is not specified.


#### `PxSys::setScreenPixel (x, y, key, value);`

Sets a  pixel field value for the internal `PxSysScreen` instance.

| Argument     | Description |
| ----------- | ----------- |
| x       | The x position of the pixel data. |
| y      | The y position of the pixel data. |
| key | Each pixel contains an object with various key-value pairs.  This specifies which field we're setting/modifying. |
| value | Each pixel contains an object with various key-value pairs.  This specifies what value we're setting the field to. |


#### `PxSys::sendChangedPixels ([socket]);`

Sends only the pixel fields that were changed (`SV_PIXEL_DATA`), either to a specific client, or to all clients if `socket` is not specified.


#### `PxSys::sendPixelData ([socket]);`

Sends all pixel fields regardless of whether they were changed or not (`SV_PIXEL_DATA`), either to a specific client, or to all clients if `socket` is not specified.

#### `PxSys::delete ([onServerClose]);`

"Deletes" the `PxSys` object by "deleting" all internal instances, shutting down the TCP server, and dereferencing all properties.  Optional `onServerClose` callback for when the internal TCP server is shut down.


## Commands and Errors

This package uses some internal commands already using a simple format: `SV_SCREEN_DATA` and `SV_PIXEL_DATA`.

There are three prefixes:
* `SV` - This is a command specifically to be sent from the server to the client.
* `CL` - This is a command specifically to be sent from the client to the server.
* `CS` - This is a command that can be sent by both.

Error codes share the same format.

You can send your own commands using the `PxSys::sendCommand` method (see [API](#api)).  Obviously they don't *have* to use this format, just like you don't *have* to recycle or tip your waiter or thank your bus driver... it's just a good idea to do it.


## Additional Information

This package is best used in junction with [Server_PxSys](https://github.com/Electrk/Server_PxSys).  You can of course use your own client though.

You may have noticed I mentioned the `colorPrintID` field.  This is a special field for setting a brick's print to a PxSys color.  This allows for much sharper pixel changes since changing a brick's print doesn't fade like changing its color does.  [Here is the default pack](https://github.com/Electrk/Print_PxSys_Default) of colors.


<sup>does anybody want a pizza roll??? leave a comment at this webzone if you want me to mail you a pizza roll</sup>
