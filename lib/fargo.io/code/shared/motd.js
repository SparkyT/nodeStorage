
var myMessageOfTheDay;

document.write ("<link rel=\"stylesheet\" href=\"http://fargo.io/code/shared/motd.css\" type=\"text/css\">");

MessageOfTheDay = function (urlTextFile, nameMsgIcon) {
	this.urlTextFile = urlTextFile;
	if (this.lastMessageText === undefined) {
		this.lastMessageText = "";
		}
	if (this.nameMsgIcon === undefined) { //7/15/16 by DW
		if (nameMsgIcon !== undefined) { //the param was specified
			this.nameMsgIcon = nameMsgIcon;
			}
		else {
			this.nameMsgIcon = "fa-star";
			}
		$("#idMotdIcon").addClass (this.nameMsgIcon);
		}
	this.messageArrived = function (s) {
		console.log ("this.messageArrived: s == " + s);
		$("#idMessageOfTheDayText").html (s);
		$("#idMotdIcon").addClass ("iMsgWaiting");
		
		$("#idMotdIcon").addClass (this.nameMsgIcon);
		$("#idMotdIcon").removeClass (this.nameMsgIcon + "-o");
		
		
		}
	this.click = function () {
		$("#idMotdIcon").removeClass ("iMsgWaiting");
		
		$("#idMotdIcon").addClass (this.nameMsgIcon + "-o");
		$("#idMotdIcon").removeClass (this.nameMsgIcon);
		
		
		}
	this.checkForUpdate = function () {
		var motd = this;
		readHttpFile (this.urlTextFile, function (s) {
			if (s !== undefined) {
				if (s !== motd.lastMessageText) {
					motd.lastMessageText = s;
					motd.messageArrived (s);
					}
				}
			});
		}
	this.checkForUpdate ();
	};
function motdClick () {
	myMessageOfTheDay.click ();
	}
