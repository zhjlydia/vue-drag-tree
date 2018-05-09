

# HTML5拖拽API实现vue树形拖拽组件

允许通过若拽修改节点位置

### 1.树形结构-组件递归使用

树形结构非常简单，tree组件作为父组件，结构如下

tree.vue
``` html

<template>
  <div>
    <Tree-Node v-for="item in data" :key="item.title" :node-data="item"></Tree-Node>
  </div>
</template>

```
vue组件允许在它们自己的模板中调用自身，因此可以形成树形结构，在组件中必须填写唯一的name。

tree-node.vue

``` html
<template>
  <transition name="slide-up">
    <ul :class="classes">
      <li>
        <div :class="[prefixCls + '-item']">
          <i class="sp-icon sp-icon-arrow-right" :class="arrowClasses" @click.stop="toggleCollapseStatus()"></i>
          <span :class="[prefixCls + '-title-wrap']" ref="dropTarget">
            <span :class="[dragClasses,dragOverClass]" ref="draggAbleDom" v-html="nodeData.title"></span>
          </span>
        </div>
        <Tree-Node v-for="item in nodeData.children" :key="item.title" :node-data="item" v-show="nodeData.children.length && nodeData.isExpand"></Tree-Node>
      </li>
    </ul>
  </transition>
</template>

```

### 2.拖拽节点

处理拖拽节点需要几个关键变量
- 当前拖拽的节点
- 拖拽时经过的节点
- 最终放置的节点

