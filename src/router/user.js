/**
 * [测试分页查询]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
import _ from 'lodash';
import pingData from '../testData/paging.js'

module.exports = function (app) {
    app.get('/user', function (req, res) {
        console.log('get user query', req.query);
        let start = parseInt(req.query.start)
        let count = parseInt(req.query.count)
        let end = start + count
        console.log(start, end);
        let result = _.slice(pingData.paging, start, end)
        setTimeout(function () {
            // res.json(401, pingData.paging)
            res.json({
                data: result,
                total: pingData.paging.length
            })
        }, 2000)
    })
}
