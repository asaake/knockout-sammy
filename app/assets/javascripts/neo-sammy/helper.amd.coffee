define [
  "common/path"
], (
  Path
) ->
  (app) ->

    helpers = {}

    names = [
      "$element"
      "path"
      "log"
      "refresh"
      "trigger"
      "lookupRoute"
      "runRoute"
      "getLocation"
      "setLocation"
      "notFound"
      "error"
    ]
    for name in names
      do (name) ->
        helpers[name] = () ->
          app[name].apply(app, arguments)

    helpers.url = (url) ->
      params = Array.create(arguments).slice(1)
      args = [url]
      for param in params
        args.push(encodeURIComponent(param))
      return Path.join.apply(Path, args)

    helpers.wrapScope = (url) ->
      url = Path.join(@scope, url)
      args = Array.create(arguments).slice(1)
      return @url.apply(@, Array.create(url, args))

    @helpers(helpers)
