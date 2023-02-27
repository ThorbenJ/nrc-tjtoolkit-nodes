module.exports = function(RED) {

    // const U = require("./utils");

    function ContextConfig(n) {
        RED.nodes.createNode(this,n);
        this.conf = n;
        var node = this;

        this.on('input', function(msg) {


        });
    }
    RED.nodes.registerType("contextConfig",ContextConfig);
};
