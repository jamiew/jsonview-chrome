/*
 * ViewJSON
 * Version 1.0
 * by Jamie Dubs, Jan 2010 -- jamiedubs.com | @jamiew | github.com/jamiew
 * A ghetto Chrome extension to display JSON in a user-friendly format
 * based on JSONView for Firefox
 * on XMLTree by Moonty [link here]
*/

// FIXME not apparent how to reference local files a la FF's chrome:// urls
// storing css & js remotely in interim
var chrome_url_prefix = 'http://jamiedubs.com/jsonview';

// ghetto detect if this is JSON
// google chrome where dat MIMETYPE at!
var text = document.body.innerHTML;

var is_json = /^\s*(\{.*\})\s*$/.test(text);
var jsonp_regex = /^.*\(\s*(\{.*\})\s*\)$/;  // we use both of these vars l8r
var is_jsonp = jsonp_regex.test(text);

if(is_json || is_jsonp){

  if(is_jsonp){ console.log("yep its jsonP..."); text = text.match(jsonp_regex)[1]; }
  console.log(text);
  var json = JSON.parse(text);
   
   console.log("this appears to be JSON");

  // JSONFormatter json->HTML class ripped from firefox JSONView
  //TODO: include url, license authorship info
  function JSONFormatter() {
    // var src = 'chrome://jsonview/locale/jsonview.properties';
    // var localeService = Cc["@mozilla.org/intl/nslocaleservice;1"].getService(Ci.nsILocaleService);
    // 
    // var appLocale = localeService.getApplicationLocale();
    // var stringBundleService = Cc["@mozilla.org/intl/stringbundle;1"].getService(Ci.nsIStringBundleService);
    // this.stringbundle = stringBundleService.createBundle(src, appLocale);
    var lol = "wat";
    console.log("JSONFormattering");
  }
  JSONFormatter.prototype = {
    htmlEncode: function (t) {
      return t != null ? t.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;") : '';
    },

    decorateWithSpan: function (value, className) {
      return '<span class="' + className + '">' + this.htmlEncode(value) + '</span>';
    },

    // Convert a basic JSON datatype (number, string, boolean, null, object, array) into an HTML fragment.
    valueToHTML: function(value) {
      var valueType = typeof value;

      var output = "";
      if (value == null) {
        output += this.decorateWithSpan('null', 'null');
      }
      else if (value && value.constructor == Array) {
        output += this.arrayToHTML(value);
      }
      else if (valueType == 'object') {
        output += this.objectToHTML(value);
      } 
      else if (valueType == 'number') {
        output += this.decorateWithSpan(value, 'num');
      }
      else if (valueType == 'string') {
        if (/^(http|https):\/\/[^\s]+$/.test(value)) {
          output += '<a href="' + value + '">' + this.htmlEncode(value) + '</a>';
        } else {
          output += this.decorateWithSpan('"' + value + '"', 'string');
        }
      }
      else if (valueType == 'boolean') {
        output += this.decorateWithSpan(value, 'bool');
      }

      return output;
    },

    // Convert an array into an HTML fragment
    arrayToHTML: function(json) {
      var output = '[<ul class="array collapsible">';
      var hasContents = false;
      for ( var prop in json ) {
        hasContents = true;
        output += '<li>';
        output += this.valueToHTML(json[prop]);
        output += '</li>';
      }
      output += '</ul>]';

      if ( ! hasContents ) {
        output = "[ ]";
      }

      return output;
    },

    // Convert a JSON object to an HTML fragment
    objectToHTML: function(json) {
      var output = '{<ul class="obj collapsible">';
      var hasContents = false;
      for ( var prop in json ) {
        hasContents = true;
        output += '<li>';
        output += '<span class="prop">' + this.htmlEncode(prop) + '</span>: '
        output += this.valueToHTML(json[prop]);
        output += '</li>';
      }
      output += '</ul>}';

      if ( ! hasContents ) {
        output = "{ }";
      }

      return output;
    },

    // Convert a whole JSON object into a formatted HTML document.
    jsonToHTML: function(json, callback, uri) {
      var output = '';
      if( callback ){
        output += '<div class="callback">' + callback + ' (</div>';
        output += '<div id="json">';
      }else{
        output += '<div id="json">';
      }
      output += this.valueToHTML(json);
      output += '</div>';
      if( callback ){
        output += '<div class="callback">)</div>';
      }
      return this.toHTML(output, uri);
    },

    // Produce an error document for when parsing fails.
    errorPage: function(error, data, uri) {
      var output = '<div id="error">' + this.stringbundle.GetStringFromName('errorParsing') + '</div>';
      output += '<h1>' + this.stringbundle.GetStringFromName('docContents') + ':</h1>';
      output += '<div id="json">' + this.htmlEncode(data) + '</div>';
      return this.toHTML(output, uri + ' - Error');
    },

    // Wrap the HTML fragment in a full document. Used by jsonToHTML and errorPage.
    toHTML: function(content, title) {
      return '<doctype html>' + 
        '<html><head><title>' + title + '</title>' +
        '<link rel="stylesheet" type="text/css" href="'+chrome_url_prefix+'/default.css">' + 
        '<script type="text/javascript" src="'+chrome_url_prefix+'/default.js"></script>' + 
        '</head><body>' +
        content + 
        '</body></html>';
    }
  };


  // process it
  var jsonFormatter = new JSONFormatter();
  var converted = jsonFormatter.jsonToHTML(json);
  // var converted = jsonFormatter.toHTML(text, "LOL A TITLE");  
  var links = '<link rel="stylesheet" type="text/css" href="http://localhost/jsonview/default.css">' + 
  '<script type="text/javascript" src="http://localhost/jsonview/default.js"></script>';
  document.body.innerHTML = links+" <div id='lol'>"+converted+"</div>";
  
}

// var foo = new XMLSerializer();
// var theDocStr = foo.serializeToString(document);
// if( theDocStr.indexOf('<?xml-stylesheet') + 1 || ( protectHTMLNS && ( theDocStr.indexOf('<html:') + 1 || theDocStr.indexOf('<xhtml:') + 1 ) ) ) { return; }
// if( theDocStr.indexOf('<'+parseerrorNode) + 1 ){
//   alert(errornotification);
// }
// tree.create();
