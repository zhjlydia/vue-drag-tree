<template>
    <Tree :data="data1" draggable @on-drop="getDropData">
    </Tree>
</template>
<script>
import Tree from "../../src/components/tree/index.js";
export default {
  components: {
    Tree
  },
  data() {
    return {
      data1: [
        {
          title: "parent 1",
          isExpand: true,
          children: [
            {
              title: "parent 1-1",
              isExpand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                  children:[]
                },
                {
                  title: "leaf 1-1-2",
                  children:[]
                }
              ]
            },
            {
              title: "parent 1-2",
              isExpand: true,
              children: [
                {
                  title: "leaf 1-2-1",
                  children:[]
                },
                {
                  title: "leaf 1-2-2",
                  children:[]
                },
                {
                  title: "leaf 1-2-3",
                  children:[]
                },
                {
                  title: "leaf 1-2-4",
                  children:[]
                },
                {
                  title: "leaf 1-2-5",
                  children:[]
                },
                {
                  title: "leaf 1-2-6",
                  children:[],
                  noDrop:true
                },
                {
                  title: "leaf 1-2-7",
                  children:[],
                  noDrag:true
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    getDropData(info) {
      var dragData = info.dragNode.nodeData;
      var dragParent = info.dragNode.parentNode;
      var dropData = info.dropNode.nodeData;
      var dropParent = info.dropNode.parentNode;
      var dropPosition = info.dropPosition; //0作为子级，-1放在目标节点前面，1放在目标节点后面

      //把拖拽元素从父节点中删除
      dragParent.children.splice(dragParent.children.indexOf(dragData), 1);
      if (dropPosition === 0) {
        dropData.children.push(dragData);
      } else {
        var index = dropParent.children.indexOf(dropData);
        if (dropPosition === -1) {
          dropParent.children.splice(index, 0, dragData);
        } else {
          dropParent.children.splice(index + 1, 0, dragData);
        }
      }
    }
  }
};
</script>