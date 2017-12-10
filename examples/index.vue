<template>
    <div>
        <div class="market-nav-position">
            <ul class="market-nav-ul">
                <router-link to="/tree" tag="li" active-class="current" class="market-title cursor_pointer">
                    tree
                </router-link>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>
<style lang="less">
@import "../src/styles/index.less";
</style>
<style scoped>
.market-nav-position {
    margin-bottom: 40px;
}
.market-nav-ul {
    margin: 0 auto;
    padding: 10px 0;
}
.market-title {
    width: 140px;
    height: 36px;
    line-height: 36px;
    border-radius: 40px;
    margin: 0 5px;
    background: #eff1f6;
    color: #65778b;
    font-size: 14px;
    display: inline-block;
    list-style: none;
    text-align: center;
}
.market-title.current {
    background: #fff;
    color: #5094e7;
    border: 1px solid #dfe3ed;
}
.cursor_pointer {
    cursor: pointer;
}
</style>
<script>
export default {
}
</script>