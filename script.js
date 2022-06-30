// JavaScript Document
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

window.onload = function () {
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

  const maxTrail = 100;
  let trailIndex = 0;
  const moveThreshold = 10;
  const maxSpeed = 5000;
  const maxSize = 24;
  const maxColor = 16777215;
  let x = 0;
  let y = 0;
  let diffX = 0;
  let diffY = 0;
  let trailSwitch = false;

  window.addEventListener("mousemove", (e) => {
    if(trailSwitch) {
      diffX = Math.abs(x - e.offsetX);
      diffY = Math.abs(y - e.offsetY);
      if (diffX >= moveThreshold || diffY >= moveThreshold) {
        spawnTrail(e);
      }

      x = e.offsetX;
      y = e.offsetY;
    }
  });

  function spawnTrail(e) {
    if (trailIndex >= maxTrail) return;
    trailIndex++;
    const trail = document.createElement("div");

    let size = Math.floor(Math.random() * maxSize + 1) + "px";
    let speed = Math.floor(Math.random() * maxSpeed + 1);
    let color = "#" + Math.floor(Math.random() * maxColor).toString(16);
    trail.classList.add("trail");
    trail.style.backgroundColor = color;
    trail.style.left = e.pageX + "px";
    trail.style.top = e.pageY + "px";
    trail.style.width = size;
    trail.style.animation = "trail " + speed + "ms linear forwards";
    setTimeout(function () {
      trail.remove();
      trailIndex--;
    }, speed);

    document.body.appendChild(trail);
  }
  
  document.querySelector('.sparkles').addEventListener('click',function() {
    document.querySelector('.sparkles').classList.toggle('on');
    
    if(trailSwitch) {
      trailSwitch = false;
    } else {
      trailSwitch = true;
      $('.celebration').fadeToggle();
      setTimeout(function() {
        $('.celebration').fadeToggle();
      },2500);
    }
  });
}

$(document).ready(function () {

  $(function () {

    if (getCookie("warningClosed") != "true") {
      $(".warning").css("display", "block");
    }

    $(".name").on("click", function () {

      $(".photo").slideToggle();

    });

    $("div.skills.row > div > div.uxdesign.three.columns").on("click", function () {

      $("div.skills.row > div > div.uxdesign.three.columns > div:nth-child(3)").slideToggle();

      $("div.skills.row > div > div.uxdesign.three.columns > h2 > i").toggleClass("fa-caret-down");

      $("div.skills.row > div > div.uxdesign.three.columns > h2 > i").toggleClass("fa-caret-up");

    });

    $("div.skills.row > div > div.engineering.three.columns").on("click", function () {

      $("div.skills.row > div > div.engineering.three.columns > div:nth-child(3)").slideToggle();

      $("div.skills.row > div > div.engineering.three.columns > h2 > i").toggleClass("fa-caret-down");

      $("div.skills.row > div > div.engineering.three.columns > h2 > i").toggleClass("fa-caret-up");

    });

    $("div.skills.row > div > div.uidesign.three.columns").on("click", function () {

      $("div.skills.row > div > div.uidesign.three.columns > div:nth-child(3)").slideToggle();

      $("div.skills.row > div > div.uidesign.three.columns > h2 > i").toggleClass("fa-caret-down");

      $("div.skills.row > div > div.uidesign.three.columns > h2 > i").toggleClass("fa-caret-up");

    });

    $("div.skills.row > div > div.marketing.three.columns").on("click", function () {

      $("div.skills.row > div > div.marketing.three.columns > div:nth-child(3)").slideToggle();

      $("div.skills.row > div > div.marketing.three.columns > h2 > i").toggleClass("fa-caret-down");

      $("div.skills.row > div > div.marketing.three.columns > h2 > i").toggleClass("fa-caret-up");

    });

    $("#closeWarning").on("click", function () {

      $(".warning").slideToggle();

      setCookie("warningClosed", "true", 30);

    });

    $('.nav-link h5').on('click', function () {
      $('.nav-menu').slideToggle();
    });

  });

});
