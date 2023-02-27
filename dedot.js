
// function _deDot(obj) {
//     for (var k in obj) {
//         if (k.indexOf('.')>0) {
//             var nk = k.replaceAll('.', '~')
//             delete Object.assign(obj, {[nk]: obj[k] })[k]
//         }
//         if (obj[k] instanceof Object) {
//            _deDot(obj[k])
//         }
//     }
// }

module.exports = function(RED) {

    const U = require("./utils");

    function Dedot(n) {
        RED.nodes.createNode(this,n);
        this.conf = n;
        var node = this;
        
        this.on('input', function(msg) {

            // _deDot(msg)
            U.deDot(msg)
            node.send(msg)

        });
    }
    RED.nodes.registerType("dedot",Dedot);
};
