define [
  "knockout"
], (
  ko
) ->
  template = ko.bindingHandlers.template
  {
    create: () ->
      validate = (context) ->
        if typeof context != "object" then throw new Error("model type is object.")

      setup = (element, valueAccessor, allBindings, viewModel, bindingContext) ->
        data = valueAccessor()
        if data.model?
          validate(data.model)
          data.data = data.model
          if Object.isString(data.model.template)
            data.name = data.model.template
          else
            data.name = data.model.template()

          valueAccessor = () -> data
          bindingContext.$model = data.model
          delete data.model

        [element, valueAccessor, allBindings, viewModel, bindingContext]

      ko.bindingHandlers.template = {

        init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
          params = setup(element, valueAccessor, allBindings, viewModel, bindingContext)
          template.init.apply(@, params)

        update: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
          params = setup(element, valueAccessor, allBindings, viewModel, bindingContext)
          template.update.apply(@, params)

      }

    clear: () ->
      ko.bindingHandlers.template = template
  }