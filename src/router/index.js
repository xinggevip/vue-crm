import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '高公子CRM', icon: 'dashboard', requireAuth: true }
    }]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help', requireAuth: true },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '客户管理', icon: 'table', requireAuth: true }
  //     },
  //     {
  //       path: 'tabletwo',
  //       name: 'Tabletwo',
  //       component: () => import('@/views/tabletwo/index'),
  //       meta: { title: '预约管理', icon: 'table', requireAuth: true }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree', requireAuth: true }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/adduser',
    name: 'User',
    meta: { title: '会员管理', icon: 'el-icon-s-help', requireAuth: true },
    children: [
      {
        path: 'adduser',
        name: 'AddUser',
        component: () => import('@/views/user/adduser/index'),
        meta: { title: '添加会员', icon: 'table', requireAuth: true }
      },
      {
        path: 'userlist',
        name: 'UserList',
        component: () => import('@/views/user/userlist/index'),
        meta: { title: '会员列表', icon: 'table', requireAuth: true }
      },
    ]
  },
  {
    path: '/apt',
    component: Layout,
    redirect: '/apt/apting',
    alwaysShow: true,
    name: 'User',
    meta: { title: '预约管理', icon: 'el-icon-s-help', requireAuth: true },
    children: [
      {
        path: 'apting',
        name: 'AptIng',
        component: () => import('@/views/apt/ing/index'),
        meta: { title: '进行中', icon: 'table', requireAuth: true }
      },
      {
        path: 'aptover',
        name: 'AptOver',
        component: () => import('@/views/apt/over/index'),
        meta: { title: '已结束', icon: 'table', requireAuth: true }
      },
      {
        path: 'aptabandon',
        name: 'AptAbandon',
        component: () => import('@/views/apt/abandon/index'),
        meta: { title: '已放弃', icon: 'table', requireAuth: true }
      },

    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/emp',
    alwaysShow: true,
    name: 'User',
    meta: { title: '系统管理', icon: 'el-icon-s-help', requireAuth: true },
    children: [
      {
        path: 'emp',
        name: 'Emp',
        component: () => import('@/views/system/emp/index'),
        meta: { title: '员工列表', icon: 'table', requireAuth: true }
      },
      {
        path: 'pay',
        name: 'Pay',
        component: () => import('@/views/system/pay/index'),
        meta: { title: '支付列表', icon: 'table', requireAuth: true }
      },
      {
        path: 'source',
        name: 'Source',
        component: () => import('@/views/system/source/index'),
        meta: { title: '渠道列表', icon: 'table', requireAuth: true }
      },

    ]
  },
  {
    path: '/charge',
    component: Layout,
    redirect: '/charge/out',
    alwaysShow: true,
    name: 'User',
    meta: { title: '账单列表', icon: 'el-icon-s-help', requireAuth: true },
    children: [
      {
        path: 'out',
        name: 'Out',
        component: () => import('@/views/charge/out/index'),
        meta: { title: '消费列表', icon: 'table', requireAuth: true }
      },

    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form', requireAuth: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested',
  //     requireAuth: true
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1', requireAuth: true },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1', requireAuth: true }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2', requireAuth: true },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1', requireAuth: true }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2', requireAuth: true }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3', requireAuth: true }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2', requireAuth: true }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://qiangssvip.com',
        meta: { title: '作者博客', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
