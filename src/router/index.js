import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import PanSouSou from '@/components/PanSouSou'
import KuGou from '@/components/ku_gou/KuGou'
import KuGouPlay from '@/components/ku_gou/KuGouPlay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta:{
        title:'toolset'
      }
    },{
      path: '/pan',
      name: 'PanSouSou',
      component: PanSouSou,
      meta:{
        title:'盘搜搜测试'
      }
    },{
      path: '/ku_gou',
      name: 'KuGou',
      component: KuGou,
      meta:{
        title:'酷狗测试'
      },
    },{
      path: '/ku_gou/play',
      name: 'KuGouPlay',
      component: KuGouPlay
    }
  ]
})
