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

function get_request_url(cmd) {
    var url = 'http://localhost:7119/' + cmd;
    return url;
}


function osdlyrics(id) {
    this.init(id);
}

osdlyrics.prototype = {
    init: function(id) {
        this.id = '';
        this.connected = false;
        this.timestamp = 0;
    },
    connect: function() {
        if (this.connected)
            return;
        this.connected = true;
        $.ajax({ url: get_request_url('connect'),
                 data: { name: 'Douban', 
                         caps: 'play,pause,next'},
                 context: this,
                 dataType: 'json',
                 success: function(data) {
                     console.log('id:' + data.id);
                     this.id = data.id;
                     this.connected = true;
                     var thisObj = this;
                     this.query_timer = setInterval(function() { thisObj.query(); },
                                                    1000);
                 },
                 error: function(data, code) {
                     console.error('Cannot connect to OSD Lyrics\nerrcode: ' + data + code);
                     this.connected = false;
                 }
               });
    },
    playpause: function(play) {
        var status = 'playing';
        if (!play)
            status = 'paused';
        $.ajax({ url: get_request_url('status_changed'),
                 data: { id: this.id, status: status },
                 context: this,
                 error: function() {
                     this.disconnect();
                 }
               });
    },
    query: function() {
        $.ajax({ url: get_request_url('query'),
                 data: { id: this.id, timestamp: this.timestamp },
                 context: this,
                 dataType: 'json',
                 success: function(data) {
                     if (data.timestamp > this.timestamp)
                         this.timestamp = data.timestamp;
                     if (data.cmds.length > 0)
                         console.log(data.cmds);
                 },
                 error: function() {
                     this.disconnect();
                 }
               });
    },
    track_changed: function(song) {
        $.ajax({ url: get_request_url('track_changed'),
                 data: { id: this.id,
                         status: 'playing',
                         title: song.title,
                         artist: song.artist,
                         album: song.albumtitle,
                         length: song.len * 1000,
                         arturl: song.picture },
                 context: this,
                 error: function() {
                     this.disconnect();
                 }
               });
        
    },
    disconnect: function() {
        if (!this.connected)
            return;
        this.connected = false;
        this.id = 0;
        clearInterval(this.query_timer);
        this.query_timer = null;
        this.timestamp = 0;
    },
    handleEvent: function(event) {
        var playerEvents = {
            init: function(event) {},
            gotoplay: function(event) {this.playpause(true);},
            pause: function(event) {this.playpause(false);},
            start: function(event) {this.track_changed(event.song);}
        };
        if (event.type in playerEvents)
            playerEvents[event.type].call(this, event);
    }
};

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

//window.addEventListener('load', inject, false);
var conn = new osdlyrics();
inject();