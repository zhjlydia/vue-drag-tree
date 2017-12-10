<template>
    <div>
        <Tree-Node v-for="item in data" :key="item.title" :data="item" visible></Tree-Node>
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
        }
    },
    data() {
        return {
            prefixCls: "sp-tree",
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