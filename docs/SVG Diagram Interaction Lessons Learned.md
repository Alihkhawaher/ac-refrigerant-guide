# SVG Diagram Interaction — Issues & Solutions

## Overview
This document records all issues encountered while implementing draggable, interactive SVG diagram components in the AC Refrigerant Guide HTML application. The diagram is a P&ID (Piping & Instrumentation Diagram) showing AC system components with pipes, labels, and measurement points.

---

## Issue 1: Empty Diagram — `ReferenceError` on `_diagPos`

### Problem
After initial implementation, the diagram rendered completely empty with no visible components or pipes.

### Root Cause
`_diagPos` was referenced without the `window.` prefix in the guard condition:
```javascript
// BROKEN — _diagPos is not declared as a local or global variable
if (!_diagPos) {
    window._diagPos = { ... };
}
```
JavaScript threw a `ReferenceError` when evaluating `if (!_diagPos)`, which silently crashed `renderDiagram()`.

### Fix
```javascript
// FIXED — use window. prefix for the check
if (!window._diagPos) {
    window._diagPos = { ... };
}
```

### Lesson
When using undeclared global variables in JavaScript, always reference them via `window.varName` for both reading and writing to avoid `ReferenceError` in strict mode or when the variable hasn't been declared with `var`/`let`/`const`.

---

## Issue 2: Components Not Draggable (Moved 1-2 Pixels Then Stopped)

### Problem
Dragging a component box moved it only 1-2 pixels, then it "stuck" and wouldn't continue moving.

### Root Cause
During drag, `renderDiagram()` was called on every `mousemove` event. This function replaces the entire SVG via `innerHTML`, which **destroys the DOM element** that the `mousemove` listener was attached to. The sequence:

1. User clicks component → `mousedown` fires on SVG rect → sets `_compDragKey`
2. User moves mouse → `mousemove` fires on the **old SVG element** → updates position → calls `renderDiagram()`
3. `renderDiagram()` replaces `innerHTML` → **old SVG element is removed from DOM**
4. Next `mousemove` → the listener is on the removed element → **never fires**
5. Drag effectively stops after 1 re-render

### Fix
Changed all drag-tracking event listeners from the SVG element to the **container div** (`#jointDiagram`), which persists across SVG re-renders:

```javascript
// BEFORE (broken) — attached to SVG element that gets destroyed
svgEl.addEventListener('mousemove', function(e) { ... });
svgEl.addEventListener('mouseup', function() { ... });
svgEl.addEventListener('mouseleave', function() { ... });

// AFTER (fixed) — attached to container that persists
container.addEventListener('mousemove', function(e) { ... });
container.addEventListener('mouseup', function() { ... });
container.addEventListener('mouseleave', function() { ... });
```

Inside the `mousemove` handler, the SVG element is re-queried each time for coordinate calculations:
```javascript
var curSvg = document.getElementById('diagramSVG');
if (!curSvg) return;
var r = curSvg.getBoundingClientRect();
```

### Lesson
When implementing drag-and-drop on dynamically recreated DOM elements, attach persistent event listeners to a **stable parent container** rather than the elements being recreated. Use `getElementById()` to re-query transient elements inside handlers.

---

## Issue 3: Duplicate Event Listeners on Every Re-render

### Problem
Every call to `renderDiagram()` added new event listeners to the container and document (`wheel`, `mousedown`, `mousemove`, `mouseup`, `touchstart`, `touchmove`, `touchend`). After many re-renders (especially during drag which calls `renderDiagram()` on every mousemove), there could be hundreds of duplicate listeners causing performance degradation.

### Fix
Introduced a `_diagEventsAttached` guard flag. Container-level and document-level listeners are only attached once:

```javascript
var _diagEventsAttached = false;

// Inside renderDiagram():
if (!_diagEventsAttached) {
    _diagEventsAttached = true;
    // Attach all container/document listeners here
    container.addEventListener('wheel', ...);
    container.addEventListener('mousedown', ...);
    document.addEventListener('mousemove', ...);
    // etc.
}
```

### Lesson
When re-rendering dynamic content that needs event listeners, distinguish between:
- **Persistent listeners** (on stable containers) → attach once with a guard flag
- **Per-element listeners** (on recreated elements) → use event delegation instead

---

## Issue 4: Text Selection Interfering with Dragging

### Problem
When dragging components, the browser's default text selection behavior would select text labels inside the SVG, causing visual artifacts and interfering with the drag gesture.

### Fix
Added `user-select: none` to the diagram container CSS:

```css
#jointDiagram {
    user-select: none;
    -webkit-user-select: none;
}
```

### Lesson
Always disable text selection on interactive drag regions to prevent the browser's native selection behavior from conflicting with custom drag implementations.

---

## Issue 5: Scroll Zoom Too Dramatic

### Problem
The scroll wheel zoom was too aggressive (0.15 step per scroll tick), making it difficult to zoom to a precise level.

### Fix
Reduced the zoom step from 0.15 to 0.05 (3x smoother):

```javascript
// BEFORE
_diagScale += e.deltaY > 0 ? -0.15 : 0.15;

// AFTER
_diagScale += e.deltaY > 0 ? -0.05 : 0.05;
```

### Lesson
Zoom sensitivity should be calibrated carefully. A step of 0.05 provides ~20 scroll ticks to go from 100% to 200% zoom, which feels natural for most users.

---

## Issue 6: Measurement Labels Intercepting Component Clicks

### Problem
When clicking on a component box (e.g., EVAPORATOR), the click would sometimes activate panning instead of component dragging. This happened because measurement point labels, pipe labels, and other overlay SVG elements were drawn **on top** of the component rects and intercepted the click events.

### SVG Layering
The SVG structure has multiple layers:
```
Layer 1: Background zones (rect)
Layer 2: Pipe lines (path)
Layer 3: Component boxes (rect with data-comp attribute)  ← INTERACTIVE
Layer 4: Text labels on components (text with pointer-events:none)
Layer 5: Pipe labels with background rects  ← INTERCEPTING CLICKS
Layer 6: Measurement points with background rects  ← INTERCEPTING CLICKS
```

Layer 5 and 6 elements are drawn on top of Layer 3 components, so their background rects receive the click instead of the component rect underneath.

### Fix
Added CSS rules to make all non-component SVG elements transparent to mouse events:

```css
/* All SVG text, circles, paths are non-interactive */
#jointDiagram svg text,
#jointDiagram svg circle,
#jointDiagram svg path {
    pointer-events: none;
}

/* All rects except component boxes are non-interactive */
#jointDiagram svg rect:not([data-comp]) {
    pointer-events: none;
}
```

The `:not([data-comp])` selector specifically excludes component boxes, which retain their default `pointer-events` behavior.

### Lesson
In complex SVG diagrams with overlapping layers, explicitly manage `pointer-events` on each layer. Use CSS selectors to make overlay elements (labels, decorations, measurement points) pass-through while keeping interactive elements (component boxes) clickable. The `pointer-events: none` CSS property causes clicks to pass through to elements underneath.

---

## Issue 7: Zoom/Pan State Lost on SVG Re-render

### Problem
After zooming or panning the diagram, clicking a component or changing the ambient temperature slider would reset the zoom level and pan position to defaults. The diagram would jump back to the centered, unzoomed view.

### Root Cause
`renderDiagram()` replaces the SVG via `innerHTML`, creating a new SVG element. The CSS `transform` (which holds the zoom/pan state) was applied to the **old** SVG element, which was destroyed. The new SVG started with no transform.

The zoom/pan state was correctly preserved in global variables (`_diagScale`, `_diagPanX`, `_diagPanY`), but `applyDiagramTransform()` was never called on the new SVG element.

### Fix
Added `applyDiagramTransform()` immediately after inserting the new SVG:

```javascript
document.getElementById('jointDiagram').innerHTML = svg;
applyDiagramTransform();  // ← Re-apply zoom/pan to the new SVG
```

The `applyDiagramTransform()` function queries for the current SVG element and applies the stored transform:
```javascript
function applyDiagramTransform() {
    var svg = document.getElementById('diagramSVG');
    if (!svg) return;
    svg.style.transform = 'translate('+_diagPanX+'px,'+_diagPanY+'px) scale('+_diagScale+')';
    svg.style.transformOrigin = '0 0';
    // Update zoom level display
}
```

### Lesson
When dynamically replacing DOM elements that have CSS transforms applied, always re-apply the transform after insertion. Store transform state in JavaScript variables, not just in CSS, so it survives DOM replacement.

---

## Summary of Architectural Patterns

### Event Delegation for Dynamic SVG
Instead of attaching listeners to individual SVG elements (which get destroyed on re-render), use event delegation on the stable container:

```javascript
container.addEventListener('mousedown', function(e) {
    var t = e.target, compEl = null;
    while (t && t !== container) {
        if (t.getAttribute && t.getAttribute('data-comp')) {
            compEl = t; break;
        }
        t = t.parentElement;
    }
    // Handle based on compEl
});
```

### Global State for Transform Persistence
```javascript
var _diagScale = 1, _diagPanX = 0, _diagPanY = 0;
var _diagCompData = {};
var _diagEventsAttached = false;
var _compDragKey = null, _compDragOffX = 0, _compDragOffY = 0;
```

### CSS for Non-Interactive Overlays
```css
#jointDiagram svg text, #jointDiagram svg circle, #jointDiagram svg path { pointer-events: none; }
#jointDiagram svg rect:not([data-comp]) { pointer-events: none; }
#jointDiagram .diag-comp { cursor: move !important; }
#jointDiagram { user-select: none; -webkit-user-select: none; }
```

### Re-apply Transforms After DOM Replacement
```javascript
document.getElementById('jointDiagram').innerHTML = newSvgContent;
applyDiagramTransform();  // Critical: re-apply stored zoom/pan state