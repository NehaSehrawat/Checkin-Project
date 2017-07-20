var fileInputTextDiv = document.getElementById('file_input_text_div');
var fileInput = document.getElementById('file_input_file');
var fileInputText = document.getElementById('file_input_text');

fileInput.addEventListener('change', changeInputText);
fileInput.addEventListener('change', changeState);

function changeInputText() {
  var str = fileInput.value;
  var i;
  if (str.lastIndexOf('\\')) {
    i = str.lastIndexOf('\\') + 1;
  } else if (str.lastIndexOf('/')) {
    i = str.lastIndexOf('/') + 1;
  }
  fileInputText.value = str.slice(i, str.length);
}

function changeState() {
  if (fileInputText.value.length != 0) {
    if (!fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.add('is-focused');
    }
  } else {
    if (fileInputTextDiv.classList.contains("is-focused")) {
      fileInputTextDiv.classList.remove('is-focused');
    }
  }
}
var authUrl = 'authUrl';
var dataUrl = 'dataUrl';

$(document).ready(function(){
	 $("#showf").hide();

var username = null;
var token = null;
var userId;

  function MaterialSelect(element) {
  'use strict';

  this.element_ = element;
  this.maxRows = this.Constant_.NO_MAX_ROWS;
  // Initialize instance.
  this.init();
}

MaterialSelect.prototype.Constant_ = {
  NO_MAX_ROWS: -1,
  MAX_ROWS_ATTRIBUTE: 'maxrows'
};

MaterialSelect.prototype.CssClasses_ = {
  LABEL: 'mdl-textfield__label',
  INPUT: 'mdl-select__input',
  IS_DIRTY: 'is-dirty',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_INVALID: 'is-invalid',
  IS_UPGRADED: 'is-upgraded'
};

MaterialSelect.prototype.onKeyDown_ = function(event) {
  'use strict';

  var currentRowCount = event.target.value.split('\n').length;
  if (event.keyCode === 13) {
    if (currentRowCount >= this.maxRows) {
      event.preventDefault();
    }
  }
};

MaterialSelect.prototype.onFocus_ = function(event) {
  'use strict';

  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

MaterialSelect.prototype.onBlur_ = function(event) {
  'use strict';

  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

MaterialSelect.prototype.updateClasses_ = function() {
  'use strict';
  this.checkDisabled();
  this.checkValidity();
  this.checkDirty();
};

MaterialSelect.prototype.checkDisabled = function() {
  'use strict';
  if (this.input_.disabled) {
    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
  }
};

MaterialSelect.prototype.checkValidity = function() {
  'use strict';
  if (this.input_.validity.valid) {
    this.element_.classList.remove(this.CssClasses_.IS_INVALID);
  } else {
    this.element_.classList.add(this.CssClasses_.IS_INVALID);
  }
};

MaterialSelect.prototype.checkDirty = function() {
  'use strict';
  if (this.input_.value && this.input_.value.length > 0) {
    this.element_.classList.add(this.CssClasses_.IS_DIRTY);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
  }
};

MaterialSelect.prototype.disable = function() {
  'use strict';

  this.input_.disabled = true;
  this.updateClasses_();
};

MaterialSelect.prototype.enable = function() {
  'use strict';

  this.input_.disabled = false;
  this.updateClasses_();
};

MaterialSelect.prototype.change = function(value) {
  'use strict';

  if (value) {
    this.input_.value = value;
  }
  this.updateClasses_();
};

MaterialSelect.prototype.init = function() {
  'use strict';

  if (this.element_) {
    this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
    this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

    if (this.input_) {
      if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
        this.maxRows = parseInt(this.input_.getAttribute(
            this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
        if (isNaN(this.maxRows)) {
          this.maxRows = this.Constant_.NO_MAX_ROWS;
        }
      }

      this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
      this.boundFocusHandler = this.onFocus_.bind(this);
      this.boundBlurHandler = this.onBlur_.bind(this);
      this.input_.addEventListener('input', this.boundUpdateClassesHandler);
      this.input_.addEventListener('focus', this.boundFocusHandler);
      this.input_.addEventListener('blur', this.boundBlurHandler);

      if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
        // TODO: This should handle pasting multi line text.
        // Currently doesn't.
        this.boundKeyDownHandler = this.onKeyDown_.bind(this);
        this.input_.addEventListener('keydown', this.boundKeyDownHandler);
      }

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  }
};

MaterialSelect.prototype.mdlDowngrade_ = function() {
  'use strict';
  this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
  this.input_.removeEventListener('focus', this.boundFocusHandler);
  this.input_.removeEventListener('blur', this.boundBlurHandler);
  if (this.boundKeyDownHandler) {
    this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
  }
};

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
  constructor: MaterialSelect,
  classAsString: 'MaterialSelect',
  cssClass: 'mdl-js-select',
  widget: true
});


$.ajaxSetup({
	crossDomain: true,
	headers: {
		'X-Hasura-Role' : 'user'
	}
});



$(signup).click(function(){

var response = grecaptcha.getResponse();


if ( ($('#email').val()=="") || ($('#password').val()=="") ||($('#uname').val()=="")  ) {
console.log('sorry');
if ($('#email').val()=="") {$("#signup").text("Enter Email");}

 else if ($('#password').val()=="") {$("#signup").text("Enter Password");}
 else if ($('#uname').val()=="") {$("#signup").text("Enter username");}



  else{$("#signup").text("Submitting...");}
}//if ka bracket
else if ($('#email').val().indexOf("@")<1 || $('#email').val().lastIndexOf(".")<$('#email').val().indexOf("@")+2 || $('#email').val().lastIndexOf(".")+2 >= $('#email').val().length) {$("#signup").text("Enter Valid Email");}

else if (response.length == 0) {
	$("#signup").text("Click Recapcha above");
}

else{
$("#one").hide();
$("#signup").hide();

	$.ajax({
		url: authUrl+"/signup",
		method: 'post',
		headers: { 'Content-Type' : 'application/json' },
		data: JSON.stringify({
			"username": $('#uname').val(),
			"email": $('#email').val(),
			"password": $('#password').val(),
			"g-recaptcha-response": response
		})
	}).done(function(data){
		
		$('#signup').text('Redirecting...');
		$("#hidef").hide();
		$("#showf").show();

		

		
	}).fail(function(j){
		console.error(j);
		alert("FAILED: " + JSON.parse(j.responseText).message);
		$('#signup').val('Failed. Try again?');
		location.reload();
	});
}//else ka bracket


});
//click signup finish
$(one).click(function(){
var response = grecaptcha.getResponse();

if ( ($('#email').val()=="") || ($('#password').val()=="") || ($('#uname').val()=="")  ) {
console.log('sorry');

if ($('#email').val()=="") {$("#one").text("Enter Email");}
else if ($('#uname').val()=="") {$("#one").text("Enter username");}
 else if ($('#password').val()=="") {$("#one").text("Enter Password");}

  else{$("#one").text("Submitting...");}
}//if ka bracket
 else if ($('#email').val().indexOf("@")<1 || $('#email').val().lastIndexOf(".")<$('#email').val().indexOf("@")+2 || $('#email').val().lastIndexOf(".")+2 >= $('#email').val().length) {$("#one").text("Enter Valid Email");}

 else if (response.length == 0) {
	$("#one").text("Click Recapcha above");
}
else{
$("#one").hide();
$("#signup").hide();

	$.ajax({
		url: authUrl+"/login",
		method: 'post',
		headers: { 'Content-Type' : 'application/json' },
		data: JSON.stringify({
			"username": $('#uname').val(),
			"email": $('#email').val(),
			"password": $('#password').val(),
			"g-recaptcha-response": response
		})
	}).done(function(data){
		token = data.auth_token;
		userId = data.hasura_id;
		$('#one').text('Redirecting...');
		//send token to server.js
		window.location = '/app';
	//set cookie
	var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = 'name' + "=" + token + ";" + expires + ";path=/";
	
		$.ajax({
			url: "/test-page",
			method: 'post',
			dataType: 'json',
			 contentType: 'application/json',
			data: JSON.stringify({
				"token": token,
				"userId": userId
			})
		
		}).done(function(){
			window.location = '/app';
		}).fail(function(){
			$('#one').val('Failed. Try again?');
		});

	}).fail(function(j){
		console.error(j);
		alert("FAILED: " + JSON.parse(j.responseText).message);
		$('#one').val('Failed. Try again?');
		location.reload();
	});
}//else ka bracket


});
//login

});
