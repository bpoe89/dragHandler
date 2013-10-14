;(function ($, w, d) {
	var namespace = 'draggr';

	function Draggr(el, options)
	{
		var o = $.extend({}, Draggr.defaults, options, $(el).data('draggr'));
		var self = this;
		var $el = $(el);

		var mouseEvents = ['mouseup', 'mouseout', 'mouseleave'],
			touchEvents = ['touchend', 'touchout', 'touchleave'];

		var pointerInfo = {},
			pointerDownEvent = '',
			pointerMoveEvent = '',
			pointerUpEvent = '';

		if (o.hasMouse)
		{
			pointerDownEvent = 'mousedown.' + namespace;
			pointerMoveEvent = 'mousemove.' + namespace;
			pointerUpEvent = 'mouseup.' + namespace + ' mouseout.' + namespace + ' mouseleave.' + namespace;
		}
		if (o.hasTouch)
		{
			pointerDownEvent += ' touchdown.' + namespace;
			pointerMoveEvent += ' touchmove.' + namespace;
			pointerUpEvent += ' touchend.' + namespace + ' touchout.' + namespace + ' touchleave.' + namespace;
		}
		if (o.hasPointer)
		{
			pointerDownEvent += ' pointerdown.' + namespace;
			pointerMoveEvent += ' pointermove.' + namespace;
			pointerUpEvent += ' pointerup.' + namespace + ' pointerout.' + namespace + ' pointerleave.' + namespace;
		}

		$.trim(pointerDownEvent);
		$.trim(pointerMoveEvent);
		$.trim(pointerUpEvent);

		function pointerDown(e)
		{
			e.preventDefault();
			var evt = e.originalEvent;

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
				startX: e.clientX,
				startY: e.clientY,
				dragging: true
			};

			o.downCallback(e);

			return false;
		}

		function pointerMove(e)
		{
			var evt = e.originalEvent;
			if (e.type === 'mousemove')
			{
				evt.pointerId = 1;
			}
			else if (e.type === 'touchmove')
			{
				var touch = evt.changedTouches[0];
				evt.pointerId = ( touch.identify || touch.identifier ) + 2;
				evt.clientX = touch.clientX;
				evt.clientY = touch.clientY;
			}

			if (pointerInfo[evt.pointerId].dragging)
			{
				e.preventDefault();

				pointerInfo[evt.pointerId].deltaX = pointerInfo[evt.pointerId].startX - e.clientX;
				pointerInfo[evt.pointerId].deltaY = pointerInfo[evt.pointerId].startY - e.clientY;

				requestAnimationFrame(o.moveCallback);

				return false;
			}
		}

		function pointerUp(e)
		{
			var evt = e.originalEvent;
			if ($.inArray(e.type, mouseEvents) !== -1)
			{
				evt.pointerId = 1;
			}
			else if ($.inArray(e.type, touchEvents) !== -1)
			{
				var touch = evt.changedTouches[0];
				evt.pointerId = (touch.identify || touch.identifier)  + 2;
			}

			pointerInfo[evt.pointerId].dragging = false;

			o.upCallback(e);
		}

		self.init = function()
		{
			$el.on(pointerDownEvent, pointerDown);
			$el.on(pointerMoveEvent, pointerMove);
			$el.on(pointerUpEvent, pointerUp);
		};

		self.updateSettings = function(settings)
		{
			$.extend(o, settings);
		};

		self.reset = function()
		{

		};
	}

	Draggr.defaults = {

		//Declare which event types to handle
		hasMouse: true,
		hasTouch: true,
		hasPointer: true,

		// Event Callbacks
		downCallback: function(e) { },
		moveCallback: function() { },
		upCallback: function(e) { }
	};

	$.fn.draggr = function(settings)
	{
		return this.each( function() {
			if (!this.draggr)
			{
				this.draggr = new Draggr(this, settings).init();
			}
			else if (settings && typeof settings === 'object')
			{
				this.draggr.updateSettings(settings);
			}
			else
			{
				this.draggr.reset();
			}
		});
	};
}(jQuery, window, document));