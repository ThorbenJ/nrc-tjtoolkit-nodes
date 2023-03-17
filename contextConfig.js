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

            var values = M.render(n.content, data)

            try {
                values = Y.parse(values)
            } catch(e) {
                node.error(e)
                return
            }

            switch (n.scope) {
                case "node":
                    var nid_list = M.render(n.nodes, data).replaceAll('"','').split(",")
                    for (var nid in nid_list){
                        const tn = RED.nodes.getNode(nid_list[nid])
                        if (! tn) {
                            node.error(`Node id ${nid_list[nid]} not found (perhaps disabled?)`)
                            continue
                        }
                        _setMutliCtx(tn.context(), values)
                    }
                    break;
                case "flow":
                case "globl":
                    _setMutliCtx((node.context())[n.scope], values)
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
