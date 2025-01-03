import{Base64 as e}from"js-base64";import t from"@babel/runtime-corejs3/helpers/esm/defineProperty";import s from"@babel/runtime-corejs3/core-js/instance/trim";class n extends Error{constructor(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";super(s),t(this,"name",""),t(this,"description",""),this.name=e,this.description=s}}class i{constructor(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"To"};t(this,"reSpecCompliantAddr",/(([^<>\r\n]+)\s)?<[^\r\n]+>/),t(this,"name",""),t(this,"addr",""),t(this,"type","To"),this.type=s.type,this.parse(e)}getAddrDomain(){if(this.addr.includes("@")){const e=this.addr.split("@");if(e.length>1)return e[1]}return""}dump(){return this.name.length>0?'"'.concat(this.name,'" <').concat(this.addr,">"):"<".concat(this.addr,">")}parse(e){if(this.isMailboxAddrObject(e))return this.addr=e.addr,"string"==typeof e.name&&(this.name=e.name),"string"==typeof e.type&&(this.type=e.type),this;if(this.isMailboxAddrText(e)){const t=s(e).call(e);if(t.startsWith("<")&&t.endsWith(">"))return this.addr=t.slice(1,-1),this;const n=t.split(" <");return n[0]=/^("|')/.test(n[0])?n[0].slice(1):n[0],n[0]=/("|')$/.test(n[0])?n[0].slice(0,-1):n[0],n[1]=n[1].slice(0,-1),this.name=n[0],this.addr=n[1],this}if("string"==typeof e)return this.addr=e,this;throw new n("MIMETEXT_INVALID_MAILBOX","Couldn't recognize the input.")}isMailboxAddrText(e){return"string"==typeof e&&this.reSpecCompliantAddr.test(e)}isMailboxAddrObject(e){return this.isObject(e)&&Object.hasOwn(e,"addr")}isObject(e){return!!e&&e.constructor===Object}}class a{constructor(e){t(this,"envctx",void 0),t(this,"fields",[{name:"Date",generator:()=>(new Date).toUTCString().replace(/GMT|UTC/gi,"+0000")},{name:"From",required:!0,validate:e=>this.validateMailboxSingle(e),dump:e=>this.dumpMailboxSingle(e)},{name:"Sender",validate:e=>this.validateMailboxSingle(e),dump:e=>this.dumpMailboxSingle(e)},{name:"Reply-To",validate:e=>this.validateMailboxSingle(e),dump:e=>this.dumpMailboxSingle(e)},{name:"To",validate:e=>this.validateMailboxMulti(e),dump:e=>this.dumpMailboxMulti(e)},{name:"Cc",validate:e=>this.validateMailboxMulti(e),dump:e=>this.dumpMailboxMulti(e)},{name:"Bcc",validate:e=>this.validateMailboxMulti(e),dump:e=>this.dumpMailboxMulti(e)},{name:"Message-ID",generator:()=>"<"+Math.random().toString(36).slice(2)+"@"+this.fields.filter((e=>"From"===e.name))[0].value.getAddrDomain()+">"},{name:"Subject",required:!0,dump:e=>"string"==typeof e?"=?utf-8?B?"+this.envctx.toBase64(e)+"?=":""},{name:"MIME-Version",generator:()=>"1.0"}]),this.envctx=e}dump(){let e="";for(const t of this.fields){if(t.disabled)continue;const s=void 0!==t.value&&null!==t.value;if(!s&&t.required)throw new n("MIMETEXT_MISSING_HEADER",'The "'.concat(t.name,'" header is required.'));if(!s&&"function"!=typeof t.generator)continue;s||"function"!=typeof t.generator||(t.value=t.generator());const i=Object.hasOwn(t,"dump")&&"function"==typeof t.dump?t.dump(t.value):"string"==typeof t.value?t.value:"";e+="".concat(t.name,": ").concat(i).concat(this.envctx.eol)}return e.slice(0,-1*this.envctx.eol.length)}toObject(){return this.fields.reduce(((e,t)=>(e[t.name]=t.value,e)),{})}get(e){const t=this.fields.findIndex((t=>t.name.toLowerCase()===e.toLowerCase()));return-1!==t?this.fields[t].value:void 0}set(e,t){const s=t=>t.name.toLowerCase()===e.toLowerCase();if(!!this.fields.some(s)){const i=this.fields.findIndex(s),a=this.fields[i];if(a.validate&&!a.validate(t))throw new n("MIMETEXT_INVALID_HEADER_VALUE",'The value for the header "'.concat(e,'" is invalid.'));return this.fields[i].value=t,this.fields[i]}return this.setCustom({name:e,value:t,custom:!0,dump:e=>"string"==typeof e?e:""})}setCustom(e){if(this.isHeaderField(e)){if("string"!=typeof e.value)throw new n("MIMETEXT_INVALID_HEADER_FIELD","Custom header must have a value.");return this.fields.push(e),e}throw new n("MIMETEXT_INVALID_HEADER_FIELD","Invalid input for custom header. It must be in type of HeaderField.")}validateMailboxSingle(e){return e instanceof i}validateMailboxMulti(e){return e instanceof i||this.isArrayOfMailboxes(e)}dumpMailboxMulti(e){const t=e=>0===e.name.length?e.dump():"=?utf-8?B?".concat(this.envctx.toBase64(e.name),"?= <").concat(e.addr,">");return this.isArrayOfMailboxes(e)?e.map(t).join(",".concat(this.envctx.eol," ")):e instanceof i?t(e):""}dumpMailboxSingle(e){return e instanceof i?(e=>0===e.name.length?e.dump():"=?utf-8?B?".concat(this.envctx.toBase64(e.name),"?= <").concat(e.addr,">"))(e):""}isHeaderField(e){const t=["name","value","dump","required","disabled","generator","custom"];if(this.isObject(e)){const s=e;if(Object.hasOwn(s,"name")&&"string"==typeof s.name&&s.name.length>0&&!Object.keys(s).some((e=>!t.includes(e))))return!0}return!1}isObject(e){return!!e&&e.constructor===Object}isArrayOfMailboxes(e){return this.isArray(e)&&e.every((e=>e instanceof i))}isArray(e){return!!e&&e.constructor===Array}}class r extends a{constructor(e){super(e),t(this,"fields",[{name:"Content-ID"},{name:"Content-Type"},{name:"Content-Transfer-Encoding"},{name:"Content-Disposition"}])}}class o{constructor(e,s){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};t(this,"envctx",void 0),t(this,"headers",void 0),t(this,"data",void 0),this.envctx=e,this.headers=new r(this.envctx),this.data=s,this.setHeaders(n)}dump(){const e=this.envctx.eol;return this.headers.dump()+e+e+this.data}isAttachment(){const e=this.headers.get("Content-Disposition");return"string"==typeof e&&e.includes("attachment")}isInlineAttachment(){const e=this.headers.get("Content-Disposition");return"string"==typeof e&&e.includes("inline")}setHeader(e,t){return this.headers.set(e,t),e}getHeader(e){return this.headers.get(e)}setHeaders(e){return Object.keys(e).map((t=>this.setHeader(t,e[t])))}getHeaders(){return this.headers.toObject()}}class d{constructor(e){t(this,"envctx",void 0),t(this,"headers",void 0),t(this,"boundaries",{mixed:"",alt:"",related:""}),t(this,"validTypes",["text/html","text/plain"]),t(this,"validContentTransferEncodings",["7bit","8bit","binary","quoted-printable","base64"]),t(this,"messages",[]),this.envctx=e,this.headers=new a(this.envctx),this.messages=[],this.generateBoundaries()}asRaw(){const e=this.envctx.eol,t=this.headers.dump(),s=this.getMessageByType("text/plain"),i=this.getMessageByType("text/html"),a=null!=i?i:null!=s?s:void 0;if(void 0===a)throw new n("MIMETEXT_MISSING_BODY","No content added to the message.");const r=this.hasAttachments(),o=this.hasInlineAttachments(),d=o&&r?"mixed+related":r?"mixed":o?"related":s&&i?"alternative":"";if("mixed+related"===d){const n=this.getAttachments().map((t=>"--"+this.boundaries.mixed+e+t.dump()+e+e)).join("").slice(0,-1*e.length),a=this.getInlineAttachments().map((t=>"--"+this.boundaries.related+e+t.dump()+e+e)).join("").slice(0,-1*e.length);return t+e+"Content-Type: multipart/mixed; boundary="+this.boundaries.mixed+e+e+"--"+this.boundaries.mixed+e+"Content-Type: multipart/related; boundary="+this.boundaries.related+e+e+this.dumpTextContent(s,i,this.boundaries.related)+e+e+a+"--"+this.boundaries.related+"--"+e+n+"--"+this.boundaries.mixed+"--"}if("mixed"===d){const n=this.getAttachments().map((t=>"--"+this.boundaries.mixed+e+t.dump()+e+e)).join("").slice(0,-1*e.length);return t+e+"Content-Type: multipart/mixed; boundary="+this.boundaries.mixed+e+e+this.dumpTextContent(s,i,this.boundaries.mixed)+e+(s&&i?"":e)+n+"--"+this.boundaries.mixed+"--"}if("related"===d){const n=this.getInlineAttachments().map((t=>"--"+this.boundaries.related+e+t.dump()+e+e)).join("").slice(0,-1*e.length);return t+e+"Content-Type: multipart/related; boundary="+this.boundaries.related+e+e+this.dumpTextContent(s,i,this.boundaries.related)+e+e+n+"--"+this.boundaries.related+"--"}return"alternative"===d?t+e+"Content-Type: multipart/alternative; boundary="+this.boundaries.alt+e+e+this.dumpTextContent(s,i,this.boundaries.alt)+e+e+"--"+this.boundaries.alt+"--":t+e+a.dump()}asEncoded(){return this.envctx.toBase64WebSafe(this.asRaw())}dumpTextContent(e,t,s){const n=this.envctx.eol,i=null!=t?t:e;let a="";return a=e&&t&&!this.hasInlineAttachments()&&this.hasAttachments()?"--"+s+n+"Content-Type: multipart/alternative; boundary="+this.boundaries.alt+n+n+"--"+this.boundaries.alt+n+e.dump()+n+n+"--"+this.boundaries.alt+n+t.dump()+n+n+"--"+this.boundaries.alt+"--":e&&t&&this.hasInlineAttachments()?"--"+s+n+t.dump():e&&t?"--"+s+n+e.dump()+n+n+"--"+s+n+t.dump():"--"+s+n+i.dump(),a}hasInlineAttachments(){return this.messages.some((e=>e.isInlineAttachment()))}hasAttachments(){return this.messages.some((e=>e.isAttachment()))}getAttachments(){const e=e=>e.isAttachment();return this.messages.some(e)?this.messages.filter(e):[]}getInlineAttachments(){const e=e=>e.isInlineAttachment();return this.messages.some(e)?this.messages.filter(e):[]}getMessageByType(e){const t=t=>!t.isAttachment()&&!t.isInlineAttachment()&&(t.getHeader("Content-Type")||"").includes(e);return this.messages.some(t)?this.messages.filter(t)[0]:void 0}addAttachment(e){var t,s,i;if(this.isObject(e.headers)||(e.headers={}),"string"!=typeof e.filename)throw new n("MIMETEXT_MISSING_FILENAME",'The property "filename" must exist while adding attachments.');let a=(null!==(t=e.headers["Content-Type"])&&void 0!==t?t:e.contentType)||"none";if(!1===this.envctx.validateContentType(a))throw new n("MIMETEXT_INVALID_MESSAGE_TYPE",'You specified an invalid content type "'.concat(a,'".'));const r=null!==(s=null!==(i=e.headers["Content-Transfer-Encoding"])&&void 0!==i?i:e.encoding)&&void 0!==s?s:"base64";this.validContentTransferEncodings.includes(r)||(a="application/octet-stream");const o=e.headers["Content-ID"];"string"==typeof o&&o.length>2&&!o.startsWith("<")&&!o.endsWith(">")&&(e.headers["Content-ID"]="<"+e.headers["Content-ID"]+">");const d=e.inline?"inline":"attachment";return e.headers=Object.assign({},e.headers,{"Content-Type":"".concat(a,'; name="').concat(e.filename,'"'),"Content-Transfer-Encoding":r,"Content-Disposition":"".concat(d,'; filename="').concat(e.filename,'"')}),this._addMessage({data:e.data,headers:e.headers})}addMessage(e){var t,s,i,a;this.isObject(e.headers)||(e.headers={});let r=(null!==(t=e.headers["Content-Type"])&&void 0!==t?t:e.contentType)||"none";if(!this.validTypes.includes(r))throw new n("MIMETEXT_INVALID_MESSAGE_TYPE","Valid content types are ".concat(this.validTypes.join(", "),' but you specified "').concat(r,'".'));const o=null!==(s=null!==(i=e.headers["Content-Transfer-Encoding"])&&void 0!==i?i:e.encoding)&&void 0!==s?s:"7bit";this.validContentTransferEncodings.includes(o)||(r="application/octet-stream");const d=null!==(a=e.charset)&&void 0!==a?a:"UTF-8";return e.headers=Object.assign({},e.headers,{"Content-Type":"".concat(r,"; charset=").concat(d),"Content-Transfer-Encoding":o}),this._addMessage({data:e.data,headers:e.headers})}_addMessage(e){const t=new o(this.envctx,e.data,e.headers);return this.messages.push(t),t}setSender(e){const t=new i(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"From"});return this.setHeader("From",t),t}getSender(){return this.getHeader("From")}setRecipients(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"To"};const s=(this.isArray(e)?e:[e]).map((e=>new i(e,t)));return this.setHeader(t.type,s),s}getRecipients(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{type:"To"};return this.getHeader(e.type)}setRecipient(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"To"};return this.setRecipients(e,t)}setTo(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"To"};return this.setRecipients(e,t)}setCc(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"Cc"};return this.setRecipients(e,t)}setBcc(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{type:"Bcc"};return this.setRecipients(e,t)}setSubject(e){return this.setHeader("subject",e),e}getSubject(){return this.getHeader("subject")}setHeader(e,t){return this.headers.set(e,t),e}getHeader(e){return this.headers.get(e)}setHeaders(e){return Object.keys(e).map((t=>this.setHeader(t,e[t])))}getHeaders(){return this.headers.toObject()}toBase64(e){return this.envctx.toBase64(e)}toBase64WebSafe(e){return this.envctx.toBase64WebSafe(e)}generateBoundaries(){this.boundaries={mixed:Math.random().toString(36).slice(2),alt:Math.random().toString(36).slice(2),related:Math.random().toString(36).slice(2)}}isArray(e){return!!e&&e.constructor===Array}isObject(e){return!!e&&e.constructor===Object}}const h={toBase64:function(t){return e.encode(t)},toBase64WebSafe:function(t){return e.encodeURI(t)},eol:"\r\n",validateContentType:e=>e.length>0&&e};function c(){return new d(h)}export{d as MIMEMessage,o as MIMEMessageContent,a as MIMEMessageHeader,n as MIMETextError,i as Mailbox,c as createMimeMessage};
//# sourceMappingURL=mimetext.browser.es.js.map
