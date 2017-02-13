var urlImageSizeServer = "http://imagesize.1999.io/imgsize?url=";
function getImageSize (url, callback) {
	readHttpFile (urlImageSizeServer + encodeURIComponent (url), function (jsontext) {
		try {
			var jstruct = JSON.parse (jsontext);
			console.log ("getImageSize: jstruct == " + jsonStringify (jstruct));
			callback (jstruct);
			}
		catch (err) {
			callback (undefined);
			}
		});
	}
