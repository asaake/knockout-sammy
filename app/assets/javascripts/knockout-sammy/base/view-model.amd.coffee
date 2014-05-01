define [

], (

) ->
  class ViewModel

    @mixin: (clazz) ->
      clazz[name] = func for name, func of @
      clazz.prototype[name] = func for name, func of @prototype
      return

    template: () ->
      throw new Error("not override template function.")

    validate: () ->

    clear: () ->

    refresh: () ->
