/**
 * @author Geoff
 */

(function($){
	
	$.fn.lesson = function() {
		return this.each(function() {
			var that = $(this);
			
			// 1) Build a lesson box
			var lesson = $('<div>').addClass('lesson'),
				blockLeft = $('<span>').addClass('block').appendTo(lesson),
				blockRight = $('<span>').addClass('block').appendTo(lesson),
				input = $('<textarea>').addClass('input').appendTo(blockLeft),
				iframe = $("<iframe>").attr('frameborder', 0),
				result = $("<span>").addClass('result').text('[Incomplete]').appendTo(blockRight),
				doc = null,
				res = null,
				complete = false,
				problems = that.find('*[data-problem]'),
				desc = $('<span>').addClass('desc').appendTo(blockRight);
			console.log(lesson);
			iframe[0].addEventListener('load', function() {
				doc = iframe.contents();
				var res = doc[0].createElement('span');
				res.id = 'res';
				doc[0].body.appendChild(res);
			});
			
			iframe.css('display', 'none');
			$(document.body).append(iframe);
				
			var setupProblem = function(problem) {
				
				desc.text(problem.data('problem'));
				
				input.keyup(function() {
					// Set html on res object
					doc.find('#res').html($(this).val());

					// Then check for success
					if (!complete) {
						if (doc.find('#res').find(problem.data('success-css')).size() > 0) {
							complete = true;
							result.text('Success!').addClass('success');
						}
					}
				});

				// 2) Build a link
				var a = $('<a>').attr('href', 'javascript:void(0)').text('Lesson: ' + that.data('lesson'));
				that.after(a);

				// 3) Attach events
				a.click(function() {
					blockRight.append(iframe);
					that.after(lesson);
					iframe.css('display', 'block');
				});
			};
			
			setupProblem($(problems[0]));
			
		});
	};
	
	$(document).ready(function() {
		$('*[data-lesson]').lesson();
	});
	
})(jQuery);
