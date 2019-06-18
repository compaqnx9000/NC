import WxCountUp from '../../plugins/WxCountUp.js'
const app = getApp();
let db = app.globalData.db
var mychart = null

// 1、引入依赖脚本
import * as echarts from '../../ec-canvas/echarts';

let chart = null;
var option = {
  backgroundColor: '#fafcfe',
  color: ['#fa6460', '#85d3e4', '#fbb34f', '#118155', '#de65ad','#feda66','#178dc2','#89b0ba','#9bd2dc'],

  series: [{
    name: '访问来源',
    type: 'pie',
    radius: ['40%', '85%'],
    data: [{
        value: 120,
        name: '江西龙虎山古越水街项目'
      },
      {
        value: 50,
        name: '河北秦皇岛祖山项目'
      },
      {
        value: 60,
        name: '河北梦廊坊项目'
      },
      {
        value: 300,
        name: '山东文旅大数据项目'
      },
      {
        value: 700,
        name: '西藏自治区旅游项目'
      },
      {
        value: 18,
        name: '温州楠溪江项目'
      }

    ],
    labelLine: {
      normal: {
        show: false
      }
    },

    label: {
      normal: {
        show: true,
        rich: {},
        position: 'inside',
        textStyle: {
          color: 'white' // 改变标示文字的颜色
        }
      },
      emphasis: {
        show: true,
        textStyle: {
          fontSize: '28',
          fontWeight: 'bold',
          color: 'white'
        }
      }
    }


  }]
};



// 2、进行初始化数据
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);




  mychart = chart;
  chart.setOption(option);
  return chart;
}




Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart // 3、将数据放入到里面
    },
    projects: [],
    number: 0
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('option', option)
    var hostTeamInfo = []

    db.collection('pie').field({
      name: true,
      value: true
    }).get().then(res => {
      hostTeamInfo = res.data;

      option.series[0].data = hostTeamInfo //根据前文，设置左侧的数据
      mychart.setOption(option);
    })

    db.collection('pie').get().then(res => {
      this.setData({
        projects: res.data
        
      })

      var sum = 0;
      for (var i = 0; i < this.data.projects.length; i++) {
        sum += this.data.projects[i].value;//前提是arr中各项是数字，而不是数字字符串
        //如果是数字字符串：sum += Number(arr[i]);
      }

      this.setData({
        number: sum
      })

      this.countUp = new WxCountUp('number', this.data.number, {}, this);
      // 开始动画
      this.countUp.start();

    })

    

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
    var hostTeamInfo = []

    db.collection('pie').field({
      name: true,
      value: true
    }).get().then(res => {
      hostTeamInfo = res.data;

      option.series[0].data = hostTeamInfo //根据前文，设置左侧的数据
      mychart.setOption(option);
    })

    db.collection('pie').get().then(res => {
      this.setData({
        projects: res.data

      })

      var sum = 0;
      for (var i = 0; i < this.data.projects.length; i++) {
        sum += this.data.projects[i].value;//前提是arr中各项是数字，而不是数字字符串
        //如果是数字字符串：sum += Number(arr[i]);
      }

      this.setData({
        number: sum
      })

      this.countUp = new WxCountUp('number', this.data.number, {}, this);
      // 开始动画
      this.countUp.start();

    })
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


})