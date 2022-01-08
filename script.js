// JavaScript Document
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

$(document).ready(function(){
  
  $(function() {
    
    if(getCookie("warningClosed") != "true") {
      $(".warning").css("display","block");
    }
    
    $(".name").on("click", function(){
  
      $(".photo").slideToggle(); 
    
    });
    
    $("body > div:nth-child(2) > div.skills.row > div > div.uxdesign.three.columns > h2").on("click", function(){
    
      $("body > div:nth-child(2) > div.skills.row > div > div.uxdesign.three.columns > div:nth-child(3)").slideToggle();
      
      $("body > div:nth-child(2) > div.skills.row > div > div.uxdesign.three.columns > h2 > i").toggleClass("fa-caret-down");
      
      $("body > div:nth-child(2) > div.skills.row > div > div.uxdesign.three.columns > h2 > i").toggleClass("fa-caret-up");
    
    });
    
    $("body > div:nth-child(2) > div.skills.row > div > div.engineering.three.columns > h2").on("click", function(){
    
      $("body > div:nth-child(2) > div.skills.row > div > div.engineering.three.columns > div:nth-child(3)").slideToggle();
      
      $("body > div:nth-child(2) > div.skills.row > div > div.engineering.three.columns > h2 > i").toggleClass("fa-caret-down");
      
      $("body > div:nth-child(2) > div.skills.row > div > div.engineering.three.columns > h2 > i").toggleClass("fa-caret-up");
    
    });
    
    $("body > div:nth-child(2) > div.skills.row > div > div.uidesign.three.columns > h2").on("click", function(){
    
      $("body > div:nth-child(2) > div.skills.row > div > div.uidesign.three.columns > div:nth-child(3)").slideToggle();
      
      $("body > div:nth-child(2) > div.skills.row > div > div.uidesign.three.columns > h2 > i").toggleClass("fa-caret-down");
      
      $("body > div:nth-child(2) > div.skills.row > div > div.uidesign.three.columns > h2 > i").toggleClass("fa-caret-up");
    
    });
    
    $("body > div:nth-child(2) > div.skills.row > div > div.marketing.three.columns > h2").on("click", function(){
    
      $("body > div:nth-child(2) > div.skills.row > div > div.marketing.three.columns > div:nth-child(3)").slideToggle();
      
      $("body > div:nth-child(2) > div.skills.row > div > div.marketing.three.columns > h2 > i").toggleClass("fa-caret-down");
      
      $("body > div:nth-child(2) > div.skills.row > div > div.marketing.three.columns > h2 > i").toggleClass("fa-caret-up");
    
    });
    
    $("#closeWarning").on("click", function() {
      
      $(".warning").slideToggle();
      
      setCookie("warningClosed","true",30);
    
    });
    
  });
  
});