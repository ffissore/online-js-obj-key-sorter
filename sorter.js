"use strict";

var INDENTATION = 2;

$("#sort").click(function () {
  var $jsoutput = $("#jsoutput");
  var $coffeeoutput = $("#coffeeoutput");
  var $jsonoutput = $("#jsonoutput");

  $jsoutput.val("");
  $coffeeoutput.val("");
  $jsonoutput.val("");

  var source = $("#source").val();

  try {
    var object = eval(CoffeeScript.compile(source, {bare: true}));
    var newObject = sort(object);
    var js = objToJSSource(newObject, INDENTATION);
    var coffee = jsSourceToCoffee(js);
    $jsoutput.val(js);
    $coffeeoutput.val(coffee);
  } catch (e) {
    $jsoutput.val(e);
  }

  try {
    var json = JSON.parse(source);
    var newJSON = sort(json);
    $jsonoutput.val(JSON.stringify(newJSON, null, INDENTATION));
  } catch (e) {
    $jsonoutput.val(e);
  }
});

function objToJSSource(s, spaces) {
  return jsFriendlyJSONStringify(JSON.stringify(s, null, spaces)).replace(/\"([^(\")"]+)\":/g, "$1:");
}

function jsFriendlyJSONStringify(str) {
  return str.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function jsSourceToCoffee(source) {
  return js2coffee.build("a =" + source).code
      .replace("a =", "")
      .split("\n")
      .filter(nonEmptyLines)
      .map(removeFirstSpace)
      .map(removeFirstSpace)
      .join("\n");
}

function nonEmptyLines(line) {
  return line.trim() != "";
}

function removeFirstSpace(line) {
  return line.replace(/^ /, "");
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