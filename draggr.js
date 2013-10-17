/*
 * Draggr() - v0.2
 *
 * @author  Brandon Poe <brandonpoe@me.com>
 * @copyright 2013, Brandon Poe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */

;(function (win, doc) {
	'use strict';

	var mouseDownEvents = ['mousedown'];
	var mouseMoveEvents = ['mousemove'];
	var mouseUpEvents = ['mouseup'];
	var mouseLeaveEvents = ['mouseout', 'mouseleave'];
	var mouseEvents = mouseDownEvents.concat(mouseMoveEvents, mouseUpEvents, mouseLeaveEvents);

	var touchDownEvents = ['touchstart'];
	var touchMoveEvents = ['touchmove'];
	var touchUpEvents = ['touchend'];
	var touchLeaveEvents = ['touchout', 'touchleave'];
	var touchEvents = touchDownEvents.concat(touchMoveEvents, touchUpEvents, touchLeaveEvents);

	var pointerDownEvents = ['pointerdown'];
	var pointerMoveEvents = ['pointermove'];
	var pointerUpEvents = ['pointerup'];
	var pointerLeaveEvents = ['pointerout', 'pointerleave'];

	function Draggr(el, options)
	{
		var o = extend({}, Draggr.defaults, options);
		var self = this;
		var initialized = false;

		if (typeof el === 'string')
			el = doc.querySelectorAll(el);

		var pointerInfo = {
				1: {
					dragging: false
				}
			},
			downEvent = [],
			moveEvent = [],
			upEvent = [];

		if (o.upOnLeave)
		{
			mouseUpEvents = mouseUpEvents.concat(mouseLeaveEvents);
			touchUpEvents = touchUpEvents.concat(touchLeaveEvents);
			pointerUpEvents = pointerUpEvents.concat(pointerLeaveEvents);
		}
		if (o.hasMouse)
		{
			downEvent = mouseDownEvents;
			moveEvent = mouseMoveEvents;
			upEvent = mouseUpEvents;
		}
		if (o.hasTouch)
		{
			downEvent = downEvent.concat(touchDownEvents);
			moveEvent = moveEvent.concat(touchMoveEvents);
			upEvent = upEvent.concat(touchUpEvents);
		}
		if (o.hasPointer)
		{
			downEvent = downEvent.concat(pointerDownEvents);
			moveEvent = moveEvent.concat(pointerMoveEvents);
			upEvent = upEvent.concat(pointerUpEvents);
		}

		function pointerDown(evt)
		{
			evt.preventDefault();
			if (evt.type === 'mousemove')
			{
				evt.pointerId = 1;
			}
			else if (evt.type === 'touchmove')
			{
				var touch = evt.changedTouches[0];
				evt.pointerId = ( touch.identify || touch.identifier ) + 2;
				evt.clientX = touch.clientX;
				evt.clientY = touch.clientY;
			}

			pointerInfo[evt.pointerId] = {
				startX: evt.clientX,
				startY: evt.clientY,
				dragging: true
			};

			o.downCallback(evt);

			return false;
		}

		function pointerMove(evt)
		{
			if (evt.type === 'mousemove')
			{
				evt.pointerId = 1;
			}
			else if (evt.type === 'touchmove')
			{
				var touch = evt.changedTouches[0];
				evt.pointerId = ( touch.identify || touch.identifier ) + 2;
				evt.clientX = touch.clientX;
				evt.clientY = touch.clientY;
			}

			if (pointerInfo[evt.pointerId].dragging)
			{
				evt.preventDefault();

				pointerInfo[evt.pointerId].deltaX = pointerInfo[evt.pointerId].startX - evt.clientX;
				pointerInfo[evt.pointerId].deltaY = pointerInfo[evt.pointerId].startY - evt.clientY;

				requestAnimationFrame(o.moveCallback);

				return false;
			}
		}

		function pointerUp(evt)
		{
			if (mouseEvents.indexOf(evt.type) !== -1)
			{
				evt.pointerId = 1;
			}
			else if (touchEvents.indexOf(evt.type) !== -1)
			{
				var touch = evt.changedTouches[0];
				evt.pointerId = (touch.identify || touch.identifier)  + 2;
			}

			pointerInfo[evt.pointerId].dragging = false;

			o.upCallback(evt);
		}

		self.init = function()
		{
			if (initialized)
				return this;

			each(downEvent, function(event)
			{
				el.addEventListener(event, pointerDown, false);
			});
			each(moveEvent, function(event)
			{
				el.addEventListener(event, pointerMove, false);
			});
			each(upEvent, function(event)
			{
				el.addEventListener(event, pointerUp, false);
			});

			initialized = true;

			return this;
		};

		self.destroy = function()
		{
			downEvent.concat(moveEvent, upEvent).forEach( function(event)
			{
				el.removeEventListener(event);
			});

			initialized = false;
		};

		self.updateSettings = function(settings)
		{
			extend(o, settings);
		};

		self.reset = function()
		{

		};
	}

	function each(obj, callback)
	{
		for (var i in obj)
		{
			if(obj.hasOwnProperty(i))
			{
				callback(obj[i]);
			}
		}
	}

	function extend()
	{
		for(var i=1; i<arguments.length; i++)
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	}

	win.Draggr = Draggr;

	Draggr.defaults = {

		// Declare which event types to handle
		hasMouse: true,
		hasTouch: true,
		hasPointer: true,

		// If drag event exits container, pointerUp is triggered
		upOnLeave: true,

		// Event Callbacks
		downCallback: function(e) { },
		moveCallback: function() { },
		upCallback: function(e) { }
	};

}(window, document));