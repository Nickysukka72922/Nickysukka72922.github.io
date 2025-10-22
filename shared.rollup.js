// Copyright 2011 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import {css, CrLitElement, html, nothing} from "chrome://resources/lit/v3_0/lit.rollup.js";
import {mojo} from "chrome://resources/mojo/mojo/public/js/bindings.js";
import {PageHandlerRemote as PageHandlerRemote$1, PageCallbackRouter as PageCallbackRouter$1, PageHandlerFactory} from "./new_tab_page.mojom-webui.js";
import {loadTimeData} from "chrome://resources/js/load_time_data.js";
import {FileUploadStatus as FileUploadStatus$1, FileUploadErrorType as FileUploadErrorType$1} from "chrome://resources/cr_components/composebox/composebox_query.mojom-webui.js";
import {html as html$1} from "chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js";
import {String16Spec} from "chrome://resources/mojo/mojo/public/mojom/base/string16.mojom-webui.js";
import {TimeTicksSpec, JSTimeSpec, TimeDeltaSpec} from "chrome://resources/mojo/mojo/public/mojom/base/time.mojom-webui.js";
import {UrlSpec} from "chrome://resources/mojo/url/mojom/url.mojom-webui.js";
import {PageCallbackRouter as PageCallbackRouter$2, PageHandlerRemote as PageHandlerRemote$2, PageHandlerFactory as PageHandlerFactory$1} from "chrome://resources/cr_components/composebox/composebox.mojom-webui.js";
import "../../../../../../../../../../../../../../../strings.m.js";
const CLASS_NAME = "focus-outline-visible";
const docsToManager = new Map;
class FocusOutlineManager {
    focusByKeyboard_ = true;
    classList_;
    constructor(doc) {
        this.classList_ = doc.documentElement.classList;
        doc.addEventListener("keydown", (e => this.onEvent_(true, e)), true);
        doc.addEventListener("mousedown", (e => this.onEvent_(false, e)), true);
        this.updateVisibility()
    }
    onEvent_(focusByKeyboard, e) {
        if (this.focusByKeyboard_ === focusByKeyboard) {
            return
        }
        if (e instanceof KeyboardEvent && e.repeat) {
            return
        }
        this.focusByKeyboard_ = focusByKeyboard;
        this.updateVisibility()
    }
    updateVisibility() {
        this.visible = this.focusByKeyboard_
    }
    set visible(visible) {
        this.classList_.toggle(CLASS_NAME, visible)
    }
    get visible() {
        return this.classList_.contains(CLASS_NAME)
    }
    static forDocument(doc) {
        let manager = docsToManager.get(doc);
        if (!manager) {
            manager = new FocusOutlineManager(doc);
            docsToManager.set(doc, manager)
        }
        return manager
    }
}
function assert(value, message) {
    if (value) {
        return
    }
    throw new Error("Assertion failed" + (message ? `: ${message}` : ""))
}
function assertInstanceof(value, type, message) {
    if (value instanceof type) {
        return
    }
    throw new Error(`Value ${value} is not of type ${type.name || typeof type}`)
}
function assertNotReached(message="Unreachable code hit") {
    assert(false, message)
}
class EventTracker {
    listeners_ = [];
    add(target, eventType, listener, capture=false) {
        const h = {
            target: target,
            eventType: eventType,
            listener: listener,
            capture: capture
        };
        this.listeners_.push(h);
        target.addEventListener(eventType, listener, capture)
    }
    remove(target, eventType) {
        this.listeners_ = this.listeners_.filter((listener => {
            if (listener.target === target && (!eventType || listener.eventType === eventType)) {
                EventTracker.removeEventListener(listener);
                return false
            }
            return true
        }
        ))
    }
    removeAll() {
        this.listeners_.forEach((listener => EventTracker.removeEventListener(listener)));
        this.listeners_ = []
    }
    static removeEventListener(entry) {
        entry.target.removeEventListener(entry.eventType, entry.listener, entry.capture)
    }
}
let instance$x = null;
function getCss$s() {
    return instance$x || (instance$x = [...[], css`:host{bottom:0;display:block;left:0;overflow:hidden;pointer-events:none;position:absolute;right:0;top:0;transform:translate3d(0,0,0)}.ripple{background-color:currentcolor;left:0;opacity:var(--paper-ripple-opacity,0.25);pointer-events:none;position:absolute;will-change:height,transform,width}.ripple,:host(.circle){border-radius:50%}`])
}
const MAX_RADIUS_PX = 300;
const MIN_DURATION_MS = 800;
function distance(x1, y1, x2, y2) {
    const xDelta = x1 - x2;
    const yDelta = y1 - y2;
    return Math.sqrt(xDelta * xDelta + yDelta * yDelta)
}
class CrRippleElement extends CrLitElement {
    static get is() {
        return "cr-ripple"
    }
    static get styles() {
        return getCss$s()
    }
    static get properties() {
        return {
            holdDown: {
                type: Boolean
            },
            recenters: {
                type: Boolean
            },
            noink: {
                type: Boolean
            }
        }
    }
    #holdDown_accessor_storage = false;
    get holdDown() {
        return this.#holdDown_accessor_storage
    }
    set holdDown(value) {
        this.#holdDown_accessor_storage = value
    }
    #recenters_accessor_storage = false;
    get recenters() {
        return this.#recenters_accessor_storage
    }
    set recenters(value) {
        this.#recenters_accessor_storage = value
    }
    #noink_accessor_storage = false;
    get noink() {
        return this.#noink_accessor_storage
    }
    set noink(value) {
        this.#noink_accessor_storage = value
    }
    ripples_ = [];
    eventTracker_ = new EventTracker;
    connectedCallback() {
        super.connectedCallback();
        assert(this.parentNode);
        const keyEventTarget = this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? this.parentNode.host : this.parentElement;
        this.eventTracker_.add(keyEventTarget, "pointerdown", (e => this.uiDownAction(e)));
        this.eventTracker_.add(keyEventTarget, "pointerup", ( () => this.uiUpAction()));
        this.eventTracker_.add(keyEventTarget, "pointerout", ( () => this.uiUpAction()));
        this.eventTracker_.add(keyEventTarget, "keydown", (e => {
            if (e.defaultPrevented) {
                return
            }
            if (e.key === "Enter") {
                this.onEnterKeydown_();
                return
            }
            if (e.key === " ") {
                this.onSpaceKeydown_()
            }
        }
        ));
        this.eventTracker_.add(keyEventTarget, "keyup", (e => {
            if (e.defaultPrevented) {
                return
            }
            if (e.key === " ") {
                this.onSpaceKeyup_()
            }
        }
        ))
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll()
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("holdDown")) {
            this.holdDownChanged_(this.holdDown, changedProperties.get("holdDown"))
        }
    }
    uiDownAction(e) {
        if (e !== undefined && e.button !== 0) {
            return
        }
        if (!this.noink) {
            this.downAction_(e)
        }
    }
    downAction_(e) {
        if (this.ripples_.length && this.holdDown) {
            return
        }
        this.showRipple_(e)
    }
    clear() {
        this.hideRipple_();
        this.holdDown = false
    }
    showAndHoldDown() {
        this.ripples_.forEach((ripple => {
            ripple.remove()
        }
        ));
        this.ripples_ = [];
        this.holdDown = true
    }
    showRipple_(e) {
        const rect = this.getBoundingClientRect();
        const roundedCenterX = function() {
            return Math.round(rect.width / 2)
        };
        const roundedCenterY = function() {
            return Math.round(rect.height / 2)
        };
        let x = 0;
        let y = 0;
        const centered = !e;
        if (centered) {
            x = roundedCenterX();
            y = roundedCenterY()
        } else {
            x = Math.round(e.clientX - rect.left);
            y = Math.round(e.clientY - rect.top)
        }
        const corners = [{
            x: 0,
            y: 0
        }, {
            x: rect.width,
            y: 0
        }, {
            x: 0,
            y: rect.height
        }, {
            x: rect.width,
            y: rect.height
        }];
        const cornerDistances = corners.map((function(corner) {
            return Math.round(distance(x, y, corner.x, corner.y))
        }
        ));
        const radius = Math.min(MAX_RADIUS_PX, Math.max.apply(Math, cornerDistances));
        const startTranslate = `${x - radius}px, ${y - radius}px`;
        let endTranslate = startTranslate;
        if (this.recenters && !centered) {
            endTranslate = `${roundedCenterX() - radius}px, ${roundedCenterY() - radius}px`
        }
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        ripple.style.height = ripple.style.width = 2 * radius + "px";
        this.ripples_.push(ripple);
        this.shadowRoot.appendChild(ripple);
        ripple.animate({
            transform: [`translate(${startTranslate}) scale(0)`, `translate(${endTranslate}) scale(1)`]
        }, {
            duration: Math.max(MIN_DURATION_MS, Math.log(radius) * radius) || 0,
            easing: "cubic-bezier(.2, .9, .1, .9)",
            fill: "forwards"
        })
    }
    uiUpAction() {
        if (!this.noink) {
            this.upAction_()
        }
    }
    upAction_() {
        if (!this.holdDown) {
            this.hideRipple_()
        }
    }
    hideRipple_() {
        if (this.ripples_.length === 0) {
            return
        }
        this.ripples_.forEach((function(ripple) {
            const opacity = ripple.computedStyleMap().get("opacity");
            if (opacity === null) {
                ripple.remove();
                return
            }
            const animation = ripple.animate({
                opacity: [opacity.value, 0]
            }, {
                duration: 150,
                fill: "forwards"
            });
            animation.finished.then(( () => {
                ripple.remove()
            }
            ))
        }
        ));
        this.ripples_ = []
    }
    onEnterKeydown_() {
        this.uiDownAction();
        window.setTimeout(( () => {
            this.uiUpAction()
        }
        ), 1)
    }
    onSpaceKeydown_() {
        this.uiDownAction()
    }
    onSpaceKeyup_() {
        this.uiUpAction()
    }
    holdDownChanged_(newHoldDown, oldHoldDown) {
        if (oldHoldDown === undefined) {
            return
        }
        if (newHoldDown) {
            this.downAction_()
        } else {
            this.upAction_()
        }
    }
}
customElements.define(CrRippleElement.is, CrRippleElement);
const CrRippleMixin = superClass => {
    class CrRippleMixin extends superClass {
        static get properties() {
            return {
                noink: {
                    type: Boolean
                }
            }
        }
        #noink_accessor_storage = false;
        get noink() {
            return this.#noink_accessor_storage
        }
        set noink(value) {
            this.#noink_accessor_storage = value
        }
        rippleContainer = null;
        ripple_ = null;
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("noink") && this.hasRipple()) {
                assert(this.ripple_);
                this.ripple_.noink = this.noink
            }
        }
        ensureRippleOnPointerdown() {
            this.addEventListener("pointerdown", ( () => this.ensureRipple()), {
                capture: true
            })
        }
        ensureRipple() {
            if (this.hasRipple()) {
                return
            }
            this.ripple_ = this.createRipple();
            this.ripple_.noink = this.noink;
            const rippleContainer = this.rippleContainer || this.shadowRoot;
            assert(rippleContainer);
            rippleContainer.appendChild(this.ripple_)
        }
        getRipple() {
            this.ensureRipple();
            assert(this.ripple_);
            return this.ripple_
        }
        hasRipple() {
            return Boolean(this.ripple_)
        }
        createRipple() {
            const ripple = document.createElement("cr-ripple");
            ripple.id = "ink";
            return ripple
        }
    }
    return CrRippleMixin
}
;
let instance$w = null;
function getCss$r() {
    return instance$w || (instance$w = [...[], css`[hidden],:host([hidden]){display:none !important}`])
}
const sheet = new CSSStyleSheet;
sheet.replaceSync(`html{--google-blue-50-rgb:232,240,254;--google-blue-50:rgb(var(--google-blue-50-rgb));--google-blue-100-rgb:210,227,252;--google-blue-100:rgb(var(--google-blue-100-rgb));--google-blue-200-rgb:174,203,250;--google-blue-200:rgb(var(--google-blue-200-rgb));--google-blue-300-rgb:138,180,248;--google-blue-300:rgb(var(--google-blue-300-rgb));--google-blue-400-rgb:102,157,246;--google-blue-400:rgb(var(--google-blue-400-rgb));--google-blue-500-rgb:66,133,244;--google-blue-500:rgb(var(--google-blue-500-rgb));--google-blue-600-rgb:26,115,232;--google-blue-600:rgb(var(--google-blue-600-rgb));--google-blue-700-rgb:25,103,210;--google-blue-700:rgb(var(--google-blue-700-rgb));--google-blue-800-rgb:24,90,188;--google-blue-800:rgb(var(--google-blue-800-rgb));--google-blue-900-rgb:23,78,166;--google-blue-900:rgb(var(--google-blue-900-rgb));--google-green-50-rgb:230,244,234;--google-green-50:rgb(var(--google-green-50-rgb));--google-green-200-rgb:168,218,181;--google-green-200:rgb(var(--google-green-200-rgb));--google-green-300-rgb:129,201,149;--google-green-300:rgb(var(--google-green-300-rgb));--google-green-400-rgb:91,185,116;--google-green-400:rgb(var(--google-green-400-rgb));--google-green-500-rgb:52,168,83;--google-green-500:rgb(var(--google-green-500-rgb));--google-green-600-rgb:30,142,62;--google-green-600:rgb(var(--google-green-600-rgb));--google-green-700-rgb:24,128,56;--google-green-700:rgb(var(--google-green-700-rgb));--google-green-800-rgb:19,115,51;--google-green-800:rgb(var(--google-green-800-rgb));--google-green-900-rgb:13,101,45;--google-green-900:rgb(var(--google-green-900-rgb));--google-grey-50-rgb:248,249,250;--google-grey-50:rgb(var(--google-grey-50-rgb));--google-grey-100-rgb:241,243,244;--google-grey-100:rgb(var(--google-grey-100-rgb));--google-grey-200-rgb:232,234,237;--google-grey-200:rgb(var(--google-grey-200-rgb));--google-grey-300-rgb:218,220,224;--google-grey-300:rgb(var(--google-grey-300-rgb));--google-grey-400-rgb:189,193,198;--google-grey-400:rgb(var(--google-grey-400-rgb));--google-grey-500-rgb:154,160,166;--google-grey-500:rgb(var(--google-grey-500-rgb));--google-grey-600-rgb:128,134,139;--google-grey-600:rgb(var(--google-grey-600-rgb));--google-grey-700-rgb:95,99,104;--google-grey-700:rgb(var(--google-grey-700-rgb));--google-grey-800-rgb:60,64,67;--google-grey-800:rgb(var(--google-grey-800-rgb));--google-grey-900-rgb:32,33,36;--google-grey-900:rgb(var(--google-grey-900-rgb));--google-grey-900-white-4-percent:#292a2d;--google-purple-200-rgb:215,174,251;--google-purple-200:rgb(var(--google-purple-200-rgb));--google-purple-900-rgb:104,29,168;--google-purple-900:rgb(var(--google-purple-900-rgb));--google-red-100-rgb:244,199,195;--google-red-100:rgb(var(--google-red-100-rgb));--google-red-300-rgb:242,139,130;--google-red-300:rgb(var(--google-red-300-rgb));--google-red-500-rgb:234,67,53;--google-red-500:rgb(var(--google-red-500-rgb));--google-red-600-rgb:217,48,37;--google-red-600:rgb(var(--google-red-600-rgb));--google-red-700-rgb:197,57,41;--google-red-700:rgb(var(--google-red-700-rgb));--google-yellow-50-rgb:254,247,224;--google-yellow-50:rgb(var(--google-yellow-50-rgb));--google-yellow-100-rgb:254,239,195;--google-yellow-100:rgb(var(--google-yellow-100-rgb));--google-yellow-200-rgb:253,226,147;--google-yellow-200:rgb(var(--google-yellow-200-rgb));--google-yellow-300-rgb:253,214,51;--google-yellow-300:rgb(var(--google-yellow-300-rgb));--google-yellow-400-rgb:252,201,52;--google-yellow-400:rgb(var(--google-yellow-400-rgb));--google-yellow-500-rgb:251,188,4;--google-yellow-500:rgb(var(--google-yellow-500-rgb));--google-yellow-700-rgb:240,147,0;--google-yellow-700:rgb(var(--google-yellow-700-rgb));--cr-card-background-color:white;--cr-shadow-key-color_:color-mix(in srgb,var(--cr-shadow-color) 30%,transparent);--cr-shadow-ambient-color_:color-mix(in srgb,var(--cr-shadow-color) 15%,transparent);--cr-elevation-1:var(--cr-shadow-key-color_) 0 1px 2px 0,var(--cr-shadow-ambient-color_) 0 1px 3px 1px;--cr-elevation-2:var(--cr-shadow-key-color_) 0 1px 2px 0,var(--cr-shadow-ambient-color_) 0 2px 6px 2px;--cr-elevation-3:var(--cr-shadow-key-color_) 0 1px 3px 0,var(--cr-shadow-ambient-color_) 0 4px 8px 3px;--cr-elevation-4:var(--cr-shadow-key-color_) 0 2px 3px 0,var(--cr-shadow-ambient-color_) 0 6px 10px 4px;--cr-elevation-5:var(--cr-shadow-key-color_) 0 4px 4px 0,var(--cr-shadow-ambient-color_) 0 8px 12px 6px;--cr-card-shadow:var(--cr-elevation-2);--cr-focused-item-color:var(--google-grey-300);--cr-form-field-label-color:var(--google-grey-700);--cr-hairline-rgb:0,0,0;--cr-iph-anchor-highlight-color:rgba(var(--google-blue-600-rgb),0.1);--cr-menu-background-color:white;--cr-menu-background-focus-color:var(--google-grey-400);--cr-menu-shadow:var(--cr-elevation-2);--cr-separator-color:rgba(0,0,0,.06);--cr-title-text-color:rgb(90,90,90);--cr-scrollable-border-color:var(--google-grey-300)}@media (prefers-color-scheme:dark){html{--cr-card-background-color:var(--google-grey-900-white-4-percent);--cr-focused-item-color:var(--google-grey-800);--cr-form-field-label-color:var(--dark-secondary-color);--cr-hairline-rgb:255,255,255;--cr-iph-anchor-highlight-color:rgba(var(--google-grey-100-rgb),0.1);--cr-menu-background-color:var(--google-grey-900);--cr-menu-background-focus-color:var(--google-grey-700);--cr-menu-background-sheen:rgba(255,255,255,.06);--cr-menu-shadow:rgba(0,0,0,.3) 0 1px 2px 0,rgba(0,0,0,.15) 0 3px 6px 2px;--cr-separator-color:rgba(255,255,255,.1);--cr-title-text-color:var(--cr-primary-text-color);--cr-scrollable-border-color:var(--google-grey-700)}}@media (forced-colors:active){html{--cr-focus-outline-hcm:2px solid transparent;--cr-border-hcm:2px solid transparent}}html{--cr-button-edge-spacing:12px;--cr-controlled-by-spacing:24px;--cr-default-input-max-width:264px;--cr-icon-ripple-size:36px;--cr-icon-ripple-padding:8px;--cr-icon-size:20px;--cr-icon-button-margin-start:16px;--cr-icon-ripple-margin:calc(var(--cr-icon-ripple-padding) * -1);--cr-section-min-height:48px;--cr-section-two-line-min-height:64px;--cr-section-padding:20px;--cr-section-vertical-padding:12px;--cr-section-indent-width:40px;--cr-section-indent-padding:calc(var(--cr-section-padding) + var(--cr-section-indent-width));--cr-section-vertical-margin:21px;--cr-centered-card-max-width:680px;--cr-centered-card-width-percentage:0.96;--cr-hairline:1px solid rgba(var(--cr-hairline-rgb),.14);--cr-separator-height:1px;--cr-separator-line:var(--cr-separator-height) solid var(--cr-separator-color);--cr-toolbar-overlay-animation-duration:150ms;--cr-toolbar-height:56px;--cr-container-shadow-height:6px;--cr-container-shadow-margin:calc(-1 * var(--cr-container-shadow-height));--cr-container-shadow-max-opacity:1;--cr-card-border-radius:8px;--cr-disabled-opacity:.38;--cr-form-field-bottom-spacing:16px;--cr-form-field-label-font-size:.625rem;--cr-form-field-label-height:1em;--cr-form-field-label-line-height:1}html{--cr-fallback-color-outline:rgb(116,119,117);--cr-fallback-color-primary:rgb(11,87,208);--cr-fallback-color-on-primary:rgb(255,255,255);--cr-fallback-color-primary-container:rgb(211,227,253);--cr-fallback-color-on-primary-container:rgb(4,30,73);--cr-fallback-color-secondary-container:rgb(194,231,255);--cr-fallback-color-on-secondary-container:rgb(0,29,53);--cr-fallback-color-neutral-container:rgb(242,242,242);--cr-fallback-color-neutral-outline:rgb(199,199,199);--cr-fallback-color-surface:rgb(255,255,255);--cr-fallback-color-surface1:rgb(248,250,253);--cr-fallback-color-surface2:rgb(243,246,252);--cr-fallback-color-surface3:rgb(239,243,250);--cr-fallback-color-on-surface-rgb:31,31,31;--cr-fallback-color-on-surface:rgb(var(--cr-fallback-color-on-surface-rgb));--cr-fallback-color-surface-variant:rgb(225,227,225);--cr-fallback-color-on-surface-variant:rgb(68,71,70);--cr-fallback-color-on-surface-subtle:rgb(71,71,71);--cr-fallback-color-inverse-primary:rgb(168,199,250);--cr-fallback-color-inverse-surface:rgb(48,48,48);--cr-fallback-color-inverse-on-surface:rgb(242,242,242);--cr-fallback-color-tonal-container:rgb(211,227,253);--cr-fallback-color-on-tonal-container:rgb(4,30,73);--cr-fallback-color-tonal-outline:rgb(168,199,250);--cr-fallback-color-error:rgb(179,38,30);--cr-fallback-color-divider:rgb(211,227,253);--cr-fallback-color-state-hover-on-prominent_:rgba(253,252,251,.1);--cr-fallback-color-state-on-subtle-rgb_:31,31,31;--cr-fallback-color-state-hover-on-subtle_:rgba(var(--cr-fallback-color-state-on-subtle-rgb_),.06);--cr-fallback-color-state-ripple-neutral-on-subtle_:rgba(var(--cr-fallback-color-state-on-subtle-rgb_),.08);--cr-fallback-color-state-ripple-primary-rgb_:124,172,248;--cr-fallback-color-state-ripple-primary_:rgba(var(--cr-fallback-color-state-ripple-primary-rgb_),0.32);--cr-fallback-color-base-container:rgb(236,239,247);--cr-fallback-color-disabled-background:rgba(var(--cr-fallback-color-on-surface-rgb),.12);--cr-fallback-color-disabled-foreground:rgba(var(--cr-fallback-color-on-surface-rgb),var(--cr-disabled-opacity));--cr-hover-background-color:var(--color-sys-state-hover,rgba(var(--cr-fallback-color-on-surface-rgb),.08));--cr-hover-on-prominent-background-color:var(--color-sys-state-hover-on-prominent,var(--cr-fallback-color-state-hover-on-prominent_));--cr-hover-on-subtle-background-color:var(--color-sys-state-hover-on-subtle,var(--cr-fallback-color-state-hover-on-subtle_));--cr-active-background-color:var(--color-sys-state-pressed,rgba(var(--cr-fallback-color-on-surface-rgb),.12));--cr-active-on-primary-background-color:var(--color-sys-state-ripple-primary,var(--cr-fallback-color-state-ripple-primary_));--cr-active-neutral-on-subtle-background-color:var(--color-sys-state-ripple-neutral-on-subtle,var(--cr-fallback-color-state-ripple-neutral-on-subtle_));--cr-focus-outline-color:var(--color-sys-state-focus-ring,var(--cr-fallback-color-primary));--cr-focus-outline-inverse-color:var(--color-sys-state-focus-ring-inverse,var(--cr-fallback-color-inverse-primary));--cr-primary-text-color:var(--color-primary-foreground,var(--cr-fallback-color-on-surface));--cr-secondary-text-color:var(--color-secondary-foreground,var(--cr-fallback-color-on-surface-variant));--cr-link-color:var(--color-link-foreground-default,var(--cr-fallback-color-primary));--cr-button-height:36px;--cr-shadow-color:var(--color-sys-shadow,rgb(0,0,0));--cr-checked-color:var(--color-checkbox-foreground-checked,var(--cr-fallback-color-primary))}@media (prefers-color-scheme:dark){html{--cr-fallback-color-outline:rgb(142,145,143);--cr-fallback-color-primary:rgb(168,199,250);--cr-fallback-color-on-primary:rgb(6,46,111);--cr-fallback-color-primary-container:rgb(8,66,160);--cr-fallback-color-on-primary-container:rgb(211,227,253);--cr-fallback-color-secondary-container:rgb(0,74,119);--cr-fallback-color-on-secondary-container:rgb(194,231,255);--cr-fallback-color-neutral-container:rgb(40,40,40);--cr-fallback-color-neutral-outline:rgb(117,117,117);--cr-fallback-color-surface:rgb(31,31,31);--cr-fallback-color-surface1:rgb(39,40,42);--cr-fallback-color-surface2:rgb(45,47,49);--cr-fallback-color-surface3:rgb(51,52,56);--cr-fallback-color-on-surface-rgb:227,227,227;--cr-fallback-color-surface-variant:rgb(68,71,70);--cr-fallback-color-on-surface-variant:rgb(196,199,197);--cr-fallback-color-on-surface-subtle:rgb(199,199,199);--cr-fallback-color-inverse-primary:rgb(11,87,208);--cr-fallback-color-inverse-surface:rgb(227,227,227);--cr-fallback-color-inverse-on-surface:rgb(31,31,31);--cr-fallback-color-tonal-container:rgb(0,74,119);--cr-fallback-color-on-tonal-container:rgb(194,231,255);--cr-fallback-color-tonal-outline:rgb(4,125,183);--cr-fallback-color-error:rgb(242,184,181);--cr-fallback-color-divider:rgb(94,94,94);--cr-fallback-color-state-hover-on-prominent_:rgba(31,31,31,.06);--cr-fallback-color-state-on-subtle-rgb_:253,252,251;--cr-fallback-color-state-hover-on-subtle_:rgba(var(--cr-fallback-color-state-on-subtle-rgb_),.10);--cr-fallback-color-state-ripple-neutral-on-subtle_:rgba(var(--cr-fallback-color-state-on-subtle-rgb_),.16);--cr-fallback-color-state-ripple-primary-rgb_:76,141,246;--cr-fallback-color-base-container:rgba(40,40,40,1)}}@media (forced-colors:active){html{--cr-fallback-color-disabled-background:Canvas;--cr-fallback-color-disabled-foreground:GrayText}}`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
let instance$v = null;
function getCss$q() {
    return instance$v || (instance$v = [...[getCss$r()], css`:host{--cr-button-background-color:transparent;--cr-button-border-color:var(--color-button-border,var(--cr-fallback-color-tonal-outline));--cr-button-text-color:var(--color-button-foreground,var(--cr-fallback-color-primary));--cr-button-ripple-opacity:1;--cr-button-ripple-color:var(--cr-active-background-color);--cr-button-disabled-background-color:transparent;--cr-button-disabled-border-color:var(--color-button-border-disabled,var(--cr-fallback-color-disabled-background));--cr-button-disabled-text-color:var(--color-button-foreground-disabled,var(--cr-fallback-color-disabled-foreground))}:host(.action-button){--cr-button-background-color:var(--color-button-background-prominent,var(--cr-fallback-color-primary));--cr-button-text-color:var(--color-button-foreground-prominent,var(--cr-fallback-color-on-primary));--cr-button-ripple-color:var(--cr-active-on-primary-background-color);--cr-button-border:none;--cr-button-disabled-background-color:var(--color-button-background-prominent-disabled,var(--cr-fallback-color-disabled-background));--cr-button-disabled-text-color:var(--color-button-foreground-disabled,var(--cr-fallback-color-disabled-foreground));--cr-button-disabled-border:none}:host(.tonal-button),:host(.floating-button){--cr-button-background-color:var(--color-button-background-tonal,var(--cr-fallback-color-secondary-container));--cr-button-text-color:var(--color-button-foreground-tonal,var(--cr-fallback-color-on-tonal-container));--cr-button-border:none;--cr-button-disabled-background-color:var(--color-button-background-tonal-disabled,var(--cr-fallback-color-disabled-background));--cr-button-disabled-text-color:var(--color-button-foreground-disabled,var(--cr-fallback-color-disabled-foreground));--cr-button-disabled-border:none}:host{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:5.14em;height:var(--cr-button-height);padding:8px 16px;outline-width:0;overflow:hidden;position:relative;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;border:var(--cr-button-border,1px solid var(--cr-button-border-color));border-radius:100px;background:var(--cr-button-background-color);color:var(--cr-button-text-color);font-weight:500;line-height:20px;isolation:isolate}@media (forced-colors:active){:host{forced-color-adjust:none}}:host(.floating-button){border-radius:8px;height:40px;transition:box-shadow 80ms linear}:host(.floating-button:hover){box-shadow:var(--cr-elevation-3)}:host([has-prefix-icon_]),:host([has-suffix-icon_]){--iron-icon-height:20px;--iron-icon-width:20px;--icon-block-padding-large:16px;--icon-block-padding-small:12px;gap:8px;padding-block-end:8px;padding-block-start:8px}:host([has-prefix-icon_]){padding-inline-end:var(--icon-block-padding-large);padding-inline-start:var(--icon-block-padding-small)}:host([has-suffix-icon_]){padding-inline-end:var(--icon-block-padding-small);padding-inline-start:var(--icon-block-padding-large)}:host-context(.focus-outline-visible):host(:focus){box-shadow:none;outline:2px solid var(--cr-focus-outline-color);outline-offset:2px}#background{border-radius:inherit;inset:0;pointer-events:none;position:absolute}#content{display:inline}#hoverBackground{content:'';display:none;inset:0;pointer-events:none;position:absolute;z-index:1}:host(:hover) #hoverBackground{background:var(--cr-hover-background-color);display:block}:host(.action-button:hover) #hoverBackground{background:var(--cr-hover-on-prominent-background-color)}:host([disabled]){background:var(--cr-button-disabled-background-color);border:var(--cr-button-disabled-border,1px solid var(--cr-button-disabled-border-color));color:var(--cr-button-disabled-text-color);cursor:auto;pointer-events:none}:host(.cancel-button){margin-inline-end:8px}:host(.action-button),:host(.cancel-button){line-height:154%}#ink{color:var(--cr-button-ripple-color);--paper-ripple-opacity:var(--cr-button-ripple-opacity)}#background{z-index:0}#hoverBackground,cr-ripple{z-index:1}#content,::slotted(*){z-index:2}`])
}
function getHtml$k() {
    return html`
<div id="background"></div>
<slot id="prefixIcon" name="prefix-icon"
    @slotchange="${this.onPrefixIconSlotChanged_}">
</slot>
<span id="content"><slot></slot></span>
<slot id="suffixIcon" name="suffix-icon"
    @slotchange="${this.onSuffixIconSlotChanged_}">
</slot>
<div id="hoverBackground" part="hoverBackground"></div>`
}
const CrButtonElementBase = CrRippleMixin(CrLitElement);
class CrButtonElement extends CrButtonElementBase {
    static get is() {
        return "cr-button"
    }
    static get styles() {
        return getCss$q()
    }
    render() {
        return getHtml$k.bind(this)()
    }
    static get properties() {
        return {
            disabled: {
                type: Boolean,
                reflect: true
            },
            hasPrefixIcon_: {
                type: Boolean,
                reflect: true
            },
            hasSuffixIcon_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    #disabled_accessor_storage = false;
    get disabled() {
        return this.#disabled_accessor_storage
    }
    set disabled(value) {
        this.#disabled_accessor_storage = value
    }
    #hasPrefixIcon__accessor_storage = false;
    get hasPrefixIcon_() {
        return this.#hasPrefixIcon__accessor_storage
    }
    set hasPrefixIcon_(value) {
        this.#hasPrefixIcon__accessor_storage = value
    }
    #hasSuffixIcon__accessor_storage = false;
    get hasSuffixIcon_() {
        return this.#hasSuffixIcon__accessor_storage
    }
    set hasSuffixIcon_(value) {
        this.#hasSuffixIcon__accessor_storage = value
    }
    spaceKeyDown_ = false;
    timeoutIds_ = new Set;
    constructor() {
        super();
        this.addEventListener("blur", this.onBlur_.bind(this));
        this.addEventListener("click", this.onClick_.bind(this));
        this.addEventListener("keydown", this.onKeyDown_.bind(this));
        this.addEventListener("keyup", this.onKeyUp_.bind(this));
        this.ensureRippleOnPointerdown()
    }
    firstUpdated() {
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "button")
        }
        if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", "0")
        }
        FocusOutlineManager.forDocument(document)
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("disabled")) {
            this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
            this.disabledChanged_(this.disabled, changedProperties.get("disabled"))
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.timeoutIds_.forEach(clearTimeout);
        this.timeoutIds_.clear()
    }
    setTimeout_(fn, delay) {
        if (!this.isConnected) {
            return
        }
        const id = setTimeout(( () => {
            this.timeoutIds_.delete(id);
            fn()
        }
        ), delay);
        this.timeoutIds_.add(id)
    }
    disabledChanged_(newValue, oldValue) {
        if (!newValue && oldValue === undefined) {
            return
        }
        if (this.disabled) {
            this.blur()
        }
        this.setAttribute("tabindex", String(this.disabled ? -1 : 0))
    }
    onBlur_() {
        this.spaceKeyDown_ = false;
        this.setTimeout_(( () => this.getRipple().uiUpAction()), 100)
    }
    onClick_(e) {
        if (this.disabled) {
            e.stopImmediatePropagation()
        }
    }
    onPrefixIconSlotChanged_() {
        this.hasPrefixIcon_ = this.$.prefixIcon.assignedElements().length > 0
    }
    onSuffixIconSlotChanged_() {
        this.hasSuffixIcon_ = this.$.suffixIcon.assignedElements().length > 0
    }
    onKeyDown_(e) {
        if (e.key !== " " && e.key !== "Enter") {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) {
            return
        }
        this.getRipple().uiDownAction();
        if (e.key === "Enter") {
            this.click();
            this.setTimeout_(( () => this.getRipple().uiUpAction()), 100)
        } else if (e.key === " ") {
            this.spaceKeyDown_ = true
        }
    }
    onKeyUp_(e) {
        if (e.key !== " " && e.key !== "Enter") {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        if (this.spaceKeyDown_ && e.key === " ") {
            this.spaceKeyDown_ = false;
            this.click();
            this.getRipple().uiUpAction()
        }
    }
}
customElements.define(CrButtonElement.is, CrButtonElement);
let instance$u = null;
function getCss$p() {
    return instance$u || (instance$u = [...[getCss$r()], css`:host{align-items:center;display:inline-flex;justify-content:center;position:relative;vertical-align:middle;fill:var(--iron-icon-fill-color,currentcolor);stroke:var(--iron-icon-stroke-color,none);width:var(--iron-icon-width,24px);height:var(--iron-icon-height,24px)}`])
}
let iconsetMap = null;
class IconsetMap extends EventTarget {
    iconsets_ = new Map;
    static getInstance() {
        return iconsetMap || (iconsetMap = new IconsetMap)
    }
    static resetInstanceForTesting(instance) {
        iconsetMap = instance
    }
    get(id) {
        return this.iconsets_.get(id) || null
    }
    set(id, iconset) {
        assert(!this.iconsets_.has(id), `Tried to add a second iconset with id '${id}'`);
        this.iconsets_.set(id, iconset);
        this.dispatchEvent(new CustomEvent("cr-iconset-added",{
            detail: id
        }))
    }
}
class CrIconElement extends CrLitElement {
    static get is() {
        return "cr-icon"
    }
    static get styles() {
        return getCss$p()
    }
    static get properties() {
        return {
            icon: {
                type: String
            }
        }
    }
    #icon_accessor_storage = "";
    get icon() {
        return this.#icon_accessor_storage
    }
    set icon(value) {
        this.#icon_accessor_storage = value
    }
    iconsetName_ = "";
    iconName_ = "";
    iconset_ = null;
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("icon")) {
            const [iconsetName,iconName] = this.icon.split(":");
            this.iconName_ = iconName || "";
            this.iconsetName_ = iconsetName || "";
            this.updateIcon_()
        }
    }
    updateIcon_() {
        if (this.iconName_ === "" && this.iconset_) {
            this.iconset_.removeIcon(this)
        } else if (this.iconsetName_) {
            const iconsetMap = IconsetMap.getInstance();
            this.iconset_ = iconsetMap.get(this.iconsetName_);
            assert(this.iconset_, `Could not find iconset for: '${this.iconsetName_}:${this.iconName_}'`);
            this.iconset_.applyIcon(this, this.iconName_)
        }
    }
}
customElements.define(CrIconElement.is, CrIconElement);
let instance$t = null;
function getCss$o() {
    return instance$t || (instance$t = [...[], css`:host{display:none}`])
}
function getHtml$j() {
    return html`
<svg id="baseSvg" xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${this.size} ${this.size}"
     preserveAspectRatio="xMidYMid meet" focusable="false"
     style="pointer-events: none; display: block; width: 100%; height: 100%;">
 </svg>
<slot></slot>
`
}
const APPLIED_ICON_CLASS = "cr-iconset-svg-icon_";
class CrIconsetElement extends CrLitElement {
    static get is() {
        return "cr-iconset"
    }
    static get styles() {
        return getCss$o()
    }
    render() {
        return getHtml$j.bind(this)()
    }
    static get properties() {
        return {
            name: {
                type: String
            },
            size: {
                type: Number
            }
        }
    }
    #name_accessor_storage = "";
    get name() {
        return this.#name_accessor_storage
    }
    set name(value) {
        this.#name_accessor_storage = value
    }
    #size_accessor_storage = 24;
    get size() {
        return this.#size_accessor_storage
    }
    set size(value) {
        this.#size_accessor_storage = value
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("name")) {
            assert(changedProperties.get("name") === undefined);
            IconsetMap.getInstance().set(this.name, this)
        }
    }
    applyIcon(element, iconName) {
        this.removeIcon(element);
        const svg = this.cloneIcon_(iconName);
        if (svg) {
            svg.classList.add(APPLIED_ICON_CLASS);
            element.shadowRoot.insertBefore(svg, element.shadowRoot.childNodes[0]);
            return svg
        }
        return null
    }
    createIcon(iconName) {
        return this.cloneIcon_(iconName)
    }
    removeIcon(element) {
        const oldSvg = element.shadowRoot.querySelector(`.${APPLIED_ICON_CLASS}`);
        if (oldSvg) {
            oldSvg.remove()
        }
    }
    cloneIcon_(id) {
        const sourceSvg = this.querySelector(`g[id="${id}"]`);
        if (!sourceSvg) {
            return null
        }
        const svgClone = this.$.baseSvg.cloneNode(true);
        const content = sourceSvg.cloneNode(true);
        content.removeAttribute("id");
        const contentViewBox = content.getAttribute("viewBox");
        if (contentViewBox) {
            svgClone.setAttribute("viewBox", contentViewBox)
        }
        svgClone.appendChild(content);
        return svgClone
    }
}
customElements.define(CrIconsetElement.is, CrIconsetElement);
function isValidArray(arr) {
    if (arr instanceof Array && Object.isFrozen(arr)) {
        return true
    }
    return false
}
function getStaticString(literal) {
    const isStaticString = isValidArray(literal) && !!literal.raw && isValidArray(literal.raw) && literal.length === literal.raw.length && literal.length === 1;
    assert(isStaticString, "static_types.js only allows static strings");
    return literal.join("")
}
function createTypes(_ignore, literal) {
    return getStaticString(literal)
}
const rules = {
    createHTML: createTypes,
    createScript: createTypes,
    createScriptURL: createTypes
};
let staticPolicy;
if (window.trustedTypes) {
    staticPolicy = window.trustedTypes.createPolicy("static-types", rules)
} else {
    staticPolicy = rules
}
function getTrustedHTML(literal) {
    return staticPolicy.createHTML("", literal)
}
function getTrustedScriptURL(literal) {
    return staticPolicy.createScriptURL("", literal)
}
const div$2 = document.createElement("div");
div$2.innerHTML = getTrustedHTML`
<cr-iconset name="ntp">
  <svg>
    <defs>
      <g id="pencil" width="24" height="24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/>
      </g>
      <clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath>
      <g id="sparkle" clip-path="url(#a)" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path fill="#fff" d="M8 14.4a6.16 6.16 0 0 0-.5-2.483 6.286 6.286 0 0 0-1.383-2.034A6.287 6.287 0 0 0 4.083 8.5 6.16 6.16 0 0 0 1.6 8a6.16 6.16 0 0 0 2.483-.5A6.421 6.421 0 0 0 7.5 4.083c.333-.777.5-1.605.5-2.483 0 .878.167 1.706.5 2.483a6.623 6.623 0 0 0 1.367 2.05 6.624 6.624 0 0 0 2.05 1.367c.777.333 1.605.5 2.483.5-.878 0-1.706.167-2.483.5A6.421 6.421 0 0 0 8.5 11.917 6.16 6.16 0 0 0 8 14.4Z"/>
      </g>
    </defs>
  </svg>
</cr-iconset>`;
const iconsets$2 = div$2.querySelectorAll("cr-iconset");
for (const iconset of iconsets$2) {
    document.head.appendChild(iconset)
}
let instance$s = null;
function getCss$n() {
    return instance$s || (instance$s = [...[], css`.icon-arrow-back{--cr-icon-image:url(//resources/images/icon_arrow_back.svg)}.icon-arrow-dropdown{--cr-icon-image:url(//resources/images/icon_arrow_dropdown.svg)}.icon-arrow-drop-down-cr23{--cr-icon-image:url(//resources/images/icon_arrow_drop_down_cr23.svg)}.icon-arrow-drop-up-cr23{--cr-icon-image:url(//resources/images/icon_arrow_drop_up_cr23.svg)}.icon-arrow-upward{--cr-icon-image:url(//resources/images/icon_arrow_upward.svg)}.icon-cancel{--cr-icon-image:url(//resources/images/icon_cancel.svg)}.icon-clear{--cr-icon-image:url(//resources/images/icon_clear.svg)}.icon-copy-content{--cr-icon-image:url(//resources/images/icon_copy_content.svg)}.icon-delete-gray{--cr-icon-image:url(//resources/images/icon_delete_gray.svg)}.icon-edit{--cr-icon-image:url(//resources/images/icon_edit.svg)}.icon-file{--cr-icon-image:url(//resources/images/icon_filetype_generic.svg)}.icon-folder-open{--cr-icon-image:url(//resources/images/icon_folder_open.svg)}.icon-picture-delete{--cr-icon-image:url(//resources/images/icon_picture_delete.svg)}.icon-expand-less{--cr-icon-image:url(//resources/images/icon_expand_less.svg)}.icon-expand-more{--cr-icon-image:url(//resources/images/icon_expand_more.svg)}.icon-external{--cr-icon-image:url(//resources/images/open_in_new.svg)}.icon-more-vert{--cr-icon-image:url(//resources/images/icon_more_vert.svg)}.icon-refresh{--cr-icon-image:url(//resources/images/icon_refresh.svg)}.icon-search{--cr-icon-image:url(//resources/images/icon_search.svg)}.icon-settings{--cr-icon-image:url(//resources/images/icon_settings.svg)}.icon-visibility{--cr-icon-image:url(//resources/images/icon_visibility.svg)}.icon-visibility-off{--cr-icon-image:url(//resources/images/icon_visibility_off.svg)}.subpage-arrow{--cr-icon-image:url(//resources/images/arrow_right.svg)}.cr-icon{-webkit-mask-image:var(--cr-icon-image);-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:var(--cr-icon-size);background-color:var(--cr-icon-color,var(--google-grey-700));flex-shrink:0;height:var(--cr-icon-ripple-size);margin-inline-end:var(--cr-icon-ripple-margin);margin-inline-start:var(--cr-icon-button-margin-start);user-select:none;width:var(--cr-icon-ripple-size)}:host-context([dir=rtl]) .cr-icon{transform:scaleX(-1)}.cr-icon.no-overlap{margin-inline-end:0;margin-inline-start:0}@media (prefers-color-scheme:dark){.cr-icon{background-color:var(--cr-icon-color,var(--google-grey-500))}}`])
}
let instance$r = null;
function getCss$m() {
    return instance$r || (instance$r = [...[getCss$r(), getCss$n()], css`[actionable]{cursor:pointer}.hr{border-top:var(--cr-separator-line)}iron-list.cr-separators>*:not([first]){border-top:var(--cr-separator-line)}[scrollable]{border-color:transparent;border-style:solid;border-width:1px 0;overflow-y:auto}[scrollable].is-scrolled{border-top-color:var(--cr-scrollable-border-color)}[scrollable].can-scroll:not(.scrolled-to-bottom){border-bottom-color:var(--cr-scrollable-border-color)}[scrollable] iron-list>:not(.no-outline):focus-visible,[selectable]:focus-visible,[selectable]>:focus-visible{outline:solid 2px var(--cr-focus-outline-color);outline-offset:-2px}.scroll-container{display:flex;flex-direction:column;min-height:1px}[selectable]>*{cursor:pointer}.cr-centered-card-container{box-sizing:border-box;display:block;height:inherit;margin:0 auto;max-width:var(--cr-centered-card-max-width);min-width:550px;position:relative;width:calc(100% * var(--cr-centered-card-width-percentage))}.cr-container-shadow{box-shadow:inset 0 5px 6px -3px rgba(0,0,0,.4);height:var(--cr-container-shadow-height);left:0;margin:0 0 var(--cr-container-shadow-margin);opacity:0;pointer-events:none;position:relative;right:0;top:0;transition:opacity 500ms;z-index:1}#cr-container-shadow-bottom{margin-bottom:0;margin-top:var(--cr-container-shadow-margin);transform:scaleY(-1)}#cr-container-shadow-top:has(+#container.can-scroll:not(.scrolled-to-top)),#container.can-scroll:not(.scrolled-to-bottom)+#cr-container-shadow-bottom,#cr-container-shadow-bottom.force-shadow,#cr-container-shadow-top.force-shadow{opacity:var(--cr-container-shadow-max-opacity)}.cr-row{align-items:center;border-top:var(--cr-separator-line);display:flex;min-height:var(--cr-section-min-height);padding:0 var(--cr-section-padding)}.cr-row.first,.cr-row.continuation{border-top:none}.cr-row-gap{padding-inline-start:16px}.cr-button-gap{margin-inline-start:8px}paper-tooltip::part(tooltip),cr-tooltip::part(tooltip){border-radius:var(--paper-tooltip-border-radius,2px);font-size:92.31%;font-weight:500;max-width:330px;min-width:var(--paper-tooltip-min-width,200px);padding:var(--paper-tooltip-padding,10px 8px)}.cr-padded-text{padding-block-end:var(--cr-section-vertical-padding);padding-block-start:var(--cr-section-vertical-padding)}.cr-title-text{color:var(--cr-title-text-color);font-size:107.6923%;font-weight:500}.cr-secondary-text{color:var(--cr-secondary-text-color);font-weight:400}.cr-form-field-label{color:var(--cr-form-field-label-color);display:block;font-size:var(--cr-form-field-label-font-size);font-weight:500;letter-spacing:.4px;line-height:var(--cr-form-field-label-line-height);margin-bottom:8px}.cr-vertical-tab{align-items:center;display:flex}.cr-vertical-tab::before{border-radius:0 3px 3px 0;content:'';display:block;flex-shrink:0;height:var(--cr-vertical-tab-height,100%);width:4px}.cr-vertical-tab.selected::before{background:var(--cr-vertical-tab-selected-color,var(--cr-checked-color))}:host-context([dir=rtl]) .cr-vertical-tab::before{transform:scaleX(-1)}.iph-anchor-highlight{background-color:var(--cr-iph-anchor-highlight-color)}`])
}
let instance$q = null;
function getCss$l() {
    return instance$q || (instance$q = [...[getCss$m(), getCss$n()], css`#customizeButtons{display:flex;flex-wrap:wrap;gap:8px}#wallpaperSearchButton{--cr-hover-background-color:var(--color-new-tab-page-wallpaper-search-button-background-hovered);--cr-button-text-color:var(--color-new-tab-page-wallpaper-search-button-foreground);--cr-button-background-color:var(--color-new-tab-page-wallpaper-search-button-background)}#customizeButton{--cr-hover-background-color:var(--color-new-tab-page-button-background-hovered);--cr-button-text-color:var(--color-new-tab-page-button-foreground);--cr-button-background-color:var(--color-new-tab-page-button-background)}:host([show-background-image]) #customizeButton,:host([show-background-image]) #wallpaperSearchButton{--cr-hover-background-color:var(--ntp-protected-icon-background-color-hovered);--cr-button-text-color:white;--cr-button-background-color:var(--ntp-protected-icon-background-color)}#customizeButton:has(help-bubble){z-index:1001}.customize-button{--cr-button-height:32px;border:none;border-radius:calc(.5 * var(--cr-button-height));box-shadow:0 3px 6px rgba(0,0,0,.16),0 1px 2px rgba(0,0,0,.23);font-weight:400;min-width:32px;padding-inline-end:16px;padding-inline-start:16px}:host(:not([show-shadow])) .customize-button{box-shadow:none}:host([show-background-image]) #customizeButton,:host([show-wallpaper-search-button]) #customizeButton,:host([show-wallpaper-search]) #wallpaperSearchButton{box-shadow:none;padding-inline-end:0;padding-inline-start:8px}:host-context(.focus-outline-visible) .customize-button:focus{box-shadow:var(--ntp-focus-shadow)}.customize-icon{--cr-icon-button-margin-start:0;--cr-icon-color:var(--cr-button-text-color);--cr-icon-ripple-margin:0;--cr-icon-ripple-size:16px;--cr-icon-size:100%;--iron-icon-width:16px;--iron-icon-height:16px}@media (max-width:550px){.customize-button{padding-inline-end:0;padding-inline-start:8px}.customize-text{display:none}}@media (max-width:1110px){:host([modules-shown-to-user]) .customize-text{display:none}:host([modules-shown-to-user]) .customize-button{padding-inline-end:0;padding-inline-start:8px}}@media (max-width:970px){:host([modules-shown-to-user]) .customize-button{padding-inline-end:0;padding-inline-start:8px}:host([modules-shown-to-user]) .customize-text{display:none}}@media (max-width:920px){:host([info-shown-to-user]) .customize-button{padding-inline-end:0;padding-inline-start:8px}:host([info-shown-to-user]) .customize-text{display:none}}:host([wallpaper-search-button-animation-enabled]) #wallpaperSearchButton{animation:750ms forwards grow-container,500ms forwards 300ms color-text;color:rgba(0,0,0,0);opacity:0;transform-origin:right}@keyframes grow-container{from{opacity:0;transform:scale(0.8)}to{opacity:100%;transform:scale(1)}}@keyframes color-text{from{color:rgba(0,0,0,0)}to{color:var(--cr-button-text-color)}}:host([wallpaper-search-button-animation-enabled]) #wallpaperSearchIcon{animation:2.5s 350ms spin-icon}@keyframes spin-icon{from{transform:rotate(0deg)}to{transform:rotate(720deg)}}`])
}
function getHtml$i() {
    return html`<!--_html_template_start_-->
<div id="customizeButtons">
  ${this.showWallpaperSearchButton ? html`
    <cr-button id="wallpaperSearchButton"
        class="customize-button" @click="${this.onWallpaperSearchClick_}"
        title="Customise this page with AI"
        aria-pressed="${this.showWallpaperSearch}">
      <cr-icon id="wallpaperSearchIcon" class="customize-icon"
          slot="prefix-icon" icon="ntp:sparkle"></cr-icon>
      <div id="wallpaperSearchText" class="customize-text"
          ?hidden="${this.showWallpaperSearch}">
        Create theme with AI
      </div>
    </cr-button>
  ` : ""}
  <cr-button id="customizeButton" class="customize-button"
      @click="${this.onCustomizeClick_}" title="Customise this page"
      aria-pressed="${this.showCustomize}">
    <cr-icon class="customize-icon" slot="prefix-icon" icon="ntp:pencil">
    </cr-icon>
    <div id="customizeText" class="customize-text"
        ?hidden="${!this.showCustomizeChromeText}">
      Customise Chromium
    </div>
  </cr-button>
</div>
<!--_html_template_end_-->`
}
class CustomizeButtonsElement extends CrLitElement {
    static get is() {
        return "ntp-customize-buttons"
    }
    static get styles() {
        return getCss$l()
    }
    render() {
        return getHtml$i.bind(this)()
    }
    static get properties() {
        return {
            infoShownToUser: {
                reflect: true,
                type: Boolean
            },
            modulesShownToUser: {
                reflect: true,
                type: Boolean
            },
            showBackgroundImage: {
                reflect: true,
                type: Boolean
            },
            showCustomize: {
                type: Boolean
            },
            showCustomizeChromeText: {
                type: Boolean
            },
            showShadow: {
                reflect: true,
                type: Boolean
            },
            showWallpaperSearch: {
                reflect: true,
                type: Boolean
            },
            showWallpaperSearchButton: {
                reflect: true,
                type: Boolean
            },
            wallpaperSearchButtonAnimationEnabled: {
                reflect: true,
                type: Boolean
            }
        }
    }
    #infoShownToUser_accessor_storage = false;
    get infoShownToUser() {
        return this.#infoShownToUser_accessor_storage
    }
    set infoShownToUser(value) {
        this.#infoShownToUser_accessor_storage = value
    }
    #modulesShownToUser_accessor_storage = false;
    get modulesShownToUser() {
        return this.#modulesShownToUser_accessor_storage
    }
    set modulesShownToUser(value) {
        this.#modulesShownToUser_accessor_storage = value
    }
    #showBackgroundImage_accessor_storage = false;
    get showBackgroundImage() {
        return this.#showBackgroundImage_accessor_storage
    }
    set showBackgroundImage(value) {
        this.#showBackgroundImage_accessor_storage = value
    }
    #showCustomize_accessor_storage = false;
    get showCustomize() {
        return this.#showCustomize_accessor_storage
    }
    set showCustomize(value) {
        this.#showCustomize_accessor_storage = value
    }
    #showCustomizeChromeText_accessor_storage = false;
    get showCustomizeChromeText() {
        return this.#showCustomizeChromeText_accessor_storage
    }
    set showCustomizeChromeText(value) {
        this.#showCustomizeChromeText_accessor_storage = value
    }
    #showShadow_accessor_storage = false;
    get showShadow() {
        return this.#showShadow_accessor_storage
    }
    set showShadow(value) {
        this.#showShadow_accessor_storage = value
    }
    #showWallpaperSearch_accessor_storage = false;
    get showWallpaperSearch() {
        return this.#showWallpaperSearch_accessor_storage
    }
    set showWallpaperSearch(value) {
        this.#showWallpaperSearch_accessor_storage = value
    }
    #showWallpaperSearchButton_accessor_storage = false;
    get showWallpaperSearchButton() {
        return this.#showWallpaperSearchButton_accessor_storage
    }
    set showWallpaperSearchButton(value) {
        this.#showWallpaperSearchButton_accessor_storage = value
    }
    connectedCallback() {
        super.connectedCallback();
        FocusOutlineManager.forDocument(document)
    }
    onCustomizeClick_() {
        this.fire("customize-click")
    }
    onWallpaperSearchClick_() {
        this.fire("wallpaper-search-click")
    }
}
customElements.define(CustomizeButtonsElement.is, CustomizeButtonsElement);
function sanitizeInnerHtmlInternal(rawString, opts) {
    opts = opts || {};
    const html = parseHtmlSubset(`<b>${rawString}</b>`, opts.tags, opts.attrs).firstElementChild;
    return html.innerHTML
}
let sanitizedPolicy = null;
function sanitizeInnerHtml(rawString, opts) {
    assert(window.trustedTypes);
    if (sanitizedPolicy === null) {
        sanitizedPolicy = window.trustedTypes.createPolicy("sanitize-inner-html", {
            createHTML: sanitizeInnerHtmlInternal,
            createScript: () => assertNotReached(),
            createScriptURL: () => assertNotReached()
        })
    }
    return sanitizedPolicy.createHTML(rawString, opts)
}
const allowAttribute = (_node, _value) => true;
const allowedAttributes = new Map([["href", (node, value) => node.tagName === "A" && (value.startsWith("chrome://") || value.startsWith("https://") || value === "#")], ["target", (node, value) => node.tagName === "A" && value === "_blank"]]);
const allowedOptionalAttributes = new Map([["class", allowAttribute], ["id", allowAttribute], ["is", (_node, value) => value === "action-link" || value === ""], ["role", (_node, value) => value === "link"], ["src", (node, value) => node.tagName === "IMG" && value.startsWith("chrome://")], ["tabindex", allowAttribute], ["aria-description", allowAttribute], ["aria-hidden", allowAttribute], ["aria-label", allowAttribute], ["aria-labelledby", allowAttribute]]);
const allowedTags = new Set(["A", "B", "I", "BR", "DIV", "EM", "KBD", "P", "PRE", "SPAN", "STRONG"]);
const allowedOptionalTags = new Set(["IMG", "LI", "UL"]);
let unsanitizedPolicy;
function mergeTags(optTags) {
    const clone = new Set(allowedTags);
    optTags.forEach((str => {
        const tag = str.toUpperCase();
        if (allowedOptionalTags.has(tag)) {
            clone.add(tag)
        }
    }
    ));
    return clone
}
function mergeAttrs(optAttrs) {
    const clone = new Map(allowedAttributes);
    optAttrs.forEach((key => {
        if (allowedOptionalAttributes.has(key)) {
            clone.set(key, allowedOptionalAttributes.get(key))
        }
    }
    ));
    return clone
}
function walk(n, f) {
    f(n);
    for (let i = 0; i < n.childNodes.length; i++) {
        walk(n.childNodes[i], f)
    }
}
function assertElement(tags, node) {
    if (!tags.has(node.tagName)) {
        throw Error(node.tagName + " is not supported")
    }
}
function assertAttribute(attrs, attrNode, node) {
    const n = attrNode.nodeName;
    const v = attrNode.nodeValue || "";
    if (!attrs.has(n) || !attrs.get(n)(node, v)) {
        throw Error(node.tagName + "[" + n + '="' + v + '"] is not supported')
    }
}
function parseHtmlSubset(s, extraTags, extraAttrs) {
    const tags = extraTags ? mergeTags(extraTags) : allowedTags;
    const attrs = extraAttrs ? mergeAttrs(extraAttrs) : allowedAttributes;
    const doc = document.implementation.createHTMLDocument("");
    const r = doc.createRange();
    r.selectNode(doc.body);
    if (window.trustedTypes) {
        if (!unsanitizedPolicy) {
            unsanitizedPolicy = window.trustedTypes.createPolicy("parse-html-subset", {
                createHTML: untrustedHTML => untrustedHTML,
                createScript: () => assertNotReached(),
                createScriptURL: () => assertNotReached()
            })
        }
        s = unsanitizedPolicy.createHTML(s)
    }
    const df = r.createContextualFragment(s);
    walk(df, (function(node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            assertElement(tags, node);
            const nodeAttrs = node.attributes;
            for (let i = 0; i < nodeAttrs.length; ++i) {
                assertAttribute(attrs, nodeAttrs[i], node)
            }
            break;
        case Node.COMMENT_NODE:
        case Node.DOCUMENT_FRAGMENT_NODE:
        case Node.TEXT_NODE:
            break;
        default:
            throw Error("Node type " + node.nodeType + " is not supported")
        }
    }
    ));
    return df
}
const I18nMixinLit = superClass => {
    class I18nMixinLit extends superClass {
        i18nRaw_(id, ...varArgs) {
            return varArgs.length === 0 ? loadTimeData.getString(id) : loadTimeData.getStringF(id, ...varArgs)
        }
        i18n(id, ...varArgs) {
            const rawString = this.i18nRaw_(id, ...varArgs);
            return parseHtmlSubset(`<b>${rawString}</b>`).firstChild.textContent
        }
        i18nAdvanced(id, opts) {
            opts = opts || {};
            const rawString = this.i18nRaw_(id, ...opts.substitutions || []);
            return sanitizeInnerHtml(rawString, opts)
        }
        i18nDynamic(_locale, id, ...varArgs) {
            return this.i18n(id, ...varArgs)
        }
        i18nRecursive(locale, id, ...varArgs) {
            let args = varArgs;
            if (args.length > 0) {
                args = args.map((str => this.i18nExists(str) ? loadTimeData.getString(str) : str))
            }
            return this.i18nDynamic(locale, id, ...args)
        }
        i18nExists(id) {
            return loadTimeData.valueExists(id)
        }
    }
    return I18nMixinLit
}
;
const isMac = /Mac/.test(navigator.platform);
const isWindows = /Win/.test(navigator.platform);
const isAndroid = /Android/.test(navigator.userAgent);
const isIOS = /CriOS/.test(navigator.userAgent);
function getSupportedScaleFactors() {
    const supportedScaleFactors = [];
    if (!isIOS) {
        supportedScaleFactors.push(1)
    }
    if (!isIOS && !isAndroid) {
        supportedScaleFactors.push(2)
    } else {
        supportedScaleFactors.push(window.devicePixelRatio)
    }
    return supportedScaleFactors
}
function getUrlForCss(s) {
    const s2 = s.replace(/(\(|\)|\,|\s|\'|\"|\\)/g, "\\$1");
    return `url("${s2}")`
}
function getImageSet(path) {
    const supportedScaleFactors = getSupportedScaleFactors();
    const replaceStartIndex = path.indexOf("SCALEFACTOR");
    if (replaceStartIndex < 0) {
        return getUrlForCss(path)
    }
    let s = "";
    for (let i = 0; i < supportedScaleFactors.length; ++i) {
        const scaleFactor = supportedScaleFactors[i];
        const pathWithScaleFactor = path.substr(0, replaceStartIndex) + scaleFactor + path.substr(replaceStartIndex + "scalefactor".length);
        s += getUrlForCss(pathWithScaleFactor) + " " + scaleFactor + "x";
        if (i !== supportedScaleFactors.length - 1) {
            s += ", "
        }
    }
    return "image-set(" + s + ")"
}
function getBaseFaviconUrl() {
    const faviconUrl = new URL("chrome://favicon2/");
    faviconUrl.searchParams.set("size", "16");
    faviconUrl.searchParams.set("scaleFactor", "SCALEFACTORx");
    return faviconUrl
}
function getDefaultFaviconUrlParams() {
    return {
        isSyncedUrlForHistoryUi: false,
        remoteIconUrlForUma: "",
        size: 16,
        forceLightMode: false,
        fallbackToHost: true,
        ignoreCache: false,
        forceEmptyDefaultFavicon: false,
        scaleFactor: ""
    }
}
function getFaviconUrl(url, optionalParams) {
    const params = Object.assign(getDefaultFaviconUrlParams(), optionalParams);
    const faviconUrl = getBaseFaviconUrl();
    faviconUrl.searchParams.set("pageUrl", url);
    faviconUrl.searchParams.set("size", params.size.toString());
    const fallback = params.isSyncedUrlForHistoryUi ? "1" : "0";
    faviconUrl.searchParams.set("allowGoogleServerFallback", fallback);
    if (params.isSyncedUrlForHistoryUi) {
        faviconUrl.searchParams.set("iconUrl", params.remoteIconUrlForUma)
    }
    if (params.forceLightMode) {
        faviconUrl.searchParams.set("forceLightMode", "true")
    }
    if (!params.fallbackToHost) {
        faviconUrl.searchParams.set("fallbackToHost", "0")
    }
    if (params.ignoreCache) {
        faviconUrl.searchParams.set("cacheBypass", String(Date.now()))
    }
    if (params.forceEmptyDefaultFavicon) {
        faviconUrl.searchParams.set("forceEmptyDefaultFavicon", "1")
    }
    if (params.scaleFactor) {
        faviconUrl.searchParams.set("scaleFactor", params.scaleFactor)
    }
    return faviconUrl.toString()
}
function getFaviconForPageURL(url, isSyncedUrlForHistoryUi, remoteIconUrlForUma="", size=16, forceLightMode=false, fallbackToHost=true, ignoreCache=false, forceEmptyDefaultFavicon=false, scaleFactor="") {
    return getImageSet(getFaviconUrl(url, {
        isSyncedUrlForHistoryUi: isSyncedUrlForHistoryUi,
        remoteIconUrlForUma: remoteIconUrlForUma,
        size: size,
        forceLightMode: forceLightMode,
        fallbackToHost: fallbackToHost,
        ignoreCache: ignoreCache,
        forceEmptyDefaultFavicon: forceEmptyDefaultFavicon,
        scaleFactor: scaleFactor
    }))
}
let instance$p = null;
function getCss$k() {
    return instance$p || (instance$p = [...[], css`:host{--cr-icon-button-fill-color:currentColor;--cr-icon-button-icon-start-offset:0;--cr-icon-button-icon-size:20px;--cr-icon-button-size:32px;--cr-icon-button-height:var(--cr-icon-button-size);--cr-icon-button-transition:150ms ease-in-out;--cr-icon-button-width:var(--cr-icon-button-size);-webkit-tap-highlight-color:transparent;border-radius:50%;color:var(--cr-icon-button-stroke-color,var(--cr-icon-button-fill-color));cursor:pointer;display:inline-flex;flex-shrink:0;height:var(--cr-icon-button-height);margin-inline-end:var(--cr-icon-button-margin-end,var(--cr-icon-ripple-margin));margin-inline-start:var(--cr-icon-button-margin-start);outline:none;overflow:hidden;position:relative;user-select:none;vertical-align:middle;width:var(--cr-icon-button-width)}:host(:hover){background-color:var(--cr-icon-button-hover-background-color,var(--cr-hover-background-color))}:host(:focus-visible:focus){box-shadow:inset 0 0 0 2px var(--cr-icon-button-focus-outline-color,var(--cr-focus-outline-color))}@media (forced-colors:active){:host(:focus-visible:focus){outline:var(--cr-focus-outline-hcm)}}#ink{--paper-ripple-opacity:1;color:var(--cr-icon-button-active-background-color,var(--cr-active-background-color))}:host([disabled]){cursor:initial;opacity:var(--cr-disabled-opacity);pointer-events:none}:host(.no-overlap){--cr-icon-button-margin-end:0;--cr-icon-button-margin-start:0}:host-context([dir=rtl]):host(:not([suppress-rtl-flip]):not([multiple-icons_])){transform:scaleX(-1)}:host-context([dir=rtl]):host(:not([suppress-rtl-flip])[multiple-icons_]) cr-icon{transform:scaleX(-1)}:host(:not([iron-icon])) #maskedImage{-webkit-mask-image:var(--cr-icon-image);-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:var(--cr-icon-button-icon-size);-webkit-transform:var(--cr-icon-image-transform,none);background-color:var(--cr-icon-button-fill-color);height:100%;transition:background-color var(--cr-icon-button-transition);width:100%}@media (forced-colors:active){:host(:not([iron-icon])) #maskedImage{background-color:ButtonText}}#icon{align-items:center;border-radius:4px;display:flex;height:100%;justify-content:center;padding-inline-start:var(--cr-icon-button-icon-start-offset);position:relative;width:100%}cr-icon{--iron-icon-fill-color:var(--cr-icon-button-fill-color);--iron-icon-stroke-color:var(--cr-icon-button-stroke-color,none);--iron-icon-height:var(--cr-icon-button-icon-size);--iron-icon-width:var(--cr-icon-button-icon-size);transition:fill var(--cr-icon-button-transition),stroke var(--cr-icon-button-transition)}@media (prefers-color-scheme:dark){:host{--cr-icon-button-fill-color:var(--google-grey-500)}}`])
}
function getHtml$h() {
    return html`
<div id="icon">
  <div id="maskedImage"></div>
</div>`
}
const CrIconbuttonElementBase = CrRippleMixin(CrLitElement);
class CrIconButtonElement extends CrIconbuttonElementBase {
    static get is() {
        return "cr-icon-button"
    }
    static get styles() {
        return getCss$k()
    }
    render() {
        return getHtml$h.bind(this)()
    }
    static get properties() {
        return {
            disabled: {
                type: Boolean,
                reflect: true
            },
            ironIcon: {
                type: String,
                reflect: true
            },
            suppressRtlFlip: {
                type: Boolean,
                value: false,
                reflect: true
            },
            multipleIcons_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    #disabled_accessor_storage = false;
    get disabled() {
        return this.#disabled_accessor_storage
    }
    set disabled(value) {
        this.#disabled_accessor_storage = value
    }
    #ironIcon_accessor_storage;
    get ironIcon() {
        return this.#ironIcon_accessor_storage
    }
    set ironIcon(value) {
        this.#ironIcon_accessor_storage = value
    }
    #multipleIcons__accessor_storage = false;
    get multipleIcons_() {
        return this.#multipleIcons__accessor_storage
    }
    set multipleIcons_(value) {
        this.#multipleIcons__accessor_storage = value
    }
    spaceKeyDown_ = false;
    constructor() {
        super();
        this.addEventListener("blur", this.onBlur_.bind(this));
        this.addEventListener("click", this.onClick_.bind(this));
        this.addEventListener("keydown", this.onKeyDown_.bind(this));
        this.addEventListener("keyup", this.onKeyUp_.bind(this));
        this.ensureRippleOnPointerdown()
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("ironIcon")) {
            const icons = (this.ironIcon || "").split(",");
            this.multipleIcons_ = icons.length > 1
        }
    }
    firstUpdated() {
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "button")
        }
        if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", "0")
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("disabled")) {
            this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
            this.disabledChanged_(this.disabled, changedProperties.get("disabled"))
        }
        if (changedProperties.has("ironIcon")) {
            this.onIronIconChanged_()
        }
    }
    disabledChanged_(newValue, oldValue) {
        if (!newValue && oldValue === undefined) {
            return
        }
        if (this.disabled) {
            this.blur()
        }
        this.setAttribute("tabindex", String(this.disabled ? -1 : 0))
    }
    onBlur_() {
        this.spaceKeyDown_ = false
    }
    onClick_(e) {
        if (this.disabled) {
            e.stopImmediatePropagation()
        }
    }
    onIronIconChanged_() {
        this.shadowRoot.querySelectorAll("cr-icon").forEach((el => el.remove()));
        if (!this.ironIcon) {
            return
        }
        const icons = (this.ironIcon || "").split(",");
        icons.forEach((async icon => {
            const crIcon = document.createElement("cr-icon");
            crIcon.icon = icon;
            this.$.icon.appendChild(crIcon);
            await crIcon.updateComplete;
            crIcon.shadowRoot.querySelectorAll("svg, img").forEach((child => child.setAttribute("role", "none")))
        }
        ))
    }
    onKeyDown_(e) {
        if (e.key !== " " && e.key !== "Enter") {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) {
            return
        }
        if (e.key === "Enter") {
            this.click()
        } else if (e.key === " ") {
            this.spaceKeyDown_ = true
        }
    }
    onKeyUp_(e) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation()
        }
        if (this.spaceKeyDown_ && e.key === " ") {
            this.spaceKeyDown_ = false;
            this.click()
        }
    }
}
customElements.define(CrIconButtonElement.is, CrIconButtonElement);
const NavigationPredictorSpec = {
    $: mojo.internal.Enum()
};
var NavigationPredictor;
(function(NavigationPredictor) {
    NavigationPredictor[NavigationPredictor["MIN_VALUE"] = 1] = "MIN_VALUE";
    NavigationPredictor[NavigationPredictor["MAX_VALUE"] = 3] = "MAX_VALUE";
    NavigationPredictor[NavigationPredictor["kMouseDown"] = 1] = "kMouseDown";
    NavigationPredictor[NavigationPredictor["kUpOrDownArrowButton"] = 2] = "kUpOrDownArrowButton";
    NavigationPredictor[NavigationPredictor["kTouchDown"] = 3] = "kTouchDown"
}
)(NavigationPredictor || (NavigationPredictor = {}));
({
    $: mojo.internal.Enum()
});
var PageClassification;
(function(PageClassification) {
    PageClassification[PageClassification["MIN_VALUE"] = 0] = "MIN_VALUE";
    PageClassification[PageClassification["MAX_VALUE"] = 28] = "MAX_VALUE";
    PageClassification[PageClassification["INVALID_SPEC"] = 0] = "INVALID_SPEC";
    PageClassification[PageClassification["NTP"] = 1] = "NTP";
    PageClassification[PageClassification["BLANK"] = 2] = "BLANK";
    PageClassification[PageClassification["HOME_PAGE"] = 3] = "HOME_PAGE";
    PageClassification[PageClassification["OTHER"] = 4] = "OTHER";
    PageClassification[PageClassification["SEARCH_RESULT_PAGE_DOING_SEARCH_TERM_REPLACEMENT"] = 6] = "SEARCH_RESULT_PAGE_DOING_SEARCH_TERM_REPLACEMENT";
    PageClassification[PageClassification["INSTANT_NTP_WITH_OMNIBOX_AS_STARTING_FOCUS"] = 7] = "INSTANT_NTP_WITH_OMNIBOX_AS_STARTING_FOCUS";
    PageClassification[PageClassification["SEARCH_RESULT_PAGE_NO_SEARCH_TERM_REPLACEMENT"] = 9] = "SEARCH_RESULT_PAGE_NO_SEARCH_TERM_REPLACEMENT";
    PageClassification[PageClassification["APP_HOME"] = 10] = "APP_HOME";
    PageClassification[PageClassification["APP_SEARCH"] = 11] = "APP_SEARCH";
    PageClassification[PageClassification["APP_MAPS"] = 12] = "APP_MAPS";
    PageClassification[PageClassification["SEARCH_BUTTON_AS_STARTING_FOCUS"] = 13] = "SEARCH_BUTTON_AS_STARTING_FOCUS";
    PageClassification[PageClassification["CHROMEOS_APP_LIST"] = 14] = "CHROMEOS_APP_LIST";
    PageClassification[PageClassification["NTP_REALBOX"] = 15] = "NTP_REALBOX";
    PageClassification[PageClassification["ANDROID_SEARCH_WIDGET"] = 16] = "ANDROID_SEARCH_WIDGET";
    PageClassification[PageClassification["ANDROID_SHORTCUTS_WIDGET"] = 19] = "ANDROID_SHORTCUTS_WIDGET";
    PageClassification[PageClassification["NTP_ZPS_PREFETCH"] = 20] = "NTP_ZPS_PREFETCH";
    PageClassification[PageClassification["JOURNEYS"] = 21] = "JOURNEYS";
    PageClassification[PageClassification["SRP_ZPS_PREFETCH"] = 22] = "SRP_ZPS_PREFETCH";
    PageClassification[PageClassification["OTHER_ZPS_PREFETCH"] = 23] = "OTHER_ZPS_PREFETCH";
    PageClassification[PageClassification["CONTEXTUAL_SEARCHBOX"] = 24] = "CONTEXTUAL_SEARCHBOX";
    PageClassification[PageClassification["SEARCH_SIDE_PANEL_SEARCHBOX"] = 25] = "SEARCH_SIDE_PANEL_SEARCHBOX";
    PageClassification[PageClassification["LENS_SIDE_PANEL_SEARCHBOX"] = 26] = "LENS_SIDE_PANEL_SEARCHBOX";
    PageClassification[PageClassification["SEARCH_RESULT_PAGE_ON_CCT"] = 27] = "SEARCH_RESULT_PAGE_ON_CCT";
    PageClassification[PageClassification["OTHER_ON_CCT"] = 28] = "OTHER_ON_CCT"
}
)(PageClassification || (PageClassification = {}));
const BigBufferSharedMemoryRegionSpec = {
    $: {}
};
const BigBufferSpec = {
    $: {}
};
mojo.internal.Struct(BigBufferSharedMemoryRegionSpec.$, "BigBufferSharedMemoryRegion", [mojo.internal.StructField("bufferHandle", 0, 0, mojo.internal.Handle, null, false, 0, undefined, undefined), mojo.internal.StructField("size", 4, 0, mojo.internal.Uint32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Union(BigBufferSpec.$, "BigBuffer", {
    bytes: {
        ordinal: 0,
        type: mojo.internal.Array(mojo.internal.Uint8, false)
    },
    sharedMemory: {
        ordinal: 1,
        type: BigBufferSharedMemoryRegionSpec.$
    },
    invalidBuffer: {
        ordinal: 2,
        type: mojo.internal.Bool
    }
});
var BigBufferFieldTags;
(function(BigBufferFieldTags) {
    BigBufferFieldTags[BigBufferFieldTags["BYTES"] = 0] = "BYTES";
    BigBufferFieldTags[BigBufferFieldTags["SHARED_MEMORY"] = 1] = "SHARED_MEMORY";
    BigBufferFieldTags[BigBufferFieldTags["INVALID_BUFFER"] = 2] = "INVALID_BUFFER"
}
)(BigBufferFieldTags || (BigBufferFieldTags = {}));
class UnguessableTokenDataView {
    decoder_;
    version_;
    fieldSpecs_;
    constructor(decoder, version, fieldSpecs) {
        this.decoder_ = decoder;
        this.version_ = version;
        this.fieldSpecs_ = fieldSpecs
    }
    get high() {
        const field = this.fieldSpecs_[0];
        return mojo.internal.decodeStructField(this.decoder_, field, this.version_)
    }
    get low() {
        const field = this.fieldSpecs_[1];
        return mojo.internal.decodeStructField(this.decoder_, field, this.version_)
    }
}
const HEX_BASE = 16;
const TOKEN_COMPONENT_STR_LENGTH = 64 / 4;
class UnguessableTokenConverter {
    validate(token) {
        if (token.length !== 2 * TOKEN_COMPONENT_STR_LENGTH) {
            throw new Error("token is malformed: " + token)
        }
        if (token !== token.toUpperCase()) {
            throw new Error("token is not uppercase: " + token)
        }
    }
    high(token) {
        this.validate(token);
        return BigInt(`0x${token.slice(0, TOKEN_COMPONENT_STR_LENGTH)}`)
    }
    low(token) {
        this.validate(token);
        return BigInt(`0x${token.slice(TOKEN_COMPONENT_STR_LENGTH)}`)
    }
    convert(view) {
        return (view.high.toString(HEX_BASE).padStart(TOKEN_COMPONENT_STR_LENGTH, "0") + view.low.toString(HEX_BASE).padStart(TOKEN_COMPONENT_STR_LENGTH, "0")).toUpperCase()
    }
}
const UnguessableTokenSpec = {
    $: {}
};
const converterForUnguessableToken = new UnguessableTokenConverter;
mojo.internal.TypemappedStruct(UnguessableTokenSpec.$, "UnguessableToken", UnguessableTokenDataView, converterForUnguessableToken, [mojo.internal.StructField("high", 0, 0, mojo.internal.Uint64, BigInt(0), false, 0, undefined, (value => converterForUnguessableToken.high(value))), mojo.internal.StructField("low", 8, 0, mojo.internal.Uint64, BigInt(0), false, 0, undefined, (value => converterForUnguessableToken.low(value)))], [[0, 24]]);
const FileUploadStatusSpec = {
    $: mojo.internal.Enum()
};
var FileUploadStatus;
(function(FileUploadStatus) {
    FileUploadStatus[FileUploadStatus["MIN_VALUE"] = 0] = "MIN_VALUE";
    FileUploadStatus[FileUploadStatus["MAX_VALUE"] = 7] = "MAX_VALUE";
    FileUploadStatus[FileUploadStatus["kNotUploaded"] = 0] = "kNotUploaded";
    FileUploadStatus[FileUploadStatus["kProcessing"] = 1] = "kProcessing";
    FileUploadStatus[FileUploadStatus["kValidationFailed"] = 2] = "kValidationFailed";
    FileUploadStatus[FileUploadStatus["kUploadStarted"] = 3] = "kUploadStarted";
    FileUploadStatus[FileUploadStatus["kUploadSuccessful"] = 4] = "kUploadSuccessful";
    FileUploadStatus[FileUploadStatus["kUploadFailed"] = 5] = "kUploadFailed";
    FileUploadStatus[FileUploadStatus["kUploadExpired"] = 6] = "kUploadExpired";
    FileUploadStatus[FileUploadStatus["kProcessingSuggestSignalsReady"] = 7] = "kProcessingSuggestSignalsReady"
}
)(FileUploadStatus || (FileUploadStatus = {}));
const FileUploadErrorTypeSpec = {
    $: mojo.internal.Enum()
};
var FileUploadErrorType;
(function(FileUploadErrorType) {
    FileUploadErrorType[FileUploadErrorType["MIN_VALUE"] = 0] = "MIN_VALUE";
    FileUploadErrorType[FileUploadErrorType["MAX_VALUE"] = 6] = "MAX_VALUE";
    FileUploadErrorType[FileUploadErrorType["kUnknown"] = 0] = "kUnknown";
    FileUploadErrorType[FileUploadErrorType["kBrowserProcessingError"] = 1] = "kBrowserProcessingError";
    FileUploadErrorType[FileUploadErrorType["kNetworkError"] = 2] = "kNetworkError";
    FileUploadErrorType[FileUploadErrorType["kServerError"] = 3] = "kServerError";
    FileUploadErrorType[FileUploadErrorType["kServerSizeLimitExceeded"] = 4] = "kServerSizeLimitExceeded";
    FileUploadErrorType[FileUploadErrorType["kAborted"] = 5] = "kAborted";
    FileUploadErrorType[FileUploadErrorType["kImageProcessingError"] = 6] = "kImageProcessingError"
}
)(FileUploadErrorType || (FileUploadErrorType = {}));
const SideTypeSpec = {
    $: mojo.internal.Enum()
};
var SideType;
(function(SideType) {
    SideType[SideType["MIN_VALUE"] = 0] = "MIN_VALUE";
    SideType[SideType["MAX_VALUE"] = 1] = "MAX_VALUE";
    SideType[SideType["kDefaultPrimary"] = 0] = "kDefaultPrimary";
    SideType[SideType["kSecondary"] = 1] = "kSecondary"
}
)(SideType || (SideType = {}));
const RenderTypeSpec = {
    $: mojo.internal.Enum()
};
var RenderType;
(function(RenderType) {
    RenderType[RenderType["MIN_VALUE"] = 0] = "MIN_VALUE";
    RenderType[RenderType["MAX_VALUE"] = 2] = "MAX_VALUE";
    RenderType[RenderType["kDefaultVertical"] = 0] = "kDefaultVertical";
    RenderType[RenderType["kHorizontal"] = 1] = "kHorizontal";
    RenderType[RenderType["kGrid"] = 2] = "kGrid"
}
)(RenderType || (RenderType = {}));
const SelectionLineStateSpec = {
    $: mojo.internal.Enum()
};
var SelectionLineState;
(function(SelectionLineState) {
    SelectionLineState[SelectionLineState["MIN_VALUE"] = 1] = "MIN_VALUE";
    SelectionLineState[SelectionLineState["MAX_VALUE"] = 4] = "MAX_VALUE";
    SelectionLineState[SelectionLineState["kNormal"] = 1] = "kNormal";
    SelectionLineState[SelectionLineState["kKeywordMode"] = 2] = "kKeywordMode";
    SelectionLineState[SelectionLineState["kFocusedButtonAction"] = 3] = "kFocusedButtonAction";
    SelectionLineState[SelectionLineState["kFocusedButtonRemoveSuggestion"] = 4] = "kFocusedButtonRemoveSuggestion"
}
)(SelectionLineState || (SelectionLineState = {}));
class PageHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "searchbox.mojom.PageHandler", scope)
    }
}
class PageHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(PageHandlerPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    setPage(page) {
        this.proxy.sendMessage(0, PageHandler_SetPage_ParamsSpec.$, null, [page], false)
    }
    onFocusChanged(focused) {
        this.proxy.sendMessage(1, PageHandler_OnFocusChanged_ParamsSpec.$, null, [focused], false)
    }
    queryAutocomplete(input, preventInlineAutocomplete) {
        this.proxy.sendMessage(2, PageHandler_QueryAutocomplete_ParamsSpec.$, null, [input, preventInlineAutocomplete], false)
    }
    stopAutocomplete(clearResult) {
        this.proxy.sendMessage(3, PageHandler_StopAutocomplete_ParamsSpec.$, null, [clearResult], false)
    }
    openAutocompleteMatch(line, url, areMatchesShowing, mouseButton, altKey, ctrlKey, metaKey, shiftKey) {
        this.proxy.sendMessage(4, PageHandler_OpenAutocompleteMatch_ParamsSpec.$, null, [line, url, areMatchesShowing, mouseButton, altKey, ctrlKey, metaKey, shiftKey], false)
    }
    onNavigationLikely(line, url, navigationPredictor) {
        this.proxy.sendMessage(5, PageHandler_OnNavigationLikely_ParamsSpec.$, null, [line, url, navigationPredictor], false)
    }
    deleteAutocompleteMatch(line, url) {
        this.proxy.sendMessage(6, PageHandler_DeleteAutocompleteMatch_ParamsSpec.$, null, [line, url], false)
    }
    activateKeyword(line, url, matchSelectionTimestamp, isMouseEvent) {
        this.proxy.sendMessage(7, PageHandler_ActivateKeyword_ParamsSpec.$, null, [line, url, matchSelectionTimestamp, isMouseEvent], false)
    }
    executeAction(line, actionIndex, url, matchSelectionTimestamp, mouseButton, altKey, ctrlKey, metaKey, shiftKey) {
        this.proxy.sendMessage(8, PageHandler_ExecuteAction_ParamsSpec.$, null, [line, actionIndex, url, matchSelectionTimestamp, mouseButton, altKey, ctrlKey, metaKey, shiftKey], false)
    }
    onThumbnailRemoved() {
        this.proxy.sendMessage(9, PageHandler_OnThumbnailRemoved_ParamsSpec.$, null, [], false)
    }
    getPlaceholderConfig() {
        return this.proxy.sendMessage(10, PageHandler_GetPlaceholderConfig_ParamsSpec.$, PageHandler_GetPlaceholderConfig_ResponseParamsSpec.$, [], false)
    }
    getRecentTabs() {
        return this.proxy.sendMessage(11, PageHandler_GetRecentTabs_ParamsSpec.$, PageHandler_GetRecentTabs_ResponseParamsSpec.$, [], false)
    }
    getTabPreview(tabId) {
        return this.proxy.sendMessage(12, PageHandler_GetTabPreview_ParamsSpec.$, PageHandler_GetTabPreview_ResponseParamsSpec.$, [tabId], false)
    }
    notifySessionStarted() {
        this.proxy.sendMessage(13, PageHandler_NotifySessionStarted_ParamsSpec.$, null, [], false)
    }
    notifySessionAbandoned() {
        this.proxy.sendMessage(14, PageHandler_NotifySessionAbandoned_ParamsSpec.$, null, [], false)
    }
    addFileContext(fileInfo, fileBytes) {
        return this.proxy.sendMessage(15, PageHandler_AddFileContext_ParamsSpec.$, PageHandler_AddFileContext_ResponseParamsSpec.$, [fileInfo, fileBytes], false)
    }
    addTabContext(tabId) {
        return this.proxy.sendMessage(16, PageHandler_AddTabContext_ParamsSpec.$, PageHandler_AddTabContext_ResponseParamsSpec.$, [tabId], false)
    }
    deleteContext(token) {
        this.proxy.sendMessage(17, PageHandler_DeleteContext_ParamsSpec.$, null, [token], false)
    }
    clearFiles() {
        this.proxy.sendMessage(18, PageHandler_ClearFiles_ParamsSpec.$, null, [], false)
    }
    submitQuery(queryText, mouseButton, altKey, ctrlKey, metaKey, shiftKey) {
        this.proxy.sendMessage(19, PageHandler_SubmitQuery_ParamsSpec.$, null, [queryText, mouseButton, altKey, ctrlKey, metaKey, shiftKey], false)
    }
}
class PageHandler {
    static get $interfaceName() {
        return "searchbox.mojom.PageHandler"
    }
    static getRemote() {
        let remote = new PageHandlerRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}
class PagePendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "searchbox.mojom.Page", scope)
    }
}
class PageRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(PagePendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    autocompleteResultChanged(result) {
        this.proxy.sendMessage(0, Page_AutocompleteResultChanged_ParamsSpec.$, null, [result], false)
    }
    updateSelection(oldSelection, selection) {
        this.proxy.sendMessage(1, Page_UpdateSelection_ParamsSpec.$, null, [oldSelection, selection], false)
    }
    setInputText(input) {
        this.proxy.sendMessage(2, Page_SetInputText_ParamsSpec.$, null, [input], false)
    }
    setThumbnail(thumbnailUrl, isDeletable) {
        this.proxy.sendMessage(3, Page_SetThumbnail_ParamsSpec.$, null, [thumbnailUrl, isDeletable], false)
    }
    onContextualInputStatusChanged(token, status, errorType) {
        this.proxy.sendMessage(4, Page_OnContextualInputStatusChanged_ParamsSpec.$, null, [token, status, errorType], false)
    }
    onTabStripChanged() {
        this.proxy.sendMessage(5, Page_OnTabStripChanged_ParamsSpec.$, null, [], false)
    }
}
class PageCallbackRouter {
    helper_internal_;
    $;
    router_;
    autocompleteResultChanged;
    updateSelection;
    setInputText;
    setThumbnail;
    onContextualInputStatusChanged;
    onTabStripChanged;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(PageRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.autocompleteResultChanged = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(0, Page_AutocompleteResultChanged_ParamsSpec.$, null, this.autocompleteResultChanged.createReceiverHandler(false), false);
        this.updateSelection = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1, Page_UpdateSelection_ParamsSpec.$, null, this.updateSelection.createReceiverHandler(false), false);
        this.setInputText = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2, Page_SetInputText_ParamsSpec.$, null, this.setInputText.createReceiverHandler(false), false);
        this.setThumbnail = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(3, Page_SetThumbnail_ParamsSpec.$, null, this.setThumbnail.createReceiverHandler(false), false);
        this.onContextualInputStatusChanged = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(4, Page_OnContextualInputStatusChanged_ParamsSpec.$, null, this.onContextualInputStatusChanged.createReceiverHandler(false), false);
        this.onTabStripChanged = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(5, Page_OnTabStripChanged_ParamsSpec.$, null, this.onTabStripChanged.createReceiverHandler(false), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter()
    }
    removeListener(id) {
        return this.router_.removeListener(id)
    }
}
const ACMatchClassificationSpec = {
    $: {}
};
const ActionSpec = {
    $: {}
};
const SuggestionAnswerSpec = {
    $: {}
};
const AutocompleteMatchSpec = {
    $: {}
};
const TabInfoSpec = {
    $: {}
};
const SelectedFileInfoSpec = {
    $: {}
};
const SuggestionGroupSpec = {
    $: {}
};
const AutocompleteResultSpec = {
    $: {}
};
const OmniboxPopupSelectionSpec = {
    $: {}
};
const PlaceholderConfigSpec = {
    $: {}
};
const PageHandler_SetPage_ParamsSpec = {
    $: {}
};
const PageHandler_OnFocusChanged_ParamsSpec = {
    $: {}
};
const PageHandler_QueryAutocomplete_ParamsSpec = {
    $: {}
};
const PageHandler_StopAutocomplete_ParamsSpec = {
    $: {}
};
const PageHandler_OpenAutocompleteMatch_ParamsSpec = {
    $: {}
};
const PageHandler_OnNavigationLikely_ParamsSpec = {
    $: {}
};
const PageHandler_DeleteAutocompleteMatch_ParamsSpec = {
    $: {}
};
const PageHandler_ActivateKeyword_ParamsSpec = {
    $: {}
};
const PageHandler_ExecuteAction_ParamsSpec = {
    $: {}
};
const PageHandler_OnThumbnailRemoved_ParamsSpec = {
    $: {}
};
const PageHandler_GetPlaceholderConfig_ParamsSpec = {
    $: {}
};
const PageHandler_GetPlaceholderConfig_ResponseParamsSpec = {
    $: {}
};
const PageHandler_GetRecentTabs_ParamsSpec = {
    $: {}
};
const PageHandler_GetRecentTabs_ResponseParamsSpec = {
    $: {}
};
const PageHandler_GetTabPreview_ParamsSpec = {
    $: {}
};
const PageHandler_GetTabPreview_ResponseParamsSpec = {
    $: {}
};
const PageHandler_NotifySessionStarted_ParamsSpec = {
    $: {}
};
const PageHandler_NotifySessionAbandoned_ParamsSpec = {
    $: {}
};
const PageHandler_AddFileContext_ParamsSpec = {
    $: {}
};
const PageHandler_AddFileContext_ResponseParamsSpec = {
    $: {}
};
const PageHandler_AddTabContext_ParamsSpec = {
    $: {}
};
const PageHandler_AddTabContext_ResponseParamsSpec = {
    $: {}
};
const PageHandler_DeleteContext_ParamsSpec = {
    $: {}
};
const PageHandler_ClearFiles_ParamsSpec = {
    $: {}
};
const PageHandler_SubmitQuery_ParamsSpec = {
    $: {}
};
const Page_AutocompleteResultChanged_ParamsSpec = {
    $: {}
};
const Page_UpdateSelection_ParamsSpec = {
    $: {}
};
const Page_SetInputText_ParamsSpec = {
    $: {}
};
const Page_SetThumbnail_ParamsSpec = {
    $: {}
};
const Page_OnContextualInputStatusChanged_ParamsSpec = {
    $: {}
};
const Page_OnTabStripChanged_ParamsSpec = {
    $: {}
};
mojo.internal.Struct(ACMatchClassificationSpec.$, "ACMatchClassification", [mojo.internal.StructField("offset", 0, 0, mojo.internal.Uint32, 0, false, 0, undefined, undefined), mojo.internal.StructField("style", 4, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(ActionSpec.$, "Action", [mojo.internal.StructField("hint", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("suggestionContents", 8, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("iconPath", 16, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("a11yLabel", 24, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 40]]);
mojo.internal.Struct(SuggestionAnswerSpec.$, "SuggestionAnswer", [mojo.internal.StructField("firstLine", 0, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("secondLine", 8, 0, String16Spec.$, null, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(AutocompleteMatchSpec.$, "AutocompleteMatch", [mojo.internal.StructField("a11yLabel", 0, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("allowedToBeDefaultMatch", 8, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("actions", 16, 0, mojo.internal.Array(ActionSpec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("answer", 24, 0, SuggestionAnswerSpec.$, null, true, 0, undefined, undefined), mojo.internal.StructField("contents", 32, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("contentsClass", 40, 0, mojo.internal.Array(ACMatchClassificationSpec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("description", 48, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("descriptionClass", 56, 0, mojo.internal.Array(ACMatchClassificationSpec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("destinationUrl", 64, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("inlineAutocompletion", 72, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("fillIntoEdit", 80, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("is_weather_answer_suggestion_$flag", 8, 1, mojo.internal.Bool, false, false, 0, {
    isPrimary: true,
    linkedValueFieldName: "is_weather_answer_suggestion_$value",
    originalFieldName: "isWeatherAnswerSuggestion"
}, undefined), mojo.internal.StructField("is_weather_answer_suggestion_$value", 8, 2, mojo.internal.Bool, false, false, 0, {
    isPrimary: false,
    originalFieldName: "isWeatherAnswerSuggestion"
}, undefined), mojo.internal.StructField("iconPath", 88, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("iconUrl", 96, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("imageDominantColor", 104, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("imageUrl", 112, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("isNoncannedAimSuggestion", 8, 3, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("isRichSuggestion", 8, 4, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("isSearchType", 8, 5, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("isEnterpriseSearchAggregatorPeopleType", 8, 6, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("type", 120, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("removeButtonA11yLabel", 128, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("swapContentsAndDescription", 8, 7, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("suggestionGroupId", 12, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("supportsDeletion", 9, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("tailSuggestCommonPrefix", 136, 0, String16Spec.$, null, true, 0, undefined, undefined), mojo.internal.StructField("hasInstantKeyword", 9, 1, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("keywordChipHint", 144, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("keywordChipA11y", 152, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 168]]);
mojo.internal.Struct(TabInfoSpec.$, "TabInfo", [mojo.internal.StructField("tabId", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("title", 8, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("url", 16, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("lastActive", 24, 0, TimeTicksSpec.$, null, false, 0, undefined, undefined)], [[0, 40]]);
mojo.internal.Struct(SelectedFileInfoSpec.$, "SelectedFileInfo", [mojo.internal.StructField("fileName", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("mimeType", 8, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("selectionTime", 16, 0, JSTimeSpec.$, null, false, 0, undefined, undefined)], [[0, 32]]);
mojo.internal.Struct(SuggestionGroupSpec.$, "SuggestionGroup", [mojo.internal.StructField("header", 0, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("renderType", 8, 0, RenderTypeSpec.$, RenderType.kDefaultVertical, false, 0, undefined, undefined), mojo.internal.StructField("sideType", 12, 0, SideTypeSpec.$, SideType.kDefaultPrimary, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(AutocompleteResultSpec.$, "AutocompleteResult", [mojo.internal.StructField("input", 0, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("suggestionGroupsMap", 8, 0, mojo.internal.Map(mojo.internal.Int32, SuggestionGroupSpec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("matches", 16, 0, mojo.internal.Array(AutocompleteMatchSpec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("smartComposeInlineHint", 24, 0, String16Spec.$, null, true, 0, undefined, undefined)], [[0, 40]]);
mojo.internal.Struct(OmniboxPopupSelectionSpec.$, "OmniboxPopupSelection", [mojo.internal.StructField("line", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("state", 4, 0, SelectionLineStateSpec.$, 1, false, 0, undefined, undefined), mojo.internal.StructField("actionIndex", 1, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PlaceholderConfigSpec.$, "PlaceholderConfig", [mojo.internal.StructField("texts", 0, 0, mojo.internal.Array(String16Spec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("changeTextAnimationInterval", 8, 0, TimeDeltaSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("fadeTextAnimationDuration", 16, 0, TimeDeltaSpec.$, null, false, 0, undefined, undefined)], [[0, 32]]);
mojo.internal.Struct(PageHandler_SetPage_ParamsSpec.$, "PageHandler_SetPage_Params", [mojo.internal.StructField("page", 0, 0, mojo.internal.InterfaceProxy(PageRemote), null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_OnFocusChanged_ParamsSpec.$, "PageHandler_OnFocusChanged_Params", [mojo.internal.StructField("focused", 0, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_QueryAutocomplete_ParamsSpec.$, "PageHandler_QueryAutocomplete_Params", [mojo.internal.StructField("input", 0, 0, String16Spec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("preventInlineAutocomplete", 8, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(PageHandler_StopAutocomplete_ParamsSpec.$, "PageHandler_StopAutocomplete_Params", [mojo.internal.StructField("clearResult", 0, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_OpenAutocompleteMatch_ParamsSpec.$, "PageHandler_OpenAutocompleteMatch_Params", [mojo.internal.StructField("line", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("url", 8, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("areMatchesShowing", 1, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("mouseButton", 2, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("altKey", 1, 1, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("ctrlKey", 1, 2, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("metaKey", 1, 3, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("shiftKey", 1, 4, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(PageHandler_OnNavigationLikely_ParamsSpec.$, "PageHandler_OnNavigationLikely_Params", [mojo.internal.StructField("line", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("url", 8, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("navigationPredictor", 4, 0, NavigationPredictorSpec.$, 1, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(PageHandler_DeleteAutocompleteMatch_ParamsSpec.$, "PageHandler_DeleteAutocompleteMatch_Params", [mojo.internal.StructField("line", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("url", 8, 0, UrlSpec.$, null, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(PageHandler_ActivateKeyword_ParamsSpec.$, "PageHandler_ActivateKeyword_Params", [mojo.internal.StructField("line", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("url", 8, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("matchSelectionTimestamp", 16, 0, TimeTicksSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("isMouseEvent", 1, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 32]]);
mojo.internal.Struct(PageHandler_ExecuteAction_ParamsSpec.$, "PageHandler_ExecuteAction_Params", [mojo.internal.StructField("line", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("actionIndex", 1, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("url", 8, 0, UrlSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("matchSelectionTimestamp", 16, 0, TimeTicksSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("mouseButton", 2, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("altKey", 3, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("ctrlKey", 3, 1, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("metaKey", 3, 2, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("shiftKey", 3, 3, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 32]]);
mojo.internal.Struct(PageHandler_OnThumbnailRemoved_ParamsSpec.$, "PageHandler_OnThumbnailRemoved_Params", [], [[0, 8]]);
mojo.internal.Struct(PageHandler_GetPlaceholderConfig_ParamsSpec.$, "PageHandler_GetPlaceholderConfig_Params", [], [[0, 8]]);
mojo.internal.Struct(PageHandler_GetPlaceholderConfig_ResponseParamsSpec.$, "PageHandler_GetPlaceholderConfig_ResponseParams", [mojo.internal.StructField("config", 0, 0, PlaceholderConfigSpec.$, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_GetRecentTabs_ParamsSpec.$, "PageHandler_GetRecentTabs_Params", [], [[0, 8]]);
mojo.internal.Struct(PageHandler_GetRecentTabs_ResponseParamsSpec.$, "PageHandler_GetRecentTabs_ResponseParams", [mojo.internal.StructField("tabs", 0, 0, mojo.internal.Array(TabInfoSpec.$, false), null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_GetTabPreview_ParamsSpec.$, "PageHandler_GetTabPreview_Params", [mojo.internal.StructField("tabId", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_GetTabPreview_ResponseParamsSpec.$, "PageHandler_GetTabPreview_ResponseParams", [mojo.internal.StructField("previewDataUrl", 0, 0, mojo.internal.String, null, true, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_NotifySessionStarted_ParamsSpec.$, "PageHandler_NotifySessionStarted_Params", [], [[0, 8]]);
mojo.internal.Struct(PageHandler_NotifySessionAbandoned_ParamsSpec.$, "PageHandler_NotifySessionAbandoned_Params", [], [[0, 8]]);
mojo.internal.Struct(PageHandler_AddFileContext_ParamsSpec.$, "PageHandler_AddFileContext_Params", [mojo.internal.StructField("fileInfo", 0, 0, SelectedFileInfoSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("fileBytes", 8, 0, BigBufferSpec.$, null, false, 0, undefined, undefined)], [[0, 32]]);
mojo.internal.Struct(PageHandler_AddFileContext_ResponseParamsSpec.$, "PageHandler_AddFileContext_ResponseParams", [mojo.internal.StructField("token", 0, 0, UnguessableTokenSpec.$, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_AddTabContext_ParamsSpec.$, "PageHandler_AddTabContext_Params", [mojo.internal.StructField("tabId", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_AddTabContext_ResponseParamsSpec.$, "PageHandler_AddTabContext_ResponseParams", [mojo.internal.StructField("token", 0, 0, UnguessableTokenSpec.$, null, true, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_DeleteContext_ParamsSpec.$, "PageHandler_DeleteContext_Params", [mojo.internal.StructField("token", 0, 0, UnguessableTokenSpec.$, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageHandler_ClearFiles_ParamsSpec.$, "PageHandler_ClearFiles_Params", [], [[0, 8]]);
mojo.internal.Struct(PageHandler_SubmitQuery_ParamsSpec.$, "PageHandler_SubmitQuery_Params", [mojo.internal.StructField("queryText", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("mouseButton", 8, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("altKey", 9, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("ctrlKey", 9, 1, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("metaKey", 9, 2, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("shiftKey", 9, 3, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(Page_AutocompleteResultChanged_ParamsSpec.$, "Page_AutocompleteResultChanged_Params", [mojo.internal.StructField("result", 0, 0, AutocompleteResultSpec.$, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(Page_UpdateSelection_ParamsSpec.$, "Page_UpdateSelection_Params", [mojo.internal.StructField("oldSelection", 0, 0, OmniboxPopupSelectionSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("selection", 8, 0, OmniboxPopupSelectionSpec.$, null, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(Page_SetInputText_ParamsSpec.$, "Page_SetInputText_Params", [mojo.internal.StructField("input", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(Page_SetThumbnail_ParamsSpec.$, "Page_SetThumbnail_Params", [mojo.internal.StructField("thumbnailUrl", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("isDeletable", 8, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(Page_OnContextualInputStatusChanged_ParamsSpec.$, "Page_OnContextualInputStatusChanged_Params", [mojo.internal.StructField("token", 0, 0, UnguessableTokenSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("status", 8, 0, FileUploadStatusSpec.$, 0, false, 0, undefined, undefined), mojo.internal.StructField("error_type_$flag", 12, 0, mojo.internal.Bool, false, false, 0, {
    isPrimary: true,
    linkedValueFieldName: "error_type_$value",
    originalFieldName: "errorType"
}, undefined), mojo.internal.StructField("error_type_$value", 16, 0, FileUploadErrorTypeSpec.$, 0, false, 0, {
    isPrimary: false,
    originalFieldName: "errorType"
}, undefined)], [[0, 32]]);
mojo.internal.Struct(Page_OnTabStripChanged_ParamsSpec.$, "Page_OnTabStripChanged_Params", [], [[0, 8]]);
const div$1 = document.createElement("div");
div$1.innerHTML = getTrustedHTML`
<cr-iconset name="composebox">
  <svg>
    <defs>
      <g id="imageUpload">
        <path d="M5 21C4.45 21 3.975 20.8083 3.575 20.425C3.19167 20.025 3 19.55 3 19V5C3 4.45 3.19167 3.98333 3.575 3.6C3.975 3.2 4.45 3 5 3H13C13 3.28333 13 3.59167 13 3.925C13 4.25833 13 4.61667 13 5H5V19H19V11C19.3833 11 19.7417 11 20.075 11C20.4083 11 20.7167 11 21 11V19C21 19.55 20.8 20.025 20.4 20.425C20.0167 20.8083 19.55 21 19 21H5ZM6 17H18L14.25 12L11.25 16L9 13L6 17ZM17 9V7H15V5H17V3H19V5H21V7H19V9H17Z" fill="currentColor"/>
      </g>
      <g id="fileUpload">
        <path d="M18 15.75C18 17.4833 17.3917 18.9583 16.175 20.175C14.9583 21.3917 13.4833 22 11.75 22C10.0167 22 8.54167 21.3917 7.325 20.175C6.10833 18.9583 5.5 17.4833 5.5 15.75V6.5C5.5 5.25 5.93333 4.19167 6.8 3.325C7.68333 2.44167 8.75 2 10 2C11.25 2 12.3083 2.44167 13.175 3.325C14.0583 4.19167 14.5 5.25 14.5 6.5V15.25C14.5 16.0167 14.2333 16.6667 13.7 17.2C13.1667 17.7333 12.5167 18 11.75 18C10.9833 18 10.3333 17.7333 9.8 17.2C9.26667 16.6667 9 16.0167 9 15.25V6H11V15.25C11 15.4667 11.0667 15.65 11.2 15.8C11.35 15.9333 11.5333 16 11.75 16C11.9667 16 12.1417 15.9333 12.275 15.8C12.425 15.65 12.5 15.4667 12.5 15.25V6.5C12.4833 5.8 12.2333 5.20833 11.75 4.725C11.2833 4.24167 10.7 4 10 4C9.3 4 8.70833 4.24167 8.225 4.725C7.74167 5.20833 7.5 5.8 7.5 6.5V15.75C7.48333 16.9333 7.89167 17.9417 8.725 18.775C9.55833 19.5917 10.5667 20 11.75 20C12.9167 20 13.9083 19.5917 14.725 18.775C15.5417 17.9417 15.9667 16.9333 16 15.75V6H18V15.75Z" fill="currentColor"/>
      </g>
      <g id="deepSearch" viewBox="0 0 16 16">
        <path d="M0.447222 6.99401C0.447222 6.08019 0.614385 5.22766 0.948711 4.43642C1.29418 3.64519 1.76781 2.95425 2.36959 2.36361C2.97138 1.76182 3.66789 1.29376 4.45913 0.959439C5.25036 0.613969 6.09732 0.441235 7 0.441235C8.40417 0.441235 9.64674 0.825709 10.7277 1.59466C11.8087 2.36361 12.5944 3.35544 13.0847 4.57015C13.1627 4.77075 13.1627 4.97134 13.0847 5.17194C13.0067 5.36139 12.8674 5.48955 12.6668 5.55641C12.4997 5.62328 12.3269 5.60656 12.1486 5.50626C11.9814 5.40597 11.8644 5.26666 11.7976 5.08836C11.5413 4.45314 11.1679 3.89036 10.6776 3.40001C10.1984 2.89853 9.6356 2.51405 8.98924 2.24659V2.61435C8.98924 2.94867 8.87222 3.23285 8.6382 3.46688C8.40417 3.68976 8.12556 3.8012 7.80238 3.8012H6.19762V4.60359C6.19762 4.82647 6.11961 5.01592 5.96359 5.17194C5.81872 5.31681 5.63484 5.38925 5.41195 5.38925H4.60957V6.99401H4.69316C4.89375 6.99401 5.06091 7.06088 5.19464 7.19461C5.32837 7.32834 5.39524 7.48993 5.39524 7.67938V8.56534H4.60957L1.95169 5.90745C1.91825 6.08576 1.89039 6.26407 1.86811 6.44238C1.84582 6.62068 1.83467 6.80456 1.83467 6.99401C1.83467 8.29788 2.25815 9.43459 3.10511 10.4041C3.96321 11.3737 5.01634 11.9365 6.26448 12.0925C6.44279 12.1371 6.58209 12.2318 6.68239 12.3767C6.78269 12.5104 6.82727 12.6664 6.81612 12.8447C6.79383 13.0342 6.70468 13.1957 6.54866 13.3295C6.39264 13.4521 6.21434 13.4911 6.01374 13.4465C4.44241 13.2236 3.12183 12.5048 2.05198 11.2901C0.982143 10.0754 0.447222 8.64335 0.447222 6.99401ZM12.1152 12.6775L10.5271 11.1062C10.3043 11.2399 10.0702 11.3458 9.82505 11.4238C9.59102 11.4907 9.34028 11.5241 9.07282 11.5241C8.27044 11.5241 7.59064 11.2455 7.03343 10.6883C6.47622 10.1311 6.19762 9.45688 6.19762 8.66564C6.19762 7.86326 6.47622 7.18346 7.03343 6.62625C7.59064 6.06905 8.27044 5.79044 9.07282 5.79044C9.86406 5.79044 10.5383 6.06905 11.0955 6.62625C11.6527 7.18346 11.9313 7.85769 11.9313 8.64892C11.9313 8.92753 11.8923 9.18942 11.8143 9.43459C11.7474 9.67976 11.6471 9.90822 11.5134 10.12L13.1014 11.708C13.2352 11.8529 13.302 12.0145 13.302 12.1928C13.302 12.3711 13.2352 12.5327 13.1014 12.6775C12.9566 12.8113 12.7894 12.8781 12.6 12.8781C12.4216 12.8781 12.2601 12.8113 12.1152 12.6775ZM9.0561 10.1367C9.46844 10.1367 9.81948 9.99737 10.1092 9.71876C10.399 9.42902 10.5438 9.07797 10.5438 8.66564C10.5438 8.2533 10.399 7.90226 10.1092 7.61251C9.83062 7.32277 9.48515 7.17789 9.07282 7.17789C8.66048 7.17789 8.30944 7.32277 8.01969 7.61251C7.72994 7.89112 7.58507 8.23659 7.58507 8.64892C7.58507 9.06126 7.72437 9.4123 8.00298 9.70205C8.29272 9.9918 8.64377 10.1367 9.0561 10.1367Z" fill="currentColor"/>
      </g>
      <g id="createImage" viewBox="0 0 16 16">
        <path d="M8.72178 8.114C9.02267 8.114 9.30127 8.05828 9.55759 7.94684C9.82505 7.8354 10.0702 7.67938 10.2931 7.47878C10.438 7.33391 10.5661 7.16675 10.6776 6.9773C10.789 6.7767 10.8782 6.56496 10.945 6.34208C10.9785 6.23064 10.9506 6.13034 10.8615 6.04118C10.7834 5.95203 10.6887 5.92417 10.5773 5.9576C10.3544 5.99104 10.1427 6.06347 9.94206 6.17491C9.75261 6.27521 9.57988 6.40337 9.42386 6.55939C9.21212 6.75998 9.04496 6.99401 8.92237 7.26147C8.81093 7.51779 8.74406 7.80197 8.72178 8.114ZM8.68834 8.114C8.66606 7.80197 8.58805 7.51222 8.45432 7.24476C8.33173 6.9773 8.16457 6.74327 7.95283 6.54267C7.78567 6.38665 7.60179 6.26407 7.40119 6.17491C7.21174 6.07462 7.00557 6.00218 6.78269 5.9576C6.67125 5.92417 6.57095 5.95203 6.4818 6.04118C6.40379 6.13034 6.37593 6.23064 6.39821 6.34208C6.45394 6.56496 6.53752 6.7767 6.64896 6.9773C6.77154 7.16675 6.91642 7.33391 7.08358 7.47878C7.29532 7.67938 7.53492 7.8354 7.80238 7.94684C8.06984 8.05828 8.36516 8.114 8.68834 8.114ZM8.70506 6.02447C8.86108 6.02447 8.99481 5.96875 9.10625 5.85731C9.22884 5.74586 9.29013 5.60656 9.29013 5.4394V5.28895L9.40714 5.37253C9.54087 5.46169 9.68575 5.48955 9.84177 5.45612C10.0089 5.41154 10.1371 5.31124 10.2262 5.15522C10.3042 5.03264 10.321 4.89333 10.2764 4.73732C10.2318 4.5813 10.1427 4.45314 10.0089 4.35284L9.89192 4.26926L10.0256 4.18568C10.1594 4.09653 10.243 3.97951 10.2764 3.83464C10.321 3.67862 10.2987 3.52817 10.2095 3.3833C10.1315 3.23842 10.0145 3.1437 9.85848 3.09912C9.70246 3.05454 9.55759 3.07683 9.42386 3.16599L9.29013 3.24957V3.08241C9.29013 2.92639 9.22884 2.79266 9.10625 2.68122C8.99481 2.55863 8.85551 2.49734 8.68834 2.49734C8.53233 2.49734 8.3986 2.55863 8.28715 2.68122C8.17571 2.79266 8.11999 2.92639 8.11999 3.08241V3.24957L7.96954 3.16599C7.82467 3.07683 7.67422 3.05454 7.51821 3.09912C7.37333 3.1437 7.25632 3.23285 7.16716 3.36658C7.08915 3.51146 7.06687 3.6619 7.1003 3.81792C7.14487 3.97394 7.2396 4.09653 7.38448 4.18568L7.51821 4.26926L7.36776 4.33613C7.22288 4.41413 7.12816 4.53115 7.08358 4.68717C7.05015 4.84319 7.07801 4.99363 7.16716 5.13851C7.25632 5.29453 7.3789 5.39482 7.53492 5.4394C7.69094 5.47283 7.83581 5.44497 7.96954 5.35582L8.10327 5.27224V5.4394C8.10327 5.60656 8.159 5.74586 8.27044 5.85731C8.38188 5.96875 8.52675 6.02447 8.70506 6.02447ZM8.68834 4.85433C8.53233 4.85433 8.3986 4.79861 8.28715 4.68717C8.17571 4.57573 8.11999 4.43642 8.11999 4.26926C8.11999 4.11324 8.17571 3.97951 8.28715 3.86807C8.3986 3.74548 8.5379 3.68419 8.70506 3.68419C8.86108 3.68419 8.99481 3.74548 9.10625 3.86807C9.22884 3.97951 9.29013 4.11324 9.29013 4.26926C9.29013 4.43642 9.22884 4.57573 9.10625 4.68717C8.99481 4.79861 8.85551 4.85433 8.68834 4.85433ZM5.14449 10.2537C4.72102 10.2537 4.38112 10.1311 4.1248 9.88593C3.87963 9.62961 3.75704 9.28971 3.75704 8.86623V1.7451C3.75704 1.32162 3.87963 0.987299 4.1248 0.742127C4.38112 0.485811 4.72102 0.357653 5.14449 0.357653H12.2656C12.6891 0.357653 13.0234 0.485811 13.2686 0.742127C13.5249 0.987299 13.6531 1.32162 13.6531 1.7451V8.86623C13.6531 9.28971 13.5249 9.62961 13.2686 9.88593C13.0234 10.1311 12.6891 10.2537 12.2656 10.2537H5.14449ZM5.14449 8.86623H12.2656V1.7451H5.14449V8.86623ZM2.8878 13.6304C2.52004 13.6861 2.18014 13.5969 1.86811 13.3629C1.56721 13.1177 1.38891 12.8113 1.33318 12.4435L0.380357 5.37253C0.324636 4.98249 0.41379 4.63702 0.647818 4.33613C0.89299 4.02409 1.20503 3.84578 1.58393 3.8012L1.90154 3.76777C2.11328 3.75663 2.28601 3.81792 2.41974 3.95165C2.56462 4.08538 2.63705 4.25812 2.63705 4.46986C2.63705 4.64816 2.58133 4.80418 2.46989 4.93791C2.35845 5.07164 2.21357 5.14408 2.03527 5.15522L1.76781 5.18866L2.70392 12.2596L10.2931 11.2232C10.4937 11.2009 10.6664 11.2511 10.8113 11.3737C10.9673 11.4851 11.0565 11.6356 11.0788 11.825C11.1122 12.0145 11.0676 12.1872 10.945 12.3432C10.8336 12.4992 10.6832 12.5884 10.4937 12.6107L2.8878 13.6304Z" fill="currentColor"/>
      </g>
      <g id="nanoBanana" viewBox="0 0 24 24">
        <path d="M2 22.4004H22V2.40039H2V22.4004Z" fill="url(#pattern0_1500_179774)"/>
          <defs>
          <pattern id="pattern0_1500_179774" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_1500_179774" transform="scale(0.00625)"/>
          </pattern>
          <image id="image0_1500_179774" width="160" height="160" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
        </defs>
      </g>
  </defs>
  </svg>
</cr-iconset>
<cr-iconset name="thumbnail" size=18>
  <svg>
    <defs>
      <g id="pdf">
        <path d="M12.5 12H14V10H15.5V8.5H14V7.5H15.5V6H12.5V12ZM2.5 12H4V10H5.5C5.78333 10 6.01667 9.90833 6.2 9.725C6.4 9.525 6.5 9.28333 6.5 9V7C6.5 6.71667 6.4 6.48333 6.2 6.3C6.01667 6.1 5.78333 6 5.5 6H2.5V12ZM4 8.5V7.5H5V8.5H4ZM7.4 12H10.4C10.6833 12 10.9167 11.9083 11.1 11.725C11.3 11.525 11.4 11.2833 11.4 11V7C11.4 6.71667 11.3 6.48333 11.1 6.3C10.9167 6.1 10.6833 6 10.4 6H7.4V12ZM8.9 10.5V7.5H9.9V10.5H8.9ZM2 18C1.45 18 0.975 17.8083 0.575 17.425C0.191667 17.025 0 16.55 0 16V2C0 1.45 0.191667 0.983333 0.575 0.599999C0.975 0.199999 1.45 -1.43051e-06 2 -1.43051e-06H16C16.55 -1.43051e-06 17.0167 0.199999 17.4 0.599999C17.8 0.983333 18 1.45 18 2V16C18 16.55 17.8 17.025 17.4 17.425C17.0167 17.8083 16.55 18 16 18H2ZM2 16H16V2H2V16ZM2 2V16V2Z" fill="currentColor"/>
      </g>
    </defs>
  </svg>
</cr-iconset>`;
const iconsets$1 = div$1.querySelectorAll("cr-iconset");
for (const iconset of iconsets$1) {
    document.head.appendChild(iconset)
}
const AUTO_SRC = "auto-src";
const CLEAR_SRC = "clear-src";
const IS_GOOGLE_PHOTOS = "is-google-photos";
const STATIC_ENCODE = "static-encode";
const ENCODE_TYPE = "encode-type";
class CrAutoImgElement extends HTMLImageElement {
    static get observedAttributes() {
        return [AUTO_SRC, IS_GOOGLE_PHOTOS, STATIC_ENCODE, ENCODE_TYPE]
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== AUTO_SRC && name !== IS_GOOGLE_PHOTOS && name !== STATIC_ENCODE && name !== ENCODE_TYPE) {
            return
        }
        if (name === IS_GOOGLE_PHOTOS && oldValue === null === (newValue === null)) {
            return
        }
        if (this.hasAttribute(CLEAR_SRC)) {
            this.removeAttribute("src")
        }
        let url = null;
        try {
            url = new URL(this.getAttribute(AUTO_SRC) || "")
        } catch (_) {}
        if (!url || url.protocol === "chrome-untrusted:") {
            this.removeAttribute("src");
            return
        }
        if (url.protocol === "data:" || url.protocol === "chrome:") {
            this.src = url.href;
            return
        }
        if (!this.hasAttribute(IS_GOOGLE_PHOTOS) && !this.hasAttribute(STATIC_ENCODE) && !this.hasAttribute(ENCODE_TYPE)) {
            this.src = "chrome://image?" + url.href;
            return
        }
        this.src = `chrome://image?url=${encodeURIComponent(url.href)}`;
        if (this.hasAttribute(IS_GOOGLE_PHOTOS)) {
            this.src += `&isGooglePhotos=true`
        }
        if (this.hasAttribute(STATIC_ENCODE)) {
            this.src += `&staticEncode=true`
        }
        if (this.hasAttribute(ENCODE_TYPE)) {
            this.src += `&encodeType=${this.getAttribute(ENCODE_TYPE)}`
        }
    }
    set autoSrc(src) {
        this.setAttribute(AUTO_SRC, src)
    }
    get autoSrc() {
        return this.getAttribute(AUTO_SRC) || ""
    }
    set clearSrc(_) {
        this.setAttribute(CLEAR_SRC, "")
    }
    get clearSrc() {
        return this.getAttribute(CLEAR_SRC) || ""
    }
    set isGooglePhotos(enabled) {
        if (enabled) {
            this.setAttribute(IS_GOOGLE_PHOTOS, "")
        } else {
            this.removeAttribute(IS_GOOGLE_PHOTOS)
        }
    }
    get isGooglePhotos() {
        return this.hasAttribute(IS_GOOGLE_PHOTOS)
    }
    set staticEncode(enabled) {
        if (enabled) {
            this.setAttribute(STATIC_ENCODE, "")
        } else {
            this.removeAttribute(STATIC_ENCODE)
        }
    }
    get staticEncode() {
        return this.hasAttribute(STATIC_ENCODE)
    }
    set encodeType(type) {
        if (type) {
            this.setAttribute(ENCODE_TYPE, type)
        } else {
            this.removeAttribute(ENCODE_TYPE)
        }
    }
    get encodeType() {
        return this.getAttribute(ENCODE_TYPE) || ""
    }
}
customElements.define("cr-auto-img", CrAutoImgElement, {
    extends: "img"
});
let instance$o = null;
function getCss$j() {
    return instance$o || (instance$o = [...[], css`:host{background-position:center;background-repeat:no-repeat;background-size:100%;display:flex;flex-shrink:0;height:16px;width:16px}`])
}
class TabFaviconElement extends CrLitElement {
    static get is() {
        return "composebox-tab-favicon"
    }
    static get styles() {
        return getCss$j()
    }
    static get properties() {
        return {
            url: {
                type: Object
            },
            size: {
                type: Number
            }
        }
    }
    #url_accessor_storage = "";
    get url() {
        return this.#url_accessor_storage
    }
    set url(value) {
        this.#url_accessor_storage = value
    }
    #size_accessor_storage = 16;
    get size() {
        return this.#size_accessor_storage
    }
    set size(value) {
        this.#size_accessor_storage = value
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("url") || changedProperties.has("size")) {
            if (!this.url) {
                this.style.setProperty("background-image", "")
            } else {
                this.style.setProperty("background-image", getFaviconForPageURL(this.url, false, "", this.size, false, true))
            }
        }
    }
}
customElements.define(TabFaviconElement.is, TabFaviconElement);
const div = document.createElement("div");
div.innerHTML = getTrustedHTML`
<cr-iconset name="cr20" size="20">
  <svg>
    <defs>
      <!--
      Keep these in sorted order by id="".
      -->
      <g id="block">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM2 10C2 5.58 5.58 2 10 2C11.85 2 13.55 2.63 14.9 3.69L3.69 14.9C2.63 13.55 2 11.85 2 10ZM5.1 16.31C6.45 17.37 8.15 18 10 18C14.42 18 18 14.42 18 10C18 8.15 17.37 6.45 16.31 5.1L5.1 16.31Z">
        </path>
      </g>
      <g id="cloud-off">
        <path
          d="M16 18.125L13.875 16H5C3.88889 16 2.94444 15.6111 2.16667 14.8333C1.38889 14.0556 1 13.1111 1 12C1 10.9444 1.36111 10.0347 2.08333 9.27083C2.80556 8.50694 3.6875 8.09028 4.72917 8.02083C4.77083 7.86805 4.8125 7.72222 4.85417 7.58333C4.90972 7.44444 4.97222 7.30555 5.04167 7.16667L1.875 4L2.9375 2.9375L17.0625 17.0625L16 18.125ZM5 14.5H12.375L6.20833 8.33333C6.15278 8.51389 6.09722 8.70139 6.04167 8.89583C6 9.07639 5.95139 9.25694 5.89583 9.4375L4.83333 9.52083C4.16667 9.57639 3.61111 9.84028 3.16667 10.3125C2.72222 10.7708 2.5 11.3333 2.5 12C2.5 12.6944 2.74306 13.2847 3.22917 13.7708C3.71528 14.2569 4.30556 14.5 5 14.5ZM17.5 15.375L16.3958 14.2917C16.7153 14.125 16.9792 13.8819 17.1875 13.5625C17.3958 13.2431 17.5 12.8889 17.5 12.5C17.5 11.9444 17.3056 11.4722 16.9167 11.0833C16.5278 10.6944 16.0556 10.5 15.5 10.5H14.125L14 9.14583C13.9028 8.11806 13.4722 7.25694 12.7083 6.5625C11.9444 5.85417 11.0417 5.5 10 5.5C9.65278 5.5 9.31944 5.54167 9 5.625C8.69444 5.70833 8.39583 5.82639 8.10417 5.97917L7.02083 4.89583C7.46528 4.61806 7.93056 4.40278 8.41667 4.25C8.91667 4.08333 9.44444 4 10 4C11.4306 4 12.6736 4.48611 13.7292 5.45833C14.7847 6.41667 15.375 7.59722 15.5 9C16.4722 9 17.2986 9.34028 17.9792 10.0208C18.6597 10.7014 19 11.5278 19 12.5C19 13.0972 18.8611 13.6458 18.5833 14.1458C18.3194 14.6458 17.9583 15.0556 17.5 15.375Z">
        </path>
      </g>
      <g id="delete">
        <path
          d="M 5.832031 17.5 C 5.375 17.5 4.984375 17.335938 4.65625 17.011719 C 4.328125 16.683594 4.167969 16.292969 4.167969 15.832031 L 4.167969 5 L 3.332031 5 L 3.332031 3.332031 L 7.5 3.332031 L 7.5 2.5 L 12.5 2.5 L 12.5 3.332031 L 16.667969 3.332031 L 16.667969 5 L 15.832031 5 L 15.832031 15.832031 C 15.832031 16.292969 15.671875 16.683594 15.34375 17.011719 C 15.015625 17.335938 14.625 17.5 14.167969 17.5 Z M 14.167969 5 L 5.832031 5 L 5.832031 15.832031 L 14.167969 15.832031 Z M 7.5 14.167969 L 9.167969 14.167969 L 9.167969 6.667969 L 7.5 6.667969 Z M 10.832031 14.167969 L 12.5 14.167969 L 12.5 6.667969 L 10.832031 6.667969 Z M 5.832031 5 L 5.832031 15.832031 Z M 5.832031 5 ">
        </path>
      </g>
      <g id="domain" viewBox="0 -960 960 960">
        <path d="M96-144v-672h384v144h384v528H96Zm72-72h72v-72h-72v72Zm0-152h72v-72h-72v72Zm0-152h72v-72h-72v72Zm0-152h72v-72h-72v72Zm168 456h72v-72h-72v72Zm0-152h72v-72h-72v72Zm0-152h72v-72h-72v72Zm0-152h72v-72h-72v72Zm144 456h312v-384H480v80h72v72h-72v80h72v72h-72v80Zm168-232v-72h72v72h-72Zm0 152v-72h72v72h-72Z"></path>
      </g>
      <g id="kite">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M4.6327 8.00094L10.3199 2L16 8.00094L10.1848 16.8673C10.0995 16.9873 10.0071 17.1074 9.90047 17.2199C9.42417 17.7225 8.79147 18 8.11611 18C7.44076 18 6.80806 17.7225 6.33175 17.2199C5.85545 16.7173 5.59242 16.0497 5.59242 15.3371C5.59242 14.977 5.46445 14.647 5.22275 14.3919C4.98104 14.1369 4.66825 14.0019 4.32701 14.0019H4V12.6667H4.32701C5.00237 12.6667 5.63507 12.9442 6.11137 13.4468C6.58768 13.9494 6.85071 14.617 6.85071 15.3296C6.85071 15.6896 6.97867 16.0197 7.22038 16.2747C7.46209 16.5298 7.77488 16.6648 8.11611 16.6648C8.45735 16.6648 8.77014 16.5223 9.01185 16.2747C9.02396 16.2601 9.03607 16.246 9.04808 16.2319C9.08541 16.1883 9.12176 16.1458 9.15403 16.0947L9.55213 15.4946L4.6327 8.00094ZM10.3199 13.9371L6.53802 8.17116L10.3199 4.1814L14.0963 8.17103L10.3199 13.9371Z">
        </path>
      </g>
      <g id="menu">
        <path d="M2 4h16v2H2zM2 9h16v2H2zM2 14h16v2H2z"></path>
      </g>
      <g id="password">
        <path d="M5.833 11.667c.458 0 .847-.16 1.167-.479.333-.333.5-.729.5-1.188s-.167-.847-.5-1.167a1.555 1.555 0 0 0-1.167-.5c-.458 0-.854.167-1.188.5A1.588 1.588 0 0 0 4.166 10c0 .458.16.854.479 1.188.333.319.729.479 1.188.479Zm0 3.333c-1.389 0-2.569-.486-3.542-1.458C1.319 12.569.833 11.389.833 10c0-1.389.486-2.569 1.458-3.542C3.264 5.486 4.444 5 5.833 5c.944 0 1.813.243 2.604.729a4.752 4.752 0 0 1 1.833 1.979h7.23c.458 0 .847.167 1.167.5.333.319.5.708.5 1.167v3.958c0 .458-.167.854-.5 1.188A1.588 1.588 0 0 1 17.5 15h-3.75a1.658 1.658 0 0 1-1.188-.479 1.658 1.658 0 0 1-.479-1.188v-1.042H10.27a4.59 4.59 0 0 1-1.813 2A5.1 5.1 0 0 1 5.833 15Zm3.292-4.375h4.625v2.708H15v-1.042a.592.592 0 0 1 .167-.438.623.623 0 0 1 .458-.188c.181 0 .327.063.438.188a.558.558 0 0 1 .188.438v1.042H17.5V9.375H9.125a3.312 3.312 0 0 0-1.167-1.938 3.203 3.203 0 0 0-2.125-.77 3.21 3.21 0 0 0-2.354.979C2.827 8.298 2.5 9.083 2.5 10s.327 1.702.979 2.354a3.21 3.21 0 0 0 2.354.979c.806 0 1.514-.25 2.125-.75.611-.514 1-1.167 1.167-1.958Z"></path>
      </g>
      
  </svg>
</cr-iconset>

<!-- NOTE: In the common case that the final icon will be 20x20, export the SVG
     at 20px and place it in the section above. -->
<cr-iconset name="cr" size="24">
  <svg>
    <defs>
      <!--
      These icons are copied from Polymer's iron-icons and kept in sorted order.
      -->
      <g id="add">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </g>
      <g id="arrow-back">
        <path
          d="m7.824 13 5.602 5.602L12 20l-8-8 8-8 1.426 1.398L7.824 11H20v2Zm0 0">
        </path>
      </g>
      <g id="arrow-drop-up">
        <path d="M7 14l5-5 5 5z"></path>
      </g>
      <g id="arrow-drop-down">
        <path d="M7 10l5 5 5-5z"></path>
      </g>
      <g id="arrow-forward">
        <path
          d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z">
        </path>
      </g>
      <g id="arrow-right">
        <path d="M10 7l5 5-5 5z"></path>
      </g>
      <g id="cancel">
        <path
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z">
        </path>
      </g>
      <g id="check">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
      </g>
      <g id="check-circle" viewBox="0 -960 960 960">
        <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path>
      </g>
      <g id="chevron-left">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
      </g>
      <g id="chevron-right">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
      </g>
      <g id="clear">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
        </path>
      </g>
      <g id="chrome-product" viewBox="0 -960 960 960">
        <path d="M336-479q0 60 42 102t102 42q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102Zm144 216q11 0 22.5-.5T525-267L427-99q-144-16-237.5-125T96-479q0-43 9.5-84.5T134-645l160 274q28 51 78 79.5T480-263Zm0-432q-71 0-126.5 42T276-545l-98-170q53-71 132.5-109.5T480-863q95 0 179 45t138 123H480Zm356 72q15 35 21.5 71t6.5 73q0 155-100 260.5T509-96l157-275q14-25 22-52t8-56q0-40-15-77t-41-67h196Z">
        </path>
      </g>
      <g id="close">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
        </path>
      </g>
      <g id="computer">
        <path
          d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z">
        </path>
      </g>
      <g id="create">
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
        </path>
      </g>
      <g id="delete" viewBox="0 -960 960 960">
        <path
          d="M309.37-135.87q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.5h-53.5v-83H378.5v-53.5h202.52v53.5h206.11v83h-53.5v474.07q0 35.21-24.26 59.32t-58.74 24.11H309.37Zm341.26-557.5H309.37v474.5h341.26v-474.5ZM379.7-288.24h77.5v-336h-77.5v336Zm123.1 0h77.5v-336h-77.5v336ZM309.37-693.37v474.5-474.5Z">
        </path>
      </g>
      <g id="domain">
        <path
          d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z">
        </path>
      </g>
      <!-- source: https://fonts.google.com/icons?selected=Material+Symbols+Outlined:family_link:FILL@0;wght@0;GRAD@0;opsz@24&icon.size=24&icon.color=%23e8eaed -->
      <g id="kite" viewBox="0 -960 960 960">
        <path
          d="M390-40q-51 0-90.5-30.5T246-149q-6-23-25-37t-43-14q-16 0-30 6.5T124-175l-61-51q21-26 51.5-40t63.5-14q51 0 91 30t54 79q6 23 25 37t42 14q19 0 34-10t26-25l1-2-276-381q-8-11-11.5-23t-3.5-24q0-16 6-30.5t18-26.5l260-255q11-11 26-17t30-6q15 0 30 6t26 17l260 255q12 12 18 26.5t6 30.5q0 12-3.5 24T825-538L500-88q-18 25-48 36.5T390-40Zm110-185 260-360-260-255-259 256 259 359Zm1-308Z"/>
        </path>
      </g>
      <g id="error">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
        </path>
      </g>
      <g id="error-outline">
        <path
          d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z">
        </path>
      </g>
      <g id="expand-less">
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
      </g>
      <g id="expand-more">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
      </g>
      <g id="extension">
        <path
          d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z">
        </path>
      </g>
      <g id="file-download" viewBox="0 -960 960 960">
        <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"></path>
      </g>
      <g id="fullscreen">
        <path
          d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z">
        </path>
      </g>
      <g id="group">
        <path
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z">
        </path>
      </g>
      <g id="help-outline">
        <path
          d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z">
        </path>
      </g>
      <g id="history">
        <path
          d="M12.945312 22.75 C 10.320312 22.75 8.074219 21.839844 6.207031 20.019531 C 4.335938 18.199219 3.359375 15.972656 3.269531 13.34375 L 5.089844 13.34375 C 5.175781 15.472656 5.972656 17.273438 7.480469 18.742188 C 8.988281 20.210938 10.808594 20.945312 12.945312 20.945312 C 15.179688 20.945312 17.070312 20.164062 18.621094 18.601562 C 20.167969 17.039062 20.945312 15.144531 20.945312 12.910156 C 20.945312 10.714844 20.164062 8.855469 18.601562 7.335938 C 17.039062 5.816406 15.15625 5.054688 12.945312 5.054688 C 11.710938 5.054688 10.554688 5.339844 9.480469 5.902344 C 8.402344 6.46875 7.476562 7.226562 6.699219 8.179688 L 9.585938 8.179688 L 9.585938 9.984375 L 3.648438 9.984375 L 3.648438 4.0625 L 5.453125 4.0625 L 5.453125 6.824219 C 6.386719 5.707031 7.503906 4.828125 8.804688 4.199219 C 10.109375 3.566406 11.488281 3.25 12.945312 3.25 C 14.300781 3.25 15.570312 3.503906 16.761719 4.011719 C 17.949219 4.519531 18.988281 5.214844 19.875 6.089844 C 20.761719 6.964844 21.464844 7.992188 21.976562 9.167969 C 22.492188 10.34375 22.75 11.609375 22.75 12.964844 C 22.75 14.316406 22.492188 15.589844 21.976562 16.777344 C 21.464844 17.964844 20.761719 19.003906 19.875 19.882812 C 18.988281 20.765625 17.949219 21.464844 16.761719 21.976562 C 15.570312 22.492188 14.300781 22.75 12.945312 22.75 Z M 16.269531 17.460938 L 12.117188 13.34375 L 12.117188 7.527344 L 13.921875 7.527344 L 13.921875 12.601562 L 17.550781 16.179688 Z M 16.269531 17.460938">
        </path>
      </g>
      <g id="info">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
        </path>
      </g>
      <g id="info-outline">
        <path
          d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z">
        </path>
      </g>
      <g id="insert-drive-file">
        <path
          d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z">
        </path>
      </g>
      <g id="location-on">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z">
        </path>
      </g>
      <g id="mic">
        <path
          d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z">
        </path>
      </g>
      <g id="more-vert">
        <path
          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
        </path>
      </g>
      <g id="open-in-new" viewBox="0 -960 960 960">
        <path
          d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z">
        </path>
      </g>
      <g id="person">
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z">
        </path>
      </g>
      <g id="phonelink">
        <path
          d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z">
        </path>
      </g>
      <g id="print">
        <path
          d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z">
        </path>
      </g>
      <g id="schedule">
        <path
          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z">
        </path>
      </g>
      <g id="search">
        <path
          d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
        </path>
      </g>
      <g id="security">
        <path
          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z">
        </path>
      </g>
      <!-- The <g> IDs are exposed as global variables in Vulcanized mode, which
        conflicts with the "settings" namespace of MD Settings. Using an "_icon"
        suffix prevents the naming conflict. -->
      <g id="settings_icon">
        <path
          d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">
        </path>
      </g>
      <g id="star">
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
        </path>
      </g>
      <g id="sync" viewBox="0 -960 960 960">
        <path
          d="M216-192v-72h74q-45-40-71.5-95.5T192-480q0-101 61-177.5T408-758v75q-63 23-103.5 77.5T264-480q0 48 19.5 89t52.5 70v-63h72v192H216Zm336-10v-75q63-23 103.5-77.5T696-480q0-48-19.5-89T624-639v63h-72v-192h192v72h-74q45 40 71.5 95.5T768-480q0 101-61 177.5T552-202Z">
        </path>
      </g>
      <g id="thumbs-down">
        <path
            d="M6 3h11v13l-7 7-1.25-1.25a1.454 1.454 0 0 1-.3-.475c-.067-.2-.1-.392-.1-.575v-.35L9.45 16H3c-.533 0-1-.2-1.4-.6-.4-.4-.6-.867-.6-1.4v-2c0-.117.017-.242.05-.375s.067-.258.1-.375l3-7.05c.15-.333.4-.617.75-.85C5.25 3.117 5.617 3 6 3Zm9 2H6l-3 7v2h9l-1.35 5.5L15 15.15V5Zm0 10.15V5v10.15Zm2 .85v-2h3V5h-3V3h5v13h-5Z">
        </path>
      </g>
      <g id="thumbs-down-filled">
        <path
            d="M6 3h10v13l-7 7-1.25-1.25a1.336 1.336 0 0 1-.29-.477 1.66 1.66 0 0 1-.108-.574v-.347L8.449 16H3c-.535 0-1-.2-1.398-.602C1.199 15 1 14.535 1 14v-2c0-.117.012-.242.04-.375.022-.133.062-.258.108-.375l3-7.05c.153-.333.403-.618.75-.848A1.957 1.957 0 0 1 6 3Zm12 13V3h4v13Zm0 0">
        </path>
      </g>
      <g id="thumbs-up">
        <path
            d="M18 21H7V8l7-7 1.25 1.25c.117.117.208.275.275.475.083.2.125.392.125.575v.35L14.55 8H21c.533 0 1 .2 1.4.6.4.4.6.867.6 1.4v2c0 .117-.017.242-.05.375s-.067.258-.1.375l-3 7.05c-.15.333-.4.617-.75.85-.35.233-.717.35-1.1.35Zm-9-2h9l3-7v-2h-9l1.35-5.5L9 8.85V19ZM9 8.85V19 8.85ZM7 8v2H4v9h3v2H2V8h5Z">
        </path>
      </g>
      <g id="thumbs-up-filled">
        <path
            d="M18 21H8V8l7-7 1.25 1.25c.117.117.21.273.29.477.073.199.108.39.108.574v.347L15.551 8H21c.535 0 1 .2 1.398.602C22.801 9 23 9.465 23 10v2c0 .117-.012.242-.04.375a1.897 1.897 0 0 1-.108.375l-3 7.05a2.037 2.037 0 0 1-.75.848A1.957 1.957 0 0 1 18 21ZM6 8v13H2V8Zm0 0">
      </g>
      <g id="videocam" viewBox="0 -960 960 960">
        <path
          d="M216-192q-29 0-50.5-21.5T144-264v-432q0-29.7 21.5-50.85Q187-768 216-768h432q29.7 0 50.85 21.15Q720-725.7 720-696v168l144-144v384L720-432v168q0 29-21.15 50.5T648-192H216Zm0-72h432v-432H216v432Zm0 0v-432 432Z">
        </path>
      </g>
      <g id="warning">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
      </g>
    </defs>
  </svg>
</cr-iconset>`;
const iconsets = div.querySelectorAll("cr-iconset");
for (const iconset of iconsets) {
    document.head.appendChild(iconset)
}
function getDeepActiveElement() {
    let a = document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) {
        a = a.shadowRoot.activeElement
    }
    return a
}
function isRTL() {
    return document.documentElement.dir === "rtl"
}
function hasKeyModifiers(e) {
    return !!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
}
function debounceEnd(fn, time=50) {
    let timerId;
    return () => {
        clearTimeout(timerId);
        timerId = setTimeout(fn, time)
    }
}
const ACTIVE_CLASS = "focus-row-active";
class FocusRow {
    root;
    delegate;
    eventTracker = new EventTracker;
    boundary_;
    constructor(root, boundary, delegate) {
        this.root = root;
        this.boundary_ = boundary || document.documentElement;
        this.delegate = delegate
    }
    static isFocusable(element) {
        if (!element || element.disabled) {
            return false
        }
        let current = element;
        while (true) {
            assertInstanceof(current, Element);
            const style = window.getComputedStyle(current);
            if (style.visibility === "hidden" || style.display === "none") {
                return false
            }
            const parent = current.parentNode;
            if (!parent) {
                return false
            }
            if (parent === current.ownerDocument || parent instanceof DocumentFragment) {
                return true
            }
            current = parent
        }
    }
    static getFocusableElement(element) {
        const withFocusable = element;
        if (withFocusable.getFocusableElement) {
            return withFocusable.getFocusableElement()
        }
        return element
    }
    addItem(type, selectorOrElement) {
        assert(type);
        let element;
        if (typeof selectorOrElement === "string") {
            element = this.root.querySelector(selectorOrElement)
        } else {
            element = selectorOrElement
        }
        if (!element) {
            return false
        }
        element.setAttribute("focus-type", type);
        element.tabIndex = this.isActive() ? 0 : -1;
        this.eventTracker.add(element, "blur", this.onBlur_.bind(this));
        this.eventTracker.add(element, "focus", this.onFocus_.bind(this));
        this.eventTracker.add(element, "keydown", this.onKeydown_.bind(this));
        this.eventTracker.add(element, "mousedown", this.onMousedown_.bind(this));
        return true
    }
    destroy() {
        this.eventTracker.removeAll()
    }
    getCustomEquivalent(_sampleElement) {
        const focusable = this.getFirstFocusable();
        assert(focusable);
        return focusable
    }
    getElements() {
        return Array.from(this.root.querySelectorAll("[focus-type]")).map(FocusRow.getFocusableElement)
    }
    getEquivalentElement(sampleElement) {
        if (this.getFocusableElements().indexOf(sampleElement) >= 0) {
            return sampleElement
        }
        const sampleFocusType = this.getTypeForElement(sampleElement);
        if (sampleFocusType) {
            const sameType = this.getFirstFocusable(sampleFocusType);
            if (sameType) {
                return sameType
            }
        }
        return this.getCustomEquivalent(sampleElement)
    }
    getFirstFocusable(type) {
        const element = this.getFocusableElements().find((el => !type || el.getAttribute("focus-type") === type));
        return element || null
    }
    getFocusableElements() {
        return this.getElements().filter(FocusRow.isFocusable)
    }
    getTypeForElement(element) {
        return element.getAttribute("focus-type") || ""
    }
    isActive() {
        return this.root.classList.contains(ACTIVE_CLASS)
    }
    makeActive(active) {
        if (active === this.isActive()) {
            return
        }
        this.getElements().forEach((function(element) {
            element.tabIndex = active ? 0 : -1
        }
        ));
        this.root.classList.toggle(ACTIVE_CLASS, active)
    }
    onBlur_(e) {
        if (!this.boundary_.contains(e.relatedTarget)) {
            return
        }
        const currentTarget = e.currentTarget;
        if (this.getFocusableElements().indexOf(currentTarget) >= 0) {
            this.makeActive(false)
        }
    }
    onFocus_(e) {
        if (this.delegate) {
            this.delegate.onFocus(this, e)
        }
    }
    onMousedown_(e) {
        if (e.button) {
            return
        }
        const target = e.currentTarget;
        if (!target.disabled) {
            target.tabIndex = 0
        }
    }
    onKeydown_(e) {
        const elements = this.getFocusableElements();
        const currentElement = FocusRow.getFocusableElement(e.currentTarget);
        const elementIndex = elements.indexOf(currentElement);
        assert(elementIndex >= 0);
        if (this.delegate && this.delegate.onKeydown(this, e)) {
            return
        }
        const isShiftTab = !e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey && e.key === "Tab";
        if (hasKeyModifiers(e) && !isShiftTab) {
            return
        }
        let index = -1;
        let shouldStopPropagation = true;
        if (isShiftTab) {
            index = elementIndex - 1;
            if (index < 0) {
                return
            }
        } else if (e.key === "ArrowLeft") {
            index = elementIndex + (isRTL() ? 1 : -1)
        } else if (e.key === "ArrowRight") {
            index = elementIndex + (isRTL() ? -1 : 1)
        } else if (e.key === "Home") {
            index = 0
        } else if (e.key === "End") {
            index = elements.length - 1
        } else {
            shouldStopPropagation = false
        }
        const elementToFocus = elements[index];
        if (elementToFocus) {
            this.getEquivalentElement(elementToFocus).focus();
            e.preventDefault()
        }
        if (shouldStopPropagation) {
            e.stopPropagation()
        }
    }
}
let hideInk = false;
document.addEventListener("pointerdown", (function() {
    hideInk = true
}
), true);
document.addEventListener("keydown", (function() {
    hideInk = false
}
), true);
function focusWithoutInk(toFocus) {
    if (!("noink"in toFocus) || !hideInk) {
        toFocus.focus();
        return
    }
    const toFocusWithNoInk = toFocus;
    assert(document === toFocusWithNoInk.ownerDocument);
    const {noink: noink} = toFocusWithNoInk;
    toFocusWithNoInk.noink = true;
    toFocusWithNoInk.focus();
    toFocusWithNoInk.noink = noink
}
let instance$n = null;
function getCss$i() {
    return instance$n || (instance$n = [...[], css`:host{--cr-hairline:1px solid var(--color-menu-separator,var(--cr-fallback-color-divider));--cr-action-menu-disabled-item-color:var(--color-menu-item-foreground-disabled,var(--cr-fallback-color-disabled-foreground));--cr-action-menu-disabled-item-opacity:1;--cr-menu-background-color:var(--color-menu-background,var(--cr-fallback-color-surface));--cr-menu-background-focus-color:var(--cr-hover-background-color);--cr-menu-shadow:var(--cr-elevation-2);--cr-primary-text-color:var(--color-menu-item-foreground,var(--cr-fallback-color-on-surface))}:host dialog{background-color:var(--cr-menu-background-color);border:none;border-radius:var(--cr-menu-border-radius,4px);box-shadow:var(--cr-menu-shadow);margin:0;min-width:128px;outline:none;overflow:var(--cr-action-menu-overflow,auto);padding:0;position:absolute}@media (forced-colors:active){:host dialog{border:var(--cr-border-hcm)}}:host dialog::backdrop{background-color:transparent}:host ::slotted(.dropdown-item){-webkit-tap-highlight-color:transparent;background:none;border:none;border-radius:0;box-sizing:border-box;color:var(--cr-primary-text-color);font:inherit;min-height:32px;padding:8px 24px;text-align:start;user-select:none;width:100%}:host ::slotted(.dropdown-item:not([hidden])){align-items:center;display:flex}:host ::slotted(.dropdown-item[disabled]){color:var(--cr-action-menu-disabled-item-color,var(--cr-primary-text-color));opacity:var(--cr-action-menu-disabled-item-opacity,0.65)}:host ::slotted(.dropdown-item:not([disabled])){cursor:pointer}:host ::slotted(.dropdown-item:focus){background-color:var(--cr-menu-background-focus-color);outline:none}:host ::slotted(.dropdown-item:focus-visible){outline:solid 2px var(--cr-focus-outline-color);outline-offset:-2px}@media (forced-colors:active){:host ::slotted(.dropdown-item:focus){outline:var(--cr-focus-outline-hcm)}}.item-wrapper{outline:none;padding:var(--cr-action-menu-padding,8px 0)}`])
}
function getHtml$g() {
    return html`
<dialog id="dialog" part="dialog" @close="${this.onNativeDialogClose_}"
    role="application"
    aria-roledescription="${this.roleDescription || nothing}">
  <div id="wrapper" class="item-wrapper" role="menu" tabindex="-1"
      aria-label="${this.accessibilityLabel || nothing}">
    <slot id="contentNode" @slotchange="${this.onSlotchange_}"></slot>
  </div>
</dialog>`
}
var AnchorAlignment;
(function(AnchorAlignment) {
    AnchorAlignment[AnchorAlignment["BEFORE_START"] = -2] = "BEFORE_START";
    AnchorAlignment[AnchorAlignment["AFTER_START"] = -1] = "AFTER_START";
    AnchorAlignment[AnchorAlignment["CENTER"] = 0] = "CENTER";
    AnchorAlignment[AnchorAlignment["BEFORE_END"] = 1] = "BEFORE_END";
    AnchorAlignment[AnchorAlignment["AFTER_END"] = 2] = "AFTER_END"
}
)(AnchorAlignment || (AnchorAlignment = {}));
const DROPDOWN_ITEM_CLASS = "dropdown-item";
const SELECTABLE_DROPDOWN_ITEM_QUERY = `.${DROPDOWN_ITEM_CLASS}:not([hidden]):not([disabled])`;
const AFTER_END_OFFSET = 10;
function getStartPointWithAnchor(start, end, menuLength, anchorAlignment, min, max) {
    let startPoint = 0;
    switch (anchorAlignment) {
    case AnchorAlignment.BEFORE_START:
        startPoint = start - menuLength;
        break;
    case AnchorAlignment.AFTER_START:
        startPoint = start;
        break;
    case AnchorAlignment.CENTER:
        startPoint = (start + end - menuLength) / 2;
        break;
    case AnchorAlignment.BEFORE_END:
        startPoint = end - menuLength;
        break;
    case AnchorAlignment.AFTER_END:
        startPoint = end;
        break
    }
    if (startPoint + menuLength > max) {
        startPoint = end - menuLength
    }
    if (startPoint < min) {
        startPoint = start
    }
    startPoint = Math.max(min, Math.min(startPoint, max - menuLength));
    return startPoint
}
function getDefaultShowConfig() {
    return {
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        anchorAlignmentX: AnchorAlignment.AFTER_START,
        anchorAlignmentY: AnchorAlignment.AFTER_START,
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    }
}
class CrActionMenuElement extends CrLitElement {
    static get is() {
        return "cr-action-menu"
    }
    static get styles() {
        return getCss$i()
    }
    render() {
        return getHtml$g.bind(this)()
    }
    static get properties() {
        return {
            accessibilityLabel: {
                type: String
            },
            autoReposition: {
                type: Boolean
            },
            open: {
                type: Boolean,
                notify: true
            },
            roleDescription: {
                type: String
            }
        }
    }
    #accessibilityLabel_accessor_storage;
    get accessibilityLabel() {
        return this.#accessibilityLabel_accessor_storage
    }
    set accessibilityLabel(value) {
        this.#accessibilityLabel_accessor_storage = value
    }
    #autoReposition_accessor_storage = false;
    get autoReposition() {
        return this.#autoReposition_accessor_storage
    }
    set autoReposition(value) {
        this.#autoReposition_accessor_storage = value
    }
    #open_accessor_storage = false;
    get open() {
        return this.#open_accessor_storage
    }
    set open(value) {
        this.#open_accessor_storage = value
    }
    #roleDescription_accessor_storage;
    get roleDescription() {
        return this.#roleDescription_accessor_storage
    }
    set roleDescription(value) {
        this.#roleDescription_accessor_storage = value
    }
    boundClose_ = null;
    resizeObserver_ = null;
    hasMousemoveListener_ = false;
    anchorElement_ = null;
    lastConfig_ = null;
    firstUpdated() {
        this.addEventListener("keydown", this.onKeyDown_.bind(this));
        this.addEventListener("mouseover", this.onMouseover_);
        this.addEventListener("click", this.onClick_)
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListeners_()
    }
    getDialog() {
        return this.$.dialog
    }
    removeListeners_() {
        window.removeEventListener("resize", this.boundClose_);
        window.removeEventListener("popstate", this.boundClose_);
        if (this.resizeObserver_) {
            this.resizeObserver_.disconnect();
            this.resizeObserver_ = null
        }
    }
    onNativeDialogClose_(e) {
        if (e.target !== this.$.dialog) {
            return
        }
        this.fire("close")
    }
    onClick_(e) {
        if (e.target === this) {
            this.close();
            e.stopPropagation()
        }
    }
    onKeyDown_(e) {
        e.stopPropagation();
        if (e.key === "Tab" || e.key === "Escape") {
            this.close();
            if (e.key === "Tab") {
                this.fire("tabkeyclose", {
                    shiftKey: e.shiftKey
                })
            }
            e.preventDefault();
            return
        }
        if (e.key !== "Enter" && e.key !== "ArrowUp" && e.key !== "ArrowDown") {
            return
        }
        const options = Array.from(this.querySelectorAll(SELECTABLE_DROPDOWN_ITEM_QUERY));
        if (options.length === 0) {
            return
        }
        const focused = getDeepActiveElement();
        const index = options.findIndex((option => FocusRow.getFocusableElement(option) === focused));
        if (e.key === "Enter") {
            if (index !== -1) {
                return
            }
            if (isWindows || isMac) {
                this.close();
                e.preventDefault();
                return
            }
        }
        e.preventDefault();
        this.updateFocus_(options, index, e.key !== "ArrowUp");
        if (!this.hasMousemoveListener_) {
            this.hasMousemoveListener_ = true;
            this.addEventListener("mousemove", (e => {
                this.onMouseover_(e);
                this.hasMousemoveListener_ = false
            }
            ), {
                once: true
            })
        }
    }
    onMouseover_(e) {
        const item = e.composedPath().find((el => el.matches && el.matches(SELECTABLE_DROPDOWN_ITEM_QUERY)));
        (item || this.$.wrapper).focus()
    }
    updateFocus_(options, focusedIndex, next) {
        const numOptions = options.length;
        assert(numOptions > 0);
        let index;
        if (focusedIndex === -1) {
            index = next ? 0 : numOptions - 1
        } else {
            const delta = next ? 1 : -1;
            index = (numOptions + focusedIndex + delta) % numOptions
        }
        options[index].focus()
    }
    close() {
        if (!this.open) {
            return
        }
        this.removeListeners_();
        this.$.dialog.close();
        this.open = false;
        if (this.anchorElement_) {
            assert(this.anchorElement_);
            focusWithoutInk(this.anchorElement_);
            this.anchorElement_ = null
        }
        if (this.lastConfig_) {
            this.lastConfig_ = null
        }
    }
    showAt(anchorElement, config) {
        this.anchorElement_ = anchorElement;
        this.anchorElement_.scrollIntoViewIfNeeded();
        const rect = this.anchorElement_.getBoundingClientRect();
        let height = rect.height;
        if (config && !config.noOffset && config.anchorAlignmentY === AnchorAlignment.AFTER_END) {
            height -= AFTER_END_OFFSET
        }
        this.showAtPosition(Object.assign({
            top: rect.top,
            left: rect.left,
            height: height,
            width: rect.width,
            anchorAlignmentX: AnchorAlignment.BEFORE_END
        }, config));
        this.$.wrapper.focus()
    }
    showAtPosition(config) {
        const doc = document.scrollingElement;
        const scrollLeft = doc.scrollLeft;
        const scrollTop = doc.scrollTop;
        this.resetStyle_();
        this.$.dialog.showModal();
        this.open = true;
        config.top += scrollTop;
        config.left += scrollLeft;
        this.positionDialog_(Object.assign({
            minX: scrollLeft,
            minY: scrollTop,
            maxX: scrollLeft + doc.clientWidth,
            maxY: scrollTop + doc.clientHeight
        }, config));
        doc.scrollTop = scrollTop;
        doc.scrollLeft = scrollLeft;
        this.addListeners_();
        const openedByKey = FocusOutlineManager.forDocument(document).visible;
        if (openedByKey) {
            const firstSelectableItem = this.querySelector(SELECTABLE_DROPDOWN_ITEM_QUERY);
            if (firstSelectableItem) {
                requestAnimationFrame(( () => {
                    firstSelectableItem.focus()
                }
                ))
            }
        }
    }
    resetStyle_() {
        this.$.dialog.style.left = "";
        this.$.dialog.style.right = "";
        this.$.dialog.style.top = "0"
    }
    positionDialog_(config) {
        this.lastConfig_ = config;
        const c = Object.assign(getDefaultShowConfig(), config);
        const top = c.top;
        const left = c.left;
        const bottom = top + c.height;
        const right = left + c.width;
        const rtl = getComputedStyle(this).direction === "rtl";
        if (rtl) {
            c.anchorAlignmentX *= -1
        }
        const offsetWidth = this.$.dialog.offsetWidth;
        const menuLeft = getStartPointWithAnchor(left, right, offsetWidth, c.anchorAlignmentX, c.minX, c.maxX);
        if (rtl) {
            const menuRight = document.scrollingElement.clientWidth - menuLeft - offsetWidth;
            this.$.dialog.style.right = menuRight + "px"
        } else {
            this.$.dialog.style.left = menuLeft + "px"
        }
        const menuTop = getStartPointWithAnchor(top, bottom, this.$.dialog.offsetHeight, c.anchorAlignmentY, c.minY, c.maxY);
        this.$.dialog.style.top = menuTop + "px"
    }
    onSlotchange_() {
        for (const node of this.$.contentNode.assignedElements({
            flatten: true
        })) {
            if (node.classList.contains(DROPDOWN_ITEM_CLASS) && !node.getAttribute("role")) {
                node.setAttribute("role", "menuitem")
            }
        }
    }
    addListeners_() {
        this.boundClose_ = this.boundClose_ || ( () => {
            if (this.$.dialog.open) {
                this.close()
            }
        }
        );
        window.addEventListener("resize", this.boundClose_);
        window.addEventListener("popstate", this.boundClose_);
        if (this.autoReposition) {
            this.resizeObserver_ = new ResizeObserver(( () => {
                if (this.lastConfig_) {
                    this.positionDialog_(this.lastConfig_);
                    this.fire("cr-action-menu-repositioned")
                }
            }
            ));
            this.resizeObserver_.observe(this.$.dialog)
        }
    }
}
customElements.define(CrActionMenuElement.is, CrActionMenuElement);
let instance$m = null;
function getCss$h() {
    return instance$m || (instance$m = [...[getCss$n()], css`:host{--cr-focus-outline-color:var(--color-searchbox-results-icon-focused-outline)}@media (forced-colors:active){#entrypoint{background-color:ButtonText}}#entrypoint{--cr-button-disabled-text-color:var(--color-new-tab-page-composebox-context-entrypoint-text-disabled);--cr-button-text-color:var(--color-new-tab-page-composebox-file-chip-text);--cr-hover-background-color:var(--color-new-tab-page-composebox-context-entrypoint-hover-background);--cr-icon-button-margin-start:6px;border:initial}#entrypoint:not([disabled]){--cr-icon-button-fill-color:var(--cr-button-text-color)}#description{display:block;font-size:13px}#menu{--color-sys-divider:var(--color-new-tab-page-composebox-file-carousel-divider);--cr-action-menu-overflow:visible;--cr-menu-background-color:var(--color-new-tab-page-composebox-background);--cr-menu-border-radius:16px;--cr-primary-text-color:var(--color-new-tab-page-composebox-file-chip-text);--cr-hover-background-color:var(--color-new-tab-page-composebox-context-entrypoint-hover-background)}.suggestion-container{position:relative}.tab-preview{background-color:var(--color-sys-surface-container-high);border-radius:12px;border:1px solid var(--color-sys-outline);box-shadow:0 4px 12px 0 rgba(0,0,0,0.15);display:none;height:125px;inset-inline-start:100%;margin-inline-start:8px;object-fit:cover;object-position:top;position:absolute;top:50%;transform:translateY(-50%);width:200px}.dropdown-item:hover+.tab-preview{display:block}#tabHeader{color:var(--cr-primary-text-color);font-size:11px;font-weight:500;line-height:16px;margin:0;padding:8px 14px 4px 14px}.dropdown-item{--iron-icon-height:16px;--iron-icon-width:16px;align-items:center;background:transparent;border:none;color:var(--cr-primary-text-color);cursor:pointer;display:flex;font-size:13px;font-weight:400;gap:8px;height:32px;justify-content:flex-start;max-width:320px;padding:6px 14px;text-align:left;width:100%}.dropdown-item:hover{background-color:var(--cr-hover-background-color)}.dropdown-item[disabled]{color:var(--color-new-tab-page-composebox-context-entrypoint-text-disabled);cursor:default}.dropdown-item[disabled]:hover{background-color:transparent}#menu hr{background:var(--color-sys-divider);border:none;height:1px;margin:8px 0}.tab-title{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#createImage{--iron-icon-height:18px;--iron-icon-width:18px}`])
}
function getHtml$f() {
    return html`<!--_html_template_start_-->
    ${this.showContextMenuDescription ? html`
    <cr-button id="entrypoint"
        @click="${this.onEntrypointClick_}"
        ?disabled="${this.inputsDisabled}"
        title="${this.i18n("addContextTitle")}">
      <cr-icon id="entrypointIcon" icon="cr:add" slot="prefix-icon"></cr-icon>
      <span id="description">${this.i18n("addContext")}</span>
    </cr-button>
    ` : html`
      <cr-icon-button id="entrypoint"
          iron-icon="cr:add"
          @click="${this.onEntrypointClick_}"
          ?disabled="${this.inputsDisabled}"
          title="${this.i18n("addContextTitle")}">
      </cr-icon-button>
    `}

  <cr-action-menu id="menu" role-description="${this.i18n("menu")}">
    ${this.tabSuggestions_?.length > 0 ? html`
      <h4 id="tabHeader">${this.i18n("addTab")}</h4>
      ${this.tabSuggestions_.map(( (tab, index) => html`
        <div class="suggestion-container">
          <button class="dropdown-item"
              title="${tab.title}" data-index="${index}"
              aria-label="${this.i18n("addTab")}, ${tab.title}"
              ?disabled="${this.isTabDisabled_(tab)}"
              @pointerenter="${this.onTabPointerenter_}"
              @click="${this.addTabContext_}">
            <composebox-tab-favicon .url="${tab.url.url}">
            </composebox-tab-favicon>
            <span class="tab-title">${tab.title}</span>
          </button>
          ${this.shouldShowTabPreview_() ? html`
            <img class="tab-preview" .src="${this.tabPreviewUrl_}">
          ` : ""}
        </div>
      `))}
      <hr/>
    ` : ""}
    <button id="imageUpload" class="dropdown-item"
        @click="${this.openImageUpload_}"
         ?disabled="${this.imageUploadDisabled_}">
      <cr-icon icon="composebox:imageUpload"></cr-icon>
      ${this.i18n("addImage")}
    </button>
    <button id="fileUpload" class="dropdown-item"
        @click="${this.openFileUpload_}"
        ?disabled="${this.fileUploadDisabled_}">
      <cr-icon icon="composebox:fileUpload"></cr-icon>
      ${this.i18n("uploadFile")}
    </button>
    ${this.showDeepSearch_ || this.showCreateImage_ ? html`<hr/>` : ""}
    ${this.showDeepSearch_ ? html`<button id="deepSearch" class="dropdown-item"
        @click="${this.onDeepSearchClick_}"
        ?disabled="${this.deepSearchDisabled_}">
      <cr-icon icon="composebox:deepSearch"></cr-icon>
      ${this.i18n("deepSearch")}
    </button>` : ""}
    ${this.showCreateImage_ ? html`<button id="createImage" class="dropdown-item"
        @click="${this.onCreateImageClick_}"
        ?disabled="${this.createImageDisabled_}">
      <cr-icon icon="composebox:nanoBanana"></cr-icon>
      ${this.i18n("createImages")}
    </button>` : ""}
  </cr-action-menu>
<!--_html_template_end_-->`
}
const MENU_WIDTH_PX = 190;
const ContextMenuEntrypointElementBase = I18nMixinLit(CrLitElement);
class ContextMenuEntrypointElement extends ContextMenuEntrypointElementBase {
    static get is() {
        return "composebox-context-menu-entrypoint"
    }
    static get styles() {
        return getCss$h()
    }
    render() {
        return getHtml$f.bind(this)()
    }
    static get properties() {
        return {
            inputsDisabled: {
                type: Boolean
            },
            fileNum: {
                type: Number
            },
            showContextMenuDescription: {
                type: Boolean
            },
            inCreateImageMode: {
                reflect: true,
                type: Boolean
            },
            hasImageFiles: {
                reflect: true,
                type: Boolean
            },
            disabledTabIds: {
                type: Object
            },
            tabSuggestions_: {
                type: Array
            },
            tabPreviewUrl_: {
                type: String
            },
            tabPreviewsEnabled_: {
                type: Boolean
            },
            showDeepSearch_: {
                reflect: true,
                type: Boolean
            },
            showCreateImage_: {
                reflect: true,
                type: Boolean
            },
            entrypointName: {
                type: String
            }
        }
    }
    #inputsDisabled_accessor_storage = false;
    get inputsDisabled() {
        return this.#inputsDisabled_accessor_storage
    }
    set inputsDisabled(value) {
        this.#inputsDisabled_accessor_storage = value
    }
    #fileNum_accessor_storage = 0;
    get fileNum() {
        return this.#fileNum_accessor_storage
    }
    set fileNum(value) {
        this.#fileNum_accessor_storage = value
    }
    #showContextMenuDescription_accessor_storage = false;
    get showContextMenuDescription() {
        return this.#showContextMenuDescription_accessor_storage
    }
    set showContextMenuDescription(value) {
        this.#showContextMenuDescription_accessor_storage = value
    }
    #inCreateImageMode_accessor_storage = false;
    get inCreateImageMode() {
        return this.#inCreateImageMode_accessor_storage
    }
    set inCreateImageMode(value) {
        this.#inCreateImageMode_accessor_storage = value
    }
    #hasImageFiles_accessor_storage = false;
    get hasImageFiles() {
        return this.#hasImageFiles_accessor_storage
    }
    set hasImageFiles(value) {
        this.#hasImageFiles_accessor_storage = value
    }
    #disabledTabIds_accessor_storage = new Set;
    get disabledTabIds() {
        return this.#disabledTabIds_accessor_storage
    }
    set disabledTabIds(value) {
        this.#disabledTabIds_accessor_storage = value
    }
    #entrypointName_accessor_storage = "";
    get entrypointName() {
        return this.#entrypointName_accessor_storage
    }
    set entrypointName(value) {
        this.#entrypointName_accessor_storage = value
    }
    #tabSuggestions__accessor_storage = [];
    get tabSuggestions_() {
        return this.#tabSuggestions__accessor_storage
    }
    set tabSuggestions_(value) {
        this.#tabSuggestions__accessor_storage = value
    }
    #tabPreviewUrl__accessor_storage = "";
    get tabPreviewUrl_() {
        return this.#tabPreviewUrl__accessor_storage
    }
    set tabPreviewUrl_(value) {
        this.#tabPreviewUrl__accessor_storage = value
    }
    #tabPreviewsEnabled__accessor_storage = loadTimeData.getBoolean("composeboxShowContextMenuTabPreviews");
    get tabPreviewsEnabled_() {
        return this.#tabPreviewsEnabled__accessor_storage
    }
    set tabPreviewsEnabled_(value) {
        this.#tabPreviewsEnabled__accessor_storage = value
    }
    #showDeepSearch__accessor_storage = loadTimeData.getBoolean("composeboxShowDeepSearchButton");
    get showDeepSearch_() {
        return this.#showDeepSearch__accessor_storage
    }
    set showDeepSearch_(value) {
        this.#showDeepSearch__accessor_storage = value
    }
    #showCreateImage__accessor_storage = loadTimeData.getBoolean("composeboxShowCreateImageButton");
    get showCreateImage_() {
        return this.#showCreateImage__accessor_storage
    }
    set showCreateImage_(value) {
        this.#showCreateImage__accessor_storage = value
    }
    maxFileCount_ = loadTimeData.getInteger("composeboxFileMaxCount");
    constructor() {
        super()
    }
    get imageUploadDisabled_() {
        return this.fileNum >= this.maxFileCount_ || this.inCreateImageMode && this.hasImageFiles
    }
    get fileUploadDisabled_() {
        return this.inCreateImageMode || this.fileNum >= this.maxFileCount_
    }
    get deepSearchDisabled_() {
        return this.inCreateImageMode || this.fileNum === 1 || this.fileNum > 1
    }
    get createImageDisabled_() {
        return this.fileNum > 1 || this.fileNum === 1 && !this.hasImageFiles
    }
    isTabDisabled_(tab) {
        return this.inCreateImageMode || this.fileNum >= this.maxFileCount_ || this.disabledTabIds.has(tab.tabId)
    }
    onEntrypointClick_() {
        const metricName = "NewTabPage." + this.entrypointName + ".ContextMenuEntry.Clicked";
        chrome.metricsPrivate.recordBoolean(metricName, true);
        const entrypoint = this.shadowRoot.querySelector("#entrypoint");
        assert(entrypoint);
        this.$.menu.showAt(entrypoint, {
            top: entrypoint.getBoundingClientRect().bottom,
            width: MENU_WIDTH_PX,
            anchorAlignmentX: AnchorAlignment["AFTER_START"]
        })
    }
    addTabContext_(e) {
        e.stopPropagation();
        const tabElement = e.currentTarget;
        const tabInfo = this.tabSuggestions_[Number(tabElement.dataset["index"])];
        assert(tabInfo);
        this.fire("add-tab-context", {
            id: tabInfo.tabId,
            title: tabInfo.title,
            url: tabInfo.url
        });
        this.$.menu.close()
    }
    onTabPointerenter_(e) {
        if (!this.tabPreviewsEnabled_) {
            return
        }
        const tabElement = e.currentTarget;
        const tabInfo = this.tabSuggestions_[Number(tabElement.dataset["index"])];
        assert(tabInfo);
        this.tabPreviewUrl_ = "";
        this.fire("get-tab-preview", {
            tabId: tabInfo.tabId,
            onPreviewFetched: previewDataUrl => {
                this.tabPreviewUrl_ = previewDataUrl
            }
        })
    }
    shouldShowTabPreview_() {
        return this.tabPreviewsEnabled_ && this.tabPreviewUrl_ !== ""
    }
    openImageUpload_() {
        this.fire("open-image-upload");
        this.$.menu.close()
    }
    openFileUpload_() {
        this.fire("open-file-upload");
        this.$.menu.close()
    }
    onDeepSearchClick_() {
        this.fire("deep-search-click");
        this.$.menu.close()
    }
    onCreateImageClick_() {
        this.fire("create-image-click");
        this.$.menu.close()
    }
}
customElements.define(ContextMenuEntrypointElement.is, ContextMenuEntrypointElement);
let instance$l = null;
function getCss$g() {
    return instance$l || (instance$l = [...[], css`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.spinner{height:20px;width:20px}.spinner-circle{animation:spin 1.5s linear infinite;fill:none;stroke:var(--color-new-tab-page-composebox-upload-button);stroke-dasharray:240;stroke-dashoffset:60;stroke-linecap:round;stroke-width:10;transform-origin:50% 50%}.img-thumbnail{height:100%;object-fit:cover;object-position:center;width:100%}#imgChip{align-items:center;border-radius:8px;display:flex;height:36px;justify-content:center;overflow:hidden;position:relative;width:36px}.img-overlay{background-color:var(--color-new-tab-page-composebox-file-image-overlay);height:100%;left:0;opacity:0;position:absolute;top:0;width:100%}#removeImgButton{--cr-icon-button-height:100%;--cr-icon-button-width:100%;--cr-icon-button-fill-color:white;--cr-icon-button-icon-size:20px;--cr-icon-button-margin-start:0px;border-radius:10px;display:flex}.chip{align-items:center;background-color:var(--color-new-tab-page-composebox-file-chip-background);border-radius:10px;display:flex;gap:8px;height:36px;overflow:hidden;padding:0px 0px 0px 4px;position:relative;width:174px}.thumbnail{align-items:center;display:flex;flex-shrink:0;height:20px;justify-content:center;margin-left:4px;position:relative;width:20px}.pdf-icon{background-color:var(--color-new-tab-page-composebox-background);box-sizing:border-box;border-radius:4px;color:var(--color-new-tab-page-composebox-pdf-chip-icon);height:100%;padding:4px;width:100%}.chip:hover .pdf-icon,.chip:hover composebox-tab-favicon{display:none}.chip-overlay{background-color:var(--color-new-tab-page-composebox-context-entrypoint-hover-background);border-radius:inherit;inset:0;display:none;pointer-events:none;position:absolute}.chip:hover .chip-overlay{display:block}.overlay{height:100%;left:0;opacity:0;position:absolute;top:0;width:100%}.remove-button{--cr-icon-button-fill-color:white;--cr-icon-button-icon-size:20px;--cr-icon-button-margin-start:0;--cr-icon-button-margin-end:8px;background-color:var(--color-new-tab-page-composebox-file-image-overlay);border-radius:4px;color:var(--color-new-tab-page-composebox-pdf-chip-icon);height:100%;left:0;position:absolute;top:0;width:100%}.title{color:var(--color-new-tab-page-composebox-file-chip-text);font-family:inherit;font-size:14px;font-weight:400;margin-inline-end:12px;overflow:hidden;position:relative;text-overflow:ellipsis;white-space:nowrap}#imgChip:hover .img-overlay,#imgChip:focus-within .img-overlay,.chip:hover .overlay,.chip:focus-within .overlay{opacity:1}#tabThumbnail composebox-tab-favicon{border-radius:4px;height:20px;width:20px}`])
}
function getHtml$e() {
    return html`<!--_html_template_start_-->
<div id="container">
  ${this.file.url ? html`
    <div id="tabChip" class="chip">
      <div id="tabThumbnail" class="thumbnail">
        <composebox-tab-favicon .url="${this.file.url.url}" .size="${24}">
        </composebox-tab-favicon>
        <div class="overlay">
          <cr-icon-button
              id="removeTabButton"
              class="remove-button"
              iron-icon="cr:clear"
              title="${this.file.name}"
              aria-label="${this.deleteFileButtonTitle}"
              @click="${this.deleteFile_}">
          </cr-icon-button>
        </div>
      </div>
      <p class="title">${this.file.name}</p>
      <div class="chip-overlay"></div>
    </div>
  ` : this.file.objectUrl ? html`
    <div id="imgChip">
      ${this.file.status === FileUploadStatus$1.kUploadSuccessful ? html`
        <img class="img-thumbnail"
          src="${this.file.objectUrl}"
          aria-label="${this.file.name}">
      ` : html`
        <svg role="image" class="spinner" viewBox="0 0 100 100">
          <circle class="spinner-circle" cx="50" cy="50" r="40" />
        </svg>
      `}
      <cr-icon-button
          class="img-overlay"
          id="removeImgButton"
          iron-icon="cr:clear"
          title="${this.file.name}"
          aria-label="${this.deleteFileButtonTitle}"
          @click="${this.deleteFile_}">
      </cr-icon-button>
    </div>` : html`
    <div id="pdfChip" class="chip">
      <div id="pdfThumbnail" class="thumbnail">
        ${this.file.status === FileUploadStatus$1.kUploadSuccessful ? html`
          <cr-icon icon="thumbnail:pdf" class="pdf-icon">
          </cr-icon>
        ` : html`
          <svg class="spinner" viewBox="0 0 100 100">
            <circle class="spinner-circle" cx="50" cy="50" r="40" />
          </svg>
        `}
        <div class="overlay">
          <cr-icon-button
              id="removePdfButton"
              class="remove-button"
              iron-icon="cr:clear"
              title="${this.file.name}"
              aria-label="${this.deleteFileButtonTitle}"
              @click="${this.deleteFile_}">
          </cr-icon-button>
        </div>
      </div>
      <p class="title" id="pdfTitle">${this.file.name}</p>
      <div class="chip-overlay"></div>
    </div>
  `}
</div>
<!--_html_template_end_-->`
}
class ComposeboxFileThumbnailElement extends CrLitElement {
    static get is() {
        return "ntp-composebox-file-thumbnail"
    }
    static get styles() {
        return getCss$g()
    }
    render() {
        return getHtml$e.bind(this)()
    }
    static get properties() {
        return {
            file: {
                type: Object
            }
        }
    }
    #file_accessor_storage = {
        name: "",
        type: "",
        objectUrl: null,
        uuid: "",
        status: FileUploadStatus$1.kNotUploaded,
        url: null,
        file: null,
        tabId: null
    };
    get file() {
        return this.#file_accessor_storage
    }
    set file(value) {
        this.#file_accessor_storage = value
    }
    deleteFile_() {
        this.fire("delete-file", {
            uuid: this.file.uuid
        })
    }
    get deleteFileButtonTitle() {
        return loadTimeData.getStringF("composeboxDeleteFileTitle", this.file.name)
    }
}
customElements.define(ComposeboxFileThumbnailElement.is, ComposeboxFileThumbnailElement);
let instance$k = null;
function getCss$f() {
    return instance$k || (instance$k = [...[], css`:host{display:flex;flex-wrap:wrap;gap:6px;width:100%}`])
}
function getHtml$d() {
    return html`<!--_html_template_start_-->
${this.files.map((item => html`
    <ntp-composebox-file-thumbnail .file="${item}">
    </ntp-composebox-file-thumbnail>`))}
<!--_html_template_end_-->`
}
class ComposeboxFileCarouselElement extends CrLitElement {
    static get is() {
        return "ntp-composebox-file-carousel"
    }
    static get styles() {
        return getCss$f()
    }
    render() {
        return getHtml$d.bind(this)()
    }
    static get properties() {
        return {
            files: {
                type: Array
            }
        }
    }
    #files_accessor_storage = [];
    get files() {
        return this.#files_accessor_storage
    }
    set files(value) {
        this.#files_accessor_storage = value
    }
}
customElements.define(ComposeboxFileCarouselElement.is, ComposeboxFileCarouselElement);
let instance$j = null;
function getCss$e() {
    return instance$j || (instance$j = [...[getCss$n()], css`#carousel{box-sizing:border-box;margin-bottom:12px;margin-top:13px;padding-inline-end:var(--context-carousel-inline-end-spacing,50px);padding-inline-start:var(--context-carousel-inline-start-spacing,50px)}.context-menu-container{align-items:center;display:flex;gap:4px;padding-inline-start:6px}#contextEntrypoint{color:var(--color-searchbox-results-foreground);padding-inline-end:8px}#toolChipsContainer{padding-top:10px;padding-inline-start:16px}#uploadContainer{display:flex;padding-inline-start:var(--text-input-inline-start-spacing)}.upload-icon{--cr-icon-button-focus-outline-color:var(--color-searchbox-results-icon-focused-outline);--cr-icon-button-icon-size:24px;--cr-icon-button-hover-background-color:var(--color-searchbox-results-background-hovered);--cr-icon-button-size:48px;color:var(--color-new-tab-page-composebox-upload-button)}:host([inputs-disabled_]) .upload-icon{color:var(--color-new-tab-page-composebox-upload-button-disabled)}#imageUploadButton{--cr-icon-button-margin-start:-12px}.carousel-divider{border-radius:100px;border-top:1px solid var(--color-new-tab-page-composebox-file-carousel-divider);margin-inline-end:16px;margin-inline-start:var(--text-input-inline-start-spacing);margin-top:20px;margin-bottom:10px}#deepSearchButton{align-items:center;background-color:var(--color-new-tab-page-composebox-context-entrypoint-hover-background);border:none;color:var(--color-new-tab-page-composebox-upload-button);display:flex;font-size:13px;gap:2px;height:36px;justify-content:center;padding-bottom:6px;padding-inline:8px 12px;padding-top:6px;width:126px}#deepSearchButton .icon-container{align-items:center;display:flex;height:24px;justify-content:center;position:relative;width:24px}#deepSearchButton .deep-search-icon,#deepSearchButton .close-icon{height:16px;position:absolute;transition:opacity 150ms;width:16px}#deepSearchButton .deep-search-icon{padding-top:3px}#deepSearchButton .close-icon{opacity:0}#deepSearchButton:hover .close-icon{opacity:1}#deepSearchButton:hover .deep-search-icon{opacity:0}`])
}
const styleMod = document.createElement("dom-module");
styleMod.appendChild(html$1`
  <template>
    <style>
.icon-arrow-back{--cr-icon-image:url(//resources/images/icon_arrow_back.svg)}.icon-arrow-dropdown{--cr-icon-image:url(//resources/images/icon_arrow_dropdown.svg)}.icon-arrow-drop-down-cr23{--cr-icon-image:url(//resources/images/icon_arrow_drop_down_cr23.svg)}.icon-arrow-drop-up-cr23{--cr-icon-image:url(//resources/images/icon_arrow_drop_up_cr23.svg)}.icon-arrow-upward{--cr-icon-image:url(//resources/images/icon_arrow_upward.svg)}.icon-cancel{--cr-icon-image:url(//resources/images/icon_cancel.svg)}.icon-clear{--cr-icon-image:url(//resources/images/icon_clear.svg)}.icon-copy-content{--cr-icon-image:url(//resources/images/icon_copy_content.svg)}.icon-delete-gray{--cr-icon-image:url(//resources/images/icon_delete_gray.svg)}.icon-edit{--cr-icon-image:url(//resources/images/icon_edit.svg)}.icon-file{--cr-icon-image:url(//resources/images/icon_filetype_generic.svg)}.icon-folder-open{--cr-icon-image:url(//resources/images/icon_folder_open.svg)}.icon-picture-delete{--cr-icon-image:url(//resources/images/icon_picture_delete.svg)}.icon-expand-less{--cr-icon-image:url(//resources/images/icon_expand_less.svg)}.icon-expand-more{--cr-icon-image:url(//resources/images/icon_expand_more.svg)}.icon-external{--cr-icon-image:url(//resources/images/open_in_new.svg)}.icon-more-vert{--cr-icon-image:url(//resources/images/icon_more_vert.svg)}.icon-refresh{--cr-icon-image:url(//resources/images/icon_refresh.svg)}.icon-search{--cr-icon-image:url(//resources/images/icon_search.svg)}.icon-settings{--cr-icon-image:url(//resources/images/icon_settings.svg)}.icon-visibility{--cr-icon-image:url(//resources/images/icon_visibility.svg)}.icon-visibility-off{--cr-icon-image:url(//resources/images/icon_visibility_off.svg)}.subpage-arrow{--cr-icon-image:url(//resources/images/arrow_right.svg)}.cr-icon{-webkit-mask-image:var(--cr-icon-image);-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:var(--cr-icon-size);background-color:var(--cr-icon-color,var(--google-grey-700));flex-shrink:0;height:var(--cr-icon-ripple-size);margin-inline-end:var(--cr-icon-ripple-margin);margin-inline-start:var(--cr-icon-button-margin-start);user-select:none;width:var(--cr-icon-ripple-size)}:host-context([dir=rtl]) .cr-icon{transform:scaleX(-1)}.cr-icon.no-overlap{margin-inline-end:0;margin-inline-start:0}@media (prefers-color-scheme:dark){.cr-icon{background-color:var(--cr-icon-color,var(--google-grey-500))}}
    </style>
  </template>
`.content);
styleMod.register("cr-icons");
function getHtml$c() {
    const showDescription = this.realboxLayoutMode !== "Compact" && this.showContextMenuDescription_ && !this.shouldShowRecentTabChip_;
    const toolChipsVisible = this.shouldShowRecentTabChip_ || this.inDeepSearchMode_ || this.inCreateImageMode_;
    const toolChips = html`
        ${this.shouldShowRecentTabChip_ ? html`
        <composebox-recent-tab-chip id="recentTabChip"
            class="upload-icon"
            .recentTab_=${this.tabSuggestions_[0]}
            .inputsDisabled_=${this.inputsDisabled_}
            @add-tab-context="${this.addTabContext_}">
        </composebox-recent-tab-chip>
        ` : ""}
        <composebox-tool-chip
            icon="composebox:deepSearch"
            label="${this.i18n("deepSearch")}"
            ?visible="${this.inDeepSearchMode_}"
            @click="${this.onDeepSearchClick_}">
        </composebox-tool-chip>
        <composebox-tool-chip
            icon="composebox:nanoBanana"
            label="${this.i18n("createImages")}"
            ?visible="${this.inCreateImageMode_}"
            @click="${this.onCreateImageClick_}">
        </composebox-tool-chip>
  `;
    const contextMenu = html`
      <div class="context-menu-container" part="context-menu-and-tools">
        <composebox-context-menu-entrypoint id="contextEntrypoint"
            part="composebox-entrypoint"
            class="upload-icon no-overlap"
            .tabSuggestions_=${this.tabSuggestions_}
            .entrypointName="${this.entrypointName}"
            @open-image-upload="${this.openImageUpload_}"
            @open-file-upload="${this.openFileUpload_}"
            @add-tab-context="${this.addTabContext_}"
            @deep-search-click="${this.onDeepSearchClick_}"
            @create-image-click="${this.onCreateImageClick_}"
            .inCreateImageMode="${this.inCreateImageMode_}"
            .hasImageFiles="${this.hasImageFiles()}"
            .disabledTabIds="${this.addedTabsIds_}"
            .fileNum="${this.files_.size}"
            ?inputs-disabled="${this.inputsDisabled_}"
            ?show-context-menu-description="${showDescription}">
        </composebox-context-menu-entrypoint>
        ${this.realboxLayoutMode !== "Compact" ? toolChips : ""}
      </div>
  `;
    return html`<!--_html_template_start_-->
  ${this.realboxLayoutMode === "Compact" ? contextMenu : ""}
  ${this.showFileCarousel_ ? html`
    <ntp-composebox-file-carousel
      part="composebox-file-carousel"
      id="carousel"
      .files=${Array.from(this.files_.values())}
      @delete-file=${this.onDeleteFile_}>
    </ntp-composebox-file-carousel> ` : ""}
  ${this.realboxLayoutMode === "TallTopContext" ? contextMenu : ""}
  ${this.showDropdown && (this.showFileCarousel_ || this.realboxLayoutMode === "TallTopContext") ? html`
  <div class="carousel-divider" part="carousel-divider"></div>` : ""}
  <!-- Suggestions are slotted in from the parent component. -->
  <slot id="dropdownMatches"></slot>
  ${this.realboxLayoutMode === "Compact" && toolChipsVisible ? html`
    <div class="context-menu-container" id='toolChipsContainer'
        part="tool-chips-container">${toolChips}</div>
  ` : ""}
  ${this.realboxLayoutMode === "TallBottomContext" || this.realboxLayoutMode === "" ? html`
    ${this.contextMenuEnabled_ ? contextMenu : html`
      <div id="uploadContainer" class="icon-fade">
          <cr-icon-button
              class="upload-icon no-overlap"
              id="imageUploadButton"
              iron-icon="composebox:imageUpload"
              title="${this.i18n("composeboxImageUploadButtonTitle")}"
              .disabled="${this.inputsDisabled_}"
              @click="${this.openImageUpload_}">
          </cr-icon-button>
          ${this.composeboxShowPdfUpload_ ? html`
          <cr-icon-button
              class="upload-icon no-overlap"
              id="fileUploadButton"
              iron-icon="composebox:fileUpload"
              title="${this.i18n("composeboxPdfUploadButtonTitle")}"
              .disabled="${this.inputsDisabled_}"
              @click="${this.openFileUpload_}">
          </cr-icon-button>
          ` : ""}
      </div>
    `}
  ` : ""}
  <input type="file"
      accept="${this.imageFileTypes_}"
      id="imageInput"
      @change="${this.onFileChange_}"
      hidden>
  </input>
  <input type="file"
      accept="${this.attachmentFileTypes_}"
      id="fileInput"
      @change="${this.onFileChange_}"
      hidden>
  </input>
<!--_html_template_end_-->`
}
var ComposeboxMode;
(function(ComposeboxMode) {
    ComposeboxMode["DEFAULT"] = "";
    ComposeboxMode["DEEP_SEARCH"] = "deep-search";
    ComposeboxMode["CREATE_IMAGE"] = "create-image"
}
)(ComposeboxMode || (ComposeboxMode = {}));
const FILE_VALIDATION_ERRORS_MAP = new Map([[FileUploadErrorType$1.kImageProcessingError, "composeboxFileUploadImageProcessingError"], [FileUploadErrorType$1.kUnknown, "composeboxFileUploadValidationFailed"]]);
class ContextualEntrypointAndCarouselElement extends (I18nMixinLit(CrLitElement)) {
    static get is() {
        return "contextual-entrypoint-and-carousel"
    }
    static get styles() {
        return getCss$e()
    }
    render() {
        return getHtml$c.bind(this)()
    }
    static get properties() {
        return {
            showDropdown: {
                type: Boolean
            },
            realboxLayoutMode: {
                type: String
            },
            attachmentFileTypes_: {
                type: String
            },
            contextMenuEnabled_: {
                type: Boolean
            },
            files_: {
                type: Object
            },
            addedTabsIds_: {
                type: Object
            },
            imageFileTypes_: {
                type: String
            },
            inputsDisabled_: {
                reflect: true,
                type: Boolean
            },
            composeboxShowPdfUpload_: {
                reflect: true,
                type: Boolean
            },
            showContextMenuDescription_: {
                type: Boolean
            },
            showFileCarousel_: {
                reflect: true,
                type: Boolean
            },
            showRecentTabChip_: {
                type: Boolean
            },
            inDeepSearchMode_: {
                reflect: true,
                type: Boolean
            },
            inCreateImageMode_: {
                reflect: true,
                type: Boolean
            },
            tabSuggestions_: {
                type: Array
            },
            entrypointName: {
                type: String
            },
            recentTabInContext_: {
                type: Boolean
            }
        }
    }
    #showDropdown_accessor_storage = false;
    get showDropdown() {
        return this.#showDropdown_accessor_storage
    }
    set showDropdown(value) {
        this.#showDropdown_accessor_storage = value
    }
    #realboxLayoutMode_accessor_storage = "";
    get realboxLayoutMode() {
        return this.#realboxLayoutMode_accessor_storage
    }
    set realboxLayoutMode(value) {
        this.#realboxLayoutMode_accessor_storage = value
    }
    #entrypointName_accessor_storage = "";
    get entrypointName() {
        return this.#entrypointName_accessor_storage
    }
    set entrypointName(value) {
        this.#entrypointName_accessor_storage = value
    }
    #attachmentFileTypes__accessor_storage = loadTimeData.getString("composeboxAttachmentFileTypes");
    get attachmentFileTypes_() {
        return this.#attachmentFileTypes__accessor_storage
    }
    set attachmentFileTypes_(value) {
        this.#attachmentFileTypes__accessor_storage = value
    }
    #contextMenuEnabled__accessor_storage = loadTimeData.getBoolean("composeboxShowContextMenu");
    get contextMenuEnabled_() {
        return this.#contextMenuEnabled__accessor_storage
    }
    set contextMenuEnabled_(value) {
        this.#contextMenuEnabled__accessor_storage = value
    }
    #files__accessor_storage = new Map;
    get files_() {
        return this.#files__accessor_storage
    }
    set files_(value) {
        this.#files__accessor_storage = value
    }
    #addedTabsIds__accessor_storage = new Set;
    get addedTabsIds_() {
        return this.#addedTabsIds__accessor_storage
    }
    set addedTabsIds_(value) {
        this.#addedTabsIds__accessor_storage = value
    }
    #imageFileTypes__accessor_storage = loadTimeData.getString("composeboxImageFileTypes");
    get imageFileTypes_() {
        return this.#imageFileTypes__accessor_storage
    }
    set imageFileTypes_(value) {
        this.#imageFileTypes__accessor_storage = value
    }
    #inputsDisabled__accessor_storage = false;
    get inputsDisabled_() {
        return this.#inputsDisabled__accessor_storage
    }
    set inputsDisabled_(value) {
        this.#inputsDisabled__accessor_storage = value
    }
    #composeboxShowPdfUpload__accessor_storage = loadTimeData.getBoolean("composeboxShowPdfUpload");
    get composeboxShowPdfUpload_() {
        return this.#composeboxShowPdfUpload__accessor_storage
    }
    set composeboxShowPdfUpload_(value) {
        this.#composeboxShowPdfUpload__accessor_storage = value
    }
    #showContextMenuDescription__accessor_storage = loadTimeData.getBoolean("composeboxShowContextMenuDescription");
    get showContextMenuDescription_() {
        return this.#showContextMenuDescription__accessor_storage
    }
    set showContextMenuDescription_(value) {
        this.#showContextMenuDescription__accessor_storage = value
    }
    #showRecentTabChip__accessor_storage = loadTimeData.getBoolean("composeboxShowRecentTabChip");
    get showRecentTabChip_() {
        return this.#showRecentTabChip__accessor_storage
    }
    set showRecentTabChip_(value) {
        this.#showRecentTabChip__accessor_storage = value
    }
    #showFileCarousel__accessor_storage = false;
    get showFileCarousel_() {
        return this.#showFileCarousel__accessor_storage
    }
    set showFileCarousel_(value) {
        this.#showFileCarousel__accessor_storage = value
    }
    #inDeepSearchMode__accessor_storage = false;
    get inDeepSearchMode_() {
        return this.#inDeepSearchMode__accessor_storage
    }
    set inDeepSearchMode_(value) {
        this.#inDeepSearchMode__accessor_storage = value
    }
    #inCreateImageMode__accessor_storage = false;
    get inCreateImageMode_() {
        return this.#inCreateImageMode__accessor_storage
    }
    set inCreateImageMode_(value) {
        this.#inCreateImageMode__accessor_storage = value
    }
    #tabSuggestions__accessor_storage = [];
    get tabSuggestions_() {
        return this.#tabSuggestions__accessor_storage
    }
    set tabSuggestions_(value) {
        this.#tabSuggestions__accessor_storage = value
    }
    #recentTabInContext__accessor_storage = false;
    get recentTabInContext_() {
        return this.#recentTabInContext__accessor_storage
    }
    set recentTabInContext_(value) {
        this.#recentTabInContext__accessor_storage = value
    }
    hasTabSuggestions_() {
        return this.tabSuggestions_?.length > 0
    }
    get inToolMode_() {
        return this.inDeepSearchMode_ || this.inCreateImageMode_
    }
    get shouldShowRecentTabChip_() {
        return this.showRecentTabChip_ && this.hasTabSuggestions_() && !this.recentTabInContext_ && !this.inToolMode_
    }
    maxFileCount_ = loadTimeData.getInteger("composeboxFileMaxCount");
    maxFileSize_ = loadTimeData.getInteger("composeboxFileMaxSize");
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("files_") || changedPrivateProperties.has(`inCreateImageMode_`)) {
            this.inputsDisabled_ = this.files_.size >= this.maxFileCount_ && (this.maxFileCount_ > 1 || !this.hasImageFiles()) || this.hasImageFiles() && this.inCreateImageMode_;
            this.showFileCarousel_ = this.files_.size > 0;
            this.fire("on-context-files-changed", {
                files: this.files_.size
            })
        }
        if (changedPrivateProperties.has("files_") || changedPrivateProperties.has("tabSuggestions_")) {
            this.recentTabInContext_ = this.computeRecentTabInContext_()
        }
    }
    computeRecentTabInContext_() {
        const recentTab = this.tabSuggestions_?.[0];
        if (!recentTab) {
            return false
        }
        return this.addedTabsIds_.has(recentTab.tabId)
    }
    setContextFiles(files) {
        for (const file of files) {
            if (file.type === "tab") {
                this.addTabContext_(new CustomEvent("addTabContext",{
                    detail: {
                        id: file.tabId,
                        title: file.name,
                        url: file.url
                    }
                }))
            } else {
                this.addFileContext_([file.file], file.objectUrl !== null)
            }
        }
    }
    setInitialMode(mode) {
        switch (mode) {
        case ComposeboxMode.DEEP_SEARCH:
            this.onDeepSearchClick_();
            break;
        case ComposeboxMode.CREATE_IMAGE:
            this.onCreateImageClick_();
            break
        }
    }
    updateFileStatus(token, status, errorType) {
        let errorMessage = null;
        let file = this.files_.get(token);
        if (file) {
            if ([FileUploadStatus$1.kValidationFailed, FileUploadStatus$1.kUploadFailed, FileUploadStatus$1.kUploadExpired].includes(status)) {
                this.files_.delete(token);
                if (file.tabId) {
                    this.addedTabsIds_ = new Set([...this.addedTabsIds_].filter((id => id !== file.tabId)))
                }
                switch (status) {
                case FileUploadStatus$1.kValidationFailed:
                    errorMessage = this.i18n(FILE_VALIDATION_ERRORS_MAP.get(errorType) ?? "composeboxFileUploadValidationFailed");
                    break;
                case FileUploadStatus$1.kUploadFailed:
                    errorMessage = this.i18n("composeboxFileUploadFailed");
                    break;
                case FileUploadStatus$1.kUploadExpired:
                    errorMessage = this.i18n("composeboxFileUploadExpired");
                    break
                }
            } else {
                file = {
                    ...file,
                    status: status
                };
                this.files_.set(token, file)
            }
            this.files_ = new Map([...this.files_])
        }
        return {
            file: file,
            errorMessage: errorMessage
        }
    }
    resetContextFiles() {
        this.files_ = new Map;
        this.addedTabsIds_ = new Set
    }
    resetModes() {
        if (this.inDeepSearchMode_) {
            this.inDeepSearchMode_ = false;
            this.inputsDisabled_ = false;
            this.fire("set-deep-search-mode", {
                inDeepSearchMode: this.inDeepSearchMode_
            });
            this.showContextMenuDescription_ = true
        } else if (this.inCreateImageMode_) {
            this.inCreateImageMode_ = false;
            this.fire("set-create-image-mode", {
                inCreateImageMode: this.inCreateImageMode_,
                imagePresent: this.hasImageFiles()
            });
            this.showContextMenuDescription_ = true
        }
    }
    hasImageFiles() {
        if (this.files_) {
            for (const file of this.files_.values()) {
                if (file.type.includes("image")) {
                    return true
                }
            }
        }
        return false
    }
    onDeleteFile_(e) {
        if (!e.detail.uuid || !this.files_.has(e.detail.uuid)) {
            return
        }
        const file = this.files_.get(e.detail.uuid);
        if (file?.tabId) {
            this.addedTabsIds_ = new Set([...this.addedTabsIds_].filter((id => id !== file.tabId)))
        }
        this.files_ = new Map([...this.files_.entries()].filter(( ([uuid,_]) => uuid !== e.detail.uuid)));
        this.fire("delete-context", {
            uuid: e.detail.uuid
        })
    }
    onFileChange_(e) {
        const input = e.target;
        const files = input.files;
        if (!files || files.length === 0 || this.files_.size >= this.maxFileCount_) {
            this.recordFileValidationMetric_(1);
            return
        }
        const filesToUpload = [];
        for (const file of files) {
            if (file.size === 0 || file.size > this.maxFileSize_) {
                const fileIsEmpty = file.size === 0;
                input.value = "";
                fileIsEmpty ? this.recordFileValidationMetric_(2) : this.recordFileValidationMetric_(3);
                this.fire("on-file-validation-error", {
                    errorMessage: fileIsEmpty ? this.i18n("composeboxFileUploadInvalidEmptySize") : this.i18n("composeboxFileUploadInvalidTooLarge")
                });
                return
            }
            if (!file.type.includes("pdf") && !file.type.includes("image")) {
                return
            }
            filesToUpload.push(file)
        }
        this.addFileContext_(filesToUpload, input === this.$.imageInput);
        input.value = ""
    }
    addFileContext_(filesToUpload, isImage) {
        this.fire("add-file-context", {
            files: filesToUpload,
            isImage: isImage,
            onContextAdded: files => {
                this.files_ = new Map([...this.files_.entries(), ...files.entries()]);
                this.recordFileValidationMetric_(0)
            }
        })
    }
    addTabContext_(e) {
        e.stopPropagation();
        this.fire("add-tab-context", {
            id: e.detail.id,
            title: e.detail.title,
            url: e.detail.url,
            onContextAdded: file => {
                this.files_ = new Map([...this.files_.entries(), [file.uuid, file]]);
                this.addedTabsIds_ = new Set([...this.addedTabsIds_, e.detail.id])
            }
        })
    }
    openImageUpload_() {
        this.$.imageInput.click()
    }
    openFileUpload_() {
        this.$.fileInput.click()
    }
    onDeepSearchClick_() {
        if (this.entrypointName !== "Realbox") {
            this.showContextMenuDescription_ = !this.showContextMenuDescription_;
            this.inputsDisabled_ = !this.inputsDisabled_;
            this.inDeepSearchMode_ = !this.inDeepSearchMode_
        }
        this.fire("set-deep-search-mode", {
            inDeepSearchMode: this.inDeepSearchMode_
        })
    }
    onCreateImageClick_() {
        if (this.entrypointName !== "Realbox") {
            this.showContextMenuDescription_ = !this.showContextMenuDescription_;
            this.inCreateImageMode_ = !this.inCreateImageMode_;
            if (this.hasImageFiles()) {
                this.inputsDisabled_ = !this.inputsDisabled_
            }
        }
        this.fire("set-create-image-mode", {
            inCreateImageMode: this.inCreateImageMode_,
            imagePresent: this.hasImageFiles()
        })
    }
    recordFileValidationMetric_(enumValue) {
        chrome.metricsPrivate.recordEnumerationValue("NewTabPage.Composebox.File.WebUI.UploadAttemptFailure", enumValue, 3 + 1)
    }
}
customElements.define(ContextualEntrypointAndCarouselElement.is, ContextualEntrypointAndCarouselElement);
function emptyHTML() {
    return window.trustedTypes ? window.trustedTypes.emptyHTML : ""
}
class CustomElement extends HTMLElement {
    static get template() {
        return emptyHTML()
    }
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        const template = document.createElement("template");
        template.innerHTML = this.constructor.template || emptyHTML();
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
    $(query) {
        return this.shadowRoot.querySelector(query)
    }
    $all(query) {
        return this.shadowRoot.querySelectorAll(query)
    }
    getRequiredElement(query) {
        const el = this.shadowRoot.querySelector(query);
        assert(el);
        assert(el instanceof HTMLElement);
        return el
    }
}
function getTemplate() {
    return getTrustedHTML`<!--_html_template_start_--><style>:host{clip:rect(0 0 0 0);height:1px;overflow:hidden;position:fixed;width:1px}</style>

<div id="messages" role="alert" aria-live="polite" aria-relevant="additions">
</div>
<!--_html_template_end_-->`
}
const TIMEOUT_MS = 150;
const instances = new Map;
function getInstance(container=document.body) {
    if (instances.has(container)) {
        return instances.get(container)
    }
    assert(container.isConnected);
    const instance = new CrA11yAnnouncerElement;
    container.appendChild(instance);
    instances.set(container, instance);
    return instance
}
class CrA11yAnnouncerElement extends CustomElement {
    static get is() {
        return "cr-a11y-announcer"
    }
    static get template() {
        return getTemplate()
    }
    currentTimeout_ = null;
    messages_ = [];
    disconnectedCallback() {
        if (this.currentTimeout_ !== null) {
            clearTimeout(this.currentTimeout_);
            this.currentTimeout_ = null
        }
        for (const [parent,instance] of instances) {
            if (instance === this) {
                instances.delete(parent);
                break
            }
        }
    }
    announce(message, timeout=TIMEOUT_MS) {
        if (this.currentTimeout_ !== null) {
            clearTimeout(this.currentTimeout_);
            this.currentTimeout_ = null
        }
        this.messages_.push(message);
        this.currentTimeout_ = setTimeout(( () => {
            const messagesDiv = this.shadowRoot.querySelector("#messages");
            messagesDiv.innerHTML = window.trustedTypes.emptyHTML;
            for (const message of this.messages_) {
                const div = document.createElement("div");
                div.textContent = message;
                messagesDiv.appendChild(div)
            }
            this.dispatchEvent(new CustomEvent("cr-a11y-announcer-messages-sent",{
                bubbles: true,
                detail: {
                    messages: this.messages_.slice()
                }
            }));
            this.messages_.length = 0;
            this.currentTimeout_ = null
        }
        ), timeout)
    }
}
customElements.define(CrA11yAnnouncerElement.is, CrA11yAnnouncerElement);
let instance$i = null;
function getCss$d() {
    return instance$i || (instance$i = [...[], css`#errorScrim{align-items:center;background-color:var(--color-new-tab-page-composebox-error-scrim-background);border-radius:inherit;color:var(--color-new-tab-page-composebox-error-scrim-foreground);display:flex;flex-direction:column;font-size:13px;font-weight:500;gap:18px;justify-content:center;height:100%;position:absolute;width:100%;z-index:101}:host([compact-mode]) #errorScrim{flex-direction:row;justify-content:space-between}#errorScrim>p{margin:0}:host([compact-mode]) #errorScrim>p{margin:24px}#dismissErrorButton{--cr-button-background-color:var(--color-new-tab-page-composebox-error-scrim-button-background);--cr-button-border-color:var(--color-new-tab-page-composebox-error-scrim-foreground);--cr-button-text-color:var(--color-new-tab-page-composebox-error-scrim-button-text);--cr-icon-button-hover-background-color:var(--color-new-tab-page-composebox-error-scrim-button-background-hover);border:none;font-size:13px;gap:4px;height:36px;width:79px}:host([compact-mode]) #dismissErrorButton{margin-right:10px}`])
}
function getHtml$b() {
    return html`<!--_html_template_start_-->
  ${this.showErrorScrim_ ? html`
    <div id="errorScrim">
      <p>${this.errorMessage_}</p>
      <cr-button id="dismissErrorButton"
          @click="${this.onDismissErrorButtonClick_}">
        <cr-icon icon="cr:close" slot="prefix-icon"></cr-icon>
        <div>${this.i18n("dismissButton")}</div>
      </cr-button>
    </div>
  ` : ""}
<!--_html_template_end_-->`
}
class ErrorScrimElement extends (I18nMixinLit(CrLitElement)) {
    static get is() {
        return "ntp-error-scrim"
    }
    static get styles() {
        return getCss$d()
    }
    render() {
        return getHtml$b.bind(this)()
    }
    static get properties() {
        return {
            compactMode: {
                type: Boolean
            },
            showErrorScrim_: {
                reflect: true,
                type: Boolean
            },
            errorMessage_: {
                type: String
            }
        }
    }
    #compactMode_accessor_storage = false;
    get compactMode() {
        return this.#compactMode_accessor_storage
    }
    set compactMode(value) {
        this.#compactMode_accessor_storage = value
    }
    #showErrorScrim__accessor_storage = false;
    get showErrorScrim_() {
        return this.#showErrorScrim__accessor_storage
    }
    set showErrorScrim_(value) {
        this.#showErrorScrim__accessor_storage = value
    }
    #errorMessage__accessor_storage = "";
    get errorMessage_() {
        return this.#errorMessage__accessor_storage
    }
    set errorMessage_(value) {
        this.#errorMessage__accessor_storage = value
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("showErrorScrim_")) {
            if (this.showErrorScrim_) {
                const announcer = getInstance();
                announcer.announce(this.errorMessage_);
                const dismissErrorButton = this.shadowRoot.querySelector("#dismissErrorButton");
                if (dismissErrorButton) {
                    dismissErrorButton.focus()
                }
            }
            this.fire("error-scrim-visibility-changed", {
                showErrorScrim: this.showErrorScrim_
            })
        }
    }
    setErrorMessage(errorMessage) {
        this.errorMessage_ = errorMessage;
        this.showErrorScrim_ = true
    }
    onDismissErrorButtonClick_() {
        this.errorMessage_ = "";
        this.showErrorScrim_ = false
    }
}
customElements.define(ErrorScrimElement.is, ErrorScrimElement);
const CommandSpec = {
    $: mojo.internal.Enum()
};
var Command;
(function(Command) {
    Command[Command["MIN_VALUE"] = 0] = "MIN_VALUE";
    Command[Command["MAX_VALUE"] = 19] = "MAX_VALUE";
    Command[Command["kUnknownCommand"] = 0] = "kUnknownCommand";
    Command[Command["kOpenSafetyCheck"] = 1] = "kOpenSafetyCheck";
    Command[Command["kOpenSafeBrowsingEnhancedProtectionSettings"] = 2] = "kOpenSafeBrowsingEnhancedProtectionSettings";
    Command[Command["kOpenFeedbackForm"] = 3] = "kOpenFeedbackForm";
    Command[Command["kOpenPrivacyGuide"] = 4] = "kOpenPrivacyGuide";
    Command[Command["kStartTabGroupTutorial"] = 5] = "kStartTabGroupTutorial";
    Command[Command["kOpenPasswordManager"] = 6] = "kOpenPasswordManager";
    Command[Command["kNoOpCommand"] = 7] = "kNoOpCommand";
    Command[Command["kOpenPerformanceSettings"] = 8] = "kOpenPerformanceSettings";
    Command[Command["kOpenNTPAndStartCustomizeChromeTutorial"] = 9] = "kOpenNTPAndStartCustomizeChromeTutorial";
    Command[Command["kStartPasswordManagerTutorial"] = 10] = "kStartPasswordManagerTutorial";
    Command[Command["kStartSavedTabGroupTutorial"] = 11] = "kStartSavedTabGroupTutorial";
    Command[Command["kOpenAISettings"] = 12] = "kOpenAISettings";
    Command[Command["kOpenSafetyCheckFromWhatsNew"] = 13] = "kOpenSafetyCheckFromWhatsNew";
    Command[Command["kOpenPaymentsSettings"] = 14] = "kOpenPaymentsSettings";
    Command[Command["kOpenGlic"] = 16] = "kOpenGlic";
    Command[Command["kOpenGlicSettings"] = 17] = "kOpenGlicSettings";
    Command[Command["kPrewarmGlicFre"] = 18] = "kPrewarmGlicFre";
    Command[Command["kOpenSplitView"] = 19] = "kOpenSplitView"
}
)(Command || (Command = {}));
class CommandHandlerFactoryPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "browser_command.mojom.CommandHandlerFactory", scope)
    }
}
class CommandHandlerFactoryRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(CommandHandlerFactoryPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    createBrowserCommandHandler(handler) {
        this.proxy.sendMessage(0, CommandHandlerFactory_CreateBrowserCommandHandler_ParamsSpec.$, null, [handler], false)
    }
}
class CommandHandlerFactory {
    static get $interfaceName() {
        return "browser_command.mojom.CommandHandlerFactory"
    }
    static getRemote() {
        let remote = new CommandHandlerFactoryRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}
class CommandHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "browser_command.mojom.CommandHandler", scope)
    }
}
class CommandHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(CommandHandlerPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    canExecuteCommand(commandId) {
        return this.proxy.sendMessage(0, CommandHandler_CanExecuteCommand_ParamsSpec.$, CommandHandler_CanExecuteCommand_ResponseParamsSpec.$, [commandId], false)
    }
    executeCommand(commandId, clickInfo) {
        return this.proxy.sendMessage(1, CommandHandler_ExecuteCommand_ParamsSpec.$, CommandHandler_ExecuteCommand_ResponseParamsSpec.$, [commandId, clickInfo], false)
    }
}
const ClickInfoSpec = {
    $: {}
};
const CommandHandlerFactory_CreateBrowserCommandHandler_ParamsSpec = {
    $: {}
};
const CommandHandler_CanExecuteCommand_ParamsSpec = {
    $: {}
};
const CommandHandler_CanExecuteCommand_ResponseParamsSpec = {
    $: {}
};
const CommandHandler_ExecuteCommand_ParamsSpec = {
    $: {}
};
const CommandHandler_ExecuteCommand_ResponseParamsSpec = {
    $: {}
};
mojo.internal.Struct(ClickInfoSpec.$, "ClickInfo", [mojo.internal.StructField("middleButton", 0, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("altKey", 0, 1, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("ctrlKey", 0, 2, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("metaKey", 0, 3, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("shiftKey", 0, 4, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(CommandHandlerFactory_CreateBrowserCommandHandler_ParamsSpec.$, "CommandHandlerFactory_CreateBrowserCommandHandler_Params", [mojo.internal.StructField("handler", 0, 0, mojo.internal.InterfaceRequest(CommandHandlerPendingReceiver), null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(CommandHandler_CanExecuteCommand_ParamsSpec.$, "CommandHandler_CanExecuteCommand_Params", [mojo.internal.StructField("commandId", 0, 0, CommandSpec.$, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(CommandHandler_CanExecuteCommand_ResponseParamsSpec.$, "CommandHandler_CanExecuteCommand_ResponseParams", [mojo.internal.StructField("canExecute", 0, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(CommandHandler_ExecuteCommand_ParamsSpec.$, "CommandHandler_ExecuteCommand_Params", [mojo.internal.StructField("commandId", 0, 0, CommandSpec.$, 0, false, 0, undefined, undefined), mojo.internal.StructField("clickInfo", 8, 0, ClickInfoSpec.$, null, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(CommandHandler_ExecuteCommand_ResponseParamsSpec.$, "CommandHandler_ExecuteCommand_ResponseParams", [mojo.internal.StructField("commandExecuted", 0, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 16]]);
let instance$h = null;
class BrowserCommandProxy {
    static getInstance() {
        return instance$h || (instance$h = new BrowserCommandProxy)
    }
    static setInstance(newInstance) {
        instance$h = newInstance
    }
    handler;
    constructor() {
        this.handler = new CommandHandlerRemote;
        const factory = CommandHandlerFactory.getRemote();
        factory.createBrowserCommandHandler(this.handler.$.bindNewPipeAndPassReceiver())
    }
}
let instance$g = null;
function getCss$c() {
    return instance$g || (instance$g = [...[getCss$m(), getCss$n()], css`p{color:blue}`])
}
function getHtml$a() {
    return html`<!--_html_template_start_--><p>Action Chips</p><!--_html_template_end_-->`
}
class ActionChipsElement extends CrLitElement {
    static get is() {
        return "ntp-action-chips"
    }
    static get styles() {
        return getCss$c()
    }
    render() {
        return getHtml$a.bind(this)()
    }
    static get properties() {
        return {}
    }
}
customElements.define(ActionChipsElement.is, ActionChipsElement);
let instance$f = null;
class WindowProxy {
    static getInstance() {
        return instance$f || (instance$f = new WindowProxy)
    }
    static setInstance(newInstance) {
        instance$f = newInstance
    }
    navigate(href) {
        window.location.href = href
    }
    open(url) {
        window.open(url, "_blank")
    }
    setTimeout(callback, duration) {
        return window.setTimeout(callback, duration)
    }
    clearTimeout(id) {
        window.clearTimeout(id !== null ? id : undefined)
    }
    random() {
        return Math.random()
    }
    createIframeSrc(src) {
        return src
    }
    matchMedia(query) {
        return window.matchMedia(query)
    }
    now() {
        return Date.now()
    }
    waitForLazyRender() {
        return new Promise((resolve => {
            requestIdleCallback(( () => resolve()), {
                timeout: 500
            })
        }
        ))
    }
    postMessage(iframe, message, targetOrigin) {
        iframe.contentWindow.postMessage(message, targetOrigin)
    }
    get url() {
        return new URL(window.location.href)
    }
    get onLine() {
        return window.navigator.onLine
    }
}
let instance$e = null;
function getCss$b() {
    return instance$e || (instance$e = [...[], css`.cr-scrollable{anchor-name:--cr-scrollable;anchor-scope:--cr-scrollable;container-type:scroll-state;overflow:auto}.cr-scrollable-top,.cr-scrollable-top-shadow,.cr-scrollable-bottom{display:none;position:fixed;position-anchor:--cr-scrollable;left:anchor(left);width:anchor-size(width);pointer-events:none;&:where(.force-on){display:block}}.cr-scrollable-top{top:anchor(top);border-top:1px solid var(--cr-scrollable-border-color);@container scroll-state(scrollable:top){display:block}}.cr-scrollable-bottom{bottom:anchor(bottom);border-bottom:1px solid var(--cr-scrollable-border-color);@container scroll-state(scrollable:bottom){display:block}}.cr-scrollable-top-shadow{box-shadow:inset 0 5px 6px -3px rgba(0,0,0,.4);display:block;height:8px;opacity:0;top:anchor(top);transition:opacity 500ms;z-index:1;&:where(.force-on){opacity:1}@container scroll-state(scrollable:top){opacity:1}}`])
}
let instance$d = null;
function getCss$a() {
    return instance$d || (instance$d = [...[getCss$r(), getCss$n(), getCss$b()], css`dialog{background-color:var(--cr-dialog-background-color,white);border:0;border-radius:var(--cr-dialog-border-radius,8px);bottom:50%;box-shadow:0 0 16px rgba(0,0,0,0.12),0 16px 16px rgba(0,0,0,0.24);color:inherit;line-height:20px;max-height:initial;max-width:initial;overflow-y:hidden;padding:0;position:absolute;top:50%;width:var(--cr-dialog-width,512px)}@media (prefers-color-scheme:dark){dialog{background-color:var(--cr-dialog-background-color,var(--google-grey-900));background-image:linear-gradient(rgba(255,255,255,.04),rgba(255,255,255,.04))}}@media (forced-colors:active){dialog{border:var(--cr-border-hcm)}}dialog[open] #content-wrapper{display:flex;flex-direction:column;max-height:100vh;overflow:auto}.top-container,:host ::slotted([slot=button-container]),:host ::slotted([slot=footer]){flex-shrink:0}dialog::backdrop{background-color:rgba(0,0,0,0.6);bottom:0;left:0;position:fixed;right:0;top:0}:host ::slotted([slot=body]){color:var(--cr-secondary-text-color);padding:0 var(--cr-dialog-body-padding-horizontal,20px)}:host ::slotted([slot=title]){color:var(--cr-primary-text-color);flex:1;font-family:var(--cr-dialog-font-family,inherit);font-size:var(--cr-dialog-title-font-size,calc(15 / 13 * 100%));line-height:1;padding-bottom:var(--cr-dialog-title-slot-padding-bottom,16px);padding-inline-end:var(--cr-dialog-title-slot-padding-end,20px);padding-inline-start:var(--cr-dialog-title-slot-padding-start,20px);padding-top:var(--cr-dialog-title-slot-padding-top,20px)}:host ::slotted([slot=button-container]){display:flex;justify-content:flex-end;padding-bottom:var(--cr-dialog-button-container-padding-bottom,16px);padding-inline-end:var(--cr-dialog-button-container-padding-horizontal,16px);padding-inline-start:var(--cr-dialog-button-container-padding-horizontal,16px);padding-top:var(--cr-dialog-button-container-padding-top,16px)}:host ::slotted([slot=footer]){border-bottom-left-radius:inherit;border-bottom-right-radius:inherit;border-top:1px solid #dbdbdb;margin:0;padding:16px 20px}:host([hide-backdrop]) dialog::backdrop{opacity:0}@media (prefers-color-scheme:dark){:host ::slotted([slot=footer]){border-top-color:var(--cr-separator-color)}}.body-container{box-sizing:border-box;display:flex;flex-direction:column;min-height:1.375rem;overflow:auto}.top-container{align-items:flex-start;display:flex;min-height:var(--cr-dialog-top-container-min-height,31px)}.title-container{display:flex;flex:1;font-size:inherit;font-weight:inherit;margin:0;outline:none}#close{align-self:flex-start;margin-inline-end:4px;margin-top:4px}@container style(--cr-dialog-body-border-top){.cr-scrollable-top{display:block;border-top:var(--cr-dialog-body-border-top)}}`])
}
function getHtml$9() {
    return html`
<dialog id="dialog" @close="${this.onNativeDialogClose_}"
    @cancel="${this.onNativeDialogCancel_}" part="dialog"
    aria-labelledby="title"
    aria-description="${this.ariaDescriptionText || nothing}">
<!-- This wrapper is necessary, such that the "pulse" animation is not
    erroneously played when the user clicks on the outer-most scrollbar. -->
  <div id="content-wrapper" part="wrapper">
    <div class="top-container">
      <h2 id="title" class="title-container" tabindex="-1">
        <slot name="title"></slot>
      </h2>
      ${this.showCloseButton ? html`
        <cr-icon-button id="close" class="icon-clear"
            aria-label="${this.closeText || nothing}"
            title="${this.closeText || nothing}"
            @click="${this.cancel}" @keypress="${this.onCloseKeypress_}">
        </cr-icon-button>
       ` : ""}
    </div>
    <slot name="header"></slot>
    <div class="body-container cr-scrollable" id="container"
        part="body-container">
      <div class="cr-scrollable-top"></div>
      <slot name="body"></slot>
      <div class="cr-scrollable-bottom"></div>
    </div>
    <slot name="button-container"></slot>
    <slot name="footer"></slot>
  </div>
</dialog>`
}
class CrDialogElement extends CrLitElement {
    static get is() {
        return "cr-dialog"
    }
    static get styles() {
        return getCss$a()
    }
    render() {
        return getHtml$9.bind(this)()
    }
    static get properties() {
        return {
            open: {
                type: Boolean,
                reflect: true
            },
            closeText: {
                type: String
            },
            ignorePopstate: {
                type: Boolean
            },
            ignoreEnterKey: {
                type: Boolean
            },
            consumeKeydownEvent: {
                type: Boolean
            },
            noCancel: {
                type: Boolean
            },
            showCloseButton: {
                type: Boolean
            },
            showOnAttach: {
                type: Boolean
            },
            ariaDescriptionText: {
                type: String
            }
        }
    }
    #closeText_accessor_storage;
    get closeText() {
        return this.#closeText_accessor_storage
    }
    set closeText(value) {
        this.#closeText_accessor_storage = value
    }
    #consumeKeydownEvent_accessor_storage = false;
    get consumeKeydownEvent() {
        return this.#consumeKeydownEvent_accessor_storage
    }
    set consumeKeydownEvent(value) {
        this.#consumeKeydownEvent_accessor_storage = value
    }
    #ignoreEnterKey_accessor_storage = false;
    get ignoreEnterKey() {
        return this.#ignoreEnterKey_accessor_storage
    }
    set ignoreEnterKey(value) {
        this.#ignoreEnterKey_accessor_storage = value
    }
    #ignorePopstate_accessor_storage = false;
    get ignorePopstate() {
        return this.#ignorePopstate_accessor_storage
    }
    set ignorePopstate(value) {
        this.#ignorePopstate_accessor_storage = value
    }
    #noCancel_accessor_storage = false;
    get noCancel() {
        return this.#noCancel_accessor_storage
    }
    set noCancel(value) {
        this.#noCancel_accessor_storage = value
    }
    #open_accessor_storage = false;
    get open() {
        return this.#open_accessor_storage
    }
    set open(value) {
        this.#open_accessor_storage = value
    }
    #showCloseButton_accessor_storage = false;
    get showCloseButton() {
        return this.#showCloseButton_accessor_storage
    }
    set showCloseButton(value) {
        this.#showCloseButton_accessor_storage = value
    }
    #showOnAttach_accessor_storage = false;
    get showOnAttach() {
        return this.#showOnAttach_accessor_storage
    }
    set showOnAttach(value) {
        this.#showOnAttach_accessor_storage = value
    }
    #ariaDescriptionText_accessor_storage;
    get ariaDescriptionText() {
        return this.#ariaDescriptionText_accessor_storage
    }
    set ariaDescriptionText(value) {
        this.#ariaDescriptionText_accessor_storage = value
    }
    mutationObserver_ = null;
    boundKeydown_ = null;
    firstUpdated() {
        window.addEventListener("popstate", ( () => {
            if (!this.ignorePopstate && this.$.dialog.open) {
                this.cancel()
            }
        }
        ));
        if (!this.ignoreEnterKey) {
            this.addEventListener("keypress", this.onKeypress_.bind(this))
        }
        this.addEventListener("pointerdown", (e => this.onPointerdown_(e)))
    }
    connectedCallback() {
        super.connectedCallback();
        const mutationObserverCallback = () => {
            if (this.$.dialog.open) {
                this.addKeydownListener_()
            } else {
                this.removeKeydownListener_()
            }
        }
        ;
        this.mutationObserver_ = new MutationObserver(mutationObserverCallback);
        this.mutationObserver_.observe(this.$.dialog, {
            attributes: true,
            attributeFilter: ["open"]
        });
        mutationObserverCallback();
        if (this.showOnAttach) {
            this.showModal()
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeKeydownListener_();
        if (this.mutationObserver_) {
            this.mutationObserver_.disconnect();
            this.mutationObserver_ = null
        }
    }
    addKeydownListener_() {
        if (!this.consumeKeydownEvent) {
            return
        }
        this.boundKeydown_ = this.boundKeydown_ || this.onKeydown_.bind(this);
        this.addEventListener("keydown", this.boundKeydown_);
        document.body.addEventListener("keydown", this.boundKeydown_)
    }
    removeKeydownListener_() {
        if (!this.boundKeydown_) {
            return
        }
        this.removeEventListener("keydown", this.boundKeydown_);
        document.body.removeEventListener("keydown", this.boundKeydown_);
        this.boundKeydown_ = null
    }
    async showModal() {
        if (this.showOnAttach) {
            const element = this.querySelector("[autofocus]");
            if (element && element instanceof CrLitElement && !element.shadowRoot) {
                element.ensureInitialRender()
            }
        }
        this.$.dialog.showModal();
        assert(this.$.dialog.open);
        this.open = true;
        await this.updateComplete;
        this.fire("cr-dialog-open")
    }
    cancel() {
        this.fire("cancel");
        this.$.dialog.close();
        assert(!this.$.dialog.open);
        this.open = false
    }
    close() {
        this.$.dialog.close("success");
        assert(!this.$.dialog.open);
        this.open = false
    }
    setTitleAriaLabel(title) {
        this.$.dialog.removeAttribute("aria-labelledby");
        this.$.dialog.setAttribute("aria-label", title)
    }
    onCloseKeypress_(e) {
        e.stopPropagation()
    }
    onNativeDialogClose_(e) {
        if (e.target !== this.getNative()) {
            return
        }
        this.fire("close")
    }
    async onNativeDialogCancel_(e) {
        if (e.target !== this.getNative()) {
            return
        }
        if (this.noCancel) {
            e.preventDefault();
            return
        }
        this.open = false;
        await this.updateComplete;
        this.fire("cancel")
    }
    getNative() {
        return this.$.dialog
    }
    onKeypress_(e) {
        if (e.key !== "Enter") {
            return
        }
        const accept = e.target === this || e.composedPath().some((el => el.tagName === "CR-INPUT" && el.type !== "search"));
        if (!accept) {
            return
        }
        const actionButton = this.querySelector(".action-button:not([disabled]):not([hidden])");
        if (actionButton) {
            actionButton.click();
            e.preventDefault()
        }
    }
    onKeydown_(e) {
        assert(this.consumeKeydownEvent);
        if (!this.getNative().open) {
            return
        }
        if (this.ignoreEnterKey && e.key === "Enter") {
            return
        }
        e.stopPropagation()
    }
    onPointerdown_(e) {
        if (e.button !== 0 || e.composedPath()[0].tagName !== "DIALOG") {
            return
        }
        this.$.dialog.animate([{
            transform: "scale(1)",
            offset: 0
        }, {
            transform: "scale(1.02)",
            offset: .4
        }, {
            transform: "scale(1.02)",
            offset: .6
        }, {
            transform: "scale(1)",
            offset: 1
        }], {
            duration: 180,
            easing: "ease-in-out",
            iterations: 1
        });
        e.preventDefault()
    }
    focus() {
        const titleContainer = this.shadowRoot.querySelector(".title-container");
        assert(titleContainer);
        titleContainer.focus()
    }
}
customElements.define(CrDialogElement.is, CrDialogElement);
let instance$c = null;
function getCss$9() {
    return instance$c || (instance$c = [...[], css`:host{--cr-input-background-color:var(--color-textfield-filled-background,var(--cr-fallback-color-surface-variant));--cr-input-border-bottom:1px solid var(--color-textfield-filled-underline,var(--cr-fallback-color-outline));--cr-input-border-radius:8px 8px 0 0;--cr-input-color:var(--cr-primary-text-color);--cr-input-error-color:var(--color-textfield-filled-error,var(--cr-fallback-color-error));--cr-input-focus-color:var(--color-textfield-filled-underline-focused,var(--cr-fallback-color-primary));--cr-input-hover-background-color:var(--cr-hover-background-color);--cr-input-label-color:var(--color-textfield-foreground-label,var(--cr-fallback-color-on-surface-subtle));--cr-input-padding-bottom:10px;--cr-input-padding-end:10px;--cr-input-padding-start:10px;--cr-input-padding-top:10px;--cr-input-placeholder-color:var(--color-textfield-foreground-placeholder,var(--cr-fallback-on-surface-subtle));display:block;isolation:isolate;outline:none}:host([readonly]){--cr-input-border-radius:8px 8px}#label{color:var(--cr-input-label-color);font-size:11px;line-height:16px}:host([focused_]:not([readonly]):not([invalid])) #label{color:var(--cr-input-focus-label-color,var(--cr-input-label-color))}#input-container{border-radius:var(--cr-input-border-radius,4px);overflow:hidden;position:relative;width:var(--cr-input-width,100%)}:host([focused_]) #input-container{outline:var(--cr-input-focus-outline,none)}#inner-input-container{background-color:var(--cr-input-background-color);box-sizing:border-box;padding:0}#inner-input-content ::slotted(*){--cr-icon-button-fill-color:var(--color-textfield-foreground-icon,var(--cr-fallback-color-on-surface-subtle));--cr-icon-button-icon-size:16px;--cr-icon-button-size:24px;--cr-icon-button-margin-start:0;--cr-icon-color:var(--color-textfield-foreground-icon,var(--cr-fallback-color-on-surface-subtle))}#inner-input-content ::slotted([slot='inline-prefix']){--cr-icon-button-margin-start:-8px}#inner-input-content ::slotted([slot='inline-suffix']){--cr-icon-button-margin-end:-4px}:host([invalid]) #inner-input-content ::slotted(*){--cr-icon-color:var(--cr-input-error-color);--cr-icon-button-fill-color:var(--cr-input-error-color)}#hover-layer{background-color:var(--cr-input-hover-background-color);display:none;inset:0;pointer-events:none;position:absolute;z-index:0}:host(:not([readonly]):not([disabled])) #input-container:hover #hover-layer{display:block}#input{-webkit-appearance:none;background-color:transparent;border:none;box-sizing:border-box;caret-color:var(--cr-input-focus-color);color:var(--cr-input-color);font-family:inherit;font-size:var(--cr-input-font-size,12px);font-weight:inherit;line-height:16px;min-height:var(--cr-input-min-height,auto);outline:none;padding:0;text-align:inherit;text-overflow:ellipsis;width:100%}#inner-input-content{padding-bottom:var(--cr-input-padding-bottom);padding-inline-end:var(--cr-input-padding-end);padding-inline-start:var(--cr-input-padding-start);padding-top:var(--cr-input-padding-top)}#underline{border-bottom:2px solid var(--cr-input-focus-color);border-radius:var(--cr-input-underline-border-radius,0);bottom:0;box-sizing:border-box;display:var(--cr-input-underline-display);height:var(--cr-input-underline-height,0);left:0;margin:auto;opacity:0;position:absolute;right:0;transition:opacity 120ms ease-out,width 0s linear 180ms;width:0}:host([invalid]) #underline,:host([force-underline]) #underline,:host([focused_]) #underline{opacity:1;transition:opacity 120ms ease-in,width 180ms ease-out;width:100%}#underline-base{display:none}:host([readonly]) #underline{display:none}:host(:not([readonly])) #underline-base{border-bottom:var(--cr-input-border-bottom);bottom:0;display:block;left:0;position:absolute;right:0}:host([disabled]){color:var(--color-textfield-foreground-disabled,var(--cr-fallback-color-disabled-foreground));--cr-input-border-bottom:1px solid currentColor;--cr-input-placeholder-color:currentColor;--cr-input-color:currentColor;--cr-input-background-color:var(--color-textfield-background-disabled,var(--cr-fallback-color-disabled-background))}:host([disabled]) #inner-input-content ::slotted(*){--cr-icon-color:currentColor;--cr-icon-button-fill-color:currentColor}:host(.stroked){--cr-input-background-color:transparent;--cr-input-border:1px solid var(--color-side-panel-textfield-border,var(--cr-fallback-color-neutral-outline));--cr-input-border-bottom:none;--cr-input-border-radius:8px;--cr-input-padding-bottom:9px;--cr-input-padding-end:9px;--cr-input-padding-start:9px;--cr-input-padding-top:9px;--cr-input-underline-display:none;--cr-input-min-height:36px;line-height:16px}:host(.stroked[focused_]){--cr-input-border:2px solid var(--cr-focus-outline-color);--cr-input-padding-bottom:8px;--cr-input-padding-end:8px;--cr-input-padding-start:8px;--cr-input-padding-top:8px}:host(.stroked[invalid]){--cr-input-border:1px solid var(--cr-input-error-color)}:host(.stroked[focused_][invalid]){--cr-input-border:2px solid var(--cr-input-error-color)}`])
}
let instance$b = null;
function getCss$8() {
    return instance$b || (instance$b = [...[getCss$r(), getCss$9(), getCss$m()], css`:host([disabled]) :-webkit-any(#label,#error,#input-container){opacity:var(--cr-disabled-opacity);pointer-events:none}:host([disabled]) :is(#label,#error,#input-container){opacity:1}:host ::slotted(cr-button[slot=suffix]){margin-inline-start:var(--cr-button-edge-spacing) !important}:host([invalid]) #label{color:var(--cr-input-error-color)}#input{border-bottom:none;letter-spacing:var(--cr-input-letter-spacing)}#input-container{border:var(--cr-input-border,none)}#input::placeholder{color:var(--cr-input-placeholder-color,var(--cr-secondary-text-color));letter-spacing:var(--cr-input-placeholder-letter-spacing)}:host([invalid]) #input{caret-color:var(--cr-input-error-color)}:host([readonly]) #input{opacity:var(--cr-input-readonly-opacity,0.6)}:host([invalid]) #underline{border-color:var(--cr-input-error-color)}#error{color:var(--cr-input-error-color);display:var(--cr-input-error-display,block);font-size:11px;min-height:var(--cr-form-field-label-height);line-height:16px;margin:4px 10px;visibility:hidden;white-space:var(--cr-input-error-white-space);height:auto;overflow:hidden;text-overflow:ellipsis}:host([invalid]) #error{visibility:visible}#row-container,#inner-input-content{align-items:center;display:flex;justify-content:space-between;position:relative}#inner-input-content{gap:4px;height:16px;z-index:1}#input[type='search']::-webkit-search-cancel-button{display:none}:host-context([dir=rtl]) #input[type=url]{text-align:right}#input[type=url]{direction:ltr}`])
}
function getHtml$8() {
    return html`
<div id="label" class="cr-form-field-label" ?hidden="${!this.label}"
    aria-hidden="true">
  ${this.label}
</div>
<div id="row-container" part="row-container">
  <div id="input-container">
    <div id="inner-input-container">
      <div id="hover-layer"></div>
      <div id="inner-input-content">
        <slot name="inline-prefix"></slot>
        <input id="input" ?disabled="${this.disabled}"
            ?autofocus="${this.autofocus}"
            .value="${this.internalValue_}" tabindex="${this.inputTabindex}"
            .type="${this.type}"
            ?readonly="${this.readonly}" maxlength="${this.maxlength}"
            pattern="${this.pattern || nothing}" ?required="${this.required}"
            minlength="${this.minlength}" inputmode="${this.inputmode}"
            aria-description="${this.ariaDescription || nothing}"
            aria-errormessage="${this.getAriaErrorMessage_() || nothing}"
            aria-label="${this.getAriaLabel_()}"
            aria-invalid="${this.getAriaInvalid_()}"
            .max="${this.max || nothing}" .min="${this.min || nothing}"
            @focus="${this.onInputFocus_}"
            @blur="${this.onInputBlur_}" @change="${this.onInputChange_}"
            @input="${this.onInput_}"
            part="input"
            autocomplete="off">
        <slot name="inline-suffix"></slot>
      </div>
    </div>
    <div id="underline-base"></div>
    <div id="underline"></div>
  </div>
  <slot name="suffix"></slot>
</div>
<div id="error" role="${this.getErrorRole_() || nothing}"
    aria-live="assertive">${this.getErrorMessage_()}</div>`
}
const SUPPORTED_INPUT_TYPES = new Set(["number", "password", "search", "text", "url"]);
class CrInputElement extends CrLitElement {
    static get is() {
        return "cr-input"
    }
    static get styles() {
        return getCss$8()
    }
    render() {
        return getHtml$8.bind(this)()
    }
    static get properties() {
        return {
            ariaDescription: {
                type: String
            },
            ariaLabel: {
                type: String
            },
            autofocus: {
                type: Boolean,
                reflect: true
            },
            autoValidate: {
                type: Boolean
            },
            disabled: {
                type: Boolean,
                reflect: true
            },
            errorMessage: {
                type: String
            },
            errorRole_: {
                type: String
            },
            focused_: {
                type: Boolean,
                reflect: true
            },
            invalid: {
                type: Boolean,
                notify: true,
                reflect: true
            },
            max: {
                type: Number,
                reflect: true
            },
            min: {
                type: Number,
                reflect: true
            },
            maxlength: {
                type: Number,
                reflect: true
            },
            minlength: {
                type: Number,
                reflect: true
            },
            pattern: {
                type: String,
                reflect: true
            },
            inputmode: {
                type: String
            },
            label: {
                type: String
            },
            placeholder: {
                type: String
            },
            readonly: {
                type: Boolean,
                reflect: true
            },
            required: {
                type: Boolean,
                reflect: true
            },
            inputTabindex: {
                type: Number
            },
            type: {
                type: String
            },
            value: {
                type: String,
                notify: true
            },
            internalValue_: {
                type: String,
                state: true
            }
        }
    }
    #ariaDescription_accessor_storage = null;
    get ariaDescription() {
        return this.#ariaDescription_accessor_storage
    }
    set ariaDescription(value) {
        this.#ariaDescription_accessor_storage = value
    }
    #ariaLabel_accessor_storage = "";
    get ariaLabel() {
        return this.#ariaLabel_accessor_storage
    }
    set ariaLabel(value) {
        this.#ariaLabel_accessor_storage = value
    }
    #autofocus_accessor_storage = false;
    get autofocus() {
        return this.#autofocus_accessor_storage
    }
    set autofocus(value) {
        this.#autofocus_accessor_storage = value
    }
    #autoValidate_accessor_storage = false;
    get autoValidate() {
        return this.#autoValidate_accessor_storage
    }
    set autoValidate(value) {
        this.#autoValidate_accessor_storage = value
    }
    #disabled_accessor_storage = false;
    get disabled() {
        return this.#disabled_accessor_storage
    }
    set disabled(value) {
        this.#disabled_accessor_storage = value
    }
    #errorMessage_accessor_storage = "";
    get errorMessage() {
        return this.#errorMessage_accessor_storage
    }
    set errorMessage(value) {
        this.#errorMessage_accessor_storage = value
    }
    #inputmode_accessor_storage;
    get inputmode() {
        return this.#inputmode_accessor_storage
    }
    set inputmode(value) {
        this.#inputmode_accessor_storage = value
    }
    #inputTabindex_accessor_storage = 0;
    get inputTabindex() {
        return this.#inputTabindex_accessor_storage
    }
    set inputTabindex(value) {
        this.#inputTabindex_accessor_storage = value
    }
    #invalid_accessor_storage = false;
    get invalid() {
        return this.#invalid_accessor_storage
    }
    set invalid(value) {
        this.#invalid_accessor_storage = value
    }
    #label_accessor_storage = "";
    get label() {
        return this.#label_accessor_storage
    }
    set label(value) {
        this.#label_accessor_storage = value
    }
    #max_accessor_storage;
    get max() {
        return this.#max_accessor_storage
    }
    set max(value) {
        this.#max_accessor_storage = value
    }
    #min_accessor_storage;
    get min() {
        return this.#min_accessor_storage
    }
    set min(value) {
        this.#min_accessor_storage = value
    }
    #maxlength_accessor_storage;
    get maxlength() {
        return this.#maxlength_accessor_storage
    }
    set maxlength(value) {
        this.#maxlength_accessor_storage = value
    }
    #minlength_accessor_storage;
    get minlength() {
        return this.#minlength_accessor_storage
    }
    set minlength(value) {
        this.#minlength_accessor_storage = value
    }
    #pattern_accessor_storage;
    get pattern() {
        return this.#pattern_accessor_storage
    }
    set pattern(value) {
        this.#pattern_accessor_storage = value
    }
    #placeholder_accessor_storage = null;
    get placeholder() {
        return this.#placeholder_accessor_storage
    }
    set placeholder(value) {
        this.#placeholder_accessor_storage = value
    }
    #readonly_accessor_storage = false;
    get readonly() {
        return this.#readonly_accessor_storage
    }
    set readonly(value) {
        this.#readonly_accessor_storage = value
    }
    #required_accessor_storage = false;
    get required() {
        return this.#required_accessor_storage
    }
    set required(value) {
        this.#required_accessor_storage = value
    }
    #type_accessor_storage = "text";
    get type() {
        return this.#type_accessor_storage
    }
    set type(value) {
        this.#type_accessor_storage = value
    }
    #value_accessor_storage = "";
    get value() {
        return this.#value_accessor_storage
    }
    set value(value) {
        this.#value_accessor_storage = value
    }
    #internalValue__accessor_storage = "";
    get internalValue_() {
        return this.#internalValue__accessor_storage
    }
    set internalValue_(value) {
        this.#internalValue__accessor_storage = value
    }
    #focused__accessor_storage = false;
    get focused_() {
        return this.#focused__accessor_storage
    }
    set focused_(value) {
        this.#focused__accessor_storage = value
    }
    firstUpdated() {
        assert(!this.hasAttribute("tabindex"))
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("value")) {
            this.internalValue_ = this.value === undefined || this.value === null ? "" : this.value
        }
        if (changedProperties.has("inputTabindex")) {
            assert(this.inputTabindex === 0 || this.inputTabindex === -1)
        }
        if (changedProperties.has("type")) {
            assert(SUPPORTED_INPUT_TYPES.has(this.type))
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("value")) {
            const previous = changedProperties.get("value");
            if ((!!this.value || !!previous) && this.autoValidate) {
                this.invalid = !this.inputElement.checkValidity()
            }
        }
        if (changedProperties.has("placeholder")) {
            if (this.placeholder === null || this.placeholder === undefined) {
                this.inputElement.removeAttribute("placeholder")
            } else {
                this.inputElement.setAttribute("placeholder", this.placeholder)
            }
        }
    }
    get inputElement() {
        return this.$.input
    }
    focus() {
        this.focusInput()
    }
    focusInput() {
        if (this.shadowRoot.activeElement === this.inputElement) {
            return false
        }
        this.inputElement.focus();
        return true
    }
    async onInputChange_(e) {
        await this.updateComplete;
        this.fire("change", {
            sourceEvent: e
        })
    }
    onInput_(e) {
        this.internalValue_ = e.target.value;
        this.value = this.internalValue_
    }
    onInputFocus_() {
        this.focused_ = true
    }
    onInputBlur_() {
        this.focused_ = false
    }
    getAriaLabel_() {
        return this.ariaLabel || this.label || this.placeholder
    }
    getAriaInvalid_() {
        return this.invalid ? "true" : "false"
    }
    getErrorMessage_() {
        return this.invalid ? this.errorMessage : ""
    }
    getErrorRole_() {
        return this.invalid ? "alert" : ""
    }
    getAriaErrorMessage_() {
        return this.invalid ? "error" : ""
    }
    select(start, end) {
        this.inputElement.focus();
        if (start !== undefined && end !== undefined) {
            this.inputElement.setSelectionRange(start, end)
        } else {
            assert(start === undefined && end === undefined);
            this.inputElement.select()
        }
    }
    validate() {
        this.performUpdate();
        this.invalid = !this.inputElement.checkValidity();
        this.performUpdate();
        return !this.invalid
    }
}
customElements.define(CrInputElement.is, CrInputElement);
function skColorToRgba(skColor) {
    const a = skColor.value >> 24 & 255;
    const r = skColor.value >> 16 & 255;
    const g = skColor.value >> 8 & 255;
    const b = skColor.value & 255;
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`
}
function hexColorToSkColor(hexColor) {
    if (!/^#[0-9a-f]{6}$/.test(hexColor)) {
        return {
            value: 0
        }
    }
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return {
        value: 4278190080 + (r << 16) + (g << 8) + b
    }
}
let instance$a = null;
class NewTabPageProxy {
    static getInstance() {
        if (!instance$a) {
            const handler = new PageHandlerRemote$1;
            const callbackRouter = new PageCallbackRouter$1;
            PageHandlerFactory.getRemote().createPageHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver());
            instance$a = new NewTabPageProxy(handler,callbackRouter)
        }
        return instance$a
    }
    static setInstance(handler, callbackRouter) {
        instance$a = new NewTabPageProxy(handler,callbackRouter)
    }
    handler;
    callbackRouter;
    constructor(handler, callbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter
    }
}
let instance$9 = null;
function getCss$7() {
    return instance$9 || (instance$9 = [...[], css`#toolEnabledButton{align-items:center;background-color:var(--color-new-tab-page-composebox-context-entrypoint-hover-background);border:none;color:var(--color-new-tab-page-composebox-upload-button);display:flex;font-size:13px;gap:2px;height:36px;justify-content:center;padding-bottom:6px;padding-inline:8px 12px;padding-top:6px}#toolEnabledButton .icon-container{align-items:center;display:flex;height:24px;justify-content:center;position:relative;width:24px}#toolEnabledButton .tool-icon,#toolEnabledButton .close-icon{height:16px;position:absolute;transition:opacity 150ms;width:16px}#toolEnabledButton .tool-icon{padding-top:3px}#toolEnabledButton .close-icon{opacity:0}#toolEnabledButton:hover .close-icon,#toolEnabledButton:focus .close-icon{opacity:1}#toolEnabledButton:hover .tool-icon,#toolEnabledButton:focus .tool-icon{opacity:0}`])
}
function getHtml$7() {
    return html`
<cr-button id="toolEnabledButton" class="upload-icon no-overlap">
  <div class="icon-container" slot="prefix-icon">
    <cr-icon class="tool-icon" .icon="${this.icon}"></cr-icon>
    <cr-icon class="close-icon" icon="cr:close"></cr-icon>
  </div>
  <div>${this.label}</div>
</cr-button>`
}
class ComposeboxToolChipElement extends CrLitElement {
    static get is() {
        return "composebox-tool-chip"
    }
    static get styles() {
        return getCss$7()
    }
    static get properties() {
        return {
            icon: {
                type: String
            },
            label: {
                type: String
            },
            visible: {
                type: Boolean
            }
        }
    }
    #icon_accessor_storage = "";
    get icon() {
        return this.#icon_accessor_storage
    }
    set icon(value) {
        this.#icon_accessor_storage = value
    }
    #label_accessor_storage = "";
    get label() {
        return this.#label_accessor_storage
    }
    set label(value) {
        this.#label_accessor_storage = value
    }
    #visible_accessor_storage = false;
    get visible() {
        return this.#visible_accessor_storage
    }
    set visible(value) {
        this.#visible_accessor_storage = value
    }
    render() {
        if (!this.visible) {
            return
        }
        return getHtml$7.call(this)
    }
}
customElements.define(ComposeboxToolChipElement.is, ComposeboxToolChipElement);
let instance$8 = null;
function getCss$6() {
    return instance$8 || (instance$8 = [...[getCss$n()], css`:host .button-content{display:flex;align-items:center;gap:4px}#recentTabButton{border-radius:8px;font-size:12px;font-weight:500;height:28px;line-height:18px;padding:6px 8px;width:210px;--cr-button-border-color:var(--color-new-tab-page-composebox-recent-tab-chip-outline);--cr-button-text-color:var(--color-new-tab-page-composebox-upload-button);--cr-button-disabled-text-color:var(--color-new-tab-page-composebox-context-entrypoint-text-disabled);--cr-hover-background-color:var(--color-new-tab-page-composebox-context-entrypoint-hover-background)}.favicon{border-radius:100px;height:16px;width:16px}`])
}
function getHtml$6() {
    return this.recentTab_ ? html`<!--_html_template_start_-->
  <cr-button id="recentTabButton"
      @click="${this.addTabContext_}"
      ?disabled="${this.inputsDisabled_}"
      title="${this.recentTab_.title}"
      aria-label="${this.i18n("askAboutThisTabAriaLabel", this.recentTab_.title)}">
    <div class="button-content">
      <composebox-tab-favicon
          class="favicon"
          .url="${this.recentTab_.url?.url}">
      </composebox-tab-favicon>
      <span class="recent-tab-button-text">
        ${this.i18n("askAboutThisTab")}
      </span>
    </div>
  </cr-button>
<!--_html_template_end_-->` : ""
}
const RecentTabChipBase = I18nMixinLit(CrLitElement);
class RecentTabChipElement extends RecentTabChipBase {
    static get is() {
        return "composebox-recent-tab-chip"
    }
    static get styles() {
        return getCss$6()
    }
    render() {
        return getHtml$6.bind(this)()
    }
    static get properties() {
        return {
            inputsDisabled_: {
                type: Boolean
            },
            recentTab_: {
                type: Object
            }
        }
    }
    #inputsDisabled__accessor_storage = false;
    get inputsDisabled_() {
        return this.#inputsDisabled__accessor_storage
    }
    set inputsDisabled_(value) {
        this.#inputsDisabled__accessor_storage = value
    }
    #recentTab__accessor_storage = undefined;
    get recentTab_() {
        return this.#recentTab__accessor_storage
    }
    set recentTab_(value) {
        this.#recentTab__accessor_storage = value
    }
    addTabContext_(e) {
        e.stopPropagation();
        if (!this.recentTab_ || this.inputsDisabled_) {
            return
        }
        this.fire("add-tab-context", {
            id: this.recentTab_.tabId,
            title: this.recentTab_.title,
            url: this.recentTab_.url
        })
    }
}
customElements.define(RecentTabChipElement.is, RecentTabChipElement);
let instance$7 = null;
function getCss$5() {
    return instance$7 || (instance$7 = [...[getCss$n()], css`:host{--input-inline-spacing:12px;outline:none;height:44px;display:block}:host(:not([is-last])){padding-bottom:2px}.container{border-start-end-radius:24px;border-end-end-radius:24px;color:var(--color-new-tab-page-composebox-font);cursor:default;display:flex;font-size:16px;height:44px;line-height:24px;position:relative}.container:hover,:host(:is(:focus-visible,[selected])) .container{background-color:var(--color-searchbox-results-background-hovered)}#focusIndicator{background-color:var(--color-searchbox-results-focus-indicator);border-radius:4px;display:none;margin-inline-start:-4px;height:100%;position:absolute;width:8px}:host(:is(:focus-visible,[selected])) #focusIndicator{display:block}#iconContainer{align-items:center;display:flex;padding-inline-start:18px;justify-content:center}#icon{-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:cover;background-color:var(--color-new-tab-page-composebox-input-icon);height:20px;width:20px}#textContainer{align-content:center;color:var(--color-new-tab-page-composebox-font-light);font-size:16px;overflow:hidden;padding-inline:var(--input-inline-spacing) 64px;text-overflow:ellipsis;white-space:nowrap}#remove{--cr-icon-button-fill-color:var(--color-searchbox-results-icon-selected);--cr-icon-button-icon-size:16px;--cr-icon-button-hover-background-color:var(--color-searchbox-results-background-hovered);display:none;position:absolute;top:6px;right:12px}:host-context([dir='rtl']) #remove{left:12px;right:unset}.container:hover #remove:not([hidden]),:host-context(ntp-composebox-match:-webkit-any(:focus-within,[selected])) #remove:not([hidden]){display:inline-flex}:host-context([in-deep-search-mode_]) #textContainer{display:block;line-clamp:2;overflow:hidden;box-orient:vertical;white-space:normal}:host-context([in-deep-search-mode_]),:host-context([in-deep-search-mode_]) .container{height:68px}:host-context([in-deep-search-mode_]) .container{border-start-end-radius:24px;border-end-end-radius:24px}`])
}
function getHtml$5() {
    return html`<!--_html_template_start_-->
<div class="container" aria-hidden="true">
  <div id="focusIndicator"></div>
  <div id="iconContainer">
    <div id="icon" style="-webkit-mask-image: url(${this.iconPath_()});"></div>
  </div>
  <div id="textContainer">
    ${this.computeContents_()}
  </div>
  <cr-icon-button id="remove" class="action-icon icon-clear"
    aria-label="${this.computeRemoveButtonAriaLabel_()}"
    @click="${this.onRemoveButtonClick_}"
    @mousedown="${this.onRemoveButtonMouseDown_}"
    title="${this.removeButtonTitle_}"
    ?hidden="${!this.match.supportsDeletion}"
    tabindex="2">
  </cr-icon-button>
</div>
  <!--_html_template_end_-->`
}
function createAutocompleteMatch() {
    return {
        a11yLabel: "",
        actions: [],
        allowedToBeDefaultMatch: false,
        isSearchType: false,
        isEnterpriseSearchAggregatorPeopleType: false,
        swapContentsAndDescription: false,
        supportsDeletion: false,
        suggestionGroupId: -1,
        contents: "",
        contentsClass: [{
            offset: 0,
            style: 0
        }],
        description: "",
        descriptionClass: [{
            offset: 0,
            style: 0
        }],
        destinationUrl: {
            url: ""
        },
        inlineAutocompletion: "",
        fillIntoEdit: "",
        iconPath: "",
        iconUrl: {
            url: ""
        },
        imageDominantColor: "",
        imageUrl: "",
        isNoncannedAimSuggestion: false,
        removeButtonA11yLabel: "",
        type: "",
        isRichSuggestion: false,
        isWeatherAnswerSuggestion: null,
        answer: null,
        tailSuggestCommonPrefix: null,
        hasInstantKeyword: false,
        keywordChipHint: "",
        keywordChipA11y: ""
    }
}
class ComposeboxProxyImpl {
    handler;
    callbackRouter;
    searchboxHandler;
    searchboxCallbackRouter;
    constructor(handler, callbackRouter, searchboxHandler, searchboxCallbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter;
        this.searchboxHandler = searchboxHandler;
        this.searchboxCallbackRouter = searchboxCallbackRouter
    }
    static getInstance() {
        if (instance$6) {
            return instance$6
        }
        const callbackRouter = new PageCallbackRouter$2;
        const handler = new PageHandlerRemote$2;
        const factory = PageHandlerFactory$1.getRemote();
        const searchboxHandler = new PageHandlerRemote;
        const searchboxCallbackRouter = new PageCallbackRouter;
        factory.createPageHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver(), searchboxCallbackRouter.$.bindNewPipeAndPassRemote(), searchboxHandler.$.bindNewPipeAndPassReceiver());
        instance$6 = new ComposeboxProxyImpl(handler,callbackRouter,searchboxHandler,searchboxCallbackRouter);
        return instance$6
    }
    static setInstance(newInstance) {
        instance$6 = newInstance
    }
}
let instance$6 = null;
class ComposeboxMatchElement extends CrLitElement {
    static get is() {
        return "ntp-composebox-match"
    }
    static get styles() {
        return getCss$5()
    }
    render() {
        return getHtml$5.bind(this)()
    }
    static get properties() {
        return {
            match: {
                type: Object
            },
            matchIndex: {
                type: Number
            },
            removeButtonTitle_: {
                type: String
            }
        }
    }
    #match_accessor_storage = createAutocompleteMatch();
    get match() {
        return this.#match_accessor_storage
    }
    set match(value) {
        this.#match_accessor_storage = value
    }
    #matchIndex_accessor_storage = -1;
    get matchIndex() {
        return this.#matchIndex_accessor_storage
    }
    set matchIndex(value) {
        this.#matchIndex_accessor_storage = value
    }
    searchboxHandler_;
    #removeButtonTitle__accessor_storage = loadTimeData.getString("removeSuggestion");
    get removeButtonTitle_() {
        return this.#removeButtonTitle__accessor_storage
    }
    set removeButtonTitle_(value) {
        this.#removeButtonTitle__accessor_storage = value
    }
    constructor() {
        super();
        this.searchboxHandler_ = ComposeboxProxyImpl.getInstance().searchboxHandler
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", (event => this.onMatchClick_(event)));
        this.addEventListener("focusin", ( () => this.onMatchFocusin_()))
    }
    computeContents_() {
        return this.match.contents
    }
    computeRemoveButtonAriaLabel_() {
        return this.match.removeButtonA11yLabel
    }
    iconPath_() {
        return this.match.iconPath || ""
    }
    onMatchFocusin_() {
        this.fire("match-focusin", {
            index: this.matchIndex
        })
    }
    onMatchClick_(e) {
        if (e.button > 1) {
            return
        }
        e.preventDefault();
        this.searchboxHandler_.openAutocompleteMatch(this.matchIndex, this.match.destinationUrl, true, e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
        this.fire("match-click")
    }
    onRemoveButtonClick_(e) {
        if (e.button !== 0) {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        this.searchboxHandler_.deleteAutocompleteMatch(this.matchIndex, this.match.destinationUrl)
    }
    onRemoveButtonMouseDown_(e) {
        e.preventDefault()
    }
}
customElements.define(ComposeboxMatchElement.is, ComposeboxMatchElement);
let instance$5 = null;
function getCss$4() {
    return instance$5 || (instance$5 = [...[getCss$n()], css`:host{display:flex;flex-direction:column;padding-inline-end:16px}:host([hidden]){display:none}ntp-composebox-match[hidden]{display:none}`])
}
function getHtml$4() {
    return html`<!--_html_template_start_-->
  <div>
    ${this.result?.matches.map(( (item, index) => html`
      <ntp-composebox-match
          aria-label="${this.computeAriaLabel_(item)}"
          tabindex="0"
          role="option"
          .match="${item}"
          .matchIndex="${index}"
          ?selected="${this.isSelected_(item)}"
          ?is-last="${this.isLastMatch_(index)}"
          ?hidden="${this.hideVerbatimMatch_(index)}">
      </ntp-composebox-match>
    `))}
  </div>
  <!--_html_template_end_-->`
}
function remainder(lhs, rhs) {
    return (lhs % rhs + rhs) % rhs
}
class ComposeboxDropdownElement extends CrLitElement {
    static get is() {
        return "ntp-composebox-dropdown"
    }
    static get styles() {
        return getCss$4()
    }
    render() {
        return getHtml$4.bind(this)()
    }
    static get properties() {
        return {
            result: {
                type: Object
            },
            selectedMatchIndex: {
                type: Number,
                notify: true
            },
            lastQueriedInput: {
                type: String,
                notify: true
            }
        }
    }
    #result_accessor_storage = null;
    get result() {
        return this.#result_accessor_storage
    }
    set result(value) {
        this.#result_accessor_storage = value
    }
    #selectedMatchIndex_accessor_storage = -1;
    get selectedMatchIndex() {
        return this.#selectedMatchIndex_accessor_storage
    }
    set selectedMatchIndex(value) {
        this.#selectedMatchIndex_accessor_storage = value
    }
    #lastQueriedInput_accessor_storage = "";
    get lastQueriedInput() {
        return this.#lastQueriedInput_accessor_storage
    }
    set lastQueriedInput(value) {
        this.#lastQueriedInput_accessor_storage = value
    }
    unselect() {
        this.selectedMatchIndex = -1
    }
    focusSelected() {
        const selectableMatchElements = this.shadowRoot.querySelectorAll("ntp-composebox-match");
        selectableMatchElements[this.selectedMatchIndex]?.focus()
    }
    selectFirst() {
        this.selectedMatchIndex = 0
    }
    selectIndex(index) {
        this.selectedMatchIndex = index
    }
    selectPrevious() {
        if (!this.result) {
            this.selectedMatchIndex = -1;
            return
        }
        let previous;
        const isTypedSuggest = this.lastQueriedInput.trim().length > 0;
        if (isTypedSuggest && this.selectedMatchIndex === 1) {
            previous = -1
        } else {
            previous = Math.max(this.selectedMatchIndex, 0) - 1
        }
        this.selectedMatchIndex = remainder(previous, this.result.matches.length)
    }
    selectLast() {
        this.selectedMatchIndex = this.result ? this.result.matches.length - 1 : -1
    }
    selectNext() {
        if (!this.result) {
            this.selectedMatchIndex = -1;
            return
        }
        let next;
        const isTypedSuggest = this.lastQueriedInput.trim().length > 0;
        if (isTypedSuggest && this.selectedMatchIndex === this.result.matches.length - 1) {
            next = 1
        } else {
            next = this.selectedMatchIndex + 1
        }
        this.selectedMatchIndex = remainder(next, this.result.matches.length)
    }
    matchIndex_(match) {
        return this.result?.matches.indexOf(match) ?? -1
    }
    isSelected_(match) {
        return this.matchIndex_(match) === this.selectedMatchIndex
    }
    isLastMatch_(index) {
        assert(this.result);
        return index === this.result.matches.length - 1
    }
    hideVerbatimMatch_(index) {
        assert(this.result);
        if (!this.result.input) {
            return false
        }
        return index === 0
    }
    computeAriaLabel_(match) {
        return match.a11yLabel
    }
}
customElements.define(ComposeboxDropdownElement.is, ComposeboxDropdownElement);
let instance$4 = null;
function getCss$3() {
    return instance$4 || (instance$4 = [...[getCss$m()], css`:host{--cr-localized-link-display:inline;display:block}:host([link-disabled]){cursor:pointer;opacity:var(--cr-disabled-opacity);pointer-events:none}a{display:var(--cr-localized-link-display)}a[href]{color:var(--cr-link-color)}a[is=action-link]{user-select:none}#container{display:contents}`])
}
function getHtml$3() {
    return html`
<!-- innerHTML is set via setContainerInnerHtml_. -->
<div id="container"></div>`
}
class LocalizedLinkElement extends CrLitElement {
    static get is() {
        return "localized-link"
    }
    static get styles() {
        return getCss$3()
    }
    render() {
        return getHtml$3.bind(this)()
    }
    static get properties() {
        return {
            localizedString: {
                type: String
            },
            linkUrl: {
                type: String
            },
            linkDisabled: {
                type: Boolean,
                reflect: true
            },
            containerInnerHTML_: {
                type: String
            }
        }
    }
    #localizedString_accessor_storage = "";
    get localizedString() {
        return this.#localizedString_accessor_storage
    }
    set localizedString(value) {
        this.#localizedString_accessor_storage = value
    }
    #linkUrl_accessor_storage = "";
    get linkUrl() {
        return this.#linkUrl_accessor_storage
    }
    set linkUrl(value) {
        this.#linkUrl_accessor_storage = value
    }
    #linkDisabled_accessor_storage = false;
    get linkDisabled() {
        return this.#linkDisabled_accessor_storage
    }
    set linkDisabled(value) {
        this.#linkDisabled_accessor_storage = value
    }
    #containerInnerHTML__accessor_storage = "";
    get containerInnerHTML_() {
        return this.#containerInnerHTML__accessor_storage
    }
    set containerInnerHTML_(value) {
        this.#containerInnerHTML__accessor_storage = value
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("localizedString") || changedProperties.has("linkUrl")) {
            this.containerInnerHTML_ = this.getAriaLabelledContent_(this.localizedString, this.linkUrl)
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("containerInnerHTML_")) {
            this.setContainerInnerHtml_()
        }
        if (changedProperties.has("linkDisabled")) {
            this.updateAnchorTagTabIndex_()
        }
    }
    getAriaLabelledContent_(localizedString, linkUrl) {
        const tempEl = document.createElement("div");
        tempEl.innerHTML = sanitizeInnerHtml(localizedString, {
            attrs: ["id"]
        });
        const ariaLabelledByIds = [];
        tempEl.childNodes.forEach(( (node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const spanNode = document.createElement("span");
                spanNode.textContent = node.textContent;
                spanNode.id = `id${index}`;
                ariaLabelledByIds.push(spanNode.id);
                spanNode.setAttribute("aria-hidden", "true");
                node.replaceWith(spanNode);
                return
            }
            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "A") {
                const element = node;
                element.id = `id${index}`;
                ariaLabelledByIds.push(element.id);
                return
            }
            assertNotReached("localized-link has invalid node types")
        }
        ));
        const anchorTags = tempEl.querySelectorAll("a");
        if (anchorTags.length === 0) {
            return localizedString
        }
        assert(anchorTags.length === 1, "localized-link should contain exactly one anchor tag");
        const anchorTag = anchorTags[0];
        anchorTag.setAttribute("aria-labelledby", ariaLabelledByIds.join(" "));
        anchorTag.tabIndex = this.linkDisabled ? -1 : 0;
        if (linkUrl !== "") {
            anchorTag.href = linkUrl;
            anchorTag.target = "_blank"
        }
        return tempEl.innerHTML
    }
    setContainerInnerHtml_() {
        this.$.container.innerHTML = sanitizeInnerHtml(this.containerInnerHTML_, {
            attrs: ["aria-hidden", "aria-labelledby", "id", "tabindex"]
        });
        const anchorTag = this.shadowRoot.querySelector("a");
        if (anchorTag) {
            anchorTag.addEventListener("click", (event => this.onAnchorTagClick_(event)));
            anchorTag.addEventListener("auxclick", (event => {
                if (event.button === 1) {
                    this.onAnchorTagClick_(event)
                }
            }
            ))
        }
    }
    onAnchorTagClick_(event) {
        if (this.linkDisabled) {
            event.preventDefault();
            return
        }
        this.fire("link-clicked", {
            event: event
        });
        event.stopPropagation()
    }
    updateAnchorTagTabIndex_() {
        const anchorTag = this.shadowRoot.querySelector("a");
        if (!anchorTag) {
            return
        }
        anchorTag.tabIndex = this.linkDisabled ? -1 : 0
    }
}
customElements.define(LocalizedLinkElement.is, LocalizedLinkElement);
let instance$3 = null;
function getCss$2() {
    return instance$3 || (instance$3 = [...[getCss$n()], css`:host{--input-bottom-spacing:10px;--text-input-top-spacing:10px;--text-input-inline-end-spacing:80px;--text-input-inline-start-spacing:16px;--expanded-border-radius:26px;--brand-gradient:conic-gradient(rgba(52,168,82,0) 0deg,rgba(52,168,82,1) 38.9738deg,rgba(255,211,20,1) 62.3678deg,rgba(255,70,65,1) 87.0062deg,rgba(49,134,255,1) 107.428deg,rgba(49,134,255,0.5) 204.48deg,rgba(49,134,255,0) 308.88deg,rgba(52,168,82,0) 360deg);--standard-curve:cubic-bezier(0.4,0,0.2,1);--gradient-curve:cubic-bezier(0.2,0,0,1);--emphasized-accelerate:cubic-bezier(0.3,0,0.8,0.15);--emphasized-curve:linear(0,0.002,0.01 3.6%,0.02 4.9%,0.034,0.053,0.074,0.1,0.128,0.16,0.194 13.4%,0.271 15%,0.344 16.1%,0.477 17.5%,0.544 18.3%,0.607,0.66 20.6%,0.717 22.4%,0.742,0.765,0.788,0.808,0.827,0.845 30.4%,0.865 32.6%,0.866,0.865 32.7%,0.869 33.1%,0.883 35.1%,0.9 37.7%,0.916 40.6%,0.929 43.8%,0.942 47.2%,0.953 51%,0.963 55%,0.972 59.3%,0.979 64%,0.986 69%,0.991 74.4%,0.998 86.4%,1);--start-angle-open:30deg;--end-angle-open:245deg;--start-angle-submit:200deg;--end-angle-submit:330deg;--glow-stroke-width:2px;--glif-rotation-duration:1000ms;--icon-entry-transition:opacity var(--expand-ease-out-duration) linear 800ms;--icon-exit-transition:opacity var(--collapse-ease-in-duration) var(--emphasized-accelerate);--height-expand-duration:600ms;--submit-enabled-transition:opacity 255ms;--border-radius-transition:border-radius var(--collapse-duration) var(--emphasized-curve);--lens-icon-animation-duration:1100ms;border-radius:30px;box-shadow:var(--cr-searchbox-shadow);font-size:var(--cr-composebox-font-size,18px);transition:var(--border-radius-transition);width:var(--ntp-composebox-width,337px)}:host(:not([ntp-realbox-next-enabled])){--expand-ease-in-duration:400ms;--expand-delay:300ms;--expand-ease-out-duration:300ms;--expand-duration:calc(var(--expand-ease-in-duration) + var(--expand-delay) + var(--expand-ease-out-duration));--collapse-ease-in-duration:100ms;--collapse-ease-out-duration:500ms;--collapse-duration:calc(var(--collapse-ease-in-duration) + var(--collapse-ease-out-duration))}:host([ntp-realbox-next-enabled]){--input-bottom-spacing:12px}:host([expanded_]){border-radius:var(--expanded-border-radius)}#errorScrim{border-radius:inherit}#composebox{display:flex;pointer-events:auto;position:relative;overflow:hidden}:host([is-collapsible]) #composebox{transition:min-height var(--emphasized-curve),max-height var(--emphasized-curve);transition-duration:var(--collapse-duration);min-height:60px;max-height:60px}:host(:not([is-collapsible])) #composebox{height:60px}:host([expanded_]) #composebox{height:calc-size(auto,size);max-height:422px;transition-duration:var(--expand-duration)}:host([is-collapsible][expanded_]) #composebox{min-height:136px;max-height:254px}#inputContainer{box-sizing:border-box;display:flex;flex-direction:column;padding-bottom:var(--input-bottom-spacing);overflow:hidden;width:100%}#textContainer{display:flex;flex-direction:row;padding-block:8px 0;padding-inline:var(--text-input-inline-start-spacing) 0}#iconContainer{--text-input-top-spacing:8px;align-items:center;display:flex;height:48px;justify-content:center}#aimIcon{-webkit-mask-image:url(//resources/cr_components/searchbox/icons/search_spark.svg);-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:cover;background-color:var(--color-new-tab-page-composebox-input-icon);height:24px;width:24px}@media (forced-colors:active){#aimIcon{background-color:Highlight;border-radius:4px}}#inputWrapper{position:relative;width:100%}#input,#smartCompose{box-sizing:border-box;font-family:inherit;font-size:inherit;line-height:24px;min-height:48px;max-height:190px;padding-block:var(--text-input-top-spacing) 0;padding-inline:12px var(--text-input-inline-end-spacing);scrollbar-width:none;width:100%}:host(:not[ntp-realbox-next-enabled]) #input{transition:padding var(--height-expand-duration) var(--standard-curve)}#input{animation:color-change 5s infinite;background-color:inherit;border:none;caret-color:var(--google-blue-500);color:var(--color-new-tab-page-composebox-font-light);field-sizing:content;mask-image:linear-gradient(transparent 7px,black calc(var(--text-input-top-spacing) + 7px));height:calc-size(fit-content,min(size + 4px,190px));outline:none;position:relative;resize:none}#input::placeholder{color:var(--color-new-tab-page-composebox-type-ahead)}#smartCompose{pointer-events:none;position:absolute;overflow:scroll;top:0;left:0}:host(:not([smart-compose-enabled_])) #smartCompose{display:none}#invisibleText{color:transparent;white-space:pre-wrap}#ghostText{color:var(--color-new-tab-page-composebox-type-ahead);white-space:pre-wrap}#tabChip{align-items:center;border:1px solid var(--color-new-tab-page-composebox-type-ahead-chip);border-radius:8px;box-sizing:border-box;color:var(--color-new-tab-page-composebox-type-ahead-chip);font-size:12px;font-weight:700;line-height:28px;margin-left:4px;padding:6px 8px}:host([expanded_]) #input,:host([expanded_]) #smartCompose{--text-input-top-spacing:12px}:host([expanded_][is-collapsible]) #input{--text-input-top-spacing:24px}@keyframes color-change{0%,100%{caret-color:var(--google-blue-500)}25%{caret-color:var(--google-red-500)}50%{caret-color:var(--google-yellow-500)}75%{caret-color:var(--google-green-500)}}#input::-webkit-search-decoration,#input::-webkit-search-results-button,#input::-webkit-search-results-decoration,#input::-webkit-search-cancel-button{display:none}:host([expanded_][show-dropdown_]) ntp-composebox-dropdown{padding-bottom:8px}.action-icon{--cr-icon-button-focus-outline-color:var(--color-searchbox-results-icon-focused-outline);--cr-icon-button-hover-background-color:var(--color-searchbox-results-background-hovered);--cr-icon-button-margin-end:0;--cr-icon-button-size:40px;position:absolute;right:16px}:host-context([dir='rtl']) .action-icon{left:16px;right:unset}#cancelIcon{--cr-icon-button-fill-color:var(--color-new-tab-page-composebox-cancel-button-light);--cr-icon-button-icon-size:20px;position:absolute;top:8px;transition:var(--submit-enabled-transition)}:host([expanded_][is-collapsible]) #cancelIcon{top:16px}:host([is-collapsible]:not([submit-enabled_])) #cancelIcon{opacity:0;pointer-events:none}@keyframes fade-out-in{0%{opacity:0}73%{opacity:0}}#lensIcon{--cr-icon-button-icon-size:20px;--cr-icon-image:url(//resources/cr_components/searchbox/icons/camera.svg);bottom:var(--input-bottom-spacing);display:none;opacity:1;position:absolute;right:16px;top:6px}#lensIcon:focus-visible:focus{box-shadow:none;outline:2px solid var(--color-searchbox-results-icon-focused-outline);outline-offset:2px}:host([expanded_]) #lensIcon{animation:fade-out-in var(--lens-icon-animation-duration) linear;right:68px;top:auto}:host([lens-button-disabled_]) #lensIcon{opacity:0.3}:host-context([dir='rtl']) #lensIcon{left:68px;right:unset}:host(:not([show-submit_])) #submitContainer,:host([ntp-realbox-next-enabled]) #submitContainer,:host([show-submit_]:not([submit-enabled_])) #submitContainer{display:none}#submitIcon{--cr-icon-button-fill-color:white;--cr-icon-button-icon-size:16px;background-color:var(--color-new-tab-page-composebox-submit-button);bottom:var(--input-bottom-spacing);cursor:default;opacity:30%;transition:var(--submit-enabled-transition)}#submitIcon:focus-visible:focus{box-shadow:none;outline:2px solid var(--color-searchbox-results-icon-focused-outline);outline-offset:2px}:host([show-submit_][submit-enabled_]:not([ntp-realbox-next-enabled])) #submitIcon{cursor:pointer;display:block;opacity:100%}.icon-fade{opacity:0;transition:var(--icon-exit-transition)}:host([expanded_]) .icon-fade{opacity:1;transition:var(--icon-entry-transition)}@media (forced-colors:active){:host,.action-icon{border:solid var(--color-new-tab-page-composebox-outline-hcm)}}.gradient{border-radius:inherit;contain:paint;inset:0;position:absolute}.gradient.gradient-outer-glow{animation:blur-open var(--glif-rotation-duration) var(--standard-curve)}@keyframes blur-open{17%{filter:blur(30px);opacity:17.5%}}.gradient:before{aspect-ratio:1/1;background:var(--brand-gradient);border-radius:50%;contain:paint;content:'';height:auto;left:50%;position:absolute;rotate:0deg;scale:1 0.6;top:50%;translate:-50% -50%;opacity:0;width:120%}:host([expanded_]) .gradient:before{animation:gradient-spin-expand var(--glif-rotation-duration) var(--gradient-curve) forwards}@keyframes gradient-spin-expand{0%{opacity:0;transform:rotate(var(--start-angle-open))}17%{opacity:1}100%{opacity:0;transform:rotate(var(--end-angle-open))}}:host([submitting_]) .gradient:before,:host([submitting_]) .gradient.gradient-outer-glow:before{animation:gradient-spin-submit var(--glif-rotation-duration) var(--gradient-curve) forwards}:host([submitting_]) .gradient.gradient-outer-glow{animation:blur-close var(--glif-rotation-duration) var(--gradient-curve)}@keyframes blur-close{17%{filter:blur(30px);opacity:17.5%}}@keyframes gradient-spin-submit{0%{opacity:0;transform:rotate(var(--start-angle-submit))}17%{opacity:1}100%{opacity:0;transform:rotate(var(--end-angle-submit))}}.background{animation:gradient-border-width var(--glif-rotation-duration) var(--standard-curve);border:0 solid transparent;border-radius:inherit;contain:paint;inset:0;position:absolute}@keyframes gradient-border-width{0%{border-width:0}17%{border-width:var(--glow-stroke-width)}100%{border-width:0}}.background:before{background:var(--ntp-composebox-background-color);border-radius:inherit;content:'';contain:paint;inset:0;position:absolute;filter:blur(0)}:host([expanded_]) .background:before{animation:plate-background-blur-on-expand var(--glif-rotation-duration) var(--standard-curve)}:host([expanded_][is-collapsible]) .background:before{animation:color-pulse-on-expand var(--expand-duration) var(--standard-curve)}@keyframes plate-background-blur-on-expand{0%{filter:blur(0)}17%{filter:blur(2px)}100%{filter:blur(0)}}@keyframes color-pulse-on-expand{40%{background:var(--color-new-tab-page-composebox-scrim-background)}58%{background:var(--color-new-tab-page-composebox-scrim-background)}}:host([expanded_]) .background,:host([submitting_]) .background{animation:gradient-border-width-close var(--glif-rotation-duration) var(--standard-curve)}@keyframes gradient-border-width-close{0%{border-width:0}17%{border-width:var(--glow-stroke-width)}100%{border-width:0}}#suggestionActivity{color:var(--color-new-tab-page-composebox-suggestion-activity);font-size:12px;font-weight:400;left:50%;line-height:18px;margin-top:20px;position:absolute;transform:translate(-50%)}.carousel-divider{border-radius:100px;border-top:1px solid var(--color-new-tab-page-composebox-file-carousel-divider);margin-inline-end:16px;margin-inline-start:var(--text-input-inline-start-spacing);margin-top:8px;margin-bottom:10px}:host([ntp-realbox-next-enabled][realbox-layout-mode="Compact"]) #iconContainer{display:none}:host([ntp-realbox-next-enabled][realbox-layout-mode="Compact"]) #textContainer{--text-input-inline-start-spacing:40px}:host([ntp-realbox-next-enabled]) #input,:host([ntp-realbox-next-enabled]) #smartCompose{--text-input-top-spacing:14px}:host([ntp-realbox-next-enabled][realbox-layout-mode="Compact"]) #input,:host([ntp-realbox-next-enabled][realbox-layout-mode="Compact"]) #smartCompose{--text-input-top-spacing:8px}:host([ntp-realbox-next-enabled][realbox-layout-mode="Compact"]) #context{margin-top:-48px}:host([expanded_][show-dropdown_][ntp-realbox-next-enabled][realbox-layout-mode="Compact"]) ntp-composebox-dropdown{padding-bottom:0;padding-top:8px}:host-context([realbox-layout-mode='TallTopContext']) contextual-entrypoint-and-carousel::part(carousel-divider){margin-top:10px}`])
}
function getHtml$2() {
    return html`<!--_html_template_start_-->
  <div class="gradient gradient-outer-glow"></div>
  <div class="gradient"></div>
  <div class="background"></div>
  <ntp-error-scrim id="errorScrim"
    ?compact-mode="${this.realboxLayoutMode === "Compact" && this.contextFilesSize_ === 0}"
    @error-scrim-visibility-changed="${this.onErrorScrimVisibilityChanged_}">
  </ntp-error-scrim>
  <div id="composebox" @keydown="${this.onKeydown_}"
      @focusin=${this.handleComposeboxFocusIn_}
      @focusout=${this.handleComposeboxFocusOut_}>
    <div id="inputContainer">
      <div id="textContainer" part="text-container">
        <div id="iconContainer" part="icon-container">
          <div id="aimIcon"></div>
        </div>
        <div id="inputWrapper">
          <textarea
            aria-expanded="${this.showDropdown_}" aria-controls="matches"
            role="combobox" autocomplete="off" id="input"
            type="search" spellcheck="false"
            placeholder="${this.inputPlaceholder_}"
            part="input"
            .value="${this.input_}"
            @input=${this.handleInput_}
            @scroll="${this.handleScroll_}"
            @focusin="${this.handleInputFocusIn_}"
            @focusout="${this.handleInputFocusOut_}"></textarea>
          ${this.shouldShowSmartComposeInlineHint_() ? html`
            <div id="smartCompose">
              <!-- Comments in between spans to eliminate spacing between
                   spans -->
              <span id="invisibleText">${this.input_}</span><!--
              --><span id="ghostText">${this.smartComposeInlineHint_}</span><!--
              --><span id="tabChip">${this.i18n("composeboxSmartComposeTabTitle")}</span>
            </div>
          ` : ""}
        </div>
      </div>
      <contextual-entrypoint-and-carousel id="context" part="context-entrypoint"
          .tabSuggestions_=${this.tabSuggestions_}
          entrypoint-name="Composebox"
          @add-tab-context="${this.addTabContext_}"
          @add-file-context="${this.addFileContext_}"
          @delete-context="${this.deleteContext_}"
          @on-file-validation-error="${this.onFileValidationError_}"
          @set-deep-search-mode="${this.setDeepSearchMode_}"
          @set-create-image-mode="${this.setCreateImageMode_}"
          @get-tab-preview="${this.getTabPreview_}"
          ?show-dropdown="${this.showDropdown_}"
          ?inputs-disabled="${this.inputsDisabled_}"
          ?show-context-menu-description="${this.showContextMenuDescription_}"
          realbox-layout-mode="${this.realboxLayoutMode}">
        <ntp-composebox-dropdown
            id="matches"
            part="dropdown"
            role="listbox"
            .result="${this.result_}"
            .selectedMatchIndex="${this.selectedMatchIndex_}"
            @selected-match-index-changed="${this.onSelectedMatchIndexChanged_}"
            @match-focusin="${this.onMatchFocusin_}"
            @match-click="${this.onMatchClick_}"
            ?hidden="${!this.showDropdown_}"
            .lastQueriedInput=${this.lastQueriedInput_}>
        </ntp-composebox-dropdown>
      </contextual-entrypoint-and-carousel>
    </div>
    <!-- A seperate container is needed for the submit button so the
    expand/collapse animation can be applied without affecting the submit
    button enabled/disabled state. -->
    <div id="cancelContainer" class="icon-fade" part="cancel">
      <cr-icon-button
          class="action-icon icon-clear"
          id="cancelIcon"
          part="action-icon cancel-icon"
          title="${this.computeCancelButtonTitle_()}"
          @click="${this.onCancelClick_}"
          ?disabled="${this.isCollapsible && !this.submitEnabled_}">
      </cr-icon-button>
    </div>
    <cr-icon-button
        class="action-icon"
        id="lensIcon"
        part="action-icon lens-icon"
        title="${this.i18n("lensSearchButtonLabel")}"
        @click="${this.onLensClick_}"
        ?disabled="${this.lensButtonDisabled_}"
        @mousedown="${this.onLensIconMouseDown_}">
    </cr-icon-button>
    <!-- A seperate container is needed for the submit button so the
       expand/collapse animation can be applied without affecting the submit
       button enabled/disabled state. -->
    <div id="submitContainer" class="icon-fade" part="submit">
      <cr-icon-button
        class="action-icon icon-arrow-upward"
        id="submitIcon"
        part="action-icon submit-icon"
        title="${this.i18n("composeboxSubmitButtonTitle")}"
        @click="${this.submitQuery_}"
        ?disabled="${!this.submitEnabled_}"
        @focusin="${this.handleSubmitFocusIn_}">
      </cr-icon-button>
    </div>
  </div>
  ${this.shouldShowSuggestionActivityLink_() ? html`
    <div id="suggestionActivity">
      <localized-link
        localized-string="${this.i18nAdvanced("suggestionActivityLink")}">
      </localized-link>
    </div>
  ` : ""}
<!--_html_template_end_-->`
}
class ComposeboxElement extends (I18nMixinLit(CrLitElement)) {
    static get is() {
        return "ntp-composebox"
    }
    static get styles() {
        return getCss$2()
    }
    render() {
        return getHtml$2.bind(this)()
    }
    static get properties() {
        return {
            input_: {
                type: String
            },
            isCollapsible: {
                reflect: true,
                type: Boolean
            },
            expanded_: {
                reflect: true,
                type: Boolean
            },
            result_: {
                type: Object
            },
            submitEnabled_: {
                reflect: true,
                type: Boolean
            },
            selectedMatchIndex_: {
                type: Number
            },
            submitting_: {
                reflect: true,
                type: Boolean
            },
            showDropdown_: {
                reflect: true,
                type: Boolean
            },
            showSubmit_: {
                reflect: true,
                type: Boolean
            },
            enableImageContextualSuggestions_: {
                reflect: true,
                type: Boolean
            },
            inputPlaceholder_: {
                reflect: true,
                type: String
            },
            smartComposeEnabled_: {
                reflect: true,
                type: Boolean
            },
            smartComposeInlineHint_: {
                type: String
            },
            showFileCarousel_: {
                reflect: true,
                type: Boolean
            },
            inDeepSearchMode_: {
                reflect: true,
                type: Boolean
            },
            inCreateImageMode_: {
                reflect: true,
                type: Boolean
            },
            showContextMenuDescription_: {
                type: Boolean
            },
            inputsDisabled_: {
                reflect: true,
                type: Boolean
            },
            lensButtonDisabled_: {
                reflect: true,
                type: Boolean
            },
            ntpRealboxNextEnabled: {
                type: Boolean,
                reflect: true
            },
            tabSuggestions_: {
                type: Array
            },
            errorScrimVisible_: {
                type: Boolean
            },
            contextFilesSize_: {
                type: Number
            },
            realboxLayoutMode: {
                type: String,
                reflect: true
            }
        }
    }
    #ntpRealboxNextEnabled_accessor_storage = false;
    get ntpRealboxNextEnabled() {
        return this.#ntpRealboxNextEnabled_accessor_storage
    }
    set ntpRealboxNextEnabled(value) {
        this.#ntpRealboxNextEnabled_accessor_storage = value
    }
    #realboxLayoutMode_accessor_storage = "";
    get realboxLayoutMode() {
        return this.#realboxLayoutMode_accessor_storage
    }
    set realboxLayoutMode(value) {
        this.#realboxLayoutMode_accessor_storage = value
    }
    #isCollapsible_accessor_storage = false;
    get isCollapsible() {
        return this.#isCollapsible_accessor_storage
    }
    set isCollapsible(value) {
        this.#isCollapsible_accessor_storage = value
    }
    #expanded__accessor_storage = false;
    get expanded_() {
        return this.#expanded__accessor_storage
    }
    set expanded_(value) {
        this.#expanded__accessor_storage = value
    }
    #input__accessor_storage = "";
    get input_() {
        return this.#input__accessor_storage
    }
    set input_(value) {
        this.#input__accessor_storage = value
    }
    #showDropdown__accessor_storage = loadTimeData.getBoolean("composeboxShowZps");
    get showDropdown_() {
        return this.#showDropdown__accessor_storage
    }
    set showDropdown_(value) {
        this.#showDropdown__accessor_storage = value
    }
    #showSubmit__accessor_storage = loadTimeData.getBoolean("composeboxShowSubmit");
    get showSubmit_() {
        return this.#showSubmit__accessor_storage
    }
    set showSubmit_(value) {
        this.#showSubmit__accessor_storage = value
    }
    #enableImageContextualSuggestions__accessor_storage = loadTimeData.getBoolean("composeboxShowImageSuggest");
    get enableImageContextualSuggestions_() {
        return this.#enableImageContextualSuggestions__accessor_storage
    }
    set enableImageContextualSuggestions_(value) {
        this.#enableImageContextualSuggestions__accessor_storage = value
    }
    #selectedMatchIndex__accessor_storage = -1;
    get selectedMatchIndex_() {
        return this.#selectedMatchIndex__accessor_storage
    }
    set selectedMatchIndex_(value) {
        this.#selectedMatchIndex__accessor_storage = value
    }
    #submitting__accessor_storage = false;
    get submitting_() {
        return this.#submitting__accessor_storage
    }
    set submitting_(value) {
        this.#submitting__accessor_storage = value
    }
    #submitEnabled__accessor_storage = false;
    get submitEnabled_() {
        return this.#submitEnabled__accessor_storage
    }
    set submitEnabled_(value) {
        this.#submitEnabled__accessor_storage = value
    }
    #result__accessor_storage = null;
    get result_() {
        return this.#result__accessor_storage
    }
    set result_(value) {
        this.#result__accessor_storage = value
    }
    #smartComposeInlineHint__accessor_storage = "";
    get smartComposeInlineHint_() {
        return this.#smartComposeInlineHint__accessor_storage
    }
    set smartComposeInlineHint_(value) {
        this.#smartComposeInlineHint__accessor_storage = value
    }
    #smartComposeEnabled__accessor_storage = loadTimeData.getBoolean("composeboxSmartComposeEnabled");
    get smartComposeEnabled_() {
        return this.#smartComposeEnabled__accessor_storage
    }
    set smartComposeEnabled_(value) {
        this.#smartComposeEnabled__accessor_storage = value
    }
    #inputPlaceholder__accessor_storage = loadTimeData.getString("searchboxComposePlaceholder");
    get inputPlaceholder_() {
        return this.#inputPlaceholder__accessor_storage
    }
    set inputPlaceholder_(value) {
        this.#inputPlaceholder__accessor_storage = value
    }
    #showFileCarousel__accessor_storage = false;
    get showFileCarousel_() {
        return this.#showFileCarousel__accessor_storage
    }
    set showFileCarousel_(value) {
        this.#showFileCarousel__accessor_storage = value
    }
    #inCreateImageMode__accessor_storage = false;
    get inCreateImageMode_() {
        return this.#inCreateImageMode__accessor_storage
    }
    set inCreateImageMode_(value) {
        this.#inCreateImageMode__accessor_storage = value
    }
    #inDeepSearchMode__accessor_storage = false;
    get inDeepSearchMode_() {
        return this.#inDeepSearchMode__accessor_storage
    }
    set inDeepSearchMode_(value) {
        this.#inDeepSearchMode__accessor_storage = value
    }
    #showContextMenuDescription__accessor_storage = true;
    get showContextMenuDescription_() {
        return this.#showContextMenuDescription__accessor_storage
    }
    set showContextMenuDescription_(value) {
        this.#showContextMenuDescription__accessor_storage = value
    }
    #inputsDisabled__accessor_storage = false;
    get inputsDisabled_() {
        return this.#inputsDisabled__accessor_storage
    }
    set inputsDisabled_(value) {
        this.#inputsDisabled__accessor_storage = value
    }
    #lensButtonDisabled__accessor_storage = false;
    get lensButtonDisabled_() {
        return this.#lensButtonDisabled__accessor_storage
    }
    set lensButtonDisabled_(value) {
        this.#lensButtonDisabled__accessor_storage = value
    }
    #tabSuggestions__accessor_storage = [];
    get tabSuggestions_() {
        return this.#tabSuggestions__accessor_storage
    }
    set tabSuggestions_(value) {
        this.#tabSuggestions__accessor_storage = value
    }
    #errorScrimVisible__accessor_storage = false;
    get errorScrimVisible_() {
        return this.#errorScrimVisible__accessor_storage
    }
    set errorScrimVisible_(value) {
        this.#errorScrimVisible__accessor_storage = value
    }
    #contextFilesSize__accessor_storage = 0;
    get contextFilesSize_() {
        return this.#contextFilesSize__accessor_storage
    }
    set contextFilesSize_(value) {
        this.#contextFilesSize__accessor_storage = value
    }
    lastQueriedInput_ = "";
    showTypedSuggest_ = loadTimeData.getBoolean("composeboxShowTypedSuggest");
    showZps = loadTimeData.getBoolean("composeboxShowZps");
    browserProxy = ComposeboxProxyImpl.getInstance();
    searchboxCallbackRouter_;
    pageHandler_;
    searchboxHandler_;
    eventTracker_ = new EventTracker;
    searchboxListenerIds = [];
    composeboxCloseByEscape_ = loadTimeData.getBoolean("composeboxCloseByEscape");
    selectedMatch_ = null;
    constructor() {
        super();
        this.pageHandler_ = ComposeboxProxyImpl.getInstance().handler;
        this.searchboxCallbackRouter_ = ComposeboxProxyImpl.getInstance().searchboxCallbackRouter;
        this.searchboxHandler_ = ComposeboxProxyImpl.getInstance().searchboxHandler
    }
    connectedCallback() {
        super.connectedCallback();
        this.expanded_ = !this.isCollapsible;
        this.searchboxListenerIds = [this.searchboxCallbackRouter_.autocompleteResultChanged.addListener(this.onAutocompleteResultChanged_.bind(this)), this.searchboxCallbackRouter_.onContextualInputStatusChanged.addListener(this.onContextualInputStatusChanged_.bind(this)), this.searchboxCallbackRouter_.onTabStripChanged.addListener(this.refreshTabSuggestions_.bind(this))];
        this.eventTracker_.add(this.$.input, "input", ( () => {
            this.submitEnabled_ = this.computeSubmitEnabled_()
        }
        ));
        this.eventTracker_.add(this.$.context, "on-context-files-changed", (e => {
            this.contextFilesSize_ = e.detail.files;
            this.submitEnabled_ = this.computeSubmitEnabled_()
        }
        ));
        this.$.input.focus();
        if (this.showZps && !this.ntpRealboxNextEnabled) {
            this.queryAutocomplete(false)
        }
        this.searchboxHandler_.notifySessionStarted();
        this.refreshTabSuggestions_();
        if (this.ntpRealboxNextEnabled) {
            this.fire("composebox-initialized", {
                initializeComposeboxState: this.initializeState_.bind(this)
            })
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.searchboxHandler_.notifySessionAbandoned();
        this.searchboxListenerIds.forEach((id => assert(this.browserProxy.searchboxCallbackRouter.removeListener(id))));
        this.searchboxListenerIds = [];
        this.eventTracker_.removeAll()
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        let showDropdownUpdated = changedPrivateProperties.has("showDropdown_");
        if (changedPrivateProperties.has("input_") || changedPrivateProperties.has("result_") || changedPrivateProperties.has("contextFilesSize_") || changedPrivateProperties.has("errorScrimVisible_")) {
            const prevValue = this.showDropdown_;
            this.showDropdown_ = this.computeShowDropdown_();
            showDropdownUpdated ||= this.showDropdown_ !== prevValue
        }
        if (this.ntpRealboxNextEnabled && showDropdownUpdated) {
            this.dispatchEvent(new CustomEvent("composebox-dropdown-visible-changed",{
                bubbles: true,
                composed: true,
                detail: {
                    value: this.showDropdown_
                }
            }))
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("selectedMatchIndex_")) {
            if (this.selectedMatch_) {
                if (!(this.selectedMatchIndex_ === 0 && this.selectedMatch_.allowedToBeDefaultMatch)) {
                    const text = this.selectedMatch_.fillIntoEdit;
                    assert(text);
                    this.input_ = text;
                    this.submitEnabled_ = true
                }
            } else if (!this.lastQueriedInput_) {
                this.input_ = "";
                this.submitEnabled_ = false
            } else {
                this.input_ = this.lastQueriedInput_
            }
        }
        if (changedPrivateProperties.has("smartComposeInlineHint_")) {
            if (this.smartComposeInlineHint_) {
                this.adjustInputForSmartCompose();
                const announcer = getInstance();
                announcer.announce(this.smartComposeInlineHint_ + ", " + this.i18n("composeboxSmartComposeTitle"))
            } else {
                this.$.input.style.height = "calc-size(fit-content, min(size + 4px, 190px))"
            }
        }
    }
    getText() {
        return this.input_
    }
    setText(text) {
        this.input_ = text
    }
    resetModes() {
        this.$.context.resetModes()
    }
    closeDropdown() {
        this.clearAutocompleteMatches_()
    }
    getSmartComposeForTesting() {
        return this.smartComposeInlineHint_
    }
    initializeState_(text="", files=[], mode=ComposeboxMode.DEFAULT) {
        if (text) {
            this.input_ = text;
            this.lastQueriedInput_ = text
        }
        if (this.showZps && files.length === 0) {
            this.queryAutocomplete(false)
        }
        if (files.length > 0) {
            this.$.context.setContextFiles(files)
        }
        if (mode !== ComposeboxMode.DEFAULT) {
            this.$.context.setInitialMode(mode)
        }
    }
    computeCancelButtonTitle_() {
        return this.input_.trim().length > 0 || this.contextFilesSize_ > 0 ? this.i18n("composeboxCancelButtonTitleInput") : this.i18n("composeboxCancelButtonTitle")
    }
    computeShowDropdown_() {
        if (this.contextFilesSize_ > 1) {
            return false
        }
        if (!this.result_?.matches.length) {
            return false
        }
        if (this.errorScrimVisible_) {
            return false
        }
        if (this.showTypedSuggest_ && this.input_.trim()) {
            if (this.$.input.scrollHeight <= 48) {
                return true
            }
        }
        return this.showZps && !this.lastQueriedInput_
    }
    computeSubmitEnabled_() {
        return this.input_.trim().length > 0 || this.contextFilesSize_ > 0
    }
    shouldShowSuggestionActivityLink_() {
        if (!this.result_ || !this.showDropdown_) {
            return false
        }
        return this.result_.matches.some((match => match.isNoncannedAimSuggestion))
    }
    shouldShowSmartComposeInlineHint_() {
        return !!this.smartComposeInlineHint_
    }
    onFileValidationError_(e) {
        this.$.errorScrim.setErrorMessage(e.detail.errorMessage)
    }
    async deleteContext_(e) {
        if (this.inCreateImageMode_) {
            await this.setCreateImageMode_({
                detail: {
                    inCreateImageMode: true,
                    imagePresent: this.$.context.hasImageFiles()
                }
            })
        }
        this.searchboxHandler_.deleteContext(e.detail.uuid);
        this.$.input.focus();
        this.queryAutocomplete(true)
    }
    async addFileContext_(e) {
        const composeboxFiles = new Map;
        for (const file of e.detail.files) {
            const fileBuffer = await file.arrayBuffer();
            const bigBuffer = {
                bytes: Array.from(new Uint8Array(fileBuffer))
            };
            const {token: token} = await this.searchboxHandler_.addFileContext({
                fileName: file.name,
                mimeType: file.type,
                selectionTime: new Date
            }, bigBuffer);
            const attachment = {
                uuid: token,
                name: file.name,
                objectUrl: e.detail.isImage ? URL.createObjectURL(file) : null,
                type: file.type,
                status: FileUploadStatus$1.kNotUploaded,
                url: null,
                file: file,
                tabId: null
            };
            composeboxFiles.set(token, attachment);
            const announcer = getInstance();
            announcer.announce(this.i18n("composeboxFileUploadStartedText"))
        }
        e.detail.onContextAdded(composeboxFiles);
        this.$.input.focus()
    }
    async addTabContext_(e) {
        const {token: token} = await this.searchboxHandler_.addTabContext(e.detail.id);
        if (!token) {
            return
        }
        const attachment = {
            uuid: token,
            name: e.detail.title,
            objectUrl: null,
            type: "tab",
            status: FileUploadStatus$1.kNotUploaded,
            url: e.detail.url,
            file: null,
            tabId: e.detail.id
        };
        e.detail.onContextAdded(attachment);
        this.$.input.focus()
    }
    async refreshTabSuggestions_() {
        const {tabs: tabs} = await this.searchboxHandler_.getRecentTabs();
        this.tabSuggestions_ = [...tabs]
    }
    async getTabPreview_(e) {
        const {previewDataUrl: previewDataUrl} = await this.searchboxHandler_.getTabPreview(e.detail.tabId);
        e.detail.onPreviewFetched(previewDataUrl || "")
    }
    onCancelClick_() {
        if (this.input_.trim().length > 0 || this.contextFilesSize_ > 0) {
            this.input_ = "";
            this.$.context.resetContextFiles();
            this.contextFilesSize_ = 0;
            this.smartComposeInlineHint_ = "";
            this.submitEnabled_ = false;
            this.searchboxHandler_.clearFiles();
            this.$.input.focus();
            this.queryAutocomplete(true)
        } else {
            this.closeComposebox_()
        }
    }
    onLensClick_() {
        this.pageHandler_.handleLensButtonClick()
    }
    onLensIconMouseDown_(e) {
        e.preventDefault()
    }
    updateInputPlaceholder_() {
        if (this.inDeepSearchMode_) {
            this.inputPlaceholder_ = loadTimeData.getString("composeDeepSearchPlaceholder")
        } else if (this.inCreateImageMode_) {
            this.inputPlaceholder_ = loadTimeData.getString("composeCreateImagePlaceholder")
        } else {
            this.inputPlaceholder_ = loadTimeData.getString("searchboxComposePlaceholder")
        }
    }
    async setDeepSearchMode_(e) {
        this.inDeepSearchMode_ = e.detail.inDeepSearchMode;
        this.pageHandler_.setDeepSearchMode(e.detail.inDeepSearchMode);
        this.queryAutocomplete(true);
        this.updateInputPlaceholder_();
        await this.updateComplete;
        this.$.input.focus()
    }
    async setCreateImageMode_(e) {
        this.inCreateImageMode_ = e.detail.inCreateImageMode;
        this.pageHandler_.setCreateImageMode(e.detail.inCreateImageMode, e.detail.imagePresent);
        this.queryAutocomplete(true);
        this.updateInputPlaceholder_();
        await this.updateComplete;
        this.$.input.focus()
    }
    onErrorScrimVisibilityChanged_(e) {
        this.errorScrimVisible_ = e.detail.showErrorScrim
    }
    handleInput_(e) {
        const inputElement = e.target;
        this.input_ = inputElement.value;
        this.queryAutocomplete(this.input_ === "")
    }
    onKeydown_(e) {
        const KEYDOWN_HANDLED_KEYS = ["ArrowDown", "ArrowUp", "Enter", "Escape", "PageDown", "PageUp", "Tab"];
        if (!KEYDOWN_HANDLED_KEYS.includes(e.key)) {
            return
        }
        if (this.shadowRoot.activeElement === this.$.input) {
            if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !this.showDropdown_) {
                return
            }
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    this.$.matches.unselect()
                } else if (this.smartComposeEnabled_ && this.smartComposeInlineHint_) {
                    this.input_ = this.input_ + this.smartComposeInlineHint_;
                    this.smartComposeInlineHint_ = "";
                    e.preventDefault();
                    this.queryAutocomplete(true)
                }
                return
            }
        }
        if (e.key === "Enter" && this.submitEnabled_) {
            if (this.shadowRoot.activeElement === this.$.matches || !e.shiftKey) {
                e.preventDefault();
                this.submitQuery_(e)
            }
        }
        if (e.key === "Escape" && this.composeboxCloseByEscape_) {
            this.closeComposebox_();
            e.preventDefault();
            return
        }
        if (!this.result_ || this.result_.matches.length === 0) {
            return
        }
        if (hasKeyModifiers(e)) {
            return
        }
        if (e.key === "ArrowDown") {
            this.$.matches.selectNext()
        } else if (e.key === "ArrowUp") {
            this.$.matches.selectPrevious()
        } else if (e.key === "Escape" || e.key === "PageUp") {
            this.$.matches.selectFirst()
        } else if (e.key === "PageDown") {
            this.$.matches.selectLast()
        } else if (e.key === "Tab") {
            if (this.selectedMatchIndex_ === this.result_.matches.length - 1) {
                const focusedMatchElem = this.shadowRoot.activeElement?.shadowRoot?.activeElement;
                const focusedButtonElem = focusedMatchElem?.shadowRoot?.activeElement;
                if (focusedButtonElem?.id === "remove") {
                    this.$.matches.unselect()
                }
            }
            return
        }
        this.smartComposeInlineHint_ = "";
        e.preventDefault();
        if (this.shadowRoot.activeElement === this.$.matches) {
            this.$.matches.focusSelected()
        }
    }
    handleInputFocusIn_() {
        if (this.lastQueriedInput_ && this.result_?.matches.length) {
            this.$.matches.selectFirst()
        }
        if (this.ntpRealboxNextEnabled) {
            this.fire("composebox-input-focus-changed", {
                value: true
            })
        }
    }
    handleInputFocusOut_() {
        if (this.ntpRealboxNextEnabled) {
            this.fire("composebox-input-focus-changed", {
                value: false
            })
        }
    }
    handleComposeboxFocusIn_(e) {
        if (this.$.composebox.contains(e.relatedTarget)) {
            return
        }
        this.expanded_ = true;
        this.submitting_ = false;
        this.pageHandler_.focusChanged(true);
        this.fire("composebox-focus-in")
    }
    handleComposeboxFocusOut_(e) {
        if (this.$.composebox.contains(e.relatedTarget)) {
            return
        }
        this.expanded_ = !this.isCollapsible;
        this.pageHandler_.focusChanged(false);
        this.fire("composebox-focus-out")
    }
    handleScroll_() {
        const smartCompose = this.shadowRoot.querySelector("#smartCompose");
        if (!smartCompose) {
            return
        }
        smartCompose.scrollTop = this.$.input.scrollTop
    }
    handleSubmitFocusIn_() {
        if (this.input_ && !this.selectedMatch_) {
            this.$.matches.selectFirst()
        }
    }
    closeComposebox_() {
        this.resetModes();
        this.fire("close-composebox", {
            composeboxText: this.input_
        });
        if (this.isCollapsible) {
            this.expanded_ = false;
            this.$.input.blur()
        }
    }
    submitQuery_(e) {
        assert(this.selectedMatchIndex_ >= 0 && this.result_ || this.contextFilesSize_ > 0);
        if (this.selectedMatchIndex_ >= 0) {
            const match = this.result_.matches[this.selectedMatchIndex_];
            assert(match);
            this.searchboxHandler_.openAutocompleteMatch(this.selectedMatchIndex_, match.destinationUrl, true, e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey)
        } else {
            this.searchboxHandler_.submitQuery(this.input_.trim(), e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey)
        }
        this.submitting_ = true;
        if (this.isCollapsible) {
            this.setText("");
            this.$.input.blur();
            this.submitEnabled_ = false
        }
    }
    onMatchFocusin_(e) {
        this.$.matches.selectIndex(e.detail.index)
    }
    onMatchClick_() {
        this.clearAutocompleteMatches_()
    }
    onSelectedMatchIndexChanged_(e) {
        this.selectedMatchIndex_ = e.detail.value;
        this.selectedMatch_ = this.result_?.matches[this.selectedMatchIndex_] || null
    }
    clearAutocompleteMatches_() {
        this.showDropdown_ = false;
        this.result_ = null;
        this.$.matches.unselect();
        this.searchboxHandler_.stopAutocomplete(true);
        this.lastQueriedInput_ = ""
    }
    onAutocompleteResultChanged_(result) {
        if (this.lastQueriedInput_ === null || this.lastQueriedInput_.trimStart() !== result.input) {
            return
        }
        this.result_ = result;
        const hasMatches = this.result_.matches.length > 0;
        const firstMatch = hasMatches ? this.result_.matches[0] : null;
        if (firstMatch && firstMatch.allowedToBeDefaultMatch) {
            this.$.matches.selectFirst()
        } else if (this.input_.trim() && hasMatches && this.selectedMatchIndex_ >= 0 && this.selectedMatchIndex_ < this.result_.matches.length) {
            this.$.matches.selectIndex(this.selectedMatchIndex_);
            this.selectedMatch_ = this.result_.matches[this.selectedMatchIndex_];
            this.input_ = this.selectedMatch_.fillIntoEdit
        } else {
            this.$.matches.unselect()
        }
        this.smartComposeInlineHint_ = this.result_.smartComposeInlineHint ? this.result_.smartComposeInlineHint : ""
    }
    async onContextualInputStatusChanged_(token, status, errorType) {
        const {file: file, errorMessage: errorMessage} = this.$.context.updateFileStatus(token, status, errorType);
        if (errorMessage) {
            this.$.errorScrim.setErrorMessage(errorMessage)
        } else if (file) {
            if (status === FileUploadStatus$1.kProcessingSuggestSignalsReady && this.showZps && !file.type.includes("image")) {
                this.queryAutocomplete(true)
            }
            if (status === FileUploadStatus$1.kProcessingSuggestSignalsReady && file.type.includes("image")) {
                if (this.inCreateImageMode_) {
                    await this.setCreateImageMode_({
                        detail: {
                            inCreateImageMode: true,
                            imagePresent: true
                        }
                    })
                } else if (this.enableImageContextualSuggestions_) {
                    this.queryAutocomplete(true)
                } else {
                    this.showDropdown_ = false;
                    this.clearAutocompleteMatches_()
                }
            }
            if (status === FileUploadStatus$1.kUploadSuccessful) {
                const announcer = getInstance();
                announcer.announce(this.i18n("composeboxFileUploadCompleteText"))
            }
        }
    }
    adjustInputForSmartCompose() {
        const smartCompose = this.shadowRoot.querySelector("#smartCompose");
        const ghostHeight = smartCompose.scrollHeight;
        const maxHeight = 190;
        this.$.input.style.height = `${Math.min(ghostHeight, maxHeight)}px`;
        if (ghostHeight > maxHeight) {
            smartCompose.scrollTop = this.$.input.scrollTop
        }
    }
    queryAutocomplete(clearMatches) {
        if (clearMatches) {
            this.clearAutocompleteMatches_()
        }
        this.lastQueriedInput_ = this.input_;
        this.searchboxHandler_.queryAutocomplete(this.input_, false)
    }
}
customElements.define(ComposeboxElement.is, ComposeboxElement);
function recordDuration(metricName, durationMs) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LOG,
        min: 1,
        max: 6e4,
        buckets: 100
    }, Math.floor(durationMs))
}
function recordLoadDuration(metricName, msSinceEpoch) {
    recordDuration(metricName, msSinceEpoch - loadTimeData.getValue("navigationStartTime"))
}
function recordPerdecage(metricName, value) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
        min: 1,
        max: 11,
        buckets: 12
    }, value)
}
function recordOccurrence(metricName) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
        min: 1,
        max: 1,
        buckets: 1
    }, 1)
}
function recordEnumeration(metricName, value, enumSize) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordEnumerationValue(metricName, value, enumSize)
}
function recordBoolean(metricName, value) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordBoolean(metricName, value)
}
function recordSparseValueWithPersistentHash(metricName, value) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordSparseValueWithPersistentHash(metricName, value)
}
function recordSmallCount(metricName, value) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordSmallCount(metricName, value)
}
function recordLogValue(metricName, min, max, buckets, value) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LOG,
        min: min,
        max: max,
        buckets: buckets
    }, value)
}
function recordLinearValue(metricName, min, max, buckets, value) {
    if (!chrome.metricsPrivate) {
        return
    }
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
        min: min,
        max: max,
        buckets: buckets
    }, value)
}
let instance$2 = null;
class ParentTrustedDocumentProxy {
    static getInstance() {
        return instance$2
    }
    static setInstance(childDocument) {
        instance$2 = new ParentTrustedDocumentProxy(childDocument)
    }
    childDocument_;
    constructor(childDocument) {
        this.childDocument_ = childDocument
    }
    getChildDocument() {
        return this.childDocument_
    }
}
const CrSelectableMixin = superClass => {
    class CrSelectableMixin extends superClass {
        static get properties() {
            return {
                attrForSelected: {
                    type: String
                },
                selected: {
                    type: String,
                    notify: true
                },
                selectedAttribute: {
                    type: String
                },
                selectable: {
                    type: String
                }
            }
        }
        #attrForSelected_accessor_storage = null;
        get attrForSelected() {
            return this.#attrForSelected_accessor_storage
        }
        set attrForSelected(value) {
            this.#attrForSelected_accessor_storage = value
        }
        #selectable_accessor_storage;
        get selectable() {
            return this.#selectable_accessor_storage
        }
        set selectable(value) {
            this.#selectable_accessor_storage = value
        }
        #selected_accessor_storage;
        get selected() {
            return this.#selected_accessor_storage
        }
        set selected(value) {
            this.#selected_accessor_storage = value
        }
        #selectedAttribute_accessor_storage = null;
        get selectedAttribute() {
            return this.#selectedAttribute_accessor_storage
        }
        set selectedAttribute(value) {
            this.#selectedAttribute_accessor_storage = value
        }
        selectOnClick = true;
        items_ = [];
        selectedItem_ = null;
        firstUpdated(changedProperties) {
            super.firstUpdated(changedProperties);
            if (this.selectOnClick) {
                this.addEventListener("click", (e => this.onClick_(e)))
            }
            this.observeItems()
        }
        observeItems() {
            this.getSlot().addEventListener("slotchange", ( () => this.itemsChanged()))
        }
        connectedCallback() {
            super.connectedCallback();
            this.updateItems_()
        }
        willUpdate(changedProperties) {
            super.willUpdate(changedProperties);
            if (changedProperties.has("attrForSelected")) {
                if (this.selectedItem_) {
                    assert(this.attrForSelected);
                    const value = this.selectedItem_.getAttribute(this.attrForSelected);
                    assert(value !== null);
                    this.selected = value
                }
            }
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("selected")) {
                this.updateSelectedItem_()
            }
        }
        select(value) {
            this.selected = value
        }
        selectPrevious() {
            const length = this.items_.length;
            let index = length - 1;
            if (this.selected !== undefined) {
                index = (this.valueToIndex_(this.selected) - 1 + length) % length
            }
            this.selected = this.indexToValue_(index)
        }
        selectNext() {
            const index = this.selected === undefined ? 0 : (this.valueToIndex_(this.selected) + 1) % this.items_.length;
            this.selected = this.indexToValue_(index)
        }
        getItemsForTest() {
            return this.items_
        }
        getSlot() {
            const slot = this.shadowRoot.querySelector("slot");
            assert(slot);
            return slot
        }
        queryItems() {
            const selectable = this.selectable === undefined ? "*" : this.selectable;
            return Array.from(this.querySelectorAll(`:scope > ${selectable}`))
        }
        queryMatchingItem(selector) {
            const selectable = this.selectable || "*";
            return this.querySelector(`:scope > :is(${selectable})${selector}`)
        }
        updateItems_() {
            this.items_ = this.queryItems();
            this.items_.forEach(( (item, index) => item.setAttribute("data-selection-index", index.toString())))
        }
        get selectedItem() {
            return this.selectedItem_
        }
        updateSelectedItem_() {
            if (!this.items_) {
                return
            }
            const item = this.selected == null ? null : this.items_[this.valueToIndex_(this.selected)];
            if (!!item && this.selectedItem_ !== item) {
                this.setItemSelected_(this.selectedItem_, false);
                this.setItemSelected_(item, true)
            } else if (!item) {
                this.setItemSelected_(this.selectedItem_, false)
            }
        }
        setItemSelected_(item, isSelected) {
            if (!item) {
                return
            }
            item.classList.toggle("selected", isSelected);
            if (this.selectedAttribute) {
                item.toggleAttribute(this.selectedAttribute, isSelected)
            }
            this.selectedItem_ = isSelected ? item : null;
            this.fire("iron-" + (isSelected ? "select" : "deselect"), {
                item: item
            })
        }
        valueToIndex_(value) {
            if (!this.attrForSelected) {
                return Number(value)
            }
            const match = this.queryMatchingItem(`[${this.attrForSelected}="${value}"]`);
            return match ? Number(match.dataset["selectionIndex"]) : -1
        }
        indexToValue_(index) {
            if (!this.attrForSelected) {
                return index
            }
            const item = this.items_[index];
            if (!item) {
                return index
            }
            return item.getAttribute(this.attrForSelected) || index
        }
        itemsChanged() {
            this.updateItems_();
            this.updateSelectedItem_();
            this.fire("iron-items-changed")
        }
        onClick_(e) {
            let element = e.target;
            while (element && element !== this) {
                const idx = this.items_.indexOf(element);
                if (idx >= 0) {
                    const value = this.indexToValue_(idx);
                    assert(value !== null);
                    this.fire("iron-activate", {
                        item: element,
                        selected: value
                    });
                    this.select(value);
                    return
                }
                element = element.parentNode
            }
        }
    }
    return CrSelectableMixin
}
;
let instance$1 = null;
function getCss$1() {
    return instance$1 || (instance$1 = [...[], css`:host{display:block}:host(:not([show-all]))>::slotted(:not(slot):not(.selected)){display:none !important}`])
}
function getHtml$1() {
    return html`<slot></slot>`
}
const CrPageSelectorElementBase = CrSelectableMixin(CrLitElement);
class CrPageSelectorElement extends CrPageSelectorElementBase {
    static get is() {
        return "cr-page-selector"
    }
    static get styles() {
        return getCss$1()
    }
    static get properties() {
        return {
            hasNestedSlots: {
                type: Boolean
            }
        }
    }
    render() {
        return getHtml$1.bind(this)()
    }
    #hasNestedSlots_accessor_storage = false;
    get hasNestedSlots() {
        return this.#hasNestedSlots_accessor_storage
    }
    set hasNestedSlots(value) {
        this.#hasNestedSlots_accessor_storage = value
    }
    constructor() {
        super();
        this.selectOnClick = false
    }
    queryItems() {
        return this.hasNestedSlots ? Array.from(this.getSlot().assignedElements({
            flatten: true
        })) : super.queryItems()
    }
    queryMatchingItem(selector) {
        if (this.hasNestedSlots) {
            const match = this.queryItems().find((el => el.matches(selector)));
            return match ? match : null
        }
        return super.queryMatchingItem(selector)
    }
    observeItems() {
        if (this.hasNestedSlots) {
            this.addEventListener("slotchange", ( () => this.itemsChanged()))
        }
        super.observeItems()
    }
}
customElements.define(CrPageSelectorElement.is, CrPageSelectorElement);
let instance = null;
function getCss() {
    return instance || (instance = [...[getCss$n()], css`:host{--receiving-audio-color:var(--google-red-500);--speak-shown-duration:2s}.display-stack{display:grid}.display-stack>*{grid-column-start:1;grid-row-start:1}#dialog{align-items:center;background-color:var(--color-new-tab-page-overlay-background);border:none;display:flex;height:100%;justify-content:center;left:0;margin:0;max-height:initial;max-width:initial;padding:0;top:0;width:100%}#closeButton{--cr-icon-button-fill-color:var(--color-new-tab-page-overlay-secondary-foreground);margin:0;position:absolute;top:16px}:host-context([dir='ltr']) #closeButton{right:16px}:host-context([dir='rtl']) #closeButton{left:16px}#content{align-items:center;display:flex;flex-direction:row;width:660px}#texts{color:var(--color-new-tab-page-overlay-secondary-foreground);flex-grow:1;font-size:32px;text-align:start}*[text]{transition-delay:200ms;transition-duration:500ms;transition-property:opacity,padding-inline-start;transition-timing-function:ease-out;visibility:hidden;width:100%}*[text='waiting'],*[text='speak']{opacity:0;overflow-x:hidden;padding-inline-start:50px}*[text][visible]{opacity:1;padding-inline-start:0;visibility:visible}*[text='speak'][visible] #speak{opacity:0;transition:opacity 0ms var(--speak-shown-duration)}*[text='speak'] #listening{opacity:0}*[text='speak'][visible] #listening{opacity:1;transition:opacity 750ms ease-out var(--speak-shown-duration)}#finalResult{color:var(--color-new-tab-page-overlay-foreground)}#errors,#errorLinks{display:inline}#errorLinks a{color:var(--cr-link-color);font-size:18px;font-weight:500;margin-inline-start:0.25em}#micContainer{--mic-button-size:165px;--mic-container-size:300px;align-items:center;flex-shrink:0;height:var(--mic-container-size);justify-items:center;width:var(--mic-container-size)}#micVolume{--mic-volume-size:calc(var(--mic-button-size) + var(--mic-volume-level) * (var(--mic-container-size) - var(--mic-button-size)));align-items:center;background-color:var(--color-new-tab-page-border);border-radius:50%;display:flex;height:var(--mic-volume-size);justify-content:center;transition-duration:var(--mic-volume-duration);transition-property:height,width;transition-timing-function:ease-in-out;width:var(--mic-volume-size)}#micVolumeCutout{background-color:var(--color-new-tab-page-overlay-background);border-radius:50%;height:var(--mic-button-size);width:var(--mic-button-size)}#micIconContainer{align-items:center;border:1px solid var(--color-new-tab-page-mic-border-color);border-radius:50%;display:flex;height:var(--mic-button-size);justify-content:center;transition:background-color 200ms ease-in-out;width:var(--mic-button-size)}@media (forced-colors:active){#micIconContainer{background-color:ButtonText}}.receiving #micIconContainer{background-color:var(--receiving-audio-color);border-color:var(--receiving-audio-color)}#micIcon{-webkit-mask-image:url(icons/mic.svg);-webkit-mask-repeat:no-repeat;-webkit-mask-size:100%;background-color:var(--color-new-tab-page-mic-icon-color);height:80px;transition:background-color 200ms ease-in-out;width:80px}.listening #micIcon{background-color:var(--receiving-audio-color)}.receiving #micIcon{background-color:white}`])
}
function getHtml() {
    return html`<!--_html_template_start_--><dialog id="dialog" @close="${this.onOverlayClose_}"
    @click="${this.onOverlayClick_}" @keydown="${this.onOverlayKeydown_}">
  <div id="content" tabindex="-1">
    <cr-page-selector id="texts" selected="${this.getText_()}" show-all
        attr-for-selected="text" fallback-selection="none" aria-live="polite"
        selected-attribute="visible" class="display-stack">
      <div text="none"></div>
      <div text="waiting">Waiting…</div>
      <div text="speak" class="display-stack">
        <div id="speak">Speak now</div>
        <div id="listening">Listening…</div>
      </div>
      <div text="result" aria-hidden="true">
        <span id="finalResult">${this.finalResult_}</span>
        <span>${this.interimResult_}</span>
      </div>
      <div text="error">
        <cr-page-selector id="errors" selected="${this.getErrorText_()}"
            attr-for-selected="error">
          <span error="no-speech">Please check your microphone and audio levels.</span>
          <span error="audio-capture">Please check your microphone.</span>
          <span error="network">No Internet connection.</span>
          <span error="not-allowed">Voice search has been turned off.</span>
          <span error="language-not-supported">Voice search in your language is not available.</span>
          <span error="no-match">Didn&#39;t get that.</span>
          <span error="other">Unknown error.</span>
        </cr-page-selector>
        <cr-page-selector id="errorLinks" selected="${this.getErrorLink_()}"
            attr-for-selected="link">
          <span link="none"></span>
          <a link="learn-more" target="_blank" href="${this.helpUrl_}"
              @click="${this.onLearnMoreClick_}"
              @keydown="${this.onLinkKeydown_}"
              aria-label="Learn more about using a microphone"><!--
            -->Learn more
          </a>
          <a link="details" target="_blank" href="${this.helpUrl_}"
              @keydown="${this.onLinkKeydown_}"
              aria-label="Learn more about using a microphone"><!--
            -->Details
          </a>
          <a link="try-again" id="retryLink" href="#"
              @click="${this.onTryAgainClick_}"
              @keydown="${this.onLinkKeydown_}"><!--
            -->Try again
          </a>
        </cr-page-selector>
      </div>
    </cr-page-selector>
    <div id="micContainer" class="${this.getMicClass_()} display-stack">
      <div id="micVolume"
          .style="--mic-volume-level: ${this.micVolumeLevel_};
                --mic-volume-duration: ${this.micVolumeDuration_}ms;">
        <div id="micVolumeCutout">
        </div>
      </div>
      <div id="micIconContainer">
        <div id="micIcon"></div>
      </div>
    </div>
  </div>
  <cr-icon-button id="closeButton" class="icon-clear" title="Close">
  </cr-icon-button>
</dialog>
<!--_html_template_end_-->`
}
const RECOGNITION_CONFIDENCE_THRESHOLD = .5;
const QUERY_LENGTH_LIMIT = 120;
const IDLE_TIMEOUT_MS = 8e3;
const ERROR_TIMEOUT_SHORT_MS = 9e3;
const ERROR_TIMEOUT_LONG_MS = 24e3;
const VOLUME_ANIMATION_DURATION_MIN_MS = 170;
const VOLUME_ANIMATION_DURATION_RANGE_MS = 10;
var State;
(function(State) {
    State[State["UNINITIALIZED"] = -1] = "UNINITIALIZED";
    State[State["STARTED"] = 0] = "STARTED";
    State[State["AUDIO_RECEIVED"] = 1] = "AUDIO_RECEIVED";
    State[State["SPEECH_RECEIVED"] = 2] = "SPEECH_RECEIVED";
    State[State["RESULT_RECEIVED"] = 3] = "RESULT_RECEIVED";
    State[State["ERROR_RECEIVED"] = 4] = "ERROR_RECEIVED";
    State[State["RESULT_FINAL"] = 5] = "RESULT_FINAL"
}
)(State || (State = {}));
var Action;
(function(Action) {
    Action[Action["ACTIVATE_SEARCH_BOX"] = 0] = "ACTIVATE_SEARCH_BOX";
    Action[Action["ACTIVATE_KEYBOARD"] = 1] = "ACTIVATE_KEYBOARD";
    Action[Action["CLOSE_OVERLAY"] = 2] = "CLOSE_OVERLAY";
    Action[Action["QUERY_SUBMITTED"] = 3] = "QUERY_SUBMITTED";
    Action[Action["SUPPORT_LINK_CLICKED"] = 4] = "SUPPORT_LINK_CLICKED";
    Action[Action["TRY_AGAIN_LINK"] = 5] = "TRY_AGAIN_LINK";
    Action[Action["TRY_AGAIN_MIC_BUTTON"] = 6] = "TRY_AGAIN_MIC_BUTTON";
    Action[Action["MAX_VALUE"] = 6] = "MAX_VALUE"
}
)(Action || (Action = {}));
var Error$1;
(function(Error) {
    Error[Error["ABORTED"] = 0] = "ABORTED";
    Error[Error["AUDIO_CAPTURE"] = 1] = "AUDIO_CAPTURE";
    Error[Error["BAD_GRAMMAR"] = 2] = "BAD_GRAMMAR";
    Error[Error["LANGUAGE_NOT_SUPPORTED"] = 3] = "LANGUAGE_NOT_SUPPORTED";
    Error[Error["NETWORK"] = 4] = "NETWORK";
    Error[Error["NO_MATCH"] = 5] = "NO_MATCH";
    Error[Error["NO_SPEECH"] = 6] = "NO_SPEECH";
    Error[Error["NOT_ALLOWED"] = 7] = "NOT_ALLOWED";
    Error[Error["OTHER"] = 8] = "OTHER";
    Error[Error["SERVICE_NOT_ALLOWED"] = 9] = "SERVICE_NOT_ALLOWED";
    Error[Error["MAX_VALUE"] = 9] = "MAX_VALUE"
}
)(Error$1 || (Error$1 = {}));
function recordVoiceAction(action) {
    recordEnumeration("NewTabPage.VoiceActions", action, Action.MAX_VALUE + 1)
}
function toError(webkitError) {
    switch (webkitError) {
    case "aborted":
        return Error$1.ABORTED;
    case "audio-capture":
        return Error$1.AUDIO_CAPTURE;
    case "language-not-supported":
        return Error$1.LANGUAGE_NOT_SUPPORTED;
    case "network":
        return Error$1.NETWORK;
    case "no-speech":
        return Error$1.NO_SPEECH;
    case "not-allowed":
        return Error$1.NOT_ALLOWED;
    case "service-not-allowed":
        return Error$1.SERVICE_NOT_ALLOWED;
    case "bad-grammar":
        return Error$1.BAD_GRAMMAR;
    default:
        return Error$1.OTHER
    }
}
function getErrorTimeout(error) {
    switch (error) {
    case Error$1.AUDIO_CAPTURE:
    case Error$1.NO_SPEECH:
    case Error$1.NOT_ALLOWED:
    case Error$1.NO_MATCH:
        return ERROR_TIMEOUT_LONG_MS;
    default:
        return ERROR_TIMEOUT_SHORT_MS
    }
}
class VoiceSearchOverlayElement extends CrLitElement {
    static get is() {
        return "ntp-voice-search-overlay"
    }
    static get styles() {
        return getCss()
    }
    render() {
        return getHtml.bind(this)()
    }
    static get properties() {
        return {
            interimResult_: {
                type: String
            },
            finalResult_: {
                type: String
            },
            state_: {
                type: Number
            },
            helpUrl_: {
                type: String
            },
            micVolumeLevel_: {
                type: Number
            },
            micVolumeDuration_: {
                type: Number
            }
        }
    }
    #interimResult__accessor_storage = "";
    get interimResult_() {
        return this.#interimResult__accessor_storage
    }
    set interimResult_(value) {
        this.#interimResult__accessor_storage = value
    }
    #finalResult__accessor_storage = "";
    get finalResult_() {
        return this.#finalResult__accessor_storage
    }
    set finalResult_(value) {
        this.#finalResult__accessor_storage = value
    }
    #state__accessor_storage = State.UNINITIALIZED;
    get state_() {
        return this.#state__accessor_storage
    }
    set state_(value) {
        this.#state__accessor_storage = value
    }
    #helpUrl__accessor_storage = `https://support.google.com/chrome/?p=ui_voice_search&hl=${window.navigator.language}`;
    get helpUrl_() {
        return this.#helpUrl__accessor_storage
    }
    set helpUrl_(value) {
        this.#helpUrl__accessor_storage = value
    }
    #micVolumeLevel__accessor_storage = 0;
    get micVolumeLevel_() {
        return this.#micVolumeLevel__accessor_storage
    }
    set micVolumeLevel_(value) {
        this.#micVolumeLevel__accessor_storage = value
    }
    #micVolumeDuration__accessor_storage = VOLUME_ANIMATION_DURATION_MIN_MS;
    get micVolumeDuration_() {
        return this.#micVolumeDuration__accessor_storage
    }
    set micVolumeDuration_(value) {
        this.#micVolumeDuration__accessor_storage = value
    }
    voiceRecognition_;
    error_ = null;
    timerId_ = null;
    constructor() {
        super();
        this.voiceRecognition_ = new window.webkitSpeechRecognition;
        this.voiceRecognition_.continuous = false;
        this.voiceRecognition_.interimResults = true;
        this.voiceRecognition_.lang = window.navigator.language;
        this.voiceRecognition_.onaudiostart = this.onAudioStart_.bind(this);
        this.voiceRecognition_.onspeechstart = this.onSpeechStart_.bind(this);
        this.voiceRecognition_.onresult = this.onResult_.bind(this);
        this.voiceRecognition_.onend = this.onEnd_.bind(this);
        this.voiceRecognition_.onerror = e => {
            this.onError_(toError(e.error))
        }
        ;
        this.voiceRecognition_.onnomatch = () => {
            this.onError_(Error$1.NO_MATCH)
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.$.dialog.showModal();
        this.start()
    }
    start() {
        this.voiceRecognition_.start();
        this.state_ = State.STARTED;
        this.resetIdleTimer_()
    }
    onOverlayClose_() {
        this.voiceRecognition_.abort();
        this.dispatchEvent(new Event("close"))
    }
    onOverlayClick_() {
        this.$.dialog.close();
        recordVoiceAction(Action.CLOSE_OVERLAY)
    }
    onOverlayKeydown_(e) {
        if (["Enter", " "].includes(e.key) && this.finalResult_) {
            this.onFinalResult_()
        } else if (e.key === "Escape") {
            this.onOverlayClick_()
        }
    }
    onLinkKeydown_(e) {
        if (!["Enter", " "].includes(e.key)) {
            return
        }
        e.stopPropagation();
        e.preventDefault();
        e.target.click()
    }
    onLearnMoreClick_() {
        recordVoiceAction(Action.SUPPORT_LINK_CLICKED)
    }
    onTryAgainClick_(e) {
        e.stopPropagation();
        this.start();
        recordVoiceAction(Action.TRY_AGAIN_LINK)
    }
    resetIdleTimer_() {
        WindowProxy.getInstance().clearTimeout(this.timerId_);
        this.timerId_ = WindowProxy.getInstance().setTimeout(this.onIdleTimeout_.bind(this), IDLE_TIMEOUT_MS)
    }
    onIdleTimeout_() {
        if (this.state_ === State.RESULT_FINAL) {
            return
        }
        if (this.finalResult_) {
            this.onFinalResult_();
            return
        }
        this.voiceRecognition_.abort();
        this.onError_(Error$1.NO_MATCH)
    }
    resetErrorTimer_(duration) {
        WindowProxy.getInstance().clearTimeout(this.timerId_);
        this.timerId_ = WindowProxy.getInstance().setTimeout(( () => {
            this.$.dialog.close()
        }
        ), duration)
    }
    onAudioStart_() {
        this.resetIdleTimer_();
        this.state_ = State.AUDIO_RECEIVED
    }
    onSpeechStart_() {
        this.resetIdleTimer_();
        this.state_ = State.SPEECH_RECEIVED;
        this.animateVolume_()
    }
    onResult_(e) {
        this.resetIdleTimer_();
        switch (this.state_) {
        case State.STARTED:
            this.onAudioStart_();
            this.onSpeechStart_();
            break;
        case State.AUDIO_RECEIVED:
            this.onSpeechStart_();
            break;
        case State.SPEECH_RECEIVED:
        case State.RESULT_RECEIVED:
            break;
        default:
            return
        }
        const results = e.results;
        if (results.length === 0) {
            return
        }
        this.state_ = State.RESULT_RECEIVED;
        this.interimResult_ = "";
        this.finalResult_ = "";
        const speechResult = results[e.resultIndex];
        assert(speechResult);
        if (!!speechResult && speechResult.isFinal) {
            this.finalResult_ = speechResult[0].transcript;
            this.onFinalResult_();
            return
        }
        for (let j = 0; j < results.length; j++) {
            const resultList = results[j];
            const result = resultList[0];
            assert(result);
            if (result.confidence > RECOGNITION_CONFIDENCE_THRESHOLD) {
                this.finalResult_ += result.transcript
            } else {
                this.interimResult_ += result.transcript
            }
        }
        if (this.interimResult_.length > QUERY_LENGTH_LIMIT) {
            this.onFinalResult_()
        }
    }
    onFinalResult_() {
        if (!this.finalResult_) {
            this.onError_(Error$1.NO_MATCH);
            return
        }
        this.state_ = State.RESULT_FINAL;
        const searchParams = new URLSearchParams;
        searchParams.append("q", this.finalResult_);
        searchParams.append("gs_ivs", "1");
        const queryUrl = new URL("/search",loadTimeData.getString("googleBaseUrl"));
        queryUrl.search = searchParams.toString();
        recordVoiceAction(Action.QUERY_SUBMITTED);
        WindowProxy.getInstance().navigate(queryUrl.href)
    }
    onEnd_() {
        switch (this.state_) {
        case State.STARTED:
            this.onError_(Error$1.AUDIO_CAPTURE);
            return;
        case State.AUDIO_RECEIVED:
            this.onError_(Error$1.NO_SPEECH);
            return;
        case State.SPEECH_RECEIVED:
        case State.RESULT_RECEIVED:
            this.onError_(Error$1.NO_MATCH);
            return;
        case State.ERROR_RECEIVED:
        case State.RESULT_FINAL:
            return;
        default:
            this.onError_(Error$1.OTHER);
            return
        }
    }
    onError_(error) {
        recordEnumeration("NewTabPage.VoiceErrors", error, Error$1.MAX_VALUE + 1);
        if (error === Error$1.ABORTED) {
            return
        }
        this.error_ = error;
        this.state_ = State.ERROR_RECEIVED;
        this.resetErrorTimer_(getErrorTimeout(error))
    }
    animateVolume_() {
        this.micVolumeLevel_ = 0;
        this.micVolumeDuration_ = VOLUME_ANIMATION_DURATION_MIN_MS;
        if (this.state_ !== State.SPEECH_RECEIVED && this.state_ !== State.RESULT_RECEIVED) {
            return
        }
        this.micVolumeLevel_ = WindowProxy.getInstance().random();
        this.micVolumeDuration_ = Math.round(VOLUME_ANIMATION_DURATION_MIN_MS + WindowProxy.getInstance().random() * VOLUME_ANIMATION_DURATION_RANGE_MS);
        WindowProxy.getInstance().setTimeout(this.animateVolume_.bind(this), this.micVolumeDuration_)
    }
    getText_() {
        switch (this.state_) {
        case State.STARTED:
            return "waiting";
        case State.AUDIO_RECEIVED:
        case State.SPEECH_RECEIVED:
            return "speak";
        case State.RESULT_RECEIVED:
        case State.RESULT_FINAL:
            return "result";
        case State.ERROR_RECEIVED:
            return "error";
        default:
            return "none"
        }
    }
    getErrorText_() {
        switch (this.error_) {
        case Error$1.NO_SPEECH:
            return "no-speech";
        case Error$1.AUDIO_CAPTURE:
            return "audio-capture";
        case Error$1.NETWORK:
            return "network";
        case Error$1.NOT_ALLOWED:
        case Error$1.SERVICE_NOT_ALLOWED:
            return "not-allowed";
        case Error$1.LANGUAGE_NOT_SUPPORTED:
            return "language-not-supported";
        case Error$1.NO_MATCH:
            return "no-match";
        case Error$1.ABORTED:
        case Error$1.OTHER:
        default:
            return "other"
        }
    }
    getErrorLink_() {
        switch (this.error_) {
        case Error$1.NO_SPEECH:
        case Error$1.AUDIO_CAPTURE:
            return "learn-more";
        case Error$1.NOT_ALLOWED:
        case Error$1.SERVICE_NOT_ALLOWED:
            return "details";
        case Error$1.NO_MATCH:
            return "try-again";
        default:
            return "none"
        }
    }
    getMicClass_() {
        switch (this.state_) {
        case State.AUDIO_RECEIVED:
            return "listening";
        case State.SPEECH_RECEIVED:
        case State.RESULT_RECEIVED:
            return "receiving";
        default:
            return ""
        }
    }
}
customElements.define(VoiceSearchOverlayElement.is, VoiceSearchOverlayElement);
function checkTransparency(buffer) {
    const view = new DataView(buffer);
    return isTransparentPNG(view) || isTransparentBMP(view) || isTransparentWebP(view)
}
function getUint8FromView(view, offset) {
    try {
        return view.getUint8(offset)
    } catch {
        return null
    }
}
function getUint16FromView(view, offset) {
    try {
        return view.getUint16(offset)
    } catch {
        return null
    }
}
function getUint32FromView(view, offset) {
    try {
        return view.getUint32(offset)
    } catch {
        return null
    }
}
function isPNG(view) {
    return getUint32FromView(view, 0) === 2303741511 && getUint32FromView(view, 4) === 218765834
}
function isTransparentPNG(view) {
    if (!isPNG(view)) {
        return false
    }
    const type = getUint8FromView(view, 25);
    return type === 4 || type === 6
}
function isWebP(view) {
    return getUint32FromView(view, 0) === 1380533830 && getUint32FromView(view, 8) === 1464156752
}
function isTransparentWebP(view) {
    if (!isWebP(view)) {
        return false
    }
    const format = getUint8FromView(view, 15);
    return format === 88 || format === 76
}
function isBMP(view) {
    return getUint16FromView(view, 0) === 16973
}
function isTransparentBMP(view) {
    if (!isBMP(view)) {
        return false
    }
    return getUint16FromView(view, 28) === 50
}
const SUPPORTED_FILE_TYPES = ["image/bmp", "image/heic", "image/heif", "image/jpeg", "image/png", "image/tiff", "image/webp", "image/x-icon"];
const MIME_TYPE_TO_EXTENSION_MAP = new Map([["image/png", ".png"], ["image/webp", ".webp"], ["image/bmp", ".bmp"], ["image/heif", ".heif"], ["image/jpeg", ".jpg"], ["image/tiff", ".tif"], ["image/heic", ".heic"], ["image/x-icon", ".ico"]]);
const MAX_LONGEST_EDGE_PIXELS = 1e3;
const TRANSPARENCY_FILL_BG_COLOR = "#ffffff";
const JPEG_QUALITY = .4;
const DEFAULT_MIME_TYPE = "image/jpeg";
async function processFile(file, maxLongestEdgePixels=MAX_LONGEST_EDGE_PIXELS) {
    const image = await readImageFile(file);
    if (!image) {
        return {
            processedFile: file
        }
    }
    const originalImageWidth = image.width;
    const originalImageHeight = image.height;
    const hasTransparency = checkTransparency(await file.arrayBuffer());
    const blobInfo = await processImage(image, DEFAULT_MIME_TYPE, hasTransparency, maxLongestEdgePixels);
    if (!blobInfo || !blobInfo.blob) {
        return {
            processedFile: file,
            imageWidth: originalImageWidth,
            imageHeight: originalImageHeight
        }
    }
    const processedImage = blobInfo.blob;
    let imageWidth = blobInfo.imageWidth;
    let imageHeight = blobInfo.imageHeight;
    const lastDot = file.name.lastIndexOf(".");
    const fileName = `${lastDot > 0 ? file.name.slice(0, lastDot) : file.name}${MIME_TYPE_TO_EXTENSION_MAP.get(processedImage.type)}`;
    let processedFile = new File([processedImage],fileName,{
        lastModified: Date.now(),
        type: processedImage.type
    });
    if (processedFile.size > file.size) {
        processedFile = file;
        imageWidth = originalImageWidth;
        imageHeight = originalImageHeight
    }
    return {
        processedFile: processedFile,
        imageWidth: imageWidth,
        imageHeight: imageHeight
    }
}
async function readImageFile(file) {
    const dataUrl = await readAsDataURL(file);
    if (!dataUrl || dataUrl instanceof ArrayBuffer) {
        return null
    }
    return createImageFromDataUrl(dataUrl)
}
function processImage(image, mimeType, hasTransparency, maxLongestEdgePixels) {
    const [width,height] = getDimensions(image, maxLongestEdgePixels);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true
    });
    if (!context) {
        return null
    }
    if (hasTransparency) {
        fillBackground(context, canvas.width, canvas.height, TRANSPARENCY_FILL_BG_COLOR)
    }
    context.drawImage(image, 0, 0, width, height);
    return toBlob(canvas, mimeType, JPEG_QUALITY, width, height)
}
function getDimensions(image, maxLongestEdgePixels) {
    let width = image.width;
    let height = image.height;
    if (maxLongestEdgePixels && (width > maxLongestEdgePixels || height > maxLongestEdgePixels)) {
        const downscaleRatio = Math.min(maxLongestEdgePixels / width, maxLongestEdgePixels / height);
        width *= downscaleRatio;
        height *= downscaleRatio
    }
    return [Math.floor(width), Math.floor(height)]
}
function fillBackground(context, canvasWidth, canvasHeight, backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight)
}
function toBlob(canvas, type, encodingCompressionRatio, imageWidth, imageHeight) {
    return new Promise((resolve => {
        canvas.toBlob((result => {
            if (result) {
                resolve({
                    blob: result,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight
                })
            } else {
                resolve({
                    blob: null,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight
                })
            }
        }
        ), type, encodingCompressionRatio)
    }
    ))
}
function readAsDataURL(file) {
    const fileReader = new FileReader;
    const promise = new Promise((resolve => {
        fileReader.onloadend = () => {
            resolve(fileReader.result)
        }
        ;
        fileReader.onerror = () => {
            resolve(null)
        }
    }
    ));
    fileReader.readAsDataURL(file);
    return promise
}
function createImageFromDataUrl(dataUrl) {
    const image = new Image;
    const promise = new Promise((resolve => {
        image.onload = () => {
            resolve(image)
        }
        ;
        image.onerror = () => {
            resolve(null)
        }
    }
    ));
    image.src = dataUrl;
    return promise
}
export {SUPPORTED_FILE_TYPES as $, Action as A, BrowserCommandProxy as B, ComposeboxMode as C, getTrustedScriptURL as D, EventTracker as E, FileUploadStatus as F, CustomizeButtonsElement as G, CrAutoImgElement as H, I18nMixinLit as I, processFile as J, recordLogValue as K, recordOccurrence as L, recordPerdecage as M, NavigationPredictor as N, recordSmallCount as O, PageHandler as P, checkTransparency as Q, RenderType as R, SideType as S, isBMP as T, isPNG as U, isWebP as V, WindowProxy as W, Error$1 as X, CrRippleMixin as Y, getFaviconForPageURL as Z, isMac as _, getFaviconUrl as a, ComposeboxElement as a0, ComposeboxProxyImpl as a1, ComposeboxFileCarouselElement as a2, ComposeboxFileThumbnailElement as a3, ActionChipsElement as a4, VoiceSearchOverlayElement as a5, getCss$m as b, PageCallbackRouter as c, getCss$n as d, assertNotReached as e, SelectionLineState as f, getCss$r as g, assert as h, hasKeyModifiers as i, NewTabPageProxy as j, skColorToRgba as k, getTrustedHTML as l, debounceEnd as m, isWindows as n, ParentTrustedDocumentProxy as o, recordDuration as p, FocusOutlineManager as q, recordLinearValue as r, sanitizeInnerHtml as s, recordBoolean as t, recordLoadDuration as u, recordVoiceAction as v, recordSparseValueWithPersistentHash as w, recordEnumeration as x, hexColorToSkColor as y, Command as z};
