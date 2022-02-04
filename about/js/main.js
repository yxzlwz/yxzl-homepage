/*
 * @Author: N0ts
 * @Date: 2021-11-16 16:59:53
 * @LastEditTime: 2021-12-03 10:34:54
 * @Description: main
 * @FilePath: /NutssssIndex2/js/N0ts.js
 * @Mail：mail@n0ts.cn
 */

import c from "./config.js";

window.onload = function () {
    document.querySelector(".load").style.display = "none";
    document.querySelector(".Box").classList.add("BoxLoad");
};

const seconds = 1000, minutes = seconds * 60, hours = minutes * 60, days = hours * 24, years = days * 365;
// Vue.config.devtools = true;

new Vue({
    el: "#app",
    data: {
        tabState: false, // 侧边栏菜单是否展开
        menuTabState: false, // 侧边栏顶部菜单是否展开
        pagesTabState: false, // 侧边栏页面菜单是否展开
        pageIndex: 0, // 当前页面索引
        timeText: "", // 计时文案
        giteeData: c.giteeData, // 码云仓库数据
        notice: [],
        links_data: c.links_data
    },
    created() {
        // 获取 Gitee 仓库信息
        this.getNotice()
    },
    mounted() {
        // 计时器开始
        setInterval(() => {
            this.lovetime();
        }, 1000);

        // 图片查看
        const imgs = document.querySelectorAll(".pagesTextBox img");
        imgs.forEach((item) => {
            new Viewer(item);
        });
    },
    methods: {
        /**
         * 侧边菜单打开关闭
         */
        getNotice() {
            axios.post("https://board.yixiangzhilv.com/api", "room=notice&token=HLucVIFu")
            .then(res => {
                res = res["data"]["data"];
                for(let i = 0; i < res.length; i++){
                    res[i]["time"] = moment(Number(res[i]["time"])).format('lll');
                }
                this.notice = res;
            })
            .catch(err => {
                console.error(err);
                this.notice = [];
            })
        },

        changeTab() {
            this.tabState = !this.tabState;
        },

        /**
         * 侧边栏顶部菜单打开关闭
         */
        changeMenuTab() {
            this.menuTabState = !this.menuTabState;
        },

        /**
         * 侧边栏页面菜单打开关闭
         */
        changePagesTab() {
            this.pagesTabState = !this.pagesTabState;
        },

        /**
         * 侧边菜单收起
         */
        closeBlackWindow() {
            this.tabState = this.menuTabState = this.pagesTabState = false;
        },

        /**
         * 切换页面
         * @param {*} i 索引
         */
        changePageIndex(i) {
            this.pageIndex = i;
        },

        /**
         * 时差计算
         */
        lovetime() {
            let t1 = c.loveTime, t2 = new Date();
            let diff = t2 - t1;
            let diffYears = Math.floor(diff / years);
            let diffDays = Math.floor(diff / days - diffYears * 365);
            let diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours);
            let diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes);
            let diffSeconds = Math.floor(
                (diff - (diffYears * 365 + diffDays) * days - diffHours * hours - diffMinutes * minutes) / seconds
            );
            if (diffYears) {
                this.timeText = `${diffYears} 年 ${diffDays} 天 ${diffHours} 小时 ${diffMinutes} 分钟 ${diffSeconds} 秒啦！`;
            }else{
                this.timeText = `${diffDays} 天 ${diffHours} 小时 ${diffMinutes} 分钟 ${diffSeconds} 秒啦！`;
            }
        },

        // this.giteeData = c.giteeData,
    }
});
