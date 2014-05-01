require [
  "neo-sammy"
], (
  NeoSammy
) ->

  describe "NeoSammy", () ->

    beforeEach () ->
      @href = window.location.href
      @app = new NeoSammy()

    afterEach () ->
      @app.destroy()
      history.pushState("", "", @href)

    it "Sammyの関数がコピーされている", (done) ->
      @app.get "/welcome/:name", (req) ->
        expect(req.params.name).to.eql("me")
        done()

      @app.run("/welcome/me")

    it "scope関数を使用してルートを設定できる", (done) ->
      @app.scope () ->
        @get "/welcome/:name", (req) ->
          expect(req.params.name).to.eql("me")
          done()
      @app.run("/welcome/me")

    it "scope関数のネスト機能を使用してルートを設定できる", (done) ->
      calledLength = 5
      called = []
      isDone = (req) ->
        called.push(req)
        if called.length == calledLength
          done()
      @app.scope "/welcome", () ->
        @scope "/nest1", () ->
          @get "/nest11/:name", (req) ->
            expect(req.params.name).to.eql("me11")
            isDone(req)

          @get "/nest12/:name", (req) ->
            expect(req.params.name).to.eql("me12")
            isDone(req)

          @scope "/nest13/nest131", () ->
            @get "/nest1311/:name", (req) ->
              expect(req.params.name).to.eql("me1311")
              isDone(req)

        @get "/nest1/nest14/:name", (req) ->
          expect(req.params.name).to.eql("me14")
          isDone(req)

        @get "/nest2/:name", (req) ->
          expect(req.params.name).to.eql("me2")
          isDone(req)

      @app.run("/welcome/nest1/nest11/me11")
      @app.setLocation("/welcome/nest1/nest12/me12")
      @app.setLocation("/welcome/nest1/nest14/me14")
      @app.setLocation("/welcome/nest1/nest13/nest131/nest1311/me1311")
      @app.setLocation("/welcome/nest2/me2")
