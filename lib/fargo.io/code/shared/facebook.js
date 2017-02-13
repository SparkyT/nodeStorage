var facebookUserId, facebookAccessToken, flFacebookConnected = false, facebookUserInfo;
var facebookicon = "<i class=\"fa fa-facebook iAppIcon\" style=\"color: #4C66A4; font-weight: bold;\"></i>";

var urlFacebookCode = "//connect.facebook.net/en_UK/all.js"; 
var urlFacebookCode = "//connect.facebook.net/en_US/sdk.js";



var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		return ab;
	},
	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));		 
		var bytes = (input.length/4) * 3;
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
		return uarray;	
	}
	}
if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
	XMLHttpRequest.prototype.sendAsBinary = function(string) {
		var bytes = Array.prototype.map.call(string, function(c) {
			return c.charCodeAt(0) & 0xff;
		});
		this.send(new Uint8Array(bytes).buffer);
		};
	}
function PostImageToFacebook (authToken, filename, mimeType, imageData, message, callback) {
	// this is the multipart/form-data boundary we'll use
	var boundary = '----ThisIsTheBoundary1234567890';
	
	// let's encode our image file, which is contained in the var
	var formData = '--' + boundary + '\r\n'
	formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
	formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
	for ( var i = 0; i < imageData.length; ++i ) {
		formData += String.fromCharCode( imageData[ i ] & 0xff );
		}
	formData += '\r\n';
	formData += '--' + boundary + '\r\n';
	formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
	formData += message + '\r\n'
	formData += '--' + boundary + '--\r\n';
	
	var xhr = new XMLHttpRequest();
	xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
	xhr.onload = xhr.onerror = function() {
		console.log( xhr.responseText );
		
		//hook backto the client -- 7/5/14 by DW
			var jstruct = JSON.parse (xhr.responseText);
			if (jstruct.id != undefined) {
				fbGetPostInfo (jstruct.id, function (dataAboutPost) {
					callback (jstruct.post_id,  dataAboutPost);
					});
				}
			else {
				callback ("", jstruct); //so client can do error reporting
				}
		
		};
	xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
	xhr.sendAsBinary( formData );
	}
function fbGetUserInfo () { //sets global, facebookUserInfo
	FB.api ('/me', function (response) {
		console.log ("fbGetUserInfo: " + JSON.stringify (response, undefined, 4));
		facebookUserInfo = response; //id, first_name, last_name, gender, link, locale, name, timezone, updated_time, verified
		});
	}
function fbGetLoginStatus () {
	FB.getLoginStatus (function (response) {
		console.log ("fbGetLoginStatus: response.status == " + response.status);
		
		if (response.status == "connected") {
			facebookUserId = response.authResponse.userID;
			facebookAccessToken = response.authResponse.accessToken;
			console.log ("fbGetLoginStatus: facebookUserId == " + facebookUserId + ", facebookAccessToken == " + facebookAccessToken);
			flFacebookConnected = true;
			fbGetUserInfo (); 
			return (true); //we're logged in
			}
		else {
			return (false); //not logged in
			}
		
		
		
		});
	}
function fbIsFacebookConnected () {
	return (flFacebookConnected);
	}
function fbLogin () {
	var options = {
		scope: 'publish_actions', 
		return_scopes: true
		};
	FB.login (function (response) {
		if (response.authResponse) {
			console.log('Welcome!  Fetching your information.... ');
			flFacebookConnected = true;
			fbGetLoginStatus (); //set accessToken so we can make requests
			}
		else {
			console.log ('User cancelled login or did not fully authorize.');
			}
		}, options);
	}
function fbLogout () {
	FB.logout(function(response) {
		console.log (JSON.stringify (response, undefined, 4));
		flFacebookConnected = false;
		});
	}
function fbPostLink (theMessage, theLink, callback) { //8/30/14 by DW
	FB.api ("/me/feed", "post", {message: theMessage, link: theLink}, function (response) {
		if (!response || response.error) {
			console.log ("fbPostLink: error == " + jsonStringify (response));
			if (callback != undefined) {
				callback (""); //indicate there was an error -- 9/1/14 by DW
				}
			}
		else {
			if (callback != undefined) {
				console.log ("fbPostLink: response == " + jsonStringify (response));
				var idResponse = response.id; //2/3/17 by DW
				fbGetPostInfo (response.id, function (dataAboutPost) {
					console.log ("fbPostLink: dataAboutPost == " + jsonStringify (dataAboutPost));
					callback (idResponse, dataAboutPost);
					});
				}
			}
		});
	}
function fbUpdatePost (idPost, thePostText, callback) {
	FB.api (idPost, "post", {message: thePostText}, function (response) {
		console.log ("fbUpdatePost: response == " + JSON.stringify (response, undefined, 4));
		if (callback != undefined) {
			callback ();
			}
		flEraseStatusMessage = true;
		});
	}
function fbGetPostInfo (idpost, callback) {
	FB.api ("/" + idpost, function (response) {
		if (response && !response.error) {
			callback (response);
			}
		else {
			console.log ("fbGetPostInfo: idpost == " + idpost + ", error == " + jsonStringify (response));
			}
		});
	}
function fbToggleConnectCommand () {
	if (flFacebookConnected) {
		confirmDialog ("Sign off Facebook?", function () {
			fbLogout ();
			});
		}
	else {
		fbLogin ();
		}
	}
function fbUpdateFacebookMenuItem (iditem) {
	document.getElementById (iditem).innerHTML = (flFacebookConnected) ? "Sign off Facebook..." : "Sign on Facebook...";
	}
function fbUpdateFacebookUsername (iditem) {
	var name = "";
	if (facebookUserInfo != undefined) {
		name = facebookUserInfo.name;
		}
	document.getElementById (iditem).innerHTML = (fbIsFacebookConnected ()) ? name : "Sign on here";
	}
function fbConnectToFacebook () {
	fbLogin ();
	}
function fbStartup (callback) { 
	function fbGetAppId () {
		var id;
		if (appConsts.facebookAppId != undefined) {
			id = appConsts.facebookAppId;
			}
		else {
			if (appPrefs.facebookAppId != undefined) {
				id = appPrefs.facebookAppId;
				}
			else {
				id = "673002436104521";
				}
			}
		return (id);
		}
	$.ajaxSetup ({cache: true});
	$.getScript (urlFacebookCode, function () {
		FB.init ({
			appId: fbGetAppId (),
			
			
			xfbml: true, //2/3/17 by DW
			version: "v2.8" //2/3/17 by DW
			
			
			});  
		if (!fbGetLoginStatus ()) { //not logged in
			fbLogin ();
			}
		if (callback != undefined) { //9/6/14 by DW
			callback ();
			}
		});
	}
