import Vue from 'vue'
import Router from 'vue-router'
import ClientIndex from '@/components/client/Index'
import Zookeeper from '@/components/client/zookeeper/Index'

import PanSouSou from '@/components/PanSouSou'
import KuGou from '@/components/ku_gou/KuGou'
import KuGouPlay from '@/components/ku_gou/KuGouPlay'

Vue.use(Router)

export default new Router({
  routes: [
    // 主页
    {
      path: '/',
      redirect: '/index',
      name: 'Index',
      component: () => import('@/components/Index'),
      meta: {
        title: 'toolset'
      },
      children: [{
        path: '/index',
        name: 'RandomImg',
        component: () => import('@/components/RandomImg'),
        meta: {
          title: 'image'
        }
      }, {
        path: '/client/home',
        name: 'ClientHome',
        component: () => import('@/components/ClientHome'),
        meta: {
          title: 'toolset'
        }
      }, {
        path: '/tools/home',
        name: 'ToolsHome',
        component: () => import('@/components/ToolsHome'),
        meta: {
          title: 'toolset'
        }
      }, {
        path: '/extend/home',
        component: () => import('@/components/TestFileUpdateLoad'),
        meta: {
          title: 'toolset'
        }
      }]
    },

    {
      path: '/cIndex',
      name: 'ClientIndex',
      component: ClientIndex,
      children: [{
        path: '/client/zookeeper',
        name: 'zookeeper',
        component: Zookeeper
      }]
    },
    {
      path: '/tools/postman',
      name: 'PostMan',
      component: () => import('../components/tools/postman/Index'),
      meta: {
        title: 'postman'
      }
    },
    {
      path: '/pan',
      name: 'PanSouSou',
      component: PanSouSou,
      meta: {
        title: '盘搜搜测试'
      }
    }, {
      path: '/ku_gou',
      name: 'KuGou',
      component: KuGou,
      meta: {
        title: '酷狗测试'
      },
    }, {
      path: '/ku_gou/play',
      name: 'KuGouPlay',
      component: KuGouPlay
    }
  ]
})
