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
import familyArchives from './router/familyArchives.js'
import _ from 'lodash'

const app = express()

// config
app.set('uploadDir', path.join(__dirname, 'download'))
app.set('downloadDir', path.join(__dirname, 'download'))

// static file
app.use(express.static(path.join(__dirname, 'download')))

// middle
app.use(cors())
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


app.listen(config.port);
console.log(`server start in ${config.port} port`)
