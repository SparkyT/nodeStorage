var flImageDialogSetUp = false;
var imageDialogCallback = undefined;
var imageDialogAlignValue;

document.write ("<link href=\"http://fargo.io/code/shared/imagedialog.css\" rel=\"stylesheet\" type=\"text/css\">");

function setupImageDialog (callback) {
	if (flImageDialogSetUp) {
		callback ();
		}
	else {
		readHttpFile ("http://fargo.io/code/shared/imagedialog.html?code=1", function (s) {
			$("body").prepend (s);
			flImageDialogSetUp = true;
			callback ();
			});
		}
	}
function horizAlignClick (val) {
	console.log ("horizAlignClick: val == " + val);
	imageDialogAlignValue = val;
	}
function imageDialogClose () {
	$("#idImageDialog").modal ("hide"); 
	}
function imageDialogOK () {
	var url = $("#idImageDialogUrl").val ();
	imageDialogClose ();
	if (imageDialogCallback !== undefined) {
		imageDialogCallback (url, imageDialogAlignValue);
		}
	}
function openImageDialog (prompt, urlDefault, alignDefault, callback) {
	setupImageDialog (function () {
		imageDialogCallback = callback;
		imageDialogAlignValue = alignDefault;
		
		$('#idHorizAlign' + alignDefault).prop ("checked", true);
		
		
		if (prompt !== undefined) {
			$("#idImageDialogPrompt").text (prompt);
			}
		if (urlDefault === undefined) {
			urlDefault = "";
			}
		$("#idImageDialogUrl").val (urlDefault);
		$("#idImageDialog").modal ("show"); 
		
		});
	}
