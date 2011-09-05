function hack() {
    var savedExtStatusHandler = window.extStatusHandler;
    if (!savedExtStatusHandler) {
        setTimeout(hack, 500);
        return;
    }

    var customEvent = document.createEvent('Event');
    customEvent.initEvent('doubanEvent', true, true);
    
    var div = $('<div id="osdlyrics">').hide();
    $('body').append(div);

    window.extStatusHandler = function(o) {
        savedExtStatusHandler(o);
        var obj = $('#osdlyrics')[0];
        obj.innerHTML = o;
        obj.dispatchEvent(customEvent);
    };
}

function inject() {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = '' + hack + 'hack()';
    document.getElementsByTagName('body')[0].appendChild(script);
}

function doubanEvent(o) {
    console.log(o);
    o = $.parseJSON($('#osdlyrics')[0].innerHTML);
    self.postMessage(o);
    //conn.connect();
    //conn.handleEvent(o);
}

inject();
var conn = new osdlyrics();
document.addEventListener('doubanEvent',
                          doubanEvent);
