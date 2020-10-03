<template>
  <div class="app-container">
    <!-- 搜索筛选 -->
    <div class="search">
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-right:15px;float:right" @click="fetchData()">搜索</el-button>
      <el-input @keyup.enter.native ="fetchData()" v-model="page.keyword" placeholder="请输入会员名或手机号" size="medium" style="width:250px;margin-right:15px;float:right"></el-input>
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
      <el-table-column show-overflow-tooltip class-name="status-col" label="手机号码"  align="center">
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
      <el-table-column label="操作" min-width="300"  fixed="right">
          <template slot-scope="scope">
              <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
              size="mini"
              >预约</el-button>
              <el-button
              size="mini"
              >充/扣</el-button>
              <el-button
              size="mini"
              >账单</el-button>
              <el-button
              size="mini"
              type="danger"
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
      list: null,
      listLoading: false,
      // 分页配置
      pageSetting:{
          'page-sizes':[5, 10, 15, 20],
          'page-size':5,
          'total':0
      },
      page: {
        pageNum: 1,
        pageSize: 5,
        keyword: '',
      },
      user: JSON.parse(this.$store.state.user),
      loading:false,
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
    }
  },
  created() {
    this.fetchData()
    // 设置对话框宽度
    this.setDialogWidth();
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
            Message.success(result.message);
            this.fetchData();
            this.close()
        }).catch((err) => {
        
        }).finally(() => this.loading = false);



        
      })
    },
    // 编辑
    handleEdit:function(index,row){

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
