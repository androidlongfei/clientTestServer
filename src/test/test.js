var http = require('http');
var path = require('path');
var fs = require('fs');

function postFile(fileDataInfo, fileKeyValue, req) {
  var boundaryKey = Math.random().toString(16);
  var enddata = '\r\n----' + boundaryKey + '--';

  var dataLength = 0;
  var dataArr = new Array();
  for (var i = 0; i < fileDataInfo.length; i++) {
    var dataInfo = "\r\n----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"" + fileDataInfo[i].urlKey + "\"\r\n\r\n" + fileDataInfo[i].urlValue;
    var dataBinary = new Buffer(dataInfo, "utf-8");
    dataLength += dataBinary.length;
    dataArr.push({
      dataInfo: dataInfo
    });
  }

  var files = new Array();
  for (var i = 0; i < fileKeyValue.length; i++) {
    var content = "\r\n----" + boundaryKey + "\r\n" + "Content-Type: application/octet-stream\r\n" + "Content-Disposition: form-data; name=\"" + fileKeyValue[i].urlKey + "\"; filename=\"" + path.basename(fileKeyValue[i].urlValue) + "\"\r\n" + "Content-Transfer-Encoding: binary\r\n\r\n";
    var contentBinary = new Buffer(content, 'utf-8'); //当编码为ascii时，中文会乱码。
    files.push({
      contentBinary: contentBinary,
      filePath: fileKeyValue[i].urlValue
    });
  }
  var contentLength = 0;
  for (var i = 0; i < files.length; i++) {
    var filePath = files[i].filePath;
    if (fs.existsSync(filePath)) {
      var stat = fs.statSync(filePath);
      contentLength += stat.size;
    } else {
      contentLength += new Buffer("\r\n", 'utf-8').length;
    }
    contentLength += files[i].contentBinary.length;
  }

  req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
  req.setHeader('Content-Length', dataLength + contentLength + Buffer.byteLength(enddata));

  // 将参数发出
  for (var i = 0; i < dataArr.length; i++) {
    req.write(dataArr[i].dataInfo)
    //req.write('\r\n')
  }

  var fileindex = 0;
  var doOneFile = function() {
    req.write(files[fileindex].contentBinary);
    var currentFilePath = files[fileindex].filePath;
    if (fs.existsSync(currentFilePath)) {
      var fileStream = fs.createReadStream(currentFilePath, {
        bufferSize: 4 * 1024
      });
      fileStream.pipe(req, {
        end: false
      });
      fileStream.on('end', function() {
        fileindex++;
        if (fileindex == files.length) {
          req.end(enddata);
        } else {
          doOneFile();
        }
      });
    } else {
      req.write("\r\n");
      fileindex++;
      if (fileindex == files.length) {
        req.end(enddata);
      } else {
        doOneFile();
      }
    }
  };
  if (fileindex == files.length) {
    req.end(enddata);
  } else {
    doOneFile();
  }
}


var dir = path.join(__dirname, 'public');

//测试用例
//http://nodejs.org/api/http.html#http_http_request_options_callback
var fileDataInfo = [{
    urlKey: "abc",
    urlValue: "空格  中文"
  },
  {
    urlKey: "def",
    urlValue: "asdfasfs123477"
  }
]

var files = [{
    urlKey: "file1",
    urlValue: path.join(dir, "upload.html")
  },
  {
    urlKey: "file2",
    urlValue: "文件不存在"
  },
  {
    urlKey: "file3",
    urlValue: ""
  },
  {
    urlKey: "file4",
    urlValue: ""
  },
  {
    urlKey: "file5",
    urlValue: "E:\\Pro 中文  空格.mp3"
  },
  {
    urlKey: "file6",
    urlValue: "E:\\DFBF.jpg"
  },
  {
    urlKey: "file7",
    urlValue: ""
  }
]

var options = {
  host: "localhost",
  port: "8000",
  method: "POST",
  path: "/file2"
}

var req = http.request(options, function(res) {
  console.log("RES:" + res);
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  //res.setEncoding("utf8");
  res.on("data", function(chunk) {
    console.log("BODY:" + chunk);
  })
})

req.on('error', function(e) {
  console.log('problem with request:' + e.message);
  console.log(e);
});
postFile(fileDataInfo, files, req);
console.log("done");
