#= require stub/app
#= require stub/routes
require [
  "stub/app"
  "stub/routes"
], (
  app
) ->
  path = "#{location.pathname}#{location.search}"
  $(() -> app.run(path))