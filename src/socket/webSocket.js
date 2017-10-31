/**
 * [WebSocket 逻辑]
 * @param  {[type]} wss [description]
 * @return {[type]}     [description]
 */
import _ from 'lodash';

module.exports = function(wss) {
  /**
   * [broadcastMsg 广播消息]
   * @param  {[type]} msg [description]
   * @return {[type]}     [description]
   */
  wss.broadcastMsg = (msg) => {
    _.each(wss.clients, (client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg)
      }
    })
  }

  wss.getAllWs = (curWs) => {
    let allWs = []
    _.each(wss.clients, (client) => {
      if (curWs !== client && client.readyState === WebSocket.OPEN) {
        allWs.push(client)
      }
    })
    return allWs
  }

  wss.getAllWsId = (curWs) => {
    let allWsIds = []
    if (wss.getAllWs(curWs).length > 0) {}
    return allWsIds
  }
}
