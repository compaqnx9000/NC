var app = getApp();
let db = app.globalData.db

const util = require('../../utils/util.js')

Page({
  data: {
    cellData: [],
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    finished: 0,
    hasMoreData: true,
    total: 0
  },
  initData: function (pullDownRefresh) {
    if (pullDownRefresh) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
    }
    // 做了分页，先查询总共有多少条记录
    db.collection('contracts').count().then(res => {
      this.setData({
        total: (res.total),
        hasMoreData: true
      })
    })

    // 查询完成了多少合同
    db.collection('contracts').where({
      precent: 100
    }).count().then(res => {
      this.setData({
        finished: (res.total),
      })
    })

    // 请求5条数据
    db.collection('contracts').limit(5).get().then(res => {
      this.setData({
        cellData: res.data
      })
      if (pullDownRefresh) {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      }
    })
  },
  onLoad: function() {
    this.initData(false);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.initData(true);
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

    db.collection('contracts').skip(count).limit(5).get().then(res => {
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