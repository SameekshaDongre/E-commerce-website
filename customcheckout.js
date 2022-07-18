(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["customcheckout"] = factory();
	else
		root["customcheckout"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Fields = {
  CARD_NUMBER: 'card-number',
  CVV: 'cvv',
  EXPIRY: 'expiry'
};

module.exports = Fields;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Events = {

  checkOrigin: function checkOrigin(event, expected) {
    if (!event) return false;

    // Ensure correct origin
    if (event.origin !== expected) {
      return false;
    }
    return true;
  },

  message: 'message',
  blur: 'blur',
  focus: 'focus',
  empty: 'empty',
  complete: 'complete',
  brand: 'brand',
  error: 'error',
  value: 'value',
  input: 'input',
  change: 'change'
};

module.exports = Events;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* 
Methods for easily creating strictly formatted messages that can be passed 
between iframes and the source page. 
*/
var Events = __webpack_require__(1);

var Message = {

  // Used on field/iframe creation
  // details are e.g. style, placeholder, classes
  create: function create(details) {
    return this._generic('create', details);
  },

  // Sent from the cvv iframe to the card number and expiry iframes, to
  // indicate that cvv is being used on the page. 
  updateCvvPresent: function updateCvvPresent() {
    return this._generic('cvvPresent');
  },

  // sent back from an iFrame to the source window after creation. 
  // used to update the dimensions of the iFrame to fit the created input.
  updateIFrame: function updateIFrame(type, inputHeight) {
    return this._generic('updateIFrame', { type: type, inputHeight: inputHeight });
  },

  changeValue: function changeValue(newValue, autofill) {
    return this._generic('changeValue', { newValue: newValue, autofill: autofill });
  },

  callback: function callback(eventName, event) {
    var details = {
      eventName: eventName,
      event: event
    };
    return this._generic('callbackEvent', details);
  },

  // Sent from source window to the iFrames to set up an 
  // event callback that can be triggered on the iframe, 
  // back to the source.
  registerCallback: function registerCallback(eventName) {
    var details = {
      eventName: eventName
    };
    return this._generic('registerCallback', details);
  },

  // Sent from the card number window to the cvv window when the card brand
  // changes, so that cvv can validate against the current brand.
  brandChange: function brandChange(brand) {
    var details = {
      brand: brand
    };
    return this._generic('brandChange', details);
  },

  // Sent from the card number to the cvv window when cvv asks for it (as opposed
  // to when brand changes -- above). Needed in the case that cvv has been mounted
  // or re-mounted after the brand has been updated.
  askForBrand: function askForBrand(askerField) {
    var details = {
      asker: askerField
    };
    return this._generic('askForBrand', details);
  },

  // Sent from the source window to the card number iframe to start the 
  // tokenization process (validation and ajax request).
  beginTokenization: function beginTokenization() {
    return this._generic('beginTokenization');
  },

  tokenResponse: function tokenResponse(result, code, errorOrToken, last4, expiryMonth, expiryYear) {
    var details = { event: {} };
    details.event.code = code;
    if (result === Events.error) {
      details.event.error = errorOrToken;
    } else {
      details.event.token = errorOrToken;
      details.event.last4 = last4;
      details.event.expiryMonth = expiryMonth;
      details.event.expiryYear = expiryYear;
    }
    return this._generic('tokenResponse', details);
  },

  // Sent from one iframe input to another requesting validation information.
  validationRequest: function validationRequest() {
    return this._generic('validationRequest');
  },

  // Sent from one iframe back to the one that requested validation information.
  // If valid, message includes the value of the field.
  validationResponse: function validationResponse(field, valid, value) {
    var details = {
      field: field,
      valid: valid,
      value: value
    };
    return this._generic('validationResponse', details);
  },

  // Sent from one iframe input to another requesting input focus.
  focus: function focus() {
    return this._generic('focus');
  },

  // Sent from one iframe input to another requesting input blur.
  blur: function blur() {
    return this._generic('blur');
  },

  // Sent from one iframe input to another requesting input clear.
  clear: function clear() {
    return this._generic('clear');
  },

  // Used to update field/iframe
  // details are e.g. style, placeholder, classes
  update: function update(details) {
    return this._generic('update', details);
  },

  // Create an empty named message
  _generic: function _generic(name, details) {
    return {
      name: name,
      details: details
    };
  }
};

module.exports = Message;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Style = {
  supportedClassProperties: ['base', 'complete', 'error', 'empty', 'focus'],
  supportedStyleProperties: ['base', 'complete', 'error', 'empty'],
  supportedCSSProperties: ['color', 'fontFamily', 'fontSize', 'fontStyle', 'textDecoration', 'fontWeight', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'padding'],
  supportedPseudoClasses: [':hover', ':focus'],

  getDefaultCustomClasses: function getDefaultCustomClasses() {
    return {
      base: 'bambora-checkoutfield',
      complete: 'bambora-checkoutfield-complete',
      empty: 'bambora-checkoutfield-empty',
      focus: 'bambora-checkoutfield-focus',
      error: 'bambora-checkoutfield-error'
    };
  },

  // Parse the argument of style information passed in and return an array of 
  // errors present (if any).
  validateStyleArgument: function validateStyleArgument(styles) {
    var errors = [];
    for (var group in styles) {
      if (styles.hasOwnProperty(group)) {
        if (this.supportedStyleProperties.indexOf(group) <= -1) {
          errors.push('\'' + group + '\' is not a supported style group');
        } else {
          if (_typeof(styles[group]) !== 'object') {
            errors.push('style group \'' + group + '\' must be an object');
            continue;
          }

          for (var rule in styles[group]) {
            if (styles[group].hasOwnProperty(rule)) {
              if (this.supportedCSSProperties.indexOf(rule) <= -1 && this.supportedPseudoClasses.indexOf(rule) <= -1) {
                errors.push('\'' + rule + '\' is not a supported style setting');
              } else if (this.supportedPseudoClasses.indexOf(rule) > -1) {
                if (_typeof(styles[group][rule]) !== 'object') {
                  errors.push('style property ' + rule + ' must be an object');
                  continue;
                }

                for (var subRule in styles[group][rule]) {
                  if (styles[group][rule].hasOwnProperty(subRule)) {
                    if (this.supportedCSSProperties.indexOf(subRule) <= -1) {
                      errors.push(subRule + ' is not a supported nested style setting');
                    } else {
                      if (typeof styles[group][rule][subRule] !== 'string') {
                        errors.push('style property ' + subRule + ' must be an object');
                      }
                    }
                  }
                }
              } else {
                if (typeof styles[group][rule] !== 'string') {
                  errors.push('style property ' + rule + ' must be a string');
                }
              }
            }
          }
        }
      }
    }
    return errors;
  },

  buildRuleStringFromStyle: function buildRuleStringFromStyle(style) {
    var rules = '';

    if (style.color) {
      rules += 'color: ' + style.color + '; ';
    }

    if (style.fontFamily) {
      rules += 'font-family: ' + style.fontFamily + '; ';
    }

    if (style.fontStyle) {
      rules += 'font-style: ' + style.fontStyle + ';';
    }

    if (style.fontSize) {
      rules += 'font-size: ' + style.fontSize + '; ';
    }

    if (style.textDecoration) {
      rules += 'text-decoration: ' + style.textDecoration + '; ';
    }

    if (style.fontWeight) {
      rules += 'font-weight: ' + style.fontWeight + '; ';
    }

    if (style.paddingLeft) {
      rules += 'padding-left: ' + style.paddingLeft + '; ';
    }

    if (style.paddingTop) {
      rules += 'padding-top: ' + style.paddingTop + '; ';
    }

    if (style.paddingRight) {
      rules += 'padding-right: ' + style.paddingRight + '; ';
    }

    if (style.paddingBottom) {
      rules += 'padding-bottom: ' + style.paddingBottom + '; ';
    }

    if (style.padding) {
      rules += 'padding: ' + style.padding + '; ';
    }

    return rules;
  }

};

module.exports = Style;

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

// Source: https://gist.github.com/k-gun/c2ea7c49edf7b757fe9561ba37cb19ca
;(function () {
    // helpers
    var regExp = function regExp(name) {
        return new RegExp('(^| )' + name + '( |$)');
    };
    var forEach = function forEach(list, fn, scope) {
        for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
        }
    };

    // class list object with basic methods
    function ClassList(element) {
        this.element = element;
    }

    ClassList.prototype = {
        add: function add() {
            forEach(arguments, function (name) {
                if (!this.contains(name)) {
                    this.element.className += this.element.className.length > 0 ? ' ' + name : name;
                }
            }, this);
        },
        remove: function remove() {
            forEach(arguments, function (name) {
                this.element.className = this.element.className.replace(regExp(name), ' ');
            }, this);
        },
        toggle: function toggle(name) {
            return this.contains(name) ? (this.remove(name), false) : (this.add(name), true);
        },
        contains: function contains(name) {
            return regExp(name).test(this.element.className);
        },
        // bonus..
        replace: function replace(oldName, newName) {
            this.remove(oldName), this.add(newName);
        }
    };

    // IE8/9, Safari
    if (!('classList' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function get() {
                return new ClassList(this);
            }
        });
    }

    // replace() support for others
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
        DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
})();

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* global REMOTE_ORIGIN */

var Events = __webpack_require__(1);
var Fields = __webpack_require__(0);
var Message = __webpack_require__(2);
var Style = __webpack_require__(3);

/* Constructor */

function Controller(view) {
  var self = this;
  self.view = view;

  self.eventCallbacks = {}; // the functions that are registered on fields to 
  // be called on events (e.g. on load, error, etc.)

  self.customClasses = {};
  self.customClasses[Fields.CARD_NUMBER] = Style.getDefaultCustomClasses();
  self.customClasses[Fields.CVV] = Style.getDefaultCustomClasses();
  self.customClasses[Fields.EXPIRY] = Style.getDefaultCustomClasses();

  // link message eventListener callback to the view immediately
  self.view.bind('message', function (event) {
    self.receiveMessage(event);
  });

  // bind API methods to use controller 'self' for internal 'this', so that 
  // they behave as expected
  self.create = self.create.bind(self);
  self.on = self.on.bind(self);
  self.createToken = self.createToken.bind(self);
}

Controller.prototype.updateWrapperClass = function (eventName, event) {
  var self = this;
  var field = event.field;
  var classes = self.customClasses[field];

  if (eventName === Events.focus) {
    self.view.render('addClass', { field: field, class: classes.focus });
  } else if (eventName === Events.blur) {
    self.view.render('removeClass', { field: field, class: classes.focus });
  } else if (eventName === Events.empty) {
    if (event.empty) {
      self.view.render('addClass', { field: field, class: classes.empty });
    } else {
      self.view.render('removeClass', { field: field, class: classes.empty });
    }
  } else if (eventName === Events.complete) {
    if (event.complete) {
      self.view.render('removeClass', { field: field, class: classes.error });
      self.view.render('addClass', { field: field, class: classes.complete });
    } else {
      self.view.render('removeClass', { field: field, class: classes.complete });
    }
  } else if (eventName === Events.error) {
    self.view.render('removeClass', { field: field, class: classes.complete });
    self.view.render('addClass', { field: field, class: classes.error });
  }
};

Controller.prototype.callbackEvent = function (details) {
  var self = this;
  var eventName = details.eventName;
  var event = details.event;

  self.updateWrapperClass(eventName, event);
  if (self.eventCallbacks[eventName]) {
    self.eventCallbacks[eventName](event);
  }
};

Controller.prototype.receiveMessage = function (event) {
  var self = this;

  if (!Events.checkOrigin(event, "https://libs.na.bambora.com")) {
    return false;
  }

  // Handle message
  var message = event.data;
  if (typeof message === 'string' || message instanceof String) {
    try {
      message = JSON.parse(message);
    } catch (err) {
      self.view.render('error', 'Could not parse message: ' + err.name + ' - ' + err.message);
    }
  }
  var details = message.details;

  if (message.name === 'updateIFrame') {
    self.view.render('updateIFrame', details);
  } else if (message.name === 'callbackEvent') {
    self.callbackEvent(details);
  } else if (message.name === 'tokenResponse') {
    self.eventCallbacks['token'](details.event);
  }

  return true;
};

Controller.prototype.setCustomClasses = function (type, classes) {
  var self = this;
  for (var property in classes) {
    if (classes.hasOwnProperty(property)) {
      if (Style.supportedClassProperties.indexOf(property) > -1) {
        if (typeof classes[property] === 'string' || classes[property] instanceof String) {
          self.customClasses[type][property] = classes[property];
        } else {
          self.view.render('error', '\'' + property + '\' classes property requires a string value');
        }
      } else {
        self.view.render('error', '\'' + property + '\' is not a supported custom class');
      }
    }
  }
};

/* API Methods */

Controller.prototype.create = function (type) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var self = this;

  if (type !== Fields.CARD_NUMBER && type !== Fields.CVV && type !== Fields.EXPIRY) {
    self.view.render('error', 'type must be ' + Fields.CARD_NUMBER + ', ' + Fields.CVV + ', or ' + Fields.EXPIRY);
    return;
  }

  if (options.classes) {
    self.setCustomClasses(type, options.classes);
  }

  self.view.render('create', type);
  var msg = Message.create(options);
  self.view.postMessage(msg, type);

  return {
    // field object API methods:
    mount: self.mount.bind(this, type),
    unmount: self.unmount.bind(this, type),
    focus: self.focus.bind(this, type),
    blur: self.blur.bind(this, type),
    clear: self.clear.bind(this, type),
    update: self.update.bind(this, type)
  };
};

// Registers the callback in the controller's callbacks object and 
// posts a message to the iframe of the event to respond to. 
Controller.prototype.on = function (eventName, callback) {
  var self = this;

  // Return error if callback type is not supported 
  var supportedEvents = [Events.blur, Events.focus, Events.empty, Events.complete, Events.brand, Events.error];
  if (supportedEvents.indexOf(eventName) <= -1) {
    self.view.render('error', 'event type \'' + eventName + '\' not supported');
    return;
  }

  // register this callback for each of the inputs 
  self.eventCallbacks[eventName] = callback;
};

// Kicks off token creation by registering the callback and 
// sending a 'createToken' message to the iframe.
Controller.prototype.createToken = function (callback) {
  var self = this;
  self.eventCallbacks['token'] = callback;
  self.view.postMessage(Message.beginTokenization(), Fields.CARD_NUMBER);
};

/* field object API methods */

// Method on the object returned from #create()
// type and options arguments are bound to the function on creation
Controller.prototype.mount = function (type, parent) {
  var self = this;

  self.view.render('mount', {
    parent: parent,
    type: type,
    errorMsg: 'Mount could not find wrapper element \'' + parent + '\''
  });

  self.view.render('addClass', { field: type, class: self.customClasses[type].empty });
  self.view.render('addClass', { field: type, class: self.customClasses[type].base });
};

/*
 * Methods on the object returned from #create()
 * type and options arguments are bound to the function on creation
 */

Controller.prototype.unmount = function (type) {
  var self = this;
  var parent = self.view.getParent(type);

  self.view.render('removeClass', { field: type, class: self.customClasses[type].empty });
  self.view.render('removeClass', { field: type, class: self.customClasses[type].base });

  self.view.render('unmount', {
    type: type,
    errorMsg: 'Unmount could not find wrapper element \'' + parent + '\''
  });
};

Controller.prototype.focus = function (type) {
  self.view.postMessage(Message.focus(), type);
};

Controller.prototype.blur = function (type) {
  self.view.postMessage(Message.blur(), type);
};

Controller.prototype.clear = function (type) {
  self.view.postMessage(Message.clear(), type);
};

Controller.prototype.update = function (type) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (options.classes) {
    self.setCustomClasses(type, options.classes);
  }

  var msg = Message.update(options);
  self.view.postMessage(msg, type);
};

module.exports = Controller;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* global REMOTE_PAGE_URL */
__webpack_require__(5);

var Fields = __webpack_require__(0);

/* Constructor */

function View() {
  var self = this;

  self.$iFrame = {};
  self.$iFrame[Fields.CARD_NUMBER] = null;
  self.$iFrame[Fields.CVV] = null;
  self.$iFrame[Fields.EXPIRY] = null;

  self.iFrameLoaded = {};
  self.iFrameLoaded[Fields.CARD_NUMBER] = false;
  self.iFrameLoaded[Fields.CVV] = false;
  self.iFrameLoaded[Fields.EXPIRY] = false;

  self.parentOf = {};
  self.parentOf[Fields.CARD_NUMBER] = null;
  self.parentOf[Fields.CVV] = null;
  self.parentOf[Fields.EXPIRY] = null;
}

View.prototype.isSupportedBrowser = function () {
  return true; // TODO: Decide what features are needed, use Modernizr to detect
};

/* Render methods */

/* Called by the controller with `view.render('method-name', arg);` */

View.prototype._updateIFrame = function (data) {
  var self = this;
  var iframe = self.$iFrame[data.type];

  if (iframe) {
    iframe.height = data.inputHeight;
  }
};

View.prototype._addClass = function (data) {
  var self = this;
  var parent = self.parentOf[data.field];
  if (parent) {
    parent.classList.add(data.class);
  } else {
    self._error('Parent element does not exist');
  }
};

View.prototype._removeClass = function (data) {
  var self = this;
  var parent = self.parentOf[data.field];
  if (parent) {
    parent.classList.remove(data.class);
  } else {
    self._error('Parent element does not exist');
  }
};

View.prototype._create = function (type) {

  if (!window.location.origin) {
    // .origin not supported in ie < 11
    window.location.origin = window.location.protocol + '//' + window.location.hostname;
    if (window.location.port) {
      window.location.origin += ':' + window.location.port;
    }
  }

  var iframe = document.createElement('iframe');
  iframe.src = "https://libs.na.bambora.com/customcheckout/1.0.3/iframe.html" + '?type=' + type + '&source=' + encodeURIComponent(window.location.href) + '&origin=' + encodeURIComponent(window.location.origin);
  iframe.scrolling = 'no';
  iframe.height = '0';
  iframe.width = '100%';
  iframe.name = 'bambora-' + type + '-iframe';
  iframe.style.border = 'none';
  iframe.style.overflow = 'visible';
  iframe.style.backgroundColor = 'transparent';
  iframe.allowTransparency = 'true';

  this.$iFrame[type] = iframe;
};

View.prototype._mount = function (data) {
  var self = this;
  var parent = document.querySelector(data.parent);
  var iframe = this.$iFrame[data.type];

  if (parent) {
    parent.appendChild(iframe);
    self.parentOf[data.type] = parent;
  } else {
    self._error(data.errorMsg);
  }
};

View.prototype._unmount = function (data) {
  var self = this;
  var parent = self.parentOf[data.type];

  if (parent) {
    parent.removeChild(parent.firstChild);
    self.parentOf[data.type] = null;
  } else {
    self._error(data.errorMsg);
  }
};

View.prototype._error = function (str) {
  console.error('Custom Checkout: ' + str);
};

/* Render handler */

View.prototype.render = function (viewCmd, parameter) {
  var self = this;
  var viewCommands = {
    updateIFrame: function updateIFrame() {
      self._updateIFrame(parameter);
    },
    addClass: function addClass() {
      self._addClass(parameter);
    },
    removeClass: function removeClass() {
      self._removeClass(parameter);
    },
    create: function create() {
      self._create(parameter);
    },
    mount: function mount() {
      self._mount(parameter);
    },
    unmount: function unmount() {
      self._unmount(parameter);
    },
    error: function error() {
      self._error(parameter);
    }
  };

  viewCommands[viewCmd]();
};

/* Message passing to iFrames */

// Send a message to the specified iFrame. If the iframe has been loaded,
// send message immediately, otherwise, add message to queue of messages in the
// iframe's onload event.
View.prototype.postMessage = function (msg, field) {
  var self = this;
  var iFrameSrc = "https://libs.na.bambora.com/customcheckout/1.0.3/iframe.html"; // defined in webpack config

  if (self.$iFrame[field] === null && field === Fields.CVV) {
    return; // cvv field is optional, no need to send message
  } else if (self.$iFrame[field] === null) {
    self._error('Card number and expiry fields are required');
  } else if (self.iFrameLoaded[field]) {
    try {
      self.$iFrame[field].contentWindow.postMessage(JSON.stringify(msg), iFrameSrc);
    } catch (e) {
      self.render('error', 'The ' + field + ' field has not been mounted to the page');
    }
  } else {
    var queuedMessages = self.$iFrame[field].onload;
    msg = JSON.stringify(msg);
    self.$iFrame[field].onload = function () {
      if (queuedMessages) {
        queuedMessages();
      }
      self.$iFrame[field].contentWindow.postMessage(msg, iFrameSrc);
      self.iFrameLoaded[field] = true;
    };
  }
};

// Returns the parent DOM element found and setup during 'mount'.
View.prototype.getParent = function (type) {
  var self = this;
  var parent = self.parentOf[type];
  return parent;
};

/* callback binding */

View.prototype.bind = function (event, handler) {
  if (event === 'message') {
    window.addEventListener('message', handler, false);
  }
};

module.exports = View;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var View = __webpack_require__(8);
var Controller = __webpack_require__(7);

module.exports = function () {
  this.view = new View();

  // Fail gracefully if browser unsupported
  if (!this.view.isSupportedBrowser()) {
    this.view.render('error', 'Custom Checkout is not supported by browser');
    return;
  }

  this.controller = new Controller(this.view);

  // API endpoints:
  return {
    create: this.controller.create,
    on: this.controller.on,
    createToken: this.controller.createToken
  };
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=customcheckout.js.map