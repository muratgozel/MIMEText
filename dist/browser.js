import { e } from './chunk-HUCYWSMS.js';
export { e as MIMEMessage, d as MIMEMessageContent, c as MIMEMessageHeader, a as MIMETextError, b as Mailbox } from './chunk-HUCYWSMS.js';
import { Base64 } from 'js-base64';

var p={toBase64:function(r){return Base64.encode(r)},toBase64WebSafe:function(r){return Base64.encodeURI(r)},eol:`\r
`,validateContentType:e=>e.length>0?e:!1};function E(e$1={skipEncodingPureAsciiHeaders:!1}){return new e(p,e$1)}

export { E as createMimeMessage };
//# sourceMappingURL=browser.js.map
//# sourceMappingURL=browser.js.map