define [
  "sammy"
], (
  Sammy
) ->
  class NeoEventContext extends Sammy.EventContext

    constructor: (app, verb, path, params, target, scope) ->
      Sammy.EventContext.call(@, app, verb, path, params, target)
      @scope = scope