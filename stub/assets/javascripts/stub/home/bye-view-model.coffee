define "stub/home/bye-view-model", [

], (

) ->
  class ByeViewModel

    template: () -> "stub/home/bye"

    constructor: (@req) ->
      @name = @req.params.name
      ko.track(@, ["name"])

    clickIndex: () ->
      @req.setLocation(@req.wrapScope("index"))