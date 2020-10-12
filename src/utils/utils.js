const strUtil = {
  // 字符串转unicode
  charToUnicode(str) {
      var res = [];
      for ( var i=0; i<str.length; i++ ) {
          res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
      }
      return "\\u" + res.join("\\u");
  },
  // unicode转字符串
  unicodeToChar(str){
      str = str.replace(/\\/g, "%");
      return unescape(str);
  },
  // 加密
  compileStr(code){
      var c=String.fromCharCode(code.charCodeAt(0)+code.length);
      for(var i=1;i<code.length;i++)
      {
          c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
      }
      return escape(c);
  },
  // 解密
  uncompileStr(code){
      code=unescape(code);
      var c=String.fromCharCode(code.charCodeAt(0)-code.length);
      for(var i=1;i<code.length;i++)
      {
          c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
      }
      return c;
  }



}

const arrUtil = {

  /**
   * 判断某一项是否在某个数组中
   */
  itemInArr(value,arr){
      Array.prototype.in_array = function (e) {
          var r=new RegExp(','+e+',');
          return (r.test(',' + this.join(this.S) + ','));
      };

      return  arr.in_array(value);
  },

  /**
   * 拼接数组返回字符串
   * 参数为 (数组,拼接的字符串)
   * 例如 传入 (["门店","电商","物流"],','] 返回 "门店,电商,物流"
   */
  joinArr(arr,str){
      let arrSize = arr.length;
      if(arrSize === 0 ){
          return '';
      }

      let strRes = '';
      arr.forEach((item, index, arr) => {
          if(index === arrSize - 1){
              strRes = strRes + item;
          }else{
              strRes = strRes + item + str;
          }

      });

      return strRes;
  },
  /**
   * 去除数组每一项括号和括号内数字
   * 例如 把 ["苏宁 (7)", "微粒贷 (11)"];处理成 ["苏宁", "微粒贷"]
   */
  removeNumberToArr(arr){
      let reg = /.*?(?=\s*\()/g;
      return arr.map((item,index,arr)=>{
          try {
              return item.match(reg)[0];
          }catch (e) {
              return 'null'
          }

      })
  },
  /**
   * json对象数组按照某个属性排序:降序排列
   * @param {Object} propertyName
   */
  compareDesc(propertyName) {
      return function(object1, object2) {
          var value1 = object1[propertyName];
          var value2 = object2[propertyName];
          if(value2 < value1) {
              return -1;
          } else if(value2 > value1) {
              return 1;
          } else {
              return 0;
          }
      }
  },
  /**
   * json对象数组按照某个属性排序:升序排列
   * @param {Object} propertyName
   */
  compareAsc(propertyName) {
      return function(object1, object2) {
          var value1 = object1[propertyName];
          var value2 = object2[propertyName];
          if(value2 < value1) {
              return 1;
          } else if(value2 > value1) {
              return -1;
          } else {
              return 0;
          }
      }
  }
}

const dateUtil = {

  //根据时间戳获取小时和分钟 返回[时，分]
  getHoursAndMinutsByTimeNum(time) {
    let date = new Date(time);
    let timeArr = [];
    let hour = date.getHours();
    let minute = date.getMinutes();
    timeArr.push(hour);
    timeArr.push(minute);
    return timeArr;
  },

  //计算两个时间之间的时间差 多少天时分秒
  intervalTime(startTime,endTime) {
    // var timestamp=new Date().getTime(); //计算当前时间戳
    // var timestamp = (Date.parse(new Date()))/1000;//计算当前时间戳 (毫秒级)
    // var date1 = ""; //开始时间
    // if(timestamp<startTime){
    //   date1=startTime;
    // }else{
    //   date1 = timestamp; //开始时间
    // }
    var date1=startTime;
    var date2 = endTime; //结束时间
    // var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
    var date3 =  (date2- date1)*1000; //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数

    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数

    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    // console.log(days + "天 " + hours + "小时 ")
    if (days > 0) {
      return   days + "天 " + hours + "小时 " + minutes + " 分钟"
    }
    return hours + "小时 " + minutes + " 分钟"
    // return   days + "天 " + hours + "小时 "
  },
  //计算两个时间之间的时间差 多少天时分秒
  intervalTime2(startTime,endTime) {
    // var timestamp=new Date().getTime(); //计算当前时间戳
    // var timestamp = (Date.parse(new Date()))/1000;//计算当前时间戳 (毫秒级)
    // var date1 = ""; //开始时间
    // if(timestamp<startTime){
    //   date1=startTime;
    // }else{
    //   date1 = timestamp; //开始时间
    // }
    var date1=startTime;
    var date2 = endTime; //结束时间
    // var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
    var date3 =  (date2- date1)*1000; //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数

    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数

    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    // console.log(days + "天 " + hours + "小时 ")
    if (days > 0) {
      return   days + "天 " + hours + "小时 " + minutes + " 分钟 " + seconds + " 秒"
    }
    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      return "游玩已结束"
    }
    return hours + "小时 " + minutes + " 分钟 " + seconds + " 秒"
    // return   days + "天 " + hours + "小时 "
  },


/***
   * 获取毫秒数字，[开始时间，结束时间]
   * 参数为天数
   */
  getDateMArr(num){
      let dateMArr = [];
      if (num === 1){
          let zero = new Date();
          zero.setHours(0);
          zero.setMinutes(0);
          zero.setSeconds(0);
          let start = zero.getTime();
          let end = new Date().getTime();
          dateMArr = [start,end];
      }else{
          let end = new Date();
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * num);

          dateMArr = [start.getTime(),end.getTime()];
      };

      return dateMArr;
  },

  /***
   * 根据时间戳数组判断相差几天
   * @param dataArr
   * @returns {number}
   */
  differentDaysByMillisecond(dateArr){
      let date1 = dateArr[1];
      let date2 = dateArr[0];
      let dayNum = parseInt((date1 - date2) / (1000*3600*24));
      return dayNum;
  },
  /***
   * 毫秒转日期字符串
   */
  mToDateStr(value,formatStr){
      Date.prototype.format = function (fmt) {
          var o = {
              "M+": this.getMonth() + 1, //月份
              "d+": this.getDate(), //日
              "h+": this.getHours(), //小时
              "m+": this.getMinutes(), //分
              "s+": this.getSeconds(), //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }

      let dateValue = new Date(value);
      return dateValue.format(formatStr);
  },

  /***
   * 毫秒转秒
   */
  mTos(value) {
      Date.prototype.format = function (fmt) {
          var o = {
              "M+": this.getMonth() + 1, //月份
              "d+": this.getDate(), //日
              "h+": this.getHours(), //小时
              "m+": this.getMinutes(), //分
              "s+": this.getSeconds(), //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }
      console.group("你要转的日期：")
          let dateValue = new Date(value);
          console.log(dateValue.format("yyyy-MM-dd hh:mm:ss"));
      console.groupEnd();
      console.group("转成的秒数：");
          console.log(parseInt(value / 1000));
      console.groupEnd();
      return parseInt(value / 1000);
  },

  /***
   * 毫秒数组转秒
   */
  mArrToSArr(marr){
      Date.prototype.format = function (fmt) {
          var o = {
              "M+": this.getMonth() + 1, //月份
              "d+": this.getDate(), //日
              "h+": this.getHours(), //小时
              "m+": this.getMinutes(), //分
              "s+": this.getSeconds(), //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }

      return marr.map((item,index,arr) => {
          console.group("你要转的日期：")
              let dateValue = new Date(item);
              console.log(dateValue.format("yyyy-MM-dd hh:mm:ss"));
          console.groupEnd();
          console.group("转成的秒数：");
              console.log(parseInt(item / 1000));
          console.groupEnd();
          return parseInt(item / 1000)
      })
  },
  // 创建今天的日期
  creatTdayTime() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate() ;
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      month = month > 9 ? month : "0" + month;
      strDate = strDate > 9 ? strDate : "0" + strDate;
      var newdata = year + "-" + month + "-" + strDate;

      // console.log(this.newtime);
      let newList = [];
      let i;
      for (i = 0; i <= 24; i+=2) {
          if (i < 10) {
              let str = newdata + " 0" + i + ":00:00";
              newList.push(str);
          } else {
              let str = newdata + " " + i + ":00:00";
              newList.push(str);
          }
      }

      return newList;

  },


  /**
   * 日期数组转字符串
   * @param dateArr
   * @returns list[str]
   */
  dateListToStr(dateArr){
      /**
       *对Date的扩展，将 Date 转化为指定格式的String
       *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
       *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
       *例子：
       *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
       *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
       */
      Date.prototype.format = function (fmt) {
          var o = {
              "M+": this.getMonth() + 1, //月份
              "d+": this.getDate(), //日
              "h+": this.getHours(), //小时
              "m+": this.getMinutes(), //分
              "s+": this.getSeconds(), //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }

      return dateArr.map(function (item, index, arr){
          return item.format("yyyy-MM-dd hh:mm:ss");
      });
  },
  /**
   * 判断是否为一天
   * @param dateArr
   * @returns {boolean}
   */
  oneDayPower(dateStrArr){
      // console.clear()
      // console.log(dateStr);
      let str1 = dateStrArr[0].slice(0,10);
      let str2 = dateStrArr[1].slice(0,10);
      // console.group("比较两个日期");
      // console.log("str1 = " + str1);
      // console.log("str2 = " + str2);
      // console.groupEnd();
      return str1 == str2 ? true:false;
  },

  /**
   * 处理日期为一天的时间数组
   * @param dateArr
   * @returns list[str]
   * */
  oneDayHandle(dateStrArr){
      // console.log(dateStrArr)
      // 先取出前10位
      let dateFirstStr = dateStrArr[0];
      let dateFirstStrRes = dateFirstStr.slice(0,10)
      // console.log(dateFirstStrRes)
      // 遍历追加时分秒
      let dateStrArrRes = [];
      for (let i = 0; i <= 24; i+=2) {
          if (i < 10) {
              let str = dateFirstStrRes + " 0" + i + ":00:00";
              dateStrArrRes.push(str);
          } else {
              let str = dateFirstStrRes + " " + i + ":00:00";
              dateStrArrRes.push(str);
          }
      }
      return dateStrArrRes;
  },
  /**
   * 处理日期为多天天的时间数组
   * @param dateStrArr
   * @returns list[str]
   * */
  someDayHandle(dateArr){

      // 转换成毫秒数，然后生成每一天
      let startTime = (dateArr[0]).getTime();
      let endTime = (dateArr[1]).getTime();

      let res = [];
      for( let i = startTime ; i <= endTime ; ){
          let date = new Date(i);
          res.push(date);
          i += 24 * 60 * 60 * 1000;
      }
      let res2 = this.dateListToStr(res);

      // 末尾全换成0
      let res3 = res2.map(function (item, index, arr){
          return (item.slice(0,10)) + " 00:00:00";
      });

      return res3;

  },
  // 日期处理函数,负责将正确的结果赋值给子组件，未来将此函数抽离到工具js文件
  dateToStrArr(dateArr){
      // 日期数组转日期字符串数组
      let dateStrArr = this.dateListToStr(dateArr);
      // 判断是一天还是多天
      let oneDayRes = this.oneDayPower(dateStrArr);
      // console.log(oneDayRes)
      /**
       * 判断是否为当天，如果为当天,
       * 如果是当天，则按照当前的函数处理
       * 如果为多天，则按照多天的逻辑处理
       * */
      if (oneDayRes){
          // 返回处理后的一天日期数组
          return this.oneDayHandle(dateStrArr);
      }else{
          // 返回处理后的多天天日期数组
          return this.someDayHandle(dateArr);
      }
  },
  // 用于处理给前端展示的日期
  showDateArrhandle(dateList){
      let oneRight = this.oneDayPower(dateList);
      if (oneRight){
          for (let i = 0;i < dateList.length;i++){
              let str = dateList[i]
              str = str.slice(11);
              str = str.slice(0,5);
              dateList[i] = str;
          }
      }else{
          for (let i = 0;i < dateList.length;i++){
              let str = dateList[i]
              str = str.replace(" 00:00:00","");
              dateList[i] = str;
          }
      }
      return dateList;
  }
}


// 创建今天的日期列表，无参数,返回日期字符串列表
// creatTdayTime,

// 将element多日期组件的date数组转换成日期字符串数组，参数为element多日期组件的date数组，返回日期字符串数组
// dateListToStr,

// 判断是否为同一天，日期字符串数组，返回boolean
// oneDayPower,

// 将一天的时间转换为24小时，间隔为2小时，参数为日期字符串数组，返回日期字符串数组
// oneDayHandle,

// 将日期范转换成每一天，参数为element多日期组件的date数组，返回日期字符串数组
// someDayHandle,

// 牛逼大招，调用上边的方法，将日期范围根据一天或多天情况，转换成日期字符串列表，返回日期字符串数组
// dateToStrArr,

// 用于处理给前端展示的日期，参数为发送给后端的日期字符串数组，返回用于给用户看的日期字符串数组
// showDateArrhandle，

// mTos 毫秒抓秒

// mArrToSArr 毫秒数组转秒数组

// removeNumberToArr 去除数组每一项括号和括号内数字

export {
  // 日期工具类
  dateUtil,
  // 数组工具类
  arrUtil,
  // 字符串工具类
  strUtil

}
