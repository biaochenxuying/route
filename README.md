效果图：

![route-origin.gif](https://upload-images.jianshu.io/upload_images/12890819-bcd752c4d96446db.gif?imageMogr2/auto-orient/strip)

项目地址：[https://github.com/biaochenxuying/route](https://github.com/biaochenxuying/route)

效果体验地址：

[1. 滑动效果： https://biaochenxuying.github.io/route/index.html](https://biaochenxuying.github.io/route/index.html)

[2. 淡入淡出效果： https://biaochenxuying.github.io/route/index2.html](https://biaochenxuying.github.io/route/index2.html)

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


##### 3.2.1 route.js

###### 3.2.1.1 跳转方法  linkTo

像 vue-router 那样，提供了一个 router-link 组件来导航，而我这个框架也提供了一个 linkTo 的方法。

```
        // 生成不同的 key 
        function genKey() {
            var t = 'xxxxxxxx'
            return t.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0
                var v = c === 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        }

        // 初始化跳转方法
        window.linkTo = function(path) {
                if (path.indexOf("?") !== -1) {
                    window.location.hash = path + '&key=' + genKey()
                } else {
                    window.location.hash = path + '?key=' + genKey()
                }
        }
```

用法：

```
//1. 直接用 a 标签
<a href='#/list' >列表1</a>

//2. 标签加 js 调用方法
<div onclick='linkTo(\"#/home\")'>首页</div>

// 3. js 调用触发
linkTo("#/list")
```

###### 3.2.1.2 构造函数 Router

定义好要用到的变量

```
function Router() {
        this.routes = {}; //保存注册的所有路由
        this.beforeFun = null; //切换前
        this.afterFun = null; // 切换后
        this.routerViewId = "#routerView"; // 路由挂载点 
        this.redirectRoute = null; // 路由重定向的 hash
        this.stackPages = true; // 多级页面缓存
        this.routerMap = []; // 路由遍历
        this.historyFlag = '' // 路由状态，前进，回退，刷新
        this.history = []; // 路由历史
        this.animationName = "slide" // 页面切换时的动画
    }
```

###### 3.2.1.3  实现路由功能

包括：初始化、注册路由、历史记录、切换页面、切换页面的动画、切换之前的钩子、切换之后的钩子、滚动位置的处理，缓存。

```
Router.prototype = {
        init: function(config) {
            var self = this;
            this.routerMap = config ? config.routes : this.routerMap
            this.routerViewId = config ? config.routerViewId : this.routerViewId
            this.stackPages = config ? config.stackPages : this.stackPages
            var name = document.querySelector('#routerView').getAttribute('data-animationName')
            if (name) {
                this.animationName = name
            }
            this.animationName = config ? config.animationName : this.animationName

            if (!this.routerMap.length) {
                var selector = this.routerViewId + " .page"
                var pages = document.querySelectorAll(selector)
                for (var i = 0; i < pages.length; i++) {
                    var page = pages[i];
                    var hash = page.getAttribute('data-hash')
                    var name = hash.substr(1)
                    var item = {
                        path: hash,
                        name: name,
                        callback: util.closure(name)
                    }
                    this.routerMap.push(item)
                }
            }

            this.map()

            // 初始化跳转方法
            window.linkTo = function(path) {
                console.log('path :', path)
                if (path.indexOf("?") !== -1) {
                    window.location.hash = path + '&key=' + util.genKey()
                } else {
                    window.location.hash = path + '?key=' + util.genKey()
                }
            }

            //页面首次加载 匹配路由
            window.addEventListener('load', function(event) {
                // console.log('load', event);
                self.historyChange(event)
            }, false)

            //路由切换
            window.addEventListener('hashchange', function(event) {
                // console.log('hashchange', event);
                self.historyChange(event)
            }, false)

        },
        // 路由历史纪录变化
        historyChange: function(event) {
            var currentHash = util.getParamsUrl();
            var nameStr = "router-" + (this.routerViewId) + "-history"
            this.history = window.sessionStorage[nameStr] ? JSON.parse(window.sessionStorage[nameStr]) : []

            var back = false,
                refresh = false,
                forward = false,
                index = 0,
                len = this.history.length;

            for (var i = 0; i < len; i++) {
                var h = this.history[i];
                if (h.hash === currentHash.path && h.key === currentHash.query.key) {
                    index = i
                    if (i === len - 1) {
                        refresh = true
                    } else {
                        back = true
                    }
                    break;
                } else {
                    forward = true
                }
            }
            if (back) {
                this.historyFlag = 'back'
                this.history.length = index + 1
            } else if (refresh) {
                this.historyFlag = 'refresh'
            } else {
                this.historyFlag = 'forward'
                var item = {
                    key: currentHash.query.key,
                    hash: currentHash.path,
                    query: currentHash.query
                }
                this.history.push(item)
            }
            console.log('historyFlag :', this.historyFlag)
                // console.log('history :', this.history)
            if (!this.stackPages) {
                this.historyFlag = 'forward'
            }
            window.sessionStorage[nameStr] = JSON.stringify(this.history)
            this.urlChange()
        },
        // 切换页面
        changeView: function(currentHash) {
            var pages = document.getElementsByClassName('page')
            var previousPage = document.getElementsByClassName('current')[0]
            var currentPage = null
            var currHash = null
            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];
                var hash = page.getAttribute('data-hash')
                page.setAttribute('class', "page")
                if (hash === currentHash.path) {
                    currHash = hash
                    currentPage = page
                }
            }
            var enterName = 'enter-' + this.animationName
            var leaveName = 'leave-' + this.animationName
            if (this.historyFlag === 'back') {
                util.addClass(currentPage, 'current')
                if (previousPage) {
                    util.addClass(previousPage, leaveName)
                }
                setTimeout(function() {
                    if (previousPage) {
                        util.removeClass(previousPage, leaveName)
                    }
                }, 250);
            } else if (this.historyFlag === 'forward' || this.historyFlag === 'refresh') {
                if (previousPage) {
                    util.addClass(previousPage, "current")
                }
                util.addClass(currentPage, enterName)
                setTimeout(function() {
                    if (previousPage) {
                        util.removeClass(previousPage, "current")
                    }
                    util.removeClass(currentPage, enterName)
                    util.addClass(currentPage, 'current')
                }, 350);
                // 前进和刷新都执行回调 与 初始滚动位置为 0
                currentPage.scrollTop = 0
                this.routes[currHash].callback ? this.routes[currHash].callback(currentHash) : null
            }
            this.afterFun ? this.afterFun(currentHash) : null
        },
        //路由处理
        urlChange: function() {
            var currentHash = util.getParamsUrl();
            if (this.routes[currentHash.path]) {
                var self = this;
                if (this.beforeFun) {
                    this.beforeFun({
                        to: {
                            path: currentHash.path,
                            query: currentHash.query
                        },
                        next: function() {
                            self.changeView(currentHash)
                        }
                    })
                } else {
                    this.changeView(currentHash)
                }
            } else {
                //不存在的地址,重定向到默认页面
                location.hash = this.redirectRoute
            }
        },
        //路由注册
        map: function() {
            for (var i = 0; i < this.routerMap.length; i++) {
                var route = this.routerMap[i]
                if (route.name === "redirect") {
                    this.redirectRoute = route.path
                } else {
                    this.redirectRoute = this.routerMap[0].path
                }
                var newPath = route.path
                var path = newPath.replace(/\s*/g, ""); //过滤空格
                this.routes[path] = {
                    callback: route.callback, //回调
                }
            }
        },
        //切换之前的钩子
        beforeEach: function(callback) {
            if (Object.prototype.toString.call(callback) === '[object Function]') {
                this.beforeFun = callback;
            } else {
                console.trace('路由切换前钩子函数不正确')
            }
        },
        //切换成功之后的钩子
        afterEach: function(callback) {
            if (Object.prototype.toString.call(callback) === '[object Function]') {
                this.afterFun = callback;
            } else {
                console.trace('路由切换后回调函数不正确')
            }
        }
    }
```

###### 3.2.1.4 注册到 Router 到 window 全局

```
    window.Router = Router;
    window.router = new Router();
```

完整代码：https://github.com/biaochenxuying/route/blob/master/js/route.js


##### 3.2.2 使用方法

##### 3.2.2.1 js 定义法

- callback 是切换页面后，执行的回调

```
<script type="text/javascript">
        var config = {
            routerViewId: 'routerView', // 路由切换的挂载点 id
            stackPages: true, // 多级页面缓存
            animationName: "slide", // 切换页面时的动画
            routes: [{
                path: "/home",
                name: "home",
                callback: function(route) {
                    console.log('home:', route)
                    var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>首页</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/list\")'>列表</a></div><div class='height'>内容占位</div>"
                    document.querySelector("#home").innerHTML = str
                }
            }, {
                path: "/list",
                name: "list",
                callback: function(route) {
                    console.log('list:', route)
                    var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>列表</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/detail\")'>详情</a></div>"
                    document.querySelector("#list").innerHTML = str
                }
            }, {
                path: "/detail",
                name: "detail",
                callback: function(route) {
                    console.log('detail:', route)
                    var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>详情</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/detail2\")'>详情 2</a></div><div class='height'>内容占位</div>"
                    document.querySelector("#detail").innerHTML = str
                }
            }, {
                path: "/detail2",
                name: "detail2",
                callback: function(route) {
                    console.log('detail2:', route)
                    var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>详情 2</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/home\")'>首页</a></div>"
                    document.querySelector("#detail2").innerHTML = str
                }
            }]
        }

        //初始化路由
        router.init(config)
        router.beforeEach(function(transition) {
            console.log('切换之 前 dosomething', transition)
            setTimeout(function() {
                //模拟切换之前延迟，比如说做个异步登录信息验证
                transition.next()
            }, 100)
        })
        router.afterEach(function(transition) {
            console.log("切换之 后 dosomething", transition)
        })
    </script>
```

##### 3.2.2.2 html 加 <script> 定义法

- id="routerView" ：路由切换时，页面的视图窗口
- data-animationName="slide"：切换时的动画，目前有 slide  和 fade。
- class="page": 切换的页面
- data-hash="/home"：home 是切换路由时执行的回调方法
- window.home : 回调方法，名字要与 data-hash 的名字相同
```
<div id="routerView" data-animationName="slide">
        <div class="page" data-hash="/home">
            <div class="page-content">
                <div id="home"></div>
                <script type="text/javascript">
                    window.home = function(route) {
                        console.log('home:', route)
                            // var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>首页</h2> <input type='text'> <div><a href='#/list' >列表1</div></div><div class='height'>内容占位</div>"
                        var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>首页</h2> <input type='text'> <div><div href='javascript:void(0);' onclick='linkTo(\"#/list\")'>列表</div></div><div class='height'>内容占位</div>"
                        document.querySelector("#home").innerHTML = str
                    }
                </script>
            </div>
        </div>
        <div class="page" data-hash="/list">
            <div class="page-content">
                <div id="list"></div>
                <div style="height: 700px;border: solid 1px red;background-color: #eee;margin-top: 20px;">内容占位</div>

                <script type="text/javascript">
                    window.list = function(route) {
                        console.log('list:', route)
                        var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>列表</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/detail\")'>详情</a></div>"
                        document.querySelector("#list").innerHTML = str
                    }
                </script>
            </div>
        </div>
        <div class="page" data-hash="/detail">
            <div class="page-content">
                <div id="detail"></div>
                <script type="text/javascript">
                    window.detail = function(route) {
                        console.log('detail:', route)
                        var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>详情</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/detail2\")'>详情 2</a></div><div class='height'>内容占位</div>"
                        document.querySelector("#detail").innerHTML = str
                    }
                </script>
            </div>
        </div>
        <div class="page" data-hash="/detail2">
            <div class="page-content">
                <div id="detail2"></div>
                <div style="height: 700px;border: solid 1px red;background-color: pink;margin-top: 20px;">内容占位</div>

                <script type="text/javascript">
                    window.detail2 = function(route) {
                        console.log('detail2:', route)
                        var str = "<div><a class='back' onclick='window.history.go(-1)'>返回</a></div> <h2>详情 2</h2> <input type='text'> <div><a href='javascript:void(0);' onclick='linkTo(\"#/home\")'>首页</a></div>"
                        document.querySelector("#detail2").innerHTML = str
                    }
                </script>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="./js/route.js"></script>
    <script type="text/javascript">
        router.init()
        router.beforeEach(function(transition) {
            console.log('切换之 前 dosomething', transition)
            setTimeout(function() {
                //模拟切换之前延迟，比如说做个异步登录信息验证
                transition.next()
            }, 100)
        })
        router.afterEach(function(transition) {
            console.log("切换之 后 dosomething", transition)
        })
    </script>
```

参考项目：https://github.com/kliuj/spa-routers

# 5. 最后 

项目地址：[https://github.com/biaochenxuying/route](https://github.com/biaochenxuying/route)

博客常更地址1 ：[https://github.com/biaochenxuying/blog](https://github.com/biaochenxuying/blog)

博客常更地址2 ：[http://biaochenxuying.cn/main.html](http://biaochenxuying.cn/main.html)


足足一个多月没有更新文章了，因为项目太紧，加班加班啊，趁着在家有空，赶紧写下这篇干货，免得忘记了，希望对大家有所帮助。

如果您觉得这篇文章不错或者对你有所帮助，请点个赞，谢谢。

![](https://upload-images.jianshu.io/upload_images/12890819-f8665293cc8d0dcf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 微信公众号：**BiaoChenXuYing**
> 分享 前端、后端开发等相关的技术文章，热点资源，随想随感，全栈程序员的成长之路。

关注公众号并回复 **福利** 便免费送你视频资源，绝对干货。

福利详情请点击：  [免费资源分享--Python、Java、Linux、Go、node、vue、react、javaScript](https://mp.weixin.qq.com/s?__biz=MzA4MDU1MDExMg==&mid=2247483711&idx=1&sn=1ffb576159805e92fc57f5f1120fce3a&chksm=9fa3c0b0a8d449a664f36f6fdd017ac7da71b6a71c90261b06b4ea69b42359255f02d0ffe7b3&token=1560489745&lang=zh_CN#rd)

![BiaoChenXuYing](https://upload-images.jianshu.io/upload_images/12890819-091ccce387e2ea34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)






















