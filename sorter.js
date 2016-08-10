"use strict";

$("#sort").click(function () {
  try {
    var source = $("#source").val();
    var object = eval(CoffeeScript.compile(source, {bare: true}));
    var newObject = sort(object);
    $("#output").val(jsFriendlyJSONStringify(newObject, 2));
  } catch (e) {
    $("#output").val(e);
  }
});

function jsFriendlyJSONStringify(s, spaces) {
  return JSON.stringify(s, null, spaces).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\"([^(\")"]+)\":/g, "$1:");
}

function sort(obj) {
  if (!_.isPlainObject(obj)) {
    return obj;
  }

  var newKeys = _.keys(obj).sort();
  var newObj = {};
  for (var i = 0; i < newKeys.length; i++) {
    var newKey = newKeys[i];
    newObj[newKey] = sort(obj[newKey]);
  }

  return newObj;
}