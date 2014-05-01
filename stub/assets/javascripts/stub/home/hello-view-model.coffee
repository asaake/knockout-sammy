define "stub/home/hello-view-model", [
], (
) ->
  class HelloViewModel

    template: () -> "stub/home/hello"

    constructor: (@req) ->
      @name = @req.params.name
      ko.track(@, ["name"])

    clickBye: () ->
      @req.setLocation(@req.wrapScope("bye", @name))