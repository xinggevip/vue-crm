<template>
  <div class="app-container">
    <!-- 搜索筛选 -->
    <div class="search">
      <el-input @keyup.enter.native ="fetchData()" v-model="page.keyword" placeholder="请输入会员名或手机号" size="medium" style="width:200px;margin-right:15px;"></el-input>

      <el-date-picker
        style="margin-right:15px;"
        value-format="timestamp"
        size="medium"
        v-model="value2"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-select
        v-model="page.paytypeid"
        placeholder="请选择支付方式"
        style="margin-right:15px;"
        clearable >
        <el-option v-for="(item, index) in paytypeidOptions" :key="index" :label="item.label"
                   :value="item.value" :disabled="item.disabled"></el-option>
      </el-select>

      <el-select
        v-model="page.flag"
        placeholder="请选择账单类型"
        style="margin-right:15px;"
        clearable >
        <el-option v-for="(item, index) in flagOptions" :key="index" :label="item.label"
                   :value="item.value" :disabled="item.disabled"></el-option>
      </el-select>

      <el-select
        v-if="page.flag === 3"
        v-model="page.roomid"
        placeholder="请选择房间"
        style="margin-right:15px;"
        clearable >
        <el-option v-for="(item, index) in roomidOptions" :key="index" :label="item.label"
                   :value="item.value" :disabled="item.disabled"></el-option>
      </el-select>

      <el-select
        v-if="page.flag === 3"
        v-model="page.sourceid"
        placeholder="请选择渠道"
        style="margin-right:15px;"
        clearable >
        <el-option v-for="(item, index) in sourceidOptions" :key="index" :label="item.label"
                   :value="item.value" :disabled="item.disabled"></el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:15px;" @click="fetchData()">搜索</el-button>
    </div>


    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip align="center" label="ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作人" min-width="60">
        <template slot-scope="scope">
          {{ scope.row.empname }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="会员名"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip class-name="status-col" label="手机号" min-width="100"  align="center">
        <template slot-scope="scope">
          {{ scope.row.phonenumber }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ scope.row.paytype }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="金额"  align="center">
        <template slot-scope="scope">
          {{ scope.row.moneynum }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="房间"  align="center">
        <template slot-scope="scope">
          {{ scope.row.roomname }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="渠道"  align="center">
        <template slot-scope="scope">
          {{ scope.row.sourcename }}
        </template>
      </el-table-column>



      <el-table-column show-overflow-tooltip align="center" prop="created_at" label="创建时间" min-width="150" >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ dateFormatter(scope.row.createdate) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.comment }}
        </template>
      </el-table-column>

      <el-table-column label="账单类型" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.moneynum > 0"
            type="success"
            close-transition>余额充值
          </el-tag>
          <el-tag
            v-if="scope.row.moneynum < 0 && scope.row.aptid == null"
            type="info"
            close-transition>其他消费
          </el-tag>
          <el-tag
            v-if="scope.row.moneynum < 0 && scope.row.aptid != null"
            type="warning"
            close-transition>房间消费
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="120"  fixed="right">
        <template slot-scope="scope">


          <el-button
            :disabled="scope.row.aptid == null"
            type="primary"
            size="mini"
            @click="handleShow(scope.$index, scope.row)"
          >预约详情</el-button>

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

    <el-dialog :width="dialogWidth" :visible.sync="dialogTableVisible" v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="预约详情">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="预约ID" prop="id">
          <el-input v-model="formData.id" placeholder="请输入ID" :disabled='true' clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="登记人" prop="empname">
          <el-input v-model="formData.empname" placeholder="请输入登记人" readonly clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="会员名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入会员名" readonly clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex" size="medium" :disabled='true'>
            <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value"
                      :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="formData.phonenumber" placeholder="请输入手机号" :maxlength="11" show-word-limit
                    readonly clearable prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="sourcename">
          <el-input v-model="formData.sourcename" placeholder="请输入渠道" readonly clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="name">
          <el-input v-model="formData.name" placeholder="请输入房间" readonly clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="人数" prop="personnum">
          <el-input v-model="formData.personnum" placeholder="请输入人数" readonly clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="formData.price" placeholder="请输入价格" readonly clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="预约时间" prop="starttime">
          <el-input v-model="formData.starttime" placeholder="请输入预约时间" readonly clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="endtime">
          <el-input v-model="formData.endtime" placeholder="请输入时长" readonly clearable
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="formData.comment" type="textarea" placeholder="请输入备注" readonly
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  import { Message } from 'element-ui'
  // import { getList } from '@/api/table'

  export default {
    name: 'Charge',
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
        paytypeidOptions: [{
          "label": "支付宝",
          "value": 1
        }, {
          "label": "微信",
          "value": 2
        }],
        flagOptions: [{
          "label": "充值",
          "value": 1
        }, {
          "label": "其他消费",
          "value": 2
        }, {
          "label": "房间消费",
          "value": 3
        }],
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
        user: JSON.parse(this.$store.state.user),
        loading:false,
        dialogWidth: "0px", // 屏幕宽度

        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value2: '',

        // 回显预约详情
        dialogTableVisible:false,
        formData: {
          id: undefined,
          empname: undefined,
          username: undefined,
          sex: undefined,
          phonenumber: '',
          sourcename: undefined,
          name: undefined,
          personnum: undefined,
          price: undefined,
          starttime: undefined,
          endtime: undefined,
          comment: undefined,
        },
        rules: {
          id: [{
            required: true,
            message: '请输入ID',
            trigger: 'blur'
          }],
          empname: [{
            required: true,
            message: '请输入登记人',
            trigger: 'blur'
          }],
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
          sourcename: [{
            required: true,
            message: '请输入渠道',
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
            message: '请输入价格',
            trigger: 'blur'
          }],
          starttime: [{
            required: true,
            message: '请输入预约时间',
            trigger: 'blur'
          }],
          endtime: [{
            required: true,
            message: '请输入时长',
            trigger: 'blur'
          }],
          comment: [],
        },
        sexOptions: [{
          "label": "男",
          "value": "男"
        }, {
          "label": "女",
          "value": "女"
        }],



      }
    },
    created() {
      console.log(this.$route.query.phonenumber);
      this.page.keyword = this.$route.query.phonenumber;

      this.fetchData()
      // 设置对话框宽度
      this.setDialogWidth();
      // 初始化支付方式列表
      this.getPayTypeList();
      // 初始化房间列表
      this.getRoomList();
      // 初始化渠道列表
      this.getSourceList();

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
        this.listLoading = true;

        console.log(this.value2);

        if (this.value2 != null){
          if (this.value2.length === 2) {
            this.page.starttime = this.value2[0];
            this.page.endtime = this.value2[1] +  24 * 60 * 60 * 1000;
            // console.log(this.page.endtime)
          }else{
            this.page.starttime = null;
            this.page.endtime = null;
          }
        }else{
          this.page.starttime = null;
          this.page.endtime = null;
        }




        this.$post('/charge/getlist', this.page).then((result) => {
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


      handleShow(index, row){
        this.dialogTableVisible = true;
        this.showWin(row.aptid);

      },
      showWin(aptid) {
        this.$get('/apt/' + aptid).then((result) => {

          result.data.endtime = this.$dateUtil.intervalTime(result.data.starttime / 1000, result.data.endtime / 1000);
          result.data.starttime = this.dateFormatter(result.data.starttime);
          this.formData = result.data;
        }).catch((error) => {

        }).finally(()=>{})

      },

      onOpen() {},
      onClose() {
        this.$refs['elForm'].resetFields()
      },
      close() {
        this.$emit('update:visible', false)
        this.dialogTableVisible = false;
      },
      handelConfirm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return

          this.close()
        })
      },


      // 删除
      handleDel(index,row) {
        this.$confirm('此操作将放永久删除这条账单记录及关联预约记录, 是否继续?', '提示', {
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
        this.$del('/charge/' + row.id).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }
          this.fetchData();
        }).catch((error) => {

        }).finally();
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
    display: flex;
    align-items: center;     /* 垂直居中 */
    padding-bottom: 15px;
  }
</style>
