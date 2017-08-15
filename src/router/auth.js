import config from '../config/global.js'

module.exports = function (app) {
    app.post('/login', function (req, res) {
        console.log('/login')
        console.log('login body data', req.body)
        let result = {
            token: config.token,
            user: {
                username: req.body.username
            },
            tokenExpirationAt: 1
        }
        res.json(result);
    });

    app.post('/logout', function (req, res) {
        console.log('/logout')
        console.log('user body data', req.body)
        let result = {
            response: 'ok'
        }
        res.json(result);
    });
}
