var dataUrl = 'dataUrl';
var authUrl = 'your_auth_Url';
$(document).ready(function(){
    
$("#feat").click(function() {
    $('html, body').animate({
        scrollTop: $("#features").offset().top
    }, 2000);
});

$("#conta").click(function() {
    $('html, body').animate({
        scrollTop: $("#contact").offset().top
    }, 2000);
});


    $(subm).click(function(){
        if (($('#first_name').val() && $('#email').val() && $('#message').val()) == "") {
            console.log("sorry");
            if ($('#first_name').val()=="") {$("#subm").text("Enter  name");}
            else if ( $('#email').val()=="" ) {$("#subm").text("Enter Email");}
            else if ($('#email').val().indexOf("@")<1 || $('#email').val().lastIndexOf(".")<$('#email').val().indexOf("@")+2 || $('#email').val().lastIndexOf(".")+2 >= $('#email').val().length) {$("#subm").text("Enter Valid Email");}
            else if ($('#message').val()=="" ) {$("#subm").text("Enter message");}
            else {$("#subm").text("Sending");}
        }
        else{
            $("#subm").text("Send");
        $.ajax({
            url: dataUrl+"/api/1/table/contact/insert",
                 contentType: 'application/json',
                method: 'post',
                dataType: 'json',
                 data: JSON.stringify( 
                    {
        "objects":[
            { "name": $('#first_name').val(),
              "email":$('#email').val(),
              "message":$('#message').val() }            
        ]
      })



                }).done(function(){
                    $('#first_name').val("")
                    $('#email').val("")
                    $('#message').val("")
                      alert("Message send successfully");
                      $("#subm").text("Message send successfully");
                }).fail(function(j){
                    console.error(j);
                    alert('Error occured try again');
                });
    }
    //else ka bracket
    });    
	
});
