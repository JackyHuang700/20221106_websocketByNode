"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import express 和 ws 套件
// const koa = require("koa")
const ws_1 = require("ws");
//指定開啟的 port
// const PORT = 3000
//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
// koa().listen(PORT, () => console.log(`Listening on ${PORT}`))
//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new ws_1.WebSocketServer({
    port: 3000,
});
wss.on("connection", function connection(ws, req) {
    console.log("客戶端已連線");
    let sendNowTime /**NodeJS.Timer */ = undefined;
    //對 message 設定監聽，接收從 Client 發送的訊息
    ws.on("message", function message(data, isBinary) {
        console.log(`Round-trip time: ${Date.now()} ms`);
        const clients = wss.clients; //取得所有連接中的 client
        const _type = enum_demo.type1; // 展示模式
        if (_type === enum_demo.type1) {
            //做迴圈，發送訊息至每個 client
            clients.forEach(client => {
                if (client === ws && client.readyState === /**WebSocket.OPEN */ 1) {
                    client.send("伺服器 onMessage回復:" + data, {
                        binary: isBinary,
                    });
                }
            });
        }
        else if (_type === enum_demo.type2) {
            clients.forEach(client => {
                if (client === ws && client.readyState === /**WebSocket.OPEN */ 1) {
                    client.send("伺服器 onMessage回復:" + data, {
                        binary: isBinary,
                    });
                }
            });
        }
        else if (_type === enum_demo.type3) {
            //做迴圈，發送訊息至每個 client
            clients.forEach(client => {
                if (client === ws && client.readyState !== /**WebSocket.OPEN */ 1) {
                    client.send("伺服器 onMessage回復:" + data, {
                        binary: isBinary,
                    });
                }
            });
        }
        else if (_type === enum_demo.type4) {
            ws.send(data);
            //固定送最新時間給 Client
            sendNowTime = setInterval(() => {
                ws.send("向客戶端固定傳送資訊" + String(new Date()));
            }, 1000);
        }
    });
    ws.on("close", () => {
        clearInterval(sendNowTime); // 清除定時器
        console.log("Close connected"); //連線中斷時停止 setInterval
    });
});
/** demo 模式 */
var enum_demo;
(function (enum_demo) {
    /** 客戶端只對自己的連線發送訊息 */
    enum_demo[enum_demo["type1"] = 1] = "type1";
    /** 一個客戶端 WebSocket 廣播到所有連接的 WebSocket 客戶端，包括它自己。 */
    enum_demo[enum_demo["type2"] = 2] = "type2";
    /** 一個客戶端 WebSocket 廣播到所有其他連接的 WebSocket 客戶端，不包括它自己。 */
    enum_demo[enum_demo["type3"] = 3] = "type3";
    /** data 為 Client 發送的訊息，現在將訊息原封不動發送出去 */
    enum_demo[enum_demo["type4"] = 4] = "type4";
})(enum_demo || (enum_demo = {}));
