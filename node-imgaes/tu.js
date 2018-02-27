const request = require('superagent'); // ajax 请求包
const mkdirp = require('mkdirp');
const https = require('https'); // https 请求
const cheerio = require('cheerio'); //为服务器特别定制的 jQuery
const fs = require('fs-extra'); //fs-extra模块是系统fs模块的扩展，提供了更多便利的 API，并继承了fs模块的 API。
const path = require('path'); // path 模块提供了一些工具函数，用于处理文件与目录的路径
const download = require('download'); // 下载文件所需要的包


async function init(params) {
    let parsedData = await getparsedData(); //存储后端 json

    mkdirp('./imgbox/', function (err) {
        if (err) console.error(err)
        else console.log('创建文件夹成功!')
    });

    for (let [k, v] of Object.entries(parsedData.postList)) {
        //正则去掉title中的特殊符号(文件夹禁止的命名)
        let title = v.title;
        let reCat = /[/\<>|:*?"]+/gi;
        title = title.replace(reCat, "-");

        v.images.forEach((element) => {
            
            if (v.images.length === 1) {
                console.log(title + ' :目录已下载完毕, 此目录下共有' + v.images.length + '张图片', );
                // const element = v.images[index];
                download(`http://photo.tuchong.com/${element.user_id}/f/${element.img_id}.jpg`).pipe(fs.createWriteStream(`imgbox/${title}.jpg`));
            } else if (v.images.length > 1) {
                download(`http://photo.tuchong.com/${element.user_id}/f/${element.img_id}.jpg`, './imgbox/' + title)
            } else {
                console.log(title + ' :目录下不包含任何图片');
            }
        });
    }

    console.log('所有图片下载完毕');
}

// 获取后端 json 数据
var getparsedData = function(params) {
    return new Promise(function(resolve, reject) {
        https.get('https://tuchong.com/rest/tags/%E8%87%AA%E7%84%B6/posts?page=1&count=20&order=weekly', (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve(JSON.parse(rawData));
            });
        });

    })
}

init()






//大图:  http://photo.tuchong.com/1419160/f/7904035.jpg
//photo.tuchong.com/user_id/f/img_id.jpg;