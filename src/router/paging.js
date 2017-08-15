/**
 * [测试分页查询]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
import _ from 'lodash';
import pingData from '../testData/paging.js'

module.exports = function (app) {
    app.post('/paging', function (req, res) {
        console.log('paging body data', req.body);
        let start = parseInt(req.body.start)
        let count = parseInt(req.body.count)
        let end = start + count
        console.log(start, end);
        let reust = _.slice(pingData.paging, start, end)
        setTimeout(function () {
            res.json({
                testData: reust,
                total: pingData.paging.length
            })
        }, 2000)
    })
}
