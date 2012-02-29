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

function getScripts(collection, endcallback){
  if(collection.length == 0){
    return endcallback && endcallback();
  }

  jQuery.getScript(collection[0], function(){
     getScripts(collection.slice(1), endcallback);
  });
}

function getScriptsAdvanced(collection, endcallback){
  if(!this.scriptsLoaded){
    this.scriptsLoaded = [];
  }

  if(collection.length == 0){
    return endcallback && endcallback();
  }

  var script = collection[0];
  var callback = function(){
    getScriptsAdvanced(collection.slice(1), endcallback);
  };

  if(this.scriptsLoaded.indexOf(script) == -1){
    this.scriptsLoaded.push(script);
    jQuery.getScript(script, callback);
  }else{
    callback();
  }
}

function withScripts(){
  var old$ = window.$;
  window.$ = jQuery;
  var scripts = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
  var endcallback = arguments[arguments.length - 1];

  getScriptsAdvanced(scripts, function(){
    endcallback();
    window.$ = old$;
  });
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

function getImages(collection, callback){
  eachStep(collection, function(src){
    //console && console.log("Trying to preload image " + src);
    return loadImage(src);
  }, function(){
    console && console.log("Done preloading");
    callback();
  });
}

function getFiles(collection, callback){
  eachStep(collection, 
      function(source){
        return jQuery.get(source);
      }, callback);
}
