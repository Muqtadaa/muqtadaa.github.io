$(document).ready(function() {
  
  $(function(){
    
    $("#whatIsYolk").on("click", function() {
      $("#whatIsYolk1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".bodytext").slideToggle();
    });
    
    $("#framingTheDesign").on("click", function() {
      $("#framingTheDesign1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".frameText").slideToggle();
    });
    
    $("#exploratory").on("click", function() {
      $("#exploratory1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".researchText").slideToggle();
    });
    
    $("#userResearch").on("click", function() {
      $("#userResearch1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".userResearch").slideToggle();
    });
    
    $("#userPersona").on("click", function() {
      $("#userPersona1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".userPersona").slideToggle();
      $(".persona").slideToggle();
    });
    
    $("#wireframes").on("click", function() {
      $("#wireframes1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".wireframes").slideToggle();
    });
    
    $("#onboarding").on("click", function() {
      $("#onboarding1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".onboarding").slideToggle();
    });
    
    $("#final").on("click", function() {
      $("#final1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".final").slideToggle();
    });
    
    $("#acknowledgements").on("click", function() {
      $("#acknowledgements1").toggleClass("fa-chevron-right fa-chevron-down");
      $(".acknowledgements").slideToggle();
    });
    
  });
  
});// JavaScript Document