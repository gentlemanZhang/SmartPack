/* @grunt-build */
define(function(require, exports, module){
  var dialog = require('./js/dialog-plus');
  require('./css/ui-dialog.css');
  $.dialog = dialog;
  return dialog;
});
