App({


  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {



    wx.cloud.init({
      traceUser: true
    })

    this.getOpenId();
    this.globalData.db = wx.cloud.database()

    this.loadUserInfo()

    console.log("app start")
    console.log(this.globalData.userInfo)
  },

  loadUserInfo: function() {
    const that = this;
    wx.getSetting({
      success: res => {
        const isUserInfo = res.authSetting['scope.userInfo'];
        if (isUserInfo) {
          wx.getUserInfo({
            success: res => {
              const userInfo = res.userInfo;
              that.globalData.userInfo = userInfo;
              console.log(this.globalData.userInfo)

            }
          })
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    this.updateCheck()

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },

  updateCheck: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  isLogin: function() {
    if (this.globalData.userInfo) {
      return true;
    } else {
      return false;
    }
  },

  setUserInfo: function(userInfo) {
    this.globalData.userInfo = userInfo;
  },

  getOpenId:function(){
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        this.globalData.openId = res.result.openid;
        console.log(this.globalData.openId)

      },
      error: err => {
        console.log(err)
      }
    })
  },

  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    navHeight: 20 + 46,
    db: null,
    test: '测试',
    userInfo: null,
    openId:""
  }

})