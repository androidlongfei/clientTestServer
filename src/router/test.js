module.exports = function(app) {
  app.post('/test', function(req, res) {
    console.log('/test')
    res.json({
      'number': 80
    });
  });

  app.post('/testPost', function(req, res) {
    console.log('testPost body data', req.body);
    console.log('testPost headers', req.headers);
    res.json(req.body);
  });

  app.post('/front/updateArchives.do', function(req, res) {
    console.log('testPost body data', req.body);
    res.json(req.body);
  });

  app.post('/test/fetch', function(req, res) {
    console.log('testPost body data', req.body);
    res.json(req.body);
  });
}