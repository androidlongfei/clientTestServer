import _ from 'lodash'

module.exports = function(app) {
  // 获取系统消息列表
  app.post('/fetchSystemList', function(req, res) {
    let bodyParamter = req.body
    let headerParamter = req.headers
    console.log('/fetchSystemList bodyParamter =>', bodyParamter)
    if (headerParamter.cookie) {
      // console.log('cookie =>', headerParamter.cookie)
    }
    if (headerParamter.lktoken) {
      // console.log('lktoken => ', headerParamter.lktoken)
    }
    let pageIndex = bodyParamter.pageIndex // 当前页码
    let pageSize = bodyParamter.pageSize // 每页显示的条数
    let pageCount = Math.ceil(myMessageList.length / pageSize) // 返回的总页数
    let newMessageList = []
    console.log('fetch myMessageList.length', myMessageList.length);
    newMessageList = pagingArray(myMessageList, pageIndex, pageSize)
    res.json({
      'status': 'ok',
      'message': '获取数据成功',
      data: {
        messageList: newMessageList
      },
      totalPages: pageCount
    });
  });

  // 消息设置为已读取
  app.post('/updateDoctorMessageStatus', function(req, res) {
    let bodyParamter = req.body
    let messageList = bodyParamter.messageList
    console.log('updateDoctorMessageStatus messageList', messageList);
    _.each(myMessageList, (itemMessage, index) => {
      if (itemMessage.mid === messageList[0]) {
        itemMessage.mstatus = 3
      }
    })
    res.json({
      'status': 'ok',
      'message': '设置已读成功'
    })
  });

  app.post('/deleteDocMessage', function(req, res) {
    // console.log('deleteDocMessage body data', req.body);
    let bodyParamter = req.body
    let messageList = bodyParamter.messageList
    // console.log('deleteDocMessage messageList', messageList);
    let delIndex = -1
    _.each(myMessageList, (itemMessage, index) => {
      // console.log('index', index, messageList[0], itemMessage.mid)
      if (itemMessage.mid === messageList[0]) {
        delIndex = index
      }
    })
    // console.log('delIndex', delIndex)
    if (delIndex !== -1) {
      myMessageList.splice(delIndex, 1)
      console.log('del myMessageList', myMessageList.length);
    }
    res.json({
      'status': 'ok',
      'message': '删除消息成功'
    })
  })
}

let myMessageList = [{
  mid: 100,
  mtype: 1,
  mtitle: '用户李红的高血压体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500016',
  checkType: '中医'
}, {
  mid: 101,
  mtype: 1,
  mtitle: '用户李红的高血脂体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500016',
  checkType: '中医'
}, {
  mid: 102,
  mtype: 1,
  mtitle: '用户李红的高血糖体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500017',
  checkType: '中医'
}, {
  mid: 103,
  mtype: 1,
  mtitle: '用户李红的高血脂体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500018',
  checkType: '中医'
}, {
  mid: 104,
  mtype: 1,
  mtitle: '用户李红的高血糖体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500017',
  checkType: '中医'
}, {
  mid: 105,
  mtype: 1,
  mtitle: '用户李红的高血脂体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500018',
  checkType: '中医'
}, {
  mid: 106,
  mtype: 1,
  mtitle: '用户王五的高血脂体检结果有部分异常,请您关注',
  mtname: '预警',
  mstatus: 2,
  seqNo: '2017111315052500018',
  checkType: '西医'
}]

/**
 * [pagingArray 分页数据]
 * @param  {[type]} array     [数据]
 * @param  {[type]} pageIndex [页码从1开始]
 * @param  {[type]} pageNum   [每页显示的条数]
 * @return {[type]}           [description]
 */
const pagingArray = (array, pageIndex, pageNum) => {
  var startPosition, endPosition
  startPosition = pageIndex * pageNum - pageNum
  endPosition = pageIndex * pageNum
  if (startPosition < 0) {
    startPosition = 0
  }
  if (endPosition > array.length) {
    endPosition = array.length
  }
  // console.log('s-e', startPosition, endPosition)
  return array.slice(startPosition, endPosition)
}
