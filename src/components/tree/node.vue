<template>
    <transition name="slide-up">
        <ul :class="classes" v-show="visible">
            <li>
                <div :class="[prefixCls + '-item']">
                    <i class="sp-icon sp-icon-arrow-right" :class="arrowClasses" @click.stop="expandNode()"></i>
                    <span :class="[prefixCls + '-title']" v-html="data.title"></span>
                </div>
                    <transition-group name="list-complete">
                        <Tree-Node v-for="item in data.children" :key="item.title" :data="item" :visible="data.isExpand"></Tree-Node>
                    </transition-group>
            </li>
        </ul>
    </transition>
</template>
<script>
export default {
    name: 'TreeNode',
    components: {},
    props: {
        data: {
            type: Object,
            default() {
                return {
                    title: "",//显示的标题
                    isExpand: false,//是否展开
                    children: []//子项
                };
            }
        },
        visible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            prefixCls: "sp-tree"
        };
    },
    computed: {
        classes() {
            return [
                this.prefixCls + "-node"
            ];
        },
        arrowClasses() {
            return [
                this.prefixCls + "-arrow",
                {
                    [this.prefixCls + "-arrow-open"]: this.data.isExpand,
                    [this.prefixCls + "-arrow-hidden"]: !(this.data.children && this.data.children.length)
                }
            ];
        },
    },
    methods: {
        expandNode() {
            this.data.isExpand = !this.data.isExpand
        }
    },
    mounted() {
    },
    watch: {
    }
};
</script>