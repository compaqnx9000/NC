// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();


const got = require("got")
const APPID = "wx39678dff5a8c49b4"
const APPSECRET = "c57cf4156b794532a5985c353d5c38ac"

const TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET

const CHECK_URL = "https://api.weixin.qq.com/wxa/msg_sec_check?access_token="
                   

// 云函数入口函数
exports.main = async(event, context) => {

  const wxContext = cloud.getWXContext()

  return await db.collection('comments').add({
    data: {
      author: event.author,
      content: event.content,
      openid: wxContext.OPENID,
      supplier: event.supplier,
      avatar: event.avatar,
      model: event.model,
      create_time: event.create_time
      // create_time:db.serverDate()
    }
  })

  // const content = "test";//event.content;
  // const tokenResp = await got(TOKEN_URL);
  // const tokenBody = JSON.parse(tokenResp.body);
  // const token = tokenBody.access_token;
  // const checkResp = await got.post(CHECK_URL + token,{
  //   body:JSON.stringify({
  //     content:content
  //   })
  // });
  // const checkBody = JSON.parse(checkResp.body)
  // console.log(checkBody)

  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}