define [
], (

) ->
  (app) ->

    helpers = {
      context: app.context
    }

    names = [
      "refreshContext"
    ]
    for name in names
      do (name) ->
        helpers[name] = () ->
          app[name].apply(app, arguments)

    @helpers(helpers)