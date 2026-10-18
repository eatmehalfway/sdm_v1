const defineElement = customElements.define.bind(customElements);
customElements.define = (name, ctor, options) => {
  if (!customElements.get(name)) defineElement(name, ctor, options);
};
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/tslib/tslib.es6.mjs
function __decorate(decorators, target, key, desc) {
  var c5 = arguments.length, r7 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d3;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r7 = Reflect.decorate(decorators, target, key, desc);
  else for (var i8 = decorators.length - 1; i8 >= 0; i8--) if (d3 = decorators[i8]) r7 = (c5 < 3 ? d3(r7) : c5 > 3 ? d3(target, key, r7) : d3(target, key)) || r7;
  return c5 > 3 && r7 && Object.defineProperty(target, key, r7), r7;
}
var init_tslib_es6 = __esm({
  "node_modules/tslib/tslib.es6.mjs"() {
  }
});

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t;
var init_custom_element = __esm({
  "node_modules/@lit/reactive-element/decorators/custom-element.js"() {
    t = (t5) => (e9, o10) => {
      void 0 !== o10 ? o10.addInitializer(() => {
        customElements.define(t5, e9);
      }) : customElements.define(t5, e9);
    };
  }
});

// node_modules/@lit/reactive-element/css-tag.js
var t2, e, s, o, n, r, i, S, c;
var init_css_tag = __esm({
  "node_modules/@lit/reactive-element/css-tag.js"() {
    t2 = globalThis;
    e = t2.ShadowRoot && (void 0 === t2.ShadyCSS || t2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
    s = Symbol();
    o = /* @__PURE__ */ new WeakMap();
    n = class {
      constructor(t5, e9, o10) {
        if (this._$cssResult$ = true, o10 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t5, this.t = e9;
      }
      get styleSheet() {
        let t5 = this.o;
        const s4 = this.t;
        if (e && void 0 === t5) {
          const e9 = void 0 !== s4 && 1 === s4.length;
          e9 && (t5 = o.get(s4)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e9 && o.set(s4, t5));
        }
        return t5;
      }
      toString() {
        return this.cssText;
      }
    };
    r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
    i = (t5, ...e9) => {
      const o10 = 1 === t5.length ? t5[0] : e9.reduce((e10, s4, o11) => e10 + ((t6) => {
        if (true === t6._$cssResult$) return t6.cssText;
        if ("number" == typeof t6) return t6;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s4) + t5[o11 + 1], t5[0]);
      return new n(o10, t5, s);
    };
    S = (s4, o10) => {
      if (e) s4.adoptedStyleSheets = o10.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
      else for (const e9 of o10) {
        const o11 = document.createElement("style"), n8 = t2.litNonce;
        void 0 !== n8 && o11.setAttribute("nonce", n8), o11.textContent = e9.cssText, s4.appendChild(o11);
      }
    };
    c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
      let e9 = "";
      for (const s4 of t6.cssRules) e9 += s4.cssText;
      return r(e9);
    })(t5) : t5;
  }
});

// node_modules/@lit/reactive-element/reactive-element.js
var i2, e2, h, r2, o2, n2, a, c2, l, p, d, u, f, b, y;
var init_reactive_element = __esm({
  "node_modules/@lit/reactive-element/reactive-element.js"() {
    init_css_tag();
    init_css_tag();
    ({ is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object);
    a = globalThis;
    c2 = a.trustedTypes;
    l = c2 ? c2.emptyScript : "";
    p = a.reactiveElementPolyfillSupport;
    d = (t5, s4) => t5;
    u = { toAttribute(t5, s4) {
      switch (s4) {
        case Boolean:
          t5 = t5 ? l : null;
          break;
        case Object:
        case Array:
          t5 = null == t5 ? t5 : JSON.stringify(t5);
      }
      return t5;
    }, fromAttribute(t5, s4) {
      let i8 = t5;
      switch (s4) {
        case Boolean:
          i8 = null !== t5;
          break;
        case Number:
          i8 = null === t5 ? null : Number(t5);
          break;
        case Object:
        case Array:
          try {
            i8 = JSON.parse(t5);
          } catch (t6) {
            i8 = null;
          }
      }
      return i8;
    } };
    f = (t5, s4) => !i2(t5, s4);
    b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
    Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
    y = class extends HTMLElement {
      static addInitializer(t5) {
        this._$Ei(), (this.l ??= []).push(t5);
      }
      static get observedAttributes() {
        return this.finalize(), this._$Eh && [...this._$Eh.keys()];
      }
      static createProperty(t5, s4 = b) {
        if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t5, s4), !s4.noAccessor) {
          const i8 = Symbol(), h3 = this.getPropertyDescriptor(t5, i8, s4);
          void 0 !== h3 && e2(this.prototype, t5, h3);
        }
      }
      static getPropertyDescriptor(t5, s4, i8) {
        const { get: e9, set: r7 } = h(this.prototype, t5) ?? { get() {
          return this[s4];
        }, set(t6) {
          this[s4] = t6;
        } };
        return { get: e9, set(s5) {
          const h3 = e9?.call(this);
          r7?.call(this, s5), this.requestUpdate(t5, h3, i8);
        }, configurable: true, enumerable: true };
      }
      static getPropertyOptions(t5) {
        return this.elementProperties.get(t5) ?? b;
      }
      static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t5 = n2(this);
        t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
      }
      static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
          const t6 = this.properties, s4 = [...r2(t6), ...o2(t6)];
          for (const i8 of s4) this.createProperty(i8, t6[i8]);
        }
        const t5 = this[Symbol.metadata];
        if (null !== t5) {
          const s4 = litPropertyMetadata.get(t5);
          if (void 0 !== s4) for (const [t6, i8] of s4) this.elementProperties.set(t6, i8);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t6, s4] of this.elementProperties) {
          const i8 = this._$Eu(t6, s4);
          void 0 !== i8 && this._$Eh.set(i8, t6);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
      }
      static finalizeStyles(s4) {
        const i8 = [];
        if (Array.isArray(s4)) {
          const e9 = new Set(s4.flat(1 / 0).reverse());
          for (const s5 of e9) i8.unshift(c(s5));
        } else void 0 !== s4 && i8.push(c(s4));
        return i8;
      }
      static _$Eu(t5, s4) {
        const i8 = s4.attribute;
        return false === i8 ? void 0 : "string" == typeof i8 ? i8 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
      }
      constructor() {
        super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
      }
      _$Ev() {
        this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
      }
      addController(t5) {
        (this._$EO ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
      }
      removeController(t5) {
        this._$EO?.delete(t5);
      }
      _$E_() {
        const t5 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
        for (const i8 of s4.keys()) this.hasOwnProperty(i8) && (t5.set(i8, this[i8]), delete this[i8]);
        t5.size > 0 && (this._$Ep = t5);
      }
      createRenderRoot() {
        const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t5, this.constructor.elementStyles), t5;
      }
      connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
      }
      enableUpdating(t5) {
      }
      disconnectedCallback() {
        this._$EO?.forEach((t5) => t5.hostDisconnected?.());
      }
      attributeChangedCallback(t5, s4, i8) {
        this._$AK(t5, i8);
      }
      _$ET(t5, s4) {
        const i8 = this.constructor.elementProperties.get(t5), e9 = this.constructor._$Eu(t5, i8);
        if (void 0 !== e9 && true === i8.reflect) {
          const h3 = (void 0 !== i8.converter?.toAttribute ? i8.converter : u).toAttribute(s4, i8.type);
          this._$Em = t5, null == h3 ? this.removeAttribute(e9) : this.setAttribute(e9, h3), this._$Em = null;
        }
      }
      _$AK(t5, s4) {
        const i8 = this.constructor, e9 = i8._$Eh.get(t5);
        if (void 0 !== e9 && this._$Em !== e9) {
          const t6 = i8.getPropertyOptions(e9), h3 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
          this._$Em = e9;
          const r7 = h3.fromAttribute(s4, t6.type);
          this[e9] = r7 ?? this._$Ej?.get(e9) ?? r7, this._$Em = null;
        }
      }
      requestUpdate(t5, s4, i8, e9 = false, h3) {
        if (void 0 !== t5) {
          const r7 = this.constructor;
          if (false === e9 && (h3 = this[t5]), i8 ??= r7.getPropertyOptions(t5), !((i8.hasChanged ?? f)(h3, s4) || i8.useDefault && i8.reflect && h3 === this._$Ej?.get(t5) && !this.hasAttribute(r7._$Eu(t5, i8)))) return;
          this.C(t5, s4, i8);
        }
        false === this.isUpdatePending && (this._$ES = this._$EP());
      }
      C(t5, s4, { useDefault: i8, reflect: e9, wrapped: h3 }, r7) {
        i8 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t5) && (this._$Ej.set(t5, r7 ?? s4 ?? this[t5]), true !== h3 || void 0 !== r7) || (this._$AL.has(t5) || (this.hasUpdated || i8 || (s4 = void 0), this._$AL.set(t5, s4)), true === e9 && this._$Em !== t5 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t5));
      }
      async _$EP() {
        this.isUpdatePending = true;
        try {
          await this._$ES;
        } catch (t6) {
          Promise.reject(t6);
        }
        const t5 = this.scheduleUpdate();
        return null != t5 && await t5, !this.isUpdatePending;
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
          if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
            for (const [t7, s5] of this._$Ep) this[t7] = s5;
            this._$Ep = void 0;
          }
          const t6 = this.constructor.elementProperties;
          if (t6.size > 0) for (const [s5, i8] of t6) {
            const { wrapped: t7 } = i8, e9 = this[s5];
            true !== t7 || this._$AL.has(s5) || void 0 === e9 || this.C(s5, void 0, i8, e9);
          }
        }
        let t5 = false;
        const s4 = this._$AL;
        try {
          t5 = this.shouldUpdate(s4), t5 ? (this.willUpdate(s4), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s4)) : this._$EM();
        } catch (s5) {
          throw t5 = false, this._$EM(), s5;
        }
        t5 && this._$AE(s4);
      }
      willUpdate(t5) {
      }
      _$AE(t5) {
        this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
      }
      _$EM() {
        this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this._$ES;
      }
      shouldUpdate(t5) {
        return true;
      }
      update(t5) {
        this._$Eq &&= this._$Eq.forEach((t6) => this._$ET(t6, this[t6])), this._$EM();
      }
      updated(t5) {
      }
      firstUpdated(t5) {
      }
    };
    y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
  }
});

// node_modules/@lit/reactive-element/decorators/property.js
function n3(t5) {
  return (e9, o10) => "object" == typeof o10 ? r3(t5, e9, o10) : ((t6, e10, o11) => {
    const r7 = e10.hasOwnProperty(o11);
    return e10.constructor.createProperty(o11, t6), r7 ? Object.getOwnPropertyDescriptor(e10, o11) : void 0;
  })(t5, e9, o10);
}
var o3, r3;
var init_property = __esm({
  "node_modules/@lit/reactive-element/decorators/property.js"() {
    init_reactive_element();
    o3 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    r3 = (t5 = o3, e9, r7) => {
      const { kind: n8, metadata: i8 } = r7;
      let s4 = globalThis.litPropertyMetadata.get(i8);
      if (void 0 === s4 && globalThis.litPropertyMetadata.set(i8, s4 = /* @__PURE__ */ new Map()), "setter" === n8 && ((t5 = Object.create(t5)).wrapped = true), s4.set(r7.name, t5), "accessor" === n8) {
        const { name: o10 } = r7;
        return { set(r8) {
          const n9 = e9.get.call(this);
          e9.set.call(this, r8), this.requestUpdate(o10, n9, t5, true, r8);
        }, init(e10) {
          return void 0 !== e10 && this.C(o10, void 0, t5, e10), e10;
        } };
      }
      if ("setter" === n8) {
        const { name: o10 } = r7;
        return function(r8) {
          const n9 = this[o10];
          e9.call(this, r8), this.requestUpdate(o10, n9, t5, true, r8);
        };
      }
      throw Error("Unsupported decorator location: " + n8);
    };
  }
});

// node_modules/@lit/reactive-element/decorators/state.js
function r4(r7) {
  return n3({ ...r7, state: true, attribute: false });
}
var init_state = __esm({
  "node_modules/@lit/reactive-element/decorators/state.js"() {
    init_property();
  }
});

// node_modules/@lit/reactive-element/decorators/event-options.js
var init_event_options = __esm({
  "node_modules/@lit/reactive-element/decorators/event-options.js"() {
  }
});

// node_modules/@lit/reactive-element/decorators/base.js
var e3;
var init_base = __esm({
  "node_modules/@lit/reactive-element/decorators/base.js"() {
    e3 = (e9, t5, c5) => (c5.configurable = true, c5.enumerable = true, Reflect.decorate && "object" != typeof t5 && Object.defineProperty(e9, t5, c5), c5);
  }
});

// node_modules/@lit/reactive-element/decorators/query.js
function e4(e9, r7) {
  return (n8, s4, i8) => {
    const o10 = (t5) => t5.renderRoot?.querySelector(e9) ?? null;
    if (r7) {
      const { get: e10, set: r8 } = "object" == typeof s4 ? n8 : i8 ?? (() => {
        const t5 = Symbol();
        return { get() {
          return this[t5];
        }, set(e11) {
          this[t5] = e11;
        } };
      })();
      return e3(n8, s4, { get() {
        let t5 = e10.call(this);
        return void 0 === t5 && (t5 = o10(this), (null !== t5 || this.hasUpdated) && r8.call(this, t5)), t5;
      } });
    }
    return e3(n8, s4, { get() {
      return o10(this);
    } });
  };
}
var init_query = __esm({
  "node_modules/@lit/reactive-element/decorators/query.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-all.js
function r5(r7) {
  return (n8, o10) => e3(n8, o10, { get() {
    return (this.renderRoot ?? (e5 ??= document.createDocumentFragment())).querySelectorAll(r7);
  } });
}
var e5;
var init_query_all = __esm({
  "node_modules/@lit/reactive-element/decorators/query-all.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-async.js
var init_query_async = __esm({
  "node_modules/@lit/reactive-element/decorators/query-async.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
function o4(o10) {
  return (e9, n8) => {
    const { slot: r7, selector: s4 } = o10 ?? {}, c5 = "slot" + (r7 ? `[name=${r7}]` : ":not([name])");
    return e3(e9, n8, { get() {
      const t5 = this.renderRoot?.querySelector(c5), e10 = t5?.assignedElements(o10) ?? [];
      return void 0 === s4 ? e10 : e10.filter((t6) => t6.matches(s4));
    } });
  };
}
var init_query_assigned_elements = __esm({
  "node_modules/@lit/reactive-element/decorators/query-assigned-elements.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
function n4(n8) {
  return (o10, r7) => {
    const { slot: e9 } = n8 ?? {}, s4 = "slot" + (e9 ? `[name=${e9}]` : ":not([name])");
    return e3(o10, r7, { get() {
      const t5 = this.renderRoot?.querySelector(s4);
      return t5?.assignedNodes(n8) ?? [];
    } });
  };
}
var init_query_assigned_nodes = __esm({
  "node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js"() {
    init_base();
  }
});

// node_modules/lit/decorators.js
var init_decorators = __esm({
  "node_modules/lit/decorators.js"() {
    init_custom_element();
    init_property();
    init_state();
    init_event_options();
    init_query();
    init_query_all();
    init_query_async();
    init_query_assigned_elements();
    init_query_assigned_nodes();
  }
});

// node_modules/lit-html/lit-html.js
function V(t5, i8) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e6 ? e6.createHTML(i8) : i8;
}
function M(t5, i8, s4 = t5, e9) {
  if (i8 === E) return i8;
  let h3 = void 0 !== e9 ? s4._$Co?.[e9] : s4._$Cl;
  const o10 = a2(i8) ? void 0 : i8._$litDirective$;
  return h3?.constructor !== o10 && (h3?._$AO?.(false), void 0 === o10 ? h3 = void 0 : (h3 = new o10(t5), h3._$AT(t5, s4, e9)), void 0 !== e9 ? (s4._$Co ??= [])[e9] = h3 : s4._$Cl = h3), void 0 !== h3 && (i8 = M(t5, h3._$AS(t5, i8.values), h3, e9)), i8;
}
var t3, i3, s2, e6, h2, o5, n5, r6, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, P, N, S2, R, k, H, I, L, z, Z, B, D;
var init_lit_html = __esm({
  "node_modules/lit-html/lit-html.js"() {
    t3 = globalThis;
    i3 = (t5) => t5;
    s2 = t3.trustedTypes;
    e6 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
    h2 = "$lit$";
    o5 = `lit$${Math.random().toFixed(9).slice(2)}$`;
    n5 = "?" + o5;
    r6 = `<${n5}>`;
    l2 = document;
    c3 = () => l2.createComment("");
    a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
    u2 = Array.isArray;
    d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
    f2 = "[ 	\n\f\r]";
    v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    _ = /-->/g;
    m = />/g;
    p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    g = /'/g;
    $ = /"/g;
    y2 = /^(?:script|style|textarea|title)$/i;
    x = (t5) => (i8, ...s4) => ({ _$litType$: t5, strings: i8, values: s4 });
    b2 = x(1);
    w = x(2);
    T = x(3);
    E = Symbol.for("lit-noChange");
    A = Symbol.for("lit-nothing");
    C = /* @__PURE__ */ new WeakMap();
    P = l2.createTreeWalker(l2, 129);
    N = (t5, i8) => {
      const s4 = t5.length - 1, e9 = [];
      let n8, l4 = 2 === i8 ? "<svg>" : 3 === i8 ? "<math>" : "", c5 = v;
      for (let i9 = 0; i9 < s4; i9++) {
        const s5 = t5[i9];
        let a4, u4, d3 = -1, f3 = 0;
        for (; f3 < s5.length && (c5.lastIndex = f3, u4 = c5.exec(s5), null !== u4); ) f3 = c5.lastIndex, c5 === v ? "!--" === u4[1] ? c5 = _ : void 0 !== u4[1] ? c5 = m : void 0 !== u4[2] ? (y2.test(u4[2]) && (n8 = RegExp("</" + u4[2], "g")), c5 = p2) : void 0 !== u4[3] && (c5 = p2) : c5 === p2 ? ">" === u4[0] ? (c5 = n8 ?? v, d3 = -1) : void 0 === u4[1] ? d3 = -2 : (d3 = c5.lastIndex - u4[2].length, a4 = u4[1], c5 = void 0 === u4[3] ? p2 : '"' === u4[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n8 = void 0);
        const x2 = c5 === p2 && t5[i9 + 1].startsWith("/>") ? " " : "";
        l4 += c5 === v ? s5 + r6 : d3 >= 0 ? (e9.push(a4), s5.slice(0, d3) + h2 + s5.slice(d3) + o5 + x2) : s5 + o5 + (-2 === d3 ? i9 : x2);
      }
      return [V(t5, l4 + (t5[s4] || "<?>") + (2 === i8 ? "</svg>" : 3 === i8 ? "</math>" : "")), e9];
    };
    S2 = class _S {
      constructor({ strings: t5, _$litType$: i8 }, e9) {
        let r7;
        this.parts = [];
        let l4 = 0, a4 = 0;
        const u4 = t5.length - 1, d3 = this.parts, [f3, v2] = N(t5, i8);
        if (this.el = _S.createElement(f3, e9), P.currentNode = this.el.content, 2 === i8 || 3 === i8) {
          const t6 = this.el.content.firstChild;
          t6.replaceWith(...t6.childNodes);
        }
        for (; null !== (r7 = P.nextNode()) && d3.length < u4; ) {
          if (1 === r7.nodeType) {
            if (r7.hasAttributes()) for (const t6 of r7.getAttributeNames()) if (t6.endsWith(h2)) {
              const i9 = v2[a4++], s4 = r7.getAttribute(t6).split(o5), e10 = /([.?@])?(.*)/.exec(i9);
              d3.push({ type: 1, index: l4, name: e10[2], strings: s4, ctor: "." === e10[1] ? I : "?" === e10[1] ? L : "@" === e10[1] ? z : H }), r7.removeAttribute(t6);
            } else t6.startsWith(o5) && (d3.push({ type: 6, index: l4 }), r7.removeAttribute(t6));
            if (y2.test(r7.tagName)) {
              const t6 = r7.textContent.split(o5), i9 = t6.length - 1;
              if (i9 > 0) {
                r7.textContent = s2 ? s2.emptyScript : "";
                for (let s4 = 0; s4 < i9; s4++) r7.append(t6[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l4 });
                r7.append(t6[i9], c3());
              }
            }
          } else if (8 === r7.nodeType) if (r7.data === n5) d3.push({ type: 2, index: l4 });
          else {
            let t6 = -1;
            for (; -1 !== (t6 = r7.data.indexOf(o5, t6 + 1)); ) d3.push({ type: 7, index: l4 }), t6 += o5.length - 1;
          }
          l4++;
        }
      }
      static createElement(t5, i8) {
        const s4 = l2.createElement("template");
        return s4.innerHTML = t5, s4;
      }
    };
    R = class {
      constructor(t5, i8) {
        this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i8;
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t5) {
        const { el: { content: i8 }, parts: s4 } = this._$AD, e9 = (t5?.creationScope ?? l2).importNode(i8, true);
        P.currentNode = e9;
        let h3 = P.nextNode(), o10 = 0, n8 = 0, r7 = s4[0];
        for (; void 0 !== r7; ) {
          if (o10 === r7.index) {
            let i9;
            2 === r7.type ? i9 = new k(h3, h3.nextSibling, this, t5) : 1 === r7.type ? i9 = new r7.ctor(h3, r7.name, r7.strings, this, t5) : 6 === r7.type && (i9 = new Z(h3, this, t5)), this._$AV.push(i9), r7 = s4[++n8];
          }
          o10 !== r7?.index && (h3 = P.nextNode(), o10++);
        }
        return P.currentNode = l2, e9;
      }
      p(t5) {
        let i8 = 0;
        for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i8), i8 += s4.strings.length - 2) : s4._$AI(t5[i8])), i8++;
      }
    };
    k = class _k {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(t5, i8, s4, e9) {
        this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i8, this._$AM = s4, this.options = e9, this._$Cv = e9?.isConnected ?? true;
      }
      get parentNode() {
        let t5 = this._$AA.parentNode;
        const i8 = this._$AM;
        return void 0 !== i8 && 11 === t5?.nodeType && (t5 = i8.parentNode), t5;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(t5, i8 = this) {
        t5 = M(this, t5, i8), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
      }
      O(t5) {
        return this._$AA.parentNode.insertBefore(t5, this._$AB);
      }
      T(t5) {
        this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
      }
      _(t5) {
        this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
      }
      $(t5) {
        const { values: i8, _$litType$: s4 } = t5, e9 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
        if (this._$AH?._$AD === e9) this._$AH.p(i8);
        else {
          const t6 = new R(e9, this), s5 = t6.u(this.options);
          t6.p(i8), this.T(s5), this._$AH = t6;
        }
      }
      _$AC(t5) {
        let i8 = C.get(t5.strings);
        return void 0 === i8 && C.set(t5.strings, i8 = new S2(t5)), i8;
      }
      k(t5) {
        u2(this._$AH) || (this._$AH = [], this._$AR());
        const i8 = this._$AH;
        let s4, e9 = 0;
        for (const h3 of t5) e9 === i8.length ? i8.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i8[e9], s4._$AI(h3), e9++;
        e9 < i8.length && (this._$AR(s4 && s4._$AB.nextSibling, e9), i8.length = e9);
      }
      _$AR(t5 = this._$AA.nextSibling, s4) {
        for (this._$AP?.(false, true, s4); t5 !== this._$AB; ) {
          const s5 = i3(t5).nextSibling;
          i3(t5).remove(), t5 = s5;
        }
      }
      setConnected(t5) {
        void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
      }
    };
    H = class {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(t5, i8, s4, e9, h3) {
        this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i8, this._$AM = e9, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
      }
      _$AI(t5, i8 = this, s4, e9) {
        const h3 = this.strings;
        let o10 = false;
        if (void 0 === h3) t5 = M(this, t5, i8, 0), o10 = !a2(t5) || t5 !== this._$AH && t5 !== E, o10 && (this._$AH = t5);
        else {
          const e10 = t5;
          let n8, r7;
          for (t5 = h3[0], n8 = 0; n8 < h3.length - 1; n8++) r7 = M(this, e10[s4 + n8], i8, n8), r7 === E && (r7 = this._$AH[n8]), o10 ||= !a2(r7) || r7 !== this._$AH[n8], r7 === A ? t5 = A : t5 !== A && (t5 += (r7 ?? "") + h3[n8 + 1]), this._$AH[n8] = r7;
        }
        o10 && !e9 && this.j(t5);
      }
      j(t5) {
        t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
      }
    };
    I = class extends H {
      constructor() {
        super(...arguments), this.type = 3;
      }
      j(t5) {
        this.element[this.name] = t5 === A ? void 0 : t5;
      }
    };
    L = class extends H {
      constructor() {
        super(...arguments), this.type = 4;
      }
      j(t5) {
        this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
      }
    };
    z = class extends H {
      constructor(t5, i8, s4, e9, h3) {
        super(t5, i8, s4, e9, h3), this.type = 5;
      }
      _$AI(t5, i8 = this) {
        if ((t5 = M(this, t5, i8, 0) ?? A) === E) return;
        const s4 = this._$AH, e9 = t5 === A && s4 !== A || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h3 = t5 !== A && (s4 === A || e9);
        e9 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
      }
      handleEvent(t5) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
      }
    };
    Z = class {
      constructor(t5, i8, s4) {
        this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i8, this.options = s4;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(t5) {
        M(this, t5);
      }
    };
    B = t3.litHtmlPolyfillSupport;
    B?.(S2, k), (t3.litHtmlVersions ??= []).push("3.3.3");
    D = (t5, i8, s4) => {
      const e9 = s4?.renderBefore ?? i8;
      let h3 = e9._$litPart$;
      if (void 0 === h3) {
        const t6 = s4?.renderBefore ?? null;
        e9._$litPart$ = h3 = new k(i8.insertBefore(c3(), t6), t6, void 0, s4 ?? {});
      }
      return h3._$AI(t5), h3;
    };
  }
});

// node_modules/lit-element/lit-element.js
var s3, i4, o6;
var init_lit_element = __esm({
  "node_modules/lit-element/lit-element.js"() {
    init_reactive_element();
    init_reactive_element();
    init_lit_html();
    init_lit_html();
    s3 = globalThis;
    i4 = class extends y {
      constructor() {
        super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
      }
      createRenderRoot() {
        const t5 = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t5.firstChild, t5;
      }
      update(t5) {
        const r7 = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r7, this.renderRoot, this.renderOptions);
      }
      connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(true);
      }
      disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(false);
      }
      render() {
        return E;
      }
    };
    i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
    o6 = s3.litElementPolyfillSupport;
    o6?.({ LitElement: i4 });
    (s3.litElementVersions ??= []).push("4.2.2");
  }
});

// node_modules/lit-html/is-server.js
var o7;
var init_is_server = __esm({
  "node_modules/lit-html/is-server.js"() {
    o7 = false;
  }
});

// node_modules/lit/index.js
var init_lit = __esm({
  "node_modules/lit/index.js"() {
    init_reactive_element();
    init_lit_html();
    init_lit_element();
    init_is_server();
  }
});

// node_modules/lit-html/directive.js
var t4, e7, i5;
var init_directive = __esm({
  "node_modules/lit-html/directive.js"() {
    t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
    e7 = (t5) => (...e9) => ({ _$litDirective$: t5, values: e9 });
    i5 = class {
      constructor(t5) {
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AT(t5, e9, i8) {
        this._$Ct = t5, this._$AM = e9, this._$Ci = i8;
      }
      _$AS(t5, e9) {
        return this.update(t5, e9);
      }
      update(t5, e9) {
        return this.render(...e9);
      }
    };
  }
});

// node_modules/lit-html/directives/class-map.js
var e8;
var init_class_map = __esm({
  "node_modules/lit-html/directives/class-map.js"() {
    init_lit_html();
    init_directive();
    e8 = e7(class extends i5 {
      constructor(t5) {
        if (super(t5), t5.type !== t4.ATTRIBUTE || "class" !== t5.name || t5.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
      }
      render(t5) {
        return " " + Object.keys(t5).filter((s4) => t5[s4]).join(" ") + " ";
      }
      update(s4, [i8]) {
        if (void 0 === this.st) {
          this.st = /* @__PURE__ */ new Set(), void 0 !== s4.strings && (this.nt = new Set(s4.strings.join(" ").split(/\s/).filter((t5) => "" !== t5)));
          for (const t5 in i8) i8[t5] && !this.nt?.has(t5) && this.st.add(t5);
          return this.render(i8);
        }
        const r7 = s4.element.classList;
        for (const t5 of this.st) t5 in i8 || (r7.remove(t5), this.st.delete(t5));
        for (const t5 in i8) {
          const s5 = !!i8[t5];
          s5 === this.st.has(t5) || this.nt?.has(t5) || (s5 ? (r7.add(t5), this.st.add(t5)) : (r7.remove(t5), this.st.delete(t5)));
        }
        return E;
      }
    });
  }
});

// node_modules/lit/directives/class-map.js
var init_class_map2 = __esm({
  "node_modules/lit/directives/class-map.js"() {
    init_class_map();
  }
});

// node_modules/@material/web/internal/motion/animation.js
function createAnimationSignal() {
  let animationAbortController = null;
  return {
    start() {
      animationAbortController?.abort();
      animationAbortController = new AbortController();
      return animationAbortController.signal;
    },
    finish() {
      animationAbortController = null;
    }
  };
}
var EASING;
var init_animation = __esm({
  "node_modules/@material/web/internal/motion/animation.js"() {
    EASING = {
      STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
      STANDARD_ACCELERATE: "cubic-bezier(.3,0,1,1)",
      STANDARD_DECELERATE: "cubic-bezier(0,0,0,1)",
      EMPHASIZED: "cubic-bezier(.3,0,0,1)",
      EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)",
      EMPHASIZED_DECELERATE: "cubic-bezier(.05,.7,.1,1)"
    };
  }
});

// node_modules/@material/web/field/internal/field.js
var Field;
var init_field = __esm({
  "node_modules/@material/web/field/internal/field.js"() {
    init_tslib_es6();
    init_lit();
    init_decorators();
    init_class_map2();
    init_animation();
    Field = class extends i4 {
      constructor() {
        super(...arguments);
        this.disabled = false;
        this.error = false;
        this.focused = false;
        this.label = "";
        this.noAsterisk = false;
        this.populated = false;
        this.required = false;
        this.resizable = false;
        this.supportingText = "";
        this.errorText = "";
        this.count = -1;
        this.max = -1;
        this.hasStart = false;
        this.hasEnd = false;
        this.isAnimating = false;
        this.refreshErrorAlert = false;
        this.disableTransitions = false;
      }
      get counterText() {
        const countAsNumber = this.count ?? -1;
        const maxAsNumber = this.max ?? -1;
        if (countAsNumber < 0 || maxAsNumber <= 0) {
          return "";
        }
        return `${countAsNumber} / ${maxAsNumber}`;
      }
      get supportingOrErrorText() {
        return this.error && this.errorText ? this.errorText : this.supportingText;
      }
      /**
       * Re-announces the field's error supporting text to screen readers.
       *
       * Error text announces to screen readers anytime it is visible and changes.
       * Use the method to re-announce the message when the text has not changed,
       * but announcement is still needed (such as for `reportValidity()`).
       */
      reannounceError() {
        this.refreshErrorAlert = true;
      }
      update(props) {
        const isDisabledChanging = props.has("disabled") && props.get("disabled") !== void 0;
        if (isDisabledChanging) {
          this.disableTransitions = true;
        }
        if (this.disabled && this.focused) {
          props.set("focused", true);
          this.focused = false;
        }
        this.animateLabelIfNeeded({
          wasFocused: props.get("focused"),
          wasPopulated: props.get("populated")
        });
        super.update(props);
      }
      render() {
        const floatingLabel = this.renderLabel(
          /*isFloating*/
          true
        );
        const restingLabel = this.renderLabel(
          /*isFloating*/
          false
        );
        const outline = this.renderOutline?.(floatingLabel);
        const classes = {
          "disabled": this.disabled,
          "disable-transitions": this.disableTransitions,
          "error": this.error && !this.disabled,
          "focused": this.focused,
          "with-start": this.hasStart,
          "with-end": this.hasEnd,
          "populated": this.populated,
          "resizable": this.resizable,
          "required": this.required,
          "no-label": !this.label
        };
        return b2`
      <div class="field ${e8(classes)}">
        <div class="container-overflow">
          ${this.renderBackground?.()}
          <slot name="container"></slot>
          ${this.renderStateLayer?.()} ${this.renderIndicator?.()} ${outline}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${restingLabel} ${outline ? A : floatingLabel}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `;
      }
      updated(changed) {
        if (changed.has("supportingText") || changed.has("errorText") || changed.has("count") || changed.has("max")) {
          this.updateSlottedAriaDescribedBy();
        }
        if (this.refreshErrorAlert) {
          requestAnimationFrame(() => {
            this.refreshErrorAlert = false;
          });
        }
        if (this.disableTransitions) {
          requestAnimationFrame(() => {
            this.disableTransitions = false;
          });
        }
      }
      renderSupportingText() {
        const { supportingOrErrorText, counterText } = this;
        if (!supportingOrErrorText && !counterText) {
          return A;
        }
        const start = b2`<span>${supportingOrErrorText}</span>`;
        const end = counterText ? b2`<span class="counter">${counterText}</span>` : A;
        const shouldErrorAnnounce = this.error && this.errorText && !this.refreshErrorAlert;
        const role = shouldErrorAnnounce ? "alert" : A;
        return b2`
      <div class="supporting-text" role=${role}>${start}${end}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `;
      }
      updateSlottedAriaDescribedBy() {
        for (const element of this.slottedAriaDescribedBy) {
          D(b2`${this.supportingOrErrorText} ${this.counterText}`, element);
          element.setAttribute("hidden", "");
        }
      }
      renderLabel(isFloating) {
        if (!this.label) {
          return A;
        }
        let visible;
        if (isFloating) {
          visible = this.focused || this.populated || this.isAnimating;
        } else {
          visible = !this.focused && !this.populated && !this.isAnimating;
        }
        const classes = {
          "hidden": !visible,
          "floating": isFloating,
          "resting": !isFloating
        };
        const labelText = `${this.label}${this.required && !this.noAsterisk ? "*" : ""}`;
        return b2`
      <span class="label ${e8(classes)}" aria-hidden=${!visible}
        >${labelText}</span
      >
    `;
      }
      animateLabelIfNeeded({ wasFocused, wasPopulated }) {
        if (!this.label) {
          return;
        }
        wasFocused ??= this.focused;
        wasPopulated ??= this.populated;
        const wasFloating = wasFocused || wasPopulated;
        const shouldBeFloating = this.focused || this.populated;
        if (wasFloating === shouldBeFloating) {
          return;
        }
        const keyframes = this.getLabelKeyframes();
        if (!keyframes.length) {
          return;
        }
        this.isAnimating = true;
        this.labelAnimation?.cancel();
        this.labelAnimation = this.floatingLabelEl?.animate(keyframes, {
          duration: 150,
          easing: EASING.STANDARD
        });
        this.labelAnimation?.addEventListener("finish", () => {
          this.isAnimating = false;
        });
      }
      getLabelKeyframes() {
        const { floatingLabelEl, restingLabelEl } = this;
        if (!floatingLabelEl || !restingLabelEl) {
          return [];
        }
        const { x: floatingX, y: floatingY, height: floatingHeight } = floatingLabelEl.getBoundingClientRect();
        const { x: restingX, y: restingY, height: restingHeight } = restingLabelEl.getBoundingClientRect();
        const floatingScrollWidth = floatingLabelEl.scrollWidth;
        const restingScrollWidth = restingLabelEl.scrollWidth;
        if (floatingScrollWidth === 0 || restingScrollWidth === 0) {
          return [];
        }
        const scale = restingScrollWidth / floatingScrollWidth;
        const xDelta = restingX - floatingX;
        const yDelta = restingY - floatingY + Math.round((restingHeight - floatingHeight * scale) / 2);
        const restTransform = `translateX(${xDelta}px) translateY(${yDelta}px) scale(${scale})`;
        const floatTransform = `translateX(0) translateY(0) scale(1)`;
        const restingClientWidth = restingLabelEl.clientWidth;
        const isRestingClipped = restingScrollWidth > restingClientWidth;
        const width = isRestingClipped ? `${restingClientWidth / scale}px` : "";
        if (this.focused || this.populated) {
          return [
            { transform: restTransform, width },
            { transform: floatTransform, width }
          ];
        }
        return [
          { transform: floatTransform, width },
          { transform: restTransform, width }
        ];
      }
      getSurfacePositionClientRect() {
        return this.containerEl.getBoundingClientRect();
      }
    };
    __decorate([
      n3({ type: Boolean })
    ], Field.prototype, "disabled", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Field.prototype, "error", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Field.prototype, "focused", void 0);
    __decorate([
      n3()
    ], Field.prototype, "label", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "no-asterisk" })
    ], Field.prototype, "noAsterisk", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Field.prototype, "populated", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Field.prototype, "required", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Field.prototype, "resizable", void 0);
    __decorate([
      n3({ attribute: "supporting-text" })
    ], Field.prototype, "supportingText", void 0);
    __decorate([
      n3({ attribute: "error-text" })
    ], Field.prototype, "errorText", void 0);
    __decorate([
      n3({ type: Number })
    ], Field.prototype, "count", void 0);
    __decorate([
      n3({ type: Number })
    ], Field.prototype, "max", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "has-start" })
    ], Field.prototype, "hasStart", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "has-end" })
    ], Field.prototype, "hasEnd", void 0);
    __decorate([
      o4({ slot: "aria-describedby" })
    ], Field.prototype, "slottedAriaDescribedBy", void 0);
    __decorate([
      r4()
    ], Field.prototype, "isAnimating", void 0);
    __decorate([
      r4()
    ], Field.prototype, "refreshErrorAlert", void 0);
    __decorate([
      r4()
    ], Field.prototype, "disableTransitions", void 0);
    __decorate([
      e4(".label.floating")
    ], Field.prototype, "floatingLabelEl", void 0);
    __decorate([
      e4(".label.resting")
    ], Field.prototype, "restingLabelEl", void 0);
    __decorate([
      e4(".container")
    ], Field.prototype, "containerEl", void 0);
  }
});

// node_modules/@material/web/field/internal/outlined-field.js
var OutlinedField;
var init_outlined_field = __esm({
  "node_modules/@material/web/field/internal/outlined-field.js"() {
    init_lit();
    init_field();
    OutlinedField = class extends Field {
      renderOutline(floatingLabel) {
        return b2`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-panel-inactive"></div>
          <div class="outline-panel-active"></div>
          <div class="outline-label">${floatingLabel}</div>
        </div>
        <div class="outline-end"></div>
      </div>
    `;
      }
    };
  }
});

// node_modules/@material/web/field/internal/outlined-styles.cssresult.js
var styles, outlined_styles_cssresult_default;
var init_outlined_styles_cssresult = __esm({
  "node_modules/@material/web/field/internal/outlined-styles.cssresult.js"() {
    init_lit();
    styles = i`@layer styles{:host{--_bottom-space: var(--md-outlined-field-bottom-space, 16px);--_content-color: var(--md-outlined-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-outlined-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-outlined-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-outlined-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-outlined-field-content-space, 16px);--_content-weight: var(--md-outlined-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-content-color: var(--md-outlined-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-outlined-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-outlined-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-outlined-field-disabled-leading-content-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-outlined-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-outlined-field-disabled-trailing-content-opacity, 0.38);--_error-content-color: var(--md-outlined-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-content-color: var(--md-outlined-field-error-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-outlined-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-outlined-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-content-color: var(--md-outlined-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-outlined-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-outlined-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-outlined-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-outlined-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-outlined-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-content-color: var(--md-outlined-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-outlined-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-outlined-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-content-color: var(--md-outlined-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-content-color: var(--md-outlined-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-outlined-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-outlined-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-padding-bottom: var(--md-outlined-field-label-text-padding-bottom, 8px);--_label-text-populated-line-height: var(--md-outlined-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-outlined-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-outlined-field-leading-space, 16px);--_outline-color: var(--md-outlined-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-label-padding: var(--md-outlined-field-outline-label-padding, 4px);--_outline-width: var(--md-outlined-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-outlined-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-outlined-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-outlined-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-outlined-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-outlined-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-outlined-field-top-space, 16px);--_trailing-content-color: var(--md-outlined-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-outlined-field-trailing-space, 16px);--_with-leading-content-leading-space: var(--md-outlined-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-outlined-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-outlined-field-container-shape-start-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-field-container-shape-start-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-field-container-shape-end-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-field-container-shape-end-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)))}.outline{border-color:var(--_outline-color);border-radius:inherit;display:flex;pointer-events:none;height:100%;position:absolute;width:100%;z-index:1}.outline-start::before,.outline-start::after,.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after,.outline-end::before,.outline-end::after{border:inherit;content:"";inset:0;position:absolute}.outline-start,.outline-end{border:inherit;border-radius:inherit;box-sizing:border-box;position:relative}.outline-start::before,.outline-start::after,.outline-end::before,.outline-end::after{border-bottom-style:solid;border-top-style:solid}.outline-start::after,.outline-end::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-start::after,.focused .outline-end::after{opacity:1}.outline-start::before,.outline-start::after{border-inline-start-style:solid;border-inline-end-style:none;border-start-start-radius:inherit;border-start-end-radius:0;border-end-start-radius:inherit;border-end-end-radius:0;margin-inline-end:var(--_outline-label-padding)}.outline-end{flex-grow:1;margin-inline-start:calc(-1*var(--_outline-label-padding))}.outline-end::before,.outline-end::after{border-inline-start-style:none;border-inline-end-style:solid;border-start-start-radius:0;border-start-end-radius:inherit;border-end-start-radius:0;border-end-end-radius:inherit}.outline-notch{align-items:flex-start;border:inherit;display:flex;margin-inline-start:calc(-1*var(--_outline-label-padding));margin-inline-end:var(--_outline-label-padding);max-width:calc(100% - var(--_leading-space) - var(--_trailing-space));padding:0 var(--_outline-label-padding);position:relative}.no-label .outline-notch{display:none}.outline-panel-inactive,.outline-panel-active{border:inherit;border-bottom-style:solid;inset:0;position:absolute}.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after{border-top-style:solid;border-bottom:none;bottom:auto;transform:scaleX(1);transition:transform 150ms cubic-bezier(0.2, 0, 0, 1)}.outline-panel-inactive::before,.outline-panel-active::before{right:50%;transform-origin:top left}.outline-panel-inactive::after,.outline-panel-active::after{left:50%;transform-origin:top right}.populated .outline-panel-inactive::before,.populated .outline-panel-inactive::after,.populated .outline-panel-active::before,.populated .outline-panel-active::after,.focused .outline-panel-inactive::before,.focused .outline-panel-inactive::after,.focused .outline-panel-active::before,.focused .outline-panel-active::after{transform:scaleX(0)}.outline-panel-active{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-panel-active{opacity:1}.outline-label{display:flex;max-width:100%;transform:translateY(calc(-100% + var(--_label-text-padding-bottom)))}.outline-start,.field:not(.with-start) .content ::slotted(*){padding-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-start) .label-wrapper{margin-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-end) .content ::slotted(*){padding-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.field:not(.with-end) .label-wrapper{margin-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.outline-start::before,.outline-end::before,.outline-panel-inactive,.outline-panel-inactive::before,.outline-panel-inactive::after{border-width:var(--_outline-width)}:hover .outline{border-color:var(--_hover-outline-color);color:var(--_hover-outline-color)}:hover .outline-start::before,:hover .outline-end::before,:hover .outline-panel-inactive,:hover .outline-panel-inactive::before,:hover .outline-panel-inactive::after{border-width:var(--_hover-outline-width)}.focused .outline{border-color:var(--_focus-outline-color);color:var(--_focus-outline-color)}.outline-start::after,.outline-end::after,.outline-panel-active,.outline-panel-active::before,.outline-panel-active::after{border-width:var(--_focus-outline-width)}.disabled .outline{border-color:var(--_disabled-outline-color);color:var(--_disabled-outline-color)}.disabled .outline-start,.disabled .outline-end,.disabled .outline-panel-inactive{opacity:var(--_disabled-outline-opacity)}.disabled .outline-start::before,.disabled .outline-end::before,.disabled .outline-panel-inactive,.disabled .outline-panel-inactive::before,.disabled .outline-panel-inactive::after{border-width:var(--_disabled-outline-width)}.error .outline{border-color:var(--_error-outline-color);color:var(--_error-outline-color)}.error:hover .outline{border-color:var(--_error-hover-outline-color);color:var(--_error-hover-outline-color)}.error.focused .outline{border-color:var(--_error-focus-outline-color);color:var(--_error-focus-outline-color)}.resizable .container{bottom:var(--_focus-outline-width);inset-inline-end:var(--_focus-outline-width);clip-path:inset(var(--_focus-outline-width) 0 0 var(--_focus-outline-width))}.resizable .container>*{top:var(--_focus-outline-width);inset-inline-start:var(--_focus-outline-width)}.resizable .container:dir(rtl){clip-path:inset(var(--_focus-outline-width) var(--_focus-outline-width) 0 0)}}@layer hcm{@media(forced-colors: active){.disabled .outline{border-color:GrayText;color:GrayText}.disabled :is(.outline-start,.outline-end,.outline-panel-inactive){opacity:1}}}
`;
    outlined_styles_cssresult_default = styles.styleSheet;
  }
});

// node_modules/@material/web/field/internal/shared-styles.cssresult.js
var styles2, shared_styles_cssresult_default;
var init_shared_styles_cssresult = __esm({
  "node_modules/@material/web/field/internal/shared-styles.cssresult.js"() {
    init_lit();
    styles2 = i`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;
    shared_styles_cssresult_default = styles2.styleSheet;
  }
});

// node_modules/@material/web/field/outlined-field.js
var MdOutlinedField;
var init_outlined_field2 = __esm({
  "node_modules/@material/web/field/outlined-field.js"() {
    init_tslib_es6();
    init_decorators();
    init_outlined_field();
    init_outlined_styles_cssresult();
    init_shared_styles_cssresult();
    MdOutlinedField = class MdOutlinedField2 extends OutlinedField {
    };
    MdOutlinedField.styles = [styles2, styles];
    MdOutlinedField = __decorate([
      t("md-outlined-field")
    ], MdOutlinedField);
  }
});

// node_modules/lit-html/static.js
var a3, o8, i6, l3, n6, u3, c4, $2;
var init_static = __esm({
  "node_modules/lit-html/static.js"() {
    init_lit_html();
    a3 = Symbol.for("");
    o8 = (t5) => {
      if (t5?.r === a3) return t5?._$litStatic$;
    };
    i6 = (t5, ...r7) => ({ _$litStatic$: r7.reduce((r8, e9, a4) => r8 + ((t6) => {
      if (void 0 !== t6._$litStatic$) return t6._$litStatic$;
      throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t6}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
    })(e9) + t5[a4 + 1], t5[0]), r: a3 });
    l3 = /* @__PURE__ */ new Map();
    n6 = (t5) => (r7, ...e9) => {
      const a4 = e9.length;
      let s4, i8;
      const n8 = [], u4 = [];
      let c5, $3 = 0, f3 = false;
      for (; $3 < a4; ) {
        for (c5 = r7[$3]; $3 < a4 && void 0 !== (i8 = e9[$3], s4 = o8(i8)); ) c5 += s4 + r7[++$3], f3 = true;
        $3 !== a4 && u4.push(i8), n8.push(c5), $3++;
      }
      if ($3 === a4 && n8.push(r7[a4]), f3) {
        const t6 = n8.join("$$lit$$");
        void 0 === (r7 = l3.get(t6)) && (n8.raw = n8, l3.set(t6, r7 = n8)), e9 = u4;
      }
      return t5(r7, ...e9);
    };
    u3 = n6(b2);
    c4 = n6(w);
    $2 = n6(T);
  }
});

// node_modules/lit/static-html.js
var init_static_html = __esm({
  "node_modules/lit/static-html.js"() {
    init_static();
  }
});

// node_modules/@material/web/elevation/internal/elevation.js
var Elevation;
var init_elevation = __esm({
  "node_modules/@material/web/elevation/internal/elevation.js"() {
    init_lit();
    Elevation = class extends i4 {
      connectedCallback() {
        super.connectedCallback();
        this.setAttribute("aria-hidden", "true");
      }
      render() {
        return b2`<span class="shadow"></span>`;
      }
    };
  }
});

// node_modules/@material/web/elevation/internal/elevation-styles.cssresult.js
var styles3, elevation_styles_cssresult_default;
var init_elevation_styles_cssresult = __esm({
  "node_modules/@material/web/elevation/internal/elevation-styles.cssresult.js"() {
    init_lit();
    styles3 = i`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;
    elevation_styles_cssresult_default = styles3.styleSheet;
  }
});

// node_modules/@material/web/elevation/elevation.js
var MdElevation;
var init_elevation2 = __esm({
  "node_modules/@material/web/elevation/elevation.js"() {
    init_tslib_es6();
    init_decorators();
    init_elevation();
    init_elevation_styles_cssresult();
    MdElevation = class MdElevation2 extends Elevation {
    };
    MdElevation.styles = [styles3];
    MdElevation = __decorate([
      t("md-elevation")
    ], MdElevation);
  }
});

// node_modules/@material/web/internal/controller/attachable-controller.js
var ATTACHABLE_CONTROLLER, FOR_ATTRIBUTE_OBSERVER, AttachableController;
var init_attachable_controller = __esm({
  "node_modules/@material/web/internal/controller/attachable-controller.js"() {
    init_lit();
    ATTACHABLE_CONTROLLER = Symbol("attachableController");
    if (!o7) {
      FOR_ATTRIBUTE_OBSERVER = new MutationObserver((records) => {
        for (const record of records) {
          record.target[ATTACHABLE_CONTROLLER]?.hostConnected();
        }
      });
    }
    AttachableController = class {
      get htmlFor() {
        return this.host.getAttribute("for");
      }
      set htmlFor(htmlFor) {
        if (htmlFor === null) {
          this.host.removeAttribute("for");
        } else {
          this.host.setAttribute("for", htmlFor);
        }
      }
      get control() {
        if (this.host.hasAttribute("for")) {
          if (!this.htmlFor || !this.host.isConnected) {
            return null;
          }
          return this.host.getRootNode().querySelector(`#${this.htmlFor}`);
        }
        return this.currentControl || this.host.parentElement;
      }
      set control(control) {
        if (control) {
          this.attach(control);
        } else {
          this.detach();
        }
      }
      /**
       * Creates a new controller for an `Attachable` element.
       *
       * @param host The `Attachable` element.
       * @param onControlChange A callback with two parameters for the previous and
       *     next control. An `Attachable` element may perform setup or teardown
       *     logic whenever the control changes.
       */
      constructor(host, onControlChange) {
        this.host = host;
        this.onControlChange = onControlChange;
        this.currentControl = null;
        host.addController(this);
        host[ATTACHABLE_CONTROLLER] = this;
        FOR_ATTRIBUTE_OBSERVER?.observe(host, { attributeFilter: ["for"] });
      }
      attach(control) {
        if (control === this.currentControl) {
          return;
        }
        this.setCurrentControl(control);
        this.host.removeAttribute("for");
      }
      detach() {
        this.setCurrentControl(null);
        this.host.setAttribute("for", "");
      }
      /** @private */
      hostConnected() {
        this.setCurrentControl(this.control);
      }
      /** @private */
      hostDisconnected() {
        this.setCurrentControl(null);
      }
      setCurrentControl(control) {
        this.onControlChange(this.currentControl, control);
        this.currentControl = control;
      }
    };
  }
});

// node_modules/@material/web/focus/internal/focus-ring.js
var EVENTS, FocusRing, HANDLED_BY_FOCUS_RING;
var init_focus_ring = __esm({
  "node_modules/@material/web/focus/internal/focus-ring.js"() {
    init_tslib_es6();
    init_lit();
    init_decorators();
    init_attachable_controller();
    EVENTS = ["focusin", "focusout", "pointerdown"];
    FocusRing = class extends i4 {
      constructor() {
        super(...arguments);
        this.visible = false;
        this.inward = false;
        this.attachableController = new AttachableController(this, this.onControlChange.bind(this));
      }
      get htmlFor() {
        return this.attachableController.htmlFor;
      }
      set htmlFor(htmlFor) {
        this.attachableController.htmlFor = htmlFor;
      }
      get control() {
        return this.attachableController.control;
      }
      set control(control) {
        this.attachableController.control = control;
      }
      attach(control) {
        this.attachableController.attach(control);
      }
      detach() {
        this.attachableController.detach();
      }
      connectedCallback() {
        super.connectedCallback();
        this.setAttribute("aria-hidden", "true");
      }
      /** @private */
      handleEvent(event) {
        if (event[HANDLED_BY_FOCUS_RING]) {
          return;
        }
        switch (event.type) {
          default:
            return;
          case "focusin":
            this.visible = this.control?.matches(":focus-visible") ?? false;
            break;
          case "focusout":
          case "pointerdown":
            this.visible = false;
            break;
        }
        event[HANDLED_BY_FOCUS_RING] = true;
      }
      onControlChange(prev, next) {
        if (o7)
          return;
        for (const event of EVENTS) {
          prev?.removeEventListener(event, this);
          next?.addEventListener(event, this);
        }
      }
      update(changed) {
        if (changed.has("visible")) {
          this.dispatchEvent(new Event("visibility-changed"));
        }
        super.update(changed);
      }
    };
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], FocusRing.prototype, "visible", void 0);
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], FocusRing.prototype, "inward", void 0);
    HANDLED_BY_FOCUS_RING = Symbol("handledByFocusRing");
  }
});

// node_modules/@material/web/focus/internal/focus-ring-styles.cssresult.js
var styles4, focus_ring_styles_cssresult_default;
var init_focus_ring_styles_cssresult = __esm({
  "node_modules/@material/web/focus/internal/focus-ring-styles.cssresult.js"() {
    init_lit();
    styles4 = i`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
    focus_ring_styles_cssresult_default = styles4.styleSheet;
  }
});

// node_modules/@material/web/focus/md-focus-ring.js
var MdFocusRing;
var init_md_focus_ring = __esm({
  "node_modules/@material/web/focus/md-focus-ring.js"() {
    init_tslib_es6();
    init_decorators();
    init_focus_ring();
    init_focus_ring_styles_cssresult();
    MdFocusRing = class MdFocusRing2 extends FocusRing {
    };
    MdFocusRing.styles = [styles4];
    MdFocusRing = __decorate([
      t("md-focus-ring")
    ], MdFocusRing);
  }
});

// node_modules/lit-html/directives/style-map.js
var n7, i7, o9;
var init_style_map = __esm({
  "node_modules/lit-html/directives/style-map.js"() {
    init_lit_html();
    init_directive();
    n7 = "important";
    i7 = " !" + n7;
    o9 = e7(class extends i5 {
      constructor(t5) {
        if (super(t5), t5.type !== t4.ATTRIBUTE || "style" !== t5.name || t5.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
      }
      render(t5) {
        return Object.keys(t5).reduce((e9, r7) => {
          const s4 = t5[r7];
          return null == s4 ? e9 : e9 + `${r7 = r7.includes("-") ? r7 : r7.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s4};`;
        }, "");
      }
      update(e9, [r7]) {
        const { style: s4 } = e9.element;
        if (void 0 === this.ft) return this.ft = new Set(Object.keys(r7)), this.render(r7);
        for (const t5 of this.ft) null == r7[t5] && (this.ft.delete(t5), t5.includes("-") ? s4.removeProperty(t5) : s4[t5] = null);
        for (const t5 in r7) {
          const e10 = r7[t5];
          if (null != e10) {
            this.ft.add(t5);
            const r8 = "string" == typeof e10 && e10.endsWith(i7);
            t5.includes("-") || r8 ? s4.setProperty(t5, r8 ? e10.slice(0, -11) : e10, r8 ? n7 : "") : s4[t5] = e10;
          }
        }
        return E;
      }
    });
  }
});

// node_modules/lit/directives/style-map.js
var init_style_map2 = __esm({
  "node_modules/lit/directives/style-map.js"() {
    init_style_map();
  }
});

// node_modules/@material/web/list/internal/list-navigation-helpers.js
function activateFirstItem(items, isActivatable = isItemNotDisabled) {
  const firstItem = getFirstActivatableItem(items, isActivatable);
  if (firstItem) {
    firstItem.tabIndex = 0;
    firstItem.focus();
  }
  return firstItem;
}
function activateLastItem(items, isActivatable = isItemNotDisabled) {
  const lastItem = getLastActivatableItem(items, isActivatable);
  if (lastItem) {
    lastItem.tabIndex = 0;
    lastItem.focus();
  }
  return lastItem;
}
function getActiveItem(items, isActivatable = isItemNotDisabled) {
  for (let i8 = 0; i8 < items.length; i8++) {
    const item = items[i8];
    if (item.tabIndex === 0 && isActivatable(item)) {
      return {
        item,
        index: i8
      };
    }
  }
  return null;
}
function getFirstActivatableItem(items, isActivatable = isItemNotDisabled) {
  for (const item of items) {
    if (isActivatable(item)) {
      return item;
    }
  }
  return null;
}
function getLastActivatableItem(items, isActivatable = isItemNotDisabled) {
  for (let i8 = items.length - 1; i8 >= 0; i8--) {
    const item = items[i8];
    if (isActivatable(item)) {
      return item;
    }
  }
  return null;
}
function getNextItem(items, index, isActivatable = isItemNotDisabled, wrap = true) {
  for (let i8 = 1; i8 < items.length; i8++) {
    const nextIndex = (i8 + index) % items.length;
    if (nextIndex < index && !wrap) {
      return null;
    }
    const item = items[nextIndex];
    if (isActivatable(item)) {
      return item;
    }
  }
  return items[index] ? items[index] : null;
}
function getPrevItem(items, index, isActivatable = isItemNotDisabled, wrap = true) {
  for (let i8 = 1; i8 < items.length; i8++) {
    const prevIndex = (index - i8 + items.length) % items.length;
    if (prevIndex > index && !wrap) {
      return null;
    }
    const item = items[prevIndex];
    if (isActivatable(item)) {
      return item;
    }
  }
  return items[index] ? items[index] : null;
}
function activateNextItem(items, activeItemRecord, isActivatable = isItemNotDisabled, wrap = true) {
  if (activeItemRecord) {
    const next = getNextItem(items, activeItemRecord.index, isActivatable, wrap);
    if (next) {
      next.tabIndex = 0;
      next.focus();
    }
    return next;
  } else {
    return activateFirstItem(items, isActivatable);
  }
}
function activatePreviousItem(items, activeItemRecord, isActivatable = isItemNotDisabled, wrap = true) {
  if (activeItemRecord) {
    const prev = getPrevItem(items, activeItemRecord.index, isActivatable, wrap);
    if (prev) {
      prev.tabIndex = 0;
      prev.focus();
    }
    return prev;
  } else {
    return activateLastItem(items, isActivatable);
  }
}
function isItemNotDisabled(item) {
  return !item.disabled;
}
var init_list_navigation_helpers = __esm({
  "node_modules/@material/web/list/internal/list-navigation-helpers.js"() {
  }
});

// node_modules/@material/web/list/internal/list-controller.js
var NavigableKeys, ListController;
var init_list_controller = __esm({
  "node_modules/@material/web/list/internal/list-controller.js"() {
    init_list_navigation_helpers();
    NavigableKeys = {
      ArrowDown: "ArrowDown",
      ArrowLeft: "ArrowLeft",
      ArrowUp: "ArrowUp",
      ArrowRight: "ArrowRight",
      Home: "Home",
      End: "End"
    };
    ListController = class {
      constructor(config) {
        this.handleKeydown = (event) => {
          const key = event.key;
          if (event.defaultPrevented || !this.isNavigableKey(key)) {
            return;
          }
          const items = this.items;
          if (!items.length) {
            return;
          }
          const activeItemRecord = getActiveItem(items, this.isActivatable);
          event.preventDefault();
          const isRtl2 = this.isRtl();
          const inlinePrevious = isRtl2 ? NavigableKeys.ArrowRight : NavigableKeys.ArrowLeft;
          const inlineNext = isRtl2 ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;
          let nextActiveItem = null;
          switch (key) {
            // Activate the next item
            case NavigableKeys.ArrowDown:
            case inlineNext:
              nextActiveItem = activateNextItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
              break;
            // Activate the previous item
            case NavigableKeys.ArrowUp:
            case inlinePrevious:
              nextActiveItem = activatePreviousItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
              break;
            // Activate the first item
            case NavigableKeys.Home:
              nextActiveItem = activateFirstItem(items, this.isActivatable);
              break;
            // Activate the last item
            case NavigableKeys.End:
              nextActiveItem = activateLastItem(items, this.isActivatable);
              break;
            default:
              break;
          }
          if (nextActiveItem && activeItemRecord && activeItemRecord.item !== nextActiveItem) {
            activeItemRecord.item.tabIndex = -1;
          }
        };
        this.onDeactivateItems = () => {
          const items = this.items;
          for (const item of items) {
            this.deactivateItem(item);
          }
        };
        this.onRequestActivation = (event) => {
          this.onDeactivateItems();
          const target = event.target;
          this.activateItem(target);
          target.focus();
        };
        this.onSlotchange = () => {
          const items = this.items;
          let encounteredActivated = false;
          for (const item of items) {
            const isActivated = !item.disabled && item.tabIndex > -1;
            if (isActivated && !encounteredActivated) {
              encounteredActivated = true;
              item.tabIndex = 0;
              continue;
            }
            item.tabIndex = -1;
          }
          if (encounteredActivated) {
            return;
          }
          const firstActivatableItem = getFirstActivatableItem(items, this.isActivatable);
          if (!firstActivatableItem) {
            return;
          }
          firstActivatableItem.tabIndex = 0;
        };
        const { isItem, getPossibleItems, isRtl, deactivateItem, activateItem, isNavigableKey, isActivatable, wrapNavigation } = config;
        this.isItem = isItem;
        this.getPossibleItems = getPossibleItems;
        this.isRtl = isRtl;
        this.deactivateItem = deactivateItem;
        this.activateItem = activateItem;
        this.isNavigableKey = isNavigableKey;
        this.isActivatable = isActivatable;
        this.wrapNavigation = wrapNavigation ?? (() => true);
      }
      /**
       * The items being managed by the list. Additionally, attempts to see if the
       * object has a sub-item in the `.item` property.
       */
      get items() {
        const maybeItems = this.getPossibleItems();
        const items = [];
        for (const itemOrParent of maybeItems) {
          const isItem = this.isItem(itemOrParent);
          if (isItem) {
            items.push(itemOrParent);
            continue;
          }
          const subItem = itemOrParent.item;
          if (subItem && this.isItem(subItem)) {
            items.push(subItem);
          }
        }
        return items;
      }
      /**
       * Activates the next item in the list. If at the end of the list, the first
       * item will be activated.
       *
       * @return The activated list item or `null` if there are no items.
       */
      activateNextItem() {
        const items = this.items;
        const activeItemRecord = getActiveItem(items, this.isActivatable);
        if (activeItemRecord) {
          activeItemRecord.item.tabIndex = -1;
        }
        return activateNextItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
      }
      /**
       * Activates the previous item in the list. If at the start of the list, the
       * last item will be activated.
       *
       * @return The activated list item or `null` if there are no items.
       */
      activatePreviousItem() {
        const items = this.items;
        const activeItemRecord = getActiveItem(items, this.isActivatable);
        if (activeItemRecord) {
          activeItemRecord.item.tabIndex = -1;
        }
        return activatePreviousItem(items, activeItemRecord, this.isActivatable, this.wrapNavigation());
      }
    };
  }
});

// node_modules/@material/web/menu/internal/controllers/shared.js
function createCloseMenuEvent(initiator, reason) {
  return new CustomEvent("close-menu", {
    bubbles: true,
    composed: true,
    detail: { initiator, reason, itemPath: [initiator] }
  });
}
function isClosableKey(code) {
  return Object.values(KeydownCloseKey).some((value) => value === code);
}
function isSelectableKey(code) {
  return Object.values(SelectionKey).some((value) => value === code);
}
function isElementInSubtree(target, container) {
  const focusEv = new Event("md-contains", { bubbles: true, composed: true });
  let composedPath = [];
  const listener = (ev) => {
    composedPath = ev.composedPath();
  };
  container.addEventListener("md-contains", listener);
  target.dispatchEvent(focusEv);
  container.removeEventListener("md-contains", listener);
  const isContained = composedPath.length > 0;
  return isContained;
}
var createDefaultCloseMenuEvent, SelectionKey, CloseReason, KeydownCloseKey, FocusState;
var init_shared = __esm({
  "node_modules/@material/web/menu/internal/controllers/shared.js"() {
    createDefaultCloseMenuEvent = createCloseMenuEvent;
    SelectionKey = {
      SPACE: "Space",
      ENTER: "Enter"
    };
    CloseReason = {
      CLICK_SELECTION: "click-selection",
      KEYDOWN: "keydown"
    };
    KeydownCloseKey = {
      ESCAPE: "Escape",
      SPACE: SelectionKey.SPACE,
      ENTER: SelectionKey.ENTER
    };
    FocusState = {
      NONE: "none",
      LIST_ROOT: "list-root",
      FIRST_ITEM: "first-item",
      LAST_ITEM: "last-item"
    };
  }
});

// node_modules/@material/web/menu/internal/controllers/surfacePositionController.js
var Corner, SurfacePositionController;
var init_surfacePositionController = __esm({
  "node_modules/@material/web/menu/internal/controllers/surfacePositionController.js"() {
    Corner = {
      END_START: "end-start",
      END_END: "end-end",
      START_START: "start-start",
      START_END: "start-end"
    };
    SurfacePositionController = class {
      /**
       * @param host The host to connect the controller to.
       * @param getProperties A function that returns the properties for the
       * controller.
       */
      constructor(host, getProperties) {
        this.host = host;
        this.getProperties = getProperties;
        this.surfaceStylesInternal = {
          "display": "none"
        };
        this.lastValues = {
          isOpen: false
        };
        this.host.addController(this);
      }
      /**
       * The StyleInfo map to apply to the surface via Lit's stylemap
       */
      get surfaceStyles() {
        return this.surfaceStylesInternal;
      }
      /**
       * Calculates the surface's new position required so that the surface's
       * `surfaceCorner` aligns to the anchor's `anchorCorner` while keeping the
       * surface inside the window viewport. This positioning also respects RTL by
       * checking `getComputedStyle()` on the surface element.
       */
      async position() {
        const { surfaceEl, anchorEl, anchorCorner: anchorCornerRaw, surfaceCorner: surfaceCornerRaw, positioning, xOffset, yOffset, disableBlockFlip, disableInlineFlip, repositionStrategy } = this.getProperties();
        const anchorCorner = anchorCornerRaw.toLowerCase().trim();
        const surfaceCorner = surfaceCornerRaw.toLowerCase().trim();
        if (!surfaceEl || !anchorEl) {
          return;
        }
        const windowInnerWidth = window.innerWidth;
        const windowInnerHeight = window.innerHeight;
        const div = document.createElement("div");
        div.style.opacity = "0";
        div.style.position = "fixed";
        div.style.display = "block";
        div.style.inset = "0";
        document.body.appendChild(div);
        const scrollbarTestRect = div.getBoundingClientRect();
        div.remove();
        const blockScrollbarHeight = window.innerHeight - scrollbarTestRect.bottom;
        const inlineScrollbarWidth = window.innerWidth - scrollbarTestRect.right;
        this.surfaceStylesInternal = {
          "display": "block",
          "opacity": "0"
        };
        this.host.requestUpdate();
        await this.host.updateComplete;
        if (surfaceEl.popover && surfaceEl.isConnected) {
          surfaceEl.showPopover();
        }
        const surfaceRect = surfaceEl.getSurfacePositionClientRect ? surfaceEl.getSurfacePositionClientRect() : surfaceEl.getBoundingClientRect();
        const anchorRect = anchorEl.getSurfacePositionClientRect ? anchorEl.getSurfacePositionClientRect() : anchorEl.getBoundingClientRect();
        const [surfaceBlock, surfaceInline] = surfaceCorner.split("-");
        const [anchorBlock, anchorInline] = anchorCorner.split("-");
        const isLTR = getComputedStyle(surfaceEl).direction === "ltr";
        let { blockInset, blockOutOfBoundsCorrection, surfaceBlockProperty } = this.calculateBlock({
          surfaceRect,
          anchorRect,
          anchorBlock,
          surfaceBlock,
          yOffset,
          positioning,
          windowInnerHeight,
          blockScrollbarHeight
        });
        if (blockOutOfBoundsCorrection && !disableBlockFlip) {
          const flippedSurfaceBlock = surfaceBlock === "start" ? "end" : "start";
          const flippedAnchorBlock = anchorBlock === "start" ? "end" : "start";
          const flippedBlock = this.calculateBlock({
            surfaceRect,
            anchorRect,
            anchorBlock: flippedAnchorBlock,
            surfaceBlock: flippedSurfaceBlock,
            yOffset,
            positioning,
            windowInnerHeight,
            blockScrollbarHeight
          });
          if (blockOutOfBoundsCorrection > flippedBlock.blockOutOfBoundsCorrection) {
            blockInset = flippedBlock.blockInset;
            blockOutOfBoundsCorrection = flippedBlock.blockOutOfBoundsCorrection;
            surfaceBlockProperty = flippedBlock.surfaceBlockProperty;
          }
        }
        let { inlineInset, inlineOutOfBoundsCorrection, surfaceInlineProperty } = this.calculateInline({
          surfaceRect,
          anchorRect,
          anchorInline,
          surfaceInline,
          xOffset,
          positioning,
          isLTR,
          windowInnerWidth,
          inlineScrollbarWidth
        });
        if (inlineOutOfBoundsCorrection && !disableInlineFlip) {
          const flippedSurfaceInline = surfaceInline === "start" ? "end" : "start";
          const flippedAnchorInline = anchorInline === "start" ? "end" : "start";
          const flippedInline = this.calculateInline({
            surfaceRect,
            anchorRect,
            anchorInline: flippedAnchorInline,
            surfaceInline: flippedSurfaceInline,
            xOffset,
            positioning,
            isLTR,
            windowInnerWidth,
            inlineScrollbarWidth
          });
          if (Math.abs(inlineOutOfBoundsCorrection) > Math.abs(flippedInline.inlineOutOfBoundsCorrection)) {
            inlineInset = flippedInline.inlineInset;
            inlineOutOfBoundsCorrection = flippedInline.inlineOutOfBoundsCorrection;
            surfaceInlineProperty = flippedInline.surfaceInlineProperty;
          }
        }
        if (repositionStrategy === "move") {
          blockInset = blockInset - blockOutOfBoundsCorrection;
          inlineInset = inlineInset - inlineOutOfBoundsCorrection;
        }
        this.surfaceStylesInternal = {
          "display": "block",
          "opacity": "1",
          [surfaceBlockProperty]: `${blockInset}px`,
          [surfaceInlineProperty]: `${inlineInset}px`
        };
        if (repositionStrategy === "resize") {
          if (blockOutOfBoundsCorrection) {
            this.surfaceStylesInternal["height"] = `${surfaceRect.height - blockOutOfBoundsCorrection}px`;
          }
          if (inlineOutOfBoundsCorrection) {
            this.surfaceStylesInternal["width"] = `${surfaceRect.width - inlineOutOfBoundsCorrection}px`;
          }
        }
        this.host.requestUpdate();
      }
      /**
       * Calculates the css property, the inset, and the out of bounds correction
       * for the surface in the block direction.
       */
      calculateBlock(config) {
        const { surfaceRect, anchorRect, anchorBlock, surfaceBlock, yOffset, positioning, windowInnerHeight, blockScrollbarHeight } = config;
        const relativeToWindow = positioning === "fixed" || positioning === "document" ? 1 : 0;
        const relativeToDocument = positioning === "document" ? 1 : 0;
        const isSurfaceBlockStart = surfaceBlock === "start" ? 1 : 0;
        const isSurfaceBlockEnd = surfaceBlock === "end" ? 1 : 0;
        const isOneBlockEnd = anchorBlock !== surfaceBlock ? 1 : 0;
        const blockAnchorOffset = isOneBlockEnd * anchorRect.height + yOffset;
        const blockTopLayerOffset = isSurfaceBlockStart * anchorRect.top + isSurfaceBlockEnd * (windowInnerHeight - anchorRect.bottom - blockScrollbarHeight);
        const blockDocumentOffset = isSurfaceBlockStart * window.scrollY - isSurfaceBlockEnd * window.scrollY;
        const blockOutOfBoundsCorrection = Math.abs(Math.min(0, windowInnerHeight - blockTopLayerOffset - blockAnchorOffset - surfaceRect.height));
        const blockInset = relativeToWindow * blockTopLayerOffset + relativeToDocument * blockDocumentOffset + blockAnchorOffset;
        const surfaceBlockProperty = surfaceBlock === "start" ? "inset-block-start" : "inset-block-end";
        return { blockInset, blockOutOfBoundsCorrection, surfaceBlockProperty };
      }
      /**
       * Calculates the css property, the inset, and the out of bounds correction
       * for the surface in the inline direction.
       */
      calculateInline(config) {
        const { isLTR: isLTRBool, surfaceInline, anchorInline, anchorRect, surfaceRect, xOffset, positioning, windowInnerWidth, inlineScrollbarWidth } = config;
        const relativeToWindow = positioning === "fixed" || positioning === "document" ? 1 : 0;
        const relativeToDocument = positioning === "document" ? 1 : 0;
        const isLTR = isLTRBool ? 1 : 0;
        const isRTL = isLTRBool ? 0 : 1;
        const isSurfaceInlineStart = surfaceInline === "start" ? 1 : 0;
        const isSurfaceInlineEnd = surfaceInline === "end" ? 1 : 0;
        const isOneInlineEnd = anchorInline !== surfaceInline ? 1 : 0;
        const inlineAnchorOffset = isOneInlineEnd * anchorRect.width + xOffset;
        const inlineTopLayerOffsetLTR = isSurfaceInlineStart * anchorRect.left + isSurfaceInlineEnd * (windowInnerWidth - anchorRect.right - inlineScrollbarWidth);
        const inlineTopLayerOffsetRTL = isSurfaceInlineStart * (windowInnerWidth - anchorRect.right - inlineScrollbarWidth) + isSurfaceInlineEnd * anchorRect.left;
        const inlineTopLayerOffset = isLTR * inlineTopLayerOffsetLTR + isRTL * inlineTopLayerOffsetRTL;
        const inlineDocumentOffsetLTR = isSurfaceInlineStart * window.scrollX - isSurfaceInlineEnd * window.scrollX;
        const inlineDocumentOffsetRTL = isSurfaceInlineEnd * window.scrollX - isSurfaceInlineStart * window.scrollX;
        const inlineDocumentOffset = isLTR * inlineDocumentOffsetLTR + isRTL * inlineDocumentOffsetRTL;
        const inlineOutOfBoundsCorrection = Math.abs(Math.min(0, windowInnerWidth - inlineTopLayerOffset - inlineAnchorOffset - surfaceRect.width));
        const inlineInset = relativeToWindow * inlineTopLayerOffset + inlineAnchorOffset + relativeToDocument * inlineDocumentOffset;
        let surfaceInlineProperty = surfaceInline === "start" ? "inset-inline-start" : "inset-inline-end";
        if (positioning === "document" || positioning === "fixed") {
          if (surfaceInline === "start" && isLTRBool || surfaceInline === "end" && !isLTRBool) {
            surfaceInlineProperty = "left";
          } else {
            surfaceInlineProperty = "right";
          }
        }
        return {
          inlineInset,
          inlineOutOfBoundsCorrection,
          surfaceInlineProperty
        };
      }
      hostUpdate() {
        this.onUpdate();
      }
      hostUpdated() {
        this.onUpdate();
      }
      /**
       * Checks whether the properties passed into the controller have changed since
       * the last positioning. If so, it will reposition if the surface is open or
       * close it if the surface should close.
       */
      async onUpdate() {
        const props = this.getProperties();
        let hasChanged = false;
        for (const [key, value] of Object.entries(props)) {
          hasChanged = hasChanged || value !== this.lastValues[key];
          if (hasChanged)
            break;
        }
        const openChanged = this.lastValues.isOpen !== props.isOpen;
        const hasAnchor = !!props.anchorEl;
        const hasSurface = !!props.surfaceEl;
        if (hasChanged && hasAnchor && hasSurface) {
          this.lastValues.isOpen = props.isOpen;
          if (props.isOpen) {
            this.lastValues = props;
            await this.position();
            props.onOpen();
          } else if (openChanged) {
            await props.beforeClose();
            this.close();
            props.onClose();
          }
        }
      }
      /**
       * Hides the surface.
       */
      close() {
        this.surfaceStylesInternal = {
          "display": "none"
        };
        this.host.requestUpdate();
        const surfaceEl = this.getProperties().surfaceEl;
        if (surfaceEl?.popover && surfaceEl?.isConnected) {
          surfaceEl.hidePopover();
        }
      }
    };
  }
});

// node_modules/@material/web/menu/internal/controllers/typeaheadController.js
var TYPEAHEAD_RECORD, TypeaheadController;
var init_typeaheadController = __esm({
  "node_modules/@material/web/menu/internal/controllers/typeaheadController.js"() {
    TYPEAHEAD_RECORD = {
      INDEX: 0,
      ITEM: 1,
      TEXT: 2
    };
    TypeaheadController = class {
      /**
       * @param getProperties A function that returns the options of the typeahead
       * controller:
       *
       * {
       *   getItems: A function that returns an array of menu items to be searched.
       *   typeaheadBufferTime: The maximum time between each keystroke to keep the
       *       current type buffer alive.
       * }
       */
      constructor(getProperties) {
        this.getProperties = getProperties;
        this.typeaheadRecords = [];
        this.typaheadBuffer = "";
        this.cancelTypeaheadTimeout = 0;
        this.isTypingAhead = false;
        this.lastActiveRecord = null;
        this.onKeydown = (event) => {
          if (this.isTypingAhead) {
            this.typeahead(event);
          } else {
            this.beginTypeahead(event);
          }
        };
        this.endTypeahead = () => {
          this.isTypingAhead = false;
          this.typaheadBuffer = "";
          this.typeaheadRecords = [];
        };
      }
      get items() {
        return this.getProperties().getItems();
      }
      get active() {
        return this.getProperties().active;
      }
      /**
       * Sets up typingahead
       */
      beginTypeahead(event) {
        if (!this.active) {
          return;
        }
        if (event.code === "Space" || event.code === "Enter" || event.code.startsWith("Arrow") || event.code === "Escape") {
          return;
        }
        this.isTypingAhead = true;
        this.typeaheadRecords = this.items.map((el, index) => [
          index,
          el,
          el.typeaheadText.trim().toLowerCase()
        ]);
        this.lastActiveRecord = this.typeaheadRecords.find((record) => record[TYPEAHEAD_RECORD.ITEM].tabIndex === 0) ?? null;
        if (this.lastActiveRecord) {
          this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
        }
        this.typeahead(event);
      }
      /**
       * Performs the typeahead. Based on the normalized items and the current text
       * buffer, finds the _next_ item with matching text and activates it.
       *
       * @example
       *
       * items: Apple, Banana, Olive, Orange, Cucumber
       * buffer: ''
       * user types: o
       *
       * activates Olive
       *
       * @example
       *
       * items: Apple, Banana, Olive (active), Orange, Cucumber
       * buffer: 'o'
       * user types: l
       *
       * activates Olive
       *
       * @example
       *
       * items: Apple, Banana, Olive (active), Orange, Cucumber
       * buffer: ''
       * user types: o
       *
       * activates Orange
       *
       * @example
       *
       * items: Apple, Banana, Olive, Orange (active), Cucumber
       * buffer: ''
       * user types: o
       *
       * activates Olive
       */
      typeahead(event) {
        if (event.defaultPrevented)
          return;
        clearTimeout(this.cancelTypeaheadTimeout);
        if (event.code === "Enter" || event.code.startsWith("Arrow") || event.code === "Escape") {
          this.endTypeahead();
          if (this.lastActiveRecord) {
            this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
          }
          return;
        }
        if (event.code === "Space") {
          event.preventDefault();
        }
        this.cancelTypeaheadTimeout = setTimeout(this.endTypeahead, this.getProperties().typeaheadBufferTime);
        this.typaheadBuffer += event.key.toLowerCase();
        const lastActiveIndex = this.lastActiveRecord ? this.lastActiveRecord[TYPEAHEAD_RECORD.INDEX] : -1;
        const numRecords = this.typeaheadRecords.length;
        const rebaseIndexOnActive = (record) => {
          return (record[TYPEAHEAD_RECORD.INDEX] + numRecords - lastActiveIndex) % numRecords;
        };
        const matchingRecords = this.typeaheadRecords.filter((record) => !record[TYPEAHEAD_RECORD.ITEM].disabled && record[TYPEAHEAD_RECORD.TEXT].startsWith(this.typaheadBuffer)).sort((a4, b3) => rebaseIndexOnActive(a4) - rebaseIndexOnActive(b3));
        if (matchingRecords.length === 0) {
          clearTimeout(this.cancelTypeaheadTimeout);
          if (this.lastActiveRecord) {
            this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
          }
          this.endTypeahead();
          return;
        }
        const isNewQuery = this.typaheadBuffer.length === 1;
        let nextRecord;
        if (this.lastActiveRecord === matchingRecords[0] && isNewQuery) {
          nextRecord = matchingRecords[1] ?? matchingRecords[0];
        } else {
          nextRecord = matchingRecords[0];
        }
        if (this.lastActiveRecord) {
          this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = -1;
        }
        this.lastActiveRecord = nextRecord;
        nextRecord[TYPEAHEAD_RECORD.ITEM].tabIndex = 0;
        nextRecord[TYPEAHEAD_RECORD.ITEM].focus();
        return;
      }
    };
  }
});

// node_modules/@material/web/menu/internal/menu.js
function getFocusedElement(activeDoc = document) {
  let activeEl = activeDoc.activeElement;
  while (activeEl && activeEl?.shadowRoot?.activeElement) {
    activeEl = activeEl.shadowRoot.activeElement;
  }
  return activeEl;
}
var DEFAULT_TYPEAHEAD_BUFFER_TIME, submenuNavKeys, menuNavKeys, Menu;
var init_menu = __esm({
  "node_modules/@material/web/menu/internal/menu.js"() {
    init_tslib_es6();
    init_elevation2();
    init_md_focus_ring();
    init_lit();
    init_decorators();
    init_class_map2();
    init_style_map2();
    init_animation();
    init_list_controller();
    init_list_navigation_helpers();
    init_shared();
    init_surfacePositionController();
    init_typeaheadController();
    init_surfacePositionController();
    DEFAULT_TYPEAHEAD_BUFFER_TIME = 200;
    submenuNavKeys = /* @__PURE__ */ new Set([
      NavigableKeys.ArrowDown,
      NavigableKeys.ArrowUp,
      NavigableKeys.Home,
      NavigableKeys.End
    ]);
    menuNavKeys = /* @__PURE__ */ new Set([
      NavigableKeys.ArrowLeft,
      NavigableKeys.ArrowRight,
      ...submenuNavKeys
    ]);
    Menu = class extends i4 {
      /**
       * Whether the menu is animating upwards or downwards when opening. This is
       * helpful for calculating some animation calculations.
       */
      get openDirection() {
        const menuCornerBlock = this.menuCorner.split("-")[0];
        return menuCornerBlock === "start" ? "DOWN" : "UP";
      }
      /**
       * The element which the menu should align to. If `anchor` is set to a
       * non-empty idref string, then `anchorEl` will resolve to the element with
       * the given id in the same root node. Otherwise, `null`.
       */
      get anchorElement() {
        if (this.anchor) {
          return this.getRootNode().querySelector(`#${this.anchor}`);
        }
        return this.currentAnchorElement;
      }
      set anchorElement(element) {
        this.currentAnchorElement = element;
        this.requestUpdate("anchorElement");
      }
      constructor() {
        super();
        this.anchor = "";
        this.positioning = "absolute";
        this.quick = false;
        this.hasOverflow = false;
        this.open = false;
        this.xOffset = 0;
        this.yOffset = 0;
        this.noHorizontalFlip = false;
        this.noVerticalFlip = false;
        this.typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;
        this.anchorCorner = Corner.END_START;
        this.menuCorner = Corner.START_START;
        this.stayOpenOnOutsideClick = false;
        this.stayOpenOnFocusout = false;
        this.skipRestoreFocus = false;
        this.defaultFocus = FocusState.FIRST_ITEM;
        this.noNavigationWrap = false;
        this.typeaheadActive = true;
        this.isSubmenu = false;
        this.pointerPath = [];
        this.isRepositioning = false;
        this.openCloseAnimationSignal = createAnimationSignal();
        this.listController = new ListController({
          isItem: (maybeItem) => {
            return maybeItem.hasAttribute("md-menu-item");
          },
          getPossibleItems: () => this.slotItems,
          isRtl: () => getComputedStyle(this).direction === "rtl",
          deactivateItem: (item) => {
            item.selected = false;
            item.tabIndex = -1;
          },
          activateItem: (item) => {
            item.selected = true;
            item.tabIndex = 0;
          },
          isNavigableKey: (key) => {
            if (!this.isSubmenu) {
              return menuNavKeys.has(key);
            }
            const isRtl = getComputedStyle(this).direction === "rtl";
            const arrowOpen = isRtl ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;
            if (key === arrowOpen) {
              return true;
            }
            return submenuNavKeys.has(key);
          },
          wrapNavigation: () => !this.noNavigationWrap
        });
        this.lastFocusedElement = null;
        this.typeaheadController = new TypeaheadController(() => {
          return {
            getItems: () => this.items,
            typeaheadBufferTime: this.typeaheadDelay,
            active: this.typeaheadActive
          };
        });
        this.currentAnchorElement = null;
        this.internals = // Cast needed for closure
        this.attachInternals();
        this.menuPositionController = new SurfacePositionController(this, () => {
          return {
            anchorCorner: this.anchorCorner,
            surfaceCorner: this.menuCorner,
            surfaceEl: this.surfaceEl,
            anchorEl: this.anchorElement,
            positioning: this.positioning === "popover" ? "document" : this.positioning,
            isOpen: this.open,
            xOffset: this.xOffset,
            yOffset: this.yOffset,
            disableBlockFlip: this.noVerticalFlip,
            disableInlineFlip: this.noHorizontalFlip,
            onOpen: this.onOpened,
            beforeClose: this.beforeClose,
            onClose: this.onClosed,
            // We can't resize components that have overflow like menus with
            // submenus because the overflow-y will show menu items / content
            // outside the bounds of the menu. Popover API fixes this because each
            // submenu is hoisted to the top-layer and are not considered overflow
            // content.
            repositionStrategy: this.hasOverflow && this.positioning !== "popover" ? "move" : "resize"
          };
        });
        this.onWindowResize = () => {
          if (this.isRepositioning || this.positioning !== "document" && this.positioning !== "fixed" && this.positioning !== "popover") {
            return;
          }
          this.isRepositioning = true;
          this.reposition();
          this.isRepositioning = false;
        };
        this.handleFocusout = async (event) => {
          const anchorEl = this.anchorElement;
          if (this.stayOpenOnFocusout || !this.open || this.pointerPath.includes(anchorEl)) {
            return;
          }
          if (event.relatedTarget) {
            if (isElementInSubtree(event.relatedTarget, this) || this.pointerPath.length !== 0 && isElementInSubtree(event.relatedTarget, anchorEl)) {
              return;
            }
          } else if (this.pointerPath.includes(this)) {
            return;
          }
          const oldRestoreFocus = this.skipRestoreFocus;
          this.skipRestoreFocus = true;
          this.close();
          await this.updateComplete;
          this.skipRestoreFocus = oldRestoreFocus;
        };
        this.onOpened = async () => {
          this.lastFocusedElement = getFocusedElement();
          const items = this.items;
          const activeItemRecord = getActiveItem(items);
          if (activeItemRecord && this.defaultFocus !== FocusState.NONE) {
            activeItemRecord.item.tabIndex = -1;
          }
          let animationAborted = !this.quick;
          if (this.quick) {
            this.dispatchEvent(new Event("opening"));
          } else {
            animationAborted = !!await this.animateOpen();
          }
          switch (this.defaultFocus) {
            case FocusState.FIRST_ITEM:
              const first = getFirstActivatableItem(items);
              if (first) {
                first.tabIndex = 0;
                first.focus();
                await first.updateComplete;
              }
              break;
            case FocusState.LAST_ITEM:
              const last = getLastActivatableItem(items);
              if (last) {
                last.tabIndex = 0;
                last.focus();
                await last.updateComplete;
              }
              break;
            case FocusState.LIST_ROOT:
              this.focus();
              break;
            default:
            case FocusState.NONE:
              break;
          }
          if (!animationAborted) {
            this.dispatchEvent(new Event("opened"));
          }
        };
        this.beforeClose = async () => {
          this.open = false;
          if (!this.skipRestoreFocus) {
            this.lastFocusedElement?.focus?.();
          }
          if (!this.quick) {
            await this.animateClose();
          }
        };
        this.onClosed = () => {
          if (this.quick) {
            this.dispatchEvent(new Event("closing"));
            this.dispatchEvent(new Event("closed"));
          }
        };
        this.onWindowPointerdown = (event) => {
          this.pointerPath = event.composedPath();
        };
        this.onDocumentClick = (event) => {
          if (!this.open) {
            return;
          }
          const path = event.composedPath();
          if (!this.stayOpenOnOutsideClick && !path.includes(this) && !path.includes(this.anchorElement)) {
            this.open = false;
          }
        };
        if (!o7) {
          this.internals.role = "menu";
          this.addEventListener("keydown", this.handleKeydown);
          this.addEventListener("keydown", this.captureKeydown, { capture: true });
          this.addEventListener("focusout", this.handleFocusout);
        }
      }
      /**
       * The menu items associated with this menu. The items must be `MenuItem`s and
       * have both the `md-menu-item` and `md-list-item` attributes.
       */
      get items() {
        return this.listController.items;
      }
      willUpdate(changed) {
        if (!changed.has("open")) {
          return;
        }
        if (this.open) {
          this.removeAttribute("aria-hidden");
          return;
        }
        this.setAttribute("aria-hidden", "true");
      }
      update(changed) {
        if (changed.has("open")) {
          if (this.open) {
            this.setUpGlobalEventListeners();
          } else {
            this.cleanUpGlobalEventListeners();
          }
        }
        if (changed.has("positioning") && this.positioning === "popover" && // type required for Google JS conformance
        !this.showPopover) {
          this.positioning = "fixed";
        }
        super.update(changed);
      }
      connectedCallback() {
        super.connectedCallback();
        if (this.open) {
          this.setUpGlobalEventListeners();
        }
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanUpGlobalEventListeners();
      }
      getBoundingClientRect() {
        if (!this.surfaceEl) {
          return super.getBoundingClientRect();
        }
        return this.surfaceEl.getBoundingClientRect();
      }
      getClientRects() {
        if (!this.surfaceEl) {
          return super.getClientRects();
        }
        return this.surfaceEl.getClientRects();
      }
      render() {
        return this.renderSurface();
      }
      /**
       * Renders the positionable surface element and its contents.
       */
      renderSurface() {
        return b2`
      <div
        class="menu ${e8(this.getSurfaceClasses())}"
        style=${o9(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning === "popover" ? "manual" : A}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `;
      }
      /**
       * Renders the menu items' slot
       */
      renderMenuItems() {
        return b2`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`;
      }
      /**
       * Renders the elevation component.
       */
      renderElevation() {
        return b2`<md-elevation part="elevation"></md-elevation>`;
      }
      getSurfaceClasses() {
        return {
          open: this.open,
          fixed: this.positioning === "fixed",
          "has-overflow": this.hasOverflow
        };
      }
      captureKeydown(event) {
        if (event.target === this && !event.defaultPrevented && isClosableKey(event.code)) {
          event.preventDefault();
          this.close();
        }
        this.typeaheadController.onKeydown(event);
      }
      /**
       * Performs the opening animation:
       *
       * https://direct.googleplex.com/#/spec/295000003+271060003
       *
       * @return A promise that resolve to `true` if the animation was aborted,
       *     `false` if it was not aborted.
       */
      async animateOpen() {
        const surfaceEl = this.surfaceEl;
        const slotEl = this.slotEl;
        if (!surfaceEl || !slotEl)
          return true;
        const openDirection = this.openDirection;
        this.dispatchEvent(new Event("opening"));
        surfaceEl.classList.toggle("animating", true);
        const signal = this.openCloseAnimationSignal.start();
        const height = surfaceEl.offsetHeight;
        const openingUpwards = openDirection === "UP";
        const children = this.items;
        const FULL_DURATION = 500;
        const SURFACE_OPACITY_DURATION = 50;
        const ITEM_OPACITY_DURATION = 250;
        const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_DURATION) / children.length;
        const surfaceHeightAnimation = surfaceEl.animate([{ height: "0px" }, { height: `${height}px` }], {
          duration: FULL_DURATION,
          easing: EASING.EMPHASIZED
        });
        const upPositionCorrectionAnimation = slotEl.animate([
          { transform: openingUpwards ? `translateY(-${height}px)` : "" },
          { transform: "" }
        ], { duration: FULL_DURATION, easing: EASING.EMPHASIZED });
        const surfaceOpacityAnimation = surfaceEl.animate([{ opacity: 0 }, { opacity: 1 }], SURFACE_OPACITY_DURATION);
        const childrenAnimations = [];
        for (let i8 = 0; i8 < children.length; i8++) {
          const directionalIndex = openingUpwards ? children.length - 1 - i8 : i8;
          const child = children[directionalIndex];
          const animation = child.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: ITEM_OPACITY_DURATION,
            delay: DELAY_BETWEEN_ITEMS * i8
          });
          child.classList.toggle("md-menu-hidden", true);
          animation.addEventListener("finish", () => {
            child.classList.toggle("md-menu-hidden", false);
          });
          childrenAnimations.push([child, animation]);
        }
        let resolveAnimation = (value) => {
        };
        const animationFinished = new Promise((resolve) => {
          resolveAnimation = resolve;
        });
        signal.addEventListener("abort", () => {
          surfaceHeightAnimation.cancel();
          upPositionCorrectionAnimation.cancel();
          surfaceOpacityAnimation.cancel();
          childrenAnimations.forEach(([child, animation]) => {
            child.classList.toggle("md-menu-hidden", false);
            animation.cancel();
          });
          resolveAnimation(true);
        });
        surfaceHeightAnimation.addEventListener("finish", () => {
          surfaceEl.classList.toggle("animating", false);
          this.openCloseAnimationSignal.finish();
          resolveAnimation(false);
        });
        return await animationFinished;
      }
      /**
       * Performs the closing animation:
       *
       * https://direct.googleplex.com/#/spec/295000003+271060003
       */
      animateClose() {
        let resolve;
        const animationEnded = new Promise((res) => {
          resolve = res;
        });
        const surfaceEl = this.surfaceEl;
        const slotEl = this.slotEl;
        if (!surfaceEl || !slotEl) {
          resolve(false);
          return animationEnded;
        }
        const openDirection = this.openDirection;
        const closingDownwards = openDirection === "UP";
        this.dispatchEvent(new Event("closing"));
        surfaceEl.classList.toggle("animating", true);
        const signal = this.openCloseAnimationSignal.start();
        const height = surfaceEl.offsetHeight;
        const children = this.items;
        const FULL_DURATION = 150;
        const SURFACE_OPACITY_DURATION = 50;
        const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
        const ITEM_OPACITY_DURATION = 50;
        const ITEM_OPACITY_INITIAL_DELAY = 50;
        const END_HEIGHT_PERCENTAGE = 0.35;
        const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) / children.length;
        const surfaceHeightAnimation = surfaceEl.animate([
          { height: `${height}px` },
          { height: `${height * END_HEIGHT_PERCENTAGE}px` }
        ], {
          duration: FULL_DURATION,
          easing: EASING.EMPHASIZED_ACCELERATE
        });
        const downPositionCorrectionAnimation = slotEl.animate([
          { transform: "" },
          {
            transform: closingDownwards ? `translateY(-${height * (1 - END_HEIGHT_PERCENTAGE)}px)` : ""
          }
        ], { duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE });
        const surfaceOpacityAnimation = surfaceEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: SURFACE_OPACITY_DURATION, delay: SURFACE_OPACITY_DELAY });
        const childrenAnimations = [];
        for (let i8 = 0; i8 < children.length; i8++) {
          const directionalIndex = closingDownwards ? i8 : children.length - 1 - i8;
          const child = children[directionalIndex];
          const animation = child.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: ITEM_OPACITY_DURATION,
            delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i8
          });
          animation.addEventListener("finish", () => {
            child.classList.toggle("md-menu-hidden", true);
          });
          childrenAnimations.push([child, animation]);
        }
        signal.addEventListener("abort", () => {
          surfaceHeightAnimation.cancel();
          downPositionCorrectionAnimation.cancel();
          surfaceOpacityAnimation.cancel();
          childrenAnimations.forEach(([child, animation]) => {
            animation.cancel();
            child.classList.toggle("md-menu-hidden", false);
          });
          resolve(false);
        });
        surfaceHeightAnimation.addEventListener("finish", () => {
          surfaceEl.classList.toggle("animating", false);
          childrenAnimations.forEach(([child]) => {
            child.classList.toggle("md-menu-hidden", false);
          });
          this.openCloseAnimationSignal.finish();
          this.dispatchEvent(new Event("closed"));
          resolve(true);
        });
        return animationEnded;
      }
      handleKeydown(event) {
        this.pointerPath = [];
        this.listController.handleKeydown(event);
      }
      setUpGlobalEventListeners() {
        document.addEventListener("click", this.onDocumentClick, { capture: true });
        window.addEventListener("pointerdown", this.onWindowPointerdown);
        document.addEventListener("resize", this.onWindowResize, { passive: true });
        window.addEventListener("resize", this.onWindowResize, { passive: true });
      }
      cleanUpGlobalEventListeners() {
        document.removeEventListener("click", this.onDocumentClick, {
          capture: true
        });
        window.removeEventListener("pointerdown", this.onWindowPointerdown);
        document.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener("resize", this.onWindowResize);
      }
      onCloseMenu() {
        this.close();
      }
      onDeactivateItems(event) {
        event.stopPropagation();
        this.listController.onDeactivateItems();
      }
      onRequestActivation(event) {
        event.stopPropagation();
        this.listController.onRequestActivation(event);
      }
      handleDeactivateTypeahead(event) {
        event.stopPropagation();
        this.typeaheadActive = false;
      }
      handleActivateTypeahead(event) {
        event.stopPropagation();
        this.typeaheadActive = true;
      }
      handleStayOpenOnFocusout(event) {
        event.stopPropagation();
        this.stayOpenOnFocusout = true;
      }
      handleCloseOnFocusout(event) {
        event.stopPropagation();
        this.stayOpenOnFocusout = false;
      }
      close() {
        this.open = false;
        const maybeSubmenu = this.slotItems;
        maybeSubmenu.forEach((item) => {
          item.close?.();
        });
      }
      show() {
        this.open = true;
      }
      /**
       * Activates the next item in the menu. If at the end of the menu, the first
       * item will be activated.
       *
       * @return The activated menu item or `null` if there are no items.
       */
      activateNextItem() {
        return this.listController.activateNextItem() ?? null;
      }
      /**
       * Activates the previous item in the menu. If at the start of the menu, the
       * last item will be activated.
       *
       * @return The activated menu item or `null` if there are no items.
       */
      activatePreviousItem() {
        return this.listController.activatePreviousItem() ?? null;
      }
      /**
       * Repositions the menu if it is open.
       *
       * Useful for the case where document or window-positioned menus have their
       * anchors moved while open.
       */
      reposition() {
        if (this.open) {
          this.menuPositionController.position();
        }
      }
    };
    __decorate([
      e4(".menu")
    ], Menu.prototype, "surfaceEl", void 0);
    __decorate([
      e4("slot")
    ], Menu.prototype, "slotEl", void 0);
    __decorate([
      n3()
    ], Menu.prototype, "anchor", void 0);
    __decorate([
      n3()
    ], Menu.prototype, "positioning", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Menu.prototype, "quick", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "has-overflow" })
    ], Menu.prototype, "hasOverflow", void 0);
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], Menu.prototype, "open", void 0);
    __decorate([
      n3({ type: Number, attribute: "x-offset" })
    ], Menu.prototype, "xOffset", void 0);
    __decorate([
      n3({ type: Number, attribute: "y-offset" })
    ], Menu.prototype, "yOffset", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "no-horizontal-flip" })
    ], Menu.prototype, "noHorizontalFlip", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "no-vertical-flip" })
    ], Menu.prototype, "noVerticalFlip", void 0);
    __decorate([
      n3({ type: Number, attribute: "typeahead-delay" })
    ], Menu.prototype, "typeaheadDelay", void 0);
    __decorate([
      n3({ attribute: "anchor-corner" })
    ], Menu.prototype, "anchorCorner", void 0);
    __decorate([
      n3({ attribute: "menu-corner" })
    ], Menu.prototype, "menuCorner", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "stay-open-on-outside-click" })
    ], Menu.prototype, "stayOpenOnOutsideClick", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "stay-open-on-focusout" })
    ], Menu.prototype, "stayOpenOnFocusout", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "skip-restore-focus" })
    ], Menu.prototype, "skipRestoreFocus", void 0);
    __decorate([
      n3({ attribute: "default-focus" })
    ], Menu.prototype, "defaultFocus", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "no-navigation-wrap" })
    ], Menu.prototype, "noNavigationWrap", void 0);
    __decorate([
      o4({ flatten: true })
    ], Menu.prototype, "slotItems", void 0);
    __decorate([
      r4()
    ], Menu.prototype, "typeaheadActive", void 0);
  }
});

// node_modules/@material/web/menu/internal/menu-styles.cssresult.js
var styles5, menu_styles_cssresult_default;
var init_menu_styles_cssresult = __esm({
  "node_modules/@material/web/menu/internal/menu-styles.cssresult.js"() {
    init_lit();
    styles5 = i`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:var(--md-menu-top-space, 8px) var(--md-menu-bottom-space, 8px)}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`;
    menu_styles_cssresult_default = styles5.styleSheet;
  }
});

// node_modules/@material/web/menu/menu.js
var MdMenu;
var init_menu2 = __esm({
  "node_modules/@material/web/menu/menu.js"() {
    init_tslib_es6();
    init_decorators();
    init_menu();
    init_menu_styles_cssresult();
    init_shared();
    init_menu();
    MdMenu = class MdMenu2 extends Menu {
    };
    MdMenu.styles = [styles5];
    MdMenu = __decorate([
      t("md-menu")
    ], MdMenu);
  }
});

// node_modules/@material/web/internal/aria/aria.js
function isAriaAttribute(attribute) {
  return ARIA_ATTRIBUTES.includes(attribute);
}
function ariaPropertyToAttribute(property) {
  return property.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
var ARIA_PROPERTIES, ARIA_ATTRIBUTES;
var init_aria = __esm({
  "node_modules/@material/web/internal/aria/aria.js"() {
    ARIA_PROPERTIES = [
      "role",
      "ariaAtomic",
      "ariaAutoComplete",
      "ariaBusy",
      "ariaChecked",
      "ariaColCount",
      "ariaColIndex",
      "ariaColSpan",
      "ariaCurrent",
      "ariaDisabled",
      "ariaExpanded",
      "ariaHasPopup",
      "ariaHidden",
      "ariaInvalid",
      "ariaKeyShortcuts",
      "ariaLabel",
      "ariaLevel",
      "ariaLive",
      "ariaModal",
      "ariaMultiLine",
      "ariaMultiSelectable",
      "ariaOrientation",
      "ariaPlaceholder",
      "ariaPosInSet",
      "ariaPressed",
      "ariaReadOnly",
      "ariaRequired",
      "ariaRoleDescription",
      "ariaRowCount",
      "ariaRowIndex",
      "ariaRowSpan",
      "ariaSelected",
      "ariaSetSize",
      "ariaSort",
      "ariaValueMax",
      "ariaValueMin",
      "ariaValueNow",
      "ariaValueText"
    ];
    ARIA_ATTRIBUTES = ARIA_PROPERTIES.map(ariaPropertyToAttribute);
  }
});

// node_modules/@material/web/internal/aria/delegate.js
function mixinDelegatesAria(base) {
  var _a2;
  if (o7) {
    return base;
  }
  class WithDelegatesAriaElement extends base {
    constructor() {
      super(...arguments);
      this[_a2] = /* @__PURE__ */ new Set();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (!isAriaAttribute(name)) {
        super.attributeChangedCallback(name, oldValue, newValue);
        return;
      }
      if (this[privateIgnoreAttributeChangesFor].has(name)) {
        return;
      }
      this[privateIgnoreAttributeChangesFor].add(name);
      this.removeAttribute(name);
      this[privateIgnoreAttributeChangesFor].delete(name);
      const dataProperty = ariaAttributeToDataProperty(name);
      if (newValue === null) {
        delete this.dataset[dataProperty];
      } else {
        this.dataset[dataProperty] = newValue;
      }
      this.requestUpdate(ariaAttributeToDataProperty(name), oldValue);
    }
    getAttribute(name) {
      if (isAriaAttribute(name)) {
        return super.getAttribute(ariaAttributeToDataAttribute(name));
      }
      return super.getAttribute(name);
    }
    removeAttribute(name) {
      super.removeAttribute(name);
      if (isAriaAttribute(name)) {
        super.removeAttribute(ariaAttributeToDataAttribute(name));
        this.requestUpdate();
      }
    }
  }
  _a2 = privateIgnoreAttributeChangesFor;
  setupDelegatesAriaProperties(WithDelegatesAriaElement);
  return WithDelegatesAriaElement;
}
function setupDelegatesAriaProperties(ctor) {
  for (const ariaProperty of ARIA_PROPERTIES) {
    const ariaAttribute = ariaPropertyToAttribute(ariaProperty);
    const dataAttribute = ariaAttributeToDataAttribute(ariaAttribute);
    const dataProperty = ariaAttributeToDataProperty(ariaAttribute);
    ctor.createProperty(ariaProperty, {
      attribute: ariaAttribute,
      noAccessor: true
    });
    ctor.createProperty(Symbol(dataAttribute), {
      attribute: dataAttribute,
      noAccessor: true
    });
    Object.defineProperty(ctor.prototype, ariaProperty, {
      configurable: true,
      enumerable: true,
      get() {
        return this.dataset[dataProperty] ?? null;
      },
      set(value) {
        const prevValue = this.dataset[dataProperty] ?? null;
        if (value === prevValue) {
          return;
        }
        if (value === null) {
          delete this.dataset[dataProperty];
        } else {
          this.dataset[dataProperty] = value;
        }
        this.requestUpdate(ariaProperty, prevValue);
      }
    });
  }
}
function ariaAttributeToDataAttribute(ariaAttribute) {
  return `data-${ariaAttribute}`;
}
function ariaAttributeToDataProperty(ariaAttribute) {
  return ariaAttribute.replace(/-\w/, (dashLetter) => dashLetter[1].toUpperCase());
}
var privateIgnoreAttributeChangesFor;
var init_delegate = __esm({
  "node_modules/@material/web/internal/aria/delegate.js"() {
    init_lit();
    init_aria();
    privateIgnoreAttributeChangesFor = Symbol("privateIgnoreAttributeChangesFor");
  }
});

// node_modules/@material/web/internal/events/redispatch-event.js
function redispatchEvent(element, event) {
  if (event.bubbles && (!element.shadowRoot || event.composed)) {
    event.stopPropagation();
  }
  const copy = Reflect.construct(event.constructor, [event.type, event]);
  const dispatched = element.dispatchEvent(copy);
  if (!dispatched) {
    event.preventDefault();
  }
  return dispatched;
}
var init_redispatch_event = __esm({
  "node_modules/@material/web/internal/events/redispatch-event.js"() {
  }
});

// node_modules/@material/web/labs/behaviors/element-internals.js
function mixinElementInternals(base) {
  class WithElementInternalsElement extends base {
    get [internals]() {
      if (!this[privateInternals]) {
        this[privateInternals] = this.attachInternals();
      }
      return this[privateInternals];
    }
  }
  return WithElementInternalsElement;
}
var internals, privateInternals;
var init_element_internals = __esm({
  "node_modules/@material/web/labs/behaviors/element-internals.js"() {
    internals = Symbol("internals");
    privateInternals = Symbol("privateInternals");
  }
});

// node_modules/@material/web/labs/behaviors/constraint-validation.js
function mixinConstraintValidation(base) {
  var _a2;
  class ConstraintValidationElement extends base {
    constructor() {
      super(...arguments);
      this[_a2] = "";
    }
    get validity() {
      this[privateSyncValidity]();
      return this[internals].validity;
    }
    get validationMessage() {
      this[privateSyncValidity]();
      return this[internals].validationMessage;
    }
    get willValidate() {
      this[privateSyncValidity]();
      return this[internals].willValidate;
    }
    checkValidity() {
      this[privateSyncValidity]();
      return this[internals].checkValidity();
    }
    reportValidity() {
      this[privateSyncValidity]();
      return this[internals].reportValidity();
    }
    setCustomValidity(error) {
      this[privateCustomValidationMessage] = error;
      this[privateSyncValidity]();
    }
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);
      this[privateSyncValidity]();
    }
    firstUpdated(changed) {
      super.firstUpdated(changed);
      this[privateSyncValidity]();
    }
    [(_a2 = privateCustomValidationMessage, privateSyncValidity)]() {
      if (o7) {
        return;
      }
      if (!this[privateValidator]) {
        this[privateValidator] = this[createValidator]();
      }
      const { validity, validationMessage: nonCustomValidationMessage } = this[privateValidator].getValidity();
      const customError = !!this[privateCustomValidationMessage];
      const validationMessage = this[privateCustomValidationMessage] || nonCustomValidationMessage;
      this[internals].setValidity({ ...validity, customError }, validationMessage, this[getValidityAnchor]() ?? void 0);
    }
    [createValidator]() {
      throw new Error("Implement [createValidator]");
    }
    [getValidityAnchor]() {
      throw new Error("Implement [getValidityAnchor]");
    }
  }
  return ConstraintValidationElement;
}
var createValidator, getValidityAnchor, privateValidator, privateSyncValidity, privateCustomValidationMessage;
var init_constraint_validation = __esm({
  "node_modules/@material/web/labs/behaviors/constraint-validation.js"() {
    init_lit();
    init_element_internals();
    createValidator = Symbol("createValidator");
    getValidityAnchor = Symbol("getValidityAnchor");
    privateValidator = Symbol("privateValidator");
    privateSyncValidity = Symbol("privateSyncValidity");
    privateCustomValidationMessage = Symbol("privateCustomValidationMessage");
  }
});

// node_modules/@material/web/labs/behaviors/form-associated.js
function mixinFormAssociated(base) {
  class FormAssociatedElement extends base {
    get form() {
      return this[internals].form;
    }
    get labels() {
      return this[internals].labels;
    }
    // Use @property for the `name` and `disabled` properties to add them to the
    // `observedAttributes` array and trigger `attributeChangedCallback()`.
    //
    // We don't use Lit's default getter/setter (`noAccessor: true`) because
    // the attributes need to be updated synchronously to work with synchronous
    // form APIs, and Lit updates attributes async by default.
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(name) {
      this.setAttribute("name", name);
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(disabled) {
      this.toggleAttribute("disabled", Boolean(disabled));
    }
    attributeChangedCallback(name, old, value) {
      if (name === "name" || name === "disabled") {
        const oldValue = name === "disabled" ? old !== null : old;
        this.requestUpdate(name, oldValue);
        return;
      }
      super.attributeChangedCallback(name, old, value);
    }
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);
      this[internals].setFormValue(this[getFormValue](), this[getFormState]());
    }
    [getFormValue]() {
      return this.getAttribute("value");
    }
    [getFormState]() {
      return this[getFormValue]();
    }
    formDisabledCallback(disabled) {
      this.disabled = disabled;
    }
  }
  FormAssociatedElement.formAssociated = true;
  __decorate([
    n3({ noAccessor: true })
  ], FormAssociatedElement.prototype, "name", null);
  __decorate([
    n3({ type: Boolean, noAccessor: true })
  ], FormAssociatedElement.prototype, "disabled", null);
  return FormAssociatedElement;
}
var getFormValue, getFormState;
var init_form_associated = __esm({
  "node_modules/@material/web/labs/behaviors/form-associated.js"() {
    init_tslib_es6();
    init_decorators();
    init_element_internals();
    getFormValue = Symbol("getFormValue");
    getFormState = Symbol("getFormState");
  }
});

// node_modules/@material/web/labs/behaviors/on-report-validity.js
function mixinOnReportValidity(base) {
  var _a2, _b, _c;
  class OnReportValidityElement extends base {
    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...args) {
      super(...args);
      this[_a2] = new AbortController();
      this[_b] = false;
      this[_c] = false;
      if (o7) {
        return;
      }
      this.addEventListener("invalid", (invalidEvent) => {
        if (this[privateDoNotReportInvalid] || !invalidEvent.isTrusted) {
          return;
        }
        this.addEventListener("invalid", () => {
          this[privateCallOnReportValidity](invalidEvent);
        }, { once: true });
      }, {
        // Listen during the capture phase, which will happen before the
        // bubbling phase. That way, we can add a final event listener that
        // will run after other event listeners, and we can check if it was
        // default prevented. This works because invalid does not bubble.
        capture: true
      });
    }
    checkValidity() {
      this[privateDoNotReportInvalid] = true;
      const valid = super.checkValidity();
      this[privateDoNotReportInvalid] = false;
      return valid;
    }
    reportValidity() {
      this[privateIsSelfReportingValidity] = true;
      const valid = super.reportValidity();
      if (valid) {
        this[privateCallOnReportValidity](null);
      }
      this[privateIsSelfReportingValidity] = false;
      return valid;
    }
    [(_a2 = privateCleanupFormListeners, _b = privateDoNotReportInvalid, _c = privateIsSelfReportingValidity, privateCallOnReportValidity)](invalidEvent) {
      const wasCanceled = invalidEvent?.defaultPrevented;
      if (wasCanceled) {
        return;
      }
      this[onReportValidity](invalidEvent);
      const implementationCanceledFocus = !wasCanceled && invalidEvent?.defaultPrevented;
      if (!implementationCanceledFocus) {
        return;
      }
      if (this[privateIsSelfReportingValidity] || isFirstInvalidControlInForm(this[internals].form, this)) {
        this.focus();
      }
    }
    [onReportValidity](invalidEvent) {
      throw new Error("Implement [onReportValidity]");
    }
    formAssociatedCallback(form) {
      if (super.formAssociatedCallback) {
        super.formAssociatedCallback(form);
      }
      this[privateCleanupFormListeners].abort();
      if (!form) {
        return;
      }
      this[privateCleanupFormListeners] = new AbortController();
      addFormReportValidListener(this, form, () => {
        this[privateCallOnReportValidity](null);
      }, this[privateCleanupFormListeners].signal);
    }
  }
  return OnReportValidityElement;
}
function addFormReportValidListener(control, form, onControlValid, cleanup) {
  const validateHooks = getFormValidateHooks(form);
  let controlFiredInvalid = false;
  let cleanupInvalidListener;
  let isNextSubmitFromHook = false;
  validateHooks.addEventListener("before", () => {
    isNextSubmitFromHook = true;
    cleanupInvalidListener = new AbortController();
    controlFiredInvalid = false;
    control.addEventListener("invalid", () => {
      controlFiredInvalid = true;
    }, {
      signal: cleanupInvalidListener.signal
    });
  }, { signal: cleanup });
  validateHooks.addEventListener("after", () => {
    isNextSubmitFromHook = false;
    cleanupInvalidListener?.abort();
    if (controlFiredInvalid) {
      return;
    }
    onControlValid();
  }, { signal: cleanup });
  form.addEventListener("submit", () => {
    if (isNextSubmitFromHook) {
      return;
    }
    onControlValid();
  }, {
    signal: cleanup
  });
}
function getFormValidateHooks(form) {
  if (!FORM_VALIDATE_HOOKS.has(form)) {
    const hooks = new EventTarget();
    FORM_VALIDATE_HOOKS.set(form, hooks);
    for (const methodName of ["reportValidity", "requestSubmit"]) {
      const superMethod = form[methodName];
      form[methodName] = function() {
        hooks.dispatchEvent(new Event("before"));
        const result = Reflect.apply(superMethod, this, arguments);
        hooks.dispatchEvent(new Event("after"));
        return result;
      };
    }
  }
  return FORM_VALIDATE_HOOKS.get(form);
}
function isFirstInvalidControlInForm(form, control) {
  if (!form) {
    return true;
  }
  let firstInvalidControl;
  for (const element of form.elements) {
    if (element.matches(":invalid")) {
      firstInvalidControl = element;
      break;
    }
  }
  return firstInvalidControl === control;
}
var onReportValidity, privateCleanupFormListeners, privateDoNotReportInvalid, privateIsSelfReportingValidity, privateCallOnReportValidity, FORM_VALIDATE_HOOKS;
var init_on_report_validity = __esm({
  "node_modules/@material/web/labs/behaviors/on-report-validity.js"() {
    init_lit();
    init_element_internals();
    onReportValidity = Symbol("onReportValidity");
    privateCleanupFormListeners = Symbol("privateCleanupFormListeners");
    privateDoNotReportInvalid = Symbol("privateDoNotReportInvalid");
    privateIsSelfReportingValidity = Symbol("privateIsSelfReportingValidity");
    privateCallOnReportValidity = Symbol("privateCallOnReportValidity");
    FORM_VALIDATE_HOOKS = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@material/web/labs/behaviors/validators/validator.js
var Validator;
var init_validator = __esm({
  "node_modules/@material/web/labs/behaviors/validators/validator.js"() {
    Validator = class {
      /**
       * Creates a new validator.
       *
       * @param getCurrentState A callback that returns the current state of
       *     constraint validation-related properties.
       */
      constructor(getCurrentState) {
        this.getCurrentState = getCurrentState;
        this.currentValidity = {
          validity: {},
          validationMessage: ""
        };
      }
      /**
       * Returns the current `ValidityStateFlags` and validation message for the
       * validator.
       *
       * If the constraint validation state has not changed, this will return a
       * cached result. This is important since `getValidity()` can be called
       * frequently in response to synchronous property changes.
       *
       * @return The current validity and validation message.
       */
      getValidity() {
        const state = this.getCurrentState();
        const hasStateChanged = !this.prevState || !this.equals(this.prevState, state);
        if (!hasStateChanged) {
          return this.currentValidity;
        }
        const { validity, validationMessage } = this.computeValidity(state);
        this.prevState = this.copy(state);
        this.currentValidity = {
          validationMessage,
          validity: {
            // Change any `ValidityState` instances into `ValidityStateFlags` since
            // `ValidityState` cannot be easily `{...spread}`.
            badInput: validity.badInput,
            customError: validity.customError,
            patternMismatch: validity.patternMismatch,
            rangeOverflow: validity.rangeOverflow,
            rangeUnderflow: validity.rangeUnderflow,
            stepMismatch: validity.stepMismatch,
            tooLong: validity.tooLong,
            tooShort: validity.tooShort,
            typeMismatch: validity.typeMismatch,
            valueMissing: validity.valueMissing
          }
        };
        return this.currentValidity;
      }
    };
  }
});

// node_modules/@material/web/labs/behaviors/validators/select-validator.js
var SelectValidator;
var init_select_validator = __esm({
  "node_modules/@material/web/labs/behaviors/validators/select-validator.js"() {
    init_lit();
    init_validator();
    SelectValidator = class extends Validator {
      computeValidity(state) {
        if (!this.selectControl) {
          this.selectControl = document.createElement("select");
        }
        D(b2`<option value=${state.value}></option>`, this.selectControl);
        this.selectControl.value = state.value;
        this.selectControl.required = state.required;
        return {
          validity: this.selectControl.validity,
          validationMessage: this.selectControl.validationMessage
        };
      }
      equals(prev, next) {
        return prev.value === next.value && prev.required === next.required;
      }
      copy({ value, required }) {
        return { value, required };
      }
    };
  }
});

// node_modules/@material/web/select/internal/shared.js
function getSelectedItems(items) {
  const selectedItemRecords = [];
  for (let i8 = 0; i8 < items.length; i8++) {
    const item = items[i8];
    if (item.selected) {
      selectedItemRecords.push([item, i8]);
    }
  }
  return selectedItemRecords;
}
var init_shared2 = __esm({
  "node_modules/@material/web/select/internal/shared.js"() {
  }
});

// node_modules/@material/web/select/internal/select.js
var _a, VALUE, selectBaseClass, Select;
var init_select = __esm({
  "node_modules/@material/web/select/internal/select.js"() {
    init_tslib_es6();
    init_menu2();
    init_lit();
    init_decorators();
    init_class_map2();
    init_style_map2();
    init_static_html();
    init_delegate();
    init_redispatch_event();
    init_constraint_validation();
    init_element_internals();
    init_form_associated();
    init_on_report_validity();
    init_select_validator();
    init_list_navigation_helpers();
    init_shared();
    init_typeaheadController();
    init_menu();
    init_shared2();
    VALUE = Symbol("value");
    selectBaseClass = mixinDelegatesAria(mixinOnReportValidity(mixinConstraintValidation(mixinFormAssociated(mixinElementInternals(i4)))));
    Select = class extends selectBaseClass {
      /**
       * The value of the currently selected option.
       *
       * Note: For SSR, set `[selected]` on the requested option and `displayText`
       * rather than setting `value` setting `value` will incur a DOM query.
       */
      get value() {
        return this[VALUE];
      }
      set value(value) {
        if (o7)
          return;
        this.lastUserSetValue = value;
        this.select(value);
      }
      get options() {
        return this.menu?.items ?? [];
      }
      /**
       * The index of the currently selected option.
       *
       * Note: For SSR, set `[selected]` on the requested option and `displayText`
       * rather than setting `selectedIndex` setting `selectedIndex` will incur a
       * DOM query.
       */
      get selectedIndex() {
        const [_option, index] = (this.getSelectedOptions() ?? [])[0] ?? [];
        return index ?? -1;
      }
      set selectedIndex(index) {
        this.lastUserSetSelectedIndex = index;
        this.selectIndex(index);
      }
      /**
       * Returns an array of selected options.
       *
       * NOTE: md-select only supports single selection.
       */
      get selectedOptions() {
        return (this.getSelectedOptions() ?? []).map(([option]) => option);
      }
      get hasError() {
        return this.error || this.nativeError;
      }
      constructor() {
        super();
        this.quick = false;
        this.required = false;
        this.errorText = "";
        this.label = "";
        this.noAsterisk = false;
        this.supportingText = "";
        this.error = false;
        this.menuPositioning = "popover";
        this.clampMenuWidth = false;
        this.typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;
        this.hasLeadingIcon = false;
        this.displayText = "";
        this.menuAlign = "start";
        this[_a] = "";
        this.lastUserSetValue = null;
        this.lastUserSetSelectedIndex = null;
        this.lastSelectedOption = null;
        this.lastSelectedOptionRecords = [];
        this.nativeError = false;
        this.nativeErrorText = "";
        this.focused = false;
        this.open = false;
        this.defaultFocus = FocusState.NONE;
        this.prevOpen = this.open;
        this.selectWidth = 0;
        if (o7) {
          return;
        }
        this.addEventListener("focus", this.handleFocus.bind(this));
        this.addEventListener("blur", this.handleBlur.bind(this));
      }
      /**
       * Selects an option given the value of the option, and updates MdSelect's
       * value.
       */
      select(value) {
        const optionToSelect = this.options.find((option) => option.value === value);
        if (optionToSelect) {
          this.selectItem(optionToSelect);
        }
      }
      /**
       * Selects an option given the index of the option, and updates MdSelect's
       * value.
       */
      selectIndex(index) {
        const optionToSelect = this.options[index];
        if (optionToSelect) {
          this.selectItem(optionToSelect);
        }
      }
      /**
       * Reset the select to its default value.
       */
      reset() {
        for (const option of this.options) {
          option.selected = option.hasAttribute("selected");
        }
        this.updateValueAndDisplayText();
        this.nativeError = false;
        this.nativeErrorText = "";
      }
      /** Shows the picker. If it's already open, this is a no-op. */
      showPicker() {
        this.open = true;
      }
      [(_a = VALUE, onReportValidity)](invalidEvent) {
        invalidEvent?.preventDefault();
        const prevMessage = this.getErrorText();
        this.nativeError = !!invalidEvent;
        this.nativeErrorText = this.validationMessage;
        if (prevMessage === this.getErrorText()) {
          this.field?.reannounceError();
        }
      }
      update(changed) {
        if (!this.hasUpdated) {
          this.initUserSelection();
        }
        if (this.prevOpen !== this.open && this.open) {
          const selectRect = this.getBoundingClientRect();
          this.selectWidth = selectRect.width;
        }
        this.prevOpen = this.open;
        super.update(changed);
      }
      render() {
        return b2`
      <span
        class="select ${e8(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `;
      }
      async firstUpdated(changed) {
        await this.menu?.updateComplete;
        if (!this.lastSelectedOptionRecords.length) {
          this.initUserSelection();
        }
        if (!this.lastSelectedOptionRecords.length && !o7 && !this.options.length) {
          setTimeout(() => {
            this.updateValueAndDisplayText();
          });
        }
        super.firstUpdated(changed);
      }
      getRenderClasses() {
        return {
          "disabled": this.disabled,
          "error": this.error,
          "open": this.open
        };
      }
      renderField() {
        const ariaLabel = this.ariaLabel || this.label;
        return u3`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled ? "-1" : "0"}
          aria-label=${ariaLabel || A}
          aria-describedby="description"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`;
      }
      renderFieldContent() {
        return [
          this.renderLeadingIcon(),
          this.renderLabel(),
          this.renderTrailingIcon()
        ];
      }
      renderLeadingIcon() {
        return b2`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
      }
      renderTrailingIcon() {
        return b2`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `;
      }
      renderLabel() {
        return b2`<div id="label">${this.displayText || b2`&nbsp;`}</div>`;
      }
      renderMenu() {
        const ariaLabel = this.label || this.ariaLabel;
        return b2`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${ariaLabel || A}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${o9({
          "--__menu-min-width": `${this.selectWidth}px`,
          "--__menu-max-width": this.clampMenuWidth ? `${this.selectWidth}px` : void 0
        })}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign === "start" ? "end-start" : "end-end"}
        .menuCorner=${this.menuAlign === "start" ? "start-start" : "start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`;
      }
      renderMenuContent() {
        return b2`<slot></slot>`;
      }
      /**
       * Handles opening the select on keydown and typahead selection when the menu
       * is closed.
       */
      handleKeydown(event) {
        if (this.open || this.disabled || !this.menu) {
          return;
        }
        const typeaheadController = this.menu.typeaheadController;
        const isOpenKey = event.code === "Space" || event.code === "ArrowDown" || event.code === "ArrowUp" || event.code === "End" || event.code === "Home" || event.code === "Enter";
        if (!typeaheadController.isTypingAhead && isOpenKey) {
          event.preventDefault();
          this.open = true;
          switch (event.code) {
            case "Space":
            case "ArrowDown":
            case "Enter":
              this.defaultFocus = FocusState.NONE;
              break;
            case "End":
              this.defaultFocus = FocusState.LAST_ITEM;
              break;
            case "ArrowUp":
            case "Home":
              this.defaultFocus = FocusState.FIRST_ITEM;
              break;
            default:
              break;
          }
          return;
        }
        const isPrintableKey = event.key.length === 1;
        if (isPrintableKey) {
          typeaheadController.onKeydown(event);
          event.preventDefault();
          const { lastActiveRecord } = typeaheadController;
          if (!lastActiveRecord) {
            return;
          }
          this.labelEl?.setAttribute?.("aria-live", "polite");
          const hasChanged = this.selectItem(lastActiveRecord[TYPEAHEAD_RECORD.ITEM]);
          if (hasChanged) {
            this.dispatchInteractionEvents();
          }
        }
      }
      handleClick() {
        this.open = !this.open;
      }
      handleFocus() {
        this.focused = true;
      }
      handleBlur() {
        this.focused = false;
      }
      /**
       * Handles closing the menu when the focus leaves the select's subtree.
       */
      handleFocusout(event) {
        if (event.relatedTarget && isElementInSubtree(event.relatedTarget, this)) {
          return;
        }
        this.open = false;
      }
      /**
       * Gets a list of all selected select options as a list item record array.
       *
       * @return An array of selected list option records.
       */
      getSelectedOptions() {
        if (!this.menu) {
          this.lastSelectedOptionRecords = [];
          return null;
        }
        const items = this.menu.items;
        this.lastSelectedOptionRecords = getSelectedItems(items);
        return this.lastSelectedOptionRecords;
      }
      async getUpdateComplete() {
        await this.menu?.updateComplete;
        return super.getUpdateComplete();
      }
      /**
       * Gets the selected options from the DOM, and updates the value and display
       * text to the first selected option's value and headline respectively.
       *
       * @return Whether or not the selected option has changed since last update.
       */
      updateValueAndDisplayText() {
        const selectedOptions = this.getSelectedOptions() ?? [];
        let hasSelectedOptionChanged = false;
        if (selectedOptions.length) {
          const [firstSelectedOption] = selectedOptions[0];
          hasSelectedOptionChanged = this.lastSelectedOption !== firstSelectedOption;
          this.lastSelectedOption = firstSelectedOption;
          this[VALUE] = firstSelectedOption.value;
          this.displayText = firstSelectedOption.displayText;
        } else {
          hasSelectedOptionChanged = this.lastSelectedOption !== null;
          this.lastSelectedOption = null;
          this[VALUE] = "";
          this.displayText = "";
        }
        return hasSelectedOptionChanged;
      }
      /**
       * Focuses and activates the last selected item upon opening, and resets other
       * active items.
       */
      async handleOpening(e9) {
        this.labelEl?.removeAttribute?.("aria-live");
        this.redispatchEvent(e9);
        if (this.defaultFocus !== FocusState.NONE) {
          return;
        }
        const items = this.menu.items;
        const activeItem = getActiveItem(items)?.item;
        let [selectedItem] = this.lastSelectedOptionRecords[0] ?? [null];
        if (activeItem && activeItem !== selectedItem) {
          activeItem.tabIndex = -1;
        }
        selectedItem = selectedItem ?? items[0];
        if (selectedItem) {
          selectedItem.tabIndex = 0;
          selectedItem.focus();
        }
      }
      redispatchEvent(e9) {
        redispatchEvent(this, e9);
      }
      handleClosed(e9) {
        this.open = false;
        this.redispatchEvent(e9);
      }
      /**
       * Determines the reason for closing, and updates the UI accordingly.
       */
      handleCloseMenu(event) {
        const reason = event.detail.reason;
        const item = event.detail.itemPath[0];
        this.open = false;
        let hasChanged = false;
        if (reason.kind === "click-selection") {
          hasChanged = this.selectItem(item);
        } else if (reason.kind === "keydown" && isSelectableKey(reason.key)) {
          hasChanged = this.selectItem(item);
        } else {
          item.tabIndex = -1;
          item.blur();
        }
        if (hasChanged) {
          this.dispatchInteractionEvents();
        }
      }
      /**
       * Selects a given option, deselects other options, and updates the UI.
       *
       * @return Whether the last selected option has changed.
       */
      selectItem(item) {
        const selectedOptions = this.getSelectedOptions() ?? [];
        selectedOptions.forEach(([option]) => {
          if (item !== option) {
            option.selected = false;
            option.tabIndex = -1;
          }
        });
        item.selected = true;
        item.tabIndex = 0;
        return this.updateValueAndDisplayText();
      }
      /**
       * Handles updating selection when an option element requests selection via
       * property / attribute change.
       */
      handleRequestSelection(event) {
        const requestingOptionEl = event.target;
        if (this.lastSelectedOptionRecords.some(([option]) => option === requestingOptionEl)) {
          return;
        }
        this.selectItem(requestingOptionEl);
      }
      /**
       * Handles updating selection when an option element requests deselection via
       * property / attribute change.
       */
      handleRequestDeselection(event) {
        const requestingOptionEl = event.target;
        if (!this.lastSelectedOptionRecords.some(([option]) => option === requestingOptionEl)) {
          return;
        }
        this.updateValueAndDisplayText();
      }
      /**
       * Attempts to initialize the selected option from user-settable values like
       * SSR, setting `value`, or `selectedIndex` at startup.
       */
      initUserSelection() {
        if (this.lastUserSetValue && !this.lastSelectedOptionRecords.length) {
          this.select(this.lastUserSetValue);
        } else if (this.lastUserSetSelectedIndex !== null && !this.lastSelectedOptionRecords.length) {
          this.selectIndex(this.lastUserSetSelectedIndex);
        } else {
          this.updateValueAndDisplayText();
        }
      }
      handleIconChange() {
        this.hasLeadingIcon = this.leadingIcons.length > 0;
      }
      /**
       * Dispatches the `input` and `change` events.
       */
      dispatchInteractionEvents() {
        this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        this.dispatchEvent(new Event("change", { bubbles: true }));
      }
      getErrorText() {
        return this.error ? this.errorText : this.nativeErrorText;
      }
      [getFormValue]() {
        return this.value;
      }
      formResetCallback() {
        this.reset();
      }
      formStateRestoreCallback(state) {
        this.value = state;
      }
      click() {
        this.field?.click();
      }
      [createValidator]() {
        return new SelectValidator(() => this);
      }
      [getValidityAnchor]() {
        return this.field;
      }
    };
    Select.shadowRootOptions = {
      ...i4.shadowRootOptions,
      delegatesFocus: true
    };
    __decorate([
      n3({ type: Boolean })
    ], Select.prototype, "quick", void 0);
    __decorate([
      n3({ type: Boolean })
    ], Select.prototype, "required", void 0);
    __decorate([
      n3({ type: String, attribute: "error-text" })
    ], Select.prototype, "errorText", void 0);
    __decorate([
      n3()
    ], Select.prototype, "label", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "no-asterisk" })
    ], Select.prototype, "noAsterisk", void 0);
    __decorate([
      n3({ type: String, attribute: "supporting-text" })
    ], Select.prototype, "supportingText", void 0);
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], Select.prototype, "error", void 0);
    __decorate([
      n3({ attribute: "menu-positioning" })
    ], Select.prototype, "menuPositioning", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "clamp-menu-width" })
    ], Select.prototype, "clampMenuWidth", void 0);
    __decorate([
      n3({ type: Number, attribute: "typeahead-delay" })
    ], Select.prototype, "typeaheadDelay", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "has-leading-icon" })
    ], Select.prototype, "hasLeadingIcon", void 0);
    __decorate([
      n3({ attribute: "display-text" })
    ], Select.prototype, "displayText", void 0);
    __decorate([
      n3({ attribute: "menu-align" })
    ], Select.prototype, "menuAlign", void 0);
    __decorate([
      n3()
    ], Select.prototype, "value", null);
    __decorate([
      n3({ type: Number, attribute: "selected-index" })
    ], Select.prototype, "selectedIndex", null);
    __decorate([
      r4()
    ], Select.prototype, "nativeError", void 0);
    __decorate([
      r4()
    ], Select.prototype, "nativeErrorText", void 0);
    __decorate([
      r4()
    ], Select.prototype, "focused", void 0);
    __decorate([
      r4()
    ], Select.prototype, "open", void 0);
    __decorate([
      r4()
    ], Select.prototype, "defaultFocus", void 0);
    __decorate([
      e4(".field")
    ], Select.prototype, "field", void 0);
    __decorate([
      e4("md-menu")
    ], Select.prototype, "menu", void 0);
    __decorate([
      e4("#label")
    ], Select.prototype, "labelEl", void 0);
    __decorate([
      o4({ slot: "leading-icon", flatten: true })
    ], Select.prototype, "leadingIcons", void 0);
  }
});

// node_modules/@material/web/select/internal/outlined-select.js
var OutlinedSelect;
var init_outlined_select = __esm({
  "node_modules/@material/web/select/internal/outlined-select.js"() {
    init_outlined_field2();
    init_static_html();
    init_select();
    OutlinedSelect = class extends Select {
      constructor() {
        super(...arguments);
        this.fieldTag = i6`md-outlined-field`;
      }
    };
  }
});

// node_modules/@material/web/select/internal/outlined-select-styles.cssresult.js
var styles6, outlined_select_styles_cssresult_default;
var init_outlined_select_styles_cssresult = __esm({
  "node_modules/@material/web/select/internal/outlined-select-styles.cssresult.js"() {
    init_lit();
    styles6 = i`:host{--_text-field-disabled-input-text-color: var(--md-outlined-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-outlined-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-outlined-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-outlined-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-outlined-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-outlined-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-outline-color: var(--md-outlined-select-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-outline-opacity: var(--md-outlined-select-text-field-disabled-outline-opacity, 0.12);--_text-field-disabled-outline-width: var(--md-outlined-select-text-field-disabled-outline-width, 1px);--_text-field-disabled-supporting-text-color: var(--md-outlined-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-outlined-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-outlined-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-outlined-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-focus-input-text-color: var(--md-outlined-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-outlined-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-outlined-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-outline-color: var(--md-outlined-select-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-supporting-text-color: var(--md-outlined-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-outlined-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-input-text-color: var(--md-outlined-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-outlined-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-outlined-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-outline-color: var(--md-outlined-select-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-supporting-text-color: var(--md-outlined-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-outlined-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-outlined-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-outlined-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-outlined-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-outline-color: var(--md-outlined-select-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-supporting-text-color: var(--md-outlined-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-outlined-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-input-text-color: var(--md-outlined-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-outlined-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-outlined-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-outline-color: var(--md-outlined-select-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-outline-width: var(--md-outlined-select-text-field-focus-outline-width, 3px);--_text-field-focus-supporting-text-color: var(--md-outlined-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-outlined-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-input-text-color: var(--md-outlined-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-outlined-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-outlined-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-outline-color: var(--md-outlined-select-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-outline-width: var(--md-outlined-select-text-field-hover-outline-width, 1px);--_text-field-hover-supporting-text-color: var(--md-outlined-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-outlined-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-outlined-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-outlined-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-outlined-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-outlined-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-outlined-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-outlined-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-outlined-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-outlined-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-outlined-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-outlined-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-outlined-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-outlined-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-outlined-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-outlined-select-text-field-leading-icon-size, 24px);--_text-field-outline-color: var(--md-outlined-select-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_text-field-outline-width: var(--md-outlined-select-text-field-outline-width, 1px);--_text-field-supporting-text-color: var(--md-outlined-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-outlined-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-outlined-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-outlined-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-outlined-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-outlined-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-outlined-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-outlined-select-text-field-container-shape-start-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-outlined-select-text-field-container-shape-start-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-outlined-select-text-field-container-shape-end-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-start: var(--md-outlined-select-text-field-container-shape-end-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--md-outlined-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-outlined-field-content-color: var(--_text-field-input-text-color);--md-outlined-field-content-font: var(--_text-field-input-text-font);--md-outlined-field-content-line-height: var(--_text-field-input-text-line-height);--md-outlined-field-content-size: var(--_text-field-input-text-size);--md-outlined-field-content-weight: var(--_text-field-input-text-weight);--md-outlined-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_text-field-disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_text-field-disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_text-field-disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_text-field-error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_text-field-error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_text-field-error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_text-field-error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_text-field-focus-outline-color);--md-outlined-field-focus-outline-width: var(--_text-field-focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_text-field-hover-outline-color);--md-outlined-field-hover-outline-width: var(--_text-field-hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_text-field-label-text-color);--md-outlined-field-label-text-font: var(--_text-field-label-text-font);--md-outlined-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-outlined-field-label-text-size: var(--_text-field-label-text-size);--md-outlined-field-label-text-weight: var(--_text-field-label-text-weight);--md-outlined-field-leading-content-color: var(--_text-field-leading-icon-color);--md-outlined-field-outline-color: var(--_text-field-outline-color);--md-outlined-field-outline-width: var(--_text-field-outline-width);--md-outlined-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-outlined-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-outlined-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;
    outlined_select_styles_cssresult_default = styles6.styleSheet;
  }
});

// node_modules/@material/web/select/internal/shared-styles.cssresult.js
var styles7, shared_styles_cssresult_default2;
var init_shared_styles_cssresult2 = __esm({
  "node_modules/@material/web/select/internal/shared-styles.cssresult.js"() {
    init_lit();
    styles7 = i`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`;
    shared_styles_cssresult_default2 = styles7.styleSheet;
  }
});

// node_modules/@material/web/select/outlined-select.js
var MdOutlinedSelect;
var init_outlined_select2 = __esm({
  "node_modules/@material/web/select/outlined-select.js"() {
    init_tslib_es6();
    init_decorators();
    init_outlined_select();
    init_outlined_select_styles_cssresult();
    init_shared_styles_cssresult2();
    MdOutlinedSelect = class MdOutlinedSelect2 extends OutlinedSelect {
    };
    MdOutlinedSelect.styles = [styles7, styles6];
    MdOutlinedSelect = __decorate([
      t("md-outlined-select")
    ], MdOutlinedSelect);
  }
});

// node_modules/@material/web/menu/internal/menuitem/menu-item-styles.cssresult.js
var styles8, menu_item_styles_cssresult_default;
var init_menu_item_styles_cssresult = __esm({
  "node_modules/@material/web/menu/internal/menuitem/menu-item-styles.cssresult.js"() {
    init_lit();
    styles8 = i`:host{display:flex;gap:16px;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`;
    menu_item_styles_cssresult_default = styles8.styleSheet;
  }
});

// node_modules/@material/web/labs/item/internal/item.js
function slotHasContent(slot) {
  for (const node of slot.assignedNodes({ flatten: true })) {
    const isElement = node.nodeType === Node.ELEMENT_NODE;
    const isTextWithContent = node.nodeType === Node.TEXT_NODE && node.textContent?.match(/\S/);
    if (isElement || isTextWithContent) {
      return true;
    }
  }
  return false;
}
var Item;
var init_item = __esm({
  "node_modules/@material/web/labs/item/internal/item.js"() {
    init_tslib_es6();
    init_lit();
    init_decorators();
    Item = class extends i4 {
      constructor() {
        super(...arguments);
        this.multiline = false;
      }
      render() {
        return b2`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `;
      }
      handleTextSlotChange() {
        let isMultiline = false;
        let slotsWithContent = 0;
        for (const slot of this.textSlots) {
          if (slotHasContent(slot)) {
            slotsWithContent += 1;
          }
          if (slotsWithContent > 1) {
            isMultiline = true;
            break;
          }
        }
        this.multiline = isMultiline;
      }
    };
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], Item.prototype, "multiline", void 0);
    __decorate([
      r5(".text slot")
    ], Item.prototype, "textSlots", void 0);
  }
});

// node_modules/@material/web/labs/item/internal/item-styles.cssresult.js
var styles9, item_styles_cssresult_default;
var init_item_styles_cssresult = __esm({
  "node_modules/@material/web/labs/item/internal/item-styles.cssresult.js"() {
    init_lit();
    styles9 = i`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;
    item_styles_cssresult_default = styles9.styleSheet;
  }
});

// node_modules/@material/web/labs/item/item.js
var MdItem;
var init_item2 = __esm({
  "node_modules/@material/web/labs/item/item.js"() {
    init_tslib_es6();
    init_decorators();
    init_item();
    init_item_styles_cssresult();
    MdItem = class MdItem2 extends Item {
    };
    MdItem.styles = [styles9];
    MdItem = __decorate([
      t("md-item")
    ], MdItem);
  }
});

// node_modules/@material/web/ripple/internal/ripple.js
var PRESS_GROW_MS, MINIMUM_PRESS_MS, INITIAL_ORIGIN_SCALE, PADDING, SOFT_EDGE_MINIMUM_SIZE, SOFT_EDGE_CONTAINER_RATIO, PRESS_PSEUDO, ANIMATION_FILL, State, EVENTS2, TOUCH_DELAY_MS, FORCED_COLORS, Ripple;
var init_ripple = __esm({
  "node_modules/@material/web/ripple/internal/ripple.js"() {
    init_tslib_es6();
    init_lit();
    init_decorators();
    init_class_map2();
    init_attachable_controller();
    init_animation();
    PRESS_GROW_MS = 450;
    MINIMUM_PRESS_MS = 225;
    INITIAL_ORIGIN_SCALE = 0.2;
    PADDING = 10;
    SOFT_EDGE_MINIMUM_SIZE = 75;
    SOFT_EDGE_CONTAINER_RATIO = 0.35;
    PRESS_PSEUDO = "::after";
    ANIMATION_FILL = "forwards";
    (function(State2) {
      State2[State2["INACTIVE"] = 0] = "INACTIVE";
      State2[State2["TOUCH_DELAY"] = 1] = "TOUCH_DELAY";
      State2[State2["HOLDING"] = 2] = "HOLDING";
      State2[State2["WAITING_FOR_CLICK"] = 3] = "WAITING_FOR_CLICK";
    })(State || (State = {}));
    EVENTS2 = [
      "click",
      "contextmenu",
      "pointercancel",
      "pointerdown",
      "pointerenter",
      "pointerleave",
      "pointerup"
    ];
    TOUCH_DELAY_MS = 150;
    FORCED_COLORS = o7 ? null : window.matchMedia("(forced-colors: active)");
    Ripple = class extends i4 {
      constructor() {
        super(...arguments);
        this.disabled = false;
        this.hovered = false;
        this.pressed = false;
        this.rippleSize = "";
        this.rippleScale = "";
        this.initialSize = 0;
        this.state = State.INACTIVE;
        this.attachableController = new AttachableController(this, this.onControlChange.bind(this));
      }
      get htmlFor() {
        return this.attachableController.htmlFor;
      }
      set htmlFor(htmlFor) {
        this.attachableController.htmlFor = htmlFor;
      }
      get control() {
        return this.attachableController.control;
      }
      set control(control) {
        this.attachableController.control = control;
      }
      attach(control) {
        this.attachableController.attach(control);
      }
      detach() {
        this.attachableController.detach();
      }
      connectedCallback() {
        super.connectedCallback();
        this.setAttribute("aria-hidden", "true");
      }
      render() {
        const classes = {
          "hovered": this.hovered,
          "pressed": this.pressed
        };
        return b2`<div class="surface ${e8(classes)}"></div>`;
      }
      update(changedProps) {
        if (changedProps.has("disabled") && this.disabled) {
          this.hovered = false;
          this.pressed = false;
        }
        super.update(changedProps);
      }
      /**
       * TODO(b/269799771): make private
       * @private only public for slider
       */
      handlePointerenter(event) {
        if (!this.shouldReactToEvent(event)) {
          return;
        }
        this.hovered = true;
      }
      /**
       * TODO(b/269799771): make private
       * @private only public for slider
       */
      handlePointerleave(event) {
        if (!this.shouldReactToEvent(event)) {
          return;
        }
        this.hovered = false;
        if (this.state !== State.INACTIVE) {
          this.endPressAnimation();
        }
      }
      handlePointerup(event) {
        if (!this.shouldReactToEvent(event)) {
          return;
        }
        if (this.state === State.HOLDING) {
          this.state = State.WAITING_FOR_CLICK;
          return;
        }
        if (this.state === State.TOUCH_DELAY) {
          this.state = State.WAITING_FOR_CLICK;
          this.startPressAnimation(this.rippleStartEvent);
          return;
        }
      }
      async handlePointerdown(event) {
        if (!this.shouldReactToEvent(event)) {
          return;
        }
        this.rippleStartEvent = event;
        if (!this.isTouch(event)) {
          this.state = State.WAITING_FOR_CLICK;
          this.startPressAnimation(event);
          return;
        }
        this.state = State.TOUCH_DELAY;
        await new Promise((resolve) => {
          setTimeout(resolve, TOUCH_DELAY_MS);
        });
        if (this.state !== State.TOUCH_DELAY) {
          return;
        }
        this.state = State.HOLDING;
        this.startPressAnimation(event);
      }
      handleClick() {
        if (this.disabled) {
          return;
        }
        if (this.state === State.WAITING_FOR_CLICK) {
          this.endPressAnimation();
          return;
        }
        if (this.state === State.INACTIVE) {
          this.startPressAnimation();
          this.endPressAnimation();
        }
      }
      handlePointercancel(event) {
        if (!this.shouldReactToEvent(event)) {
          return;
        }
        this.endPressAnimation();
      }
      handleContextmenu() {
        if (this.disabled) {
          return;
        }
        this.endPressAnimation();
      }
      determineRippleSize() {
        const { height, width } = this.getBoundingClientRect();
        const maxDim = Math.max(height, width);
        const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);
        const zoom = this.currentCSSZoom ?? 1;
        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE / zoom);
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
        const maxRadius = hypotenuse + PADDING;
        this.initialSize = initialSize;
        const maybeZoomedScale = (maxRadius + softEdgeSize) / initialSize;
        this.rippleScale = `${maybeZoomedScale / zoom}`;
        this.rippleSize = `${initialSize}px`;
      }
      getNormalizedPointerEventCoords(pointerEvent) {
        const { scrollX, scrollY } = window;
        const { left, top } = this.getBoundingClientRect();
        const documentX = scrollX + left;
        const documentY = scrollY + top;
        const { pageX, pageY } = pointerEvent;
        const zoom = this.currentCSSZoom ?? 1;
        return {
          x: (pageX - documentX) / zoom,
          y: (pageY - documentY) / zoom
        };
      }
      getTranslationCoordinates(positionEvent) {
        const { height, width } = this.getBoundingClientRect();
        const zoom = this.currentCSSZoom ?? 1;
        const endPoint = {
          x: (width / zoom - this.initialSize) / 2,
          y: (height / zoom - this.initialSize) / 2
        };
        let startPoint;
        if (positionEvent instanceof PointerEvent) {
          startPoint = this.getNormalizedPointerEventCoords(positionEvent);
        } else {
          startPoint = {
            x: width / zoom / 2,
            y: height / zoom / 2
          };
        }
        startPoint = {
          x: startPoint.x - this.initialSize / 2,
          y: startPoint.y - this.initialSize / 2
        };
        return { startPoint, endPoint };
      }
      startPressAnimation(positionEvent) {
        if (!this.mdRoot) {
          return;
        }
        this.pressed = true;
        this.growAnimation?.cancel();
        this.determineRippleSize();
        const { startPoint, endPoint } = this.getTranslationCoordinates(positionEvent);
        const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
        const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
        this.growAnimation = this.mdRoot.animate({
          top: [0, 0],
          left: [0, 0],
          height: [this.rippleSize, this.rippleSize],
          width: [this.rippleSize, this.rippleSize],
          transform: [
            `translate(${translateStart}) scale(1)`,
            `translate(${translateEnd}) scale(${this.rippleScale})`
          ]
        }, {
          pseudoElement: PRESS_PSEUDO,
          duration: PRESS_GROW_MS,
          easing: EASING.STANDARD,
          fill: ANIMATION_FILL
        });
      }
      async endPressAnimation() {
        this.rippleStartEvent = void 0;
        this.state = State.INACTIVE;
        const animation = this.growAnimation;
        let pressAnimationPlayState = Infinity;
        if (typeof animation?.currentTime === "number") {
          pressAnimationPlayState = animation.currentTime;
        } else if (animation?.currentTime) {
          pressAnimationPlayState = animation.currentTime.to("ms").value;
        }
        if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
          this.pressed = false;
          return;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
        });
        if (this.growAnimation !== animation) {
          return;
        }
        this.pressed = false;
      }
      /**
       * Returns `true` if
       *  - the ripple element is enabled
       *  - the pointer is primary for the input type
       *  - the pointer is the pointer that started the interaction, or will start
       * the interaction
       *  - the pointer is a touch, or the pointer state has the primary button
       * held, or the pointer is hovering
       */
      shouldReactToEvent(event) {
        if (this.disabled || !event.isPrimary) {
          return false;
        }
        if (this.rippleStartEvent && this.rippleStartEvent.pointerId !== event.pointerId) {
          return false;
        }
        if (event.type === "pointerenter" || event.type === "pointerleave") {
          return !this.isTouch(event);
        }
        const isPrimaryButton = event.buttons === 1;
        return this.isTouch(event) || isPrimaryButton;
      }
      isTouch({ pointerType }) {
        return pointerType === "touch";
      }
      /** @private */
      async handleEvent(event) {
        if (FORCED_COLORS?.matches) {
          return;
        }
        switch (event.type) {
          case "click":
            this.handleClick();
            break;
          case "contextmenu":
            this.handleContextmenu();
            break;
          case "pointercancel":
            this.handlePointercancel(event);
            break;
          case "pointerdown":
            await this.handlePointerdown(event);
            break;
          case "pointerenter":
            this.handlePointerenter(event);
            break;
          case "pointerleave":
            this.handlePointerleave(event);
            break;
          case "pointerup":
            this.handlePointerup(event);
            break;
          default:
            break;
        }
      }
      onControlChange(prev, next) {
        if (o7)
          return;
        for (const event of EVENTS2) {
          prev?.removeEventListener(event, this);
          next?.addEventListener(event, this);
        }
      }
    };
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], Ripple.prototype, "disabled", void 0);
    __decorate([
      r4()
    ], Ripple.prototype, "hovered", void 0);
    __decorate([
      r4()
    ], Ripple.prototype, "pressed", void 0);
    __decorate([
      e4(".surface")
    ], Ripple.prototype, "mdRoot", void 0);
  }
});

// node_modules/@material/web/ripple/internal/ripple-styles.cssresult.js
var styles10, ripple_styles_cssresult_default;
var init_ripple_styles_cssresult = __esm({
  "node_modules/@material/web/ripple/internal/ripple-styles.cssresult.js"() {
    init_lit();
    styles10 = i`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
    ripple_styles_cssresult_default = styles10.styleSheet;
  }
});

// node_modules/@material/web/ripple/ripple.js
var MdRipple;
var init_ripple2 = __esm({
  "node_modules/@material/web/ripple/ripple.js"() {
    init_tslib_es6();
    init_decorators();
    init_ripple();
    init_ripple_styles_cssresult();
    MdRipple = class MdRipple2 extends Ripple {
    };
    MdRipple.styles = [styles10];
    MdRipple = __decorate([
      t("md-ripple")
    ], MdRipple);
  }
});

// node_modules/@material/web/menu/internal/controllers/menuItemController.js
var MenuItemController;
var init_menuItemController = __esm({
  "node_modules/@material/web/menu/internal/controllers/menuItemController.js"() {
    init_shared();
    MenuItemController = class {
      /**
       * @param host The MenuItem in which to attach this controller to.
       * @param config The object that configures this controller's behavior.
       */
      constructor(host, config) {
        this.host = host;
        this.internalTypeaheadText = null;
        this.onClick = () => {
          if (this.host.keepOpen)
            return;
          this.host.dispatchEvent(createDefaultCloseMenuEvent(this.host, {
            kind: CloseReason.CLICK_SELECTION
          }));
        };
        this.onKeydown = (event) => {
          if (this.host.href && event.code === "Enter") {
            const interactiveElement = this.getInteractiveElement();
            if (interactiveElement instanceof HTMLAnchorElement) {
              interactiveElement.click();
            }
          }
          if (event.defaultPrevented)
            return;
          const keyCode = event.code;
          if (this.host.keepOpen && keyCode !== "Escape")
            return;
          if (isClosableKey(keyCode)) {
            event.preventDefault();
            this.host.dispatchEvent(createDefaultCloseMenuEvent(this.host, {
              kind: CloseReason.KEYDOWN,
              key: keyCode
            }));
          }
        };
        this.getHeadlineElements = config.getHeadlineElements;
        this.getSupportingTextElements = config.getSupportingTextElements;
        this.getDefaultElements = config.getDefaultElements;
        this.getInteractiveElement = config.getInteractiveElement;
        this.host.addController(this);
      }
      /**
       * The text that is selectable via typeahead. If not set, defaults to the
       * innerText of the item slotted into the `"headline"` slot, and if there are
       * no slotted elements into headline, then it checks the _default_ slot, and
       * then the `"supporting-text"` slot if nothing is in _default_.
       */
      get typeaheadText() {
        if (this.internalTypeaheadText !== null) {
          return this.internalTypeaheadText;
        }
        const headlineElements = this.getHeadlineElements();
        const textParts = [];
        headlineElements.forEach((headlineElement) => {
          if (headlineElement.textContent && headlineElement.textContent.trim()) {
            textParts.push(headlineElement.textContent.trim());
          }
        });
        if (textParts.length === 0) {
          this.getDefaultElements().forEach((defaultElement) => {
            if (defaultElement.textContent && defaultElement.textContent.trim()) {
              textParts.push(defaultElement.textContent.trim());
            }
          });
        }
        if (textParts.length === 0) {
          this.getSupportingTextElements().forEach((supportingTextElement) => {
            if (supportingTextElement.textContent && supportingTextElement.textContent.trim()) {
              textParts.push(supportingTextElement.textContent.trim());
            }
          });
        }
        return textParts.join(" ");
      }
      /**
       * The recommended tag name to render as the list item.
       */
      get tagName() {
        const type = this.host.type;
        switch (type) {
          case "link":
            return "a";
          case "button":
            return "button";
          default:
          case "menuitem":
          case "option":
            return "li";
        }
      }
      /**
       * The recommended role of the menu item.
       */
      get role() {
        return this.host.type === "option" ? "option" : "menuitem";
      }
      hostConnected() {
        this.host.toggleAttribute("md-menu-item", true);
      }
      hostUpdate() {
        if (this.host.href) {
          this.host.type = "link";
        }
      }
      /**
       * Use to set the typeaheadText when it changes.
       */
      setTypeaheadText(text) {
        this.internalTypeaheadText = text;
      }
    };
  }
});

// node_modules/@material/web/select/internal/selectoption/selectOptionController.js
function createRequestSelectionEvent() {
  return new Event("request-selection", {
    bubbles: true,
    composed: true
  });
}
function createRequestDeselectionEvent() {
  return new Event("request-deselection", {
    bubbles: true,
    composed: true
  });
}
var SelectOptionController;
var init_selectOptionController = __esm({
  "node_modules/@material/web/select/internal/selectoption/selectOptionController.js"() {
    init_menuItemController();
    SelectOptionController = class {
      /**
       * The recommended role of the select option.
       */
      get role() {
        return this.menuItemController.role;
      }
      /**
       * The text that is selectable via typeahead. If not set, defaults to the
       * innerText of the item slotted into the `"headline"` slot, and if there are
       * no slotted elements into headline, then it checks the _default_ slot, and
       * then the `"supporting-text"` slot if nothing is in _default_.
       */
      get typeaheadText() {
        return this.menuItemController.typeaheadText;
      }
      setTypeaheadText(text) {
        this.menuItemController.setTypeaheadText(text);
      }
      /**
       * The text that is displayed in the select field when selected. If not set,
       * defaults to the textContent of the item slotted into the `"headline"` slot,
       * and if there are no slotted elements into headline, then it checks the
       * _default_ slot, and then the `"supporting-text"` slot if nothing is in
       * _default_.
       */
      get displayText() {
        if (this.internalDisplayText !== null) {
          return this.internalDisplayText;
        }
        return this.menuItemController.typeaheadText;
      }
      setDisplayText(text) {
        this.internalDisplayText = text;
      }
      /**
       * @param host The SelectOption in which to attach this controller to.
       * @param config The object that configures this controller's behavior.
       */
      constructor(host, config) {
        this.host = host;
        this.internalDisplayText = null;
        this.firstUpdate = true;
        this.onClick = () => {
          this.menuItemController.onClick();
        };
        this.onKeydown = (e9) => {
          this.menuItemController.onKeydown(e9);
        };
        this.lastSelected = this.host.selected;
        this.menuItemController = new MenuItemController(host, config);
        host.addController(this);
      }
      hostUpdate() {
        if (this.lastSelected !== this.host.selected) {
          this.host.ariaSelected = this.host.selected ? "true" : "false";
        }
      }
      hostUpdated() {
        if (this.lastSelected !== this.host.selected && !this.firstUpdate) {
          if (this.host.selected) {
            this.host.dispatchEvent(createRequestSelectionEvent());
          } else {
            this.host.dispatchEvent(createRequestDeselectionEvent());
          }
        }
        this.lastSelected = this.host.selected;
        this.firstUpdate = false;
      }
    };
  }
});

// node_modules/@material/web/select/internal/selectoption/select-option.js
var selectOptionBaseClass, SelectOptionEl;
var init_select_option = __esm({
  "node_modules/@material/web/select/internal/selectoption/select-option.js"() {
    init_tslib_es6();
    init_md_focus_ring();
    init_item2();
    init_ripple2();
    init_lit();
    init_decorators();
    init_class_map2();
    init_delegate();
    init_selectOptionController();
    selectOptionBaseClass = mixinDelegatesAria(i4);
    SelectOptionEl = class extends selectOptionBaseClass {
      constructor() {
        super(...arguments);
        this.disabled = false;
        this.isMenuItem = true;
        this.selected = false;
        this.value = "";
        this.type = "option";
        this.selectOptionController = new SelectOptionController(this, {
          getHeadlineElements: () => {
            return this.headlineElements;
          },
          getSupportingTextElements: () => {
            return this.supportingTextElements;
          },
          getDefaultElements: () => {
            return this.defaultElements;
          },
          getInteractiveElement: () => this.listItemRoot
        });
      }
      /**
       * The text that is selectable via typeahead. If not set, defaults to the
       * innerText of the item slotted into the `"headline"` slot.
       */
      get typeaheadText() {
        return this.selectOptionController.typeaheadText;
      }
      set typeaheadText(text) {
        this.selectOptionController.setTypeaheadText(text);
      }
      /**
       * The text that is displayed in the select field when selected. If not set,
       * defaults to the textContent of the item slotted into the `"headline"` slot.
       */
      get displayText() {
        return this.selectOptionController.displayText;
      }
      set displayText(text) {
        this.selectOptionController.setDisplayText(text);
      }
      render() {
        return this.renderListItem(b2`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
      }
      /**
       * Renders the root list item.
       *
       * @param content the child content of the list item.
       */
      renderListItem(content) {
        return b2`
      <li
        id="item"
        tabindex=${this.disabled ? -1 : 0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel || A}
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${e8(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${content}</li
      >
    `;
      }
      /**
       * Handles rendering of the ripple element.
       */
      renderRipple() {
        return b2` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
      }
      /**
       * Handles rendering of the focus ring.
       */
      renderFocusRing() {
        return b2` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
      }
      /**
       * Classes applied to the list item root.
       */
      getRenderClasses() {
        return {
          "disabled": this.disabled,
          "selected": this.selected
        };
      }
      /**
       * Handles rendering the headline and supporting text.
       */
      renderBody() {
        return b2`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
      }
      focus() {
        this.listItemRoot?.focus();
      }
    };
    SelectOptionEl.shadowRootOptions = {
      ...i4.shadowRootOptions,
      delegatesFocus: true
    };
    __decorate([
      n3({ type: Boolean, reflect: true })
    ], SelectOptionEl.prototype, "disabled", void 0);
    __decorate([
      n3({ type: Boolean, attribute: "md-menu-item", reflect: true })
    ], SelectOptionEl.prototype, "isMenuItem", void 0);
    __decorate([
      n3({ type: Boolean })
    ], SelectOptionEl.prototype, "selected", void 0);
    __decorate([
      n3()
    ], SelectOptionEl.prototype, "value", void 0);
    __decorate([
      e4(".list-item")
    ], SelectOptionEl.prototype, "listItemRoot", void 0);
    __decorate([
      o4({ slot: "headline" })
    ], SelectOptionEl.prototype, "headlineElements", void 0);
    __decorate([
      o4({ slot: "supporting-text" })
    ], SelectOptionEl.prototype, "supportingTextElements", void 0);
    __decorate([
      n4({ slot: "" })
    ], SelectOptionEl.prototype, "defaultElements", void 0);
    __decorate([
      n3({ attribute: "typeahead-text" })
    ], SelectOptionEl.prototype, "typeaheadText", null);
    __decorate([
      n3({ attribute: "display-text" })
    ], SelectOptionEl.prototype, "displayText", null);
  }
});

// node_modules/@material/web/select/select-option.js
var MdSelectOption;
var init_select_option2 = __esm({
  "node_modules/@material/web/select/select-option.js"() {
    init_tslib_es6();
    init_decorators();
    init_menu_item_styles_cssresult();
    init_select_option();
    MdSelectOption = class MdSelectOption2 extends SelectOptionEl {
    };
    MdSelectOption.styles = [styles8];
    MdSelectOption = __decorate([
      t("md-select-option")
    ], MdSelectOption);
  }
});

// entry.js
var require_entry = __commonJS({
  "entry.js"() {
    init_outlined_select2();
    init_select_option2();
  }
});
export default require_entry();
/*! Bundled license information:

@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/reactive-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@material/web/internal/motion/animation.js:
@material/web/field/internal/field.js:
@material/web/field/internal/outlined-field.js:
@material/web/field/outlined-field.js:
@material/web/focus/internal/focus-ring.js:
@material/web/focus/md-focus-ring.js:
@material/web/internal/events/redispatch-event.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/web/field/internal/outlined-styles.cssresult.js:
@material/web/field/internal/shared-styles.cssresult.js:
@material/web/elevation/internal/elevation-styles.cssresult.js:
@material/web/focus/internal/focus-ring-styles.cssresult.js:
@material/web/menu/internal/menu-styles.cssresult.js:
@material/web/select/internal/outlined-select-styles.cssresult.js:
@material/web/select/internal/shared-styles.cssresult.js:
@material/web/menu/internal/menuitem/menu-item-styles.cssresult.js:
@material/web/labs/item/internal/item-styles.cssresult.js:
@material/web/ripple/internal/ripple-styles.cssresult.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@material/web/elevation/internal/elevation.js:
@material/web/elevation/elevation.js:
@material/web/menu/menu.js:
@material/web/ripple/internal/ripple.js:
@material/web/ripple/ripple.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/web/internal/controller/attachable-controller.js:
@material/web/list/internal/list-navigation-helpers.js:
@material/web/list/internal/list-controller.js:
@material/web/menu/internal/controllers/shared.js:
@material/web/menu/internal/controllers/surfacePositionController.js:
@material/web/menu/internal/controllers/typeaheadController.js:
@material/web/menu/internal/menu.js:
@material/web/internal/aria/aria.js:
@material/web/internal/aria/delegate.js:
@material/web/labs/behaviors/element-internals.js:
@material/web/labs/behaviors/constraint-validation.js:
@material/web/labs/behaviors/form-associated.js:
@material/web/labs/behaviors/on-report-validity.js:
@material/web/labs/behaviors/validators/validator.js:
@material/web/labs/behaviors/validators/select-validator.js:
@material/web/select/internal/shared.js:
@material/web/select/internal/select.js:
@material/web/select/internal/outlined-select.js:
@material/web/select/outlined-select.js:
@material/web/labs/item/internal/item.js:
@material/web/labs/item/item.js:
@material/web/menu/internal/controllers/menuItemController.js:
@material/web/select/internal/selectoption/selectOptionController.js:
@material/web/select/internal/selectoption/select-option.js:
@material/web/select/select-option.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
