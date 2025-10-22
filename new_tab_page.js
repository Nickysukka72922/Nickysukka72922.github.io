// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import {I as I18nMixinLit, g as getCss$d, a as getFaviconUrl, b as getCss$e, s as sanitizeInnerHtml, P as PageHandler, c as PageCallbackRouter, d as getCss$f, e as assertNotReached, S as SideType, R as RenderType, f as SelectionLineState, N as NavigationPredictor, h as assert, i as hasKeyModifiers, F as FileUploadStatus, C as ComposeboxMode, W as WindowProxy, E as EventTracker, j as NewTabPageProxy, k as skColorToRgba, l as getTrustedHTML, m as debounceEnd, n as isWindows, r as recordLinearValue, o as ParentTrustedDocumentProxy, p as recordDuration, q as FocusOutlineManager, t as recordBoolean, u as recordLoadDuration, v as recordVoiceAction, A as Action, w as recordSparseValueWithPersistentHash, x as recordEnumeration, y as hexColorToSkColor, z as Command, B as BrowserCommandProxy, D as getTrustedScriptURL} from "./shared.rollup.js";
export {H as CrAutoImgElement, G as CustomizeButtonsElement, X as VoiceError, Q as checkTransparency, T as isBMP, U as isPNG, V as isWebP, J as processFile, K as recordLogValue, L as recordOccurrence, M as recordPerdecage, O as recordSmallCount} from "./shared.rollup.js";
import {loadTimeData} from "chrome://resources/js/load_time_data.js";
import {css, html, CrLitElement, nothing} from "chrome://resources/lit/v3_0/lit.rollup.js";
import {mojo} from "chrome://resources/mojo/mojo/public/js/bindings.js";
import {TimeDeltaSpec} from "chrome://resources/mojo/mojo/public/mojom/base/time.mojom-webui.js";
let instance$j = null;
function getCss$c() {
    return instance$j || (instance$j = [...[], css`:host{--cr-hover-background-color:#FFFFFF;--cr-button-height:32px}#composeButton{background-color:#F3F5F6;color:#1F1F1F;font-weight:400;font-family:inherit;font-size:inherit;border:none;position:relative;gap:3px}.compose-container{z-index:100;position:relative;padding-inline-end:12px;padding-inline-start:8px}.compose-icon{filter:invert(1);vertical-align:text-bottom;height:18px;width:18px;padding-top:2px;padding-left:1px}#glowAnimationWrapper{--anim-duration:2s;--glif-angle-start:99deg;--glif-angle-range:245deg;--mask-angle-start:-150deg;--mask-angle-range:355deg;--acceleration:cubic-bezier(0.4,0,0.2,1);--glif-gradient:conic-gradient(rgba(52,168,82,0) 0deg,rgba(52,168,82,1) 38.9738deg,rgba(255,211,20,1) 62.3678deg,rgba(255,70,65,1) 87.0062deg,rgba(49,134,255,1) 107.428deg,rgba(49,134,255,0.5) 204.48deg,rgba(49,134,255,0) 308.88deg,rgba(52,168,82,0) 360deg);--mask-gradient:conic-gradient(transparent,16.56deg,273.24deg,transparent 333.36deg,transparent 360deg)}@keyframes rotate-glif-anim{from{rotate:var(--glif-angle-start)}to{rotate:calc(var(--glif-angle-start) + var(--glif-angle-range))}}@keyframes rotate-mask-anim{from{rotate:var(--mask-angle-start)}to{rotate:calc(var(--mask-angle-start) + var(--mask-angle-range))}}@keyframes rotate-glif-anim-infinite{from{rotate:var(--glif-angle-start)}to{rotate:calc(var(--glif-angle-start) + 360deg)}}@keyframes rotate-mask-anim-infinite{from{rotate:var(--mask-angle-start)}to{rotate:calc(var(--mask-angle-start) + 360deg)}}@keyframes fade-in-out{0%{opacity:0}10%{opacity:1}60%{opacity:1}100%{opacity:0}}@keyframes fade-in-out-infinite{0%{opacity:0}10%{opacity:1}60%{opacity:1}100%{opacity:1}}.glow-container{height:36px;padding:0 2px;display:flex;align-items:center;border-radius:100px;position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:100}:host-context([dir='rtl']) .glow-container{left:8px;right:unset}:host-context([ntp-realbox-next-enabled]){--cr-button-height:36px}:host-context([ntp-realbox-next-enabled]) #composeButton{font-size:13px;font-weight:500}:host-context([ntp-realbox-next-enabled]) .glow-container{height:var(--cr-searchbox-icon-size)}:host-context([realbox-layout-mode^='Tall']) .glow-container{top:var(--cr-searchbox-compose-button-position-top);transform:none}.gradient-and-mask-wrapper{overflow:hidden;position:absolute;inset:0;border-radius:100px;opacity:0;pointer-events:none}.play .gradient-and-mask-wrapper{opacity:1;pointer-events:auto}#glowAnimationWrapper:hover .gradient-and-mask-wrapper{opacity:1;pointer-events:auto}.outer-glow{filter:blur(40px)}#glowAnimationWrapper:hover .outer-glow{filter:none}.gradient,.mask{position:absolute;inset:0;transform-origin:center;translate:0 -50%;top:50%;scale:1.1 0.6;border-radius:50%;aspect-ratio:1/1}.gradient:before,.mask:before{content:'';position:absolute;inset:0;transform-origin:center}.gradient:before{background:var(--glif-gradient);rotate:var(--glif-angle-start)}.play .gradient:before{animation:rotate-glif-anim var(--anim-duration) var(--acceleration) forwards,fade-in-out var(--anim-duration) linear forwards}.mask:before{background:var(--mask-gradient);rotate:var(--mask-angle-start)}.play .mask:before{animation:rotate-mask-anim var(--anim-duration) var(--acceleration) forwards}#glowAnimationWrapper:hover .mask:before{--anim-duration:8s;animation:rotate-mask-anim-infinite var(--anim-duration) linear infinite,fade-in-out-infinite var(--anim-duration) linear forwards}#glowAnimationWrapper:hover .gradient:before{--anim-duration:8s;animation:rotate-glif-anim-infinite var(--anim-duration) linear infinite,fade-in-out-infinite var(--anim-duration) linear forwards}`])
}
function getHtml$b() {
    return html`<!--_html_template_start_-->
<div id="glowAnimationWrapper" class="glow-container play">
  <div class="gradient-and-mask-wrapper outer-glow">
    <div class="gradient"></div>
    <div class="mask"></div>
  </div>
  <div class="gradient-and-mask-wrapper">
    <div class="gradient"></div>
    <div class="mask"></div>
  </div>
  <cr-button @click="${this.onClick_}" id="composeButton"
      class="compose-container"
      title="${this.i18n("searchboxComposeButtonTitle")}">
    <img slot="prefix-icon" src="${this.composeIcon_}" class="compose-icon">
    ${this.i18n("searchboxComposeButtonText")}
  </cr-button>
</div>
<!--_html_template_end_-->`
}
const SearchboxComposeButtonElementBase = I18nMixinLit(CrLitElement);
class SearchboxComposeButtonElement extends SearchboxComposeButtonElementBase {
    static get is() {
        return "cr-searchbox-compose-button"
    }
    static get styles() {
        return getCss$c()
    }
    render() {
        return getHtml$b.bind(this)()
    }
    static get properties() {
        return {
            composeIcon_: {
                type: String,
                reflect: true
            },
            showAnimation_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    #composeIcon__accessor_storage = "//resources/cr_components/searchbox/icons/search_spark.svg";
    get composeIcon_() {
        return this.#composeIcon__accessor_storage
    }
    set composeIcon_(value) {
        this.#composeIcon__accessor_storage = value
    }
    #showAnimation__accessor_storage = loadTimeData.getBoolean("searchboxShowComposeAnimation");
    get showAnimation_() {
        return this.#showAnimation__accessor_storage
    }
    set showAnimation_(value) {
        this.#showAnimation__accessor_storage = value
    }
    firstUpdated() {
        if (this.$.glowAnimationWrapper) {
            if (!this.showAnimation_) {
                this.$.glowAnimationWrapper.classList.remove("play")
            } else {
                this.$.glowAnimationWrapper.addEventListener("animationend", ( () => {
                    this.$.glowAnimationWrapper.classList.remove("play")
                }
                ))
            }
        }
    }
    onClick_(e) {
        e.preventDefault();
        this.fire("compose-click", {
            button: e.button,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey
        })
    }
}
customElements.define(SearchboxComposeButtonElement.is, SearchboxComposeButtonElement);
let instance$i = null;
function getCss$b() {
    return instance$i || (instance$i = [...[getCss$d()], css`:host{--cr-searchbox-icon-border-radius:8px;align-items:center;display:flex;flex-shrink:0;justify-content:center;width:var(--cr-searchbox-icon-container-size,32px)}:host(:not([is-lens-searchbox_])){--cr-searchbox-icon-border-radius:4px}#container{align-items:center;aspect-ratio:1/1;border-radius:var(--cr-searchbox-icon-border-radius);display:flex;justify-content:center;overflow:hidden;position:relative;width:100%}:host([has-image_]:not([in-searchbox]):not([is-weather-answer])) #container{background-color:var(--color-searchbox-results-icon-container-background,var(--container-bg-color))}:host([has-icon-container-background]:not([in-searchbox])) #container{background-color:var(--color-searchbox-answer-icon-background)}:host([is-weather-answer]:not([in-searchbox])) #container{background-color:var(--color-searchbox-results-background)}#image{display:none;height:100%;object-fit:contain;width:100%}:host([has-image_]:not([in-searchbox])) #image{display:initial}:host([is-answer]) #image{max-height:24px;max-width:24px}#icon{height:24px;width:24px}#faviconImageContainer{width:24px;height:24px;display:flex;justify-content:center;align-items:center}#faviconImage{height:16px;width:16px}#icon{-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:var(--cr-searchbox-results-search-icon-size,16px);background-color:var(--color-searchbox-search-icon-background)}:host([in-searchbox][is-lens-searchbox_]) #icon{background-color:var(--color-searchbox-google-g-background);height:var(--cr-searchbox-icon-size-in-searchbox);width:var(--cr-searchbox-icon-size-in-searchbox)}@media (forced-colors:active){:host([in-searchbox][is-lens-searchbox_]) #icon{background-color:ButtonText}}:host([in-searchbox][favicon-image_*='//resources/cr_components/omnibox/icons/google_g.svg']) #faviconImage{width:24px;height:24px}:host([in-searchbox]) #icon{-webkit-mask-size:var(--cr-searchbox-icon-size-in-searchbox)}:host([in-searchbox]) #faviconImage{width:var(--cr-searchbox-icon-size-in-searchbox);height:var(--cr-searchbox-icon-size-in-searchbox)}:host([has-icon-container-background]:not([in-searchbox])) #icon{background-color:var(--color-searchbox-answer-icon-foreground)}:host([has-icon-container-background][is-starter-pack]:not([in-searchbox])) #icon,:host([has-icon-container-background][is-featured-enterprise-search]:not([in-searchbox])) #icon{background-color:var(--color-searchbox-results-starter-pack-icon,var(--color-searchbox-answer-icon-foreground))}#iconImg{height:var(--cr-searchbox-results-search-icon-size,16px);width:var(--cr-searchbox-results-search-icon-size,16px)}:host([in-searchbox]) #iconImg{height:var(--cr-searchbox-icon-size-in-searchbox);width:var(--cr-searchbox-icon-size-in-searchbox)}:host([has-image_]:not([in-searchbox])) #icon,:host([has-image_]:not([in-searchbox])) #iconImg,:host([has-image_]:not([in-searchbox])) #faviconImageContainer{display:none}:host(:not([in-searchbox])[is-lens-searchbox_]) #container{background-color:var(--color-searchbox-results-icon-container-background);border-radius:4000px}`])
}
function getHtml$a() {
    return html`<!--_html_template_start_-->
<div id="container"
    style="--container-bg-color:${this.getContainerBgColor_()};">
  <img id="image" src="${this.imageSrc_}" ?hidden="${!this.showImage_}"
      @load="${this.onImageLoad_}" @error="${this.onImageError_}">

  <div ?hidden="${this.showIconImg_}">
    <div id="icon" style="-webkit-mask-image: ${this.maskImage};"
        ?hidden="${this.showFaviconImage_}">
    </div>
    <div id="faviconImageContainer"
        ?hidden="${!this.showFaviconImage_}">
      <img id="faviconImage" src="${this.faviconImage_}"
          srcset="${this.faviconImageSrcSet_}"
          @load="${this.onFaviconLoad_}"
          @error="${this.onFaviconError_}">
    </div>
  </div>

  <img id="iconImg" src="${this.iconSrc_}" ?hidden="${!this.showIconImg_}"
      @load="${this.onIconLoad_}">
</div>
<!--_html_template_end_-->`
}
const CALCULATOR = "search-calculator-answer";
const DOCUMENT_MATCH_TYPE = "document";
const FEATURED_ENTERPRISE_SEARCH = "featured-enterprise-search";
const HISTORY_CLUSTER_MATCH_TYPE = "history-cluster";
const PEDAL = "pedal";
const STARTER_PACK = "starter-pack";
class SearchboxIconElement extends CrLitElement {
    static get is() {
        return "cr-searchbox-icon"
    }
    static get styles() {
        return getCss$b()
    }
    render() {
        return getHtml$a.bind(this)()
    }
    static get properties() {
        return {
            defaultIcon: {
                type: String
            },
            hasIconContainerBackground: {
                type: Boolean,
                reflect: true
            },
            inSearchbox: {
                type: Boolean,
                reflect: true
            },
            isAnswer: {
                type: Boolean,
                reflect: true
            },
            isStarterPack: {
                type: Boolean,
                reflect: true
            },
            isFeaturedEnterpriseSearch: {
                type: Boolean,
                reflect: true
            },
            isWeatherAnswer: {
                type: Boolean,
                reflect: true
            },
            isEnterpriseSearchAggregatorPeopleType: {
                type: Boolean,
                reflect: true
            },
            maskImage: {
                type: String,
                reflect: true
            },
            match: {
                type: Object
            },
            faviconImage_: {
                type: String,
                reflect: true
            },
            faviconImageSrcSet_: {
                state: true,
                type: String
            },
            hasImage_: {
                type: Boolean,
                reflect: true
            },
            showFaviconImage_: {
                state: true,
                type: Boolean
            },
            faviconLoading_: {
                state: true,
                type: Boolean
            },
            faviconError_: {
                state: true,
                type: Boolean
            },
            iconSrc_: {
                state: true,
                type: String
            },
            iconLoading_: {
                state: true,
                type: Boolean
            },
            showIconImg_: {
                state: true,
                type: Boolean
            },
            showImage_: {
                state: true,
                type: Boolean
            },
            imageSrc_: {
                state: true,
                type: String
            },
            imageLoading_: {
                state: true,
                type: Boolean
            },
            imageError_: {
                state: true,
                type: Boolean
            },
            isTopChromeSearchbox_: {
                state: true,
                type: Boolean
            },
            isLensSearchbox_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    #defaultIcon_accessor_storage = "";
    get defaultIcon() {
        return this.#defaultIcon_accessor_storage
    }
    set defaultIcon(value) {
        this.#defaultIcon_accessor_storage = value
    }
    #hasIconContainerBackground_accessor_storage = false;
    get hasIconContainerBackground() {
        return this.#hasIconContainerBackground_accessor_storage
    }
    set hasIconContainerBackground(value) {
        this.#hasIconContainerBackground_accessor_storage = value
    }
    #inSearchbox_accessor_storage = false;
    get inSearchbox() {
        return this.#inSearchbox_accessor_storage
    }
    set inSearchbox(value) {
        this.#inSearchbox_accessor_storage = value
    }
    #isAnswer_accessor_storage = false;
    get isAnswer() {
        return this.#isAnswer_accessor_storage
    }
    set isAnswer(value) {
        this.#isAnswer_accessor_storage = value
    }
    #isStarterPack_accessor_storage = false;
    get isStarterPack() {
        return this.#isStarterPack_accessor_storage
    }
    set isStarterPack(value) {
        this.#isStarterPack_accessor_storage = value
    }
    #isFeaturedEnterpriseSearch_accessor_storage = false;
    get isFeaturedEnterpriseSearch() {
        return this.#isFeaturedEnterpriseSearch_accessor_storage
    }
    set isFeaturedEnterpriseSearch(value) {
        this.#isFeaturedEnterpriseSearch_accessor_storage = value
    }
    #isWeatherAnswer_accessor_storage = false;
    get isWeatherAnswer() {
        return this.#isWeatherAnswer_accessor_storage
    }
    set isWeatherAnswer(value) {
        this.#isWeatherAnswer_accessor_storage = value
    }
    #isEnterpriseSearchAggregatorPeopleType_accessor_storage = false;
    get isEnterpriseSearchAggregatorPeopleType() {
        return this.#isEnterpriseSearchAggregatorPeopleType_accessor_storage
    }
    set isEnterpriseSearchAggregatorPeopleType(value) {
        this.#isEnterpriseSearchAggregatorPeopleType_accessor_storage = value
    }
    #maskImage_accessor_storage = "";
    get maskImage() {
        return this.#maskImage_accessor_storage
    }
    set maskImage(value) {
        this.#maskImage_accessor_storage = value
    }
    #match_accessor_storage = null;
    get match() {
        return this.#match_accessor_storage
    }
    set match(value) {
        this.#match_accessor_storage = value
    }
    #faviconImage__accessor_storage = "";
    get faviconImage_() {
        return this.#faviconImage__accessor_storage
    }
    set faviconImage_(value) {
        this.#faviconImage__accessor_storage = value
    }
    #faviconImageSrcSet__accessor_storage = "";
    get faviconImageSrcSet_() {
        return this.#faviconImageSrcSet__accessor_storage
    }
    set faviconImageSrcSet_(value) {
        this.#faviconImageSrcSet__accessor_storage = value
    }
    #hasImage__accessor_storage = false;
    get hasImage_() {
        return this.#hasImage__accessor_storage
    }
    set hasImage_(value) {
        this.#hasImage__accessor_storage = value
    }
    #showFaviconImage__accessor_storage = false;
    get showFaviconImage_() {
        return this.#showFaviconImage__accessor_storage
    }
    set showFaviconImage_(value) {
        this.#showFaviconImage__accessor_storage = value
    }
    #faviconLoading__accessor_storage = false;
    get faviconLoading_() {
        return this.#faviconLoading__accessor_storage
    }
    set faviconLoading_(value) {
        this.#faviconLoading__accessor_storage = value
    }
    #faviconError__accessor_storage = false;
    get faviconError_() {
        return this.#faviconError__accessor_storage
    }
    set faviconError_(value) {
        this.#faviconError__accessor_storage = value
    }
    #iconSrc__accessor_storage = "";
    get iconSrc_() {
        return this.#iconSrc__accessor_storage
    }
    set iconSrc_(value) {
        this.#iconSrc__accessor_storage = value
    }
    #iconLoading__accessor_storage = false;
    get iconLoading_() {
        return this.#iconLoading__accessor_storage
    }
    set iconLoading_(value) {
        this.#iconLoading__accessor_storage = value
    }
    #showIconImg__accessor_storage = false;
    get showIconImg_() {
        return this.#showIconImg__accessor_storage
    }
    set showIconImg_(value) {
        this.#showIconImg__accessor_storage = value
    }
    #showImage__accessor_storage = false;
    get showImage_() {
        return this.#showImage__accessor_storage
    }
    set showImage_(value) {
        this.#showImage__accessor_storage = value
    }
    #imageSrc__accessor_storage = "";
    get imageSrc_() {
        return this.#imageSrc__accessor_storage
    }
    set imageSrc_(value) {
        this.#imageSrc__accessor_storage = value
    }
    #imageLoading__accessor_storage = false;
    get imageLoading_() {
        return this.#imageLoading__accessor_storage
    }
    set imageLoading_(value) {
        this.#imageLoading__accessor_storage = value
    }
    #imageError__accessor_storage = false;
    get imageError_() {
        return this.#imageError__accessor_storage
    }
    set imageError_(value) {
        this.#imageError__accessor_storage = value
    }
    #isTopChromeSearchbox__accessor_storage = loadTimeData.getBoolean("isTopChromeSearchbox");
    get isTopChromeSearchbox_() {
        return this.#isTopChromeSearchbox__accessor_storage
    }
    set isTopChromeSearchbox_(value) {
        this.#isTopChromeSearchbox__accessor_storage = value
    }
    #isLensSearchbox__accessor_storage = loadTimeData.getBoolean("isLensSearchbox");
    get isLensSearchbox_() {
        return this.#isLensSearchbox__accessor_storage
    }
    set isLensSearchbox_(value) {
        this.#isLensSearchbox__accessor_storage = value
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("match")) {
            this.iconSrc_ = this.computeIconSrc_();
            this.imageSrc_ = this.computeImageSrc_();
            this.isAnswer = this.computeIsAnswer_();
            this.isEnterpriseSearchAggregatorPeopleType = this.computeIsEnterpriseSearchAggregatorPeopleType_();
            this.isStarterPack = this.computeIsStarterPack_();
            this.isFeaturedEnterpriseSearch = this.computeIsFeaturedEnterpriseSearch();
            this.isWeatherAnswer = this.computeIsWeatherAnswer_();
            this.hasImage_ = this.computeHasImage_();
            this.maskImage = this.computeMaskImage_()
        }
        if (changedProperties.has("match") || changedProperties.has("isWeatherAnswer")) {
            this.hasIconContainerBackground = this.computeHasIconContainerBackground_()
        }
        const changedPrivateProperties = changedProperties;
        if (changedProperties.has("match") || changedProperties.has("defaultIcon") || changedPrivateProperties.has("isTopChromeSearchbox_")) {
            this.faviconImage_ = this.computeFaviconImage_()
        }
        if (changedProperties.has("match") || changedPrivateProperties.has("faviconImage_") || changedPrivateProperties.has("isTopChromeSearchbox_")) {
            this.faviconImageSrcSet_ = this.computeFaviconImageSrcSet_()
        }
        if (changedPrivateProperties.has("faviconImage_")) {
            this.faviconLoading_ = !!this.faviconImage_;
            this.faviconError_ = false
        }
        if (changedProperties.has("match") || changedPrivateProperties.has("isLensSearchbox_") || changedPrivateProperties.has("faviconImage_") || changedPrivateProperties.has("faviconLoading_") || changedPrivateProperties.has("faviconError_")) {
            this.showFaviconImage_ = this.computeShowFaviconImage_()
        }
        if (changedPrivateProperties.has("iconSrc_")) {
            this.iconLoading_ = !!this.iconSrc_
        }
        if (changedPrivateProperties.has("imageSrc_")) {
            this.imageLoading_ = !!this.imageSrc_;
            this.imageError_ = false
        }
        if (changedPrivateProperties.has("imageSrc_") || changedPrivateProperties.has("imageError_")) {
            this.showImage_ = this.computeShowImage_()
        }
        if (changedProperties.has("match") || changedPrivateProperties.has("isLensSearchbox_") || changedPrivateProperties.has("iconLoading_")) {
            this.showIconImg_ = this.computeShowIconImg_()
        }
    }
    computeFaviconUrl_(scaleFactor) {
        if (!this.match?.destinationUrl.url) {
            return ""
        }
        return getFaviconUrl(this.match.destinationUrl.url, {
            forceLightMode: !this.isTopChromeSearchbox_,
            ignoreCache: true,
            forceEmptyDefaultFavicon: true,
            scaleFactor: `${scaleFactor}x`
        })
    }
    computeFaviconImageSrcSet_() {
        if (!this.faviconImage_.startsWith("chrome://favicon2/")) {
            return ""
        }
        return [`${this.computeFaviconUrl_(1)} 1x`, `${this.computeFaviconUrl_(2)} 2x`].join(", ")
    }
    computeFaviconImage_() {
        if (this.match && !this.match.isSearchType) {
            if (this.match.type === DOCUMENT_MATCH_TYPE || this.match.type === PEDAL || this.match.isEnterpriseSearchAggregatorPeopleType) {
                return this.match.iconPath
            }
            if (this.match.type !== HISTORY_CLUSTER_MATCH_TYPE && this.match.type !== FEATURED_ENTERPRISE_SEARCH) {
                return this.computeFaviconUrl_(1)
            }
        }
        if (this.defaultIcon === "//resources/cr_components/searchbox/icons/google_g.svg" || this.defaultIcon === "//resources/cr_components/searchbox/icons/google_g_gradient.svg") {
            return this.defaultIcon
        }
        return ""
    }
    computeIsAnswer_() {
        return !!this.match && !!this.match.answer
    }
    computeIsWeatherAnswer_() {
        return this.match?.isWeatherAnswerSuggestion || false
    }
    computeHasImage_() {
        return !!this.match && !!this.match.imageUrl
    }
    computeIsEnterpriseSearchAggregatorPeopleType_() {
        return this.match?.isEnterpriseSearchAggregatorPeopleType || false
    }
    computeShowIconImg_() {
        return !this.isLensSearchbox_ && !!this.match && !!this.match.iconUrl.url && !this.iconLoading_
    }
    computeMaskImage_() {
        if (this.isLensSearchbox_ && this.inSearchbox) {
            return `url(${this.defaultIcon})`
        }
        if (this.match && (!this.match.isRichSuggestion || this.match.type === STARTER_PACK || this.match.type === FEATURED_ENTERPRISE_SEARCH || this.match.isEnterpriseSearchAggregatorPeopleType || !this.inSearchbox)) {
            return `url(${this.match.iconPath})`
        } else {
            return `url(${this.defaultIcon})`
        }
    }
    computeShowFaviconImage_() {
        if (!this.faviconImage_) {
            return false
        }
        if (this.faviconLoading_ || this.faviconError_) {
            return false
        }
        if (!this.isLensSearchbox_ && this.match && !this.match.isSearchType && this.match.type !== STARTER_PACK && this.match.type !== PEDAL) {
            return true
        }
        const themedIcons = ["calendar", "drive_docs", "drive_folder", "drive_form", "drive_image", "drive_logo", "drive_pdf", "drive_sheets", "drive_slides", "drive_video", "google_agentspace_logo", "google_agentspace_logo_25", "google_g", "google_g_gradient", "note", "sites"];
        for (const icon of themedIcons) {
            if (this.faviconImage_ === "//resources/cr_components/searchbox/icons/" + icon + ".svg") {
                return true
            }
        }
        return false
    }
    computeSrc_(url) {
        if (!url) {
            return ""
        }
        if (url.startsWith("data:image/")) {
            return url
        }
        return `//image?staticEncode=true&encodeType=webp&url=${url}`
    }
    computeIconSrc_() {
        return this.computeSrc_(this.match?.iconUrl?.url)
    }
    computeShowImage_() {
        return !!this.imageSrc_ && !this.imageError_
    }
    computeImageSrc_() {
        return this.computeSrc_(this.match?.imageUrl)
    }
    getContainerBgColor_() {
        return (this.imageLoading_ || this.imageError_) && this.match?.imageDominantColor ? this.match.imageDominantColor ? `${this.match.imageDominantColor}40` : "var(--cr-searchbox-match-icon-container-background-fallback)" : "transparent"
    }
    onFaviconLoad_() {
        this.faviconLoading_ = false;
        this.faviconError_ = false
    }
    onFaviconError_() {
        this.faviconLoading_ = false;
        this.faviconError_ = true
    }
    onIconLoad_() {
        this.iconLoading_ = false
    }
    onImageLoad_() {
        this.imageLoading_ = false;
        this.imageError_ = false
    }
    onImageError_() {
        this.imageLoading_ = false;
        this.imageError_ = true
    }
    computeHasIconContainerBackground_() {
        if (this.match) {
            return this.match.type === PEDAL || this.match.type === HISTORY_CLUSTER_MATCH_TYPE || this.match.type === CALCULATOR || this.match.type === STARTER_PACK || this.match.type === FEATURED_ENTERPRISE_SEARCH || !!this.match.answer && !this.isWeatherAnswer
        }
        return false
    }
    computeIsStarterPack_() {
        return this.match?.type === STARTER_PACK
    }
    computeIsFeaturedEnterpriseSearch() {
        return this.match?.type === FEATURED_ENTERPRISE_SEARCH
    }
}
customElements.define(SearchboxIconElement.is, SearchboxIconElement);
let instance$h = null;
function getCss$a() {
    return instance$h || (instance$h = [...[getCss$e()], css`:host{border:solid 1px var(--color-searchbox-results-action-chip);border-radius:8px;display:flex;height:var(--cr-searchbox-results-action-chip-height,28px);min-width:0;outline:none;padding-inline-end:8px;padding-inline-start:8px;position:relative;transition:background-color 0.25s}:host(:hover){background-color:var(--color-searchbox-results-button-hover)}:host(:focus),:host(.selected){margin:2px;box-shadow:none}:host(.selected:hover){background-color:var(--color-searchbox-results-button-selected-hover)}:host(:active) #overlay{background-color:var(--color-omnibox-results-button-ink-drop-selected-row-hovered)}:host(.selected:active) #overlay{background-color:var(--color-omnibox-results-button-ink-drop-selected-row-selected)}#overlay{--overlay-inset:calc(var(--border-width) * -1);border-radius:inherit;display:inherit;position:absolute;top:var(--overlay-inset);left:var(--overlay-inset);right:var(--overlay-inset);bottom:var(--overlay-inset)}.contents{align-items:center;display:flex;min-width:0}#action-icon{flex-shrink:0;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:15px;background-color:var(--color-searchbox-results-action-chip-icon);background-position:center center;background-repeat:no-repeat;height:16px;width:16px}:host-context(:is(:focus,[selected])) #action-icon{background-color:var(--color-searchbox-results-action-chip-icon-selected,var(--color-searchbox-results-action-chip-icon))}#text{overflow:hidden;padding-inline-start:8px;text-overflow:ellipsis;white-space:nowrap}`])
}
function getHtml$9() {
    return html`<!--_html_template_start_-->
<div id="overlay"></div>
<div class="contents" title="${this.suggestionContents}">
  <div id="action-icon" style="${this.iconStyle_}"></div>
  <div id="text" .innerHTML="${this.hintHtml_}"></div>
</div>
<!--_html_template_end_-->`
}
class SearchboxActionElement extends CrLitElement {
    static get is() {
        return "cr-searchbox-action"
    }
    static get styles() {
        return getCss$a()
    }
    render() {
        return getHtml$9.bind(this)()
    }
    static get properties() {
        return {
            hint: {
                type: String
            },
            hintHtml_: {
                state: true,
                type: String
            },
            suggestionContents: {
                type: String
            },
            iconPath: {
                type: String
            },
            iconStyle_: {
                state: true,
                type: String
            },
            ariaLabel: {
                type: String
            },
            actionIndex: {
                type: Number
            }
        }
    }
    #hint_accessor_storage = "";
    get hint() {
        return this.#hint_accessor_storage
    }
    set hint(value) {
        this.#hint_accessor_storage = value
    }
    #hintHtml__accessor_storage = window.trustedTypes.emptyHTML;
    get hintHtml_() {
        return this.#hintHtml__accessor_storage
    }
    set hintHtml_(value) {
        this.#hintHtml__accessor_storage = value
    }
    #suggestionContents_accessor_storage = "";
    get suggestionContents() {
        return this.#suggestionContents_accessor_storage
    }
    set suggestionContents(value) {
        this.#suggestionContents_accessor_storage = value
    }
    #iconPath_accessor_storage = "";
    get iconPath() {
        return this.#iconPath_accessor_storage
    }
    set iconPath(value) {
        this.#iconPath_accessor_storage = value
    }
    #iconStyle__accessor_storage = "";
    get iconStyle_() {
        return this.#iconStyle__accessor_storage
    }
    set iconStyle_(value) {
        this.#iconStyle__accessor_storage = value
    }
    #ariaLabel_accessor_storage = "";
    get ariaLabel() {
        return this.#ariaLabel_accessor_storage
    }
    set ariaLabel(value) {
        this.#ariaLabel_accessor_storage = value
    }
    #actionIndex_accessor_storage = -1;
    get actionIndex() {
        return this.#actionIndex_accessor_storage
    }
    set actionIndex(value) {
        this.#actionIndex_accessor_storage = value
    }
    firstUpdated() {
        this.addEventListener("click", (event => this.onActionClick_(event)));
        this.addEventListener("keydown", (event => this.onActionKeyDown_(event)));
        this.addEventListener("mousedown", (event => this.onActionMouseDown_(event)))
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("hint")) {
            this.hintHtml_ = this.computeHintHtml_()
        }
        if (changedProperties.has("iconPath")) {
            this.iconStyle_ = this.computeActionIconStyle_()
        }
    }
    onActionClick_(e) {
        this.fire("execute-action", {
            event: e,
            actionIndex: this.actionIndex
        });
        e.preventDefault();
        e.stopPropagation()
    }
    onActionKeyDown_(e) {
        if (e.key && (e.key === "Enter" || e.key === " ")) {
            this.onActionClick_(e)
        }
    }
    onActionMouseDown_(e) {
        e.preventDefault()
    }
    computeHintHtml_() {
        if (this.hint) {
            return sanitizeInnerHtml(this.hint)
        }
        return window.trustedTypes.emptyHTML
    }
    computeActionIconStyle_() {
        if (this.iconPath.startsWith("data:image/")) {
            return `background-image: url(${this.iconPath})`
        }
        return `-webkit-mask-image: url(${this.iconPath})`
    }
}
customElements.define(SearchboxActionElement.is, SearchboxActionElement);
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
class SearchboxBrowserProxy {
    static getInstance() {
        return instance$g || (instance$g = new SearchboxBrowserProxy)
    }
    static setInstance(newInstance) {
        instance$g = newInstance
    }
    handler;
    callbackRouter;
    constructor() {
        this.handler = PageHandler.getRemote();
        this.callbackRouter = new PageCallbackRouter;
        this.handler.setPage(this.callbackRouter.$.bindNewPipeAndPassRemote())
    }
}
let instance$g = null;
let instance$f = null;
function getCss$9() {
    return instance$f || (instance$f = [...[], css`.action-icon{--cr-icon-button-active-background-color:var(--color-new-tab-page-active-background);--cr-icon-button-fill-color:var(--color-searchbox-results-icon);--cr-icon-button-focus-outline-color:var(--color-searchbox-results-icon-focused-outline);--cr-icon-button-hover-background-color:var(--color-searchbox-results-button-hover);--cr-icon-button-icon-size:16px;--cr-icon-button-margin-end:0;--cr-icon-button-margin-start:0;--cr-icon-button-size:24px}`])
}
let instance$e = null;
function getCss$8() {
    return instance$e || (instance$e = [...[getCss$d(), getCss$f(), getCss$9()], css`:host{display:block;outline:none}#actions-focus-border{overflow:hidden}#actions-focus-border:focus-within,#actions-focus-border:focus-within:has(#action:active),#actions-focus-border:has(#action.selected),#actions-focus-border:has(#keyword.selected){outline:2px solid var(--color-searchbox-results-action-chip-focus-outline);border-radius:10px;margin-inline-start:-2px}#actions-focus-border:has(#action:active){outline:none}.container{align-items:center;cursor:default;display:flex;overflow:hidden;padding-bottom:var(--cr-searchbox-match-padding,6px);padding-inline-end:16px;padding-inline-start:var(--cr-searchbox-match-padding-inline-start,12px);padding-top:var(--cr-searchbox-match-padding,6px);position:relative}.container+.container{flex-direction:row;margin-inline-start:40px;padding-top:0;padding-bottom:12px}:host([has-action]) .container{height:38px;padding-top:3px;padding-bottom:3px}:host([is-top-chrome-searchbox_]:is([has-action],[has-keyword])) .container{height:40px;padding-top:0;padding-bottom:0}:host(:not([is-lens-searchbox_])) .container:not(.actions){margin-inline-end:16px;border-start-end-radius:24px;border-end-end-radius:24px}:host-context([has-secondary-side]):host-context([can-show-secondary-side]) .container:not(.actions){margin-inline-end:0px}.container:not(.actions):hover{background-color:var(--color-searchbox-results-background-hovered)}:host(:is(:focus-visible,[selected])) .container:not(.actions){background-color:var(--color-searchbox-results-background-selected,var(--color-searchbox-results-background-hovered))}:host([enable-csb-motion-tweaks_][is-lens-searchbox_]) .container{height:48px;padding-bottom:0;padding-top:0}.actions.container{align-self:center;flex-grow:1;flex-shrink:0;padding-bottom:0;padding-inline-end:0px;padding-inline-start:0px;padding-top:0;display:none}:host-context(.vertical) .actions.container{display:flex}:host([has-action]) .actions.container{padding-inline-end:8px;padding-inline-start:8px}#contents,#description{overflow:hidden;text-overflow:ellipsis}#ellipsis{inset-inline-end:0;position:absolute}:host([show-thumbnail]) #ellipsis{position:relative}#focus-indicator{--searchbox-match-focus-indicator-width_:7px;background-color:var(--color-searchbox-results-focus-indicator);border-radius:3px;display:none;height:100%;inset-inline-start:round(up,calc(-1 * var(--searchbox-match-focus-indicator-width_) / 2),1px);position:absolute;width:var(--searchbox-match-focus-indicator-width_)}:host-context(.vertical):host(:is(:focus-visible,[selected]:not(:focus-within))) #focus-indicator:not(.selected-within){display:block}:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])) #icon{--color-searchbox-search-icon-background:var(--color-searchbox-results-dim-selected)}#prefix{opacity:0}#separator{white-space:pre}#tail-suggest-prefix{position:relative}#text-container{align-items:center;display:flex;flex-grow:0;overflow:hidden;padding-inline-end:8px;padding-inline-start:var(--cr-searchbox-match-text-padding-inline-start,8px);white-space:nowrap;transform:translateY(-2px)}#suggestion{display:flex;overflow:hidden}:host([is-top-chrome-searchbox_]) #text-container #suggestion{display:inline-block;min-width:0;flex:1 1 auto;white-space:nowrap;text-overflow:ellipsis}:host([is-lens-searchbox_]) #text-container{display:-webkit-box;line-clamp:2;-webkit-line-clamp:2;-webkit-box-orient:vertical;white-space:normal}:host([has-action]) #text-container{padding-inline-end:4px}:host([is-rich-suggestion]) #text-container{align-items:flex-start;flex-direction:column}:host([is-rich-suggestion]) #separator{display:none}:host([is-rich-suggestion]) #contents,:host([is-rich-suggestion]) #description{width:100%}:host([is-rich-suggestion]) #description{font-size:.875em}.match{font-weight:var(--cr-searchbox-match-font-weight,600)}:host(:not([is-top-chrome-searchbox_])) #contents span:not(.match),#ellipsis{color:var(--color-searchbox-results-typed-prefix,--color-searchbox-results-foreground)}:host-context([has-empty-input]) #contents span,:host-context([has-empty-input]) #ellipsis{color:var(--color-searchbox-results-foreground)}#description,.dim{color:var(--color-searchbox-results-foreground-dimmed)}:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])):host([is-entity-suggestion]) #description,:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])) .dim{color:var(--color-searchbox-results-dim-selected)}#description:has(.url),.url{color:var(--color-searchbox-results-url)}:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])) .url{color:var(--color-searchbox-results-url-selected)}#remove{display:none;margin-inline-end:1px}:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])) #remove{--cr-icon-button-fill-color:var(--color-searchbox-results-icon-selected)}:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])) #remove:hover{--cr-icon-button-hover-background-color:var(--color-searchbox-results-button-selected-hover)}:host-context(.vertical) .container:hover #remove,:host-context(cr-searchbox-match:-webkit-any(:focus-within,[selected])):host-context(.vertical) #remove{display:inline-flex}.selected:not(#action):not(#keyword){box-shadow:inset 0 0 0 2px var(--color-searchbox-results-icon-focused-outline)}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]),:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) .container{border-radius:16px}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) .container{box-sizing:border-box;flex-direction:column;margin-inline-end:0;padding:6px;padding-block-end:16px;width:102px;height:auto}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) .focus-indicator{display:none}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) #icon{--cr-searchbox-icon-border-radius:12px;--color-searchbox-results-icon-container-background:transparent;height:90px;margin-block-end:8px;width:90px}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) #text-container{padding:0;white-space:normal;width:100%}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) #contents,:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) #description{-webkit-box-orient:vertical;-webkit-line-clamp:2;display:-webkit-box;font-weight:400;overflow:hidden}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) #contents{font-size:13px;line-height:20px;margin-block-end:4px}:host-context(.secondary-side):host-context(.horizontal):host([is-entity-suggestion][has-image]) #description{font-size:12px;line-height:16px}`])
}
function getHtml$8() {
    return html`<!--_html_template_start_-->
<div class="container" aria-hidden="true">
  <div id="focus-indicator" class="${this.getFocusIndicatorCssClass_()}"></div>
  <cr-searchbox-icon id="icon" .match="${this.match}"></cr-searchbox-icon>
  <div id="text-container">
    <span id="tail-suggest-prefix" ?hidden="${!this.tailSuggestPrefix_}">
      <span id="prefix">${this.tailSuggestPrefix_}</span>
      <!-- This is equivalent to AutocompleteMatch::kEllipsis which is
           prepended to the match content in other surfaces-->
      <span id="ellipsis">...&nbsp</span>
    </span>
    <!-- When a thumbnail is in the searchbox all results should have an
         ellipsis prepended to the suggestion. -->
    <span id="ellipsis" ?hidden="${!this.showEllipsis}">...&nbsp</span>
    <span id="suggestion">
      <span id="contents" .innerHTML="${this.contentsHtml_}"></span>
      <span id="separator" class="dim">${this.separatorText_}</span>
      <span id="description" .innerHTML="${this.descriptionHtml_}"></span>
    </span>
  </div>
  <div aria-hidden="true">
    ${this.match.keywordChipHint ? html`
      <div id="actions-focus-border">
        <cr-searchbox-action id="keyword"
            class="${this.getKeywordCssClass_()}"
            hint="${this.match.keywordChipHint}"
            icon-path="//resources/images/icon_search.svg"
            aria-label="${this.match.keywordChipA11y}"
            @execute-action="${this.onActivateKeyword_}"
            tabindex="1">
        </cr-searchbox-action>
      </div>
    ` : ""}
  </div>
  <div id="actions-container" class="actions container" aria-hidden="true">
    ${this.match.actions.map(( (item, index) => html`
      <div id="actions-focus-border">
        <cr-searchbox-action id="action"
            class="${this.getActionCssClass_(index)}"
            hint="${item.hint}"
            suggestion-contents="${item.suggestionContents}"
            icon-path="${item.iconPath}"
            aria-label="${item.a11yLabel}"
            action-index="${index}"
            @execute-action="${this.onExecuteAction_}" tabindex="2">
        </cr-searchbox-action>
      </div>
    `))}
  </div>
  <cr-icon-button id="remove"
      class="action-icon icon-clear ${this.getRemoveCssClass_()}"
      tabindex="3"
      aria-label="${this.removeButtonAriaLabel_}"
      title="${this.removeButtonTitle_}"
      ?hidden="${!this.match.supportsDeletion}"
      @click="${this.onRemoveButtonClick_}"
      @mousedown="${this.onRemoveButtonMouseDown_}">
  </cr-icon-button>
</div>
<!--_html_template_end_-->`
}
function mojoTimeTicks(timeTicks) {
    return {
        internalValue: BigInt(Math.floor(timeTicks * 1e3))
    }
}
function sideTypeToClass(sideType) {
    switch (sideType) {
    case SideType.kDefaultPrimary:
        return "primary-side";
    case SideType.kSecondary:
        return "secondary-side";
    default:
        assertNotReached("Unexpected side type")
    }
}
function renderTypeToClass(renderType) {
    switch (renderType) {
    case RenderType.kDefaultVertical:
        return "vertical";
    case RenderType.kHorizontal:
        return "horizontal";
    case RenderType.kGrid:
        return "grid";
    default:
        assertNotReached("Unexpected render type")
    }
}
var AcMatchClassificationStyle;
(function(AcMatchClassificationStyle) {
    AcMatchClassificationStyle[AcMatchClassificationStyle["NONE"] = 0] = "NONE";
    AcMatchClassificationStyle[AcMatchClassificationStyle["URL"] = 1] = "URL";
    AcMatchClassificationStyle[AcMatchClassificationStyle["MATCH"] = 2] = "MATCH";
    AcMatchClassificationStyle[AcMatchClassificationStyle["DIM"] = 4] = "DIM"
}
)(AcMatchClassificationStyle || (AcMatchClassificationStyle = {}));
const ENTITY_MATCH_TYPE = "search-suggest-entity";
class SearchboxMatchElement extends CrLitElement {
    static get is() {
        return "cr-searchbox-match"
    }
    static get styles() {
        return getCss$8()
    }
    render() {
        return getHtml$8.bind(this)()
    }
    static get properties() {
        return {
            ariaLabel: {
                type: String
            },
            hasAction: {
                type: Boolean,
                reflect: true
            },
            hasImage: {
                type: Boolean,
                reflect: true
            },
            hasKeyword: {
                type: Boolean,
                reflect: true
            },
            isEntitySuggestion: {
                type: Boolean,
                reflect: true
            },
            isRichSuggestion: {
                type: Boolean,
                reflect: true
            },
            match: {
                type: Object
            },
            selection: {
                type: Object
            },
            matchIndex: {
                type: Number
            },
            showThumbnail: {
                type: Boolean,
                reflect: true
            },
            showEllipsis: {
                type: Boolean
            },
            sideType: {
                type: Number
            },
            isTopChromeSearchbox_: {
                type: Boolean,
                reflect: true
            },
            isLensSearchbox_: {
                type: Boolean,
                reflect: true
            },
            forceHideEllipsis_: {
                type: Boolean
            },
            contentsHtml_: {
                type: String
            },
            descriptionHtml_: {
                type: String
            },
            enableCsbMotionTweaks_: {
                type: Boolean,
                reflect: true
            },
            removeButtonAriaLabel_: {
                type: String
            },
            removeButtonTitle_: {
                type: String
            },
            separatorText_: {
                type: String
            },
            tailSuggestPrefix_: {
                type: String
            }
        }
    }
    #ariaLabel_accessor_storage = "";
    get ariaLabel() {
        return this.#ariaLabel_accessor_storage
    }
    set ariaLabel(value) {
        this.#ariaLabel_accessor_storage = value
    }
    #hasAction_accessor_storage = false;
    get hasAction() {
        return this.#hasAction_accessor_storage
    }
    set hasAction(value) {
        this.#hasAction_accessor_storage = value
    }
    #hasImage_accessor_storage = false;
    get hasImage() {
        return this.#hasImage_accessor_storage
    }
    set hasImage(value) {
        this.#hasImage_accessor_storage = value
    }
    #hasKeyword_accessor_storage = false;
    get hasKeyword() {
        return this.#hasKeyword_accessor_storage
    }
    set hasKeyword(value) {
        this.#hasKeyword_accessor_storage = value
    }
    #isEntitySuggestion_accessor_storage = false;
    get isEntitySuggestion() {
        return this.#isEntitySuggestion_accessor_storage
    }
    set isEntitySuggestion(value) {
        this.#isEntitySuggestion_accessor_storage = value
    }
    #isRichSuggestion_accessor_storage = false;
    get isRichSuggestion() {
        return this.#isRichSuggestion_accessor_storage
    }
    set isRichSuggestion(value) {
        this.#isRichSuggestion_accessor_storage = value
    }
    #match_accessor_storage = createAutocompleteMatch();
    get match() {
        return this.#match_accessor_storage
    }
    set match(value) {
        this.#match_accessor_storage = value
    }
    #selection_accessor_storage = {
        line: -1,
        state: SelectionLineState.kNormal,
        actionIndex: 0
    };
    get selection() {
        return this.#selection_accessor_storage
    }
    set selection(value) {
        this.#selection_accessor_storage = value
    }
    #matchIndex_accessor_storage = -1;
    get matchIndex() {
        return this.#matchIndex_accessor_storage
    }
    set matchIndex(value) {
        this.#matchIndex_accessor_storage = value
    }
    #sideType_accessor_storage = SideType.kDefaultPrimary;
    get sideType() {
        return this.#sideType_accessor_storage
    }
    set sideType(value) {
        this.#sideType_accessor_storage = value
    }
    #showThumbnail_accessor_storage = false;
    get showThumbnail() {
        return this.#showThumbnail_accessor_storage
    }
    set showThumbnail(value) {
        this.#showThumbnail_accessor_storage = value
    }
    #showEllipsis_accessor_storage = false;
    get showEllipsis() {
        return this.#showEllipsis_accessor_storage
    }
    set showEllipsis(value) {
        this.#showEllipsis_accessor_storage = value
    }
    #isTopChromeSearchbox__accessor_storage = loadTimeData.getBoolean("isTopChromeSearchbox");
    get isTopChromeSearchbox_() {
        return this.#isTopChromeSearchbox__accessor_storage
    }
    set isTopChromeSearchbox_(value) {
        this.#isTopChromeSearchbox__accessor_storage = value
    }
    #isLensSearchbox__accessor_storage = loadTimeData.getBoolean("isLensSearchbox");
    get isLensSearchbox_() {
        return this.#isLensSearchbox__accessor_storage
    }
    set isLensSearchbox_(value) {
        this.#isLensSearchbox__accessor_storage = value
    }
    #forceHideEllipsis__accessor_storage = loadTimeData.getBoolean("forceHideEllipsis");
    get forceHideEllipsis_() {
        return this.#forceHideEllipsis__accessor_storage
    }
    set forceHideEllipsis_(value) {
        this.#forceHideEllipsis__accessor_storage = value
    }
    #contentsHtml__accessor_storage = window.trustedTypes.emptyHTML;
    get contentsHtml_() {
        return this.#contentsHtml__accessor_storage
    }
    set contentsHtml_(value) {
        this.#contentsHtml__accessor_storage = value
    }
    #descriptionHtml__accessor_storage = window.trustedTypes.emptyHTML;
    get descriptionHtml_() {
        return this.#descriptionHtml__accessor_storage
    }
    set descriptionHtml_(value) {
        this.#descriptionHtml__accessor_storage = value
    }
    #enableCsbMotionTweaks__accessor_storage = loadTimeData.getBoolean("enableCsbMotionTweaks");
    get enableCsbMotionTweaks_() {
        return this.#enableCsbMotionTweaks__accessor_storage
    }
    set enableCsbMotionTweaks_(value) {
        this.#enableCsbMotionTweaks__accessor_storage = value
    }
    #removeButtonAriaLabel__accessor_storage = "";
    get removeButtonAriaLabel_() {
        return this.#removeButtonAriaLabel__accessor_storage
    }
    set removeButtonAriaLabel_(value) {
        this.#removeButtonAriaLabel__accessor_storage = value
    }
    #removeButtonTitle__accessor_storage = loadTimeData.getString("removeSuggestion");
    get removeButtonTitle_() {
        return this.#removeButtonTitle__accessor_storage
    }
    set removeButtonTitle_(value) {
        this.#removeButtonTitle__accessor_storage = value
    }
    #separatorText__accessor_storage = "";
    get separatorText_() {
        return this.#separatorText__accessor_storage
    }
    set separatorText_(value) {
        this.#separatorText__accessor_storage = value
    }
    #tailSuggestPrefix__accessor_storage = "";
    get tailSuggestPrefix_() {
        return this.#tailSuggestPrefix__accessor_storage
    }
    set tailSuggestPrefix_(value) {
        this.#tailSuggestPrefix__accessor_storage = value
    }
    pageHandler_;
    constructor() {
        super();
        this.pageHandler_ = SearchboxBrowserProxy.getInstance().handler
    }
    firstUpdated() {
        this.addEventListener("click", (event => this.onMatchClick_(event)));
        this.addEventListener("focusin", ( () => this.onMatchFocusin_()));
        this.addEventListener("mousedown", ( () => this.onMatchMouseDown_()))
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("match")) {
            this.ariaLabel = this.computeAriaLabel_();
            this.contentsHtml_ = this.computeContentsHtml_();
            this.descriptionHtml_ = this.computeDescriptionHtml_();
            this.hasAction = this.computeHasAction_();
            this.hasKeyword = this.computeHasKeyword_();
            this.hasImage = this.computeHasImage_();
            this.isEntitySuggestion = this.computeIsEntitySuggestion_();
            this.isRichSuggestion = this.computeIsRichSuggestion_();
            this.removeButtonAriaLabel_ = this.computeRemoveButtonAriaLabel_();
            this.separatorText_ = this.computeSeparatorText_();
            this.tailSuggestPrefix_ = this.computeTailSuggestPrefix_()
        }
        const changedPrivateProperties = changedProperties;
        if (changedProperties.has("showThumbnail") || changedPrivateProperties.has("isLensSearchbox_") || changedPrivateProperties.has("forceHideEllipsis_")) {
            this.showEllipsis = this.computeShowEllipsis_()
        }
    }
    onActivateKeyword_(e) {
        const event = e.detail.event;
        this.pageHandler_.activateKeyword(this.matchIndex, this.match.destinationUrl, mojoTimeTicks(Date.now()), event.pointerType === "mouse")
    }
    onExecuteAction_(e) {
        const event = e.detail.event;
        this.pageHandler_.executeAction(this.matchIndex, e.detail.actionIndex, this.match.destinationUrl, mojoTimeTicks(Date.now()), event.button || 0, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey)
    }
    onMatchClick_(e) {
        if (e.button > 1) {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        this.pageHandler_.openAutocompleteMatch(this.matchIndex, this.match.destinationUrl, true, e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
        const backgroundTab = (e.metaKey || e.ctrlKey) && e.shiftKey;
        if (!backgroundTab) {
            this.fire("match-click")
        }
    }
    onMatchFocusin_() {
        this.fire("match-focusin", this.matchIndex)
    }
    onMatchMouseDown_() {
        this.pageHandler_.onNavigationLikely(this.matchIndex, this.match.destinationUrl, NavigationPredictor.kMouseDown)
    }
    onRemoveButtonClick_(e) {
        if (e.button !== 0) {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        this.pageHandler_.deleteAutocompleteMatch(this.matchIndex, this.match.destinationUrl)
    }
    onRemoveButtonMouseDown_(e) {
        e.preventDefault()
    }
    computeAriaLabel_() {
        if (!this.match) {
            return ""
        }
        return this.match.a11yLabel
    }
    sanitizeInnerHtml_(html) {
        return sanitizeInnerHtml(html, {
            attrs: ["class"]
        })
    }
    computeContentsHtml_() {
        if (!this.match) {
            return window.trustedTypes.emptyHTML
        }
        return this.sanitizeInnerHtml_(this.renderTextWithClassifications_(this.getMatchContents_(), this.getMatchContentsClassifications_()).innerHTML)
    }
    computeDescriptionHtml_() {
        if (!this.match) {
            return window.trustedTypes.emptyHTML
        }
        const match = this.match;
        if (match.answer) {
            return this.sanitizeInnerHtml_(this.getMatchDescription_())
        }
        return this.sanitizeInnerHtml_(this.renderTextWithClassifications_(this.getMatchDescription_(), this.getMatchDescriptionClassifications_()).innerHTML)
    }
    computeHasAction_() {
        return this.match?.actions?.length > 0
    }
    computeHasKeyword_() {
        return this.match && !!this.match.keywordChipHint
    }
    computeHasImage_() {
        return this.match && !!this.match.imageUrl
    }
    computeIsEntitySuggestion_() {
        return this.match && this.match.type === ENTITY_MATCH_TYPE
    }
    computeIsRichSuggestion_() {
        return !this.isTopChromeSearchbox_ && this.match && this.match.isRichSuggestion
    }
    computeRemoveButtonAriaLabel_() {
        if (!this.match) {
            return ""
        }
        return this.match.removeButtonA11yLabel
    }
    computeSeparatorText_() {
        return this.getMatchDescription_() ? loadTimeData.getString("searchboxSeparator") : ""
    }
    computeTailSuggestPrefix_() {
        if (!this.match || !this.match.tailSuggestCommonPrefix) {
            return ""
        }
        const prefix = this.match.tailSuggestCommonPrefix;
        if (prefix.slice(-1) === " ") {
            return prefix.slice(0, -1) + " "
        }
        return prefix
    }
    computeShowEllipsis_() {
        if (this.isLensSearchbox_ && this.forceHideEllipsis_) {
            return false
        }
        return this.showThumbnail
    }
    convertClassificationStyleToCssClasses_(style) {
        const classes = [];
        if (style & AcMatchClassificationStyle.DIM) {
            classes.push("dim")
        }
        if (style & AcMatchClassificationStyle.MATCH) {
            classes.push("match")
        }
        if (style & AcMatchClassificationStyle.URL) {
            classes.push("url")
        }
        return classes
    }
    createSpanWithClasses_(text, classes) {
        const span = document.createElement("span");
        if (classes.length) {
            span.classList.add(...classes)
        }
        span.textContent = text;
        return span
    }
    renderTextWithClassifications_(text, classifications) {
        return classifications.map(( ({offset: offset, style: style}, index) => {
            const next = classifications[index + 1] || {
                offset: text.length
            };
            const subText = text.substring(offset, next.offset);
            const classes = this.convertClassificationStyleToCssClasses_(style);
            return this.createSpanWithClasses_(subText, classes)
        }
        )).reduce(( (container, currentElement) => {
            container.appendChild(currentElement);
            return container
        }
        ), document.createElement("span"))
    }
    getMatchContents_() {
        if (!this.match) {
            return ""
        }
        const match = this.match;
        const matchContents = match.answer ? match.answer.firstLine : match.contents;
        const matchDescription = match.answer ? match.answer.secondLine : match.description;
        return match.swapContentsAndDescription ? matchDescription : matchContents
    }
    getMatchDescription_() {
        if (!this.match) {
            return ""
        }
        const match = this.match;
        const matchContents = match.answer ? match.answer.firstLine : match.contents;
        const matchDescription = match.answer ? match.answer.secondLine : match.description;
        return match.swapContentsAndDescription ? matchContents : matchDescription
    }
    getMatchContentsClassifications_() {
        if (!this.match) {
            return []
        }
        const match = this.match;
        return match.swapContentsAndDescription ? match.descriptionClass : match.contentsClass
    }
    getMatchDescriptionClassifications_() {
        if (!this.match) {
            return []
        }
        const match = this.match;
        return match.swapContentsAndDescription ? match.contentsClass : match.descriptionClass
    }
    getFocusIndicatorCssClass_() {
        return this.selection.line === this.matchIndex && this.selection.state !== SelectionLineState.kNormal && !this.match.hasInstantKeyword ? "selected-within" : ""
    }
    getKeywordCssClass_() {
        return this.selection.line === this.matchIndex && this.selection.state === SelectionLineState.kKeywordMode ? "selected" : ""
    }
    getActionCssClass_(actionIndex) {
        return this.selection.line === this.matchIndex && this.selection.state === SelectionLineState.kFocusedButtonAction && this.selection.actionIndex === actionIndex ? "selected" : ""
    }
    getRemoveCssClass_() {
        return this.selection.line === this.matchIndex && this.selection.state === SelectionLineState.kFocusedButtonRemoveSuggestion ? "selected" : ""
    }
}
customElements.define(SearchboxMatchElement.is, SearchboxMatchElement);
class PageMetricsHostPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "metrics_reporter.mojom.PageMetricsHost", scope)
    }
}
class PageMetricsHostRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(PageMetricsHostPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    onPageRemoteCreated(page) {
        this.proxy.sendMessage(0, PageMetricsHost_OnPageRemoteCreated_ParamsSpec.$, null, [page], false)
    }
    onGetMark(name) {
        return this.proxy.sendMessage(1, PageMetricsHost_OnGetMark_ParamsSpec.$, PageMetricsHost_OnGetMark_ResponseParamsSpec.$, [name], false)
    }
    onClearMark(name) {
        this.proxy.sendMessage(2, PageMetricsHost_OnClearMark_ParamsSpec.$, null, [name], false)
    }
    onUmaReportTime(name, time) {
        this.proxy.sendMessage(3, PageMetricsHost_OnUmaReportTime_ParamsSpec.$, null, [name, time], false)
    }
}
class PageMetricsHost {
    static get $interfaceName() {
        return "metrics_reporter.mojom.PageMetricsHost"
    }
    static getRemote() {
        let remote = new PageMetricsHostRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}
class PageMetricsPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "metrics_reporter.mojom.PageMetrics", scope)
    }
}
class PageMetricsRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(PageMetricsPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    onGetMark(name) {
        return this.proxy.sendMessage(0, PageMetrics_OnGetMark_ParamsSpec.$, PageMetrics_OnGetMark_ResponseParamsSpec.$, [name], false)
    }
    onClearMark(name) {
        this.proxy.sendMessage(1, PageMetrics_OnClearMark_ParamsSpec.$, null, [name], false)
    }
}
class PageMetricsCallbackRouter {
    helper_internal_;
    $;
    router_;
    onGetMark;
    onClearMark;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(PageMetricsRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onGetMark = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(0, PageMetrics_OnGetMark_ParamsSpec.$, PageMetrics_OnGetMark_ResponseParamsSpec.$, this.onGetMark.createReceiverHandler(true), false);
        this.onClearMark = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1, PageMetrics_OnClearMark_ParamsSpec.$, null, this.onClearMark.createReceiverHandler(false), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter()
    }
    removeListener(id) {
        return this.router_.removeListener(id)
    }
}
const PageMetricsHost_OnPageRemoteCreated_ParamsSpec = {
    $: {}
};
const PageMetricsHost_OnGetMark_ParamsSpec = {
    $: {}
};
const PageMetricsHost_OnGetMark_ResponseParamsSpec = {
    $: {}
};
const PageMetricsHost_OnClearMark_ParamsSpec = {
    $: {}
};
const PageMetricsHost_OnUmaReportTime_ParamsSpec = {
    $: {}
};
const PageMetrics_OnGetMark_ParamsSpec = {
    $: {}
};
const PageMetrics_OnGetMark_ResponseParamsSpec = {
    $: {}
};
const PageMetrics_OnClearMark_ParamsSpec = {
    $: {}
};
mojo.internal.Struct(PageMetricsHost_OnPageRemoteCreated_ParamsSpec.$, "PageMetricsHost_OnPageRemoteCreated_Params", [mojo.internal.StructField("page", 0, 0, mojo.internal.InterfaceProxy(PageMetricsRemote), null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnGetMark_ParamsSpec.$, "PageMetricsHost_OnGetMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnGetMark_ResponseParamsSpec.$, "PageMetricsHost_OnGetMark_ResponseParams", [mojo.internal.StructField("markedTime", 0, 0, TimeDeltaSpec.$, null, true, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnClearMark_ParamsSpec.$, "PageMetricsHost_OnClearMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnUmaReportTime_ParamsSpec.$, "PageMetricsHost_OnUmaReportTime_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("time", 8, 0, TimeDeltaSpec.$, null, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(PageMetrics_OnGetMark_ParamsSpec.$, "PageMetrics_OnGetMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageMetrics_OnGetMark_ResponseParamsSpec.$, "PageMetrics_OnGetMark_ResponseParams", [mojo.internal.StructField("markedTime", 0, 0, TimeDeltaSpec.$, null, true, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PageMetrics_OnClearMark_ParamsSpec.$, "PageMetrics_OnClearMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
class BrowserProxyImpl {
    callbackRouter;
    host;
    constructor() {
        this.callbackRouter = new PageMetricsCallbackRouter;
        this.host = PageMetricsHost.getRemote();
        this.host.onPageRemoteCreated(this.callbackRouter.$.bindNewPipeAndPassRemote())
    }
    getMark(name) {
        return this.host.onGetMark(name)
    }
    clearMark(name) {
        this.host.onClearMark(name)
    }
    umaReportTime(name, time) {
        this.host.onUmaReportTime(name, time)
    }
    now() {
        return chrome.timeTicks.nowInMicroseconds()
    }
    getCallbackRouter() {
        return this.callbackRouter
    }
    static getInstance() {
        return instance$d || (instance$d = new BrowserProxyImpl)
    }
    static setInstance(obj) {
        instance$d = obj
    }
}
let instance$d = null;
function timeFromMojo(delta) {
    return delta.microseconds
}
function timeToMojo(mark) {
    return {
        microseconds: mark
    }
}
class MetricsReporterImpl {
    marks_ = new Map;
    browserProxy_ = BrowserProxyImpl.getInstance();
    constructor() {
        const callbackRouter = this.browserProxy_.getCallbackRouter();
        callbackRouter.onGetMark.addListener((name => ({
            markedTime: this.marks_.has(name) ? timeToMojo(this.marks_.get(name)) : null
        })));
        callbackRouter.onClearMark.addListener((name => this.marks_.delete(name)))
    }
    static getInstance() {
        return instance$c || (instance$c = new MetricsReporterImpl)
    }
    static setInstanceForTest(newInstance) {
        instance$c = newInstance
    }
    mark(name) {
        this.marks_.set(name, this.browserProxy_.now())
    }
    async measure(startMark, endMark) {
        let endTime;
        if (endMark) {
            const entry = this.marks_.get(endMark);
            assert(entry, `Mark "${endMark}" does not exist locally.`);
            endTime = entry
        } else {
            endTime = this.browserProxy_.now()
        }
        let startTime;
        if (this.marks_.has(startMark)) {
            startTime = this.marks_.get(startMark)
        } else {
            const remoteStartTime = await this.browserProxy_.getMark(startMark);
            assert(remoteStartTime.markedTime, `Mark "${startMark}" does not exist locally or remotely.`);
            startTime = timeFromMojo(remoteStartTime.markedTime)
        }
        return endTime - startTime
    }
    async hasMark(name) {
        if (this.marks_.has(name)) {
            return true
        }
        const remoteMark = await this.browserProxy_.getMark(name);
        return remoteMark !== null && remoteMark.markedTime !== null
    }
    hasLocalMark(name) {
        return this.marks_.has(name)
    }
    clearMark(name) {
        this.marks_.delete(name);
        this.browserProxy_.clearMark(name)
    }
    umaReportTime(histogram, time) {
        this.browserProxy_.umaReportTime(histogram, timeToMojo(time))
    }
}
let instance$c = null;
let instance$b = null;
function getCss$7() {
    return instance$b || (instance$b = [...[getCss$f(), getCss$9()], css`:host{user-select:none}#content{background-color:var(--color-searchbox-results-background);border-radius:calc(0.5 * var(--cr-searchbox-height));box-shadow:var(--cr-searchbox-shadow);display:flex;gap:16px;margin-bottom:var(--cr-searchbox-results-margin-bottom,8px);overflow:hidden;padding-bottom:8px;padding-top:var(--cr-searchbox-height)}@media (forced-colors:active){#content{border:1px solid ActiveBorder}}.matches{display:contents}cr-searchbox-match{color:var(--color-searchbox-results-foreground)}cr-searchbox-match:-webkit-any(:focus-within,[selected]){color:var(--color-searchbox-results-foreground-selected)}.header{align-items:center;box-sizing:border-box;display:flex;font-size:inherit;font-weight:inherit;height:44px;margin-block-end:0;margin-block-start:0;outline:none;padding-bottom:6px;padding-inline-end:16px;padding-inline-start:12px;padding-top:6px}.header .text{color:var(--color-searchbox-results-foreground-dimmed);font-size:.875em;font-weight:500;overflow:hidden;padding-inline-end:1px;text-overflow:ellipsis;white-space:nowrap}@media (forced-colors:active){cr-searchbox-match:-webkit-any(:hover,:focus-within,[selected]){background-color:Highlight}}.primary-side{flex:1;min-width:0}:host-context([is-lens-searchbox_]) .primary-side::before{content:'';position:relative;height:1px;background-color:var(--color-searchbox-dropdown-divider);top:0;width:calc(var(--cr-searchbox-width) - 24px);display:block;inset-inline-start:12px;margin-block-end:4px}.secondary-side{display:var(--cr-searchbox-secondary-side-display,none);min-width:0;padding-block-end:8px;padding-inline-end:16px;width:314px}.secondary-side .header{padding-inline-end:0;padding-inline-start:0}.secondary-side .matches{display:block}.secondary-side .matches.horizontal{display:flex;gap:4px}`])
}
function getHtml$7() {
    return html`<!--_html_template_start_-->
<div id="content" part="dropdown-content">
  ${this.sideTypes_().map((sideType => html`
    <div class="${this.sideTypeClass_(sideType)}">
      ${this.groupIdsForSideType_(sideType).map((groupId => html`
        ${this.hasHeaderForGroup_(groupId) ? html`
          <!-- Header cannot be tabbed into but gets focus when clicked. This
              stops the dropdown from losing focus and closing as a result. -->
          <h3 class="header" data-id="${groupId}" tabindex="-1"
              @mousedown="${this.onHeaderMousedown_}" aria-hidden="true">
            <span class="text">${this.headerForGroup_(groupId)}</span>
          </h3>
        ` : ""}
        <div class="matches ${this.renderTypeClassForGroup_(groupId)}">
          ${this.matchesForGroup_(groupId).map((match => html`
            <cr-searchbox-match tabindex="0" role="option"
                .match="${match}" match-index="${this.matchIndex_(match)}"
                side-type="${sideType}"
                ?selected="${this.isSelected_(match)}"
                ?show-thumbnail="${this.showThumbnail}">
            </cr-searchbox-match>
          `))}
        </div>
      `))}
    </div>
  `))}
</div>
<!--_html_template_end_-->`
}
const remainder = (lhs, rhs) => (lhs % rhs + rhs) % rhs;
class SearchboxDropdownElement extends CrLitElement {
    static get is() {
        return "cr-searchbox-dropdown"
    }
    static get styles() {
        return getCss$7()
    }
    render() {
        return getHtml$7.bind(this)()
    }
    static get properties() {
        return {
            canShowSecondarySide: {
                type: Boolean
            },
            hadSecondarySide: {
                type: Boolean,
                notify: true
            },
            hasSecondarySide: {
                type: Boolean,
                notify: true,
                reflect: true
            },
            hasEmptyInput: {
                type: Boolean,
                reflect: true
            },
            result: {
                type: Object
            },
            selectedMatchIndex: {
                type: Number,
                notify: true
            },
            showThumbnail: {
                type: Boolean
            },
            showSecondarySide_: {
                type: Boolean
            }
        }
    }
    #canShowSecondarySide_accessor_storage = false;
    get canShowSecondarySide() {
        return this.#canShowSecondarySide_accessor_storage
    }
    set canShowSecondarySide(value) {
        this.#canShowSecondarySide_accessor_storage = value
    }
    #hadSecondarySide_accessor_storage = false;
    get hadSecondarySide() {
        return this.#hadSecondarySide_accessor_storage
    }
    set hadSecondarySide(value) {
        this.#hadSecondarySide_accessor_storage = value
    }
    #hasSecondarySide_accessor_storage = false;
    get hasSecondarySide() {
        return this.#hasSecondarySide_accessor_storage
    }
    set hasSecondarySide(value) {
        this.#hasSecondarySide_accessor_storage = value
    }
    #hasEmptyInput_accessor_storage = false;
    get hasEmptyInput() {
        return this.#hasEmptyInput_accessor_storage
    }
    set hasEmptyInput(value) {
        this.#hasEmptyInput_accessor_storage = value
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
    #showThumbnail_accessor_storage = false;
    get showThumbnail() {
        return this.#showThumbnail_accessor_storage
    }
    set showThumbnail(value) {
        this.#showThumbnail_accessor_storage = value
    }
    #showSecondarySide__accessor_storage = false;
    get showSecondarySide_() {
        return this.#showSecondarySide__accessor_storage
    }
    set showSecondarySide_(value) {
        this.#showSecondarySide__accessor_storage = value
    }
    selectableMatchElements_ = [];
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("result")) {
            this.hasSecondarySide = this.computeHasSecondarySide_();
            this.hasEmptyInput = this.computeHasEmptyInput_()
        }
        if (changedProperties.has("result") || changedProperties.has("canShowSecondarySide")) {
            this.showSecondarySide_ = this.computeShowSecondarySide_()
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        this.onResultRepaint_();
        this.selectableMatchElements_ = [...this.shadowRoot.querySelectorAll("cr-searchbox-match")]
    }
    get selectableMatchElements() {
        return this.selectableMatchElements_.filter((matchEl => matchEl.sideType === SideType.kDefaultPrimary || this.showSecondarySide_))
    }
    unselect() {
        this.selectedMatchIndex = -1
    }
    focusSelected() {
        this.selectableMatchElements[this.selectedMatchIndex]?.focus()
    }
    selectFirst() {
        this.selectedMatchIndex = 0;
        return this.updateComplete
    }
    selectIndex(index) {
        this.selectedMatchIndex = index;
        return this.updateComplete
    }
    updateSelection(oldSelection, selection) {
        if (oldSelection.line !== selection.line) {
            const oldMatch = this.selectableMatchElements[this.selectedMatchIndex];
            if (oldMatch) {
                oldMatch.selection = selection
            }
        }
        this.selectIndex(selection.line);
        const newMatch = this.selectableMatchElements[this.selectedMatchIndex];
        if (newMatch) {
            newMatch.selection = selection
        }
    }
    selectPrevious() {
        const previous = Math.max(this.selectedMatchIndex, 0) - 1;
        this.selectedMatchIndex = remainder(previous, this.selectableMatchElements.length);
        return this.updateComplete
    }
    selectLast() {
        this.selectedMatchIndex = this.selectableMatchElements.length - 1;
        return this.updateComplete
    }
    selectNext() {
        const next = this.selectedMatchIndex + 1;
        this.selectedMatchIndex = remainder(next, this.selectableMatchElements.length);
        return this.updateComplete
    }
    onHeaderMousedown_(e) {
        e.preventDefault()
    }
    onResultRepaint_() {
        if (!loadTimeData.getBoolean("reportMetrics")) {
            return
        }
        const metricsReporter = MetricsReporterImpl.getInstance();
        metricsReporter.measure("CharTyped").then((duration => {
            metricsReporter.umaReportTime(loadTimeData.getString("charTypedToPaintMetricName"), duration)
        }
        )).then(( () => {
            metricsReporter.clearMark("CharTyped")
        }
        )).catch(( () => {}
        ));
        metricsReporter.measure("ResultChanged").then((duration => {
            metricsReporter.umaReportTime(loadTimeData.getString("resultChangedToPaintMetricName"), duration)
        }
        )).then(( () => {
            metricsReporter.clearMark("ResultChanged")
        }
        )).catch(( () => {}
        ))
    }
    sideTypeClass_(side) {
        return sideTypeToClass(side)
    }
    renderTypeClassForGroup_(groupId) {
        return renderTypeToClass(this.result?.suggestionGroupsMap[groupId]?.renderType ?? RenderType.kDefaultVertical)
    }
    computeHasSecondarySide_() {
        const hasSecondarySide = !!this.groupIdsForSideType_(SideType.kSecondary).length;
        if (!this.hadSecondarySide) {
            this.hadSecondarySide = hasSecondarySide
        }
        return hasSecondarySide
    }
    computeHasEmptyInput_() {
        return !!this.result && this.result.input === ""
    }
    isSelected_(match) {
        return this.matchIndex_(match) === this.selectedMatchIndex
    }
    groupIdsForSideType_(side) {
        return [...new Set(this.result?.matches.map((match => match.suggestionGroupId)).filter((groupId => this.sideTypeForGroup_(groupId) === side)))]
    }
    hasHeaderForGroup_(groupId) {
        return !!this.headerForGroup_(groupId)
    }
    headerForGroup_(groupId) {
        return this.result?.suggestionGroupsMap[groupId] ? this.result.suggestionGroupsMap[groupId].header : ""
    }
    matchIndex_(match) {
        return this.result?.matches.indexOf(match) ?? -1
    }
    matchesForGroup_(groupId) {
        return (this.result?.matches ?? []).filter((match => match.suggestionGroupId === groupId))
    }
    sideTypes_() {
        return this.showSecondarySide_ ? [SideType.kDefaultPrimary, SideType.kSecondary] : [SideType.kDefaultPrimary]
    }
    sideTypeForGroup_(groupId) {
        return this.result?.suggestionGroupsMap[groupId]?.sideType ?? SideType.kDefaultPrimary
    }
    computeShowSecondarySide_() {
        if (!this.canShowSecondarySide) {
            return false
        }
        const primaryGroupIds = this.groupIdsForSideType_(SideType.kDefaultPrimary);
        return primaryGroupIds.some((groupId => this.matchesForGroup_(groupId).length > 0))
    }
}
customElements.define(SearchboxDropdownElement.is, SearchboxDropdownElement);
let instance$a = null;
function getCss$6() {
    return instance$a || (instance$a = [...[getCss$f()], css`:host{align-items:center;display:flex;flex-shrink:0;justify-content:center;outline:none}#container{align-items:center;aspect-ratio:1/1;border-radius:12px;display:flex;justify-content:center;overflow:hidden;position:relative;width:48px;height:40px}:host([enable-thumbnail-sizing-tweaks_]) #container{border-radius:8px;height:32px;width:40px}#image{display:initial;height:100%;object-fit:cover;user-select:none;width:100%}.overlay{position:absolute;justify-content:center;align-items:center;background-color:#0000000D;display:flex;width:100%;height:100%}:host([is-deletable_]:hover) .overlay,:host(:focus-visible) .overlay{background-color:var(--color-searchbox-thumbnail-overlay)}#remove{display:none}:host(:hover) #remove,:host(:focus-visible) #remove{display:flex}:host(:focus-visible) #container{border:solid 3px var(--color-searchbox-thumbnail-border);box-sizing:border-box}#remove{margin-inline-start:0px;margin-inline-end:0px;--cr-icon-button-fill-color:white;background-color:transparent}`])
}
function getHtml$6() {
    return html`<!--_html_template_start_-->
<div id="container" aria-hidden="true">
  <img id="image" src="${this.thumbnailUrl_}">
  <div class="overlay">
    ${this.isDeletable_ ? html`
      <cr-icon-button id="remove" class="action-icon icon-clear"
          @click="${this.onRemoveButtonClick_}">
      </cr-icon-button>
    ` : ""}
  </div>
</div>
<!--_html_template_end_-->`
}
class SearchboxThumbnailElement extends CrLitElement {
    static get is() {
        return "cr-searchbox-thumbnail"
    }
    static get styles() {
        return getCss$6()
    }
    render() {
        return getHtml$6.bind(this)()
    }
    static get properties() {
        return {
            thumbnailUrl_: {
                type: String
            },
            isDeletable_: {
                type: Boolean,
                reflect: true
            },
            enableThumbnailSizingTweaks_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    #thumbnailUrl__accessor_storage = "";
    get thumbnailUrl_() {
        return this.#thumbnailUrl__accessor_storage
    }
    set thumbnailUrl_(value) {
        this.#thumbnailUrl__accessor_storage = value
    }
    #isDeletable__accessor_storage = false;
    get isDeletable_() {
        return this.#isDeletable__accessor_storage
    }
    set isDeletable_(value) {
        this.#isDeletable__accessor_storage = value
    }
    #enableThumbnailSizingTweaks__accessor_storage = loadTimeData.getBoolean("enableThumbnailSizingTweaks");
    get enableThumbnailSizingTweaks_() {
        return this.#enableThumbnailSizingTweaks__accessor_storage
    }
    set enableThumbnailSizingTweaks_(value) {
        this.#enableThumbnailSizingTweaks__accessor_storage = value
    }
    onRemoveButtonClick_(e) {
        e.preventDefault();
        this.fire("remove-thumbnail-click")
    }
}
customElements.define(SearchboxThumbnailElement.is, SearchboxThumbnailElement);
const WebUiListenerMixinLit = superClass => {
    class WebUiListenerMixinLit extends superClass {
        webUiListeners_ = [];
        addWebUiListener(eventName, callback) {
            this.webUiListeners_.push(addWebUiListener(eventName, callback))
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            while (this.webUiListeners_.length > 0) {
                removeWebUiListener(this.webUiListeners_.pop())
            }
        }
    }
    return WebUiListenerMixinLit
}
;
let instance$9 = null;
function getCss$5() {
    return instance$9 || (instance$9 = [...[getCss$f()], css`:host{--cr-searchbox-width:var(--cr-searchbox-min-width);--cr-searchbox-border-radius:calc(0.5 * var(--cr-searchbox-height));--cr-searchbox-icon-width:26px;--cr-searchbox-inner-icon-margin:8px;--cr-searchbox-voice-icon-offset:16px;--cr-searchbox-voice-search-button-width:0px;--cr-compose-button-width:104px;--cr-searchbox-icon-spacing:11px;border-radius:var(--cr-searchbox-border-radius);box-shadow:var(--cr-searchbox-shadow);font-size:var(--cr-searchbox-font-size,16px);height:var(--cr-searchbox-height);width:var(--cr-searchbox-width)}:host([is-lens-searchbox_]:not([dropdown-is-visible])){--cr-searchbox-shadow:none}:host([show-thumbnail]){--cr-searchbox-thumbnail-icon-offset:54px}:host([enable-thumbnail-sizing-tweaks_][show-thumbnail]){--cr-searchbox-thumbnail-icon-offset:48px}:host([searchbox-chrome-refresh-theming][dropdown-is-visible]){--cr-searchbox-shadow:0 0 12px 4px var(--color-searchbox-shadow)}:host([searchbox-chrome-refresh-theming]:not([searchbox-steady-state-shadow]):not([dropdown-is-visible])){--cr-searchbox-shadow:none}:host-context([searchbox-width-behavior_='revert']):host([can-show-secondary-side]:not([dropdown-is-visible])){--cr-searchbox-width:var(--cr-searchbox-min-width)}:host([can-show-secondary-side][has-secondary-side]){--cr-searchbox-secondary-side-display:block}:host([is-dark]){--cr-searchbox-shadow:0 2px 6px 0 var(--color-searchbox-shadow)}:host([searchbox-voice-search-enabled_]){--cr-searchbox-voice-search-button-width:var(--cr-searchbox-icon-width)}:host([searchbox-lens-search-enabled_]){--cr-searchbox-voice-icon-offset:53px}@media (forced-colors:active){:host{border:1px solid ActiveBorder}}:host([dropdown-is-visible]:not([is-lens-searchbox_])){box-shadow:none}:host([match-searchbox]){box-shadow:none}:host([match-searchbox]:not([dropdown-is-visible]):hover){border:1px solid transparent;box-shadow:var(--cr-searchbox-shadow)}:host([match-searchbox]:not([is-dark]):not([dropdown-is-visible]):not(:hover)){border:1px solid var(--color-searchbox-border)}#inputWrapper{height:100%;position:relative}input{--cr-searchbox-input-start-padding:calc(52px + var(--cr-searchbox-thumbnail-icon-offset,0px));--cr-searchbox-input-trailing-padding:calc(var(--cr-searchbox-voice-icon-offset) + var(--cr-searchbox-voice-search-button-width) + var(--cr-searchbox-inner-icon-margin));background-color:var(--color-searchbox-background);border:none;border-radius:var(--cr-searchbox-border-radius);color:var(--color-searchbox-foreground);font-family:inherit;font-size:inherit;height:100%;outline:none;padding-inline-end:var(--cr-searchbox-input-trailing-padding);padding-inline-start:var(--cr-searchbox-input-start-padding);position:relative;width:100%}:host-context([dir='rtl']) input[dir='ltr'],:host-context([dir='ltr']) input[dir='rtl']{padding-inline-end:var(--cr-searchbox-input-start-padding);padding-inline-start:var(--cr-searchbox-input-trailing-padding)}:host([compose-button-enabled][dropdown-is-visible]) input,:host([realbox-layout-mode='Tall']) input{--cr-searchbox-input-trailing-padding:calc(12px + var(--cr-compose-button-width) + var(--cr-searchbox-icon-spacing))}:host-context([is-back-arrow-visible]) input{padding-inline-start:calc(22px + var(--cr-searchbox-thumbnail-icon-offset,0px))}:host([searchbox-chrome-refresh-theming]) input::selection{background-color:var(--color-searchbox-selection-background);color:var(--color-searchbox-selection-foreground)}input::-webkit-search-decoration,input::-webkit-search-results-button,input::-webkit-search-results-decoration{display:none}input::-webkit-search-cancel-button{appearance:none;margin:0}input::placeholder{color:var(--color-searchbox-placeholder);opacity:var(--placeholder-opacity)}input:focus::placeholder{visibility:hidden}:host([is-lens-searchbox_]) input:focus::placeholder{visibility:visible}input:focus,:host([dropdown-is-visible]) input{background-color:var(--color-searchbox-results-background)}:host([is-lens-searchbox_][dropdown-is-visible]) input{background-color:var(--color-bubble-searchbox-results-input-background,--color-searchbox-results-background)}:host([is-lens-searchbox_]:not([dropdown-is-visible])) input:focus{background-color:var(--color-searchbox-background)}:host([searchbox-chrome-refresh-theming]:not([searchbox-steady-state-shadow]):not([dropdown-is-visible])) input{background-color:var(--color-searchbox-background)}:host([searchbox-chrome-refresh-theming]:not([searchbox-steady-state-shadow]):not([dropdown-is-visible])) input:hover,input:hover{background-color:var(--color-searchbox-background-hovered)}cr-searchbox-icon{height:100%;left:var(--cr-searchbox-icon-left-position);position:absolute;top:var(--cr-searchbox-icon-top-position);pointer-events:none}@media (forced-colors:active){cr-searchbox-icon{background-color:Highlight;border-radius:4px}}:host-context([is-back-arrow-visible]) #icon{display:none}:host-context([dir='rtl']) cr-searchbox-icon{left:unset;right:12px}.searchbox-icon-button{background-color:transparent;background-position:center;background-repeat:no-repeat;background-size:21px 21px;border:none;border-radius:2px;cursor:pointer;height:100%;outline:none;padding:0;pointer-events:auto;position:static;right:16px;width:var(--cr-searchbox-icon-width)}:host([compose-button-enabled]) .searchbox-icon-button-container.lens{right:calc(12px + var(--cr-compose-button-width) + var(--cr-searchbox-icon-spacing))}.searchbox-icon-button-container{border-radius:4px;display:flex;height:36px;position:absolute;right:16px;top:6px;z-index:100}@media (forced-colors:active){.searchbox-icon-button-container{background-color:ButtonText}.searchbox-icon-button-container:focus-within{outline:2px solid Highlight;outline-offset:2px}}:host-context(.focus-outline-visible) .searchbox-icon-button-container:focus-within{box-shadow:var(--ntp-focus-shadow)}:host(:not([use-webkit-search-icons_])) #voiceSearchButton{background-image:url(//resources/cr_components/searchbox/icons/mic.svg)}:host(:not([use-webkit-search-icons_])) #lensSearchButton{background-image:url(//resources/cr_components/searchbox/icons/camera.svg)}:host([use-webkit-search-icons_]) #voiceSearchButton{-webkit-mask-image:url(//resources/cr_components/searchbox/icons/mic.svg)}:host([use-webkit-search-icons_]) #lensSearchButton{-webkit-mask-image:url(//resources/cr_components/searchbox/icons/camera.svg)}:host([use-webkit-search-icons_]) #voiceSearchButton,:host([use-webkit-search-icons_]) #lensSearchButton{-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:21px 21px;background-color:var(--color-searchbox-lens-voice-icon-background)}:host([use-webkit-search-icons_][compose-button-enabled]) #voiceSearchButton,:host([use-webkit-search-icons_][compose-button-enabled]) #lensSearchButton{background-color:#1F1F1F}:host-context([dir='rtl']) .searchbox-icon-button-container.voice{left:var(--cr-searchbox-voice-icon-offset);right:unset}:host .searchbox-icon-button-container.voice{right:var(--cr-searchbox-voice-icon-offset)}:host([compose-button-enabled][dropdown-is-visible]) .searchbox-icon-button-container{display:none}:host-context([dir='rtl']) .searchbox-icon-button-container{left:16px;right:unset}:host-context([dir='rtl']) .searchbox-icon-button-container.voice{left:var(--cr-searchbox-voice-icon-offset);right:unset}:host([compose-button-enabled]):host-context([dir='rtl']) .searchbox-icon-button-container.lens{left:calc(12px + var(--cr-compose-button-width) + var(--cr-searchbox-icon-spacing));right:unset}:host([compose-button-enabled][searchbox-lens-search-enabled_]){--cr-searchbox-voice-icon-offset:calc(16px + 2 * var(--cr-searchbox-icon-spacing) + var(--cr-searchbox-icon-width) + var(--cr-compose-button-width))}:-webkit-any(input,cr-searchbox-icon,.searchbox-icon-button){z-index:100}.dropdownContainer{left:0;position:absolute;right:0;top:0;z-index:99}.truncate{overflow:hidden;text-overflow:ellipsis}#thumbnailContainer{align-content:center;inset-block-start:var(--cr-searchbox-icon-top-position);inset-inline-start:52px;height:100%;outline:none;position:absolute;z-index:101}:host([enable-thumbnail-sizing-tweaks_]) #thumbnailContainer{inset-inline-start:50px}:host-context([is-back-arrow-visible]) #thumbnailContainer{inset-inline-start:16px}:host([ntp-realbox-next-enabled]) input::placeholder{font-size:18px;color:var(--color-new-tab-page-composebox-type-ahead);font-weight:400}:host([ntp-realbox-next-enabled]){--cr-searchbox-border-radius:26px;--cr-searchbox-dropdown-padding-bottom:12px;--cr-searchbox-icon-size:40px;--cr-searchbox-voice-lens-size:36px;--text-input-inline-start-spacing:16px}:host([ntp-realbox-next-enabled]) cr-searchbox-dropdown::part(dropdown-content){background-color:unset;border-radius:unset;box-shadow:unset;gap:unset;margin-bottom:unset;overflow:unset;padding-bottom:unset;padding-top:unset}:host([ntp-realbox-next-enabled]) contextual-entrypoint-and-carousel::part(composebox-entrypoint){z-index:100}:host([ntp-realbox-next-enabled]) contextual-entrypoint-and-carousel::part(tool-chips-container){position:relative;z-index:100}:host([ntp-realbox-next-enabled]) contextual-entrypoint-and-carousel::part(composebox-file-carousel){margin-top:16px}:host([ntp-realbox-next-enabled]) .dropdownContainer{background-color:var(--color-searchbox-results-background);border-radius:var(--cr-searchbox-border-radius);gap:16px;margin-bottom:var(--cr-searchbox-results-margin-bottom,8px);overflow:hidden;padding-bottom:var(--cr-searchbox-dropdown-padding-bottom);padding-top:var(--cr-searchbox-dropdown-padding-top)}:host([ntp-realbox-next-enabled][dropdown-is-visible]),:host([ntp-realbox-next-enabled]:not([context-files-count_="0"])){box-shadow:none}:host([ntp-realbox-next-enabled][dropdown-is-visible]) .dropdownContainer,:host([ntp-realbox-next-enabled]:not([context-files-count_="0"])) .dropdownContainer{box-shadow:var(--cr-searchbox-shadow)}:host([ntp-realbox-next-enabled]) #errorScrim{border-radius:23px}:host([realbox-layout-mode^='Tall']){--cr-searchbox-compose-button-position-top:12px;--cr-searchbox-dropdown-padding-top:60px;--cr-searchbox-height:108px;--cr-searchbox-input-padding-top_:22px}@media (forced-colors:active){:host([realbox-layout-mode^='Tall']) .dropdownContainer{border:1px solid ActiveBorder}}:host([realbox-layout-mode^='Tall']) #inputWrapper{background-color:var(--color-searchbox-background);border-radius:var(--cr-searchbox-border-radius)}:host([realbox-layout-mode^='Tall']) input{height:48px;padding-top:var(--cr-searchbox-input-padding-top_)}:host([realbox-layout-mode^='Tall']:not([dropdown-is-visible]):not([input-focused_])) input{padding-inline-start:24px}:host([realbox-layout-mode^='Tall']:not([dropdown-is-visible]):not([input-focused_])) cr-searchbox-icon,:host([realbox-layout-mode^='Tall'][dropdown-is-visible]) .searchbox-icon-button-container{display:none}:host([realbox-layout-mode^='Tall']) .searchbox-icon-button-container{bottom:10px;top:unset;height:var(--cr-searchbox-voice-lens-size)}:host([realbox-layout-mode^='Tall'][dropdown-is-visible]) cr-searchbox-icon,:host([realbox-layout-mode^='Tall'][input-focused_]) cr-searchbox-icon{height:24px;inset-inline-start:12px;top:var(--cr-searchbox-input-padding-top_)}:host([realbox-layout-mode^='Tall'][compose-button-enabled]) .searchbox-icon-button-container.lens{inset-inline-end:calc(12px + var(--cr-searchbox-icon-spacing))}:host([realbox-layout-mode^='Tall'][searchbox-lens-search-enabled_]) .searchbox-icon-button-container.voice{inset-inline-end:calc(12px + var(--cr-searchbox-voice-lens-size) + var(--cr-searchbox-icon-spacing))}:host-context([realbox-layout-mode^='Tall']) #composeButton{--cr-button-height:36px}:host([realbox-layout-mode='TallBottomContext'][dropdown-is-visible]) contextual-entrypoint-and-carousel::part(context-menu-and-tools){margin-top:10px}:host-context([realbox-layout-mode='TallTopContext']) contextual-entrypoint-and-carousel::part(carousel-divider){margin-top:10px}:host([realbox-layout-mode='Compact']){--cr-searchbox-dropdown-padding-top:12px;--cr-searchbox-height:56px}:host([realbox-layout-mode='Compact']) #inputWrapper{z-index:99}:host([realbox-layout-mode='Compact']) cr-searchbox-icon{display:none}:host([realbox-layout-mode='Compact']) .searchbox-icon-button-container{top:10px}:host([realbox-layout-mode='Compact'][compose-button-enabled] [searchbox-lens-search-enabled_]) .searchbox-icon-button-container.lens{inset-inline-end:calc(var(--cr-searchbox-icon-spacing) + var(--cr-compose-button-width))}:host([realbox-layout-mode='Compact'][compose-button-enabled] [searchbox-lens-search-enabled_]) .searchbox-icon-button-container.voice{inset-inline-end:calc(var(--cr-searchbox-voice-lens-size) + var(--cr-searchbox-icon-spacing) + var(--cr-compose-button-width))}:host([realbox-layout-mode='Compact']) .dropdownContainer{z-index:auto}:host([realbox-layout-mode='Compact']) cr-searchbox-dropdown::part(dropdown-content){padding-top:12px}`])
}
function getHtml$5() {
    return html`<!--_html_template_start_-->
${this.ntpRealboxNextEnabled ? html`
<ntp-error-scrim id="errorScrim"
    ?compact-mode="${this.realboxLayoutMode === "Compact"}">
</ntp-error-scrim>` : nothing}
<div id="inputWrapper" @focusout="${this.onInputWrapperFocusout_}"
    @keydown="${this.onInputWrapperKeydown_}">
  <input id="input" class="truncate" type="search" autocomplete="off"
      part="searchbox-input"
      spellcheck="false" aria-live="${this.inputAriaLive_}" role="combobox"
      aria-expanded="${this.dropdownIsVisible}" aria-controls="matches"
      aria-description="${this.searchboxAriaDescription}"
      placeholder="${this.computePlaceholderText_(this.placeholderText)}"
      @copy="${this.onInputCutCopy_}"
      @cut="${this.onInputCutCopy_}" @focus="${this.onInputFocus_}"
      @input="${this.onInputInput_}" @keydown="${this.onInputKeydown_}"
      @keyup="${this.onInputKeyup_}" @mousedown="${this.onInputMouseDown_}"
      @paste="${this.onInputPaste_}">
  </input>
  <cr-searchbox-icon id="icon" .match="${this.selectedMatch_}"
      default-icon="${this.searchboxIcon_}" in-searchbox>
  </cr-searchbox-icon>
  ${this.showThumbnail ? html`
    <div id="thumbnailContainer">
      <!--Tabindex is set to 1 so that the thumbnail is tabbed first,
        then the search box. -->
      <cr-searchbox-thumbnail id="thumbnail" thumbnail-url_="${this.thumbnailUrl_}"
          ?is-deletable_="${this.isThumbnailDeletable_}"
          @remove-thumbnail-click="${this.onRemoveThumbnailClick_}"
          role="button" aria-label="${this.i18n("searchboxThumbnailLabel")}"
          tabindex="${this.getThumbnailTabindex_()}">
      </cr-searchbox-thumbnail>
    </div>
  ` : nothing}

  ${this.realboxLayoutMode.startsWith("Tall") && this.composeButtonEnabled ? html`
    <cr-searchbox-compose-button id="composeButton"
        @compose-click="${this.onComposeButtonClick_}">
    </cr-searchbox-compose-button>
  ` : nothing}

  ${this.ntpRealboxNextEnabled ? html`
    <div class="dropdownContainer">
      <contextual-entrypoint-and-carousel id="context"
          part="contextual-entrypoint-and-carousel"
          exportparts="composebox-entrypoint"
          .tabSuggestions_=${this.tabSuggestions_}
          entrypoint-name="Realbox"
          @add-tab-context="${this.addTabContext_}"
          @add-file-context="${this.addFileContext_}"
          @on-file-validation-error="${this.onFileValidationError_}"
          @set-deep-search-mode="${this.setDeepSearchMode_}"
          @set-create-image-mode="${this.setCreateImageMode_}"
          @get-tab-preview="${this.getTabPreview_}"
          ?show-dropdown="${this.dropdownIsVisible}"
          realbox-layout-mode="${this.realboxLayoutMode}">
        <cr-searchbox-dropdown id="matches" part="searchbox-dropdown"
            exportparts="dropdown-content"
            role="listbox" .result="${this.result_}"
            selected-match-index="${this.selectedMatchIndex_}"
            @selected-match-index-changed="${this.onSelectedMatchIndexChanged_}"
            ?can-show-secondary-side="${this.canShowSecondarySide}"
            ?had-secondary-side="${this.hadSecondarySide}"
            @had-secondary-side-changed="${this.onHadSecondarySideChanged_}"
            ?has-secondary-side="${this.hasSecondarySide}"
            @has-secondary-side-changed="${this.onHasSecondarySideChanged_}"
            @match-focusin="${this.onMatchFocusin_}"
            @match-click="${this.onMatchClick_}"
            ?hidden="${!this.dropdownIsVisible}"
            ?show-thumbnail="${this.showThumbnail}">
        </cr-searchbox-dropdown>
      </contextual-entrypoint-and-carousel>
    </div>
  ` : html`
    <cr-searchbox-dropdown class="dropdownContainer" id="matches"
        part="searchbox-dropdown"
        exportparts="dropdown-content"
        role="listbox" .result="${this.result_}"
        selected-match-index="${this.selectedMatchIndex_}"
        @selected-match-index-changed="${this.onSelectedMatchIndexChanged_}"
        ?can-show-secondary-side="${this.canShowSecondarySide}"
        ?had-secondary-side="${this.hadSecondarySide}"
        @had-secondary-side-changed="${this.onHadSecondarySideChanged_}"
        ?has-secondary-side="${this.hasSecondarySide}"
        @has-secondary-side-changed="${this.onHasSecondarySideChanged_}"
        @match-focusin="${this.onMatchFocusin_}"
        @match-click="${this.onMatchClick_}"
        ?hidden="${!this.dropdownIsVisible}"
        ?show-thumbnail="${this.showThumbnail}">
    </cr-searchbox-dropdown>
  `}
</div>

  ${this.searchboxVoiceSearchEnabled_ ? html`
    <div class="searchbox-icon-button-container voice">
      <button id="voiceSearchButton" class="searchbox-icon-button"
          @click="${this.onVoiceSearchClick_}"
          title="${this.i18n("voiceSearchButtonLabel")}">
      </button>
    </div>
  ` : nothing}

  ${this.searchboxLensSearchEnabled_ ? html`
    <div class="searchbox-icon-button-container lens">
      <button id="lensSearchButton" class="searchbox-icon-button lens"
          @click="${this.onLensSearchClick_}"
          title="${this.i18n("lensSearchButtonLabel")}">
      </button>
    </div>
  ` : nothing}

  ${!this.realboxLayoutMode.startsWith("Tall") && this.composeButtonEnabled ? html`
    <cr-searchbox-compose-button id="composeButton"
        @compose-click="${this.onComposeButtonClick_}">
    </cr-searchbox-compose-button>
  ` : nothing}

<!--_html_template_end_-->`
}
const LENS_GHOST_LOADER_TAG_NAME = "cr-searchbox-ghost-loader";
const DESKTOP_CHROME_NTP_REALBOX_ENTRY_POINT_VALUE = "42";
CSS.registerProperty({
    name: "--placeholder-opacity",
    syntax: "<number>",
    initialValue: "1",
    inherits: true
});
var AnimationState;
(function(AnimationState) {
    AnimationState[AnimationState["FADE_IN"] = 0] = "FADE_IN";
    AnimationState[AnimationState["HOLD"] = 1] = "HOLD";
    AnimationState[AnimationState["FADE_OUT"] = 2] = "FADE_OUT"
}
)(AnimationState || (AnimationState = {}));
class PlaceholderTextCycler {
    input_;
    animation_ = null;
    placeholderTexts_ = [];
    placeholderTextsCurrentIndex_ = 0;
    changePlaceholderTextIntervalMs_ = 4e3;
    fadePlaceholderTextDurationMs_ = 250;
    constructor(animatedPlaceholderContainer, placeholderTexts, changeTextAnimationIntervalMs, fadeTextAnimationDurationMs) {
        assert(placeholderTexts.length > 0);
        this.input_ = animatedPlaceholderContainer;
        this.placeholderTexts_ = placeholderTexts;
        this.changePlaceholderTextIntervalMs_ = changeTextAnimationIntervalMs;
        this.fadePlaceholderTextDurationMs_ = fadeTextAnimationDurationMs
    }
    start() {
        this.stop();
        this.placeholderTextsCurrentIndex_ = 0;
        this.animate_(AnimationState.HOLD)
    }
    stop() {
        if (this.animation_) {
            this.animation_.cancel();
            this.animation_ = null
        }
        this.placeholderTextsCurrentIndex_ = 0;
        this.input_.placeholder = this.placeholderTexts_[this.placeholderTextsCurrentIndex_]
    }
    animate_(state) {
        let animationDetails = null;
        switch (state) {
        case AnimationState.FADE_IN:
            this.input_.placeholder = this.placeholderTexts_[this.placeholderTextsCurrentIndex_];
            animationDetails = {
                startOpacity: 0,
                endOpacity: 1,
                duration: this.fadePlaceholderTextDurationMs_,
                nextAnimationState: AnimationState.HOLD
            };
            break;
        case AnimationState.HOLD:
            animationDetails = {
                startOpacity: 1,
                endOpacity: 1,
                duration: this.changePlaceholderTextIntervalMs_,
                nextAnimationState: AnimationState.FADE_OUT
            };
            break;
        case AnimationState.FADE_OUT:
            this.placeholderTextsCurrentIndex_ = (this.placeholderTextsCurrentIndex_ + 1) % this.placeholderTexts_.length;
            animationDetails = {
                startOpacity: 1,
                endOpacity: 0,
                duration: this.fadePlaceholderTextDurationMs_,
                nextAnimationState: AnimationState.FADE_IN
            };
            break
        }
        this.animation_ = this.input_.animate([{
            "--placeholder-opacity": animationDetails.startOpacity
        }, {
            "--placeholder-opacity": animationDetails.endOpacity
        }], {
            duration: animationDetails.duration
        });
        this.animation_.onfinish = () => {
            if (this.animation_) {
                this.animate_(animationDetails.nextAnimationState)
            }
        }
    }
}
const SearchboxElementBase = I18nMixinLit(WebUiListenerMixinLit(CrLitElement));
class SearchboxElement extends SearchboxElementBase {
    static get is() {
        return "cr-searchbox"
    }
    static get styles() {
        return getCss$5()
    }
    render() {
        return getHtml$5.bind(this)()
    }
    static get properties() {
        return {
            canShowSecondarySide: {
                type: Boolean,
                reflect: true
            },
            colorSourceIsBaseline: {
                type: Boolean,
                reflect: true
            },
            dropdownIsVisible: {
                type: Boolean,
                reflect: true
            },
            hadSecondarySide: {
                type: Boolean,
                reflect: true,
                notify: true
            },
            hasSecondarySide: {
                type: Boolean,
                reflect: true
            },
            isDark: {
                type: Boolean,
                reflect: true
            },
            matchSearchbox: {
                type: Boolean,
                reflect: true
            },
            searchboxAriaDescription: {
                type: String
            },
            searchboxLensSearchEnabled: {
                type: Boolean,
                reflect: true
            },
            searchboxChromeRefreshTheming: {
                type: Boolean,
                reflect: true
            },
            searchboxSteadyStateShadow: {
                type: Boolean,
                reflect: true
            },
            realboxLayoutMode: {
                type: String,
                reflect: true
            },
            ntpRealboxNextEnabled: {
                type: Boolean,
                reflect: true
            },
            cyclingPlaceholders: {
                type: Boolean
            },
            composeboxEnabled: {
                type: Boolean
            },
            composeButtonEnabled: {
                type: Boolean
            },
            placeholderText: {
                type: String,
                reflect: true,
                notify: true
            },
            inputFocused_: {
                type: Boolean,
                reflect: true
            },
            isLensSearchbox_: {
                type: Boolean,
                reflect: true
            },
            enableThumbnailSizingTweaks_: {
                type: Boolean,
                reflect: true
            },
            isDeletingInput_: {
                type: Boolean
            },
            lastIgnoredEnterEvent_: {
                type: Object
            },
            lastInput_: {
                type: Object
            },
            lastQueriedInput_: {
                type: String
            },
            pastedInInput_: {
                type: Boolean
            },
            searchboxIcon_: {
                type: String
            },
            searchboxVoiceSearchEnabled_: {
                type: Boolean,
                reflect: true
            },
            searchboxLensSearchEnabled_: {
                type: Boolean,
                reflect: true
            },
            result_: {
                type: Object
            },
            selectedMatch_: {
                type: Object
            },
            selectedMatchIndex_: {
                type: Number
            },
            showThumbnail: {
                type: Boolean,
                reflect: true
            },
            thumbnailUrl_: {
                type: String
            },
            isThumbnailDeletable_: {
                type: Boolean
            },
            inputAriaLive_: {
                type: String
            },
            useWebkitSearchIcons_: {
                type: Boolean,
                reflect: true
            },
            tabSuggestions_: {
                type: Array
            }
        }
    }
    #canShowSecondarySide_accessor_storage = false;
    get canShowSecondarySide() {
        return this.#canShowSecondarySide_accessor_storage
    }
    set canShowSecondarySide(value) {
        this.#canShowSecondarySide_accessor_storage = value
    }
    #colorSourceIsBaseline_accessor_storage = false;
    get colorSourceIsBaseline() {
        return this.#colorSourceIsBaseline_accessor_storage
    }
    set colorSourceIsBaseline(value) {
        this.#colorSourceIsBaseline_accessor_storage = value
    }
    #dropdownIsVisible_accessor_storage = false;
    get dropdownIsVisible() {
        return this.#dropdownIsVisible_accessor_storage
    }
    set dropdownIsVisible(value) {
        this.#dropdownIsVisible_accessor_storage = value
    }
    #hadSecondarySide_accessor_storage = false;
    get hadSecondarySide() {
        return this.#hadSecondarySide_accessor_storage
    }
    set hadSecondarySide(value) {
        this.#hadSecondarySide_accessor_storage = value
    }
    #hasSecondarySide_accessor_storage = false;
    get hasSecondarySide() {
        return this.#hasSecondarySide_accessor_storage
    }
    set hasSecondarySide(value) {
        this.#hasSecondarySide_accessor_storage = value
    }
    #isDark_accessor_storage = false;
    get isDark() {
        return this.#isDark_accessor_storage
    }
    set isDark(value) {
        this.#isDark_accessor_storage = value
    }
    #matchSearchbox_accessor_storage = loadTimeData.getBoolean("searchboxMatchSearchboxTheme");
    get matchSearchbox() {
        return this.#matchSearchbox_accessor_storage
    }
    set matchSearchbox(value) {
        this.#matchSearchbox_accessor_storage = value
    }
    #searchboxAriaDescription_accessor_storage = "";
    get searchboxAriaDescription() {
        return this.#searchboxAriaDescription_accessor_storage
    }
    set searchboxAriaDescription(value) {
        this.#searchboxAriaDescription_accessor_storage = value
    }
    #searchboxLensSearchEnabled_accessor_storage = loadTimeData.getBoolean("searchboxLensSearch");
    get searchboxLensSearchEnabled() {
        return this.#searchboxLensSearchEnabled_accessor_storage
    }
    set searchboxLensSearchEnabled(value) {
        this.#searchboxLensSearchEnabled_accessor_storage = value
    }
    #searchboxChromeRefreshTheming_accessor_storage = loadTimeData.getBoolean("searchboxCr23Theming");
    get searchboxChromeRefreshTheming() {
        return this.#searchboxChromeRefreshTheming_accessor_storage
    }
    set searchboxChromeRefreshTheming(value) {
        this.#searchboxChromeRefreshTheming_accessor_storage = value
    }
    #searchboxSteadyStateShadow_accessor_storage = loadTimeData.getBoolean("searchboxCr23SteadyStateShadow");
    get searchboxSteadyStateShadow() {
        return this.#searchboxSteadyStateShadow_accessor_storage
    }
    set searchboxSteadyStateShadow(value) {
        this.#searchboxSteadyStateShadow_accessor_storage = value
    }
    #realboxLayoutMode_accessor_storage = "";
    get realboxLayoutMode() {
        return this.#realboxLayoutMode_accessor_storage
    }
    set realboxLayoutMode(value) {
        this.#realboxLayoutMode_accessor_storage = value
    }
    #ntpRealboxNextEnabled_accessor_storage = false;
    get ntpRealboxNextEnabled() {
        return this.#ntpRealboxNextEnabled_accessor_storage
    }
    set ntpRealboxNextEnabled(value) {
        this.#ntpRealboxNextEnabled_accessor_storage = value
    }
    #cyclingPlaceholders_accessor_storage = false;
    get cyclingPlaceholders() {
        return this.#cyclingPlaceholders_accessor_storage
    }
    set cyclingPlaceholders(value) {
        this.#cyclingPlaceholders_accessor_storage = value
    }
    #composeboxEnabled_accessor_storage = false;
    get composeboxEnabled() {
        return this.#composeboxEnabled_accessor_storage
    }
    set composeboxEnabled(value) {
        this.#composeboxEnabled_accessor_storage = value
    }
    #composeButtonEnabled_accessor_storage = false;
    get composeButtonEnabled() {
        return this.#composeButtonEnabled_accessor_storage
    }
    set composeButtonEnabled(value) {
        this.#composeButtonEnabled_accessor_storage = value
    }
    #showThumbnail_accessor_storage = false;
    get showThumbnail() {
        return this.#showThumbnail_accessor_storage
    }
    set showThumbnail(value) {
        this.#showThumbnail_accessor_storage = value
    }
    #placeholderText_accessor_storage = "";
    get placeholderText() {
        return this.#placeholderText_accessor_storage
    }
    set placeholderText(value) {
        this.#placeholderText_accessor_storage = value
    }
    #inputAriaLive__accessor_storage = "";
    get inputAriaLive_() {
        return this.#inputAriaLive__accessor_storage
    }
    set inputAriaLive_(value) {
        this.#inputAriaLive__accessor_storage = value
    }
    #inputFocused__accessor_storage = false;
    get inputFocused_() {
        return this.#inputFocused__accessor_storage
    }
    set inputFocused_(value) {
        this.#inputFocused__accessor_storage = value
    }
    #isLensSearchbox__accessor_storage = loadTimeData.getBoolean("isLensSearchbox");
    get isLensSearchbox_() {
        return this.#isLensSearchbox__accessor_storage
    }
    set isLensSearchbox_(value) {
        this.#isLensSearchbox__accessor_storage = value
    }
    #enableThumbnailSizingTweaks__accessor_storage = loadTimeData.getBoolean("enableThumbnailSizingTweaks");
    get enableThumbnailSizingTweaks_() {
        return this.#enableThumbnailSizingTweaks__accessor_storage
    }
    set enableThumbnailSizingTweaks_(value) {
        this.#enableThumbnailSizingTweaks__accessor_storage = value
    }
    #isDeletingInput__accessor_storage = false;
    get isDeletingInput_() {
        return this.#isDeletingInput__accessor_storage
    }
    set isDeletingInput_(value) {
        this.#isDeletingInput__accessor_storage = value
    }
    #lastIgnoredEnterEvent__accessor_storage = null;
    get lastIgnoredEnterEvent_() {
        return this.#lastIgnoredEnterEvent__accessor_storage
    }
    set lastIgnoredEnterEvent_(value) {
        this.#lastIgnoredEnterEvent__accessor_storage = value
    }
    #lastInput__accessor_storage = {
        text: "",
        inline: ""
    };
    get lastInput_() {
        return this.#lastInput__accessor_storage
    }
    set lastInput_(value) {
        this.#lastInput__accessor_storage = value
    }
    #lastQueriedInput__accessor_storage = null;
    get lastQueriedInput_() {
        return this.#lastQueriedInput__accessor_storage
    }
    set lastQueriedInput_(value) {
        this.#lastQueriedInput__accessor_storage = value
    }
    #pastedInInput__accessor_storage = false;
    get pastedInInput_() {
        return this.#pastedInInput__accessor_storage
    }
    set pastedInInput_(value) {
        this.#pastedInInput__accessor_storage = value
    }
    #searchboxIcon__accessor_storage = loadTimeData.getString("searchboxDefaultIcon");
    get searchboxIcon_() {
        return this.#searchboxIcon__accessor_storage
    }
    set searchboxIcon_(value) {
        this.#searchboxIcon__accessor_storage = value
    }
    #searchboxVoiceSearchEnabled__accessor_storage = loadTimeData.getBoolean("searchboxVoiceSearch");
    get searchboxVoiceSearchEnabled_() {
        return this.#searchboxVoiceSearchEnabled__accessor_storage
    }
    set searchboxVoiceSearchEnabled_(value) {
        this.#searchboxVoiceSearchEnabled__accessor_storage = value
    }
    #searchboxLensSearchEnabled__accessor_storage = loadTimeData.getBoolean("searchboxLensSearch");
    get searchboxLensSearchEnabled_() {
        return this.#searchboxLensSearchEnabled__accessor_storage
    }
    set searchboxLensSearchEnabled_(value) {
        this.#searchboxLensSearchEnabled__accessor_storage = value
    }
    #result__accessor_storage = null;
    get result_() {
        return this.#result__accessor_storage
    }
    set result_(value) {
        this.#result__accessor_storage = value
    }
    #selectedMatch__accessor_storage = null;
    get selectedMatch_() {
        return this.#selectedMatch__accessor_storage
    }
    set selectedMatch_(value) {
        this.#selectedMatch__accessor_storage = value
    }
    #selectedMatchIndex__accessor_storage = -1;
    get selectedMatchIndex_() {
        return this.#selectedMatchIndex__accessor_storage
    }
    set selectedMatchIndex_(value) {
        this.#selectedMatchIndex__accessor_storage = value
    }
    #thumbnailUrl__accessor_storage = "";
    get thumbnailUrl_() {
        return this.#thumbnailUrl__accessor_storage
    }
    set thumbnailUrl_(value) {
        this.#thumbnailUrl__accessor_storage = value
    }
    #isThumbnailDeletable__accessor_storage = false;
    get isThumbnailDeletable_() {
        return this.#isThumbnailDeletable__accessor_storage
    }
    set isThumbnailDeletable_(value) {
        this.#isThumbnailDeletable__accessor_storage = value
    }
    #useWebkitSearchIcons__accessor_storage = false;
    get useWebkitSearchIcons_() {
        return this.#useWebkitSearchIcons__accessor_storage
    }
    set useWebkitSearchIcons_(value) {
        this.#useWebkitSearchIcons__accessor_storage = value
    }
    #tabSuggestions__accessor_storage = [];
    get tabSuggestions_() {
        return this.#tabSuggestions__accessor_storage
    }
    set tabSuggestions_(value) {
        this.#tabSuggestions__accessor_storage = value
    }
    pageHandler_;
    callbackRouter_;
    autocompleteResultChangedListenerId_ = null;
    inputTextChangedListenerId_ = null;
    thumbnailChangedListenerId_ = null;
    onTabStripChangedListenerId_ = null;
    placeholderCycler_ = null;
    constructor() {
        performance.mark("realbox-creation-start");
        super();
        this.pageHandler_ = SearchboxBrowserProxy.getInstance().handler;
        this.callbackRouter_ = SearchboxBrowserProxy.getInstance().callbackRouter
    }
    async connectedCallback() {
        super.connectedCallback();
        this.autocompleteResultChangedListenerId_ = this.callbackRouter_.autocompleteResultChanged.addListener(this.onAutocompleteResultChanged_.bind(this));
        this.inputTextChangedListenerId_ = this.callbackRouter_.setInputText.addListener(this.onSetInputText_.bind(this));
        this.thumbnailChangedListenerId_ = this.callbackRouter_.setThumbnail.addListener(this.onSetThumbnail_.bind(this));
        this.onTabStripChangedListenerId_ = this.callbackRouter_.onTabStripChanged.addListener(this.refreshTabSuggestions_.bind(this));
        if (this.cyclingPlaceholders) {
            const {config: config} = await this.pageHandler_.getPlaceholderConfig();
            const texts = config.texts;
            assert(texts[0]);
            this.placeholderText = texts[0];
            this.placeholderCycler_ = new PlaceholderTextCycler(this.$.input,texts,Number(config.changeTextAnimationInterval.microseconds / 1000n),Number(config.fadeTextAnimationDuration.microseconds / 1000n));
            this.placeholderCycler_.start()
        }
        if (this.ntpRealboxNextEnabled) {
            this.refreshTabSuggestions_()
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        assert(this.autocompleteResultChangedListenerId_);
        this.callbackRouter_.removeListener(this.autocompleteResultChangedListenerId_);
        assert(this.inputTextChangedListenerId_);
        this.callbackRouter_.removeListener(this.inputTextChangedListenerId_);
        assert(this.thumbnailChangedListenerId_);
        this.callbackRouter_.removeListener(this.thumbnailChangedListenerId_);
        assert(this.onTabStripChangedListenerId_);
        this.callbackRouter_.removeListener(this.onTabStripChangedListenerId_);
        this.placeholderCycler_?.stop()
    }
    firstUpdated() {
        performance.measure("realbox-creation", "realbox-creation-start")
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("composeButtonEnabled") || changedProperties.has("searchboxChromeRefreshTheming") || changedProperties.has("colorSourceIsBaseline")) {
            this.useWebkitSearchIcons_ = this.composeButtonEnabled || this.searchboxChromeRefreshTheming && !this.colorSourceIsBaseline
        }
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("result_") || changedPrivateProperties.has("selectedMatchIndex_")) {
            this.selectedMatch_ = this.computeSelectedMatch_()
        }
        if (changedPrivateProperties.has("selectedMatch_")) {
            this.inputAriaLive_ = this.computeInputAriaLive_()
        }
        if (changedPrivateProperties.has("thumbnailUrl_")) {
            this.showThumbnail = !!this.thumbnailUrl_
        }
        if (this.ntpRealboxNextEnabled) {
            if (changedPrivateProperties.has("dropdownIsVisible")) {
                this.dispatchEvent(new CustomEvent("dropdown-visible-changed",{
                    bubbles: true,
                    composed: true,
                    detail: {
                        value: this.dropdownIsVisible
                    }
                }))
            }
            if (changedPrivateProperties.has("inputFocused_")) {
                this.fire("searchbox-input-focus-changed", {
                    value: this.inputFocused_
                })
            }
        }
    }
    computeInputAriaLive_() {
        return this.selectedMatch_ ? "off" : "polite"
    }
    getSuggestionsElement() {
        return this.$.matches
    }
    isInputEmpty() {
        return !this.$.input.value.trim()
    }
    queryAutocomplete() {
        if (this.dropdownIsVisible) {
            return
        }
        this.queryAutocomplete_(this.$.input.value)
    }
    setInputText(text) {
        this.onSetInputText_(text)
    }
    focusInput() {
        this.$.input.focus()
    }
    selectAll() {
        this.$.input.select()
    }
    async onAutocompleteResultChanged_(result) {
        if (this.lastQueriedInput_ === null || this.lastQueriedInput_.trimStart() !== result.input) {
            return
        }
        this.result_ = result;
        const hasMatches = result?.matches?.length > 0;
        const hasPrimaryMatches = result?.matches?.some((match => {
            const sideType = result.suggestionGroupsMap[match.suggestionGroupId]?.sideType || SideType.kDefaultPrimary;
            return sideType === SideType.kDefaultPrimary
        }
        ));
        this.dropdownIsVisible = hasPrimaryMatches;
        const firstMatch = hasMatches ? this.result_.matches[0] : null;
        if (firstMatch && firstMatch.allowedToBeDefaultMatch) {
            this.$.matches.selectFirst();
            this.updateInput_({
                text: this.lastQueriedInput_,
                inline: firstMatch.inlineAutocompletion
            });
            if (this.lastIgnoredEnterEvent_) {
                this.navigateToMatch_(0, this.lastIgnoredEnterEvent_);
                this.lastIgnoredEnterEvent_ = null
            }
        } else if (this.$.input.value.trim() && hasMatches && this.selectedMatchIndex_ >= 0 && this.selectedMatchIndex_ < this.result_.matches.length) {
            await this.$.matches.selectIndex(this.selectedMatchIndex_);
            this.updateInput_({
                text: this.selectedMatch_.fillIntoEdit,
                inline: "",
                moveCursorToEnd: true
            })
        } else {
            this.$.matches.unselect();
            this.updateInput_({
                inline: ""
            })
        }
    }
    onSetInputText_(inputText) {
        this.updateInput_({
            text: inputText,
            inline: ""
        })
    }
    onSetThumbnail_(thumbnailUrl, isDeletable) {
        this.thumbnailUrl_ = thumbnailUrl;
        this.isThumbnailDeletable_ = isDeletable
    }
    onInputCutCopy_(e) {
        if (!this.$.input.value || this.$.input.selectionStart !== 0 || this.$.input.selectionEnd !== this.$.input.value.length || !this.result_ || this.result_.matches.length === 0) {
            return
        }
        if (this.selectedMatch_ && !this.selectedMatch_.isSearchType) {
            e.clipboardData.setData("text/plain", this.selectedMatch_.destinationUrl.url);
            e.preventDefault();
            if (e.type === "cut") {
                this.updateInput_({
                    text: "",
                    inline: ""
                });
                this.clearAutocompleteMatches_()
            }
        }
    }
    onInputFocus_() {
        this.inputFocused_ = true;
        this.pageHandler_.onFocusChanged(true);
        this.placeholderCycler_?.stop()
    }
    onInputInput_(e) {
        const inputValue = this.$.input.value;
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        if (lastInputValue === inputValue) {
            return
        }
        this.updateInput_({
            text: inputValue,
            inline: ""
        });
        if (loadTimeData.getBoolean("reportMetrics")) {
            const charTyped = !this.isDeletingInput_ && !!inputValue.trim();
            const metricsReporter = MetricsReporterImpl.getInstance();
            if (charTyped) {
                if (!metricsReporter.hasLocalMark("CharTyped")) {
                    metricsReporter.mark("CharTyped")
                }
            } else {
                metricsReporter.clearMark("CharTyped")
            }
        }
        if (inputValue.trim() || this.isLensSearchbox_) {
            this.queryAutocomplete_(inputValue, e.isComposing)
        } else {
            this.clearAutocompleteMatches_()
        }
        this.pastedInInput_ = false
    }
    onInputKeydown_(e) {
        if (!this.lastInput_.inline) {
            return
        }
        const inputValue = this.$.input.value;
        const inputSelection = inputValue.substring(this.$.input.selectionStart, this.$.input.selectionEnd);
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        if (inputSelection === this.lastInput_.inline && inputValue === lastInputValue && this.lastInput_.inline[0].toLocaleLowerCase() === e.key.toLocaleLowerCase()) {
            const text = this.lastInput_.text + e.key;
            assert(text);
            this.updateInput_({
                text: text,
                inline: this.lastInput_.inline.substr(1)
            });
            if (loadTimeData.getBoolean("reportMetrics")) {
                const metricsReporter = MetricsReporterImpl.getInstance();
                if (!metricsReporter.hasLocalMark("CharTyped")) {
                    metricsReporter.mark("CharTyped")
                }
            }
            this.queryAutocomplete_(this.lastInput_.text);
            e.preventDefault()
        }
    }
    onInputKeyup_(e) {
        if (e.key !== "Tab" || this.dropdownIsVisible) {
            return
        }
        if (!this.$.input.value || this.showThumbnail) {
            this.queryAutocomplete_(this.$.input.value)
        }
    }
    onInputMouseDown_(e) {
        if (e.button !== 0) {
            return
        }
        if (this.dropdownIsVisible) {
            return
        }
        this.queryAutocomplete_(this.$.input.value)
    }
    onInputPaste_() {
        this.pastedInInput_ = true
    }
    onInputWrapperFocusout_(e) {
        const newlyFocusedEl = e.relatedTarget;
        if (this.$.inputWrapper.contains(newlyFocusedEl)) {
            return
        }
        if (this.isLensSearchbox_ && newlyFocusedEl?.tagName.toLowerCase() === LENS_GHOST_LOADER_TAG_NAME) {
            return
        }
        this.inputFocused_ = false;
        if (this.lastQueriedInput_ === "") {
            this.updateInput_({
                text: "",
                inline: ""
            });
            this.clearAutocompleteMatches_()
        } else {
            this.dropdownIsVisible = false;
            this.pageHandler_.stopAutocomplete(false)
        }
        this.pageHandler_.onFocusChanged(false);
        this.placeholderCycler_?.start()
    }
    async onInputWrapperKeydown_(e) {
        const KEYDOWN_HANDLED_KEYS = ["ArrowDown", "ArrowUp", "Backspace", "Delete", "Enter", "Escape", "PageDown", "PageUp", "Tab"];
        if (!KEYDOWN_HANDLED_KEYS.includes(e.key)) {
            return
        }
        if (e.defaultPrevented) {
            return
        }
        if (this.showThumbnail) {
            const thumbnail = this.shadowRoot.querySelector("cr-searchbox-thumbnail");
            if (thumbnail === this.shadowRoot.activeElement) {
                if (e.key === "Backspace" || e.key === "Enter") {
                    this.thumbnailUrl_ = "";
                    this.$.input.focus();
                    this.clearAutocompleteMatches_();
                    this.pageHandler_.onThumbnailRemoved();
                    const inputValue = this.$.input.value;
                    this.queryAutocomplete_(inputValue);
                    e.preventDefault()
                } else if (e.key === "Tab" && !e.shiftKey) {
                    this.$.input.focus();
                    e.preventDefault()
                } else if (this.dropdownIsVisible && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                    this.$.input.focus()
                }
            } else if (this.isThumbnailDeletable_ && this.$.input.selectionStart === 0 && this.$.input.selectionEnd === 0 && this.$.input === this.shadowRoot.activeElement && (e.key === "Backspace" || e.key === "Tab" && e.shiftKey)) {
                thumbnail?.focus();
                e.preventDefault()
            }
        }
        if (e.key === "Backspace" || e.key === "Tab") {
            return
        }
        if (!this.dropdownIsVisible) {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                const inputValue = this.$.input.value;
                if (inputValue.trim() || !inputValue) {
                    this.queryAutocomplete_(inputValue)
                }
                e.preventDefault();
                return
            }
        }
        if (e.key === "Escape") {
            this.dispatchEvent(new CustomEvent("escape-searchbox",{
                bubbles: true,
                composed: true,
                detail: {
                    event: e,
                    emptyInput: !this.$.input.value
                }
            }))
        }
        if (!this.result_ || this.result_.matches.length === 0) {
            return
        }
        if (e.key === "Delete") {
            if (e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                if (this.selectedMatch_ && this.selectedMatch_.supportsDeletion) {
                    this.pageHandler_.deleteAutocompleteMatch(this.selectedMatchIndex_, this.selectedMatch_.destinationUrl);
                    e.preventDefault()
                }
            }
            return
        }
        if (e.isComposing) {
            return
        }
        if (e.key === "Enter") {
            const array = [this.$.matches, this.$.input];
            if (array.includes(e.target)) {
                if (this.lastQueriedInput_ !== null && this.lastQueriedInput_.trimStart() === this.result_.input) {
                    if (this.selectedMatch_) {
                        this.navigateToMatch_(this.selectedMatchIndex_, e)
                    }
                } else {
                    this.lastIgnoredEnterEvent_ = e;
                    e.preventDefault()
                }
            }
            return
        }
        if (hasKeyModifiers(e)) {
            return
        }
        if (e.key === "Escape" && this.selectedMatchIndex_ <= 0) {
            this.updateInput_({
                text: "",
                inline: ""
            });
            this.clearAutocompleteMatches_();
            e.preventDefault();
            return
        }
        e.preventDefault();
        if (e.key === "ArrowDown") {
            await this.$.matches.selectNext();
            this.pageHandler_.onNavigationLikely(this.selectedMatchIndex_, this.selectedMatch_.destinationUrl, NavigationPredictor.kUpOrDownArrowButton)
        } else if (e.key === "ArrowUp") {
            await this.$.matches.selectPrevious();
            this.pageHandler_.onNavigationLikely(this.selectedMatchIndex_, this.selectedMatch_.destinationUrl, NavigationPredictor.kUpOrDownArrowButton)
        } else if (e.key === "Escape" || e.key === "PageUp") {
            await this.$.matches.selectFirst()
        } else if (e.key === "PageDown") {
            await this.$.matches.selectLast()
        }
        if (this.shadowRoot.activeElement === this.$.matches) {
            this.$.matches.focusSelected()
        }
        const newFill = this.selectedMatch_.fillIntoEdit;
        const newInline = this.selectedMatchIndex_ === 0 && this.selectedMatch_.allowedToBeDefaultMatch ? this.selectedMatch_.inlineAutocompletion : "";
        const newFillEnd = newFill.length - newInline.length;
        const text = newFill.substr(0, newFillEnd);
        assert(text);
        this.updateInput_({
            text: text,
            inline: newInline,
            moveCursorToEnd: newInline.length === 0
        })
    }
    async onMatchFocusin_(e) {
        await this.$.matches.selectIndex(e.detail);
        this.updateInput_({
            text: this.selectedMatch_.fillIntoEdit,
            inline: "",
            moveCursorToEnd: true
        })
    }
    onMatchClick_() {
        this.clearAutocompleteMatches_()
    }
    onVoiceSearchClick_() {
        this.dispatchEvent(new Event("open-voice-search"))
    }
    onLensSearchClick_() {
        this.dropdownIsVisible = false;
        this.dispatchEvent(new Event("open-lens-search"))
    }
    addFileContext_(e) {
        const composeboxFiles = [];
        for (const file of e.detail.files) {
            const attachment = {
                uuid: "fake-uuid",
                name: file.name,
                objectUrl: e.detail.isImage ? URL.createObjectURL(file) : null,
                type: file.type,
                status: FileUploadStatus.kNotUploaded,
                url: null,
                file: file,
                tabId: null
            };
            composeboxFiles.push(attachment)
        }
        this.openComposebox_(composeboxFiles)
    }
    addTabContext_(e) {
        const attachment = {
            uuid: "fake-uuid",
            name: e.detail.title,
            objectUrl: null,
            type: "tab",
            status: FileUploadStatus.kNotUploaded,
            url: e.detail.url,
            file: null,
            tabId: e.detail.id
        };
        this.openComposebox_([attachment])
    }
    async refreshTabSuggestions_() {
        const {tabs: tabs} = await this.pageHandler_.getRecentTabs();
        this.tabSuggestions_ = [...tabs]
    }
    onFileValidationError_(e) {
        this.$.errorScrim.setErrorMessage(e.detail.errorMessage)
    }
    async getTabPreview_(e) {
        const {previewDataUrl: previewDataUrl} = await this.pageHandler_.getTabPreview(e.detail.tabId);
        e.detail.onPreviewFetched(previewDataUrl || "")
    }
    onComposeButtonClick_(e) {
        if (!this.composeboxEnabled || this.$.input.value.trim()) {
            const searchParams = new URLSearchParams;
            searchParams.append("sourceid", "chrome");
            searchParams.append("udm", "50");
            searchParams.append("aep", DESKTOP_CHROME_NTP_REALBOX_ENTRY_POINT_VALUE);
            if (this.$.input.value.trim()) {
                searchParams.append("q", this.$.input.value.trim())
            }
            const queryUrl = new URL("/search",loadTimeData.getString("googleBaseUrl"));
            queryUrl.search = searchParams.toString();
            const href = queryUrl.href;
            if (e.detail.ctrlKey || e.detail.metaKey) {
                window.open(href, "_blank")
            } else if (e.detail.shiftKey) {
                window.open(href, "_blank", "noopener")
            } else {
                window.open(href, "_self")
            }
        } else {
            this.openComposebox_()
        }
        chrome.metricsPrivate.recordBoolean("NewTabPage.ComposeEntrypoint.Click.UserTextPresent", !this.isInputEmpty())
    }
    setDeepSearchMode_() {
        this.openComposebox_([], ComposeboxMode.DEEP_SEARCH)
    }
    setCreateImageMode_() {
        this.openComposebox_([], ComposeboxMode.CREATE_IMAGE)
    }
    openComposebox_(files=[], mode=ComposeboxMode.DEFAULT) {
        this.dispatchEvent(new CustomEvent("open-composebox",{
            detail: {
                searchboxText: this.$.input.value,
                contextFiles: files,
                mode: mode
            },
            bubbles: true,
            composed: true
        }));
        this.setInputText("")
    }
    hasThumbnail() {
        return !!this.thumbnailUrl_
    }
    onRemoveThumbnailClick_() {
        this.thumbnailUrl_ = "";
        this.$.input.focus();
        this.clearAutocompleteMatches_();
        this.pageHandler_.onThumbnailRemoved();
        const inputValue = this.$.input.value;
        this.queryAutocomplete_(inputValue)
    }
    computeSelectedMatch_() {
        if (!this.result_ || !this.result_.matches) {
            return null
        }
        return this.result_.matches[this.selectedMatchIndex_] || null
    }
    computePlaceholderText_(placeholderText) {
        if (placeholderText) {
            return placeholderText
        }
        return this.showThumbnail ? this.i18n("searchBoxHintMultimodal") : this.i18n("searchBoxHint")
    }
    clearAutocompleteMatches_() {
        this.dropdownIsVisible = false;
        this.result_ = null;
        this.$.matches.unselect();
        this.pageHandler_.stopAutocomplete(true);
        this.lastQueriedInput_ = null
    }
    navigateToMatch_(matchIndex, e) {
        assert(matchIndex >= 0);
        const match = this.result_.matches[matchIndex];
        assert(match);
        this.pageHandler_.openAutocompleteMatch(matchIndex, match.destinationUrl, this.dropdownIsVisible, e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
        this.updateInput_({
            text: match.fillIntoEdit,
            inline: "",
            moveCursorToEnd: true
        });
        this.clearAutocompleteMatches_();
        e.preventDefault()
    }
    queryAutocomplete_(input, preventInlineAutocomplete=false) {
        this.lastQueriedInput_ = input;
        const caretNotAtEnd = this.$.input.selectionStart !== input.length;
        preventInlineAutocomplete = preventInlineAutocomplete || this.isDeletingInput_ || this.pastedInInput_ || caretNotAtEnd;
        this.pageHandler_.queryAutocomplete(input, preventInlineAutocomplete);
        this.dispatchEvent(new CustomEvent("query-autocomplete",{
            bubbles: true,
            composed: true,
            detail: {
                inputValue: input
            }
        }))
    }
    updateInput_(update) {
        const newInput = Object.assign({}, this.lastInput_, update);
        const newInputValue = newInput.text + newInput.inline;
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        const inlineDiffers = newInput.inline !== this.lastInput_.inline;
        const preserveSelection = !inlineDiffers && !update.moveCursorToEnd;
        let needsSelectionUpdate = !preserveSelection;
        const oldSelectionStart = this.$.input.selectionStart;
        const oldSelectionEnd = this.$.input.selectionEnd;
        if (newInputValue !== this.$.input.value) {
            this.$.input.value = newInputValue;
            needsSelectionUpdate = true
        }
        if (newInputValue.trim() && needsSelectionUpdate) {
            this.$.input.selectionStart = preserveSelection ? oldSelectionStart : update.moveCursorToEnd ? newInputValue.length : newInput.text.length;
            this.$.input.selectionEnd = preserveSelection ? oldSelectionEnd : newInputValue.length
        }
        this.isDeletingInput_ = lastInputValue.length > newInputValue.length && lastInputValue.startsWith(newInputValue);
        this.lastInput_ = newInput
    }
    getThumbnailTabindex_() {
        return this.isThumbnailDeletable_ ? "1" : ""
    }
    onSelectedMatchIndexChanged_(e) {
        this.selectedMatchIndex_ = e.detail.value
    }
    onHadSecondarySideChanged_(e) {
        this.hadSecondarySide = e.detail.value
    }
    onHasSecondarySideChanged_(e) {
        this.hasSecondarySide = e.detail.value
    }
}
customElements.define(SearchboxElement.is, SearchboxElement);
let instance$8 = null;
function getCss$4() {
    return instance$8 || (instance$8 = [...[], css`:host(:not([hidden])){display:block}#iframe{border:none;border-radius:inherit;display:block;height:inherit;max-height:inherit;max-width:inherit;width:inherit}`])
}
function getHtml$4() {
    return html`<!--_html_template_start_--><!-- #html_wrapper_imports_start
import {nothing} from 'chrome://resources/lit/v3_0/lit.rollup.js';
#html_wrapper_imports_end -->
<iframe id="iframe" .src="${this.getSrc_()}" .allow="${this.allow || nothing}">
</iframe>
<!--_html_template_end_-->`
}
function $$(element, selector) {
    return element.shadowRoot.querySelector(selector)
}
function strictQuery(root, selector, type) {
    const element = root.querySelector(selector);
    assert(element && element instanceof type);
    return element
}
class IframeElement extends CrLitElement {
    static get is() {
        return "ntp-iframe"
    }
    static get styles() {
        return getCss$4()
    }
    render() {
        return getHtml$4.bind(this)()
    }
    static get properties() {
        return {
            allow: {
                reflect: true,
                type: String
            },
            src: {
                reflect: true,
                type: String
            }
        }
    }
    #allow_accessor_storage = "";
    get allow() {
        return this.#allow_accessor_storage
    }
    set allow(value) {
        this.#allow_accessor_storage = value
    }
    #src_accessor_storage = "";
    get src() {
        return this.#src_accessor_storage
    }
    set src(value) {
        this.#src_accessor_storage = value
    }
    postMessage(message) {
        assert(this.shadowRoot);
        WindowProxy.getInstance().postMessage(strictQuery(this.shadowRoot, "#iframe", HTMLIFrameElement), message, new URL(this.src).origin)
    }
    getSrc_() {
        return WindowProxy.getInstance().createIframeSrc(this.src)
    }
}
customElements.define(IframeElement.is, IframeElement);
let instance$7 = null;
function getCss$3() {
    return instance$7 || (instance$7 = [...[], css`#dialog::part(dialog){max-width:300px}#buttons{display:flex;flex-direction:row;justify-content:center;margin-bottom:28px;margin-top:20px}#buttons cr-button{background-position:center;background-repeat:no-repeat;background-size:cover;border:none;height:48px;min-width:48px;width:48px}#buttons cr-button:hover{opacity:0.8}#buttons>:not(:last-child){margin-inline-end:12px}#facebookButton{background-image:url(icons/facebook.svg)}#twitterButton{background-image:url(icons/twitter.svg)}#emailButton{background-image:url(icons/mail.svg)}#url{--cr-input-error-display:none}#copyButton{--cr-icon-image:url(icons/copy.svg);margin-inline-start:2px}`])
}
function getHtml$3() {
    return html`<!--_html_template_start_--><cr-dialog id="dialog" show-on-attach>
  <div id="title" slot="title">${this.title}</div>
  <div slot="body">
    <div id="buttons">
      <cr-button id="facebookButton" title="Facebook"
          @click="${this.onFacebookClick_}">
      </cr-button>
      <cr-button id="twitterButton" title="Twitter"
          @click="${this.onTwitterClick_}">
      </cr-button>
      <cr-button id="emailButton" title="Email"
          @click="${this.onEmailClick_}">
      </cr-button>
    </div>
    <cr-input readonly label="Doodle Link" id="url"
        .value="${this.url.url}">
      <cr-icon-button id="copyButton" slot="suffix" title="Copy link"
          @click="${this.onCopyClick_}">
      </cr-icon-button>
    </cr-input>
  </div>
  <div slot="button-container">
    <cr-button id="doneButton" class="action-button"
        @click="${this.onCloseClick_}">
      Done
    </cr-button>
  </div>
</cr-dialog>
<!--_html_template_end_-->`
}
const FACEBOOK_APP_ID = 738026486351791;
class DoodleShareDialogElement extends CrLitElement {
    static get is() {
        return "ntp-doodle-share-dialog"
    }
    static get styles() {
        return getCss$3()
    }
    render() {
        return getHtml$3.bind(this)()
    }
    static get properties() {
        return {
            title: {
                type: String
            },
            url: {
                type: Object
            }
        }
    }
    #title_accessor_storage = "";
    get title() {
        return this.#title_accessor_storage
    }
    set title(value) {
        this.#title_accessor_storage = value
    }
    #url_accessor_storage = {
        url: ""
    };
    get url() {
        return this.#url_accessor_storage
    }
    set url(value) {
        this.#url_accessor_storage = value
    }
    onFacebookClick_() {
        const url = "https://www.facebook.com/dialog/share" + `?app_id=${FACEBOOK_APP_ID}` + `&href=${encodeURIComponent(this.url.url)}` + `&hashtag=${encodeURIComponent("#GoogleDoodle")}`;
        WindowProxy.getInstance().open(url);
        this.notifyShare_(DoodleShareChannel.kFacebook)
    }
    onTwitterClick_() {
        const url = "https://twitter.com/intent/tweet" + `?text=${encodeURIComponent(`${this.title}\n${this.url.url}`)}`;
        WindowProxy.getInstance().open(url);
        this.notifyShare_(DoodleShareChannel.kTwitter)
    }
    onEmailClick_() {
        const url = `mailto:?subject=${encodeURIComponent(this.title)}` + `&body=${encodeURIComponent(this.url.url)}`;
        WindowProxy.getInstance().navigate(url);
        this.notifyShare_(DoodleShareChannel.kEmail)
    }
    onCopyClick_() {
        this.$.url.select();
        navigator.clipboard.writeText(this.url.url);
        this.notifyShare_(DoodleShareChannel.kLinkCopy)
    }
    onCloseClick_() {
        this.$.dialog.close()
    }
    notifyShare_(channel) {
        this.fire("share", channel)
    }
}
customElements.define(DoodleShareDialogElement.is, DoodleShareDialogElement);
let instance$6 = null;
function getCss$2() {
    return instance$6 || (instance$6 = [...[getCss$d()], css`:host{--ntp-logo-height:168px;display:flex;flex-direction:column;flex-shrink:0;justify-content:flex-end;min-height:var(--ntp-logo-height)}:host([doodle-boxed_]){justify-content:flex-end}#logo{forced-color-adjust:none;height:92px;width:272px}:host([single-colored]) #logo{-webkit-mask-image:url(./icons/google_logo.svg);-webkit-mask-repeat:no-repeat;-webkit-mask-size:100%;background-color:var(--ntp-logo-color)}:host(:not([single-colored])) #logo{background-image:url(./icons/google_logo.svg)}#imageDoodle{cursor:pointer;outline:none}#imageDoodle[tabindex='-1']{cursor:auto}:host([doodle-boxed_]) #imageDoodle{background-color:var(--ntp-logo-box-color);border-radius:20px;padding:16px 24px}:host-context(.focus-outline-visible) #imageDoodle:focus{box-shadow:0 0 0 2px rgba(var(--google-blue-600-rgb),.4)}#imageContainer{display:flex;height:fit-content;position:relative;width:fit-content}#image{max-height:var(--ntp-logo-height);max-width:100%}:host([doodle-boxed_]) #image{max-height:128px}#animation{height:100%;pointer-events:none;position:absolute;width:100%}#doodle{position:relative}#shareButton{background-color:var(--color-new-tab-page-doodle-share-button-background,none);border:none;height:32px;min-width:32px;padding:0;position:absolute;width:32px;bottom:0}:host-context([dir='ltr']) #shareButton{right:-40px}:host-context([dir='rtl']) #shareButton{left:-40px}#shareButtonIcon{width:18px;height:18px;margin:7px;vertical-align:bottom;mask-image:url(chrome://new-tab-page/icons/share_unfilled.svg);background-color:var(--color-new-tab-page-doodle-share-button-icon,none)}#iframe{border:none;height:var(--height,var(--ntp-logo-height));transition-duration:var(--duration,100ms);transition-property:height,width;width:var(--width,100%)}#iframe:not([expanded]){max-height:var(--ntp-logo-height)}`])
}
function getHtml$2() {
    return html`<!--_html_template_start_-->${this.showLogo_ ? html`
  <div id="logo"></div>
` : ""}
${this.showDoodle_ ? html`
  <div id="doodle" title="${this.doodle_.description}">
    <div id="imageDoodle" ?hidden="${!this.imageDoodle_}"
        tabindex="${this.imageDoodleTabIndex_}" @click="${this.onImageClick_}"
        @keydown="${this.onImageKeydown_}">
      <div id="imageContainer">
        <!-- The static image is always visible and the animated image is
             stacked on top of the static image so that there is no flicker
             when starting the animation. -->
        <img id="image" src="${this.imageUrl_}" @load="${this.onImageLoad_}">
        <ntp-iframe id="animation" src="${this.animationUrl_}"
            ?hidden="${!this.showAnimation_}">
        </ntp-iframe>
      </div>
      <cr-button id="shareButton" title="Share Doodle"
          @click="${this.onShareButtonClick_}">
        <div id="shareButtonIcon"></div>
      </cr-button>
    </div>
    ${this.iframeUrl_ ? html`
      <ntp-iframe id="iframe" src="${this.iframeUrl_}" ?expanded="${this.expanded_}"
          allow="autoplay; clipboard-write">
      </ntp-iframe>
    ` : ""}
  </div>
` : ""}
${this.showShareDialog_ ? html`
  <ntp-doodle-share-dialog .title="${this.doodle_.description}"
      .url="${this.doodle_.image.shareUrl}"
      @close="${this.onShareDialogClose_}" @share="${this.onShare_}">
  </ntp-doodle-share-dialog>
` : ""}
<!--_html_template_end_-->`
}
class LogoElement extends CrLitElement {
    static get is() {
        return "ntp-logo"
    }
    static get styles() {
        return getCss$2()
    }
    render() {
        return getHtml$2.bind(this)()
    }
    static get properties() {
        return {
            singleColored: {
                reflect: true,
                type: Boolean
            },
            theme: {
                type: Object
            },
            loaded_: {
                type: Boolean
            },
            doodle_: {
                type: Object
            },
            imageDoodle_: {
                type: Object
            },
            showLogo_: {
                type: Boolean
            },
            showDoodle_: {
                type: Boolean
            },
            doodleBoxed_: {
                reflect: true,
                type: Boolean
            },
            imageUrl_: {
                type: String
            },
            showAnimation_: {
                type: Boolean
            },
            animationUrl_: {
                type: String
            },
            iframeUrl_: {
                type: String
            },
            duration_: {
                type: String
            },
            height_: {
                type: String
            },
            width_: {
                type: String
            },
            expanded_: {
                type: Boolean
            },
            showShareDialog_: {
                type: Boolean
            },
            imageDoodleTabIndex_: {
                type: Number
            }
        }
    }
    #singleColored_accessor_storage = false;
    get singleColored() {
        return this.#singleColored_accessor_storage
    }
    set singleColored(value) {
        this.#singleColored_accessor_storage = value
    }
    #theme_accessor_storage = null;
    get theme() {
        return this.#theme_accessor_storage
    }
    set theme(value) {
        this.#theme_accessor_storage = value
    }
    #loaded__accessor_storage = false;
    get loaded_() {
        return this.#loaded__accessor_storage
    }
    set loaded_(value) {
        this.#loaded__accessor_storage = value
    }
    #doodle__accessor_storage = null;
    get doodle_() {
        return this.#doodle__accessor_storage
    }
    set doodle_(value) {
        this.#doodle__accessor_storage = value
    }
    #imageDoodle__accessor_storage = null;
    get imageDoodle_() {
        return this.#imageDoodle__accessor_storage
    }
    set imageDoodle_(value) {
        this.#imageDoodle__accessor_storage = value
    }
    #showLogo__accessor_storage = false;
    get showLogo_() {
        return this.#showLogo__accessor_storage
    }
    set showLogo_(value) {
        this.#showLogo__accessor_storage = value
    }
    #showDoodle__accessor_storage = false;
    get showDoodle_() {
        return this.#showDoodle__accessor_storage
    }
    set showDoodle_(value) {
        this.#showDoodle__accessor_storage = value
    }
    #doodleBoxed__accessor_storage = false;
    get doodleBoxed_() {
        return this.#doodleBoxed__accessor_storage
    }
    set doodleBoxed_(value) {
        this.#doodleBoxed__accessor_storage = value
    }
    #imageUrl__accessor_storage = "";
    get imageUrl_() {
        return this.#imageUrl__accessor_storage
    }
    set imageUrl_(value) {
        this.#imageUrl__accessor_storage = value
    }
    #showAnimation__accessor_storage = false;
    get showAnimation_() {
        return this.#showAnimation__accessor_storage
    }
    set showAnimation_(value) {
        this.#showAnimation__accessor_storage = value
    }
    #animationUrl__accessor_storage = "";
    get animationUrl_() {
        return this.#animationUrl__accessor_storage
    }
    set animationUrl_(value) {
        this.#animationUrl__accessor_storage = value
    }
    #iframeUrl__accessor_storage = "";
    get iframeUrl_() {
        return this.#iframeUrl__accessor_storage
    }
    set iframeUrl_(value) {
        this.#iframeUrl__accessor_storage = value
    }
    #duration__accessor_storage = "";
    get duration_() {
        return this.#duration__accessor_storage
    }
    set duration_(value) {
        this.#duration__accessor_storage = value
    }
    #height__accessor_storage = "";
    get height_() {
        return this.#height__accessor_storage
    }
    set height_(value) {
        this.#height__accessor_storage = value
    }
    #width__accessor_storage = "";
    get width_() {
        return this.#width__accessor_storage
    }
    set width_(value) {
        this.#width__accessor_storage = value
    }
    #expanded__accessor_storage = false;
    get expanded_() {
        return this.#expanded__accessor_storage
    }
    set expanded_(value) {
        this.#expanded__accessor_storage = value
    }
    #showShareDialog__accessor_storage = false;
    get showShareDialog_() {
        return this.#showShareDialog__accessor_storage
    }
    set showShareDialog_(value) {
        this.#showShareDialog__accessor_storage = value
    }
    #imageDoodleTabIndex__accessor_storage = -1;
    get imageDoodleTabIndex_() {
        return this.#imageDoodleTabIndex__accessor_storage
    }
    set imageDoodleTabIndex_(value) {
        this.#imageDoodleTabIndex__accessor_storage = value
    }
    eventTracker_ = new EventTracker;
    pageHandler_;
    imageClickParams_ = null;
    interactionLogUrl_ = null;
    shareId_ = null;
    constructor() {
        performance.mark("logo-creation-start");
        super();
        this.pageHandler_ = NewTabPageProxy.getInstance().handler;
        this.pageHandler_.getDoodle().then(( ({doodle: doodle}) => {
            this.doodle_ = doodle;
            this.loaded_ = true;
            if (this.doodle_ && this.doodle_.interactive) {
                this.width_ = `${this.doodle_.interactive.width}px`;
                this.height_ = `${this.doodle_.interactive.height}px`
            }
        }
        ))
    }
    connectedCallback() {
        super.connectedCallback();
        this.eventTracker_.add(window, "message", ( ({data: data}) => {
            if (data["cmd"] === "resizeDoodle") {
                assert(data.duration);
                this.duration_ = data.duration;
                assert(data.height);
                this.height_ = data.height;
                assert(data.width);
                this.width_ = data.width;
                this.expanded_ = true
            } else if (data["cmd"] === "sendMode") {
                this.sendMode_()
            }
        }
        ));
        this.sendMode_()
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll()
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        this.imageDoodle_ = this.computeImageDoodle_();
        this.imageUrl_ = this.computeImageUrl_();
        this.animationUrl_ = this.computeAnimationUrl_();
        this.showDoodle_ = this.computeShowDoodle_();
        this.iframeUrl_ = this.computeIframeUrl_();
        this.showLogo_ = this.computeShowLogo_();
        this.doodleBoxed_ = this.computeDoodleBoxed_();
        this.imageDoodleTabIndex_ = this.computeImageDoodleTabIndex_()
    }
    firstUpdated() {
        performance.measure("logo-creation", "logo-creation-start")
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("theme")) {
            this.sendMode_()
        }
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("duration_") || changedPrivateProperties.has("height_") || changedPrivateProperties.has("width_")) {
            this.onDurationHeightWidthChange_()
        }
        if (changedPrivateProperties.has("imageDoodle_")) {
            this.onImageDoodleChange_()
        }
    }
    onImageDoodleChange_() {
        if (this.imageDoodle_) {
            this.style.setProperty("--ntp-logo-box-color", skColorToRgba(this.imageDoodle_.backgroundColor))
        } else {
            this.style.removeProperty("--ntp-logo-box-color")
        }
        this.showAnimation_ = false;
        this.imageClickParams_ = null;
        this.interactionLogUrl_ = null;
        this.shareId_ = null
    }
    computeImageDoodle_() {
        return this.doodle_ && this.doodle_.image && this.theme && (this.theme.isDark ? this.doodle_.image.dark : this.doodle_.image.light) || null
    }
    computeShowLogo_() {
        return !!this.loaded_ && !this.showDoodle_
    }
    computeShowDoodle_() {
        return !!this.imageDoodle_ || !!this.doodle_ && !!this.doodle_.interactive && window.navigator.onLine
    }
    computeBackgroundColor_() {
        if (!this.theme || !!this.theme.backgroundImage) {
            return null
        }
        return this.theme.backgroundColor
    }
    computeDoodleBoxed_() {
        const backgroundColor = this.computeBackgroundColor_();
        return !backgroundColor || !!this.imageDoodle_ && this.imageDoodle_.backgroundColor.value !== backgroundColor.value
    }
    onImageClick_() {
        if ($$(this, "#imageDoodle").tabIndex < 0) {
            return
        }
        if (this.isCtaImageShown_()) {
            this.showAnimation_ = true;
            this.pageHandler_.onDoodleImageClicked(DoodleImageType.kCta, this.interactionLogUrl_);
            this.logImageRendered_(DoodleImageType.kAnimation, this.imageDoodle_.animationImpressionLogUrl);
            if (!this.doodle_.image.onClickUrl) {
                $$(this, "#imageDoodle").blur()
            }
            return
        }
        assert(this.doodle_.image.onClickUrl);
        this.pageHandler_.onDoodleImageClicked(this.showAnimation_ ? DoodleImageType.kAnimation : DoodleImageType.kStatic, null);
        const onClickUrl = new URL(this.doodle_.image.onClickUrl.url);
        if (this.imageClickParams_) {
            for (const param of new URLSearchParams(this.imageClickParams_)) {
                onClickUrl.searchParams.append(param[0], param[1])
            }
        }
        WindowProxy.getInstance().open(onClickUrl.toString())
    }
    onImageLoad_() {
        this.logImageRendered_(this.isCtaImageShown_() ? DoodleImageType.kCta : DoodleImageType.kStatic, this.imageDoodle_.imageImpressionLogUrl)
    }
    async logImageRendered_(type, logUrl) {
        const {imageClickParams: imageClickParams, interactionLogUrl: interactionLogUrl, shareId: shareId} = await this.pageHandler_.onDoodleImageRendered(type, WindowProxy.getInstance().now(), logUrl);
        this.imageClickParams_ = imageClickParams;
        this.interactionLogUrl_ = interactionLogUrl;
        this.shareId_ = shareId
    }
    onImageKeydown_(e) {
        if ([" ", "Enter"].includes(e.key)) {
            this.onImageClick_()
        }
    }
    onShare_(e) {
        const doodleId = new URL(this.doodle_.image.onClickUrl.url).searchParams.get("ct");
        if (!doodleId) {
            return
        }
        this.pageHandler_.onDoodleShared(e.detail, doodleId, this.shareId_)
    }
    isCtaImageShown_() {
        return !this.showAnimation_ && !!this.imageDoodle_ && !!this.imageDoodle_.animationUrl
    }
    sendMode_() {
        if (!this.theme) {
            return
        }
        const iframe = $$(this, "#iframe");
        if (!iframe) {
            return
        }
        iframe.postMessage({
            cmd: "changeMode",
            dark: this.theme.isDark
        })
    }
    computeImageUrl_() {
        return this.imageDoodle_ ? this.imageDoodle_.imageUrl.url : ""
    }
    computeAnimationUrl_() {
        return this.imageDoodle_ && this.imageDoodle_.animationUrl ? `chrome-untrusted://new-tab-page/image?${this.imageDoodle_.animationUrl.url}` : ""
    }
    computeIframeUrl_() {
        if (this.doodle_ && this.doodle_.interactive) {
            const url = new URL(this.doodle_.interactive.url.url);
            url.searchParams.append("theme_messages", "0");
            return url.href
        } else {
            return ""
        }
    }
    onShareButtonClick_(e) {
        e.stopPropagation();
        this.showShareDialog_ = true
    }
    onShareDialogClose_() {
        this.showShareDialog_ = false
    }
    onDurationHeightWidthChange_() {
        this.duration_ ? this.style.setProperty("--duration", this.duration_) : this.style.removeProperty("--duration");
        this.height_ ? this.style.setProperty("--height", this.height_) : this.style.removeProperty("--height");
        this.width_ ? this.style.setProperty("--width", this.width_) : this.style.removeProperty("--width")
    }
    computeImageDoodleTabIndex_() {
        return this.doodle_ && this.doodle_.image && (this.isCtaImageShown_() || this.doodle_.image.onClickUrl) ? 0 : -1
    }
}
customElements.define(LogoElement.is, LogoElement);
let instance$5 = null;
class BrowserProxy {
    callbackRouter;
    constructor() {
        this.callbackRouter = new PageCallbackRouter$1;
        const pageHandlerRemote = PageHandler$1.getRemote();
        pageHandlerRemote.setPage(this.callbackRouter.$.bindNewPipeAndPassRemote())
    }
    static getInstance() {
        return instance$5 || (instance$5 = new BrowserProxy)
    }
    static setInstance(newInstance) {
        instance$5 = newInstance
    }
}
const COLORS_CSS_SELECTOR = "link[href*='//theme/colors.css']";
let documentInstance = null;
class ColorChangeUpdater {
    listenerId_ = null;
    root_;
    constructor(root) {
        assert(documentInstance === null || root !== document);
        this.root_ = root
    }
    start() {
        if (this.listenerId_ !== null) {
            return
        }
        this.listenerId_ = BrowserProxy.getInstance().callbackRouter.onColorProviderChanged.addListener(this.onColorProviderChanged.bind(this))
    }
    async onColorProviderChanged() {
        await this.refreshColorsCss()
    }
    async refreshColorsCss() {
        const colorCssNode = this.root_.querySelector(COLORS_CSS_SELECTOR);
        if (!colorCssNode) {
            return false
        }
        const href = colorCssNode.getAttribute("href");
        if (!href) {
            return false
        }
        const hrefURL = new URL(href,location.href);
        const params = new URLSearchParams(hrefURL.search);
        params.set("version", (new Date).getTime().toString());
        const newHref = `${hrefURL.origin}${hrefURL.pathname}?${params.toString()}`;
        const newColorsCssLink = document.createElement("link");
        newColorsCssLink.setAttribute("href", newHref);
        newColorsCssLink.rel = "stylesheet";
        newColorsCssLink.type = "text/css";
        const newColorsLoaded = new Promise((resolve => {
            newColorsCssLink.onload = resolve
        }
        ));
        if (this.root_ === document) {
            document.getElementsByTagName("body")[0].appendChild(newColorsCssLink)
        } else {
            this.root_.appendChild(newColorsCssLink)
        }
        await newColorsLoaded;
        const oldColorCssNode = document.querySelector(COLORS_CSS_SELECTOR);
        if (oldColorCssNode) {
            oldColorCssNode.remove()
        }
        return true
    }
    static forDocument() {
        return documentInstance || (documentInstance = new ColorChangeUpdater(document))
    }
}
const div = document.createElement("div");
div.innerHTML = getTrustedHTML`<cr-iconset name="iph" size="24">
  <svg>
    <defs>
      <!--
      These icons are copied from Material UI and optimized through SVGOMG
      See http://goo.gl/Y1OdAq for instructions on adding additional icons.
      -->
      <g id="celebration">
        <path fill="none" d="M0 0h20v20H0z"></path>
        <path fill-rule="evenodd"
          d="m2 22 14-5-9-9-5 14Zm10.35-5.82L5.3 18.7l2.52-7.05 4.53 4.53ZM14.53 12.53l5.59-5.59a1.25 1.25 0 0 1 1.77 0l.59.59 1.06-1.06-.59-.59a2.758 2.758 0 0 0-3.89 0l-5.59 5.59 1.06 1.06ZM10.06 6.88l-.59.59 1.06 1.06.59-.59a2.758 2.758 0 0 0 0-3.89l-.59-.59-1.06 1.07.59.59c.48.48.48 1.28 0 1.76ZM17.06 11.88l-1.59 1.59 1.06 1.06 1.59-1.59a1.25 1.25 0 0 1 1.77 0l1.61 1.61 1.06-1.06-1.61-1.61a2.758 2.758 0 0 0-3.89 0ZM15.06 5.88l-3.59 3.59 1.06 1.06 3.59-3.59a2.758 2.758 0 0 0 0-3.89l-1.59-1.59-1.06 1.06 1.59 1.59c.48.49.48 1.29 0 1.77Z">
        </path>
      </g>
      <g id="lightbulb_outline">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path
          d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2 11.7V16h-4v-2.3C8.48 12.63 7 11.53 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.49-1.51 3.65-3 4.7z">
        </path>
      </g>
      <g id="lightbulb_outline_chrome_refresh" width="20" height="20" viewBox="0 -960 960 960">
        <path
          d="M479.779-81.413q-30.975 0-52.812-22.704-21.837-22.704-21.837-55.035h149.74q0 32.631-22.058 55.185-22.058 22.554-53.033 22.554ZM333.848-209.065v-75.587h292.304v75.587H333.848Zm-15-125.5Q254.696-374 219.282-440.533q-35.413-66.532-35.413-142.163 0-123.288 86.364-209.59 86.363-86.301 209.739-86.301t209.767 86.301q86.392 86.302 86.392 209.59 0 75.87-35.413 142.283Q705.304-374 641.152-334.565H318.848Zm26.348-83h269.608q37.283-30.522 57.805-73.566 20.521-43.043 20.521-91.512 0-89.424-61.812-151.184-61.813-61.76-151.087-61.76-89.274 0-151.318 61.76-62.043 61.76-62.043 151.184 0 48.469 20.521 91.512 20.522 43.044 57.805 73.566Zm134.804 0Z">
        </path>
      </g>
    </defs>
  </svg>
</cr-iconset>
`;
const iconsets = div.querySelectorAll("cr-iconset");
for (const iconset of iconsets) {
    document.head.appendChild(iconset)
}
let instance$4 = null;
function getCss$1() {
    return instance$4 || (instance$4 = [...[getCss$d()], css`:host{--help-bubble-background:var(--color-feature-promo-bubble-background,var(--google-blue-700));--help-bubble-foreground:var(--color-feature-promo-bubble-foreground,var(--google-grey-200));--help-bubble-border-radius:12px;--help-bubble-close-button-icon-size:16px;--help-bubble-close-button-size:20px;--help-bubble-element-spacing:8px;--help-bubble-padding:20px;--help-bubble-font-weight:400;border-radius:var(--help-bubble-border-radius);box-shadow:0 6px 10px 4px rgba(60,64,67,0.15),0 2px 3px rgba(60,64,67,0.3);box-sizing:border-box;position:absolute;z-index:1}#arrow{--help-bubble-arrow-size:11.3px;--help-bubble-arrow-size-half:calc(var(--help-bubble-arrow-size) / 2);--help-bubble-arrow-diameter:16px;--help-bubble-arrow-radius:calc(var(--help-bubble-arrow-diameter) / 2);--help-bubble-arrow-edge-offset:22px;--help-bubble-arrow-offset:calc(var(--help-bubble-arrow-edge-offset) + var(--help-bubble-arrow-radius));--help-bubble-arrow-border-radius:2px;position:absolute}#inner-arrow{background-color:var(--help-bubble-background);height:var(--help-bubble-arrow-size);left:calc(0px - var(--help-bubble-arrow-size-half));position:absolute;top:calc(0px - var(--help-bubble-arrow-size-half));transform:rotate(45deg);width:var(--help-bubble-arrow-size);z-index:-1}#arrow.bottom-edge{bottom:0}#arrow.bottom-edge #inner-arrow{border-bottom-right-radius:var(--help-bubble-arrow-border-radius)}#arrow.top-edge{top:0}#arrow.top-edge #inner-arrow{border-top-left-radius:var(--help-bubble-arrow-border-radius)}#arrow.right-edge{right:0}#arrow.right-edge #inner-arrow{border-top-right-radius:var(--help-bubble-arrow-border-radius)}#arrow.left-edge{left:0}#arrow.left-edge #inner-arrow{border-bottom-left-radius:var(--help-bubble-arrow-border-radius)}#arrow.top-position{top:var(--help-bubble-arrow-offset)}#arrow.vertical-center-position{top:50%}#arrow.bottom-position{bottom:var(--help-bubble-arrow-offset)}#arrow.left-position{left:var(--help-bubble-arrow-offset)}#arrow.horizontal-center-position{left:50%}#arrow.right-position{right:var(--help-bubble-arrow-offset)}#topContainer{display:flex;flex-direction:row}#progress{display:inline-block;flex:auto}#progress div{--help-bubble-progress-size:8px;background-color:var(--help-bubble-foreground);border:1px solid var(--help-bubble-foreground);border-radius:50%;display:inline-block;height:var(--help-bubble-progress-size);margin-inline-end:var(--help-bubble-element-spacing);margin-top:5px;width:var(--help-bubble-progress-size)}#progress .total-progress{background-color:var(--help-bubble-background)}#topBody,#mainBody{flex:1;font-size:14px;font-style:normal;font-weight:var(--help-bubble-font-weight);letter-spacing:0.3px;line-height:20px;margin:0}#title{flex:1;font-size:18px;font-style:normal;font-weight:500;line-height:24px;margin:0}.help-bubble{--cr-focus-outline-color:var(--help-bubble-foreground);background-color:var(--help-bubble-background);border-radius:var(--help-bubble-border-radius);box-sizing:border-box;color:var(--help-bubble-foreground);display:flex;flex-direction:column;justify-content:space-between;max-width:340px;min-width:260px;padding:var(--help-bubble-padding);position:relative}#main{display:flex;flex-direction:row;justify-content:flex-start;margin-top:var(--help-bubble-element-spacing)}#middleRowSpacer{margin-inline-start:32px}cr-icon-button,cr-button{--help-bubble-button-foreground:var(--help-bubble-foreground);--help-bubble-button-background:var(--help-bubble-background);--help-bubble-button-hover-alpha:10%}cr-button.default-button{--help-bubble-button-foreground:var(--color-feature-promo-bubble-default-button-foreground,var(--help-bubble-background));--help-bubble-button-background:var(--color-feature-promo-bubble-default-button-background,var(--help-bubble-foreground));--help-bubble-button-hover-alpha:6%}@media (prefers-color-scheme:dark){cr-icon-button,cr-button{--help-bubble-button-hover-alpha:6%}cr-button.default-button{--help-bubble-button-hover-alpha:10%}}cr-icon-button:hover,#buttons cr-button:hover{background-color:color-mix(in srgb,var(--help-bubble-button-foreground) var(--help-bubble-button-hover-alpha),var(--help-bubble-button-background))}cr-icon-button{--cr-icon-button-fill-color:var(--help-bubble-button-foreground);--cr-icon-button-icon-size:var(--help-bubble-close-button-icon-size);--cr-icon-button-size:var(--help-bubble-close-button-size);--cr-icon-button-stroke-color:var(--help-bubble-button-foreground);box-sizing:border-box;display:block;flex:none;float:right;height:var(--cr-icon-button-size);margin:0;margin-inline-start:var(--help-bubble-element-spacing);order:2;width:var(--cr-icon-button-size)}cr-icon-button:focus-visible:focus{box-shadow:inset 0 0 0 1px var(--cr-focus-outline-color)}#bodyIcon{--help-bubble-body-icon-image-size:18px;--help-bubble-body-icon-size:24px;--iron-icon-height:var(--help-bubble-body-icon-image-size);--iron-icon-width:var(--help-bubble-body-icon-image-size);background-color:var(--help-bubble-foreground);border-radius:50%;box-sizing:border-box;color:var(--help-bubble-background);height:var(--help-bubble-body-icon-size);margin-inline-end:var(--help-bubble-element-spacing);padding:calc((var(--help-bubble-body-icon-size) - var(--help-bubble-body-icon-image-size)) / 2);text-align:center;width:var(--help-bubble-body-icon-size)}#bodyIcon cr-icon{display:block}#buttons{display:flex;flex-direction:row;justify-content:flex-end;margin-top:16px}#buttons cr-button{--cr-button-border-color:var(--help-bubble-foreground);--cr-button-text-color:var(--help-bubble-button-foreground);--cr-button-background-color:var(--help-bubble-button-background)}#buttons cr-button:focus{box-shadow:none;outline:2px solid var(--cr-focus-outline-color);outline-offset:1px}#buttons cr-button:not(:first-child){margin-inline-start:var(--help-bubble-element-spacing)}`])
}
function getHtml$1() {
    return html`
<link rel="stylesheet" href="chrome://theme/colors.css?sets=ui,chrome&shadow_host=true">
<div class="help-bubble" role="alertdialog" aria-modal="true"
    aria-labelledby="title" aria-describedby="body" aria-live="assertive"
    @keydown="${this.onKeyDown_}" @click="${this.blockPropagation_}">
  <div id="topContainer">
    <div id="bodyIcon" ?hidden="${!this.shouldShowBodyIcon_()}"
        role="image" aria-label="${this.bodyIconAltText}">
      <cr-icon icon="iph:${this.bodyIconName}"></cr-icon>
    </div>
    <div id="progress" ?hidden="${!this.progress}" role="progressbar"
        aria-valuenow="${this.progress ? this.progress.current : nothing}"
        aria-valuemin="1"
        aria-valuemax="${this.progress ? this.progress.total : nothing}">
      ${this.progressData_.map(( (_item, index) => html`
        <div class="${this.getProgressClass_(index)}"></div>`))}
    </div>
    <h1 id="title"
        ?hidden="${!this.shouldShowTitleInTopContainer_()}">
      ${this.titleText}
    </h1>
    <p id="topBody"
        ?hidden="${!this.shouldShowBodyInTopContainer_()}">
      ${this.bodyText}
    </p>
    <cr-icon-button id="close" iron-icon="cr:close"
        aria-label="${this.closeButtonAltText}" @click="${this.dismiss_}"
        tabindex="${this.closeButtonTabIndex}">
    </cr-icon-button>
  </div>
  <div id="main" ?hidden="${!this.shouldShowBodyInMain_()}">
    <div id="middleRowSpacer" ?hidden="!${this.shouldShowBodyIcon_()}">
    </div>
    <p id="mainBody">${this.bodyText}</p>
  </div>
  <div id="buttons" ?hidden="${!this.buttons.length}">
    ${this.sortedButtons.map((item => html`
      <cr-button id="${this.getButtonId_(item)}"
          tabindex="${this.getButtonTabIndex_(item)}"
          class="${this.getButtonClass_(item.isDefault)}"
          @click="${this.onButtonClick_}"
          role="button" aria-label="${item.text}">${item.text}</cr-button>`))}
  </div>
  <div id="arrow" class="${this.getArrowClass_()}">
    <div id="inner-arrow"></div>
  </div>
</div>`
}
const PointSpec = {
    $: {}
};
const PointFSpec = {
    $: {}
};
const Point3FSpec = {
    $: {}
};
const SizeSpec = {
    $: {}
};
const SizeFSpec = {
    $: {}
};
const RectSpec = {
    $: {}
};
const RectFSpec = {
    $: {}
};
const InsetsSpec = {
    $: {}
};
const InsetsFSpec = {
    $: {}
};
const Vector2dSpec = {
    $: {}
};
const Vector2dFSpec = {
    $: {}
};
const Vector3dFSpec = {
    $: {}
};
const QuaternionSpec = {
    $: {}
};
const QuadFSpec = {
    $: {}
};
mojo.internal.Struct(PointSpec.$, "Point", [mojo.internal.StructField("x", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(PointFSpec.$, "PointF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(Point3FSpec.$, "Point3F", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("z", 8, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(SizeSpec.$, "Size", [mojo.internal.StructField("width", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("height", 4, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(SizeFSpec.$, "SizeF", [mojo.internal.StructField("width", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("height", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(RectSpec.$, "Rect", [mojo.internal.StructField("x", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("width", 8, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("height", 12, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(RectFSpec.$, "RectF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("width", 8, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("height", 12, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(InsetsSpec.$, "Insets", [mojo.internal.StructField("top", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("left", 4, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("bottom", 8, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("right", 12, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(InsetsFSpec.$, "InsetsF", [mojo.internal.StructField("top", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("left", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("bottom", 8, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("right", 12, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(Vector2dSpec.$, "Vector2d", [mojo.internal.StructField("x", 0, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Int32, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(Vector2dFSpec.$, "Vector2dF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(Vector3dFSpec.$, "Vector3dF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0, undefined, undefined), mojo.internal.StructField("z", 8, 0, mojo.internal.Float, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(QuaternionSpec.$, "Quaternion", [mojo.internal.StructField("x", 0, 0, mojo.internal.Double, 0, false, 0, undefined, undefined), mojo.internal.StructField("y", 8, 0, mojo.internal.Double, 0, false, 0, undefined, undefined), mojo.internal.StructField("z", 16, 0, mojo.internal.Double, 0, false, 0, undefined, undefined), mojo.internal.StructField("w", 24, 0, mojo.internal.Double, 0, false, 0, undefined, undefined)], [[0, 40]]);
mojo.internal.Struct(QuadFSpec.$, "QuadF", [mojo.internal.StructField("p1", 0, 0, PointFSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("p2", 8, 0, PointFSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("p3", 16, 0, PointFSpec.$, null, false, 0, undefined, undefined), mojo.internal.StructField("p4", 24, 0, PointFSpec.$, null, false, 0, undefined, undefined)], [[0, 40]]);
class TrackedElementHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "tracked_element.mojom.TrackedElementHandler", scope)
    }
}
class TrackedElementHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(TrackedElementHandlerPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    trackedElementVisibilityChanged(nativeIdentifier, visible, rect) {
        this.proxy.sendMessage(0, TrackedElementHandler_TrackedElementVisibilityChanged_ParamsSpec.$, null, [nativeIdentifier, visible, rect], false)
    }
    trackedElementActivated(nativeIdentifier) {
        this.proxy.sendMessage(1, TrackedElementHandler_TrackedElementActivated_ParamsSpec.$, null, [nativeIdentifier], false)
    }
    trackedElementCustomEvent(nativeIdentifier, customEventName) {
        this.proxy.sendMessage(2, TrackedElementHandler_TrackedElementCustomEvent_ParamsSpec.$, null, [nativeIdentifier, customEventName], false)
    }
}
const TrackedElementHandler_TrackedElementVisibilityChanged_ParamsSpec = {
    $: {}
};
const TrackedElementHandler_TrackedElementActivated_ParamsSpec = {
    $: {}
};
const TrackedElementHandler_TrackedElementCustomEvent_ParamsSpec = {
    $: {}
};
mojo.internal.Struct(TrackedElementHandler_TrackedElementVisibilityChanged_ParamsSpec.$, "TrackedElementHandler_TrackedElementVisibilityChanged_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("visible", 8, 0, mojo.internal.Bool, false, false, 0, undefined, undefined), mojo.internal.StructField("rect", 16, 0, RectFSpec.$, null, false, 0, undefined, undefined)], [[0, 32]]);
mojo.internal.Struct(TrackedElementHandler_TrackedElementActivated_ParamsSpec.$, "TrackedElementHandler_TrackedElementActivated_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(TrackedElementHandler_TrackedElementCustomEvent_ParamsSpec.$, "TrackedElementHandler_TrackedElementCustomEvent_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("customEventName", 8, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 24]]);
const HelpBubbleArrowPositionSpec = {
    $: mojo.internal.Enum()
};
var HelpBubbleArrowPosition;
(function(HelpBubbleArrowPosition) {
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["MIN_VALUE"] = 0] = "MIN_VALUE";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["MAX_VALUE"] = 11] = "MAX_VALUE";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["TOP_LEFT"] = 0] = "TOP_LEFT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["TOP_CENTER"] = 1] = "TOP_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["TOP_RIGHT"] = 2] = "TOP_RIGHT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["BOTTOM_CENTER"] = 4] = "BOTTOM_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["LEFT_TOP"] = 6] = "LEFT_TOP";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["LEFT_CENTER"] = 7] = "LEFT_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["LEFT_BOTTOM"] = 8] = "LEFT_BOTTOM";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["RIGHT_TOP"] = 9] = "RIGHT_TOP";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["RIGHT_CENTER"] = 10] = "RIGHT_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["RIGHT_BOTTOM"] = 11] = "RIGHT_BOTTOM"
}
)(HelpBubbleArrowPosition || (HelpBubbleArrowPosition = {}));
const HelpBubbleClosedReasonSpec = {
    $: mojo.internal.Enum()
};
var HelpBubbleClosedReason;
(function(HelpBubbleClosedReason) {
    HelpBubbleClosedReason[HelpBubbleClosedReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    HelpBubbleClosedReason[HelpBubbleClosedReason["MAX_VALUE"] = 2] = "MAX_VALUE";
    HelpBubbleClosedReason[HelpBubbleClosedReason["kPageChanged"] = 0] = "kPageChanged";
    HelpBubbleClosedReason[HelpBubbleClosedReason["kDismissedByUser"] = 1] = "kDismissedByUser";
    HelpBubbleClosedReason[HelpBubbleClosedReason["kTimedOut"] = 2] = "kTimedOut"
}
)(HelpBubbleClosedReason || (HelpBubbleClosedReason = {}));
class HelpBubbleHandlerFactoryPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "help_bubble.mojom.HelpBubbleHandlerFactory", scope)
    }
}
class HelpBubbleHandlerFactoryRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(HelpBubbleHandlerFactoryPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    createHelpBubbleHandler(client, handler) {
        this.proxy.sendMessage(0, HelpBubbleHandlerFactory_CreateHelpBubbleHandler_ParamsSpec.$, null, [client, handler], false)
    }
}
class HelpBubbleHandlerFactory {
    static get $interfaceName() {
        return "help_bubble.mojom.HelpBubbleHandlerFactory"
    }
    static getRemote() {
        let remote = new HelpBubbleHandlerFactoryRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}
class HelpBubbleHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "help_bubble.mojom.HelpBubbleHandler", scope)
    }
}
class HelpBubbleHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(HelpBubbleHandlerPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    bindTrackedElementHandler(handler) {
        this.proxy.sendMessage(0, HelpBubbleHandler_BindTrackedElementHandler_ParamsSpec.$, null, [handler], false)
    }
    helpBubbleButtonPressed(nativeIdentifier, buttonIndex) {
        this.proxy.sendMessage(1, HelpBubbleHandler_HelpBubbleButtonPressed_ParamsSpec.$, null, [nativeIdentifier, buttonIndex], false)
    }
    helpBubbleClosed(nativeIdentifier, reason) {
        this.proxy.sendMessage(2, HelpBubbleHandler_HelpBubbleClosed_ParamsSpec.$, null, [nativeIdentifier, reason], false)
    }
}
class HelpBubbleClientPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "help_bubble.mojom.HelpBubbleClient", scope)
    }
}
class HelpBubbleClientRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(HelpBubbleClientPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    showHelpBubble(params) {
        this.proxy.sendMessage(0, HelpBubbleClient_ShowHelpBubble_ParamsSpec.$, null, [params], false)
    }
    toggleFocusForAccessibility(nativeIdentifier) {
        this.proxy.sendMessage(1, HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec.$, null, [nativeIdentifier], false)
    }
    hideHelpBubble(nativeIdentifier) {
        this.proxy.sendMessage(2, HelpBubbleClient_HideHelpBubble_ParamsSpec.$, null, [nativeIdentifier], false)
    }
    externalHelpBubbleUpdated(nativeIdentifier, shown) {
        this.proxy.sendMessage(3, HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec.$, null, [nativeIdentifier, shown], false)
    }
}
class HelpBubbleClientCallbackRouter {
    helper_internal_;
    $;
    router_;
    showHelpBubble;
    toggleFocusForAccessibility;
    hideHelpBubble;
    externalHelpBubbleUpdated;
    onConnectionError;
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(HelpBubbleClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.showHelpBubble = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(0, HelpBubbleClient_ShowHelpBubble_ParamsSpec.$, null, this.showHelpBubble.createReceiverHandler(false), false);
        this.toggleFocusForAccessibility = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1, HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec.$, null, this.toggleFocusForAccessibility.createReceiverHandler(false), false);
        this.hideHelpBubble = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(2, HelpBubbleClient_HideHelpBubble_ParamsSpec.$, null, this.hideHelpBubble.createReceiverHandler(false), false);
        this.externalHelpBubbleUpdated = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(3, HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec.$, null, this.externalHelpBubbleUpdated.createReceiverHandler(false), false);
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter()
    }
    removeListener(id) {
        return this.router_.removeListener(id)
    }
}
const HelpBubbleButtonParamsSpec = {
    $: {}
};
const ProgressSpec = {
    $: {}
};
const HelpBubbleParamsSpec = {
    $: {}
};
const HelpBubbleHandlerFactory_CreateHelpBubbleHandler_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_BindTrackedElementHandler_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleButtonPressed_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleClosed_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_ShowHelpBubble_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_HideHelpBubble_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec = {
    $: {}
};
mojo.internal.Struct(HelpBubbleButtonParamsSpec.$, "HelpBubbleButtonParams", [mojo.internal.StructField("text", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("isDefault", 8, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(ProgressSpec.$, "Progress", [mojo.internal.StructField("current", 0, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined), mojo.internal.StructField("total", 1, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleParamsSpec.$, "HelpBubbleParams", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("position", 8, 0, HelpBubbleArrowPositionSpec.$, HelpBubbleArrowPosition.TOP_CENTER, false, 0, undefined, undefined), mojo.internal.StructField("titleText", 16, 0, mojo.internal.String, null, true, 0, undefined, undefined), mojo.internal.StructField("bodyText", 24, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("closeButtonAltText", 32, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("bodyIconName", 40, 0, mojo.internal.String, null, true, 0, undefined, undefined), mojo.internal.StructField("bodyIconAltText", 48, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("progress", 56, 0, ProgressSpec.$, null, true, 0, undefined, undefined), mojo.internal.StructField("buttons", 64, 0, mojo.internal.Array(HelpBubbleButtonParamsSpec.$, false), null, false, 0, undefined, undefined), mojo.internal.StructField("focus_on_show_hint_$flag", 12, 0, mojo.internal.Bool, false, false, 0, {
    isPrimary: true,
    linkedValueFieldName: "focus_on_show_hint_$value",
    originalFieldName: "focusOnShowHint"
}, undefined), mojo.internal.StructField("focus_on_show_hint_$value", 12, 1, mojo.internal.Bool, false, false, 0, {
    isPrimary: false,
    originalFieldName: "focusOnShowHint"
}, undefined), mojo.internal.StructField("timeout", 72, 0, TimeDeltaSpec.$, null, true, 0, undefined, undefined)], [[0, 88]]);
mojo.internal.Struct(HelpBubbleHandlerFactory_CreateHelpBubbleHandler_ParamsSpec.$, "HelpBubbleHandlerFactory_CreateHelpBubbleHandler_Params", [mojo.internal.StructField("client", 0, 0, mojo.internal.InterfaceProxy(HelpBubbleClientRemote), null, false, 0, undefined, undefined), mojo.internal.StructField("handler", 8, 0, mojo.internal.InterfaceRequest(HelpBubbleHandlerPendingReceiver), null, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleHandler_BindTrackedElementHandler_ParamsSpec.$, "HelpBubbleHandler_BindTrackedElementHandler_Params", [mojo.internal.StructField("handler", 0, 0, mojo.internal.InterfaceRequest(TrackedElementHandlerPendingReceiver), null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleButtonPressed_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleButtonPressed_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("buttonIndex", 8, 0, mojo.internal.Uint8, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleClosed_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleClosed_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("reason", 8, 0, HelpBubbleClosedReasonSpec.$, 0, false, 0, undefined, undefined)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleClient_ShowHelpBubble_ParamsSpec.$, "HelpBubbleClient_ShowHelpBubble_Params", [mojo.internal.StructField("params", 0, 0, HelpBubbleParamsSpec.$, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec.$, "HelpBubbleClient_ToggleFocusForAccessibility_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleClient_HideHelpBubble_ParamsSpec.$, "HelpBubbleClient_HideHelpBubble_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec.$, "HelpBubbleClient_ExternalHelpBubbleUpdated_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0, undefined, undefined), mojo.internal.StructField("shown", 8, 0, mojo.internal.Bool, false, false, 0, undefined, undefined)], [[0, 24]]);
const ACTION_BUTTON_ID_PREFIX = "action-button-";
const HELP_BUBBLE_DISMISSED_EVENT = "help-bubble-dismissed";
const HELP_BUBBLE_TIMED_OUT_EVENT = "help-bubble-timed-out";
const HELP_BUBBLE_SCROLL_ANCHOR_OPTIONS = {
    behavior: "smooth",
    block: "center"
};
class HelpBubbleElement extends CrLitElement {
    static get is() {
        return "help-bubble"
    }
    static get styles() {
        return getCss$1()
    }
    render() {
        return getHtml$1.bind(this)()
    }
    static get properties() {
        return {
            nativeId: {
                type: String,
                reflect: true
            },
            position: {
                type: HelpBubbleArrowPosition,
                reflect: true
            },
            bodyIconName: {
                type: String
            },
            bodyIconAltText: {
                type: String
            },
            progress: {
                type: Object
            },
            titleText: {
                type: String
            },
            bodyText: {
                type: String
            },
            buttons: {
                type: Array
            },
            sortedButtons: {
                type: Array
            },
            closeButtonAltText: {
                type: String
            },
            closeButtonTabIndex: {
                type: Number
            },
            progressData_: {
                type: Array,
                state: true
            }
        }
    }
    #nativeId_accessor_storage = "";
    get nativeId() {
        return this.#nativeId_accessor_storage
    }
    set nativeId(value) {
        this.#nativeId_accessor_storage = value
    }
    #bodyText_accessor_storage = "";
    get bodyText() {
        return this.#bodyText_accessor_storage
    }
    set bodyText(value) {
        this.#bodyText_accessor_storage = value
    }
    #titleText_accessor_storage = "";
    get titleText() {
        return this.#titleText_accessor_storage
    }
    set titleText(value) {
        this.#titleText_accessor_storage = value
    }
    #closeButtonAltText_accessor_storage = "";
    get closeButtonAltText() {
        return this.#closeButtonAltText_accessor_storage
    }
    set closeButtonAltText(value) {
        this.#closeButtonAltText_accessor_storage = value
    }
    #closeButtonTabIndex_accessor_storage = 0;
    get closeButtonTabIndex() {
        return this.#closeButtonTabIndex_accessor_storage
    }
    set closeButtonTabIndex(value) {
        this.#closeButtonTabIndex_accessor_storage = value
    }
    #position_accessor_storage = HelpBubbleArrowPosition.TOP_CENTER;
    get position() {
        return this.#position_accessor_storage
    }
    set position(value) {
        this.#position_accessor_storage = value
    }
    #buttons_accessor_storage = [];
    get buttons() {
        return this.#buttons_accessor_storage
    }
    set buttons(value) {
        this.#buttons_accessor_storage = value
    }
    #sortedButtons_accessor_storage = [];
    get sortedButtons() {
        return this.#sortedButtons_accessor_storage
    }
    set sortedButtons(value) {
        this.#sortedButtons_accessor_storage = value
    }
    #progress_accessor_storage = null;
    get progress() {
        return this.#progress_accessor_storage
    }
    set progress(value) {
        this.#progress_accessor_storage = value
    }
    #bodyIconName_accessor_storage = null;
    get bodyIconName() {
        return this.#bodyIconName_accessor_storage
    }
    set bodyIconName(value) {
        this.#bodyIconName_accessor_storage = value
    }
    #bodyIconAltText_accessor_storage = "";
    get bodyIconAltText() {
        return this.#bodyIconAltText_accessor_storage
    }
    set bodyIconAltText(value) {
        this.#bodyIconAltText_accessor_storage = value
    }
    timeoutMs = null;
    timeoutTimerId = null;
    debouncedUpdate = null;
    padding = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    fixed = false;
    focusAnchor = false;
    buttonListObserver_ = null;
    anchorElement_ = null;
    #progressData__accessor_storage = [];
    get progressData_() {
        return this.#progressData__accessor_storage
    }
    set progressData_(value) {
        this.#progressData__accessor_storage = value
    }
    resizeObserver_ = null;
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("buttons")) {
            this.sortedButtons = this.buttons.toSorted(this.buttonSortFunc_)
        }
    }
    show(anchorElement) {
        this.anchorElement_ = anchorElement;
        if (this.progress) {
            this.progressData_ = new Array(this.progress.total);
            this.progressData_.fill(true)
        } else {
            this.progressData_ = []
        }
        this.closeButtonTabIndex = this.buttons.length ? this.buttons.length + 2 : 1;
        assert(this.anchorElement_, "Tried to show a help bubble but anchorElement does not exist");
        this.style.display = "block";
        this.style.position = this.fixed ? "fixed" : "absolute";
        this.removeAttribute("aria-hidden");
        this.updatePosition_();
        this.debouncedUpdate = debounceEnd(( () => {
            if (this.anchorElement_) {
                this.updatePosition_()
            }
        }
        ), 50);
        this.buttonListObserver_ = new MutationObserver(this.debouncedUpdate);
        this.buttonListObserver_.observe(this.$.buttons, {
            childList: true
        });
        window.addEventListener("resize", this.debouncedUpdate);
        if (this.timeoutMs !== null) {
            const timedOutCallback = () => {
                this.fire(HELP_BUBBLE_TIMED_OUT_EVENT, {
                    nativeId: this.nativeId
                })
            }
            ;
            this.timeoutTimerId = setTimeout(timedOutCallback, this.timeoutMs)
        }
        if (this.offsetParent && !this.fixed) {
            this.resizeObserver_ = new ResizeObserver(( () => {
                this.updatePosition_();
                this.anchorElement_?.scrollIntoView(HELP_BUBBLE_SCROLL_ANCHOR_OPTIONS)
            }
            ));
            this.resizeObserver_.observe(this.offsetParent)
        }
    }
    hide() {
        if (this.resizeObserver_) {
            this.resizeObserver_.disconnect();
            this.resizeObserver_ = null
        }
        this.style.display = "none";
        this.setAttribute("aria-hidden", "true");
        this.anchorElement_ = null;
        if (this.timeoutTimerId !== null) {
            clearInterval(this.timeoutTimerId);
            this.timeoutTimerId = null
        }
        if (this.buttonListObserver_) {
            this.buttonListObserver_.disconnect();
            this.buttonListObserver_ = null
        }
        if (this.debouncedUpdate) {
            window.removeEventListener("resize", this.debouncedUpdate);
            this.debouncedUpdate = null
        }
    }
    getAnchorElement() {
        return this.anchorElement_
    }
    getButtonForTesting(buttonIndex) {
        return this.$.buttons.querySelector(`[id="${ACTION_BUTTON_ID_PREFIX + buttonIndex}"]`)
    }
    focus() {
        const defaultButton = this.$.buttons.querySelector("cr-button.default-button") || this.$.buttons.querySelector("cr-button");
        if (defaultButton) {
            defaultButton.focus();
            return
        }
        this.$.close.focus();
        if (this.anchorElement_ && this.focusAnchor) {
            this.anchorElement_.focus()
        }
    }
    static isDefaultButtonLeading() {
        return isWindows
    }
    dismiss_() {
        assert(this.nativeId, "Dismiss: expected help bubble to have a native id.");
        this.fire(HELP_BUBBLE_DISMISSED_EVENT, {
            nativeId: this.nativeId,
            fromActionButton: false
        })
    }
    onKeyDown_(e) {
        if (e.key === "Escape") {
            e.stopPropagation();
            this.dismiss_()
        }
    }
    blockPropagation_(e) {
        e.stopPropagation()
    }
    getProgressClass_(index) {
        return index < this.progress.current ? "current-progress" : "total-progress"
    }
    shouldShowTitleInTopContainer_() {
        return !!this.titleText && !this.progress
    }
    shouldShowBodyInTopContainer_() {
        return !this.progress && !this.titleText
    }
    shouldShowBodyInMain_() {
        return !!this.progress || !!this.titleText
    }
    shouldShowBodyIcon_() {
        return this.bodyIconName !== null && this.bodyIconName !== ""
    }
    onButtonClick_(e) {
        assert(this.nativeId, "Action button clicked: expected help bubble to have a native ID.");
        const index = parseInt(e.target.id.substring(ACTION_BUTTON_ID_PREFIX.length));
        this.fire(HELP_BUBBLE_DISMISSED_EVENT, {
            nativeId: this.nativeId,
            fromActionButton: true,
            buttonIndex: index
        })
    }
    getButtonId_(item) {
        const index = this.buttons.indexOf(item);
        assert(index > -1);
        return ACTION_BUTTON_ID_PREFIX + index
    }
    getButtonClass_(isDefault) {
        return isDefault ? "default-button focus-outline-visible" : "focus-outline-visible"
    }
    getButtonTabIndex_(item) {
        const index = this.buttons.indexOf(item);
        assert(index > -1);
        return item.isDefault ? 1 : index + 2
    }
    buttonSortFunc_(button1, button2) {
        if (button1.isDefault) {
            return isWindows ? -1 : 1
        }
        if (button2.isDefault) {
            return isWindows ? 1 : -1
        }
        return 0
    }
    getArrowClass_() {
        let classList = "";
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.TOP_RIGHT:
            classList = "top-edge ";
            break;
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            classList = "bottom-edge ";
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
            classList = "left-edge ";
            break;
        case HelpBubbleArrowPosition.RIGHT_TOP:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            classList = "right-edge ";
            break;
        default:
            assertNotReached("Unknown help bubble position: " + this.position)
        }
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
            classList += "left-position";
            break;
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
            classList += "horizontal-center-position";
            break;
        case HelpBubbleArrowPosition.TOP_RIGHT:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            classList += "right-position";
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.RIGHT_TOP:
            classList += "top-position";
            break;
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
            classList += "vertical-center-position";
            break;
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            classList += "bottom-position";
            break;
        default:
            assertNotReached("Unknown help bubble position: " + this.position)
        }
        return classList
    }
    updatePosition_() {
        assert(this.anchorElement_, "Update position: expected valid anchor element.");
        const ANCHOR_OFFSET = 16;
        const ARROW_WIDTH = 16;
        const ARROW_OFFSET_FROM_EDGE = 22 + ARROW_WIDTH / 2;
        const anchorRect = this.anchorElement_.getBoundingClientRect();
        const anchorRectCenter = {
            x: anchorRect.left + anchorRect.width / 2,
            y: anchorRect.top + anchorRect.height / 2
        };
        const helpBubbleRect = this.getBoundingClientRect();
        let offsetX = this.anchorElement_.offsetLeft;
        let offsetY = this.anchorElement_.offsetTop;
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.TOP_RIGHT:
            offsetY += anchorRect.height + ANCHOR_OFFSET + this.padding.bottom;
            break;
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            offsetY -= helpBubbleRect.height + ANCHOR_OFFSET + this.padding.top;
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
            offsetX += anchorRect.width + ANCHOR_OFFSET + this.padding.right;
            break;
        case HelpBubbleArrowPosition.RIGHT_TOP:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            offsetX -= helpBubbleRect.width + ANCHOR_OFFSET + this.padding.left;
            break;
        default:
            assertNotReached()
        }
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
            if (anchorRect.left + ARROW_OFFSET_FROM_EDGE > anchorRectCenter.x) {
                offsetX += anchorRect.width / 2 - ARROW_OFFSET_FROM_EDGE
            }
            break;
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
            offsetX += anchorRect.width / 2 - helpBubbleRect.width / 2;
            break;
        case HelpBubbleArrowPosition.TOP_RIGHT:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            if (anchorRect.right - ARROW_OFFSET_FROM_EDGE < anchorRectCenter.x) {
                offsetX += anchorRect.width / 2 - helpBubbleRect.width + ARROW_OFFSET_FROM_EDGE
            } else {
                offsetX += anchorRect.width - helpBubbleRect.width
            }
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.RIGHT_TOP:
            if (anchorRect.top + ARROW_OFFSET_FROM_EDGE > anchorRectCenter.y) {
                offsetY += anchorRect.height / 2 - ARROW_OFFSET_FROM_EDGE
            }
            break;
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
            offsetY += anchorRect.height / 2 - helpBubbleRect.height / 2;
            break;
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            if (anchorRect.bottom - ARROW_OFFSET_FROM_EDGE < anchorRectCenter.y) {
                offsetY += anchorRect.height / 2 - helpBubbleRect.height + ARROW_OFFSET_FROM_EDGE
            } else {
                offsetY += anchorRect.height - helpBubbleRect.height
            }
            break;
        default:
            assertNotReached()
        }
        this.style.top = offsetY.toString() + "px";
        this.style.left = offsetX.toString() + "px"
    }
}
customElements.define(HelpBubbleElement.is, HelpBubbleElement);
const ANCHOR_HIGHLIGHT_CLASS = "help-anchor-highlight";
function isRtlLang(element) {
    return window.getComputedStyle(element).direction === "rtl"
}
function reflectArrowPosition(position) {
    switch (position) {
    case HelpBubbleArrowPosition.TOP_LEFT:
        return HelpBubbleArrowPosition.TOP_RIGHT;
    case HelpBubbleArrowPosition.TOP_RIGHT:
        return HelpBubbleArrowPosition.TOP_LEFT;
    case HelpBubbleArrowPosition.BOTTOM_LEFT:
        return HelpBubbleArrowPosition.BOTTOM_RIGHT;
    case HelpBubbleArrowPosition.BOTTOM_RIGHT:
        return HelpBubbleArrowPosition.BOTTOM_LEFT;
    case HelpBubbleArrowPosition.LEFT_TOP:
        return HelpBubbleArrowPosition.RIGHT_TOP;
    case HelpBubbleArrowPosition.LEFT_CENTER:
        return HelpBubbleArrowPosition.RIGHT_CENTER;
    case HelpBubbleArrowPosition.LEFT_BOTTOM:
        return HelpBubbleArrowPosition.RIGHT_BOTTOM;
    case HelpBubbleArrowPosition.RIGHT_TOP:
        return HelpBubbleArrowPosition.LEFT_TOP;
    case HelpBubbleArrowPosition.RIGHT_CENTER:
        return HelpBubbleArrowPosition.LEFT_CENTER;
    case HelpBubbleArrowPosition.RIGHT_BOTTOM:
        return HelpBubbleArrowPosition.LEFT_BOTTOM;
    default:
        return position
    }
}
class HelpBubbleController {
    nativeId_;
    root_;
    anchor_ = null;
    bubble_ = null;
    options_ = {
        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        fixed: false
    };
    isBubbleShowing_ = false;
    isAnchorVisible_ = false;
    lastAnchorBounds_ = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    isExternal_ = false;
    constructor(nativeId, root) {
        assert(nativeId, "HelpBubble: nativeId was not defined when registering help bubble");
        assert(root, "HelpBubble: shadowRoot was not defined when registering help bubble");
        this.nativeId_ = nativeId;
        this.root_ = root
    }
    isBubbleShowing() {
        return this.isBubbleShowing_
    }
    canShowBubble() {
        return this.hasAnchor()
    }
    hasBubble() {
        return !!this.bubble_
    }
    getBubble() {
        return this.bubble_
    }
    hasAnchor() {
        return !!this.anchor_
    }
    getAnchor() {
        return this.anchor_
    }
    getNativeId() {
        return this.nativeId_
    }
    getPadding() {
        return this.options_.padding
    }
    getAnchorVisibility() {
        return this.isAnchorVisible_
    }
    getLastAnchorBounds() {
        return this.lastAnchorBounds_
    }
    updateAnchorVisibility(isVisible, bounds) {
        const changed = isVisible !== this.isAnchorVisible_ || bounds.x !== this.lastAnchorBounds_.x || bounds.y !== this.lastAnchorBounds_.y || bounds.width !== this.lastAnchorBounds_.width || bounds.height !== this.lastAnchorBounds_.height;
        this.isAnchorVisible_ = isVisible;
        this.lastAnchorBounds_ = bounds;
        return changed
    }
    isAnchorFixed() {
        return this.options_.fixed
    }
    isExternal() {
        return this.isExternal_
    }
    updateExternalShowingStatus(isShowing) {
        this.isExternal_ = true;
        this.isBubbleShowing_ = isShowing;
        this.setAnchorHighlight_(isShowing)
    }
    track(trackable, options) {
        assert(!this.anchor_);
        let anchor = null;
        if (typeof trackable === "string") {
            anchor = this.root_.querySelector(trackable)
        } else if (Array.isArray(trackable)) {
            anchor = this.deepQuery(trackable)
        } else if (trackable instanceof HTMLElement) {
            anchor = trackable
        } else {
            assertNotReached("HelpBubble: anchor argument was unrecognized when registering " + "help bubble")
        }
        if (!anchor) {
            return false
        }
        anchor.dataset["nativeId"] = this.nativeId_;
        this.anchor_ = anchor;
        this.options_ = options;
        return true
    }
    deepQuery(selectors) {
        let cur = this.root_;
        for (const selector of selectors) {
            if (cur.shadowRoot) {
                cur = cur.shadowRoot
            }
            const el = cur.querySelector(selector);
            if (!el) {
                return null
            } else {
                cur = el
            }
        }
        return cur
    }
    show() {
        this.isExternal_ = false;
        if (!(this.bubble_ && this.anchor_)) {
            return
        }
        this.bubble_.show(this.anchor_);
        this.isBubbleShowing_ = true;
        this.setAnchorHighlight_(true)
    }
    hide() {
        if (!this.bubble_) {
            return
        }
        this.bubble_.hide();
        this.bubble_.remove();
        this.bubble_ = null;
        this.isBubbleShowing_ = false;
        this.setAnchorHighlight_(false)
    }
    createBubble(params) {
        assert(this.anchor_, "HelpBubble: anchor was not defined when showing help bubble");
        assert(this.anchor_.parentNode, "HelpBubble: anchor element not in DOM");
        this.bubble_ = document.createElement("help-bubble");
        this.bubble_.nativeId = this.nativeId_;
        this.bubble_.position = isRtlLang(this.anchor_) ? reflectArrowPosition(params.position) : params.position;
        this.bubble_.closeButtonAltText = params.closeButtonAltText;
        this.bubble_.bodyText = params.bodyText;
        this.bubble_.bodyIconName = params.bodyIconName || null;
        this.bubble_.bodyIconAltText = params.bodyIconAltText;
        this.bubble_.titleText = params.titleText || "";
        this.bubble_.progress = params.progress || null;
        this.bubble_.buttons = params.buttons;
        this.bubble_.padding = this.options_.padding;
        this.bubble_.focusAnchor = params.focusOnShowHint === false;
        if (params.timeout) {
            this.bubble_.timeoutMs = Number(params.timeout.microseconds / 1000n);
            assert(this.bubble_.timeoutMs > 0)
        }
        assert(!this.bubble_.progress || this.bubble_.progress.total >= this.bubble_.progress.current);
        assert(this.root_);
        if (getComputedStyle(this.anchor_).getPropertyValue("position") === "fixed") {
            this.bubble_.fixed = true
        }
        this.anchor_.parentNode.insertBefore(this.bubble_, this.anchor_);
        return this.bubble_
    }
    setAnchorHighlight_(highlight) {
        assert(this.anchor_, "Set anchor highlight: expected valid anchor element.");
        this.anchor_.classList.toggle(ANCHOR_HIGHLIGHT_CLASS, highlight);
        if (highlight) {
            (this.bubble_ || this.anchor_).focus();
            this.anchor_.scrollIntoView(HELP_BUBBLE_SCROLL_ANCHOR_OPTIONS)
        }
    }
}
class HelpBubbleProxyImpl {
    trackedElementHandler_ = new TrackedElementHandlerRemote;
    callbackRouter_ = new HelpBubbleClientCallbackRouter;
    handler_ = new HelpBubbleHandlerRemote;
    constructor() {
        const factory = HelpBubbleHandlerFactory.getRemote();
        factory.createHelpBubbleHandler(this.callbackRouter_.$.bindNewPipeAndPassRemote(), this.handler_.$.bindNewPipeAndPassReceiver());
        this.handler_.bindTrackedElementHandler(this.trackedElementHandler_.$.bindNewPipeAndPassReceiver())
    }
    static getInstance() {
        return instance$3 || (instance$3 = new HelpBubbleProxyImpl)
    }
    static setInstance(obj) {
        instance$3 = obj
    }
    getTrackedElementHandler() {
        return this.trackedElementHandler_
    }
    getHandler() {
        return this.handler_
    }
    getCallbackRouter() {
        return this.callbackRouter_
    }
}
let instance$3 = null;
const HelpBubbleMixinLit = superClass => {
    class HelpBubbleMixinLit extends superClass {
        trackedElementHandler_;
        helpBubbleHandler_;
        helpBubbleCallbackRouter_;
        helpBubbleControllerById_ = new Map;
        helpBubbleListenerIds_ = [];
        helpBubbleFixedAnchorObserver_ = null;
        helpBubbleResizeObserver_ = null;
        helpBubbleDismissedEventTracker_ = new EventTracker;
        debouncedAnchorMayHaveChangedCallback_ = null;
        constructor(...args) {
            super(...args);
            this.trackedElementHandler_ = HelpBubbleProxyImpl.getInstance().getTrackedElementHandler();
            this.helpBubbleHandler_ = HelpBubbleProxyImpl.getInstance().getHandler();
            this.helpBubbleCallbackRouter_ = HelpBubbleProxyImpl.getInstance().getCallbackRouter()
        }
        connectedCallback() {
            super.connectedCallback();
            const router = this.helpBubbleCallbackRouter_;
            this.helpBubbleListenerIds_.push(router.showHelpBubble.addListener(this.onShowHelpBubble_.bind(this)), router.toggleFocusForAccessibility.addListener(this.onToggleHelpBubbleFocusForAccessibility_.bind(this)), router.hideHelpBubble.addListener(this.onHideHelpBubble_.bind(this)), router.externalHelpBubbleUpdated.addListener(this.onExternalHelpBubbleUpdated_.bind(this)));
            const isVisible = element => {
                const rect = element.getBoundingClientRect();
                return rect.height > 0 && rect.width > 0
            }
            ;
            this.debouncedAnchorMayHaveChangedCallback_ = debounceEnd(this.onAnchorBoundsMayHaveChanged_.bind(this), 50);
            this.helpBubbleResizeObserver_ = new ResizeObserver((entries => entries.forEach(( ({target: target}) => {
                if (target === document.body) {
                    if (this.debouncedAnchorMayHaveChangedCallback_) {
                        this.debouncedAnchorMayHaveChangedCallback_()
                    }
                } else {
                    this.onAnchorVisibilityChanged_(target, isVisible(target))
                }
            }
            ))));
            this.helpBubbleFixedAnchorObserver_ = new IntersectionObserver((entries => entries.forEach(( ({target: target, isIntersecting: isIntersecting}) => this.onAnchorVisibilityChanged_(target, isIntersecting)))),{
                root: null
            });
            document.addEventListener("scroll", this.debouncedAnchorMayHaveChangedCallback_, {
                passive: true
            });
            this.helpBubbleResizeObserver_.observe(document.body);
            this.controllers.forEach((ctrl => this.observeControllerAnchor_(ctrl)))
        }
        get controllers() {
            return Array.from(this.helpBubbleControllerById_.values())
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            for (const listenerId of this.helpBubbleListenerIds_) {
                this.helpBubbleCallbackRouter_.removeListener(listenerId)
            }
            this.helpBubbleListenerIds_ = [];
            assert(this.helpBubbleResizeObserver_);
            this.helpBubbleResizeObserver_.disconnect();
            this.helpBubbleResizeObserver_ = null;
            assert(this.helpBubbleFixedAnchorObserver_);
            this.helpBubbleFixedAnchorObserver_.disconnect();
            this.helpBubbleFixedAnchorObserver_ = null;
            this.helpBubbleDismissedEventTracker_.removeAll();
            this.helpBubbleControllerById_.clear();
            if (this.debouncedAnchorMayHaveChangedCallback_) {
                document.removeEventListener("scroll", this.debouncedAnchorMayHaveChangedCallback_);
                this.debouncedAnchorMayHaveChangedCallback_ = null
            }
        }
        registerHelpBubble(nativeId, trackable, options={}) {
            if (this.helpBubbleControllerById_.has(nativeId)) {
                const ctrl = this.helpBubbleControllerById_.get(nativeId);
                if (ctrl && ctrl.isBubbleShowing()) {
                    return null
                }
                this.unregisterHelpBubble(nativeId)
            }
            const controller = new HelpBubbleController(nativeId,this.shadowRoot);
            controller.track(trackable, parseOptions(options));
            this.helpBubbleControllerById_.set(nativeId, controller);
            if (this.helpBubbleResizeObserver_) {
                this.observeControllerAnchor_(controller)
            }
            return controller
        }
        unregisterHelpBubble(nativeId) {
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            if (ctrl && ctrl.hasAnchor()) {
                this.onAnchorVisibilityChanged_(ctrl.getAnchor(), false);
                this.unobserveControllerAnchor_(ctrl)
            }
            this.helpBubbleControllerById_.delete(nativeId)
        }
        observeControllerAnchor_(controller) {
            const anchor = controller.getAnchor();
            assert(anchor, "Help bubble does not have anchor");
            if (controller.isAnchorFixed()) {
                assert(this.helpBubbleFixedAnchorObserver_);
                this.helpBubbleFixedAnchorObserver_.observe(anchor)
            } else {
                assert(this.helpBubbleResizeObserver_);
                this.helpBubbleResizeObserver_.observe(anchor)
            }
        }
        unobserveControllerAnchor_(controller) {
            const anchor = controller.getAnchor();
            assert(anchor, "Help bubble does not have anchor");
            if (controller.isAnchorFixed()) {
                assert(this.helpBubbleFixedAnchorObserver_);
                this.helpBubbleFixedAnchorObserver_.unobserve(anchor)
            } else {
                assert(this.helpBubbleResizeObserver_);
                this.helpBubbleResizeObserver_.unobserve(anchor)
            }
        }
        isHelpBubbleShowing() {
            return this.controllers.some((ctrl => ctrl.isBubbleShowing()))
        }
        isHelpBubbleShowingForTesting(id) {
            const ctrls = this.controllers.filter(this.filterMatchingIdForTesting_(id));
            return !!ctrls[0]
        }
        getHelpBubbleForTesting(id) {
            const ctrls = this.controllers.filter(this.filterMatchingIdForTesting_(id));
            return ctrls[0] ? ctrls[0].getBubble() : null
        }
        filterMatchingIdForTesting_(anchorId) {
            return ctrl => ctrl.isBubbleShowing() && ctrl.getAnchor() !== null && ctrl.getAnchor().id === anchorId
        }
        getSortedAnchorStatusesForTesting() {
            return this.controllers.sort(( (a, b) => a.getNativeId().localeCompare(b.getNativeId()))).map((ctrl => [ctrl.getNativeId(), ctrl.hasAnchor()]))
        }
        canShowHelpBubble(controller) {
            if (!this.helpBubbleControllerById_.has(controller.getNativeId())) {
                return false
            }
            if (!controller.canShowBubble()) {
                return false
            }
            const anchor = controller.getAnchor();
            const anchorIsUsed = this.controllers.some((otherCtrl => otherCtrl.isBubbleShowing() && otherCtrl.getAnchor() === anchor));
            return !anchorIsUsed
        }
        showHelpBubble(controller, params) {
            assert(this.canShowHelpBubble(controller), "Can't show help bubble");
            const bubble = controller.createBubble(params);
            this.helpBubbleDismissedEventTracker_.add(bubble, HELP_BUBBLE_DISMISSED_EVENT, this.onHelpBubbleDismissed_.bind(this));
            this.helpBubbleDismissedEventTracker_.add(bubble, HELP_BUBBLE_TIMED_OUT_EVENT, this.onHelpBubbleTimedOut_.bind(this));
            controller.show()
        }
        hideHelpBubble(nativeId) {
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            if (!ctrl || !ctrl.hasBubble()) {
                return false
            }
            this.helpBubbleDismissedEventTracker_.remove(ctrl.getBubble(), HELP_BUBBLE_DISMISSED_EVENT);
            this.helpBubbleDismissedEventTracker_.remove(ctrl.getBubble(), HELP_BUBBLE_TIMED_OUT_EVENT);
            ctrl.hide();
            return true
        }
        notifyHelpBubbleAnchorActivated(nativeId) {
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            if (!ctrl || !ctrl.isBubbleShowing()) {
                return false
            }
            this.trackedElementHandler_.trackedElementActivated(nativeId);
            return true
        }
        notifyHelpBubbleAnchorCustomEvent(nativeId, customEvent) {
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            if (!ctrl || !ctrl.isBubbleShowing()) {
                return false
            }
            this.trackedElementHandler_.trackedElementCustomEvent(nativeId, customEvent);
            return true
        }
        onAnchorVisibilityChanged_(target, isVisible) {
            const nativeId = target.dataset["nativeId"];
            assert(nativeId);
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            const hidden = this.hideHelpBubble(nativeId);
            if (hidden) {
                this.helpBubbleHandler_.helpBubbleClosed(nativeId, HelpBubbleClosedReason.kPageChanged)
            }
            const bounds = isVisible ? this.getElementBounds_(target) : {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            if (!ctrl || ctrl.updateAnchorVisibility(isVisible, bounds)) {
                this.trackedElementHandler_.trackedElementVisibilityChanged(nativeId, isVisible, bounds)
            }
        }
        onAnchorBoundsMayHaveChanged_() {
            for (const ctrl of this.controllers) {
                if (ctrl.hasAnchor() && ctrl.getAnchorVisibility()) {
                    const bounds = this.getElementBounds_(ctrl.getAnchor());
                    if (ctrl.updateAnchorVisibility(true, bounds)) {
                        this.trackedElementHandler_.trackedElementVisibilityChanged(ctrl.getNativeId(), true, bounds)
                    }
                }
            }
        }
        getElementBounds_(element) {
            const rect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            const bounds = element.getBoundingClientRect();
            rect.x = bounds.x;
            rect.y = bounds.y;
            rect.width = bounds.width;
            rect.height = bounds.height;
            const nativeId = element.dataset["nativeId"];
            if (!nativeId) {
                return rect
            }
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            if (ctrl) {
                const padding = ctrl.getPadding();
                rect.x -= padding.left;
                rect.y -= padding.top;
                rect.width += padding.left + padding.right;
                rect.height += padding.top + padding.bottom
            }
            return rect
        }
        onShowHelpBubble_(params) {
            if (!this.helpBubbleControllerById_.has(params.nativeIdentifier)) {
                return
            }
            const ctrl = this.helpBubbleControllerById_.get(params.nativeIdentifier);
            this.showHelpBubble(ctrl, params)
        }
        onToggleHelpBubbleFocusForAccessibility_(nativeId) {
            if (!this.helpBubbleControllerById_.has(nativeId)) {
                return
            }
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            if (ctrl) {
                const anchor = ctrl.getAnchor();
                if (anchor) {
                    anchor.focus()
                }
            }
        }
        onHideHelpBubble_(nativeId) {
            this.hideHelpBubble(nativeId)
        }
        onExternalHelpBubbleUpdated_(nativeId, shown) {
            if (!this.helpBubbleControllerById_.has(nativeId)) {
                return
            }
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            ctrl.updateExternalShowingStatus(shown)
        }
        onHelpBubbleDismissed_(e) {
            const nativeId = e.detail.nativeId;
            assert(nativeId);
            const hidden = this.hideHelpBubble(nativeId);
            assert(hidden);
            if (nativeId) {
                if (e.detail.fromActionButton) {
                    this.helpBubbleHandler_.helpBubbleButtonPressed(nativeId, e.detail.buttonIndex)
                } else {
                    this.helpBubbleHandler_.helpBubbleClosed(nativeId, HelpBubbleClosedReason.kDismissedByUser)
                }
            }
        }
        onHelpBubbleTimedOut_(e) {
            const nativeId = e.detail.nativeId;
            const ctrl = this.helpBubbleControllerById_.get(nativeId);
            assert(ctrl);
            const hidden = this.hideHelpBubble(nativeId);
            assert(hidden);
            if (nativeId) {
                this.helpBubbleHandler_.helpBubbleClosed(nativeId, HelpBubbleClosedReason.kTimedOut)
            }
        }
    }
    return HelpBubbleMixinLit
}
;
function parseOptions(options) {
    const padding = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    padding.top = clampPadding(options.anchorPaddingTop);
    padding.left = clampPadding(options.anchorPaddingLeft);
    padding.bottom = clampPadding(options.anchorPaddingBottom);
    padding.right = clampPadding(options.anchorPaddingRight);
    return {
        padding: padding,
        fixed: !!options.fixed
    }
}
function clampPadding(n=0) {
    return Math.max(0, Math.min(20, n))
}
let instance$2 = null;
function getCss() {
    return instance$2 || (instance$2 = [...[getCss$e(), getCss$f()], css`:host{--cr-focus-outline-color:var(--color-new-tab-page-focus-ring);--cr-searchbox-height:48px;--cr-searchbox-shadow:0 1px 6px 0 var(--color-searchbox-shadow);--cr-searchbox-icon-left-position:12px;--cr-searchbox-icon-size-in-searchbox:20px;--cr-searchbox-icon-top-position:0;--cr-searchbox-min-width:var(--ntp-search-box-width);--ntp-theme-text-shadow:none;--ntp-one-google-bar-height:56px;--ntp-search-box-width:337px;--ntp-menu-shadow:var(--color-new-tab-page-menu-inner-shadow) 0 1px 2px 0,var(--color-new-tab-page-menu-outer-shadow) 0 2px 6px 2px;--ntp-module-width:360px;--ntp-module-layout-width:360px;--ntp-module-border-radius:16px;--ntp-module-item-border-radius:12px;--ntp-protected-icon-background-color:transparent;--ntp-protected-icon-background-color-hovered:rgba(255,255,255,.1);--ntp-scrim-opacity_:1}:host([show-composebox_]):not([ntp-realbox-next-enabled_]) cr-most-visited,:host([show-composebox_]):not([ntp-realbox-next-enabled_]) ntp-middle-slot-promo,:host([show-composebox_]):not([ntp-realbox-next-enabled_]) ntp-modules,:host([show-composebox_]):not([ntp-realbox-next-enabled_]) #backgroundImageAttribution,:host([show-composebox_]):not([ntp-realbox-next-enabled_]) ntp-customize-buttons,:host([show-composebox_]):not([ntp-realbox-next-enabled_]) setup-list-module-wrapper{display:none}:host([ntp-realbox-next-enabled_]){--ntp-scrim-opacity_:0.5}:host([realbox-can-show-secondary-side][realbox-had-secondary-side]),:host([realbox-can-show-secondary-side]){--ntp-search-box-width:746px}@media (min-width:560px){:host{--ntp-search-box-width:449px}}@media (min-width:672px){:host{--ntp-search-box-width:561px}}@media (min-width:804px){:host{--ntp-module-layout-width:768px;--ntp-module-width:768px}}cr-most-visited{--add-shortcut-background-color:var(--color-new-tab-page-add-shortcut-background);--add-shortcut-foreground-color:var(--color-new-tab-page-add-shortcut-foreground)}:host([show-background-image_]){--ntp-theme-text-shadow:0.5px 0.5px 1px rgba(0,0,0,0.5),0px 0px 2px rgba(0,0,0,0.2),0px 0px 10px rgba(0,0,0,0.1);--ntp-protected-icon-background-color:rgba(0,0,0,.6);--ntp-protected-icon-background-color-hovered:rgba(0,0,0,.7)}#oneGoogleBarStackingContext{display:flex;border:0px;top:0;width:100%;z-index:1000}:host([show-scrim_]) #oneGoogleBarStackingContext{z-index:0}#oneGoogleBarScrim{background:linear-gradient(rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.12) 45%,rgba(0,0,0,0.05) 65%,transparent 100%);height:80px;position:absolute;top:0;width:100%}#oneGoogleBarScrim[fixed]{position:fixed}#oneGoogleBar{height:100%;position:absolute;top:0;width:100%}#content{align-items:center;display:flex;flex-direction:column;height:calc(100vh - var(--ntp-one-google-bar-height));min-width:fit-content;padding-top:var(--ntp-one-google-bar-height);position:relative;z-index:1}:host([show-composebox_]) #content{z-index:unset}#logo{margin-bottom:38px;z-index:1}:host([show-composebox_]) #logo,:host([ntp-realbox-next-enabled_][show-scrim_]) #logo{z-index:2}#searchboxContainer{display:inherit;margin-bottom:16px;position:relative;z-index:2}#modules:not([hidden]){animation:300ms ease-in-out fade-in-animation}@keyframes fade-in-animation{0%{opacity:0}100%{opacity:1}}ntp-middle-slot-promo{max-width:var(--ntp-search-box-width)}cr-searchbox{visibility:hidden}cr-searchbox[shown]{visibility:visible}cr-most-visited{--cr-menu-shadow:var(--ntp-menu-shadow);--most-visited-focus-shadow:var(--ntp-focus-shadow);--most-visited-text-color:var(--color-new-tab-page-most-visited-foreground);--most-visited-text-shadow:var(--ntp-theme-text-shadow)}ntp-middle-slot-promo:not([hidden])~#modules{margin-top:16px}#themeAttribution{align-self:flex-start;bottom:16px;color:var(--color-new-tab-page-secondary-foreground);margin-inline-start:16px;position:fixed}#backgroundImageAttribution{border-radius:8px;bottom:16px;color:var(--color-new-tab-page-attribution-foreground);line-height:20px;max-width:50vw;padding:8px;position:fixed;z-index:-1;background-color:var(--ntp-protected-icon-background-color);text-shadow:none}#backgroundImageAttribution:hover{background-color:var(--ntp-protected-icon-background-color-hovered);background:rgba(var(--google-grey-900-rgb),.1)}:host-context([dir='ltr']) #backgroundImageAttribution{left:16px}:host-context([dir='rtl']) #backgroundImageAttribution{right:16px}#backgroundImageAttribution1Container{align-items:center;display:flex;flex-direction:row}#linkIcon{-webkit-mask-image:url(icons/link.svg);-webkit-mask-repeat:no-repeat;-webkit-mask-size:100%;background-color:var(--color-new-tab-page-attribution-foreground);height:16px;margin-inline-end:8px;width:16px}#backgroundImageAttribution1,#backgroundImageAttribution2{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#backgroundImageAttribution1{font-size:.875rem}#backgroundImageAttribution2{font-size:.75rem}#customizeButtons{bottom:16px;position:fixed}:host-context([dir='ltr']) #customizeButtons{right:16px}:host-context([dir='rtl']) #customizeButtons{left:16px}#contentBottomSpacer{flex-shrink:0;height:32px;width:1px}svg{position:fixed}ntp-composebox{--ntp-composebox-width:var(--ntp-search-box-width);--ntp-composebox-background-color:var(--color-new-tab-page-composebox-background)}ntp-composebox,ntp-lens-upload-dialog{left:0;position:absolute;right:0;top:0;z-index:101}#scrim{background:var(--color-new-tab-page-composebox-scrim-background);inset:0;opacity:var(--ntp-scrim-opacity_);position:fixed;transition:all 250ms ease;z-index:1}#webstoreToast{padding:16px}#microsoftAuth{display:none}`])
}
function getHtml() {
    return html`<!--_html_template_start_--><!-- #html_wrapper_imports_start
import {nothing} from '//resources/lit/v3_0/lit.rollup.js';
#html_wrapper_imports_end -->
<div id="content">
  ${this.lazyRender_ && this.microsoftModuleEnabled_ ? html`
    <iframe id="microsoftAuth" src="${this.microsoftAuthIframePath_}"></iframe>
  ` : ""}
  ${this.lazyRender_ && this.oneGoogleBarEnabled_ ? this.ntpRealboxNextEnabled_ ? html`
        <div id="oneGoogleBarStackingContext">
          <div id="oneGoogleBarScrim" ?hidden="${!this.showBackgroundImage_}"
              ?fixed="${this.scrolledToTop_}"></div>
          <ntp-iframe id="oneGoogleBar" src="${this.oneGoogleBarIframePath_}"
              ?hidden="${!this.oneGoogleBarLoaded_}"
              allow="camera ${this.oneGoogleBarIframeOrigin_}; display-capture ${this.oneGoogleBarIframeOrigin_}"> <!-- presubmit: ignore-long-line -->
          </ntp-iframe>
        </div>
        ` : html`
        <div id="oneGoogleBarScrim" ?hidden="${!this.showBackgroundImage_}"
            ?fixed="${this.scrolledToTop_}"></div>
        <ntp-iframe id="oneGoogleBar" src="${this.oneGoogleBarIframePath_}"
            ?hidden="${!this.oneGoogleBarLoaded_}"
            allow="camera ${this.oneGoogleBarIframeOrigin_}; display-capture ${this.oneGoogleBarIframeOrigin_}"> <!-- presubmit: ignore-long-line -->
        </ntp-iframe>
        ` : ""}
  <!-- TODO(crbug.com/40743294): Instead of ?hidden="${!this.logoEnabled_}" it would
       be nicer to use Lit's conditional rendering. However, that breaks
       StartupBrowserCreatorPickerNoParamsTest.ShowPickerWhenAlreadyLaunched on
       the msan builder. See crbug.com/1169070. -->
  <ntp-logo id="logo" ?single-colored="${this.singleColoredLogo_}"
      .theme="${this.theme_}" ?hidden="${!this.logoEnabled_}">
  </ntp-logo>
  ${this.ntpRealboxNextEnabled_ ? html`
    <div id="scrim"
        @click="${this.showComposebox_ && this.composeboxCloseByClickOutside_ ? this.onComposeboxClickOutside_ : nothing}"
        ?hidden="${!this.showScrim_}"></div>
  ` : ""}
  <div id="searchboxContainer">
    <cr-searchbox id="searchbox" ?is-dark="${this.isThemeDark_()}"
        placeholder-text="Ask Google"
        ?color-source-is-baseline="${this.colorSourceIsBaseline}"
        @open-composebox="${this.openComposebox_}"
        @open-lens-search="${this.onOpenLensSearch_}"
        @open-voice-search="${this.onOpenVoiceSearch_}" ?shown="${this.realboxShown_}"
        ?had-secondary-side="${this.realboxHadSecondarySide}"
        @had-secondary-side-changed="${this.onRealboxHadSecondarySideChanged_}"
        ?can-show-secondary-side="${this.realboxCanShowSecondarySide}"
        ?compose-button-enabled="${this.composeButtonEnabled}"
        ?composebox-enabled="${this.composeboxEnabled}"
        realbox-layout-mode="${this.realboxLayoutMode_}"
        ?ntp-realbox-next-enabled="${this.ntpRealboxNextEnabled_}"
        ?cycling-placeholders="${this.searchboxCyclingPlaceholders_}"
        @dropdown-visible-changed="${this.onDropdownVisibleChanged_}"
        @searchbox-input-focus-changed="${this.onInputFocusChanged_}">
    </cr-searchbox>
    ${this.showComposebox_ ? html`
      <ntp-composebox id="composebox" ?is_collapsible="false"
          ?ntp-realbox-next-enabled="${this.ntpRealboxNextEnabled_}"
          @composebox-initialized="${this.onComposeboxInitialized_}"
          @close-composebox="${this.closeComposebox_}"
          @composebox-dropdown-visible-changed="${this.onDropdownVisibleChanged_}"
          @composebox-input-focus-changed="${this.onInputFocusChanged_}"
          realbox-layout-mode="${this.realboxLayoutMode_}">
      </ntp-composebox>
    ` : ""}
    ${this.showLensUploadDialog_ ? html`
      <ntp-lens-upload-dialog id="lensUploadDialog"
          @close-lens-search="${this.onCloseLensSearch_}">
      </ntp-lens-upload-dialog>
    ` : ""}
  </div>
  ${this.lazyRender_ && this.ntpNextFeaturesEnabled_ ? html`
    <ntp-action-chips></ntp-action-chips>
  ` : ""}
  ${this.lazyRender_ ? html`
    <cr-toast id="webstoreToast" duration="10000" hidden>
      <div>You can find older colours in the Chrome Web Store</div>
      <cr-button @click="${this.onWebstoreToastButtonClick_}">
        Find themes
      </cr-button>
    </cr-toast>
  ` : ""}
  ${this.lazyRender_ ? html`
    ${this.shortcutsEnabled_ ? html`
      <cr-most-visited id="mostVisited" .theme="${this.theme_?.mostVisited || null}"
          single-row reflow-on-overflow>
      </cr-most-visited>
    ` : ""}
    ${this.middleSlotPromoEnabled_ ? html`
      <ntp-middle-slot-promo
          @ntp-middle-slot-promo-loaded="${this.onMiddleSlotPromoLoaded_}"
          ?hidden="${!this.promoAndModulesLoaded_}">
      </ntp-middle-slot-promo>
    ` : ""}
    ${this.modulesEnabled_ ? html`
      ${html`
        <ntp-modules id="modules"
            ?modules-shown-to-user="${this.modulesShownToUser}"
            @modules-shown-to-user-changed="${this.onModulesShownToUserChanged_}"
            @customize-module="${this.onCustomizeModule_}"
            @modules-loaded="${this.onModulesLoaded_}"
            ?hidden="${!this.promoAndModulesLoaded_}">
        </ntp-modules>
      `}
    ` : ""}
    ${this.showBrowserPromo_ ? ( () => {
        switch (this.browserPromoType_) {
        case "simple":
            return html`
        <individual-promos maxPromos="${this.browserPromoLimit_}">
        </individual-promos>

      `;
        case "setuplist":
            return html`
        <setup-list-module-wrapper maxPromos="${this.browserPromoLimit_}"
            maxCompletedPromos="${this.browserPromoCompletedLimit_}">
        </setup-list-module-wrapper>
      `;
        default:
            return ""
        }
    }
    )() : ""}
  ${!this.isFooterVisible_ ? html`
      <a id="backgroundImageAttribution"
          href="${this.backgroundImageAttributionUrl_}"
          ?hidden="${!this.backgroundImageAttribution1_}">
        <div id="backgroundImageAttribution1Container">
          <div id="linkIcon" ?hidden="${!this.backgroundImageAttributionUrl_}"></div>
          <div id="backgroundImageAttribution1">
            ${this.backgroundImageAttribution1_}
          </div>
        </div>
        <div id="backgroundImageAttribution2"
            ?hidden="${!this.backgroundImageAttribution2_}">
          ${this.backgroundImageAttribution2_}
        </div>
      </a>
      <ntp-customize-buttons id="customizeButtons"
          ?modules-shown-to-user="${this.modulesShownToUser}"
          ?show-background-image="${this.showBackgroundImage_}"
          ?show-customize="${this.showCustomize_}"
          ?show-customize-chrome-text="${this.showCustomizeChromeText_}"
          ?show-wallpaper-search="${this.showWallpaperSearch_}"
          ?show-wallpaper-search-button="${this.showWallpaperSearchButton_}"
          ?wallpaper-search-button-animation-enabled="${this.wallpaperSearchButtonAnimationEnabled_}"
          @customize-click="${this.onCustomizeClick_}"
          @wallpaper-search-click="${this.onWallpaperSearchClick_}" show-shadow>
      </ntp-customize-buttons>
    ` : ""}
    ${this.showThemeAttribution_() ? html`
      <div id="themeAttribution">
        <div>Theme created by</div>
        <img src="${this.theme_.backgroundImage.attributionUrl.url}">
      </div>
    ` : ""}
  ` : ""}
  <div id="contentBottomSpacer"></div>
</div>
${this.showVoiceSearchOverlay_ ? html`
  <ntp-voice-search-overlay @close="${this.onVoiceSearchOverlayClose_}">
  </ntp-voice-search-overlay>
` : ""}
${!this.ntpRealboxNextEnabled_ && this.showComposebox_ ? html`
  <div id="scrim"
      @click="${this.composeboxCloseByClickOutside_ ? this.onComposeboxClickOutside_ : nothing}"></div>
` : ""}
<svg>
  <defs>
    <clipPath id="oneGoogleBarClipPath">
      <!-- Set an initial non-empty clip-path so the OneGoogleBar resize events
           are processed. When the clip-path is empty, it's possible for the
           OneGoogleBar to get into a state where it does not send  the
           'overlayUpdates' message which is used to populate this
           clip-path. -->
      <rect x="0" y="0" width="1" height="1"></rect>
    </clipPath>
  </defs>
</svg>
<!--_html_template_end_-->`
}
class PromiseResolver {
    resolve_ = () => {}
    ;
    reject_ = () => {}
    ;
    isFulfilled_ = false;
    promise_;
    constructor() {
        this.promise_ = new Promise(( (resolve, reject) => {
            this.resolve_ = resolution => {
                resolve(resolution);
                this.isFulfilled_ = true
            }
            ;
            this.reject_ = reason => {
                reject(reason);
                this.isFulfilled_ = true
            }
        }
        ))
    }
    get isFulfilled() {
        return this.isFulfilled_
    }
    get promise() {
        return this.promise_
    }
    get resolve() {
        return this.resolve_
    }
    get reject() {
        return this.reject_
    }
}
class LoadTimeResolver {
    resolver_ = new PromiseResolver;
    eventTracker_ = new EventTracker;
    constructor(url) {
        this.eventTracker_.add(window, "message", ( ({data: data}) => {
            if (data.frameType === "background-image" && data.messageType === "loaded" && url === data.url) {
                this.resolve_(data.time)
            }
        }
        ))
    }
    get promise() {
        return this.resolver_.promise
    }
    reject() {
        this.resolver_.reject();
        this.eventTracker_.removeAll()
    }
    resolve_(loadTime) {
        this.resolver_.resolve(loadTime);
        this.eventTracker_.removeAll()
    }
}
let instance$1 = null;
class BackgroundManager {
    static getInstance() {
        return instance$1 || (instance$1 = new BackgroundManager)
    }
    static setInstance(newInstance) {
        instance$1 = newInstance
    }
    backgroundImage_;
    loadTimeResolver_ = null;
    url_;
    constructor() {
        this.backgroundImage_ = strictQuery(document.body, "#backgroundImage", HTMLIFrameElement);
        this.url_ = this.backgroundImage_.src
    }
    setShowBackgroundImage(show) {
        document.body.toggleAttribute("show-background-image", show)
    }
    setBackgroundColor(color) {
        document.body.style.backgroundColor = skColorToRgba(color)
    }
    setBackgroundImage(image) {
        const url = new URL("chrome-untrusted://new-tab-page/custom_background_image");
        url.searchParams.append("url", image.url.url);
        if (image.url2x) {
            url.searchParams.append("url2x", image.url2x.url)
        }
        if (image.size) {
            url.searchParams.append("size", image.size)
        }
        if (image.repeatX) {
            url.searchParams.append("repeatX", image.repeatX)
        }
        if (image.repeatY) {
            url.searchParams.append("repeatY", image.repeatY)
        }
        if (image.positionX) {
            url.searchParams.append("positionX", image.positionX)
        }
        if (image.positionY) {
            url.searchParams.append("positionY", image.positionY)
        }
        if (url.href === this.url_) {
            return
        }
        if (this.loadTimeResolver_) {
            this.loadTimeResolver_.reject();
            this.loadTimeResolver_ = null
        }
        this.backgroundImage_.contentWindow.location.replace(url.href);
        this.url_ = url.href
    }
    getBackgroundImageLoadTime() {
        if (!this.loadTimeResolver_) {
            this.loadTimeResolver_ = new LoadTimeResolver(this.backgroundImage_.src);
            WindowProxy.getInstance().postMessage(this.backgroundImage_, "sendLoadTime", "chrome-untrusted://new-tab-page")
        }
        return this.loadTimeResolver_.promise
    }
}
let instance = null;
class CustomizeButtonsProxy {
    static getInstance() {
        if (!instance) {
            const handler = new CustomizeButtonsHandlerRemote;
            const callbackRouter = new CustomizeButtonsDocumentCallbackRouter;
            CustomizeButtonsHandlerFactory.getRemote().createCustomizeButtonsHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver());
            instance = new CustomizeButtonsProxy(handler,callbackRouter)
        }
        return instance
    }
    static setInstance(handler, callbackRouter) {
        instance = new CustomizeButtonsProxy(handler,callbackRouter)
    }
    handler;
    callbackRouter;
    constructor(handler, callbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter
    }
}
var CustomizeDialogPage;
(function(CustomizeDialogPage) {
    CustomizeDialogPage["BACKGROUNDS"] = "backgrounds";
    CustomizeDialogPage["SHORTCUTS"] = "shortcuts";
    CustomizeDialogPage["MODULES"] = "modules";
    CustomizeDialogPage["THEMES"] = "themes";
    CustomizeDialogPage["WALLPAPER_SEARCH"] = "wallpaper_search"
}
)(CustomizeDialogPage || (CustomizeDialogPage = {}));
var ModuleLoadStatus;
(function(ModuleLoadStatus) {
    ModuleLoadStatus[ModuleLoadStatus["MODULE_LOAD_IN_PROGRESS"] = 0] = "MODULE_LOAD_IN_PROGRESS";
    ModuleLoadStatus[ModuleLoadStatus["MODULE_LOAD_NOT_ATTEMPTED"] = 1] = "MODULE_LOAD_NOT_ATTEMPTED";
    ModuleLoadStatus[ModuleLoadStatus["MODULE_LOAD_COMPLETE"] = 2] = "MODULE_LOAD_COMPLETE"
}
)(ModuleLoadStatus || (ModuleLoadStatus = {}));
var NtpElement;
(function(NtpElement) {
    NtpElement[NtpElement["OTHER"] = 0] = "OTHER";
    NtpElement[NtpElement["BACKGROUND"] = 1] = "BACKGROUND";
    NtpElement[NtpElement["ONE_GOOGLE_BAR"] = 2] = "ONE_GOOGLE_BAR";
    NtpElement[NtpElement["LOGO"] = 3] = "LOGO";
    NtpElement[NtpElement["REALBOX"] = 4] = "REALBOX";
    NtpElement[NtpElement["MOST_VISITED"] = 5] = "MOST_VISITED";
    NtpElement[NtpElement["MIDDLE_SLOT_PROMO"] = 6] = "MIDDLE_SLOT_PROMO";
    NtpElement[NtpElement["MODULE"] = 7] = "MODULE";
    NtpElement[NtpElement["CUSTOMIZE"] = 8] = "CUSTOMIZE";
    NtpElement[NtpElement["CUSTOMIZE_BUTTON"] = 9] = "CUSTOMIZE_BUTTON";
    NtpElement[NtpElement["CUSTOMIZE_DIALOG"] = 10] = "CUSTOMIZE_DIALOG";
    NtpElement[NtpElement["WALLPAPER_SEARCH_BUTTON"] = 11] = "WALLPAPER_SEARCH_BUTTON";
    NtpElement[NtpElement["MAX_VALUE"] = 11] = "MAX_VALUE"
}
)(NtpElement || (NtpElement = {}));
var NtpCustomizeChromeEntryPoint;
(function(NtpCustomizeChromeEntryPoint) {
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["CUSTOMIZE_BUTTON"] = 0] = "CUSTOMIZE_BUTTON";
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["MODULE"] = 1] = "MODULE";
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["URL"] = 2] = "URL";
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["WALLPAPER_SEARCH_BUTTON"] = 3] = "WALLPAPER_SEARCH_BUTTON";
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["MAX_VALUE"] = 3] = "MAX_VALUE"
}
)(NtpCustomizeChromeEntryPoint || (NtpCustomizeChromeEntryPoint = {}));
var NtpWallpaperSearchButtonHideCondition;
(function(NtpWallpaperSearchButtonHideCondition) {
    NtpWallpaperSearchButtonHideCondition[NtpWallpaperSearchButtonHideCondition["NONE"] = 0] = "NONE";
    NtpWallpaperSearchButtonHideCondition[NtpWallpaperSearchButtonHideCondition["BACKGROUND_IMAGE_SET"] = 1] = "BACKGROUND_IMAGE_SET";
    NtpWallpaperSearchButtonHideCondition[NtpWallpaperSearchButtonHideCondition["THEME_SET"] = 2] = "THEME_SET";
    NtpWallpaperSearchButtonHideCondition[NtpWallpaperSearchButtonHideCondition["MAX_VALUE"] = 2] = "MAX_VALUE"
}
)(NtpWallpaperSearchButtonHideCondition || (NtpWallpaperSearchButtonHideCondition = {}));
const CUSTOMIZE_URL_PARAM = "customize";
const OGB_IFRAME_ORIGIN = "chrome-untrusted://new-tab-page";
const MSAL_IFRAME_ORIGIN = "chrome-untrusted://ntp-microsoft-auth";
const CUSTOMIZE_CHROME_BUTTON_ELEMENT_ID = "NewTabPageUI::kCustomizeChromeButtonElementId";
const realboxCanShowSecondarySideMediaQueryList = window.matchMedia("(min-width: 900px)");
function recordClick(element) {
    recordEnumeration("NewTabPage.Click", element, NtpElement.MAX_VALUE + 1)
}
function recordCustomizeChromeOpen(element) {
    recordEnumeration("NewTabPage.CustomizeChromeOpened", element, NtpCustomizeChromeEntryPoint.MAX_VALUE + 1)
}
function ensureLazyLoaded() {
    const script = document.createElement("script");
    script.type = "module";
    script.src = getTrustedScriptURL`./lazy_load.js`;
    document.body.appendChild(script)
}
function recordShowBrowserPromosResult(result) {
    recordEnumeration("UserEducation.NtpPromos.ShowResult", result, ShowNtpPromosResult.MAX_VALUE + 1)
}
const AppElementBase = HelpBubbleMixinLit(CrLitElement);
class AppElement extends AppElementBase {
    static get is() {
        return "ntp-app"
    }
    static get styles() {
        return getCss()
    }
    render() {
        return getHtml.bind(this)()
    }
    static get properties() {
        return {
            oneGoogleBarIframeOrigin_: {
                type: String
            },
            oneGoogleBarIframePath_: {
                type: String
            },
            oneGoogleBarLoaded_: {
                type: Boolean
            },
            theme_: {
                type: Object
            },
            showCustomize_: {
                type: Boolean
            },
            showCustomizeChromeText_: {
                type: Boolean
            },
            showWallpaperSearch_: {
                type: Boolean
            },
            isFooterVisible_: {
                type: Boolean
            },
            selectedCustomizeDialogPage_: {
                type: String
            },
            showVoiceSearchOverlay_: {
                type: Boolean
            },
            showBackgroundImage_: {
                reflect: true,
                type: Boolean
            },
            backgroundImageAttribution1_: {
                type: String
            },
            backgroundImageAttribution2_: {
                type: String
            },
            backgroundImageAttributionUrl_: {
                type: String
            },
            colorSourceIsBaseline: {
                type: Boolean
            },
            logoColor_: {
                type: String
            },
            singleColoredLogo_: {
                type: Boolean
            },
            realboxCanShowSecondarySide: {
                type: Boolean,
                reflect: true
            },
            realboxHadSecondarySide: {
                type: Boolean,
                reflect: true,
                notify: true
            },
            composeboxCloseByClickOutside_: {
                type: Boolean
            },
            composeboxEnabled: {
                type: Boolean
            },
            composeButtonEnabled: {
                type: Boolean
            },
            browserPromoType_: {
                type: String
            },
            browserPromoLimit_: {
                type: Number
            },
            browserPromoCompletedLimit_: {
                type: Number
            },
            showBrowserPromo_: {
                type: Boolean
            },
            realboxShown_: {
                type: Boolean
            },
            logoEnabled_: {
                type: Boolean
            },
            oneGoogleBarEnabled_: {
                type: Boolean
            },
            shortcutsEnabled_: {
                type: Boolean
            },
            middleSlotPromoEnabled_: {
                type: Boolean
            },
            modulesEnabled_: {
                type: Boolean
            },
            middleSlotPromoLoaded_: {
                type: Boolean
            },
            modulesLoadedStatus_: {
                type: Number,
                reflect: true
            },
            modulesShownToUser: {
                type: Boolean,
                reflect: true
            },
            microsoftModuleEnabled_: {
                type: Boolean
            },
            microsoftAuthIframePath_: {
                type: String
            },
            ntpRealboxNextEnabled_: {
                type: Boolean,
                reflect: true
            },
            promoAndModulesLoaded_: {
                type: Boolean
            },
            realboxLayoutMode_: {
                type: String,
                reflect: true
            },
            searchboxCyclingPlaceholders_: {
                type: Boolean
            },
            showComposebox_: {
                type: Boolean,
                reflect: true
            },
            showLensUploadDialog_: {
                type: Boolean
            },
            lazyRender_: {
                type: Boolean
            },
            scrolledToTop_: {
                type: Boolean
            },
            wallpaperSearchButtonAnimationEnabled_: {
                type: Boolean
            },
            wallpaperSearchButtonEnabled_: {
                type: Boolean
            },
            showWallpaperSearchButton_: {
                type: Boolean
            },
            wasComposeboxOpened_: {
                type: Boolean
            },
            ntpNextFeaturesEnabled_: {
                type: Boolean
            },
            dropdownIsVisible_: {
                type: Boolean,
                reflect: true
            },
            searchboxInputFocused_: {
                type: Boolean
            },
            composeboxInputFocused_: {
                type: Boolean
            },
            showScrim_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    #oneGoogleBarIframeOrigin__accessor_storage = OGB_IFRAME_ORIGIN;
    get oneGoogleBarIframeOrigin_() {
        return this.#oneGoogleBarIframeOrigin__accessor_storage
    }
    set oneGoogleBarIframeOrigin_(value) {
        this.#oneGoogleBarIframeOrigin__accessor_storage = value
    }
    #oneGoogleBarIframePath__accessor_storage;
    get oneGoogleBarIframePath_() {
        return this.#oneGoogleBarIframePath__accessor_storage
    }
    set oneGoogleBarIframePath_(value) {
        this.#oneGoogleBarIframePath__accessor_storage = value
    }
    #oneGoogleBarLoaded__accessor_storage = false;
    get oneGoogleBarLoaded_() {
        return this.#oneGoogleBarLoaded__accessor_storage
    }
    set oneGoogleBarLoaded_(value) {
        this.#oneGoogleBarLoaded__accessor_storage = value
    }
    #theme__accessor_storage = null;
    get theme_() {
        return this.#theme__accessor_storage
    }
    set theme_(value) {
        this.#theme__accessor_storage = value
    }
    #showCustomize__accessor_storage = false;
    get showCustomize_() {
        return this.#showCustomize__accessor_storage
    }
    set showCustomize_(value) {
        this.#showCustomize__accessor_storage = value
    }
    #showCustomizeChromeText__accessor_storage = false;
    get showCustomizeChromeText_() {
        return this.#showCustomizeChromeText__accessor_storage
    }
    set showCustomizeChromeText_(value) {
        this.#showCustomizeChromeText__accessor_storage = value
    }
    #showWallpaperSearch__accessor_storage = false;
    get showWallpaperSearch_() {
        return this.#showWallpaperSearch__accessor_storage
    }
    set showWallpaperSearch_(value) {
        this.#showWallpaperSearch__accessor_storage = value
    }
    #selectedCustomizeDialogPage__accessor_storage = null;
    get selectedCustomizeDialogPage_() {
        return this.#selectedCustomizeDialogPage__accessor_storage
    }
    set selectedCustomizeDialogPage_(value) {
        this.#selectedCustomizeDialogPage__accessor_storage = value
    }
    #showVoiceSearchOverlay__accessor_storage = false;
    get showVoiceSearchOverlay_() {
        return this.#showVoiceSearchOverlay__accessor_storage
    }
    set showVoiceSearchOverlay_(value) {
        this.#showVoiceSearchOverlay__accessor_storage = value
    }
    #showBackgroundImage__accessor_storage = false;
    get showBackgroundImage_() {
        return this.#showBackgroundImage__accessor_storage
    }
    set showBackgroundImage_(value) {
        this.#showBackgroundImage__accessor_storage = value
    }
    #backgroundImageAttribution1__accessor_storage = "";
    get backgroundImageAttribution1_() {
        return this.#backgroundImageAttribution1__accessor_storage
    }
    set backgroundImageAttribution1_(value) {
        this.#backgroundImageAttribution1__accessor_storage = value
    }
    #backgroundImageAttribution2__accessor_storage = "";
    get backgroundImageAttribution2_() {
        return this.#backgroundImageAttribution2__accessor_storage
    }
    set backgroundImageAttribution2_(value) {
        this.#backgroundImageAttribution2__accessor_storage = value
    }
    #backgroundImageAttributionUrl__accessor_storage = "";
    get backgroundImageAttributionUrl_() {
        return this.#backgroundImageAttributionUrl__accessor_storage
    }
    set backgroundImageAttributionUrl_(value) {
        this.#backgroundImageAttributionUrl__accessor_storage = value
    }
    #colorSourceIsBaseline_accessor_storage = false;
    get colorSourceIsBaseline() {
        return this.#colorSourceIsBaseline_accessor_storage
    }
    set colorSourceIsBaseline(value) {
        this.#colorSourceIsBaseline_accessor_storage = value
    }
    #logoColor__accessor_storage = null;
    get logoColor_() {
        return this.#logoColor__accessor_storage
    }
    set logoColor_(value) {
        this.#logoColor__accessor_storage = value
    }
    #singleColoredLogo__accessor_storage = false;
    get singleColoredLogo_() {
        return this.#singleColoredLogo__accessor_storage
    }
    set singleColoredLogo_(value) {
        this.#singleColoredLogo__accessor_storage = value
    }
    #realboxCanShowSecondarySide_accessor_storage = false;
    get realboxCanShowSecondarySide() {
        return this.#realboxCanShowSecondarySide_accessor_storage
    }
    set realboxCanShowSecondarySide(value) {
        this.#realboxCanShowSecondarySide_accessor_storage = value
    }
    #realboxHadSecondarySide_accessor_storage = false;
    get realboxHadSecondarySide() {
        return this.#realboxHadSecondarySide_accessor_storage
    }
    set realboxHadSecondarySide(value) {
        this.#realboxHadSecondarySide_accessor_storage = value
    }
    #realboxShown__accessor_storage = false;
    get realboxShown_() {
        return this.#realboxShown__accessor_storage
    }
    set realboxShown_(value) {
        this.#realboxShown__accessor_storage = value
    }
    #wasComposeboxOpened__accessor_storage = false;
    get wasComposeboxOpened_() {
        return this.#wasComposeboxOpened__accessor_storage
    }
    set wasComposeboxOpened_(value) {
        this.#wasComposeboxOpened__accessor_storage = value
    }
    #showLensUploadDialog__accessor_storage = false;
    get showLensUploadDialog_() {
        return this.#showLensUploadDialog__accessor_storage
    }
    set showLensUploadDialog_(value) {
        this.#showLensUploadDialog__accessor_storage = value
    }
    #showComposebox__accessor_storage = false;
    get showComposebox_() {
        return this.#showComposebox__accessor_storage
    }
    set showComposebox_(value) {
        this.#showComposebox__accessor_storage = value
    }
    #logoEnabled__accessor_storage = loadTimeData.getBoolean("logoEnabled");
    get logoEnabled_() {
        return this.#logoEnabled__accessor_storage
    }
    set logoEnabled_(value) {
        this.#logoEnabled__accessor_storage = value
    }
    #oneGoogleBarEnabled__accessor_storage = loadTimeData.getBoolean("oneGoogleBarEnabled");
    get oneGoogleBarEnabled_() {
        return this.#oneGoogleBarEnabled__accessor_storage
    }
    set oneGoogleBarEnabled_(value) {
        this.#oneGoogleBarEnabled__accessor_storage = value
    }
    #shortcutsEnabled__accessor_storage = loadTimeData.getBoolean("shortcutsEnabled");
    get shortcutsEnabled_() {
        return this.#shortcutsEnabled__accessor_storage
    }
    set shortcutsEnabled_(value) {
        this.#shortcutsEnabled__accessor_storage = value
    }
    #middleSlotPromoEnabled__accessor_storage = loadTimeData.getBoolean("middleSlotPromoEnabled");
    get middleSlotPromoEnabled_() {
        return this.#middleSlotPromoEnabled__accessor_storage
    }
    set middleSlotPromoEnabled_(value) {
        this.#middleSlotPromoEnabled__accessor_storage = value
    }
    #modulesEnabled__accessor_storage = loadTimeData.getBoolean("modulesEnabled");
    get modulesEnabled_() {
        return this.#modulesEnabled__accessor_storage
    }
    set modulesEnabled_(value) {
        this.#modulesEnabled__accessor_storage = value
    }
    #browserPromoType__accessor_storage = loadTimeData.getString("browserPromoType");
    get browserPromoType_() {
        return this.#browserPromoType__accessor_storage
    }
    set browserPromoType_(value) {
        this.#browserPromoType__accessor_storage = value
    }
    #browserPromoLimit__accessor_storage = loadTimeData.getInteger("browserPromoLimit");
    get browserPromoLimit_() {
        return this.#browserPromoLimit__accessor_storage
    }
    set browserPromoLimit_(value) {
        this.#browserPromoLimit__accessor_storage = value
    }
    #browserPromoCompletedLimit__accessor_storage = loadTimeData.getInteger("browserPromoCompletedLimit");
    get browserPromoCompletedLimit_() {
        return this.#browserPromoCompletedLimit__accessor_storage
    }
    set browserPromoCompletedLimit_(value) {
        this.#browserPromoCompletedLimit__accessor_storage = value
    }
    #showBrowserPromo__accessor_storage = false;
    get showBrowserPromo_() {
        return this.#showBrowserPromo__accessor_storage
    }
    set showBrowserPromo_(value) {
        this.#showBrowserPromo__accessor_storage = value
    }
    #middleSlotPromoLoaded__accessor_storage = false;
    get middleSlotPromoLoaded_() {
        return this.#middleSlotPromoLoaded__accessor_storage
    }
    set middleSlotPromoLoaded_(value) {
        this.#middleSlotPromoLoaded__accessor_storage = value
    }
    #modulesLoadedStatus__accessor_storage = ModuleLoadStatus.MODULE_LOAD_IN_PROGRESS;
    get modulesLoadedStatus_() {
        return this.#modulesLoadedStatus__accessor_storage
    }
    set modulesLoadedStatus_(value) {
        this.#modulesLoadedStatus__accessor_storage = value
    }
    #modulesShownToUser_accessor_storage = false;
    get modulesShownToUser() {
        return this.#modulesShownToUser_accessor_storage
    }
    set modulesShownToUser(value) {
        this.#modulesShownToUser_accessor_storage = value
    }
    #microsoftModuleEnabled__accessor_storage = loadTimeData.getBoolean("microsoftModuleEnabled");
    get microsoftModuleEnabled_() {
        return this.#microsoftModuleEnabled__accessor_storage
    }
    set microsoftModuleEnabled_(value) {
        this.#microsoftModuleEnabled__accessor_storage = value
    }
    #microsoftAuthIframePath__accessor_storage = MSAL_IFRAME_ORIGIN;
    get microsoftAuthIframePath_() {
        return this.#microsoftAuthIframePath__accessor_storage
    }
    set microsoftAuthIframePath_(value) {
        this.#microsoftAuthIframePath__accessor_storage = value
    }
    #promoAndModulesLoaded__accessor_storage = false;
    get promoAndModulesLoaded_() {
        return this.#promoAndModulesLoaded__accessor_storage
    }
    set promoAndModulesLoaded_(value) {
        this.#promoAndModulesLoaded__accessor_storage = value
    }
    #lazyRender__accessor_storage = false;
    get lazyRender_() {
        return this.#lazyRender__accessor_storage
    }
    set lazyRender_(value) {
        this.#lazyRender__accessor_storage = value
    }
    #scrolledToTop__accessor_storage = document.documentElement.scrollTop <= 0;
    get scrolledToTop_() {
        return this.#scrolledToTop__accessor_storage
    }
    set scrolledToTop_(value) {
        this.#scrolledToTop__accessor_storage = value
    }
    #wallpaperSearchButtonAnimationEnabled__accessor_storage = loadTimeData.getBoolean("wallpaperSearchButtonAnimationEnabled");
    get wallpaperSearchButtonAnimationEnabled_() {
        return this.#wallpaperSearchButtonAnimationEnabled__accessor_storage
    }
    set wallpaperSearchButtonAnimationEnabled_(value) {
        this.#wallpaperSearchButtonAnimationEnabled__accessor_storage = value
    }
    #wallpaperSearchButtonEnabled__accessor_storage = loadTimeData.getBoolean("wallpaperSearchButtonEnabled");
    get wallpaperSearchButtonEnabled_() {
        return this.#wallpaperSearchButtonEnabled__accessor_storage
    }
    set wallpaperSearchButtonEnabled_(value) {
        this.#wallpaperSearchButtonEnabled__accessor_storage = value
    }
    #showWallpaperSearchButton__accessor_storage = false;
    get showWallpaperSearchButton_() {
        return this.#showWallpaperSearchButton__accessor_storage
    }
    set showWallpaperSearchButton_(value) {
        this.#showWallpaperSearchButton__accessor_storage = value
    }
    #composeButtonEnabled_accessor_storage = loadTimeData.getBoolean("searchboxShowComposeEntrypoint");
    get composeButtonEnabled() {
        return this.#composeButtonEnabled_accessor_storage
    }
    set composeButtonEnabled(value) {
        this.#composeButtonEnabled_accessor_storage = value
    }
    #composeboxCloseByClickOutside__accessor_storage = loadTimeData.getBoolean("composeboxCloseByClickOutside");
    get composeboxCloseByClickOutside_() {
        return this.#composeboxCloseByClickOutside__accessor_storage
    }
    set composeboxCloseByClickOutside_(value) {
        this.#composeboxCloseByClickOutside__accessor_storage = value
    }
    #composeboxEnabled_accessor_storage = loadTimeData.getBoolean("searchboxShowComposebox");
    get composeboxEnabled() {
        return this.#composeboxEnabled_accessor_storage
    }
    set composeboxEnabled(value) {
        this.#composeboxEnabled_accessor_storage = value
    }
    #isFooterVisible__accessor_storage = false;
    get isFooterVisible_() {
        return this.#isFooterVisible__accessor_storage
    }
    set isFooterVisible_(value) {
        this.#isFooterVisible__accessor_storage = value
    }
    #ntpRealboxNextEnabled__accessor_storage = loadTimeData.getBoolean("ntpRealboxNextEnabled");
    get ntpRealboxNextEnabled_() {
        return this.#ntpRealboxNextEnabled__accessor_storage
    }
    set ntpRealboxNextEnabled_(value) {
        this.#ntpRealboxNextEnabled__accessor_storage = value
    }
    #realboxLayoutMode__accessor_storage = loadTimeData.getString("realboxLayoutMode");
    get realboxLayoutMode_() {
        return this.#realboxLayoutMode__accessor_storage
    }
    set realboxLayoutMode_(value) {
        this.#realboxLayoutMode__accessor_storage = value
    }
    #searchboxCyclingPlaceholders__accessor_storage = loadTimeData.getBoolean("searchboxCyclingPlaceholders");
    get searchboxCyclingPlaceholders_() {
        return this.#searchboxCyclingPlaceholders__accessor_storage
    }
    set searchboxCyclingPlaceholders_(value) {
        this.#searchboxCyclingPlaceholders__accessor_storage = value
    }
    #ntpNextFeaturesEnabled__accessor_storage = loadTimeData.getBoolean("ntpNextFeaturesEnabled");
    get ntpNextFeaturesEnabled_() {
        return this.#ntpNextFeaturesEnabled__accessor_storage
    }
    set ntpNextFeaturesEnabled_(value) {
        this.#ntpNextFeaturesEnabled__accessor_storage = value
    }
    #dropdownIsVisible__accessor_storage = false;
    get dropdownIsVisible_() {
        return this.#dropdownIsVisible__accessor_storage
    }
    set dropdownIsVisible_(value) {
        this.#dropdownIsVisible__accessor_storage = value
    }
    #searchboxInputFocused__accessor_storage = false;
    get searchboxInputFocused_() {
        return this.#searchboxInputFocused__accessor_storage
    }
    set searchboxInputFocused_(value) {
        this.#searchboxInputFocused__accessor_storage = value
    }
    #composeboxInputFocused__accessor_storage = false;
    get composeboxInputFocused_() {
        return this.#composeboxInputFocused__accessor_storage
    }
    set composeboxInputFocused_(value) {
        this.#composeboxInputFocused__accessor_storage = value
    }
    #showScrim__accessor_storage = false;
    get showScrim_() {
        return this.#showScrim__accessor_storage
    }
    set showScrim_(value) {
        this.#showScrim__accessor_storage = value
    }
    callbackRouter_;
    pageHandler_;
    customizeButtonsCallbackRouter_;
    customizeButtonsHandler_;
    backgroundManager_;
    connectMicrosoftAuthToParentDocumentListenerId_ = null;
    setThemeListenerId_ = null;
    setCustomizeChromeSidePanelVisibilityListener_ = null;
    setWallpaperSearchButtonVisibilityListener_ = null;
    footerVisibilityUpdatedListener_ = null;
    eventTracker_ = new EventTracker;
    shouldPrintPerformance_ = false;
    backgroundImageLoadStartEpoch_ = 0;
    backgroundImageLoadStart_ = 0;
    showWebstoreToastListenerId_ = null;
    pendingComposeboxContextFiles_ = [];
    pendingComposeboxText_ = "";
    pendingComposeboxMode_ = ComposeboxMode.DEFAULT;
    constructor() {
        performance.mark("app-creation-start");
        super();
        this.callbackRouter_ = NewTabPageProxy.getInstance().callbackRouter;
        this.pageHandler_ = NewTabPageProxy.getInstance().handler;
        this.customizeButtonsCallbackRouter_ = CustomizeButtonsProxy.getInstance().callbackRouter;
        this.customizeButtonsHandler_ = CustomizeButtonsProxy.getInstance().handler;
        this.backgroundManager_ = BackgroundManager.getInstance();
        this.shouldPrintPerformance_ = new URLSearchParams(location.search).has("print_perf");
        this.oneGoogleBarIframePath_ = ( () => {
            const params = new URLSearchParams;
            params.set("paramsencoded", btoa(window.location.search.replace(/^[?]/, "&")));
            return `${OGB_IFRAME_ORIGIN}/one-google-bar?${params}`
        }
        )();
        this.showCustomize_ = WindowProxy.getInstance().url.searchParams.has(CUSTOMIZE_URL_PARAM);
        this.selectedCustomizeDialogPage_ = WindowProxy.getInstance().url.searchParams.get(CUSTOMIZE_URL_PARAM);
        this.realboxCanShowSecondarySide = realboxCanShowSecondarySideMediaQueryList.matches;
        this.backgroundImageLoadStartEpoch_ = performance.timeOrigin;
        recordLinearValue("NewTabPage.Height", 1, 1e3, 200, Math.floor(window.innerHeight));
        recordLinearValue("NewTabPage.Width", 1, 1920, 384, Math.floor(window.innerWidth));
        ColorChangeUpdater.forDocument().start()
    }
    connectedCallback() {
        super.connectedCallback();
        realboxCanShowSecondarySideMediaQueryList.addEventListener("change", this.onRealboxCanShowSecondarySideChanged_.bind(this));
        this.connectMicrosoftAuthToParentDocumentListenerId_ = this.callbackRouter_.connectToParentDocument.addListener((childDocumentRemote => {
            ParentTrustedDocumentProxy.setInstance(childDocumentRemote)
        }
        ));
        this.setThemeListenerId_ = this.callbackRouter_.setTheme.addListener((theme => {
            if (!this.theme_) {
                this.onThemeLoaded_(theme)
            }
            performance.measure("theme-set");
            this.theme_ = theme
        }
        ));
        this.setCustomizeChromeSidePanelVisibilityListener_ = this.customizeButtonsCallbackRouter_.setCustomizeChromeSidePanelVisibility.addListener((visible => {
            this.showCustomize_ = visible;
            if (!visible) {
                this.showWallpaperSearch_ = false
            }
        }
        ));
        this.showWebstoreToastListenerId_ = this.callbackRouter_.showWebstoreToast.addListener(( () => {
            if (this.showCustomize_) {
                const toast = $$(this, "#webstoreToast");
                if (toast) {
                    toast.hidden = false;
                    toast.show()
                }
            }
        }
        ));
        this.setWallpaperSearchButtonVisibilityListener_ = this.callbackRouter_.setWallpaperSearchButtonVisibility.addListener((visible => {
            if (!visible) {
                this.wallpaperSearchButtonEnabled_ = visible
            }
        }
        ));
        this.footerVisibilityUpdatedListener_ = this.callbackRouter_.footerVisibilityUpdated.addListener((visible => {
            this.isFooterVisible_ = visible
        }
        ));
        this.pageHandler_.updateFooterVisibility();
        if (this.showCustomize_) {
            this.setCustomizeChromeSidePanelVisible_(this.showCustomize_);
            recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.URL)
        }
        this.eventTracker_.add(window, "message", (event => {
            const data = event.data;
            if (typeof data !== "object") {
                return
            }
            if ("frameType"in data && data.frameType === "one-google-bar") {
                this.handleOneGoogleBarMessage_(event)
            }
        }
        ));
        this.eventTracker_.add(window, "keydown", this.onWindowKeydown_.bind(this));
        this.eventTracker_.add(window, "click", this.onWindowClick_.bind(this), true);
        this.eventTracker_.add(document, "scroll", ( () => {
            this.scrolledToTop_ = document.documentElement.scrollTop <= 0
        }
        ));
        if (loadTimeData.getString("backgroundImageUrl")) {
            this.backgroundManager_.getBackgroundImageLoadTime().then((time => {
                const duration = time - this.backgroundImageLoadStartEpoch_;
                recordDuration("NewTabPage.Images.ShownTime.BackgroundImage", duration);
                if (this.shouldPrintPerformance_) {
                    this.printPerformanceDatum_("background-image-load", this.backgroundImageLoadStart_, duration);
                    this.printPerformanceDatum_("background-image-loaded", this.backgroundImageLoadStart_ + duration)
                }
            }
            ), ( () => {}
            ))
        }
        FocusOutlineManager.forDocument(document);
        if (this.composeButtonEnabled) {
            recordBoolean("NewTabPage.ComposeEntrypoint.Shown", true);
            this.pageHandler_.incrementComposeButtonShownCount()
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        realboxCanShowSecondarySideMediaQueryList.removeEventListener("change", this.onRealboxCanShowSecondarySideChanged_.bind(this));
        this.callbackRouter_.removeListener(this.connectMicrosoftAuthToParentDocumentListenerId_);
        this.callbackRouter_.removeListener(this.setThemeListenerId_);
        this.callbackRouter_.removeListener(this.showWebstoreToastListenerId_);
        this.callbackRouter_.removeListener(this.setWallpaperSearchButtonVisibilityListener_);
        this.customizeButtonsCallbackRouter_.removeListener(this.setCustomizeChromeSidePanelVisibilityListener_);
        this.callbackRouter_.removeListener(this.footerVisibilityUpdatedListener_);
        this.eventTracker_.removeAll()
    }
    firstUpdated() {
        this.pageHandler_.onAppRendered(WindowProxy.getInstance().now());
        WindowProxy.getInstance().waitForLazyRender().then(( () => {
            ensureLazyLoaded();
            this.lazyRender_ = true
        }
        ));
        this.printPerformance_();
        performance.measure("app-creation", "app-creation-start");
        if (!this.modulesEnabled_) {
            this.recordBrowserPromoMetrics_()
        }
        this.pageHandler_.maybeTriggerAutomaticCustomizeChromePromo()
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("theme_")) {
            this.showBackgroundImage_ = this.computeShowBackgroundImage_();
            this.backgroundImageAttribution1_ = this.computeBackgroundImageAttribution1_();
            this.backgroundImageAttribution2_ = this.computeBackgroundImageAttribution2_();
            this.backgroundImageAttributionUrl_ = this.computeBackgroundImageAttributionUrl_();
            this.colorSourceIsBaseline = this.computeColorSourceIsBaseline();
            this.logoColor_ = this.computeLogoColor_();
            this.singleColoredLogo_ = this.computeSingleColoredLogo_()
        }
        this.realboxShown_ = this.computeRealboxShown_();
        this.promoAndModulesLoaded_ = this.computePromoAndModulesLoaded_();
        this.showWallpaperSearchButton_ = this.computeShowWallpaperSearchButton_();
        this.showCustomizeChromeText_ = this.computeShowCustomizeChromeText_();
        this.showBrowserPromo_ = this.computeShowBrowserPromo_();
        if (changedPrivateProperties.has("modulesLoadedStatus_") && this.modulesLoadedStatus_ !== ModuleLoadStatus.MODULE_LOAD_IN_PROGRESS) {
            this.recordBrowserPromoMetrics_()
        }
        if (this.ntpRealboxNextEnabled_ && ["showComposebox_", "searchboxInputFocused_", "composeboxInputFocused_"].some((prop => changedPrivateProperties.has(prop)))) {
            this.showScrim_ = this.showComposebox_ || this.searchboxInputFocused_ || this.composeboxInputFocused_
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has("lazyRender_") && this.lazyRender_) {
            this.onLazyRendered_()
        }
        if (changedPrivateProperties.has("theme_")) {
            this.onThemeChange_()
        }
        if (changedPrivateProperties.has("logoColor_")) {
            this.style.setProperty("--ntp-logo-color", this.rgbaOrInherit_(this.logoColor_))
        }
        if (changedPrivateProperties.has("showBackgroundImage_")) {
            this.onShowBackgroundImageChange_()
        }
        if (changedPrivateProperties.has("promoAndModulesLoaded_")) {
            this.onPromoAndModulesLoadedChange_()
        }
        if (changedPrivateProperties.has("oneGoogleBarLoaded_") || changedPrivateProperties.has("theme_") || changedPrivateProperties.has("showComposebox_")) {
            this.updateOneGoogleBarAppearance_()
        }
    }
    updateOneGoogleBarAppearance_() {
        if (this.oneGoogleBarLoaded_) {
            let isNtpDarkTheme;
            if (this.showComposebox_) {
                isNtpDarkTheme = this.theme_ && this.theme_.isDark
            } else {
                isNtpDarkTheme = this.theme_ && (!!this.theme_.backgroundImage || this.theme_.isDark)
            }
            $$(this, "#oneGoogleBar").postMessage({
                type: "updateAppearance",
                applyLightTheme: isNtpDarkTheme
            })
        }
    }
    computeShowCustomizeChromeText_() {
        if (this.showWallpaperSearchButton_) {
            return false
        }
        return !this.showBackgroundImage_
    }
    computeBackgroundImageAttribution1_() {
        return this.theme_ && this.theme_.backgroundImageAttribution1 || ""
    }
    computeBackgroundImageAttribution2_() {
        return this.theme_ && this.theme_.backgroundImageAttribution2 || ""
    }
    computeBackgroundImageAttributionUrl_() {
        return this.theme_ && this.theme_.backgroundImageAttributionUrl ? this.theme_.backgroundImageAttributionUrl.url : ""
    }
    computeRealboxShown_() {
        return !!this.theme_ && !this.showLensUploadDialog_ && !this.showComposebox_
    }
    computePromoAndModulesLoaded_() {
        return (!loadTimeData.getBoolean("middleSlotPromoEnabled") || this.middleSlotPromoLoaded_) && (!loadTimeData.getBoolean("modulesEnabled") || this.modulesLoadedStatus_ === ModuleLoadStatus.MODULE_LOAD_COMPLETE)
    }
    onRealboxCanShowSecondarySideChanged_(e) {
        this.realboxCanShowSecondarySide = e.matches
    }
    onLazyRendered_() {
        document.documentElement.setAttribute("lazy-loaded", String(true));
        if (!this.isFooterVisible_) {
            this.registerHelpBubble(CUSTOMIZE_CHROME_BUTTON_ELEMENT_ID, ["ntp-customize-buttons", "#customizeButton"], {
                fixed: true
            });
            this.pageHandler_.maybeShowFeaturePromo(IphFeature.kCustomizeChrome)
        }
        if (this.showWallpaperSearchButton_) {
            this.customizeButtonsHandler_.incrementWallpaperSearchButtonShownCount()
        }
    }
    onComposeboxInitialized_(e) {
        e.detail.initializeComposeboxState(this.pendingComposeboxText_, this.pendingComposeboxContextFiles_, this.pendingComposeboxMode_);
        this.pendingComposeboxContextFiles_ = [];
        this.pendingComposeboxText_ = "";
        this.pendingComposeboxMode_ = ComposeboxMode.DEFAULT
    }
    openComposebox_(e) {
        if (e.detail.searchboxText) {
            this.pendingComposeboxText_ = e.detail.searchboxText
        }
        if (e.detail.contextFiles && e.detail.contextFiles.length > 0) {
            this.pendingComposeboxContextFiles_ = e.detail.contextFiles
        }
        this.pendingComposeboxMode_ = e.detail.mode;
        this.toggleComposebox_()
    }
    toggleComposebox_() {
        this.showComposebox_ = !this.showComposebox_;
        if (!this.wasComposeboxOpened_) {
            recordLoadDuration("NewTabPage.Composebox.FromNTPLoadToSessionStart", WindowProxy.getInstance().now());
            this.wasComposeboxOpened_ = true
        }
    }
    onComposeboxClickOutside_() {
        const composebox = this.shadowRoot.querySelector("#composebox");
        assert(composebox);
        const closeComposebox = new CustomEvent("closeComposebox",{
            detail: {
                composeboxText: composebox.getText()
            },
            bubbles: true,
            cancelable: true
        });
        this.closeComposebox_(closeComposebox)
    }
    closeComposebox_(e) {
        const composeboxText = e.detail.composeboxText;
        if (composeboxText && composeboxText.trim()) {
            this.$.searchbox.setInputText(composeboxText)
        }
        const composebox = this.shadowRoot.querySelector("#composebox");
        assert(composebox);
        composebox.setText("");
        composebox.resetModes();
        if (this.ntpRealboxNextEnabled_) {
            composebox.closeDropdown()
        }
        this.toggleComposebox_();
        this.logoColor_ = this.computeLogoColor_();
        this.singleColoredLogo_ = this.computeSingleColoredLogo_();
        this.updateOneGoogleBarAppearance_()
    }
    onOpenVoiceSearch_() {
        this.showVoiceSearchOverlay_ = true;
        recordVoiceAction(Action.ACTIVATE_SEARCH_BOX)
    }
    onOpenLensSearch_() {
        this.showLensUploadDialog_ = true
    }
    onCloseLensSearch_() {
        this.showLensUploadDialog_ = false
    }
    onCustomizeClick_() {
        this.selectedCustomizeDialogPage_ = null;
        this.setCustomizeChromeSidePanelVisible_(!this.showCustomize_);
        if (!this.showCustomize_) {
            this.customizeButtonsHandler_.incrementCustomizeChromeButtonOpenCount();
            recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.CUSTOMIZE_BUTTON)
        }
    }
    computeShowWallpaperSearchButton_() {
        if (!this.wallpaperSearchButtonEnabled_) {
            return false
        }
        switch (loadTimeData.getInteger("wallpaperSearchButtonHideCondition")) {
        case NtpWallpaperSearchButtonHideCondition.NONE:
            return true;
        case NtpWallpaperSearchButtonHideCondition.BACKGROUND_IMAGE_SET:
            return !this.showBackgroundImage_;
        case NtpWallpaperSearchButtonHideCondition.THEME_SET:
            return this.colorSourceIsBaseline && !this.showBackgroundImage_
        }
        return false
    }
    onWallpaperSearchClick_() {
        if (this.showCustomize_ && this.showWallpaperSearch_) {
            this.selectedCustomizeDialogPage_ = null;
            this.setCustomizeChromeSidePanelVisible_(!this.showCustomize_);
            return
        }
        this.selectedCustomizeDialogPage_ = CustomizeDialogPage.WALLPAPER_SEARCH;
        this.showWallpaperSearch_ = true;
        this.setCustomizeChromeSidePanelVisible_(this.showWallpaperSearch_);
        if (!this.showCustomize_) {
            this.customizeButtonsHandler_.incrementCustomizeChromeButtonOpenCount();
            recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.WALLPAPER_SEARCH_BUTTON)
        }
    }
    onVoiceSearchOverlayClose_() {
        this.showVoiceSearchOverlay_ = false
    }
    onWindowKeydown_(e) {
        let ctrlKeyPressed = e.ctrlKey;
        if (ctrlKeyPressed && e.code === "Period" && e.shiftKey) {
            this.showVoiceSearchOverlay_ = true;
            recordVoiceAction(Action.ACTIVATE_KEYBOARD)
        }
    }
    rgbaOrInherit_(skColor) {
        return skColor ? skColorToRgba(skColor) : "inherit"
    }
    computeShowBackgroundImage_() {
        return !!this.theme_ && !!this.theme_.backgroundImage
    }
    onShowBackgroundImageChange_() {
        this.backgroundManager_.setShowBackgroundImage(this.showBackgroundImage_)
    }
    onThemeChange_() {
        if (this.theme_) {
            this.backgroundManager_.setBackgroundColor(this.theme_.backgroundColor);
            this.style.setProperty("--color-new-tab-page-attribution-foreground", this.rgbaOrInherit_(this.theme_.textColor));
            this.style.setProperty("--color-new-tab-page-most-visited-foreground", this.rgbaOrInherit_(this.theme_.textColor))
        }
        this.updateBackgroundImagePath_()
    }
    onThemeLoaded_(theme) {
        recordSparseValueWithPersistentHash("NewTabPage.Collections.IdOnLoad", theme.backgroundImageCollectionId ?? "");
        if (!theme.backgroundImage) {
            recordEnumeration("NewTabPage.BackgroundImageSource", NtpBackgroundImageSource.kNoImage, NtpBackgroundImageSource.MAX_VALUE + 1)
        } else {
            recordEnumeration("NewTabPage.BackgroundImageSource", theme.backgroundImage.imageSource, NtpBackgroundImageSource.MAX_VALUE + 1)
        }
    }
    onPromoAndModulesLoadedChange_() {
        if (this.promoAndModulesLoaded_ && loadTimeData.getBoolean("modulesEnabled")) {
            recordLoadDuration("NewTabPage.Modules.ShownTime", WindowProxy.getInstance().now())
        }
    }
    updateBackgroundImagePath_() {
        const backgroundImage = this.theme_ && this.theme_.backgroundImage;
        if (!backgroundImage) {
            return
        }
        this.backgroundManager_.setBackgroundImage(backgroundImage);
        if (this.wallpaperSearchButtonAnimationEnabled_ && backgroundImage.imageSource === NtpBackgroundImageSource.kWallpaperSearch || backgroundImage.imageSource === NtpBackgroundImageSource.kWallpaperSearchInspiration) {
            this.wallpaperSearchButtonAnimationEnabled_ = false
        }
    }
    computeColorSourceIsBaseline() {
        return !!this.theme_ && this.theme_.isBaseline
    }
    computeLogoColor_() {
        if (!this.theme_) {
            return null
        }
        return this.theme_.logoColor || (this.theme_.isDark ? hexColorToSkColor("#ffffff") : null)
    }
    computeSingleColoredLogo_() {
        return !!this.theme_ && (!!this.theme_.logoColor || this.theme_.isDark)
    }
    canShowPromoWithBrowserCommand_(messageData, commandSource, commandOrigin) {
        const commandId = Object.values(Command).includes(messageData.commandId) ? messageData.commandId : Command.kUnknownCommand;
        BrowserCommandProxy.getInstance().handler.canExecuteCommand(commandId).then(( ({canExecute: canExecute}) => {
            const response = {
                messageType: messageData.messageType,
                [messageData.commandId]: canExecute
            };
            commandSource.postMessage(response, commandOrigin)
        }
        ))
    }
    executePromoBrowserCommand_(commandData, commandSource, commandOrigin) {
        const commandId = Object.values(Command).includes(commandData.commandId) ? commandData.commandId : Command.kUnknownCommand;
        BrowserCommandProxy.getInstance().handler.executeCommand(commandId, commandData.clickInfo).then(( ({commandExecuted: commandExecuted}) => {
            commandSource.postMessage(commandExecuted, commandOrigin)
        }
        ))
    }
    handleOneGoogleBarMessage_(event) {
        const data = event.data;
        if (data.messageType === "loaded") {
            const oneGoogleBar = $$(this, "#oneGoogleBar");
            oneGoogleBar.style.clipPath = "url(#oneGoogleBarClipPath)";
            oneGoogleBar.style.zIndex = "1000";
            this.oneGoogleBarLoaded_ = true;
            this.pageHandler_.onOneGoogleBarRendered(WindowProxy.getInstance().now())
        } else if (data.messageType === "overlaysUpdated") {
            this.$.oneGoogleBarClipPath.querySelectorAll("rect").forEach((el => {
                el.remove()
            }
            ));
            const overlayRects = data.data;
            overlayRects.forEach(( ({x: x, y: y, width: width, height: height}) => {
                const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rectElement.setAttribute("x", `${x - 8}`);
                rectElement.setAttribute("y", `${y - 8}`);
                rectElement.setAttribute("width", `${width + 16}`);
                rectElement.setAttribute("height", `${height + 16}`);
                this.$.oneGoogleBarClipPath.appendChild(rectElement)
            }
            ))
        } else if (data.messageType === "can-show-promo-with-browser-command") {
            this.canShowPromoWithBrowserCommand_(data, event.source, event.origin)
        } else if (data.messageType === "execute-browser-command") {
            this.executePromoBrowserCommand_(data.data, event.source, event.origin)
        } else if (data.messageType === "click") {
            recordClick(NtpElement.ONE_GOOGLE_BAR)
        }
    }
    onMiddleSlotPromoLoaded_() {
        this.middleSlotPromoLoaded_ = true
    }
    onModulesLoaded_(e) {
        this.modulesLoadedStatus_ = e.detail ? ModuleLoadStatus.MODULE_LOAD_COMPLETE : ModuleLoadStatus.MODULE_LOAD_NOT_ATTEMPTED
    }
    computeShowBrowserPromo_() {
        return !this.modulesEnabled_ || this.modulesLoadedStatus_ !== ModuleLoadStatus.MODULE_LOAD_IN_PROGRESS && !this.modulesShownToUser
    }
    recordBrowserPromoMetrics_() {
        if (!this.showBrowserPromo_) {
            recordShowBrowserPromosResult(ShowNtpPromosResult.kNotShownDueToPolicy);
            return
        }
        switch (this.browserPromoType_) {
        case "empty":
            recordShowBrowserPromosResult(ShowNtpPromosResult.kNotShownNoPromos);
            break;
        case "simple":
        case "setuplist":
            recordShowBrowserPromosResult(ShowNtpPromosResult.kShown);
            break
        }
    }
    onCustomizeModule_() {
        this.showCustomize_ = true;
        this.selectedCustomizeDialogPage_ = CustomizeDialogPage.MODULES;
        recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.MODULE);
        this.setCustomizeChromeSidePanelVisible_(this.showCustomize_)
    }
    setCustomizeChromeSidePanelVisible_(visible) {
        let section = CustomizeChromeSection.kUnspecified;
        switch (this.selectedCustomizeDialogPage_) {
        case CustomizeDialogPage.BACKGROUNDS:
        case CustomizeDialogPage.THEMES:
            section = CustomizeChromeSection.kAppearance;
            break;
        case CustomizeDialogPage.SHORTCUTS:
            section = CustomizeChromeSection.kShortcuts;
            break;
        case CustomizeDialogPage.MODULES:
            section = CustomizeChromeSection.kModules;
            break;
        case CustomizeDialogPage.WALLPAPER_SEARCH:
            section = CustomizeChromeSection.kWallpaperSearch;
            break
        }
        this.customizeButtonsHandler_.setCustomizeChromeSidePanelVisible(visible, section, SidePanelOpenTrigger.kNewTabPage)
    }
    printPerformanceDatum_(name, time, auxTime=0) {
        if (!this.shouldPrintPerformance_) {
            return
        }
        console.info(!auxTime ? `${name}: ${time}` : `${name}: ${time} (${auxTime})`)
    }
    printPerformance_() {
        if (!this.shouldPrintPerformance_) {
            return
        }
        const entryTypes = ["paint", "measure"];
        const log = entry => {
            this.printPerformanceDatum_(entry.name, entry.duration ? entry.duration : entry.startTime, entry.duration && entry.startTime ? entry.startTime : 0)
        }
        ;
        const observer = new PerformanceObserver((list => {
            list.getEntries().forEach((entry => {
                log(entry)
            }
            ))
        }
        ));
        observer.observe({
            entryTypes: entryTypes
        });
        performance.getEntries().forEach((entry => {
            if (!entryTypes.includes(entry.entryType)) {
                return
            }
            log(entry)
        }
        ))
    }
    onWebstoreToastButtonClick_() {
        window.location.assign(`https://chrome.google.com/webstore/category/collection/chrome_color_themes?hl=${window.navigator.language}`)
    }
    onWindowClick_(e) {
        if (e.composedPath() && e.composedPath()[0] === $$(this, "#content")) {
            recordClick(NtpElement.BACKGROUND);
            return
        }
        for (const target of e.composedPath()) {
            switch (target) {
            case $$(this, "ntp-logo"):
                recordClick(NtpElement.LOGO);
                return;
            case $$(this, "cr-searchbox"):
                recordClick(NtpElement.REALBOX);
                return;
            case $$(this, "cr-most-visited"):
                recordClick(NtpElement.MOST_VISITED);
                return;
            case $$(this, "ntp-middle-slot-promo"):
                recordClick(NtpElement.MIDDLE_SLOT_PROMO);
                return;
            case $$(this, "#modules"):
                recordClick(NtpElement.MODULE);
                return
            }
        }
        const customizeButtonsElement = this.shadowRoot.querySelector("ntp-customize-buttons");
        if (customizeButtonsElement) {
            for (const target of e.composedPath()) {
                switch (target) {
                case $$(customizeButtonsElement, "#customizeButton"):
                    recordClick(NtpElement.CUSTOMIZE_BUTTON);
                    return;
                case $$(customizeButtonsElement, "#wallpaperSearchButton"):
                    recordClick(NtpElement.WALLPAPER_SEARCH_BUTTON);
                    return
                }
            }
        }
        recordClick(NtpElement.OTHER)
    }
    isThemeDark_() {
        return !!this.theme_ && this.theme_.isDark
    }
    showThemeAttribution_() {
        return !!this.theme_?.backgroundImage?.attributionUrl
    }
    onDropdownVisibleChanged_(e) {
        this.dropdownIsVisible_ = e.detail.value
    }
    onInputFocusChanged_(e) {
        switch (e.type) {
        case "searchbox-input-focus-changed":
            this.searchboxInputFocused_ = e.detail.value;
            break;
        case "composebox-input-focus-changed":
            this.composeboxInputFocused_ = e.detail.value;
            break
        }
    }
    onRealboxHadSecondarySideChanged_(e) {
        this.realboxHadSecondarySide = e.detail.value
    }
    onModulesShownToUserChanged_(e) {
        this.modulesShownToUser = e.detail.value
    }
}
customElements.define(AppElement.is, AppElement);
export {$$, AppElement, BackgroundManager, BrowserCommandProxy, BrowserProxyImpl, CUSTOMIZE_CHROME_BUTTON_ELEMENT_ID, CustomizeButtonsProxy, CustomizeDialogPage, DoodleShareDialogElement, IframeElement, LogoElement, MetricsReporterImpl, NewTabPageProxy, NtpCustomizeChromeEntryPoint, NtpElement, PlaceholderTextCycler, SearchboxBrowserProxy, SearchboxElement, SearchboxIconElement, SearchboxMatchElement, Action as VoiceAction, WindowProxy, createAutocompleteMatch, getTrustedHTML, recordBoolean, recordDuration, recordEnumeration, recordLinearValue, recordLoadDuration, recordSparseValueWithPersistentHash};
