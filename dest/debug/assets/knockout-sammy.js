(function() {
  String.prototype.stripLeft = function(s) {
    var c, index, _i, _len, _ref;
    index = 0;
    _ref = this.chars();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      if (c !== s) {
        break;
      } else {
        index++;
      }
    }
    return this.slice(index);
  };

  String.prototype.stripRight = function(s) {
    var c, lastIndex, _i, _len, _ref;
    lastIndex = this.length;
    _ref = this.chars().reverse();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      if (c !== s) {
        break;
      } else {
        lastIndex--;
      }
    }
    return this.slice(0, lastIndex);
  };

  String.prototype.strip = function(s) {
    return this.stripLeft(s).stripRight(s);
  };

}).call(this);(function() {
  define("common/path", [], function() {
    var Path;
    return Path = (function() {
      var normalizeArray, splitPath, splitPathRe;

      function Path() {}

      normalizeArray = function(parts, allowAboveRoot) {
        var i, last, up;
        up = 0;
        i = parts.length - 1;
        while (i >= 0) {
          last = parts[i];
          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
          i--;
        }
        if (allowAboveRoot) {
          while (up--) {
            parts.unshift("..");
            up;
          }
        }
        return parts;
      };

      splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

      splitPath = function(filename) {
        return splitPathRe.exec(filename).slice(1);
      };

      Path.resolve = function() {
        var i, path, resolvedAbsolute, resolvedPath;
        resolvedPath = "";
        resolvedAbsolute = false;
        i = arguments.length - 1;
        while (i >= -1 && !resolvedAbsolute) {
          path = (i >= 0 ? arguments[i] : process.cwd());
          if (typeof path !== "string") {
            throw new TypeError("Arguments to path.resolve must be strings");
          } else {
            if (!path) {
              continue;
            }
          }
          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = path.charAt(0) === "/";
          i--;
        }
        resolvedPath = normalizeArray(resolvedPath.split("/").filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join("/");
        return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
      };

      Path.normalize = function(path) {
        var i, isAbsolute, nonEmptySegments, segments, trailingSlash;
        isAbsolute = this.isAbsolute(path);
        trailingSlash = path[path.length - 1] === "/";
        segments = path.split("/");
        nonEmptySegments = [];
        i = 0;
        while (i < segments.length) {
          if (segments[i]) {
            nonEmptySegments.push(segments[i]);
          }
          i++;
        }
        path = normalizeArray(nonEmptySegments, !isAbsolute).join("/");
        if (!path && !isAbsolute) {
          path = ".";
        }
        if (path && trailingSlash) {
          path += "/";
        }
        return (isAbsolute ? "/" : "") + path;
      };

      Path.isAbsolute = function(path) {
        return path.charAt(0) === "/";
      };

      Path.join = function() {
        var i, path, segment, type;
        path = "";
        i = 0;
        while (i < arguments.length) {
          segment = arguments[i];
          type = typeof segment;
          if (type === "function" || type === "object" || type === "array") {
            throw new TypeError("Arguments to path.join must be strings");
          }
          segment = segment.toString();
          if (segment) {
            if (!path) {
              path += segment;
            } else {
              path += "/" + segment;
            }
          }
          i++;
        }
        return this.normalize(path);
      };

      Path.relative = function(from, to) {
        var fromParts, i, length, outputParts, samePartsLength, toParts, trim;
        trim = function(arr) {
          var end, start;
          start = 0;
          while (start < arr.length) {
            if (arr[start] !== "") {
              break;
            }
            start++;
          }
          end = arr.length - 1;
          while (end >= 0) {
            if (arr[end] !== "") {
              break;
            }
            end--;
          }
          if (start > end) {
            return [];
          }
          return arr.slice(start, end - start + 1);
        };
        from = this.resolve(from).substr(1);
        to = this.resolve(to).substr(1);
        fromParts = trim(from.split("/"));
        toParts = trim(to.split("/"));
        length = Math.min(fromParts.length, toParts.length);
        samePartsLength = length;
        i = 0;
        while (i < length) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
          i++;
        }
        outputParts = [];
        i = samePartsLength;
        while (i < fromParts.length) {
          outputParts.push("..");
          i++;
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
      };

      Path.sep = "/";

      Path.delimiter = ":";

      Path.extname = function(path) {
        return splitPath(path)[3];
      };

      return Path;

    })();
  });

}).call(this);(function() {
  define("knockout-sammy/base/view-model", [], function() {
    var ViewModel;
    return ViewModel = (function() {
      function ViewModel() {}

      ViewModel.mixin = function(clazz) {
        var func, name, _ref;
        for (name in this) {
          func = this[name];
          clazz[name] = func;
        }
        _ref = this.prototype;
        for (name in _ref) {
          func = _ref[name];
          clazz.prototype[name] = func;
        }
      };

      ViewModel.prototype.template = function() {
        throw new Error("not override template function.");
      };

      ViewModel.prototype.validate = function() {};

      ViewModel.prototype.clear = function() {};

      ViewModel.prototype.refresh = function() {};

      return ViewModel;

    })();
  });

}).call(this);(function() {
  define("knockout-sammy/binding-handlers/view-model-binding-handler", ["knockout"], function(ko) {
    var template;
    template = ko.bindingHandlers.template;
    return {
      create: function() {
        var setup, validate;
        validate = function(context) {
          if (typeof context !== "object") {
            throw new Error("model type is object.");
          }
        };
        setup = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var data;
          data = valueAccessor();
          if (data.model != null) {
            validate(data.model);
            data.data = data.model;
            if (Object.isString(data.model.template)) {
              data.name = data.model.template;
            } else {
              data.name = data.model.template();
            }
            valueAccessor = function() {
              return data;
            };
            bindingContext.$model = data.model;
            delete data.model;
          }
          return [element, valueAccessor, allBindings, viewModel, bindingContext];
        };
        return ko.bindingHandlers.template = {
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var params;
            params = setup(element, valueAccessor, allBindings, viewModel, bindingContext);
            return template.init.apply(this, params);
          },
          update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var params;
            params = setup(element, valueAccessor, allBindings, viewModel, bindingContext);
            return template.update.apply(this, params);
          }
        };
      },
      clear: function() {
        return ko.bindingHandlers.template = template;
      }
    };
  });

}).call(this);(function() {
  define("knockout-sammy/helper", [], function() {
    return function(app) {
      var helpers, name, names, _fn, _i, _len;
      helpers = {
        context: app.context
      };
      names = ["refreshContext"];
      _fn = function(name) {
        return helpers[name] = function() {
          return app[name].apply(app, arguments);
        };
      };
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        _fn(name);
      }
      return this.helpers(helpers);
    };
  });

}).call(this);(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("knockout-sammy/knockout-sammy", ["knockout", "neo-sammy", "knockout-sammy/helper"], function(ko, NeoSammy, Helper) {
    var KnockoutSammy;
    return KnockoutSammy = (function(_super) {
      __extends(KnockoutSammy, _super);

      function KnockoutSammy(config) {
        KnockoutSammy.__super__.constructor.call(this);
        if (!(config != null)) {
          throw new Error("config is required.");
        }
        if (!(config.contextId != null)) {
          throw new Error("config.contextId is required.");
        }
        if (!(config.contextViewModel != null)) {
          throw new Error("config.contextViewModel is required.");
        }
        this.config = config;
        this.contextId = this.config.contextId;
        this.context = this.config.contextViewModel;
        this.use(Helper);
      }

      KnockoutSammy.prototype.run = function(path) {
        KnockoutSammy.__super__.run.call(this, path);
        this.contextElement = $(this.contextId)[0];
        if (!(this.contextElement != null)) {
          throw new Error("" + this.contextId + " element not found.");
        }
        return ko.applyBindings(this.context, this.contextElement);
      };

      KnockoutSammy.prototype.destroy = function() {
        if (this.contextElement != null) {
          ko.cleanNode(this.contextElement);
          this.contextElement = null;
        }
        return KnockoutSammy.__super__.destroy.call(this);
      };

      KnockoutSammy.prototype.refreshContext = function() {
        if (this.contextElement != null) {
          ko.cleanNode(this.contextElement);
          return ko.applyBindings(this.context, this.contextElement);
        }
      };

      return KnockoutSammy;

    })(NeoSammy);
  });

}).call(this);(function() {
  define("neo-sammy/helper", ["common/path"], function(Path) {
    return function(app) {
      var helpers, name, names, _fn, _i, _len;
      helpers = {};
      names = ["$element", "path", "log", "refresh", "trigger", "lookupRoute", "runRoute", "getLocation", "setLocation", "notFound", "error"];
      _fn = function(name) {
        return helpers[name] = function() {
          return app[name].apply(app, arguments);
        };
      };
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        _fn(name);
      }
      helpers.url = function(url) {
        var args, param, params, _j, _len1;
        params = Array.create(arguments).slice(1);
        args = [url];
        for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
          param = params[_j];
          args.push(encodeURIComponent(param));
        }
        return Path.join.apply(Path, args);
      };
      helpers.wrapScope = function(url) {
        var args;
        url = Path.join(this.scope, url);
        args = Array.create(arguments).slice(1);
        return this.url.apply(this, Array.create(url, args));
      };
      return this.helpers(helpers);
    };
  });

}).call(this);(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("neo-sammy/history-location-proxy", [], function() {
    var HistoryLocationProxy;
    return HistoryLocationProxy = (function(_super) {
      __extends(HistoryLocationProxy, _super);

      function HistoryLocationProxy(app, run_interval_every) {
        var old;
        HistoryLocationProxy.__super__.constructor.call(this, app, run_interval_every);
        old = app.setLocation;
        app.setLocation = function(newLocation, state, title) {
          return this._location_proxy.setLocation(newLocation, state, title);
        };
        app.setLocation.restore = function() {
          return app.setLocation = old;
        };
      }

      HistoryLocationProxy.prototype.setLocation = function(newLocation, state, title) {
        if (state == null) {
          state = {};
        }
        if (title == null) {
          title = null;
        }
        if (/^([^#\/]|$)/.test(newLocation)) {
          if (this.has_history && !this.app.disable_push_state) {
            newLocation = '/' + newLocation;
          } else {
            newLocation = '#!/' + newLocation;
          }
        }
        if (newLocation !== this.getLocation()) {
          if (this.has_history && !this.app.disable_push_state && /^\//.test(newLocation)) {
            state.path = newLocation;
            if (title == null) {
              title = window.title;
            }
            history.pushState(state, title, newLocation);
            return this.app.trigger('location-changed');
          } else {
            return (window.location = newLocation);
          }
        }
      };

      return HistoryLocationProxy;

    })(Sammy.DefaultLocationProxy);
  });

}).call(this);(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("neo-sammy/neo-event-context", ["sammy"], function(Sammy) {
    var NeoEventContext;
    return NeoEventContext = (function(_super) {
      __extends(NeoEventContext, _super);

      function NeoEventContext(app, verb, path, params, target, scope) {
        Sammy.EventContext.call(this, app, verb, path, params, target);
        this.scope = scope;
      }

      return NeoEventContext;

    })(Sammy.EventContext);
  });

}).call(this);(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("neo-sammy/neo-sammy", ["sammy", "neo-sammy/history-location-proxy", "neo-sammy/neo-event-context", "neo-sammy/helper"], function(Sammy, HistoryLocationProxy, NeoEventContext, Helper) {
    var NeoSammy;
    return NeoSammy = (function(_super) {
      var PATH_NAME_MATCHER, PATH_REPLACER, PATH_WILD_CARD_MATCHER, PATH_WILD_CARD_REPLACER, QUERY_STRING_MATCHER, _decode;

      __extends(NeoSammy, _super);

      PATH_REPLACER = "([^\/]+)";

      PATH_NAME_MATCHER = /:([\w\d]+)/g;

      PATH_WILD_CARD_REPLACER = "($|\/.*)";

      PATH_WILD_CARD_MATCHER = /([/\*]+)/g;

      QUERY_STRING_MATCHER = /\?([^#]*)?$/;

      _decode = function(str) {
        return decodeURIComponent((str || '').replace(/\+/g, ' '));
      };

      function NeoSammy() {
        Sammy.Application.apply(this, arguments);
        this.context_prototype = function() {
          return NeoEventContext.apply(this, arguments);
        };
        this.context_prototype.prototype = new NeoEventContext();
        this.setLocationProxy(new HistoryLocationProxy(this));
        this.use(Helper);
        this.scopes = [];
      }

      NeoSammy.prototype.scope = function() {
        if (arguments.length === 1) {
          arguments[0].apply(this);
        }
        if (arguments.length === 2) {
          this.scopes.push(arguments[0].strip("/"));
          arguments[1].apply(this);
          return this.scopes.pop();
        }
      };

      NeoSammy.prototype.path = function(path) {
        path = Array.create(this.scopes, path.strip("/")).join("/");
        if (!path.startsWith("^")) {
          path = "/" + path;
        }
        return path = path.stripRight("/");
      };

      NeoSammy.prototype.printRoutes = function() {
        var route, routes, verb, _ref, _results;
        _ref = this.sammy.routes;
        _results = [];
        for (verb in _ref) {
          routes = _ref[verb];
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = routes.length; _i < _len; _i++) {
              route = routes[_i];
              _results1.push(console.log("" + route.verb + ": " + route.path + ", [" + route.param_names + "]"));
            }
            return _results1;
          })());
        }
        return _results;
      };

      NeoSammy.prototype.before = function(options, callback) {
        var path;
        if (Object.isFunction(options)) {
          callback = options;
          options = {};
        }
        if (Object.isString(options)) {
          options = {
            path: this.path(options)
          };
        }
        if (options.path != null) {
          path = options.path;
          path = path.replace(PATH_NAME_MATCHER, PATH_REPLACER);
          path = path.replace(PATH_WILD_CARD_MATCHER, PATH_WILD_CARD_REPLACER);
          path = new RegExp(path + "$");
          options.path = path;
        }
        return NeoSammy.__super__.before.call(this, options, callback);
      };

      NeoSammy.prototype.destroy = function() {
        this.unload();
        return this;
      };

      NeoSammy.prototype.route = function(verb, path) {
        var add_route, callback, param_names, path_match, scope;
        param_names = [];
        callback = Array.prototype.slice.call(arguments, 2);
        if (callback.length === 0 && _isFunction(path)) {
          callback = [path];
          path = verb;
          verb = 'any';
        }
        scope = this.path("");
        path = this.path(path);
        console.log("path: " + verb + ": " + path);
        verb = verb.toLowerCase();
        if (path.constructor === String) {
          PATH_NAME_MATCHER.lastIndex = 0;
          while ((path_match = PATH_NAME_MATCHER.exec(path)) !== null) {
            param_names.push(path_match[1]);
          }
          path = new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
        }
        $.each(callback, function(i, cb) {
          if (typeof cb === 'string') {
            return callback[i] = this[cb];
          }
        });
        add_route = (function(_this) {
          return function(with_verb) {
            var r, _base;
            r = {
              verb: with_verb,
              path: path,
              scope: scope,
              callback: callback,
              param_names: param_names
            };
            if ((_base = _this.routes)[with_verb] == null) {
              _base[with_verb] = [];
            }
            return _this.routes[with_verb].push(r);
          };
        })(this);
        if (verb === 'any') {
          $.each(this.ROUTE_VERBS, function(i, v) {
            return add_route(v);
          });
        } else {
          add_route(verb);
        }
        return this;
      };

      NeoSammy.prototype.runRoute = function(verb, path, params, target) {
        var app, arounds, befores, callback_args, context, e, final_returned, path_params, route, wrapped_route;
        app = this;
        route = this.lookupRoute(verb, path);
        if (this.debug) {
          this.log("runRoute", [verb, path].join(" "));
        }
        this.trigger("run-route", {
          verb: verb,
          path: path,
          params: params
        });
        if (params == null) {
          params = {};
        }
        $.extend(params, this._parseQueryString(path));
        if (route) {
          this.trigger("route-found", {
            route: route
          });
          if ((path_params = route.path.exec(this.routablePath(path))) !== null) {
            path_params.shift();
            $.each(path_params, function(i, param) {
              if (route.param_names[i]) {
                params[route.param_names[i]] = _decode(param);
              } else {
                if (!params.splat) {
                  params.splat = [];
                }
                params.splat.push(_decode(param));
              }
            });
          }
          context = new this.context_prototype(this, verb, path, params, target, route.scope);
          arounds = this.arounds.slice(0);
          befores = this.befores.slice(0);
          callback_args = [context];
          if (params.splat) {
            callback_args = callback_args.concat(params.splat);
          }
          wrapped_route = function() {
            var before, i, nextRoute, returned;
            returned = void 0;
            i = void 0;
            nextRoute = void 0;
            while (befores.length > 0) {
              before = befores.shift();
              if (app.contextMatchesOptions(context, before[0])) {
                returned = before[1].apply(context, [context]);
                if (returned === false) {
                  return false;
                }
              }
            }
            app.last_route = route;
            context.trigger("event-context-before", {
              context: context
            });
            if (typeof route.callback === "function") {
              route.callback = [route.callback];
            }
            if (route.callback && route.callback.length) {
              i = -1;
              nextRoute = function() {
                i++;
                if (route.callback[i]) {
                  returned = route.callback[i].apply(context, callback_args);
                } else {
                  if (app._onComplete && typeof (app._onComplete === "function")) {
                    app._onComplete(context);
                  }
                }
              };
              callback_args.push(nextRoute);
              nextRoute();
            }
            context.trigger("event-context-after", {
              context: context
            });
            return returned;
          };
          $.each(arounds.reverse(), function(i, around) {
            var last_wrapped_route;
            last_wrapped_route = wrapped_route;
            wrapped_route = function() {
              return around.apply(context, [last_wrapped_route]);
            };
          });
          final_returned = void 0;
          try {
            final_returned = wrapped_route();
          } catch (_error) {
            e = _error;
            this.error(["500 Error", verb, path].join(" "), e);
          }
          return final_returned;
        } else {
          return this.notFound(verb, path);
        }
      };

      return NeoSammy;

    })(Sammy.Application);
  });

}).call(this);(function() {
  define("neo-sammy", ["neo-sammy/neo-sammy"], function(NeoSammy) {
    return NeoSammy;
  });

}).call(this);(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define("source-template-engine/source-template-engine", ["knockout", "source-template-engine/template-source"], function(ko, TemplateSource) {
    var SourceTemplateEngine;
    return SourceTemplateEngine = (function(_super) {
      __extends(SourceTemplateEngine, _super);

      function SourceTemplateEngine(templateSources) {
        if (templateSources == null) {
          templateSources = {};
        }
        this.templateSources = templateSources;
        this.templates = {};
        this.allowTemplateRewriting = false;
      }

      SourceTemplateEngine.prototype.makeTemplateSource = function(template, bindingContext, options) {
        var elem, _base;
        if (typeof template === "string") {
          elem = document.getElementById(template);
          if (elem) {
            return new ko.templateSources.domElement(elem);
          } else {
            if (!Object.has(this.templateSources, template)) {
              throw new Error("" + template + " template is not found.");
            }
            if ((_base = this.templates)[template] == null) {
              _base[template] = new TemplateSource(template, this.templateSources[template]);
            }
            return this.templates[template];
          }
        } else if (template.nodeType === 1 || template.nodeType === 8) {
          return new ko.templateSources.anonymousTemplate(template);
        }
      };

      SourceTemplateEngine.prototype.renderTemplate = function(template, bindingContext, options) {
        var templateSource;
        templateSource = this.makeTemplateSource(template, bindingContext, options);
        return this.renderTemplateSource(templateSource, bindingContext, options);
      };

      return SourceTemplateEngine;

    })(ko.nativeTemplateEngine);
  });

}).call(this);(function() {
  define("source-template-engine/template-source", [], function() {
    var TemplateSource;
    return TemplateSource = (function() {
      function TemplateSource(templateId, template) {
        this.templateId = templateId;
        this.template = Object.isFunction(template) ? template() : template;
        this.data = {};
      }

      TemplateSource.prototype.value = function(key, value) {
        return this.data[key];
      };

      TemplateSource.prototype.data = function(key, value) {
        if (arguments.length === 1) {
          return this.data[key];
        } else {
          return this.data[key] = value;
        }
      };

      TemplateSource.prototype.text = function(value) {
        if (arguments.length === 0) {
          return this.template;
        } else {
          return this.template = value;
        }
      };

      TemplateSource.prototype.getTemplate = function() {
        return this.template;
      };

      return TemplateSource;

    })();
  });

}).call(this);(function() {
  define("source-template-engine", ["source-template-engine/source-template-engine"], function(SourceTemplateEngine) {
    return SourceTemplateEngine;
  });

}).call(this);(function() {
  define("knockout-sammy", ["knockout-sammy/knockout-sammy"], function(KnockoutSammy) {
    return KnockoutSammy;
  });

}).call(this);
/*# sourceMappingURL=knockout-sammy.js.map */