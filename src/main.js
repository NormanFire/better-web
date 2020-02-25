import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
import './assets/icon/iconfont.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './utils/error-log' // error log
import request from '@/utils/request'

import * as filters from './filters' // global filters
import { hasPermission, hasNoPermission, hasAnyPermission } from './utils/permissionDirect'

const Plugins = [
  hasPermission,
  hasNoPermission,
  hasAnyPermission
]
Vue.use(VXETable)
Plugins.map((plugin) => {
  Vue.use(plugin)
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$login = request.login

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

VXETable.setup({
  // 默认表格参数
  border: true,
  resizable: true,
  showHeaderOverflow: true,
  showOverflow: true,
  highlightCurrentRow: true,
  highlightHoverRow: true,
  size: 'mini',
  align: 'left',
  stripe: false,

  // 默认 tooltip 主题样式
  tooltip: {
    trigger: 'hover',
    theme: 'light'
  },
  // 默认分页参数
  pager: {
    pageSize: 10,
    pagerCount: 12,
    pageSizes: [10, 15, 20, 50, 100],
    layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total'] // 非常灵活的分页布局，支持任意位置随意换
  },
  // 默认工具栏参数
  toolbar: {
    refresh: false,
    loading:false,
  }
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
