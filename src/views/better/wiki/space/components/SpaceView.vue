<template>
  <el-row class="space-view">
    <el-row class="space-view-header">
      <el-col :span="16" class="space-name" v-cloak>{{space.name}}</el-col>
      <el-col :span="8">
        <el-button @click="returnSpace">返回</el-button>
      </el-col>

    </el-row>
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

      }
    },
    methods:{
      returnSpace(){
        this.$emit('return')
      },
    }
  }
</script>

<style>
.space-view-header{
  border-bottom: 1px solid #8c939d;
}
</style>

<style lang="scss" scoped>

</style>
