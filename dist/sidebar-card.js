const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,b=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!r(t,e),v={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[g("elementProperties")]=new Map,w[g("finalized")]=new Map,f?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,$=t=>t,k=x.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+M,C=`<${E}>`,z=document,H=()=>z.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,P="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,j=/>/g,L=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,U=/"/g,B=/^(?:script|style|textarea|title)$/i,F=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),q=F(1),I=F(2),W=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),V=new WeakMap,Y=z.createTreeWalker(z,129);function Z(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",a=N;for(let e=0;e<i;e++){const i=t[e];let r,l,d=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===N?"!--"===l[1]?a=D:void 0!==l[1]?a=j:void 0!==l[2]?(B.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=L):void 0!==l[3]&&(a=L):a===L?">"===l[0]?(a=n??N,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?L:'"'===l[3]?U:R):a===U||a===R?a=L:a===D||a===j?a=N:(a=L,n=void 0);const h=a===L&&t[e+1].startsWith("/>")?" ":"";o+=a===N?i+C:d>=0?(s.push(r),i.slice(0,d)+A+i.slice(d)+M+h):i+M+(-2===d?e:h)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[l,d]=G(t,e);if(this.el=X.createElement(l,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=d[o++],i=s.getAttribute(t).split(M),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?it:"?"===a[1]?st:"@"===a[1]?nt:et}),s.removeAttribute(t)}else t.startsWith(M)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(M),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),Y.nextNode(),r.push({type:2,index:++n});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===E)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(M,t+1));)r.push({type:7,index:n}),t+=M.length-1}n++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);Y.currentNode=s;let n=Y.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new tt(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new ot(n,this,t)),this._$AV.push(e),r=i[++a]}o!==r?.index&&(n=Y.nextNode(),o++)}return Y.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new tt(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=J(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=J(this,s[i+a],e,a),r===W&&(r=this._$AH[a]),o||=!T(r)||r!==this._$AH[a],r===K?t=K:t!==K&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class nt extends et{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??K)===W)return;const i=this._$AH,s=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==K&&(i===K||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(X,tt),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let lt=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new tt(e.insertBefore(H(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};lt._$litElement$=!0,lt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:lt});const dt=rt.litElementPolyfillSupport;dt?.({LitElement:lt}),(rt.litElementVersions??=[]).push("4.2.2");const ct=/\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM|M|Do|DD|D|dddd|ddd|dd|HH|H|hh|h|mm|ss|A|a/g;function ht(t){return t<10?`0${t}`:String(t)}function pt(t,e,i){return new Intl.DateTimeFormat(e,i).format(t)}function ut(t,e,i=1){return new Intl.NumberFormat(e,{maximumFractionDigits:i}).format(t)}function mt(){return document.querySelector("home-assistant")}function bt(){return mt()?.shadowRoot?.querySelector("home-assistant-main")??null}function ft(){const t=bt()?.shadowRoot,e=t?.querySelector("ha-drawer partial-panel-resolver")??t?.querySelector("partial-panel-resolver"),i=(e?.shadowRoot??e)?.querySelector("ha-panel-lovelace");return i?.shadowRoot?.querySelector("hui-root")??null}const gt=new Set;let _t=!1;function yt(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}function vt(t,e,i="tap"){yt(t,"hass-action",{config:e,action:i})}function wt(t,e){yt(t,"hass-more-info",{entityId:e})}function xt(t,e,i,s){let n,o=!1;return t.connection.subscribeMessage(t=>{t.error?s?.(t.error):"result"in t&&i(t.result)},{type:"render_template",template:e,report_errors:!0}).then(t=>{o?t().catch(()=>{}):n=t}).catch(t=>s?.(t?.message??String(t))),()=>{o=!0,n?.().catch(()=>{})}}function $t(t){return"boolean"==typeof t?t:"number"==typeof t?0!==t:["true","on","yes","1"].includes(String(t??"").trim().toLowerCase())}const kt=new Set(["off","unavailable","unknown","closed","locked","idle","standby","paused","not_home","false",""]);function St(t){return void 0!==t&&!kt.has(t)}function At(t,e){return t.states[e]?.attributes.friendly_name??e}function Mt(t,e){const i=t.states[e];if(!i)return"";try{if(t.formatEntityState)return t.formatEntityState(i)}catch{}const s=i.attributes.unit_of_measurement;return s?`${i.state} ${s}`:i.state}let Et;const Ct={"notifications.title":"Benachrichtigungen","notifications.one":"1 Benachrichtigung","notifications.many":"{n} Benachrichtigungen","notifications.dismiss":"Verwerfen","notifications.dismiss_all":"Alle verwerfen","notifications.close":"Schließen","attention.more":"+{n} weitere","attention.less":"Weniger anzeigen","trends.no_data":"Keine Daten","edit.open":"Sidebar bearbeiten","editor.title":"Sidebar bearbeiten","editor.save":"Speichern","editor.cancel":"Abbrechen","editor.saving":"Speichere …","editor.saved":"Gespeichert","editor.save_failed":"Speichern fehlgeschlagen: {error}","editor.yaml_mode":"Dieses Dashboard wird per YAML verwaltet. Kopiere die Konfiguration aus dem Reiter „YAML“ in deine Datei.","editor.not_admin":"Nur Administratoren können die Sidebar speichern.","editor.discard_title":"Änderungen verwerfen?","editor.discard":"Verwerfen","editor.keep_editing":"Weiter bearbeiten","editor.tab.general":"Kopfbereich","editor.tab.menu":"Menü","editor.tab.status":"Status","editor.tab.trends":"Verläufe","editor.tab.cards":"Karten","editor.tab.layout":"Layout","editor.tab.yaml":"YAML","editor.add_item":"Eintrag hinzufügen","editor.add_views":"Ansichten übernehmen","editor.add_views_hint":"Fügt für jede Ansicht dieses Dashboards, die noch fehlt, einen Menüpunkt hinzu.","editor.move_up":"Nach oben","editor.move_down":"Nach unten","editor.remove":"Entfernen","editor.legacy_js":"JavaScript-Aktion (service-js) – nur im YAML-Reiter bearbeitbar.","editor.new_item":"Neuer Eintrag","editor.cards_hint":"Beliebige Lovelace-Karten, die unten in der Sidebar angezeigt werden (YAML-Liste).","editor.yaml_hint":"Die komplette Sidebar-Konfiguration. Hier lassen sich auch Optionen bearbeiten, die der Editor nicht anbietet.","editor.glance_hint":"Symbole unten in der Sidebar oder Hinweiszeilen im Bereich „Achtung“.","editor.trends_hint":"Wischbare Verlaufsdiagramme unter dem Menü, eine Seite pro Kennzahl.","field.title":"Titel","field.clock":"Uhr","field.clock.none":"Keine","field.clock.digital":"Digital","field.clock.analog":"Analog","field.clock.both":"Analog und digital","field.digitalClockWithSeconds":"Sekunden anzeigen","field.twelveHourVersion":"12-Stunden-Format","field.period":"AM/PM anzeigen","field.date":"Datum anzeigen","field.dateFormat":"Datumsformat (z. B. dddd, D. MMMM – leer = automatisch)","field.weatherEntity":"Wetter-Entität","field.presence":"Personen","field.template":"Hinweise (Template, eine Zeile pro <li>)","field.menuStyle":"Menü-Stil","field.menuStyle.list":"Liste","field.menuStyle.wide":"Breite Pills","field.menuStyle.buttons":"Kacheln","field.menuStyle.grid":"Raster","field.showLabel":"Beschriftung anzeigen","field.updateMenu":"Aktuelle Ansicht hervorheben","field.name":"Name","field.icon":"Symbol","field.tap_action":"Aktion beim Tippen","field.hold_action":"Aktion beim Halten","field.state":"Aktiv, wenn diese Entität an ist","field.conditional":"Nur anzeigen, wenn (Template)","field.colors":"Farben","field.background_color":"Hintergrund","field.icon_color":"Symbolfarbe","field.text_color":"Textfarbe","field.advanced":"Erweitert","field.notifications":"HA-Benachrichtigungen anzeigen","field.glancePosition":"Statusleiste","field.glancePosition.bottom":"Symbole unten","field.glancePosition.attention":"Hinweiszeilen „Achtung“","field.entity":"Entität","field.label":"Text ({name}, {state}, {unit})","field.show_state":"Zustand anzeigen","field.show":"Anzeigen, wenn","field.show.always":"Immer","field.show.active":"Entität aktiv (an/offen …)","field.show.state":"Zustand ist …","field.show.state_not":"Zustand ist nicht …","field.show.numeric_above":"Wert über …","field.show.numeric_below":"Wert unter …","field.show.sun_below_horizon":"Sonne untergegangen","field.show.sun_above_horizon":"Sonne aufgegangen","field.show_value":"Zustand / Schwellwert","field.tone":"Dringlichkeit","field.tone.alert":"Alarm","field.tone.warning":"Warnung","field.tone.info":"Info","field.ranges":"Zeiträume (z. B. 24h, 7d)","field.autoAdvance":"Automatisch weiterblättern (Sekunden, 0 = aus)","field.entities":"Sensoren (bis zu 3, gleiche Einheit)","field.bands":"Bereiche","field.bands.none":"Keine","field.bands.aqi":"Luftqualität (AQI)","field.min":"Minimum","field.max":"Maximum","field.cards":"Karten","field.cardStyle":"CSS für die Karten","field.accentColor":"Akzentfarbe (CSS, leer = Theme)","field.width":"Breite in %","field.width.mobile":"Breite Handy (%)","field.width.tablet":"Breite Tablet (%)","field.width.desktop":"Breite Desktop (%)","field.breakpoints.mobile":"Handy bis (px)","field.breakpoints.tablet":"Tablet bis (px)","field.hideTopMenu":"HA-Kopfzeile ausblenden","field.showTopMenuOnMobile":"Kopfzeile auf dem Handy trotzdem zeigen","field.hideHassSidebar":"HA-Seitenleiste ausblenden","field.hideOnPath":"Auf diesen Pfaden ausblenden (einer pro Zeile)","field.style":"Eigenes CSS","field.debug":"Debug-Ausgaben in der Konsole","field.sidebar":"Konfiguration","aqi.0":"Gut","aqi.1":"Mäßig","aqi.2":"Ungesund für Empfindliche","aqi.3":"Ungesund","aqi.4":"Sehr ungesund","aqi.5":"Gefährlich"},zt={"notifications.title":"Notifications","notifications.one":"1 notification","notifications.many":"{n} notifications","notifications.dismiss":"Dismiss","notifications.dismiss_all":"Dismiss all","notifications.close":"Close","attention.more":"+{n} more","attention.less":"Show less","trends.no_data":"No data","edit.open":"Edit sidebar","editor.title":"Edit sidebar","editor.save":"Save","editor.cancel":"Cancel","editor.saving":"Saving …","editor.saved":"Saved","editor.save_failed":"Saving failed: {error}","editor.yaml_mode":'This dashboard is managed in YAML. Copy the configuration from the "YAML" tab into your file.',"editor.not_admin":"Only administrators can save the sidebar.","editor.discard_title":"Discard changes?","editor.discard":"Discard","editor.keep_editing":"Keep editing","editor.tab.general":"Header","editor.tab.menu":"Menu","editor.tab.status":"Status","editor.tab.trends":"Trends","editor.tab.cards":"Cards","editor.tab.layout":"Layout","editor.tab.yaml":"YAML","editor.add_item":"Add item","editor.add_views":"Add views","editor.add_views_hint":"Adds a menu item for every view of this dashboard that is not in the menu yet.","editor.move_up":"Move up","editor.move_down":"Move down","editor.remove":"Remove","editor.legacy_js":"JavaScript action (service-js) – edit it in the YAML tab.","editor.new_item":"New item","editor.cards_hint":"Any Lovelace cards, shown at the bottom of the sidebar (YAML list).","editor.yaml_hint":"The complete sidebar configuration, including options the editor does not offer.","editor.glance_hint":"Icons at the bottom of the sidebar, or alert rows in the attention zone.","editor.trends_hint":"Swipeable history charts below the menu, one page per metric.","field.title":"Title","field.clock":"Clock","field.clock.none":"None","field.clock.digital":"Digital","field.clock.analog":"Analog","field.clock.both":"Analog and digital","field.digitalClockWithSeconds":"Show seconds","field.twelveHourVersion":"12-hour format","field.period":"Show AM/PM","field.date":"Show date","field.dateFormat":"Date format (e.g. dddd, MMMM D – empty = automatic)","field.weatherEntity":"Weather entity","field.presence":"People","field.template":"Messages (template, one per <li>)","field.menuStyle":"Menu style","field.menuStyle.list":"List","field.menuStyle.wide":"Wide pills","field.menuStyle.buttons":"Tiles","field.menuStyle.grid":"Grid","field.showLabel":"Show labels","field.updateMenu":"Highlight current view","field.name":"Name","field.icon":"Icon","field.tap_action":"Tap action","field.hold_action":"Hold action","field.state":"Active while this entity is on","field.conditional":"Only show when (template)","field.colors":"Colors","field.background_color":"Background","field.icon_color":"Icon color","field.text_color":"Text color","field.advanced":"Advanced","field.notifications":"Show HA notifications","field.glancePosition":"Status bar","field.glancePosition.bottom":"Icons at the bottom","field.glancePosition.attention":'Alert rows in "attention"',"field.entity":"Entity","field.label":"Text ({name}, {state}, {unit})","field.show_state":"Show state","field.show":"Show when","field.show.always":"Always","field.show.active":"Entity active (on/open …)","field.show.state":"State is …","field.show.state_not":"State is not …","field.show.numeric_above":"Value above …","field.show.numeric_below":"Value below …","field.show.sun_below_horizon":"Sun has set","field.show.sun_above_horizon":"Sun is up","field.show_value":"State / threshold","field.tone":"Severity","field.tone.alert":"Alert","field.tone.warning":"Warning","field.tone.info":"Info","field.ranges":"Ranges (e.g. 24h, 7d)","field.autoAdvance":"Auto advance (seconds, 0 = off)","field.entities":"Sensors (up to 3, same unit)","field.bands":"Bands","field.bands.none":"None","field.bands.aqi":"Air quality (AQI)","field.min":"Minimum","field.max":"Maximum","field.cards":"Cards","field.cardStyle":"CSS for the cards","field.accentColor":"Accent color (CSS, empty = theme)","field.width":"Width in %","field.width.mobile":"Phone width (%)","field.width.tablet":"Tablet width (%)","field.width.desktop":"Desktop width (%)","field.breakpoints.mobile":"Phone up to (px)","field.breakpoints.tablet":"Tablet up to (px)","field.hideTopMenu":"Hide HA header","field.showTopMenuOnMobile":"Still show the header on phones","field.hideHassSidebar":"Hide HA sidebar","field.hideOnPath":"Hide on these paths (one per line)","field.style":"Custom CSS","field.debug":"Debug output in the console","field.sidebar":"Configuration","aqi.0":"Good","aqi.1":"Moderate","aqi.2":"Unhealthy for sensitive groups","aqi.3":"Unhealthy","aqi.4":"Very unhealthy","aqi.5":"Hazardous"};function Ht(t,e,i){let s=((t??"").startsWith("de")?Ct:zt)[e]??zt[e]??e;if(i)for(const[t,e]of Object.entries(i))s=s.replace(`{${t}}`,String(e));return s}class Tt extends lt{constructor(){super(...arguments),this.cards=[],this._elements=[],this._builtFor=""}updated(t){const e=JSON.stringify([this.cards,this.cardStyle]);e!==this._builtFor?(this._builtFor=e,this._build()):t.has("hass")&&this._elements.forEach(t=>t.hass=this.hass)}async _build(){const t=this._builtFor,e=await(window.loadCardHelpers?.());if(!e||t!==this._builtFor)return;const i=this.renderRoot.querySelector(".cards");i&&(this._elements=this.cards.map(t=>{const i=e.createCardElement(t);return i.hass=this.hass,this.cardStyle&&this._injectStyle(i,this.cardStyle),i}),i.replaceChildren(...this._elements))}_injectStyle(t,e,i=0){if(t.shadowRoot){const i=document.createElement("style");i.textContent=e,t.shadowRoot.appendChild(i)}else i<30&&window.setTimeout(()=>this._injectStyle(t,e,i+1),100)}render(){return q`<div class="cards"></div>`}}Tt.properties={hass:{attribute:!1},cards:{attribute:!1},cardStyle:{}},Tt.styles=o`
    .cards {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `,customElements.get("sidebar-card-cards")||customElements.define("sidebar-card-cards",Tt);class Ot extends lt{constructor(){super(...arguments),this.mode="digital",this.seconds=!1,this.hour12=!1,this.period=!1,this._now=new Date}connectedCallback(){super.connectedCallback(),this._schedule()}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._timer),this._timer=void 0}_schedule(){window.clearTimeout(this._timer);const t=this.seconds||"digital"!==this.mode,e=Date.now(),i=t?1e3-e%1e3:6e4-e%6e4;this._timer=window.setTimeout(()=>{this._now=new Date,this._schedule()},i+5)}updated(t){(t.has("seconds")||t.has("mode"))&&this._schedule()}_analog(){const t=this._now,e=t.getSeconds(),i=t.getMinutes()+e/60,s=t.getHours()%12+i/60,n=Array.from({length:12},(t,e)=>{const i=e%3==0;return I`<line class="tick ${i?"major":""}" x1="50" y1=${i?6:7} x2="50" y2=${i?13:11}
        transform="rotate(${30*e} 50 50)"></line>`});return q`<svg class="analog" viewBox="0 0 100 100" role="img" aria-label=${t.toLocaleTimeString()}>
      <circle class="face" cx="50" cy="50" r="48"></circle>
      ${n}
      <line class="hand hour" x1="50" y1="50" x2="50" y2="27" transform="rotate(${30*s} 50 50)"></line>
      <line class="hand minute" x1="50" y1="50" x2="50" y2="14" transform="rotate(${6*i} 50 50)"></line>
      <line class="hand second" x1="50" y1="58" x2="50" y2="11" transform="rotate(${6*e} 50 50)"></line>
      <circle class="pin" cx="50" cy="50" r="2.6"></circle>
    </svg>`}render(){const{time:t,suffix:e}=function(t,e){let i=`${ht(e.hour12?t.getHours()%12||12:t.getHours())}:${ht(t.getMinutes())}`;return e.seconds&&(i+=`:${ht(t.getSeconds())}`),{time:i,suffix:e.hour12&&e.period?t.getHours()<12?"am":"pm":""}}(this._now,{seconds:this.seconds,hour12:this.hour12,period:this.period});return q`
      ${"analog"===this.mode||"both"===this.mode?this._analog():K}
      ${"digital"===this.mode||"both"===this.mode?q`<div class="digital ${this.seconds?"with-seconds":""}">
            ${t}${e?q`<span class="suffix">${e}</span>`:K}
          </div>`:K}
    `}}Ot.properties={mode:{},seconds:{type:Boolean},hour12:{type:Boolean},period:{type:Boolean},_now:{state:!0}},Ot.styles=o`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
      container-type: inline-size;
    }
    .digital {
      font-size: clamp(44px, 30cqi, 112px);
      line-height: 0.95;
      font-weight: 250;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
      color: var(--sb-text);
    }
    .digital.with-seconds {
      font-size: clamp(36px, 22cqi, 84px);
    }
    .suffix {
      font-size: 0.32em;
      margin-left: 0.25em;
      letter-spacing: 0;
      color: var(--sb-muted);
      text-transform: uppercase;
    }
    .analog {
      width: min(100%, 220px);
      aspect-ratio: 1;
      align-self: center;
    }
    .face {
      fill: var(--face-color, color-mix(in srgb, var(--sb-text) 4%, transparent));
      stroke: var(--face-border-color, color-mix(in srgb, var(--sb-text) 12%, transparent));
      stroke-width: 1;
    }
    .tick {
      stroke: var(--sb-muted);
      stroke-width: 1;
      stroke-linecap: round;
    }
    .tick.major {
      stroke: var(--sb-text);
      stroke-width: 2;
    }
    .hand {
      stroke: var(--clock-hands-color, var(--sb-text));
      stroke-linecap: round;
    }
    .hour {
      stroke-width: 4;
    }
    .minute {
      stroke-width: 2.6;
    }
    .second {
      stroke: var(--clock-seconds-hand-color, var(--sb-accent));
      stroke-width: 1.2;
    }
    .pin {
      fill: var(--clock-middle-background, var(--sb-accent));
      stroke: var(--clock-middle-border, none);
    }
  `,customElements.get("sidebar-card-clock")||customElements.define("sidebar-card-clock",Ot);const Pt=1,Nt=t=>(...e)=>({_$litDirective$:t,values:e});let Dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const jt=Nt(class extends Dt{constructor(t){if(super(t),t.type!==Pt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return W}}),Lt="important",Rt=" !"+Lt,Ut=Nt(class extends Dt{constructor(t){if(super(t),t.type!==Pt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(Rt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?Lt:""):i[t]=s}}return W}}),Bt=25;function Ft(t,e){const i=Number(t);return Number.isFinite(i)?Math.min(Math.max(i,0),90):e}function qt(t){switch(t.action){case"navigate":return{action:"navigate",navigation_path:t.navigation_path};case"url":return{action:"url",url_path:t.url_path};case"more-info":return{action:"more-info",entity:t.entity};case"toggle":return{action:"toggle",entity:t.entity};case"call-service":case"perform-action":return{action:"perform-action",perform_action:t.service,data:t.service_data};case"none":return{action:"none"};case void 0:return t.entity?{action:"toggle",entity:t.entity}:void 0;default:return}}function It(t){return t.tap_action??qt(t)}function Wt(t){const e=It(t);return"navigate"===e?.action?e.navigation_path:void 0}function Kt(t){return!t.tap_action&&"service-js"===t.action}function Vt(t){return t?Array.isArray(t)?{position:"bottom",items:t.filter(t=>t?.entity)}:{position:"attention"===t.position?"attention":"bottom",items:(t.items??[]).filter(t=>t?.entity)}:{position:"bottom",items:[]}}function Yt(t){return(t??[]).map(t=>"string"==typeof t?{entity:t}:t).filter(t=>!!t?.entity)}function Zt(t){return Array.isArray(t.cards)?t.cards.filter(t=>t?.type):t.bottomCard?.type?[{type:t.bottomCard.type,...t.bottomCard.cardOptions??{}}]:[]}function Gt(t){if(Array.isArray(t))return t.map(t=>Gt(t));if(t&&"object"==typeof t){const e={};for(const[i,s]of Object.entries(t))null!=s&&""!==s&&("object"!=typeof s||Array.isArray(s)||0!==Object.keys(s).length)&&(e[i]=Gt(s));return e}return t}function Xt(t){return t?t.split(/[?#]/)[0].replace(/\/+$/,"")||"/":""}class Jt extends lt{constructor(){super(...arguments),this.items=[],this.menuStyle="list",this.showLabel=!0,this.updateMenu=!0,this.path="",this._conditions=new Map,this._subs=new Map,this._held=!1}disconnectedCallback(){super.disconnectedCallback(),this._subs.forEach(t=>t()),this._subs.clear()}connectedCallback(){super.connectedCallback(),this._syncConditions()}willUpdate(t){(t.has("items")||t.has("hass")&&!t.get("hass"))&&this._syncConditions()}_syncConditions(){if(!this.hass||!this.isConnected)return;const t=new Set(this.items.map(t=>t.conditional?.trim()).filter(t=>!!t));for(const[e,i]of this._subs)t.has(e)||(i(),this._subs.delete(e),this._conditions.delete(e));for(const e of t)this._subs.has(e)||this._subs.set(e,xt(this.hass,e,t=>this._setCondition(e,$t(t)),t=>{console.warn("sidebar-card: conditional template failed:",e,t),this._setCondition(e,!0)}))}_setCondition(t,e){this._conditions.get(t)!==e&&(this._conditions=new Map(this._conditions).set(t,e))}_visible(t){const e=t.conditional?.trim();return!e||!0===this._conditions.get(e)}_isActive(t){if(t.state&&St(this.hass?.states[t.state]?.state))return!0;if(!this.updateMenu)return!1;const e=Xt(Wt(t));return!!e&&e===Xt(this.path)}_pointerDown(t){this._held=!1,window.clearTimeout(this._holdTimer),t.hold_action&&"none"!==t.hold_action.action&&(this._holdTimer=window.setTimeout(()=>{this._held=!0,this._fire(t,"hold")},500))}_pointerUp(){window.clearTimeout(this._holdTimer)}_click(t){this._held?this._held=!1:this._fire(t,"tap")}_fire(t,e){if("tap"===e&&Kt(t)){try{!function(t,e){const i=String(t).replace(/^\[\[\[\s*|\s*\]\]\]$/g,"");new Function(i).call(e)}(t.service??"",this)}catch(t){console.error("sidebar-card: service-js failed",t)}return}const i=It(t),s="tap"===e?i:t.hold_action;s&&"none"!==s.action&&vt(this,{entity:s.entity??t.entity??t.state,tap_action:i,hold_action:t.hold_action},e)}render(){const t=this.items.filter(t=>this._visible(t));if(!t.length)return K;const e=!this.showLabel&&"list"!==this.menuStyle;return q`<nav class="menu ${this.menuStyle}">
      ${t.map(t=>{const i=this._isActive(t),s=Ut({"--item-bg":t.background_color,"--item-icon":t.icon_color,"--item-text":t.text_color});return q`<button
          class=${jt({item:!0,active:i,"icon-only":e,colored:!!t.background_color})}
          style=${s}
          aria-current=${i?"page":"false"}
          title=${e?t.name??"":""}
          @pointerdown=${()=>this._pointerDown(t)}
          @pointerup=${this._pointerUp}
          @pointerleave=${this._pointerUp}
          @pointercancel=${this._pointerUp}
          @contextmenu=${e=>t.hold_action&&e.preventDefault()}
          @click=${()=>this._click(t)}
        >
          ${t.icon?q`<span class="icon"><ha-icon .icon=${t.icon}></ha-icon></span>`:K}
          ${e?K:q`<span class="label">${t.name??""}</span>`}
        </button>`})}
    </nav>`}}Jt.properties={hass:{attribute:!1},items:{attribute:!1},menuStyle:{},showLabel:{type:Boolean},updateMenu:{type:Boolean},path:{},_conditions:{state:!0}},Jt.styles=o`
    :host {
      display: block;
    }
    .menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .item {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 48px;
      padding: 10px 16px;
      border-radius: var(--sb-radius);
      color: var(--item-text, var(--sb-text));
      font-size: 17px;
      font-weight: 400;
      line-height: 1.25;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      transition: background-color 180ms ease, color 180ms ease, transform 120ms ease;
    }
    .item:hover {
      background: color-mix(in srgb, var(--sb-text) 6%, transparent);
    }
    .item:active {
      transform: scale(0.98);
    }
    .item:focus-visible {
      outline: 2px solid var(--sb-accent);
      outline-offset: 2px;
    }
    .icon {
      display: inline-flex;
      color: var(--item-icon, var(--sb-icon));
      --mdc-icon-size: 24px;
      transition: color 180ms ease;
    }
    .label {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .item.active {
      background: var(--sb-active-bg);
      color: var(--item-text, var(--sb-active-text));
      font-weight: 500;
    }
    .item.active .icon {
      color: var(--item-icon, var(--sb-active-icon));
    }

    /* list: indicator bar on the active row */
    .list .item.active::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 25%;
      bottom: 25%;
      width: 3px;
      border-radius: 3px;
      background: var(--sb-accent);
    }

    /* wide: filled pills with the icon in a circle */
    .wide {
      gap: 8px;
    }
    .wide .item {
      border-radius: 999px;
      padding: 6px 18px 6px 6px;
      background: var(--item-bg, color-mix(in srgb, var(--sb-text) 5%, transparent));
    }
    .wide .item .icon {
      width: 40px;
      height: 40px;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--sb-bg) 70%, transparent);
    }
    .wide .item:not(:has(.icon)) {
      padding-left: 20px;
    }
    .wide .item.active {
      background: var(--item-bg, var(--sb-active-bg));
      box-shadow: inset 0 0 0 2px var(--sb-accent);
    }

    /* buttons / grid: tiles with the icon above the label */
    .buttons,
    .grid {
      display: grid;
      gap: 8px;
    }
    .buttons {
      grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    }
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    }
    /* Narrow tiles: hyphenate by language instead of breaking anywhere. */
    .buttons .label,
    .grid .label {
      flex: none;
      max-width: 100%;
      overflow-wrap: normal;
      hyphens: auto;
      overflow: hidden;
    }
    .buttons .item,
    .grid .item {
      flex-direction: column;
      justify-content: center;
      text-align: center;
      gap: 8px;
      background: var(--item-bg, color-mix(in srgb, var(--sb-text) 5%, transparent));
    }
    .buttons .item {
      aspect-ratio: 1.15;
      font-size: 15px;
      padding: 12px;
    }
    .buttons .item .icon {
      --mdc-icon-size: 30px;
    }
    .grid .item {
      aspect-ratio: 1;
      padding: 8px 4px;
      font-size: 12px;
      gap: 6px;
    }
    .item.icon-only {
      min-height: 0;
    }
    .buttons .item.active,
    .grid .item.active {
      background: var(--item-bg, var(--sb-active-bg));
      box-shadow: inset 0 0 0 2px var(--sb-accent);
    }
    .label:empty {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .item {
        transition: none;
      }
    }
  `,customElements.get("sidebar-card-menu")||customElements.define("sidebar-card-menu",Jt);const Qt={alert:0,warning:1,info:2};function te(t){const[e,i]=t.split(":").map(Number);return 60*(e||0)+(i||0)}function ee(t,e,i){if(!e||"always"===e)return!0;const s="string"==typeof e?{condition:e}:e,n=t.states[s.entity||i],o=Array.isArray(s.state)?s.state:[s.state??""],a=n?parseFloat(n.state):NaN,r=new Date,l=60*r.getHours()+r.getMinutes();switch(s.condition){case"always":return!0;case"state":return!!n&&o.includes(n.state);case"state_not":return!n||!o.includes(n.state);case"numeric_above":return void 0!==s.threshold&&a>s.threshold;case"numeric_below":return void 0!==s.threshold&&a<s.threshold;case"time_after":return!!s.after&&l>=te(s.after);case"time_before":return!!s.before&&l<te(s.before);case"sun_below_horizon":return"below_horizon"===t.states["sun.sun"]?.state;case"sun_above_horizon":return"above_horizon"===t.states["sun.sun"]?.state;default:return!1}}function ie(t,e){e.tap_action?vt(t,{entity:e.entity,tap_action:e.tap_action}):wt(t,e.entity)}function se(t){return t.replace(/!\[[^\]]*]\([^)]*\)/g,"").replace(/\[([^\]]+)]\([^)]*\)/g,"$1").replace(/[*_`#>]+/g,"").trim()}class ne extends lt{constructor(){super(...arguments),this.items=[],this.notifications=!1,this._list=[],this._expanded=!1,this._panelOpen=!1,this._byId=new Map,this._subscribing=!1}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe()}updated(){this.notifications&&this.hass&&!this._unsub&&!this._subscribing&&this._subscribe(),!this.notifications&&this._unsub&&this._unsubscribe()}async _subscribe(){this._subscribing=!0;try{this._unsub=await this.hass.connection.subscribeMessage(t=>this._onMessage(t),{type:"persistent_notification/subscribe"}),this.isConnected||this._unsubscribe()}catch(t){console.warn("sidebar-card: could not subscribe to notifications",t)}finally{this._subscribing=!1}}_unsubscribe(){this._unsub?.().catch(()=>{}),this._unsub=void 0,this._byId.clear(),this._list=[]}_onMessage(t){"current"===t.type&&this._byId.clear();const e=t.notifications??{};"removed"===t.type?Object.keys(e).forEach(t=>this._byId.delete(t)):Object.values(e).forEach(t=>this._byId.set(t.notification_id,t)),this._list=[...this._byId.values()].sort((t,e)=>e.created_at.localeCompare(t.created_at)),this._list.length||(this._panelOpen=!1)}_dismiss(t){this.hass?.callService("persistent_notification","dismiss",{notification_id:t})}_dismissAll(){this._list.forEach(t=>this._dismiss(t.notification_id)),this._panelOpen=!1}_alerts(){const t=this.hass;return this.items.map(e=>{const i=function(t,e){const i=e.tone??"alert";if("string"==typeof i)return i;const s=parseFloat(t.states[e.entity]?.state??"");return Number.isNaN(s)?null:void 0!==i.alert_above&&s>i.alert_above||void 0!==i.alert_below&&s<i.alert_below?"alert":void 0!==i.warn_above&&s>i.warn_above||void 0!==i.warn_below&&s<i.warn_below?"warning":null}(t,e);return(e.show?ee(t,e.show,e.entity):"object"==typeof e.tone?null!==i:St(t.states[e.entity]?.state))&&i?{item:e,tone:i}:null}).filter(t=>!!t).sort((t,e)=>Qt[t.tone]-Qt[e.tone])}_panel(){const t=this.hass?.language;return q`<div class="panel" role="dialog" aria-label=${Ht(t,"notifications.title")}>
      <header>
        <h2>${Ht(t,"notifications.title")}</h2>
        <button class="icon-btn" aria-label=${Ht(t,"notifications.close")} @click=${()=>this._panelOpen=!1}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </header>
      <div class="list">
        ${this._list.map(e=>q`<article class="note">
            <div class="note-head">
              <strong>${e.title||Ht(t,"notifications.title")}</strong>
              <button class="icon-btn small" aria-label=${Ht(t,"notifications.dismiss")} @click=${()=>this._dismiss(e.notification_id)}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
            <p>${se(e.message)}</p>
            <time>${function(t,e){const i=(t.getTime()-Date.now())/1e3,s=new Intl.RelativeTimeFormat(e,{numeric:"auto"}),n=Math.abs(i);return n<60?s.format(Math.round(i),"second"):n<3600?s.format(Math.round(i/60),"minute"):n<86400?s.format(Math.round(i/3600),"hour"):s.format(Math.round(i/86400),"day")}(new Date(e.created_at),t??"en")}</time>
          </article>`)}
      </div>
      <button class="text-btn" @click=${this._dismissAll}>${Ht(t,"notifications.dismiss_all")}</button>
    </div>`}render(){if(!this.hass)return K;const t=this.hass.language,e=this._alerts(),i=this._expanded?e:e.slice(0,2),s=e.length-i.length,n=this.notifications?this._list:[];return this.toggleAttribute("empty",!e.length&&!n.length),e.length||n.length?q`
      <div class="zone">
        ${i.map(({item:t,tone:e})=>q`<button class="row ${e}" @click=${()=>ie(this,t)}>
            <ha-icon .icon=${t.icon??"mdi:alert-circle-outline"}></ha-icon>
            <span>${function(t,e){const i=t.states[e.entity],s=e.name??At(t,e.entity);if(!e.label)return s;const n=i?parseFloat(i.state):NaN,o=i?Number.isNaN(n)?Mt(t,e.entity):ut(n,t.language,2):"";return e.label.replace(/\{name\}/g,s).replace(/\{state\}/g,o).replace(/\{unit\}/g,i?.attributes.unit_of_measurement??"")}(this.hass,t)}</span>
          </button>`)}
        ${s>0||this._expanded&&e.length>2?q`<button class="more" @click=${()=>this._expanded=!this._expanded}>
              ${s>0?Ht(t,"attention.more",{n:s}):Ht(t,"attention.less")}
            </button>`:K}
        ${n.length?q`<button class="stack ${n.length>1?"stacked":""}" @click=${()=>this._panelOpen=!0}>
              <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
              <span class="stack-text">
                <strong>${1===n.length?Ht(t,"notifications.one"):Ht(t,"notifications.many",{n:n.length})}</strong>
                <small>${n[0].title||se(n[0].message)}</small>
              </span>
            </button>`:K}
      </div>
      ${this._panelOpen&&n.length?this._panel():K}
    `:K}}ne.properties={hass:{attribute:!1},items:{attribute:!1},notifications:{type:Boolean},_list:{state:!0},_expanded:{state:!0},_panelOpen:{state:!0}},ne.styles=o`
    :host {
      display: block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--sb-accent);
      outline-offset: 2px;
    }
    .zone {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .row {
      --tone: var(--error-color, #db4437);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--sb-radius);
      background: color-mix(in srgb, var(--tone) 14%, transparent);
      color: var(--sb-text);
      font-size: 15px;
      line-height: 1.3;
      --mdc-icon-size: 20px;
    }
    .row ha-icon {
      color: var(--tone);
      flex: none;
    }
    .row.warning {
      --tone: var(--warning-color, #ffa600);
    }
    .row.info {
      --tone: var(--info-color, #039be5);
    }
    .more {
      align-self: flex-start;
      padding: 4px 14px;
      font-size: 13px;
      color: var(--sb-muted);
    }
    .stack {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: var(--sb-radius);
      background: var(--sb-surface);
      box-shadow: var(--sb-shadow);
      color: var(--sb-text);
      --mdc-icon-size: 22px;
    }
    .stack ha-icon {
      color: var(--sb-accent);
      flex: none;
    }
    /* a second card peeking out underneath when there is more than one */
    .stack.stacked {
      margin-bottom: 6px;
    }
    .stack.stacked::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: -6px;
      height: 10px;
      border-radius: 0 0 var(--sb-radius) var(--sb-radius);
      background: var(--sb-surface);
      opacity: 0.6;
      z-index: -1;
    }
    .stack-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .stack-text strong {
      font-weight: 500;
      font-size: 15px;
    }
    .stack-text small {
      color: var(--sb-muted);
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Fixed, but contained by the sidebar host (contain: layout), so it
       covers the whole sidebar rather than just the sticky zone. */
    .panel {
      position: fixed;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: calc(16px + var(--sb-pad-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
      background: var(--sb-bg);
      animation: slide-in 220ms ease;
    }
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: var(--sb-text);
    }
    .icon-btn {
      display: inline-flex;
      padding: 10px;
      border-radius: 50%;
      color: var(--sb-icon);
    }
    .icon-btn.small {
      padding: 6px;
      --mdc-icon-size: 18px;
    }
    .list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .note {
      padding: 12px 14px;
      border-radius: var(--sb-radius);
      background: var(--sb-surface);
      color: var(--sb-text);
    }
    .note-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .note-head strong {
      font-weight: 500;
      padding-top: 4px;
    }
    .note p {
      margin: 6px 0;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-line;
      overflow-wrap: anywhere;
    }
    .note time {
      font-size: 12px;
      color: var(--sb-muted);
    }
    .text-btn {
      align-self: center;
      padding: 10px 18px;
      border-radius: 999px;
      background: var(--sb-active-bg);
      color: var(--sb-accent);
      font-weight: 500;
    }
    @media (prefers-reduced-motion: reduce) {
      .panel {
        animation: none;
      }
    }
  `;class oe extends lt{constructor(){super(...arguments),this.items=[]}render(){if(!this.hass)return K;const t=this.hass,e=this.items.filter(e=>ee(t,e.show,e.entity));return e.length?q`<div class="bar">
      ${e.map(e=>{const i=St(t.states[e.entity]?.state),s=e.name??At(t,e.entity);return q`<button class=${i?"active":""} title=${s} aria-label=${s} @click=${()=>ie(this,e)}>
          <ha-icon .icon=${e.icon??t.states[e.entity]?.attributes.icon??"mdi:circle-outline"}></ha-icon>
          ${e.show_state?q`<small>${Mt(t,e.entity)}</small>`:K}
        </button>`})}
    </div>`:K}}oe.properties={hass:{attribute:!1},items:{attribute:!1}},oe.styles=o`
    .bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 4px;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 48px;
      padding: 10px 8px;
      border-radius: var(--sb-radius);
      color: var(--sb-icon);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      --mdc-icon-size: 24px;
    }
    button:focus-visible {
      outline: 2px solid var(--sb-accent);
    }
    button.active {
      color: var(--sb-accent);
      background: var(--sb-active-bg);
    }
    small {
      font-size: 11px;
      color: var(--sb-muted);
    }
  `,customElements.get("sidebar-card-attention")||customElements.define("sidebar-card-attention",ne),customElements.get("sidebar-card-glance")||customElements.define("sidebar-card-glance",oe);const ae=["var(--sb-accent)","var(--orange-color, #ff9800)","var(--cyan-color, #00bcd4)"],re=[{max:50,label:"aqi.0",color:"#00c853"},{max:100,label:"aqi.1",color:"#ffd600"},{max:150,label:"aqi.2",color:"#ff9100"},{max:200,label:"aqi.3",color:"#ff1744"},{max:300,label:"aqi.4",color:"#aa00ff"},{max:500,label:"aqi.5",color:"#880e4f"}];function le(t){const e=/^(\d+(?:\.\d+)?)\s*([hd])$/i.exec(String(t).trim());return e?Number(e[1])*("d"===e[2].toLowerCase()?864e5:36e5):864e5}function de(t){return(t.entities?.length?t.entities:t.entity?[t.entity]:[]).map(t=>"string"==typeof t?{entity:t}:t).filter(t=>!!t?.entity).slice(0,3)}class ce extends lt{constructor(){super(...arguments),this._page=0,this._range=0,this._hover=null,this._data=new Map,this._subKey="",this._pausedUntil=0,this._downX=null}get _items(){return(this.config?.items??[]).filter(t=>de(t).length)}get _ranges(){return this.config?.ranges?.length?this.config.ranges:["24h","7d"]}connectedCallback(){super.connectedCallback(),this._startAuto()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe(),window.clearInterval(this._autoTimer)}updated(t){if(t.has("config")&&this._startAuto(),!this.hass)return;const e=[...new Set(this._items.flatMap(t=>de(t).map(t=>t.entity)))],i=`${e.join(",")}|${this._ranges[this._range]}`;i!==this._subKey&&this._subscribe(e,i)}_unsubscribe(){this._unsub?.().catch(()=>{}),this._unsub=void 0,this._subKey=""}async _subscribe(t,e){if(this._unsubscribe(),this._subKey=e,this._data=new Map,!t.length||!this.hass)return;const i=le(this._ranges[this._range]);try{const s=await this.hass.connection.subscribeMessage(t=>this._onHistory(t),{type:"history/stream",entity_ids:t,start_time:new Date(Date.now()-i).toISOString(),minimal_response:!0,no_attributes:!0,significant_changes_only:!1});this._subKey===e&&this.isConnected?this._unsub=s:s().catch(()=>{})}catch(t){console.warn("sidebar-card: could not subscribe to history",t)}}_onHistory(t){const e=t?.states;if(e){for(const t of Object.keys(e)){const i=this._data.get(t)??[];for(const s of e[t]??[]){const t=parseFloat(s.s??s.state),e=void 0!==s.lu?1e3*s.lu:void 0!==s.lc?1e3*s.lc:Date.parse(s.last_updated??s.last_changed);Number.isNaN(t)||Number.isNaN(e)||i.push({t:e,v:t})}i.sort((t,e)=>t.t-e.t),this._data.set(t,i)}this.requestUpdate()}}_points(t,e,i){const s=(this._data.get(t)??[]).filter(t=>t.t>=e),n=parseFloat(this.hass?.states[t]?.state??"");return Number.isNaN(n)||s.push({t:i,v:n}),function(t,e,i){if(t.length<=120)return t;const s=(i-e)/120,n=[];let o=0;for(let i=0;i<120;i++){const a=e+(i+1)*s;let r=0,l=0;for(;o<t.length&&t[o].t<a;)r+=t[o].v,l++,o++;l&&n.push({t:e+(i+.5)*s,v:r/l})}return n}(s,e,i)}_startAuto(){window.clearInterval(this._autoTimer);const t=Number(this.config?.autoAdvance??0),e=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;!this.isConnected||t<3||e||(this._autoTimer=window.setInterval(()=>{Date.now()<this._pausedUntil||this._items.length<2||this._go(this._page+1)},1e3*t))}_pause(){this._pausedUntil=Date.now()+6e4}_go(t){const e=this._items.length;this._page=e?(t+e)%e:0,this._hover=null}_onDown(t){this._pause(),this._downX=t.clientX}_onUp(t){if(null===this._downX)return;const e=t.clientX-this._downX;this._downX=null,Math.abs(e)>40&&this._go(this._page+(e<0?1:-1))}_onMove(t,e){if("mouse"!==t.pointerType||e<2)return;const i=t.currentTarget.getBoundingClientRect();this._hover=Math.min(Math.max((t.clientX-i.left)/i.width,0),1)}render(){const t=this._items;if(!this.hass||!t.length)return K;const e=this.hass.language,i=t[Math.min(this._page,t.length-1)],s=de(i),n=Date.now(),o=n-le(this._ranges[this._range]),a=s.map(t=>this._points(t.entity,o,n)),r=a.flat().map(t=>t.v),l="aqi"===i.bands?re:Array.isArray(i.bands)?i.bands:[];let d=i.min??Math.min(...r),c=i.max??Math.max(...r);Number.isFinite(d)&&Number.isFinite(c)||(d=0,c=1),c-d<1e-9&&(d-=1,c+=1);const h=.08*(c-d);void 0===i.min&&(d-=h),void 0===i.max&&(c+=h);const p=t=>(t-o)/(n-o)*100,u=t=>40-(t-d)/(c-d)*40,m=s[0],b=this.hass.states[m.entity],f=b?.attributes.unit_of_measurement??"",g=parseFloat(b?.state??""),_=null!==this._hover&&a[0].length?a[0][Math.round(this._hover*(a[0].length-1))]:null,y=_?_.v:g,v=Number.isNaN(g)?void 0:l.find(t=>g<=t.max),w=t=>t.map((t,e)=>`${e?"L":"M"}${p(t.t).toFixed(2)},${u(t.v).toFixed(2)}`).join("");return q`<section
      class="tile"
      @pointerdown=${this._onDown}
      @pointerup=${this._onUp}
      @pointercancel=${()=>this._downX=null}
    >
      <header>
        <div class="title">${i.name??At(this.hass,m.entity)}</div>
        ${v?q`<span class="pill" style="--band:${v.color}">${Ht(e,v.label)}</span>`:K}
      </header>
      <div class="value">
        ${Number.isNaN(y)?"–":ut(y,e)}<span class="unit">${f}</span>
        ${_?q`<span class="when">${new Date(_.t).toLocaleString(e,{weekday:"short",hour:"2-digit",minute:"2-digit"})}</span>`:K}
      </div>
      ${s.length>1?q`<div class="legend">
            ${s.map((t,i)=>{const s=parseFloat(this.hass.states[t.entity]?.state??"");return q`<span><i style="background:${ae[i]}"></i>${t.name??At(this.hass,t.entity)}
                ${Number.isNaN(s)?"":ut(s,e)}</span>`})}
          </div>`:K}
      <div class="chart" @pointermove=${t=>this._onMove(t,a[0].length)} @pointerleave=${()=>this._hover=null}>
        ${r.length?I`<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stop-color=${ae[0]} stop-opacity="0.28"></stop>
                  <stop offset="1" stop-color=${ae[0]} stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              ${l.map((t,e)=>{const i=e?l[e-1].max:-1/0,s=u(Math.min(t.max,c)),n=u(Math.max(i,d));return n>s?I`<rect x="0" width="100" y=${s} height=${n-s} fill=${t.color} opacity="0.1"></rect>`:K})}
              ${a[0].length>1?I`<path class="area" d="${w(a[0])}L100,40L${p(a[0][0].t)},40Z"></path>`:K}
              ${a.map((t,e)=>t.length>1?I`<path class="line" d=${w(t)} stroke=${ae[e]}></path>`:K)}
              ${_?I`<line class="cursor" x1=${p(_.t)} x2=${p(_.t)} y1="0" y2="40"></line>`:K}
            </svg>`:q`<div class="empty">${Ht(e,"trends.no_data")}</div>`}
      </div>
      <footer>
        <div class="ranges">
          ${this._ranges.map((t,e)=>q`<button class=${e===this._range?"on":""} @click=${()=>{this._pause(),this._range=e}}>${t}</button>`)}
        </div>
        ${t.length>1?q`<div class="dots">
              ${t.map((t,e)=>q`<button class=${e===this._page?"on":""} aria-label=${String(e+1)} @click=${()=>{this._pause(),this._go(e)}}></button>`)}
            </div>`:K}
      </footer>
    </section>`}}ce.properties={hass:{attribute:!1},config:{attribute:!1},_page:{state:!0},_range:{state:!0},_hover:{state:!0}},ce.styles=o`
    :host {
      display: block;
    }
    .tile {
      padding: 14px 16px 10px;
      border-radius: calc(var(--sb-radius) + 4px);
      background: var(--sb-surface);
      box-shadow: var(--sb-shadow);
      color: var(--sb-text);
      touch-action: pan-y;
      user-select: none;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .title {
      font-size: 13px;
      color: var(--sb-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pill {
      flex: none;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      background: color-mix(in srgb, var(--band) 22%, transparent);
      border: 1px solid color-mix(in srgb, var(--band) 60%, transparent);
    }
    .value {
      margin-top: 2px;
      font-size: 30px;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 4px;
      flex-wrap: wrap;
    }
    .unit {
      font-size: 15px;
      color: var(--sb-muted);
    }
    .when {
      margin-left: auto;
      font-size: 12px;
      color: var(--sb-muted);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 12px;
      color: var(--sb-muted);
    }
    .legend i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .chart {
      height: 72px;
      margin: 8px 0 4px;
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .area {
      fill: url(#fill);
    }
    .line {
      fill: none;
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .cursor {
      stroke: var(--sb-muted);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      stroke-dasharray: 2 2;
    }
    .empty {
      height: 100%;
      display: grid;
      place-items: center;
      font-size: 13px;
      color: var(--sb-muted);
    }
    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    button {
      all: unset;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .ranges {
      display: flex;
      gap: 4px;
    }
    .ranges button {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      color: var(--sb-muted);
    }
    .ranges button.on {
      background: var(--sb-active-bg);
      color: var(--sb-accent);
      font-weight: 500;
    }
    .dots {
      display: flex;
      gap: 2px;
    }
    .dots button {
      width: 22px;
      height: 22px;
      display: grid;
      place-items: center;
    }
    .dots button::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--sb-muted);
      opacity: 0.4;
      transition: opacity 150ms ease, transform 150ms ease;
    }
    .dots button.on::after {
      opacity: 1;
      background: var(--sb-accent);
      transform: scale(1.2);
    }
  `,customElements.get("sidebar-card-trends")||customElements.define("sidebar-card-trends",ce);const he={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"};class pe extends lt{constructor(){super(...arguments),this.path="",this.editMode=!1,this._lines=[]}connectedCallback(){super.connectedCallback(),this._dateTimer=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._dateTimer),this._templateSub?.(),this._templateSub=void 0,this._template=void 0}_watchedIds(t){if(this._watched?.config===t)return this._watched.ids;const e=new Set;t.weatherEntity&&e.add(t.weatherEntity),t.presence.forEach(t=>e.add(t.entity)),t.menu.forEach(t=>t.state&&e.add(t.state));for(const i of t.glance.items)e.add(i.entity),"object"==typeof i.show&&i.show.entity&&e.add(i.show.entity);t.glance.items.length&&e.add("sun.sun");for(const i of t.trends?.items??[])for(const t of i.entities??(i.entity?[i.entity]:[]))e.add("string"==typeof t?t:t.entity);return this._watched={config:t,ids:[...e]},this._watched.ids}shouldUpdate(t){if(1!==t.size||!t.has("hass"))return!0;const e=t.get("hass"),i=this.hass;if(!e||!i||!this.config)return!0;if(e.language!==i.language||e.locale!==i.locale||e.entities!==i.entities)return!0;if(this._watchedIds(this.config).some(t=>e.states[t]!==i.states[t]))return!0;const s=this.renderRoot.querySelector("sidebar-card-cards");return s&&(s.hass=i),!1}willUpdate(){const t=this.config?.template;this.hass&&t!==this._template&&(this._templateSub?.(),this._templateSub=void 0,this._template=t,this._lines=[],t&&(this._templateSub=xt(this.hass,t,t=>this._lines=function(t){const e=String(t??"");if(/<(li|div)[\s>]/i.test(e))return[...(new DOMParser).parseFromString(`<body>${e}</body>`,"text/html").body.querySelectorAll("li, div")].filter(t=>!t.querySelector("li, div")).map(t=>t.textContent?.replace(/\s+/g," ").trim()??"").filter(Boolean);return e.split("\n").map(t=>t.trim()).filter(Boolean)}(t),t=>console.warn("sidebar-card: template failed:",t))))}_head(t,e){const i=t.weatherEntity?e.states[t.weatherEntity]:void 0,s=i?.attributes.temperature,n=t.date;return q`
      ${"none"!==t.clock?q`<sidebar-card-clock
            .mode=${t.clock}
            .seconds=${t.clockSeconds}
            .hour12=${t.hour12}
            .period=${t.period}
          ></sidebar-card-clock>`:K}
      ${t.title?q`<h1 class="title">${t.title}</h1>`:K}
      ${n||i?q`<div class="date-row">
            ${n?q`<span class="date">${o=new Date,a=e.language,r=t.dateFormat,r?r.replace(ct,(t,e)=>{if(void 0!==e)return e;switch(t){case"YYYY":return String(o.getFullYear());case"YY":return String(o.getFullYear()).slice(-2);case"MMMM":return pt(o,a,{month:"long"});case"MMM":return pt(o,a,{month:"short"});case"MM":return ht(o.getMonth()+1);case"M":return String(o.getMonth()+1);case"Do":return function(t,e){if(e.startsWith("en")){const e=["th","st","nd","rd"],i=t%100;return t+(e[(i-20)%10]||e[i]||e[0])}return`${t}.`}(o.getDate(),a);case"DD":return ht(o.getDate());case"D":return String(o.getDate());case"dddd":return pt(o,a,{weekday:"long"});case"ddd":return pt(o,a,{weekday:"short"});case"dd":return pt(o,a,{weekday:"narrow"});case"HH":return ht(o.getHours());case"H":return String(o.getHours());case"hh":return ht(o.getHours()%12||12);case"h":return String(o.getHours()%12||12);case"mm":return ht(o.getMinutes());case"ss":return ht(o.getSeconds());case"A":return o.getHours()<12?"AM":"PM";case"a":return o.getHours()<12?"am":"pm";default:return t}}):pt(o,a,{weekday:"long",day:"numeric",month:"long"})}</span>`:K}
            ${i?q`<button class="weather" @click=${()=>wt(this,i.entity_id)}>
                  <ha-icon .icon=${he[i.state]??"mdi:weather-partly-cloudy"}></ha-icon>
                  ${void 0!==s?q`<span>${ut(Number(s),e.language)}${i.attributes.temperature_unit??"°"}</span>`:K}
                </button>`:K}
          </div>`:K}
    `;var o,a,r}_presence(t,e){return t.presence.length?q`<div class="presence">
      ${t.presence.map(t=>{const i=e.states[t.entity],s=t.name??At(e,t.entity),n=i?.state??"unknown",o="home"===n?"home":"not_home"===n||"unknown"===n?"away":"zone",a=`${s}: ${i?e.formatEntityState?.(i)??n:n}`;return q`<button class="avatar ${o}" title=${a} aria-label=${a} @click=${()=>wt(this,t.entity)}>
          ${i?.attributes.entity_picture?q`<img src=${i.attributes.entity_picture} alt="" />`:q`<span>${function(t){return t.split(/\s+/).map(t=>t[0]).slice(0,2).join("").toUpperCase()}(s)}</span>`}
          <i></i>
        </button>`})}
    </div>`:K}render(){const t=this.config,e=this.hass;if(!t||!e)return K;const i="bottom"===t.glance.position&&t.glance.items.length,s="attention"===t.glance.position?t.glance.items:[];return q`
      ${t.accentColor?q`<style>:host{--sb-accent:${t.accentColor}}</style>`:K}
      ${t.style?q`<style>${t.style}</style>`:K}
      <div class="scroll">
        <header class="head">${this._head(t,e)}</header>
        ${this._presence(t,e)}
        ${this._lines.length?q`<ul class="info">${this._lines.map(t=>q`<li>${t}</li>`)}</ul>`:K}
        <sidebar-card-menu
          .hass=${e}
          .items=${t.menu}
          .menuStyle=${t.menuStyle}
          .showLabel=${t.showLabel}
          .updateMenu=${t.updateMenu}
          .path=${this.path}
        ></sidebar-card-menu>
        ${t.trends?q`<sidebar-card-trends .hass=${e} .config=${t.trends}></sidebar-card-trends>`:K}
        <div class="spacer"></div>
        ${t.cards.length?q`<sidebar-card-cards .hass=${e} .cards=${t.cards} .cardStyle=${t.cardStyle}></sidebar-card-cards>`:K}
      </div>
      ${t.notifications||s.length||i?q`<footer class="foot">
            ${t.notifications||s.length?q`<sidebar-card-attention .hass=${e} .items=${s} .notifications=${t.notifications}></sidebar-card-attention>`:K}
            ${i?q`<sidebar-card-glance .hass=${e} .items=${t.glance.items}></sidebar-card-glance>`:K}
          </footer>`:K}
      ${this.editMode?q`<button class="edit" title=${Ht(e.language,"edit.open")} aria-label=${Ht(e.language,"edit.open")}
            @click=${()=>yt(this,"sidebar-card-edit")}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </button>`:K}
    `}}pe.properties={hass:{attribute:!1},config:{attribute:!1},path:{},editMode:{type:Boolean,reflect:!0,attribute:"edit-mode"},_lines:{state:!0}},pe.styles=o`
    :host {
      /* Public variables from v1 keep working; everything else derives from the HA theme. */
      --sb-accent: var(--sidebar-accent-color, var(--primary-color));
      --sb-bg: var(--sidebar-background, var(--ha-card-background, var(--card-background-color, #fff)));
      --sb-text: var(--sidebar-text-color, var(--primary-text-color));
      --sb-muted: var(--sidebar-muted-color, var(--secondary-text-color));
      --sb-icon: var(--sidebar-icon-color, var(--secondary-text-color));
      --sb-active-text: var(--sidebar-selected-text-color, var(--sb-accent));
      --sb-active-icon: var(--sidebar-selected-icon-color, var(--sb-accent));
      --sb-active-bg: color-mix(in srgb, var(--sb-accent) 14%, transparent);
      --sb-surface: color-mix(in srgb, var(--sb-text) 5%, var(--sb-bg));
      --sb-shadow: none;
      --sb-radius: var(--sidebar-radius, 14px);

      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      contain: layout;
      background: var(--sb-bg);
      color: var(--sb-text);
      border-inline-end: 1px solid var(--sidebar-border-color, var(--divider-color, transparent));
      font-family: var(--ha-font-family-body, inherit);
    }
    .scroll {
      box-sizing: border-box;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      display: flex;
      flex-direction: column;
      gap: 22px;
      padding: 28px 18px calc(18px + env(safe-area-inset-bottom, 0px));
      /* Soft edge where content scrolls under the footer. */
      mask-image: linear-gradient(to bottom, #000 calc(100% - 20px), transparent);
    }
    .head {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 6px;
    }
    .title {
      margin: 0;
      font-size: 26px;
      font-weight: 400;
      line-height: 1.2;
    }
    .date-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .date {
      font-size: 19px;
      color: var(--sb-muted);
      font-weight: 400;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--sb-accent);
      outline-offset: 2px;
    }
    .weather {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px 4px 8px;
      border-radius: 999px;
      background: var(--sb-surface);
      font-size: 17px;
      font-variant-numeric: tabular-nums;
      --mdc-icon-size: 22px;
    }
    .weather ha-icon {
      color: var(--sb-accent);
    }
    .presence {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 0 6px;
    }
    .avatar {
      position: relative;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--sb-surface);
      display: grid;
      place-items: center;
      font-size: 14px;
      font-weight: 500;
      color: var(--sb-text);
      transition: opacity 200ms ease, filter 200ms ease;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar i {
      position: absolute;
      right: -1px;
      bottom: -1px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--sb-bg);
      background: var(--disabled-text-color, #9e9e9e);
    }
    .avatar.home i {
      background: var(--success-color, #43a047);
    }
    .avatar.zone i {
      background: var(--info-color, #039be5);
    }
    .avatar.away {
      opacity: 0.55;
      filter: grayscale(0.6);
    }
    .info {
      list-style: none;
      margin: 0;
      padding: 0 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .info li {
      font-size: 16px;
      line-height: 1.35;
      color: var(--sb-text);
    }
    .spacer {
      flex: 1;
      margin-top: -22px;
    }
    /* Alerts and the status bar stay in view; only the content above scrolls. */
    .foot {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px 18px calc(14px + env(safe-area-inset-bottom, 0px));
    }
    .foot:not(:has(> :not([empty]))) {
      display: none;
    }
    sidebar-card-attention[empty] {
      display: none;
    }
    /* Keep the clock clear of the edit button. */
    :host([edit-mode]) .scroll {
      padding-top: 68px;
    }
    .edit {
      position: absolute;
      top: 12px;
      inset-inline-end: 12px;
      z-index: 3;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--sb-accent);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 4px 14px rgb(0 0 0 / 0.25);
      animation: pop 200ms ease;
    }
    @keyframes pop {
      from {
        transform: scale(0.6);
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .edit {
        animation: none;
      }
    }
  `,customElements.get("sidebar-card")||customElements.define("sidebar-card",pe);class ue extends lt{constructor(){super(...arguments),this.items=[],this._open=null}_emit(t){yt(this,"items-changed",t)}_move(t,e){const i=t+e;if(i<0||i>=this.items.length)return;const s=[...this.items];[s[t],s[i]]=[s[i],s[t]],this._open===t?this._open=i:this._open===i&&(this._open=t),this._emit(s)}_remove(t){const e=this.items.filter((e,i)=>i!==t);this._open===t?this._open=null:null!==this._open&&this._open>t&&this._open--,this._emit(e)}_add(){const t=[...this.items,this.adapter.create()];this._open=t.length-1,this._emit(t)}_changed(t,e){e.stopPropagation();const i=this.adapter,s=this.items[t],n=i.fromForm?i.fromForm(s,e.detail.value):e.detail.value,o=[...this.items];o[t]=n,this._emit(o)}render(){const t=this.adapter;if(!t||!this.hass)return K;const e=this.hass.language;return q`
      <div class="list">
        ${this.items.map((i,s)=>{const n=this._open===s,o=t.readOnly?.(i),a=t.icon?.(i);return q`<div class="row ${n?"open":""}">
            <div class="row-head">
              <button class="toggle" aria-expanded=${n} @click=${()=>this._open=n?null:s}>
                <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                ${a?q`<ha-icon class="item-icon" .icon=${a}></ha-icon>`:K}
                <span class="name">${t.title(i,s)}</span>
              </button>
              <button class="icon-btn" title=${Ht(e,"editor.move_up")} ?disabled=${0===s} @click=${()=>this._move(s,-1)}>
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button class="icon-btn" title=${Ht(e,"editor.move_down")} ?disabled=${s===this.items.length-1}
                @click=${()=>this._move(s,1)}>
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
              <button class="icon-btn danger" title=${Ht(e,"editor.remove")} @click=${()=>this._remove(s)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            ${n?q`<div class="row-body">
                  ${o?q`<p class="note">${o}</p>`:q`<ha-form
                        .hass=${this.hass}
                        .data=${t.toForm?t.toForm(i):i}
                        .schema=${t.schema(i)}
                        .computeLabel=${this.computeLabel}
                        @value-changed=${t=>this._changed(s,t)}
                      ></ha-form>`}
                </div>`:K}
          </div>`})}
      </div>
      <button class="add" @click=${this._add}>
        <ha-icon icon="mdi:plus"></ha-icon>${Ht(e,"editor.add_item")}
      </button>
    `}}ue.properties={hass:{attribute:!1},items:{attribute:!1},adapter:{attribute:!1},computeLabel:{attribute:!1},_open:{state:!0}},ue.styles=o`
    :host {
      display: block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    button[disabled] {
      opacity: 0.3;
      pointer-events: none;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .row {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
      overflow: hidden;
    }
    .row.open {
      border-color: color-mix(in srgb, var(--primary-color) 50%, var(--divider-color));
    }
    .row-head {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px 6px 4px 4px;
    }
    .toggle {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 8px;
    }
    .chevron {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      transition: transform 150ms ease;
    }
    .open .chevron {
      transform: rotate(90deg);
    }
    .item-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-btn {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .icon-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .icon-btn.danger:hover {
      color: var(--error-color);
    }
    .row-body {
      padding: 4px 14px 16px;
    }
    .note {
      margin: 8px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .add {
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 999px;
      color: var(--primary-color);
      font-weight: 500;
      --mdc-icon-size: 20px;
    }
    .add:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
  `,customElements.get("sidebar-card-list-editor")||customElements.define("sidebar-card-list-editor",ue);const me=[{id:"general",icon:"mdi:clock-outline"},{id:"menu",icon:"mdi:menu"},{id:"status",icon:"mdi:bell-outline"},{id:"trends",icon:"mdi:chart-line"},{id:"cards",icon:"mdi:card-outline"},{id:"layout",icon:"mdi:page-layout-sidebar-left"},{id:"yaml",icon:"mdi:code-braces"}],be=t=>({name:t,selector:{boolean:{}}}),fe=(t,e=!1)=>({name:t,selector:{text:e?{multiline:!0}:{}}});class ge extends lt{constructor(){super(...arguments),this.config={},this._config={},this._tab="general",this._ready=!1,this._saving=!1,this._error="",this._dirty=!1,this._confirmDiscard=!1,this._onKey=t=>{"Escape"===t.key&&this._close()},this._t=(t,e)=>Ht(this._lang,t,e),this._label=t=>this._t(`field.${t.name}`),this._menuAdapter={title:(t,e)=>t.name||Wt(t)||`${this._t("editor.new_item")} ${e+1}`,icon:t=>t.icon,readOnly:t=>Kt(t)?this._t("editor.legacy_js"):void 0,create:()=>({name:"",tap_action:{action:"navigate"}}),schema:()=>[{type:"grid",name:"",schema:[fe("name"),{name:"icon",selector:{icon:{}}}]},{name:"tap_action",selector:{ui_action:{default_action:"none"}}},{name:"state",selector:{entity:{}}},{name:"conditional",selector:{template:{}}},{type:"expandable",name:"advanced",flatten:!0,title:this._t("field.advanced"),schema:[{name:"hold_action",selector:{ui_action:{default_action:"none"}}},{type:"grid",name:"",schema:[fe("background_color"),fe("icon_color"),fe("text_color")]}]}],toForm:t=>({...t,tap_action:It(t)}),fromForm:(t,e)=>e},this._glanceAdapter={title:(t,e)=>t.name||(t.entity&&this.hass?At(this.hass,t.entity):`${this._t("editor.new_item")} ${e+1}`),icon:t=>t.icon??(t.entity?this.hass?.states[t.entity]?.attributes.icon:void 0),create:()=>({entity:""}),schema:()=>{const t="attention"===this._glance.position;return[{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[fe("name"),{name:"icon",selector:{icon:{}}}]},...t?[fe("label")]:[be("show_state")],{type:"grid",name:"",schema:[{name:"show",selector:{select:{mode:"dropdown",options:this._options("show",["active","always","state","state_not","numeric_above","numeric_below","sun_below_horizon","sun_above_horizon"])}}},fe("show_value")]},...t?[{name:"tone",selector:{select:{mode:"dropdown",options:this._options("tone",["alert","warning","info"])}}}]:[],{name:"tap_action",selector:{ui_action:{default_action:"more-info"}}}]},toForm:t=>{const e=t.show,i=e?"string"==typeof e?e:e.condition:"active",s="object"==typeof e?e.threshold??(Array.isArray(e.state)?e.state.join(", "):e.state):void 0;return{...t,show:i,show_value:void 0===s?void 0:String(s),tone:"string"==typeof t.tone?t.tone:void 0}},fromForm:(t,e)=>{const{show:i,show_value:s,tone:n,...o}=e;let a={...o};if("state"===i||"state_not"===i){const t=String(s??"").split(",").map(t=>t.trim()).filter(Boolean);a.show={condition:i,state:t.length>1?t:t[0]??"on"}}else"numeric_above"===i||"numeric_below"===i?a.show={condition:i,threshold:Number(s)||0}:i&&"active"!==i&&(a.show=i);return a.tone=n??("object"==typeof t.tone?t.tone:void 0),a}},this._trendAdapter={title:(t,e)=>{const i=t.entity??("string"==typeof t.entities?.[0]?t.entities[0]:t.entities?.[0]?.entity);return t.name||(i&&this.hass?At(this.hass,i):`${this._t("editor.new_item")} ${e+1}`)},icon:()=>"mdi:chart-bell-curve-cumulative",create:()=>({entities:[]}),schema:()=>[fe("name"),{name:"entities",selector:{entity:{multiple:!0,filter:{domain:["sensor","input_number","number"]}}}},{name:"bands",selector:{select:{mode:"dropdown",options:this._options("bands",["none","aqi"])}}},{type:"grid",name:"",schema:[{name:"min",selector:{number:{mode:"box"}}},{name:"max",selector:{number:{mode:"box"}}}]}],toForm:t=>({...t,entities:t.entities?.length?t.entities.map(t=>"string"==typeof t?t:t.entity):t.entity?[t.entity]:[],bands:"aqi"===t.bands?"aqi":Array.isArray(t.bands)?void 0:"none"}),fromForm:(t,e)=>{const{entities:i,bands:s,entity:n,...o}=e,a=new Map((t.entities??[]).map(t=>"string"==typeof t?[t,t]:[t.entity,t])),r=(i??[]).slice(0,3),l={...o};return 1===r.length&&"object"!=typeof a.get(r[0])?l.entity=r[0]:l.entities=r.map(t=>a.get(t)??t),l.bands="aqi"===s?"aqi":"none"===s?void 0:t.bands,l}}}connectedCallback(){super.connectedCallback(),this._config=function(t){const e=structuredClone(t??{});return Array.isArray(e.sidebarMenu)&&(e.sidebarMenu=e.sidebarMenu.map(t=>{if(t.tap_action||Kt(t))return t;const{action:e,navigation_path:i,url_path:s,service:n,service_data:o,entity:a,active:r,...l}=t,d=qt(t);return d?{...l,tap_action:d}:l})),e.bottomCard&&!e.cards&&(e.cards=Zt(e),e.bottomCard.cardStyle&&(e.cardStyle=e.bottomCard.cardStyle),delete e.bottomCard),e}(this.config),function(){const t=new Promise(t=>window.setTimeout(t,5e3));return Et??=Promise.race([t,(async()=>{const t=await(window.loadCardHelpers?.());if(t)for(const[e,i]of[["entities",{entities:[]}],["tile",{entity:"sun.sun"}]]){t.createCardElement({type:e,...i});const s=`hui-${e}-card`;await customElements.whenDefined(s),await(customElements.get(s)?.getConfigElement?.())}})()]).catch(t=>console.warn("sidebar-card: could not load HA editor components",t)),Et}().then(()=>this._ready=!0),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey)}get _lang(){return this.hass?.language}_options(t,e){return e.map(e=>({value:e,label:this._t(`field.${t}.${e}`)}))}_update(t){this._config=t,this._dirty=!0,this._error="",yt(this,"sidebar-card-preview",t)}_patch(t){this._update({...this._config,...t})}_form(t,e,i){return q`<ha-form
      .hass=${this.hass}
      .data=${t}
      .schema=${e}
      .computeLabel=${this._label}
      @value-changed=${t=>{t.stopPropagation(),i(t.detail.value)}}
    ></ha-form>`}_general(){const t=this._config,e=t.clock&&t.digitalClock?"both":t.clock?"analog":t.digitalClock?"digital":"none",i=(t.presence??[]).map(t=>"string"==typeof t?t:t.entity),s={title:t.title,clock:e,digitalClockWithSeconds:t.digitalClockWithSeconds,twelveHourVersion:t.twelveHourVersion,period:t.period,date:t.date,dateFormat:t.dateFormat,weatherEntity:t.weatherEntity,presence:i,template:t.template},n=[fe("title"),{name:"clock",selector:{select:{mode:"dropdown",options:this._options("clock",["none","digital","analog","both"])}}},{type:"grid",name:"",schema:[be("digitalClockWithSeconds"),be("twelveHourVersion"),...t.twelveHourVersion?[be("period")]:[]]},{type:"grid",name:"",schema:[be("date"),...t.date?[fe("dateFormat")]:[]]},{name:"weatherEntity",selector:{entity:{filter:{domain:"weather"}}}},{name:"presence",selector:{entity:{multiple:!0,filter:{domain:"person"}}}},{name:"template",selector:{template:{}}}];return this._form(s,n,e=>{const i=new Map((t.presence??[]).map(t=>"string"==typeof t?[t,t]:[t.entity,t]));this._patch({title:e.title,clock:"analog"===e.clock||"both"===e.clock,digitalClock:"digital"===e.clock||"both"===e.clock,digitalClockWithSeconds:e.digitalClockWithSeconds,twelveHourVersion:e.twelveHourVersion,period:e.twelveHourVersion?e.period:void 0,date:e.date,dateFormat:e.dateFormat,weatherEntity:e.weatherEntity,presence:(e.presence??[]).map(t=>i.get(t)??t),template:e.template})})}_addViews(){const t=this.lovelace;if(!t)return;const e=`/${t.urlPath??"lovelace"}`,i=[...this._config.sidebarMenu??[]],s=new Set(i.map(t=>Wt(t)?.replace(/\/+$/,"")));(t.config.views??[]).forEach((t,n)=>{if(t.subview)return;const o=`${e}/${t.path??n}`;s.has(o)||i.push({name:t.title??t.path??String(n),icon:t.icon,tap_action:{action:"navigate",navigation_path:o}})}),this._patch({sidebarMenu:i})}_menu(){const t=this._config;return q`
      ${this._form({menuStyle:t.menuStyle??"list",showLabel:t.showLabel??!0,updateMenu:t.updateMenu??!0},[{name:"menuStyle",selector:{select:{mode:"dropdown",options:this._options("menuStyle",["list","wide","buttons","grid"])}}},{type:"grid",name:"",schema:[be("showLabel"),be("updateMenu")]}],t=>this._patch(t))}
      <div class="section-head">
        <h3>${this._t("editor.tab.menu")}</h3>
        <button class="chip" title=${this._t("editor.add_views_hint")} @click=${this._addViews}>
          <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>${this._t("editor.add_views")}
        </button>
      </div>
      <sidebar-card-list-editor
        .hass=${this.hass}
        .items=${t.sidebarMenu??[]}
        .adapter=${this._menuAdapter}
        .computeLabel=${this._label}
        @items-changed=${t=>this._patch({sidebarMenu:t.detail})}
      ></sidebar-card-list-editor>
    `}get _glance(){const t=this._config.glanceBar;return t?Array.isArray(t)?{position:"bottom",items:t}:{position:t.position??"bottom",items:t.items??[]}:{position:"bottom",items:[]}}_setGlance(t,e){this._patch({glanceBar:"attention"===t?{position:"attention",items:e}:e})}_status(){const t=this._config,e=this._glance;return q`
      ${this._form({notifications:t.notifications??!1,glancePosition:e.position},[be("notifications"),{name:"glancePosition",selector:{select:{mode:"dropdown",options:this._options("glancePosition",["bottom","attention"])}}}],t=>{this._config={...this._config,notifications:t.notifications},this._setGlance(t.glancePosition,e.items)})}
      <p class="hint">${this._t("editor.glance_hint")}</p>
      <sidebar-card-list-editor
        .hass=${this.hass}
        .items=${e.items}
        .adapter=${this._glanceAdapter}
        .computeLabel=${this._label}
        @items-changed=${t=>this._setGlance(e.position,t.detail)}
      ></sidebar-card-list-editor>
    `}_trends(){const t=this._config.trends??{};return q`
      <p class="hint">${this._t("editor.trends_hint")}</p>
      ${this._form({ranges:(t.ranges??["24h","7d"]).join(", "),autoAdvance:t.autoAdvance??0},[fe("ranges"),{name:"autoAdvance",selector:{number:{min:0,max:120,step:1,mode:"box",unit_of_measurement:"s"}}}],e=>this._patch({trends:{...t,ranges:String(e.ranges??"").split(",").map(t=>t.trim()).filter(Boolean),autoAdvance:Number(e.autoAdvance)||void 0}}))}
      <sidebar-card-list-editor
        .hass=${this.hass}
        .items=${t.items??[]}
        .adapter=${this._trendAdapter}
        .computeLabel=${this._label}
        @items-changed=${e=>this._patch({trends:{...t,items:e.detail}})}
      ></sidebar-card-list-editor>
    `}_cards(){const t=this._config;return q`
      <p class="hint">${this._t("editor.cards_hint")}</p>
      ${this._form({cards:t.cards??[],cardStyle:t.cardStyle},[{name:"cards",selector:{object:{}}},fe("cardStyle",!0)],t=>this._patch({cards:Array.isArray(t.cards)?t.cards:t.cards?[t.cards]:[],cardStyle:t.cardStyle}))}
    `}_layout(){const t=this._config,e=t.width,i="object"==typeof e&&e?e:{mobile:e??25,tablet:e??25,desktop:e??25},s=t=>({name:t,selector:{number:{min:0,max:60,step:1,mode:"slider",unit_of_measurement:"%"}}}),n=t=>({name:t,selector:{number:{min:200,max:4e3,step:1,mode:"box",unit_of_measurement:"px"}}}),o={"width.mobile":i.mobile??25,"width.tablet":i.tablet??25,"width.desktop":i.desktop??25,"breakpoints.mobile":t.breakpoints?.mobile??768,"breakpoints.tablet":t.breakpoints?.tablet??1024,accentColor:t.accentColor,hideTopMenu:t.hideTopMenu,showTopMenuOnMobile:t.showTopMenuOnMobile,hideHassSidebar:t.hideHassSidebar,hideOnPath:(t.hideOnPath??[]).join("\n"),style:t.style,debug:t.debug},a=[s("width.mobile"),s("width.tablet"),s("width.desktop"),{type:"grid",name:"",schema:[n("breakpoints.mobile"),n("breakpoints.tablet")]},fe("accentColor"),{type:"grid",name:"",schema:[be("hideTopMenu"),...t.hideTopMenu?[be("showTopMenuOnMobile")]:[],be("hideHassSidebar")]},fe("hideOnPath",!0),fe("style",!0),be("debug")];return this._form(o,a,t=>this._patch({width:{mobile:t["width.mobile"],tablet:t["width.tablet"],desktop:t["width.desktop"]},breakpoints:{mobile:t["breakpoints.mobile"],tablet:t["breakpoints.tablet"]},accentColor:t.accentColor,hideTopMenu:t.hideTopMenu,showTopMenuOnMobile:t.hideTopMenu?t.showTopMenuOnMobile:void 0,hideHassSidebar:t.hideHassSidebar,hideOnPath:String(t.hideOnPath??"").split("\n").map(t=>t.trim()).filter(Boolean),style:t.style,debug:t.debug}))}_yaml(){return q`
      <p class="hint">${this._t("editor.yaml_hint")}</p>
      ${this._form({sidebar:Gt(this._config)},[{name:"sidebar",selector:{object:{}}}],t=>{t.sidebar&&"object"==typeof t.sidebar&&!Array.isArray(t.sidebar)&&this._update(t.sidebar)})}
    `}_close(t=!1){!this._dirty||t?yt(this,"sidebar-card-closed"):this._confirmDiscard=!0}async _save(){const t=this.lovelace;if(t&&!this._saving){this._saving=!0,this._error="";try{const e=t.rawConfig??t.config;await t.saveConfig({...e,sidebar:Gt(this._config)}),this._dirty=!1,yt(this,"sidebar-card-closed")}catch(t){this._error=this._t("editor.save_failed",{error:t?.message??String(t)})}finally{this._saving=!1}}}render(){if(!this.hass)return K;const t="storage"===this.lovelace?.mode&&!!this.hass.user?.is_admin,e="storage"!==this.lovelace?.mode?this._t("editor.yaml_mode"):this.hass.user?.is_admin?"":this._t("editor.not_admin"),i={general:()=>this._general(),menu:()=>this._menu(),status:()=>this._status(),trends:()=>this._trends(),cards:()=>this._cards(),layout:()=>this._layout(),yaml:()=>this._yaml()}[this._tab];return q`
      <div class="scrim" @click=${()=>this._close()}></div>
      <section class="sheet" role="dialog" aria-modal="true" aria-label=${this._t("editor.title")}>
        <header>
          <h2>${this._t("editor.title")}</h2>
          <button class="icon-btn" aria-label=${this._t("editor.cancel")} @click=${()=>this._close()}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <nav class="tabs" role="tablist">
          ${me.map(t=>q`<button role="tab" aria-selected=${t.id===this._tab} class=${t.id===this._tab?"on":""}
              @click=${()=>this._tab=t.id}>
              <ha-icon .icon=${t.icon}></ha-icon><span>${this._t(`editor.tab.${t.id}`)}</span>
            </button>`)}
        </nav>
        <div class="body">${this._ready?i():q`<div class="loading"><ha-icon icon="mdi:loading"></ha-icon></div>`}</div>
        <footer>
          ${this._confirmDiscard?q`<span class="msg">${this._t("editor.discard_title")}</span>
                <button class="btn" @click=${()=>this._confirmDiscard=!1}>${this._t("editor.keep_editing")}</button>
                <button class="btn danger" @click=${()=>this._close(!0)}>${this._t("editor.discard")}</button>`:q`<span class="msg ${this._error?"error":""}">${this._error||e}</span>
                <button class="btn" @click=${()=>this._close()}>${this._t("editor.cancel")}</button>
                <button class="btn primary" ?disabled=${!t||!this._dirty||this._saving} @click=${this._save}>
                  ${this._saving?this._t("editor.saving"):this._t("editor.save")}
                </button>`}
        </footer>
      </section>
    `}}function _e(t,e,i){if(!t)return;const s=t.adoptedStyleSheets.includes(e);i&&!s&&(t.adoptedStyleSheets=[...t.adoptedStyleSheets,e]),!i&&s&&(t.adoptedStyleSheets=t.adoptedStyleSheets.filter(t=>t!==e))}ge.properties={hass:{attribute:!1},lovelace:{attribute:!1},config:{attribute:!1},_config:{state:!0},_tab:{state:!0},_ready:{state:!0},_saving:{state:!0},_error:{state:!0},_dirty:{state:!0},_confirmDiscard:{state:!0}},ge.styles=o`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      justify-content: flex-end;
      font-family: var(--ha-font-family-body, inherit);
      color: var(--primary-text-color);
    }
    .scrim {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 0.25);
    }
    .sheet {
      position: relative;
      display: flex;
      flex-direction: column;
      width: min(560px, 100%);
      height: 100%;
      background: var(--primary-background-color);
      box-shadow: -12px 0 32px rgb(0 0 0 / 0.25);
      animation: slide 220ms ease;
      padding-top: env(safe-area-inset-top, 0px);
      box-sizing: border-box;
    }
    @keyframes slide {
      from {
        transform: translateX(40px);
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .sheet {
        animation: none;
      }
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 12px 4px 24px;
    }
    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 400;
    }
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    button[disabled] {
      opacity: 0.4;
      pointer-events: none;
    }
    .icon-btn {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      color: var(--secondary-text-color);
    }
    /* Wrap instead of scrolling sideways: hidden tabs are easy to miss on touch screens. */
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px 16px 12px;
      border-bottom: 1px solid var(--divider-color);
    }
    .tabs button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: none;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 14px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .tabs button.on {
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
      font-weight: 500;
    }
    .body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      font-size: 13px;
      color: var(--primary-color);
      --mdc-icon-size: 18px;
    }
    .hint {
      margin: 0;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .loading {
      display: grid;
      place-items: center;
      padding: 48px;
      color: var(--secondary-text-color);
    }
    .loading ha-icon {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)) 24px;
      border-top: 1px solid var(--divider-color);
    }
    .msg {
      flex: 1;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .msg.error {
      color: var(--error-color);
    }
    .btn {
      padding: 10px 18px;
      border-radius: 999px;
      font-weight: 500;
      color: var(--primary-color);
    }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.danger {
      background: var(--error-color);
      color: #fff;
    }
  `,customElements.get("sidebar-card-editor")||customElements.define("sidebar-card-editor",ge);class ye{constructor(){this.rootSheet=new CSSStyleSheet,this.mainSheet=new CSSStyleSheet,this.rootCss="",this.mainCss="",this.frame=0,this.seen=[],this.resizeObserver=new ResizeObserver(()=>this.schedule())}start(){!function(t){gt.add(t);const e=mt();!_t&&e?.provideHass&&(_t=!0,e.provideHass({set hass(t){gt.forEach(e=>e(t))}})),e?.hass&&t(e.hass)}(t=>{this.hass=t,this.panel&&(this.panel.hass=t),this.editor&&(this.editor.hass=t)});const t=()=>this.schedule();window.addEventListener("location-changed",t),window.addEventListener("popstate",t),window.addEventListener("resize",t),window.setInterval(()=>this.poll(),1e3),this.schedule()}snapshot(){const t=ft(),e=t?.lovelace;return[t,e,this.draft??e?.config?.sidebar,e?.editMode,window.location.href,window.innerWidth]}poll(){const t=this.snapshot();(t.length!==this.seen.length||t.some((t,e)=>t!==this.seen[e]))&&this.schedule()}schedule(){this.frame||(this.frame=requestAnimationFrame(()=>{this.frame=0,this.check()}))}check(){this.seen=this.snapshot();const t=ft(),e=t?.lovelace,i=this.draft??e?.config?.sidebar;t?.shadowRoot&&e&&i&&"object"==typeof i?(t!==this.root&&(this.unmount(),this.root=t,this.resizeObserver.observe(t)),this.panel||(this.panel=document.createElement("sidebar-card"),this.panel.addEventListener("sidebar-card-edit",()=>this.openEditor())),this.panel.parentNode!==t.shadowRoot&&t.shadowRoot.appendChild(this.panel),i!==this.lastRaw&&(this.lastRaw=i,this.resolved=function(t){const e=t.width,i="object"==typeof e&&null!==e?{mobile:Ft(e.mobile,Bt),tablet:Ft(e.tablet,Bt),desktop:Ft(e.desktop,Bt)}:{mobile:Ft(e,Bt),tablet:Ft(e,Bt),desktop:Ft(e,Bt)},s=!!t.clock,n=!!t.digitalClock;return{raw:t,title:t.title??"",clock:s&&n?"both":s?"analog":n?"digital":"none",clockSeconds:!!t.digitalClockWithSeconds,hour12:!!t.twelveHourVersion,period:!!t.period,date:!!t.date,dateFormat:t.dateFormat||void 0,weatherEntity:!1===t.weather?void 0:t.weatherEntity||void 0,presence:Yt(t.presence),menu:(t.sidebarMenu??[]).filter(Boolean),menuStyle:t.menuStyle??"list",showLabel:t.showLabel??!0,updateMenu:t.updateMenu??!0,template:t.template||void 0,notifications:!!t.notifications,glance:Vt(t.glanceBar),trends:t.trends?.items?.length?t.trends:void 0,cards:Zt(t),cardStyle:t.cardStyle??t.bottomCard?.cardStyle,accentColor:t.accentColor||void 0,width:i,breakpoints:{mobile:Number(t.breakpoints?.mobile)||768,tablet:Number(t.breakpoints?.tablet)||1024},hideTopMenu:!!t.hideTopMenu,showTopMenuOnMobile:!!t.showTopMenuOnMobile,hideHassSidebar:!!t.hideHassSidebar,hideOnPath:Array.isArray(t.hideOnPath)?t.hideOnPath:[],style:t.style||void 0,debug:!!t.debug}}(i),this.panel.config=this.resolved,this.resolved.debug&&console.info("sidebar-card: config",this.resolved)),this.panel.hass=this.hass,this.panel.path=window.location.pathname,this.panel.editMode=e.editMode&&!!this.hass?.user?.is_admin,this.layout(t,e,this.resolved)):this.unmount()}layout(t,e,i){const s=document.body.clientWidth,n=s<=i.breakpoints.mobile?i.width.mobile:s<=i.breakpoints.tablet?i.width.tablet:i.width.desktop,o=new URLSearchParams(window.location.search).has("sidebarOff"),a=0===n||i.hideOnPath.includes(window.location.pathname),r=i.hideTopMenu&&!o&&!e.editMode&&!(i.showTopMenuOnMobile&&s<=i.breakpoints.mobile),l=i.hideHassSidebar&&!o,d=t.getBoundingClientRect(),c=a?0:Math.round(d.width*n/100);let h=`hui-view-container#view { padding-left: calc(${c}px + var(--view-container-inset-left, 0px)) !important; }`;r&&(h+=".header { display: none !important; }\n        hui-view-container#view { padding-top: var(--safe-area-inset-top, 0px) !important; min-height: 100vh; }"),h!==this.rootCss&&(this.rootCss=h,this.rootSheet.replaceSync(h)),_e(t.shadowRoot,this.rootSheet,!0);const p=l?":host { --ha-sidebar-width: 0px !important; --ha-top-app-bar-width: 100% !important; } ha-sidebar { display: none !important; }":"";p!==this.mainCss&&(this.mainCss=p,this.mainSheet.replaceSync(p)),_e(bt()?.shadowRoot,this.mainSheet,!!p);const u=t.shadowRoot.querySelector(".header");u!==this.header&&(this.header&&this.resizeObserver.unobserve(this.header),u&&this.resizeObserver.observe(u),this.header=u??void 0);const m=u&&"none"!==getComputedStyle(u).display?Math.max(u.getBoundingClientRect().bottom,0):0,b=this.panel.style;b.display=a?"none":"",b.position="fixed",b.zIndex="3",b.left=`${d.left}px`,b.top=`${m}px`,b.bottom="0",b.width=`${c}px`}unmount(){this.panel?.remove(),this.editor?.remove(),this.editor=void 0,this.draft=void 0,this.header&&this.resizeObserver.unobserve(this.header),this.header=void 0,this.root&&(this.resizeObserver.unobserve(this.root),_e(this.root.shadowRoot,this.rootSheet,!1)),_e(bt()?.shadowRoot,this.mainSheet,!1),this.root=void 0,this.lastRaw=void 0}openEditor(){const t=this.root,e=t?.lovelace;if(!t?.shadowRoot||!e||this.editor)return;const i=document.createElement("sidebar-card-editor");i.hass=this.hass,i.lovelace=e,i.config=e.config.sidebar??{},i.addEventListener("sidebar-card-preview",t=>{this.draft=t.detail,this.schedule()}),i.addEventListener("sidebar-card-closed",()=>{i.remove(),this.editor=void 0,this.draft=void 0,this.lastRaw=void 0,this.schedule()}),this.editor=i,t.shadowRoot.appendChild(i)}}console.info("%c SIDEBAR-CARD %c 2.0.3 ","color: #fff; background: #03a9f4; font-weight: 700; border-radius: 4px 0 0 4px;","color: #03a9f4; background: #e1f5fe; font-weight: 700; border-radius: 0 4px 4px 0;"),customElements.get("sidebar-card")!==pe?console.error("sidebar-card: another version of sidebar-card is already loaded. Remove the old resource under Settings → Dashboards → Resources."):(new ye).start();
