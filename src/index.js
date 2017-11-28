import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import config from './config/global.js'
import uploadRouter from './router/upload.js'
import testRouter from './router/test.js'
import downloadRouter from './router/download.js'
import pagingRouter from './router/paging.js'
import userRouter from './router/user.js'
import authRouter from './router/auth.js'
import imRouter from './router/im.js'
import sysMessageRouter from './router/sysMessage.js'
import familyArchives from './router/familyArchives.js'
import _ from 'lodash'
import moment from 'moment'
import md5 from 'blueimp-md5'
import doSocket from './socket/webSocket.js'
import WebSocket from 'ws'

/**
 * WebSocket
 * @type {WebSocket}
 */
const wss = new WebSocket.Server({
  port: 3001
});

wss.on('connection', (ws) => {
  console.log('连接成功', moment())
  ws.socketId = md5(moment())
  ws.on('message', (data) => {
    console.log(`接收数据socketId:${ws.socketId}:`, data)
  })

  ws.on('close', (code) => {
    console.log(`关闭连接socketId:${ws.socketId}:`, code)
  })

  setInterval(function() {
    var data = {
      mtype: 2,
      mid: md5(moment()),
      timeStamp: moment(),
      data: {
        seqNo: '2017111315052500016'
      },
      mtitle: '用户李红的高血压体检结果有部分异常,请您关注',
      unread: 1,
      mcontent: '',
      mtname: '预警'
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data))
    }
  }, 1 * 60 * 1000)
})

doSocket(wss)

const app = express()

// config
app.set('uploadDir', path.join(__dirname, 'download'))
app.set('downloadDir', path.join(__dirname, 'download'))

// static file
app.use(express.static(path.join(__dirname, 'download')))

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTION')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,token,lktoken')
  res.header('Access-Control-Allow-Credentials', 'true')
  next();
};

// 跨域
// app.use(allowCrossDomain);

// cosnt corsOptions = {
//   // origin: 'http://10.4.52.152:8080',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   credentials: true,
//   preflightContinue: true,
//   allowedHeaders: 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,token,lktoken'
// }

const corsOptions = {
  origin: 'http://10.4.52.152:8080',
  credentials: true // 客户端带cookie必须设置为true
}

// middle
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// 需要授权
const authlist = ['/user']

const requireAuth = (req, res, next) => {
  const path = req.path
  console.log('req.path', req.path)
  let isNeedAuth = false
  _.find(authlist, authItem => {
    if (_.startsWith(path, authItem)) {
      isNeedAuth = true
      return true
    }
  })
  if (isNeedAuth) {
    // need to auth
    // console.log('req', req.headers)
    let token = req.headers.token
    console.log('token', token)
    if (token === config.token) {
      console.log('allow access', req.originalUrl)
      next()
    } else {
      console.log('not allow access, need auth', req.originalUrl)
      res(401)
    }
  } else {
    // no auth
    next()
  }
}

app.all('*', requireAuth)

// router
uploadRouter(app)
downloadRouter(app)
testRouter(app)
pagingRouter(app)
userRouter(app)
authRouter(app)
familyArchives(app)
imRouter(app)
sysMessageRouter(app)

app.listen(config.port);
console.log(`server start in ${config.port} port`)
