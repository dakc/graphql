const majidai = require("majidai");
const graphqlHTTP = require("./graphql-util");
const wrapperExpress = require("./express-graphql-wrapper");

// create instance
const server = new majidai({port: 8000});

// create routing
server.customRouting({method:["GET", "POST"],routing:"/graphql"}, function(app){
    var dt = wrapperExpress(app)
    graphqlHTTP(dt.req, dt.res);
});

server.start();