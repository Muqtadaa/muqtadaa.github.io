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
    console.log(entries);
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

  });

});
