module.exports = function(app){
    var request = app.native.request();
    request.accepts = (...args) => "html";
    request.url = app.client.url();
    request.body = app.client.method() == "GET" ? app.data.getParams() : app.data.postParams();
  
    var response = app.native.response();
    return {req: request,res: response}
}