$(document).ready(function() {
  
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
    
  });
  
});