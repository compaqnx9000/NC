// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async(event, context) => {
  // const _openid = event.userInfo.openId;
  // const count = await db.collection('hotwords').count();
  // const userList = await db.collection('hotwords').get();
  // 查是否存在关键词，如果不存在添加关键词，如果存在更新count
  const count = await db.collection('hotwords').where({
    word: event.word
  }).count();


  if (count.total == 0) {
    return await db.collection('hotwords').add({
      data: {
        word: event.word,
        count: 1
      }
    })
  } else {
    try {
      return await db.collection('hotwords').where({
        word: event.word
      }).update({
        data: {
          count: _.inc(1)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }




  // var x = null;
  // await db.collection('hotwords').where({
  //   word: event.word
  // }).get().then(res => {
  //   x = res.data[0].count + 1
  // })



  // return {

  //   count,
  //   x,
  //   userList,
  //   msg: '妈的'

  // }
  // const a = event.word;
  // db.collection("hotwords").where({
  //   word: a
  // }).get().then(res =>{
  //   console.log(res.data)
  //   return res.data
  // })

  //  db.collection("hotwords").where({
  //   word:a
  // }).update({
  //   data:{
  //     count:9
  //   }
  // })
  // db.collection("hotwords").where({
  //   word: event.word
  // }).get().then(res => {
  //   c = res.data[0].count
  // }).catch(err => {
  //   c = 100
  //   console.error(err)

  // })
  // return c;
}