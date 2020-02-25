<template>
  <div class="app-container">
    <vxe-grid ref="datasource" :toolbar="{size:'small',loading:false}" :columns="columns" :pager-config="pageConfig" :data="tableData">
      <template v-slot:buttons>
        <el-button @click="dialogVisible = true">新增</el-button>
        <el-button @click="deleteDataSource">删除</el-button>
      </template>
    </vxe-grid>
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">

      <el-form :model="dataSourceForm" ref="dataSourceForm" label-width="100px">
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="dataSourceForm.datasourceName"></el-input>
        </el-form-item>
        <el-form-item label="jdbcUrl" prop="name">
          <el-input v-model="dataSourceForm.jdbcUrl" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataSourceForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="name">
          <el-input v-model="dataSourceForm.password"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型" prop="desc">
          <el-input v-model="dataSourceForm.type"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDataSource">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'Datasource',
    data() {
      return{
        dataSourceForm:{
          datasourceName:'',
          jdbcUrl:'',
          username:'',
          password:'',
          type:'',
        },
        dialogVisible:false,
        pageConfig:{
          currentPage:1,
          pageSize:50,
          total:0,
        },
        columns:[
          {type:'checkbox',width:'40', align:'center'},
          {field:'datasourceName',title:'数据源名称'},
          {field:'jdbcUrl',title:'jdbcUrl'},
          {field:'username',title:'用户名'},
          {field:'password',title:'密码'},
          {field:'type',title:'数据库类型'},
          {title:'操作'}
        ],
        tableData:[],
      }
    },
    methods:{

      addDataSource(){
        this.dialogVisible = false
        this.$post('gen/datasource',{}).then(()=>{
          this.getDataSources()
          this.$message({
            message: this.$t('tips.updateSuccess'),
            type: 'success'
          })
        })
      },
      deleteDataSource(){
        let checkboxRecords = this.$refs.datasource.getCheckboxRecords()
        let ids = ''
        for (let i = 0; i < checkboxRecords.length; i++) {
          ids += checkboxRecords[i].genId + ","
        }
        this.$delete(`gen/datasource/${ids}`).then(()=>{
          this.getDataSources()
          this.$message({
            message: this.$t('tips.deleteSuccess'),
            type: 'success'
          })
        })
      },
      getDataSources(){
        this.$get('gen/datasource',{
          pageNum:this.pageConfig.pageSize,
          pageSize: this.pageConfig.pageSize
        }).then(res=>{
          this.tableData = res.data.data
          this.pageConfig.total = res.data.data.length
        })
      },
      handleClose(){},
    },
    mounted() {
      this.getDataSources()
    },
  }
</script>
