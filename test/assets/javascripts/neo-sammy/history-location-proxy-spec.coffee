require [
  "neo-sammy/history-location-proxy"
], (
  HistoryLocationProxy
) ->
  describe "HistoryLocationProxy", () ->

    beforeEach () ->
      @href = window.location.href
      @app = Sammy () ->
        @setLocationProxy(new HistoryLocationProxy(@))
        @get "/", (req) -> undefined

    afterEach () ->
      @app.destroy()
      history.pushState("", "", @href)

    it "stateの受け渡しができる", (done) ->

      @app.get "/welcome/:name", (req) ->
        expect(history.state.path).to.eql("/welcome/me")
        expect(history.state.param).to.eql("value")
        done()

      @app.run("/")
      @app.setLocation("/welcome/me", {param: "value"})

    it "restoreで元のsetLocationに戻すとstateの受け渡しができなくなる", (done) ->
      @app.get "/restore/:name", (req) ->
        expect(history.state.path).to.eql("/restore/me")
        expect(history.state).to.not.have.property("param")
        done()

      @app.run("/")
      @app.setLocation.restore()
      @app.setLocation("/restore/me", {param: "value"})



