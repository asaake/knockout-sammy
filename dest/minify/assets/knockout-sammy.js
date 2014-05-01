(function(){String.prototype.stripLeft=function(t){var e,n,o,r,i;for(n=0,i=this.chars(),o=0,r=i.length;r>o&&(e=i[o],e===t);o++)n++;return this.slice(n)},String.prototype.stripRight=function(t){var e,n,o,r,i;for(n=this.length,i=this.chars().reverse(),o=0,r=i.length;r>o&&(e=i[o],e===t);o++)n--;return this.slice(0,n)},String.prototype.strip=function(t){return this.stripLeft(t).stripRight(t)}}).call(this),function(){define("common/path",[],function(){var t;return t=function(){function t(){}var e,n,o;return e=function(t,e){var n,o,r;for(r=0,n=t.length-1;n>=0;)o=t[n],"."===o?t.splice(n,1):".."===o?(t.splice(n,1),r++):r&&(t.splice(n,1),r--),n--;if(e)for(;r--;)t.unshift("..");return t},o=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,n=function(t){return o.exec(t).slice(1)},t.resolve=function(){var t,n,o,r;for(r="",o=!1,t=arguments.length-1;t>=-1&&!o;){if(n=t>=0?arguments[t]:process.cwd(),"string"!=typeof n)throw new TypeError("Arguments to path.resolve must be strings");n&&(r=n+"/"+r,o="/"===n.charAt(0),t--)}return r=e(r.split("/").filter(function(t){return!!t}),!o).join("/"),(o?"/":"")+r||"."},t.normalize=function(t){var n,o,r,i,s;for(o=this.isAbsolute(t),s="/"===t[t.length-1],i=t.split("/"),r=[],n=0;n<i.length;)i[n]&&r.push(i[n]),n++;return t=e(r,!o).join("/"),t||o||(t="."),t&&s&&(t+="/"),(o?"/":"")+t},t.isAbsolute=function(t){return"/"===t.charAt(0)},t.join=function(){var t,e,n,o;for(e="",t=0;t<arguments.length;){if(n=arguments[t],o=typeof n,"function"===o||"object"===o||"array"===o)throw new TypeError("Arguments to path.join must be strings");n=n.toString(),n&&(e+=e?"/"+n:n),t++}return this.normalize(e)},t.relative=function(t,e){var n,o,r,i,s,u,a;for(a=function(t){var e,n;for(n=0;n<t.length&&""===t[n];)n++;for(e=t.length-1;e>=0&&""===t[e];)e--;return n>e?[]:t.slice(n,e-n+1)},t=this.resolve(t).substr(1),e=this.resolve(e).substr(1),n=a(t.split("/")),u=a(e.split("/")),r=Math.min(n.length,u.length),s=r,o=0;r>o;){if(n[o]!==u[o]){s=o;break}o++}for(i=[],o=s;o<n.length;)i.push(".."),o++;return i=i.concat(u.slice(s)),i.join("/")},t.sep="/",t.delimiter=":",t.extname=function(t){return n(t)[3]},t}()})}.call(this),function(){define("knockout-sammy/base/view-model",[],function(){var t;return t=function(){function t(){}return t.mixin=function(t){var e,n,o;for(n in this)e=this[n],t[n]=e;o=this.prototype;for(n in o)e=o[n],t.prototype[n]=e},t.prototype.template=function(){throw new Error("not override template function.")},t.prototype.validate=function(){},t.prototype.clear=function(){},t.prototype.refresh=function(){},t}()})}.call(this),function(){define("knockout-sammy/binding-handlers/view-model-binding-handler",["knockout"],function(t){var e;return e=t.bindingHandlers.template,{create:function(){var n,o;return o=function(t){if("object"!=typeof t)throw new Error("model type is object.")},n=function(t,e,n,r,i){var s;return s=e(),null!=s.model&&(o(s.model),s.data=s.model,s.name=Object.isString(s.model.template)?s.model.template:s.model.template(),e=function(){return s},i.$model=s.model,delete s.model),[t,e,n,r,i]},t.bindingHandlers.template={init:function(t,o,r,i,s){var u;return u=n(t,o,r,i,s),e.init.apply(this,u)},update:function(t,o,r,i,s){var u;return u=n(t,o,r,i,s),e.update.apply(this,u)}}},clear:function(){return t.bindingHandlers.template=e}}})}.call(this),function(){define("knockout-sammy/helper",[],function(){return function(t){var e,n,o,r,i,s;for(e={context:t.context},o=["refreshContext"],r=function(n){return e[n]=function(){return t[n].apply(t,arguments)}},i=0,s=o.length;s>i;i++)n=o[i],r(n);return this.helpers(e)}})}.call(this),function(){var t={}.hasOwnProperty,e=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};define("knockout-sammy/knockout-sammy",["knockout","neo-sammy","knockout-sammy/helper"],function(t,n,o){var r;return r=function(n){function r(t){if(r.__super__.constructor.call(this),null==t)throw new Error("config is required.");if(null==t.contextId)throw new Error("config.contextId is required.");if(null==t.contextViewModel)throw new Error("config.contextViewModel is required.");this.config=t,this.contextId=this.config.contextId,this.context=this.config.contextViewModel,this.use(o)}return e(r,n),r.prototype.run=function(e){if(r.__super__.run.call(this,e),this.contextElement=$(this.contextId)[0],null==this.contextElement)throw new Error(""+this.contextId+" element not found.");return t.applyBindings(this.context,this.contextElement)},r.prototype.destroy=function(){return null!=this.contextElement&&(t.cleanNode(this.contextElement),this.contextElement=null),r.__super__.destroy.call(this)},r.prototype.refreshContext=function(){return null!=this.contextElement?(t.cleanNode(this.contextElement),t.applyBindings(this.context,this.contextElement)):void 0},r}(n)})}.call(this),function(){define("neo-sammy/helper",["common/path"],function(t){return function(e){var n,o,r,i,s,u;for(n={},r=["$element","path","log","refresh","trigger","lookupRoute","runRoute","getLocation","setLocation","notFound","error"],i=function(t){return n[t]=function(){return e[t].apply(e,arguments)}},s=0,u=r.length;u>s;s++)o=r[s],i(o);return n.url=function(e){var n,o,r,i,s;for(r=Array.create(arguments).slice(1),n=[e],i=0,s=r.length;s>i;i++)o=r[i],n.push(encodeURIComponent(o));return t.join.apply(t,n)},n.wrapScope=function(e){var n;return e=t.join(this.scope,e),n=Array.create(arguments).slice(1),this.url.apply(this,Array.create(e,n))},this.helpers(n)}})}.call(this),function(){var t={}.hasOwnProperty,e=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};define("neo-sammy/history-location-proxy",[],function(){var t;return t=function(t){function n(t,e){var o;n.__super__.constructor.call(this,t,e),o=t.setLocation,t.setLocation=function(t,e,n){return this._location_proxy.setLocation(t,e,n)},t.setLocation.restore=function(){return t.setLocation=o}}return e(n,t),n.prototype.setLocation=function(t,e,n){return null==e&&(e={}),null==n&&(n=null),/^([^#\/]|$)/.test(t)&&(t=this.has_history&&!this.app.disable_push_state?"/"+t:"#!/"+t),t!==this.getLocation()?this.has_history&&!this.app.disable_push_state&&/^\//.test(t)?(e.path=t,null==n&&(n=window.title),history.pushState(e,n,t),this.app.trigger("location-changed")):window.location=t:void 0},n}(Sammy.DefaultLocationProxy)})}.call(this),function(){var t={}.hasOwnProperty,e=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};define("neo-sammy/neo-event-context",["sammy"],function(t){var n;return n=function(n){function o(e,n,o,r,i,s){t.EventContext.call(this,e,n,o,r,i),this.scope=s}return e(o,n),o}(t.EventContext)})}.call(this),function(){var t={}.hasOwnProperty,e=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};define("neo-sammy/neo-sammy",["sammy","neo-sammy/history-location-proxy","neo-sammy/neo-event-context","neo-sammy/helper"],function(t,n,o,r){var i;return i=function(i){function s(){t.Application.apply(this,arguments),this.context_prototype=function(){return o.apply(this,arguments)},this.context_prototype.prototype=new o,this.setLocationProxy(new n(this)),this.use(r),this.scopes=[]}var u,a,c,p,l,h;return e(s,i),a="([^/]+)",u=/:([\w\d]+)/g,p="($|/.*)",c=/([/\*]+)/g,l=/\?([^#]*)?$/,h=function(t){return decodeURIComponent((t||"").replace(/\+/g," "))},s.prototype.scope=function(){return 1===arguments.length&&arguments[0].apply(this),2===arguments.length?(this.scopes.push(arguments[0].strip("/")),arguments[1].apply(this),this.scopes.pop()):void 0},s.prototype.path=function(t){return t=Array.create(this.scopes,t.strip("/")).join("/"),t.startsWith("^")||(t="/"+t),t=t.stripRight("/")},s.prototype.printRoutes=function(){var t,e,n,o,r;o=this.sammy.routes,r=[];for(n in o)e=o[n],r.push(function(){var n,o,r;for(r=[],n=0,o=e.length;o>n;n++)t=e[n],r.push(console.log(""+t.verb+": "+t.path+", ["+t.param_names+"]"));return r}());return r},s.prototype.before=function(t,e){var n;return Object.isFunction(t)&&(e=t,t={}),Object.isString(t)&&(t={path:this.path(t)}),null!=t.path&&(n=t.path,n=n.replace(u,a),n=n.replace(c,p),n=new RegExp(n+"$"),t.path=n),s.__super__.before.call(this,t,e)},s.prototype.destroy=function(){return this.unload(),this},s.prototype.route=function(t,e){var n,o,r,i,s;if(r=[],o=Array.prototype.slice.call(arguments,2),0===o.length&&_isFunction(e)&&(o=[e],e=t,t="any"),s=this.path(""),e=this.path(e),console.log("path: "+t+": "+e),t=t.toLowerCase(),e.constructor===String){for(u.lastIndex=0;null!==(i=u.exec(e));)r.push(i[1]);e=new RegExp(e.replace(u,a)+"$")}return $.each(o,function(t,e){return"string"==typeof e?o[t]=this[e]:void 0}),n=function(t){return function(n){var i,u;return i={verb:n,path:e,scope:s,callback:o,param_names:r},null==(u=t.routes)[n]&&(u[n]=[]),t.routes[n].push(i)}}(this),"any"===t?$.each(this.ROUTE_VERBS,function(t,e){return n(e)}):n(t),this},s.prototype.runRoute=function(t,e,n,o){var r,i,s,u,a,c,p,l,f,m;if(r=this,f=this.lookupRoute(t,e),this.debug&&this.log("runRoute",[t,e].join(" ")),this.trigger("run-route",{verb:t,path:e,params:n}),null==n&&(n={}),$.extend(n,this._parseQueryString(e)),f){this.trigger("route-found",{route:f}),null!==(l=f.path.exec(this.routablePath(e)))&&(l.shift(),$.each(l,function(t,e){f.param_names[t]?n[f.param_names[t]]=h(e):(n.splat||(n.splat=[]),n.splat.push(h(e)))})),a=new this.context_prototype(this,t,e,n,o,f.scope),i=this.arounds.slice(0),s=this.befores.slice(0),u=[a],n.splat&&(u=u.concat(n.splat)),m=function(){var t,e,n,o;for(o=void 0,e=void 0,n=void 0;s.length>0;)if(t=s.shift(),r.contextMatchesOptions(a,t[0])&&(o=t[1].apply(a,[a]),o===!1))return!1;return r.last_route=f,a.trigger("event-context-before",{context:a}),"function"==typeof f.callback&&(f.callback=[f.callback]),f.callback&&f.callback.length&&(e=-1,n=function(){e++,f.callback[e]?o=f.callback[e].apply(a,u):r._onComplete&&r._onComplete(a)},u.push(n),n()),a.trigger("event-context-after",{context:a}),o},$.each(i.reverse(),function(t,e){var n;n=m,m=function(){return e.apply(a,[n])}}),p=void 0;try{p=m()}catch(y){c=y,this.error(["500 Error",t,e].join(" "),c)}return p}return this.notFound(t,e)},s}(t.Application)})}.call(this),function(){define("neo-sammy",["neo-sammy/neo-sammy"],function(t){return t})}.call(this),function(){var t={}.hasOwnProperty,e=function(e,n){function o(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return o.prototype=n.prototype,e.prototype=new o,e.__super__=n.prototype,e};define("source-template-engine/source-template-engine",["knockout","source-template-engine/template-source"],function(t,n){var o;return o=function(o){function r(t){null==t&&(t={}),this.templateSources=t,this.templates={},this.allowTemplateRewriting=!1}return e(r,o),r.prototype.makeTemplateSource=function(e){var o,r;if("string"==typeof e){if(o=document.getElementById(e))return new t.templateSources.domElement(o);if(!Object.has(this.templateSources,e))throw new Error(""+e+" template is not found.");return null==(r=this.templates)[e]&&(r[e]=new n(e,this.templateSources[e])),this.templates[e]}return 1===e.nodeType||8===e.nodeType?new t.templateSources.anonymousTemplate(e):void 0},r.prototype.renderTemplate=function(t,e,n){var o;return o=this.makeTemplateSource(t,e,n),this.renderTemplateSource(o,e,n)},r}(t.nativeTemplateEngine)})}.call(this),function(){define("source-template-engine/template-source",[],function(){var t;return t=function(){function t(t,e){this.templateId=t,this.template=Object.isFunction(e)?e():e,this.data={}}return t.prototype.value=function(t){return this.data[t]},t.prototype.data=function(t,e){return 1===arguments.length?this.data[t]:this.data[t]=e},t.prototype.text=function(t){return 0===arguments.length?this.template:this.template=t},t.prototype.getTemplate=function(){return this.template},t}()})}.call(this),function(){define("source-template-engine",["source-template-engine/source-template-engine"],function(t){return t})}.call(this),function(){define("knockout-sammy",["knockout-sammy/knockout-sammy"],function(t){return t})}.call(this);
/*# sourceMappingURL=knockout-sammy.js.map */