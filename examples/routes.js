import index from './index.vue'
import tree from './pages/tree.vue'
// 配置路由
export default [{
    path: '/',
    component: index,
    children: [ {
        path: '/tree',
        component: tree
    }]
}]