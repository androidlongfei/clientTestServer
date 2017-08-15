// 下载文件router

import path from 'path'

module.exports = function (app) {
    app.get('/download/:filename', function (req, res) {
        console.log('param', req.params);
        let filename = req.params.filename
        console.log('filename', filename);
        let filePath = path.join(app.get('downloadDir'), filename)
        console.log('filePath', filePath);
        res.sendFile(filePath);
    });
}
