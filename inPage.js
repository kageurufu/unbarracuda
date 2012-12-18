if ((document.title === "Access Denied" || document.title === "Access Warning") && document.styleSheets[0].href.indexOf('barracuda.css') !== -1) {
    //If you get a barracuda block page, lets go ahead and unblock any URLs
    function findUrl() {
        return document.referrer ;
    }

    window.onload = function() {
        var url = findUrl();
        console.log(url);
        chrome.extension.sendMessage(
            {url: url, method: "content", action: "unblock"}, 
            function(response) { 
                console.log(response);
            });
    }
}