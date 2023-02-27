module.exports = function(RED) {

    const U = require("./utils");
    const Y = require("yaml");
    const M = require("mustache");

    function ContextConfig(n) {
        RED.nodes.createNode(this,n);
        this.conf = n;
        var node = this;
        const valid_key = /^[_A-Za-z][^.]+$/;

        if (!(n.scope === 'flow' || n.scope === 'global')) {
            node.error("contextConfig: Invalid scope: "+n.scope)
            retrun
        }
        if (!(n.mode === 'startup' || n.mode === 'msg')) {
            node.error("contextConfig: Invalid mode: "+n.mode)
            retrun
        }


        function configureContext(msg){

            var data = U.prepData(node, msg)

            data = M.render(n.content, data)

            try {
                data = Y.parse(data)
            } catch(e) {
                node.error(e)
                return
            }

            const ctx = node.context()
            for (var k in data) {
                if (! valid_key.test(k)) {
                    node.warn("contextConfig: Invalid key: "+k)
                    continue
                }

                ctx[n.scope].set(k, data[k])
            }

        }
        this.on('input', function(msg) {

            if (n.mode !== 'msg')
                return

            configureContext(msg)

        });

        if (n.mode === 'startup')
            configureContext({})
    }
    RED.nodes.registerType("contextConfig",ContextConfig);
};
