var request=require('request');

var keywords='邓紫棋';
var num=20;
var url1=encodeURI('https://c.y.qq.com/soso/fcgi-bin/client_search_cp?p=1&n='+num+'&w='+keywords);

function start(url){
    var option={
        method: 'GET',
        url:url,
        headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36'
        } 
    }
    request(option,function(err,res,body){
        if(!err&&res.statusCode==200){
            var code = body.replace("callback(","").replace("})","}");
            var a=JSON.parse(code);
            var arr = a.data.song.list;
            for(var i=0;i<arr.length;i++){
                (function(i){
                    setTimeout(function(){
                        console.log('歌曲名: '+arr[i].songname);
                        console.log('歌手: '+arr[i].singer[0].name);
                        console.log('歌曲ID: '+arr[i].songmid);
                        console.log('专辑封面: '+'http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_'+arr[i].albumid+'_0.jpg');
                        gettoken(arr[i].songmid);
                    },i*1500);
                 })(i);
            }
        }else{
            console.log(err);
        }
    });
}
function gettoken(mid){
    var tokenurl='https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid='+mid+'&filename=M500'+mid+'.mp3&guid=126548448';
    request(tokenurl,function(err,res,body){
        if(!err&&res.statusCode==200){
            var musicurl='';
            var b=JSON.parse(body.replace('[','').replace(']',''));
            var vkey=b.data.items.vkey;
            if(vkey == ''||vkey == undefined){
                musicurl='无法获取';
            }else{
                musicurl='http://ws.stream.qqmusic.qq.com/M500'+mid+'.mp3?fromtag=0&guid=126548448&vkey='+vkey;
            }
            console.log('网址: '+musicurl);
            console.log('--------------------------------------------------------------------------------------');
        }else{
            console.log(err);
        }
    });
}

function getlrc(mid){
    var option={
        method: 'GET',
        url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?-=MusicJsonCallback_lrc&pcachetime=1571322454754&songmid='+mid+'&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0',
        headers: {
            'Referer': 'https://y.qq.com/portal/player.html',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36'
        } 
    }
    request(option,function(err,res,body){
        if(!err&&res.statusCode==200){
            var lrc = JSON.parse(body).lyric;
            lrc = Buffer.from(lrc, 'base64').toString('utf8');
            console.log('歌词: \n'+lrc);
        }else{
            console.log(err);
        }
    });

}      
start(url1);
