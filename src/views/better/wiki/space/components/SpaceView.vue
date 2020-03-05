<template>
  <el-row class="space-view">
    <el-col :span="20" class="space-content">
      <el-row class="space-view-header">
        <el-col :span="16" class="space-name" v-cloak>{{space.name}}</el-col>
        <el-col :span="8">
          <el-button @click="returnSpace">返回</el-button>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="4" class="space-tree">
      <el-row class="space-tree-header">
        <el-row>
          <el-input
            class="tree-filter-input"
            placeholder="输入关键字进行过滤"
            v-model="spaceTreeFilterText">
          </el-input>
        </el-row>
        <el-row v-cloak class="space-name-tree">{{space.name}} <i class="iconfont icon-jia"></i></el-row>
      </el-row>
      <el-row class="space-tree-content">
        <el-tree :data="spaceTreeData" :props="spaceTreeProps" @node-click="handleNodeClick"></el-tree>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    name:'SpaceView',
    props:{
      space:{
        type:Object,
        default:{}
      },
      show:{
        type:Boolean,
        default:false,
      }
    },
    data(){
      return{
        spaceTreeFilterText:'',
        spaceTreeData: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        spaceTreeProps: {
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
        console.log(data);
      },
    }
  }
</script>

<style>
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
