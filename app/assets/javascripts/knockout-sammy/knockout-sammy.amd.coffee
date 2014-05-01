define [
  "knockout"
  "neo-sammy"
  "knockout-sammy/helper"
], (
  ko
  NeoSammy
  Helper
) ->
  class KnockoutSammy extends NeoSammy

    constructor: (config) ->
      super()

      if not(config?) then throw new Error("config is required.")
      if not(config.contextId?) then throw new Error("config.contextId is required.")
      if not(config.contextViewModel?) then throw new Error("config.contextViewModel is required.")

      @config = config
      @contextId = @config.contextId
      @context = @config.contextViewModel
      @use Helper

    run: (path) ->
      super(path)
      @contextElement = $(@contextId)[0]
      if not(@contextElement?)
        throw new Error("#{@contextId} element not found.")
      ko.applyBindings(@context, @contextElement)

    destroy: () ->
      if @contextElement?
        ko.cleanNode(@contextElement)
        @contextElement = null
      super()

    refreshContext: () ->
      if @contextElement?
        ko.cleanNode(@contextElement)
        ko.applyBindings(@context, @contextElement)

