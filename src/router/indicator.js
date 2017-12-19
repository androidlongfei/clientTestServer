// 指标
import _ from 'lodash'

module.exports = function(app) {
  // 查询指标
  app.post('/indicators/queryFocus', function(req, res) {
    let bodyParamter = req.body
    let headerParamter = req.headers
    console.log('/indicators/queryFocus =>', bodyParamter)
    if (headerParamter.cookie) {
      // console.log('cookie =>', headerParamter.cookie)
    }
    if (headerParamter.lktoken) {
      // console.log('lktoken => ', headerParamter.lktoken)
    }
    res.json({
      status: '1',
      message: '获取指标成功',
      data: {
        dataList: allIndicators
      }
    });
  });

  // 更新指标
  app.post('/indicators/updateFocus', function(req, res) {
    let bodyParamter = req.body
    console.log('bodyParamter', bodyParamter)
    // let data = JSON.parse(bodyParamter.data)
    let data = bodyParamter.data
    let dataList = data.dataList
    console.log('/indicators/updateFocus', dataList);
    resetIndicators()
    _.each(dataList, (indicators) => {
      selectIndicators(indicators)
    })
    res.json({
      status: '1',
      message: '提交数据成功'
    })
  })
}

const resetIndicators = () => {
  _.each(allIndicators, (indicators, index) => {
    indicators.quotaMark = '0'
  })
}

const selectIndicators = (curIndicators) => {
  _.each(allIndicators, (indicators, index) => {
    if (curIndicators.quotaCode == indicators.quotaCode) {
      indicators.quotaMark = '1'
    }
  })
}

const allIndicators = [{
    'quotaCode': 'code1',
    'quotaName': '血压',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code2',
    'quotaName': 'BMI指数',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code3',
    'quotaName': '面舌诊',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code11',
    'quotaName': '体脂',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code4',
    'quotaName': '体重',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code5',
    'quotaName': '空腹血糖',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code12',
    'quotaName': '血脂',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code6',
    'quotaName': '心率',
    'quotaMark': '0'
  }, {
    'quotaCode': 'code14',
    'quotaName': '体温',
    'quotaMark': '0'
  },
  {
    'quotaCode': 'code8',
    'quotaName': '心电',
    'quotaMark': '0'
  },
  {
    'quotaCode': 'code9',
    'quotaName': '防摔',
    'quotaMark': '0'
  },
  {
    'quotaCode': 'code10',
    'quotaName': '睡眠',
    'quotaMark': '0'
  }
]

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
