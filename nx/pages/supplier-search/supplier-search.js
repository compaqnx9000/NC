var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    inputValue: null,
    hotWord: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let db = app.globalData.db
    db.collection("hotwords").orderBy("count","desc").field({
      word:true
    }).limit(3).get().then(res =>{
      this.setData({
        hotWord: res.data
      })
      console.log(this.data.hotWord)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  unique: function(arr) {
    let unique = {};
    arr.forEach(function(item) {
      unique[JSON.stringify(item)] = item; //键名不会重复
    })
    arr = Object.keys(unique).map(function(u) {
      //Object.keys()返回对象的所有键值组成的数组，map方法是一个遍历方法，返回遍历结果组成的数组.将unique对象的键名还原成对象数组
      return JSON.parse(u);
    })
    return arr;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onInputChangeEvent: function(event) {
    let that = this;
    that.setData({
      inputValue: event.detail.value
    })
  },

  onBlurEvent: function(event) {
    if (event.detail.value.length == 0)
      return

    this.query(event.detail.value)
    // this.addHotword(event.detail.value)
    this.updateHotword(event.detail.value)

  },
  updateHotword: function (keyword){
    /* 测试云函数 */
    wx.cloud.callFunction({
      name: "hotword",
      data: {
        word: keyword
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  query: function(keyword) {
    let db = app.globalData.db

    // 根据供应商名称查找
    let p1 = new Promise((resolve, reject) => {
      db.collection('suppliers').where({
        name: db.RegExp({
          regexp: keyword,
          options: "s"
        })
      }).get().then(res => {
        resolve(res)
      })
    })
    // 根据供应的产品查找
    let p2 = new Promise((resolve, reject) => {
      db.collection('suppliers').where({
        product: db.RegExp({
          regexp: keyword,
          options: "s"
        })
      }).get().then(res => {
        resolve(res)
      })
    })
    // 根据供应到的项目查找
    let p3 = new Promise((resolve, reject) => {
      db.collection('suppliers').where({
        inProj: db.RegExp({
          regexp: keyword,
          options: "s"
        })
      }).get().then(res => {
        resolve(res)
      })
    })
    Promise.all([p1, p2, p3]).then(res => {
      // console.log('p1,p2都调用完毕了')
      this.data.result = []

      this.data.result.push.apply(this.data.result, res[0].data)
      this.data.result.push.apply(this.data.result, res[1].data)
      this.data.result.push.apply(this.data.result, res[2].data)


      var arr_unique = this.unique(this.data.result)
      // 重新生成一个新数组
      var newResult = []

      for (var i = 0; i < arr_unique.length; i += 2) {
        newResult.push(arr_unique.slice(i, i + 2))
      }

      this.setData({
        result: newResult
      })
    }).catch((error) => {
      console.log(error)
    })
  },
  // addHotword:function(word){
    // let db = app.globalData.db
    // db.collection("hotwords").add({
    //   data:{
    //     word: word
    //   }
    // }).then(res=>{
    //   console.log(res)
    // })

  // },
  clearInputEvent: function(e) {
    this.setData({
      'inputValue': ''
    })
  },
  clickHotEvent: function(e) {
    this.setData({
      'inputValue': e.currentTarget.dataset.keyword.word
    })
    // console.log(this.data.inputValue)
    this.query(this.data.inputValue)
    this.updateHotword(this.data.inputValue)

  }
})