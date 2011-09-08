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
      worker.on('detach', function() {
                    worker.conn.disconnect();
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
        this.status = 'disconnected';
        this.timestamp = 0;
        this._pending_calls = [];
    },
    connect: function() {
        if (this.status == 'connected' || this.status == 'connecting')
            return;
        this.status = 'connecting';
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
                     this.status = 'connected';
                     var thisObj = this;
                     this._send_pending_calls();
                     this.query_timer = setInterval(function() { thisObj.query(); },
                                                    1000);
                 },
                 error: function(jqXHR, textStatus, errorThrown) {
                     console.error('Cannot connect to OSD Lyrics\nerr: ' + 
                                   errorThrown);
                     this.status = 'disconnected';
                 }
               });
    },
    _call: function(request) {
        switch (this.status) {
        case 'connected':
            if (!request.data)
                request.data = { id: this.id };
            else
                request.data.id = this.id;
            $.ajax(request);
            break;
        case 'connecting':
            this._pending_calls.push(request);
        }
    },
    _send_pending_calls: function() {
        for (var i in this._pending_calls)
            this._call(this._pending_calls[i]);
        this._pending_calls = [];
    },
    playpause: function(play) {
        var status = 'playing';
        if (!play)
            status = 'paused';
        this._call({ url: get_request_url('status_changed'),
                     data: { id: this.id, status: status },
                     context: this,
                     error: function() {
                         this.disconnect(true);
                     }
                   });
    },
    query: function() {
        var thisObj = this;
        this._call({ url: get_request_url('query'),
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
                         this.disconnect(true);
                     }
                   });
    },
    track_changed: function(song) {
        this._call({ url: get_request_url('track_changed'),
                     data: { id: this.id,
                             status: 'playing',
                             title: song.title,
                             artist: song.artist,
                             album: song.albumtitle,
                             length: song.len * 1000,
                             arturl: song.picture },
                     context: this,
                     error: function() {
                         this.disconnect(true);
                     }
                   });
    },
    disconnect: function(iserror) {
        if (this.status == 'disconnected')
            return;
        if (this.status == 'connected' && ! iserror) {
            $.ajax({ url: get_request_url('disconnect'),
                     data: { id: this.id }
                   });
        }
        this.status = 'disconnected';
        this.id = '';
        timers.clearInterval(this.query_timer);
        this.query_timer = null;
        this.timestamp = 0;
        this._pending_calls = [];
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
