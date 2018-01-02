<template>
  <div>
    <Tree-Node v-for="item in data" :key="item.title" :node-data="item"></Tree-Node>
  </div>
</template>
<script>
import TreeNode from "./node.vue";
export default {
  name: "Tree",
  components: { TreeNode },
  directives: {},
  props: {
    data: {
      type: Array,
      default: []
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: "sp-tree",
      isTree:true,
      dragOverStatus: {
        overNodeKey: "",
        dropPosition: "",
        dragNode: {}
      }
    };
  },
  computed: {
  },
  methods: {},
    mounted() {
    this.$on('dragStart', (info) => {
      this.$emit('on-dragStart',info);
    });
    this.$on('dragEnter', (info) => {
      this.$emit('on-dragEnter',info);
    });
    this.$on('dragOver', (info) => {
      this.$emit('on-dragOver',info);
    });
    this.$on('dragLeave', (info) => {
      this.$emit('on-dragLeave',info);
    });
    this.$on('dragEnd', (info) => {
      this.$emit('on-dragEnd',info);
    });
    this.$on('drop', (dropInfo) => {
      this.$emit('on-drop',dropInfo);
    });
  },
  watch: {}
};
</script>