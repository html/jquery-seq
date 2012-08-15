function eachStep(collection, callback, endcallback){
  if(collection.length == 0){
    return endcallback && endcallback();
  }

  jQuery.when(callback(collection[0])).always(function(){
    eachStep(collection.slice(1), callback, endcallback);
  });
}

function sequentialExecute(collection, endcallback){
  if(collection.length == 0){
    return endcallback && endcallback();
  }

  jQuery.when(collection[0]()).always(function(){
    sequentialExecute(collection.slice(1), endcallback);
  });
}

function getGenerator(eachStepCallback){
  return function(collection, callback){
    return eachStep(collection, eachStepCallback, callback);
  }
}

var cache = [];

function cachingGetGenerator(eachStepCallback){
  var temporary = function(collection, endcallback){
    if(collection.length == 0){
      return endcallback && endcallback();
    }

    var script = collection[0];
    var func = temporary;
    var callback = function(){
      func(collection.slice(1), endcallback);
    };

    if(cache.indexOf(script) == -1){
      eachStepCallback(script, function(){
        cache.push(script);
        callback();
      });
    }else{
      callback();
    }
  }

  return temporary;
}

function withGetGenerator(allStuffCallback){
  return function withScripts(){
    var old$ = window.$;
    window.$ = jQuery;
    var scripts = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var endcallback = arguments[arguments.length - 1];

    allStuffCallback(scripts, function(){
      endcallback();
      window.$ = old$;
    });
  };
}

var loadImageCache = {}
function loadImage(imageSrc) {
  var deferred = jQuery.Deferred();
  if (typeof loadImageCache[imageSrc] === "undefined") {

    preloader         = new Image();
    preloader.onload  = function() { 
      //console && console.log("Loaded image " + this.src);
      deferred.resolve(this.src) 
    };
    preloader.onerror = function() { 
      console && console.log("Can not load an image " + this.src);
      deferred.reject(this.src)  
    };
    preloader.src     = imageSrc;

    loadImageCache[imageSrc] = true;
  }else{
    console && console.log("Image cached " + imageSrc);
    deferred.resolve(imageSrc);
  }

  return deferred;
};

function appendStyleSheet(css_file){
  var html_doc = document.getElementsByTagName('head').item(0);
  var css = document.createElement('link');
  css.setAttribute('rel', 'stylesheet');
  css.setAttribute('type', 'text/css');
  css.setAttribute('href', css_file);
  html_doc.appendChild(css);
  return false;
}

function loadStyleSheet(source, callback){
  return jQuery.get(source, function(){
    appendStyleSheet(source);
    callback && callback();
  });
}

getScripts = getGenerator(jQuery.getScript);
getImages = getGenerator(loadImage);
getFiles = getGenerator(jQuery.get);
getStyles = getGenerator(loadStyleSheet);

getScriptsNotCached = cachingGetGenerator(jQuery.getScript);
// TODO: test commented stuff
//getImagesNotCached = cachingGetGenerator(loadImage);
//getFilesNotCached = cachingGetGenerator(jQuery.get);
getStylesNotCached = cachingGetGenerator(loadStyleSheet);

withScripts = withGetGenerator(getScriptsNotCached);
//withImages = withGetGenerator(getImagesNotCached);
//withFiles = withGetGenerator(getFilesNotCached);
withStyles = withGetGenerator(getStylesNotCached);
