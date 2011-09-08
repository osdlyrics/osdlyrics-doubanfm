/*
 * Copyright (C) 2011  Tiger Soldier <tigersoldi@gmail.com>
 *
 * This file is part of OSD Lyrics.
 * 
 * OSD Lyrics is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OSD Lyrics is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OSD Lyrics.  If not, see <http://www.gnu.org/licenses/>. 
 */
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

function doubanEvent(o) {
    var o = $.parseJSON($('#osdlyrics')[0].innerHTML);
    console.log('cmd:' + o.type);
    console.log(o);
    conn.connect();
    conn.handleEvent(o);
}

document.addEventListener('doubanEvent',
                          doubanEvent);

function inject() {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = '' + hack + 'hack()';
    document.getElementsByTagName('body')[0].appendChild(script);
}

var conn = new osdlyrics();
inject();
$(window).unload(function () {
                     conn.disconnect();
                 });
