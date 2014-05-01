#= require knockout-sammy
#= require stub/routes
#= require_tree ./common
#= require_tree ./home
#= require_tree ../../templates/stub

define "stub/app", [
  "knockout"
  "knockout-sammy"
  "source-template-engine"
  "stub/common/context-view-model"
  "stub/common/http-404-view-model"
  "stub/common/http-500-view-model"
], (
  ko
  KnockoutSammy
  SourceTemplateEngine
  ContextViewModel
  Http404ViewModel
  Http500ViewModel
) ->

  config = {
    contextId: "#context"
    contextViewModel: new ContextViewModel()
  }
  app = new KnockoutSammy(config)
  app.notFound = (verb, path) ->
    @context.contents = new Http404ViewModel(verb, path)

  app.error = (msg, error) ->
    console.error(error.stack)
    @context.contents = new Http500ViewModel(error.message)

  ko.setTemplateEngine(new SourceTemplateEngine(JST))

  return app