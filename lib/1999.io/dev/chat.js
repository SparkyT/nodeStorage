var appConsts = {
	productname: "1999",
	productnameForDisplay: "1999",
	"description": "Blogging like it's 1999.",
	urlTwitterServer: "http://node2.1999.io/", 
	urlPageTemplate: "http://1999.io/code/publish/template.html", //can be overridden in config.json
	urlChatLogSocket: "ws://node2.1999.io:5358/", //3/20/16 by DW
	domain: "1999.io", 
	chatConfig: {
		flPopupMenu: true,
		flLikes: true,
		flEyeIcon: true,
		flWatchForNewItems: true,
		flShowReplies: true,
		flRepliesArray: true,
		flShowAuthorName: true, //12/27/15 by DW
		flShowAuthorTwitterName: true, //12/27/15 by DW
		maxTitleDisplayLength: 30, //12/27/15 by DW
		flMessageIcon: true //12/28/15 by DW
		},
	nameChatLog: "braintrust",
	facebookAppId: "1720585981555833",
	urlMyMessageOfTheDay: "http://1999.io/misc/motd.txt",
	urlHomePageIntroText: undefined,
	version: "0.92a"
	}
var appPrefs = {
	ctStartups: 0, flAutoSave: true, minSecsBetwAutoSaves: 2,
	textFont: "Ubuntu", textFontSize: 22, textLineHeight: 30,
	outlineFont: "Ubuntu", outlineFontSize: 16, outlineLineHeight: 24,
	savedTextArea: "", flSavedOpml: false,
	flChirpOnNewMessage: true,
	flUseMarkdown: false,
	lastTweetUrl: "https://twitter.com/davewiner/status/641643858514837504",
	opmlBookmarks: undefined,
	repliesArray: new Array (),
	lastPostTitle: "My new blog post",
	nameChatLog: "", //3/14/16 by DW -- changed from appConsts.nameChatLog
	hiddenMessages: new Object (),
	urlGlossaryOpml: undefined,
	copyright: "",
	authorName: undefined, //11/6/16 by DW
	authorFacebookAccount: "",
	authorGithubAccount: "",
	authorLinkedInAccount: "",
	urlRssFeed: undefined,
	lastPodcastUrl: "",
	flAutoPublish: true, //3/17/16 by DW
	urlChatLogHome: undefined, //4/11/16 by DW
	flPublishToFacebook: false, //4/26/16 by DW
	flEditorsMenu: false, //4/29/16 by DW
	flPlugInsMenu: false, //5/16/16 by DW
	lastImageUrl: "", //6/10/16 by DW
	lastImageAlign: "right", //6/10/16 by DW
	flBetterStoryUrls: true, //7/26/16 by DW
	flDisqusComments: false, //8/28/16 by DW
	disqusGroup: "1999io", //8/28/16 by DW
	defaultImageForMeta: undefined, //9/11/16 by DW
	flShowMenubarInStoryPage: true //1/13/17 by DW
	};


//global data
	var userDataCache = {};
	var whenLastUserAction = new Date ();
	var urlClarus = "http://static.scripting.com/larryKing/images/2012/10/16/clarus.gif";
	var urlEmojiImages = "http://fargo.io/code/emojify/images/emoji/";
	var randomMysteryString;
	
	var myChatlogCopy = [], maxChatLog = 250; //9/9/15 by DW
	var glossary = {
		};
	var flEditingItem = false, idItemBeingEdited;
	var idMsgReplyingTo;
	var flAddedTextarea = false, flAddedSubmitButton = false, textForInPlaceEditor; //9/17/15 by DW
	var flReplying = false, idItemBeingRepliedTo; //9/17/15 by DW
	var flUpdatePending = false;
	var flEnableBackgroundTasks = true;
	var initialBookmarksOpml = 
		"<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><opml version=\"2.0\"><head><title>Bookmarks</title></head><body><outline text=\"\"/></body></opml>";
	var idDefaultOutliner; //outlinedialog.js needs this
	var popupSerialNumber = 0; //each popup must have its own id
	var opmlSerialNumber = 0; //each opml object must have its own id
	var idHoistedPost = undefined, nameChatlogHoistedPost = undefined, idHoistDisplay = "idWhereToShowHoistedItem"; 
	var typeCurrentPost = undefined, flSubmitButtonVisible = false, titleCurrentPost, flReturnPostsMessage = false;
	var maxRepliesMenu = 50;
	var slideDownSpeed = 0; //any other value is very slow for some weird reason -- 9/26/15 by DW
	var flReturnPostsReply = true; //set this false if you want multi-line replies -- 9/27/15 by DW
	var flScheduledEveryMinute = false;
	var flUsingOutliner = false;
	var whichEditor = "wizzy", urlEditorPlugin; //9/30/15 by DW
	var myMainEditor, myInPlaceEditor; //9/30/15 by DW
	var flShowEditorIfNotLoggedIn = false; //10/3/15 by DW -- if true, this gets you read-only mode (set to false, 3/15/16 by DW)
	var flStartupFail = false;
	var myChatlogMetadata; //10/23/15 by DW
	var flClickOutsideCancelsEdit = false; //if true, when you click outside the inline editor box, the edit is cancelled --10/23/15 by DW
	var myChatlogList, myChatlogIndex; //10/29/15 by DW
	var urlMessageViewerApp = "http://1999.io/publish/viewmessage.html"; //10/30/15 by DW
	var whenLastAutoSave = new Date (); //11/9/15 by DW
	var flUseLongPolling = false; //11/12/15 by DW
	var nameCurrentChatLog = undefined; //11/19/15 by DW
	var flPrefsChanged = false; //11/20/15 by DW
	var whenStartup = new Date (); //11/28/15 by DW
	var maxImageWidth = 400, maxImageHeight = 800; //12/2/15 by DW -- for postPicture
	var maxInitialChatLogElements = 10;  //12/31/15 by DW
	var whenLastMoreButtonClick = whenStartup; //12/31/15 by DW
	var flLoadedFromLocalMachine = false; //2/16/16 by DW
	var idMockupMessage = "mockup-message"; //2/26/16 by DW
	var itemForMockup = { //2/26/16 by DW
		"name": "davewiner",
		"text": 
			"<p>I was chatting with a friend today about the best emails I've ever received.&nbsp;</p><p>Like the reply <a href=\"http://scripting.com/davenet/1994/10/27/replyfrombillgates.html\">from Bill Gates</a> to a 1994 DaveNet piece. That was a good email, because it proved that the then-nascent art of blogging could be two-way. Gates was at the pinnacle of power in the tech industry at the time, as the web moved into the desktop. He was at the start of one of the biggest pivots in history, and this exchange was totally on-topic with that. (And some of the questions he asked have since been answered, for example, yes the web meant the end of <a href=\"https://en.wikipedia.org/wiki/Encarta\">Encarta</a>.)&nbsp;</p><p>Then I thought of an email I got from <a href=\"http://scripting.com/98/04/stories/bobAtkinsonOnHttpPost.html\">Bob Atkinson</a>, also of Microsoft, in the winter of 1998. I had just written a <a href=\"http://scripting.com/davenet/1998/02/27/rpcOverHttpViaXml.html\">piece</a> about how to do networking protocols using the web. It had occurred to me in what I call a <a href=\"http://scripting.com/davenet/2000/08/26/mindBombsForY2k.html\">mind bomb</a>, a flash of insight, that XML-over-HTTP could replace the deeply complicated and history-laden networking protocols of the Mac and PC, which were totally incompatible with each other. Using the web for program-to-program communication would turn out to be a breakthrough in simplicity and today whole industries are based on the idea.</p><p>Anyway, I don't have a copy of Bob's email but it went something like this.</p><blockquote>\"We want to do this too. Would you like to work with us?\"</blockquote><p>The next week I was in Redmond in a big room with a bunch of Microsoft people, designing what would turn out to be <a href=\"http://xmlrpc.scripting.com/spec.html\">XML-RPC</a>.&nbsp;</p>",
		"id": 1042,
		"when": "2016-02-20T17:04:18.557Z",
		"payload": {
			"editor": "wizzy",
			"urlRendering": "http://scripting.com/liveblog/users/davewiner/2016/02/20/1042.html",
			"title": "Greatest emails of all time",
			"image": "http://scripting.com/2016/02/20/elephant.png",
			"enclosure": {
				"url": "http://scripting.com/2015/09/30/daveCast2015Sep30.m4a",
				"type": "audio/mpeg",
				"length": "10323607"
				},
			"flPublished": true
			},
		"urlJson": "http://scripting.com/liveblog/2016/02/20/01042.json",
		"subs": [
			{
				"name": "LawyerBoyer",
				"text": "<p>How much would you be willing to pay for this contract?</p>",
				"id": 1045,
				"when": "2016-05-25T16:06:18.973Z",
				"payload": {
					"editor": "wizzy",
					"idInReplyTo": 6
					},
				"subs": [
					{
						"name": "bullmancuso",
						"text": "<p>I don't have very much money!</p>",
						"id": 1049,
						"when": "2016-05-25T16:06:28.837Z",
						"payload": {
							"editor": "wizzy",
							"idInReplyTo": 25
							}
						},
					{
						"name": "LawyerBoyer",
						"text": "<p>So you don't want to pay anything?</p>",
						"id": 1050,
						"when": "2016-05-25T16:06:43.972Z",
						"payload": {
							"editor": "wizzy",
							"idInReplyTo": 25
							}
						}
					]
				}
			],
		"whenLastUpdate": "2016-02-21T02:06:44.972Z",
		"ctUpdates": 21,
		"likes": {
			"LawyerBoyer": {
				"when": "2016-02-21T02:06:44.971Z"
				}
			}
		};
	var urlRssFeed; //3/1/16 by DW
	var urlHomePage; //3/3/16 by DW
	var facebookicon = "<i class=\"fa fa-facebook iAppIcon\" style=\"color: #4C66A4; font-weight: bold;\"></i>"; //4/26/16 by DW
	var savedSelectionInPlaceEditor; //5/2/16 by DW
	var footerDateFormat = "%a, %b %e, %Y at %l:%M %p"; //5/24/16 by DW
	var instantOutlineSerialNumber = 0; //7/4/16 by DW

//shell -- routines and data that configure the chatlog code -- 2/18/16 by DW
	var chatLogShell = { 
		createLinkCallback: function (url, linktext, title, flNewTab) {
			var titleAtt = "", targetAtt = "";
			if (title !== undefined) {
				titleAtt = " title=\"" + title + "\"";
				}
			if (flNewTab === undefined) { //4/22/16 by DW
				flNewTab = true;
				}
			if (flNewTab) {
				targetAtt = " target=\"_blank\" ";
				}
			url = replaceAll (url, "/friends.farm/users/davewiner/", "/scripting.com/"); //super egregious hack -- 4/12/16 by DW
			return ("<a href=\"" + url + "\"" + titleAtt + targetAtt + ">" + linktext + "</a>");
			},
		backupTextfileCallback: function (fname, opmltext) {
			},
		openUrlCallback: function (url) {
			window.open (url);
			}
		};
	function createChatLogLink (url, linktext, title) { 
		return (chatLogShell.createLinkCallback (url, linktext, title));
		}
//basic functions
	function findChatMessage (id, callback) { //9/15/15 by DW
		var stack = [];
		if (id == idMockupMessage) { //2/26/16 by DW
			callback (itemForMockup, stack);
			}
		else {
			function findInSubs (theArray) {
				for (var i = 0; i < theArray.length; i++) {
					var item = theArray [i];
					stack.push (item);
					if (item.id == id) {
						callback (item, stack);
						return (true);
						}
					else {
						if (item.subs !== undefined) {
							if (findInSubs (item.subs, false)) {
								return (true);
								}
							}
						}
					stack.pop ();
					}
				return (false);
				}
			if (!findInSubs (myChatlogCopy)) {
				callback (undefined);
				}
			}
		}
	function findOrGetChatMessage (idMessage, callback) { //1/2/16 by DW
		findChatMessage (idMessage, function (item) {
			if (item !== undefined) { //found it locally
				callback (item);
				}
			else {
				twGetChatMessage (idMessage, getCurrentChatLog (), function (item) {
					callback (item);
					});
				}
			});
		}
	function findPrevNextMessage (id, callback) {
		function isNotDeleted (ix) {
			var item = myChatlogIndex [ix].flDeleted;
			return (!getBoolean (item));
			}
		function findPrev (ix) {
			for (var i = ix - 1; i >= 0; i--) {
				if (isNotDeleted (i)) {
					return (i);
					}
				}
			return (undefined);
			}
		function findNext (ix) {
			for (var i = ix + 1; i < myChatlogIndex.length; i++) {
				if (isNotDeleted (i)) {
					return (i);
					}
				}
			return (undefined);
			}
		if (id != idMockupMessage) { //2/26/16 by DW
			for (var i = 0; i < myChatlogIndex.length; i++) {
				var item = myChatlogIndex [i];
				if (item.id == id) {
					var prev = undefined, next = undefined;
					if (i > 0) {
						var ixprev = findPrev (i);
						if (ixprev !== undefined) {
							prev = myChatlogIndex [ixprev];
							}
						}
					if (i < (myChatlogIndex.length - 1)) {
						var ixnext = findNext (i);
						if (ixnext !== undefined) {
							next = myChatlogIndex [ixnext];
							}
						}
					callback (prev, next);
					return;
					}
				}
			}
		callback (undefined, undefined); //not found
		}
	function getMonthChatMessages (theMonth, callback) {
		if (theMonth === undefined) {
			theMonth = new Date ();
			}
		twGetMonthChatMessages (theMonth, getCurrentChatLog (), function (err, itemsArray) {
			console.log ("getMonthChatMessages: itemsArray == " + jsonStringify (itemsArray));
			});
		}
	function chatItemInIndex (id) { //1/9/16 by DW -- return true if item with indicated ID is in the index
		for (var i = 0; i < myChatlogIndex.length; i++) {
			var item = myChatlogIndex [i];
			if (item.id == id) {
				return (true);
				}
			}
		return (false);
		}
	function userCanPost () {
		if (myChatlogList !== undefined) {
			var users = myChatlogList [getCurrentChatLog ()].usersWhoCanPost, myname = stringLower (twGetScreenName ());
			for (var i = 0; i < users.length; i++) {
				if (stringLower (users [i]) == myname) {
					return (true);
					}
				}
			}
		return (false);
		}
	function userCanReply () {
		if (userCanPost ()) {
			return (true);
			}
		if (myChatlogList !== undefined) {
			if (myChatlogList [getCurrentChatLog ()].flAnyoneCanReply) {
				return (true);
				}
			}
		return (false);
		}
	function updatesEnabled () {
		if (flEditingItem || flReplying) {
			flUpdatePending = true;
			return (false);
			}
		flUpdatePending = false;
		return (true);
		}
	function addNewChatItem (item, flChirp) { //11/26/15 by DW
		if (myChatlogCopy.length >= maxChatLog) {
			myChatlogCopy.splice (0, 1); //remove first item
			}
		myChatlogCopy [myChatlogCopy.length] = item;
		if (updatesEnabled ()) {
			viewChatLog ();
			}
		if (flChirp) {
			speakerBeep ();
			}
		}
	function updateEditedItem (item) { //11/26/15 by DW
		for (var i = 0; i < myChatlogCopy.length; i++) {
			if (myChatlogCopy [i].id == item.id) {
				myChatlogCopy [i] = item;
				if (updatesEnabled ()) {
					updateOneItem (item.id);
					}
				return (true);
				}
			}
		return (false); //didn't update anything
		}
	function itemIsHidden (item) { //11/30/15 by DW
		if (item.payload !== undefined) {
			return (getBoolean (item.payload.flHidden));
			}
		return (false);
		}
	function itemIsDeleted (item) { //5/3/16 AM by DW
		if (item.payload !== undefined) {
			return (getBoolean (item.payload.flDeleted));
			}
		return (false);
		}
	function deleteMessage (idMessage) { //5/3/16 AM by DW
		findPrevNextMessage (idMessage, function (prev, next) {
			findChatMessage (idMessage, function (item) {
				item.payload.flDeleted = true;
				twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog (), function (err, data) {
					if (err) {
						console.log ("deleteMessage: err == " + jsonStringify (err));
						}
					else {
						console.log ("deleteMessage: data == " + jsonStringify (data));
						getCurrentChatLogIndex (function () { //5/19/16 by DW
							viewChatLog ();
							publishMessage (prev.id, function () {
								publishMessage (next.id, function () {
									publishHomePage (function () { 
										publishThisMonthsArchivePage (); //5/30/16 by DW
										});
									});
								});
							});
						}
					});
				});
			});
		}
	function hackMessage () { //11/11/15 by DW
		
		findChatMessage (1136, function (item) { //3/22/16 by DW
			twEditChatMessage ("xxx", item.payload, 1136, "scripting", function (err, data) {
				if (err) {
					console.log ("hackMessage: err == " + jsonStringify (err));
					}
				else {
					console.log ("hackMessage: data == " + jsonStringify (data));
					}
				});
			});
		
		}
	function blockMessage () { //12/2/15 by DW
		var defaultId = "";
		if (appPrefs.lastBlockedId !== undefined) {
			defaultId = appPrefs.lastBlockedId;
			}
		askDialog ("Enter ID of the message you want to block:", defaultId, "Enter the ID of the message here.", function (id, flcancel) {
			if (!flcancel) {
				appPrefs.lastBlockedId = id; //1/27/16 by DW
				prefsChanged ();
				findChatMessage (id, function (item) { 
					if (item !== undefined) {
						if (item.payload === undefined) {
							item.payload = new Object ();
							}
						item.payload.flHidden = true;
						twEditChatMessage (item.text, item.payload, item.id, getCurrentChatLog (), function (err, data) {
							if (err) {
								alertDialog ("We were unable to block the message because there was an error: " + err.message);
								}
							else {
								console.log ("blockMessage: data == " + jsonStringify (data));
								}
							});
						}
					else {
						alertDialog ("Can't block the message because there is no message with ID == \"" + id + "\".");
						}
					});
				}
			});
		}
	function insertTextInPost (idMessage, htmltext) { //6/10/16 by DW
		function doPaste () {
			inPlaceMediumEditor.importSelection (savedSelectionInPlaceEditor); //5/2/16 by DW
			inPlaceMediumEditor.pasteHTML (htmltext, {
				forcePlainText: false,
				cleanPastedHTML: false,
				});
			}
		if (flEditingItem) {
			$("#idEditInPlaceTextArea").focus ();
			doPaste ();
			}
		else {
			clickEditIcon (idMessage, function () {
				doPaste ();
				});
			}
		}
	
//editors
	var topOfPageMediumEditor, replyMediumEditor, inPlaceMediumEditor;
	
	function getRidOfRidiculousSpan (s) {
		//medium-editor adds spans with this style at random places. this is no good. we leave the span in place, but remove the ridiculous style attribute.
		var uglyness = " style=\"line-height: 22.4px;\"";
		return (replaceAll (s, uglyness, ""));
		}
	function getEditorId () {
		if (flReplying) {
			return ("#idEditReplyTextArea");
			}
		else {
			if (flEditingItem) {
				return ("#idEditInPlaceTextArea");
				}
			else {
				return ("#idTextArea");
				}
			}
		}
	function getEditorText () {
		var id = getEditorId (), theText = "";
		if (isCommentEditor (id)) {
			theText = $(id).html ();
			}
		else {
			switch (id) {
				case "#idEditReplyTextArea":
					theText = $(id).val ();
					break;
				case "#idEditInPlaceTextArea":
					theText = $(id).html ();
					break;
				case "#idTextArea":
					theText = getMainEditorText ();
					break;
				}
			}
		return (getRidOfRidiculousSpan (theText));
		}
	function setEditorText (s) {
		var id = getEditorId ();
		if (isCommentEditor (id)) {
			$(id).val (s);
			}
		else {
			switch (id) {
				case "#idEditReplyTextArea":
					$(id).val (s);
					break;
				case "#idEditInPlaceTextArea":
					$(id).html (s);
					break;
				case "#idTextArea":
					setMainEditorText (s);
					break;
				}
			}
		}
	function editorFocus () {
		var id = getEditorId ();
		if (isCommentEditor (id)) {
			$(id).focus ();
			}
		else {
			switch (id) {
				case "#idEditReplyTextArea":
					$(id).focus ();
					break;
				case "#idEditInPlaceTextArea":
					myInPlaceEditor.focus ();
					break;
				case "#idTextArea":
					mainEditorFocus ();
					break;
				}
			}
		}
	function isCommentEditor (id) {
		return (stringContains ($(id).attr ("class"), "commentEditor"));
		}
	function getMainEditorText () {
		var theText = "";
		$(".divTopOfPageEditor").each (function () {
			if (beginsWith (this.id, "medium-editor-")) {
				if (!$(this).hasClass ("medium-editor-hidden")) {
					theText = this.innerHTML;
					}
				}
			});
		theText = getRidOfRidiculousSpan (theText); //11/11/15 by DW
		return (theText);
		}
	function setMainEditorText (s) {
		$(".divTopOfPageEditor").each (function () {
			if (beginsWith (this.id, "medium-editor-")) {
				this.innerHTML = s;
				}
			});
		$("#idTextArea").val (s);
		}
	function mainEditorFocus () {
		$("#idTextArea").focus ();
		}
	
	function newMediumEditor (idEditorObject, placeholderText) { //3/22/16 by DW
		return (
			new MediumEditor (idEditorObject, {
				placeholder: {
					text: placeholderText
					},
				toolbar: {
					buttons: ["bold", "italic", "anchor", "h4", "orderedlist", "unorderedlist", "quote"],
					},
				buttonLabels: "fontawesome",
				autoLink: true
				})
			);
		}
	
	
	function startMainEditor (initialText) {
		console.log ("startMainEditor: initialText == " + initialText);
		setMainEditorText (initialText);
		topOfPageMediumEditor = newMediumEditor ("#idTextArea", "This is a good place to start a blog post...");
		autosize (document.querySelectorAll (".divTopOfPageEditor"));
		}
	
	function testPaste () {
		console.log ("testPaste:");
		$(".divTopOfPageEditor").each (function () {
			if (beginsWith (this.id, "medium-editor-")) {
				if (!$(this).hasClass ("medium-editor-hidden")) {
					$(this).focus ();
					}
				}
			});
		topOfPageMediumEditor.pasteHTML ('<iframe width="560" height="315" src="https://www.youtube.com/embed/iI2fRPmEZ6A" frameborder="0" allowfullscreen></iframe>', {
			forcePlainText: false,
			cleanPastedHTML: false,
			});
		}
	
	
//new webhook dialogs
	function getValuesFromDialog (idDialog, deststruct) { //8/30/15 AM by DW
		var inputs = document.getElementById (idDialog).getElementsByTagName ("input"), i;
		for (var i = 0; i < inputs.length; i++) {
			if (inputs [i].type == "checkbox") {
				deststruct [inputs [i].name] = inputs [i].checked;
				}
			else {
				deststruct [inputs [i].name] = inputs [i].value;
				}
			}
		var textareas = document.getElementById (idDialog).getElementsByTagName ("textarea"), i;
		for (var i = 0; i < textareas.length; i++) {
			deststruct [textareas [i].name] = textareas [i].value;
			}
		};
	function openInHookDialog () {
		$("#idProductNameForInHook").html (appConsts.productnameForDisplay);
		$("#idNewInHookDialog").modal ("show"); 
		}
	function closeNewInHookDialog (flsave) {
		if (flsave) {
			var values = new Object ();
			getValuesFromDialog ("idNewInHookDialog", values);
			console.log ("closeNewInHookDialog: values == "+ jsonStringify (values));
			twNewIncomingHook (values.description, "default", values.name, values.iconUrl, values.iconEmoji, function (err, data) {
				if (err) {
					alertDialog (err.message);
					}
				else {
					console.log ("closeNewInHookDialog: data == " + jsonStringify (data));
					askDialog ("Please copy the URL for you new incoming webhook:", data, "", function () {
						});
					}
				});
			}
		$("#idNewInHookDialog").modal ('hide'); 
		}
	
	function openOutHookDialog () {
		$("#idProductNameForOutHook").html (appConsts.productnameForDisplay);
		$("#idNewOutHookDialog").modal ("show"); 
		}
	function closeNewOutHookDialog (flsave) {
		if (flsave) {
			var values = new Object ();
			getValuesFromDialog ("idNewOutHookDialog", values);
			console.log ("idNewOutHookDialog: values == "+ jsonStringify (values));
			twNewOutgoingHook (values.description, "default", values.triggerWords, values.urlsToCall, values.name, values.iconUrl, values.iconEmoji, function (err, data) {
				if (err) {
					alertDialog (err.message);
					}
				else {
					console.log ("closeNewOutHookDialog: data == " + jsonStringify (data));
					askDialog ("Please copy the token for your new incoming webhook:", data, "", function () {
						});
					}
				});
			}
		$("#idNewOutHookDialog").modal ('hide'); 
		}
	
//bookmarks
	function buildBookmarksMenu () { 
		var maxCharsHistoryMenuItem = 25;
		$("#idBookmarksList").empty ();
		var xstruct = $($.parseXML (appPrefs.opmlBookmarks));
		var adrbody = getXstuctBody (xstruct);
		xmlOneLevelVisit (adrbody, function (adrsub) {
			var textatt = xmlGetAttribute (adrsub, "text");
			var scriptatt = xmlGetAttribute (adrsub, "script");
			console.log ("buildBookmarksMenu: textatt == " + textatt + ", scriptatt == " + scriptatt);
			
			var liMenuItem = $("<li></li>");
			var menuItemNameLink = $("<a></a>");
			
			//set text of menu item
				var itemtext = maxLengthString (textatt, maxCharsHistoryMenuItem);
				if (itemtext.length === 0) {
					itemtext = "&nbsp;";
					}
				
				
				menuItemNameLink.html (itemtext);
			
			menuItemNameLink.attr ("onclick", scriptatt);
			liMenuItem.append (menuItemNameLink);
			$("#idBookmarksList").append (liMenuItem);
			
			return (true);
			});
		$("#idBookmarksList").append ("<li class=\"divider\"></li><li><a onclick=\"editBookmarks ();\">Edit bookmarks...</a>");
		}
	function editBookmarks (afterOpenCallback) {
		var opmltext = appPrefs.opmlBookmarks;
		if (opmltext === undefined) {
			opmltext = initialBookmarksOpml;
			}
		flEnableBackgroundTasks = false;
		outlineDialog ("Edit bookmarks...", opmltext, false, function (flSave, opmltext) {
			flEnableBackgroundTasks = true;
			console.log ("editBookmarks: flSave == " + flSave + " , opmltext.length == " + opmltext.length);
			if (flSave) {
				getStoredPrefs (function () { //make sure we have the current data
					twSetPrefs (appPrefs, function () { //11/23/15 by DW
						appPrefs.opmlBookmarks = opmltext;
						buildBookmarksMenu (); 
						});
					});
				}
			}, afterOpenCallback);
		}
	function clickBookmarkIcon (idMessage) {
		if (userCanPost ()) {
			var maxMenuChars = 25;
			findChatMessage (idMessage, function (item) {
				editBookmarks (function () {
					console.log ("clickBookmarkIcon: callback has been called.");
					opFirstSummit ();
					var linetext = maxStringLength (stripMarkup (item.text), maxMenuChars);
					opInsert (linetext, up);
					var theScript = "openHoistDialog (" + idMessage + ", \"" + getCurrentChatLog () + "\")";
					opSetOneAtt ("script", theScript);
					});
				});
			}
		}
//menu editor
	var urlOrigMenubarOpml = "http://1999.io/dev/publish/menubar.opml";
	var menubarOpmlPath = "misc/menubar.opml";
	var menubarHtmlPath = "misc/menubar.html";
	
	function xmlGetMenuHtml (opmltext, flSystemMenu) { //2/27/16 by DW
		var xstruct = $($.parseXML (opmltext)), navbarclass = "navbar-fixed-top";
		var adrbody = getXstuctBody (xstruct), htmltext = "", indentlevel = 0;
		function add (s) {
			htmltext +=  filledString ("\t", indentlevel) + s + "\n";
			}
		function gettextatt (adrx) {
			return (xmlGetAttribute (adrx, "text"));
			}
		function addmenuitem (adrx) {
			var textatt = gettextatt (adrx);
			if (textatt == "-") {
				add ("<li class=\"divider\"></li>");
				}
			else {
				var typeatt = xmlGetAttribute (adrx, "type"), urlatt = xmlGetAttribute (adrx, "url");
				if ((typeatt == "link") && (urlatt != undefined)) {
					add ("<li><a href=\"" + urlatt + "\" target=\"_blank\">" + textatt + "</a></li>");
					}
				else {
					add ("<li><a>" + textatt + "</a></li>"); //3/6/16 by DW
					}
				}
			}
		function adddropdownhead (adrx) {
			add ("<li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">" + gettextatt (adrx) + "&nbsp;<b class=\"caret\"></b></a>"); indentlevel++
			}
		
		if (flSystemMenu === undefined) {
			flSystemMenu = true;
			}
		
		add ("<div class=\"divMenubar\" id=\"idMenubar\">"); indentlevel++;
		add ("<div class=\"topbar-wrapper\" style=\"z-index: 5;\">"); indentlevel++;
		add ("<div class=\"navbar navbar-fixed-top\" data-dropdown=\"dropdown\">"); indentlevel++;
		add ("<div class=\"divVersionNumber\" id=\"idVersionNumber\"></div>");
		add ("<div class=\"navbar-inner\">"); indentlevel++;
		add ("<div class=\"container\">"); indentlevel++;
		add ("<a class=\"brand\" href=\"/\"><span id=\"idMenuProductName\"></span></a>");
		add ("<ul class=\"nav\" id=\"idMainMenuList\">"); indentlevel++;
		
		xmlOneLevelVisit (adrbody, function (adrx) { //add each top-level menu
			if (xmlHasSubs (adrx)) {
				adddropdownhead (adrx);
				add ("<ul class=\"dropdown-menu\">"); indentlevel++
				xmlOneLevelVisit (adrx, function (adrx) {
					addmenuitem (adrx);
					return (true); //keep visiting
					});
				add ("</ul>"); indentlevel--
				add ("</li>"); indentlevel--
				}
			else {
				addmenuitem (adrx);
				}
			return (true); //keep visiting
			});
		
		add ("</ul>"); indentlevel--;
		
		if (flSystemMenu) {
			add ("<ul class=\"nav pull-right\" id=\"idSystemMenu\">"); indentlevel++;
			add ("<li class=\"dropdown\">"); indentlevel++;
			add ("<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><span id=\"idTwitterIcon\"></span><span id=\"idTwitterUsername\"></span>&nbsp;<b class=\"caret\"></b></a>");
			
			add ("<ul class=\"dropdown-menu\">"); indentlevel++;
			add ("<li><a onclick=\"aboutDialog ();\">About <span id=\"idMenuAboutProductName\"></span>...</a></li>");
			add ("<li class=\"divider\"></li>");
			add ("<li><a class=\"disabled\" onclick=\"settingsCommandNotImplemented ();\">Settings...</a></li>");
			add ("<li class=\"divider\"></li>");
			add ("<li><a onclick=\"twToggleConnectCommand ();\" id=\"idTwitterConnectMenuItem\"></a></li>");
			add ("</ul>"); indentlevel--;
			
			add ("</li>"); indentlevel--;
			add ("</ul>"); indentlevel--;
			}
		
		add ("</div>"); indentlevel--;
		add ("</div>"); indentlevel--;
		add ("</div>"); indentlevel--;
		add ("</div>"); indentlevel--;
		add ("</div>"); indentlevel--;
		
		return (htmltext);
		}
	function editMenubar () {
		if (userIsSysop ()) {
			var styles = ".divOutlineDialog {width: 30%; left: 58%;}";
			function openDialog (opmltext, flNewOutline) {
				var extraButtonTitle = "Link...";
				function afterOpenCallback () {
					if (flNewOutline) {
						console.log ("afterOpenCallback: about to expand everything.");
						opExpandEverything ();
						}
					}
				function extraButtonCallback (opmltext) {
					var defaultLink = "", urlatt = opGetOneAtt ("url");
					if (urlatt !== undefined) {
						defaultLink = urlatt;
						}
					askDialog ("The URL to link to:", defaultLink, "Enter the URL of your page here.", function (urlLink, flcancel) {
						if (!flcancel) {
							opSetAtts ({
								type: "link", url: urlLink
								});
							}
						});
					}
				flEnableBackgroundTasks = false;
				
				appPrefs.outlineFontSize = 15;
				appPrefs.outlineLineHeight = 22;
				
				outlineDialog ("Edit menubar...", opmltext, false, function (flSave, opmltext) {
					flEnableBackgroundTasks = true;
					console.log ("editMenubar: flSave == " + flSave + " , opmltext.length == " + opmltext.length);
					
					if (flSave) {
						var htmltext = xmlGetMenuHtml (opmltext);
						twChatLogPublish (getCurrentChatLog (), menubarHtmlPath, htmltext, "text/html", function (data) { 
							myChatlogMetadata.renderingPrefs.urlHtmlMenubar = data.url;
							
							console.log ("editMenubar: myChatlogMetadata.renderingPrefs.urlHtmlMenubar == " + myChatlogMetadata.renderingPrefs.urlHtmlMenubar);
							
							twChatLogPublish (getCurrentChatLog (), menubarOpmlPath, opmltext, "text/xml", function (data) { 
								myChatlogMetadata.renderingPrefs.urlOpmlMenubar = data.url;
								
								console.log ("editMenubar: myChatlogMetadata.renderingPrefs.urlOpmlMenubar == " + myChatlogMetadata.renderingPrefs.urlOpmlMenubar);
								
								chatLogShell.backupTextfileCallback ("menubar.opml", opmltext);
								
								if (myChatlogMetadata.renderingPrefs.opmlMenubar !== undefined) { //2/29/16 by DW
									delete myChatlogMetadata.renderingPrefs.opmlMenubar;
									}
								
								twSetChatLogMetadata (myChatlogMetadata, function (err, serverMetadata) {
									if (!err) {
										console.log ("editMenus: serverMetadata == " + jsonStringify (serverMetadata));
										}
									});
								});
							});
						}
					}, afterOpenCallback, extraButtonTitle, extraButtonCallback, styles);
				}
			twGetFile (menubarOpmlPath, true, false, function (err, data) {
				if (data !== undefined) {
					openDialog (data.filedata.toString (), false);
					}
				else { 
					readHttpFile (urlOrigMenubarOpml, function (opmltext) {
						openDialog (opmltext, true);
						});
					}
				});
			
			}
		else {
			alertDialog ("Can't edit the menubar because you are not the owner of the site.");
			}
		}
//template editor
	var urlOrigTemplateOpml = "http://1999.io/dev/publish/template4.opml";
	var templatePathOpml = "misc/template.opml";
	var templatePathHtml = "misc/template.html";
	
	function editTemplate () {
		if (userIsSysop ()) {
			var styles = ".divOutlineDialog {width: 65%; left: 40%;}";
			function openDialog (opmltext, flNewOutline) {
				var extraButtonTitle = "Preview";
				function afterOpenCallback () {
					if (flNewOutline) {
						console.log ("afterOpenCallback: about to expand everything.");
						opExpandEverything ();
						}
					}
				function extraButtonCallback (opmltext) {
					publishMessage (idMockupMessage, function (urlMockupPage) {
						console.log ("extraButtonCallback: urlMockupPage == " + urlMockupPage);
						chatLogShell.openUrlCallback (urlMockupPage);
						}, opmltext);
					}
				flEnableBackgroundTasks = false;
				
				appPrefs.outlineFontSize = 15;
				appPrefs.outlineLineHeight = 22;
				
				outlineDialog ("Edit template...", opmltext, false, function (flSave, opmltext) {
					flEnableBackgroundTasks = true;
					console.log ("editTemplate: flSave == " + flSave + " , opmltext.length == " + opmltext.length);
					if (flSave) {
						chatLogShell.backupTextfileCallback ("template.opml", opmltext);
						twChatLogPublish (getCurrentChatLog (), templatePathOpml, opmltext, "text/xml", function (data) { 
							myChatlogMetadata.renderingPrefs.urlOpmlTemplate = data.url;
							if (myChatlogMetadata.renderingPrefs.opmlTemplate !== undefined) { //2/29/16 by DW
								delete myChatlogMetadata.renderingPrefs.opmlTemplate;
								}
							twSetChatLogMetadata (myChatlogMetadata, function (err, serverMetadata) {
								if (!err) {
									console.log ("editTemplate: serverMetadata == " + jsonStringify (serverMetadata));
									}
								});
							});
						}
					}, afterOpenCallback, extraButtonTitle, extraButtonCallback, styles);
				}
			
			twGetFile (templatePathHtml, true, false, function (err, data) { //5/16/16 by DW
				if (data !== undefined) {
					alertDialog ("Can't edit the template outline because you have an HTML version of the template.");
					}
				else {
					twGetFile (templatePathOpml, true, false, function (err, data) {
						if (data !== undefined) {
							openDialog (data.filedata.toString (), false);
							}
						else { 
							readHttpFile (urlOrigTemplateOpml, function (opmltext) {
								openDialog (opmltext, true);
								});
							}
						});
					}
				});
			}
		else {
			alertDialog ("Can't edit the template because you are not the owner of the site.");
			}
		}
	function setExternalTemplate (urlTemplate) { //10/26/16 AM by DW
		myChatlogMetadata.renderingPrefs.urlOpmlTemplate = urlTemplate;
		twSetChatLogMetadata (myChatlogMetadata, function (err, serverMetadata) {
			if (!err) {
				console.log ("setExternalTemplate: serverMetadata == " + jsonStringify (serverMetadata));
				}
			});
		}
//chatlog menu
	function aboutChatLogsMenu () { //4/12/16 by DW
		alertDialog ("The items in this menu are the <i>chatlogs</i> on this server that you can post to.");
		}
	function chooseChatLog (name) {
		console.log ("chooseChatLog: name == " + name);
		if (appPrefs.nameChatLog != name) {
			twSetPrefs (appPrefs, function () {
				appPrefs.nameChatLog = name;
				showHideItemsThatRequireLogin (!userCanPost ());
				twOpenNamedChatLog (name, function () { //make sure the server has this chatlog open -- 1/7/16 by DW
					getWholeChatLog (function () {
						buildChatLogsMenu (); //the checked item changed
						wsChatLogChanged (name);
						});
					});
				});
			}
		}
	function countChatLogsInMenu () { //4/25/16 by DW
		var ct = 0;
		for (var x in myChatlogList) {
			var log = myChatlogList [x], myName = stringLower (twGetScreenName ());
			for (var i = 0; i < log.usersWhoCanPost.length; i++) {
				if (myName == stringLower (log.usersWhoCanPost [i])) {
					ct++;
					}
				}
			}
		return (ct);
		}
	function buildChatLogsMenu () {
		if (countChatLogsInMenu () <= 1) {
			$("#idChatLogsMenu").css ("display", "none"); 
			}
		else {
			$("#idChatLogsList").empty ();
			$("#idChatLogsList").append ("<li><a onclick=\"aboutChatLogsMenu ()\">About this menu...</a></li>");
			$("#idChatLogsList").append ("<li class=\"divider\">Hello world</li>");
			$("#idChatLogsMenuTitle").text (upperCaseFirstChar (appPrefs.nameChatLog));
			for (var x in myChatlogList) {
				var log = myChatlogList [x], itemtext = upperCaseFirstChar (x), myName = stringLower (twGetScreenName ());
				for (var i = 0; i < log.usersWhoCanPost.length; i++) {
					if (myName == stringLower (log.usersWhoCanPost [i])) {
						var theScript = "chooseChatLog (\"" + x + "\")";
						var liMenuItem = $("<li></li>");
						var menuItemNameLink = $("<a></a>");
						if (x == appPrefs.nameChatLog) { 
							itemtext = "<i class=\"fa fa-check iMenuCheck\"></i>" + itemtext;
							}
						menuItemNameLink.html (itemtext);
						menuItemNameLink.attr ("onclick", theScript);
						liMenuItem.append (menuItemNameLink);
						$("#idChatLogsList").append (liMenuItem);
						}
					}
				}
			}
		}
//editors menu
	var flEditorsMenuBuilt = false;
	
	function aboutEditorsMenu () { //4/29/16 by DW
		alertDialog ("The items in this menu are special apps for editing the text of a message.");
		}
	function openEditor (name) {
		if (flEditingItem) {
			findChatMessage (idItemBeingEdited, function (item) {
				var package = {
					urlTwitterServer: appConsts.urlTwitterServer,
					nameChatLog: getCurrentChatLog (),
					item: item,
					editedText: getEditorText (),
					editorName: name
					};
				localStorage.editorPackage = jsonStringify (package);
				cancelEdit ();
				window.open ("editor?name=" + name);
				});
			}
		else {
			alertDialog ("You must be editing an item to open an editor.");
			}
		}
	function buildEditorsMenu () { //4/29/16 by DW
		if (appPrefs.flEditorsMenu) {
			$("#idEditorsList").empty ();
			$("#idEditorsList").append ("<li><a onclick=\"aboutEditorsMenu ()\">About this menu...</a></li>");
			$("#idEditorsList").append ("<li class=\"divider\">Hello world</li>");
			for (var x in appConsts.editors) {
				var editor = appConsts.editors [x];
				var theScript = "openEditor (\"" + x + "\")";
				var liMenuItem = $("<li></li>");
				var menuItemNameLink = $("<a></a>");
				menuItemNameLink.html (editor.name);
				menuItemNameLink.attr ("onclick", theScript);
				liMenuItem.append (menuItemNameLink);
				$("#idEditorsList").append (liMenuItem);
				}
			flEditorsMenuBuilt= true;
			}
		else {
			$("#idEditorsMenu").css ("display", "none"); 
			}
		}
	function showHideEditorsMenu () {
		if (appPrefs.flEditorsMenu && flEditingItem) {
			if (!flEditorsMenuBuilt) {
				buildEditorsMenu ();
				}
			$("#idEditorsMenu").css ("display", "block"); 
			}
		else {
			$("#idEditorsMenu").css ("display", "none"); 
			}
		}
//plugins menu
	var flPlugInsMenuBuilt = false;
	
	function aboutPlugInsMenu () { 
		alertDialog ("It's rrrrooomantic, boombastic, fantastic.");
		}
	function openPlugIn (name) {
		window.open ("plugin?name=" + name);
		}
	function buildPlugInsMenu () { //5/16/16; 12:12:16 PM by DW
		if (appPrefs.flPlugInsMenu) {
			$("#idPlugInsList").empty ();
			$("#idPlugInsList").append ("<li><a onclick=\"aboutPlugInsMenu ()\">About this menu...</a></li>");
			$("#idPlugInsList").append ("<li class=\"divider\"></li>");
			for (var x in appConsts.plugIns) {
				var plugin = appConsts.plugIns [x];
				var theScript = "openPlugIn (\"" + x + "\")";
				var liMenuItem = $("<li></li>");
				var menuItemNameLink = $("<a></a>");
				menuItemNameLink.html (plugin.name);
				menuItemNameLink.attr ("onclick", theScript);
				liMenuItem.append (menuItemNameLink);
				$("#idPlugInsList").append (liMenuItem);
				}
			flPlugInsMenuBuilt= true;
			}
		else {
			$("#idPlugInsMenu").css ("display", "none"); 
			}
		}
	function showHidePlugInsMenu () {
		if (appPrefs.flPlugInsMenu) {
			if (!flPlugInsMenuBuilt) {
				buildPlugInsMenu ();
				}
			$("#idPlugInsMenu").css ("display", "block"); 
			}
		else {
			$("#idPlugInsMenu").css ("display", "none"); 
			}
		}
//replies menu
	function addMenuItem (idlist, itemtext, scripttext) {
		var liMenuItem = $("<li></li>");
		var menuItemNameLink = $("<a></a>");
		
		//set text of menu item
			if (itemtext.length === 0) {
				itemtext = "&nbsp;";
				}
			menuItemNameLink.html (itemtext);
		
		menuItemNameLink.attr ("onclick", scripttext);
		liMenuItem.append (menuItemNameLink);
		$("#" + idlist).append (liMenuItem);
		}
	function buildRepliesMenu () { 
		var myName = twGetScreenName (), ctInMenu = 0;
		$("#idRepliesList").empty ();
		for (var i = appPrefs.repliesArray.length - 1; i >= 0; i--) {
			if (ctInMenu >= maxRepliesMenu) {
				break;
				}
			var id = appPrefs.repliesArray [i];
			findChatMessage (id, function (item) {
				if (item !== undefined) {
					if ((item.payload !== undefined) && (item.payload.idInReplyTo !== undefined)) {
						}
					}
				});
			}
		}
	function addToRepliesArray (id) {
		if (appConsts.chatConfig.flRepliesArray) { //11/29/15 by DW
			twSetPrefs (appPrefs, function () { //11/23/15 by DW
				appPrefs.repliesArray [appPrefs.repliesArray.length] = id;
				buildRepliesMenu ();
				});
			}
		}
//editbox
	function setEditBoxIcon () {
		getUserIcon (twGetScreenName (), function (urlIcon, personName) {
			$("#idEditBoxIcon").attr ("src", urlIcon);
			});
		}
//hoist viewer dialog
	var flHoistDialogSetUp = false;
	var urlHoistDialogHtml = "http://1999.io/dev/hoistdialog.html";
	
	function closeHoistDialog () {
		$("#idHoistViewer").modal ('hide'); 
		$("#idWhereToShowHoistedItem").empty (); //10/7/15 by DW
		idHoistedPost = undefined;
		nameChatlogHoistedPost = undefined; //10/31/15 by DW
		viewChatLog ();
		}
	function setupHoistDialog (callback) {
		if (flHoistDialogSetUp) {
			if (callback != undefined) {
				callback ();
				}
			}
		else {
			readHttpFileThruProxy (urlHoistDialogHtml, undefined, function (s) {
				$("body").prepend (s);
				flHoistDialogSetUp = true;
				if (callback != undefined) {
					callback ();
					}
				});
			}
		}
	function openHoistDialog (idMessage, nameChatlog) {
		setupHoistDialog (function () {
			$("#idHoistViewer").modal ("show");
			idHoistedPost = idMessage;
			nameChatlogHoistedPost = nameChatlog; //10/31/15 by DW
			
			viewChatLog ("idWhereToShowHoistedItem", function (hoistedItem) {
				
				if ((hoistedItem.payload !== undefined) && (hoistedItem.payload.title !== undefined)) {
					$("#idHoistTitle").text (hoistedItem.payload.title);
					}
				
				});
			
			});
		}
//opml objects
	function outlineToJson (adrx, nameOutlineElement) {
		var theOutline = new Object ();
		if (nameOutlineElement == undefined) {
			nameOutlineElement = "source\\:outline";
			}
		xmlGatherAttributes (adrx, theOutline);
		if (xmlHasSubs (adrx)) {
			theOutline.subs = [];
			$(adrx).children (nameOutlineElement).each (function () {
				theOutline.subs [theOutline.subs.length] = outlineToJson (this, nameOutlineElement);
				});
			}
		return (theOutline);
		}
	function readOpmlFile (url, idOpml, outlineTitle, callback) {
		if (outlineTitle === undefined) {
			outlineTitle = "";
			}
		readHttpFile (url, function (opmltext) {
			var xstruct = $($.parseXML (opmltext));
			var adrbody = getXstuctBody (xstruct);
			var theOutline = outlineToJson (adrbody, "outline");
			theOutline.text = outlineTitle;
			$("#" + idOpml).html (renderOutlineBrowser (theOutline, false, undefined, undefined, true));
			if (callback !== undefined) {
				callback ();
				}
			});
		}
//menu commands
	function aboutHooks () {
		alertDialog ("For now only \"davewiner\" can create hooks.");
		}
	function postATweet () {
		askDialog ("The URL of the tweet you want to post:", appPrefs.lastTweetUrl, "Enter the URL of your tweet here.", function (url, flcancel) {
			if (!flcancel) {
				var payload = {
					type: "tweet",
					idTweet: stringLastField (url, "/")
					};
				postChatMessage (url, undefined, payload);
				twSetPrefs (appPrefs, function () { //11/23/15 by DW
					appPrefs.lastTweetUrl = url;
					});
				}
			});
		}
	function addInclude () { //10/31/15 by DW
		askDialog ("The URL of the chatlog item you want to include:", appPrefs.lastIncludeUrl, "Enter the URL of the chatlog item here.", function (url, flcancel) {
			if (!flcancel) {
				var payload = {
					type: "include",
					url: url
					};
				postChatMessage (url, undefined, payload);
				twSetPrefs (appPrefs, function () { //11/23/15 by DW
					appPrefs.lastIncludeUrl = url;
					});
				}
			});
		}
	function postAnOpmlFile () {
		askDialog ("The URL of the OPML file you want to post:", appPrefs.lastOpmlUrl, "Enter the URL of your OPML file here.", function (url, flcancel) {
			if (!flcancel) {
				var payload = {
					type: "opml",
					url: url
					};
				postChatMessage (url, undefined, payload);
				twSetPrefs (appPrefs, function () { //11/23/15 by DW
					appPrefs.lastOpmlUrl = url;
					});
				}
			});
		}
	function postAnInstantOutline () { //7/4/16 by DW
		askDialog ("The URL of the Instant Outline you want to post:", appPrefs.lastInstantOutlineUrl, "Enter the URL of your Instant Outline here.", function (url, flcancel) {
			if (!flcancel) {
				var payload = {
					type: "instantOutline",
					url: url
					};
				postChatMessage ("", undefined, payload); //7/14/16 by DW -- changed first param from "url"
				twSetPrefs (appPrefs, function () {
					appPrefs.lastInstantOutlineUrl = url;
					});
				}
			});
		}
	function postPicture () {
		askDialog ("The URL of the image file you want to post:", appPrefs.lastImgUrl, "Enter the URL of your image file here.", function (urlImage, flcancel) {
			if (!flcancel) {
				getImageSize (urlImage, function (imagedata) {
					if (imagedata === undefined) {
						alert ("Can't add the image because there was an error getting the image size");
						}
					else {
						var htmltext;
						if (imagedata.width > maxImageWidth) {
							imagedata.height = Math.floor ((maxImageWidth / imagedata.width) * imagedata.height);
							imagedata.width = maxImageWidth;
							}
						if (imagedata.height > maxImageHeight) {
							imagedata.width = Math.floor ((maxImageHeight / imagedata.height) * imagedata.width);
							imagedata.height = maxImageHeight;
							}
						htmltext = "<img src=\"" + urlImage + "\" width=\"" + imagedata.width + "\" height=\"" + imagedata.height + "\">"; //12/1/15 by DW
						console.log ("getImageSize: imagedata == " + jsonStringify (imagedata));
						imagedata.type = "image";
						imagedata.url = url;
						postChatMessage (htmltext, undefined, imagedata);
						twSetPrefs (appPrefs, function () { //11/23/15 by DW
							appPrefs.lastImgUrl = url;
							});
						}
					});
				}
			});
		}
	function postPodcast () {
		askDialog ("The URL of the podcast you want to post:", appPrefs.lastPodcastUrl, "Enter the URL of your podcast file here.", function (urlPodcast, flcancel) {
			if (!flcancel) {
				var payload = {
					type: "podcast",
					enclosure: {
						url: urlPodcast
						}
					};
				twSetPrefs (appPrefs, function () { //11/23/15 by DW
					appPrefs.lastPodcastUrl = urlPodcast;
					});
				getRssEnclosureInfo (payload, function () { 
					console.log ("postPodcast: payload.enclosure == " + jsonStringify (payload.enclosure));
					if (getBoolean (payload.enclosure.flError)) {
						alertDialog ("Can't create the podcast post because there was an error reading the podcast file.");
						}
					else {
						postChatMessage (urlPodcast, undefined, payload);
						}
					});
				}
			});
		}
	function aboutMainMenu () {
		alertDialog ("The commands in this menu apply to your own chatlog, and are disabled when you're accessing another log as a guest.");
		}
	function twitterToggleConnect () {
		if (twIsTwitterConnected ()) {
			confirmDialog ("Sign off Twitter?", function () {
				twDisconnectFromTwitter ();
				showHideItemsThatRequireLogin ();
				viewChatLog (); //some items are disabled if you're not logged-in
				});
			}
		else {
			twConnectToTwitter ();
			}
		}
	function setCollaboratorsDialog () { //2/19/16 by DW
		var theList = myChatlogMetadata.usersWhoCanPost, s = "";
		for (var i = 0; i < theList.length; i++) {
			if (s.length > 0) {
				s += ",";
				}
			s += theList [i];
			}
		askDialog ("Enter a list of IDs of your collaborators:", s, "Enter a comma or space-separated list of Twitter account IDs.", function (s, flcancel) {
			if (!flcancel) {
				var theList = [], acum = "";
				for (var i = 0; i < s.length; i++) {
					switch (s [i]) {
						case ",": case " ":
							if (acum.length > 0) {
								theList [theList.length] = acum;
								acum = "";
								}
							break;
						default:
							acum += s [i];
							break;
						}
					}
				if (acum.length > 0) {
					theList [theList.length] = acum;
					}
				twSetChatLogMetadata ({usersWhoCanPost: theList}, function (err, metadata) {
					if (!err) {
						myChatlogMetadata.usersWhoCanPost = theList; //debugging
						console.log ("setCollaboratorsDialog: metadata == " + jsonStringify (metadata));
						}
					});
				}
			});
		}
	function viewMyRss () { //3/1/16 by DW
		chatLogShell.openUrlCallback (myChatlogList [getCurrentChatLog ()].urlRssFeed);
		}
	function viewMyHomePage () { //3/3/16 by DW
		chatLogShell.openUrlCallback (myChatlogList [getCurrentChatLog ()].urlPublicFolder);
		}
	function viewMyChatLogJson () { //3/9/16 by DW
		chatLogShell.openUrlCallback (myChatlogList [getCurrentChatLog ()].urlChatLogJson);
		}
	function viewDoc (url) { //4/12/16 by DW
		chatLogShell.openUrlCallback (url);
		}
	
	function aboutGuestMenu () {
		alertDialog ("The commands in this menu apply to the current chatlog when you're accessing them as a guest.");
		}
	function viewGuestHomePage () { //3/8/16 by DW
		chatLogShell.openUrlCallback (myChatlogList [getCurrentChatLog ()].urlPublicFolder);
		}
	function viewGuestRss () { //3/8/16 by DW
		chatLogShell.openUrlCallback (myChatlogList [getCurrentChatLog ()].urlRssFeed);
		}
	
	
//set image menu item
	function davesSetImageMenuItem (idMessage) {
		findChatMessage (idMessage, function (item) {
			var urlDefault = appPrefs.lastImageUrl;
			var alignDefault = appPrefs.lastImageAlign;
			
			openImageDialog ("Please enter the URL for the image", urlDefault, alignDefault, function (urlImage, alignValue) {
				var align = " align=\"" + alignValue + "\"", fladdcenter = false;
				if (alignValue == "middle") {
					align = "";
					}
				
				getImageSize (urlImage, function (imagedata) { //5/27/16 by DW
					var heightwidth = "", style = "style=\"margin: 14px;\"";
					console.log ("getImageSize: imagedata == " + jsonStringify (imagedata));
					
					if (imagedata !== undefined) {
						heightwidth = " height=\"" + imagedata.height + "\" width=\"" + imagedata.width + "\" ";
						}
					
					var htmltext = "<img src=\"" + urlImage + "\"" + style + align + heightwidth + ">";
					if (fladdcenter) {
						htmltext = "<div class=\"divCenteredImage\">" + htmltext + "</div>";
						}
					console.log ("setImageMenuItem returned: htmltext == " + htmltext);
					insertTextInPost (idMessage, htmltext);
					
					});
				});
			
			
			});
		}
	function setImageMenuItem (idMessage) {
		findChatMessage (idMessage, function (item) {
			var defaultUrlImage = "";
			if (item.payload.image !== undefined) {
				defaultUrlImage = item.payload.image;
				}
			askDialog ("Please enter the URL for the margin-image?", defaultUrlImage, "This image appears in the right margin when the item is displayed.", function (urlImage, flCancel) {
				if (!flCancel) {
					getImageSize (urlImage, function (imagedata) { //5/27/16 by DW
						console.log ("getImageSize: imagedata == " + jsonStringify (imagedata));
						item.payload.image = urlImage;
						item.payload.imageHeight = imagedata.height;
						item.payload.imageWidth = imagedata.width;
						twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog ());
						publishMessage (idMessage); 
						});
					}
				});
			});
		}
	function setMetadataImageMenuItem (idMessage) { //8/27/16 by DW
		findChatMessage (idMessage, function (item) {
			var defaultUrlImage = "";
			if (item.payload.imageForMeta !== undefined) {
				defaultUrlImage = item.payload.imageForMeta;
				}
			askDialog ("Please enter the URL for the metadata-image?", defaultUrlImage, "This image flows to Twitter and Facebook.", function (urlImage, flCancel) {
				if (!flCancel) {
					item.payload.imageForMeta = urlImage;
					twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog ());
					publishMessage (idMessage); 
					}
				});
			});
		}
	
//popup menu commands
	function clickEditIcon (idMessage, callback) {
		findChatMessage (idMessage, function (item) {
			flEditingItem = true;
			idItemBeingEdited = idMessage;
			if (itemIsReply (item)) {
				flReturnPostsMessage = true;
				}
			updateOneItem (idMessage);
			showHideEditorsMenu (); //4/30/16 by DW
			if (callback !== undefined) { //4/27/16 by DW
				callback ();
				}
			});
		}
	function likeClick (idMessage) {
		twChatLike (idMessage, getCurrentChatLog (), function (data) {
			console.log ("likeChatItem: data == " + jsonStringify (data));
			});
		}
	function setTitleMenuItem (idMessage) {
		findChatMessage (idMessage, function (item) {
			var defaultTitle = "", flFnameChanged = false;
			if (item.payload.title !== undefined) {
				defaultTitle = item.payload.title;
				}
			askDialog ("Title for the item?", defaultTitle, "The title appears when the item is published.", function (title, flCancel) {
				if (!flCancel) {
					item.payload.title = title;
					if (appPrefs.flBetterStoryUrls) { //7/26/16 by DW
						if (item.payload.fnameHtml === undefined) { 
							item.payload.fnameHtml = innerCaseName (title) + ".html";
							flFnameChanged = true;
							}
						}
					twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog ());
					publishMessage (idMessage, function () { //used to be "republish" -- but if you set the title that should publish it, if it hasn't been -- 10/22/15 by DW
						if (flFnameChanged) {
							publishPrevNext (idMessage); //7/27/16 by DW -- their prevNext links just changed
							}
						});
					}
				});
			});
		}
	function setEnclosureMenuItem (idMessage) { //11/25/15 by DW
		findChatMessage (idMessage, function (item) {
			var defaultUrEnclosure = appPrefs.lastPodcastUrl;
			if ((item.payload.enclosure !== undefined) && (item.payload.enclosure.url !== undefined)) {
				defaultUrEnclosure = item.payload.enclosure.url;
				}
			askDialog ("Please enter the URL for the enclosure?", defaultUrEnclosure, "The URL of your MP3 or video for the enclosure.", function (urlEnclosure, flCancel) {
				if (!flCancel) {
					if (item.payload === undefined) {
						item.payload = {
							enclosure: {
								url: urlEnclosure
								}
							}
						}
					else {
						item.payload.enclosure = {
							url: urlEnclosure
							};
						}
					twSetPrefs (appPrefs, function () {
						appPrefs.lastPodcastUrl = urlEnclosure;
						});
					getRssEnclosureInfo (item.payload, function () { 
						console.log ("setEnclosureMenuItem: payload.enclosure == " + jsonStringify (item.payload.enclosure));
						if (getBoolean (item.payload.enclosure.flError)) {
							alertDialog ("Can't add the enclosure because there was an error reading the file.");
							}
						else {
							twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog ());
							}
						});
					}
				});
			});
		}
	function getPermaLink (idMessage) {
		var url = stringNthField (window.location.href, "?", 1);
		url = stringNthField (url, "#", 1);
		url += "?id=" + idMessage;
		askDialog ("Please copy the URL for viewing this message:", url, "", function (url, flCancel) {
			if (!flCancel) {
				window.open (url);
				}
			});
		}
	function viewPermaLink (idMessage) { //10/30/15 by DW -- third def of permalink, open a page on 1999.io, always
		window.open (urlMessageViewerApp + "?chatlog=" + getCurrentChatLog () + "&id=" + idMessage);
		}
	function clickEditMenuItem (idMessage) {
		setTimeout (function () {
			console.log ("After timeout in clickEditMenuItem.");
			clickEditIcon (idMessage);
			}, 1);
		}
	function insertHtmlMenuItem (idMessage) { //4/24/16 by DW
		var prompt = "Enter the HTML text you want to insert:";
		var text = "Tags and text and other stuff that goes in web pages.";
		var replaceTable = {
			
			"<script": "&lt;script",
			"</script": "&lt;/script"
			
			};
		findChatMessage (idMessage, function (item) {
			askDialog (prompt, appPrefs.lastInsertedHtmltext, text, function (htmltext, flcancel) {
				if (!flcancel) {
					function doPaste () {
						inPlaceMediumEditor.importSelection (savedSelectionInPlaceEditor); //5/2/16 by DW
						inPlaceMediumEditor.pasteHTML (htmltext, {
							forcePlainText: false,
							cleanPastedHTML: false,
							});
						}
					appPrefs.lastInsertedHtmltext = htmltext; 
					htmltext = multipleReplaceAll (htmltext, replaceTable, false);
					prefsChanged ();
					
					if (flEditingItem) {
						$("#idEditInPlaceTextArea").focus ();
						doPaste ();
						}
					else {
						clickEditIcon (idMessage, function () {
							doPaste ();
							});
						}
					}
				});
			});
		}
	function deleteMenuItem (idMessage) {
		confirmDialog ("Delete this item? (There is no Undo.)", function () {
			deleteMessage (idMessage);
			});
		}
	function clickReplyMenuItem (idMessage) {
		if (userCanReply ()) {
			setTimeout (function () {
				console.log ("After timeout in clickReplyMenuItem.");
				clickReplyIcon (idMessage);
				}, 1);
			}
		}
	
	
	
//set-metadata dialog -- 9/4/16 by DW
	var idMessageForMetadataDialog;
	
	function closeMetadataDialog () {
		$("#idSetMetadataDialog").modal ("hide"); 
		}
	function okMetadataDialog () {
		findChatMessage (idMessageForMetadataDialog, function (item) {
			item.payload.titleForMeta = $("#idMetaTitle").val ();
			item.payload.imageForMeta = $("#idMetaImage").val ();
			item.payload.descriptionForMeta = $("#idMetaDescription").val ();
			
			item.payload.flDisqusComments = getBoolean ($("#idDisqusComments").prop ("checked")); //9/19/16 by DW
			
			twEditChatMessage (item.text, item.payload, idMessageForMetadataDialog, getCurrentChatLog ());
			publishMessage (idMessageForMetadataDialog); 
			closeMetadataDialog ();
			});
		}
	function setMetadataDialog (idMessage) {
		idMessageForMetadataDialog = idMessage; //set global
		findChatMessage (idMessage, function (item) {
			function setDialogValue (id, val) {
				if (val === undefined) {
					val = "";
					}
				$("#" + id).val (val);
				}
			setDialogValue ("idMetaTitle", item.payload.titleForMeta);
			setDialogValue ("idMetaImage", item.payload.imageForMeta);
			setDialogValue ("idMetaDescription", item.payload.descriptionForMeta);
			
			$("#idDisqusComments").prop ("checked", getBoolean (item.payload.flDisqusComments)); //9/19/16 by DW
			
			$("#idSetMetadataDialog").modal ("show"); 
			});
		}
//websockets interface
	var myChatLogSocket;
	
	function wsWatchForChange (urlToWatch, callback) {
		if (myChatLogSocket === undefined) {
			myChatLogSocket = new WebSocket (appConsts.urlChatLogSocket); 
			myChatLogSocket.onopen = function (evt) {
				console.log ("myChatLogSocket is open.");
				console.log ("sending: " + urlToWatch);
				myChatLogSocket.send (urlToWatch);
				};
			myChatLogSocket.onmessage = function (evt) {
				var s = evt.data;
				if (s !== undefined) { //no error
					var updatekey = "update\r";
					if (beginsWith (s, updatekey)) { //it's an update
						s = stringDelete (s, 1, updatekey.length);
						callback (s);
						}
					}
				};
			myChatLogSocket.onclose = function (evt) {
				console.log ("myChatLogSocket was closed.");
				myChatLogSocket = undefined;
				};
			myChatLogSocket.onerror = function (evt) {
				console.log ("myChatLogSocket received an error");
				};
			}
		}
	function wsChatLogChanged (name) {
		if (myChatLogSocket !== undefined) {
			myChatLogSocket.send ("watch chatlog:" + name);
			}
		}
	
//glossary
	function readGlossary (urlOpmlFile, glossary, callback) {
		var whenstart = new Date ();
		if ((urlOpmlFile !== undefined) && (urlOpmlFile.length > 0)) {
			twReadHttpWithProxy (urlOpmlFile, function (opmltext) { //8/26/16 by DW
				if (opmltext != undefined) {
					var xstruct = $($.parseXML (opmltext)), ctread = 0;
					var adropml = xmlGetAddress (xstruct, "opml");
					var adrbody = xmlGetAddress (adropml, "body");
					xmlOneLevelVisit (adrbody, function (adrx) {
						if (!xmlIsComment (adrx)) {
							var name = xmlGetTextAtt (adrx);
							if (name.length > 0) {
								var subtext = xmlGetSubText (adrx, false); //8/11/16 by DW -- don't add tabs and newlines to the glossary text
								ctread++;
								glossary [name] = subtext;
								}
							}
						return (true);
						});
					console.log ("readGlossary: read " + ctread + " items, " + secondsSince (whenstart) + " secs.");
					}
				if (callback !== undefined) {
					callback ();
					}
				});
			}
		else {
			if (callback !== undefined) {
				callback ();
				}
			}
		}
	function glossaryProcess (s) {
		s = multipleReplaceAll (s, glossary);
		return (s);
		}
//settings command
	
	function enableSettingsCommand () { //3/2/16 by DW
		var flSettingsEnabled = userIsSysop ();
		var flDisabled = $("#idSettingsMenuItem").hasClass ("disabled");
		if (flSettingsEnabled && flDisabled) {
			$("#idSettingsMenuItem").removeClass ("disabled");
			}
		else {
			if ((!flSettingsEnabled) && (!flDisabled)) {
				$("#idSettingsMenuItem").addClass ("disabled");
				}
			}
		}
	function setListFromString (s) { //2/20/16 by DW -- gIven a comma or space-separated string, return a list.
		var theList = [], acum = "";
		for (var i = 0; i < s.length; i++) {
			switch (s [i]) {
				case ",": case " ":
					if (acum.length > 0) {
						theList [theList.length] = acum;
						acum = "";
						}
					break;
				default:
					acum += s [i];
					break;
				}
			}
		if (acum.length > 0) {
			theList [theList.length] = acum;
			}
		return (theList);
		}
	function getStringFromList (theList) { //2/20/16 by DW -- return a comma-separated string from a list
		var s = "";
		for (var i = 0; i < theList.length; i++) {
			if (s.length > 0) {
				s += ",";
				}
			s += theList [i];
			}
		return (s);
		}
	
	function prefsOkClicked () { //11/23/15 by DW
		function getValuesFromDialog () {
			function consoler (obj) {
				console.log ("getValuesFromDialog: appPrefs." + obj.name + " == " + appPrefs [obj.name]);
				}
			var inputs = document.getElementById ("idPrefsDialog").getElementsByTagName ("input"), i;
			for (var i = 0; i < inputs.length; i++) {
				if (inputs [i].type == "checkbox") {
					appPrefs [inputs [i].name] = inputs [i].checked;
					}
				else {
					appPrefs [inputs [i].name] = inputs [i].value;
					}
				consoler (inputs [i]);
				}
			
			var textareas = document.getElementById ("idPrefsDialog").getElementsByTagName ("textarea"), i;
			for (var i = 0; i < textareas.length; i++) {
				appPrefs [textareas [i].name] = textareas [i].value;
				consoler (textareas [i]);
				}
			
			//8/10/16 by DW -- special deal for googleAnalyticsAccount
				try {
					if (trimWhitespace (appPrefs.googleAnalyticsAccount) == "") { //8/10/16 by DW
						delete appPrefs.googleAnalyticsAccount;
						}
					}
				catch (err) {
					}
			}
		function setChatLogMetadata () {
			var collabList = setListFromString (appPrefs.collaborators);
			
			myChatlogMetadata.usersWhoCanPost = collabList;
			
			myChatlogMetadata.rssHeadElements.title = appPrefs.rssTitle;
			myChatlogMetadata.rssHeadElements.link = appPrefs.rssLink;
			myChatlogMetadata.rssHeadElements.description = appPrefs.rssDescription;
			myChatlogMetadata.rssHeadElements.flInstantArticlesSupport = appPrefs.rssInstantArticlesSupport;
			myChatlogMetadata.rssHeadElements.appDomain = appConsts.domain;
			
			myChatlogMetadata.renderingPrefs.siteName = appPrefs.siteName;
			myChatlogMetadata.renderingPrefs.authorFacebookAccount = appPrefs.authorFacebookAccount;
			myChatlogMetadata.renderingPrefs.authorGithubAccount = appPrefs.authorGithubAccount;
			myChatlogMetadata.renderingPrefs.authorLinkedInAccount = appPrefs.authorLinkedInAccount;
			myChatlogMetadata.renderingPrefs.copyright = appPrefs.copyright;
			myChatlogMetadata.renderingPrefs.urlBlogHome = appPrefs.urlBlogHome;
			myChatlogMetadata.renderingPrefs.flAnyoneCanReply = appPrefs.flAnyoneCanReply;
			
			console.log ("setChatLogMetadata: myChatlogMetadata == " + jsonStringify (myChatlogMetadata));
			
			twSetChatLogMetadata (myChatlogMetadata, function (err, serverMetadata) {
				if (!err) {
					console.log ("prefsOkClicked: serverMetadata == " + jsonStringify (serverMetadata));
					}
				});
			}
		twSetPrefs (appPrefs, function () { //11/23/15 by DW
			console.log ("prefsOkClicked: Greetings from the new prefsOkClicked!");
			getValuesFromDialog (); 
			setChatLogMetadata (); //2/20/16 by DW
			prefsCloseDialog ();
			});
		}
	function settingsCommand () {
		if (userIsSysop ()) {
			twStorageToPrefs (appPrefs, function () {
				appPrefs.collaborators = getStringFromList (myChatlogMetadata.usersWhoCanPost); //2/20/16 by DW
				appPrefs.rssTitle = myChatlogMetadata.rssHeadElements.title;
				appPrefs.rssLink = myChatlogMetadata.rssHeadElements.link;
				appPrefs.rssDescription = myChatlogMetadata.rssHeadElements.description;
				appPrefs.rssInstantArticlesSupport = myChatlogMetadata.rssHeadElements.flInstantArticlesSupport; //3/4/16 by DW
				
				if (appPrefs.rssInstantArticlesSupport === undefined) { //3/4/16 by DW
					appPrefs.rssInstantArticlesSupport = false; //5/3/16 by DW -- changed to false
					}
				
				function setRenderingPref (namepref) {
					try {
						if (myChatlogMetadata.renderingPrefs [namepref] !== undefined) {
							appPrefs [namepref] = myChatlogMetadata.renderingPrefs [namepref];
							}
						}
					catch (err) {
						}
					}
				setRenderingPref ("siteName");
				setRenderingPref ("authorFacebookAccount");
				setRenderingPref ("authorGithubAccount");
				setRenderingPref ("authorLinkedInAccount");
				setRenderingPref ("copyright");
				setRenderingPref ("urlBlogHome");
				setRenderingPref ("template");
				setRenderingPref ("flAnyoneCanReply"); //3/1/16 by DW
				
				prefsDialogShow ();
				});
			}
		}
//viewing functions
	
	
	function itemIsTyped (item) {
		if ((item.payload !== undefined) && (item.payload.type !== undefined)  && (item.payload.type !== "blogpost")) {
			return (true);
			}
		return (false);
		}
	function viewLikes (logItem) { //5/23/16 by DW -- pulled out of viewOneItem
		if (appConsts.chatConfig.flLikes) {
			var ct = 0, likenames = "", thumbDirection = "up";
			if (logItem.likes !== undefined) {
				for (var x in logItem.likes) {
					if (x !== "undefined") { //11/21/15 by DW -- work around an early server bug
						ct++;
						likenames += x + ", ";
						}
					}
				}
			
			var thumbUp = "";
			if (userCanEdit ()) {
				thumbUp = "<span class=\"spThumb\"><a onclick=\"likeClick (" + logItem.id + ")\"><i class=\"fa fa-thumbs-" + thumbDirection + "\"></i></a></span>&nbsp;";
				}
			
			var ctLikes = ct + " like";
			if (ct != 1) {
				ctLikes += "s";
				}
			if (ct > 0) {
				likenames = stringMid (likenames, 1, likenames.length - 2); //pop off comma and blank at end
				ctLikes = "<span rel=\"tooltip\" title=\"" + likenames + "\">" + ctLikes + "</span>";
				}
			return ("<span class=\"spLikes\">" + thumbUp + ctLikes + "</span>");
			}
		else {
			return ("");
			}
		}
	function viewPopupMenu (logItem) { //5/23/16 by DW -- pulled out of viewOneItem
		if (appConsts.chatConfig.flPopupMenu) {
			var ct = ++popupSerialNumber;
			var popupMenuArray = [
				"<div class=\"dropdown\">",
					"<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"idPopup" + ct + "\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">",
						"<i class=\"fa fa-caret-down\"></i>",
						"</button>",
					"<ul class=\"dropdown-menu\" aria-labelledby=\"idPopup" + ct + "\">",
						"<li[rep]><a onclick=\"clickReplyMenuItem (" + logItem.id + ")\">Reply...</a></li>",
						"<li class=\"divider\"></li>",
						"<li[a]><a onclick=\"setTitleMenuItem (" + logItem.id + ")\">Set title...</a></li>",
						"<li[x]><a onclick=\"setImageMenuItem (" + logItem.id + ")\">Set image...</a></li>",
						"<li[a]><a onclick=\"setMetadataDialog (" + logItem.id + ")\">Set metadata...</a></li>", //9/4/16 by DW
						"<li[a]><a onclick=\"setEnclosureMenuItem (" + logItem.id + ")\">Set enclosure...</a></li>",
						"<li[x]><a onclick=\"insertHtmlMenuItem (" + logItem.id + ")\">Insert HTML...</a></li>",
						"<li[x]><a onclick=\"deleteMenuItem (" + logItem.id + ")\">Delete...</a></li>",
						"<li[a] [b] ><a onclick=\"publishCommand (" + logItem.id + ")\">Publish...</a></li>", 
						"<li class=\"divider\"></li>",
						"<li[j]><a onclick=\"viewJsonSource (" + logItem.id + ")\">View source...</a></li>",
						"<li class=\"divider\"></li>",
						"<li[xx]><a onclick=\"hideChatMessage (" + logItem.id + ")\">[y]</a></li>",
						"</ul>",
					"</div>"
				];
			var menutext = "";
			for (var i = 0; i < popupMenuArray.length; i++) {
				menutext += popupMenuArray [i]
				}
			
			//typed messages can be titled, have enclosures and be published --11/28/15 by DW
				var replacetext = "";
				if (logItem.name != twGetScreenName ()) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[a]", replacetext);
			//patch menutext so items are disabled if user doesn't have right to edit
				var replacetext = "";
				if ((logItem.name != twGetScreenName ()) || itemIsTyped (logItem)) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[x]", replacetext);
			//patch hide/unhide based on whether the message is hidden or not
				replacetext = "Hide";
				if (appPrefs.hiddenMessages [logItem.id] !== undefined) {
					replacetext = "Unhide";
					}
				menutext = replaceAll (menutext, "[y]", replacetext);
			//disable Hoist command if something is already hoisted
				replacetext = "";
				if (idHoistedPost !== undefined) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[z]", replacetext);
			//disable Bookmark, Hide commands if user can't edit -- 10/3/15 by DW
				replacetext = "";
				if ((!userCanEdit ()) || (!userCanPost ())) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[xx]", replacetext);
			
			//disable Reply -- 11/20/15 by DW
				replacetext = "";
				if ((!userCanEdit ()) || (!userCanReply ())) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[rep]", replacetext);
			
			//disable View Source command if there is no JSON linked into the item
				replacetext = "";
				if (logItem.urlJson === undefined) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[j]", replacetext);
			//disable Permalink command if there is no urlRendering element in payload -- 10/22/15 by DW
				replacetext = " class=\"disabled\"";
				if (hasBeenPublished (logItem)) {
					replacetext = "";
					}
				menutext = replaceAll (menutext, "[permalink]", replacetext);
			//if it has already been published disable the Publish command -- 12/26/15 by DW
				replacetext = "";
				if (hasBeenPublished (logItem)) {
					replacetext = " class=\"disabled\"";
					}
				menutext = replaceAll (menutext, "[b]", replacetext);
			
			return ("<span class=\"spPopupMenuIcon\" data-idmsg=\"" + logItem.id + "\">" + menutext + "</span>");
			}
		else {
			return ("");
			}
		}
	function viewPodcastIcon (logItem) { //11/11/15 by DW
		var s = "";
		if ((logItem.payload !== undefined) && (logItem.payload.enclosure !== undefined) && (logItem.payload.enclosure.url !== undefined)) {
			s = "<span class=\"spEnclosure\"><a href=\"" + logItem.payload.enclosure.url + "\" target=\"_blank\"><i class=\"fa fa-headphones\"></i></a></span>";
			}
		return (s);
		}
	function viewImage (logItem) { //5/24/16 by DW
		if ((logItem.payload !== undefined) && (logItem.payload.image !== undefined)) { 
			var height = ""; width = "";
			if (logItem.payload.imageHeight !== undefined) { //5/27/16 by DW
				height = " height=\"" + logItem.payload.imageHeight + "\" ";
				}
			if (logItem.payload.imageWidth !== undefined) { //5/27/16 by DW
				width = " width=\"" + logItem.payload.imageWidth + "\" ";
				}
			var img = "<img " + height + width + " style=\"float: right; margin-left: 24px; margin-top: 14px; margin-right: 14px; margin-bottom: 14px;\" src=\"" + logItem.payload.image +"\">";
			return (img);
			}
		return ("");
		}
	function viewReplyEditor (logItem) { //5/23/16 by DW -- pulled out of viewOneItem
		if (flReplying && (logItem.id == idItemBeingRepliedTo)) {
			var placeholder = "This is a good place to enter a reply.", submitButton = "";
			if (!flReturnPostsMessage) {
				submitButton = "<button id=\"idEditSubmitButton\" class=\"btn btn-primary btnEditSubmit\" onclick=\"postChatMessage ()\"><i class=\"fa fa-check\"></i>&nbsp;Post</button>";
				}
			flAddedTextarea = true;
			
			
			var classToAddToObject = "editReplyTextArea commentEditor", itemtext = "";
			return ("<div class=\"autosizeable " + classToAddToObject + "\" id=\"" + "idEditReplyTextArea" + "\">" + itemtext + "</div>");
			
			}
		else {
			return ("");
			}
		}
	
	
	function addChatlogEventHandlers () {
		
		
		$(document).on ("click", function () {
			console.log ("You clicked on document.");
			if (flClickOutsideCancelsEdit) {
				cancelEdit ();
				}
			else {
				}
			});
		$("#idTextArea").on ("click", function () {
			console.log ("You clicked on #idTextArea.");
			autosize (this); 
			});
		$("#idTextArea").keyup (function (event) {
			console.log ("Keyup in #idTextArea.");
			autosize (this);
			});
		$(".editInPlaceTextArea").click (function (event) {
			savedSelectionInPlaceEditor = inPlaceMediumEditor.exportSelection ();
			console.log ("You clicked on editInPlaceTextArea, savedSelectionInPlaceEditor == " + jsonStringify (savedSelectionInPlaceEditor));
			event.stopPropagation ();
			});
		$(".editReplyTextArea").click (function (event) {
			console.log ("You clicked on editReplyTextArea.");
			event.stopPropagation ();
			});
		$(".editInPlaceTextArea, .editReplyTextArea").keyup (function (event) { //1/9/16 by DW
			if (event.which == 27) { //escape key
				cancelEdit ();
				event.stopPropagation ();
				}
			});
		$(".divClickableMsg, .spEditIcon").on ("click", function (event) {
			var idmsg = $(this).data ("idmsg");
			console.log ("You clicked on a .divClickableMsg or a .spEditIcon, iidmsg == " + idmsg);
			cancelEdit (); //if you were editing another message, cancel the edit -- 10/23/15 by DW
			clickEditIcon (idmsg);
			event.stopPropagation ();
			});
		$(".spReplyIcon").on ("click", function (event) {
			var idmsg = $(this).data ("idmsg");
			console.log ("You clicked on a .spReplyIcon, it's idmsg == " + idmsg);
			clickReplyIcon (idmsg);
			event.stopPropagation ();
			});
		$(".spBookmarkIcon").on ("click", function (event) {
			var idmsg = $(this).data ("idmsg");
			console.log ("You clicked on a .spBookmarkIcon, it's idmsg == " + idmsg);
			clickBookmarkIcon (idmsg);
			event.stopPropagation ();
			});
		$(".myTextArea").on ("click", function (event) {
			console.log ("You clicked on a .myTextArea");
			cancelEdit (); //if you were editing another message, cancel the edit -- 10/23/15 by DW
			if (idHoistedPost !== undefined) { //something is hoisted
				dehoistAll ();
				}
			event.stopPropagation ();
			});
		}
	function finishViewChatLog () {
		if (flAddedTextarea) { //in-place editor was created, make it behave like one, auto-resize, handle Return, etc
			setupTextArea ();
			if (flReplying) {
				replyMediumEditor = newMediumEditor (".editReplyTextArea", "Hello Dolly well hello Dolly...");
				$("#idEditSubmitButton").css ("display", "block");
				$("#idEditReplyTextArea").focus ();
				}
			else {
				if (flAddedSubmitButton) {
					$("#idEditSubmitButton").css ("display", "block");
					}
				inPlaceMediumEditor = newMediumEditor (".editInPlaceTextArea", "This is a good place to tell your story...");
				$("#idEditInPlaceTextArea").focus ()
				}
			flAddedSubmitButton = false; //consume it
			flAddedTextarea = false; //consume it
			}
		addChatlogEventHandlers ();
		$(".divTweetViewer").each (function () {
			var idtweet = $(this).data ("idtweet");
			var idobject = $(this).attr ("id");
			console.log ("Found a tweet with id == " + idtweet + ". the id of the object == " + $(this).attr ("id"));
			if (true) {
				twViewTweet (idtweet, idobject, function () {
					$("#" + idobject).on ("load", function () { //the div holding for the tweet becomes visible when fully loaded
						$("#" + idobject).css ("visibility", "visible");
						});
					});
				}
			
			
			});
		$(".divOutlineDisplayer").each (function () { //10/8/15 by DW
			var urlOpml = $(this).data ("urlopml");
			var idobject = $(this).attr ("id");
			console.log ("Found a outline with url == " + urlOpml + ". the id of the object == " + idobject);
			readOpmlFile (urlOpml, idobject);
			});
		$(".divInstantOutline").each (function () { //7/4/16 by DW
			var url = $(this).data ("url");
			var idoutliner = $(this).data ("idoutliner");
			console.log ("Found an instant outline with url == " + url + ". the id of the outliner == " + idoutliner);
			
			viewInstantOutline (url, idoutliner, function () {
				console.log ("finishViewChatLog: viewInstantOutline returned.");
				});
			
			
			});
		$('[rel="tooltip"]').tooltip ();
		$(".commentEditor").keydown (function (event) {
			whenLastUserAction = new Date ();
			if (event.which == 13) {
				if (!event.shiftKey) {
					if (true) { //if (flReturnPostsMessage) {
						postChatMessage ();
						flReturnPostsMessage = false;
						setPostType ("");
						return (false);
						}
					}
				}
			return (true);
			});
		nukeDisabledMenuItems (); //11/16/15 by DW
		
		}
	function viewOneItem (urlIcon, myArray, ixInArray, replyLevel, personName, logItem) {
		if (logItem === undefined) {
			logItem = myArray [ixInArray];
			}
		if (personName === undefined) {
			if (userDataCache [logItem.name] !== undefined) {
				personName = userDataCache [logItem.name].name;
				}
			else {
				personName = logItem.name;
				}
			}
		var flNotTwitterName = logItem.flNotTwitterName;
		var person = "<span class=\"spPersonName\">" + personName + "</span>";
		var urlTwitterProfile = "http://twitter.com/" + logItem.name, itemtext;
		var screen = "", itemclass = "divChatItem", htmltext = "", indentlevel = 0, msgtext, replyeditor = "", flItemHasTitle = false;
		var escToCancel = "<div class=\"divEscToCancel\">Esc to cancel</div>";
		
		function getItemText () {
			var text = logItem.text;
			
			text = emojiProcess (text); //11/29/15 by DW -- do this as the item is being displayed, instead of as it's being posted
			text = processMacros (undefined, text); //9/12/16 by DW
			
			if ((!flNotTwitterName) && (twGetScreenName () == logItem.name)) { //you can only edit items created by real users, not webhooks
				text = "<div class=\"divClickableMsg\" data-idmsg=\"" + logItem.id + "\">" + text + "</div>";
				}
			else {
				text = "<div class=\"divNotClickableMsg\">" + text + "</div>";
				}
			text = viewImage (logItem) + text; //5/24/16 by DW
			return (text);
			}
		function getBookmarkIcon () {
			return ("<span class=\"spBookmarkIcon\" data-idmsg=\"" + logItem.id + "\"><a title=\"Click to bookmark to this post.\"><i class=\"fa fa-bookmark\"></i></a></span>");
			}
		function getEditIcon () {
			var icontext = "";
			if (!flNotTwitterName) { //you can only edit items created by real users, not webhooks
				if (twGetScreenName () == logItem.name) { 
					icontext = "<a title=\"Click to edit this post.\"><i class=\"fa fa-edit\"></i></a>";
					}
				}
			if (icontext.length > 0) {
				icontext = "<span class=\"spEditIcon\" data-idmsg=\"" + logItem.id + "\">" + icontext + "</span>";
				}
			return (icontext);
			}
		function getReplyIcon () {
			return ("<span class=\"spReplyIcon\" data-idmsg=\"" + logItem.id + "\"><a title=\"Click to reply to this post.\"><i class=\"fa fa-reply\"></i></a></span>");
			}
		function getEyeIcon () {
			if (appConsts.chatConfig.flEyeIcon) {
				if (hasBeenRendered (logItem)) {
					var theLink = createChatLogLink (logItem.payload.urlRendering, "<i class=\"fa fa-eye\"></i>"); //2/18/16 by DW
					
					
					return ("<span class=\"spEyeIcon\">" + theLink + "</span>");
					}
				}
			return ("");
			}
		function getWhen () {
			var when = "<span class=\"spWhen\" id=\"idWhen" + logItem.id + "\">" + getFacebookTimeString (logItem.when) + "</span>";
			return (when);
			}
		function getInPlaceEditor (classToAddToObject, itemtext) {
			var idMyObject = "idEditInPlaceTextArea";
			if (classToAddToObject === undefined) {
				classToAddToObject = "";
				}
			if (itemtext === undefined) {
				itemtext = "";
				}
			return ("<div class=\"divInPlaceEditor autosizeable " + classToAddToObject + "\" id=\"" + idMyObject + "\">" + itemtext + "</div>");
			}
		function getPostTitle () {
			var theTitle = "";
			if ((logItem.payload !== undefined) && (logItem.payload.title !== undefined)) {
				theTitle = maxLengthString (logItem.payload.title, appConsts.chatConfig.maxTitleDisplayLength);
				if (hasBeenRendered (logItem)) {
					theTitle = createChatLogLink (logItem.payload.urlRendering, theTitle); //2/18/16 by DW
					}
				theTitle = "<span class=\"spPostTitle\">" + theTitle + "</span>";
				flItemHasTitle = true;
				}
			return (theTitle);
			}
		function getPerson () { //12/27/15 by DW
			if (appConsts.chatConfig.flShowAuthorName) {
				var by = "";
				if (flItemHasTitle) {
					by = " by ";
					}
				return (by + "<span class=\"spPersonName\">" + personName + "</span>");
				}
			else {
				return ("");
				}
			}
		function getScreenName () { //12/27/15 by DW
			if (appConsts.chatConfig.flShowAuthorTwitterName) {
				if (flNotTwitterName) {
					return ("");
					}
				else {
					return ("<span class=\"spScreenName\"><a href=\"" + urlTwitterProfile + "\">@" + logItem.name + "</a></span>");
					}
				}
			else {
				return ("");
				}
			}
		function getIcon () { //12/28/15 by DW
			if (appConsts.chatConfig.flMessageIcon) {
				if (urlIcon !== undefined) {
					if (!itemIsReply (logItem)) {
						return ("<img src=\"" + urlIcon + "\">");
						}
					}
				}
			return ("");
			}
		function add (s) {
			htmltext +=  s;
			}
		
		if (itemIsHidden (logItem) || itemIsDeleted (logItem)) { //11/30/15 by DW
			return ("");
			}
		//set msgtext -- different if it's a tweet, or editing vs not editing vs replying
			if (itemIsTyped (logItem)) {
				switch (logItem.payload.type) {
					case "opml": //10/8/15 by DW
						var idOpmlObject = "idOpml" + opmlSerialNumber++;
						msgtext = "<div class=\"divOutlineFrame\"><div class=\"divOutlineContainer\"><div class=\"divOutlineDisplayer\" data-urlopml=\"" + logItem.payload.url + "\" id=\"" + idOpmlObject + "\"></div></div></div>";
						break;
					case "tweet":
						var idtweetobject = "idTweetViewer" + logItem.payload.idTweet;
						msgtext = "<div class=\"divTweetViewer\" data-idtweet=\"" + logItem.payload.idTweet + "\" id=\"" + idtweetobject + "\"></div>";
						break;
					case "image": //11/5/15 by DW
						var maxImgWidth = 600;
						var imgWidth = logItem.payload.width, imgHeight = logItem.payload.height;
						if (imgWidth > maxImgWidth) {
							var ratio = maxImgWidth / imgWidth;
							imgWidth = maxImgWidth;
							imgHeight = Math.floor (ratio * imgHeight);
							}
						msgtext = "<div class=\"divImageViewer\"><img src=\"" + logItem.payload.url + "\" width=\"" + imgWidth + " height=\"" + imgHeight + "\"></div>";
						break;
					
					case "instantOutline": //7/4/16 by DW
						var idOutliner = "idInstantOutline" + instantOutlineSerialNumber++;
						msgtext = "<div class=\"divInstantOutline\" data-url=\"" + logItem.payload.url + "\" data-idoutliner=\"" + idOutliner + "\"><div id=\"" + idOutliner + "\"></div></div>";
						break;
					
					default:
						msgtext = "<p>Unsupported payload type == " + logItem.payload.type + ".</p>";
						break;
					}
				replyeditor = viewReplyEditor (logItem);
				}
			else {
				if (flEditingItem && (logItem.id == idItemBeingEdited)) {
					var submitButton = "";
					
					itemclass += " divItemBeingEdited";
					
					if (logItem.payload.sourcetext !== undefined) {
						itemtext = logItem.payload.sourcetext;
						}
					else {
						itemtext = trimWhitespace (logItem.text);
						}
					
					var editingTextArea = "<textarea class=\"editInPlaceTextArea commentEditor autosizeable\" id=\"idEditInPlaceTextArea\">" + itemtext + "</textarea>";
					
					if (itemIsBlogpost (logItem)) {
						submitButton = "<button id=\"idEditSubmitButton\" class=\"btn btn-primary btnEditSubmit\" onclick=\"submitEditButtonClick ()\"><i class=\"fa fa-check\"></i>&nbsp;Update</button>";
						flReturnPostsMessage = false;
						flAddedSubmitButton = true; //need to make it visible
						editingTextArea = getInPlaceEditor ("editInPlaceTextArea", itemtext);
						}
					else {
						flReturnPostsMessage = true;
						editingTextArea = getInPlaceEditor ("editInPlaceTextArea commentEditor", itemtext);
						}
					
					msgtext = "<div class=\"divMsgText\">" + editingTextArea + "</div>" + submitButton + escToCancel;
					flAddedTextarea = true;
					}
				else {
					replyeditor = viewReplyEditor (logItem);
					msgtext = "<div class=\"divMsgText\">" + getItemText () + "</div>";
					}
				}
			
			if (messageIsHidden (logItem.id)) {
				msgtext = "<div class=\"divHiddenMessage\">" + msgtext + "</div>";
				}
			
		if (replyLevel === undefined) {
			replyLevel = 0;
			}
		
		add ("<div class=\"" + itemclass + "\" id=\"idItem" + logItem.id + "\">"); indentlevel++;
		add ("<div class=\"divChatIcon\"><center>" + getIcon () + "</center></div>");
		
		//add divChatText
			add ("<div class=\"divChatText\">"); indentlevel++;
			add ("<div class=\"divTopMsgLine\">" + getPostTitle () + getPerson () + getScreenName () + getWhen () + viewPopupMenu (logItem) + viewPodcastIcon (logItem) + getEyeIcon () + viewLikes (logItem) + "</div>");
			add (msgtext);
			add ("</div>"); indentlevel--;
		
		if ((logItem.subs !== undefined) && (!messageIsHidden (logItem.id))) {
			if (appConsts.chatConfig.flShowReplies) {
				if ((logItem.subs.length > 0) || (replyeditor.length > 0)) {
					add ("<div class=\"divReplies divReplyLevel" + replyLevel + "\">"); indentlevel++;
					for (var i = 0; i < logItem.subs.length; i++) {
						add (viewOneItem (undefined, logItem.subs, i, replyLevel + 1));
						}
					if (replyeditor.length > 0) {
						add (replyeditor);
						replyeditor = "";
						}
					add ("</div>"); indentlevel--;
					}
				}
			}
		
		if (replyeditor.length > 0) {
			add ("<div class=\"divReplies\">" + replyeditor + "</div>");
			}
		
		add ("</div>"); indentlevel--;
		return (htmltext);
		}
	function viewChatLog (idChatLogDisplay, callback) {
		var htmltext = "", indentlevel = 0, whenstart = new Date (), log = myChatlogCopy;
		if (idChatLogDisplay === undefined) {
			if (idHoistedPost !== undefined) {
				idChatLogDisplay = idHoistDisplay;
				}
			else {
				idChatLogDisplay = "idChatLog"
				}
			}
		popupSerialNumber = 0;
		opmlSerialNumber = 0;
		instantOutlineSerialNumber = 0; //7/4/16 by DW
		function add (s) {
			htmltext +=  filledString ("\t", indentlevel) + s + "\n";
			}
		function addNextItem (ix) {
			if (ix < 0) {
				add ("</div>"); indentlevel--;
				$("#" + idChatLogDisplay).html (htmltext);
				finishViewChatLog ();
				console.log ("viewChatLog: took " + secondsSince (whenstart) + " secs.");
				}
			else {
				var item = log [ix];
				if (itemIsDeleted (item)) {
					addNextItem (ix - 1);
					}
				else {
					if (getBoolean (item.flNotTwitterName)) {
						var iconUrl = item.iconUrl;
						var iconEmoji = item.iconEmoji;
						var name = item.name;
						
						if (iconUrl === undefined) {
							if (iconEmoji === undefined) {
								iconUrl = urlClarus; 
								}
							else {
								iconEmoji = trimWhitespace (iconEmoji);
								if (beginsWith (iconEmoji, ":")) {
									iconEmoji = stringDelete (iconEmoji, 1, 1);
									}
								if (endsWith (iconEmoji, ":")) {
									iconEmoji = stringMid (iconEmoji, 1, iconEmoji.length - 1);
									}
								iconUrl = urlEmojiImages + iconEmoji + ".png"; 
								}
							}
						add (viewOneItem (iconUrl, log, ix));
						addNextItem (ix - 1);
						}
					else {
						getUserIcon (item.name, function (urlIcon, personName) {
							add (viewOneItem (urlIcon, log, ix, undefined, personName));
							addNextItem (ix - 1);
							});
						}
					}
				}
			}
		
		add ("<div class=\"divChatLogItems\">"); indentlevel++;
		if (idHoistedPost !== undefined) {
			var theName = nameChatlogHoistedPost;
			if (theName === undefined) {
				theName = getCurrentChatLog ();
				}
			twGetChatMessage (idHoistedPost, theName, function (hoistedItem) {
				console.log ("viewChatLog: hoistedItem == " + jsonStringify (hoistedItem));
				log = [hoistedItem];
				addNextItem (0);
				if (callback !== undefined) { //10/10/15 by DW
					callback (hoistedItem);
					}
				});
			}
		else {
			addNextItem (log.length - 1);
			}
		
		}
//publish
	var urlPageStyles = "http://1999.io/dev/publish/styles.css";
	var urlPageCode = "http://1999.io/dev/publish/code.js";
	
	function getDisqusCommentsText (item, thispageurl, disqusGroup) { //8/28/16 by DW
		var s = "";
		if (disqusGroup === undefined) {
			disqusGroup = appPrefs.disqusGroup;
			}
		if ((appPrefs.flDisqusComments) || getBoolean (item.payload.flDisqusComments)) {
			var disqusTextArray = [
				"\n<div class=\"divDisqusComments\">\n",
					"\t<div id=\"disqus_thread\"></div>\n",
					"\t<script>\n",
						"\t\tvar disqus_config = function () {\n",
							"\t\t\tthis.page.url = \"" + thispageurl + "\"; \n",
							"\t\t\t};\n",
						"\t\t(function () {  \n",
							"\t\t\tvar d = document, s = d.createElement ('script');\n",
							"\t\t\ts.src = '//" + disqusGroup + ".disqus.com/embed.js';  \n",
							"\t\t\ts.setAttribute ('data-timestamp', +new Date());\n",
							"\t\t\t(d.head || d.body).appendChild(s);\n",
							"\t\t\t})();\n",
						"\t\t</script>\n",
					"\t</div>\n"
				];
			for (var i = 0; i < disqusTextArray.length; i++) {
				s += disqusTextArray [i];
				}
			console.log ("getDisqusCommentsText: " + s);
			}
		return (s)
		}
	
	function processMacros (pagetable, s) { //8/8/16 by DW
		var macroStart = "{" + "%", macroEnd = "%" + "}"; 
		var i = 0;
		
		function decode (s) {
			var atQuote = "&" + "quot;";
			macrotext = replaceAll (macrotext, atQuote, "'"); //9/12/16 by DW -- the wizzy editor encodes double quote as "
			return (macrotext);
			}
		
		function embedTweet (id) {
			return ("this is an embedded tweet whose ID == " + id);
			}
		
		function process (s) {
			try {
				var val = eval (s);
				if (val instanceof Date) { //12/12/13 by DW
					return (formatDate (val, footerDateFormat)); 
					
					}
				return (val.toString ());
				}
			catch (err) {
				if (!endsWith (err.message, " is not defined")) {
					console.log ("processMacros error on \"" + s + "\": " + err.message);
					}
				return (macroStart + s + macroEnd); //pass it back unchanged
				}
			};
		while (i < (s.length - 1)) {
			if (s [i] == "{") {
				if (s [i+1] == "%") {
					var j, flfound = false;
					for (var j = i + 2; j <= s.length - 2; j++) {
						if ((s [j] == "%") && (s [j+1] == "}")) {
							var macrotext = stringMid (s, i + 3, j - i - 2);
							macrotext = decode (macrotext); //9/12/16 by DW
							macrotext = process (macrotext);
							s = stringDelete (s, i + 1, j - i + 2);
							s = stringInsert (macrotext, s, i);
							i += macrotext.length;
							flfound = true;
							break;
							}
						}
					if (!flfound) {
						break;
						}
					}
				else {
					i += 2;
					}
				}
			else {
				i++;
				}
			}
		return (s);
		}
	function viewSocialMediaLinks (pagetable) {
		var htmltext = "", indentlevel = 0;
		function add (s) {
			htmltext += filledString ("\t", indentlevel) + s + "\n";
			}
		function addlink (id, url, icon, color) {
			add ("<a class=\"aSocialMediaLink\" id=\"" + id + "\" href=\"" + url + "\" target=\"_blank\"><i class=\"fa fa-" + icon + "\" style=\"color: " + color + "; font-weight: bold;\"></i></a>");
			}
		function haveString (theAccount) { //4/1/16 by DW
			if (theAccount !== undefined) {
				if (theAccount.length > 0) {
					return (true);
					}
				}
			return (false);
			}
		addlink ("idTwitterLink", "http://twitter.com/" + pagetable.twitterscreenname, "twitter", "#4099FF");
		
		if (haveString (pagetable.authorFacebookAccount)) { //11/18/15 by DW
			addlink ("idFacebookLink", "http://facebook.com/" + pagetable.authorFacebookAccount, "facebook", "#4C66A4");
			}
		if (haveString (pagetable.authorGithubAccount)) { //2/17/14 by DW
			addlink ("idGithubLink", "http://github.com/" + pagetable.authorGithubAccount, "github", "black");
			}
		if (haveString (pagetable.authorLinkedInAccount)) { //3/16/14 by DW
			addlink ("idLinkedInLink", "http://www.linkedin.com/in/" + pagetable.authorLinkedInAccount, "linkedin", "#069");
			}
		
		
		if (haveString (pagetable.urlRssFeed)) {
			addlink ("idRssLink", pagetable.urlRssFeed, "rss", "orange");
			}
		return (htmltext);
		}
	function getTemplateText (callback, templateOpmltext) { //5/13/16 by DW
		function getServerDefaultTemplate () {
			var urlTemplate = appConsts.urlPageTemplate;
			if (appConsts.urlTwitterServer !== undefined) {
				var urlServer = appConsts.urlTwitterServer;
				if (endsWith (urlServer, "/")) {
					urlServer = stringMid (urlServer, 1, urlServer.length - 1);
					}
				urlTemplate = urlServer + urlTemplate; //assume the template url begins with /
				}
			readHttpFile (urlTemplate, function (templatetext) {
				console.log ("getServerDefaultTemplate: read the template from " + urlTemplate + ", chars == " + templatetext.length);
				callback (templatetext);
				});
			}
		if (templateOpmltext !== undefined) {
			callback (xmlGetStringFromOutline (templateOpmltext));
			}
		else { 
			twGetFile (templatePathHtml, true, false, function (err, data) { //5/16/16 by DW
				if (data !== undefined) {
					callback (data.filedata.toString ());
					}
				else {
					if (myChatlogMetadata.renderingPrefs.urlOpmlTemplate === undefined) {
						getServerDefaultTemplate ();
						}
					else {
						readHttpFile (myChatlogMetadata.renderingPrefs.urlOpmlTemplate, function (opmltext) {
							if (opmltext === undefined) { //there was an error
								getServerDefaultTemplate ();
								}
							else {
								callback (xmlGetStringFromOutline (opmltext));
								}
							});
						}
					}
				});
			}
		}
	function initPagetable (pagetable) { //3/3/16 by DW
		copyScalars (appConsts, pagetable); //3/20/16 by DW
		copyScalars (appPrefs, pagetable);
		copyScalars (myChatlogMetadata.renderingPrefs, pagetable); //3/4/16 by DW
		if (pagetable.opmlBookmarks !== undefined) {
			delete pagetable.opmlBookmarks;
			}
		if (pagetable.opmlTemplate !== undefined) { //2/22/16 by DW
			delete pagetable.opmlTemplate;
			}
		pagetable.nameChatLog = getCurrentChatLog (); //11/23/15 by DW -- we could be editing in the story page
		pagetable.urlPageStyles = urlPageStyles;
		pagetable.urlPageCode = urlPageCode;
		pagetable.flHomePage = false;
		pagetable.urlRssFeed = myChatlogMetadata.urlFeed; //4/1/16 by DW
		pagetable.defaultTitleStyle = ""; //4/2/16 by DW
		pagetable.urlImage = ""; //4/14/16 by DW
		pagetable.disqusComments = ""; //8/28/16 by DW
		delete pagetable.lastInsertedHtmltext; //5/6/16 AM by DW -- syntax errors in this element can cause problems in rendered page
		}
	function isItemPublished (item) {
		if ((item.payload !== undefined) && (item.payload.flPublished !== undefined)) {
			return (item.payload.flPublished);
			}
		return (false);
		}
	function publishArchivePage (theMonth, pathToPage, maxPageItems, callback) {
		var theLog = {
			chatLog: myChatlogCopy
			};
		if (maxPageItems === undefined) {
			maxPageItems = 35;
			}
		function getPostTitle (item) {
			var theTitle = "";
			if ((item.payload !== undefined) && (item.payload.title !== undefined)) {
				return (item.payload.title);
				}
			return (theTitle);
			}
		function getUrlRendering (item) {
			if ((item.payload !== undefined) && (item.payload.urlRendering !== undefined)) {
				return (item.payload.urlRendering);
				}
			return ("");
			}
		function formatDateTime (d) {
			d = new Date (d);
			return (d.toLocaleDateString () + " at " + d.toLocaleTimeString ());
			}
		function itemQualifies (item) { //5/29/16 by DW
			if (theMonth === undefined) { //it's the home page
				return (true);
				}
			else {
				return (sameMonth (item.when, theMonth));
				}
			}
		
		if (theLog !== undefined) {
			var htmltext = "", indentlevel = 0, whenstart = new Date (), ctItems = 0;
			function add (s) {
				htmltext +=  filledString ("\t", indentlevel) + s + "\n";
				}
			if (theMonth !== undefined) {
				add ("<div class=\"divArchivePageTitle\">Archive page for " + formatDate (theMonth, "%B %Y") + "</div>");
				}
			add ("<style>.divChatLog {margin-left: 0;}</style>"); //override the setting of -73px
			add ("<div class=\"divBlogPostList\">"); indentlevel++;
			for (var i = theLog.chatLog.length - 1; i >= 0; i--) {
				if (ctItems >= maxPageItems) {
					break;
					}
				var item = theLog.chatLog [i];
				if (itemQualifies (item)) {
					if (isItemPublished (item)) {
						if (!itemIsDeleted (item)) {
							var urlRendering = getUrlRendering (item), author = item.name;
							add ("<div class=\"divBlogPost\" data-id=\"" + item.id + "\">"); indentlevel++;
							add ("<div class=\"divBlogPostTitle\"><a href=\"" + urlRendering + "\">" + emojiProcess (getPostTitle (item)) + "</a></div>");
							add ("<div class=\"divBlogPostBody\">" + viewImage (item) + emojiProcess (item.text) + "</div>");
							add ("<div class=\"divBlogPostWhen\"><a href=\"" + urlRendering + "\">" + formatDateTime (item.when) + " by " + author + "</a></div>");
							add ("</div>\n\n"); indentlevel--;
							ctItems++;
							}
						}
					}
				}
			add ("</div>"); indentlevel--;
			getTemplateText (function (templatetext) {
				templatetext = replaceAll (templatetext, "\r", "\n"); //so we can read the source in Chrome -- 5/4/16 by DW
				var pagetable = new Object ();
				initPagetable (pagetable); 
				pagetable.twitterscreenname = twGetScreenName (); //4/1/16 by DW
				pagetable.defaultTitleStyle = " style=\"display: none;\" "; //4/2/16 by DW
				pagetable.title = pagetable.siteName;
				pagetable.flHomePage = true;
				pagetable.text = htmltext;
				pagetable.pagetableInJson = jsonStringify (pagetable);
				var pagetext = multipleReplaceAll (templatetext, pagetable, false, "[%", "%]");
				
				if (theMonth === undefined) { //the home page of the site -- 5/29/16 by DW
					twPublishChatLogHomePage (getCurrentChatLog (), pagetext, function (data) {
						if (data !== undefined) {
							console.log ("publishHomePage: data == " + jsonStringify (data));
							}
						if (callback !== undefined) {
							callback ();
							}
						});
					}
				else {
					twChatLogPublish (getCurrentChatLog (), pathToPage, pagetext, "text/html", function (data) {
						if (data !== undefined) {
							console.log ("publishHomePage: data == " + jsonStringify (data));
							}
						if (callback !== undefined) {
							callback ();
							}
						});
					}
				});
			}
		}
	function publishHomePage (callback) { //5/29/16 by DW
		publishArchivePage (undefined, undefined, undefined, callback);
		}
	function publishThisMonthsArchivePage (callback) { //5/29/16 by DW
		var when = new Date ();
		if (myChatlogCopy.length > 0) {
			when = new Date (myChatlogCopy [myChatlogCopy.length - 1].when);
			}
		var path = when.getFullYear () + "/" + padWithZeros (when.getMonth () + 1, 2) + "/index.html";
		publishArchivePage (when, path, Infinity, callback);
		}
	function publishItemMonthlyArchivePage (item, callback) { //5/31/16 by DW
		var when = new Date (item.when);
		var path = when.getFullYear () + "/" + padWithZeros (when.getMonth () + 1, 2) + "/index.html";
		publishArchivePage (when, path, Infinity, callback);
		}
	
	function publishMessage (idMessage, callback, templateOpmltext) {
		getTemplateText (function (pageTemplateText) {
			pageTemplateText = replaceAll (pageTemplateText, "\r", "\n"); //so we can read the source in Chrome -- 5/4/16 by DW
			
			
			var pagetable = new Object (), now = new Date ();
			initPagetable (pagetable); //3/3/16 by DW
			findPrevNextMessage (idMessage, function (prev, next) {
				pagetable.prev = prev;
				pagetable.next = next;
				
				findOrGetChatMessage (idMessage, function (item) {
					function getDescription (item) {
						var s = replaceAll (item.text, "&nbsp;", " "); //10/26/16 by DW
						s = encodeXml (stripMarkup (s));
						s = replaceAll (s, "[%", "&#91;&#37;"); //8/29/16 by DW
						return (s);
						}
					function getSubsText (item, level) {
						var substext = "", sub;
						function add (s) {
							substext += filledString ("\t", level) + s + "\n";
							}
						if (level === undefined) {
							level = 0;
							}
						if (item.subs !== undefined) {
							add ("<ul>");
							for (var i = 0; i < item.subs.length; i++) {
								sub = item.subs [i];
								add ("<li>" + sub.text + "</li>");
								add (getSubsText (sub, level + 1))
								}
							add ("</ul>");
							}
						return (substext);
						}
					pagetable.title = "";
					pagetable.item = item; //11/15/15 by DW
					if (item.payload !== undefined) {
						if (item.payload.title !== undefined) { //11/15/15 by DW
							pagetable.title = item.payload.title;
							}
						if (item.payload.image !== undefined) { //4/14/16 by DW
							pagetable.urlImage = item.payload.image;
							}
						//imageForMeta -- 8/27/16 by DW
							if ((item.payload.imageForMeta !== undefined) && (item.payload.imageForMeta.length > 0)) { //10/25/16 by DW
								pagetable.imageForMeta = item.payload.imageForMeta;
								}
							else {
								if ((appPrefs.defaultImageForMeta !== undefined) && (appPrefs.defaultImageForMeta.length > 0)) { //9/11/16 by DW & 10/25/16 by DW
									pagetable.imageForMeta = appPrefs.defaultImageForMeta;
									}
								else {
									if (pagetable.urlImage !== undefined) {
										pagetable.imageForMeta = pagetable.urlImage;
										}
									else {
										pagetable.imageForMeta = "";
										}
									}
								}
						}
					getUserInfo (item.name, function (userinfo) {
						function wrapInChatLogDivs (pagetext) {
							var htmltext = "", indentlevel = 0;
							function add (s) {
								htmltext += filledString ("\t", indentlevel) + s + "\n";
								}
							
							var urlTwitterUser = "<a href=\"http://twitter.com/" + pagetable.twitterscreenname + "\" target=\"_blank\">" + pagetable.personName + "</a>"; //ccc
							
							add ("<div class=\"divStaticChatLogItems\">"); indentlevel++; 
							add ("<div class=\"divChatLogItems\">"); indentlevel++; //5/27/16 by DW -- was divChatItem, a mistake
							add ("<div class=\"divChatItem\">"); indentlevel++;
							add ("<div class=\"divChatIcon\"></div>");
							add ("<div class=\"divChatText\">"); indentlevel++;
							
							add ("<div class=\"divTopMsgLine\">"); indentlevel++;
							add ("by <span class=\"spPersonName\">" + urlTwitterUser + "</span>");
							add ("<span class=\"spWhen\">" + pagetable.whenPosted + "</span>");
							add ("</div>"); indentlevel--;
							
							add ("<div class=\"divMsgText\">" + viewImage (pagetable.item) + pagetext + "</div>"); 
							add ("<div class=\"divMessageReplies\">" + pagetable.replies + "</div>"); 
							add ("</div>"); indentlevel--;
							add ("</div>"); indentlevel--;
							add ("</div>"); indentlevel--;
							add ("</div>"); indentlevel--;
							
							return (htmltext);
							}
						function pagetableReplace (s) {
							return (multipleReplaceAll (s, pagetable, false, "[%", "%]"));
							}
						
						//pagetable.personName -- 11/6/16 by DW
							if ((appPrefs.authorName !== undefined) && (appPrefs.authorName.length > 0)) {
								pagetable.personName = appPrefs.authorName; 
								}
							else {
								pagetable.personName = userinfo.name; 
								}
							pagetable.personName = trimWhitespace (pagetable.personName);
						
						pagetable.profileImageUrl = userinfo.profile_image_url; //1/15/16 by DW
						pagetable.whenPosted = formatDate (item.when, "%A, %B %e, %Y");
						if (item.payload.urlRendering !== undefined) {
							pagetable.thispageurl = item.payload.urlRendering;
							}
						pagetable.description = getDescription (item);
						pagetable.twitterscreenname = item.name;
						pagetable.replies = getSubsText (item);
						
						pagetable.urlHtmlMenubar = myChatlogMetadata.renderingPrefs.urlHtmlMenubar; //2/28/16 by DW
						
						pagetable.pagetableInJson = jsonStringify (pagetable);
						
						//special dyanmic elements -- 5/23/16 by DW
							pagetable.whenPart = "<span class=\"spWhen\" id=\"idWhen" + idMessage + "\">" + getFacebookTimeString (item.when) + "</span>";
							pagetable.likesPart = viewLikes (item);
							pagetable.popupPart = viewPopupMenu (item);
							pagetable.podcastPart = viewPodcastIcon (item);
							pagetable.twitterNamePart = "<a href=\"http://twitter.com/" + pagetable.twitterscreenname + "\">@" + pagetable.twitterscreenname + "</a>";
							pagetable.personNamePart = "<span class=\"spPersonName\"><a href=\"http://twitter.com/" + pagetable.twitterscreenname + "\">" + pagetable.personName + "</a></span>";
							pagetable.chatLogPart = "<div class=\"divChatLog divHeadlessChatlog\" id=\"idChatLog\"></div>";
							pagetable.copyrightPart = "<div class=\"divCopyright\">" + pagetable.copyright + "</div>";
							pagetable.createdPart = formatDate (pagetable.item.when, footerDateFormat);
							pagetable.modifiedPart = "<span id=\"idModDate\">" + formatDate (pagetable.item.whenLastUpdate, footerDateFormat) + "</span>";
							pagetable.sloganPart = "<div class=\"divSlogan\" id=\"idSlogan\">" + getRandomSnarkySlogan () + "</div>";
							pagetable.socialMediaLinksPart = "<div class=\"divSocialMediaLinks\">" + viewSocialMediaLinks (pagetable) + "</div>";
						
						pagetable.disqusComments = getDisqusCommentsText (item, pagetable.thispageurl, undefined); //8/28/16 by DW
						
						if (pagetable.title !== undefined) { //11/3/15 by DW
							pagetable.title = encodeXml (pagetable.title);
							console.log ("publishMessage: pagetable.title == " + pagetable.title);
							}
						
						//titleForMeta & descriptionForMeta -- 9/4/16 by DW
							//titleForMeta
								pagetable.titleForMeta = pagetable.title;
								if (item.payload.titleForMeta !== undefined) {
									if (item.payload.titleForMeta.length > 0) {
										pagetable.titleForMeta = item.payload.titleForMeta;
										}
									}
							//descriptionForMeta, descriptionForTemplate
								pagetable.descriptionForMeta = pagetable.description;
								pagetable.descriptionForTemplate = maxLengthString (pagetable.description, 140);
								if (item.payload.descriptionForMeta !== undefined) {
									if (item.payload.descriptionForMeta.length > 0) {
										pagetable.descriptionForMeta = item.payload.descriptionForMeta;
										pagetable.descriptionForTemplate = item.payload.descriptionForMeta;
										}
									}
						
						
						
						pagetable.text = pagetable.item.text; //1/21/16 by DW
						pagetable.text = wrapInChatLogDivs (pagetable.text); //2/26/16 by DW
						
						var pagetext = pagetableReplace (pageTemplateText), pagepath;
						
						pagetext = processMacros (pagetable, pagetext); //9/12/16 by DW
						
						if (idMessage == idMockupMessage) { //2/26/16 by DW
							pagepath = "misc/mockup.html";
							}
						else {
							var fnameHtml = item.payload.fnameHtml; //7/26/16 by DW
							if (fnameHtml === undefined) { //7/26/16 by DW
								fnameHtml = padWithZeros (idMessage, 4) + ".html";
								}
							pagepath = getDatePath (item.when) + fnameHtml;
							}
						
						twChatLogPublish (getCurrentChatLog (), pagepath, pagetext, "text/html", function (data) { //twUploadFile (pagepath, pagetext, "text/html", false, function (data) {
							console.log ("publishMessage: url == " + data.url);
							if ((item.payload.urlRendering === undefined) || (item.payload.urlRendering !== data.url)) { //7/26/16 by DW -- added second condition, to allow for better urls
								item.payload.urlRendering = data.url;
								twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog (), function (err, data) {
									if (err) {
										console.log ("publishMessage: error returned by twEditChatMessage, err == " + jsonStringify (err));
										}
									else {
										console.log ("publishMessage: returned from twEditChatMessage, data == " + jsonStringify (data));
										}
									if (callback !== undefined) {
										callback (item.payload.urlRendering);
										}
									});
								}
							else {
								if (callback !== undefined) {
									if (idMessage == idMockupMessage) { //2/26/16 by DW
										callback (data.url); 
										}
									else {
										callback (item.payload.urlRendering);
										}
									}
								}
							if (idMessage !== idMockupMessage) { //5/22/16 by DW
								publishHomePage (function () { //3/3/16 by DW
									publishThisMonthsArchivePage (); //5/30/16 by DW
									});
								if (appPrefs.flPublishToFacebook) { //4/26/16 by DW
									publishToFacebook (idMessage);
									}
								}
							});
						});
					});
				});
			}, templateOpmltext);
		}
	
	function hasBeenRendered (item) {
		return ((item.payload !== undefined) && (item.payload.urlRendering !== undefined));
		}
	function hasBeenPublished (item) {
		if (Number (new Date (item.when)) < 1449070134392) { //12/2/15; 10:28:22 AM -- approximately -- when the format changed
			return (hasBeenRendered (item));
			}
		else {
			return ((item.payload !== undefined) && item.payload.flPublished);
			}
		}
	function rePublishMessage (idMessage) { //if you set title, we will repub if it has already been published
		findChatMessage (idMessage, function (item) {
			if (hasBeenPublished (item)) {
				publishMessage (idMessage);
				}
			});
		}
	function publishAllPages (callback) {
		var thisUsersName = stringLower (twGetScreenName ()), ctpages = 0;
		twGetChatLogIndex (getCurrentChatLog (), function (index) {
			function pubNext (ix) {
				if (ix >= 0) {
					var item = index [ix];
					if (thisUsersName == stringLower (item.name)) { 
						if ((item.urlHtml.length > 0) && (!getBoolean (item.flDeleted))) {
							publishMessage (item.id, function () {
								ctpages++;
								pubNext (ix - 1);
								});
							}
						else {
							pubNext (ix - 1);
							}
						}
					else {
						pubNext (ix - 1);
						}
					}
				else {
					if (callback !== undefined) {
						callback (ctpages);
						}
					}
				}
			pubNext (index.length - 1);
			});
		}
	function publishAllMyPages () {
		confirmDialog ("Publish all pages you've authored?", function () {
			publishAllPages (function (ct) {
				alertDialog ("We published " + ct + " page(s).");
				});
			});
		}
	function publishCommand (idMessage) { //12/2/15 by DW -- called from the popup menu
		findOrGetChatMessage (idMessage, function (item) {
			confirmDialog ("Include this item in the RSS feed?", function () {
				item.payload.flPublished = true;
				twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog (), function (err, data) {
					if (err) {
						alertDialog ("There was an error publishing the itme: " + err.message);
						}
					else {
						console.log ("publishCommand: data == " + jsonStringify (data));
						publishHomePage (function () { //3/3/16 by DW
							publishThisMonthsArchivePage (); //5/30/16 by DW
							});
						}
					});
				});
			});
		
		}
	function publishPrevNext (idMessage, callback) { //7/27/16 by DW
		getCurrentChatLogIndex (function () {
			findPrevNextMessage (idMessage, function (prev, next) {
				function doNext () {
					if (next !== undefined) {
						publishMessage (next.id, function () {
							if (callback !== undefined) {
								callback ();
								}
							});
						}
					else {
						if (callback !== undefined) {
							callback ();
							}
						}
					}
				if (prev !== undefined) {
					console.log ("publishPrevNext: prev.id == " + prev.id);
					publishMessage (prev.id, function () {
						doNext ();
						});
					}
				else {
					doNext ();
					}
				});
			});
		}
//get chatlog
	
	var myPersonalChatLog;
	
	function testGetUserChatLog () {
		twOpenUserChatLog (function (jstruct) {
			
			myPersonalChatLog = jstruct;
			
			});
		}
	function getCurrentChatLog () { //11/19/15 by DW
		var name = nameCurrentChatLog;
		if (name === undefined) {
			name = appPrefs.nameChatLog;
			if (name == "") { //3/14/16 by DW
				name = twGetScreenName ();
				appPrefs.nameChatLog = name;
				}
			}
		
		if (name == "undefined") { //3/2/16 by DW
			for (var x in myChatlogList) {
				name = x;
				break;
				}
			}
		
		return (name);
		}
	function getCurrentChatLogIndex (callback) { //1/11/16 by DW
		twGetChatLogIndex (getCurrentChatLog (), function (index) {
			myChatlogIndex = index;
			if (callback !== undefined) {
				callback (index);
				}
			});
		}
	function getWholeChatLog (callback) {
		var whenstart = new Date ();
		
		getCurrentChatLogIndex (function () {
			twGetChatLog (getCurrentChatLog (), function (log, metadata) {
				console.log ("getWholeChatLog: " + secondsSince (whenstart) + " secs, " + log.length + " top level items");
				
				
				myChatlogCopy = log; 
				myChatlogMetadata = metadata;
				viewChatLog ();
				if (callback !== undefined) {
					callback ();
					}
				});
			});
		
		}
//posting
	function postChatMessage (s, idMsgReplyingTo, payload) {
		if (s === undefined) {
			s = getEditorText ();
			}
		if (idMsgReplyingTo === undefined) {
			if (flReplying) {
				idMsgReplyingTo = idItemBeingRepliedTo; //copy global into local
				$("#idEditReplyTextArea").css ("visibility", "hidden"); //staging
				}
			}
		//set up payload
			if (flEditingItem) { //preserve the payload
				findChatMessage (idItemBeingEdited, function (item) {
					payload = item.payload;
					});
				}
			if (payload === undefined) {
				payload = new Object ();
				}
			if (whichEditor == "markdown") { //10/19/15 by DW
				payload.sourcetext = s;
				payload.flMarkdown = true;
				}
			payload.editor = whichEditor; //10/19/15 by DW
			if (idMsgReplyingTo !== undefined) {
				payload.idInReplyTo = idMsgReplyingTo;
				}
			
		s = glossaryProcess (s);
		setEditorText ("");
		if (flEditingItem) {
			var idItemToRepublish = idItemBeingEdited;
			twEditChatMessage (s, payload, idItemBeingEdited, getCurrentChatLog (), function (err, data) {
				if (err) {
					if (err.message !== undefined) {
						alertDialog (err.message);
						}
					else {
						alertDialog ("There was an error saving the message.");
						}
					}
				else {
					console.log ("postChatMessage: data == " + jsonStringify (data));
					publishMessage (idItemToRepublish);  //12/4/15 by DW
					flEditingItem = false;
					idItemBeingEdited = undefined;
					if (data.item !== undefined) { //11/26/15 by DW
						updateEditedItem (data.item);
						}
					showHideEditorsMenu (); //4/30/16 by DW
					}
				});
			}
		else {
			twPostChatMessage (s, payload, idMsgReplyingTo, getCurrentChatLog (), function (err, data) {
				if (err) {
					alertDialog (err.message);
					}
				else {
					console.log ("postChatMessage: data == " + jsonStringify (data));
					if (data.item !== undefined) { //11/26/15 by DW
						if (!updateEditedItem (data.item)) { 
							addNewChatItem (data.item); 
							}
						if (!flReplying) {  //12/4/15 by DW
							getCurrentChatLogIndex (function () { //1/11/16 by DW
								publishMessage (data.item.id, function (urlRendering) {
									findPrevNextMessage (data.item.id, function (prev, next) { //1/11/16 by DW
										if (prev !== undefined) {
											getCurrentChatLogIndex (function () { //1/13/16 by DW
												publishMessage (prev.id); 
												});
											}
										});
									});
								});
							}
						}
					flReplying = false;
					idItemBeingRepliedTo = undefined;
					}
				});
			}
		}
//infinite scrolling
	function showHideMoreButton () { //3/14/16 by DW
		var displayVal = "block";
		if ((myChatlogIndex === undefined) || (myChatlogCopy === undefined)) { //4/6/16 by DW -- added check for myChatlogCopy
			displayVal = "none";
			}
		else {
			if ((myChatlogIndex.length == 0) || (myChatlogCopy.length == 0)){
				displayVal = "none";
				}
			else {
				if (myChatlogIndex [0].id == myChatlogCopy [0].id) {
					displayVal = "none";
					}
				}
			}
		$("#idMoreButton").css ("display", displayVal);
		}
	function moreButtonClick (ctNewItems) { //12/31/15 by DW
		if (!flEditingItem) {
			if (ctNewItems === undefined) {
				ctNewItems = 3;
				}
			twGetMoreChatLog (getCurrentChatLog (), myChatlogCopy [0].id, ctNewItems, function (moreItems) {
				console.log ("moreButtonClick: moreItems == " + jsonStringify (moreItems));
				for (var i = 0; i < moreItems.length; i++) {
					myChatlogCopy.unshift (moreItems [i]);
					}
				viewChatLog ();
				showHideMoreButton ();
				});
			}
		}
	function loadFullChatLog () { //3/20/16 by DW
		var ct = myChatlogIndex.length - myChatlogCopy.length
		confirmDialog ("There are " + ct + " items that are not visible. Show them?", function () {
			moreButtonClick (ct);
			});
		}
	
//facebook
	var fbStructForDebug;
	
	function setFacebookMenuItems () { //4/26/16 by DW
		$("#idFacebookIcon").html (facebookicon + "&nbsp;");
		
		if (appPrefs.flPublishToFacebook) {
			fbUpdateFacebookMenuItem ("idFacebookConnectMenuItem");
			$("#idFacebookConnectMenuItem").css ("display", "block");
			}
		else {
			$("#idFacebookConnectMenuItem").css ("display", "none");
			}
		}
	function publishToFacebook (idMessage) { //4/26/16 by DW
		function createPost (initialText, callback) {
			FB.api ("/me/feed", "post", {message: initialText}, function (response) {
				console.log ("createNewPost: response == " + JSON.stringify (response, undefined, 4));
				if ((!response) || response.error) {
					console.log ("createNewPost: response.error == " + response.error);
					if (callback !== undefined) {
						callback (undefined);
						}
					}
				else {
					console.log ("createNewPost: response.id == " + response.id);
					fbGetPostInfo (response.id, function (response) {
						console.log (JSON.stringify (response, undefined, 4));
						fbStructForDebug = response;
						if (callback !== undefined) {
							callback (response.id);
							}
						});
					}
				});
			}
		function updatePost (idPost, thePostText, callback) {
			FB.api (idPost, "post", {message: thePostText}, function (response) {
				console.log ("fbUpdatePost: response == " + JSON.stringify (response, undefined, 4));
				if (callback != undefined) {
					callback ();
					}
				flEraseStatusMessage = true;
				});
			}
		function cleanText (s) {
			
			
			s = replaceAll (s, "</p>", "\n\n");
			s = replaceAll (s, "</li>", "\n\n");
			s = replaceAll (s, "&nbsp;", " ");
			s = stripMarkup (s);
			
			console.log ("cleanText: s == " + s);
			
			return (s);
			}
		
		findOrGetChatMessage (idMessage, function (item) {
			if (isItemPublished (item)) {
				var fbtext = cleanText (item.text);
				if (item.payload.idFacebookPost === undefined) { //new
					createPost (fbtext, function (idpost) {
						item.payload.idFacebookPost = idpost;
						twEditChatMessage (item.text, item.payload, idMessage, getCurrentChatLog (), function (err, data) {
							if (err) {
								console.log ("publishToFacebook: error returned by twEditChatMessage, err == " + jsonStringify (err));
								}
							else {
								console.log ("publishToFacebook: returned from twEditChatMessage, data == " + jsonStringify (data));
								}
							});
						});
					}
				else {
					updatePost (item.payload.idFacebookPost, fbtext);
					}
				}
			});
		}

function swapInOutliner () {
	
	$("#idTextArea").css ("display", "none");
	$("#idOutlineArea").css ("display", "block");
	
	idDefaultOutliner = "idOutlineArea";
	opInitOutliner (appPrefs.savedTextArea);
	flUsingOutliner = true;
	
	}
function userCanEdit () {
	return (twIsTwitterConnected ());
	}
function userIsSysop () { //3/2/16 by DW
	var logname = getCurrentChatLog ();
	if (logname == "scripting") { 
		logname = "davewiner";
		}
	return (logname == twGetScreenName ());
	}
function updateSubmitButton () {
	var val = "none", verb = "Submit";
	if (flSubmitButtonVisible) {
		val = "inline-block";
		}
	if (flEditingItem) {
		verb = "Update";
		}
	$("#idSubmitButton").html ("<i class=\"fa fa-check\"></i>&nbsp;" + verb);
	$("#idSubmitButton").css ("display", val);
	}
function setPostType (theType) {
	$("#idTextArea").css ("height", "5em");
	return; //http://slackalike.com/?id=1367
	
	if (theType == "blogpost") {
		flSubmitButtonVisible = true;
		flReturnPostsMessage = false;
		$("#idTextArea").css ("min-height", "8em");
		$("#idTextArea").attr ("placeholder", "You can write something longer, with more than one paragraph, in this space.");
		}
	else {
		flSubmitButtonVisible = false;
		flReturnPostsMessage = true;
		$("#idTextArea").css ("height", "5em");
		$("#idTextArea").css ("min-height", "5em");
		$("#idTextArea").attr ("placeholder", "Obviously this is a good place to write something.");
		}
	updateSubmitButton ();
	}
function itemIsBlogpost (item) {
	
	return (!itemIsReply (item)); //11/8/15 by DW
	
	return (true); //10/18/15 by DW
	
	if (item.payload !== undefined) {
		if (item.payload.type == "blogpost") {
			return (true);
			}
		}
	return (false);
	}
function submitButtonClick () {
	var payload = {
		title: titleCurrentPost
		};
	if (appPrefs.flAutoPublish) { //3/17/16 by DW
		payload.flPublished = true;
		}
	postChatMessage (undefined, undefined, payload);
	setPostType ("");
	}
function submitEditButtonClick () {
	postChatMessage ();
	setPostType ("");
	}
function showHideEditor () {
	var homeDisplayVal = "none", aboutDisplayVal = "none", startupFailDisplayVal = "none", flAboutDisplay = false;
	
	if (twIsTwitterConnected ()) {
		if (flStartupFail) {
			startupFailDisplayVal = "block";
			}
		else {
			homeDisplayVal = "block";
			}
		}
	else {
		if (flShowEditorIfNotLoggedIn) {
			homeDisplayVal = "block";
			}
		else {
			aboutDisplayVal = "block";
			flAboutDisplay = true; //9/17/16 by DW
			}
		}
	
	$("#idEditor").css ("display", homeDisplayVal);
	$("#idStartupFailBody").css ("display", startupFailDisplayVal);
	
	if (flAboutDisplay) { //9/17/16 by DW
		if (appConsts.urlHomePageIntroText !== undefined) {
			readHttpFile (appConsts.urlHomePageIntroText, function (data) {
				$("#idLogonMessage").html (data.toString ());
				$("#idLogonMessage").css ("display", aboutDisplayVal);
				});
			}
		else {
			$("#idLogonMessage").css ("display", aboutDisplayVal);
			}
		}
	}
function prefsChanged () {
	flPrefsChanged = true;
	}
function applyPrefs () {
	}
function viewChatMessage (idMessage) {
	openHoistDialog (idMessage);
	}
function dehoistAll () {
	idHoistedPost = undefined;
	nameChatlogHoistedPost = undefined; //10/31/15 by DW
	viewChatLog ();
	}
function itemIsReply (item) {
	if ((item.payload !== undefined) && (item.payload.idInReplyTo !== undefined)) {
		return (true);
		}
	return (false);
	}
function newIncomingHook (comment, callback) {
	twNewIncomingHook (comment, function (err, data) {
		if (!err) {
			console.log ("newIncomingHook: data == " + jsonStringify (data));
			}
		});
	}
function getUserInfo (username, callback) {
	var defaultData = {
		name: username,
		profile_image_url: urlClarus
		};
	if (userDataCache [username] !== undefined) {
		defaultData = userDataCache [username];
		}
	if (userCanEdit ()) {
		if (userDataCache [username] === undefined) {
			twGetUserInfo (username, function (data) {
				if (data === undefined) {
					data = defaultData;
					}
				userDataCache [username] = data;
				callback (data);
				});
			}
		else {
			callback (defaultData);
			}
		}
	else {
		callback (defaultData);
		}
	}
function getUserIcon (username, callback) {
	getUserInfo (username, function (data) {
		callback (data.profile_image_url, data.name);
		});
	}
function messageIsHidden (idMessage) {
	return (appPrefs.hiddenMessages [idMessage] !== undefined);
	}
function openLiveblogPost () {
	window.open ("http://liveblog.co/users/davewiner/2015/09/09/aSept9SlateForBrainers.html");
	}
function markdownProcess (s) {
	var md = new Markdown.Converter ();
	return (md.makeHtml (s));
	}
function viewJsonSource (idMessage) {
	findChatMessage (idMessage, function (item) {
		if (item.urlJson !== undefined) {
			window.open (item.urlJson);
			}
		});
	}
function openChatLogJson () {
	window.open (myChatlogMetadata.url);
	}
function getItemIcon (item, callback) {
	if (getBoolean (item.flNotTwitterName)) {
		var iconUrl = item.iconUrl;
		var iconEmoji = item.iconEmoji;
		var name = item.name;
		if (iconUrl === undefined) {
			if (iconEmoji === undefined) {
				iconUrl = urlClarus; 
				}
			else {
				iconEmoji = trimWhitespace (iconEmoji);
				if (beginsWith (iconEmoji, ":")) {
					iconEmoji = stringDelete (iconEmoji, 1, 1);
					}
				if (endsWith (iconEmoji, ":")) {
					iconEmoji = stringMid (iconEmoji, 1, iconEmoji.length - 1);
					}
				iconUrl = urlEmojiImages + iconEmoji + ".png"; 
				}
			}
		callback (iconUrl, undefined);
		}
	else {
		getUserIcon (item.name, function (urlIcon, personName) {
			callback (urlIcon, personName);
			});
		}
	}
function updateOneItem (idMessage, idWhereToShow) { //sometimes only one message changed, so we update only that message
	findChatMessage (idMessage, function (item, stack) {
		var level = stack.length - 1;
		getItemIcon (item, function (urlIcon, personName) {
			var htmltext = viewOneItem (urlIcon, myChatlogCopy, undefined, level, personName, item);
			console.log ("updateOneItem: idMessage == " + idMessage);
			
			if (idWhereToShow === undefined) { //10/9/15 by DW
				idWhereToShow = "idItem" + idMessage;
				}
			
			$("#" + idWhereToShow).replaceWith (htmltext); //5/25/16 by DW
			
			finishViewChatLog ();
			});
		});
	}
function hideChatMessage (idMessage) { //hides the body of the message
	if (userCanPost ()) {
		twSetPrefs (appPrefs, function () { //11/23/15 by DW
			if (messageIsHidden (idMessage)) {
				delete appPrefs.hiddenMessages [idMessage];
				}
			else {
				appPrefs.hiddenMessages [idMessage] = true;
				}
			updateOneItem (idMessage);
			});
		}
	}
function clickReplyIcon (idMessage) {
	findChatMessage (idMessage, function (item) {
		flReplying = true;
		idItemBeingRepliedTo = idMessage;
		if (flReturnPostsReply) { //9/27/15 by DW
			flReturnPostsMessage = true;
			}
		viewChatLog (); //show which item is being edited
		});
	}
function clickHomeIcon () {
	dehoistAll ()
	}
function cancelEdit () {
	var flUpdate = false;
	if (flEditingItem) {
		flEditingItem = false;
		idItemBeingEdited = undefined;
		flUpdate = true;
		showHideEditorsMenu (); //4/30/16 by DW
		}
	else {
		if (flReplying) {
			flReplying = false;
			idItemBeingRepliedTo = undefined;
			flUpdate = true;
			}
		}
	if (flUpdate) {
		viewChatLog ();
		}
	}

function showHideItemsThatRequireLogin (flhide) {
	var displayval, username = twGetScreenName (), flSysop = userIsSysop ();
	if (flhide === undefined) {
		flhide = true;
		}
	if (flhide) {
		displayval = "none";
		$("#idChatLog").css ("margin-top", "100px");
		}
	else {
		displayval = "block";
		$("#idChatLog").css ("margin-top", "15px");
		}
	$("#idHooksMenu").css ("display", displayval);
	$("#idRepliesMenu").css ("display", displayval);
	$("#idBookmarksMenu").css ("display", displayval);
	$("#idDaveMenu").css ("display", (username == "davewiner") ? "block" : "none");
	$("#idChatLogsMenu").css ("display", displayval); //10/29/15 by DW
	$("#idEditBox").css ("display", displayval);
	$("#idDocsMenu").css ("display", displayval); //4/12/16 by DW
	
	//do the main, guest and chatlog menus -- 3/15/16 by DW
		if (flhide) {
			$("#idMainMenu").css ("display", displayval);
			$("#idGuestMenu").css ("display", displayval);
			}
		else {
			$("#idMainMenu").css ("display", (flSysop) ? "block" : "none");
			$("#idGuestMenu").css ("display", (!flSysop) ? "block" : "none");
			}
	
	showHideEditor ();
	}
function updateChatLogTimes () {
	function setOneTime (item) {
		var timestring = getFacebookTimeString (item.when);
		$("#idWhen" + item.id).text (timestring);
		}
	function setTimes (item) {
		setOneTime (item);
		if (item.subs !== undefined) {
			for (var i = 0; i < item.subs.length; i++) {
				setTimes (item.subs [i]);
				}
			}
		}
	for (var i = myChatlogCopy.length - 1; i >= 0; i--) {
		setTimes (myChatlogCopy [i]);
		}
	
	
	}



function setupTextArea () {
	autosize (document.querySelectorAll (".autosizeable")); //the reply textareas are autosizeable
	}
function tellOtherInstancesToQuit () {
	randomMysteryString = getRandomPassword (25);
	localStorage.youAreNotNeeded = randomMysteryString; 
	}
function quitIfNotNeeded () {
	//if another copy of the app has launched, we are not needed, we quit
		if (localStorage.youAreNotNeeded !== undefined) {
			if (localStorage.youAreNotNeeded != randomMysteryString) {
				window.close ();
				}
			}
	}

function watchForChanges (updateCallback) {
	function receivedChatItem (item) {
		if (item.chatLog == getCurrentChatLog ()) { //10/29/15 by DW -- we only care about updates to the chatlog we're looking at
			if (updateEditedItem (item)) { //first check if it's an update of an existing item, return immediately if so
				addToRepliesArray (item.idLatestReply);
				}
			else {
				if (appConsts.chatConfig.flWatchForNewItems) { //it's a new item
					if (!chatItemInIndex (item.id)) { //1/9/16 by DW -- the item might be scrolled off the bottom of the local array, don't want to insert it at the top
						addNewChatItem (item, appPrefs.flChirpOnNewMessage); //11/26/15 by DW
						}
					}
				}
			
			if (updateCallback !== undefined) { //3/18/16 by DW
				updateCallback (item);
				}
			}
		}
	if (flUseLongPolling) {
		twWatchChatLog (getCurrentChatLog (), function (jsontext) {
			console.log ("watchForChanges: jsontext == " + jsontext);
			receivedChatItem (JSON.parse (jsontext));
			});
		}
	else {
		wsWatchForChange ("watch chatlog:" + getCurrentChatLog (), function (jsontext) {
			console.log ("watchForChanges: websocket returned with jsontext == " + jsontext);
			receivedChatItem (JSON.parse (jsontext));
			});
		}
	}

var editorStatusBoxStatus = {
	
	};

function everyMinute () {
	var now = new Date ();
	console.log ("\neveryMinute: " + now.toLocaleTimeString () + ", v" + appConsts.version);
	updateChatLogTimes ();
	if (myMessageOfTheDay !== undefined) { //7/17/16 by DW
		myMessageOfTheDay.checkForUpdate (); //7/12/16 by DW
		}
	}
function everySecond () {
	function isTimeToAutoSave () {
		return (secondsSince (whenLastAutoSave) > appPrefs.minSecsBetwAutoSaves);
		}
	function updateEditorStatusBox () { //3/5/16 by DW
		var chattext = getMainEditorText ();
		var msg = (chattext != appPrefs.savedTextArea) ? "" : "SAVED";
		if (chattext.length == 0) { //we don't care if an empty box is saved even if it is (it is)
			msg = "";
			}
		if ($("#idEditorStatusBox").html () !== msg) {
			$("#idEditorStatusBox").html (msg);
			}
		}
	if (flEnableBackgroundTasks) {
		var now = new Date ();
		//schedule everyMinute call for the top of the minute -- 9/28/15 by DW
			if (now.getSeconds () == 0) { 
				if (!flScheduledEveryMinute) {
					self.setInterval (everyMinute, 60000); 
					flScheduledEveryMinute = true;
					everyMinute (); //call now, it's the top of the minute ;-)
					}
				}
		initTwitterMenuItems ();
		setFacebookMenuItems (); //4/26/16 by DW
		if (!flLoadedFromLocalMachine) { //2/16/16 by DW
			pingGoogleAnalytics ();
			}
		showHideEditor ();
		if (flUpdatePending) { //9/18/15 by DW
			if (updatesEnabled ()) {
				viewChatLog ();
				flUpdatePending = false;
				}
			}
		watchForChanges ();
		if (userCanEdit ()) {
			if (!flEditingItem) { //don't save the text if we're editing an item
				if (appPrefs.flAutoSave) {
					if (isTimeToAutoSave ()) {
						var chattext = getMainEditorText ();
						if (chattext != appPrefs.savedTextArea) {
							twSetPrefs (appPrefs, function () { //11/23/15 by DW
								console.log ("everySecond: saving chat text. " + chattext);
								appPrefs.savedTextArea = chattext;
								whenLastAutoSave = new Date ();
								});
							}
						}
					}
				}
			if (flPrefsChanged) {
				twPrefsToStorage (appPrefs);
				flPrefsChanged = false;
				}
			}
		enableSettingsCommand (); //3/2/16 by DW
		updateEditorStatusBox (); //3/5/16 by DW
		showHideEditorsMenu (); //4/30/16 by DW
		showHidePlugInsMenu (); //5/16/16 by DW
		showHideMoreButton (); //3/14/16 by DW
		}
	}
function checkForIdParam () {
	var id = getURLParameter ("id");
	if (id != "null") {
		openHoistDialog (id);
		}
	}
function editorStartup () {
	function readConfig (callback) { //2/16/16 by DW
		if (flLoadedFromLocalMachine) {
			callback (undefined);
			}
		else {
			readHttpFile ("config.json", function (data) { //allows us to override anything in appConsts -- 10/13/15 by DW
				callback (data);
				});
			}
		}
	console.log ("startup");
	flLoadedFromLocalMachine = beginsWith (window.location.href, "file://"); //2/16/16 by DW
	nukeDisabledMenuItems (); //11/16/15 by DW
	readConfig (function (data) { //allows us to override anything in appConsts -- 10/13/15 by DW
		function setWindowTitle () {
			var windowTitle = appConsts.productnameForDisplay;
			if (appConsts.productnameForTitle !== undefined) {
				windowTitle = appConsts.productnameForTitle;
				}
			$("title").text (windowTitle);
			
			}
		if (data !== undefined) {
			var appConfig = JSON.parse (data);
			for (var x in appConfig) {
				appConsts [x] = appConfig [x];
				}
			}
		
		twStorageData.urlTwitterServer = appConsts.urlTwitterServer;
		twStorageData.pathAppPrefs = "editorPrefs.json"; //keep the editor prefs away from other environments that might use chat.js
		if (getBoolean (appConsts.flEditChatUsePostBody)) { //4/28/16 by DW
			twStorageConsts.flEditChatUsePostBody = true;
			}
		
		
		$("#idTwitterIcon").html (twStorageConsts.fontAwesomeIcon);
		$("#idVersionNumber").html ("v" + appConsts.version);
		
		//hovering over version number -- 4/12/16 by DW
			$("#idVersionNumber").hover (
				function () { 
					$(this).html ("v" + appConsts.version);
					},
				function () { 
					$(this).html ("v" + myChatlogMetadata.server.version);
					}
				);
		
		setWindowTitle (); //10/13/15 by DW
		$(document).keydown (function (event) {
			whenLastUserAction = new Date ();
			return (true);
			});
		
		window.onscroll = function (ev) {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				console.log ("you're at the bottom of the page");
				if (secondsSince (whenLastMoreButtonClick) > 1) {
					whenLastMoreButtonClick = new Date ();
					moreButtonClick (1);
					}
				}
			};
		
		initMenus ();
		if (!flLoadedFromLocalMachine) {
			initGoogleAnalytics (window.location.hostname, appConsts.googleAnalyticsAccount); //8/10/16 by DW
			}
		hitCounter (); 
		tellOtherInstancesToQuit ();
		twGetOauthParams (); //redirects if OAuth params are present
		initTwitterMenuItems ();
		setupAskDialog (function () { //3/4/16 by DW
			console.log ("editorStartup: askDialog loaded at starutp.");
			});
		
		if (twIsTwitterConnected ()) {
			twUserWhitelisted (twGetScreenName (), function (flwhitelisted) {
				if (flwhitelisted) {
					twStorageStartup (appPrefs, function (flGoodStart) {
						flStartupFail = !flGoodStart;
						if (flGoodStart) {
							twOpenUserChatLog (function (jstruct) { //1/5/16 by DW
								urlRssFeed = jstruct.urlRssFeed; //3/1/16 by DW
								urlHomePage = jstruct.urlPublicFolder; //3/3/16 by DW
								twGetChatLogList (function (chatloglist) {
									myChatlogList = chatloglist; //set global
									//init appPrefs that relate to the site -- 3/7/16 by DW
										if (appPrefs.siteName === undefined) {
											appPrefs.siteName = twGetScreenName ();
											}
										if (appPrefs.urlBlogHome === undefined) {
											appPrefs.urlBlogHome = urlHomePage;
											}
									showHideEditor ();
									setEditBoxIcon (); //9/25/15 by DW
									getWholeChatLog (function () {
										buildRepliesMenu ();
										});
									twSetPrefs (appPrefs, function () { //11/23/15 by DW
										appPrefs.ctStartups++;
										});
									applyPrefs ();
									buildBookmarksMenu (); 
									showHideItemsThatRequireLogin (!userCanPost ());
									buildChatLogsMenu (); //10/29/15 by DW
									buildEditorsMenu (); //4/29/16 by DW
									buildPlugInsMenu (); //5/16/16 by DW
									myMessageOfTheDay = new MessageOfTheDay (appConsts.urlMyMessageOfTheDay); //7/12/16 by DW
									
									startMainEditor (appPrefs.savedTextArea); //11/6/15 by DW -- undoing the editor plug-in
									
									twGetTwitterConfig (function () { //twStorageData.twitterConfig will have information from twitter.com
										readGlossary (appPrefs.urlGlossaryOpml, glossary, function () { //11/17/15 by DW
											self.setInterval (everySecond, 1000); 
											fbStartup (); //4/26/16 by DW
											setupTextArea ();
											});
										});
									});
								});
							}
						});
					}
				else {
					alertDialog ("Can't open the editor because there was an error connecting to the server, or the user is not whitelisted.");
					}
				});
			}
		else { //starting up without being signed-in -- 10/3/15 by DW
			twGetChatLogList (function (chatloglist) {
				showHideItemsThatRequireLogin (); 
				getWholeChatLog (function () {
					buildChatLogsMenu (); //10/29/15 by DW
					self.setInterval (everySecond, 1000); 
					});
				});
			}
		});
	}
