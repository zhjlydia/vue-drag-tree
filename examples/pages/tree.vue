<template>
    <Tree :data="data1" draggable>
    </Tree>
</template>
<script>
import Tree from '../../src/components/tree/index.js';
export default {
    components: {
      Tree
    },
    data() {
        return {
            data1: [
                {
                    title: 'parent 1',
                    isExpand: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            isExpand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1'
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            isExpand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1'
                                },
                                {
                                    title: 'leaf 1-2-2'
                                },
                                {
                                    title: 'leaf 1-2-3'
                                },
                                {
                                    title: 'leaf 1-2-4'
                                },
                                {
                                    title: 'leaf 1-2-5'
                                },
                                {
                                    title: 'leaf 1-2-6'
                                },
                                {
                                    title: 'leaf 1-2-7'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
</script>