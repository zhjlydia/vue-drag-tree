<template>
    <transition name="slide-up">
        <ul :class="classes" v-show="visible">
            <li>
                <div :class="[prefixCls + '-item']">
                    <i class="sp-icon sp-icon-arrow-right" :class="arrowClasses" @click.stop="expandNode()"></i>
                    <span :class="[prefixCls + '-title-wrap']" ref="dropTarget">
                        <span :class="[dragClasses,dragOverClass]" ref="draggAbleDom" v-html="nodeData.title"></span>
                    </span>
                </div>
                <transition-group name="list-complete">
                    <Tree-Node v-for="item in nodeData.children" :key="item.title" :node-data="item" :visible="nodeData.isExpand" :root="root"></Tree-Node>
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
        nodeData: {
            type: Object,
            default() {
                return {
                    title: "",//显示的标题
                    isExpand: false,//是否展开
                    noDrag:false,//此节点禁用拖拽
                    noDrop:false,//此节点禁用放置
                    children: []//子项
                };
            }
        },
        visible: {
            type: Boolean,
            default: true
        },
        root:{
            type：Object
        }
    },
    data() {
        return {
            prefixCls: "sp-tree",
            dragOverClass:"",
            dragNodeHighlight:false //拖拽元素是否高亮
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
        dragClasses() {
            return [
              {
                ["tree-draggable"]:this.root.draggable && !this.nodeData.prop.noDrag,
                ["tree-drag-selected"]: this.dragNodeHighlight,
                ["tree-drag-disabled"]: this.nodeData.prop.noDrag,//禁用该节点的拖拽
                ["tree-drop-disabled"]: this.nodeData.prop.noDrop,//该节点禁用放置
            }
       ];
    }
    },
    methods: {
        init(){
            this.nodeData._hash = this.generateHash();
        },
        expandNode() {
            this.nodeData.isExpand = !this.nodeData.isExpand
        },
             //拖拽处理-huijuan
    //计算拖拽节点的放置方式0（作为目标节点的子节点），-1（放置在目标节点的前面）,1（放置在目标节点的后面）
    calDropPosition(e) {
      var offsetTop = this.getOffset(e.target).top;
      var offsetHeight = e.target.offsetHeight;
      var pageY = e.pageY;
      var gapHeight = 0.2 * offsetHeight;
      if (pageY > offsetTop + offsetHeight - gapHeight) {//放在目标节点后面-同级
        return 1;
      }
      if (pageY < offsetTop + gapHeight) {//放在目标节点前面-同级
        return -1;
      }
      //放在目标节点里面-作为子节点
      return 0;
    },
    setDragOverClass(){
      var pos = this.root.dragOverStatus.dropPosition;
      if (pos === 0) {
        return "tree-drag-over";
      }
      else if (pos === -1) {
        return "tree-drag-over-top";
      }
      else if (pos === 1) {
        return "tree-drag-over-bottom"
      }
      return ""
    },
    //拖拽处理-huijuan
    //拖拽开始
    onDragStart(e) {
      e.stopPropagation();
      if(this.nodeData.prop.noDrag){
        return;
      }
      e.dataTransfer.effectAllowed = "move";
      this.nodeData.prop.isExpand = false;
      this.root.dragOverStatus.dragNode = {
        nodeData:this.nodeData,
        parentNode:this.parentNodeData
      };
      this.dragNodeHighlight= true;
      try {
         e.dataTransfer.setData('text/plain', '');
      } catch (error) {
      }
      this.root.rootInstance.$emit('dragStart', { treeNode: this.nodeData,parentNode:this.parentNodeData, event: e });
    },
    //进入目标节点
    onDragEnter:debounce(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var that=this;
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.root.dragOverStatus.dragNode || !this.root.dragOverStatus.dragNode.nodeData._hash){
        return;
      }
      this.root.dragOverStatus.overNodeKey="";
      this.root.dragOverStatus.dropPosition=null;
      //拖拽节点与目标节点是同一个，return掉
      if (this.nodeData._hash === this.root.dragOverStatus.dragNode.nodeData._hash) {
        return;
      }
      
      //当前节点禁止做为放置节点时
      if (this.nodeData.prop.noDrop) {
        return;
      }
      that.root.dragOverStatus.overNodeKey = that.nodeData._hash;//当前经过的可放置的节点的key
      //设置dragEnter定时器，停留300毫秒后触发事件
      if (!this.root.delayedDragEnterLogic) {
        this.root.delayedDragEnterLogic = {};
      }
      Object.keys(this.root.delayedDragEnterLogic).forEach(function (key) {
        clearTimeout(that.root.delayedDragEnterLogic[key]);
      });
      this.root.delayedDragEnterLogic[this.nodeData._hash] = setTimeout(function () {
        console.timeEnd('small loop'); 
        
        if (!that.nodeData.prop.isExpand) {
          that.toggleCollapseStatus();
        }
      }, 500);
       that.root.rootInstance.$emit('dragEnter', { treeNode: that.nodeData, parentNode: that.parentNodeData, event: e });
       console.time('small loop');
    },150),

    onDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.root.dragOverStatus.dragNode || !this.root.dragOverStatus.dragNode.nodeData._hash){
        return;
      }
      if(this.root.dragOverStatus.overNodeKey===this.nodeData._hash && mouseOffsetY!==e.pageY){
        this.root.dragOverStatus.dropPosition = this.calDropPosition(e);//放置标识0，-1,1
        this.dragOverClass=this.setDragOverClass();
        mouseOffsetY=e.pageY;
      }
      //当前节点禁止拖拽时
      if(!this.nodeData.prop.noDrop){
         this.root.rootInstance.$emit('dragOver', { treeNode: this.nodeData,parentNode:this.parentNodeData, event: e });
      }
      return false;
    },

    onDragLeave(e) {
      e.stopPropagation();
      this.dragOverClass="";
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.root.dragOverStatus.dragNode || !this.root.dragOverStatus.dragNode.nodeData._hash){
        return;
      }
      //当前节点禁止拖拽时
      if(this.nodeData.prop.noDrop){
        return;
      }
      this.root.rootInstance.$emit('dragLeave', { treeNode: this.nodeData,parentNode:this.parentNodeData, event: e });
    },

    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.dragOverClass="";
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.root.dragOverStatus.dragNode || !this.root.dragOverStatus.dragNode.nodeData._hash){
        return;
      }
      this.root.dragOverStatus.overNodeKey = "";
      //当前节点禁止拖拽时
      if(this.nodeData.prop.noDrop){
        return;
      }
      //拖拽节点与目标节点是同一个，不做任何操作
      if (this.root.dragOverStatus.dragNode.nodeData._hash === this.nodeData._hash) {
        return;
      }
      //当异步加载子节点时不允许放置
      if(this.showLoading){
        return;
      }
      var res = {
        event: e,
        dragNode: this.root.dragOverStatus.dragNode,
        dropNode: {
          nodeData:this.nodeData,
          parentNode:this.parentNodeData
        },
        dropPosition: this.root.dragOverStatus.dropPosition
      };
      this.root.rootInstance.$emit('drop', res);
    },

    onDragEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.root.dragOverStatus.dragNode || !this.root.dragOverStatus.dragNode.nodeData._hash){
        return;
      }
      //当前节点禁止拖拽时
      if(this.nodeData.prop.noDrop){
        return true;
      }
      this.root.dragOverStatus.dragNode=null;
      this.root.dragOverStatus.overNodeKey = "";
      this.dragNodeHighlight= false;
      this.root.rootInstance.$emit('dragEnd', { treeNode: this.nodeData, parentNode:this.parentNodeData,event: e });
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

        generateHash(num = 6) {
        var collectStr = "abcdefghijklmnopqrstuvwxyz0123456789",
          i = 0,
          str = "";
        while (i < num) {
          str += collectStr[Math.round(Math.random() * 35)];
          i++;
        }
        return str;
      },
    },
    mounted() {
    //绑定拖拽事件
    if(this.root.draggable){
      this.$refs.draggAbleDom.draggable= !this.nodeData.noDrag;
      this.$refs.draggAbleDom.ondragstart= this.onDragStart;

      this.$refs.dropTarget.ondragenter=this.onDragEnter;
      this.$refs.dropTarget.ondragover=this.onDragOver;
      this.$refs.dropTarget.ondragleave=this.onDragLeave;
      this.$refs.dropTarget.ondrop=this.onDrop;
      this.$refs.dropTarget.ondragend=this.onDragEnd;
      }   
    },
    watch: {
    }
};
</script>