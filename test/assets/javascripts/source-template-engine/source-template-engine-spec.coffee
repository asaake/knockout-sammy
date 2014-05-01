require [
  "source-template-engine"
], (
  SourceTemplateEngine
) ->
  describe "SourceTemplateEngine", (done) ->

    it "afterRenderが呼ばれ、対象のテンプレートが書き込まれたことを確認する", () ->
      $("#mock").html("""
        <div id="context" data-bind="template: {name: 'test-template1', afterRender: afterRender}"></div>
      """)

      viewModel = {
        afterRender: () ->
          undefined
      }
      spy = sinon.spy(viewModel, "afterRender")

      sources = {
        "test-template1": """
          <div id="test-template1" data-bind="template: {name: 'test-template2'}"></div>
        """
        "test-template2": """
          <div id="test-template2"></div>
        """
      }

      ko.setTemplateEngine(new SourceTemplateEngine(sources))
      ko.applyBindings(viewModel, $("#context")[0])

      expect(spy.called).to.eql(true)
      expect($("#test-template1")[0]?).to.eql(true)
      expect($("#test-template2")[0]?).to.eql(true)

