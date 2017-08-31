(function($) {

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 980px)',
		narrower: '(max-width: 840px)',
		mobile: '(max-width: 736px)',
		mobilep: '(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on narrower.
			skel.on('+narrower -narrower', function() {
				$.prioritize(
					'.important\\28 narrower\\29',
					skel.breakpoint('narrower').active
				);
			});

		// Dropdowns.
			$('#nav > ul').dropotron({
				offsetY: -15,
				hoverDelay: 0,
				alignment: 'center'
			});

		// Off-Canvas Navigation.

			// Title Bar.
				$(
					'<div id="titleBar">' +
						'<a href="#navPanel" class="toggle"></a>' +
						'<span class="title">' + $('#logo').html() + '</span>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#titleBar, #navPanel, #page-wrapper')
						.css('transition', 'none');

	});


	// Footer form submit code
	$("#contact").submit(function () {
		var b = $("#name").val();
        var c = $("#email").val();
        var d = $("#message").val();

        $(".loading").fadeIn("fast");

        function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
        } 

        var email = $("#email").val();
        var i = isValidEmailAddress(email);
        if (b != "" && b != "Name" && d != "" && d != "Message" && c != "" && c != "E-mail" && i != false) {
            $.ajax({
                url: "./sendmail.php",
                type: "POST",
                data: "cname=" + b + "&cemail=" + c + "&cmessage=" + d,
                success : function(event) {
                var strtosearch = /Success/;
                var f = event.search(strtosearch);

                if(f != -1){
                    $('#contact').html("<div id='message_'></div>");  
                    $('#message_').html("<h3>Contact Form Submitted!</h3>")  
                    .append("<p>We will be in touch soon.</p>")  
                    .hide()  
                    .fadeIn(1500, function() {  
                    $('#message_').append("Thank you");  
                    });  
                    $("#loader").hide();
                }//end if for success
                return false;    
                } //end success function

            });
            return false;
        } else {
            $(".loading")
                .fadeOut("fast");
            if (b == "Name" || b == "") $("#name")
                .css({
                border: "1px solid #FFA8A8"
            })
                .next(".require")
                .text(" !");
            if (c == "E-mail" || c == "" || i == false) {
                $("#email").css({
                border: "1px solid #FFA8A8"
                })                
                .next(".require")
                .text(" !");
            }
            if (d == "Message" || d == "") $("#message")
                .css({
                border: "1px solid #FFA8A8"
            })
                .next(".require")
                .text(" !");
            return false
        }
    });
    $("#name, #email, #message")
        .focus(function () {
        $(this)
            .css({
            border: "1px solid #ECECEC"
        })
            .next(".require")
            .text(" *")
    });


})(jQuery);