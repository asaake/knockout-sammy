define "stub/home/home-route", [
  "stub/app"
  "stub/home/index-view-model"
  "stub/home/hello-view-model"
  "stub/home/bye-view-model"
], (
  app
  IndexViewModel
  HelloViewModel
  ByeViewModel
) ->
  app.get "/stub/index.html", (req) ->
    app.runRoute("get", "/home/index")

  app.scope "/stub/home", () ->

    @get "/index", (req) ->
      viewModel = new IndexViewModel(req)
      @context.contents = viewModel

    @get "/hello/:name", (req) ->
      viewModel = new HelloViewModel(req)
      @context.contents = viewModel

    @get "/bye/:name", (req) ->
      viewModel = new ByeViewModel(req)
      @context.contents = viewModel

    @get "/error", (req) ->
      throw new Error("my error.")
