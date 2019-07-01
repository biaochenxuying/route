/*
* author: https://github.com/biaochenxuying/route
* 使用方法：
  var config = {
      routerViewId: '#routerView', // 路由切换的挂载点 id
      stackPages: true, // 多级页面缓存
      animationName: "slide", // 多级页面缓存
      routes: [
          // {
          //   path: "/home",
          //   name: "home",
          //   callback: function(transition) {
          //       home()
          //   }
          // }
      ]
  }
  1：初始化 Router.init()
  2：跳转  onclick='linkTo(\"#/list\")'
*/

(function() {
    var util = {
        //获取路由的路径和详细参数
        getParamsUrl: function() {
            var hashDeatail = location.hash.split("?"),
                hashName = hashDeatail[0].split("#")[1], //路由地址
                params = hashDeatail[1] ? hashDeatail[1].split("&") : [], //参数内容
                query = {};
            for (var i = 0; i < params.length; i++) {
                var item = params[i].split("=");
                query[item[0]] = item[1]
            }
            return {
                path: hashName,
                query: query,
                params: params
            }
        },
        // 闭包返回函数
        closure(name) {
            function fun(currentHash) {
                window.name&&window[name](currentHash)
            }
            return fun;
        },
        // 生成不同的 key 
        genKey() {
            var t = 'xxxxxxxx'
            return t.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0
                var v = c === 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        },
        hasClass: function(elem, cls) {
            cls = cls || '';
            if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
            return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
        },
        addClass: function(ele, cls) {
            if (!util.hasClass(ele, cls)) {
                ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
            }
        },
        removeClass(elem, cls) {
            if (util.hasClass(elem, cls)) {
                var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
                while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                    newClass = newClass.replace(' ' + cls + ' ', ' ');
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            }
        }
    }

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
        this.animationName = "fade"
    }

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

    // 注册到 window 全局
    window.Router = Router;
    window.router = new Router();

})()
