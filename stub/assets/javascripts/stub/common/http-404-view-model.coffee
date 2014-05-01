define "stub/common/http-404-view-model", [
], (
) ->
  class Http404ViewModel

    template: () -> "stub/common/http404"

    constructor: (@verb, @path) ->
      ko.track(@, ["verb", "path"])