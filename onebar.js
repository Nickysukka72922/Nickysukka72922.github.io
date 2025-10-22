// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import {createOneGoogleBarApi} from "./one_google_bar_api.js";
function postMessage(messageType, data) {
    if (window === window.parent) {
        return
    }
    window.parent.postMessage({
        frameType: "one-google-bar",
        messageType: messageType,
        data: data
    }, "chrome://new-tab-page")
}
const oneGoogleBarApi = createOneGoogleBarApi(abp);
if (abp) {
    window.addEventListener("gbar_a", ( () => {
        oneGoogleBarApi.processTaskQueue()
    }
    ))
}
const overlayUpdater = ( () => {
    const overlays = new Set;
    let lastOverlayRects = [];
    let elementsTransitioningCount = 0;
    let updateIntervalId = null;
    let initialElementsAdded = false;
    function transitionStart() {
        elementsTransitioningCount++;
        if (!updateIntervalId) {
            updateIntervalId = setInterval(( () => {
                update([])
            }
            ))
        }
    }
    function transitionStop() {
        if (elementsTransitioningCount > 0) {
            elementsTransitioningCount--
        }
        if (updateIntervalId && elementsTransitioningCount === 0) {
            clearInterval(updateIntervalId);
            updateIntervalId = null
        }
    }
    function addOverlay(overlay) {
        if (overlays.has(overlay)) {
            return
        }
        overlay.addEventListener("animationstart", transitionStart);
        overlay.addEventListener("animationend", transitionStop);
        overlay.addEventListener("animationcancel", transitionStop);
        overlay.addEventListener("transitionstart", transitionStart);
        overlay.addEventListener("transitionend", transitionStop);
        overlay.addEventListener("transitioncancel", transitionStop);
        overlay.parentElement.querySelectorAll("a").forEach((el => {
            if (el.target !== "_blank" && el.target !== "_top") {
                el.target = "_top"
            }
        }
        ));
        const {transition: transition} = getComputedStyle(overlay);
        const opacityTransition = "opacity 0.1s ease 0.02s";
        if (transition === "all 0s ease 0s") {
            overlay.style.transition = opacityTransition
        } else if (!transition.includes("opacity")) {
            overlay.style.transition = transition + ", " + opacityTransition
        }
        overlay.classList.add("fade-in");
        overlays.add(overlay)
    }
    function update(potentialNewOverlays) {
        const gbElement = document.body.querySelector("#gb");
        if (!gbElement) {
            return
        }
        const barRect = gbElement.getBoundingClientRect();
        if (barRect.bottom === 0) {
            return
        }
        if (!initialElementsAdded) {
            initialElementsAdded = true;
            Array.from(document.body.querySelectorAll("*")).forEach((el => {
                potentialNewOverlays.push(el)
            }
            ))
        }
        Array.from(potentialNewOverlays).forEach((overlay => {
            const rect = overlay.getBoundingClientRect();
            if (overlay.parentElement && rect.width > 0 && rect.bottom > barRect.bottom) {
                addOverlay(overlay)
            }
        }
        ));
        Array.from(overlays).forEach((overlay => {
            if (!overlay.parentElement) {
                overlays.delete(overlay)
            }
        }
        ));
        const overlayRects = [];
        overlays.forEach((overlay => {
            const {display: display, visibility: visibility} = window.getComputedStyle(overlay);
            const rect = overlay.getBoundingClientRect();
            const shown = display !== "none" && visibility !== "hidden" && rect.bottom > barRect.bottom;
            if (shown) {
                overlayRects.push(rect)
            }
            overlay.style.opacity = shown ? "1" : "0"
        }
        ));
        overlayRects.push(barRect);
        const noChange = overlayRects.length === lastOverlayRects.length && lastOverlayRects.every(( (rect, i) => {
            const newRect = overlayRects[i];
            return newRect.left === rect.left && newRect.top === rect.top && newRect.right === rect.right && newRect.bottom === rect.bottom
        }
        ));
        lastOverlayRects = overlayRects;
        if (noChange) {
            return
        }
        postMessage("overlaysUpdated", overlayRects)
    }
    function track() {
        const observer = new MutationObserver((mutations => {
            const potentialNewOverlays = [];
            mutations.forEach(( ({target: target}) => {
                if (overlays.has(target) || !target.parentElement) {
                    return
                }
                potentialNewOverlays.push(target)
            }
            ));
            update(potentialNewOverlays)
        }
        ));
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        })
    }
    return {
        track: track,
        update: update
    }
}
)();
window.addEventListener("message", ( ({data: data}) => {
    if (data.type === "updateAppearance") {
        oneGoogleBarApi.setForegroundLight(data.applyLightTheme)
    }
}
));
window.addEventListener("resize", ( () => {
    overlayUpdater.update([])
}
));
window.addEventListener("blur", (e => {
    if (e.target === window && document.activeElement === document.body) {
        document.body.focus()
    }
}
));
window.addEventListener("click", ( () => {
    postMessage("click")
}
), true);
function postOneGoogleBarLoaded() {
    postMessage("loaded");
    overlayUpdater.track();
    oneGoogleBarApi.trackDarkModeChanges()
}
document.addEventListener("DOMContentLoaded", ( () => {
    if (!abp) {
        document.body.style.margin = "0";
        document.body.querySelectorAll("a").forEach((el => {
            if (el.target !== "_blank") {
                el.target = "_top"
            }
        }
        ))
    }
    postOneGoogleBarLoaded()
}
));
