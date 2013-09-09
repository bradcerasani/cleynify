// Pull hashes from URL string
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

// Send URL data to notepad
var toName = $.getUrlVar('to');
var fromName = $.getUrlVar('from');
var msgBody = $.getUrlVar('msgBody');

function urlNotePush(item, destination) {
	if (item != undefined) {
		$(destination).text(decodeURI(item));
	}
}

urlNotePush(toName, '#recipient');
urlNotePush(fromName, '#sender');
urlNotePush(msgBody, '#text p');

// Limit characters for msgBody
var count = $("#count");
  $.fn.extend( {
    limiter: function(limit, threshold, elem) {
      $(this).on("keyup focus", function() {
        setCount(this, elem);
      });
      function setCount(src, elem) {
        var chars = src.value.length;
        if (chars > limit) {
          src.value = src.value.substr(0, limit);
          chars = limit;
        }
        if (chars >= (limit - threshold)) {
          if (!count.hasClass('red')) {
            count.addClass('red');
          }
        } else if (count.hasClass('red')) {
          count.removeClass('red');
        }
        elem.html( limit - chars );
      }
    setCount($(this)[0], elem);
	  }
	});

$("#msgBody").limiter(160, 20, count);

// Send form input to notepad
function inputNotePush(input, destination) {
  $(input).keyup(function(e) {
    newText = e.target.value;
    $(destination).text(newText);
  });
};

inputNotePush("#toName", "#recipient");
inputNotePush("#fromName", "#sender");
inputNotePush("#msgBody", "#text p");

// Make custom URL
$('#urlGenerator').click(function() {
  function encode(elem) {
		var elemText = elem.text();
		var encoded = encodeURIComponent(elemText);
		return encoded;
	};

	var enTo = encode($("#recipient"));
	var enFrom = encode($("#sender"));
	var enMsgBody = encode($("#text p"));
	var baseURL = "http://hire.bradcerasani.me/cleynify/"
	var longURL = baseURL + "?to=" + enTo + "&from=" + enFrom + "&msgBody=" + enMsgBody

	// Squash URL
	function getShortURL(func) {
    $.getJSON(
      "http://api.bitly.com/v3/shorten?callback=?",
      {
        "format": "json",
        "apiKey": "R_86089c074e49be002ac47bf09cf61467",
        "login": "o_72q1njcuja",
        "longUrl": longURL
      },
      function(response) {
        func(response.data.url);
       }
    );
	};

	getShortURL(function(shortURL) {
  	var target = $("#shortURL");
    var button = $('#urlGenerator');
  	var link = $('<input />');

    target.attr('value', shortURL);
    button.text('Update URL');
	});
});
