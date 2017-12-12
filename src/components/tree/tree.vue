<template>
  <div>
    <Tree-Node v-for="item in data" :key="item.title" :node-data="item" visible :root="rootData"></Tree-Node>
  </div>
</template>
<script>
import TreeNode from './node.vue';
export default {
    name: 'Tree',
    components: { TreeNode },
    directives: {
    },
    props: {
        data: {
            type: Array,
            default: []
        },
        draggable:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            prefixCls: "sp-tree",
            rootData:this,
            dragOverStatus:{
            overNodeKey: "",
            dropPosition: "",
            dragNode:{}
        },
        };
    },
    computed: {
        classes() {
            return [
                this.prefixCls, {
                    [this.prefixCls + '-visible']: true
                }
            ];
        }
    },
    methods: {
    
    },
    mounted() {
    },
    watch: {
    }
};
</script>