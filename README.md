# nrc-elasticsearch-storage

A [Node-RED](http://www.nodered.org) contributed (NRC) module with extra/toolkit nodes.

When creating flows, or other technology specific nodes, I sometimes find an unanswered need, so created some nodes for them here.

## Nodes

 - dedot - Mustache does not support key names with dots "." in them. This will will dedot all keys in msg, converting them to tilda ('.' -> '~')
 - contextConf - A node dedicated to setting context vairables, with various accessibility features (such as mustache templates)
   Note: You already can set context values via `change` and `function` nodes.


## Install

```
npm install nrc-tjtoolkit-nodes
```


