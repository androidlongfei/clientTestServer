import request from 'request'
import md5 from 'blueimp-md5'
const Hashes = require('jshashes')

module.exports = {
  getToken: function(req, res) {
    console.log('/getToken')
    let sendData = {
      key: '123',
      work: {
        name: 'hhh'
      }
    }
    fetchToken(sendData, function(error, result) {
      if (error) {
        console.log('error', error);
      }
      console.log('result', result);
    })
  },
  createrUser: function(req, res) {
    console.log('request createrUser');
    let sendData = {
      accid: Config.accid,
      name: Config.name
    }
    console.log('sendData', sendData)
    createrIMUser(sendData, function(error, body) {
      if (error) {
        console.log('error', error)
      }
      console.log('body', body)
    })
  },
  fetchMemberList: function(req, res) {
    console.log('request fetchMemberList body', req.body)
    // console.log('request fetchMemberList params', req.params)
    console.log('request fetchMemberList query', req.query)
    console.log('request fetchMemberList headers', req.headers)
    let memberList = generateMemberList()
    // 设置响应头
    // console.log('req.headers.token', req.headers.token)
    res.setHeader('token', req.headers.token)
    console.log('res.headers......', res.req.headers)
    res.json({
      code: 200,
      memberList: memberList
    })
  },
  login: function(req, res) {
    console.log('request login body', req.body)
    let accid = req.body.usercode
    let pwd = req.body.pwd
    if (!accid || !pwd) {
      res.json({
        code: 410,
        msg: '参数错误'
      })
    } else {
      let data = {
        accid: accid,
        token: md5(pwd),
        code: 200
      }
      console.log('return data', data);
      res.json(data);
    }
  }
}

/**
 * 生成测试会员列表
 * @return {[type]} [description]
 */
const generateMemberList = function() {
  let memberList = []
  let member = {
    warning: '轻度高血压0',
    mobilePhone: 15512344832,
    healthStatus: '已干预0',
    endTime: '2017-9-8 15:24',
    account: 'hlf123456',
    avatar: ''
  }
  let member1 = {
    warning: '轻度高血压1',
    mobilePhone: 15512344832,
    healthStatus: '已干预1',
    endTime: '2017-9-8 15:24',
    account: 'hlf123',
    avatar: ''
  }
  memberList.push(member)
  memberList.push(member1)
  return memberList
}

// 生成随机字符串 借用微信的
const createNonceStr = function() {
  return Math.random().toString(36).substr(2, 15)
}
// 生成时间戳 秒值 借用微信的
const createTimestamp = function() {
  return parseInt(new Date().getTime() / 1000) + ''
};
// 进行SHA1哈希计算，转化成16进制字符 这里用的库为jshashes
const generateSHA1SignatureByHex = (appSecret, nonce, timestamp) => {
  const sha1Str = appSecret + nonce + timestamp;
  const SHA1 = new Hashes.SHA1().hex(sha1Str)
  return SHA1
}

const Config = {
  appKey: 'b54534aa478ed07732798a5772b90c6b',
  appSecret: '1122111222111',
  accid: 'hlf999',
  name: 'hlf999'
}

// 拼装请求头
const getRequestSmsHeaders = function() {
  let appSecret = Config.appSecret
  let nonce = createNonceStr()
  let curTime = createTimestamp()
  const appkey = Config.appKey;
  const SHA1 = generateSHA1SignatureByHex(appSecret, nonce, curTime)
  return {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'AppKey': appkey,
    'Nonce': createNonceStr(),
    'CurTime': createTimestamp(),
    'CheckSum': SHA1
  }
}

// 获取token
const fetchToken = function(data, callback) {
  request({
    url: 'http://127.0.0.1:9100/testPost',
    headers: getRequestSmsHeaders(),
    method: 'POST',
    form: data
  }, function(error, response, body) {
    if (error) {
      console.log('error', error)
      callback()
    } else {
      callback(null, response)
    }
  })
}

// 创建用户
const createrIMUser = function(data, callback) {
  console.log('createrIMUser headers', getRequestSmsHeaders())
  request({
    url: 'https://api.netease.im/nimserver/user/create.action',
    headers: getRequestSmsHeaders(),
    method: 'POST',
    form: data
  }, function(error, response, body) {
    if (error) {
      console.log('error', error)
      callback()
    } else {
      console.log('createrIMUser response', response.headers)
      callback(null, body)
    }
  })
}
