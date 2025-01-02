var MimeText=function(t){"use strict";class e extends Error{name="";description="";constructor(t,e=""){super(e),this.name=t,this.description=e}}var n,r,i,o,s,a,u,c,d="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function f(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function l(){return r?n:(r=1,n=function(t){try{return!!t()}catch(t){return!0}})}function h(){return o?i:(o=1,i=!l()((function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")})))}function p(){if(a)return s;a=1;var t=h(),e=Function.prototype,n=e.call,r=t&&e.bind.bind(n,n);return s=t?r:function(t){return function(){return n.apply(t,arguments)}},s}function m(){return c?u:(c=1,u=p()({}.isPrototypeOf))}var b,v,y,g,T,M,x,w,E,S,j={};function O(){if(v)return b;v=1;var t=function(t){return t&&t.Math===Math&&t};return b=t("object"==typeof globalThis&&globalThis)||t("object"==typeof window&&window)||t("object"==typeof self&&self)||t("object"==typeof d&&d)||t("object"==typeof b&&b)||function(){return this}()||Function("return this")()}function I(){if(g)return y;g=1;var t=h(),e=Function.prototype,n=e.apply,r=e.call;return y="object"==typeof Reflect&&Reflect.apply||(t?r.bind(n):function(){return r.apply(n,arguments)}),y}function C(){if(M)return T;M=1;var t=p(),e=t({}.toString),n=t("".slice);return T=function(t){return n(e(t),8,-1)}}function A(){if(w)return x;w=1;var t=C(),e=p();return x=function(n){if("Function"===t(n))return e(n)}}function _(){if(S)return E;S=1;var t="object"==typeof document&&document.all;return E=void 0===t&&void 0!==t?function(e){return"function"==typeof e||e===t}:function(t){return"function"==typeof t}}var D,H,P,$,B={};function R(){return H?D:(H=1,D=!l()((function(){return 7!==Object.defineProperty({},1,{get:function(){return 7}})[1]})))}function F(){if($)return P;$=1;var t=h(),e=Function.prototype.call;return P=t?e.bind(e):function(){return e.apply(e,arguments)},P}var L,N,X,U,V,W,k,z,G,q,Y,J,K,Q,Z,tt,et,nt,rt,it,ot,st,at,ut,ct,dt,ft,lt,ht,pt,mt,bt,vt,yt,gt,Tt={};function Mt(){if(L)return Tt;L=1;var t={}.propertyIsEnumerable,e=Object.getOwnPropertyDescriptor,n=e&&!t.call({1:2},1);return Tt.f=n?function(t){var n=e(this,t);return!!n&&n.enumerable}:t,Tt}function xt(){return X?N:(X=1,N=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}})}function wt(){if(V)return U;V=1;var t=p(),e=l(),n=C(),r=Object,i=t("".split);return U=e((function(){return!r("z").propertyIsEnumerable(0)}))?function(t){return"String"===n(t)?i(t,""):r(t)}:r}function Et(){return k?W:(k=1,W=function(t){return null==t})}function St(){if(G)return z;G=1;var t=Et(),e=TypeError;return z=function(n){if(t(n))throw new e("Can't call method on "+n);return n}}function jt(){if(Y)return q;Y=1;var t=wt(),e=St();return q=function(n){return t(e(n))}}function Ot(){if(K)return J;K=1;var t=_();return J=function(e){return"object"==typeof e?null!==e:t(e)}}function It(){return Z?Q:(Z=1,Q={})}function Ct(){if(et)return tt;et=1;var t=It(),e=O(),n=_(),r=function(t){return n(t)?t:void 0};return tt=function(n,i){return arguments.length<2?r(t[n])||r(e[n]):t[n]&&t[n][i]||e[n]&&e[n][i]},tt}function At(){if(rt)return nt;rt=1;var t=O().navigator,e=t&&t.userAgent;return nt=e?String(e):""}function _t(){if(ot)return it;ot=1;var t,e,n=O(),r=At(),i=n.process,o=n.Deno,s=i&&i.versions||o&&o.version,a=s&&s.v8;return a&&(e=(t=a.split("."))[0]>0&&t[0]<4?1:+(t[0]+t[1])),!e&&r&&(!(t=r.match(/Edge\/(\d+)/))||t[1]>=74)&&(t=r.match(/Chrome\/(\d+)/))&&(e=+t[1]),it=e}function Dt(){if(at)return st;at=1;var t=_t(),e=l(),n=O().String;return st=!!Object.getOwnPropertySymbols&&!e((function(){var e=Symbol("symbol detection");return!n(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&t&&t<41}))}function Ht(){return ct?ut:(ct=1,ut=Dt()&&!Symbol.sham&&"symbol"==typeof Symbol.iterator)}function Pt(){if(ft)return dt;ft=1;var t=Ct(),e=_(),n=m(),r=Object;return dt=Ht()?function(t){return"symbol"==typeof t}:function(i){var o=t("Symbol");return e(o)&&n(o.prototype,r(i))}}function $t(){if(ht)return lt;ht=1;var t=String;return lt=function(e){try{return t(e)}catch(t){return"Object"}}}function Bt(){if(mt)return pt;mt=1;var t=_(),e=$t(),n=TypeError;return pt=function(r){if(t(r))return r;throw new n(e(r)+" is not a function")}}function Rt(){if(vt)return bt;vt=1;var t=Bt(),e=Et();return bt=function(n,r){var i=n[r];return e(i)?void 0:t(i)}}function Ft(){if(gt)return yt;gt=1;var t=F(),e=_(),n=Ot(),r=TypeError;return yt=function(i,o){var s,a;if("string"===o&&e(s=i.toString)&&!n(a=t(s,i)))return a;if(e(s=i.valueOf)&&!n(a=t(s,i)))return a;if("string"!==o&&e(s=i.toString)&&!n(a=t(s,i)))return a;throw new r("Can't convert object to primitive value")}}var Lt,Nt,Xt,Ut,Vt,Wt,kt,zt,Gt,qt,Yt,Jt,Kt,Qt,Zt,te,ee,ne,re,ie,oe,se,ae,ue,ce,de,fe,le,he={exports:{}};function pe(){return Nt?Lt:(Nt=1,Lt=!0)}function me(){if(Ut)return Xt;Ut=1;var t=O(),e=Object.defineProperty;return Xt=function(n,r){try{e(t,n,{value:r,configurable:!0,writable:!0})}catch(e){t[n]=r}return r}}function be(){if(Vt)return he.exports;Vt=1;var t=pe(),e=O(),n=me(),r="__core-js_shared__",i=he.exports=e[r]||n(r,{});return(i.versions||(i.versions=[])).push({version:"3.39.0",mode:t?"pure":"global",copyright:"© 2014-2024 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.39.0/LICENSE",source:"https://github.com/zloirock/core-js"}),he.exports}function ve(){if(kt)return Wt;kt=1;var t=be();return Wt=function(e,n){return t[e]||(t[e]=n||{})}}function ye(){if(Gt)return zt;Gt=1;var t=St(),e=Object;return zt=function(n){return e(t(n))}}function ge(){if(Yt)return qt;Yt=1;var t=p(),e=ye(),n=t({}.hasOwnProperty);return qt=Object.hasOwn||function(t,r){return n(e(t),r)}}function Te(){if(Kt)return Jt;Kt=1;var t=p(),e=0,n=Math.random(),r=t(1..toString);return Jt=function(t){return"Symbol("+(void 0===t?"":t)+")_"+r(++e+n,36)}}function Me(){if(Zt)return Qt;Zt=1;var t=O(),e=ve(),n=ge(),r=Te(),i=Dt(),o=Ht(),s=t.Symbol,a=e("wks"),u=o?s.for||s:s&&s.withoutSetter||r;return Qt=function(t){return n(a,t)||(a[t]=i&&n(s,t)?s[t]:u("Symbol."+t)),a[t]}}function xe(){if(ee)return te;ee=1;var t=F(),e=Ot(),n=Pt(),r=Rt(),i=Ft(),o=TypeError,s=Me()("toPrimitive");return te=function(a,u){if(!e(a)||n(a))return a;var c,d=r(a,s);if(d){if(void 0===u&&(u="default"),c=t(d,a,u),!e(c)||n(c))return c;throw new o("Can't convert object to primitive value")}return void 0===u&&(u="number"),i(a,u)}}function we(){if(re)return ne;re=1;var t=xe(),e=Pt();return ne=function(n){var r=t(n,"string");return e(r)?r:r+""}}function Ee(){if(oe)return ie;oe=1;var t=O(),e=Ot(),n=t.document,r=e(n)&&e(n.createElement);return ie=function(t){return r?n.createElement(t):{}}}function Se(){if(ae)return se;ae=1;var t=R(),e=l(),n=Ee();return se=!t&&!e((function(){return 7!==Object.defineProperty(n("div"),"a",{get:function(){return 7}}).a}))}function je(){if(ue)return B;ue=1;var t=R(),e=F(),n=Mt(),r=xt(),i=jt(),o=we(),s=ge(),a=Se(),u=Object.getOwnPropertyDescriptor;return B.f=t?u:function(t,c){if(t=i(t),c=o(c),a)try{return u(t,c)}catch(t){}if(s(t,c))return r(!e(n.f,t,c),t[c])},B}function Oe(){if(de)return ce;de=1;var t=l(),e=_(),n=/#|\.prototype\./,r=function(n,r){var u=o[i(n)];return u===a||u!==s&&(e(r)?t(r):!!r)},i=r.normalize=function(t){return String(t).replace(n,".").toLowerCase()},o=r.data={},s=r.NATIVE="N",a=r.POLYFILL="P";return ce=r}function Ie(){if(le)return fe;le=1;var t=A(),e=Bt(),n=h(),r=t(t.bind);return fe=function(t,i){return e(t),void 0===i?t:n?r(t,i):function(){return t.apply(i,arguments)}},fe}var Ce,Ae,_e,De,He,Pe,$e,Be,Re,Fe,Le,Ne,Xe,Ue,Ve,We,ke,ze,Ge,qe,Ye,Je,Ke,Qe,Ze,tn,en,nn,rn,on,sn,an,un,cn,dn,fn,ln,hn,pn,mn,bn={};function vn(){return Ae?Ce:(Ae=1,Ce=R()&&l()((function(){return 42!==Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype})))}function yn(){if(De)return _e;De=1;var t=Ot(),e=String,n=TypeError;return _e=function(r){if(t(r))return r;throw new n(e(r)+" is not an object")}}function gn(){if(He)return bn;He=1;var t=R(),e=Se(),n=vn(),r=yn(),i=we(),o=TypeError,s=Object.defineProperty,a=Object.getOwnPropertyDescriptor,u="enumerable",c="configurable",d="writable";return bn.f=t?n?function(t,e,n){if(r(t),e=i(e),r(n),"function"==typeof t&&"prototype"===e&&"value"in n&&d in n&&!n[d]){var o=a(t,e);o&&o[d]&&(t[e]=n.value,n={configurable:c in n?n[c]:o[c],enumerable:u in n?n[u]:o[u],writable:!1})}return s(t,e,n)}:s:function(t,n,a){if(r(t),n=i(n),r(a),e)try{return s(t,n,a)}catch(t){}if("get"in a||"set"in a)throw new o("Accessors not supported");return"value"in a&&(t[n]=a.value),t},bn}function Tn(){if($e)return Pe;$e=1;var t=R(),e=gn(),n=xt();return Pe=t?function(t,r,i){return e.f(t,r,n(1,i))}:function(t,e,n){return t[e]=n,t}}function Mn(){if(Re)return Be;Re=1;var t=O(),e=I(),n=A(),r=_(),i=je().f,o=Oe(),s=It(),a=Ie(),u=Tn(),c=ge(),d=function(t){var n=function(r,i,o){if(this instanceof n){switch(arguments.length){case 0:return new t;case 1:return new t(r);case 2:return new t(r,i)}return new t(r,i,o)}return e(t,this,arguments)};return n.prototype=t.prototype,n};return Be=function(e,f){var l,h,p,m,b,v,y,g,T,M=e.target,x=e.global,w=e.stat,E=e.proto,S=x?t:w?t[M]:t[M]&&t[M].prototype,j=x?s:s[M]||u(s,M,{})[M],O=j.prototype;for(m in f)h=!(l=o(x?m:M+(w?".":"#")+m,e.forced))&&S&&c(S,m),v=j[m],h&&(y=e.dontCallGetSet?(T=i(S,m))&&T.value:S[m]),b=h&&y?y:f[m],(l||E||typeof v!=typeof b)&&(g=e.bind&&h?a(b,t):e.wrap&&h?d(b):E&&r(b)?n(b):b,(e.sham||b&&b.sham||v&&v.sham)&&u(g,"sham",!0),u(j,m,g),E&&(c(s,p=M+"Prototype")||u(s,p,{}),u(s[p],m,b),e.real&&O&&(l||!O[m])&&u(O,m,b)))}}function xn(){if(Le)return Fe;Le=1;var t={};return t[Me()("toStringTag")]="z",Fe="[object z]"===String(t)}function wn(){if(Xe)return Ne;Xe=1;var t=xn(),e=_(),n=C(),r=Me()("toStringTag"),i=Object,o="Arguments"===n(function(){return arguments}());return Ne=t?n:function(t){var s,a,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(a=function(t,e){try{return t[e]}catch(t){}}(s=i(t),r))?a:o?n(s):"Object"===(u=n(s))&&e(s.callee)?"Arguments":u}}function En(){if(Ve)return Ue;Ve=1;var t=wn(),e=String;return Ue=function(n){if("Symbol"===t(n))throw new TypeError("Cannot convert a Symbol value to a string");return e(n)}}function Sn(){return ke?We:(ke=1,We="\t\n\v\f\r                　\u2028\u2029\ufeff")}function jn(){if(Ge)return ze;Ge=1;var t=p(),e=St(),n=En(),r=Sn(),i=t("".replace),o=RegExp("^["+r+"]+"),s=RegExp("(^|[^"+r+"])["+r+"]+$"),a=function(t){return function(r){var a=n(e(r));return 1&t&&(a=i(a,o,"")),2&t&&(a=i(a,s,"$1")),a}};return ze={start:a(1),end:a(2),trim:a(3)}}function On(){if(Ye)return qe;Ye=1;var t=R(),e=ge(),n=Function.prototype,r=t&&Object.getOwnPropertyDescriptor,i=e(n,"name"),o=i&&"something"===function(){}.name,s=i&&(!t||t&&r(n,"name").configurable);return qe={EXISTS:i,PROPER:o,CONFIGURABLE:s}}function In(){if(Ke)return Je;Ke=1;var t=On().PROPER,e=l(),n=Sn();return Je=function(r){return e((function(){return!!n[r]()||"​᠎"!=="​᠎"[r]()||t&&n[r].name!==r}))}}function Cn(){if(tn)return Ze;tn=1;var t=O(),e=It();return Ze=function(n,r){var i=e[n+"Prototype"],o=i&&i[r];if(o)return o;var s=t[n],a=s&&s.prototype;return a&&a[r]}}function An(){return nn?en:(nn=1,function(){if(Qe)return j;Qe=1;var t=Mn(),e=jn().trim;t({target:"String",proto:!0,forced:In()("trim")},{trim:function(){return e(this)}})}(),en=Cn()("String","trim"))}function _n(){if(on)return rn;on=1;var t=m(),e=An(),n=String.prototype;return rn=function(r){var i=r.trim;return"string"==typeof r||r===n||t(n,r)&&i===n.trim?e:i}}function Dn(){return an?sn:(an=1,sn=_n())}function Hn(){return cn?un:(cn=1,un=Dn())}function Pn(){return fn?dn:(fn=1,dn=Hn())}function $n(){return hn?ln:(hn=1,ln=Pn())}var Bn=f(mn?pn:(mn=1,pn=$n()));class Rn{reSpecCompliantAddr=/(([^<>\r\n]+)\s)?<[^\r\n]+>/;name="";addr="";type="To";constructor(t,e={type:"To"}){this.type=e.type,this.parse(t)}getAddrDomain(){if(this.addr.includes("@")){const t=this.addr.split("@");if(t.length>1)return t[1]}return""}dump(){return this.name.length>0?`"${this.name}" <${this.addr}>`:`<${this.addr}>`}parse(t){if(this.isMailboxAddrObject(t))return this.addr=t.addr,"string"==typeof t.name&&(this.name=t.name),"string"==typeof t.type&&(this.type=t.type),this;if(this.isMailboxAddrText(t)){const e=Bn(t).call(t);if(e.startsWith("<")&&e.endsWith(">"))return this.addr=e.slice(1,-1),this;const n=e.split(" <");return n[0]=/^("|')/.test(n[0])?n[0].slice(1):n[0],n[0]=/("|')$/.test(n[0])?n[0].slice(0,-1):n[0],n[1]=n[1].slice(0,-1),this.name=n[0],this.addr=n[1],this}if("string"==typeof t)return this.addr=t,this;throw new e("MIMETEXT_INVALID_MAILBOX","Couldn't recognize the input.")}isMailboxAddrText(t){return"string"==typeof t&&this.reSpecCompliantAddr.test(t)}isMailboxAddrObject(t){return this.isObject(t)&&Object.hasOwn(t,"addr")}isObject(t){return!!t&&t.constructor===Object}}class Fn{fields=[{name:"Date",generator:()=>(new Date).toUTCString().replace(/GMT|UTC/gi,"+0000")},{name:"From",required:!0,validate:t=>this.validateMailboxSingle(t),dump:t=>this.dumpMailboxSingle(t)},{name:"Sender",validate:t=>this.validateMailboxSingle(t),dump:t=>this.dumpMailboxSingle(t)},{name:"Reply-To",validate:t=>this.validateMailboxSingle(t),dump:t=>this.dumpMailboxSingle(t)},{name:"To",validate:t=>this.validateMailboxMulti(t),dump:t=>this.dumpMailboxMulti(t)},{name:"Cc",validate:t=>this.validateMailboxMulti(t),dump:t=>this.dumpMailboxMulti(t)},{name:"Bcc",validate:t=>this.validateMailboxMulti(t),dump:t=>this.dumpMailboxMulti(t)},{name:"Message-ID",generator:()=>"<"+Math.random().toString(36).slice(2)+"@"+this.fields.filter((t=>"From"===t.name))[0].value.getAddrDomain()+">"},{name:"Subject",required:!0,dump:t=>"string"==typeof t?"=?utf-8?B?"+this.envctx.toBase64(t)+"?=":""},{name:"MIME-Version",generator:()=>"1.0"}];constructor(t){this.envctx=t}dump(){let t="";for(const n of this.fields){if(n.disabled)continue;const r=void 0!==n.value&&null!==n.value;if(!r&&n.required)throw new e("MIMETEXT_MISSING_HEADER",`The "${n.name}" header is required.`);if(!r&&"function"!=typeof n.generator)continue;r||"function"!=typeof n.generator||(n.value=n.generator());const i=Object.hasOwn(n,"dump")&&"function"==typeof n.dump?n.dump(n.value):"string"==typeof n.value?n.value:"";t+=`${n.name}: ${i}${this.envctx.eol}`}return t.slice(0,-1*this.envctx.eol.length)}toObject(){return this.fields.reduce(((t,e)=>(t[e.name]=e.value,t)),{})}get(t){const e=this.fields.findIndex((e=>e.name.toLowerCase()===t.toLowerCase()));return-1!==e?this.fields[e].value:void 0}set(t,n){const r=e=>e.name.toLowerCase()===t.toLowerCase();if(!!this.fields.some(r)){const i=this.fields.findIndex(r),o=this.fields[i];if(o.validate&&!o.validate(n))throw new e("MIMETEXT_INVALID_HEADER_VALUE",`The value for the header "${t}" is invalid.`);return this.fields[i].value=n,this.fields[i]}return this.setCustom({name:t,value:n,custom:!0,dump:t=>"string"==typeof t?t:""})}setCustom(t){if(this.isHeaderField(t)){if("string"!=typeof t.value)throw new e("MIMETEXT_INVALID_HEADER_FIELD","Custom header must have a value.");return this.fields.push(t),t}throw new e("MIMETEXT_INVALID_HEADER_FIELD","Invalid input for custom header. It must be in type of HeaderField.")}validateMailboxSingle(t){return t instanceof Rn}validateMailboxMulti(t){return t instanceof Rn||this.isArrayOfMailboxes(t)}dumpMailboxMulti(t){const e=t=>0===t.name.length?t.dump():`=?utf-8?B?${this.envctx.toBase64(t.name)}?= <${t.addr}>`;return this.isArrayOfMailboxes(t)?t.map(e).join(`,${this.envctx.eol} `):t instanceof Rn?e(t):""}dumpMailboxSingle(t){return t instanceof Rn?(t=>0===t.name.length?t.dump():`=?utf-8?B?${this.envctx.toBase64(t.name)}?= <${t.addr}>`)(t):""}isHeaderField(t){const e=["name","value","dump","required","disabled","generator","custom"];if(this.isObject(t)){const n=t;if(Object.hasOwn(n,"name")&&"string"==typeof n.name&&n.name.length>0&&!Object.keys(n).some((t=>!e.includes(t))))return!0}return!1}isObject(t){return!!t&&t.constructor===Object}isArrayOfMailboxes(t){return this.isArray(t)&&t.every((t=>t instanceof Rn))}isArray(t){return!!t&&t.constructor===Array}}class Ln extends Fn{fields=[{name:"Content-ID"},{name:"Content-Type"},{name:"Content-Transfer-Encoding"},{name:"Content-Disposition"}];constructor(t){super(t)}}class Nn{constructor(t,e,n={}){this.envctx=t,this.headers=new Ln(this.envctx),this.data=e,this.setHeaders(n)}dump(){const t=this.envctx.eol;return this.headers.dump()+t+t+this.data}isAttachment(){const t=this.headers.get("Content-Disposition");return"string"==typeof t&&t.includes("attachment")}isInlineAttachment(){const t=this.headers.get("Content-Disposition");return"string"==typeof t&&t.includes("inline")}setHeader(t,e){return this.headers.set(t,e),t}getHeader(t){return this.headers.get(t)}setHeaders(t){return Object.keys(t).map((e=>this.setHeader(e,t[e])))}getHeaders(){return this.headers.toObject()}}class Xn{boundaries={mixed:"",alt:"",related:""};validTypes=["text/html","text/plain"];validContentTransferEncodings=["7bit","8bit","binary","quoted-printable","base64"];messages=[];constructor(t){this.envctx=t,this.headers=new Fn(this.envctx),this.messages=[],this.generateBoundaries()}asRaw(){const t=this.envctx.eol,n=this.headers.dump(),r=this.getMessageByType("text/plain"),i=this.getMessageByType("text/html"),o=i??r??void 0;if(void 0===o)throw new e("MIMETEXT_MISSING_BODY","No content added to the message.");const s=this.hasAttachments(),a=this.hasInlineAttachments(),u=a&&s?"mixed+related":s?"mixed":a?"related":r&&i?"alternative":"";if("mixed+related"===u){const e=this.getAttachments().map((e=>"--"+this.boundaries.mixed+t+e.dump()+t+t)).join("").slice(0,-1*t.length),o=this.getInlineAttachments().map((e=>"--"+this.boundaries.related+t+e.dump()+t+t)).join("").slice(0,-1*t.length);return n+t+"Content-Type: multipart/mixed; boundary="+this.boundaries.mixed+t+t+"--"+this.boundaries.mixed+t+"Content-Type: multipart/related; boundary="+this.boundaries.related+t+t+this.dumpTextContent(r,i,this.boundaries.related)+t+t+o+"--"+this.boundaries.related+"--"+t+e+"--"+this.boundaries.mixed+"--"}if("mixed"===u){const e=this.getAttachments().map((e=>"--"+this.boundaries.mixed+t+e.dump()+t+t)).join("").slice(0,-1*t.length);return n+t+"Content-Type: multipart/mixed; boundary="+this.boundaries.mixed+t+t+this.dumpTextContent(r,i,this.boundaries.mixed)+t+(r&&i?"":t)+e+"--"+this.boundaries.mixed+"--"}if("related"===u){const e=this.getInlineAttachments().map((e=>"--"+this.boundaries.related+t+e.dump()+t+t)).join("").slice(0,-1*t.length);return n+t+"Content-Type: multipart/related; boundary="+this.boundaries.related+t+t+this.dumpTextContent(r,i,this.boundaries.related)+t+t+e+"--"+this.boundaries.related+"--"}return"alternative"===u?n+t+"Content-Type: multipart/alternative; boundary="+this.boundaries.alt+t+t+this.dumpTextContent(r,i,this.boundaries.alt)+t+t+"--"+this.boundaries.alt+"--":n+t+o.dump()}asEncoded(){return this.envctx.toBase64WebSafe(this.asRaw())}dumpTextContent(t,e,n){const r=this.envctx.eol,i=e??t;let o="";return o=t&&e&&!this.hasInlineAttachments()&&this.hasAttachments()?"--"+n+r+"Content-Type: multipart/alternative; boundary="+this.boundaries.alt+r+r+"--"+this.boundaries.alt+r+t.dump()+r+r+"--"+this.boundaries.alt+r+e.dump()+r+r+"--"+this.boundaries.alt+"--":t&&e&&this.hasInlineAttachments()?"--"+n+r+e.dump():t&&e?"--"+n+r+t.dump()+r+r+"--"+n+r+e.dump():"--"+n+r+i.dump(),o}hasInlineAttachments(){return this.messages.some((t=>t.isInlineAttachment()))}hasAttachments(){return this.messages.some((t=>t.isAttachment()))}getAttachments(){const t=t=>t.isAttachment();return this.messages.some(t)?this.messages.filter(t):[]}getInlineAttachments(){const t=t=>t.isInlineAttachment();return this.messages.some(t)?this.messages.filter(t):[]}getMessageByType(t){const e=e=>!e.isAttachment()&&!e.isInlineAttachment()&&(e.getHeader("Content-Type")||"").includes(t);return this.messages.some(e)?this.messages.filter(e)[0]:void 0}addAttachment(t){if(this.isObject(t.headers)||(t.headers={}),"string"!=typeof t.filename)throw new e("MIMETEXT_MISSING_FILENAME",'The property "filename" must exist while adding attachments.');let n=(t.headers["Content-Type"]??t.contentType)||"none";if(!1===this.envctx.validateContentType(n))throw new e("MIMETEXT_INVALID_MESSAGE_TYPE",`You specified an invalid content type "${n}".`);const r=t.headers["Content-Transfer-Encoding"]??t.encoding??"base64";this.validContentTransferEncodings.includes(r)||(n="application/octet-stream");const i=t.headers["Content-ID"];"string"==typeof i&&i.length>2&&!i.startsWith("<")&&!i.endsWith(">")&&(t.headers["Content-ID"]="<"+t.headers["Content-ID"]+">");const o=t.inline?"inline":"attachment";return t.headers=Object.assign({},t.headers,{"Content-Type":`${n}; name="${t.filename}"`,"Content-Transfer-Encoding":r,"Content-Disposition":`${o}; filename="${t.filename}"`}),this._addMessage({data:t.data,headers:t.headers})}addMessage(t){this.isObject(t.headers)||(t.headers={});let n=(t.headers["Content-Type"]??t.contentType)||"none";if(!this.validTypes.includes(n))throw new e("MIMETEXT_INVALID_MESSAGE_TYPE",`Valid content types are ${this.validTypes.join(", ")} but you specified "${n}".`);const r=t.headers["Content-Transfer-Encoding"]??t.encoding??"7bit";this.validContentTransferEncodings.includes(r)||(n="application/octet-stream");const i=t.charset??"UTF-8";return t.headers=Object.assign({},t.headers,{"Content-Type":`${n}; charset=${i}`,"Content-Transfer-Encoding":r}),this._addMessage({data:t.data,headers:t.headers})}_addMessage(t){const e=new Nn(this.envctx,t.data,t.headers);return this.messages.push(e),e}setSender(t,e={type:"From"}){const n=new Rn(t,e);return this.setHeader("From",n),n}getSender(){return this.getHeader("From")}setRecipients(t,e={type:"To"}){const n=(this.isArray(t)?t:[t]).map((t=>new Rn(t,e)));return this.setHeader(e.type,n),n}getRecipients(t={type:"To"}){return this.getHeader(t.type)}setRecipient(t,e={type:"To"}){return this.setRecipients(t,e)}setTo(t,e={type:"To"}){return this.setRecipients(t,e)}setCc(t,e={type:"Cc"}){return this.setRecipients(t,e)}setBcc(t,e={type:"Bcc"}){return this.setRecipients(t,e)}setSubject(t){return this.setHeader("subject",t),t}getSubject(){return this.getHeader("subject")}setHeader(t,e){return this.headers.set(t,e),t}getHeader(t){return this.headers.get(t)}setHeaders(t){return Object.keys(t).map((e=>this.setHeader(e,t[e])))}getHeaders(){return this.headers.toObject()}toBase64(t){return this.envctx.toBase64(t)}toBase64WebSafe(t){return this.envctx.toBase64WebSafe(t)}generateBoundaries(){this.boundaries={mixed:Math.random().toString(36).slice(2),alt:Math.random().toString(36).slice(2),related:Math.random().toString(36).slice(2)}}isArray(t){return!!t&&t.constructor===Array}isObject(t){return!!t&&t.constructor===Object}}const Un={toBase64:function(t){return Utilities.base64Encode(t,Utilities.Charset.UTF_8)},toBase64WebSafe:function(t){return Utilities.base64EncodeWebSafe(t)},eol:"\r\n",validateContentType:t=>t.length>0&&t};return t.MIMEMessage=Xn,t.MIMEMessageContent=Nn,t.MIMEMessageHeader=Fn,t.MIMETextError=e,t.Mailbox=Rn,t.createMimeMessage=function(){return new Xn(Un)},t}({});
//# sourceMappingURL=mimetext.gas.iife.js.map