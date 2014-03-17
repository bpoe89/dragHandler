Draggr()
====

handle drag events from mouse, touch, and pointer in a method that is as light weight as possible.

Before Getting Started
---
Draggr does not rely on any javascript libraries, however, it should be noted that it uses requestAnimationFrame, which isn't supported in IE9 and lower as well as older iOS (4.3-) and Android (2.3-). If you need to support any of these devises, you will need to include Paul Irish's polyfill (it is included in the "libs" folder).

How to Use
---
Implementing Draggr is fairly easy. To get started, just call it like so:

	var draggr = new Draggr('.selected-element');

In an AngularJS directive, you could call:

	var draggr = new Draggr(element[0]);

Options
---
You can add options using an object as the second parameter of initializing Draggr.

	var draggr = new Draggr('.selected-element', {
        hasPointer: false
	});

The following are the available options and their defaults:

	var draggr = new Draggr('.selected-element', {

		// Event listeners
        hasMouse: true, // If false, Draggr will not capture mouse events (clicking, dragging)
        hasTouch: true, // If false, Draggr will not capture touch events (touchstart, touchend)
        hasPointer: true, // If false, Draggr will not capture pointer events (used on MS tablets)

        upOnLeave: true, // If false and drag event exits container, the drag event will persist

        // Event Callbacks
        downCallback: function(e) { }, // Function callback for mousedown / touchstart event
        moveCallback: function() { }, // Function callback for dragging event
        upCallback: function(e) { } // Function callback for mouseup / touchend event
	});

Callbacks
---

Callback functions are given 2 parameters. The first parameter is the original event data. The second is information about the dragging event.
The second parameter is an object with the following keys:

- **startX** // Distance, in pixels, of the origin of the dragging event from the left side of the screen
- **startY** // Distance, in pixels, of the origin of the dragging event from the top of the screen
- **deltaX** // Distance, in pixels, of the current dragging position from the point of origin. Positive is left, negative is right.
- **deltaY** // Distance, in pixels, of the current dragging position from the point of origin. Positive is down, negative is up.
- **dragging** // If dragging has stopped (mouseup / touchend event has fired) this value will be false, otherwise it will return true.