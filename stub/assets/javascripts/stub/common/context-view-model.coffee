define "stub/common/context-view-model",[
], (
) ->
  class ContextViewModel

    constructor: () ->
      @header = null
      @contents = null
      @footer = null
      ko.track(@, ["header", "contents", "footer"])
