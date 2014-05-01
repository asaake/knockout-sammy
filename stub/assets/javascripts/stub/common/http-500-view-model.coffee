define "stub/common/http-500-view-model", [
], (
) ->
  class Http500ViewModel

    template: () -> "stub/common/http500"

    constructor: (@msg) ->
      ko.track(@, ["msg"])