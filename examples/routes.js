import index from './index.vue'
import tree from './pages/tree.vue'
// 配置路由
export default [{
    path: '/',
    component: index,
    redirect:'/tree',
    children: [ {
        path: '/tree',
        component: tree
    }]
}]