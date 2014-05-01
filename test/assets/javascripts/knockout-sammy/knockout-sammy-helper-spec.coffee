require [
  "knockout-sammy"
], (
  KnockoutSammy
) ->
  describe "KnockoutSammyHelper", () ->

    beforeEach () ->
      @app = new KnockoutSammy({
        contextId: "context"
        contextViewModel: {key: "value"}
      })

    afterEach () ->
      @app = undefined

    it "contextにアクセスできる", (done) ->
      @app.get "/context", () ->
        expect(@context).to.eql(@app.context)
        done()

      @app.runRoute("get", "/context")

    it "appの関数をそのままコピーしたヘルパーでappの関数にアクセスできる", (done) ->
      @app.get "/context", () ->
        mock = sinon.mock(@app)
        spyLog = mock.expects("log")
        spyTrigger = mock.expects("trigger")

        @log("log test")
        expect(spyLog.called).to.eql(true)
        expect(spyLog.args[0][0]).to.eql("log test")

        @trigger("trigger test")
        expect(spyTrigger.called).to.eql(true)
        expect(spyTrigger.args[0][0]).to.eql("trigger test")

        mock.restore()
        done()

      @app.runRoute("get", "/context")

