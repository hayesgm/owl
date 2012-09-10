/**
 * @author Geoff
 */

(function($){
	
	/* DOM parser for text/html, see http://stackoverflow.com/a/9251106/938089 */
	;(function(DOMParser) {"use strict";var DOMParser_proto=DOMParser.prototype,real_parseFromString=DOMParser_proto.parseFromString;try{if((new DOMParser).parseFromString("", "text/html"))return;}catch(e){}DOMParser_proto.parseFromString=function(markup,type){if(/^\s*text\/html\s*(;|$)/i.test(type)){var doc=document.implementation.createHTMLDocument(""),doc_elt=doc.documentElement,first_elt;doc_elt.innerHTML=markup;first_elt=doc_elt.firstElementChild;if (doc_elt.childElementCount===1&&first_elt.localName.toLowerCase()==="html")doc.replaceChild(first_elt,doc_elt);return doc;}else{return real_parseFromString.apply(this, arguments);}};}(DOMParser));

	/*
	 * @description              Validate a HTML string
	 * @param       String html  The HTML string to be validated 
	 * @returns            null  If the string is not wellformed XML
	 *                    false  If the string contains an unknown element
	 *                     true  If the string satisfies both conditions
	 */
	function validateHTML(html) {
		var parser = new DOMParser()
				, d = parser.parseFromString('<?xml version="1.0"?>'+html,'text/xml')
				, allnodes;
	    if (d.querySelector('parsererror')) {
				//console.log('Not welformed HTML (XML)!');
				return null;
			} else {
				/* To use text/html, see http://stackoverflow.com/a/9251106/938089 */
				d = parser.parseFromString(html, 'text/html');
				allnodes = d.getElementsByTagName('*');
				for (var i=allnodes.length-1; i>=0; i--) {
					if (allnodes[i] instanceof HTMLUnknownElement) return false;
				}
			}
			return true; /* The document is syntactically correct, all tags are closed */
	}
	
	
	$.fn.lesson = function() {
		return this.each(function() {
			var that = $(this);
			
			// 1) Build a lesson box
			var lesson = $('<div>').addClass('lesson'),
				head = $('<div>').addClass('head').appendTo(lesson),
				headText = $('<h1>').text('Lesson').appendTo(head),
				main = $('<div>').addClass('main').appendTo(lesson),
				blockLeft = $('<span>').addClass('split-block').appendTo(main),
				blockRight = $('<span>').addClass('split-block').appendTo(main),
				input = $('<textarea>').addClass('input').attr('placeholder', 'First, enter your HTML here').appendTo(blockLeft),
				iframe = $("<iframe>").attr('frameborder', 0),
				result = $("<span>").addClass('result').text('[Incomplete]').appendTo(head),
				next = $("<a>").addClass('next').text('Next').attr('href', 'javascript:void(0)').appendTo(head),
				doc = null,
				res = null,
				complete = false,
				problems = that.find('*[data-problem]'),
				desc = $('<span>').addClass('desc').appendTo(head);
			
			console.log(lesson);
			
			iframe[0].addEventListener('load', function() {
				doc = iframe.contents();
				res = doc[0].createElement('span');
				var resEm = doc[0].createElement('em');
				resEm.innerText = '[ Result will show up here ]';
				res.id = 'res';
				res.appendChild(resEm);
				doc[0].body.appendChild(res);
			});
			
			iframe.css('display', 'none');
			$(document.body).append(iframe);
			
			var setupProblem = function(problems, i) {
				if (problems.size() > i + 1) {
					next.click(function() {
						console.log(problems, i);
						resetProblem();
						setupProblem(problems, i+1)
					});
				} else { next.hide(); }
				
				var problem = $(problems[i]);
				
				desc.text(problem.data('problem'));
				
				input.keyup(function() {
					// Set html on res object
					doc.find('#res').html($(this).val());
					
					// Then check for success
					if (!complete) {
						if (doc.find('#res').find(problem.data('success-css')).size() > 0) {
							if (validateHTML($(this).val())) {
								complete = true;
								result.text('Success!').addClass('success');
							} else {
								result.text('[Incomplete - You need to close html tags.]');
							}
						} else {
							result.text('[Incomplete]');
						}
					}
				});
				
				var resetProblem = function() {
					result.text('[Incomplete]').removeClass('success');
					input.val('');
					var resEm = doc[0].createElement('em');
					resEm.innerText = '[ Result will show up here ]';
					res.appendChild(resEm);
				};

				// 2) Build a link
				var a = $('<a>').attr('href', 'javascript:void(0)').text('Lesson: ' + that.data('lesson'));
				that.after(a);

				// 3) Attach events
				a.click(function() {
					resetProblem();
					blockRight.append(iframe);
					//that.after(lesson);
					iframe.css('display', 'block');
					$.colorbox( { inline: true, href: lesson, transition: 'none' } );
				});
			};
			
			setupProblem(problems, 0);
			
		});
	};
	
	$(document).ready(function() {
		$('*[data-lesson]').lesson();
	});
	
})(jQuery);
