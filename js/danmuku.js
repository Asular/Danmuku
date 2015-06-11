/**
 * Created by Administrator on 2015/6/9.
 */
var stage;
var video;
var input;
var danmukuList;
var videoNowTime = 0;
var videoNowTimeZ = -1;
function createOneDanmuku(danmuku){
    if(danmuku == '') return;
    var text = new createjs.Text(danmuku,"16px Arial","#ffffff");
    text.x = 640;
    text.y = 30+50*Math.random();
    stage.addChild(text);
    var bounds = text.getBounds().clone();
    var textRect = new createjs.Shape();
    textRect.graphics.beginStroke("#36bc4b").drawRect(0,0,bounds.width+10,bounds.height);
    textRect.x = text.x;
    textRect.y = text.y;
    stage.addChild(textRect);
    console.log(textRect);
}

function refleshDanmuku(){
    for(var i = 0;i<stage.numChildren;i++)
    {
        var txt=stage.getChildAt(i);
        txt.x-=5;
        if(txt.x<-200)
        {
            stage.removeChild(txt);
        }
    }
    stage.update();
}

function readDanmuku(){
    videoNowTime = Math.floor(video.prop('currentTime'));
    if(videoNowTimeZ == -1 && videoNowTime ==0)
    {
        danmukuList = danmukuData;
        danmukuList.sort(sortDanmukuList);
    }else if(videoNowTimeZ > videoNowTime)
    {
        danmukuList = danmukuData;
        danmukuList.sort(sortDanmukuList);
        videoNowTimeZ = videoNowTime;
        while(danmukuList.length > 0)
        {
            if(danmukuList[0].time < videoNowTime)
            {
                danmukuList.shift();
            }else
            {
                break;
            }
        }
    }
    while(danmukuList.length > 0)
    {
        if(danmukuList[0].time < videoNowTime)
        {
            danmukuList.shift();
        }else if(danmukuList[0].time == videoNowTime)
        {
            var txt = danmukuList[0].txt;
            var text = new createjs.Text(txt,"16px Arial","#ffffff");
            text.x = 640;
            text.y = 30+Math.floor(280*Math.random());
            stage.addChild(text);
            danmukuList.shift();
        }else
        {
            break;
        }
    }
}

function sortDanmukuList(a,b){
    return a.time - b.time;
}

$(document).ready(function(){
    video = $('video');
    stage = new createjs.Stage(document.getElementById('danmukuCanvas'));
    input = $('#inputDanmuku');
    video.on('timeupdate',readDanmuku);
    video.on('play',OnPlay);
    video.on('pause',OnPause);
    video.on('stop',OnStop);
    createjs.Ticker.setFPS(30);

    input.keypress(function(e){

        if(e.keyCode == 13){
            createOneDanmuku(input.val());
            input.prop('value','');
        }
    });
    $('#sendBt').click(function(){
        createOneDanmuku(input.val());
        input.prop('value','');
    });
});

function OnPlay(event){
    createjs.Ticker.addEventListener('tick',refleshDanmuku);
}
function OnPause(event){
    createjs.Ticker.removeEventListener('tick',refleshDanmuku);
}
function OnStop(event){
    createjs.Ticker.removeEventListener('tick',refleshDanmuku);
}