define [
  "sammy"
  "neo-sammy/history-location-proxy"
  "neo-sammy/neo-event-context"
  "neo-sammy/helper"
], (
  Sammy
  HistoryLocationProxy
  NeoEventContext
  Helper
) ->
  class NeoSammy extends Sammy.Application

    PATH_REPLACER = "([^\/]+)"
    PATH_NAME_MATCHER = /:([\w\d]+)/g
    PATH_WILD_CARD_REPLACER = "($|\/.*)"
    PATH_WILD_CARD_MATCHER = /([/\*]+)/g
    QUERY_STRING_MATCHER = /\?([^#]*)?$/
    _decode = (str) -> return decodeURIComponent((str || '').replace(/\+/g, ' '))

    constructor: () ->
      Sammy.Application.apply(@, arguments)
      @context_prototype = () -> NeoEventContext.apply(@, arguments)
      @context_prototype.prototype = new NeoEventContext()
      @setLocationProxy(new HistoryLocationProxy(@))
      @use(Helper)
      @scopes = []

    scope: () ->
      if arguments.length == 1
        arguments[0].apply(@)
      if arguments.length == 2
        @scopes.push(arguments[0].strip("/"))
        arguments[1].apply(@)
        @scopes.pop()

    path: (path) ->
      path = Array.create(@scopes, path.strip("/")).join("/")
      if !path.startsWith("^")
        path = "/" + path
      path = path.stripRight("/")

    printRoutes: () ->
      for verb, routes of @sammy.routes
        for route in routes
          console.log("#{route.verb}: #{route.path}, [#{route.param_names}]")

    before: (options, callback) ->
      if Object.isFunction(options)
        callback = options
        options = {}

      if Object.isString(options)
        options = {path: @path(options)}

      if options.path?
        path = options.path
        path = path.replace(PATH_NAME_MATCHER, PATH_REPLACER);
        path = path.replace(PATH_WILD_CARD_MATCHER, PATH_WILD_CARD_REPLACER);
        path = new RegExp(path + "$")
        options.path = path

      super(options, callback)

    destroy: () ->
      @unload()
      return @

    # patch scope function
    route: (verb, path) ->

      param_names = []
      callback = Array.prototype.slice.call(arguments, 2)

      # if the method signature is just (path, callback)
      # assume the verb is 'any'
      if callback.length == 0 && _isFunction(path)
        callback = [path]
        path = verb
        verb = 'any'

      # patch scope function
      scope = @path("")
      path = @path(path)
      console.log("path: #{verb}: #{path}")

      # ensure verb is lower case
      verb = verb.toLowerCase();

      # if path is a string turn it into a regex
      if path.constructor == String

        # Needs to be explicitly set because IE will maintain the index unless NULL is returned,
        # which means that with two consecutive routes that contain params, the second set of params will not be found and end up in splat instead of params
        # https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/RegExp/lastIndex
        PATH_NAME_MATCHER.lastIndex = 0

        # find the names
        while (path_match = PATH_NAME_MATCHER.exec(path)) != null
          param_names.push(path_match[1]);
        # replace with the path replacement
        path = new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");

      # lookup callbacks
      $.each callback, (i,cb) ->
        if typeof(cb) == 'string'
          callback[i] = @[cb]

      # patch scope function
      add_route = (with_verb) =>
        r = {verb: with_verb, path: path, scope: scope, callback: callback, param_names: param_names}
        # add route to routes array
        @routes[with_verb] ?=  []
        # place routes in order of definition
        @routes[with_verb].push(r)

      if verb == 'any'
        $.each(@ROUTE_VERBS, (i, v) -> add_route(v))
      else
        add_route(verb)

      # return the app
      return @

    # patch scope function
    runRoute: (verb, path, params, target) ->
      app = this
      route = @lookupRoute(verb, path)
      if @debug
        @log "runRoute", [
          verb
          path
        ].join(" ")
      @trigger "run-route", {verb: verb, path: path, params: params}

      params ?= {}
      $.extend(params, @_parseQueryString(path))
      if route
        @trigger "route-found", {route: route}

        # pull out the params from the path
        if (path_params = route.path.exec(@routablePath(path))) isnt null
          # first match is the full path
          path_params.shift()
          # for each of the matches
          $.each path_params, (i, param) ->
            # if theres a matching param name
            if route.param_names[i]
              # set the name to the match
              params[route.param_names[i]] = _decode(param)
            else
              # initialize 'splat'
              params.splat = []  unless params.splat
              params.splat.push _decode(param)
            return

        # patch scope function
        # set event context
        context = new @context_prototype(this, verb, path, params, target, route.scope)

        # ensure arrays
        arounds = @arounds.slice(0)
        befores = @befores.slice(0)

        # set the callback args to the context + contents of the splat
        callback_args = [context]
        callback_args = callback_args.concat(params.splat)  if params.splat

        # wrap the route up with the before filters
        wrapped_route = ->
          returned = undefined
          i = undefined
          nextRoute = undefined
          while befores.length > 0
            before = befores.shift()

            # check the options
            if app.contextMatchesOptions(context, before[0])
              returned = before[1].apply(context, [context])
              return false  if returned is false
          app.last_route = route
          context.trigger "event-context-before", {context: context}

          # run multiple callbacks
          route.callback = [route.callback]  if typeof (route.callback) is "function"
          if route.callback and route.callback.length
            i = -1
            nextRoute = ->
              i++
              if route.callback[i]
                returned = route.callback[i].apply(context, callback_args)
              else app._onComplete context  if app._onComplete and typeof (app._onComplete is "function")
              return

            callback_args.push nextRoute
            nextRoute()
          context.trigger "event-context-after", {context: context}
          returned

        $.each arounds.reverse(), (i, around) ->
          last_wrapped_route = wrapped_route
          wrapped_route = ->
            around.apply context, [last_wrapped_route]

          return

        final_returned = undefined
        try
          final_returned = wrapped_route()
        catch e
          @error [
            "500 Error"
            verb
            path
          ].join(" "), e
        final_returned
      else
        @notFound verb, path
