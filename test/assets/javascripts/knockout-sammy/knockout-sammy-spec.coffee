#= require stub/app
require [
  "knockout"
  "source-template-engine"
  "stub/app"
  "stub/routes"
], (
  ko
  SourceTemplateEngine
  app
) ->
  describe "KnockoutSammy", () ->

    before () ->
      # koのエンジンが上書きされている可能性があるので登録しなおし
      ko.setTemplateEngine(new SourceTemplateEngine(JST))

    beforeEach () ->
      @href = window.location.href
      $("#mock").html("")

    afterEach () ->
      app.destroy()
      history.pushState("", "", @href)

    it "Homeにアクセスできる", (done) ->
      $("#mock").html("""
        <div id="context">
          <div id="contents" data-bind="template: {name: contents.template, data: contents}"></div>
        </div>
      """)
      app.run("/stub/home/hello/me")
      (() ->
        expect($("#word").text()).to.eql("Hello, me !!")
        done()
      ).delay(5)

  