$("#unblock-button").click(function() {
	console.log($("#unblock-url").val());
	chrome.extension.sendMessage(
		{url: $("#unblock-url").val(), method: "popup", action: "unblock"}, 
		function(response) { 
			console.log(response); 
			var urllist = '';
			$.each(response.urls, function(count, item) {
				urllist += '<li>' + item + '</li>';
			});
			$("#unblocked-urls").empty().append(urllist);
		});
});

$("#proxy-button").click(function() {
	chrome.extension.sendMessage({
		method: "popup", 
		action: "updateProxy",
		proxy_host: $("#proxy-host").val(),
		proxy_port: $("#proxy-port").val()},
		function(response) { 
			console.log(response);
		});
});

$(function() {
	chrome.extension.sendMessage(
		{method: "popup", action: "loadpopup"}, 
		function(response) { 
			console.log(response);
			var urllist = '';
			$.each(response.urls, function(count, item) {
				urllist += '<li>' + item + '</li>';
			});
			$("#unblocked-urls").empty().append(urllist);
			$("#proxy-host").val(response.proxy.host);
			$("#proxy-port").val(response.proxy.port);
		});
});