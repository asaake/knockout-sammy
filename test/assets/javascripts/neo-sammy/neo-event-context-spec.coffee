require [
  "neo-sammy"
], (
  NeoSammy
) ->
  describe "NeoEventContext", () ->

    beforeEach () ->
      @app = new NeoSammy()

    afterEach () ->
      @app = undefined

    it "scopeなしでreqからscopeにアクセスできる", (done) ->
      @app.get "/context", (req) ->
        expect(req).to.have.property("scope", "")
        done()

      @app.runRoute("get", "/context")

    it "scopeをnestに設定して、reqからscopeにアクセスできる", (done) ->
      @app.scope "/nest", () ->
        @get "/context", (req) ->
          expect(req).to.have.property("scope", "/nest")
          done()

      @app.runRoute("get", "/nest/context")

