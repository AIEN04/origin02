var http=require('http');

http.createServer(
    function (req,res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(`<h1>HelloWorld!!</h1><br>Where are you from !! <br> Taiwan`);
    }
).listen(4040);
 console.log("Server started on localhost:4040; press Crtl+C...")