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
      isTree: true,
      dragOverStatus: {
        overNodeKey: "",
        dropPosition: "",
        dragNode: {}
      }
    };
  },
  computed: {
  },
  methods: {
    //是否有拖拽节点
    hasDragNode() {
      return this.dragOverStatus.dragNode && this.dragOverStatus.dragNode.nodeData._hash;
    },
    //获取元素到文档顶部和左边的距离
    getOffset(ele) {
      if (!ele.getClientRects().length) {
        return { top: 0, left: 0 };
      }
      var rect = ele.getBoundingClientRect();
      if (rect.width || rect.height) {
        var doc = ele.ownerDocument;
        var win = doc.defaultView;
        var docElem = doc.documentElement;
        return {
          //元素距离视窗顶部距离，滚动高度，元素边框厚度
          top: rect.top + win.pageYOffset - docElem.clientTop,
          left: rect.left + win.pageXOffset - docElem.clientLeft
        };
      }
      return rect;
    },
    //计算拖拽节点的放置方式0（作为目标节点的子节点），-1（放置在目标节点的前面）,1（放置在目标节点的后面）
    calDropPosition(e) {
      var offsetTop = this.getOffset(e.target).top;
      var offsetHeight = e.target.offsetHeight;
      var pageY = e.pageY;
      var gapHeight = 0.2 * offsetHeight;
      if (pageY > offsetTop + offsetHeight - gapHeight) {
        //放在目标节点后面-同级
        return 1;
      }
      if (pageY < offsetTop + gapHeight) {
        //放在目标节点前面-同级
        return -1;
      }
      //放在目标节点里面-作为子节点
      return 0;
    },
    onDragStart(e, treeNode) {
      this.dragOverStatus.dragNode = {
        nodeData: treeNode.nodeData,
        parentNode: treeNode.parentNodeData
      };
      this.$emit("on-dragStart", {
        treeNode: treeNode.nodeData,
        parentNode: treeNode.parentNodeData,
        event: e
      });
    },
    onDragEnter(e, treeNode) {
      //当没有设置拖拽节点时，禁止作为目标节点
      if (!this.hasDragNode()) {
        return;
      }
      this.dragOverStatus.overNodeKey = "";
      //拖拽节点与目标节点是同一个，return掉
      if (
        treeNode.nodeData._hash === this.dragOverStatus.dragNode.nodeData._hash
      ) {
        return;
      }
      this.dragOverStatus.overNodeKey = treeNode.nodeData._hash; //当前经过的可放置的节点的key
      //当前节点禁止做为放置节点时
      if (treeNode.nodeData.noDrop) {
        return;
      }
      //设置dragEnter定时器，停留250毫秒后触发事件
      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {};
      }
      Object.keys(this.delayedDragEnterLogic).forEach(key => {
        clearTimeout(this.delayedDragEnterLogic[key]);
      });
      this.delayedDragEnterLogic[
        treeNode.nodeData._hash
      ] = setTimeout(() => {
        if (!treeNode.nodeData.isExpand) {
          treeNode.toggleCollapseStatus();
        }
        this.$emit("on-dragEnter", {
          treeNode: treeNode.nodeData,
          parentNode: treeNode.parentNodeData,
          event: e
        });
      }, 250);
    },

    onDragOver(e, treeNode) {
      //当没有设置拖拽节点时，禁止作为目标节点
      if (!this.hasDragNode()) {
        return;
      }
      if (
        this.dragOverStatus.overNodeKey === treeNode.nodeData._hash
      ) {
        this.dragOverStatus.dropPosition = this.calDropPosition(e); //放置标识0，-1,1
      }
      this.$emit("on-dragOver", {
        treeNode: treeNode.nodeData,
        parentNode: treeNode.parentNodeData,
        event: e
      });
    },

    onDragLeave(e, treeNode) {
      //当没有设置拖拽节点时，禁止作为目标节点
      if (!this.hasDragNode()) {
        return;
      }
      this.$emit("on-dragLeave", {
        treeNode: treeNode.nodeData,
        parentNode: treeNode.parentNodeData,
        event: e
      });
    },

    onDrop(e, treeNode) {
      //当没有设置拖拽节点时，禁止作为目标节点
      if (!this.hasDragNode()) {
        return;
      }
      //当前节点禁止拖拽时
      if (treeNode.nodeData.noDrop) {
        return;
      }
      //拖拽节点与目标节点是同一个，不做任何操作
      if (
        this.dragOverStatus.dragNode.nodeData._hash === treeNode.nodeData._hash
      ) {
        return;
      }

      var res = {
        event: e,
        dragNode: this.dragOverStatus.dragNode,
        dropNode: {
          nodeData: treeNode.nodeData,
          parentNode: treeNode.parentNodeData
        },
        dropPosition: this.dragOverStatus.dropPosition
      };
      this.$emit("on-drop", res);
    },

    onDragEnd(e, treeNode) {
      //当没有设置拖拽节点时，禁止作为目标节点
      if (!this.hasDragNode()) {
        return;
      }
      //当前节点禁止拖拽时
      if (treeNode.nodeData.noDrop) {
        return true;
      }
      this.dragOverStatus.dragNode = null;
      this.dragOverStatus.overNodeKey = "";

      this.$emit("on-dragEnd", {
        treeNode: treeNode.nodeData,
        parentNode: treeNode.parentNodeData,
        event: e
      });
    }
  }
};
</script>