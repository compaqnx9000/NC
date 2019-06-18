var app = getApp();
let db = app.globalData.db

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellData: [],
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    cooperated: 0,
    hasMoreData: true,
    total: 0
  },
  initData(pullDownRefresh) {
    if (pullDownRefresh) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
    }
    // 做了分页，先查询总共有多少条记录
    db.collection('suppliers').count().then(res => {
      this.setData({
        total: (res.total),
        hasMoreData:true
      })
    })

    db.collection('suppliers').limit(5).get().then(res => {
      this.setData({
        cellData: res.data
      })
      if (pullDownRefresh) {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      }
    })

    db.collection('suppliers').where({
      cooperated: true
    }).count().then(res => {
      this.setData({
        cooperated: (res.total),
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(false);
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
    this.initData(true);
    // wx.showNavigationBarLoading() //在标题栏中显示加载

    // db.collection('suppliers').get().then(res => {
    //   this.setData({
    //     cellData: res.data,
    //   })
    //   wx.hideNavigationBarLoading(), //完成停止加载
    //     wx.stopPullDownRefresh() //停止下拉刷新
    //   console.log(this.cellData)
    // })
    //模拟加载
    // setTimeout(function () {
    //   // complete
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // console.log('到底了');
    let count = this.data.cellData.length;
    if (count == this.data.total) {
      this.setData({
        hasMoreData: false
      })
      return;
    }

    db.collection('suppliers').skip(count).limit(5).get().then(res => {
      this.setData({
        cellData: this.data.cellData.concat(res.data)
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})