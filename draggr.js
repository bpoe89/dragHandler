/*
 * underscore.draggr() - v0.1
 *
 * @author  Brandon Poe <brandonpoe@me.com>
 * @copyright 2013, Brandon Poe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */

;(function (_, win, doc) {

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
		var o = _.extend({}, Draggr.defaults, options);
		var self = this;
		console.log(el);
		el = doc.querySelectorAll(el);
		console.log(self);
		console.log(el);

		var pointerInfo = {},
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

		downEvent = downEvent.join(' ');
		moveEvent = moveEvent.join(' ');
		upEvent = upEvent.join(' ');

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
			if (_.indexOf(mouseEvents, evt.type) !== -1)
			{
				evt.pointerId = 1;
			}
			else if (_.indexOf(touchEvents, evt.type) !== -1)
			{
				var touch = evt.changedTouches[0];
				evt.pointerId = (touch.identify || touch.identifier)  + 2;
			}

			pointerInfo[evt.pointerId].dragging = false;

			o.upCallback(evt);
		}

		self.init = function()
		{
			_.forEach(downEvent, function(event) {
				el.addEventListener(event, pointerDown, false);
			});
			_.forEach(moveEvent, function(event) {
				el.addEventListener(event, pointerMove, false);
			});
			_.forEach(upEvent, function(event) {
				el.addEventListener(event, pointerUp, false);
			});
		};

		self.updateSettings = function(settings)
		{
			_.extend(o, settings);
		};

		self.reset = function()
		{

		};
	}

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

}(_, window, document));