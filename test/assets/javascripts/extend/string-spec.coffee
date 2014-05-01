describe "String", () ->

  it "stripLeft", () ->
    str = "/////ab/////"
    expect(str.stripLeft("/")).to.eql("ab/////")

  it "stripRight", () ->
    str = "/////ab/////"
    expect(str.stripRight("/")).to.eql("/////ab")

  it "strip", () ->
    str = "/////ab/////"
    expect(str.strip("/")).to.eql("ab")
