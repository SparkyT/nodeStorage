function updateHeaderElements (theOutline) {
	
	return;
	
	var headers = opGetHeaders ();
	console.log ("updateHeaderElements: title == " + opGetTitle ());
	console.log ("updateHeaderElements: headers == " + jsonStringify (headers));
	var whenModified = formatDate (headers.dateModified, "%A, %B %e, %Y at %l:%M %p");
	
	var theTitle = trimWhitespace (headers.longTitle);
	if (theTitle.length == 0) {
		theTitle = trimWhitespace (opGetTitle ());
		}
	if (theTitle.length == 0) {
		theTitle = "&nbsp;";
		}
	
	$("#idTitle").html ("<a href=\"#\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + headers.description + "\">" + theTitle + "</a>");
	$("#idByLine").html ("<a href=\"" + headers.ownerId + "\" target=\"_blank\">" + headers.ownerName + "</a>; " + whenModified + ".");
	document.title = headers.longTitle; //6/25/16 by DW
	$('[data-toggle="tooltip"]').tooltip(); 
	}
function updateLockedIcon (theOutline) {
	
	return;
	
	var iconname = (appPrefs.flLocked) ? "lock" : "unlock";
	var waitingstyle = " style='color: green;'";
	var style = (flUpdateWaiting) ? waitingstyle : "";
	var tip = (appPrefs.flLocked) ? "Unlock to allow updates." : "Lock the outline while you're reading.";
	$("#idLockIcon").html ("<i class=\"fa fa-" + iconname + "\"" + style + "></i>");
	$("#idLinkToLockIcon").attr ("title", tip);
	}
function toggleLocked (theOutline) {
	
	return;
	
	appPrefs.flLocked = !appPrefs.flLocked;
	if ((!appPrefs.flLocked) && flUpdateWaiting) {
		receivedUpdate (lastOpmltext);
		flUpdateWaiting = false;
		}
	updateLockedIcon ();
	}

var instantOutlineData = {
	flInitialized: false,
	outlinesWeWatch: new Object ()
	};

function ioInitOutliner (idOutliner, opmltext) {
	var idSavedOutliner = idDefaultOutliner;
	idDefaultOutliner = idOutliner;
	opInitOutliner (opmltext, true);
	idDefaultOutliner = idSavedOutliner;
	}

function ioEverySecond () {
	function wsWatchForChange (theOutline, callback) {
		if (theOutline.socket === undefined) {
			theOutline.socket = new WebSocket (theOutline.socketserver); 
			theOutline.socket.onopen = function (evt) {
				var msg = "watch " + theOutline.urlOpmlFile;
				console.log ("wsWatchForChange sending this msg to the server: \"" + msg + "\"");
				theOutline.socket.send (msg);
				};
			theOutline.socket.onmessage = function (evt) {
				var s = evt.data;
				if (s !== undefined) { //no error
					var updatekey = "update\r";
					if (beginsWith (s, updatekey)) { //it's an update
						s = stringDelete (s, 1, updatekey.length);
						callback (s);
						}
					}
				};
			theOutline.socket.onclose = function (evt) {
				console.log ("theOutline.socket was closed.");
				theOutline.socket = undefined;
				};
			theOutline.socket.onerror = function (evt) {
				console.log ("theOutline.socket received an error");
				};
			}
		}
	function receivedUpdate (theOutline, opmltext) {
		if (theOutline.flLocked) {
			theOutline.lastOpmltext = opmltext;
			theOutline.flUpdateWaiting = true;
			updateLockedIcon (theOutline);
			}
		else {
			ioInitOutliner (theOutline.idOutliner, opmltext);
			updateHeaderElements (theOutline);
			}
		}
	
	for (var x in instantOutlineData.outlinesWeWatch) {
		var theOutline = instantOutlineData.outlinesWeWatch [x];
		wsWatchForChange (theOutline, function (opmltext) {
			console.log ("everySecond: websocket returned with opmltext.length == " + opmltext.length);
			receivedUpdate (theOutline, opmltext);
			});
		}
	
	}
function viewInstantOutline (urlGlueFile, idOutliner, callback) {
	readHttpFile (urlGlueFile + "?format=data", function (jsontext) {
		var jstruct = JSON.parse (jsontext);
		console.log ("outliner glue struct == " + jsonStringify (jstruct));
		readHttpFile (jstruct.url, function (opmltext) {
			ioInitOutliner (idOutliner, opmltext);
			
			instantOutlineData.outlinesWeWatch [jstruct.url] = { //it exists, but has no socket
				urlOpmlFile: jstruct.url,
				idOutliner: idOutliner,
				title: jstruct.title,
				description: jstruct.description,
				flLocked: false, //later this should probably be true -- 7/5/16 by DW
				socketserver: jstruct.socketserver
				};
			
			if (!instantOutlineData.flInitialized) {
				self.setInterval (ioEverySecond, 1000); 
				instantOutlineData.flInitialized = true;
				}
			
			if (callback !== undefined) {
				callback ();
				}
			});
		});
	}


