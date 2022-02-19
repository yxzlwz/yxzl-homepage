const request = require('request');
const fs = require('fs')
console.log(new Date().toLocaleString())
request('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN', (err, res, body) => {
    let url = "", data = JSON.parse(res.body)["images"];
    for (let i = 0; i < data.length; i++) {
        url = url + "\"" + data[i]["url"] + "\"" + ",";
    }
    url = "getBingImages([" + url.slice(0, -1) + "])";

    fs.writeFile('assets/json/images.json', url, err => {
        if (err) {
            console.error(err)
            return
        }
        console.log("Sucess")
    })
});
