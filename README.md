![dog.jpg](https://upload-images.jianshu.io/upload_images/12890819-bbe21d5b7777e34a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 1. 需求

因为我司的 H 5 的项目是用原生 js 写的，要用到路由，但是现在好用的路由都是和某些框架绑定在一起的，比如 vue-router ，framework7 的路由；但是又没必要为了一个路由功能而加入一套框架，现在自己写一个轻量级的路由。

# 2. 实现原理

现在前端的路由实现一般有两种，一种是 Hash 路由，另外一种是 History 路由。

## 2.1 History 路由

History 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。

#### 属性

- History.length 是一个只读属性，返回当前 session 中的 history 个数，包含当前页面在内。举个例子，对于新开一个 tab 加载的页面当前属性返回值 1 。
- History.state 返回一个表示历史堆栈顶部的状态的值。这是一种可以不必等待 popstate 事件而查看状态而的方式。

#### 方法

- History.back()

前往上一页, 用户可点击浏览器左上角的返回按钮模拟此方法. 等价于 history.go(-1).
> Note: 当浏览器会话历史记录处于第一页时调用此方法没有效果，而且也不会报错。

- History.forward()

在浏览器历史记录里前往下一页，用户可点击浏览器左上角的前进按钮模拟此方法. 等价于 history.go(1).

> Note: 当浏览器历史栈处于最顶端时( 当前页面处于最后一页时 )调用此方法没有效果也不报错。

- History.go(n)

通过当前页面的相对位置从浏览器历史记录( 会话记录 )加载页面。比如：参数为 -1的时候为上一页，参数为 1 的时候为下一页. 当整数参数超出界限时 ( 译者注:原文为 When integerDelta is out of bounds )，例如: 如果当前页为第一页，前面已经没有页面了，我传参的值为 -1，那么这个方法没有任何效果也不会报错。调用没有参数的 go() 方法或者不是整数的参数时也没有效果。( 这点与支持字符串作为 url 参数的 IE 有点不同)。

- history.pushState() 和 history.replaceState()

这两个 API 都接收三个参数，分别是

**a. 状态对象（state object）** — 一个JavaScript对象，与用 pushState() 方法创建的新历史记录条目关联。无论何时用户导航到新创建的状态，popstate 事件都会被触发，并且事件对象的state 属性都包含历史记录条目的状态对象的拷贝。

**b. 标题（title）** — FireFox 浏览器目前会忽略该参数，虽然以后可能会用上。考虑到未来可能会对该方法进行修改，传一个空字符串会比较安全。或者，你也可以传入一个简短的标题，标明将要进入的状态。

**c. 地址（URL）** — 新的历史记录条目的地址。浏览器不会在调用 pushState() 方法后加载该地址，但之后，可能会试图加载，例如用户重启浏览器。新的 URL 不一定是绝对路径；如果是相对路径，它将以当前 URL 为基准；传入的 URL 与当前 URL 应该是同源的，否则，pushState() 会抛出异常。该参数是可选的；不指定的话则为文档当前 URL。

> 相同之处: 是两个 API 都会操作浏览器的历史记录，而不会引起页面的刷新。

>不同之处在于: pushState 会增加一条新的历史记录，而 replaceState 则会替换当前的历史记录。

例子：

本来的路由

```
 http://biaochenxuying.cn/
```

执行：

```
window.history.pushState(null, null, "http://biaochenxuying.cn/home");
```

路由变成了：

```
 http://biaochenxuying.cn/hot
```

详情介绍请看：[MDN](https://developer.mozilla.org/en-US/docs/Web/API/History)

## 2.2  Hash 路由

我们经常在 url 中看到 #，这个 # 有两种情况，一个是我们所谓的锚点，比如典型的回到顶部按钮原理、Github 上各个标题之间的跳转等，但是路由里的 # 不叫锚点，我们称之为 hash。

现在的前端主流框架的路由实现方式都会采用 Hash 路由，本项目采用的也是。

当 hash 值发生改变的时候，我们可以通过 hashchange 事件监听到，从而在回调函数里面触发某些方法。

# 3. 代码实现

### 3.1 简单版 - 单页面路由

先看个简单版的 原生 js 模拟 Vue 路由切换。

![route-vue.gif](https://upload-images.jianshu.io/upload_images/12890819-e9d933a1c6437973.gif?imageMogr2/auto-orient/strip)

#### 原理

- 监听 hashchange ，hash 改变的时候，根据当前的 hash 匹配相应的 html 内容，然后用 innerHTML 把 html 内容放进 router-view 里面。


这个代码是网上的：

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="author" content="">
    <title>原生模拟 Vue 路由切换</title>
    <style type="text/css">
        .router_box,
        #router-view {
            max-width: 1000px;
            margin: 50px auto;
            padding: 0 20px;
        }
        
        .router_box>a {
            padding: 0 10px;
            color: #42b983;
        }
    </style>
</head>

<body>
    <div class="router_box">
        <a href="/home" class="router">主页</a>
        <a href="/news" class="router">新闻</a>
        <a href="/team" class="router">团队</a>
        <a href="/about" class="router">关于</a>
    </div>
    <div id="router-view"></div>
    <script type="text/javascript">
        function Vue(parameters) {
            let vue = {};
            vue.routes = parameters.routes || [];
            vue.init = function() {
                document.querySelectorAll(".router").forEach((item, index) => {
                    item.addEventListener("click", function(e) {
                        let event = e || window.event;
                        event.preventDefault();
                        window.location.hash = this.getAttribute("href");
                    }, false);
                });

                window.addEventListener("hashchange", () => {
                    vue.routerChange();
                });

                vue.routerChange();
            };
            vue.routerChange = () => {
                let nowHash = window.location.hash;
                let index = vue.routes.findIndex((item, index) => {
                    return nowHash == ('#' + item.path);
                });
                if (index >= 0) {
                    document.querySelector("#router-view").innerHTML = vue.routes[index].component;
                } else {
                    let defaultIndex = vue.routes.findIndex((item, index) => {
                        return item.path == '*';
                    });
                    if (defaultIndex >= 0) {
                        window.location.hash = vue.routes[defaultIndex].redirect;
                    }
                }
            };

            vue.init();
        }

        new Vue({
            routes: [{
                path: '/home',
                component: "<h1>主页</h1><a href='https://github.com/biaochenxuying'>https://github.com/biaochenxuying</a>"
            }, {
                path: '/news',
                component: "<h1>新闻</h1><a href='http://biaochenxuying.cn/main.html'>http://biaochenxuying.cn/main.html</a>"
            }, {
                path: '/team',
                component: '<h1>团队</h1><h4>全栈修炼</h4>'
            }, {
                path: '/about',
                component: '<h1>关于</h1><h4>关注公众号：BiaoChenXuYing</h4><p>分享 WEB 全栈开发等相关的技术文章，热点资源，全栈程序员的成长之路。</p>'
            }, {
                path: '*',
                redirect: '/home'
            }]
        });
    </script>
</body>

</html>
```

### 3.2 复杂版 - 内联页面版，带缓存功能 

首先前端用 js 实现路由的缓存功能是很难的，但像 vue-router 那种还好，因为有 vue 框架和虚拟 dom 的技术，可以保存当前页面的数据。

要做缓存功能，首先要知道浏览器的 前进、刷新、回退 这三个操作。

但是浏览器中主要有这几个限制：

- 没有提供监听前进后退的事件
- 不允许开发者读取浏览记录
- 用户可以手动输入地址，或使用浏览器提供的前进后退来改变 url

所以要自定义路由，解决方案是自己维护一份路由历史的记录，存在一个数组里面，从而区分 前进、刷新、回退。

- url 存在于浏览记录中即为后退，后退时，把当前路由后面的浏览记录删除。
- url 不存在于浏览记录中即为前进，前进时，往数组里面 push 当前的路由。
- url 在浏览记录的末端即为刷新，刷新时，不对路由数组做任何操作。

另外，应用的路由路径中可能允许相同的路由出现多次（例如 A -> B -> A），所以给每个路由添加一个 key 值来区分相同路由的不同实例。

这个浏览记录需要存储在 sessionStorage 中，这样用户刷新后浏览记录也可以恢复。


# 4. 完整代码与效果

效果图：



项目地址：[https://github.com/biaochenxuying/route](https://github.com/biaochenxuying/route)
效果体验地址：[ https://biaochenxuying.github.io/route/index.html](https://biaochenxuying.github.io/route/index.html)

参考：https://github.com/kliuj/spa-routers

# 5. 最后 

![](https://upload-images.jianshu.io/upload_images/12890819-f8665293cc8d0dcf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 微信公众号：**BiaoChenXuYing**
> 分享 前端、后端开发等相关的技术文章，热点资源，随想随感，全栈程序员的成长之路。

关注公众号并回复 **福利** 便免费送你视频资源，绝对干货。

福利详情请点击：  [免费资源分享--Python、Java、Linux、Go、node、vue、react、javaScript](https://mp.weixin.qq.com/s?__biz=MzA4MDU1MDExMg==&mid=2247483711&idx=1&sn=1ffb576159805e92fc57f5f1120fce3a&chksm=9fa3c0b0a8d449a664f36f6fdd017ac7da71b6a71c90261b06b4ea69b42359255f02d0ffe7b3&token=1560489745&lang=zh_CN#rd)

![BiaoChenXuYing](https://upload-images.jianshu.io/upload_images/12890819-091ccce387e2ea34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)






















