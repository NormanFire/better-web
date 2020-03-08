<template>
  <el-row class="space-view">
    <Split v-model="split">
      <div slot="left" class="space-split-pane">
        <el-row class="space-view-header">
          <el-col :span="16" class="space-name" v-cloak>{{space.name}}</el-col>
          <el-col :span="8">
            <el-button @click="returnSpace">返回</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="right" class="space-split-pane">
        <el-row class="space-tree-header">
          <el-row>
            <el-input
              class="tree-filter-input"
              placeholder="输入关键字进行过滤"
              v-model="spaceTreeFilterText">
            </el-input>
          </el-row>
          <el-row v-cloak class="space-name-tree">{{space.name}} <i @click="handleInsertDocumentBtn" class="iconfont icon-jia"></i></el-row>
        </el-row>
        <el-row class="space-tree-content">
          <el-tree :data="treeData" :props="treeProps" @node-click="handleNodeClick"></el-tree>
        </el-row>
      </div>
    </Split>
    <el-dialog
      title="创建文档"
      :visible.sync="insertDocumentDialogVisible"
      width="30%"
      :before-close="handleInsertDocumentDialogClose">

      <el-form label-position="" label-width="80px" :model="documentForm">
        <el-form-item label="父文档">
          <span class="document-path" v-html>{{documentForm.parentDocuments}}</span>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="documentForm.type">
            <el-radio :label="1">页面</el-radio>
            <el-radio :label="2">目录</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="documentForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="insertDocumentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertDocument">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
  import Split from "@/components/Split/Split";
  export default {
    name:'SpaceView',
    components: {Split},
    props:{
      space:{
        type:Object,
        default:{}
      },
      show:{
        type:Boolean,
        default:false,
      },
      treeData:{
        type:Array,
        default(){
          return []
        }
      }
    },
    watch:{
    },
    data(){
      return{
        documentForm:{
          parentDocuments:'',
          type:1,
          name:'',
          parentId:'0',
        },
        insertDocumentDialogVisible:false,
        split:0.8,
        spaceTreeFilterText:'',
        currentDocumentNode:{},
        treeProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods:{
      returnSpace(){
        this.$emit('return')
      },
      handleNodeClick(data) {
        this.currentDocumentNode = data
      },
      handleInsertDocumentDialogClose(done){
        this.currentDocumentNode = null
        done()
      },
      handleInsertDocumentBtn() {
        if (this.currentDocumentNode) {
          this.documentForm.parentDocuments = this.currentDocumentNode.path
        } else {
          this.documentForm.parentDocuments = this.space.name
        }
        this.insertDocumentDialogVisible = true
      },
      insertDocument(){
        this.insertDocumentDialogVisible = false
        this.$post('wiki/document',{...this.documentForm}).then((res)=>{
        })
      },
    }
  }
</script>

<style>
  .space-view,.space-split-pane{
    height: 100%;
    width: 100%;
  }
.space-view-header{
  border-bottom: 1px solid #E5E5E5;
}
  .space-tree{
   padding: 0 20px;
  }
  .space-name-tree{
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
  }
  .space-name-tree i{
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease-in-out;
  }
  .space-name-tree:hover i{
    opacity: 1;
    visibility: visible;
  }
  .tree-filter-input input{
    height: 30px!important;
    line-height: 30px!important;
  }
</style>

<style lang="scss" scoped>

</style>
