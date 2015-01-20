var fs = require('fs');

function writeLog(user,message){
  var date = new Date()
  var month = date.getUTCMonth();
  var year = date.getUTCFullYear();

  var path = "logs/"+user+"/";
  var file = path+'/'+month+"_"+year+".txt";

	if(!fs.existsSync(path)){
    fs.mkdirSync(path);
    fs.writeFileSync(file,'');
	}
	else if(!fs.existsSync(file)){
		fs.writeFileSync(file,'');
	}

	fs.readFile(file,{encoding:'utf8'},function(err,data){
    if (err) throw err;

    var result = '';

    if(data.indexOf('##### '+date.getUTCDay() + ' #####') == -1){
      result = '##### '+date.getUTCDay() + ' #####\n';
    }

    result = result+date.getUTCHours()+":"+date.getUTCMinutes()+":"+date.getUTCSeconds()+":"+date.getUTCMilliseconds()+" - "+message+"\n";
    fs.appendFileSync(file,result);
	});
}