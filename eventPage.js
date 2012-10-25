chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request,sender);
		if(request.action === "unblock") {
			var urls = addURL(request.url);
			updateProxy();
			if(request.method == "popup") {
				sendResponse({urls: urls});
			} else {
				sendResponse({url: request.url, redirect: true});
				chrome.tabs.update(sender.tab.id, {url: request.url});
			}
		} else if (request.action == 'removeURL') {
			removeURL(request.url);
			updateProxy();

		} else if (request.action == 'loadpopup') {
			var urls = JSON.parse(localStorage.getItem('urls')) ;
			var proxy = getProxy();
			sendResponse({urls: urls, proxy: proxy});
		} else if (request.action == 'updateProxy') {
			setProxy(request.proxy_host, request.proxy_port);
			updateProxy();
		}
	});

String.prototype.format = function() {
   var content = this;
   for (var i=0; i < arguments.length; i++)
   {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);  
   }
   return content;
};

function updateProxy() {
	var data = buildPacScript();
	var newConfig = {
		mode: "pac_script",
		pacScript: {data: data}
		};
	chrome.proxy.settings.set({value: newConfig, scope: "regular"});
}

function buildPacScript() {
	pacHeader = "function regExpMatch(url, pattern) {\n" +
				"	try { return new RegExp(pattern).test(url); } catch(ex) { return false; }\n" +
				"}\n" +
				"function FindProxyForURL(url, host) {\n" ;
	pacFooter = "	return 'DIRECT';\n" +
				"}";
	pacLine = "if (shExpMatch(url, '*{0}/*')) return 'SOCKS {1}:{2}';\n";
	pacFile = pacHeader;
	proxy = getProxy(); 
	urls = JSON.parse(localStorage.getItem('urls'));
	//console.log(urls);
	for(i in urls) {
		pacFile = pacFile + pacLine.format(urls[i], proxy.host, proxy.port);
	}
	pacFile = pacFile + pacFooter;
	return pacFile;
}

function addURL(url) {
	if(url.substring(0,4) != 'http')
		url = "http://" + url;
	var a = document.createElement('a');
	a.href = url;
	var host = a.host;
	var localStorageURL = localStorage.getItem('urls');
	var data = localStorageURL ? JSON.parse(localStorageURL) : [];
	//console.log(url, host, data);
	if(data.indexOf(host) === -1) {
		data.push(host);
		localStorage.setItem('urls', JSON.stringify(data));
	} 
	var notification = webkitNotifications.createNotification('48.png', 'Unblocked url', host);
	notification.show();
	setTimeout(function() {notification.cancel();}, 2000);
	return data;
}

function removeURL(url) {
	var urls = JSON.parse(localStorage.getItem('urls'));
	urls.splice(urls.indexOf(url), 1);
	localStorage.setItem('urls', JSON.stringify(urls));
	return urls;
}
function getProxy() {
	return {host: localStorage.getItem('proxy_host'), port: localStorage.getItem('proxy_port')};
}

function setProxy(host, port) {
	localStorage.setItem('proxy_host', host);
	localStorage.setItem('proxy_port', port);
	var notification = webkitNotifications.createNotification('48.png', 'Changed Proxy Settings', "Host: " + host + "\nPort: " + port);
	notification.show();
	setTimeout(function() {notification.cancel();}, 2000);
}

updateProxy();