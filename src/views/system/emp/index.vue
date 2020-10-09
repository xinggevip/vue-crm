<template>
  <div class="app-container">

    <el-button type="primary" size="small" @click="handleAdd">添加员工</el-button>
    <div style="padding-bottom: 15px;"></div>

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

      <el-table-column show-overflow-tooltip label="员工姓名"  align="center">
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

      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.comment }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300"  fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDel(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-bind="$attrs" :visible.sync="dialogTableVisible" v-on="$listeners" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="empForm" :model="empFormData" :rules="emprules" size="medium" label-width="100px">
        <el-form-item label="员工姓名" prop="username">
          <el-input v-model="empFormData.username" placeholder="请输入员工姓名" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="empFormData.sex" size="medium">
            <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value"
                      :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="empFormData.phonenumber" placeholder="请输入手机号" :maxlength="11" show-word-limit
                    clearable prefix-icon='el-icon-mobile' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="empFormData.password" placeholder="请输入密码" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="empFormData.comment" type="textarea" placeholder="请输入备注"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  import { Message } from 'element-ui'
  // import { getList } from '@/api/table'

  export default {
    name: 'Emp',
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
        isUpdate:true,
        list: null,
        listLoading: false,
        user: JSON.parse(this.$store.state.user),
        loading:false,
        dialogWidth: "0px", // 屏幕宽度

        title:"编辑",
        dialogTableVisible:false,
        empFormData: {
          username: undefined,
          sex: undefined,
          phonenumber: '',
          password: undefined,
          comment: undefined,
        },
        emprules: {
          username: [{
            required: true,
            message: '请输入员工姓名',
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
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],

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
        this.$get('/emp').then((result) => {
          this.list = result.data;

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


      // 编辑
      handleEdit(index,row){
        this.title = '编辑'
        this.isUpdate = true;
        this.empFormData = {...row};
        this.dialogTableVisible = true;

      },
      // 添加
      handleAdd() {
        this.title = '添加'
        this.isUpdate = false;
        this.empFormData = {};
        this.dialogTableVisible = true;
      },
      // 删除
      handleDel(index,row) {
        this.$confirm('此操作将放永久删除该员工, 是否继续?', '提示', {
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
      onOpen() {},
      onClose() {
        this.$refs['empForm'].resetFields()
      },
      close() {
        this.$emit('update:visible', false)
        this.dialogTableVisible = false;
      },
      handelConfirm() {
        this.$refs['empForm'].validate(valid => {
          if (!valid) return

          if (this.isUpdate) {
            // 更新
            this.update();
          }else {
            // 添加
            this.add();
          }

        })
      },
      update() {
        this.loading = true;
        this.$put('/emp', this.empFormData).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }
          this.close()
          this.fetchData();
        }).catch((error) => {

        }).finally(() => this.loading = false);

      },
      add() {
        this.loading = true;
        this.$post('/emp', this.empFormData).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }
          this.close()
          this.fetchData();
        }).catch((error) => {

        }).finally(() => this.loading = false);
      },
      delete(index, row) {
        this.$del('/emp/' + row.id).then((result) => {
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
    padding-bottom: 15px;
  }
</style>
