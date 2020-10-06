<template>
  <div class="app-container">

    <el-button type="primary" size="small" @click="handleAdd">添加渠道</el-button>
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

      <el-table-column show-overflow-tooltip label="渠道名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sourcename }}</span>
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
            type="danger"
            @click="handleDel(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-bind="$attrs" :visible.sync="dialogTableVisible" v-on="$listeners" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="payForm" :model="payFormData" :rules="payRules" size="medium" label-width="100px">
        <el-form-item label="渠道名称" prop="sourcename">
          <el-input v-model="payFormData.sourcename" placeholder="请输入渠道名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="payFormData.comment" type="textarea" placeholder="请输入备注"
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
    name: 'Source',
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
        user: JSON.parse(this.$store.state.user),
        loading:false,
        dialogWidth: "0px", // 屏幕宽度

        isUpdate:false,
        title:"编辑",
        dialogTableVisible:false,
        payFormData: {
          sourcename: undefined,
          comment: undefined,
        },
        payRules: {
          sourcename: [{
            required: true,
            message: '请输入渠道名称',
            trigger: 'blur'
          }],
          comment: [],
        },


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
        this.$get('/source').then((result) => {
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

      onOpen() {},
      onClose() {
        this.$refs['payForm'].resetFields()
      },
      close() {
        this.$emit('update:visible', false)
        this.dialogTableVisible = false;
      },
      handelConfirm() {
        this.$refs['payForm'].validate(valid => {
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

      // 编辑
      handleEdit(index,row){
        this.title = '编辑'
        this.isUpdate = true;
        this.payFormData = {...row};
        this.dialogTableVisible = true;

      },
      // 添加
      handleAdd() {
        this.title = '添加'
        this.isUpdate = false;
        this.payFormData = {};
        this.dialogTableVisible = true;
      },
      // 删除
      handleDel(index,row) {
        this.$confirm('此操作将放永久删除该支付方式, 是否继续?', '提示', {
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
      update() {
        this.loading = true;
        this.$put('/source', this.payFormData).then((result) => {
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
        this.$post('/source', this.payFormData).then((result) => {
          if (result.message !== null) {
            Message.success(result.message);
          }
          this.close()
          this.fetchData();
        }).catch((error) => {

        }).finally(() => this.loading = false);
      },
      delete(index, row) {
        this.$del('/source/' + row.id).then((result) => {
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
