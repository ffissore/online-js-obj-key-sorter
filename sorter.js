"use strict";

var INDENTATION = 2;

$("#sort").click(function () {
  var $jsoutput = $("#jsoutput");
  var $coffeeoutput = $("#coffeeoutput");

  $jsoutput.val("");
  $coffeeoutput.val("");
  try {
    var source = $("#source").val();
    var object = eval(CoffeeScript.compile(source, {bare: true}));
    var newObject = sort(object);
    var js = objToJSSource(newObject, INDENTATION);
    var coffee = jsSourceToCoffee(js);
    $jsoutput.val(js);
    $coffeeoutput.val(coffee);
  } catch (e) {
    $jsoutput.val(e);
  }
});

function objToJSSource(s, spaces) {
  return jsFriendlyJSONStringify(JSON.stringify(s, null, spaces)).replace(/\"([^(\")"]+)\":/g, "$1:");
}

function jsFriendlyJSONStringify(str) {
  return str.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function jsSourceToCoffee(source) {
  return removeCurlyBraces(source)
      .split("\n")
      .filter(nonEmptyLines)
      .map(removeFirstSpaces(INDENTATION))
      .map(removeTrailingCommas)
      .join("\n");
}

function nonEmptyLines(line) {
  return line.trim() != "";
}

function removeFirstSpaces(spaces) {
  return function (line) {
    return line.substring(spaces);
  }
}

function removeTrailingCommas(line) {
  return line.replace(/,$/, "");
}

function removeCurlyBraces(str) {
  return str
      .replace(/ \{/g, "")
      .replace(/\},/g, "")
      .replace(/\{/g, "")
      .replace(/\}/g, "");
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