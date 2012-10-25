$(function() {
	$("#unblock-button").click(function() {
		var url = $("#unblock-url").val();
		if(!url) {
			$("#unblock-url");
		} else {
			chrome.extension.sendMessage(
				{url: $("#unblock-url").val(), method: "popup", action: "unblock"}, 
				function(response) { 
					console.log(response); 
					var urllist = '';
					$.each(response.urls, function(count, item) {
						urllist += '<option>' + item + '</option>';
					});
					$("#unblock-url").val("");
					$("#unblocked-urls").empty().append(urllist);
				});
		}
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

	$("#removeurl-button").click(function() {
		var urls = $('#unblocked-urls').val()
		if(!urls) {
			$('#unblocked-urls');
		} else {
			chrome.extension.sendMessage(
				{method: "popup", action: "removeURL", urls: urls},
				function(response) {
					var urllist = '';
					$.each(response.urls, function(count, item) {
						urllist += '<option>' + item + '</option>';
					});
					$("#unblocked-urls").empty().append(urllist);
				});
		}
	});

	chrome.extension.sendMessage(
		{method: "popup", action: "loadpopup"}, 
		function(response) { 
			console.log(response);
			var urllist = '';
			$.each(response.urls, function(count, item) {
				urllist += '<option>' + item + '</option>';
			});
			$("#unblocked-urls").empty().append(urllist);
			$("#proxy-host").val(response.proxy.host);
			$("#proxy-port").val(response.proxy.port);
		});
});