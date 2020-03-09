<template>
  <el-row class="space-view">
    <Split v-model="split">
      <div slot="left" class="space-split-pane space-split-pane-left">
        <el-row class="space-view-header">
          <el-col :span="16" class="space-name" v-cloak>{{space.name}}</el-col>
          <el-col :span="8">
            <el-button @click="returnSpace">返回</el-button>
            <el-button @click="handleDocumentEdit">编辑</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="right" class="space-split-pane space-split-pane-right">
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
          <el-tree icon-class="" ref="documentTree" :highlight-current="true" :data="treeData" :props="treeProps" @node-click="handleNodeClick">
            <template v-slot="{node,data}">
              <!-- 目录类型节点 -->
              <div v-if="data.type===1">
                <i v-if="node.childNodes.length > 0" @click.stop="handleNodeToggle(node)" :class="['node-text-prefix','iconfont',node.expanded?'icon-jian':'icon-tianjia']"/>
                <i :class="['node-text-prefix', node.expanded&&node.childNodes.length > 0?'el-icon-folder-opened':'el-icon-folder']"/>
                <span class="node-text">{{data.label}}</span>
                <i @click="insertDocumentDialogVisible = true" class="iconfont icon-tianjia node-text-suffix"/>
                <i class="el-icon-delete node-text-suffix"/>
              </div>
              <div v-else>
                <i class="el-icon-document"/>
                <span class="node-text">{{data.label}}</span>
                <i class="el-icon-delete node-text-suffix"/>
              </div>
            </template>
          </el-tree>
        </el-row>
      </div>
    </Split>

    <!--创建文档模态框-->
    <el-dialog
      title="创建文档"
      :visible.sync="insertDocumentDialogVisible"
      width="30%"
      :before-close="handleInsertDocumentDialogClose">

      <el-form label-position="" label-width="80px" :model="documentForm">
        <el-form-item label="父文档">
          <span class="document-path" v-html>面包屑</span>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="documentForm.type">
            <el-radio :label="2">页面</el-radio>
            <el-radio :label="1">目录</el-radio>
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

    <!--创建文档模态框-->
    <div class="document-edit-dialog">
      <el-dialog
        title="文档"
        :visible.sync="documentEditDialogVisible"
        width="100%"
        top="0"
        :before-close="handleDocumentEditDialogClose">


      <span slot="footer" class="dialog-footer">
        <el-button @click="documentEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertDocument">确 定</el-button>
      </span>
      </el-dialog>
    </div>
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
        documentEditDialogVisible:false,
        documentForm:{
          parentDocuments:'',
          type:2,
          name:'',
          parentId:'0',
          path:'',
          spaceId:'',
        },
        treeSlotProps:{
          node:'',
          data:{},
        },
        breadcrumbStr:'',
        path:'',
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
      handleNodeClick(data,node,nodeComponent) {
        this.currentDocumentNode = data

        node.expanded = !node.expanded
        console.log(node)
        console.log(nodeComponent)
      },
      handleNodeToggle(node){
        console.log('click')
        node.expanded = !node.expanded;
      },
      handleInsertDocumentDialogClose(done){
        this.currentDocumentNode = null
        done()
      },
      handleDocumentEditDialogClose(done){
        done()
      },
      handleDocumentEdit(){
        this.documentEditDialogVisible = true
      },
      handleInsertDocumentBtn() {
        if (this.currentDocumentNode) {
          this.documentForm.parentDocuments = this.currentDocumentNode.path
        } else {
          this.documentForm.parentDocuments = this.space.name
        }
        this.path = this.currentDocumentNode.path
        this.insertDocumentDialogVisible = true
        console.log(this.$refs.documentTree)
      },
      insertDocument(){
        const currentNode = this.$refs['documentTree'].getCurrentNode()
        if(currentNode){
          this.documentForm.parentId = currentNode.documentId
        }else {
          this.documentForm.parentId = '0'
        }
        this.documentForm.path = currentNode.path + ',' + currentNode.documentId
        this.documentForm.spaceId = this.space.spaceId
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
  padding-bottom: 10px;
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
  .space-name-tree i,.node-text-suffix{
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease-in-out;
  }
  .space-name-tree:hover i,.el-tree-node__content:hover .node-text-suffix{
    opacity: 1;
    visibility: visible;
  }
  .tree-filter-input input{
    height: 30px!important;
    line-height: 30px!important;
  }
  .el-tree-node__expand-icon.el-icon-caret-right{
    display: none;
  }
  .space-split-pane-right{
    padding: 0 10px 0 20px;
  }
  .node-text-prefix.icon-tianjia,.node-text-prefix.icon-jian{
    font-size: 15px;
  }
  .node-text-suffix.icon-tianjia{
    font-size: 17px;
    color: #d9d9d9;
  }
  .node-text-suffix.icon-tianjia:hover{
    font-size: 17px;
    color: #1890ff;
  }
  .node-text-suffix.el-icon-delete{
    font-size: 15px;
    color: #d9d9d9;
  }
  .node-text-suffix.el-icon-delete:hover{
    font-size: 15px;
    color: #ff4d4f;
  }
  .node-text{
    font-size: 18px;
  }
  .document-edit-dialog .el-dialog{
    height: 100%;
  }
</style>

<style lang="scss" scoped>

</style>
