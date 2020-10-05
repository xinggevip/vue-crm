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
      <el-table-column show-overflow-tooltip label="登记人" >
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
      <el-table-column show-overflow-tooltip class-name="status-col" label="手机号" min-width="120"  align="center">
        <template slot-scope="scope">
          {{ scope.row.phonenumber }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="渠道"  align="center">
        <template slot-scope="scope">
          {{ scope.row.sourcename }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="房间"  align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="人数"  align="center">
        <template slot-scope="scope">
          {{ scope.row.personnum }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="价格"  align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>

      <!--      <el-table-column show-overflow-tooltip class-name="status-col" label="余额"  align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.money }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column show-overflow-tooltip align="center" prop="created_at" label="预约时间" min-width="150" >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ dateFormatter(scope.row.starttime) }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="created_at" label="时长" min-width="130" >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ timeSizeFormatter(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.comment }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300"  fixed="right">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            @click="handleApt(scope.$index, scope.row)"-->
<!--          >编辑</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            @click="handleJiesuan(scope.$index, scope.row)"-->
<!--          >结算</el-button>-->
          <el-button
            size="mini"
            type="danger"
            @click="openIsFangQi(scope.$index, scope.row)"
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

    <!-- 预约 -->
    <el-dialog :width="dialogWidth" :visible.sync="dialogTableVisible3" v-bind="$attrs" v-on="$listeners" @open="onOpen3" @close3="onClose3" title="编辑">
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

        <el-form-item label="时长" prop="endtime">
          <el-time-picker v-model="apt.endtime" format="HH:mm" value-format="timestamp" @change="pieValue1Change"
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
        <el-button type="primary" @click="handelConfirm3" :loading="loading">更新</el-button>
      </div>
    </el-dialog>

    <!-- 结算 -->
    <el-dialog :width="dialogWidth" :visible.sync="dialogTableVisible4" v-bind="$attrs" v-on="$listeners" @open="onOpen4" @close4="onclose44" title="结算">
      <el-form ref="jiesuanForm" :model="jiesuan" :rules="jiesuanRules" size="medium" label-width="100px">
        <el-form-item label="会员名" prop="username">
          <el-input v-model="jiesuan.username" placeholder="请输入会员名" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="money">
          <el-input v-model="jiesuan.money" placeholder="请输入余额" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="name">
          <el-input v-model="jiesuan.name" placeholder="请输入房间" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="人数" prop="personnum">
          <el-input v-model="jiesuan.personnum" placeholder="请输入人数" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="money">
          <el-input v-model="jiesuan.price" placeholder="请输入价格" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <!--        <el-form-item label="价格" prop="price">-->
        <!--          <el-input-number v-model="jiesuan.price" placeholder="价格" :precision='2' :disabled='true'>-->
        <!--          </el-input-number>-->
        <!--        </el-form-item>-->
        <el-form-item label="支付方式" prop="paytypeid">
          <el-select v-model="jiesuan.paytypeid" placeholder="请选择支付方式" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in paytypeidOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close4">取消</el-button>
        <el-button type="primary" @click="handelConfirm4" :loading="loading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 放弃 -->


  </div>
</template>

<script>
  import { Message } from 'element-ui'
  // import { getList } from '@/api/table'

  export default {
    name: 'AptOver',
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
          status: 1
        },
        user: JSON.parse(this.$store.state.user),
        loading:false,
        dialogWidth: "0px", // 屏幕宽度

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

        // 结算
        dialogTableVisible4:false,
        jiesuan: {
          username: undefined,
          money: undefined,
          name: undefined,
          personnum: undefined,
          price: undefined,
          paytypeid: undefined,
        },
        jiesuanRules: {
          username: [{
            required: true,
            message: '请输入会员名',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: '请输入余额',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请输入房间',
            trigger: 'blur'
          }],
          personnum: [{
            required: true,
            message: '请输入人数',
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: '价格',
            trigger: 'blur'
          }],
          paytypeid: [{
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }],
        },
        paytypeidOptions: [{
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
      this.apt.endtime = date;

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
        this.$post('/apt/getlist', this.page).then((result) => {
          this.list = result.data.list;
          this.pageSetting.total = result.data.total;
          // console.log(result);
        }).catch((err) => {

        }).finally(() => this.listLoading = false);
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
      // 初始化支付列表
      getPayTypeList() {
        this.$get('/paytype').then((result)=>{
          this.paytypeidOptions = [];
          result.data.forEach((item, index, arr) => {
            let json = {
              "label":item.paytype,
              "value":item.id,
            };
            this.paytypeidOptions.push(json);

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
        // let datetime = row.starttime;
        let datetime = row;
        if(datetime){
          return this.$dateUtil.mToDateStr(datetime, 'yyyy-MM-dd hh:mm')
        }
        return ''
      },
      // 计算时长
      timeSizeFormatter(row, column) {
        // console.log(row.starttime)
        // console.log(row.endtime)
        return this.$dateUtil.intervalTime(row.starttime / 1000, row.endtime / 1000);
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
      // 预约操作
      handleApt(index, row) {
        this.apt = {...row};
        this.dialogTableVisible3 = true;
        // 得到像相差的时和分， 获取开始时间的  把时和分设置进去
        let subTimeRes = this.apt.endtime - this.apt.starttime;
        let startDate = new Date(this.apt.starttime);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0)
        this.apt.endtime = startDate.getTime() + subTimeRes;

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

          this.loading = true;

          this.apt.empid = this.user.id;
          let arrRes = this.$dateUtil.getHoursAndMinutsByTimeNum(this.apt.endtime);
          let tempTime = ((arrRes[0] * 60 * 60) + (arrRes[1] * 60)) * 1000;
          this.apt.endtime = this.apt.starttime + tempTime;

          this.$put('/apt', this.apt).then((result) => {
            if (result.message !== null) {
              Message.success(result.message);
            }

            this.fetchData();
            this.close3()
          }).catch((err) => {

          }).finally(() => this.loading = false)

        })
      },

      // 日期发生改变
      pieValue1Change() {
        // console.log('start===' + this.apt.starttime)
        //
        // let arrRes = this.$dateUtil.getHoursAndMinutsByTimeNum(this.apt.endtime);
        // console.log(arrRes[0]);
        // console.log(arrRes[1]);
        // let tempTime = ((arrRes[0] * 60 * 60) + (arrRes[1] * 60)) * 1000
        // this.apt.endtime = this.apt.starttime + tempTime;
        // console.log('end=====' + this.apt.endtime)
        // // this.TimeSubStr = this.$dateUtil.intervalTime(this.apt.starttime / 1000, this.apt.endtime / 1000);
      },

      // 结算
      handleJiesuan(index, row) {
        this.jiesuan = {...row};
        this.dialogTableVisible4 = true;
      },
      onOpen4() {},
      onclose44() {
        this.$refs['jiesuanForm'].resetFields()
      },
      close4() {
        this.$emit('update:visible', false)
        this.dialogTableVisible4 = false;
      },
      handelConfirm4() {
        this.$refs['jiesuanForm'].validate(valid => {
          if (!valid) return

          this.loading = true;
          this.jiesuan.status = 1;
          this.jiesuan.empid = this.user.id;
          this.$put('/apt', this.jiesuan).then((result) => {
            if (result.message !== null) {
              Message.success(result.message);
            }

            this.fetchData();
            this.close4()
          }).catch((err) => {

          }).finally(() => this.loading = false)

          this.close4()
        })
      },

      // 是否放弃
      openIsFangQi(index, row) {
        this.$confirm('此操作将放弃该用户的预约, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fangQi(index, row);

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      fangQi(index, row) {
        row.status = 2;
        this.$put('/apt', row).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }

          this.fetchData();
        }).catch((err) => {

        }).finally()
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
