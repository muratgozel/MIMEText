import { e } from './chunk-HUCYWSMS.js';
export { e as MIMEMessage, d as MIMEMessageContent, c as MIMEMessageHeader, a as MIMETextError, b as Mailbox } from './chunk-HUCYWSMS.js';
import { EOL } from 'node:os';
import * as o from 'mime-types';

var f={toBase64:function(r){return Buffer.from(r).toString("base64")},toBase64WebSafe:function(r){return Buffer.from(r).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},eol:EOL,validateContentType:e=>o.contentType(e)};function c(e$1={skipEncodingPureAsciiHeaders:!1}){return new e(f,e$1)}

export { c as createMimeMessage };
//# sourceMappingURL=node.js.map
//# sourceMappingURL=node.js.map