Introduction
==========

Here are source codes of osdlyrics-doubanfm.

They are browser extensions to support Douban FM in OSD Lyrics.

Extensions for Google Chrome and Firefox are available.

Notes about OSD Lyrics 0.5
==========

The extension requires OSD Lyrics 0.5 or newer versions.

However, by the time this document is written, OSD Lyrics 0.5 is not ready. If OSD Lyrics 0.5 is released, you can skip this section and jump to the next section.

To run OSD Lyrics 0.5, you need to download from github and install manually.

Get source code of 0.5 series
----------

Clone the source repository:

    git clone git://github.com/osdlyrics/osdlyrics.git
    cd osdlyrics

Change to 0.5 branch:

    git checkout --track origin/0.5-series

Now you get the code of OSD Lyrics 0.5

Compile and Install
----------

When the source code is ready, run configure script:

    ./autogen.sh

If you are an ArchLinux user, you need to tell it to use Python 2.x:

    ./autogen.sh  PYTHON=/usr/bin/python2

Now you can build and install the program:

    make
    sudo make install

That's it :)

Run the player support daemon
----------

With OSD Lyrics 0.5 installed, you can run the player support daemon with:

    python /usr/local/lib/osdlyrics/daemon/player.py

If you are an ArchLinux user, use `python2` instead of `python`.


How to use
==========

Download and install the extension for your extension.

Run OSD Lyrics. If your OSD Lyrics version is less than 0.5, run the player support daemon above before you run OSD Lyrics.

Open [Douban FM](http://douban.fm), then enjoy your music and lyric :)

Known Issues
==========
* If you pause then continue to play, the progress of lyrics will be wrong.
* Since we can't get the position of current track, if the player paused because of network problem, the time will be different between OSD Lyrics and Douban FM.
* As the reason describe above, the progress may be wrong with the first track.
* Cannot control the player to play, pause or change to the next track.

Development Notes
==========

----

简介
==========

本项目为OSD Lyrics提供豆瓣电台支持。以Google Chrome和Firefox扩展的形式提供。

使用OSD Lyrics 0.5
==========

OSD Lyrics 0.5才能支持豆瓣电台，但在本文档写成时该版本尚未完成开发。以下说明如何使用开发版的OSD Lyrics 0.5。如果你已经用上了OSD Lyrics 0.5或更高版本，你可以跳过本节。

下载0.5版的代码
----------

从github中获取OSD Lyrics的代码库：

    git clone git://github.com/osdlyrics/osdlyrics.git
    cd osdlyrics

将代码库切换到0.5分支：

    git checkout --track origin/0.5-series

至此0.5版本的代码已经获取到本地了。

编译安装
----------

首先需要运行基本配置：

    ./autogen.sh

ArchLinux用户需要指定使用Python2.x：

    ./autogen.sh  PYTHON=/usr/bin/python2

接下来编译安装：

    make
    sudo make install

搞定:)

运行播放器支持组件
----------

安装完毕后，使用如下命令运行播放器支持组件：

    python /usr/local/lib/osdlyrics/daemon/player.py

ArchLinux用户需要使用`python2`代替。


使用方法
==========

根据你的浏览器安装对应的扩展。

打开OSD Lyrics。如果0.5版还没发布，需要在启动OSD Lyrics之前按上节指示运行播放器支持组件。

最后，打开[豆瓣电台](http://douban.fm)，边听歌边享受歌词吧:)

已知问题
==========
* 暂停再继续，时间会错位
* 由于无法获得真正的播放时间，一旦卡住，时间将不同步
* 同样由于上述问题，第一首歌的时间可能会有偏差
* 无法从OSD Lyrics控制播放、暂停、下一首
