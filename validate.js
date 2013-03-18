/**
 * validate.js: jQuery plugin by Justin Schroeder for easy form validation.
 *
 * DOM should be constructed such that each form element has an html wraper.
 * you can manually validate fields and assign errors with:
 *
 * $('form').validate('addMessage',"This field doesn't validate");
 *
 * The plugin does not stop form submission, it merely validates. To check
 * for errors, and stop submission, listen for submission and use:
 *
 * $('form').validate('hasErrors');
 *
 * To display any errors, use:
 *
 * $('form').validate('displayAllMessages');
 *
 * Note: This also clears the error que, so running method 'hasErrors'
 * after calling 'displayAllMessages' will return false.
 *
 * Note: 'displayAllMessages' will also remove any errors that have been
 * fixed since the last time the validation was run, leaving only crrent
 * errors on the form.
 *
**/
(function($){

  $.fn.validate = function(action){

    var actions = {
      init: function(options){
        return this.each(function(){
          var $form = $(this),
              settings = {
                errorClass: "pay-error",
                highlightColor: "#B80707",
                highlightDuration: 1000,
                slideDuration: 200,
                labelReplace: {},
              }

          $.extend(settings,options);
          $form.data('settings',settings);

          // go through the requiredFields object, and set messages for each
          for(label in settings.requiredFields){
            if(!$(settings.requiredFields[label]).val()){
              var human_label = ucwords(label.replace("_"," ").replace(/[0-9]/g, ''));
              for(replaceWord in settings.labelReplace){
                human_label = human_label.replace(replaceWord,settings.labelReplace[replaceWord].replaceWith);
              }
              $form.validate('addMessage',$(settings.requiredFields[label]), human_label + " cannot be empty");
            }
          }

          // we can add other objects to validate against here:


        })
      },
      addMessage: function(elem, message){
        return this.each(function(){
          var $form     = $(this),
              messages  = $form.data('messages') || {},
              idx       = 0;
          // count the size of our message queue
          for(x in messages){ idx++; }
          messages[idx] = {element:elem, message:message};
          $form.data('messages',messages);
        });
      },
      displayMessage: function(messageObject){
        return this.each(function(){
          var $form     = $(this),
              $element  = $(messageObject.element),
              settings  = $form.data('settings'),
              add       = $element.siblings("." + settings.errorClass).filter(":contains('" + messageObject.message + "')").length;

          //only add messages if its a new message
          if(!add){
            $payError = $("<div class='" + settings.errorClass + "'>" + messageObject.message + "</div>");
            $payError.insertAfter($element).slideDown(settings.slideDuration);
          }

          //highlight all of the messages
          $element.effect("highlight","#B80707",settings.highlightDuration);
        });
      },
      displayAllMessages: function(){
        return this.each(function(){
          var $form = $(this),
              messages = $form.data('messages');

          for(idx in messages){
            $form.validate('displayMessage', messages[idx]);
          }
          $form.validate('removeMessages');
          $form.data("messages",{});
        });
      },
      removeMessages: function(){
        return this.each(function(){
          var $form = $(this),
              messages = $form.data('messages'),
              settings = $form.data('settings'),
              $visibleMessages = $("." + settings.errorClass),
              $currentMessages = $([]);

          for(idx in messages){
            $currentMessages = $currentMessages.add(messages[idx].element);
          }
          $visibleMessages.each(function(){
            if($currentMessages.index($(this).siblings()) == -1) $(this).slideUp(settings.slideDuration,function(){ $(this).remove() });
          });

        });
      },
      hasErrors: function(){
        var $form = $(this),
            messages = $form.data('messages'),
            cnt = 0;

        for(x in messages){ cnt++; }
        if(cnt) return cnt; else return false;
      }

    }

    if(actions[action]) return actions[action].apply(this, Array.prototype.slice.call(arguments, 1));
    else if(typeof action === 'object' || !action) return actions.init.apply(this, arguments);
    else $.error(action + ' is an undefined action of validate.js'); 
  }


  // from php.js, used only beautify labels
  function ucwords(str){
    return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
      return $1.toUpperCase();
    });
  }

})(jQuery);
