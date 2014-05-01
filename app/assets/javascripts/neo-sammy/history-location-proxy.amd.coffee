define [
], (
) ->
  class HistoryLocationProxy extends Sammy.DefaultLocationProxy

    constructor: (app, run_interval_every) ->
      super(app, run_interval_every)
      old = app.setLocation
      app.setLocation = (newLocation, state, title) ->
        @_location_proxy.setLocation(newLocation, state, title);
      app.setLocation.restore = () ->
        app.setLocation = old

    setLocation: (newLocation, state={}, title=null) ->
      if /^([^#\/]|$)/.test(newLocation)  # non-prefixed url
        if @has_history && !this.app.disable_push_state
          newLocation = '/' + newLocation;
        else
          newLocation = '#!/' + newLocation

      if newLocation != this.getLocation()
        # HTML5 History exists and newLocation is a full path
        if @has_history && !this.app.disable_push_state && /^\//.test(newLocation)
          state.path = newLocation
          title ?= window.title
          history.pushState(state, title, newLocation)
          this.app.trigger('location-changed');
        else
          return (window.location = newLocation)