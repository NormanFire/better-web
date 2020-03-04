<template>
  <div class="app-container">
    <vxe-grid v-show="spaceShow" :toolbar="{loading:false,size:'small'}" :columns="spaceColumns" :pager-config="spacePageConfig" :data="spaceTableData" :auto-resize="true">
      <template v-slot:buttons>
        <el-button @click="insertSpaceDialogVisible = true">新增</el-button>
      </template>
    </vxe-grid>

    <space-view @return="handleSpaceViewReturn" :space="currentSpace" :show="spaceViewShow" v-if="spaceViewShow"/>

    <el-dialog
      title="新增空间"
      :visible.sync="insertSpaceDialogVisible"
      width="30%"
      :before-close="handleInsertSpaceDialogClose">

      <el-form label-position="" label-width="80px" :model="spaceForm">
        <el-form-item label="名称">
          <el-input v-model="spaceForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="spaceForm.description"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="spaceForm.tags"></el-input>
        </el-form-item>
        <el-form-item label="访问级别">
          <el-input v-model="spaceForm.visitLevel"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="insertSpaceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertSpace">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import SpaceView from './components/SpaceView'
  export default {
    name:'Space',
    components:{
      SpaceView,
    },
    data(){
      return {
        spaceColumns:[
          {
            title:'名称',
            field:'name',
            slots:{
              default: ({row}) => {
                return [
                  <span onClick={()=>{this.currentSpace = row,this.spaceShow = false,this.spaceViewShow = true}} class="space-name-cell"  title="进入空间">{row.name}</span>
              ]
              }
            }
          },
          {title:'描述', field:'description',},
          {title:'标签', field:'tags',},
          {title:'访问级别', field:'visitLevel',},
          {title:'创建时间', field:'createTime',},
          {title:'分享', field:'isShare',},
          {title:'导出', field:'isExport',},
          {title:'操作', },
        ],
        currentSpace:{},
        spaceShow:true,
        spaceViewShow:false,
        documentEditShow:false,
        spaceForm:{
          name:'',
          description:'',
          tags:'',
          visitLevel:'',
        },
        spacePageConfig:{
          currentPage:1,
          pageSize:50,
          total:0,
        },
        spaceTableData:[],
        insertSpaceDialogVisible:false,
      }
    },
    mounted() {
      this.getSpaceList()
    },
    methods:{
      handleSpaceViewReturn(){
        this.spaceShow = true
        this.spaceViewShow = false
      },
      getSpaceList(){
        let params = {
          pageNum : this.spacePageConfig.currentPage,
          pageSize : this.spacePageConfig.pageSize
        }
        this.$get('wiki/space/list',params).then(res=>{
          this.spaceTableData = res.data.data.rows
          this.spacePageConfig.total = res.data.data.total
        })
      },
      handleInsertSpaceDialogClose(done){
        done()
      },
      insertSpace(){
        this.insertSpaceDialogVisible = false
        this.$post('wiki/space',{...this.spaceForm}).then(res=>{
          this.getSpaceList()
          this.$message({
            message: this.$t('tips.createSuccess'),
            type: 'success'
          })
        })
      },
      deleteSpace(){

      },
    },
  }
</script>

<style>
.space-name-cell{
  height: 100%;
  width: 100%;
  color: #337AB7;
  font-weight: bolder;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>

</style>
