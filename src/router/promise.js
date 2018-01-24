import moment from 'moment'
module.exports = function(app) {
  app.get('/baidu', function(req, res) {
    // 时间精确到三位数毫秒
    console.log('/baidu', moment().format('HH:mm:ss.SSS'));
    res.json({
      title: '这是百度',
      nextUrl: '/wangyi'
    });
  });
  app.get('/wangyi', function(req, res) {
    console.log('/wangyi', moment().format('HH:mm:ss.SSS'));
    res.json({
      title: '这是网易',
      nextUrl: '/jd'
    });
  });
  app.get('/jd', function(req, res) {
    console.log('/jd', moment().format('HH:mm:ss.SSS'))
    res.json({
      title: '这是京东',
      nextUrl: ''
    });
  });
}