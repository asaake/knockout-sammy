#= require console-polyfill/index.js
#= require sugar/release/sugar-full.development.js
#= require require-mini/dest/require-mini.js
#= require jquery/dist/jquery.js
#= require bootstrap/dist/js/bootstrap.js
#= require sammy/lib/sammy.js
#= require javascript-relational/dest/relational-model.js
#= require knockoutjs/build/output/knockout-latest.debug.js
#= require knockout-es5/dist/knockout-es5.js
#= require knockout-relational/dest/knockout-es5-relational-model-plugin.js
#= require knockout-validation/Dist/knockout.validation.js
#= require x18n/lib/x18n.js

define "knockout", -> ko
define "sammy", -> Sammy
define "jQuery", -> jQuery

