var pageMod = require('page-mod');
var data = require('self').data;
var timers = require('timers');

pageMod.PageMod({
  include: "http://douban.fm/",
  contentScriptFile: [data.url('jquery-1.6.2.min.js'),
                      data.url('osdlyrics.js'),
                      data.url('inject.js')],
  contentScriptWhen: 'ready',
  onAttach: function(worker) {
      worker.conn = new osdlyrics();
      worker.conn.worker = worker;
      worker.on('message', function(data) {
                    worker.conn.connect();
                    worker.conn.handleEvent(data);
                });
  }
});

var Request = require('request').Request;

var $ = {};
var setInterval = timers.setInterval;
var clearInterval = timers.clearInterval;

$.ajax = function(params) {
    Request({ url: params.url,
              content: params.data,
              onComplete: function(response) {
                  if (response.status == 200) {
                      if (params.success) {
                          params.success.call(params.context, response.json);
                      }
                  } else {
                      if (params.error) {
                          params.error.call(params.context,
                                            null,
                                            response.status,
                                            response.statusText);
                      }
                  }
              }
            }).get();
};

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
        var thisObj = this;
        console.log('connect');
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
                 error: function(jqXHR, textStatus, errorThrown) {
                     console.error('Cannot connect to OSD Lyrics\nerr: ' + 
                                   errorThrown);
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
        var thisObj = this;
        $.ajax({ url: get_request_url('query'),
                 data: { id: this.id, timestamp: this.timestamp },
                 context: this,
                 dataType: 'json',
                 success: function(data) {
                     if (data.timestamp > this.timestamp)
                         this.timestamp = data.timestamp;
                     if (data.cmds.length > 0)
                         console.log('cmds:' + data.cmds);
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
        timers.clearInterval(this.query_timer);
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
