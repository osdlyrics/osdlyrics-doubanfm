Introduction
==========

Here are source codes of osdlyrics-doubanfm.

They are browser extensions to support Douban FM in OSD Lyrics.

Extensions for Google Chrome and Firefox are available.

Notes about OSD Lyrics 0.5
==========

The extension requires OSD Lyrics 0.5 or newer versions.

However, by the time this document is written, OSD Lyrics 0.5 is not ready. If OSD Lyrics 0.5 is released, you can skip this section and jump to the next section.

To install OSD Lyrics 0.5, follow the instructions in [OSD Lyrics' wiki page](http://code.google.com/p/osd-lyrics/wiki/InstallDaemon).

How to use
==========

Download and install the extension for your extension.

 - Chrome/ium: http://osdlyrics.github.com/osdlyrics-doubanfm/chrome/osdlyrics-doubanfm.crx
 - Firefox: http://osdlyrics.github.com/osdlyrics-doubanfm/firefox/osdlyrics-doubanfm.xpi

You need to run the daemon before running OSD Lyrics

    osdlyrics-daemon

Run OSD Lyrics and open [Douban FM](http://douban.fm). Enjoy your music and lyric :)

Known Issues
==========
* If you pause then continue to play, the progress of lyrics will be wrong.
* Since we can't get the position of current track, if the player paused because of network problem, the time will be different between OSD Lyrics and Douban FM.
* As the reason describe above, the progress may be wrong with the first track.
* Cannot control the player to play, pause or change to the next track.

Development Notes
==========

This extension communicates with OSD Lyrics through [HTTP API](https://github.com/osdlyrics/osdlyrics/blob/0.5-series/doc/http.rst).

----

简介
==========

本项目为OSD Lyrics提供豆瓣电台支持。以Google Chrome和Firefox扩展的形式提供。

使用OSD Lyrics 0.5
==========

OSD Lyrics 0.5才能支持豆瓣电台，但在本文档写成时该版本尚未完成开发。以下说明如何使用开发版的OSD Lyrics 0.5。如果你已经用上了OSD Lyrics 0.5或更高版本，你可以跳过本节。

要安装0.5版，请参考OSD Lyrics的[wiki页面](http://code.google.com/p/osd-lyrics/wiki/InstallDaemon)。

使用方法
==========

根据你的浏览器安装对应的扩展。

 - Chrome/ium: http://osdlyrics.github.com/osdlyrics-doubanfm/chrome/osdlyrics-doubanfm.crx
 - Firefox: http://osdlyrics.github.com/osdlyrics-doubanfm/firefox/osdlyrics-doubanfm.xpi

在运行OSD Lyrics之前，运行0.5版引入的后台进程：

    osdlyrics-daemon

现在可以运行OSD Lyrics，打开[豆瓣电台](http://douban.fm)，边听歌边享受歌词了:)

已知问题
==========
* 暂停再继续，时间会错位
* 由于无法获得真正的播放时间，一旦卡住，时间将不同步
* 同样由于上述问题，第一首歌的时间可能会有偏差
* 无法从OSD Lyrics控制播放、暂停、下一首
