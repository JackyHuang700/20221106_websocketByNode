const Koa = require("koa")
const router = require("koa-router")()
const websockify = require("koa-websocket")
const app = websockify(new Koa())

let wsObj = {} // 用于存储所有的websocket连接(實際為資料庫資料)

//创建socket接口
router.all("/koa/ws", async (ctx: any) => {
  const { id } = ctx.query //客户端调接口会传频道id
  console.log("id: ", id)
  ;(wsObj as any).id = ctx // 儲存id

  ctx.websocket.send("連接成功") // 給客戶端發送連結成功消息

  // 監聽客戶端發送過來的訊息
  ctx.websocket.on("message", (message: any) => {
    console.log("message: ", message)

    // uid為客戶端發id，可以根據處理結果在發送
    const { uid } = JSON.parse(message)
    if (!(wsObj as any)[uid]) {
      ctx.websocket.send(`${uid}尚未連接`)
    } else {
      ;(wsObj as any)[uid].websocket.send("發送成功")
    }

    ;(wsObj as any)[uid].websocket.send("伺服器傳送訊息" + message)

  })

  // 當連線關閉
  ctx.websocket.on("close", () => {
    console.log("Close connected")
  })

  ctx.websocket.send("message")
})

// 注册路由允许使用中间件
app.ws.use(router.routes()).use(router.allowedMethods())

//端口号后面可采用动态的
app.listen(3000, () => console.log(`socket listening on port ${3000}`))
