import getPropValue from "./getPropValue";
import isFixed from "./isFixed";

/**
 * Get an element position on the page relative to another element (or body)
 * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
 *
 * @api private
 * @method getOffset
 * @param {Object} element
 * @param {Object} relativeEl
 * @returns Element's position info
 */
export default function getOffset(element, relativeEl) {
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  relativeEl = relativeEl || body;

  const x = element.getBoundingClientRect();
  const xr = relativeEl.getBoundingClientRect();
  const relativeElPosition = getPropValue(relativeEl, "position");

  var docX = 0, docY = 0;
  var scanningDocument = element.ownerDocument;
  while(scanningDocument != window.top.document) {
    const iframeBounds = scanningDocument.defaultView.frameElement.getBoundingClientRect();
    docX += iframeBounds.left;
    docY += iframeBounds.top;
    scanningDocument = scanningDocument.defaultView.parent.document;
  }

  let obj = {
    width: x.width,
    height: x.height,
  };

  if (
    (relativeEl.tagName.toLowerCase() !== "body" &&
      relativeElPosition === "relative") ||
    relativeElPosition === "sticky"
  ) {
    // when the container of our target element is _not_ body and has either "relative" or "sticky" position, we should not
    // consider the scroll position but we need to include the relative x/y of the container element
    return Object.assign(obj, {
      top: x.top - xr.top + docY,
      left: x.left - xr.left + docX,
    });
  } else {
    if (isFixed(element)) {
      return Object.assign(obj, {
        top: x.top + docY,
        left: x.left + docX,
      });
    } else {
      return Object.assign(obj, {
        top: x.top + scrollTop + docY,
        left: x.left + scrollLeft + docX,
      });
    }
  }
}
