define [
], (
) ->
  class TemplateSource

    constructor: (templateId, template) ->
      @templateId = templateId
      @template = if Object.isFunction(template) then template() else template
      @data = {}

    value: (key, value) ->
      @data[key]

    data: (key, value) ->
      if arguments.length == 1
        return @data[key]
      else
        @data[key] = value

    text: (value) ->
      if arguments.length == 0
        return @template
      else
        @template = value

    getTemplate: () ->
      @template
