// 上传文件路由
import _ from 'lodash';
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
import config from '../config/global.js'
const async = require('async');

module.exports = function (app) {
    app.post('/upload', function (req, res) {
        console.log('request', '/upload');
        async.waterfall([
            function (cb) {
                // console.log('__dirname', __dirname)
                var form = new formidable.IncomingForm();
                var uploadDir = app.get('uploadDir');
                // console.log('uploadDir', uploadDir);
                form.uploadDir = uploadDir;
                form.parse(req, function (err, fields, files) {
                    if (err) {

                    }
                    console.log('fields', JSON.stringify(fields)); // 表单传递的input数据
                    let resImgs = []
                    _.each(files, function (file) {
                        console.log('path', file.path);
                        console.log('name', file.name);
                        console.log('type', file.type);
                        console.log('size', file.size);
                        let fileSuffix = file.type.split('/')[1]
                        let oldname = file.path;
                        let newname = `${oldname}.${fileSuffix}`
                        console.log('newname', newname)
                        fs.rename(oldname, newname, function (err) {
                            if (err) console.log(err);
                            console.log('修改成功');
                            let name = ''
                            if (process.platform === 'win32') {
                                // Windows
                                name = newname.substring(newname.lastIndexOf('\\') + 1, newname.length)
                            } else {
                                // unix
                                name = newname.substring(newname.lastIndexOf('/') + 1, newname.length)
                            }
                            console.log('name', name)
                            let resImg = {};
                            resImg.path = `${config.host}:${config.port}/download/${name}`
                            resImg.name = name
                            resImg.size = file.size
                            resImgs.push(resImg)
                            cb(null, resImgs)
                            // if (files.length === resImg.length) {
                            //     cb(null, resImgs)
                            // }
                        });
                    });
                })
            }
        ], function (err, result) {
            if (err) {

            }
            let data = {}
            data.resImgs = result
            console.log('res data', data)
            res.json(data);
        })
    });
}
