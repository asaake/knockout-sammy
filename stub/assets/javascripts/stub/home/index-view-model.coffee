define "stub/home/index-view-model", [

], (

) ->
  class IndexViewModel

    template: "stub/home/index"

    constructor: (@req) ->
      @name = ""
      ko.track(@, ["name"])

    clickHello: () ->
      @req.setLocation(@req.wrapScope("hello", @name))