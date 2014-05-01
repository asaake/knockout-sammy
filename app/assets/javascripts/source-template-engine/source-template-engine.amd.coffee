define [
  "knockout"
  "source-template-engine/template-source"
] ,(
  ko
  TemplateSource
) ->
  class SourceTemplateEngine extends ko.nativeTemplateEngine

    constructor: (templateSources={}) ->
      @templateSources = templateSources
      @templates = {}
      @allowTemplateRewriting = false

    makeTemplateSource: (template, bindingContext, options) ->
      if typeof template == "string"
        elem = document.getElementById(template)
        if elem
          return new ko.templateSources.domElement(elem);
        else
          if not Object.has(@templateSources, template)
            throw new Error("#{template} template is not found.")

          @templates[template] ?= new TemplateSource(template, @templateSources[template])
          return @templates[template]
      else if template.nodeType == 1 || template.nodeType == 8
        # Anonymous template
        return new ko.templateSources.anonymousTemplate(template)

    renderTemplate: (template, bindingContext, options) ->
      templateSource = @makeTemplateSource(template, bindingContext, options)
      return @renderTemplateSource(templateSource, bindingContext, options)
