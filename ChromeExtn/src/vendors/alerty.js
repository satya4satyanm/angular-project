(function () {
  'use strict';

  // common function which is often using
  var commonUse = {
    addClass: function(el, cls) {
      var elClass = el.className;
      var blank = (elClass !== '') ? ' ' : '';
      var added = elClass + blank + cls;
      el.className = added;
    },

    removeClass: function(el, cls) {
      var elClass = ' '+el.className+' ';
      elClass = elClass.replace(/(\s+)/gi, ' ');
      var removed = elClass.replace(' '+cls+' ', ' ');
      removed = removed.replace(/(^\s+)|(\s+$)/g, '');
      el.className = removed;
    },

    hasClass: function(el, cls) {
      var elClass = el.className;
      var elClassList = elClass.split(/\s+/);
      var x = 0;
      for(x in elClassList) {
        if(elClassList[x] == cls) {
          return true;
        }
      }
      return false;
    },

    addEvent: function(el, type, func) {
      if(el.addEventListener) {
        el.addEventListener(type, func, false);
      } else if(el.attachEvent){
        el.attachEvent('on' + type, func);
      } else{
        el['on' + type] = func;
      } 
    },

    removeEvent: function(el, type, func) {
      if (el.removeEventListener){
        el.removeEventListener(type, func, false);
      } else if (el.detachEvent){
        el.detachEvent('on' + type, func);
      } else {
        delete el['on' + type];
      }
    },

    removeElement: function(el) {
      (el && el.parentNode) && el.parentNode.removeChild(el);
    },

    setUid: function(prefix) {
      do prefix += Math.floor(Math.random() * 1000000);
      while (document.getElementById(prefix));
      return prefix;
    }
  };

  var Alerty = function() {
    // private object for Alerty object inherit
    var Dialog = {
      // static defaults params
      defaults: {
        okLabel: 'Ok',
        cancelLabel: 'Cancel',
        time: 2000
      },

      previousCallback: null,  // for cache previous toasts callbak, to handle if call more than 1 alerty

      // html templates
      template: '<div class="alerty">'+
                  '<div class="alerty-title"></div>'+
                  '<div class="alerty-content">'+
                    '<p class="alerty-message"></p>'+
                    '<div class="alerty-prompt">'+
                      '<input type="text" placeholder="" value="">'+
                      '<div class="input-line"></div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="alerty-action">'+
                    '<a class="btn-cancel"></a>'+
                    '<a class="btn-ok"></a>'+
                  '</div>'+
                '</div>',

      setup: function(type, content, opts, onOk, onCancel) {
        // for if argument opts is not given.
        var detect = typeof opts === 'function';
        if (detect) {
          onCancel = onOk;
          onOk = opts;
        }

        var $oldModal = document.querySelector('.alerty');


        // if previous modal is open, remove it and immediately callback
        if ($oldModal) {
          commonUse.removeElement($oldModal);
          var _callback = this.previousCallback;
          if (_callback) _callback();
        }

        var $wrapper = document.createElement('div');
        $wrapper.innerHTML = this.template;

        // append alerty to body
        while ($wrapper.firstChild) {
          document.body.appendChild($wrapper.firstChild);
        }

        // cache alerty dom for next use
        var $modal = document.querySelector('.alerty');
        var $title = $modal.querySelector('.alerty-title');
        var $message = $modal.querySelector('.alerty-message');
        var $btnArea = $modal.querySelector('.alerty-action');
        var $btnOk = $modal.querySelector('.btn-ok');
        var $btnCancel = $modal.querySelector('.btn-cancel');
        var $prompt = $modal.querySelector('.alerty-prompt');
        var $input = $prompt.querySelector('input');

        // set uid
        $modal.id = commonUse.setUid('alerty');

        // animation show alerty
        commonUse.addClass($modal, 'alerty-show');
        $message.innerHTML = content;  // set msg

        if (opts && opts.time) this.defaults.time = opts.time; // handle time if set

        if (type !== 'prompt') {
          commonUse.removeElement($prompt); // other type do not need
        } else {
          $input.focus(); // auto focus input if type prompt

          if(opts && opts.inputType) $input.setAttribute('type', opts.inputType); // handle input type, such as 'password'
          if(opts && opts.inputPlaceholder) $input.setAttribute('placeholder', opts.inputPlaceholder); // handle input placeholder
          if(opts && opts.inputValue) $input.setAttribute('value', opts.inputValue); // handle input default value
        }

        if (type === 'toasts') {
          this.previousCallback = onOk;  // cache callback

          // rearrange template
          commonUse.removeElement($title);
          commonUse.removeElement($btnArea);
          commonUse.addClass($modal, 'toasts');

          if (opts && opts.place === 'top') commonUse.addClass($modal, 'place-top'); // handle toasts top place
          if (opts && opts.bgColor) $modal.style.backgroundColor = opts.bgColor;
          if (opts && opts.fontColor) $message.style.color =opts.fontColor;

        } else {
          //commonUse.addClass(document.body, 'no-scrolling'); // body no scorll
          (opts && opts.title) ? $title.innerHTML = opts.title : commonUse.removeElement($title); // handle title if set
          (opts && opts.okLabel) ? $btnOk.innerHTML = opts.okLabel : $btnOk.innerHTML = this.defaults.okLabel; // handle ok text if set


          if (type === 'confirm' || type === 'prompt') {
            (opts && opts.cancelLabel) ? $btnCancel.innerHTML = opts.cancelLabel : $btnCancel.innerHTML = this.defaults.cancelLabel; // handle cancel text if set
          } else {
            commonUse.removeElement($btnCancel); // toasts and alery type do not need cancel btn
          }
        }

        this.bindEvent($modal, onOk, onCancel); // see next
      },

      bindEvent: function($modal, onOk, onCancel) {
        var that = this;
        var $btnOk = $modal.querySelector('.btn-ok');
        var $btnCancel = $modal.querySelector('.btn-cancel');

        // toasts delay hide
        if (commonUse.hasClass($modal, 'toasts')) {
          setTimeout(function() {
            // if toasts has been removed
            if (document.getElementById($modal.id) === null) return;
            that.close($modal, onOk);
          }, that.defaults.time);
        }
        // click ok button
        if ($btnOk) {
          commonUse.addEvent($btnOk, 'click', function() {
            that.close($modal, onOk);
          });
        }
        // click cancel button
        if ($btnCancel) {
          commonUse.addEvent($btnCancel, 'click', function() {
            that.close($modal, onCancel);
          });
        }
      },

      close: function($modal, callback) {
        var $input = $modal.querySelector('input');

        // hide alerty with animation
        commonUse.removeClass($modal, 'alerty-show');
        commonUse.addClass($modal, 'alerty-hide');

        // remove alerty and other added elements
        setTimeout(function(){
          commonUse.removeElement($modal);
          if (callback) {
            setTimeout(function(){
              !$input ? callback() : callback($input.value);  // handle prompt type, callback the input value
            }, 100);
          }
        },100);
      }
    };

    return {
      // return alerty.toasts();
      toasts: function(content, opts, callback) {
        Dialog.setup('toasts', content, opts, callback);
      },

      // return alerty.alert();
      alert: function(content, opts, onOk) {
        Dialog.setup('alert', content, opts, onOk);
      },

      // return alerty.confirm();
      confirm: function(content, opts, onOk, onCancel) {
        Dialog.setup('confirm', content, opts, onOk, onCancel);
      },

      // return alerty.prompt();
      prompt: function(content, opts, onOk, oncancel) {
        Dialog.setup('prompt', content, opts, onOk, oncancel);
      }
    };
  };
    window.alerty = new Alerty();
}());
