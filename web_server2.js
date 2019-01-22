var http=require('http');
var fs = require('fs');

http.createServer(
    function (req,res) {
       if (req.url !=='/') return;
       fs.writeFile(__dirname + '/header01.json',JSON.stringify(req.headers), 
       error => { 
         if (error) return console.log(error);
         console.log('Http Header save');}
             );
    // read file
    // fs.readFile(__dirname+ '/data01.html', (error,data) => {
    //     if (error){
    //         res.writeHead(500,{'Content-Type':'text/plain'});
    //         res.end('500-Server Wrong');
    //     } else {
    //         res.writeHead(200,{'Content-Type':'text/plain'});
    //         res.end(data);
    //     }
    // } 

    // );
).listen(4040);
 console.log("Server started on localhost:4040; press Crtl+C...")