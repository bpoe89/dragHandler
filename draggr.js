/*
 * Draggr() - v0.2.1
 *
 * @author  Brandon Poe <brandonpoe@me.com>
 * @copyright 2013, Brandon Poe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */

;(function (win, doc) {
	'use strict';

	var mouseDownEvent = 'mousedown';
	var mouseMoveEvent = 'mousemove';
	var mouseUpEvent = ['mouseup'];
	var mouseLeaveEvent = 'mouseleave';
	var mouseEvents = [mouseDownEvent, mouseMoveEvent, mouseLeaveEvent].concat(mouseUpEvent);

	var touchDownEvent = 'touchstart';
	var touchMoveEvent = 'touchmove';
	var touchUpEvent = ['touchend', 'touchcancel'];
	var touchLeaveEvent = 'touchleave';
	var touchEvents = [touchDownEvent, touchMoveEvent, touchLeaveEvent].concat(touchUpEvent);

	var pointerDownEvent = 'pointerdown';
	var pointerMoveEvent = 'pointermove';
	var pointerUpEvent = ['pointerup'];
	var pointerLeaveEvent = 'pointerleave';
	var pointerEvents = [pointerDownEvent, pointerMoveEvent, pointerLeaveEvent].concat(pointerUpEvent);

	function Draggr(el, options)
	{
		var raf;

		var o = extend({}, Draggr.defaults, options);
		var self = this;
		var initialized = false;

		if (typeof el === 'string')
			el = doc.querySelector(el);

		var pointerInfo = {
				queued: false,
				1: {
					dragging: false
				}
			},
			downEvent = [],
			moveEvent = [],
			upEvent = [];

		if (o.upOnLeave)
		{
			mouseUpEvent.push(mouseLeaveEvent);
			touchUpEvent.push(touchLeaveEvent);
			pointerUpEvent.push(pointerLeaveEvent);
		}
		if (o.hasMouse)
		{
			downEvent.push(mouseDownEvent);
			moveEvent.push(mouseMoveEvent);
			upEvent = upEvent.concat(mouseUpEvent);
		}
		if (o.hasTouch)
		{
			downEvent.push(touchDownEvent);
			moveEvent.push(touchMoveEvent);
			upEvent = upEvent.concat(touchUpEvent);
		}
		if (o.hasPointer)
		{
			downEvent.push(pointerDownEvent);
			moveEvent.push(pointerMoveEvent);
			upEvent = upEvent.concat(pointerUpEvent);
		}

		function pointerDown(evt)
		{
			//evt.preventDefault();

			var id = getPointerId(evt);

			if (touchEvents.indexOf(evt.type) !== -1)
			{
				evt.clientX = evt.changedTouches[0].clientX;
				evt.clientY = evt.changedTouches[0].clientY;
			}

			pointerInfo[id] = {
				startX: evt.clientX,
				startY: evt.clientY,
				dragging: true
			};

			o.downCallback(evt, pointerInfo[id]);

			return false;
		}

		function pointerMoveCallback()
		{
			o.moveCallback(pointerInfo.queued, pointerInfo[pointerInfo.queued.pointerId]);
			pointerInfo.queued = false;
		}

		function pointerMove(evt)
		{
			var id = evt.pointerId = getPointerId(evt);

			if (touchEvents.indexOf(evt.type) !== -1)
			{
				evt.clientX = evt.changedTouches[0].clientX;
				evt.clientY = evt.changedTouches[0].clientY;
			}

			if (pointerInfo[id].dragging)
			{
				evt.preventDefault();

				pointerInfo[id].deltaX = pointerInfo[id].startX - evt.clientX;
				pointerInfo[id].deltaY = pointerInfo[id].startY - evt.clientY;

				if (!pointerInfo.queued)
				{
					pointerInfo.queued = evt;
					raf = requestAnimationFrame(pointerMoveCallback);
				}

				return false;
			}
		}

		function pointerUp(evt)
		{
			window.cancelAnimationFrame(raf);
			pointerInfo.queued = false;

			var id = getPointerId(evt);

			if (pointerInfo[id].dragging)
				o.upCallback(evt, pointerInfo[id]);

			pointerInfo[id].dragging = false;
		}

		function getPointerId(evt)
		{
			if (mouseEvents.indexOf(evt.type) !== -1)
				return 1;

			if (touchEvents.indexOf(evt.type) !== -1)
				return (evt.changedTouches[0].identify || evt.changedTouches[0].identifier)  + 2;

			if (pointerEvents.indexOf(evt.type) !== -1)
				return evt.pointerId;

			return 1;
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

})(window, document);