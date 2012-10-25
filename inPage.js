function findUrl() {
    var tds = document.getElementsByTagName('td');
    for(td in tds) {
        try {
            if(tds[td].innerText.indexOf('URL:') == 0) {
                console.log(url = tds[td].innerText.slice(5).trim());
                return url;
            }
        } catch (e) {
            console.log(e);
        }
    }
}

window.onload = function() {
    var url = findUrl();
    chrome.extension.sendMessage(
        {url: url, method: "content", action: "unblock"}, 
        function(response) { 
            console.log(response);
        });
}