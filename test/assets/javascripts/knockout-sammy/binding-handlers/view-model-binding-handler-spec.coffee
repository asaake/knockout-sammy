require [
  "knockout-sammy/binding-handlers/view-model-binding-handler"
], (
  ViewModelBindingHanlder
) ->

  describe "ViewModelBindingHanlder", () ->

    before () ->
      ViewModelBindingHanlder.create()

    after () ->
      ViewModelBindingHanlder.clear()

    beforeEach () ->
      $("#mock").html("")
      @name = "person-template"
      @tmpl = """
        <script type="text/html" id="person-template">
            <h3 id="name" data-bind="text: name"></h3>
            <div data-bind="foreach: details">
              <p id="details.name" data-bind="text: $model.name"></p>
            </div>
        </script>
        <div id="context">
          <div id="contents" data-bind="template: {model: contents}"></div>
        </div>
      """

    it "templateにmodel属性を指定して、テンプレートを描画できること", () ->
      $("#mock").html(@tmpl)
      contextViewModel = {
        contents: {
          template: => @name
          name: "mock"
          details: []
        }
      }
      ko.applyBindings(contextViewModel, $("#context")[0])

      expect($("#name").text()).to.eql("mock")

    it "model属性で指定したオブジェクトが$modelの変数として使用できること", () ->
      $("#mock").html(@tmpl)
      viewModel = {
        template: => @name
        name: "mock"
        details: [1]
      }
      contextViewModel = {
        contents: viewModel
      }
      ko.applyBindings(contextViewModel, $("#context")[0])
      expect($("#details\\.name").text()).to.eql("mock")

