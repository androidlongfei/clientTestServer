module.exports = function(app) {
    app.post('/familyArchives', function(req, res) {
        console.log('post familyArchives body data', req.body);
        res.json({
            'status': 'success'
        });
    });

    app.get('/familyArchives/baseInfo', function(req, res) {
        console.log('get familyArchives body data', req.query)
        var familyArchives = {
            street: '南海家园六里',
            committee: '南海家园居委会',
            recordType: 'recordType_02',
            pests: 'pests_02,pests_03,pests_04'
        }
        res.json(familyArchives)
    });

    app.get('/familyArchives/identityInfo', function(req, res) {
        console.log('get identityInfo body data', req.query)
        var identityData = {
            identityName: '李四',
            identitySex: '男',
            identityDate: '1970-05-06',
            identityNumber: '429006197005061216',
            identityPhone: '18600900941'
        }
        res.json(identityData)
    });
}
