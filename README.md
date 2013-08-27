# jQuery-seq

## About
jQuery-seq is a set of functions to do some tasks sequentially.
It uses jQuery deferred object.
You can either execute some functions sequentially with *sequentialExecute* or use ready functions to load scripts or stylesheets or other files (flash for example) one after another.

Most useful functions are *withScripts* and *withStyles*

## Usage

Use cases are 

```javascript
withScripts('/js/some-script.js', '/js/some-other-script.js', function(){
  alert('all scripts loaded');
});
```

```javascript
withStyles('/css/some-style.css', '/js/some-other-style.css', function(){
  alert('all css files are loaded and appended to head');
});
```

## Documentation

Documentation also available. Just clone repository and look at doc/index.html
