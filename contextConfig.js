module.exports = function(RED) {

    const U = require("./utils");
    const Y = require("yaml");
    const M = require("mustache");

    function ContextConfig(n) {
        RED.nodes.createNode(this,n);
        this.conf = n;
        var node = this;
        const valid_key = /^[_A-Za-z][^.]+$/;

        if (!(n.mode === 'startup' || n.mode === 'msg')) {
            node.error(`Invalid mode: ${n.mode}`)
            return
        }

        function _setMutliCtx(ctx, data){
            if (! data instanceof Object) {
                node.error("Context data is not a hash (object)")
                return false
            }
            for (var k in data) {
                if (! valid_key.test(k)) {
                    node.warn(`Invalid key: ${k}`)
                    continue
                }

                ctx.set(k, data[k])
            }
            return true
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

            switch (n.scope) {
                case "node":
                    for (var nid in data){
                        const tn = RED.nodes.getNode(nid)
                        if (! tn) {
                            node.error(`Node id ${nid} not found`)
                            continue
                        }
                        _setMutliCtx(tn.context(), data[nid])
                    }
                    break;
                case "flow":
                case "globl":
                    _setMutliCtx((node.context())[n.scope], data)
                    break;
                default:
                    node.error(`Invlid scope: ${n.scope}`)
                    return
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
