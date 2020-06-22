const majidai = require("majidai");
const graphqlHTTP = require("./graphql-util");

// create instance
const server = new majidai({ http: { port: 8000 } });
server.on("stdout", console.log);
server.on("stderr", console.error);

// must listen to GET & POST on same path
server.listen({method:["GET", "POST"],path:"/graphql"}, function(req, res){
    req.body = req.method == "GET" ? req.mj.getParams() : req.mj.postParams();
    graphqlHTTP(req, res);
});

server.start();