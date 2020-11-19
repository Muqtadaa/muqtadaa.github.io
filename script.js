// JavaScript Document
$(document).ready(function(){
  
  $(function() {
    
    $(".name").on("click", function(){
  
      $(".photo").slideToggle(); 
    
    });
    
    $("#skillsBtn").on("click", function(){
    
      $("#downBTN").slideToggle();
      
      $("#infoRow").slideToggle();
      
      $("#upBTN").slideToggle();
    
    });
    
  });
  
});