var util = require('../../utils/util.js')
const app = getApp();
var lng = 0;
var lat = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellData: [],
    comments: [],
    more: false,
    supplier: [],
    userInput: null,
    name: null,
    model: null,
    latitude: 39.931371,
    longitude: 116.536323,
    content: null,
    maskFlag: true,
    myid: null

  },

  clickMore: function() {
    this.setData({
      more: !this.data.more
    })
  },

  deleteComment: function(e) {
    this.setData({
      maskFlag: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('加载onLoad')
    this.data.myid = app.globalData.openId;
    console.log('app.globalData.openId', app.globalData.openId)
    this.setData({
      myid: app.globalData.openId
    })

    let db = app.globalData.db
    this.data.name = options.name;
    db.collection('enterprises').where({
      name: options.name
    }).get().then(res => {
      this.setData({
        cellData: (res.data[0]),
      })
    })

    db.collection('suppliers').where({
      name: options.name
    }).get().then(res => {
      this.setData({
        supplier: (res.data[0]),
        longitude: res.data[0].longitude,
        latitude: res.data[0].latitude,
      })
      lat = res.data[0].latitude;
      lng = res.data[0].longitude

      var markers = [{
        id: 0,
        iconPath: "../../images/location.png",
        latitude: lat,
        longitude: lng,
        width: 32,
        height: 32
      }]
      this.setData({
        markers: markers,
      })
    })

    const systemInfo = wx.getSystemInfoSync();
    this.data.model = systemInfo.model;

    db.collection('comments').where({
      supplier: options.name
    }).get().then(res => {
      this.setData({
        comments: (res.data),
      })
    })

    this.data.markers[0].latitude = lat;
    this.data.markers[0].longitude = lng;

    this.setData({
      markers: this.data.markers,
    })

  },

  onInputEvent: function(e) {
    console.log(e);
    this.setData({
      content: e.detail.value
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 点击“地图”标题重置地图
   */
  onMapClickEvent: function(e) {
    this.setData({
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
  },
  onDeleteClickEvent: function(event) {
    var that = this;
    console.log(event.currentTarget.dataset.id)
    console.log('onDeleteClickEvent', this.data.comments)
    // 从数组中删除
    this.data.comments.forEach(function(item, index) {
      if (item._id == event.currentTarget.dataset.id) {
        console.log('找到了', index);
        that.data.comments.splice(index, 1);
        return;
      }
    })
    let db = app.globalData.db

    wx.showModal({
      title: '提示',
      content: '确定要删除此条评论吗？',
      success(res) {
        if (res.confirm) {
          that.deleteComment(event.currentTarget.dataset.id)
        } else if (res.cancel) {
        }
      }
    })
  },

  deleteComment: function(docId) {
    /* 删除 */
    wx.cloud.callFunction({
      name: "deleteComment",
      data: {
        myid: docId
      },
      success: res => {
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })


    this.setData({
      comments: this.data.comments
    })
  },
  onCommitEvent: function(event) {
    // console.log(app.globalData.userInfo)

    // console.log(event.detail.value.content)
    if (app.isLogin()) {
      wx.showLoading({
        title: '提交中...',
      })
      var time = util.formatTime(new Date());
      wx.cloud.callFunction({
        name: "addComment",
        data: {
          content: event.detail.value.content,
          supplier: this.data.name,
          author: app.globalData.userInfo.nickName,
          avatar: app.globalData.userInfo.avatarUrl,
          model: this.data.model,
          create_time: new Date()
        },
        success: res => {
          console.log(res)
          let db = app.globalData.db

          db.collection('comments').where({
            supplier: this.data.name
          }).get().then(res => {
            this.setData({
              comments: (res.data),
              content: null
            })
            console.log(res)
          })
          wx.hideLoading()
        },
        error: err => {
          console.log(err)
          wx.hideLoading()
        }
      })


    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  }
})