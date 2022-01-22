$(document).ready(function() {
  
  var headerEl = document.querySelector("#fixedNav");
  var sentinalEl = document.querySelector("#intersect");

  function handler(entries) {
    // entries is an array of observed dom nodes
    // we're only interested in the first one at [0]
    // because that's our .sentinal node.
    // Here observe whether or not that node is in the viewport
    if (!entries[0].isIntersecting) {
      headerEl.classList.remove('hide');
    } else {
      headerEl.classList.add('hide');
    }
  }

  // create the observer
  var observer = new window.IntersectionObserver(handler);
  // give the observer some dom nodes to keep an eye on
  observer.observe(sentinalEl);

  $(function(){
    
    google.load("visualization", "1", {packages:["corechart"]});
    
    google.setOnLoadCallback(drawChart1);
    
    function drawChart1() {
    
        var data = new google.visualization.DataTable();
      
        data.addColumn('string','Frequency');
        data.addColumn('number','Number of People');
        data.addRows([
        ['Very Infrequently',  1],
        ['Infrequently',  7],
        ['Sometimes',  12],
        ['Frequently',  14],
        ['Very Frequently', 7]
      
      ]);

      var options = {
      
        title: 'How Often Do You Check In With Yourself Emotionally?',
        
        hAxis: {title: 'Frequency', titleTextStyle: {color: 'red'}}
     
      };

    var chart = new google.visualization.PieChart(document.getElementById('chart_div1'));
      
      chart.draw(data, options);
    
    }

    google.load("visualization", "1", {packages:["corechart"]});
    
    google.setOnLoadCallback(drawChart2);
    
    function drawChart2() {
    
      var data = new google.visualization.DataTable();
      
        data.addColumn('string','Frequency');
        data.addColumn('number','Number of People');
        data.addRows([
        ['Very Infrequently',  1],
        ['Infrequently',  10],
        ['Sometimes',  13],
        ['Frequently',  14],
        ['Very Frequently', 5]
      
      ]);

      var options = {
      
        title: 'How Often Do You Feel Overwhelmed By Your Emotions?',
        
        hAxis: {title: 'Frequency', titleTextStyle: {color: 'red'}}
     
      };


      var chart = new google.visualization.PieChart(document.getElementById('chart_div2'));
      chart.draw(data, options);
    
    }

    $(window).resize(function(){
    
      drawChart1();
      drawChart2();
    
    });
    
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
  
});