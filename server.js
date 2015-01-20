/*TODO: Implement remaining MIME types*/

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var config = require('./config');
var port = config.port;

var userManager = require('./userManagement');

http.createServer(function(req,res){
  var pathUrl = url.parse(req.url,true).pathname;

	if(req.method.toLowerCase() == 'get'){
	  var routes = require('./routes');
	  if(req.url == '/'){
	    res.writeHead(302,{'location':'/index.html'});
      res.end();
	  }
	  if(routes[pathUrl] != undefined && fileExtension(req.url) == 'html'){
        res.writeHead(200,{'Content-Type':'text/html'});
        var html = fs.readFileSync(routes[req.url],'utf8');
        res.end(html);
      }
      else if(fileExtension(req.url) == "js"){
      	res.writeHead(200,{'Content-Type':'text/javascript'});
      	var javascript = fs.readFileSync("../public/"+req.url);
      	res.end(javascript);
      }
      else if(fileExtension(req.url) == "css"){
      	res.writeHead(200,{'Content-Type':'text/css'});
      	var css = fs.readFileSync("../public/"+req.url);
      	res.end(css);
      }
      else if(fileExtension(req.url)=="gif"
              || fileExtension(req.url)=="jpg" || fileExtension(req.url)=="jpeg" || fileExtension(req.url) == "jpe"
              || fileExtension(req.url)=="png"
              || fileExtension(req.url)=="svg" || fileExtension(req.url)=="svgz"
              || fileExtension(req.url)=="tif" || fileExtension(req.url)=="tiff"){
        var type = fileExtension(req.url);
        
        if(type=="jpg" || type=="jpe"){type="jpeg";}
        else if(type="svg" || type="svgz"){type="svg+xml";}
        else if(type="tif"){type="tiff";}

        type = "image/"+type;
        rest.writeHead(200,{'Content-Type':type})
        var image = fs.readFileSync("../public/"+req.url);
        res.end(image);
      }
	}
  else if(req.method.toLowerCase() == 'post'){
    if(pathUrl == '/createUser'){
      var query = url.parse(req.url,true).query;
      var userName = query.username;
      var password = query.password;
      var email = query.email; 
      
      userManager.validateUser(userName, password, email,function(result){
        if(result == true){
          userManager.createUser(userName,password,email,function(data){
            res.writeHead(201);
            res.end();
          });
        }
        else{
          res.writeHead(400);
          res.end(result);
        }
      });
    }
    else{
      return;
    }
  }
  else{
    return;
  }
}).listen(config.port);

function fileExtension(file){
	file = file.split('.');
	var extension = file[file.length-1];
	return extension;
}