// node_modules/tslib/tslib.es6.mjs
function __decorate(decorators, target, key, desc) {
  var c5 = arguments.length, r7 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d3;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r7 = Reflect.decorate(decorators, target, key, desc);
  else for (var i8 = decorators.length - 1; i8 >= 0; i8--) if (d3 = decorators[i8]) r7 = (c5 < 3 ? d3(r7) : c5 > 3 ? d3(target, key, r7) : d3(target, key)) || r7;
  return c5 > 3 && r7 && Object.defineProperty(target, key, r7), r7;
}

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t = (t5) => (e9, o10) => {
  void 0 !== o10 ? o10.addInitializer(() => {
    customElements.define(t5, e9);
  }) : customElements.define(t5, e9);
};

// node_modules/@lit/reactive-element/css-tag.js
var t2 = globalThis;
var e = t2.ShadowRoot && (void 0 === t2.ShadyCSS || t2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
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
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var i = (t5, ...e9) => {
  const o10 = 1 === t5.length ? t5[0] : e9.reduce((e10, s4, o11) => e10 + ((t6) => {
    if (true === t6._$cssResult$) return t6.cssText;
    if ("number" == typeof t6) return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t5[o11 + 1], t5[0]);
  return new n(o10, t5, s);
};
var S = (s4, o10) => {
  if (e) s4.adoptedStyleSheets = o10.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else for (const e9 of o10) {
    const o11 = document.createElement("style"), n7 = t2.litNonce;
    void 0 !== n7 && o11.setAttribute("nonce", n7), o11.textContent = e9.cssText, s4.appendChild(o11);
  }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e9 = "";
  for (const s4 of t6.cssRules) e9 += s4.cssText;
  return r(e9);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s4) => t5;
var u = { toAttribute(t5, s4) {
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
var f = (t5, s4) => !i2(t5, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ??= []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t5, s4), !s4.noAccessor) {
      const i8 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t5, i8, s4);
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

// node_modules/@lit/reactive-element/decorators/property.js
var o3 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r3 = (t5 = o3, e9, r7) => {
  const { kind: n7, metadata: i8 } = r7;
  let s4 = globalThis.litPropertyMetadata.get(i8);
  if (void 0 === s4 && globalThis.litPropertyMetadata.set(i8, s4 = /* @__PURE__ */ new Map()), "setter" === n7 && ((t5 = Object.create(t5)).wrapped = true), s4.set(r7.name, t5), "accessor" === n7) {
    const { name: o10 } = r7;
    return { set(r8) {
      const n8 = e9.get.call(this);
      e9.set.call(this, r8), this.requestUpdate(o10, n8, t5, true, r8);
    }, init(e10) {
      return void 0 !== e10 && this.C(o10, void 0, t5, e10), e10;
    } };
  }
  if ("setter" === n7) {
    const { name: o10 } = r7;
    return function(r8) {
      const n8 = this[o10];
      e9.call(this, r8), this.requestUpdate(o10, n8, t5, true, r8);
    };
  }
  throw Error("Unsupported decorator location: " + n7);
};
function n3(t5) {
  return (e9, o10) => "object" == typeof o10 ? r3(t5, e9, o10) : ((t6, e10, o11) => {
    const r7 = e10.hasOwnProperty(o11);
    return e10.constructor.createProperty(o11, t6), r7 ? Object.getOwnPropertyDescriptor(e10, o11) : void 0;
  })(t5, e9, o10);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r4(r7) {
  return n3({ ...r7, state: true, attribute: false });
}

// node_modules/@lit/reactive-element/decorators/base.js
var e3 = (e9, t5, c5) => (c5.configurable = true, c5.enumerable = true, Reflect.decorate && "object" != typeof t5 && Object.defineProperty(e9, t5, c5), c5);

// node_modules/@lit/reactive-element/decorators/query.js
function e4(e9, r7) {
  return (n7, s4, i8) => {
    const o10 = (t5) => t5.renderRoot?.querySelector(e9) ?? null;
    if (r7) {
      const { get: e10, set: r8 } = "object" == typeof s4 ? n7 : i8 ?? /* @__PURE__ */ (() => {
        const t5 = /* @__PURE__ */ Symbol();
        return { get() {
          return this[t5];
        }, set(e11) {
          this[t5] = e11;
        } };
      })();
      return e3(n7, s4, { get() {
        let t5 = e10.call(this);
        return void 0 === t5 && (t5 = o10(this), (null !== t5 || this.hasUpdated) && r8.call(this, t5)), t5;
      } });
    }
    return e3(n7, s4, { get() {
      return o10(this);
    } });
  };
}

// node_modules/@lit/reactive-element/decorators/query-all.js
var e5;
function r5(r7) {
  return (n7, o10) => e3(n7, o10, { get() {
    return (this.renderRoot ?? (e5 ??= document.createDocumentFragment())).querySelectorAll(r7);
  } });
}

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
function o4(o10) {
  return (e9, n7) => {
    const { slot: r7, selector: s4 } = o10 ?? {}, c5 = "slot" + (r7 ? `[name=${r7}]` : ":not([name])");
    return e3(e9, n7, { get() {
      const t5 = this.renderRoot?.querySelector(c5), e10 = t5?.assignedElements(o10) ?? [];
      return void 0 === s4 ? e10 : e10.filter((t6) => t6.matches(s4));
    } });
  };
}

// node_modules/lit-html/lit-html.js
var t3 = globalThis;
var i3 = (t5) => t5;
var s2 = t3.trustedTypes;
var e6 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var h2 = "$lit$";
var o5 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n4 = "?" + o5;
var r6 = `<${n4}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var u2 = Array.isArray;
var d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t5) => (i8, ...s4) => ({ _$litType$: t5, strings: i8, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t5, i8) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e6 ? e6.createHTML(i8) : i8;
}
var N = (t5, i8) => {
  const s4 = t5.length - 1, e9 = [];
  let n7, l4 = 2 === i8 ? "<svg>" : 3 === i8 ? "<math>" : "", c5 = v;
  for (let i9 = 0; i9 < s4; i9++) {
    const s5 = t5[i9];
    let a4, u4, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c5.lastIndex = f3, u4 = c5.exec(s5), null !== u4); ) f3 = c5.lastIndex, c5 === v ? "!--" === u4[1] ? c5 = _ : void 0 !== u4[1] ? c5 = m : void 0 !== u4[2] ? (y2.test(u4[2]) && (n7 = RegExp("</" + u4[2], "g")), c5 = p2) : void 0 !== u4[3] && (c5 = p2) : c5 === p2 ? ">" === u4[0] ? (c5 = n7 ?? v, d3 = -1) : void 0 === u4[1] ? d3 = -2 : (d3 = c5.lastIndex - u4[2].length, a4 = u4[1], c5 = void 0 === u4[3] ? p2 : '"' === u4[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n7 = void 0);
    const x2 = c5 === p2 && t5[i9 + 1].startsWith("/>") ? " " : "";
    l4 += c5 === v ? s5 + r6 : d3 >= 0 ? (e9.push(a4), s5.slice(0, d3) + h2 + s5.slice(d3) + o5 + x2) : s5 + o5 + (-2 === d3 ? i9 : x2);
  }
  return [V(t5, l4 + (t5[s4] || "<?>") + (2 === i8 ? "</svg>" : 3 === i8 ? "</math>" : "")), e9];
};
var S2 = class _S {
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
      } else if (8 === r7.nodeType) if (r7.data === n4) d3.push({ type: 2, index: l4 });
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
function M(t5, i8, s4 = t5, e9) {
  if (i8 === E) return i8;
  let h3 = void 0 !== e9 ? s4._$Co?.[e9] : s4._$Cl;
  const o10 = a2(i8) ? void 0 : i8._$litDirective$;
  return h3?.constructor !== o10 && (h3?._$AO?.(false), void 0 === o10 ? h3 = void 0 : (h3 = new o10(t5), h3._$AT(t5, s4, e9)), void 0 !== e9 ? (s4._$Co ??= [])[e9] = h3 : s4._$Cl = h3), void 0 !== h3 && (i8 = M(t5, h3._$AS(t5, i8.values), h3, e9)), i8;
}
var R = class {
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
    let h3 = P.nextNode(), o10 = 0, n7 = 0, r7 = s4[0];
    for (; void 0 !== r7; ) {
      if (o10 === r7.index) {
        let i9;
        2 === r7.type ? i9 = new k(h3, h3.nextSibling, this, t5) : 1 === r7.type ? i9 = new r7.ctor(h3, r7.name, r7.strings, this, t5) : 6 === r7.type && (i9 = new Z(h3, this, t5)), this._$AV.push(i9), r7 = s4[++n7];
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
var k = class _k {
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
var H = class {
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
      let n7, r7;
      for (t5 = h3[0], n7 = 0; n7 < h3.length - 1; n7++) r7 = M(this, e10[s4 + n7], i8, n7), r7 === E && (r7 = this._$AH[n7]), o10 ||= !a2(r7) || r7 !== this._$AH[n7], r7 === A ? t5 = A : t5 !== A && (t5 += (r7 ?? "") + h3[n7 + 1]), this._$AH[n7] = r7;
    }
    o10 && !e9 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
  }
};
var z = class extends H {
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
var Z = class {
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
var B = t3.litHtmlPolyfillSupport;
B?.(S2, k), (t3.litHtmlVersions ??= []).push("3.3.3");
var D = (t5, i8, s4) => {
  const e9 = s4?.renderBefore ?? i8;
  let h3 = e9._$litPart$;
  if (void 0 === h3) {
    const t6 = s4?.renderBefore ?? null;
    e9._$litPart$ = h3 = new k(i8.insertBefore(c3(), t6), t6, void 0, s4 ?? {});
  }
  return h3._$AI(t5), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
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
var o6 = s3.litElementPolyfillSupport;
o6?.({ LitElement: i4 });
(s3.litElementVersions ??= []).push("4.2.2");

// node_modules/lit-html/is-server.js
var o7 = false;

// node_modules/@material/web/elevation/internal/elevation.js
var Elevation = class extends i4 {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }
  render() {
    return b2`<span class="shadow"></span>`;
  }
};

// node_modules/@material/web/elevation/internal/elevation-styles.cssresult.js
var styles = i`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;
var elevation_styles_cssresult_default = styles.styleSheet;

// node_modules/@material/web/elevation/elevation.js
var MdElevation = class MdElevation2 extends Elevation {
};
MdElevation.styles = [styles];
MdElevation = __decorate([
  t("md-elevation")
], MdElevation);

// node_modules/@material/web/internal/controller/attachable-controller.js
var ATTACHABLE_CONTROLLER = /* @__PURE__ */ Symbol("attachableController");
var FOR_ATTRIBUTE_OBSERVER;
if (!o7) {
  FOR_ATTRIBUTE_OBSERVER = new MutationObserver((records) => {
    for (const record of records) {
      record.target[ATTACHABLE_CONTROLLER]?.hostConnected();
    }
  });
}
var AttachableController = class {
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

// node_modules/@material/web/focus/internal/focus-ring.js
var EVENTS = ["focusin", "focusout", "pointerdown"];
var FocusRing = class extends i4 {
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
var HANDLED_BY_FOCUS_RING = /* @__PURE__ */ Symbol("handledByFocusRing");

// node_modules/@material/web/focus/internal/focus-ring-styles.cssresult.js
var styles2 = i`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
var focus_ring_styles_cssresult_default = styles2.styleSheet;

// node_modules/@material/web/focus/md-focus-ring.js
var MdFocusRing = class MdFocusRing2 extends FocusRing {
};
MdFocusRing.styles = [styles2];
MdFocusRing = __decorate([
  t("md-focus-ring")
], MdFocusRing);

// node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e7 = (t5) => (...e9) => ({ _$litDirective$: t5, values: e9 });
var i5 = class {
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

// node_modules/lit-html/directives/class-map.js
var e8 = e7(class extends i5 {
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

// node_modules/@material/web/internal/motion/animation.js
var EASING = {
  STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
  STANDARD_ACCELERATE: "cubic-bezier(.3,0,1,1)",
  STANDARD_DECELERATE: "cubic-bezier(0,0,0,1)",
  EMPHASIZED: "cubic-bezier(.3,0,0,1)",
  EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)",
  EMPHASIZED_DECELERATE: "cubic-bezier(.05,.7,.1,1)"
};

// node_modules/@material/web/ripple/internal/ripple.js
var PRESS_GROW_MS = 450;
var MINIMUM_PRESS_MS = 225;
var INITIAL_ORIGIN_SCALE = 0.2;
var PADDING = 10;
var SOFT_EDGE_MINIMUM_SIZE = 75;
var SOFT_EDGE_CONTAINER_RATIO = 0.35;
var PRESS_PSEUDO = "::after";
var ANIMATION_FILL = "forwards";
var State;
(function(State2) {
  State2[State2["INACTIVE"] = 0] = "INACTIVE";
  State2[State2["TOUCH_DELAY"] = 1] = "TOUCH_DELAY";
  State2[State2["HOLDING"] = 2] = "HOLDING";
  State2[State2["WAITING_FOR_CLICK"] = 3] = "WAITING_FOR_CLICK";
})(State || (State = {}));
var EVENTS2 = [
  "click",
  "contextmenu",
  "pointercancel",
  "pointerdown",
  "pointerenter",
  "pointerleave",
  "pointerup"
];
var TOUCH_DELAY_MS = 150;
var FORCED_COLORS = o7 ? null : window.matchMedia("(forced-colors: active)");
var Ripple = class extends i4 {
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

// node_modules/@material/web/ripple/internal/ripple-styles.cssresult.js
var styles3 = i`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
var ripple_styles_cssresult_default = styles3.styleSheet;

// node_modules/@material/web/ripple/ripple.js
var MdRipple = class MdRipple2 extends Ripple {
};
MdRipple.styles = [styles3];
MdRipple = __decorate([
  t("md-ripple")
], MdRipple);

// node_modules/@material/web/internal/aria/aria.js
var ARIA_PROPERTIES = [
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
var ARIA_ATTRIBUTES = ARIA_PROPERTIES.map(ariaPropertyToAttribute);
function isAriaAttribute(attribute) {
  return ARIA_ATTRIBUTES.includes(attribute);
}
function ariaPropertyToAttribute(property) {
  return property.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}

// node_modules/@material/web/internal/aria/delegate.js
var privateIgnoreAttributeChangesFor = /* @__PURE__ */ Symbol("privateIgnoreAttributeChangesFor");
function mixinDelegatesAria(base) {
  var _a;
  if (o7) {
    return base;
  }
  class WithDelegatesAriaElement extends base {
    constructor() {
      super(...arguments);
      this[_a] = /* @__PURE__ */ new Set();
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
  _a = privateIgnoreAttributeChangesFor;
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

// node_modules/@material/web/internal/events/form-label-activation.js
function dispatchActivationClick(element) {
  const event = new MouseEvent("click", { bubbles: true });
  element.dispatchEvent(event);
  return event;
}
function isActivationClick(event) {
  if (event.currentTarget !== event.target) {
    return false;
  }
  if (event.composedPath()[0] !== event.target) {
    return false;
  }
  if (event.target.disabled) {
    return false;
  }
  return !squelchEvent(event);
}
function squelchEvent(event) {
  const squelched = isSquelchingEvents;
  if (squelched) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  squelchEventsForMicrotask();
  return squelched;
}
var isSquelchingEvents = false;
async function squelchEventsForMicrotask() {
  isSquelchingEvents = true;
  await null;
  isSquelchingEvents = false;
}

// node_modules/@material/web/labs/behaviors/element-internals.js
var internals = /* @__PURE__ */ Symbol("internals");
var privateInternals = /* @__PURE__ */ Symbol("privateInternals");
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

// node_modules/@material/web/labs/behaviors/form-associated.js
var getFormValue = /* @__PURE__ */ Symbol("getFormValue");
var getFormState = /* @__PURE__ */ Symbol("getFormState");
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

// node_modules/@material/web/internal/events/dispatch-hooks.js
var dispatchHooks = /* @__PURE__ */ Symbol("dispatchHooks");
function afterDispatch(event, callback) {
  const hooks = event[dispatchHooks];
  if (!hooks) {
    throw new Error(`'${event.type}' event needs setupDispatchHooks().`);
  }
  hooks.addEventListener("after", callback, { once: true });
}
var ELEMENT_DISPATCH_HOOK_TYPES = /* @__PURE__ */ new WeakMap();
function setupDispatchHooks(element, ...eventTypes) {
  let typesAlreadySetUp = ELEMENT_DISPATCH_HOOK_TYPES.get(element);
  if (!typesAlreadySetUp) {
    typesAlreadySetUp = /* @__PURE__ */ new Set();
    ELEMENT_DISPATCH_HOOK_TYPES.set(element, typesAlreadySetUp);
  }
  for (const eventType of eventTypes) {
    if (typesAlreadySetUp.has(eventType)) {
      continue;
    }
    element.addEventListener(eventType, (event) => {
      const hooks = new EventTarget();
      event[dispatchHooks] = hooks;
      const cleanupLastNodeListener = new AbortController();
      const callAfterDispatch = () => {
        cleanupLastNodeListener.abort();
        hooks.dispatchEvent(new Event("after"));
      };
      const patchStopPropagation = (superMethod) => {
        return function() {
          superMethod.call(this);
          callAfterDispatch();
        };
      };
      event.stopPropagation = patchStopPropagation(event.stopPropagation);
      event.stopImmediatePropagation = patchStopPropagation(event.stopImmediatePropagation);
      const composedPath = event.composedPath();
      let lastNodeForEvent;
      if (event.composed && event.bubbles) {
        lastNodeForEvent = composedPath[composedPath.length - 1];
      } else if (!event.bubbles) {
        lastNodeForEvent = composedPath[0];
      } else {
        lastNodeForEvent = composedPath[0].getRootNode();
      }
      lastNodeForEvent.addEventListener(eventType, () => {
        callAfterDispatch();
      }, { once: true, signal: cleanupLastNodeListener.signal });
    }, {
      // Ensure this listener runs before other listeners.
      // `setupDispatchHooks()` should be called in constructors to also
      // ensure they run before any other externally-added capture listeners.
      capture: true
    });
    typesAlreadySetUp.add(eventType);
  }
}

// node_modules/@material/web/labs/behaviors/form-submitter.js
function mixinFormSubmitter(base) {
  class FormSubmitterElement extends base {
    // Name attribute must reflect synchronously for form integration.
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(name) {
      this.setAttribute("name", name);
    }
    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...args) {
      super(...args);
      this.type = "submit";
      this.value = "";
      if (o7)
        return;
      setupDispatchHooks(this, "click");
      this.addEventListener("click", async (event) => {
        const isReset = this.type === "reset";
        const isSubmit = this.type === "submit";
        const elementInternals = this[internals];
        const { form } = elementInternals;
        if (!form || !(isSubmit || isReset)) {
          return;
        }
        afterDispatch(event, () => {
          if (event.defaultPrevented) {
            return;
          }
          if (isReset) {
            form.reset();
            return;
          }
          form.addEventListener("submit", (submitEvent) => {
            Object.defineProperty(submitEvent, "submitter", {
              configurable: true,
              enumerable: true,
              get: () => this
            });
          }, { capture: true, once: true });
          elementInternals.setFormValue(this.value);
          form.requestSubmit();
        });
      });
    }
  }
  __decorate([
    n3()
  ], FormSubmitterElement.prototype, "type", void 0);
  __decorate([
    n3({ reflect: true })
  ], FormSubmitterElement.prototype, "value", void 0);
  return FormSubmitterElement;
}

// node_modules/@material/web/button/internal/button.js
var buttonBaseClass = mixinDelegatesAria(mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(i4))));
var Button = class extends buttonBaseClass {
  constructor() {
    super();
    this.softDisabled = false;
    this.href = "";
    this.download = "";
    this.target = "";
    this.trailingIcon = false;
    this.hasIcon = false;
    if (!o7) {
      this.addEventListener("click", this.handleClick.bind(this));
    }
  }
  focus() {
    this.buttonElement?.focus();
  }
  blur() {
    this.buttonElement?.blur();
  }
  render() {
    const isRippleDisabled = this.disabled || this.softDisabled;
    const buttonOrLink = this.href ? this.renderLink() : this.renderButton();
    const buttonId = this.href ? "link" : "button";
    return b2`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${buttonId}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${buttonId}
        ?disabled="${isRippleDisabled}"></md-ripple>
      ${buttonOrLink}
    `;
  }
  renderButton() {
    const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
    return b2`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || A}
      aria-label="${ariaLabel || A}"
      aria-haspopup="${ariaHasPopup || A}"
      aria-expanded="${ariaExpanded || A}">
      ${this.renderContent()}
    </button>`;
  }
  renderLink() {
    const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
    return b2`<a
      id="link"
      class="button"
      aria-label="${ariaLabel || A}"
      aria-haspopup="${ariaHasPopup || A}"
      aria-expanded="${ariaExpanded || A}"
      aria-disabled=${this.disabled || this.softDisabled || A}
      tabindex="${this.disabled && !this.softDisabled ? -1 : A}"
      href=${this.href}
      download=${this.download || A}
      target=${this.target || A}
      >${this.renderContent()}
    </a>`;
  }
  renderContent() {
    const icon = b2`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
    return b2`
      <span class="touch"></span>
      ${this.trailingIcon ? A : icon}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? icon : A}
    `;
  }
  handleClick(event) {
    if (this.softDisabled || this.disabled && this.href) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }
    if (!isActivationClick(event) || !this.buttonElement) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.buttonElement);
  }
  handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
};
Button.shadowRootOptions = {
  mode: "open",
  delegatesFocus: true
};
__decorate([
  n3({ type: Boolean, attribute: "soft-disabled", reflect: true })
], Button.prototype, "softDisabled", void 0);
__decorate([
  n3()
], Button.prototype, "href", void 0);
__decorate([
  n3()
], Button.prototype, "download", void 0);
__decorate([
  n3()
], Button.prototype, "target", void 0);
__decorate([
  n3({ type: Boolean, attribute: "trailing-icon", reflect: true })
], Button.prototype, "trailingIcon", void 0);
__decorate([
  n3({ type: Boolean, attribute: "has-icon", reflect: true })
], Button.prototype, "hasIcon", void 0);
__decorate([
  e4(".button")
], Button.prototype, "buttonElement", void 0);
__decorate([
  o4({ slot: "icon", flatten: true })
], Button.prototype, "assignedIcons", void 0);

// node_modules/@material/web/button/internal/filled-button.js
var FilledButton = class extends Button {
  renderElevationOrOutline() {
    return b2`<md-elevation part="elevation"></md-elevation>`;
  }
};

// node_modules/@material/web/button/internal/filled-styles.cssresult.js
var styles4 = i`:host{--_container-color: var(--md-filled-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-elevation: var(--md-filled-button-container-elevation, 0);--_container-height: var(--md-filled-button-container-height, 40px);--_container-shadow-color: var(--md-filled-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-button-focus-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-container-elevation: var(--md-filled-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-button-hover-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-filled-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-button-pressed-label-text-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-color: var(--md-filled-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_container-shape-start-start: var(--md-filled-button-container-shape-start-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-button-container-shape-start-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-button-container-shape-end-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-button-container-shape-end-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-button-leading-space, 24px);--_trailing-space: var(--md-filled-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-button-with-trailing-icon-trailing-space, 16px)}
`;
var filled_styles_cssresult_default = styles4.styleSheet;

// node_modules/@material/web/button/internal/shared-elevation-styles.cssresult.js
var styles5 = i`md-elevation{transition-duration:280ms}:host(:is([disabled],[soft-disabled])) md-elevation{transition:none}md-elevation{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}:host(:focus-within) md-elevation{--md-elevation-level: var(--_focus-container-elevation)}:host(:hover) md-elevation{--md-elevation-level: var(--_hover-container-elevation)}:host(:active) md-elevation{--md-elevation-level: var(--_pressed-container-elevation)}:host(:is([disabled],[soft-disabled])) md-elevation{--md-elevation-level: var(--_disabled-container-elevation)}
`;
var shared_elevation_styles_cssresult_default = styles5.styleSheet;

// node_modules/@material/web/button/internal/shared-styles.cssresult.js
var styles6 = i`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:max(48px,100%);left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;
var shared_styles_cssresult_default = styles6.styleSheet;

// node_modules/@material/web/button/filled-button.js
var MdFilledButton = class MdFilledButton2 extends FilledButton {
};
MdFilledButton.styles = [
  styles6,
  styles5,
  styles4
];
MdFilledButton = __decorate([
  t("md-filled-button")
], MdFilledButton);

// node_modules/@material/web/icon/internal/icon.js
var Icon = class extends i4 {
  render() {
    return b2`<slot></slot>`;
  }
  connectedCallback() {
    super.connectedCallback();
    const ariaHidden = this.getAttribute("aria-hidden");
    if (ariaHidden === "false") {
      this.removeAttribute("aria-hidden");
      return;
    }
    this.setAttribute("aria-hidden", "true");
  }
};

// node_modules/@material/web/icon/internal/icon-styles.cssresult.js
var styles7 = i`:host{font-size:var(--md-icon-size, 24px);width:var(--md-icon-size, 24px);height:var(--md-icon-size, 24px);color:inherit;font-variation-settings:inherit;font-weight:400;font-family:var(--md-icon-font, Material Symbols Outlined);display:inline-flex;font-style:normal;place-items:center;place-content:center;line-height:1;overflow:hidden;letter-spacing:normal;text-transform:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale}::slotted(svg){fill:currentColor}::slotted(*){height:100%;width:100%}
`;
var icon_styles_cssresult_default = styles7.styleSheet;

// node_modules/@material/web/icon/icon.js
var MdIcon = class MdIcon2 extends Icon {
};
MdIcon.styles = [styles7];
MdIcon = __decorate([
  t("md-icon")
], MdIcon);

// node_modules/lit-html/static.js
var a3 = /* @__PURE__ */ Symbol.for("");
var o8 = (t5) => {
  if (t5?.r === a3) return t5?._$litStatic$;
};
var i6 = (t5, ...r7) => ({ _$litStatic$: r7.reduce((r8, e9, a4) => r8 + ((t6) => {
  if (void 0 !== t6._$litStatic$) return t6._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t6}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(e9) + t5[a4 + 1], t5[0]), r: a3 });
var l3 = /* @__PURE__ */ new Map();
var n5 = (t5) => (r7, ...e9) => {
  const a4 = e9.length;
  let s4, i8;
  const n7 = [], u4 = [];
  let c5, $3 = 0, f3 = false;
  for (; $3 < a4; ) {
    for (c5 = r7[$3]; $3 < a4 && void 0 !== (i8 = e9[$3], s4 = o8(i8)); ) c5 += s4 + r7[++$3], f3 = true;
    $3 !== a4 && u4.push(i8), n7.push(c5), $3++;
  }
  if ($3 === a4 && n7.push(r7[a4]), f3) {
    const t6 = n7.join("$$lit$$");
    void 0 === (r7 = l3.get(t6)) && (n7.raw = n7, l3.set(t6, r7 = n7)), e9 = u4;
  }
  return t5(r7, ...e9);
};
var u3 = n5(b2);
var c4 = n5(w);
var $2 = n5(T);

// node_modules/@material/web/internal/controller/is-rtl.js
function isRtl(el, shouldCheck = true) {
  return shouldCheck && getComputedStyle(el).getPropertyValue("direction").trim() === "rtl";
}

// node_modules/@material/web/iconbutton/internal/icon-button.js
var iconButtonBaseClass = mixinDelegatesAria(mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(i4))));
var IconButton = class extends iconButtonBaseClass {
  constructor() {
    super();
    this.softDisabled = false;
    this.flipIconInRtl = false;
    this.href = "";
    this.download = "";
    this.target = "";
    this.ariaLabelSelected = "";
    this.toggle = false;
    this.selected = false;
    this.flipIcon = isRtl(this, this.flipIconInRtl);
    if (o7)
      return;
    setupDispatchHooks(this, "click");
    this.addEventListener("click", (event) => {
      if (this.softDisabled || this.disabled && this.href) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      const wasSelected = this.selected;
      afterDispatch(event, () => {
        if (!this.toggle || this.disabled || event.defaultPrevented) {
          return;
        }
        this.selected = !wasSelected;
        this.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
        this.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }
  willUpdate() {
    if (this.href) {
      this.disabled = false;
      this.softDisabled = false;
    }
  }
  render() {
    const tag = this.href ? i6`div` : i6`button`;
    const { ariaLabel, ariaHasPopup, ariaExpanded } = this;
    const hasToggledAriaLabel = ariaLabel && this.ariaLabelSelected;
    const ariaPressedValue = !this.toggle ? A : this.selected;
    let ariaLabelValue = A;
    if (!this.href) {
      ariaLabelValue = hasToggledAriaLabel && this.selected ? this.ariaLabelSelected : ariaLabel;
    }
    return u3`<${tag}
        class="icon-button ${e8(this.getRenderClasses())}"
        id="button"
        aria-label="${ariaLabelValue || A}"
        aria-haspopup="${!this.href && ariaHasPopup || A}"
        aria-expanded="${!this.href && ariaExpanded || A}"
        aria-pressed="${ariaPressedValue}"
        aria-disabled=${!this.href && this.softDisabled || A}
        ?disabled="${!this.href && this.disabled}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${!this.selected ? this.renderIcon() : A}
        ${this.selected ? this.renderSelectedIcon() : A}
        ${this.href ? this.renderLink() : this.renderTouchTarget()}
  </${tag}>`;
  }
  renderLink() {
    const { ariaLabel } = this;
    return b2`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download || A}"
        target="${this.target || A}"
        aria-label="${ariaLabel || A}">
        ${this.renderTouchTarget()}
      </a>
    `;
  }
  getRenderClasses() {
    return {
      "flip-icon": this.flipIcon,
      "selected": this.toggle && this.selected
    };
  }
  renderIcon() {
    return b2`<span class="icon"><slot></slot></span>`;
  }
  renderSelectedIcon() {
    return b2`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
  }
  renderTouchTarget() {
    return b2`<span class="touch"></span>`;
  }
  renderFocusRing() {
    return b2`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
  }
  renderRipple() {
    const isRippleDisabled = !this.href && (this.disabled || this.softDisabled);
    return b2`<md-ripple
      for=${this.href ? "link" : A}
      ?disabled="${isRippleDisabled}"></md-ripple>`;
  }
  connectedCallback() {
    this.flipIcon = isRtl(this, this.flipIconInRtl);
    super.connectedCallback();
  }
};
IconButton.shadowRootOptions = {
  mode: "open",
  delegatesFocus: true
};
__decorate([
  n3({ type: Boolean, attribute: "soft-disabled", reflect: true })
], IconButton.prototype, "softDisabled", void 0);
__decorate([
  n3({ type: Boolean, attribute: "flip-icon-in-rtl" })
], IconButton.prototype, "flipIconInRtl", void 0);
__decorate([
  n3()
], IconButton.prototype, "href", void 0);
__decorate([
  n3()
], IconButton.prototype, "download", void 0);
__decorate([
  n3()
], IconButton.prototype, "target", void 0);
__decorate([
  n3({ attribute: "aria-label-selected" })
], IconButton.prototype, "ariaLabelSelected", void 0);
__decorate([
  n3({ type: Boolean })
], IconButton.prototype, "toggle", void 0);
__decorate([
  n3({ type: Boolean, reflect: true })
], IconButton.prototype, "selected", void 0);
__decorate([
  r4()
], IconButton.prototype, "flipIcon", void 0);

// node_modules/@material/web/iconbutton/internal/shared-styles.cssresult.js
var styles8 = i`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;
var shared_styles_cssresult_default2 = styles8.styleSheet;

// node_modules/@material/web/iconbutton/internal/standard-styles.cssresult.js
var styles9 = i`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`;
var standard_styles_cssresult_default = styles9.styleSheet;

// node_modules/@material/web/iconbutton/icon-button.js
var MdIconButton = class MdIconButton2 extends IconButton {
  getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      "standard": true
    };
  }
};
MdIconButton.styles = [styles8, styles9];
MdIconButton = __decorate([
  t("md-icon-button")
], MdIconButton);

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
function createRequestActivationEvent() {
  return new Event("request-activation", { bubbles: true, composed: true });
}
function isItemNotDisabled(item) {
  return !item.disabled;
}

// node_modules/@material/web/list/internal/list-controller.js
var NavigableKeys = {
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End"
};
var ListController = class {
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
      const isRtl3 = this.isRtl();
      const inlinePrevious = isRtl3 ? NavigableKeys.ArrowRight : NavigableKeys.ArrowLeft;
      const inlineNext = isRtl3 ? NavigableKeys.ArrowLeft : NavigableKeys.ArrowRight;
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
    const { isItem, getPossibleItems, isRtl: isRtl2, deactivateItem, activateItem, isNavigableKey, isActivatable, wrapNavigation } = config;
    this.isItem = isItem;
    this.getPossibleItems = getPossibleItems;
    this.isRtl = isRtl2;
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

// node_modules/@material/web/list/internal/list.js
var NAVIGABLE_KEY_SET = new Set(Object.values(NavigableKeys));
var List = class extends i4 {
  /** @export */
  get items() {
    return this.listController.items;
  }
  constructor() {
    super();
    this.listController = new ListController({
      isItem: (item) => item.hasAttribute("md-list-item"),
      getPossibleItems: () => this.slotItems,
      isRtl: () => getComputedStyle(this).direction === "rtl",
      deactivateItem: (item) => {
        item.tabIndex = -1;
      },
      activateItem: (item) => {
        item.tabIndex = 0;
      },
      isNavigableKey: (key) => NAVIGABLE_KEY_SET.has(key),
      isActivatable: (item) => !item.disabled && item.type !== "text"
    });
    this.internals = // Cast needed for closure
    this.attachInternals();
    if (!o7) {
      this.internals.role = "list";
      this.addEventListener("keydown", this.listController.handleKeydown);
    }
  }
  render() {
    return b2`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `;
  }
  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem() {
    return this.listController.activateNextItem();
  }
  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem() {
    return this.listController.activatePreviousItem();
  }
};
__decorate([
  o4({ flatten: true })
], List.prototype, "slotItems", void 0);

// node_modules/@material/web/list/internal/list-styles.cssresult.js
var styles10 = i`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`;
var list_styles_cssresult_default = styles10.styleSheet;

// node_modules/@material/web/list/list.js
var MdList = class MdList2 extends List {
};
MdList.styles = [styles10];
MdList = __decorate([
  t("md-list")
], MdList);

// node_modules/@material/web/labs/item/internal/item.js
var Item = class extends i4 {
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

// node_modules/@material/web/labs/item/internal/item-styles.cssresult.js
var styles11 = i`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;
var item_styles_cssresult_default = styles11.styleSheet;

// node_modules/@material/web/labs/item/item.js
var MdItem = class MdItem2 extends Item {
};
MdItem.styles = [styles11];
MdItem = __decorate([
  t("md-item")
], MdItem);

// node_modules/@material/web/list/internal/listitem/list-item.js
var listItemBaseClass = mixinDelegatesAria(i4);
var ListItemEl = class extends listItemBaseClass {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.type = "text";
    this.isListItem = true;
    this.href = "";
    this.target = "";
  }
  get isDisabled() {
    return this.disabled && this.type !== "link";
  }
  willUpdate(changed) {
    if (this.href) {
      this.type = "link";
    }
    super.willUpdate(changed);
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
    const isAnchor = this.type === "link";
    let tag;
    switch (this.type) {
      case "link":
        tag = i6`a`;
        break;
      case "button":
        tag = i6`button`;
        break;
      default:
      case "text":
        tag = i6`li`;
        break;
    }
    const isInteractive = this.type !== "text";
    const target = isAnchor && !!this.target ? this.target : A;
    return u3`
      <${tag}
        id="item"
        tabindex="${this.isDisabled || !isInteractive ? -1 : 0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${e8(this.getRenderClasses())}"
        href=${this.href || A}
        target=${target}
        @focus=${this.onFocus}
      >${content}</${tag}>
    `;
  }
  /**
   * Handles rendering of the ripple element.
   */
  renderRipple() {
    if (this.type === "text") {
      return A;
    }
    return b2` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`;
  }
  /**
   * Handles rendering of the focus ring.
   */
  renderFocusRing() {
    if (this.type === "text") {
      return A;
    }
    return b2` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
  }
  onFocusRingVisibilityChanged(e9) {
  }
  /**
   * Classes applied to the list item root.
   */
  getRenderClasses() {
    return { "disabled": this.isDisabled };
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
  onFocus() {
    if (this.tabIndex !== -1) {
      return;
    }
    this.dispatchEvent(createRequestActivationEvent());
  }
  focus() {
    this.listItemRoot?.focus();
  }
  click() {
    if (!this.listItemRoot) {
      super.click();
      return;
    }
    this.listItemRoot.click();
  }
};
ListItemEl.shadowRootOptions = {
  ...i4.shadowRootOptions,
  delegatesFocus: true
};
__decorate([
  n3({ type: Boolean, reflect: true })
], ListItemEl.prototype, "disabled", void 0);
__decorate([
  n3({ reflect: true })
], ListItemEl.prototype, "type", void 0);
__decorate([
  n3({ type: Boolean, attribute: "md-list-item", reflect: true })
], ListItemEl.prototype, "isListItem", void 0);
__decorate([
  n3()
], ListItemEl.prototype, "href", void 0);
__decorate([
  n3()
], ListItemEl.prototype, "target", void 0);
__decorate([
  e4(".list-item")
], ListItemEl.prototype, "listItemRoot", void 0);

// node_modules/@material/web/list/internal/listitem/list-item-styles.cssresult.js
var styles12 = i`:host{display:flex;gap:16px;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`;
var list_item_styles_cssresult_default = styles12.styleSheet;

// node_modules/@material/web/list/list-item.js
var MdListItem = class MdListItem2 extends ListItemEl {
};
MdListItem.styles = [styles12];
MdListItem = __decorate([
  t("md-list-item")
], MdListItem);

// node_modules/@material/web/divider/internal/divider.js
var Divider = class extends i4 {
  constructor() {
    super(...arguments);
    this.inset = false;
    this.insetStart = false;
    this.insetEnd = false;
  }
};
__decorate([
  n3({ type: Boolean, reflect: true })
], Divider.prototype, "inset", void 0);
__decorate([
  n3({ type: Boolean, reflect: true, attribute: "inset-start" })
], Divider.prototype, "insetStart", void 0);
__decorate([
  n3({ type: Boolean, reflect: true, attribute: "inset-end" })
], Divider.prototype, "insetEnd", void 0);

// node_modules/@material/web/divider/internal/divider-styles.cssresult.js
var styles13 = i`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
var divider_styles_cssresult_default = styles13.styleSheet;

// node_modules/@material/web/divider/divider.js
var MdDivider = class MdDivider2 extends Divider {
};
MdDivider.styles = [styles13];
MdDivider = __decorate([
  t("md-divider")
], MdDivider);

// node_modules/@material/web/chips/internal/chip.js
var chipBaseClass = mixinDelegatesAria(i4);
var Chip = class extends chipBaseClass {
  /**
   * Whether or not the primary ripple is disabled (defaults to `disabled`).
   * Some chip actions such as links cannot be disabled.
   */
  get rippleDisabled() {
    return this.disabled || this.softDisabled;
  }
  constructor() {
    super();
    this.disabled = false;
    this.softDisabled = false;
    this.alwaysFocusable = false;
    this.label = "";
    this.hasIcon = false;
    if (!o7) {
      this.addEventListener("click", this.handleClick.bind(this));
    }
  }
  focus(options) {
    if (this.disabled && !this.alwaysFocusable) {
      return;
    }
    super.focus(options);
  }
  render() {
    return b2`
      <div class="container ${e8(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `;
  }
  updated(changed) {
    if (changed.has("disabled") && changed.get("disabled") !== void 0) {
      this.dispatchEvent(new Event("update-focus", { bubbles: true }));
    }
  }
  getContainerClasses() {
    return {
      "disabled": this.disabled || this.softDisabled,
      "has-icon": this.hasIcon
    };
  }
  renderContainerContent() {
    return b2`
      ${this.renderOutline()}
      <md-focus-ring part="focus-ring" for=${this.primaryId}></md-focus-ring>
      <md-ripple
        for=${this.primaryId}
        ?disabled=${this.rippleDisabled}></md-ripple>
      ${this.renderPrimaryAction(this.renderPrimaryContent())}
    `;
  }
  renderOutline() {
    return b2`<span class="outline"></span>`;
  }
  renderLeadingIcon() {
    return b2`<slot name="icon" @slotchange=${this.handleIconChange}></slot>`;
  }
  renderPrimaryContent() {
    return b2`
      <span class="leading icon" aria-hidden="true">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">
        <span class="label-text" id="label">
          ${this.label ? this.label : b2`<slot></slot>`}
        </span>
      </span>
      <span class="touch"></span>
    `;
  }
  handleIconChange(event) {
    const slot = event.target;
    this.hasIcon = slot.assignedElements({ flatten: true }).length > 0;
  }
  handleClick(event) {
    if (this.softDisabled || this.disabled && this.alwaysFocusable) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }
  }
};
Chip.shadowRootOptions = {
  ...i4.shadowRootOptions,
  delegatesFocus: true
};
__decorate([
  n3({ type: Boolean, reflect: true })
], Chip.prototype, "disabled", void 0);
__decorate([
  n3({ type: Boolean, attribute: "soft-disabled", reflect: true })
], Chip.prototype, "softDisabled", void 0);
__decorate([
  n3({ type: Boolean, attribute: "always-focusable" })
], Chip.prototype, "alwaysFocusable", void 0);
__decorate([
  n3()
], Chip.prototype, "label", void 0);
__decorate([
  n3({ type: Boolean, reflect: true, attribute: "has-icon" })
], Chip.prototype, "hasIcon", void 0);

// node_modules/@material/web/chips/internal/chip-set.js
var ChipSet = class extends i4 {
  get chips() {
    return this.childElements.filter((child) => child instanceof Chip);
  }
  constructor() {
    super();
    this.internals = // Cast needed for closure
    this.attachInternals();
    if (!o7) {
      this.addEventListener("focusin", this.updateTabIndices.bind(this));
      this.addEventListener("update-focus", this.updateTabIndices.bind(this));
      this.addEventListener("keydown", this.handleKeyDown.bind(this));
      this.internals.role = "toolbar";
    }
  }
  render() {
    return b2`<slot @slotchange=${this.updateTabIndices}></slot>`;
  }
  handleKeyDown(event) {
    const isLeft = event.key === "ArrowLeft";
    const isRight = event.key === "ArrowRight";
    const isHome = event.key === "Home";
    const isEnd = event.key === "End";
    if (!isLeft && !isRight && !isHome && !isEnd) {
      return;
    }
    const { chips } = this;
    if (chips.length < 2) {
      return;
    }
    event.preventDefault();
    if (isHome || isEnd) {
      const index = isHome ? 0 : chips.length - 1;
      chips[index].focus({ trailing: isEnd });
      this.updateTabIndices();
      return;
    }
    const isRtl2 = getComputedStyle(this).direction === "rtl";
    const forwards = isRtl2 ? isLeft : isRight;
    const focusedChip = chips.find((chip) => chip.matches(":focus-within"));
    if (!focusedChip) {
      const nextChip = forwards ? chips[0] : chips[chips.length - 1];
      nextChip.focus({ trailing: !forwards });
      this.updateTabIndices();
      return;
    }
    const currentIndex = chips.indexOf(focusedChip);
    let nextIndex = forwards ? currentIndex + 1 : currentIndex - 1;
    while (nextIndex !== currentIndex) {
      if (nextIndex >= chips.length) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = chips.length - 1;
      }
      const nextChip = chips[nextIndex];
      if (nextChip.disabled && !nextChip.alwaysFocusable) {
        if (forwards) {
          nextIndex++;
        } else {
          nextIndex--;
        }
        continue;
      }
      nextChip.focus({ trailing: !forwards });
      this.updateTabIndices();
      break;
    }
  }
  updateTabIndices() {
    const { chips } = this;
    let chipToFocus;
    for (const chip of chips) {
      const isChipFocusable = chip.alwaysFocusable || !chip.disabled;
      const chipIsFocused = chip.matches(":focus-within");
      if (chipIsFocused && isChipFocusable) {
        chipToFocus = chip;
        continue;
      }
      if (isChipFocusable && !chipToFocus) {
        chipToFocus = chip;
      }
      chip.tabIndex = -1;
    }
    if (chipToFocus) {
      chipToFocus.tabIndex = 0;
    }
  }
};
__decorate([
  o4()
], ChipSet.prototype, "childElements", void 0);

// node_modules/@material/web/chips/internal/chip-set-styles.cssresult.js
var styles14 = i`:host{display:flex;flex-wrap:wrap;gap:8px}
`;
var chip_set_styles_cssresult_default = styles14.styleSheet;

// node_modules/@material/web/chips/chip-set.js
var MdChipSet = class MdChipSet2 extends ChipSet {
};
MdChipSet.styles = [styles14];
MdChipSet = __decorate([
  t("md-chip-set")
], MdChipSet);

// node_modules/@material/web/chips/internal/elevated-styles.cssresult.js
var styles15 = i`.elevated{--md-elevation-level: var(--_elevated-container-elevation);--md-elevation-shadow-color: var(--_elevated-container-shadow-color)}.elevated::before{background:var(--_elevated-container-color)}.elevated:hover{--md-elevation-level: var(--_elevated-hover-container-elevation)}.elevated:focus-within{--md-elevation-level: var(--_elevated-focus-container-elevation)}.elevated:active{--md-elevation-level: var(--_elevated-pressed-container-elevation)}.elevated.disabled{--md-elevation-level: var(--_elevated-disabled-container-elevation)}.elevated.disabled::before{background:var(--_elevated-disabled-container-color);opacity:var(--_elevated-disabled-container-opacity)}@media(forced-colors: active){.elevated md-elevation{border:1px solid CanvasText}.elevated.disabled md-elevation{border-color:GrayText}}
`;
var elevated_styles_cssresult_default = styles15.styleSheet;

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

// node_modules/@material/web/chips/internal/multi-action-chip.js
var ARIA_LABEL_REMOVE = "aria-label-remove";
var MultiActionChip = class extends Chip {
  get ariaLabelRemove() {
    if (this.hasAttribute(ARIA_LABEL_REMOVE)) {
      return this.getAttribute(ARIA_LABEL_REMOVE);
    }
    const { ariaLabel } = this;
    if (ariaLabel || this.label) {
      return `Remove ${ariaLabel || this.label}`;
    }
    return null;
  }
  set ariaLabelRemove(ariaLabel) {
    const prev = this.ariaLabelRemove;
    if (ariaLabel === prev) {
      return;
    }
    if (ariaLabel === null) {
      this.removeAttribute(ARIA_LABEL_REMOVE);
    } else {
      this.setAttribute(ARIA_LABEL_REMOVE, ariaLabel);
    }
    this.requestUpdate();
  }
  constructor() {
    super();
    this.handleTrailingActionFocus = this.handleTrailingActionFocus.bind(this);
    if (!o7) {
      this.addEventListener("keydown", this.handleKeyDown.bind(this));
    }
  }
  focus(options) {
    const isFocusable = this.alwaysFocusable || !this.disabled;
    if (isFocusable && options?.trailing && this.trailingAction) {
      this.trailingAction.focus(options);
      return;
    }
    super.focus(options);
  }
  renderContainerContent() {
    return b2`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `;
  }
  handleKeyDown(event) {
    const isLeft = event.key === "ArrowLeft";
    const isRight = event.key === "ArrowRight";
    if (!isLeft && !isRight) {
      return;
    }
    if (!this.primaryAction || !this.trailingAction) {
      return;
    }
    const isRtl2 = getComputedStyle(this).direction === "rtl";
    const forwards = isRtl2 ? isLeft : isRight;
    const isPrimaryFocused = this.primaryAction?.matches(":focus-within");
    const isTrailingFocused = this.trailingAction?.matches(":focus-within");
    if (forwards && isTrailingFocused || !forwards && isPrimaryFocused) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const actionToFocus = forwards ? this.trailingAction : this.primaryAction;
    actionToFocus.focus();
  }
  handleTrailingActionFocus() {
    const { primaryAction, trailingAction } = this;
    if (!primaryAction || !trailingAction) {
      return;
    }
    primaryAction.tabIndex = -1;
    trailingAction.addEventListener("focusout", () => {
      primaryAction.tabIndex = 0;
    }, { once: true });
  }
};

// node_modules/@material/web/chips/internal/trailing-icons.js
function renderRemoveButton({ ariaLabel, disabled, focusListener, tabbable = false }) {
  return b2`
    <span id="remove-label" hidden aria-hidden="true">Remove</span>
    <button
      class="trailing action"
      aria-label=${ariaLabel || A}
      aria-labelledby=${!ariaLabel ? "remove-label label" : A}
      tabindex=${!tabbable ? -1 : A}
      @click=${handleRemoveClick}
      @focus=${focusListener}>
      <md-focus-ring part="trailing-focus-ring"></md-focus-ring>
      <md-ripple ?disabled=${disabled}></md-ripple>
      <span class="trailing icon" aria-hidden="true">
        <slot name="remove-trailing-icon">
          <svg viewBox="0 96 960 960">
            <path
              d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
        </slot>
      </span>
      <span class="touch"></span>
    </button>
  `;
}
function handleRemoveClick(event) {
  if (this.disabled || this.softDisabled) {
    return;
  }
  event.stopPropagation();
  const preventDefault = !this.dispatchEvent(new Event("remove", { cancelable: true }));
  if (preventDefault) {
    return;
  }
  this.remove();
}

// node_modules/@material/web/chips/internal/filter-chip.js
var FilterChip = class extends MultiActionChip {
  constructor() {
    super(...arguments);
    this.elevated = false;
    this.removable = false;
    this.selected = false;
    this.hasSelectedIcon = false;
  }
  get primaryId() {
    return "button";
  }
  getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      elevated: this.elevated,
      selected: this.selected,
      "has-trailing": this.removable,
      "has-icon": this.hasIcon || this.selected
    };
  }
  renderPrimaryAction(content) {
    const { ariaLabel } = this;
    return b2`
      <button
        class="primary action"
        id="button"
        aria-label=${ariaLabel || A}
        aria-pressed=${this.selected}
        aria-disabled=${this.softDisabled || A}
        ?disabled=${this.disabled && !this.alwaysFocusable}
        @click=${this.handleClickOnChild}
        >${content}</button
      >
    `;
  }
  renderLeadingIcon() {
    if (!this.selected) {
      return super.renderLeadingIcon();
    }
    return b2`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `;
  }
  renderTrailingAction(focusListener) {
    if (this.removable) {
      return renderRemoveButton({
        focusListener,
        ariaLabel: this.ariaLabelRemove,
        disabled: this.disabled || this.softDisabled
      });
    }
    return A;
  }
  renderOutline() {
    if (this.elevated) {
      return b2`<md-elevation part="elevation"></md-elevation>`;
    }
    return super.renderOutline();
  }
  handleClickOnChild(event) {
    if (this.disabled || this.softDisabled) {
      return;
    }
    const prevValue = this.selected;
    this.selected = !this.selected;
    const preventDefault = !redispatchEvent(this, event);
    if (preventDefault) {
      this.selected = prevValue;
      return;
    }
  }
};
__decorate([
  n3({ type: Boolean })
], FilterChip.prototype, "elevated", void 0);
__decorate([
  n3({ type: Boolean })
], FilterChip.prototype, "removable", void 0);
__decorate([
  n3({ type: Boolean, reflect: true })
], FilterChip.prototype, "selected", void 0);
__decorate([
  n3({ type: Boolean, reflect: true, attribute: "has-selected-icon" })
], FilterChip.prototype, "hasSelectedIcon", void 0);
__decorate([
  e4(".primary.action")
], FilterChip.prototype, "primaryAction", void 0);
__decorate([
  e4(".trailing.action")
], FilterChip.prototype, "trailingAction", void 0);

// node_modules/@material/web/chips/internal/filter-styles.cssresult.js
var styles16 = i`:host{--_container-height: var(--md-filter-chip-container-height, 32px);--_disabled-label-text-color: var(--md-filter-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filter-chip-disabled-label-text-opacity, 0.38);--_elevated-container-elevation: var(--md-filter-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-filter-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-filter-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-filter-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-filter-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-filter-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-filter-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-filter-chip-elevated-pressed-container-elevation, 1);--_elevated-selected-container-color: var(--md-filter-chip-elevated-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_label-text-font: var(--md-filter-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filter-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filter-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filter-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-focus-label-text-color: var(--md-filter-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-filter-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-filter-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-filter-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-filter-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-filter-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-filter-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_selected-pressed-state-layer-opacity: var(--md-filter-chip-selected-pressed-state-layer-opacity, 0.12);--_elevated-container-color: var(--md-filter-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_disabled-outline-color: var(--md-filter-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-filter-chip-disabled-outline-opacity, 0.12);--_disabled-selected-container-color: var(--md-filter-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-filter-chip-disabled-selected-container-opacity, 0.12);--_focus-outline-color: var(--md-filter-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-filter-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-filter-chip-outline-width, 1px);--_selected-container-color: var(--md-filter-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-outline-width: var(--md-filter-chip-selected-outline-width, 0px);--_focus-label-text-color: var(--md-filter-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-filter-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filter-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-filter-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filter-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-filter-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-filter-chip-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filter-chip-pressed-state-layer-opacity, 0.12);--_icon-size: var(--md-filter-chip-icon-size, 18px);--_disabled-leading-icon-color: var(--md-filter-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filter-chip-disabled-leading-icon-opacity, 0.38);--_selected-focus-leading-icon-color: var(--md-filter-chip-selected-focus-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-leading-icon-color: var(--md-filter-chip-selected-hover-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-leading-icon-color: var(--md-filter-chip-selected-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-leading-icon-color: var(--md-filter-chip-selected-pressed-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-leading-icon-color: var(--md-filter-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-filter-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-filter-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-filter-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-filter-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filter-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-filter-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-filter-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-filter-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-filter-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-filter-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filter-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-filter-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-filter-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filter-chip-container-shape-start-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-filter-chip-container-shape-start-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-filter-chip-container-shape-end-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-filter-chip-container-shape-end-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-filter-chip-leading-space, 16px);--_trailing-space: var(--md-filter-chip-trailing-space, 16px);--_icon-label-space: var(--md-filter-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-filter-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-filter-chip-with-trailing-icon-trailing-space, 8px)}.selected.elevated::before{background:var(--_elevated-selected-container-color)}.checkmark{height:var(--_icon-size);width:var(--_icon-size)}.disabled .checkmark{opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){.disabled .checkmark{opacity:1}}
`;
var filter_styles_cssresult_default = styles16.styleSheet;

// node_modules/@material/web/chips/internal/selectable-styles.cssresult.js
var styles17 = i`.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}:where(.selected)::before{background:var(--_selected-container-color)}:where(.selected) .outline{border-width:var(--_selected-outline-width)}:where(.selected.disabled)::before{background:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}:where(.selected) .label{color:var(--_selected-label-text-color)}:where(.selected:hover) .label{color:var(--_selected-hover-label-text-color)}:where(.selected:focus) .label{color:var(--_selected-focus-label-text-color)}:where(.selected:active) .label{color:var(--_selected-pressed-label-text-color)}:where(.selected) .leading.icon{color:var(--_selected-leading-icon-color)}:where(.selected:hover) .leading.icon{color:var(--_selected-hover-leading-icon-color)}:where(.selected:focus) .leading.icon{color:var(--_selected-focus-leading-icon-color)}:where(.selected:active) .leading.icon{color:var(--_selected-pressed-leading-icon-color)}@media(forced-colors: active){:where(.selected:not(.elevated))::before{border:1px solid CanvasText}:where(.selected) .outline{border-width:1px}}
`;
var selectable_styles_cssresult_default = styles17.styleSheet;

// node_modules/@material/web/chips/internal/shared-styles.cssresult.js
var styles18 = i`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);display:inline-flex;height:var(--_container-height);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}:host(:is([disabled],[soft-disabled])){pointer-events:none}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.container{border-radius:inherit;box-sizing:border-box;display:flex;height:100%;position:relative;width:100%}.container::before{border-radius:inherit;content:"";inset:0;pointer-events:none;position:absolute}.container:not(.disabled){cursor:pointer}.container.disabled{pointer-events:none}.cell{display:flex}.action{align-items:baseline;appearance:none;background:none;border:none;border-radius:inherit;display:flex;outline:none;padding:0;position:relative;text-decoration:none}.primary.action{min-width:0;padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space)}.has-icon .primary.action{padding-inline-start:var(--_with-leading-icon-leading-space)}.touch{height:48px;inset:50% 0 0;position:absolute;transform:translateY(-50%);width:100%}:host([touch-target=none]) .touch{display:none}.outline{border:var(--_outline-width) solid var(--_outline-color);border-radius:inherit;inset:0;pointer-events:none;position:absolute}:where(:focus) .outline{border-color:var(--_focus-outline-color)}:where(.disabled) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}md-ripple{border-radius:inherit}.label,.icon,.touch{z-index:1}.label{align-items:center;color:var(--_label-text-color);display:flex;font-family:var(--_label-text-font);font-size:var(--_label-text-size);font-weight:var(--_label-text-weight);height:100%;line-height:var(--_label-text-line-height);overflow:hidden;user-select:none}.label-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:where(:hover) .label{color:var(--_hover-label-text-color)}:where(:focus) .label{color:var(--_focus-label-text-color)}:where(:active) .label{color:var(--_pressed-label-text-color)}:where(.disabled) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.icon{align-self:center;display:flex;fill:currentColor;position:relative}.icon ::slotted(:first-child){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size)}.leading.icon{color:var(--_leading-icon-color)}.leading.icon ::slotted(*),.leading.icon svg{margin-inline-end:var(--_icon-label-space)}:where(:hover) .leading.icon{color:var(--_hover-leading-icon-color)}:where(:focus) .leading.icon{color:var(--_focus-leading-icon-color)}:where(:active) .leading.icon{color:var(--_pressed-leading-icon-color)}:where(.disabled) .leading.icon{color:var(--_disabled-leading-icon-color);opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){:where(.disabled) :is(.label,.outline,.leading.icon){color:GrayText;opacity:1}}a,button{text-transform:inherit}a,button:not(:disabled,[aria-disabled=true]){cursor:inherit}
`;
var shared_styles_cssresult_default3 = styles18.styleSheet;

// node_modules/@material/web/chips/internal/trailing-icon-styles.cssresult.js
var styles19 = i`.trailing.action{align-items:center;justify-content:center;padding-inline-start:var(--_icon-label-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}.trailing.action :is(md-ripple,md-focus-ring){border-radius:50%;height:calc(1.3333333333*var(--_icon-size));width:calc(1.3333333333*var(--_icon-size))}.trailing.action md-focus-ring{inset:unset}.has-trailing .primary.action{padding-inline-end:0}.trailing.icon{color:var(--_trailing-icon-color);height:var(--_icon-size);width:var(--_icon-size)}:where(:hover) .trailing.icon{color:var(--_hover-trailing-icon-color)}:where(:focus) .trailing.icon{color:var(--_focus-trailing-icon-color)}:where(:active) .trailing.icon{color:var(--_pressed-trailing-icon-color)}:where(.disabled) .trailing.icon{color:var(--_disabled-trailing-icon-color);opacity:var(--_disabled-trailing-icon-opacity)}:where(.selected) .trailing.icon{color:var(--_selected-trailing-icon-color)}:where(.selected:hover) .trailing.icon{color:var(--_selected-hover-trailing-icon-color)}:where(.selected:focus) .trailing.icon{color:var(--_selected-focus-trailing-icon-color)}:where(.selected:active) .trailing.icon{color:var(--_selected-pressed-trailing-icon-color)}@media(forced-colors: active){.trailing.icon{color:ButtonText}:where(.disabled) .trailing.icon{color:GrayText;opacity:1}}
`;
var trailing_icon_styles_cssresult_default = styles19.styleSheet;

// node_modules/@material/web/chips/filter-chip.js
var MdFilterChip = class MdFilterChip2 extends FilterChip {
};
MdFilterChip.styles = [
  styles18,
  styles15,
  styles19,
  styles17,
  styles16
];
MdFilterChip = __decorate([
  t("md-filter-chip")
], MdFilterChip);

// node_modules/lit-html/directives/style-map.js
var n6 = "important";
var i7 = " !" + n6;
var o9 = e7(class extends i5 {
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
        t5.includes("-") || r8 ? s4.setProperty(t5, r8 ? e10.slice(0, -11) : e10, r8 ? n6 : "") : s4[t5] = e10;
      }
    }
    return E;
  }
});

// node_modules/@material/web/progress/internal/progress.js
var progressBaseClass = mixinDelegatesAria(i4);
var Progress = class extends progressBaseClass {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.max = 1;
    this.indeterminate = false;
    this.fourColor = false;
  }
  render() {
    const { ariaLabel } = this;
    return b2`
      <div
        class="progress ${e8(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${ariaLabel || A}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate ? A : this.value}
        >${this.renderIndicator()}</div
      >
    `;
  }
  getRenderClasses() {
    return {
      "indeterminate": this.indeterminate,
      "four-color": this.fourColor
    };
  }
};
__decorate([
  n3({ type: Number })
], Progress.prototype, "value", void 0);
__decorate([
  n3({ type: Number })
], Progress.prototype, "max", void 0);
__decorate([
  n3({ type: Boolean })
], Progress.prototype, "indeterminate", void 0);
__decorate([
  n3({ type: Boolean, attribute: "four-color" })
], Progress.prototype, "fourColor", void 0);

// node_modules/@material/web/progress/internal/linear-progress.js
var LinearProgress = class extends Progress {
  constructor() {
    super(...arguments);
    this.buffer = 0;
  }
  // Note, the indeterminate animation is rendered with transform %'s
  // Previously, this was optimized to use px calculated with the resizeObserver
  // due to a now fixed Chrome bug: crbug.com/389359.
  renderIndicator() {
    const progressStyles = {
      transform: `scaleX(${(this.indeterminate ? 1 : this.value / this.max) * 100}%)`
    };
    const bufferValue = this.buffer ?? 0;
    const hasBuffer = bufferValue > 0;
    const dotSize = this.indeterminate || !hasBuffer ? 1 : bufferValue / this.max;
    const dotStyles = {
      transform: `scaleX(${dotSize * 100}%)`
    };
    const hideDots = this.indeterminate || !hasBuffer || bufferValue >= this.max || this.value >= this.max;
    return b2`
      <div class="dots" ?hidden=${hideDots}></div>
      <div class="inactive-track" style=${o9(dotStyles)}></div>
      <div class="bar primary-bar" style=${o9(progressStyles)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `;
  }
};
__decorate([
  n3({ type: Number })
], LinearProgress.prototype, "buffer", void 0);

// node_modules/@material/web/progress/internal/linear-progress-styles.cssresult.js
var styles20 = i`:host{--_active-indicator-color: var(--md-linear-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-linear-progress-active-indicator-height, 4px);--_four-color-active-indicator-four-color: var(--md-linear-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-linear-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-linear-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-linear-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_track-color: var(--md-linear-progress-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_track-height: var(--md-linear-progress-track-height, 4px);--_track-shape: var(--md-linear-progress-track-shape, var(--md-sys-shape-corner-none, 0px));border-radius:var(--_track-shape);display:flex;position:relative;min-width:80px;height:var(--_track-height);content-visibility:auto;contain:strict}.progress,.dots,.inactive-track,.bar,.bar-inner{position:absolute}.progress{direction:ltr;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center}.bar{animation:none;width:100%;height:var(--_active-indicator-height);transform-origin:left center;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1)}.secondary-bar{display:none}.bar-inner{inset:0;animation:none;background:var(--_active-indicator-color)}.inactive-track{background:var(--_track-color);inset:0;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1);transform-origin:left center}.dots{inset:0;animation:linear infinite 250ms;animation-name:buffering;background-color:var(--_track-color);background-repeat:repeat-x;-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");z-index:-1}.dots[hidden]{display:none}.indeterminate .bar{transition:none}.indeterminate .primary-bar{inset-inline-start:-145.167%}.indeterminate .secondary-bar{inset-inline-start:-54.8889%;display:block}.indeterminate .primary-bar{animation:linear infinite 2s;animation-name:primary-indeterminate-translate}.indeterminate .primary-bar>.bar-inner{animation:linear infinite 2s primary-indeterminate-scale}.indeterminate.four-color .primary-bar>.bar-inner{animation-name:primary-indeterminate-scale,four-color;animation-duration:2s,4s}.indeterminate .secondary-bar{animation:linear infinite 2s;animation-name:secondary-indeterminate-translate}.indeterminate .secondary-bar>.bar-inner{animation:linear infinite 2s secondary-indeterminate-scale}.indeterminate.four-color .secondary-bar>.bar-inner{animation-name:secondary-indeterminate-scale,four-color;animation-duration:2s,4s}:host(:dir(rtl)){transform:scale(-1)}@keyframes primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.00432);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes buffering{0%{transform:translateX(calc(var(--_track-height) / 2 * 5))}}@keyframes primary-indeterminate-translate{0%{transform:translateX(0px)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0px)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.6714%)}100%{transform:translateX(200.611%)}}@keyframes secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0px)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.6519%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.3862%)}100%{transform:translateX(160.278%)}}@keyframes four-color{0%{background:var(--_four-color-active-indicator-one-color)}15%{background:var(--_four-color-active-indicator-one-color)}25%{background:var(--_four-color-active-indicator-two-color)}40%{background:var(--_four-color-active-indicator-two-color)}50%{background:var(--_four-color-active-indicator-three-color)}65%{background:var(--_four-color-active-indicator-three-color)}75%{background:var(--_four-color-active-indicator-four-color)}90%{background:var(--_four-color-active-indicator-four-color)}100%{background:var(--_four-color-active-indicator-one-color)}}@media(forced-colors: active){:host{outline:1px solid CanvasText}.bar-inner,.dots{background-color:CanvasText}}
`;
var linear_progress_styles_cssresult_default = styles20.styleSheet;

// node_modules/@material/web/progress/linear-progress.js
var MdLinearProgress = class MdLinearProgress2 extends LinearProgress {
};
MdLinearProgress.styles = [styles20];
MdLinearProgress = __decorate([
  t("md-linear-progress")
], MdLinearProgress);

// node_modules/@material/web/typography/md-typescale-styles.cssresult.js
var styles21 = i`@layer{.md-typescale-display-small,.md-typescale-display-small-prominent{font:var(--md-sys-typescale-display-small-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-display-small-size, 2.25rem)/var(--md-sys-typescale-display-small-line-height, 2.75rem) var(--md-sys-typescale-display-small-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-display-medium,.md-typescale-display-medium-prominent{font:var(--md-sys-typescale-display-medium-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-display-medium-size, 2.8125rem)/var(--md-sys-typescale-display-medium-line-height, 3.25rem) var(--md-sys-typescale-display-medium-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-display-large,.md-typescale-display-large-prominent{font:var(--md-sys-typescale-display-large-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-display-large-size, 3.5625rem)/var(--md-sys-typescale-display-large-line-height, 4rem) var(--md-sys-typescale-display-large-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-headline-small,.md-typescale-headline-small-prominent{font:var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-headline-small-size, 1.5rem)/var(--md-sys-typescale-headline-small-line-height, 2rem) var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-headline-medium,.md-typescale-headline-medium-prominent{font:var(--md-sys-typescale-headline-medium-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-headline-medium-size, 1.75rem)/var(--md-sys-typescale-headline-medium-line-height, 2.25rem) var(--md-sys-typescale-headline-medium-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-headline-large,.md-typescale-headline-large-prominent{font:var(--md-sys-typescale-headline-large-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-headline-large-size, 2rem)/var(--md-sys-typescale-headline-large-line-height, 2.5rem) var(--md-sys-typescale-headline-large-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-title-small,.md-typescale-title-small-prominent{font:var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-title-small-size, 0.875rem)/var(--md-sys-typescale-title-small-line-height, 1.25rem) var(--md-sys-typescale-title-small-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-title-medium,.md-typescale-title-medium-prominent{font:var(--md-sys-typescale-title-medium-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-title-medium-size, 1rem)/var(--md-sys-typescale-title-medium-line-height, 1.5rem) var(--md-sys-typescale-title-medium-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-title-large,.md-typescale-title-large-prominent{font:var(--md-sys-typescale-title-large-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-title-large-size, 1.375rem)/var(--md-sys-typescale-title-large-line-height, 1.75rem) var(--md-sys-typescale-title-large-font, var(--md-ref-typeface-brand, Roboto))}.md-typescale-body-small,.md-typescale-body-small-prominent{font:var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-body-small-size, 0.75rem)/var(--md-sys-typescale-body-small-line-height, 1rem) var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-body-medium,.md-typescale-body-medium-prominent{font:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-body-medium-size, 0.875rem)/var(--md-sys-typescale-body-medium-line-height, 1.25rem) var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-body-large,.md-typescale-body-large-prominent{font:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)) var(--md-sys-typescale-body-large-size, 1rem)/var(--md-sys-typescale-body-large-line-height, 1.5rem) var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-label-small,.md-typescale-label-small-prominent{font:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-label-small-size, 0.6875rem)/var(--md-sys-typescale-label-small-line-height, 1rem) var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-label-medium,.md-typescale-label-medium-prominent{font:var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-label-medium-size, 0.75rem)/var(--md-sys-typescale-label-medium-line-height, 1rem) var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-label-medium-prominent{font-weight:var(--md-sys-typescale-label-medium-weight-prominent, var(--md-ref-typeface-weight-bold, 700))}.md-typescale-label-large,.md-typescale-label-large-prominent{font:var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)) var(--md-sys-typescale-label-large-size, 0.875rem)/var(--md-sys-typescale-label-large-line-height, 1.25rem) var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto))}.md-typescale-label-large-prominent{font-weight:var(--md-sys-typescale-label-large-weight-prominent, var(--md-ref-typeface-weight-bold, 700))}}
`;
var md_typescale_styles_cssresult_default = styles21.styleSheet;
export {
  styles21 as typescaleStyles
};
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

@material/web/elevation/internal/elevation.js:
@material/web/elevation/elevation.js:
@material/web/ripple/internal/ripple.js:
@material/web/ripple/ripple.js:
@material/web/icon/internal/icon.js:
@material/web/icon/icon.js:
@material/web/internal/controller/is-rtl.js:
@material/web/list/internal/listitem/list-item.js:
@material/web/list/list-item.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/web/elevation/internal/elevation-styles.cssresult.js:
@material/web/focus/internal/focus-ring-styles.cssresult.js:
@material/web/ripple/internal/ripple-styles.cssresult.js:
@material/web/button/internal/filled-styles.cssresult.js:
@material/web/button/internal/shared-elevation-styles.cssresult.js:
@material/web/button/internal/shared-styles.cssresult.js:
@material/web/icon/internal/icon-styles.cssresult.js:
@material/web/iconbutton/internal/shared-styles.cssresult.js:
@material/web/iconbutton/internal/standard-styles.cssresult.js:
@material/web/list/internal/list-styles.cssresult.js:
@material/web/labs/item/internal/item-styles.cssresult.js:
@material/web/list/internal/listitem/list-item-styles.cssresult.js:
@material/web/divider/internal/divider-styles.cssresult.js:
@material/web/chips/internal/chip-set-styles.cssresult.js:
@material/web/chips/internal/elevated-styles.cssresult.js:
@material/web/chips/internal/filter-styles.cssresult.js:
@material/web/chips/internal/selectable-styles.cssresult.js:
@material/web/chips/internal/shared-styles.cssresult.js:
@material/web/chips/internal/trailing-icon-styles.cssresult.js:
@material/web/progress/internal/linear-progress-styles.cssresult.js:
@material/web/typography/md-typescale-styles.cssresult.js:
@material/web/typography/md-typescale-styles.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/web/internal/controller/attachable-controller.js:
@material/web/internal/aria/aria.js:
@material/web/internal/aria/delegate.js:
@material/web/labs/behaviors/element-internals.js:
@material/web/labs/behaviors/form-associated.js:
@material/web/internal/events/dispatch-hooks.js:
@material/web/labs/behaviors/form-submitter.js:
@material/web/list/internal/list-navigation-helpers.js:
@material/web/list/internal/list-controller.js:
@material/web/labs/item/internal/item.js:
@material/web/labs/item/item.js:
@material/web/divider/internal/divider.js:
@material/web/divider/divider.js:
@material/web/chips/internal/chip.js:
@material/web/chips/internal/chip-set.js:
@material/web/chips/chip-set.js:
@material/web/chips/internal/multi-action-chip.js:
@material/web/chips/internal/trailing-icons.js:
@material/web/chips/internal/filter-chip.js:
@material/web/chips/filter-chip.js:
@material/web/progress/internal/progress.js:
@material/web/progress/internal/linear-progress.js:
@material/web/progress/linear-progress.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

@material/web/focus/internal/focus-ring.js:
@material/web/focus/md-focus-ring.js:
@material/web/internal/motion/animation.js:
@material/web/internal/events/form-label-activation.js:
@material/web/button/internal/filled-button.js:
@material/web/button/filled-button.js:
@material/web/iconbutton/icon-button.js:
@material/web/list/internal/list.js:
@material/web/list/list.js:
@material/web/internal/events/redispatch-event.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

lit-html/directives/class-map.js:
lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@material/web/button/internal/button.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@material/web/iconbutton/internal/icon-button.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
