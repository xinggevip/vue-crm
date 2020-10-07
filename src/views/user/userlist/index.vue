<template>
  <div class="app-container">
    <!-- 搜索筛选 -->
    <div class="search">
      <el-input @keyup.enter.native ="fetchData()" v-model="page.keyword" placeholder="请输入会员名或手机号" size="medium" style="width:250px;margin-right:15px;float:left"></el-input>
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:15px;float:left" @click="fetchData()">搜索</el-button>
    </div>


    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="登记人" min-width="60">
        <template slot-scope="scope">
          {{ scope.row.empname }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="会员名"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="性别"  align="center">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip class-name="status-col" label="手机号"  align="center">
        <template slot-scope="scope">
          {{ scope.row.phonenumber }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip class-name="status-col" label="余额"  align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="created_at" label="登记时间" min-width="130" >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ dateFormatter(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.comment }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200"  fixed="right">
          <template slot-scope="scope">
              <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
              size="mini"
              type="success"
              @click="handleApt(scope.$index, scope.row)"
              >预约</el-button>
              <el-button
              size="mini"
              type="info"
              @click="handleMoney(scope.$index, scope.row)"
              >钱包</el-button>
              <el-button
              size="mini"
              type="warning"
              @click="goZhangDan(scope.$index, scope.row)"
              >账单</el-button>
              <el-button
              size="mini"
              type="danger"
              @click="handleDel(scope.$index, scope.row)"
              >删除</el-button>
          </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="float:right;margin-top:23px;">
        <!-- <span class="demonstration">完整功能</span> -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="pageSetting['page-sizes']"
        :page-size="pageSetting['page-size']"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageSetting['total']">
        </el-pagination>
    </div>


    <!-- 编辑操作 -->
    <el-dialog :width="dialogWidth" :visible.sync="dialogTableVisible" v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="编辑">

      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="会员名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入会员名" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex" size="medium">
            <el-radio v-for="(item, index) in field102Options" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="formData.phonenumber" placeholder="请输入手机号" :maxlength="11" show-word-limit clearable
            prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="formData.comment" type="textarea" placeholder="请输入备注"
            :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>

      </el-form>


      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm" :loading='loading'>更新</el-button>
      </div>
    </el-dialog>

    <!-- 余额操作 -->
    <el-dialog :width="dialogWidth" :visible.sync="dialogTableVisible2" v-bind="$attrs" v-on="$listeners" @open="onOpen2" @close="onClose2" title="钱包">
      <el-form ref="orderForm" :model="order" :rules="orderRules" size="medium" label-width="100px">
        <el-form-item label="操作类型" prop="handleType">
          <el-radio-group v-model="order.handleType" size="medium">
            <el-radio-button v-for="(item, index) in handleTypeOptions" :key="index" :label="item.value"
                             :disabled="item.disabled">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员名">
          <el-input v-model="formData.username" placeholder="请输入会员名" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="余额">
          <el-input v-model="formData.money" placeholder="请输入余额" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item v-if="order.handleType == 1" label="支付方式" prop="paytypeid">
          <el-select v-model="order.paytypeid" placeholder="请选择支付方式" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in paytypeidOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="moneynum">
          <el-input-number v-model="order.moneynum" placeholder="金额" :precision='2'></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="order.comment" type="textarea" placeholder="请输入备注"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close2">取消</el-button>
        <el-button type="primary" @click="handelConfirm2" :loading='loading'>确定</el-button>
      </div>
    </el-dialog>

    <!-- 预约操作 -->
    <el-dialog :width="dialogWidth" :visible.sync="dialogTableVisible3" v-bind="$attrs" v-on="$listeners" @open="onOpen3" @close3="onClose3" title="预约">
      <el-form ref="aptForm" :model="apt" :rules="aptRules" size="medium" label-width="100px">
        <el-form-item label="会员名" prop="username">
          <el-input v-model="apt.username" placeholder="请输入会员名" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="sourceid">
          <el-select v-model="apt.sourceid" placeholder="请选择渠道" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in sourceidOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间" prop="roomid">
          <el-select v-model="apt.roomid" placeholder="请选择房间" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in roomidOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人数" prop="personnum">
          <el-input-number v-model="apt.personnum" placeholder="人数"></el-input-number>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="apt.price" placeholder="价格" :precision='2'></el-input-number>
        </el-form-item>
        <el-form-item label="预约时间" prop="starttime">
          <el-date-picker type="datetime" v-model="apt.starttime" format="yyyy-MM-dd HH:mm" @change="pieValue1Change"
                          value-format="timestamp" :style="{width: '100%'}" placeholder="请选择预约时间">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="结束时间" prop="endtime">-->
<!--          <el-date-picker type="datetime" v-model="apt.endtime" format="yyyy-MM-dd HH:mm" @change="pieValue1Change"-->
<!--                          value-format="timestamp" :style="{width: '100%'}" placeholder="请选择结束时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item label="时长" prop="timesize">
          <el-time-picker v-model="apt.timesize" format="HH:mm" value-format="timestamp" @change="pieValue1Change"
                          :picker-options='{"selectableRange":"00:00:00-23:59:59"}' :style="{width: '100%'}"
                          placeholder="请选择时长" clearable></el-time-picker>
        </el-form-item>
<!--        <el-form-item label="时长" prop="comment">-->
<!--          {{TimeSubStr}}-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="comment">
          <el-input v-model="apt.comment" type="textarea" placeholder="请输入备注"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close3">取消</el-button>
        <el-button type="primary" @click="handelConfirm3">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { Message } from 'element-ui'
// import { getList } from '@/api/table'

export default {
  name: 'UserList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      TimeSubStr:'',
      list: null,
      listLoading: false,
      // 分页配置
      pageSetting:{
          'page-sizes':[5, 10, 15, 20],
          'page-size':10,
          'total':0
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
      },
      user: JSON.parse(this.$store.state.user),
      loading:false,

      // 编辑
      dialogTableVisible:false,
      dialogWidth: "0px", // 屏幕宽度
      formData: {
        username: undefined,
        sex: '男',
        phonenumber: '',
        comment: undefined,
      },
      rules: {
        username: [{
          required: true,
          message: '请输入会员名',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        phonenumber: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        field103: [],
      },
      field102Options: [{
        "label": "男",
        "value": "男"
      }, {
        "label": "女",
        "value": "女"
      }],

      // 余额操作
      dialogTableVisible2:false,
      order: {
        handleType: 1,
        paytypeid: undefined,
        moneynum: 0.00,
        comment: undefined,
      },
      orderRules: {
        handleType: [{
          required: true,
          message: '操作类型不能为空',
          trigger: 'change'
        }],
        paytypeid: [{
          required: true,
          message: '请选择支付方式',
          trigger: 'change'
        }],
        moneynum: [{
          required: true,
          message: '金额不能为空',
          trigger: 'blur'
        }, {
          pattern: /^(?!-).*/,
          message: '金额不能为负数',
          trigger: 'blur'
        }],
      },
      handleTypeOptions: [{
        "label": "充值",
        "value": 1
      }, {
        "label": "扣除",
        "value": 2
      }],
      paytypeidOptions: [{
        "label": "支付宝",
        "value": 1
      }, {
        "label": "微信",
        "value": 2
      }],
      // 预约操作
      dialogTableVisible3:false,
      apt: {
        username: undefined,
        sourceid: undefined,
        roomid: undefined,
        personnum: undefined,
        price: undefined,
        starttime: new Date().getTime(),
        endtime: new Date().getTime(),
        comment: undefined,
        timesize: undefined,
      },
      aptRules: {
        username: [{
          required: true,
          message: '请输入会员名',
          trigger: 'blur'
        }],
        sourceid: [{
          required: true,
          message: '请选择渠道',
          trigger: 'change'
        }],
        roomid: [{
          required: true,
          message: '请选择房间',
          trigger: 'change'
        }],
        personnum: [{
          required: true,
          message: '请输入人数',
          trigger: 'blur'
        }, {
          pattern: /^(?!-).*/,
          message: '人数不能为负数',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }, {
          pattern: /^(?!-).*/,
          message: '价格不能为负数',
          trigger: 'blur'
        }],
        starttime: [{
          required: true,
          message: '请选择预约时间',
          trigger: 'change'
        }],
        endtime: [{
          required: true,
          message: '请选择结束时间',
          trigger: 'change'
        }],
        timesize: [{
          required: true,
          message: '请选择时长',
          trigger: 'change'
        }],
      },
      sourceidOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      roomidOptions: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],




    }
  },
  created() {
    this.fetchData()
    // 设置对话框宽度
    this.setDialogWidth();
    // 初始化支付方式
    this.getPayTypeList();
    // 初始化房间列表
    this.getRoomList();
    // 初始化渠道列表
    this.getSourceList();
    // 初始化时长的默认值
    let date = new Date();
    date.setHours(1);
    date.setMinutes(0);
    this.apt.timesize = date;
  },
  mounted() {
      window.onresize = () => {
        return (() => {
            this.setDialogWidth()
        })()
      }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.$post('/user/getlist', this.page).then((result) => {
        this.list = result.data.list;
        this.pageSetting.total = result.data.total;
        // console.log(result);
      }).catch((err) => {

      }).finally(() => this.listLoading = false);
    },
    // 初始化支付列表
    getPayTypeList() {
      this.$get('/paytype').then((result)=>{
        this.paytypeidOptions = [];
        let this_ = this;
        result.data.forEach(function(item, index, arr) {
          let json = {
            "label":item.paytype,
            "value":item.id,
          };
          this_.paytypeidOptions.push(json);

        });


      }).catch((err) => {

      }).finally();
    },
    // 初始化房间列表
    getRoomList() {
      this.$get('/room').then((result)=>{
        this.roomidOptions = [];
        let this_ = this;
        result.data.forEach(function(item, index, arr) {
          let json = {
            "label":item.name,
            "value":item.id,
          };
          this_.roomidOptions.push(json);

        });


      }).catch((err) => {

      }).finally();
    },
    // 初始化渠道列表
    getSourceList() {
      this.$get('/source').then((result)=>{
        this.sourceidOptions = [];
        let this_ = this;
        result.data.forEach(function(item, index, arr) {
          let json = {
            "label":item.sourcename,
            "value":item.id,
          };
          this_.sourceidOptions.push(json);

        });


      }).catch((err) => {

      }).finally();
    },
    // 日期格式化
    dateFormatter (row, column) {
        // console.log(row.savedate);
        let datetime = row.savedate;
        if(datetime){
            return this.$dateUtil.mToDateStr(datetime, 'yyyy-MM-dd hh:mm:ss')
        }
        return ''
    },
    // 设置每页显示多少条
    handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.page.pageNum = 1;
        this.fetchData();
    },
    // 页数发生改变
    handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.page.pageNum = val;
        this.fetchData();
    },
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
      // this.formData = null;
    },
    close() {
      this.$emit('update:visible', false)
      this.dialogTableVisible = false;
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return

        this.loading = true
        this.$put('/user', this.formData).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }

          this.fetchData();
          this.close()
        }).catch((err) => {

        }).finally(() => this.loading = false);




      })
    },
    // 编辑
    handleEdit(index,row){

        this.formData = {...row};
        this.dialogTableVisible = true;

    },
    // 设置对话框大小
    setDialogWidth() {
        // console.log(document.body.clientWidth)
        var val = document.body.clientWidth
        const def = 800 // 默认宽度
        if (val < def) {
            this.dialogWidth = '100%'
        } else {
            this.dialogWidth = def + 'px'
        }
    },
    handleMoney(index, row) {
      this.formData = {...row};
      this.dialogTableVisible2 = true;
    },
    onOpen2() {},
    onClose2() {
      this.$refs['orderForm'].resetFields()
    },
    close2() {
      this.$emit('update:visible', false)
      this.dialogTableVisible2 = false;
    },
    handelConfirm2() {
      this.$refs['orderForm'].validate(valid => {
        if (!valid) return

        if (this.order.moneynum <= 0) {
          Message.error("金额不能小于等于0！")
          return
        }

        this.loading = true;
        let params = {
          "comment": this.order.comment,
          "empid": this.user.id,
          "moneynum": this.order.moneynum,
          "paytypeid": this.order.paytypeid,
          "userid": this.formData.id,
        }

        if (this.order.handleType !== 1) {
          params.paytypeid = 5;
          params.moneynum = -(params.moneynum);
        }

        this.$post('/charge', params).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }

          this.fetchData();
          this.close2()
        }).catch((err) => {

        }).finally(() => this.loading = false)


      })
    },
    // 预约操作
    handleApt(index, row) {
      this.formData = {...row};
      this.dialogTableVisible3 = true;
      this.apt.username = this.formData.username;
      this.apt.sourceid = undefined;
      this.apt.roomid = undefined;
      this.apt.personnum = undefined;
      this.apt.price = undefined;

    },
    onOpen3() {},
    onClose3() {
      this.$refs['aptForm'].resetFields()
    },
    close3() {
      this.$emit('update:visible', false)
      this.dialogTableVisible3 = false;
    },
    handelConfirm3() {
      this.$refs['aptForm'].validate(valid => {
        if (!valid) return

        this.apt.empid = this.user.id;
        this.apt.userid = this.formData.id;
        let arrRes = this.$dateUtil.getHoursAndMinutsByTimeNum(this.apt.timesize);
        let tempTime = ((arrRes[0] * 60 * 60) + (arrRes[1] * 60)) * 1000;
        this.apt.endtime = this.apt.starttime + tempTime;

        this.$post('/apt', this.apt).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }

          this.fetchData();
          this.close3()
        }).catch((err) => {

        }).finally(() => this.listLoading = false)

      })
    },

    // 日期发生改变
    pieValue1Change() {
      console.log('start===' + this.apt.starttime)

      let arrRes = this.$dateUtil.getHoursAndMinutsByTimeNum(this.apt.timesize);
      console.log(arrRes[0]);
      console.log(arrRes[1]);
      let tempTime = ((arrRes[0] * 60 * 60) + (arrRes[1] * 60)) * 1000
      this.apt.endtime = this.apt.starttime + tempTime;
      console.log('end=====' + this.apt.endtime)
      // this.TimeSubStr = this.$dateUtil.intervalTime(this.apt.starttime / 1000, this.apt.endtime / 1000);
    },

    // 删除
    handleDel(index,row) {
      this.$confirm('此操作将放永久删除该会员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(index, row);

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    delete(index, row) {
      this.$del('/user/' + row.id).then((result) => {
        if (result.message !== null) {
          Message.success(result.message);
        }
        this.fetchData();
      }).catch((error) => {

      }).finally();
    },

    goZhangDan(index, row) {
      this.$router.push({path:'/system/charge',query: {phonenumber:row.phonenumber}})
    }








  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .search::after,.search::before{
      content: '';
      display: table;
      clear: both
  }
  .search{
    padding-bottom: 15px;
  }
</style>
