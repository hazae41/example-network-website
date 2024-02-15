/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/worker/index.ts":
/*!*****************************!*\
  !*** ./src/worker/index.ts ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Secret: () => (/* binding */ Secret)
/* harmony export */ });
/* harmony import */ var _hazae41_symbol_dispose_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/symbol-dispose-polyfill */ "./node_modules/@hazae41/symbol-dispose-polyfill/dist/esm/index.mjs");
/* harmony import */ var _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @hazae41/base16 */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs");
/* harmony import */ var _hazae41_binary__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @hazae41/binary */ "./node_modules/@hazae41/binary/dist/esm/mods/binary/writable.mjs");
/* harmony import */ var _hazae41_cubane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/cubane */ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/tuple/tuple.mjs");
/* harmony import */ var _hazae41_cubane__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @hazae41/cubane */ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/uint/uint.mjs");
/* harmony import */ var _hazae41_cubane__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @hazae41/cubane */ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/address/address.mjs");
/* harmony import */ var _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/keccak256 */ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/adapter.mjs");
/* harmony import */ var _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/keccak256 */ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/morax.mjs");





const maxUint256BigInt = 2n ** 256n - 1n;
var Secret;
(function(Secret) {
    function sortLowToHigh(a, b) {
        return a.valueBigInt < b.valueBigInt ? -1 : 1;
    }
    Secret.sortLowToHigh = sortLowToHigh;
})(Secret || (Secret = {}));
async function initOrThrow(chainIdNumber, contractZeroHex, receiverZeroHex) {
    _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_1__.set(await _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_2__.fromMorax());
    const Mixin = _hazae41_cubane__WEBPACK_IMPORTED_MODULE_3__.Tuple.create(_hazae41_cubane__WEBPACK_IMPORTED_MODULE_4__.Uint64, _hazae41_cubane__WEBPACK_IMPORTED_MODULE_5__.Address, _hazae41_cubane__WEBPACK_IMPORTED_MODULE_5__.Address, _hazae41_cubane__WEBPACK_IMPORTED_MODULE_4__.Uint256);
    const chainIdBase16 = chainIdNumber.toString(16);
    const chainIdBytes = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().padStartAndDecodeOrThrow(chainIdBase16).copyAndDispose();
    const contractBase16 = contractZeroHex.slice(2);
    const contractBytes = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().padStartAndDecodeOrThrow(contractBase16).copyAndDispose();
    const receiverBase16 = receiverZeroHex.slice(2);
    const receiverBytes = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().padStartAndDecodeOrThrow(receiverBase16).copyAndDispose();
    const mixinAbi = Mixin.from([
        chainIdBytes,
        contractBytes,
        receiverBytes,
        new Uint8Array(32)
    ]);
    const mixinBytes = _hazae41_binary__WEBPACK_IMPORTED_MODULE_7__.Writable.writeToBytesOrThrow(mixinAbi);
    return {
        mixinBytes
    };
}
function generateOrThrow(param) {
    let { mixinBytes } = param;
    const secrets = new Array();
    const priceBigInt = 10n ** 5n;
    const maxCountNumber = 10;
    const maxCountBigInt = BigInt(maxCountNumber);
    const minValueBigInt = priceBigInt / maxCountBigInt;
    const mixinOffset = mixinBytes.length - 32;
    const secretBytes = new Uint8Array(32);
    let totalBigInt = 0n;
    while(totalBigInt < priceBigInt){
        /**
     * Generate a secret
     */ crypto.getRandomValues(secretBytes);
        /**
     * Generate a proof of the secret
     */ const proofBytes = _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_1__.get().hashOrThrow(secretBytes).copyAndDispose();
        /**
     * Mix the proof with the public stuff
     */ mixinBytes.set(proofBytes, mixinOffset);
        /**
     * Compute the divisor
     */ const divisorBytes = _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_1__.get().hashOrThrow(mixinBytes).copyAndDispose();
        const divisorBase16 = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().encodeOrThrow(divisorBytes);
        const divisorBigInt = BigInt("0x".concat(divisorBase16));
        /**
     * Compute the value
     */ const valueBigInt = maxUint256BigInt / divisorBigInt;
        if (valueBigInt < minValueBigInt) continue;
        if (secrets.length === maxCountNumber) {
            /**
       * Skip if the value is too small
       */ if (valueBigInt < secrets[0].valueBigInt) continue;
            /**
       * Replace the smallest secret
       */ totalBigInt -= secrets[0].valueBigInt;
            const secretBase16 = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().encodeOrThrow(secretBytes);
            secrets[0] = {
                secretBase16,
                valueBigInt
            };
        } else {
            const secretBase16 = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().encodeOrThrow(secretBytes);
            secrets.push({
                secretBase16,
                valueBigInt
            });
        }
        secrets.sort(Secret.sortLowToHigh);
        totalBigInt += valueBigInt;
        continue;
    }
    return secrets.map((x)=>x.secretBase16);
}
const chainIdNumber = 1;
const contractZeroHex = "0xB57ee0797C3fc0205714a577c02F7205bB89dF30";
const receiverZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
const init = initOrThrow(chainIdNumber, contractZeroHex, receiverZeroHex);
init.catch(()=>{});
self.addEventListener("message", async ()=>self.postMessage(generateOrThrow(await init)));


;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "./node_modules/next/dist/compiled/buffer/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/next/dist/compiled/buffer/index.js ***!
  \*********************************************************/
/***/ ((module) => {

var __dirname = "/";
(function(){var e={675:function(e,r){"use strict";r.byteLength=byteLength;r.toByteArray=toByteArray;r.fromByteArray=fromByteArray;var t=[];var f=[];var n=typeof Uint8Array!=="undefined"?Uint8Array:Array;var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var o=0,u=i.length;o<u;++o){t[o]=i[o];f[i.charCodeAt(o)]=o}f["-".charCodeAt(0)]=62;f["_".charCodeAt(0)]=63;function getLens(e){var r=e.length;if(r%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var t=e.indexOf("=");if(t===-1)t=r;var f=t===r?0:4-t%4;return[t,f]}function byteLength(e){var r=getLens(e);var t=r[0];var f=r[1];return(t+f)*3/4-f}function _byteLength(e,r,t){return(r+t)*3/4-t}function toByteArray(e){var r;var t=getLens(e);var i=t[0];var o=t[1];var u=new n(_byteLength(e,i,o));var a=0;var s=o>0?i-4:i;var h;for(h=0;h<s;h+=4){r=f[e.charCodeAt(h)]<<18|f[e.charCodeAt(h+1)]<<12|f[e.charCodeAt(h+2)]<<6|f[e.charCodeAt(h+3)];u[a++]=r>>16&255;u[a++]=r>>8&255;u[a++]=r&255}if(o===2){r=f[e.charCodeAt(h)]<<2|f[e.charCodeAt(h+1)]>>4;u[a++]=r&255}if(o===1){r=f[e.charCodeAt(h)]<<10|f[e.charCodeAt(h+1)]<<4|f[e.charCodeAt(h+2)]>>2;u[a++]=r>>8&255;u[a++]=r&255}return u}function tripletToBase64(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[e&63]}function encodeChunk(e,r,t){var f;var n=[];for(var i=r;i<t;i+=3){f=(e[i]<<16&16711680)+(e[i+1]<<8&65280)+(e[i+2]&255);n.push(tripletToBase64(f))}return n.join("")}function fromByteArray(e){var r;var f=e.length;var n=f%3;var i=[];var o=16383;for(var u=0,a=f-n;u<a;u+=o){i.push(encodeChunk(e,u,u+o>a?a:u+o))}if(n===1){r=e[f-1];i.push(t[r>>2]+t[r<<4&63]+"==")}else if(n===2){r=(e[f-2]<<8)+e[f-1];i.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")}return i.join("")}},72:function(e,r,t){"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var f=t(675);var n=t(783);var i=typeof Symbol==="function"&&typeof Symbol.for==="function"?Symbol.for("nodejs.util.inspect.custom"):null;r.Buffer=Buffer;r.SlowBuffer=SlowBuffer;r.INSPECT_MAX_BYTES=50;var o=2147483647;r.kMaxLength=o;Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport();if(!Buffer.TYPED_ARRAY_SUPPORT&&typeof console!=="undefined"&&typeof console.error==="function"){console.error("This browser lacks typed array (Uint8Array) support which is required by "+"`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")}function typedArraySupport(){try{var e=new Uint8Array(1);var r={foo:function(){return 42}};Object.setPrototypeOf(r,Uint8Array.prototype);Object.setPrototypeOf(e,r);return e.foo()===42}catch(e){return false}}Object.defineProperty(Buffer.prototype,"parent",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.buffer}});Object.defineProperty(Buffer.prototype,"offset",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.byteOffset}});function createBuffer(e){if(e>o){throw new RangeError('The value "'+e+'" is invalid for option "size"')}var r=new Uint8Array(e);Object.setPrototypeOf(r,Buffer.prototype);return r}function Buffer(e,r,t){if(typeof e==="number"){if(typeof r==="string"){throw new TypeError('The "string" argument must be of type string. Received type number')}return allocUnsafe(e)}return from(e,r,t)}Buffer.poolSize=8192;function from(e,r,t){if(typeof e==="string"){return fromString(e,r)}if(ArrayBuffer.isView(e)){return fromArrayLike(e)}if(e==null){throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer)){return fromArrayBuffer(e,r,t)}if(typeof SharedArrayBuffer!=="undefined"&&(isInstance(e,SharedArrayBuffer)||e&&isInstance(e.buffer,SharedArrayBuffer))){return fromArrayBuffer(e,r,t)}if(typeof e==="number"){throw new TypeError('The "value" argument must not be of type number. Received type number')}var f=e.valueOf&&e.valueOf();if(f!=null&&f!==e){return Buffer.from(f,r,t)}var n=fromObject(e);if(n)return n;if(typeof Symbol!=="undefined"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]==="function"){return Buffer.from(e[Symbol.toPrimitive]("string"),r,t)}throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}Buffer.from=function(e,r,t){return from(e,r,t)};Object.setPrototypeOf(Buffer.prototype,Uint8Array.prototype);Object.setPrototypeOf(Buffer,Uint8Array);function assertSize(e){if(typeof e!=="number"){throw new TypeError('"size" argument must be of type number')}else if(e<0){throw new RangeError('The value "'+e+'" is invalid for option "size"')}}function alloc(e,r,t){assertSize(e);if(e<=0){return createBuffer(e)}if(r!==undefined){return typeof t==="string"?createBuffer(e).fill(r,t):createBuffer(e).fill(r)}return createBuffer(e)}Buffer.alloc=function(e,r,t){return alloc(e,r,t)};function allocUnsafe(e){assertSize(e);return createBuffer(e<0?0:checked(e)|0)}Buffer.allocUnsafe=function(e){return allocUnsafe(e)};Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)};function fromString(e,r){if(typeof r!=="string"||r===""){r="utf8"}if(!Buffer.isEncoding(r)){throw new TypeError("Unknown encoding: "+r)}var t=byteLength(e,r)|0;var f=createBuffer(t);var n=f.write(e,r);if(n!==t){f=f.slice(0,n)}return f}function fromArrayLike(e){var r=e.length<0?0:checked(e.length)|0;var t=createBuffer(r);for(var f=0;f<r;f+=1){t[f]=e[f]&255}return t}function fromArrayBuffer(e,r,t){if(r<0||e.byteLength<r){throw new RangeError('"offset" is outside of buffer bounds')}if(e.byteLength<r+(t||0)){throw new RangeError('"length" is outside of buffer bounds')}var f;if(r===undefined&&t===undefined){f=new Uint8Array(e)}else if(t===undefined){f=new Uint8Array(e,r)}else{f=new Uint8Array(e,r,t)}Object.setPrototypeOf(f,Buffer.prototype);return f}function fromObject(e){if(Buffer.isBuffer(e)){var r=checked(e.length)|0;var t=createBuffer(r);if(t.length===0){return t}e.copy(t,0,0,r);return t}if(e.length!==undefined){if(typeof e.length!=="number"||numberIsNaN(e.length)){return createBuffer(0)}return fromArrayLike(e)}if(e.type==="Buffer"&&Array.isArray(e.data)){return fromArrayLike(e.data)}}function checked(e){if(e>=o){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+o.toString(16)+" bytes")}return e|0}function SlowBuffer(e){if(+e!=e){e=0}return Buffer.alloc(+e)}Buffer.isBuffer=function isBuffer(e){return e!=null&&e._isBuffer===true&&e!==Buffer.prototype};Buffer.compare=function compare(e,r){if(isInstance(e,Uint8Array))e=Buffer.from(e,e.offset,e.byteLength);if(isInstance(r,Uint8Array))r=Buffer.from(r,r.offset,r.byteLength);if(!Buffer.isBuffer(e)||!Buffer.isBuffer(r)){throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')}if(e===r)return 0;var t=e.length;var f=r.length;for(var n=0,i=Math.min(t,f);n<i;++n){if(e[n]!==r[n]){t=e[n];f=r[n];break}}if(t<f)return-1;if(f<t)return 1;return 0};Buffer.isEncoding=function isEncoding(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true;default:return false}};Buffer.concat=function concat(e,r){if(!Array.isArray(e)){throw new TypeError('"list" argument must be an Array of Buffers')}if(e.length===0){return Buffer.alloc(0)}var t;if(r===undefined){r=0;for(t=0;t<e.length;++t){r+=e[t].length}}var f=Buffer.allocUnsafe(r);var n=0;for(t=0;t<e.length;++t){var i=e[t];if(isInstance(i,Uint8Array)){i=Buffer.from(i)}if(!Buffer.isBuffer(i)){throw new TypeError('"list" argument must be an Array of Buffers')}i.copy(f,n);n+=i.length}return f};function byteLength(e,r){if(Buffer.isBuffer(e)){return e.length}if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer)){return e.byteLength}if(typeof e!=="string"){throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. '+"Received type "+typeof e)}var t=e.length;var f=arguments.length>2&&arguments[2]===true;if(!f&&t===0)return 0;var n=false;for(;;){switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return base64ToBytes(e).length;default:if(n){return f?-1:utf8ToBytes(e).length}r=(""+r).toLowerCase();n=true}}}Buffer.byteLength=byteLength;function slowToString(e,r,t){var f=false;if(r===undefined||r<0){r=0}if(r>this.length){return""}if(t===undefined||t>this.length){t=this.length}if(t<=0){return""}t>>>=0;r>>>=0;if(t<=r){return""}if(!e)e="utf8";while(true){switch(e){case"hex":return hexSlice(this,r,t);case"utf8":case"utf-8":return utf8Slice(this,r,t);case"ascii":return asciiSlice(this,r,t);case"latin1":case"binary":return latin1Slice(this,r,t);case"base64":return base64Slice(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,r,t);default:if(f)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase();f=true}}}Buffer.prototype._isBuffer=true;function swap(e,r,t){var f=e[r];e[r]=e[t];e[t]=f}Buffer.prototype.swap16=function swap16(){var e=this.length;if(e%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var r=0;r<e;r+=2){swap(this,r,r+1)}return this};Buffer.prototype.swap32=function swap32(){var e=this.length;if(e%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var r=0;r<e;r+=4){swap(this,r,r+3);swap(this,r+1,r+2)}return this};Buffer.prototype.swap64=function swap64(){var e=this.length;if(e%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var r=0;r<e;r+=8){swap(this,r,r+7);swap(this,r+1,r+6);swap(this,r+2,r+5);swap(this,r+3,r+4)}return this};Buffer.prototype.toString=function toString(){var e=this.length;if(e===0)return"";if(arguments.length===0)return utf8Slice(this,0,e);return slowToString.apply(this,arguments)};Buffer.prototype.toLocaleString=Buffer.prototype.toString;Buffer.prototype.equals=function equals(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(this===e)return true;return Buffer.compare(this,e)===0};Buffer.prototype.inspect=function inspect(){var e="";var t=r.INSPECT_MAX_BYTES;e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim();if(this.length>t)e+=" ... ";return"<Buffer "+e+">"};if(i){Buffer.prototype[i]=Buffer.prototype.inspect}Buffer.prototype.compare=function compare(e,r,t,f,n){if(isInstance(e,Uint8Array)){e=Buffer.from(e,e.offset,e.byteLength)}if(!Buffer.isBuffer(e)){throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. '+"Received type "+typeof e)}if(r===undefined){r=0}if(t===undefined){t=e?e.length:0}if(f===undefined){f=0}if(n===undefined){n=this.length}if(r<0||t>e.length||f<0||n>this.length){throw new RangeError("out of range index")}if(f>=n&&r>=t){return 0}if(f>=n){return-1}if(r>=t){return 1}r>>>=0;t>>>=0;f>>>=0;n>>>=0;if(this===e)return 0;var i=n-f;var o=t-r;var u=Math.min(i,o);var a=this.slice(f,n);var s=e.slice(r,t);for(var h=0;h<u;++h){if(a[h]!==s[h]){i=a[h];o=s[h];break}}if(i<o)return-1;if(o<i)return 1;return 0};function bidirectionalIndexOf(e,r,t,f,n){if(e.length===0)return-1;if(typeof t==="string"){f=t;t=0}else if(t>2147483647){t=2147483647}else if(t<-2147483648){t=-2147483648}t=+t;if(numberIsNaN(t)){t=n?0:e.length-1}if(t<0)t=e.length+t;if(t>=e.length){if(n)return-1;else t=e.length-1}else if(t<0){if(n)t=0;else return-1}if(typeof r==="string"){r=Buffer.from(r,f)}if(Buffer.isBuffer(r)){if(r.length===0){return-1}return arrayIndexOf(e,r,t,f,n)}else if(typeof r==="number"){r=r&255;if(typeof Uint8Array.prototype.indexOf==="function"){if(n){return Uint8Array.prototype.indexOf.call(e,r,t)}else{return Uint8Array.prototype.lastIndexOf.call(e,r,t)}}return arrayIndexOf(e,[r],t,f,n)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,r,t,f,n){var i=1;var o=e.length;var u=r.length;if(f!==undefined){f=String(f).toLowerCase();if(f==="ucs2"||f==="ucs-2"||f==="utf16le"||f==="utf-16le"){if(e.length<2||r.length<2){return-1}i=2;o/=2;u/=2;t/=2}}function read(e,r){if(i===1){return e[r]}else{return e.readUInt16BE(r*i)}}var a;if(n){var s=-1;for(a=t;a<o;a++){if(read(e,a)===read(r,s===-1?0:a-s)){if(s===-1)s=a;if(a-s+1===u)return s*i}else{if(s!==-1)a-=a-s;s=-1}}}else{if(t+u>o)t=o-u;for(a=t;a>=0;a--){var h=true;for(var c=0;c<u;c++){if(read(e,a+c)!==read(r,c)){h=false;break}}if(h)return a}}return-1}Buffer.prototype.includes=function includes(e,r,t){return this.indexOf(e,r,t)!==-1};Buffer.prototype.indexOf=function indexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,true)};Buffer.prototype.lastIndexOf=function lastIndexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,false)};function hexWrite(e,r,t,f){t=Number(t)||0;var n=e.length-t;if(!f){f=n}else{f=Number(f);if(f>n){f=n}}var i=r.length;if(f>i/2){f=i/2}for(var o=0;o<f;++o){var u=parseInt(r.substr(o*2,2),16);if(numberIsNaN(u))return o;e[t+o]=u}return o}function utf8Write(e,r,t,f){return blitBuffer(utf8ToBytes(r,e.length-t),e,t,f)}function asciiWrite(e,r,t,f){return blitBuffer(asciiToBytes(r),e,t,f)}function latin1Write(e,r,t,f){return asciiWrite(e,r,t,f)}function base64Write(e,r,t,f){return blitBuffer(base64ToBytes(r),e,t,f)}function ucs2Write(e,r,t,f){return blitBuffer(utf16leToBytes(r,e.length-t),e,t,f)}Buffer.prototype.write=function write(e,r,t,f){if(r===undefined){f="utf8";t=this.length;r=0}else if(t===undefined&&typeof r==="string"){f=r;t=this.length;r=0}else if(isFinite(r)){r=r>>>0;if(isFinite(t)){t=t>>>0;if(f===undefined)f="utf8"}else{f=t;t=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var n=this.length-r;if(t===undefined||t>n)t=n;if(e.length>0&&(t<0||r<0)||r>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!f)f="utf8";var i=false;for(;;){switch(f){case"hex":return hexWrite(this,e,r,t);case"utf8":case"utf-8":return utf8Write(this,e,r,t);case"ascii":return asciiWrite(this,e,r,t);case"latin1":case"binary":return latin1Write(this,e,r,t);case"base64":return base64Write(this,e,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,r,t);default:if(i)throw new TypeError("Unknown encoding: "+f);f=(""+f).toLowerCase();i=true}}};Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(e,r,t){if(r===0&&t===e.length){return f.fromByteArray(e)}else{return f.fromByteArray(e.slice(r,t))}}function utf8Slice(e,r,t){t=Math.min(e.length,t);var f=[];var n=r;while(n<t){var i=e[n];var o=null;var u=i>239?4:i>223?3:i>191?2:1;if(n+u<=t){var a,s,h,c;switch(u){case 1:if(i<128){o=i}break;case 2:a=e[n+1];if((a&192)===128){c=(i&31)<<6|a&63;if(c>127){o=c}}break;case 3:a=e[n+1];s=e[n+2];if((a&192)===128&&(s&192)===128){c=(i&15)<<12|(a&63)<<6|s&63;if(c>2047&&(c<55296||c>57343)){o=c}}break;case 4:a=e[n+1];s=e[n+2];h=e[n+3];if((a&192)===128&&(s&192)===128&&(h&192)===128){c=(i&15)<<18|(a&63)<<12|(s&63)<<6|h&63;if(c>65535&&c<1114112){o=c}}}}if(o===null){o=65533;u=1}else if(o>65535){o-=65536;f.push(o>>>10&1023|55296);o=56320|o&1023}f.push(o);n+=u}return decodeCodePointsArray(f)}var u=4096;function decodeCodePointsArray(e){var r=e.length;if(r<=u){return String.fromCharCode.apply(String,e)}var t="";var f=0;while(f<r){t+=String.fromCharCode.apply(String,e.slice(f,f+=u))}return t}function asciiSlice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n]&127)}return f}function latin1Slice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n])}return f}function hexSlice(e,r,t){var f=e.length;if(!r||r<0)r=0;if(!t||t<0||t>f)t=f;var n="";for(var i=r;i<t;++i){n+=s[e[i]]}return n}function utf16leSlice(e,r,t){var f=e.slice(r,t);var n="";for(var i=0;i<f.length;i+=2){n+=String.fromCharCode(f[i]+f[i+1]*256)}return n}Buffer.prototype.slice=function slice(e,r){var t=this.length;e=~~e;r=r===undefined?t:~~r;if(e<0){e+=t;if(e<0)e=0}else if(e>t){e=t}if(r<0){r+=t;if(r<0)r=0}else if(r>t){r=t}if(r<e)r=e;var f=this.subarray(e,r);Object.setPrototypeOf(f,Buffer.prototype);return f};function checkOffset(e,r,t){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+r>t)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function readUIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}return f};Buffer.prototype.readUIntBE=function readUIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t){checkOffset(e,r,this.length)}var f=this[e+--r];var n=1;while(r>0&&(n*=256)){f+=this[e+--r]*n}return f};Buffer.prototype.readUInt8=function readUInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);return this[e]};Buffer.prototype.readUInt16LE=function readUInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]|this[e+1]<<8};Buffer.prototype.readUInt16BE=function readUInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]<<8|this[e+1]};Buffer.prototype.readUInt32LE=function readUInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};Buffer.prototype.readUInt32BE=function readUInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};Buffer.prototype.readIntLE=function readIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}n*=128;if(f>=n)f-=Math.pow(2,8*r);return f};Buffer.prototype.readIntBE=function readIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=r;var n=1;var i=this[e+--f];while(f>0&&(n*=256)){i+=this[e+--f]*n}n*=128;if(i>=n)i-=Math.pow(2,8*r);return i};Buffer.prototype.readInt8=function readInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);if(!(this[e]&128))return this[e];return(255-this[e]+1)*-1};Buffer.prototype.readInt16LE=function readInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt16BE=function readInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt32LE=function readInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};Buffer.prototype.readInt32BE=function readInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};Buffer.prototype.readFloatLE=function readFloatLE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,true,23,4)};Buffer.prototype.readFloatBE=function readFloatBE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,false,23,4)};Buffer.prototype.readDoubleLE=function readDoubleLE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,true,52,8)};Buffer.prototype.readDoubleBE=function readDoubleBE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,false,52,8)};function checkInt(e,r,t,f,n,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>n||r<i)throw new RangeError('"value" argument is out of bounds');if(t+f>e.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function writeUIntLE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=1;var o=0;this[r]=e&255;while(++o<t&&(i*=256)){this[r+o]=e/i&255}return r+t};Buffer.prototype.writeUIntBE=function writeUIntBE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=t-1;var o=1;this[r+i]=e&255;while(--i>=0&&(o*=256)){this[r+i]=e/o&255}return r+t};Buffer.prototype.writeUInt8=function writeUInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,255,0);this[r]=e&255;return r+1};Buffer.prototype.writeUInt16LE=function writeUInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeUInt16BE=function writeUInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeUInt32LE=function writeUInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r+3]=e>>>24;this[r+2]=e>>>16;this[r+1]=e>>>8;this[r]=e&255;return r+4};Buffer.prototype.writeUInt32BE=function writeUInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};Buffer.prototype.writeIntLE=function writeIntLE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=0;var o=1;var u=0;this[r]=e&255;while(++i<t&&(o*=256)){if(e<0&&u===0&&this[r+i-1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeIntBE=function writeIntBE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=t-1;var o=1;var u=0;this[r+i]=e&255;while(--i>=0&&(o*=256)){if(e<0&&u===0&&this[r+i+1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeInt8=function writeInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,127,-128);if(e<0)e=255+e+1;this[r]=e&255;return r+1};Buffer.prototype.writeInt16LE=function writeInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeInt16BE=function writeInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeInt32LE=function writeInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);this[r]=e&255;this[r+1]=e>>>8;this[r+2]=e>>>16;this[r+3]=e>>>24;return r+4};Buffer.prototype.writeInt32BE=function writeInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);if(e<0)e=4294967295+e+1;this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};function checkIEEE754(e,r,t,f,n,i){if(t+f>e.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function writeFloat(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,4,34028234663852886e22,-34028234663852886e22)}n.write(e,r,t,f,23,4);return t+4}Buffer.prototype.writeFloatLE=function writeFloatLE(e,r,t){return writeFloat(this,e,r,true,t)};Buffer.prototype.writeFloatBE=function writeFloatBE(e,r,t){return writeFloat(this,e,r,false,t)};function writeDouble(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,8,17976931348623157e292,-17976931348623157e292)}n.write(e,r,t,f,52,8);return t+8}Buffer.prototype.writeDoubleLE=function writeDoubleLE(e,r,t){return writeDouble(this,e,r,true,t)};Buffer.prototype.writeDoubleBE=function writeDoubleBE(e,r,t){return writeDouble(this,e,r,false,t)};Buffer.prototype.copy=function copy(e,r,t,f){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(!t)t=0;if(!f&&f!==0)f=this.length;if(r>=e.length)r=e.length;if(!r)r=0;if(f>0&&f<t)f=t;if(f===t)return 0;if(e.length===0||this.length===0)return 0;if(r<0){throw new RangeError("targetStart out of bounds")}if(t<0||t>=this.length)throw new RangeError("Index out of range");if(f<0)throw new RangeError("sourceEnd out of bounds");if(f>this.length)f=this.length;if(e.length-r<f-t){f=e.length-r+t}var n=f-t;if(this===e&&typeof Uint8Array.prototype.copyWithin==="function"){this.copyWithin(r,t,f)}else if(this===e&&t<r&&r<f){for(var i=n-1;i>=0;--i){e[i+r]=this[i+t]}}else{Uint8Array.prototype.set.call(e,this.subarray(t,f),r)}return n};Buffer.prototype.fill=function fill(e,r,t,f){if(typeof e==="string"){if(typeof r==="string"){f=r;r=0;t=this.length}else if(typeof t==="string"){f=t;t=this.length}if(f!==undefined&&typeof f!=="string"){throw new TypeError("encoding must be a string")}if(typeof f==="string"&&!Buffer.isEncoding(f)){throw new TypeError("Unknown encoding: "+f)}if(e.length===1){var n=e.charCodeAt(0);if(f==="utf8"&&n<128||f==="latin1"){e=n}}}else if(typeof e==="number"){e=e&255}else if(typeof e==="boolean"){e=Number(e)}if(r<0||this.length<r||this.length<t){throw new RangeError("Out of range index")}if(t<=r){return this}r=r>>>0;t=t===undefined?this.length:t>>>0;if(!e)e=0;var i;if(typeof e==="number"){for(i=r;i<t;++i){this[i]=e}}else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,f);var u=o.length;if(u===0){throw new TypeError('The value "'+e+'" is invalid for argument "value"')}for(i=0;i<t-r;++i){this[i+r]=o[i%u]}}return this};var a=/[^+/0-9A-Za-z-_]/g;function base64clean(e){e=e.split("=")[0];e=e.trim().replace(a,"");if(e.length<2)return"";while(e.length%4!==0){e=e+"="}return e}function utf8ToBytes(e,r){r=r||Infinity;var t;var f=e.length;var n=null;var i=[];for(var o=0;o<f;++o){t=e.charCodeAt(o);if(t>55295&&t<57344){if(!n){if(t>56319){if((r-=3)>-1)i.push(239,191,189);continue}else if(o+1===f){if((r-=3)>-1)i.push(239,191,189);continue}n=t;continue}if(t<56320){if((r-=3)>-1)i.push(239,191,189);n=t;continue}t=(n-55296<<10|t-56320)+65536}else if(n){if((r-=3)>-1)i.push(239,191,189)}n=null;if(t<128){if((r-=1)<0)break;i.push(t)}else if(t<2048){if((r-=2)<0)break;i.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;i.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;i.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else{throw new Error("Invalid code point")}}return i}function asciiToBytes(e){var r=[];for(var t=0;t<e.length;++t){r.push(e.charCodeAt(t)&255)}return r}function utf16leToBytes(e,r){var t,f,n;var i=[];for(var o=0;o<e.length;++o){if((r-=2)<0)break;t=e.charCodeAt(o);f=t>>8;n=t%256;i.push(n);i.push(f)}return i}function base64ToBytes(e){return f.toByteArray(base64clean(e))}function blitBuffer(e,r,t,f){for(var n=0;n<f;++n){if(n+t>=r.length||n>=e.length)break;r[n+t]=e[n]}return n}function isInstance(e,r){return e instanceof r||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===r.name}function numberIsNaN(e){return e!==e}var s=function(){var e="0123456789abcdef";var r=new Array(256);for(var t=0;t<16;++t){var f=t*16;for(var n=0;n<16;++n){r[f+n]=e[t]+e[n]}}return r}()},783:function(e,r){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
r.read=function(e,r,t,f,n){var i,o;var u=n*8-f-1;var a=(1<<u)-1;var s=a>>1;var h=-7;var c=t?n-1:0;var l=t?-1:1;var p=e[r+c];c+=l;i=p&(1<<-h)-1;p>>=-h;h+=u;for(;h>0;i=i*256+e[r+c],c+=l,h-=8){}o=i&(1<<-h)-1;i>>=-h;h+=f;for(;h>0;o=o*256+e[r+c],c+=l,h-=8){}if(i===0){i=1-s}else if(i===a){return o?NaN:(p?-1:1)*Infinity}else{o=o+Math.pow(2,f);i=i-s}return(p?-1:1)*o*Math.pow(2,i-f)};r.write=function(e,r,t,f,n,i){var o,u,a;var s=i*8-n-1;var h=(1<<s)-1;var c=h>>1;var l=n===23?Math.pow(2,-24)-Math.pow(2,-77):0;var p=f?0:i-1;var y=f?1:-1;var g=r<0||r===0&&1/r<0?1:0;r=Math.abs(r);if(isNaN(r)||r===Infinity){u=isNaN(r)?1:0;o=h}else{o=Math.floor(Math.log(r)/Math.LN2);if(r*(a=Math.pow(2,-o))<1){o--;a*=2}if(o+c>=1){r+=l/a}else{r+=l*Math.pow(2,1-c)}if(r*a>=2){o++;a/=2}if(o+c>=h){u=0;o=h}else if(o+c>=1){u=(r*a-1)*Math.pow(2,n);o=o+c}else{u=r*Math.pow(2,c-1)*Math.pow(2,n);o=0}}for(;n>=8;e[t+p]=u&255,p+=y,u/=256,n-=8){}o=o<<n|u;s+=n;for(;s>0;e[t+p]=o&255,p+=y,o/=256,s-=8){}e[t+p-y]|=g*128}}};var r={};function __nccwpck_require__(t){var f=r[t];if(f!==undefined){return f.exports}var n=r[t]={exports:{}};var i=true;try{e[t](n,n.exports,__nccwpck_require__);i=false}finally{if(i)delete r[t]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t=__nccwpck_require__(72);module.exports=t})();

/***/ }),

/***/ "./node_modules/@hazae41/base16/dist/esm/src/libs/buffers/buffers.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/@hazae41/base16/dist/esm/src/libs/buffers/buffers.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Buffers: () => (/* binding */ Buffers)
/* harmony export */ });
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/next/dist/compiled/buffer/index.js")["Buffer"];
var Buffers;
(function (Buffers) {
    function fromView(view) {
        return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    }
    Buffers.fromView = fromView;
})(Buffers || (Buffers = {}));


//# sourceMappingURL=buffers.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/base16/dist/esm/src/libs/bytes/bytes.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@hazae41/base16/dist/esm/src/libs/bytes/bytes.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bytes: () => (/* binding */ Bytes)
/* harmony export */ });
var Bytes;
(function (Bytes) {
    function fromView(view) {
        return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
    Bytes.fromView = fromView;
})(Bytes || (Bytes = {}));


//# sourceMappingURL=bytes.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs":
/*!***************************************************************************!*\
  !*** ./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   set: () => (/* binding */ set)
/* harmony export */ });
/* harmony import */ var _buffer_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer.mjs */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/buffer.mjs");


let global = (0,_buffer_mjs__WEBPACK_IMPORTED_MODULE_0__.fromBuffer)();
function get() {
    if (global == null)
        throw new Error("No Base16 adapter found");
    return global;
}
function set(value) {
    global = value;
}


//# sourceMappingURL=adapter.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/buffer.mjs":
/*!**************************************************************************!*\
  !*** ./node_modules/@hazae41/base16/dist/esm/src/mods/base16/buffer.mjs ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromBuffer: () => (/* binding */ fromBuffer)
/* harmony export */ });
/* harmony import */ var _hazae41_box__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/box */ "./node_modules/@hazae41/box/dist/esm/mods/copy/copy.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs");
/* harmony import */ var _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/buffers/buffers.mjs */ "./node_modules/@hazae41/base16/dist/esm/src/libs/buffers/buffers.mjs");
/* harmony import */ var _libs_bytes_bytes_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../libs/bytes/bytes.mjs */ "./node_modules/@hazae41/base16/dist/esm/src/libs/bytes/bytes.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/errors.mjs");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/next/dist/compiled/buffer/index.js")["Buffer"];






function fromBuffer() {
    function getBytes(bytes) {
        return "bytes" in bytes ? bytes.bytes : bytes;
    }
    function encodeOrThrow(bytes) {
        return _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_0__.Buffers.fromView(getBytes(bytes)).toString("hex");
    }
    function tryEncode(bytes) {
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Result.runAndWrapSync(() => {
            return encodeOrThrow(bytes);
        }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_2__.EncodingError.from);
    }
    function decodeOrThrow(text) {
        return new _hazae41_box__WEBPACK_IMPORTED_MODULE_3__.Copied(_libs_bytes_bytes_mjs__WEBPACK_IMPORTED_MODULE_4__.Bytes.fromView(Buffer.from(text, "hex")));
    }
    function tryDecode(text) {
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Result.runAndWrapSync(() => {
            return decodeOrThrow(text);
        }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_2__.DecodingError.from);
    }
    function padStartAndDecodeOrThrow(text) {
        return decodeOrThrow(text.length % 2 ? "0" + text : text);
    }
    function tryPadStartAndDecode(text) {
        return tryDecode(text.length % 2 ? "0" + text : text);
    }
    function padEndAndDecodeOrThrow(text) {
        return decodeOrThrow(text.length % 2 ? text + "0" : text);
    }
    function tryPadEndAndDecode(text) {
        return tryDecode(text.length % 2 ? text + "0" : text);
    }
    return { encodeOrThrow, tryEncode, padStartAndDecodeOrThrow, tryPadStartAndDecode, padEndAndDecodeOrThrow, tryPadEndAndDecode };
}


//# sourceMappingURL=buffer.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/errors.mjs":
/*!**************************************************************************!*\
  !*** ./node_modules/@hazae41/base16/dist/esm/src/mods/base16/errors.mjs ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DecodingError: () => (/* binding */ DecodingError),
/* harmony export */   EncodingError: () => (/* binding */ EncodingError)
/* harmony export */ });
var _a;
class EncodingError extends Error {
    #class = DecodingError;
    name = this.#class.name;
    constructor(options) {
        super(`Could not encode`, options);
    }
    static from(cause) {
        return new EncodingError({ cause });
    }
}
class DecodingError extends Error {
    #class = _a;
    name = this.#class.name;
    constructor(options) {
        super(`Could not decode`, options);
    }
    static from(cause) {
        return new _a({ cause });
    }
}
_a = DecodingError;


//# sourceMappingURL=errors.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/binary/dist/esm/mods/binary/errors.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/binary/dist/esm/mods/binary/errors.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReadUnderflowError: () => (/* binding */ ReadUnderflowError),
/* harmony export */   ReadUnknownError: () => (/* binding */ ReadUnknownError),
/* harmony export */   SizeUnknownError: () => (/* binding */ SizeUnknownError),
/* harmony export */   WriteUnderflowError: () => (/* binding */ WriteUnderflowError),
/* harmony export */   WriteUnknownError: () => (/* binding */ WriteUnknownError)
/* harmony export */ });
class ReadUnknownError extends Error {
    #class = ReadUnknownError;
    name = this.#class.name;
    constructor(options) {
        super(`Could not read`, options);
    }
    static from(cause) {
        return new ReadUnknownError({ cause });
    }
}
class ReadUnderflowError extends Error {
    cursorOffset;
    cursorLength;
    #class = ReadUnderflowError;
    name = this.#class.name;
    constructor(cursorOffset, cursorLength) {
        super(`Cursor has ${cursorLength - cursorOffset} remaining bytes after read`);
        this.cursorOffset = cursorOffset;
        this.cursorLength = cursorLength;
    }
    static from(cursor) {
        return new ReadUnderflowError(cursor.offset, cursor.length);
    }
}
class SizeUnknownError extends Error {
    #class = SizeUnknownError;
    name = this.#class.name;
    constructor(options) {
        super(`Could not size`, options);
    }
    static from(cause) {
        return new SizeUnknownError({ cause });
    }
}
class WriteUnknownError extends Error {
    #class = WriteUnderflowError;
    name = this.#class.name;
    constructor(options) {
        super(`Could not write`, options);
    }
    static from(cause) {
        return new WriteUnknownError({ cause });
    }
}
class WriteUnderflowError extends Error {
    cursorOffset;
    cursorLength;
    #class = WriteUnderflowError;
    name = this.#class.name;
    constructor(cursorOffset, cursorLength) {
        super(`Cursor has ${cursorLength - cursorOffset} remaining bytes after write`);
        this.cursorOffset = cursorOffset;
        this.cursorLength = cursorLength;
    }
    static from(cursor) {
        return new WriteUnderflowError(cursor.offset, cursor.length);
    }
}


//# sourceMappingURL=errors.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/binary/dist/esm/mods/binary/writable.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@hazae41/binary/dist/esm/mods/binary/writable.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Writable: () => (/* binding */ Writable)
/* harmony export */ });
/* harmony import */ var _hazae41_cursor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/cursor */ "./node_modules/@hazae41/cursor/dist/esm/mods/cursor/cursor.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/binary/dist/esm/mods/binary/errors.mjs");




var Writable;
(function (Writable) {
    /**
     * Call sizeOrThrow()
     * @param writable
     * @returns
     */
    function trySize(writable) {
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Result.runAndWrapSync(() => {
            return writable.sizeOrThrow();
        }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_1__.SizeUnknownError.from);
    }
    Writable.trySize = trySize;
    /**
     * Call writeOrThrow()
     * @param writable
     * @param cursor
     * @returns
     */
    function tryWrite(writable, cursor) {
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Result.runAndWrapSync(() => {
            writable.writeOrThrow(cursor);
        }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_1__.WriteUnknownError.from);
    }
    Writable.tryWrite = tryWrite;
    /**
     * Call writeOrThrow() on sizeOrThrow()-sized bytes and check for underflow
     * @throws whatever sizeOrThrow() or writeOrThrow() throws
     * @param writable
     * @returns
     */
    function writeToBytesOrThrow(writable) {
        const size = writable.sizeOrThrow();
        const bytes = new Uint8Array(size);
        const cursor = new _hazae41_cursor__WEBPACK_IMPORTED_MODULE_2__.Cursor(bytes);
        writable.writeOrThrow(cursor);
        if (cursor.remaining)
            throw _errors_mjs__WEBPACK_IMPORTED_MODULE_1__.WriteUnderflowError.from(cursor);
        return bytes;
    }
    Writable.writeToBytesOrThrow = writeToBytesOrThrow;
    /**
     * Call writeOrThrow() on sizeOrThrow()-sized bytes and check for underflow
     * @param writable
     * @returns
     */
    function tryWriteToBytes(writable) {
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Result.unthrowSync(t => {
            const size = trySize(writable).throw(t);
            const bytes = new Uint8Array(size);
            const cursor = new _hazae41_cursor__WEBPACK_IMPORTED_MODULE_2__.Cursor(bytes);
            tryWrite(writable, cursor).throw(t);
            if (cursor.remaining)
                return new _hazae41_result__WEBPACK_IMPORTED_MODULE_3__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_1__.WriteUnderflowError.from(cursor));
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Ok(bytes);
        });
    }
    Writable.tryWriteToBytes = tryWriteToBytes;
})(Writable || (Writable = {}));


//# sourceMappingURL=writable.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/box/dist/esm/mods/box/box.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/@hazae41/box/dist/esm/mods/box/box.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Box: () => (/* binding */ Box),
/* harmony export */   BoxMovedError: () => (/* binding */ BoxMovedError)
/* harmony export */ });
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");


var _a;
class BoxMovedError extends Error {
    #class = _a;
    name = this.#class.name;
    constructor() {
        super(`Box has been moved`);
    }
}
_a = BoxMovedError;
class Box {
    inner;
    #moved = false;
    /**
     * Object that uniquely owns a type T and can dispose it
     */
    constructor(inner) {
        this.inner = inner;
    }
    [Symbol.dispose]() {
        if (this.#moved)
            return;
        this.inner[Symbol.dispose]();
    }
    /**
     * Create a new Box
     * @param inner
     * @returns
     */
    static new(inner) {
        return new Box(inner);
    }
    /**
     * Create a new Box that's already moved
     * @param inner
     * @returns
     */
    static greedy(inner) {
        const box = new Box(inner);
        box.#moved = true;
        return box;
    }
    get moved() {
        return this.#moved;
    }
    get() {
        if (this.#moved)
            return undefined;
        return this.inner;
    }
    /**
     * Just get the inner value
     * @returns T
     * @throws BoxMovedError if moved
     */
    getOrThrow() {
        if (this.#moved)
            throw new BoxMovedError();
        return this.inner;
    }
    /**
     * Just get the inner value
     * @returns Ok<T> or Err<BoxMovedError> if moved
     */
    tryGet() {
        if (this.#moved)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(new BoxMovedError());
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Ok(this.inner);
    }
    unwrap() {
        if (this.#moved)
            return undefined;
        this.#moved = true;
        return this.inner;
    }
    /**
     * Get the inner value and set this as moved
     * @returns T
     * @throws BoxMovedError if already moved
     */
    unwrapOrThrow() {
        if (this.#moved)
            throw new BoxMovedError();
        this.#moved = true;
        return this.inner;
    }
    /**
     * Get the inner value and set this as moved
     * @returns Ok<T> or Err<BoxMovedError> if already moved
     */
    tryUnwrap() {
        if (this.#moved)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(new BoxMovedError());
        this.#moved = true;
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Ok(this.inner);
    }
    move() {
        if (this.#moved)
            return undefined;
        this.#moved = true;
        return new Box(this.inner);
    }
    /**
     * Move the inner value to a new box and set this one as moved
     * @returns Box<T>
     * @throws BoxMovedError if already moved
     */
    moveOrThrow() {
        if (this.#moved)
            throw new BoxMovedError();
        this.#moved = true;
        return new Box(this.inner);
    }
    /**
     * Move the inner value to a new box and set this one as moved
     * @returns Ok<Box<T>> or Err<BoxMovedError> if already moved
     */
    tryMove() {
        if (this.#moved)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(new BoxMovedError());
        this.#moved = true;
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Ok(new Box(this.inner));
    }
    /**
     * Create a new Box that's already moved, and keep this one as is
     * @returns Box<T>
     */
    greed() {
        const moved = new Box(this.inner);
        moved.#moved = true;
        return moved;
    }
}


//# sourceMappingURL=box.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/box/dist/esm/mods/copy/copy.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/@hazae41/box/dist/esm/mods/copy/copy.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Copied: () => (/* binding */ Copied)
/* harmony export */ });
/**
 * A copiable whose bytes are already copied
 */
class Copied {
    bytes;
    /**
     * A copiable whose bytes are already copied
     * @param bytes
     */
    constructor(bytes) {
        this.bytes = bytes;
    }
    [Symbol.dispose]() { }
    static new(bytes) {
        return new Copied(bytes);
    }
    copyAndDispose() {
        return this.bytes;
    }
    free() {
        return;
    }
    freeNextTick() {
        return this;
    }
}


//# sourceMappingURL=copy.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/bytes/dist/esm/libs/ascii/ascii.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@hazae41/bytes/dist/esm/libs/ascii/ascii.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ascii: () => (/* binding */ Ascii)
/* harmony export */ });
var Ascii;
(function (Ascii) {
    Ascii.encoder = new TextEncoder();
    Ascii.decoder = new TextDecoder("ascii");
})(Ascii || (Ascii = {}));


//# sourceMappingURL=ascii.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/bytes/dist/esm/libs/buffers/buffers.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@hazae41/bytes/dist/esm/libs/buffers/buffers.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Buffers: () => (/* binding */ Buffers)
/* harmony export */ });
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/next/dist/compiled/buffer/index.js")["Buffer"];
var Buffers;
(function (Buffers) {
    function fromView(view) {
        return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    }
    Buffers.fromView = fromView;
})(Buffers || (Buffers = {}));


//# sourceMappingURL=buffers.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/bytes/dist/esm/libs/utf8/utf8.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@hazae41/bytes/dist/esm/libs/utf8/utf8.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utf8: () => (/* binding */ Utf8)
/* harmony export */ });
var Utf8;
(function (Utf8) {
    Utf8.encoder = new TextEncoder();
    Utf8.decoder = new TextDecoder();
})(Utf8 || (Utf8 = {}));


//# sourceMappingURL=utf8.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/bytes/dist/esm/mods/bytes/bytes.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@hazae41/bytes/dist/esm/mods/bytes/bytes.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bytes: () => (/* binding */ Bytes),
/* harmony export */   BytesCastError: () => (/* binding */ BytesCastError)
/* harmony export */ });
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");
/* harmony import */ var _libs_ascii_ascii_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../libs/ascii/ascii.mjs */ "./node_modules/@hazae41/bytes/dist/esm/libs/ascii/ascii.mjs");
/* harmony import */ var _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/buffers/buffers.mjs */ "./node_modules/@hazae41/bytes/dist/esm/libs/buffers/buffers.mjs");
/* harmony import */ var _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../libs/utf8/utf8.mjs */ "./node_modules/@hazae41/bytes/dist/esm/libs/utf8/utf8.mjs");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/next/dist/compiled/buffer/index.js")["Buffer"];





class BytesCastError extends Error {
    actualLength;
    expectedLength;
    #class = BytesCastError;
    name = this.#class.name;
    constructor(actualLength, expectedLength) {
        super(`Could not cast ${actualLength} bytes into ${expectedLength}-sized bytes`);
        this.actualLength = actualLength;
        this.expectedLength = expectedLength;
    }
}
var Bytes;
(function (Bytes) {
    /**
     * Alloc 0-lengthed bytes using standard constructor
     * @returns `Uint8Array<[]>`
     */
    function empty() {
        return alloc(0);
    }
    Bytes.empty = empty;
    /**
     * Alloc bytes with typed length using standard constructor
     * @param length
     * @returns `Uint8Array[0;N]`
     */
    function alloc(length) {
        return new Uint8Array(length);
    }
    Bytes.alloc = alloc;
    function from(array) {
        return new Uint8Array(array);
    }
    Bytes.from = from;
    /**
     * Alloc Uint8Array with typed length and fill it with WebCrypto's CSPRNG
     * @param length
     * @returns `Uint8Array[number;N]`
     */
    function random(length) {
        const bytes = alloc(length);
        crypto.getRandomValues(bytes);
        return bytes;
    }
    Bytes.random = random;
    /**
     * Type guard bytes of N length into Uint8Array<N>
     * @param bytes
     * @param length
     * @returns
     */
    function is(bytes, length) {
        return bytes.length.valueOf() === length.valueOf();
    }
    Bytes.is = is;
    /**
     * Equality check (using indexedDB.cmp on browsers, Buffer.equals on Node)
     * @param a
     * @param b
     * @returns
     */
    function equals(a, b) {
        if ("indexedDB" in globalThis)
            return indexedDB.cmp(a, b) === 0;
        if ("process" in globalThis)
            return _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_0__.Buffers.fromView(a).equals(_libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_0__.Buffers.fromView(b));
        throw new Error(`Could not compare bytes`);
    }
    Bytes.equals = equals;
    /**
     * Equality check (using indexedDB.cmp on browsers, Buffer.equals on Node)
     * @param a
     * @param b
     * @returns
     */
    function equals2(a, b) {
        return equals(b, a);
    }
    Bytes.equals2 = equals2;
    /**
     * Try to cast bytes of N length into Uint8Array<N>
     * @param view
     * @param length
     * @returns
     */
    function castOrThrow(bytes, length) {
        if (is(bytes, length))
            return bytes;
        throw new BytesCastError(bytes.length, length);
    }
    Bytes.castOrThrow = castOrThrow;
    /**
     * Try to cast bytes of N length into Uint8Array<N>
     * @param view
     * @param length
     * @returns
     */
    function tryCast(bytes, length) {
        if (is(bytes, length))
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Ok(bytes);
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_2__.Err(new BytesCastError(bytes.length, length));
    }
    Bytes.tryCast = tryCast;
    /**
     * Copied conversion from ArrayBufferLike or ArrayLike<number> into Uint8Array<N>
     * @param array
     * @param length
     * @returns
     */
    function fromAndCastOrThrow(array, length) {
        return castOrThrow(from(array), length);
    }
    Bytes.fromAndCastOrThrow = fromAndCastOrThrow;
    /**
     * Copied conversion from ArrayBufferLike or ArrayLike<number> into Uint8Array<N>
     * @param array
     * @param length
     * @returns
     */
    function tryFromAndCast(array, length) {
        return tryCast(from(array), length);
    }
    Bytes.tryFromAndCast = tryFromAndCast;
    /**
     * Zero-copy conversion from ArrayBufferView of N length into Uint8Array<N>
     * @param view
     * @param length
     * @returns
     */
    function fromViewAndCastOrThrow(view, length) {
        return castOrThrow(fromView(view), length);
    }
    Bytes.fromViewAndCastOrThrow = fromViewAndCastOrThrow;
    /**
     * Zero-copy conversion from ArrayBufferView of N length into Uint8Array<N>
     * @param view
     * @param length
     * @returns
     */
    function tryFromViewAndCast(view, length) {
        return tryCast(fromView(view), length);
    }
    Bytes.tryFromViewAndCast = tryFromViewAndCast;
    /**
     * Zero-copy conversion from ArrayBufferView into Uint8Array
     * @param view
     * @returns
     */
    function fromView(view) {
        return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
    Bytes.fromView = fromView;
    /**
     * Utf8 encoding using TextEncoder
     * @param text
     * @returns
     */
    function fromUtf8(text) {
        return _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_3__.Utf8.encoder.encode(text);
    }
    Bytes.fromUtf8 = fromUtf8;
    /**
     * Utf8 decoding using TextDecoder
     * @param text
     * @returns
     */
    function toUtf8(bytes) {
        return _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_3__.Utf8.decoder.decode(bytes);
    }
    Bytes.toUtf8 = toUtf8;
    /**
     * Ascii decoding (using Buffer.from on Node, TextEncoder on others)
     * @param bytes
     * @returns
     */
    function fromAscii(text) {
        if ("process" in globalThis)
            return fromView(Buffer.from(text, "ascii"));
        return _libs_ascii_ascii_mjs__WEBPACK_IMPORTED_MODULE_4__.Ascii.encoder.encode(text);
    }
    Bytes.fromAscii = fromAscii;
    /**
     * Ascii encoding (using Buffer.toString on Node, TextDecoder on others)
     * @param bytes
     * @returns
     */
    function toAscii(bytes) {
        if ("process" in globalThis)
            return _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_0__.Buffers.fromView(bytes).toString("ascii");
        return _libs_ascii_ascii_mjs__WEBPACK_IMPORTED_MODULE_4__.Ascii.decoder.decode(bytes);
    }
    Bytes.toAscii = toAscii;
    /**
     * Slice or pad bytes to exact length by filling 0s at the start
     * @example sliceOrPadStart([1,2,3,4], 2) = [3,4]
     * @example sliceOrPadStart([1,2,3,4], 6) = [0,0,1,2,3,4]
     * @param bytes
     * @param length
     * @returns
     */
    function sliceOrPadStart(bytes, length) {
        if (bytes.length >= length) {
            const slice = bytes.slice(bytes.length - length, bytes.length);
            return fromView(slice);
        }
        const array = alloc(length);
        array.set(bytes, length - bytes.length);
        return array;
    }
    Bytes.sliceOrPadStart = sliceOrPadStart;
    /**
     * Pad bytes to minimum length by filling 0s at the start
     * @example padStart([1,2,3,4], 2) = [1,2,3,4]
     * @example padStart([1,2,3,4], 6) = [0,0,1,2,3,4]
     * @param bytes
     * @param length
     * @returns
     */
    function padStart(bytes, length) {
        if (bytes.length >= length)
            return bytes;
        const array = alloc(length);
        array.set(bytes, length - bytes.length);
        return array;
    }
    Bytes.padStart = padStart;
    /**
     * Concatenation (using Buffer.concat on Node, home-made on others)
     * @param list
     * @returns
     */
    function concat(list) {
        if ("process" in globalThis)
            return fromView(Buffer.concat(list));
        const length = list.reduce((p, c) => p + c.length, 0);
        const result = alloc(length);
        let offset = 0;
        for (const bytes of list) {
            result.set(bytes, offset);
            offset += bytes.length;
        }
        return result;
    }
    Bytes.concat = concat;
    /**
     * Search bytes in bytes
     * @param bytes
     * @param search
     * @param start
     * @returns index or -1
     */
    function indexOf(bytes, search, start = 0) {
        while (true) {
            const index = bytes.indexOf(search[0], start);
            if (index === -1)
                return -1;
            if (equals(bytes.subarray(index, index + search.length), search))
                return index;
            start = index + 1;
        }
    }
    Bytes.indexOf = indexOf;
})(Bytes || (Bytes = {}));


//# sourceMappingURL=bytes.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cubane/dist/esm/node_modules/tslib/tslib.es6.mjs":
/*!********************************************************************************!*\
  !*** ./node_modules/@hazae41/cubane/dist/esm/node_modules/tslib/tslib.es6.mjs ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    function next() {
        while (env.stack.length) {
            var rec = env.stack.pop();
            try {
                var result = rec.dispose && rec.dispose.call(rec.value);
                if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
            }
            catch (e) {
                fail(e);
            }
        }
        if (env.hasError) throw env.error;
    }
    return next();
}


//# sourceMappingURL=tslib.es6.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/address/address.mjs":
/*!**************************************************************************************!*\
  !*** ./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/address/address.mjs ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbiAddress: () => (/* binding */ AbiAddress),
/* harmony export */   Address: () => (/* binding */ AbiAddress),
/* harmony export */   BytesAbiAddress: () => (/* binding */ BytesAbiAddress),
/* harmony export */   ZeroHexAbiAddress: () => (/* binding */ ZeroHexAbiAddress)
/* harmony export */ });
/* harmony import */ var _node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/tslib/tslib.es6.mjs */ "./node_modules/@hazae41/cubane/dist/esm/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _hazae41_base16__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/base16 */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs");
/* harmony import */ var _hazae41_bytes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/bytes */ "./node_modules/@hazae41/bytes/dist/esm/mods/bytes/bytes.mjs");
/* harmony import */ var _types_address_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../types/address/index.mjs */ "./node_modules/@hazae41/cubane/dist/esm/src/mods/types/address/index.mjs");





var _a, _b;
var AbiAddress;
(function (AbiAddress) {
    AbiAddress.dynamic = false;
    AbiAddress.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiAddress.create(value);
        return ZeroHexAbiAddress.create(value);
    }
    AbiAddress.create = create;
    function from(value) {
        return AbiAddress.create(value);
    }
    AbiAddress.from = from;
    function codegen() {
        return `Abi.Address`;
    }
    AbiAddress.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiAddress.decodeOrThrow(cursor);
    }
    AbiAddress.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiAddress.readOrThrow(cursor);
    }
    AbiAddress.readOrThrow = readOrThrow;
})(AbiAddress || (AbiAddress = {}));
class BytesAbiAddress {
    value;
    #class = _a;
    static dynamic = false;
    static size = 32;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _a(value);
    }
    static from(value) {
        return _a.create(value);
    }
    intoOrThrow() {
        return _types_address_index_mjs__WEBPACK_IMPORTED_MODULE_0__.Address.checksum(this.encodePackedOrThrow());
    }
    toJSON() {
        return this.intoOrThrow();
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_1__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_1__.get().encodeOrThrow(this.value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - 20);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - 20;
        const content = cursor.readOrThrow(20);
        const bytes = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_2__.Bytes.from(content);
        return new _a(bytes);
    }
}
_a = BytesAbiAddress;
class ZeroHexAbiAddress {
    value;
    #class = _b;
    static dynamic = false;
    static size = 32;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _b(value.slice(2));
    }
    static from(value) {
        return _b.create(value);
    }
    intoOrThrow() {
        return _types_address_index_mjs__WEBPACK_IMPORTED_MODULE_0__.Address.checksum(this.value);
    }
    toJSON() {
        return this.intoOrThrow();
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 24;
        const value = cursor.readOrThrow(40);
        return new _b(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            cursor.fillOrThrow(0, 32 - 20);
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_3__.__addDisposableResource)(env_1, _hazae41_base16__WEBPACK_IMPORTED_MODULE_1__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_3__.__disposeResources)(env_1);
        }
    }
}
_b = ZeroHexAbiAddress;


//# sourceMappingURL=address.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/tuple/tuple.mjs":
/*!**********************************************************************************!*\
  !*** ./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/tuple/tuple.mjs ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbiTuple: () => (/* binding */ AbiTuple),
/* harmony export */   Tuple: () => (/* binding */ AbiTuple)
/* harmony export */ });
/* harmony import */ var _uint_uint_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../uint/uint.mjs */ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/uint/uint.mjs");


class AbiTuple {
    constructor() { }
    static create(...$types) {
        return class AbiTuple {
            inner;
            heads;
            tails;
            size;
            #class = AbiTuple;
            name = this.#class.name;
            static types = $types;
            static dynamic = $types.some(it => it.dynamic);
            types = this.#class.types;
            dynamic = this.#class.dynamic;
            constructor(inner, heads, tails, size) {
                this.inner = inner;
                this.heads = heads;
                this.tails = tails;
                this.size = size;
            }
            static create(instances) {
                let length = 0;
                let offset = 0;
                for (const instance of instances) {
                    if (instance.dynamic)
                        /**
                         * Pointer
                         */
                        offset += 32;
                    else
                        /**
                         * As-is
                         */
                        offset += instance.sizeOrThrow();
                }
                const heads = new Array();
                const tails = new Array();
                for (const instance of instances) {
                    const size = instance.sizeOrThrow();
                    if (instance.dynamic) {
                        const pointer = _uint_uint_mjs__WEBPACK_IMPORTED_MODULE_0__.Uint32.fromNumber(offset);
                        heads.push(pointer);
                        length += 32;
                        tails.push(instance);
                        length += size;
                        offset += size;
                    }
                    else {
                        heads.push(instance);
                        length += size;
                    }
                }
                return new AbiTuple(instances, heads, tails, length);
            }
            static from(primitives) {
                const result = new Array(AbiTuple.types.length);
                for (let i = 0; i < AbiTuple.types.length; i++)
                    result[i] = AbiTuple.types[i].from(primitives[i]);
                return AbiTuple.create(result);
            }
            intoOrThrow() {
                return this.inner.map(it => it.intoOrThrow());
            }
            toJSON() {
                return this.inner.map(it => it.toJSON());
            }
            static codegen() {
                return `Abi.Tuple.create(${this.types.map(it => it.codegen()).join(",")})`;
            }
            get class() {
                return this.#class;
            }
            encodeOrThrow() {
                let result = "";
                for (const instance of this.heads)
                    result += instance.encodeOrThrow();
                for (const instance of this.tails)
                    result += instance.encodeOrThrow();
                return result;
            }
            encodePackedOrThrow() {
                let result = "";
                for (const instance of this.heads)
                    result += instance.encodePackedOrThrow();
                for (const instance of this.tails)
                    result += instance.encodePackedOrThrow();
                return result;
            }
            static decodeOrThrow(cursor) {
                const start = cursor.offset;
                const inner = new Array();
                const heads = new Array();
                const tails = new Array();
                let end = 0;
                for (const factory of AbiTuple.types) {
                    if (factory.dynamic) {
                        const pointer = _uint_uint_mjs__WEBPACK_IMPORTED_MODULE_0__.Uint32.decodeOrThrow(cursor);
                        heads.push(pointer);
                        const offset = cursor.offset;
                        cursor.offset = start + (pointer.value * 2);
                        if (cursor.offset < offset)
                            throw new Error("Invalid offset");
                        const instance = factory.decodeOrThrow(cursor);
                        end = cursor.offset;
                        cursor.offset = offset;
                        inner.push(instance);
                        tails.push(instance);
                    }
                    else {
                        const instance = factory.decodeOrThrow(cursor);
                        inner.push(instance);
                        heads.push(instance);
                    }
                }
                cursor.offset = Math.max(cursor.offset, end);
                return new AbiTuple(inner, heads, tails, (cursor.offset - start) / 2);
            }
            sizeOrThrow() {
                return this.size;
            }
            writeOrThrow(cursor) {
                for (const instance of this.heads)
                    instance.writeOrThrow(cursor);
                for (const instance of this.tails)
                    instance.writeOrThrow(cursor);
            }
            static readOrThrow(cursor) {
                const start = cursor.offset;
                const inner = new Array();
                const heads = new Array();
                const tails = new Array();
                let end = 0;
                for (const factory of AbiTuple.types) {
                    if (factory.dynamic) {
                        const pointer = _uint_uint_mjs__WEBPACK_IMPORTED_MODULE_0__.Uint32.readOrThrow(cursor);
                        heads.push(pointer);
                        const offset = cursor.offset;
                        cursor.offset = start + pointer.value;
                        if (cursor.offset < offset)
                            throw new Error("Invalid offset");
                        const instance = factory.readOrThrow(cursor);
                        end = cursor.offset;
                        cursor.offset = offset;
                        inner.push(instance);
                        tails.push(instance);
                    }
                    else {
                        const instance = factory.readOrThrow(cursor);
                        inner.push(instance);
                        heads.push(instance);
                    }
                }
                cursor.offset = Math.max(cursor.offset, end);
                return new AbiTuple(inner, heads, tails, cursor.offset - start);
            }
        };
    }
}


//# sourceMappingURL=tuple.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/uint/uint.mjs":
/*!********************************************************************************!*\
  !*** ./node_modules/@hazae41/cubane/dist/esm/src/mods/abi/types/uint/uint.mjs ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbiUint104: () => (/* binding */ AbiUint104),
/* harmony export */   AbiUint112: () => (/* binding */ AbiUint112),
/* harmony export */   AbiUint120: () => (/* binding */ AbiUint120),
/* harmony export */   AbiUint128: () => (/* binding */ AbiUint128),
/* harmony export */   AbiUint136: () => (/* binding */ AbiUint136),
/* harmony export */   AbiUint144: () => (/* binding */ AbiUint144),
/* harmony export */   AbiUint152: () => (/* binding */ AbiUint152),
/* harmony export */   AbiUint16: () => (/* binding */ AbiUint16),
/* harmony export */   AbiUint160: () => (/* binding */ AbiUint160),
/* harmony export */   AbiUint168: () => (/* binding */ AbiUint168),
/* harmony export */   AbiUint176: () => (/* binding */ AbiUint176),
/* harmony export */   AbiUint184: () => (/* binding */ AbiUint184),
/* harmony export */   AbiUint192: () => (/* binding */ AbiUint192),
/* harmony export */   AbiUint200: () => (/* binding */ AbiUint200),
/* harmony export */   AbiUint208: () => (/* binding */ AbiUint208),
/* harmony export */   AbiUint216: () => (/* binding */ AbiUint216),
/* harmony export */   AbiUint224: () => (/* binding */ AbiUint224),
/* harmony export */   AbiUint232: () => (/* binding */ AbiUint232),
/* harmony export */   AbiUint24: () => (/* binding */ AbiUint24),
/* harmony export */   AbiUint240: () => (/* binding */ AbiUint240),
/* harmony export */   AbiUint248: () => (/* binding */ AbiUint248),
/* harmony export */   AbiUint256: () => (/* binding */ AbiUint256),
/* harmony export */   AbiUint32: () => (/* binding */ AbiUint32),
/* harmony export */   AbiUint40: () => (/* binding */ AbiUint40),
/* harmony export */   AbiUint48: () => (/* binding */ AbiUint48),
/* harmony export */   AbiUint56: () => (/* binding */ AbiUint56),
/* harmony export */   AbiUint64: () => (/* binding */ AbiUint64),
/* harmony export */   AbiUint72: () => (/* binding */ AbiUint72),
/* harmony export */   AbiUint8: () => (/* binding */ AbiUint8),
/* harmony export */   AbiUint80: () => (/* binding */ AbiUint80),
/* harmony export */   AbiUint88: () => (/* binding */ AbiUint88),
/* harmony export */   AbiUint96: () => (/* binding */ AbiUint96),
/* harmony export */   BytesAbiUint104: () => (/* binding */ BytesAbiUint104),
/* harmony export */   BytesAbiUint112: () => (/* binding */ BytesAbiUint112),
/* harmony export */   BytesAbiUint120: () => (/* binding */ BytesAbiUint120),
/* harmony export */   BytesAbiUint128: () => (/* binding */ BytesAbiUint128),
/* harmony export */   BytesAbiUint136: () => (/* binding */ BytesAbiUint136),
/* harmony export */   BytesAbiUint144: () => (/* binding */ BytesAbiUint144),
/* harmony export */   BytesAbiUint152: () => (/* binding */ BytesAbiUint152),
/* harmony export */   BytesAbiUint16: () => (/* binding */ BytesAbiUint16),
/* harmony export */   BytesAbiUint160: () => (/* binding */ BytesAbiUint160),
/* harmony export */   BytesAbiUint168: () => (/* binding */ BytesAbiUint168),
/* harmony export */   BytesAbiUint176: () => (/* binding */ BytesAbiUint176),
/* harmony export */   BytesAbiUint184: () => (/* binding */ BytesAbiUint184),
/* harmony export */   BytesAbiUint192: () => (/* binding */ BytesAbiUint192),
/* harmony export */   BytesAbiUint200: () => (/* binding */ BytesAbiUint200),
/* harmony export */   BytesAbiUint208: () => (/* binding */ BytesAbiUint208),
/* harmony export */   BytesAbiUint216: () => (/* binding */ BytesAbiUint216),
/* harmony export */   BytesAbiUint224: () => (/* binding */ BytesAbiUint224),
/* harmony export */   BytesAbiUint232: () => (/* binding */ BytesAbiUint232),
/* harmony export */   BytesAbiUint24: () => (/* binding */ BytesAbiUint24),
/* harmony export */   BytesAbiUint240: () => (/* binding */ BytesAbiUint240),
/* harmony export */   BytesAbiUint248: () => (/* binding */ BytesAbiUint248),
/* harmony export */   BytesAbiUint256: () => (/* binding */ BytesAbiUint256),
/* harmony export */   BytesAbiUint32: () => (/* binding */ BytesAbiUint32),
/* harmony export */   BytesAbiUint40: () => (/* binding */ BytesAbiUint40),
/* harmony export */   BytesAbiUint48: () => (/* binding */ BytesAbiUint48),
/* harmony export */   BytesAbiUint56: () => (/* binding */ BytesAbiUint56),
/* harmony export */   BytesAbiUint64: () => (/* binding */ BytesAbiUint64),
/* harmony export */   BytesAbiUint72: () => (/* binding */ BytesAbiUint72),
/* harmony export */   BytesAbiUint8: () => (/* binding */ BytesAbiUint8),
/* harmony export */   BytesAbiUint80: () => (/* binding */ BytesAbiUint80),
/* harmony export */   BytesAbiUint88: () => (/* binding */ BytesAbiUint88),
/* harmony export */   BytesAbiUint96: () => (/* binding */ BytesAbiUint96),
/* harmony export */   NumberAbiUint16: () => (/* binding */ NumberAbiUint16),
/* harmony export */   NumberAbiUint24: () => (/* binding */ NumberAbiUint24),
/* harmony export */   NumberAbiUint32: () => (/* binding */ NumberAbiUint32),
/* harmony export */   NumberAbiUint8: () => (/* binding */ NumberAbiUint8),
/* harmony export */   Uint104: () => (/* binding */ AbiUint104),
/* harmony export */   Uint112: () => (/* binding */ AbiUint112),
/* harmony export */   Uint120: () => (/* binding */ AbiUint120),
/* harmony export */   Uint128: () => (/* binding */ AbiUint128),
/* harmony export */   Uint136: () => (/* binding */ AbiUint136),
/* harmony export */   Uint144: () => (/* binding */ AbiUint144),
/* harmony export */   Uint152: () => (/* binding */ AbiUint152),
/* harmony export */   Uint16: () => (/* binding */ AbiUint16),
/* harmony export */   Uint160: () => (/* binding */ AbiUint160),
/* harmony export */   Uint168: () => (/* binding */ AbiUint168),
/* harmony export */   Uint176: () => (/* binding */ AbiUint176),
/* harmony export */   Uint184: () => (/* binding */ AbiUint184),
/* harmony export */   Uint192: () => (/* binding */ AbiUint192),
/* harmony export */   Uint200: () => (/* binding */ AbiUint200),
/* harmony export */   Uint208: () => (/* binding */ AbiUint208),
/* harmony export */   Uint216: () => (/* binding */ AbiUint216),
/* harmony export */   Uint224: () => (/* binding */ AbiUint224),
/* harmony export */   Uint232: () => (/* binding */ AbiUint232),
/* harmony export */   Uint24: () => (/* binding */ AbiUint24),
/* harmony export */   Uint240: () => (/* binding */ AbiUint240),
/* harmony export */   Uint248: () => (/* binding */ AbiUint248),
/* harmony export */   Uint256: () => (/* binding */ AbiUint256),
/* harmony export */   Uint32: () => (/* binding */ AbiUint32),
/* harmony export */   Uint40: () => (/* binding */ AbiUint40),
/* harmony export */   Uint48: () => (/* binding */ AbiUint48),
/* harmony export */   Uint56: () => (/* binding */ AbiUint56),
/* harmony export */   Uint64: () => (/* binding */ AbiUint64),
/* harmony export */   Uint72: () => (/* binding */ AbiUint72),
/* harmony export */   Uint8: () => (/* binding */ AbiUint8),
/* harmony export */   Uint80: () => (/* binding */ AbiUint80),
/* harmony export */   Uint88: () => (/* binding */ AbiUint88),
/* harmony export */   Uint96: () => (/* binding */ AbiUint96),
/* harmony export */   ZeroHexAbiUint104: () => (/* binding */ ZeroHexAbiUint104),
/* harmony export */   ZeroHexAbiUint112: () => (/* binding */ ZeroHexAbiUint112),
/* harmony export */   ZeroHexAbiUint120: () => (/* binding */ ZeroHexAbiUint120),
/* harmony export */   ZeroHexAbiUint128: () => (/* binding */ ZeroHexAbiUint128),
/* harmony export */   ZeroHexAbiUint136: () => (/* binding */ ZeroHexAbiUint136),
/* harmony export */   ZeroHexAbiUint144: () => (/* binding */ ZeroHexAbiUint144),
/* harmony export */   ZeroHexAbiUint152: () => (/* binding */ ZeroHexAbiUint152),
/* harmony export */   ZeroHexAbiUint16: () => (/* binding */ ZeroHexAbiUint16),
/* harmony export */   ZeroHexAbiUint160: () => (/* binding */ ZeroHexAbiUint160),
/* harmony export */   ZeroHexAbiUint168: () => (/* binding */ ZeroHexAbiUint168),
/* harmony export */   ZeroHexAbiUint176: () => (/* binding */ ZeroHexAbiUint176),
/* harmony export */   ZeroHexAbiUint184: () => (/* binding */ ZeroHexAbiUint184),
/* harmony export */   ZeroHexAbiUint192: () => (/* binding */ ZeroHexAbiUint192),
/* harmony export */   ZeroHexAbiUint200: () => (/* binding */ ZeroHexAbiUint200),
/* harmony export */   ZeroHexAbiUint208: () => (/* binding */ ZeroHexAbiUint208),
/* harmony export */   ZeroHexAbiUint216: () => (/* binding */ ZeroHexAbiUint216),
/* harmony export */   ZeroHexAbiUint224: () => (/* binding */ ZeroHexAbiUint224),
/* harmony export */   ZeroHexAbiUint232: () => (/* binding */ ZeroHexAbiUint232),
/* harmony export */   ZeroHexAbiUint24: () => (/* binding */ ZeroHexAbiUint24),
/* harmony export */   ZeroHexAbiUint240: () => (/* binding */ ZeroHexAbiUint240),
/* harmony export */   ZeroHexAbiUint248: () => (/* binding */ ZeroHexAbiUint248),
/* harmony export */   ZeroHexAbiUint256: () => (/* binding */ ZeroHexAbiUint256),
/* harmony export */   ZeroHexAbiUint32: () => (/* binding */ ZeroHexAbiUint32),
/* harmony export */   ZeroHexAbiUint40: () => (/* binding */ ZeroHexAbiUint40),
/* harmony export */   ZeroHexAbiUint48: () => (/* binding */ ZeroHexAbiUint48),
/* harmony export */   ZeroHexAbiUint56: () => (/* binding */ ZeroHexAbiUint56),
/* harmony export */   ZeroHexAbiUint64: () => (/* binding */ ZeroHexAbiUint64),
/* harmony export */   ZeroHexAbiUint72: () => (/* binding */ ZeroHexAbiUint72),
/* harmony export */   ZeroHexAbiUint8: () => (/* binding */ ZeroHexAbiUint8),
/* harmony export */   ZeroHexAbiUint80: () => (/* binding */ ZeroHexAbiUint80),
/* harmony export */   ZeroHexAbiUint88: () => (/* binding */ ZeroHexAbiUint88),
/* harmony export */   ZeroHexAbiUint96: () => (/* binding */ ZeroHexAbiUint96),
/* harmony export */   uintByName: () => (/* binding */ uintByName)
/* harmony export */ });
/* harmony import */ var _node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/tslib/tslib.es6.mjs */ "./node_modules/@hazae41/cubane/dist/esm/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/bytes */ "./node_modules/@hazae41/bytes/dist/esm/mods/bytes/bytes.mjs");
/* harmony import */ var _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/base16 */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs");




var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43;
var AbiUint8;
(function (AbiUint8) {
    AbiUint8.dynamic = false;
    AbiUint8.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint8.create(value);
        if (typeof value === "number")
            return NumberAbiUint8.create(value);
        if (typeof value === "bigint")
            return NumberAbiUint8.create(Number(value));
        return ZeroHexAbiUint8.create(value);
    }
    AbiUint8.create = create;
    function from(value) {
        return AbiUint8.create(value);
    }
    AbiUint8.from = from;
    function fromNumber(value) {
        return NumberAbiUint8.fromNumber(value);
    }
    AbiUint8.fromNumber = fromNumber;
    function fromBigInt(value) {
        return NumberAbiUint8.fromBigInt(value);
    }
    AbiUint8.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int8`;
    }
    AbiUint8.codegen = codegen;
    function decodeOrThrow(cursor) {
        return NumberAbiUint8.decodeOrThrow(cursor);
    }
    AbiUint8.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return NumberAbiUint8.readOrThrow(cursor);
    }
    AbiUint8.readOrThrow = readOrThrow;
})(AbiUint8 || (AbiUint8 = {}));
class BytesAbiUint8 {
    value;
    #class = _a;
    name = this.#class.name;
    static bytes = 1;
    static nibbles = 2;
    static bits = 8;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _a(value);
    }
    static from(value) {
        return _a.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint8(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint8(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int8`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _a.nibbles;
        const content = cursor.readOrThrow(_a.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _a(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _a.bytes;
        const content = cursor.readOrThrow(_a.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _a(value);
    }
}
_a = BytesAbiUint8;
class NumberAbiUint8 {
    value;
    #class = _b;
    name = this.#class.name;
    static bytes = 1;
    static nibbles = 2;
    static bits = 8;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _b(value);
    }
    static fromBigInt(value) {
        return new _b(Number(value));
    }
    static create(value) {
        return new _b(value);
    }
    static from(value) {
        return _b.create(value);
    }
    intoOrThrow() {
        return BigInt(this.value);
    }
    toJSON() {
        return this.value.toString();
    }
    static codegen() {
        return `Abi.Int8`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.toString(16).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value.toString(16);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _b.nibbles;
        const content = cursor.readOrThrow(_b.nibbles);
        const value = parseInt(content, 16);
        return new _b(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - 4);
        cursor.writeUint32OrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - 4;
        const value = cursor.readUint32OrThrow();
        return new _b(value);
    }
}
_b = NumberAbiUint8;
class ZeroHexAbiUint8 {
    value;
    #class = _c;
    name = this.#class.name;
    static bytes = 1;
    static nibbles = 2;
    static bits = 8;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _c(value.toString(16));
    }
    static fromBigInt(value) {
        return new _c(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _c.fromBigInt(value);
        if (typeof value === "number")
            return _c.fromNumber(value);
        if (value.startsWith("0x"))
            return new _c(value.slice(2));
        return _c.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _c.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int8`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _c.nibbles;
        const content = cursor.readOrThrow(_c.nibbles);
        return new _c(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_1, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_1);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _c.bytes;
        const content = cursor.readOrThrow(_c.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _c(value);
    }
}
_c = ZeroHexAbiUint8;
var AbiUint16;
(function (AbiUint16) {
    AbiUint16.dynamic = false;
    AbiUint16.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint16.create(value);
        if (typeof value === "number")
            return NumberAbiUint16.create(value);
        if (typeof value === "bigint")
            return NumberAbiUint16.create(Number(value));
        return ZeroHexAbiUint16.create(value);
    }
    AbiUint16.create = create;
    function from(value) {
        return AbiUint16.create(value);
    }
    AbiUint16.from = from;
    function fromNumber(value) {
        return NumberAbiUint16.fromNumber(value);
    }
    AbiUint16.fromNumber = fromNumber;
    function fromBigInt(value) {
        return NumberAbiUint16.fromBigInt(value);
    }
    AbiUint16.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int16`;
    }
    AbiUint16.codegen = codegen;
    function decodeOrThrow(cursor) {
        return NumberAbiUint16.decodeOrThrow(cursor);
    }
    AbiUint16.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return NumberAbiUint16.readOrThrow(cursor);
    }
    AbiUint16.readOrThrow = readOrThrow;
})(AbiUint16 || (AbiUint16 = {}));
class BytesAbiUint16 {
    value;
    #class = _d;
    name = this.#class.name;
    static bytes = 2;
    static nibbles = 4;
    static bits = 16;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _d(value);
    }
    static from(value) {
        return _d.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint16(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint16(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int16`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _d.nibbles;
        const content = cursor.readOrThrow(_d.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _d(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _d.bytes;
        const content = cursor.readOrThrow(_d.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _d(value);
    }
}
_d = BytesAbiUint16;
class NumberAbiUint16 {
    value;
    #class = _e;
    name = this.#class.name;
    static bytes = 2;
    static nibbles = 4;
    static bits = 16;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _e(value);
    }
    static fromBigInt(value) {
        return new _e(Number(value));
    }
    static create(value) {
        return new _e(value);
    }
    static from(value) {
        return _e.create(value);
    }
    intoOrThrow() {
        return BigInt(this.value);
    }
    toJSON() {
        return this.value.toString();
    }
    static codegen() {
        return `Abi.Int16`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.toString(16).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value.toString(16);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _e.nibbles;
        const content = cursor.readOrThrow(_e.nibbles);
        const value = parseInt(content, 16);
        return new _e(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - 4);
        cursor.writeUint32OrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - 4;
        const value = cursor.readUint32OrThrow();
        return new _e(value);
    }
}
_e = NumberAbiUint16;
class ZeroHexAbiUint16 {
    value;
    #class = _f;
    name = this.#class.name;
    static bytes = 2;
    static nibbles = 4;
    static bits = 16;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _f(value.toString(16));
    }
    static fromBigInt(value) {
        return new _f(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _f.fromBigInt(value);
        if (typeof value === "number")
            return _f.fromNumber(value);
        if (value.startsWith("0x"))
            return new _f(value.slice(2));
        return _f.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _f.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int16`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _f.nibbles;
        const content = cursor.readOrThrow(_f.nibbles);
        return new _f(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_2, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_2);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _f.bytes;
        const content = cursor.readOrThrow(_f.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _f(value);
    }
}
_f = ZeroHexAbiUint16;
var AbiUint24;
(function (AbiUint24) {
    AbiUint24.dynamic = false;
    AbiUint24.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint24.create(value);
        if (typeof value === "number")
            return NumberAbiUint24.create(value);
        if (typeof value === "bigint")
            return NumberAbiUint24.create(Number(value));
        return ZeroHexAbiUint24.create(value);
    }
    AbiUint24.create = create;
    function from(value) {
        return AbiUint24.create(value);
    }
    AbiUint24.from = from;
    function fromNumber(value) {
        return NumberAbiUint24.fromNumber(value);
    }
    AbiUint24.fromNumber = fromNumber;
    function fromBigInt(value) {
        return NumberAbiUint24.fromBigInt(value);
    }
    AbiUint24.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int24`;
    }
    AbiUint24.codegen = codegen;
    function decodeOrThrow(cursor) {
        return NumberAbiUint24.decodeOrThrow(cursor);
    }
    AbiUint24.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return NumberAbiUint24.readOrThrow(cursor);
    }
    AbiUint24.readOrThrow = readOrThrow;
})(AbiUint24 || (AbiUint24 = {}));
class BytesAbiUint24 {
    value;
    #class = _g;
    name = this.#class.name;
    static bytes = 3;
    static nibbles = 6;
    static bits = 24;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _g(value);
    }
    static from(value) {
        return _g.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint24(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint24(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int24`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _g.nibbles;
        const content = cursor.readOrThrow(_g.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _g(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _g.bytes;
        const content = cursor.readOrThrow(_g.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _g(value);
    }
}
_g = BytesAbiUint24;
class NumberAbiUint24 {
    value;
    #class = _h;
    name = this.#class.name;
    static bytes = 3;
    static nibbles = 6;
    static bits = 24;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _h(value);
    }
    static fromBigInt(value) {
        return new _h(Number(value));
    }
    static create(value) {
        return new _h(value);
    }
    static from(value) {
        return _h.create(value);
    }
    intoOrThrow() {
        return BigInt(this.value);
    }
    toJSON() {
        return this.value.toString();
    }
    static codegen() {
        return `Abi.Int24`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.toString(16).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value.toString(16);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _h.nibbles;
        const content = cursor.readOrThrow(_h.nibbles);
        const value = parseInt(content, 16);
        return new _h(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - 4);
        cursor.writeUint32OrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - 4;
        const value = cursor.readUint32OrThrow();
        return new _h(value);
    }
}
_h = NumberAbiUint24;
class ZeroHexAbiUint24 {
    value;
    #class = _j;
    name = this.#class.name;
    static bytes = 3;
    static nibbles = 6;
    static bits = 24;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _j(value.toString(16));
    }
    static fromBigInt(value) {
        return new _j(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _j.fromBigInt(value);
        if (typeof value === "number")
            return _j.fromNumber(value);
        if (value.startsWith("0x"))
            return new _j(value.slice(2));
        return _j.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _j.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int24`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _j.nibbles;
        const content = cursor.readOrThrow(_j.nibbles);
        return new _j(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_3, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_3);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _j.bytes;
        const content = cursor.readOrThrow(_j.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _j(value);
    }
}
_j = ZeroHexAbiUint24;
var AbiUint32;
(function (AbiUint32) {
    AbiUint32.dynamic = false;
    AbiUint32.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint32.create(value);
        if (typeof value === "number")
            return NumberAbiUint32.create(value);
        if (typeof value === "bigint")
            return NumberAbiUint32.create(Number(value));
        return ZeroHexAbiUint32.create(value);
    }
    AbiUint32.create = create;
    function from(value) {
        return AbiUint32.create(value);
    }
    AbiUint32.from = from;
    function fromNumber(value) {
        return NumberAbiUint32.fromNumber(value);
    }
    AbiUint32.fromNumber = fromNumber;
    function fromBigInt(value) {
        return NumberAbiUint32.fromBigInt(value);
    }
    AbiUint32.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int32`;
    }
    AbiUint32.codegen = codegen;
    function decodeOrThrow(cursor) {
        return NumberAbiUint32.decodeOrThrow(cursor);
    }
    AbiUint32.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return NumberAbiUint32.readOrThrow(cursor);
    }
    AbiUint32.readOrThrow = readOrThrow;
})(AbiUint32 || (AbiUint32 = {}));
class BytesAbiUint32 {
    value;
    #class = _k;
    name = this.#class.name;
    static bytes = 4;
    static nibbles = 8;
    static bits = 32;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _k(value);
    }
    static from(value) {
        return _k.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint32(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint32(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int32`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _k.nibbles;
        const content = cursor.readOrThrow(_k.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _k(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _k.bytes;
        const content = cursor.readOrThrow(_k.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _k(value);
    }
}
_k = BytesAbiUint32;
class NumberAbiUint32 {
    value;
    #class = _l;
    name = this.#class.name;
    static bytes = 4;
    static nibbles = 8;
    static bits = 32;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _l(value);
    }
    static fromBigInt(value) {
        return new _l(Number(value));
    }
    static create(value) {
        return new _l(value);
    }
    static from(value) {
        return _l.create(value);
    }
    intoOrThrow() {
        return BigInt(this.value);
    }
    toJSON() {
        return this.value.toString();
    }
    static codegen() {
        return `Abi.Int32`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.toString(16).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value.toString(16);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _l.nibbles;
        const content = cursor.readOrThrow(_l.nibbles);
        const value = parseInt(content, 16);
        return new _l(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - 4);
        cursor.writeUint32OrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - 4;
        const value = cursor.readUint32OrThrow();
        return new _l(value);
    }
}
_l = NumberAbiUint32;
class ZeroHexAbiUint32 {
    value;
    #class = _m;
    name = this.#class.name;
    static bytes = 4;
    static nibbles = 8;
    static bits = 32;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _m(value.toString(16));
    }
    static fromBigInt(value) {
        return new _m(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _m.fromBigInt(value);
        if (typeof value === "number")
            return _m.fromNumber(value);
        if (value.startsWith("0x"))
            return new _m(value.slice(2));
        return _m.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _m.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int32`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _m.nibbles;
        const content = cursor.readOrThrow(_m.nibbles);
        return new _m(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_4, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_4) {
            env_4.error = e_4;
            env_4.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_4);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _m.bytes;
        const content = cursor.readOrThrow(_m.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _m(value);
    }
}
_m = ZeroHexAbiUint32;
var AbiUint40;
(function (AbiUint40) {
    AbiUint40.dynamic = false;
    AbiUint40.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint40.create(value);
        return ZeroHexAbiUint40.create(value);
    }
    AbiUint40.create = create;
    function from(value) {
        return AbiUint40.create(value);
    }
    AbiUint40.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint40.fromNumber(value);
    }
    AbiUint40.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint40.fromBigInt(value);
    }
    AbiUint40.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int40`;
    }
    AbiUint40.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint40.decodeOrThrow(cursor);
    }
    AbiUint40.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint40.readOrThrow(cursor);
    }
    AbiUint40.readOrThrow = readOrThrow;
})(AbiUint40 || (AbiUint40 = {}));
class BytesAbiUint40 {
    value;
    #class = _o;
    name = this.#class.name;
    static bytes = 5;
    static nibbles = 10;
    static bits = 40;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _o(value);
    }
    static from(value) {
        return _o.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint40(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint40(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int40`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _o.nibbles;
        const content = cursor.readOrThrow(_o.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _o(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _o.bytes;
        const content = cursor.readOrThrow(_o.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _o(value);
    }
}
_o = BytesAbiUint40;
class ZeroHexAbiUint40 {
    value;
    #class = _p;
    name = this.#class.name;
    static bytes = 5;
    static nibbles = 10;
    static bits = 40;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _p(value.toString(16));
    }
    static fromBigInt(value) {
        return new _p(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _p.fromBigInt(value);
        if (typeof value === "number")
            return _p.fromNumber(value);
        if (value.startsWith("0x"))
            return new _p(value.slice(2));
        return _p.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _p.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int40`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _p.nibbles;
        const content = cursor.readOrThrow(_p.nibbles);
        return new _p(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_5 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_5, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_5) {
            env_5.error = e_5;
            env_5.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_5);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _p.bytes;
        const content = cursor.readOrThrow(_p.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _p(value);
    }
}
_p = ZeroHexAbiUint40;
var AbiUint48;
(function (AbiUint48) {
    AbiUint48.dynamic = false;
    AbiUint48.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint48.create(value);
        return ZeroHexAbiUint48.create(value);
    }
    AbiUint48.create = create;
    function from(value) {
        return AbiUint48.create(value);
    }
    AbiUint48.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint48.fromNumber(value);
    }
    AbiUint48.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint48.fromBigInt(value);
    }
    AbiUint48.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int48`;
    }
    AbiUint48.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint48.decodeOrThrow(cursor);
    }
    AbiUint48.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint48.readOrThrow(cursor);
    }
    AbiUint48.readOrThrow = readOrThrow;
})(AbiUint48 || (AbiUint48 = {}));
class BytesAbiUint48 {
    value;
    #class = _q;
    name = this.#class.name;
    static bytes = 6;
    static nibbles = 12;
    static bits = 48;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _q(value);
    }
    static from(value) {
        return _q.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint48(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint48(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int48`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _q.nibbles;
        const content = cursor.readOrThrow(_q.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _q(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _q.bytes;
        const content = cursor.readOrThrow(_q.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _q(value);
    }
}
_q = BytesAbiUint48;
class ZeroHexAbiUint48 {
    value;
    #class = _r;
    name = this.#class.name;
    static bytes = 6;
    static nibbles = 12;
    static bits = 48;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _r(value.toString(16));
    }
    static fromBigInt(value) {
        return new _r(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _r.fromBigInt(value);
        if (typeof value === "number")
            return _r.fromNumber(value);
        if (value.startsWith("0x"))
            return new _r(value.slice(2));
        return _r.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _r.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int48`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _r.nibbles;
        const content = cursor.readOrThrow(_r.nibbles);
        return new _r(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_6 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_6, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_6) {
            env_6.error = e_6;
            env_6.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_6);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _r.bytes;
        const content = cursor.readOrThrow(_r.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _r(value);
    }
}
_r = ZeroHexAbiUint48;
var AbiUint56;
(function (AbiUint56) {
    AbiUint56.dynamic = false;
    AbiUint56.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint56.create(value);
        return ZeroHexAbiUint56.create(value);
    }
    AbiUint56.create = create;
    function from(value) {
        return AbiUint56.create(value);
    }
    AbiUint56.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint56.fromNumber(value);
    }
    AbiUint56.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint56.fromBigInt(value);
    }
    AbiUint56.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int56`;
    }
    AbiUint56.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint56.decodeOrThrow(cursor);
    }
    AbiUint56.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint56.readOrThrow(cursor);
    }
    AbiUint56.readOrThrow = readOrThrow;
})(AbiUint56 || (AbiUint56 = {}));
class BytesAbiUint56 {
    value;
    #class = _s;
    name = this.#class.name;
    static bytes = 7;
    static nibbles = 14;
    static bits = 56;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _s(value);
    }
    static from(value) {
        return _s.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint56(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint56(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int56`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _s.nibbles;
        const content = cursor.readOrThrow(_s.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _s(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _s.bytes;
        const content = cursor.readOrThrow(_s.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _s(value);
    }
}
_s = BytesAbiUint56;
class ZeroHexAbiUint56 {
    value;
    #class = _t;
    name = this.#class.name;
    static bytes = 7;
    static nibbles = 14;
    static bits = 56;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _t(value.toString(16));
    }
    static fromBigInt(value) {
        return new _t(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _t.fromBigInt(value);
        if (typeof value === "number")
            return _t.fromNumber(value);
        if (value.startsWith("0x"))
            return new _t(value.slice(2));
        return _t.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _t.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int56`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _t.nibbles;
        const content = cursor.readOrThrow(_t.nibbles);
        return new _t(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_7 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_7, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_7) {
            env_7.error = e_7;
            env_7.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_7);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _t.bytes;
        const content = cursor.readOrThrow(_t.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _t(value);
    }
}
_t = ZeroHexAbiUint56;
var AbiUint64;
(function (AbiUint64) {
    AbiUint64.dynamic = false;
    AbiUint64.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint64.create(value);
        return ZeroHexAbiUint64.create(value);
    }
    AbiUint64.create = create;
    function from(value) {
        return AbiUint64.create(value);
    }
    AbiUint64.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint64.fromNumber(value);
    }
    AbiUint64.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint64.fromBigInt(value);
    }
    AbiUint64.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int64`;
    }
    AbiUint64.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint64.decodeOrThrow(cursor);
    }
    AbiUint64.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint64.readOrThrow(cursor);
    }
    AbiUint64.readOrThrow = readOrThrow;
})(AbiUint64 || (AbiUint64 = {}));
class BytesAbiUint64 {
    value;
    #class = _u;
    name = this.#class.name;
    static bytes = 8;
    static nibbles = 16;
    static bits = 64;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _u(value);
    }
    static from(value) {
        return _u.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint64(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint64(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int64`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _u.nibbles;
        const content = cursor.readOrThrow(_u.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _u(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _u.bytes;
        const content = cursor.readOrThrow(_u.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _u(value);
    }
}
_u = BytesAbiUint64;
class ZeroHexAbiUint64 {
    value;
    #class = _v;
    name = this.#class.name;
    static bytes = 8;
    static nibbles = 16;
    static bits = 64;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _v(value.toString(16));
    }
    static fromBigInt(value) {
        return new _v(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _v.fromBigInt(value);
        if (typeof value === "number")
            return _v.fromNumber(value);
        if (value.startsWith("0x"))
            return new _v(value.slice(2));
        return _v.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _v.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int64`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _v.nibbles;
        const content = cursor.readOrThrow(_v.nibbles);
        return new _v(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_8 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_8, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_8) {
            env_8.error = e_8;
            env_8.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_8);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _v.bytes;
        const content = cursor.readOrThrow(_v.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _v(value);
    }
}
_v = ZeroHexAbiUint64;
var AbiUint72;
(function (AbiUint72) {
    AbiUint72.dynamic = false;
    AbiUint72.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint72.create(value);
        return ZeroHexAbiUint72.create(value);
    }
    AbiUint72.create = create;
    function from(value) {
        return AbiUint72.create(value);
    }
    AbiUint72.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint72.fromNumber(value);
    }
    AbiUint72.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint72.fromBigInt(value);
    }
    AbiUint72.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int72`;
    }
    AbiUint72.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint72.decodeOrThrow(cursor);
    }
    AbiUint72.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint72.readOrThrow(cursor);
    }
    AbiUint72.readOrThrow = readOrThrow;
})(AbiUint72 || (AbiUint72 = {}));
class BytesAbiUint72 {
    value;
    #class = _w;
    name = this.#class.name;
    static bytes = 9;
    static nibbles = 18;
    static bits = 72;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _w(value);
    }
    static from(value) {
        return _w.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint72(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint72(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int72`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _w.nibbles;
        const content = cursor.readOrThrow(_w.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _w(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _w.bytes;
        const content = cursor.readOrThrow(_w.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _w(value);
    }
}
_w = BytesAbiUint72;
class ZeroHexAbiUint72 {
    value;
    #class = _x;
    name = this.#class.name;
    static bytes = 9;
    static nibbles = 18;
    static bits = 72;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _x(value.toString(16));
    }
    static fromBigInt(value) {
        return new _x(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _x.fromBigInt(value);
        if (typeof value === "number")
            return _x.fromNumber(value);
        if (value.startsWith("0x"))
            return new _x(value.slice(2));
        return _x.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _x.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int72`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _x.nibbles;
        const content = cursor.readOrThrow(_x.nibbles);
        return new _x(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_9 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_9, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_9) {
            env_9.error = e_9;
            env_9.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_9);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _x.bytes;
        const content = cursor.readOrThrow(_x.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _x(value);
    }
}
_x = ZeroHexAbiUint72;
var AbiUint80;
(function (AbiUint80) {
    AbiUint80.dynamic = false;
    AbiUint80.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint80.create(value);
        return ZeroHexAbiUint80.create(value);
    }
    AbiUint80.create = create;
    function from(value) {
        return AbiUint80.create(value);
    }
    AbiUint80.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint80.fromNumber(value);
    }
    AbiUint80.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint80.fromBigInt(value);
    }
    AbiUint80.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int80`;
    }
    AbiUint80.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint80.decodeOrThrow(cursor);
    }
    AbiUint80.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint80.readOrThrow(cursor);
    }
    AbiUint80.readOrThrow = readOrThrow;
})(AbiUint80 || (AbiUint80 = {}));
class BytesAbiUint80 {
    value;
    #class = _y;
    name = this.#class.name;
    static bytes = 10;
    static nibbles = 20;
    static bits = 80;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _y(value);
    }
    static from(value) {
        return _y.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint80(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint80(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int80`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _y.nibbles;
        const content = cursor.readOrThrow(_y.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _y(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _y.bytes;
        const content = cursor.readOrThrow(_y.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _y(value);
    }
}
_y = BytesAbiUint80;
class ZeroHexAbiUint80 {
    value;
    #class = _z;
    name = this.#class.name;
    static bytes = 10;
    static nibbles = 20;
    static bits = 80;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _z(value.toString(16));
    }
    static fromBigInt(value) {
        return new _z(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _z.fromBigInt(value);
        if (typeof value === "number")
            return _z.fromNumber(value);
        if (value.startsWith("0x"))
            return new _z(value.slice(2));
        return _z.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _z.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int80`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _z.nibbles;
        const content = cursor.readOrThrow(_z.nibbles);
        return new _z(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_10 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_10, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_10) {
            env_10.error = e_10;
            env_10.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_10);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _z.bytes;
        const content = cursor.readOrThrow(_z.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _z(value);
    }
}
_z = ZeroHexAbiUint80;
var AbiUint88;
(function (AbiUint88) {
    AbiUint88.dynamic = false;
    AbiUint88.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint88.create(value);
        return ZeroHexAbiUint88.create(value);
    }
    AbiUint88.create = create;
    function from(value) {
        return AbiUint88.create(value);
    }
    AbiUint88.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint88.fromNumber(value);
    }
    AbiUint88.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint88.fromBigInt(value);
    }
    AbiUint88.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int88`;
    }
    AbiUint88.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint88.decodeOrThrow(cursor);
    }
    AbiUint88.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint88.readOrThrow(cursor);
    }
    AbiUint88.readOrThrow = readOrThrow;
})(AbiUint88 || (AbiUint88 = {}));
class BytesAbiUint88 {
    value;
    #class = _0;
    name = this.#class.name;
    static bytes = 11;
    static nibbles = 22;
    static bits = 88;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _0(value);
    }
    static from(value) {
        return _0.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint88(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint88(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int88`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _0.nibbles;
        const content = cursor.readOrThrow(_0.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _0(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _0.bytes;
        const content = cursor.readOrThrow(_0.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _0(value);
    }
}
_0 = BytesAbiUint88;
class ZeroHexAbiUint88 {
    value;
    #class = _1;
    name = this.#class.name;
    static bytes = 11;
    static nibbles = 22;
    static bits = 88;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _1(value.toString(16));
    }
    static fromBigInt(value) {
        return new _1(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _1.fromBigInt(value);
        if (typeof value === "number")
            return _1.fromNumber(value);
        if (value.startsWith("0x"))
            return new _1(value.slice(2));
        return _1.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _1.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int88`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _1.nibbles;
        const content = cursor.readOrThrow(_1.nibbles);
        return new _1(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_11 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_11, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_11) {
            env_11.error = e_11;
            env_11.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_11);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _1.bytes;
        const content = cursor.readOrThrow(_1.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _1(value);
    }
}
_1 = ZeroHexAbiUint88;
var AbiUint96;
(function (AbiUint96) {
    AbiUint96.dynamic = false;
    AbiUint96.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint96.create(value);
        return ZeroHexAbiUint96.create(value);
    }
    AbiUint96.create = create;
    function from(value) {
        return AbiUint96.create(value);
    }
    AbiUint96.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint96.fromNumber(value);
    }
    AbiUint96.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint96.fromBigInt(value);
    }
    AbiUint96.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int96`;
    }
    AbiUint96.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint96.decodeOrThrow(cursor);
    }
    AbiUint96.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint96.readOrThrow(cursor);
    }
    AbiUint96.readOrThrow = readOrThrow;
})(AbiUint96 || (AbiUint96 = {}));
class BytesAbiUint96 {
    value;
    #class = _2;
    name = this.#class.name;
    static bytes = 12;
    static nibbles = 24;
    static bits = 96;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _2(value);
    }
    static from(value) {
        return _2.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint96(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint96(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int96`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _2.nibbles;
        const content = cursor.readOrThrow(_2.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _2(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _2.bytes;
        const content = cursor.readOrThrow(_2.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _2(value);
    }
}
_2 = BytesAbiUint96;
class ZeroHexAbiUint96 {
    value;
    #class = _3;
    name = this.#class.name;
    static bytes = 12;
    static nibbles = 24;
    static bits = 96;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _3(value.toString(16));
    }
    static fromBigInt(value) {
        return new _3(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _3.fromBigInt(value);
        if (typeof value === "number")
            return _3.fromNumber(value);
        if (value.startsWith("0x"))
            return new _3(value.slice(2));
        return _3.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _3.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int96`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _3.nibbles;
        const content = cursor.readOrThrow(_3.nibbles);
        return new _3(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_12 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_12, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_12) {
            env_12.error = e_12;
            env_12.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_12);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _3.bytes;
        const content = cursor.readOrThrow(_3.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _3(value);
    }
}
_3 = ZeroHexAbiUint96;
var AbiUint104;
(function (AbiUint104) {
    AbiUint104.dynamic = false;
    AbiUint104.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint104.create(value);
        return ZeroHexAbiUint104.create(value);
    }
    AbiUint104.create = create;
    function from(value) {
        return AbiUint104.create(value);
    }
    AbiUint104.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint104.fromNumber(value);
    }
    AbiUint104.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint104.fromBigInt(value);
    }
    AbiUint104.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int104`;
    }
    AbiUint104.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint104.decodeOrThrow(cursor);
    }
    AbiUint104.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint104.readOrThrow(cursor);
    }
    AbiUint104.readOrThrow = readOrThrow;
})(AbiUint104 || (AbiUint104 = {}));
class BytesAbiUint104 {
    value;
    #class = _4;
    name = this.#class.name;
    static bytes = 13;
    static nibbles = 26;
    static bits = 104;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _4(value);
    }
    static from(value) {
        return _4.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint104(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint104(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int104`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _4.nibbles;
        const content = cursor.readOrThrow(_4.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _4(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _4.bytes;
        const content = cursor.readOrThrow(_4.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _4(value);
    }
}
_4 = BytesAbiUint104;
class ZeroHexAbiUint104 {
    value;
    #class = _5;
    name = this.#class.name;
    static bytes = 13;
    static nibbles = 26;
    static bits = 104;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _5(value.toString(16));
    }
    static fromBigInt(value) {
        return new _5(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _5.fromBigInt(value);
        if (typeof value === "number")
            return _5.fromNumber(value);
        if (value.startsWith("0x"))
            return new _5(value.slice(2));
        return _5.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _5.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int104`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _5.nibbles;
        const content = cursor.readOrThrow(_5.nibbles);
        return new _5(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_13 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_13, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_13) {
            env_13.error = e_13;
            env_13.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_13);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _5.bytes;
        const content = cursor.readOrThrow(_5.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _5(value);
    }
}
_5 = ZeroHexAbiUint104;
var AbiUint112;
(function (AbiUint112) {
    AbiUint112.dynamic = false;
    AbiUint112.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint112.create(value);
        return ZeroHexAbiUint112.create(value);
    }
    AbiUint112.create = create;
    function from(value) {
        return AbiUint112.create(value);
    }
    AbiUint112.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint112.fromNumber(value);
    }
    AbiUint112.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint112.fromBigInt(value);
    }
    AbiUint112.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int112`;
    }
    AbiUint112.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint112.decodeOrThrow(cursor);
    }
    AbiUint112.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint112.readOrThrow(cursor);
    }
    AbiUint112.readOrThrow = readOrThrow;
})(AbiUint112 || (AbiUint112 = {}));
class BytesAbiUint112 {
    value;
    #class = _6;
    name = this.#class.name;
    static bytes = 14;
    static nibbles = 28;
    static bits = 112;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _6(value);
    }
    static from(value) {
        return _6.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint112(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint112(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int112`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _6.nibbles;
        const content = cursor.readOrThrow(_6.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _6(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _6.bytes;
        const content = cursor.readOrThrow(_6.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _6(value);
    }
}
_6 = BytesAbiUint112;
class ZeroHexAbiUint112 {
    value;
    #class = _7;
    name = this.#class.name;
    static bytes = 14;
    static nibbles = 28;
    static bits = 112;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _7(value.toString(16));
    }
    static fromBigInt(value) {
        return new _7(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _7.fromBigInt(value);
        if (typeof value === "number")
            return _7.fromNumber(value);
        if (value.startsWith("0x"))
            return new _7(value.slice(2));
        return _7.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _7.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int112`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _7.nibbles;
        const content = cursor.readOrThrow(_7.nibbles);
        return new _7(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_14 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_14, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_14) {
            env_14.error = e_14;
            env_14.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_14);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _7.bytes;
        const content = cursor.readOrThrow(_7.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _7(value);
    }
}
_7 = ZeroHexAbiUint112;
var AbiUint120;
(function (AbiUint120) {
    AbiUint120.dynamic = false;
    AbiUint120.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint120.create(value);
        return ZeroHexAbiUint120.create(value);
    }
    AbiUint120.create = create;
    function from(value) {
        return AbiUint120.create(value);
    }
    AbiUint120.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint120.fromNumber(value);
    }
    AbiUint120.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint120.fromBigInt(value);
    }
    AbiUint120.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int120`;
    }
    AbiUint120.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint120.decodeOrThrow(cursor);
    }
    AbiUint120.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint120.readOrThrow(cursor);
    }
    AbiUint120.readOrThrow = readOrThrow;
})(AbiUint120 || (AbiUint120 = {}));
class BytesAbiUint120 {
    value;
    #class = _8;
    name = this.#class.name;
    static bytes = 15;
    static nibbles = 30;
    static bits = 120;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _8(value);
    }
    static from(value) {
        return _8.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint120(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint120(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int120`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _8.nibbles;
        const content = cursor.readOrThrow(_8.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _8(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _8.bytes;
        const content = cursor.readOrThrow(_8.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _8(value);
    }
}
_8 = BytesAbiUint120;
class ZeroHexAbiUint120 {
    value;
    #class = _9;
    name = this.#class.name;
    static bytes = 15;
    static nibbles = 30;
    static bits = 120;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _9(value.toString(16));
    }
    static fromBigInt(value) {
        return new _9(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _9.fromBigInt(value);
        if (typeof value === "number")
            return _9.fromNumber(value);
        if (value.startsWith("0x"))
            return new _9(value.slice(2));
        return _9.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _9.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int120`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _9.nibbles;
        const content = cursor.readOrThrow(_9.nibbles);
        return new _9(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_15 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_15, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_15) {
            env_15.error = e_15;
            env_15.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_15);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _9.bytes;
        const content = cursor.readOrThrow(_9.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _9(value);
    }
}
_9 = ZeroHexAbiUint120;
var AbiUint128;
(function (AbiUint128) {
    AbiUint128.dynamic = false;
    AbiUint128.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint128.create(value);
        return ZeroHexAbiUint128.create(value);
    }
    AbiUint128.create = create;
    function from(value) {
        return AbiUint128.create(value);
    }
    AbiUint128.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint128.fromNumber(value);
    }
    AbiUint128.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint128.fromBigInt(value);
    }
    AbiUint128.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int128`;
    }
    AbiUint128.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint128.decodeOrThrow(cursor);
    }
    AbiUint128.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint128.readOrThrow(cursor);
    }
    AbiUint128.readOrThrow = readOrThrow;
})(AbiUint128 || (AbiUint128 = {}));
class BytesAbiUint128 {
    value;
    #class = _10;
    name = this.#class.name;
    static bytes = 16;
    static nibbles = 32;
    static bits = 128;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _10(value);
    }
    static from(value) {
        return _10.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint128(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint128(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int128`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _10.nibbles;
        const content = cursor.readOrThrow(_10.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _10(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _10.bytes;
        const content = cursor.readOrThrow(_10.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _10(value);
    }
}
_10 = BytesAbiUint128;
class ZeroHexAbiUint128 {
    value;
    #class = _11;
    name = this.#class.name;
    static bytes = 16;
    static nibbles = 32;
    static bits = 128;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _11(value.toString(16));
    }
    static fromBigInt(value) {
        return new _11(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _11.fromBigInt(value);
        if (typeof value === "number")
            return _11.fromNumber(value);
        if (value.startsWith("0x"))
            return new _11(value.slice(2));
        return _11.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _11.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int128`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _11.nibbles;
        const content = cursor.readOrThrow(_11.nibbles);
        return new _11(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_16 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_16, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_16) {
            env_16.error = e_16;
            env_16.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_16);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _11.bytes;
        const content = cursor.readOrThrow(_11.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _11(value);
    }
}
_11 = ZeroHexAbiUint128;
var AbiUint136;
(function (AbiUint136) {
    AbiUint136.dynamic = false;
    AbiUint136.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint136.create(value);
        return ZeroHexAbiUint136.create(value);
    }
    AbiUint136.create = create;
    function from(value) {
        return AbiUint136.create(value);
    }
    AbiUint136.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint136.fromNumber(value);
    }
    AbiUint136.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint136.fromBigInt(value);
    }
    AbiUint136.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int136`;
    }
    AbiUint136.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint136.decodeOrThrow(cursor);
    }
    AbiUint136.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint136.readOrThrow(cursor);
    }
    AbiUint136.readOrThrow = readOrThrow;
})(AbiUint136 || (AbiUint136 = {}));
class BytesAbiUint136 {
    value;
    #class = _12;
    name = this.#class.name;
    static bytes = 17;
    static nibbles = 34;
    static bits = 136;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _12(value);
    }
    static from(value) {
        return _12.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint136(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint136(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int136`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _12.nibbles;
        const content = cursor.readOrThrow(_12.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _12(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _12.bytes;
        const content = cursor.readOrThrow(_12.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _12(value);
    }
}
_12 = BytesAbiUint136;
class ZeroHexAbiUint136 {
    value;
    #class = _13;
    name = this.#class.name;
    static bytes = 17;
    static nibbles = 34;
    static bits = 136;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _13(value.toString(16));
    }
    static fromBigInt(value) {
        return new _13(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _13.fromBigInt(value);
        if (typeof value === "number")
            return _13.fromNumber(value);
        if (value.startsWith("0x"))
            return new _13(value.slice(2));
        return _13.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _13.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int136`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _13.nibbles;
        const content = cursor.readOrThrow(_13.nibbles);
        return new _13(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_17 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_17, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_17) {
            env_17.error = e_17;
            env_17.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_17);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _13.bytes;
        const content = cursor.readOrThrow(_13.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _13(value);
    }
}
_13 = ZeroHexAbiUint136;
var AbiUint144;
(function (AbiUint144) {
    AbiUint144.dynamic = false;
    AbiUint144.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint144.create(value);
        return ZeroHexAbiUint144.create(value);
    }
    AbiUint144.create = create;
    function from(value) {
        return AbiUint144.create(value);
    }
    AbiUint144.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint144.fromNumber(value);
    }
    AbiUint144.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint144.fromBigInt(value);
    }
    AbiUint144.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int144`;
    }
    AbiUint144.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint144.decodeOrThrow(cursor);
    }
    AbiUint144.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint144.readOrThrow(cursor);
    }
    AbiUint144.readOrThrow = readOrThrow;
})(AbiUint144 || (AbiUint144 = {}));
class BytesAbiUint144 {
    value;
    #class = _14;
    name = this.#class.name;
    static bytes = 18;
    static nibbles = 36;
    static bits = 144;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _14(value);
    }
    static from(value) {
        return _14.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint144(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint144(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int144`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _14.nibbles;
        const content = cursor.readOrThrow(_14.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _14(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _14.bytes;
        const content = cursor.readOrThrow(_14.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _14(value);
    }
}
_14 = BytesAbiUint144;
class ZeroHexAbiUint144 {
    value;
    #class = _15;
    name = this.#class.name;
    static bytes = 18;
    static nibbles = 36;
    static bits = 144;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _15(value.toString(16));
    }
    static fromBigInt(value) {
        return new _15(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _15.fromBigInt(value);
        if (typeof value === "number")
            return _15.fromNumber(value);
        if (value.startsWith("0x"))
            return new _15(value.slice(2));
        return _15.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _15.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int144`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _15.nibbles;
        const content = cursor.readOrThrow(_15.nibbles);
        return new _15(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_18 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_18, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_18) {
            env_18.error = e_18;
            env_18.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_18);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _15.bytes;
        const content = cursor.readOrThrow(_15.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _15(value);
    }
}
_15 = ZeroHexAbiUint144;
var AbiUint152;
(function (AbiUint152) {
    AbiUint152.dynamic = false;
    AbiUint152.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint152.create(value);
        return ZeroHexAbiUint152.create(value);
    }
    AbiUint152.create = create;
    function from(value) {
        return AbiUint152.create(value);
    }
    AbiUint152.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint152.fromNumber(value);
    }
    AbiUint152.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint152.fromBigInt(value);
    }
    AbiUint152.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int152`;
    }
    AbiUint152.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint152.decodeOrThrow(cursor);
    }
    AbiUint152.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint152.readOrThrow(cursor);
    }
    AbiUint152.readOrThrow = readOrThrow;
})(AbiUint152 || (AbiUint152 = {}));
class BytesAbiUint152 {
    value;
    #class = _16;
    name = this.#class.name;
    static bytes = 19;
    static nibbles = 38;
    static bits = 152;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _16(value);
    }
    static from(value) {
        return _16.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint152(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint152(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int152`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _16.nibbles;
        const content = cursor.readOrThrow(_16.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _16(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _16.bytes;
        const content = cursor.readOrThrow(_16.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _16(value);
    }
}
_16 = BytesAbiUint152;
class ZeroHexAbiUint152 {
    value;
    #class = _17;
    name = this.#class.name;
    static bytes = 19;
    static nibbles = 38;
    static bits = 152;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _17(value.toString(16));
    }
    static fromBigInt(value) {
        return new _17(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _17.fromBigInt(value);
        if (typeof value === "number")
            return _17.fromNumber(value);
        if (value.startsWith("0x"))
            return new _17(value.slice(2));
        return _17.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _17.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int152`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _17.nibbles;
        const content = cursor.readOrThrow(_17.nibbles);
        return new _17(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_19 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_19, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_19) {
            env_19.error = e_19;
            env_19.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_19);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _17.bytes;
        const content = cursor.readOrThrow(_17.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _17(value);
    }
}
_17 = ZeroHexAbiUint152;
var AbiUint160;
(function (AbiUint160) {
    AbiUint160.dynamic = false;
    AbiUint160.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint160.create(value);
        return ZeroHexAbiUint160.create(value);
    }
    AbiUint160.create = create;
    function from(value) {
        return AbiUint160.create(value);
    }
    AbiUint160.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint160.fromNumber(value);
    }
    AbiUint160.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint160.fromBigInt(value);
    }
    AbiUint160.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int160`;
    }
    AbiUint160.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint160.decodeOrThrow(cursor);
    }
    AbiUint160.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint160.readOrThrow(cursor);
    }
    AbiUint160.readOrThrow = readOrThrow;
})(AbiUint160 || (AbiUint160 = {}));
class BytesAbiUint160 {
    value;
    #class = _18;
    name = this.#class.name;
    static bytes = 20;
    static nibbles = 40;
    static bits = 160;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _18(value);
    }
    static from(value) {
        return _18.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint160(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint160(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int160`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _18.nibbles;
        const content = cursor.readOrThrow(_18.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _18(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _18.bytes;
        const content = cursor.readOrThrow(_18.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _18(value);
    }
}
_18 = BytesAbiUint160;
class ZeroHexAbiUint160 {
    value;
    #class = _19;
    name = this.#class.name;
    static bytes = 20;
    static nibbles = 40;
    static bits = 160;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _19(value.toString(16));
    }
    static fromBigInt(value) {
        return new _19(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _19.fromBigInt(value);
        if (typeof value === "number")
            return _19.fromNumber(value);
        if (value.startsWith("0x"))
            return new _19(value.slice(2));
        return _19.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _19.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int160`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _19.nibbles;
        const content = cursor.readOrThrow(_19.nibbles);
        return new _19(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_20 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_20, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_20) {
            env_20.error = e_20;
            env_20.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_20);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _19.bytes;
        const content = cursor.readOrThrow(_19.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _19(value);
    }
}
_19 = ZeroHexAbiUint160;
var AbiUint168;
(function (AbiUint168) {
    AbiUint168.dynamic = false;
    AbiUint168.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint168.create(value);
        return ZeroHexAbiUint168.create(value);
    }
    AbiUint168.create = create;
    function from(value) {
        return AbiUint168.create(value);
    }
    AbiUint168.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint168.fromNumber(value);
    }
    AbiUint168.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint168.fromBigInt(value);
    }
    AbiUint168.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int168`;
    }
    AbiUint168.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint168.decodeOrThrow(cursor);
    }
    AbiUint168.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint168.readOrThrow(cursor);
    }
    AbiUint168.readOrThrow = readOrThrow;
})(AbiUint168 || (AbiUint168 = {}));
class BytesAbiUint168 {
    value;
    #class = _20;
    name = this.#class.name;
    static bytes = 21;
    static nibbles = 42;
    static bits = 168;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _20(value);
    }
    static from(value) {
        return _20.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint168(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint168(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int168`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _20.nibbles;
        const content = cursor.readOrThrow(_20.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _20(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _20.bytes;
        const content = cursor.readOrThrow(_20.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _20(value);
    }
}
_20 = BytesAbiUint168;
class ZeroHexAbiUint168 {
    value;
    #class = _21;
    name = this.#class.name;
    static bytes = 21;
    static nibbles = 42;
    static bits = 168;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _21(value.toString(16));
    }
    static fromBigInt(value) {
        return new _21(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _21.fromBigInt(value);
        if (typeof value === "number")
            return _21.fromNumber(value);
        if (value.startsWith("0x"))
            return new _21(value.slice(2));
        return _21.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _21.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int168`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _21.nibbles;
        const content = cursor.readOrThrow(_21.nibbles);
        return new _21(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_21 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_21, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_21) {
            env_21.error = e_21;
            env_21.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_21);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _21.bytes;
        const content = cursor.readOrThrow(_21.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _21(value);
    }
}
_21 = ZeroHexAbiUint168;
var AbiUint176;
(function (AbiUint176) {
    AbiUint176.dynamic = false;
    AbiUint176.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint176.create(value);
        return ZeroHexAbiUint176.create(value);
    }
    AbiUint176.create = create;
    function from(value) {
        return AbiUint176.create(value);
    }
    AbiUint176.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint176.fromNumber(value);
    }
    AbiUint176.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint176.fromBigInt(value);
    }
    AbiUint176.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int176`;
    }
    AbiUint176.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint176.decodeOrThrow(cursor);
    }
    AbiUint176.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint176.readOrThrow(cursor);
    }
    AbiUint176.readOrThrow = readOrThrow;
})(AbiUint176 || (AbiUint176 = {}));
class BytesAbiUint176 {
    value;
    #class = _22;
    name = this.#class.name;
    static bytes = 22;
    static nibbles = 44;
    static bits = 176;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _22(value);
    }
    static from(value) {
        return _22.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint176(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint176(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int176`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _22.nibbles;
        const content = cursor.readOrThrow(_22.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _22(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _22.bytes;
        const content = cursor.readOrThrow(_22.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _22(value);
    }
}
_22 = BytesAbiUint176;
class ZeroHexAbiUint176 {
    value;
    #class = _23;
    name = this.#class.name;
    static bytes = 22;
    static nibbles = 44;
    static bits = 176;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _23(value.toString(16));
    }
    static fromBigInt(value) {
        return new _23(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _23.fromBigInt(value);
        if (typeof value === "number")
            return _23.fromNumber(value);
        if (value.startsWith("0x"))
            return new _23(value.slice(2));
        return _23.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _23.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int176`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _23.nibbles;
        const content = cursor.readOrThrow(_23.nibbles);
        return new _23(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_22 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_22, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_22) {
            env_22.error = e_22;
            env_22.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_22);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _23.bytes;
        const content = cursor.readOrThrow(_23.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _23(value);
    }
}
_23 = ZeroHexAbiUint176;
var AbiUint184;
(function (AbiUint184) {
    AbiUint184.dynamic = false;
    AbiUint184.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint184.create(value);
        return ZeroHexAbiUint184.create(value);
    }
    AbiUint184.create = create;
    function from(value) {
        return AbiUint184.create(value);
    }
    AbiUint184.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint184.fromNumber(value);
    }
    AbiUint184.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint184.fromBigInt(value);
    }
    AbiUint184.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int184`;
    }
    AbiUint184.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint184.decodeOrThrow(cursor);
    }
    AbiUint184.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint184.readOrThrow(cursor);
    }
    AbiUint184.readOrThrow = readOrThrow;
})(AbiUint184 || (AbiUint184 = {}));
class BytesAbiUint184 {
    value;
    #class = _24;
    name = this.#class.name;
    static bytes = 23;
    static nibbles = 46;
    static bits = 184;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _24(value);
    }
    static from(value) {
        return _24.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint184(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint184(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int184`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _24.nibbles;
        const content = cursor.readOrThrow(_24.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _24(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _24.bytes;
        const content = cursor.readOrThrow(_24.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _24(value);
    }
}
_24 = BytesAbiUint184;
class ZeroHexAbiUint184 {
    value;
    #class = _25;
    name = this.#class.name;
    static bytes = 23;
    static nibbles = 46;
    static bits = 184;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _25(value.toString(16));
    }
    static fromBigInt(value) {
        return new _25(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _25.fromBigInt(value);
        if (typeof value === "number")
            return _25.fromNumber(value);
        if (value.startsWith("0x"))
            return new _25(value.slice(2));
        return _25.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _25.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int184`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _25.nibbles;
        const content = cursor.readOrThrow(_25.nibbles);
        return new _25(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_23 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_23, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_23) {
            env_23.error = e_23;
            env_23.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_23);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _25.bytes;
        const content = cursor.readOrThrow(_25.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _25(value);
    }
}
_25 = ZeroHexAbiUint184;
var AbiUint192;
(function (AbiUint192) {
    AbiUint192.dynamic = false;
    AbiUint192.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint192.create(value);
        return ZeroHexAbiUint192.create(value);
    }
    AbiUint192.create = create;
    function from(value) {
        return AbiUint192.create(value);
    }
    AbiUint192.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint192.fromNumber(value);
    }
    AbiUint192.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint192.fromBigInt(value);
    }
    AbiUint192.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int192`;
    }
    AbiUint192.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint192.decodeOrThrow(cursor);
    }
    AbiUint192.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint192.readOrThrow(cursor);
    }
    AbiUint192.readOrThrow = readOrThrow;
})(AbiUint192 || (AbiUint192 = {}));
class BytesAbiUint192 {
    value;
    #class = _26;
    name = this.#class.name;
    static bytes = 24;
    static nibbles = 48;
    static bits = 192;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _26(value);
    }
    static from(value) {
        return _26.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint192(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint192(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int192`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _26.nibbles;
        const content = cursor.readOrThrow(_26.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _26(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _26.bytes;
        const content = cursor.readOrThrow(_26.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _26(value);
    }
}
_26 = BytesAbiUint192;
class ZeroHexAbiUint192 {
    value;
    #class = _27;
    name = this.#class.name;
    static bytes = 24;
    static nibbles = 48;
    static bits = 192;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _27(value.toString(16));
    }
    static fromBigInt(value) {
        return new _27(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _27.fromBigInt(value);
        if (typeof value === "number")
            return _27.fromNumber(value);
        if (value.startsWith("0x"))
            return new _27(value.slice(2));
        return _27.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _27.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int192`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _27.nibbles;
        const content = cursor.readOrThrow(_27.nibbles);
        return new _27(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_24 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_24, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_24) {
            env_24.error = e_24;
            env_24.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_24);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _27.bytes;
        const content = cursor.readOrThrow(_27.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _27(value);
    }
}
_27 = ZeroHexAbiUint192;
var AbiUint200;
(function (AbiUint200) {
    AbiUint200.dynamic = false;
    AbiUint200.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint200.create(value);
        return ZeroHexAbiUint200.create(value);
    }
    AbiUint200.create = create;
    function from(value) {
        return AbiUint200.create(value);
    }
    AbiUint200.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint200.fromNumber(value);
    }
    AbiUint200.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint200.fromBigInt(value);
    }
    AbiUint200.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int200`;
    }
    AbiUint200.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint200.decodeOrThrow(cursor);
    }
    AbiUint200.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint200.readOrThrow(cursor);
    }
    AbiUint200.readOrThrow = readOrThrow;
})(AbiUint200 || (AbiUint200 = {}));
class BytesAbiUint200 {
    value;
    #class = _28;
    name = this.#class.name;
    static bytes = 25;
    static nibbles = 50;
    static bits = 200;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _28(value);
    }
    static from(value) {
        return _28.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint200(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint200(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int200`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _28.nibbles;
        const content = cursor.readOrThrow(_28.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _28(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _28.bytes;
        const content = cursor.readOrThrow(_28.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _28(value);
    }
}
_28 = BytesAbiUint200;
class ZeroHexAbiUint200 {
    value;
    #class = _29;
    name = this.#class.name;
    static bytes = 25;
    static nibbles = 50;
    static bits = 200;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _29(value.toString(16));
    }
    static fromBigInt(value) {
        return new _29(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _29.fromBigInt(value);
        if (typeof value === "number")
            return _29.fromNumber(value);
        if (value.startsWith("0x"))
            return new _29(value.slice(2));
        return _29.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _29.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int200`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _29.nibbles;
        const content = cursor.readOrThrow(_29.nibbles);
        return new _29(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_25 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_25, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_25) {
            env_25.error = e_25;
            env_25.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_25);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _29.bytes;
        const content = cursor.readOrThrow(_29.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _29(value);
    }
}
_29 = ZeroHexAbiUint200;
var AbiUint208;
(function (AbiUint208) {
    AbiUint208.dynamic = false;
    AbiUint208.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint208.create(value);
        return ZeroHexAbiUint208.create(value);
    }
    AbiUint208.create = create;
    function from(value) {
        return AbiUint208.create(value);
    }
    AbiUint208.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint208.fromNumber(value);
    }
    AbiUint208.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint208.fromBigInt(value);
    }
    AbiUint208.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int208`;
    }
    AbiUint208.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint208.decodeOrThrow(cursor);
    }
    AbiUint208.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint208.readOrThrow(cursor);
    }
    AbiUint208.readOrThrow = readOrThrow;
})(AbiUint208 || (AbiUint208 = {}));
class BytesAbiUint208 {
    value;
    #class = _30;
    name = this.#class.name;
    static bytes = 26;
    static nibbles = 52;
    static bits = 208;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _30(value);
    }
    static from(value) {
        return _30.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint208(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint208(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int208`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _30.nibbles;
        const content = cursor.readOrThrow(_30.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _30(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _30.bytes;
        const content = cursor.readOrThrow(_30.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _30(value);
    }
}
_30 = BytesAbiUint208;
class ZeroHexAbiUint208 {
    value;
    #class = _31;
    name = this.#class.name;
    static bytes = 26;
    static nibbles = 52;
    static bits = 208;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _31(value.toString(16));
    }
    static fromBigInt(value) {
        return new _31(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _31.fromBigInt(value);
        if (typeof value === "number")
            return _31.fromNumber(value);
        if (value.startsWith("0x"))
            return new _31(value.slice(2));
        return _31.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _31.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int208`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _31.nibbles;
        const content = cursor.readOrThrow(_31.nibbles);
        return new _31(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_26 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_26, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_26) {
            env_26.error = e_26;
            env_26.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_26);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _31.bytes;
        const content = cursor.readOrThrow(_31.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _31(value);
    }
}
_31 = ZeroHexAbiUint208;
var AbiUint216;
(function (AbiUint216) {
    AbiUint216.dynamic = false;
    AbiUint216.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint216.create(value);
        return ZeroHexAbiUint216.create(value);
    }
    AbiUint216.create = create;
    function from(value) {
        return AbiUint216.create(value);
    }
    AbiUint216.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint216.fromNumber(value);
    }
    AbiUint216.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint216.fromBigInt(value);
    }
    AbiUint216.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int216`;
    }
    AbiUint216.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint216.decodeOrThrow(cursor);
    }
    AbiUint216.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint216.readOrThrow(cursor);
    }
    AbiUint216.readOrThrow = readOrThrow;
})(AbiUint216 || (AbiUint216 = {}));
class BytesAbiUint216 {
    value;
    #class = _32;
    name = this.#class.name;
    static bytes = 27;
    static nibbles = 54;
    static bits = 216;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _32(value);
    }
    static from(value) {
        return _32.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint216(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint216(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int216`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _32.nibbles;
        const content = cursor.readOrThrow(_32.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _32(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _32.bytes;
        const content = cursor.readOrThrow(_32.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _32(value);
    }
}
_32 = BytesAbiUint216;
class ZeroHexAbiUint216 {
    value;
    #class = _33;
    name = this.#class.name;
    static bytes = 27;
    static nibbles = 54;
    static bits = 216;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _33(value.toString(16));
    }
    static fromBigInt(value) {
        return new _33(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _33.fromBigInt(value);
        if (typeof value === "number")
            return _33.fromNumber(value);
        if (value.startsWith("0x"))
            return new _33(value.slice(2));
        return _33.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _33.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int216`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _33.nibbles;
        const content = cursor.readOrThrow(_33.nibbles);
        return new _33(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_27 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_27, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_27) {
            env_27.error = e_27;
            env_27.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_27);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _33.bytes;
        const content = cursor.readOrThrow(_33.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _33(value);
    }
}
_33 = ZeroHexAbiUint216;
var AbiUint224;
(function (AbiUint224) {
    AbiUint224.dynamic = false;
    AbiUint224.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint224.create(value);
        return ZeroHexAbiUint224.create(value);
    }
    AbiUint224.create = create;
    function from(value) {
        return AbiUint224.create(value);
    }
    AbiUint224.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint224.fromNumber(value);
    }
    AbiUint224.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint224.fromBigInt(value);
    }
    AbiUint224.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int224`;
    }
    AbiUint224.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint224.decodeOrThrow(cursor);
    }
    AbiUint224.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint224.readOrThrow(cursor);
    }
    AbiUint224.readOrThrow = readOrThrow;
})(AbiUint224 || (AbiUint224 = {}));
class BytesAbiUint224 {
    value;
    #class = _34;
    name = this.#class.name;
    static bytes = 28;
    static nibbles = 56;
    static bits = 224;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _34(value);
    }
    static from(value) {
        return _34.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint224(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint224(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int224`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _34.nibbles;
        const content = cursor.readOrThrow(_34.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _34(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _34.bytes;
        const content = cursor.readOrThrow(_34.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _34(value);
    }
}
_34 = BytesAbiUint224;
class ZeroHexAbiUint224 {
    value;
    #class = _35;
    name = this.#class.name;
    static bytes = 28;
    static nibbles = 56;
    static bits = 224;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _35(value.toString(16));
    }
    static fromBigInt(value) {
        return new _35(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _35.fromBigInt(value);
        if (typeof value === "number")
            return _35.fromNumber(value);
        if (value.startsWith("0x"))
            return new _35(value.slice(2));
        return _35.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _35.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int224`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _35.nibbles;
        const content = cursor.readOrThrow(_35.nibbles);
        return new _35(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_28 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_28, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_28) {
            env_28.error = e_28;
            env_28.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_28);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _35.bytes;
        const content = cursor.readOrThrow(_35.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _35(value);
    }
}
_35 = ZeroHexAbiUint224;
var AbiUint232;
(function (AbiUint232) {
    AbiUint232.dynamic = false;
    AbiUint232.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint232.create(value);
        return ZeroHexAbiUint232.create(value);
    }
    AbiUint232.create = create;
    function from(value) {
        return AbiUint232.create(value);
    }
    AbiUint232.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint232.fromNumber(value);
    }
    AbiUint232.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint232.fromBigInt(value);
    }
    AbiUint232.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int232`;
    }
    AbiUint232.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint232.decodeOrThrow(cursor);
    }
    AbiUint232.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint232.readOrThrow(cursor);
    }
    AbiUint232.readOrThrow = readOrThrow;
})(AbiUint232 || (AbiUint232 = {}));
class BytesAbiUint232 {
    value;
    #class = _36;
    name = this.#class.name;
    static bytes = 29;
    static nibbles = 58;
    static bits = 232;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _36(value);
    }
    static from(value) {
        return _36.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint232(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint232(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int232`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _36.nibbles;
        const content = cursor.readOrThrow(_36.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _36(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _36.bytes;
        const content = cursor.readOrThrow(_36.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _36(value);
    }
}
_36 = BytesAbiUint232;
class ZeroHexAbiUint232 {
    value;
    #class = _37;
    name = this.#class.name;
    static bytes = 29;
    static nibbles = 58;
    static bits = 232;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _37(value.toString(16));
    }
    static fromBigInt(value) {
        return new _37(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _37.fromBigInt(value);
        if (typeof value === "number")
            return _37.fromNumber(value);
        if (value.startsWith("0x"))
            return new _37(value.slice(2));
        return _37.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _37.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int232`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _37.nibbles;
        const content = cursor.readOrThrow(_37.nibbles);
        return new _37(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_29 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_29, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_29) {
            env_29.error = e_29;
            env_29.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_29);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _37.bytes;
        const content = cursor.readOrThrow(_37.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _37(value);
    }
}
_37 = ZeroHexAbiUint232;
var AbiUint240;
(function (AbiUint240) {
    AbiUint240.dynamic = false;
    AbiUint240.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint240.create(value);
        return ZeroHexAbiUint240.create(value);
    }
    AbiUint240.create = create;
    function from(value) {
        return AbiUint240.create(value);
    }
    AbiUint240.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint240.fromNumber(value);
    }
    AbiUint240.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint240.fromBigInt(value);
    }
    AbiUint240.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int240`;
    }
    AbiUint240.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint240.decodeOrThrow(cursor);
    }
    AbiUint240.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint240.readOrThrow(cursor);
    }
    AbiUint240.readOrThrow = readOrThrow;
})(AbiUint240 || (AbiUint240 = {}));
class BytesAbiUint240 {
    value;
    #class = _38;
    name = this.#class.name;
    static bytes = 30;
    static nibbles = 60;
    static bits = 240;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _38(value);
    }
    static from(value) {
        return _38.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint240(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint240(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int240`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _38.nibbles;
        const content = cursor.readOrThrow(_38.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _38(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _38.bytes;
        const content = cursor.readOrThrow(_38.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _38(value);
    }
}
_38 = BytesAbiUint240;
class ZeroHexAbiUint240 {
    value;
    #class = _39;
    name = this.#class.name;
    static bytes = 30;
    static nibbles = 60;
    static bits = 240;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _39(value.toString(16));
    }
    static fromBigInt(value) {
        return new _39(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _39.fromBigInt(value);
        if (typeof value === "number")
            return _39.fromNumber(value);
        if (value.startsWith("0x"))
            return new _39(value.slice(2));
        return _39.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _39.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int240`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _39.nibbles;
        const content = cursor.readOrThrow(_39.nibbles);
        return new _39(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_30 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_30, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_30) {
            env_30.error = e_30;
            env_30.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_30);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _39.bytes;
        const content = cursor.readOrThrow(_39.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _39(value);
    }
}
_39 = ZeroHexAbiUint240;
var AbiUint248;
(function (AbiUint248) {
    AbiUint248.dynamic = false;
    AbiUint248.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint248.create(value);
        return ZeroHexAbiUint248.create(value);
    }
    AbiUint248.create = create;
    function from(value) {
        return AbiUint248.create(value);
    }
    AbiUint248.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint248.fromNumber(value);
    }
    AbiUint248.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint248.fromBigInt(value);
    }
    AbiUint248.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int248`;
    }
    AbiUint248.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint248.decodeOrThrow(cursor);
    }
    AbiUint248.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint248.readOrThrow(cursor);
    }
    AbiUint248.readOrThrow = readOrThrow;
})(AbiUint248 || (AbiUint248 = {}));
class BytesAbiUint248 {
    value;
    #class = _40;
    name = this.#class.name;
    static bytes = 31;
    static nibbles = 62;
    static bits = 248;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _40(value);
    }
    static from(value) {
        return _40.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint248(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint248(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int248`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _40.nibbles;
        const content = cursor.readOrThrow(_40.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _40(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _40.bytes;
        const content = cursor.readOrThrow(_40.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _40(value);
    }
}
_40 = BytesAbiUint248;
class ZeroHexAbiUint248 {
    value;
    #class = _41;
    name = this.#class.name;
    static bytes = 31;
    static nibbles = 62;
    static bits = 248;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _41(value.toString(16));
    }
    static fromBigInt(value) {
        return new _41(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _41.fromBigInt(value);
        if (typeof value === "number")
            return _41.fromNumber(value);
        if (value.startsWith("0x"))
            return new _41(value.slice(2));
        return _41.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _41.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int248`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _41.nibbles;
        const content = cursor.readOrThrow(_41.nibbles);
        return new _41(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_31 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_31, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_31) {
            env_31.error = e_31;
            env_31.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_31);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _41.bytes;
        const content = cursor.readOrThrow(_41.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _41(value);
    }
}
_41 = ZeroHexAbiUint248;
var AbiUint256;
(function (AbiUint256) {
    AbiUint256.dynamic = false;
    AbiUint256.size = 32;
    function create(value) {
        if (value instanceof Uint8Array)
            return BytesAbiUint256.create(value);
        return ZeroHexAbiUint256.create(value);
    }
    AbiUint256.create = create;
    function from(value) {
        return AbiUint256.create(value);
    }
    AbiUint256.from = from;
    function fromNumber(value) {
        return ZeroHexAbiUint256.fromNumber(value);
    }
    AbiUint256.fromNumber = fromNumber;
    function fromBigInt(value) {
        return ZeroHexAbiUint256.fromBigInt(value);
    }
    AbiUint256.fromBigInt = fromBigInt;
    function codegen() {
        return `Abi.Int256`;
    }
    AbiUint256.codegen = codegen;
    function decodeOrThrow(cursor) {
        return ZeroHexAbiUint256.decodeOrThrow(cursor);
    }
    AbiUint256.decodeOrThrow = decodeOrThrow;
    function readOrThrow(cursor) {
        return BytesAbiUint256.readOrThrow(cursor);
    }
    AbiUint256.readOrThrow = readOrThrow;
})(AbiUint256 || (AbiUint256 = {}));
class BytesAbiUint256 {
    value;
    #class = _42;
    name = this.#class.name;
    static bytes = 32;
    static nibbles = 64;
    static bits = 256;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new _42(value);
    }
    static from(value) {
        return _42.create(value);
    }
    intoOrThrow() {
        return new ZeroHexAbiUint256(this.encodePackedOrThrow()).intoOrThrow();
    }
    toJSON() {
        return new ZeroHexAbiUint256(this.encodePackedOrThrow()).toJSON();
    }
    static codegen() {
        return `Abi.Int256`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value).padStart(64, "0");
    }
    encodePackedOrThrow() {
        return _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(this.value);
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _42.nibbles;
        const content = cursor.readOrThrow(_42.nibbles);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(content).copyAndDispose();
        return new _42(value);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        cursor.fillOrThrow(0, 32 - this.value.length);
        cursor.writeOrThrow(this.value);
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _42.bytes;
        const content = cursor.readOrThrow(_42.bytes);
        const value = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_1__.Bytes.from(content);
        return new _42(value);
    }
}
_42 = BytesAbiUint256;
class ZeroHexAbiUint256 {
    value;
    #class = _43;
    name = this.#class.name;
    static bytes = 32;
    static nibbles = 64;
    static bits = 256;
    static dynamic = false;
    static size = 32;
    bytes = this.#class.bytes;
    nibbles = this.#class.nibbles;
    bits = this.#class.bits;
    dynamic = this.#class.dynamic;
    size = this.#class.size;
    constructor(value) {
        this.value = value;
    }
    static fromNumber(value) {
        return new _43(value.toString(16));
    }
    static fromBigInt(value) {
        return new _43(value.toString(16));
    }
    static create(value) {
        if (typeof value === "bigint")
            return _43.fromBigInt(value);
        if (typeof value === "number")
            return _43.fromNumber(value);
        if (value.startsWith("0x"))
            return new _43(value.slice(2));
        return _43.fromBigInt(BigInt(value));
    }
    static from(value) {
        return _43.create(value);
    }
    intoOrThrow() {
        return this.value.length ? BigInt("0x" + this.value) : 0n;
    }
    toJSON() {
        return this.intoOrThrow().toString();
    }
    static codegen() {
        return `Abi.Int256`;
    }
    get class() {
        return this.#class;
    }
    encodeOrThrow() {
        return this.value.padStart(64, "0");
    }
    encodePackedOrThrow() {
        return this.value;
    }
    static decodeOrThrow(cursor) {
        cursor.offset += 64 - _43.nibbles;
        const content = cursor.readOrThrow(_43.nibbles);
        return new _43(content);
    }
    sizeOrThrow() {
        return this.size;
    }
    writeOrThrow(cursor) {
        const env_32 = { stack: [], error: void 0, hasError: false };
        try {
            const slice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__addDisposableResource)(env_32, _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().padStartAndDecodeOrThrow(this.value), false);
            cursor.fillOrThrow(0, 32 - slice.bytes.length);
            cursor.writeOrThrow(slice.bytes);
        }
        catch (e_32) {
            env_32.error = e_32;
            env_32.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_2__.__disposeResources)(env_32);
        }
    }
    static readOrThrow(cursor) {
        cursor.offset += 32 - _43.bytes;
        const content = cursor.readOrThrow(_43.bytes);
        const value = _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(content);
        return new _43(value);
    }
}
_43 = ZeroHexAbiUint256;
const uintByName = {
    uint8: AbiUint8,
    uint16: AbiUint16,
    uint24: AbiUint24,
    uint32: AbiUint32,
    uint40: AbiUint40,
    uint48: AbiUint48,
    uint56: AbiUint56,
    uint64: AbiUint64,
    uint72: AbiUint72,
    uint80: AbiUint80,
    uint88: AbiUint88,
    uint96: AbiUint96,
    uint104: AbiUint104,
    uint112: AbiUint112,
    uint120: AbiUint120,
    uint128: AbiUint128,
    uint136: AbiUint136,
    uint144: AbiUint144,
    uint152: AbiUint152,
    uint160: AbiUint160,
    uint168: AbiUint168,
    uint176: AbiUint176,
    uint184: AbiUint184,
    uint192: AbiUint192,
    uint200: AbiUint200,
    uint208: AbiUint208,
    uint216: AbiUint216,
    uint224: AbiUint224,
    uint232: AbiUint232,
    uint240: AbiUint240,
    uint248: AbiUint248,
    uint256: AbiUint256,
};


//# sourceMappingURL=uint.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cubane/dist/esm/src/mods/types/address/index.mjs":
/*!********************************************************************************!*\
  !*** ./node_modules/@hazae41/cubane/dist/esm/src/mods/types/address/index.mjs ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Address: () => (/* binding */ Address)
/* harmony export */ });
/* harmony import */ var _node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../node_modules/tslib/tslib.es6.mjs */ "./node_modules/@hazae41/cubane/dist/esm/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @hazae41/base16 */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs");
/* harmony import */ var _hazae41_bytes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/bytes */ "./node_modules/@hazae41/bytes/dist/esm/mods/bytes/bytes.mjs");
/* harmony import */ var _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @hazae41/keccak256 */ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/adapter.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");
/* harmony import */ var _zerohex_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../zerohex/index.mjs */ "./node_modules/@hazae41/cubane/dist/esm/src/mods/types/zerohex/index.mjs");







var Address;
(function (Address) {
    function from(fromable) {
        const zeroHex = _zerohex_index_mjs__WEBPACK_IMPORTED_MODULE_0__.ZeroHexString.from(fromable);
        if (zeroHex == null)
            return undefined;
        if (!/^0x[0-9a-fA-F]{40}$/.test(zeroHex))
            return undefined;
        return checksum(zeroHex.slice(2));
    }
    Address.from = from;
    function tryFrom(fromable) {
        const address = from(fromable);
        if (address == null)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_1__.Err(new Error(`Could not convert to Address`));
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_2__.Ok(address);
    }
    Address.tryFrom = tryFrom;
    function fromOrThrow(fromable) {
        const address = from(fromable);
        if (address == null)
            throw new Error(`Could not convert to Address`);
        return address;
    }
    Address.fromOrThrow = fromOrThrow;
    function is(maybeAddress) {
        if (!/^0x[0-9a-fA-F]{40}$/.test(maybeAddress))
            return false;
        return maybeAddress === checksum(maybeAddress.slice(2));
    }
    Address.is = is;
    function checksum(rawHex) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const lowerCase = rawHex.toLowerCase();
            const upperCase = rawHex.toUpperCase();
            const bytes = _hazae41_bytes__WEBPACK_IMPORTED_MODULE_3__.Bytes.fromUtf8(lowerCase);
            const hashed = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_4__.__addDisposableResource)(env_1, _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_5__.get().hashOrThrow(bytes), false);
            let address = "0x";
            for (let i = 0; i < 40; i += 2) {
                const byte = hashed.bytes[i >> 1];
                address += (byte >> 4) > 7
                    ? upperCase[i]
                    : lowerCase[i];
                address += (byte & 0x0f) > 7
                    ? upperCase[i + 1]
                    : lowerCase[i + 1];
            }
            return address;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_4__.__disposeResources)(env_1);
        }
    }
    Address.checksum = checksum;
    /**
     * Format address as "0xFFFF...FFFF" for UI display
     * @param address
     * @returns
     */
    function format(address) {
        return `0x${address.slice(2, 6)}...${address.slice(-4)}`;
    }
    Address.format = format;
    /**
     * Compute address from uncompressed public key
     * @param uncompressedPublicKey
     * @returns
     */
    function compute(uncompressedPublicKey) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const hashedSlice = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_4__.__addDisposableResource)(env_2, _hazae41_keccak256__WEBPACK_IMPORTED_MODULE_5__.get().hashOrThrow(uncompressedPublicKey.subarray(1)), false);
            const rawLowerCase = _hazae41_base16__WEBPACK_IMPORTED_MODULE_6__.get().encodeOrThrow(hashedSlice.bytes.slice(-20));
            return checksum(rawLowerCase);
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_4__.__disposeResources)(env_2);
        }
    }
    Address.compute = compute;
})(Address || (Address = {}));


//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cubane/dist/esm/src/mods/types/zerohex/index.mjs":
/*!********************************************************************************!*\
  !*** ./node_modules/@hazae41/cubane/dist/esm/src/mods/types/zerohex/index.mjs ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZeroHexString: () => (/* binding */ ZeroHexString)
/* harmony export */ });
/* harmony import */ var _hazae41_base16__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/base16 */ "./node_modules/@hazae41/base16/dist/esm/src/mods/base16/adapter.mjs");


var ZeroHexString;
(function (ZeroHexString) {
    function from(fromable) {
        if (typeof fromable === "number")
            return `0x${fromable.toString(16)}`;
        if (typeof fromable === "bigint")
            return `0x${fromable.toString(16)}`;
        if (fromable instanceof Uint8Array)
            return `0x${_hazae41_base16__WEBPACK_IMPORTED_MODULE_0__.get().encodeOrThrow(fromable)}`;
        if (is(fromable))
            return fromable;
        return `0x${fromable}`;
    }
    ZeroHexString.from = from;
    function is(maybeZeroHex) {
        return maybeZeroHex.startsWith("0x");
    }
    ZeroHexString.is = is;
})(ZeroHexString || (ZeroHexString = {}));


//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cursor/dist/esm/libs/buffers/buffers.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@hazae41/cursor/dist/esm/libs/buffers/buffers.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Buffers: () => (/* binding */ Buffers)
/* harmony export */ });
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/next/dist/compiled/buffer/index.js")["Buffer"];
var Buffers;
(function (Buffers) {
    function fromView(view) {
        return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    }
    Buffers.fromView = fromView;
})(Buffers || (Buffers = {}));


//# sourceMappingURL=buffers.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cursor/dist/esm/libs/bytes/bytes.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@hazae41/cursor/dist/esm/libs/bytes/bytes.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Uint8Arrays: () => (/* binding */ Uint8Arrays)
/* harmony export */ });
var Uint8Arrays;
(function (Uint8Arrays) {
    function fromView(view) {
        return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
    Uint8Arrays.fromView = fromView;
})(Uint8Arrays || (Uint8Arrays = {}));


//# sourceMappingURL=bytes.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cursor/dist/esm/libs/dataviews/dataviews.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/@hazae41/cursor/dist/esm/libs/dataviews/dataviews.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataViews: () => (/* binding */ DataViews)
/* harmony export */ });
var DataViews;
(function (DataViews) {
    function fromView(view) {
        return new DataView(view.buffer, view.byteOffset, view.byteLength);
    }
    DataViews.fromView = fromView;
})(DataViews || (DataViews = {}));


//# sourceMappingURL=dataviews.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cursor/dist/esm/libs/utf8/utf8.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@hazae41/cursor/dist/esm/libs/utf8/utf8.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utf8: () => (/* binding */ Utf8)
/* harmony export */ });
var Utf8;
(function (Utf8) {
    Utf8.encoder = new TextEncoder();
    Utf8.decoder = new TextDecoder();
})(Utf8 || (Utf8 = {}));


//# sourceMappingURL=utf8.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cursor/dist/esm/mods/cursor/cursor.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/cursor/dist/esm/mods/cursor/cursor.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cursor: () => (/* binding */ Cursor)
/* harmony export */ });
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");
/* harmony import */ var _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../libs/buffers/buffers.mjs */ "./node_modules/@hazae41/cursor/dist/esm/libs/buffers/buffers.mjs");
/* harmony import */ var _libs_bytes_bytes_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/bytes/bytes.mjs */ "./node_modules/@hazae41/cursor/dist/esm/libs/bytes/bytes.mjs");
/* harmony import */ var _libs_dataviews_dataviews_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../libs/dataviews/dataviews.mjs */ "./node_modules/@hazae41/cursor/dist/esm/libs/dataviews/dataviews.mjs");
/* harmony import */ var _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../libs/utf8/utf8.mjs */ "./node_modules/@hazae41/cursor/dist/esm/libs/utf8/utf8.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/cursor/dist/esm/mods/cursor/errors.mjs");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/next/dist/compiled/buffer/index.js")["Buffer"];







class Cursor {
    #class = Cursor;
    #inner;
    #bytes;
    #data;
    #buffer;
    offset;
    /**
     * A cursor for bytes
     * @param inner
     * @param offset
     */
    constructor(inner, offset = 0) {
        this.#inner = inner;
        this.offset = offset;
    }
    static new(inner, offset) {
        return new Cursor(inner, offset);
    }
    get inner() {
        return this.#inner;
    }
    set inner(inner) {
        this.#inner = inner;
        this.#bytes = undefined;
        this.#data = undefined;
        this.#buffer = undefined;
    }
    get bytes() {
        return this.#bytes ??= _libs_bytes_bytes_mjs__WEBPACK_IMPORTED_MODULE_0__.Uint8Arrays.fromView(this.inner);
    }
    get data() {
        return this.#data ??= _libs_dataviews_dataviews_mjs__WEBPACK_IMPORTED_MODULE_1__.DataViews.fromView(this.inner);
    }
    get buffer() {
        return this.#buffer ??= _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_2__.Buffers.fromView(this.inner);
    }
    /**
     * @returns total number of bytes
     */
    get length() {
        return this.bytes.length;
    }
    /**
     * @returns number of remaining bytes
     */
    get remaining() {
        return this.length - this.offset;
    }
    /**
     * Get a subarray of the bytes before the current offset
     * @returns subarray of the bytes before the current offset
     */
    get before() {
        return this.bytes.subarray(0, this.offset);
    }
    /**
     * Get a subarray of the bytes after the current offset
     * @returns subarray of the bytes after the current offset
     */
    get after() {
        return this.bytes.subarray(this.offset);
    }
    /**
     * Get a subarray of the bytes
     * @param length
     * @returns subarray of the bytes
     */
    getOrThrow(length) {
        if (this.remaining < length)
            throw _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadLengthOverflowError.from(this, length);
        const subarray = this.bytes.subarray(this.offset, this.offset + length);
        return subarray;
    }
    /**
     * Get a subarray of the bytes
     * @param length
     * @returns subarray of the bytes
     */
    tryGet(length) {
        if (this.remaining < length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadLengthOverflowError.from(this, length));
        const subarray = this.bytes.subarray(this.offset, this.offset + length);
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(subarray);
    }
    getAndCopyOrThrow(length) {
        if (this.remaining < length)
            throw _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadLengthOverflowError.from(this, length);
        const slice = this.bytes.slice(this.offset, this.offset + length);
        return slice;
    }
    tryGetAndCopy(length) {
        if (this.remaining < length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadLengthOverflowError.from(this, length));
        const slice = this.bytes.slice(this.offset, this.offset + length);
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(slice);
    }
    /**
     * Read a subarray of the bytes
     * @param length
     * @returns subarray of the bytes
     */
    readOrThrow(length) {
        const subarray = this.getOrThrow(length);
        this.offset += length;
        return subarray;
    }
    /**
     * Read a subarray of the bytes
     * @param length
     * @returns subarray of the bytes
     */
    tryRead(length) {
        return this.tryGet(length).inspectSync(() => this.offset += length);
    }
    readAndCopyOrThrow(length) {
        const subarray = this.getAndCopyOrThrow(length);
        this.offset += length;
        return subarray;
    }
    tryReadAndCopy(length) {
        return this.tryGetAndCopy(length).inspectSync(() => this.offset += length);
    }
    /**
     * Set an array to the bytes
     * @param array array
     */
    setOrThrow(array) {
        if (this.remaining < array.length)
            throw _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteLengthOverflowError.from(this, array.length);
        this.bytes.set(array, this.offset);
    }
    /**
     * Set an array to the bytes
     * @param array array
     */
    trySet(array) {
        if (this.remaining < array.length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteLengthOverflowError.from(this, array.length));
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.bytes.set(array, this.offset));
    }
    /**
     * Write an array to the bytes
     * @param array array
     */
    writeOrThrow(array) {
        this.setOrThrow(array);
        this.offset += array.length;
    }
    /**
     * Write an array to the bytes
     * @param array array
     */
    tryWrite(array) {
        return this.trySet(array).inspectSync(() => this.offset += array.length);
    }
    getUint8OrThrow() {
        return this.bytes[this.offset];
    }
    /**
     * Get a 8-bits unsigned number
     * @returns 8-bits unsigned number
     */
    tryGetUint8() {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.bytes[this.offset]);
    }
    readUint8OrThrow() {
        const x = this.getUint8OrThrow();
        this.offset++;
        return x;
    }
    /**
     * Read a 8-bits unsigned number
     * @returns 8-bits unsigned number
     */
    tryReadUint8() {
        return this.tryGetUint8().inspectSync(() => this.offset++);
    }
    setUint8OrThrow(x) {
        this.bytes[this.offset] = x;
    }
    /**
     * Set a 8-bits unsigned number
     * @param x 8-bits unsigned number
     */
    trySetUint8(x) {
        this.bytes[this.offset] = x;
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok.void();
    }
    writeUint8OrThrow(x) {
        this.setUint8OrThrow(x);
        this.offset++;
    }
    /**
     * Write a 8-bits unsigned number
     * @param x 8-bits unsigned number
     */
    tryWriteUint8(x) {
        return this.trySetUint8(x).inspectSync(() => this.offset++);
    }
    getUint16OrThrow(littleEndian) {
        return this.data.getUint16(this.offset, littleEndian);
    }
    /**
     * Get a 16-bits unsigned number
     * @returns 16-bits unsigned number
     */
    tryGetUint16(littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.getUint16OrThrow(littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadUnknownError(`getUint16 failed`, { cause }));
        }
    }
    readUint16OrThrow(littleEndian) {
        const x = this.getUint16OrThrow(littleEndian);
        this.offset += 2;
        return x;
    }
    /**
     * Read a 16-bits unsigned number
     * @returns 16-bits unsigned number
     */
    tryReadUint16(littleEndian) {
        return this.tryGetUint16(littleEndian).inspectSync(() => this.offset += 2);
    }
    setUint16OrThrow(x, littleEndian) {
        this.data.setUint16(this.offset, x, littleEndian);
    }
    /**
     * Set a 16-bits unsigned number
     * @param x 16-bits unsigned number
     */
    trySetUint16(x, littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.setUint16OrThrow(x, littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError(`setUint16 failed`, { cause }));
        }
    }
    writeUint16OrThrow(x, littleEndian) {
        this.setUint16OrThrow(x, littleEndian);
        this.offset += 2;
    }
    /**
     * Write a 16-bits unsigned number
     * @param x 16-bits unsigned number
     */
    tryWriteUint16(x, littleEndian) {
        return this.trySetUint16(x, littleEndian).inspectSync(() => this.offset += 2);
    }
    getUint24OrThrow(littleEndian) {
        if (littleEndian)
            return this.buffer.readUIntLE(this.offset, 3);
        else
            return this.buffer.readUIntBE(this.offset, 3);
    }
    /**
     * Get a 24-bits unsigned number
     * @returns 24-bits unsigned number
     */
    tryGetUint24(littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.getUint24OrThrow(littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadUnknownError(`getUint24 failed`, { cause }));
        }
    }
    readUint24OrThrow(littleEndian) {
        const x = this.getUint24OrThrow(littleEndian);
        this.offset += 3;
        return x;
    }
    /**
     * Read a 24-bits unsigned number
     * @returns 24-bits unsigned number
     */
    tryReadUint24(littleEndian) {
        return this.tryGetUint24(littleEndian).inspectSync(() => this.offset += 3);
    }
    setUint24OrThrow(x, littleEndian) {
        if (littleEndian)
            this.buffer.writeUIntLE(x, this.offset, 3);
        else
            this.buffer.writeUIntBE(x, this.offset, 3);
    }
    /**
     * Set a 24-bits unsigned number
     * @param x 24-bits unsigned number
     */
    trySetUint24(x, littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.setUint24OrThrow(x, littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError(`setUint24 failed`, { cause }));
        }
    }
    writeUint24OrThrow(x, littleEndian) {
        this.setUint24OrThrow(x, littleEndian);
        this.offset += 3;
    }
    /**
     * Write a 24-bits unsigned number
     * @param x 24-bits unsigned number
     */
    tryWriteUint24(x, littleEndian) {
        return this.trySetUint24(x, littleEndian).inspectSync(() => this.offset += 3);
    }
    getUint32OrThrow(littleEndian) {
        return this.data.getUint32(this.offset, littleEndian);
    }
    /**
     * Get a 32-bits unsigned number
     * @returns 32-bits unsigned number
     */
    tryGetUint32(littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.getUint32OrThrow(littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadUnknownError(`getUint32 failed`, { cause }));
        }
    }
    readUint32OrThrow(littleEndian) {
        const x = this.getUint32OrThrow(littleEndian);
        this.offset += 4;
        return x;
    }
    /**
     * Read a 32-bits unsigned number
     * @returns 32-bits unsigned number
     */
    tryReadUint32(littleEndian) {
        return this.tryGetUint32(littleEndian).inspectSync(() => this.offset += 4);
    }
    setUint32OrThrow(x, littleEndian) {
        this.data.setUint32(this.offset, x, littleEndian);
    }
    /**
     * Set a 32-bits unsigned number
     * @param x 32-bits unsigned number
     */
    trySetUint32(x, littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.setUint32OrThrow(x, littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError(`setUint32 failed`, { cause }));
        }
    }
    writeUint32OrThrow(x, littleEndian) {
        this.setUint32OrThrow(x, littleEndian);
        this.offset += 4;
    }
    /**
     * Write a 32-bits unsigned number
     * @param x 32-bits unsigned number
     */
    tryWriteUint32(x, littleEndian) {
        return this.trySetUint32(x, littleEndian).inspectSync(() => this.offset += 4);
    }
    getUint64OrThrow(littleEndian) {
        return this.data.getBigUint64(this.offset, littleEndian);
    }
    /**
     * Get a 64-bits unsigned number
     * @returns 64-bits unsigned number
     */
    tryGetUint64(littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.getUint64OrThrow(littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadUnknownError(`getBigUint64 failed`, { cause }));
        }
    }
    readUint64OrThrow(littleEndian) {
        const x = this.getUint64OrThrow(littleEndian);
        this.offset += 8;
        return x;
    }
    /**
     * Read a 64-bits unsigned number
     * @returns 64-bits unsigned number
     */
    tryReadUint64(littleEndian) {
        return this.tryGetUint64(littleEndian).inspectSync(() => this.offset += 8);
    }
    setUint64OrThrow(x, littleEndian) {
        this.data.setBigUint64(this.offset, x, littleEndian);
    }
    /**
     * Set a 64-bits unsigned number
     * @param x 64-bits unsigned number
     */
    trySetUint64(x, littleEndian) {
        try {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(this.setUint64OrThrow(x, littleEndian));
        }
        catch (cause) {
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError(`setBigUint64 failed`, { cause }));
        }
    }
    writeUint64OrThrow(x, littleEndian) {
        this.setUint64OrThrow(x, littleEndian);
        this.offset += 8;
    }
    /**
     * Write a 64-bits unsigned number
     * @param x 64-bits unsigned number
     */
    tryWriteUint64(x, littleEndian) {
        return this.trySetUint64(x, littleEndian).inspectSync(() => this.offset += 8);
    }
    getUtf8OrThrow(length) {
        return _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.decoder.decode(this.getOrThrow(length));
    }
    /**
     * Zero-copy get a UTF-8 string
     * @warning It can return a string whose length is between (length) and (length / 3)
     * @param length
     * @returns
     */
    tryGetUtf8(length) {
        return this.tryGet(length).mapSync(x => _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.decoder.decode(x));
    }
    readUtf8OrThrow(length) {
        return _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.decoder.decode(this.readOrThrow(length));
    }
    /**
     * Zero-copy read a UTF-8 string
     * @warning It can return a string whose length is between (length) and (length / 3)
     * @param length
     * @returns
     */
    tryReadUtf8(length) {
        return this.tryRead(length).mapSync(x => _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.decoder.decode(x));
    }
    setUtf8OrThrow(text) {
        const result = _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.encoder.encodeInto(text, this.after);
        if (result.read !== text.length)
            throw new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError();
        return;
    }
    /**
     * Zero-copy set a UTF-8 string
     * @warning It can write between (text.length) and (text.length * 3) bytes
     * @param text
     * @returns
     */
    trySetUtf8(text) {
        const result = _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.encoder.encodeInto(text, this.after);
        if (result.read !== text.length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError());
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok.void();
    }
    writeUtf8OrThrow(text) {
        const result = _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.encoder.encodeInto(text, this.after);
        if (result.read !== text.length)
            throw new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError();
        this.offset += result.written;
    }
    /**
     * Zero-copy write a UTF-8 string
     * @warning It can write between (text.length) and (text.length * 3) bytes
     * @param text
     * @returns
     */
    tryWriteUtf8(text) {
        const result = _libs_utf8_utf8_mjs__WEBPACK_IMPORTED_MODULE_6__.Utf8.encoder.encodeInto(text, this.after);
        if (result.read !== text.length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteUnknownError());
        this.offset += result.written;
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok.void();
    }
    getNullOrThrow() {
        let i = this.offset;
        while (i < this.bytes.length && this.bytes[i] > 0)
            i++;
        if (i === this.bytes.length)
            throw _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadNullOverflowError.from(this);
        return i;
    }
    /**
     * Get the first NULL (byte 0) index relative to the current offset
     */
    tryGetNull() {
        let i = this.offset;
        while (i < this.bytes.length && this.bytes[i] > 0)
            i++;
        if (i === this.bytes.length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorReadNullOverflowError.from(this));
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok(i);
    }
    getNulledOrThrow() {
        return this.getOrThrow(this.getNullOrThrow());
    }
    getNulledAndCopyOrThrow() {
        return this.getAndCopyOrThrow(this.getNullOrThrow());
    }
    /**
     * Get a NULL-terminated subarray
     * @returns subarray of the bytes
     */
    tryGetNulled() {
        return this.tryGetNull().andThenSync(index => this.tryGet(index));
    }
    tryGetNulledAndCopy() {
        return this.tryGetNull().andThenSync(index => this.tryGetAndCopy(index));
    }
    readNulledOrThrow() {
        return this.readOrThrow(this.getNullOrThrow());
    }
    readNulledAndCopyOrThrow() {
        return this.readAndCopyOrThrow(this.getNullOrThrow());
    }
    /**
     * Read a NULL-terminated subarray
     * @returns subarray of the bytes
     */
    tryReadNulled() {
        return this.tryGetNull().andThenSync(index => this.tryRead(index));
    }
    tryReadNulledAndCopy() {
        return this.tryGetNull().andThenSync(index => this.tryReadAndCopy(index));
    }
    setNulledOrThrow(array) {
        const start = this.offset;
        try {
            this.writeNulledOrThrow(array);
        }
        finally {
            this.offset = start;
        }
    }
    /**
     * Set a NULL-terminated array
     * @param array array
     */
    trySetNulled(array) {
        const start = this.offset;
        const result = this.tryWriteNulled(array);
        this.offset = start;
        return result;
    }
    writeNulledOrThrow(array) {
        this.writeOrThrow(array);
        this.writeUint8OrThrow(0);
    }
    /**
     * Write a NULL-terminated array
     * @param array array
     */
    tryWriteNulled(array) {
        return this.tryWrite(array).andThenSync(() => this.tryWriteUint8(0));
    }
    getNulledStringOrThrow(encoding) {
        return _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_2__.Buffers.fromView(this.getNulledOrThrow()).toString(encoding);
    }
    /**
     * Get a NULL-terminated string
     * @param encoding encoding
     * @returns string
     */
    tryGetNulledString(encoding) {
        return this.tryGetNulled().mapSync(subarray => _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_2__.Buffers.fromView(subarray).toString(encoding));
    }
    readNulledStringOrThrow(encoding) {
        return _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_2__.Buffers.fromView(this.readNulledOrThrow()).toString(encoding);
    }
    /**
     * Read a NULL-terminated string
     * @param encoding encoding
     * @returns string
     */
    tryReadNulledString(encoding) {
        return this.tryReadNulled().mapSync(subarray => _libs_buffers_buffers_mjs__WEBPACK_IMPORTED_MODULE_2__.Buffers.fromView(subarray).toString(encoding));
    }
    setNulledStringOrThrow(text, encoding) {
        this.setNulledOrThrow(Buffer.from(text, encoding));
    }
    /**
     * Set a NULL-terminated string
     * @param text string
     * @param encoding encoding
     */
    trySetNulledString(text, encoding) {
        return this.trySetNulled(Buffer.from(text, encoding));
    }
    writeNulledStringOrThrow(text, encoding) {
        this.writeNulledOrThrow(Buffer.from(text, encoding));
    }
    /**
     * Write a NULL-terminated string
     * @param text string
     * @param encoding encoding
     */
    tryWriteNulledString(text, encoding) {
        return this.tryWriteNulled(Buffer.from(text, encoding));
    }
    /**
     * Fill length bytes with value after offset
     * @deprecated Use fillOrThrow instead
     * @param value
     * @param length
     */
    fill(value, length) {
        this.fillOrThrow(value, length);
    }
    /**
     * Fill length bytes with value after offset
     * @param value value to fill
     * @param length length to fill
     */
    fillOrThrow(value, length) {
        if (this.remaining < length)
            throw _errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteLengthOverflowError.from(this, length);
        this.bytes.fill(value, this.offset, this.offset + length);
        this.offset += length;
    }
    /**
     * Fill length bytes with value after offset
     * @param value value to fill
     * @param length length to fill
     */
    tryFill(value, length) {
        if (this.remaining < length)
            return new _hazae41_result__WEBPACK_IMPORTED_MODULE_4__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_3__.CursorWriteLengthOverflowError.from(this, length));
        this.bytes.fill(value, this.offset, this.offset + length);
        this.offset += length;
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok.void();
    }
    *splitOrThrow(length) {
        while (this.remaining >= length)
            yield this.readOrThrow(length);
        if (this.remaining)
            yield this.readOrThrow(this.remaining);
        return;
    }
    /**
     * Split into chunks of maximum length bytes
     * @param length
     * @returns
     */
    *trySplit(length) {
        while (this.remaining >= length) {
            const subarray = this.tryRead(length);
            if (subarray.isErr())
                return subarray;
            else
                yield subarray.get();
        }
        if (this.remaining) {
            const subarray = this.tryRead(this.remaining);
            if (subarray.isErr())
                return subarray;
            else
                yield subarray.get();
        }
        return _hazae41_result__WEBPACK_IMPORTED_MODULE_5__.Ok.void();
    }
}


//# sourceMappingURL=cursor.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/cursor/dist/esm/mods/cursor/errors.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/cursor/dist/esm/mods/cursor/errors.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CursorReadLengthOverflowError: () => (/* binding */ CursorReadLengthOverflowError),
/* harmony export */   CursorReadNullOverflowError: () => (/* binding */ CursorReadNullOverflowError),
/* harmony export */   CursorReadUnknownError: () => (/* binding */ CursorReadUnknownError),
/* harmony export */   CursorWriteLengthOverflowError: () => (/* binding */ CursorWriteLengthOverflowError),
/* harmony export */   CursorWriteUnknownError: () => (/* binding */ CursorWriteUnknownError)
/* harmony export */ });
class CursorReadLengthOverflowError extends Error {
    cursorOffset;
    cursorLength;
    bytesLength;
    #class = CursorReadLengthOverflowError;
    name = this.#class.name;
    constructor(cursorOffset, cursorLength, bytesLength) {
        super(`Overflow reading ${bytesLength} bytes at offset ${cursorOffset}/${cursorLength}`);
        this.cursorOffset = cursorOffset;
        this.cursorLength = cursorLength;
        this.bytesLength = bytesLength;
    }
    static from(cursor, bytesLength) {
        return new CursorReadLengthOverflowError(cursor.offset, cursor.length, bytesLength);
    }
}
class CursorWriteLengthOverflowError extends Error {
    cursorOffset;
    cursorLength;
    bytesLength;
    #class = CursorWriteLengthOverflowError;
    name = this.#class.name;
    constructor(cursorOffset, cursorLength, bytesLength) {
        super(`Overflow writing ${bytesLength} bytes at offset ${cursorOffset}/${cursorLength}`);
        this.cursorOffset = cursorOffset;
        this.cursorLength = cursorLength;
        this.bytesLength = bytesLength;
    }
    static from(cursor, bytesLength) {
        return new CursorWriteLengthOverflowError(cursor.offset, cursor.length, bytesLength);
    }
}
class CursorReadNullOverflowError extends Error {
    cursorOffset;
    cursorLength;
    #class = CursorReadNullOverflowError;
    name = this.#class.name;
    constructor(cursorOffset, cursorLength) {
        super(`Overflow reading null byte at offset ${cursorOffset}/${cursorLength}`);
        this.cursorOffset = cursorOffset;
        this.cursorLength = cursorLength;
    }
    static from(cursor) {
        return new CursorReadNullOverflowError(cursor.offset, cursor.length);
    }
}
class CursorReadUnknownError extends Error {
    #class = CursorReadUnknownError;
    name = this.#class.name;
}
class CursorWriteUnknownError extends Error {
    #class = CursorWriteUnknownError;
    name = this.#class.name;
}


//# sourceMappingURL=errors.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/keccak256/dist/esm/node_modules/tslib/tslib.es6.mjs":
/*!***********************************************************************************!*\
  !*** ./node_modules/@hazae41/keccak256/dist/esm/node_modules/tslib/tslib.es6.mjs ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    function next() {
        while (env.stack.length) {
            var rec = env.stack.pop();
            try {
                var result = rec.dispose && rec.dispose.call(rec.value);
                if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
            }
            catch (e) {
                fail(e);
            }
        }
        if (env.hasError) throw env.error;
    }
    return next();
}


//# sourceMappingURL=tslib.es6.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/adapter.mjs":
/*!*********************************************************************************!*\
  !*** ./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/adapter.mjs ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   set: () => (/* binding */ set)
/* harmony export */ });
let global = undefined;
function get() {
    if (global == null)
        throw new Error("No Keccak256 adapter found");
    return global;
}
function set(value) {
    global = value;
}


//# sourceMappingURL=adapter.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/errors.mjs":
/*!********************************************************************************!*\
  !*** ./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/errors.mjs ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateError: () => (/* binding */ CreateError),
/* harmony export */   FinalizeError: () => (/* binding */ FinalizeError),
/* harmony export */   HashError: () => (/* binding */ HashError),
/* harmony export */   UpdateError: () => (/* binding */ UpdateError)
/* harmony export */ });
var _a, _b, _c, _d;
class CreateError extends Error {
    #class = _a;
    name = this.#class.name;
    constructor(options) {
        super(`Could not create`, options);
    }
    static from(cause) {
        return new _a({ cause });
    }
}
_a = CreateError;
class UpdateError extends Error {
    #class = _b;
    name = this.#class.name;
    constructor(options) {
        super(`Could not update`, options);
    }
    static from(cause) {
        return new _b({ cause });
    }
}
_b = UpdateError;
class FinalizeError extends Error {
    #class = _c;
    name = this.#class.name;
    constructor(options) {
        super(`Could not finalize`, options);
    }
    static from(cause) {
        return new _c({ cause });
    }
}
_c = FinalizeError;
class HashError extends Error {
    #class = _d;
    name = this.#class.name;
    constructor(options) {
        super(`Could not hash`, options);
    }
    static from(cause) {
        return new _d({ cause });
    }
}
_d = HashError;


//# sourceMappingURL=errors.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/morax.mjs":
/*!*******************************************************************************!*\
  !*** ./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/morax.mjs ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromMorax: () => (/* binding */ fromMorax)
/* harmony export */ });
/* harmony import */ var _node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../node_modules/tslib/tslib.es6.mjs */ "./node_modules/@hazae41/keccak256/dist/esm/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _hazae41_box__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/box */ "./node_modules/@hazae41/box/dist/esm/mods/box/box.mjs");
/* harmony import */ var _hazae41_morax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/morax */ "./node_modules/@hazae41/morax/dist/esm/src/node/mods/index.mjs");
/* harmony import */ var _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hazae41/morax */ "./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.mjs");
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/keccak256/dist/esm/src/mods/keccak256/errors.mjs");






async function fromMorax() {
    await _hazae41_morax__WEBPACK_IMPORTED_MODULE_0__.initBundledOnce();
    function getMemory(bytesOrCopiable) {
        if (bytesOrCopiable instanceof _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__.Memory)
            return _hazae41_box__WEBPACK_IMPORTED_MODULE_2__.Box.greedy(bytesOrCopiable);
        if (bytesOrCopiable instanceof Uint8Array)
            return _hazae41_box__WEBPACK_IMPORTED_MODULE_2__.Box.new(new _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__.Memory(bytesOrCopiable));
        return _hazae41_box__WEBPACK_IMPORTED_MODULE_2__.Box.new(new _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__.Memory(bytesOrCopiable.bytes));
    }
    class Hasher {
        inner;
        constructor(inner) {
            this.inner = inner;
        }
        [Symbol.dispose]() {
            this.inner.free();
        }
        static new(inner) {
            return new Hasher(inner);
        }
        static newOrThrow() {
            return new Hasher(new _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__.Keccak256Hasher());
        }
        static tryNew() {
            return _hazae41_result__WEBPACK_IMPORTED_MODULE_3__.Result.runAndDoubleWrapSync(() => {
                return Hasher.newOrThrow();
            }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_4__.CreateError.from);
        }
        updateOrThrow(bytes) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const memory = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__addDisposableResource)(env_1, getMemory(bytes), false);
                this.inner.update(memory.inner);
                return this;
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__disposeResources)(env_1);
            }
        }
        tryUpdate(bytes) {
            const env_2 = { stack: [], error: void 0, hasError: false };
            try {
                const memory = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__addDisposableResource)(env_2, getMemory(bytes), false);
                return _hazae41_result__WEBPACK_IMPORTED_MODULE_3__.Result.runAndDoubleWrapSync(() => {
                    this.inner.update(memory.inner);
                    return this;
                }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_4__.UpdateError.from);
            }
            catch (e_2) {
                env_2.error = e_2;
                env_2.hasError = true;
            }
            finally {
                (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__disposeResources)(env_2);
            }
        }
        finalizeOrThrow() {
            return this.inner.finalize();
        }
        tryFinalize() {
            return _hazae41_result__WEBPACK_IMPORTED_MODULE_3__.Result.runAndDoubleWrapSync(() => {
                return this.inner.finalize();
            }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_4__.FinalizeError.from);
        }
    }
    function hashOrThrow(bytes) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const memory = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__addDisposableResource)(env_3, getMemory(bytes), false);
            const output = _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__.keccak256(memory.inner);
            return output;
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__disposeResources)(env_3);
        }
    }
    function tryHash(bytes) {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
            const memory = (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__addDisposableResource)(env_4, getMemory(bytes), false);
            return _hazae41_result__WEBPACK_IMPORTED_MODULE_3__.Result.runAndDoubleWrapSync(() => {
                return _hazae41_morax__WEBPACK_IMPORTED_MODULE_1__.keccak256(memory.inner);
            }).mapErrSync(_errors_mjs__WEBPACK_IMPORTED_MODULE_4__.HashError.from);
        }
        catch (e_4) {
            env_4.error = e_4;
            env_4.hasError = true;
        }
        finally {
            (0,_node_modules_tslib_tslib_es6_mjs__WEBPACK_IMPORTED_MODULE_5__.__disposeResources)(env_4);
        }
    }
    return { Hasher, hashOrThrow, tryHash };
}


//# sourceMappingURL=morax.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/morax/dist/esm/src/node/mods/index.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/morax/dist/esm/src/node/mods/index.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Crc32Hasher: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.Crc32Hasher),
/* harmony export */   Keccak256Hasher: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.Keccak256Hasher),
/* harmony export */   Memory: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.Memory),
/* harmony export */   Ripemd160Hasher: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.Ripemd160Hasher),
/* harmony export */   Sha1Hasher: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.Sha1Hasher),
/* harmony export */   Sha256Hasher: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.Sha256Hasher),
/* harmony export */   __wbg_init: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.__wbg_init),
/* harmony export */   crc32: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.crc32),
/* harmony export */   initBundledOnce: () => (/* binding */ initBundledOnce),
/* harmony export */   initSync: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.initSync),
/* harmony export */   keccak256: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.keccak256),
/* harmony export */   ripemd160: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.ripemd160),
/* harmony export */   sha1: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.sha1),
/* harmony export */   sha256: () => (/* reexport safe */ _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.sha256)
/* harmony export */ });
/* harmony import */ var _wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../wasm/pkg/morax.mjs */ "./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.mjs");
/* harmony import */ var _wasm_pkg_morax_wasm_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../wasm/pkg/morax.wasm.mjs */ "./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.wasm.mjs");




let output = undefined;
async function initBundledOnce() {
    return output ??= await (0,_wasm_pkg_morax_mjs__WEBPACK_IMPORTED_MODULE_0__.__wbg_init)(_wasm_pkg_morax_wasm_mjs__WEBPACK_IMPORTED_MODULE_1__.data);
}


//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Crc32Hasher: () => (/* binding */ Crc32Hasher),
/* harmony export */   Keccak256Hasher: () => (/* binding */ Keccak256Hasher),
/* harmony export */   Memory: () => (/* binding */ Memory),
/* harmony export */   Ripemd160Hasher: () => (/* binding */ Ripemd160Hasher),
/* harmony export */   Sha1Hasher: () => (/* binding */ Sha1Hasher),
/* harmony export */   Sha256Hasher: () => (/* binding */ Sha256Hasher),
/* harmony export */   __wbg_init: () => (/* binding */ __wbg_init),
/* harmony export */   crc32: () => (/* binding */ crc32),
/* harmony export */   "default": () => (/* binding */ __wbg_init),
/* harmony export */   initSync: () => (/* binding */ initSync),
/* harmony export */   keccak256: () => (/* binding */ keccak256),
/* harmony export */   ripemd160: () => (/* binding */ ripemd160),
/* harmony export */   sha1: () => (/* binding */ sha1),
/* harmony export */   sha256: () => (/* binding */ sha256)
/* harmony export */ });
let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {Memory} data
* @returns {Memory}
*/
function keccak256(data) {
    _assertClass(data, Memory);
    const ret = wasm.keccak256(data.__wbg_ptr);
    return Memory.__wrap(ret);
}

/**
* @param {Memory} data
* @returns {Memory}
*/
function ripemd160(data) {
    _assertClass(data, Memory);
    const ret = wasm.ripemd160(data.__wbg_ptr);
    return Memory.__wrap(ret);
}

/**
* @param {Memory} data
* @returns {Memory}
*/
function sha256(data) {
    _assertClass(data, Memory);
    const ret = wasm.sha256(data.__wbg_ptr);
    return Memory.__wrap(ret);
}

/**
* @param {Memory} data
* @returns {number}
*/
function crc32(data) {
    _assertClass(data, Memory);
    const ret = wasm.crc32(data.__wbg_ptr);
    return ret >>> 0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Memory} data
* @returns {Memory}
*/
function sha1(data) {
    _assertClass(data, Memory);
    const ret = wasm.sha1(data.__wbg_ptr);
    return Memory.__wrap(ret);
}

/**
*/
class Crc32Hasher {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Crc32Hasher.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    [Symbol.dispose]() {
        this.free();
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_crc32hasher_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.crc32hasher_new();
        return Crc32Hasher.__wrap(ret);
    }
    /**
    * @returns {Crc32Hasher}
    */
    clone() {
        const ret = wasm.crc32hasher_clone(this.__wbg_ptr);
        return Crc32Hasher.__wrap(ret);
    }
    /**
    * @param {Memory} data
    */
    update(data) {
        _assertClass(data, Memory);
        wasm.crc32hasher_update(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
    * @returns {number}
    */
    finalize() {
        const ret = wasm.crc32hasher_finalize(this.__wbg_ptr);
        return ret >>> 0;
    }
}
/**
*/
class Keccak256Hasher {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Keccak256Hasher.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    [Symbol.dispose]() {
        this.free();
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keccak256hasher_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.keccak256hasher_new();
        return Keccak256Hasher.__wrap(ret);
    }
    /**
    * @returns {Keccak256Hasher}
    */
    clone() {
        const ret = wasm.keccak256hasher_clone(this.__wbg_ptr);
        return Keccak256Hasher.__wrap(ret);
    }
    /**
    * @param {Memory} data
    */
    update(data) {
        _assertClass(data, Memory);
        wasm.keccak256hasher_update(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
    * @returns {Memory}
    */
    finalize() {
        const ret = wasm.keccak256hasher_finalize(this.__wbg_ptr);
        return Memory.__wrap(ret);
    }
}
/**
*/
class Memory {

    static __wrap(ptr, ptr0, len0) {
        ptr = ptr >>> 0;
        const obj = Object.create(Memory.prototype);
        obj.__wbg_ptr = ptr;
        obj.__wbg_ptr0 = ptr0;
        obj.__wbg_len0 = len0;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    [Symbol.dispose]() {
        this.free();
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_memory_free(ptr);
    }
    /**
    * @param {Uint8Array} inner
    */
    constructor(inner) {
        const ptr0 = passArray8ToWasm0(inner, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.memory_new(ptr0, len0);
        return Memory.__wrap(ret, ptr0, len0);
    }
    /**
    * @returns {number}
    */
    ptr() {
        return this.__wbg_ptr0 ??= wasm.memory_ptr(this.__wbg_ptr);
    }
    /**
    * @returns {number}
    */
    len() {
        return this.__wbg_len0 ??= wasm.memory_len(this.__wbg_ptr);
    }

    freeNextTick() {
        setTimeout(() => this.free(), 0);
        return this;
    }

    get bytes() {
        return getUint8Memory0().subarray(this.ptr(), this.ptr() + this.len());
    }
    
    copyAndDispose() {
        const bytes = this.bytes.slice();
        this.free();
        return bytes;
    }
}
/**
*/
class Ripemd160Hasher {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ripemd160Hasher.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    [Symbol.dispose]() {
        this.free();
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ripemd160hasher_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.ripemd160hasher_new();
        return Ripemd160Hasher.__wrap(ret);
    }
    /**
    * @returns {Ripemd160Hasher}
    */
    clone() {
        const ret = wasm.ripemd160hasher_clone(this.__wbg_ptr);
        return Ripemd160Hasher.__wrap(ret);
    }
    /**
    * @param {Memory} data
    */
    update(data) {
        _assertClass(data, Memory);
        wasm.ripemd160hasher_update(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
    * @returns {Memory}
    */
    finalize() {
        const ret = wasm.ripemd160hasher_finalize(this.__wbg_ptr);
        return Memory.__wrap(ret);
    }
}
/**
*/
class Sha1Hasher {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Sha1Hasher.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    [Symbol.dispose]() {
        this.free();
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sha1hasher_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.sha1hasher_new();
        return Sha1Hasher.__wrap(ret);
    }
    /**
    * @returns {Sha1Hasher}
    */
    clone() {
        const ret = wasm.ripemd160hasher_clone(this.__wbg_ptr);
        return Sha1Hasher.__wrap(ret);
    }
    /**
    * @param {Memory} data
    */
    update(data) {
        _assertClass(data, Memory);
        wasm.sha1hasher_update(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
    * @returns {Memory}
    */
    finalize() {
        const ret = wasm.sha1hasher_finalize(this.__wbg_ptr);
        return Memory.__wrap(ret);
    }
}
/**
*/
class Sha256Hasher {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Sha256Hasher.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    [Symbol.dispose]() {
        this.free();
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sha256hasher_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.sha256hasher_new();
        return Sha256Hasher.__wrap(ret);
    }
    /**
    * @returns {Sha256Hasher}
    */
    clone() {
        const ret = wasm.sha256hasher_clone(this.__wbg_ptr);
        return Sha256Hasher.__wrap(ret);
    }
    /**
    * @param {Memory} data
    */
    update(data) {
        _assertClass(data, Memory);
        wasm.sha256hasher_update(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
    * @returns {Memory}
    */
    finalize() {
        const ret = wasm.sha256hasher_finalize(this.__wbg_ptr);
        return Memory.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        throw new Error();
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}


//# sourceMappingURL=morax.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.wasm.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/morax/dist/esm/wasm/pkg/morax.wasm.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   data: () => (/* binding */ data)
/* harmony export */ });
const data = "data:application/wasm;base64,AGFzbQEAAAABNgpgAn9/AGABfwF/YAJ/fwF/YAN/f38AYAF/AGADf39/AX9gAAF/YAAAYAR/f39/AX9gAX8BfgIYAQN3YmcQX193YmluZGdlbl90aHJvdwAAAzw7AwADAQMEAAACAAABAQEBAAEBAQEAAAAAAAADAQEBAAYGBgYBBAABAAQCAwQIAAIGAQEEAQcHAAMCCQQEBQFwAQQEBQMBABEGCQF/AUGAgMAACwfIBSQGbWVtb3J5AgAJa2VjY2FrMjU2AA8Ta2VjY2FrMjU2aGFzaGVyX25ldwAjFWtlY2NhazI1Nmhhc2hlcl9jbG9uZQAeFmtlY2NhazI1Nmhhc2hlcl91cGRhdGUAFRhrZWNjYWsyNTZoYXNoZXJfZmluYWxpemUAEglyaXBlbWQxNjAADRNyaXBlbWQxNjBoYXNoZXJfbmV3ACAVcmlwZW1kMTYwaGFzaGVyX2Nsb25lAB0WcmlwZW1kMTYwaGFzaGVyX3VwZGF0ZQAYGHJpcGVtZDE2MGhhc2hlcl9maW5hbGl6ZQATBnNoYTI1NgAMEHNoYTI1Nmhhc2hlcl9uZXcAIhJzaGEyNTZoYXNoZXJfY2xvbmUAHBNzaGEyNTZoYXNoZXJfdXBkYXRlABYVc2hhMjU2aGFzaGVyX2ZpbmFsaXplABEFY3JjMzIAJBZfX3diZ19jcmMzMmhhc2hlcl9mcmVlADMPY3JjMzJoYXNoZXJfbmV3ADARY3JjMzJoYXNoZXJfY2xvbmUAJxJjcmMzMmhhc2hlcl91cGRhdGUAJhRjcmMzMmhhc2hlcl9maW5hbGl6ZQAxEV9fd2JnX21lbW9yeV9mcmVlACwKbWVtb3J5X25ldwAvCm1lbW9yeV9wdHIANAptZW1vcnlfbGVuADIEc2hhMQAODnNoYTFoYXNoZXJfbmV3ACERc2hhMWhhc2hlcl91cGRhdGUAGRNzaGExaGFzaGVyX2ZpbmFsaXplABQQc2hhMWhhc2hlcl9jbG9uZQAdGl9fd2JnX3JpcGVtZDE2MGhhc2hlcl9mcmVlADMXX193Ymdfc2hhMjU2aGFzaGVyX2ZyZWUAMxpfX3diZ19rZWNjYWsyNTZoYXNoZXJfZnJlZQAzFV9fd2JnX3NoYTFoYXNoZXJfZnJlZQAzEV9fd2JpbmRnZW5fbWFsbG9jACoJCQEAQQELAwk7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/PSsA2siBXNqIAkgRWogByAIcyADc2ogBUEFd2pBqvz0rANrIgNBBXdqQar89KwDayIHQR53IgZqIAQgT2ogA0EedyIJIAVBHnciBXMgB3NqIAggSGogBCAFcyADc2ogB0EFd2pBqvz0rANrIgNBBXdqQar89KwDayIEQR53IgggA0EedyIHcyAFIE1qIAYgCXMgA3NqIARBBXdqQar89KwDayIFc2ogCSBLaiAGIAdzIARzaiAFQQV3akGq/PSsA2siA0EFd2pBqvz0rANrIgRBHnciBmogCCBMaiADQR53IgkgBUEedyIFcyAEc2ogByBOaiAFIAhzIANzaiAEQQV3akGq/PSsA2siA0EFd2pBqvz0rANrIgRBHnciCCADQR53IgdzID8gRnMgSXMgUHNBAXciDCAFaiAGIAlzIANzaiAEQQV3akGq/PSsA2siBXNqIAkgU2ogBiAHcyAEc2ogBUEFd2pBqvz0rANrIgNBBXdqQar89KwDayIEQR53IgZqIAggVGogA0EedyIJIAVBHnciBXMgBHNqIAcgQCBHcyBNcyAMc0EBdyIHaiAFIAhzIANzaiAEQQV3akGq/PSsA2siA0EFd2pBqvz0rANrIgRBHnciDCADQR53IghzIEUgR3MgUHMgVXNBAXcgBWogBiAJcyADc2ogBEEFd2pBqvz0rANrIgNzaiBBIElzIE5zIAdzQQF3IAlqIAYgCHMgBHNqIANBBXdqQar89KwDayIEQQV3akGq/PSsA2shBSAEIBZqIRYgDCASaiESIANBHncgAmohAiAIIBdqIRcgAUFAayIBIFJHDQALIAAgFzYCECAAIBI2AgwgACACNgIIIAAgFjYCBCAAIAU2AgALxSYCCX8BfgJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAEH1AU8EQCAAQc3/e08NFCAAQQtqIgBBeHEhBUGUi8EAKAIAIghFDQVBACAFayECAn9BACAFQYACSQ0AGkEfIAVB////B0sNABogBUEGIABBCHZnIgBrdkEBcSAAQQF0a0E+agsiB0ECdEH4h8EAaigCACIBDQFBACEADAILAkACQAJAQZCLwQAoAgAiAUEQIABBC2pBeHEgAEELSRsiBUEDdiICdiIAQQNxRQRAIAVBmIvBACgCAE0NCCAADQFBlIvBACgCACIARQ0IIABBACAAa3FoQQJ0QfiHwQBqKAIAIgMoAgRBeHEgBWshASADKAIQIgBFBEAgA0EUaigCACEACyAABEADQCAAKAIEQXhxIAVrIgQgAUkhAiAEIAEgAhshASAAIAMgAhshAyAAKAIQIgIEfyACBSAAQRRqKAIACyIADQALCyADKAIYIQcgAygCDCIAIANHDQIgA0EUQRAgA0EUaiIAKAIAIgQbaigCACICDQNBACEADBkLAkAgAEF/c0EBcSACaiIAQQN0IgNBkInBAGooAgAiAkEIaiIGKAIAIgQgA0GIicEAaiIDRwRAIAQgAzYCDCADIAQ2AggMAQtBkIvBACABQX4gAHdxNgIACyACIABBA3QiAEEDcjYCBCAAIAJqIgAgACgCBEEBcjYCBCAGDwsCQEECIAJBH3EiAnQiBEEAIARrciAAIAJ0cSIAQQAgAGtxaCICQQN0IgNBkInBAGooAgAiAEEIaiIGKAIAIgQgA0GIicEAaiIDRwRAIAQgAzYCDCADIAQ2AggMAQtBkIvBACABQX4gAndxNgIACyAAIAVBA3I2AgQgACAFaiIDIAJBA3QiASAFayICQQFyNgIEIAAgAWogAjYCAEGYi8EAKAIAIgRFDRggBEF4cUGIicEAaiEAQaCLwQAoAgAhAQJ/QZCLwQAoAgAiBUEBIARBA3Z0IgRxBEAgACgCCAwBC0GQi8EAIAQgBXI2AgAgAAshBCAAIAE2AgggBCABNgIMIAEgADYCDCABIAQ2AggMGAsgAygCCCICIAA2AgwgACACNgIIDBYLIAAgA0EQaiAEGyEEA0AgBCEGIAIiAEEUaiICIABBEGogAigCACICGyEEIABBFEEQIAIbaigCACICDQALIAZBADYCAAwVC0EAIQAgBUEZIAdBAXZrQR9xQQAgB0EfRxt0IQQDQAJAIAEoAgRBeHEiBiAFSQ0AIAYgBWsiBiACTw0AIAEhAyAGIgINAEEAIQIgASEADAMLIAFBFGooAgAiBiAAIAYgASAEQR12QQRxakEQaigCACIBRxsgACAGGyEAIARBAXQhBCABDQALCyAAIANyRQRAQQAhAyAIQQIgB3QiAEEAIABrcnEiAEUNAyAAQQAgAGtxaEECdEH4h8EAaigCACEACyAARQ0BCwNAIAAgAyAAKAIEQXhxIgEgBU8gASAFayIBIAJJcSIEGyEDIAEgAiAEGyECIAAoAhAiAQR/IAEFIABBFGooAgALIgANAAsLIANFDQAgBUGYi8EAKAIAIgBNIAIgACAFa09xDQAgAygCGCEHIAMoAgwiACADRw0BIANBFEEQIANBFGoiACgCACIEG2ooAgAiAQ0CQQAhAAwQC0GYi8EAKAIAIgEgBU8NAkGci8EAKAIAIgAgBUsNB0EAIQIgBUGvgARqIgBBEHZAACIBQX9GIgQNDiABQRB0IgZFDQ5BqIvBAEEAIABBgIB8cSAEGyIEQaiLwQAoAgBqIgA2AgBBrIvBAEGsi8EAKAIAIgEgACAAIAFJGzYCAEGki8EAKAIAIgJFDQNB+IjBACEAA0AgACgCACIBIAAoAgQiA2ogBkYNBSAAKAIIIgANAAsMBQsgAygCCCIBIAA2AgwgACABNgIIDA4LIAAgA0EQaiAEGyEEA0AgBCEGIAEiAEEUaiIBIABBEGogASgCACIBGyEEIABBFEEQIAEbaigCACIBDQALIAZBADYCAAwNC0Ggi8EAKAIAIQACQCABIAVrIgJBD00EQEGgi8EAQQA2AgBBmIvBAEEANgIAIAAgAUEDcjYCBCAAIAFqIgEgASgCBEEBcjYCBAwBC0GYi8EAIAI2AgBBoIvBACAAIAVqIgQ2AgAgBCACQQFyNgIEIAAgAWogAjYCACAAIAVBA3I2AgQLIABBCGoPC0G0i8EAKAIAIgBFIAAgBktyDQUMCAsgACgCDCABIAJLcg0AIAIgBkkNAQtBtIvBAEG0i8EAKAIAIgAgBiAAIAZJGzYCACAEIAZqIQFB+IjBACEAAkACQANAIAEgACgCAEcEQCAAKAIIIgANAQwCCwsgACgCDEUNAQtB+IjBACEAA0ACQCACIAAoAgAiAU8EQCABIAAoAgRqIgMgAksNAQsgACgCCCEADAELC0Gki8EAIAY2AgBBnIvBACAEQShrIgA2AgAgBiAAQQFyNgIEIAAgBmpBKDYCBEGwi8EAQYCAgAE2AgAgAiADQSBrQXhxQQhrIgAgACACQRBqSRsiAUEbNgIEQfiIwQApAgAhCiABQRBqQYCJwQApAgA3AgAgASAKNwIIQfyIwQAgBDYCAEH4iMEAIAY2AgBBgInBACABQQhqNgIAQYSJwQBBADYCACABQRxqIQADQCAAQQc2AgAgAEEEaiIAIANJDQALIAEgAkYNCCABIAEoAgRBfnE2AgQgAiABIAJrIgBBAXI2AgQgASAANgIAIABBgAJPBEAgAiAAEBoMCQsgAEF4cUGIicEAaiEBAn9BkIvBACgCACIEQQEgAEEDdnQiAHEEQCABKAIIDAELQZCLwQAgACAEcjYCACABCyEAIAEgAjYCCCAAIAI2AgwgAiABNgIMIAIgADYCCAwICyAAIAY2AgAgACAAKAIEIARqNgIEIAYgBUEDcjYCBCABIAUgBmoiB2shBUGki8EAKAIAIAFHBEAgAUGgi8EAKAIARg0DIAEoAgQiAkEDcUEBRw0FAkAgAkF4cSIJQYACTwRAIAEoAhghCAJAAkAgASABKAIMIgBGBEAgAUEUQRAgAUEUaiIAKAIAIgQbaigCACICDQFBACEADAILIAEoAggiAiAANgIMIAAgAjYCCAwBCyAAIAFBEGogBBshBANAIAQhAyACIgBBFGoiAiAAQRBqIAIoAgAiAhshBCAAQRRBECACG2ooAgAiAg0ACyADQQA2AgALAkAgCEUNAAJAIAEgASgCHEECdEH4h8EAaiICKAIARwRAIAhBEEEUIAgoAhAgAUYbaiAANgIAIABFDQIMAQsgAiAANgIAIAANAEGUi8EAQZSLwQAoAgBBfiABKAIcd3E2AgAMAwsgACAINgIYIAEoAhAiAgRAIAAgAjYCECACIAA2AhgLIAFBFGooAgAiAkUNACAAQRRqIAI2AgAgAiAANgIYCwwBCyABQQxqKAIAIgAgAUEIaigCACIERwRAIAQgADYCDCAAIAQ2AggMAQtBkIvBAEGQi8EAKAIAQX4gAkEDdndxNgIACyAFIAlqIQUgASAJaiIBKAIEIQIMBQtBpIvBACAHNgIAQZyLwQBBnIvBACgCACAFaiIANgIAIAcgAEEBcjYCBAwFCyAAIAMgBGo2AgRBpIvBAEGki8EAKAIAIgBBD2pBeHEiAUEIazYCAEGci8EAQZyLwQAoAgAgBGoiAiAAIAFrakEIaiIENgIAIAFBBGsgBEEBcjYCACAAIAJqQSg2AgRBsIvBAEGAgIABNgIADAYLQZyLwQAgACAFayIBNgIAQaSLwQBBpIvBACgCACIAIAVqIgI2AgAgAiABQQFyNgIEIAAgBUEDcjYCBCAAQQhqIQIMBgtBoIvBACAHNgIAQZiLwQBBmIvBACgCACAFaiIANgIAIAcgAEEBcjYCBCAAIAdqIAA2AgAMAgtBtIvBACAGNgIADAILIAEgAkF+cTYCBCAHIAVBAXI2AgQgBSAHaiAFNgIAIAVBgAJPBEAgByAFEBoMAQsgBUF4cUGIicEAaiEAAn9BkIvBACgCACIBQQEgBUEDdnQiAnEEQCAAKAIIDAELQZCLwQAgASACcjYCACAACyEBIAAgBzYCCCABIAc2AgwgByAANgIMIAcgATYCCAsgBkEIag8LQbiLwQBB/x82AgBB/IjBACAENgIAQfiIwQAgBjYCAEGUicEAQYiJwQA2AgBBnInBAEGQicEANgIAQZCJwQBBiInBADYCAEGkicEAQZiJwQA2AgBBmInBAEGQicEANgIAQayJwQBBoInBADYCAEGgicEAQZiJwQA2AgBBtInBAEGoicEANgIAQaiJwQBBoInBADYCAEG8icEAQbCJwQA2AgBBsInBAEGoicEANgIAQcSJwQBBuInBADYCAEG4icEAQbCJwQA2AgBBzInBAEHAicEANgIAQcCJwQBBuInBADYCAEGEicEAQQA2AgBB1InBAEHIicEANgIAQciJwQBBwInBADYCAEHQicEAQciJwQA2AgBB3InBAEHQicEANgIAQdiJwQBB0InBADYCAEHkicEAQdiJwQA2AgBB4InBAEHYicEANgIAQeyJwQBB4InBADYCAEHoicEAQeCJwQA2AgBB9InBAEHoicEANgIAQfCJwQBB6InBADYCAEH8icEAQfCJwQA2AgBB+InBAEHwicEANgIAQYSKwQBB+InBADYCAEGAisEAQfiJwQA2AgBBjIrBAEGAisEANgIAQYiKwQBBgIrBADYCAEGUisEAQYiKwQA2AgBBnIrBAEGQisEANgIAQZCKwQBBiIrBADYCAEGkisEAQZiKwQA2AgBBmIrBAEGQisEANgIAQayKwQBBoIrBADYCAEGgisEAQZiKwQA2AgBBtIrBAEGoisEANgIAQaiKwQBBoIrBADYCAEG8isEAQbCKwQA2AgBBsIrBAEGoisEANgIAQcSKwQBBuIrBADYCAEG4isEAQbCKwQA2AgBBzIrBAEHAisEANgIAQcCKwQBBuIrBADYCAEHUisEAQciKwQA2AgBByIrBAEHAisEANgIAQdyKwQBB0IrBADYCAEHQisEAQciKwQA2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BRABIAQgAyACQUBxaiACQT9xIgIQOAsgASACOgBoIAFBkAFqIgQgAUHwABA4IAFBmAJqIgVCADcDACABQZACaiICQgA3AwAgAUGIAmoiA0IANwMAIAFCADcDgAIgBCABQYACahAKIAFBiAFqIgQgBSkDADcDACABQYABaiIFIAIpAwA3AwAgAUH4AGoiAiADKQMANwMAIAEgASkDgAI3A3BBwYvBAC0AABpBIBAEIgNFDQIgAyABKQNwNwAAIANBGGogBCkDADcAACADQRBqIAUpAwA3AAAgA0EIaiACKQMANwAAIAAgACgCAEEBazYCAEHBi8EALQAAGkEQEAQiAEUNAiAAQqCAgICABDcCCCAAIAM2AgQgAEEANgIAIAFBoAJqJAAgAA8LEDUACxA2AAsAC6EEAQd/IwBBgAJrIgEkAAJAAkAgAARAIAAoAgAiAkF/Rg0BIAAgAkEBajYCACABQdgAakIANwMAIAFB0ABqQgA3AwAgAUHIAGpCADcDACABQUBrQgA3AwAgAUE4akIANwMAIAFBMGpCADcDACABQShqQgA3AwAgAUEQakGghcEAKQMANwMAIAFBGGpBqIXBACgCADYCACABQeAAakEAOgAAIAFCADcDICABQgA3AwAgAUGYhcEAKQMANwMIIAFBIGohBCAAKAIEIQMCQCAAQQxqKAIAIgJBP00EQCAEIAMgAhA4DAELIAFBCGohBiABIAJBBnatNwMAIAJBP3EhBSADIAJBQHEiAmohBwNAIAYgAxACIANBQGshAyACQUBqIgINAAsgBCAHIAUQOCAFIQILIAEgAjoAYCABQYABaiIDIAFB6AAQOCABQfgBaiICQQA2AgAgAUHwAWoiBUIANwMAIAFCADcD6AEgAyABQegBahAXIAFB+ABqIgMgAigCADYCACABQfAAaiIEIAUpAwA3AwAgASABKQPoATcDaEHBi8EALQAAGkEUEAQiAkUNAiACIAEpA2g3AAAgAkEQaiADKAIANgAAIAJBCGogBCkDADcAACAAIAAoAgBBAWs2AgBBwYvBAC0AABpBEBAEIgBFDQIgAEKUgICAwAI3AgggACACNgIEIABBADYCACABQYACaiQAIAAPCxA1AAsQNgALAAv+AwEFfyMAQYACayIBJAACQAJAIAAEQCAAKAIAIgJBf0YNASAAIAJBAWo2AgAgAUHYAGpCADcDACABQdAAakIANwMAIAFByABqQgA3AwAgAUFAa0IANwMAIAFBOGpCADcDACABQTBqQgA3AwAgAUEoakIANwMAIAFB4ABqQQA6AAAgAUIANwMgIAFB8MPLnnw2AhggAUL+uevF6Y6VmRA3AxAgAUKBxpS6lvHq5m83AwggAUIANwMAIAFBIGohAyAAKAIEIQQCQCAAQQxqKAIAIgJBP00EQCADIAQgAhA4DAELIAEgAkEGdiIFrTcDACABQQhqIAQgBRADIAMgBCACQUBxaiACQT9xIgIQOAsgASACOgBgIAFBgAFqIgMgAUHoABA4IAFB+AFqIgJBADYCACABQfABaiIEQgA3AwAgAUIANwPoASADIAFB6AFqEAsgAUH4AGoiAyACKAIANgIAIAFB8ABqIgUgBCkDADcDACABIAEpA+gBNwNoQcGLwQAtAAAaQRQQBCICRQ0CIAIgASkDaDcAACACQRBqIAMoAgA2AAAgAkEIaiAFKQMANwAAIAAgACgCAEEBazYCAEHBi8EALQAAGkEQEAQiAEUNAiAAQpSAgIDAAjcCCCAAIAI2AgQgAEEANgIAIAFBgAJqJAAgAA8LEDUACxA2AAsAC9gDAQV/IwBBgAZrIgQkAAJAAkACQCAABEAgACgCACIDQX9GDQEgACADQQFqNgIAIARByAEQOSIBQdABakGIARA5IQQgAUHYAmpBADoAACABQRg2AsgBIABBDGooAgAhAiAAKAIEIQUgASABNgKAAwJAIAJBhwFNBEAgBCAFIAIQOAwBCyABQYADaiAFIAJBiAFuIgMQGyACIANBiAFsIgNrIgJBiQFPDQMgBCADIAVqIAIQOAsgASACOgDYAiABQYADaiIFIAFB4AIQOCABQfgFaiIEQgA3AwAgAUHwBWoiA0IANwMAIAFB6AVqIgJCADcDACABQgA3A+AFIAUgAUHgBWoQECABQfgCaiIFIAQpAwA3AwAgAUHwAmoiBCADKQMANwMAIAFB6AJqIgMgAikDADcDACABIAEpA+AFNwPgAkHBi8EALQAAGkEgEAQiAkUNAyACIAEpA+ACNwAAIAJBGGogBSkDADcAACACQRBqIAQpAwA3AAAgAkEIaiADKQMANwAAIAAgACgCAEEBazYCAEHBi8EALQAAGkEQEAQiAEUNAyAAQqCAgICABDcCCCAAIAI2AgQgAEEANgIAIAFBgAZqJAAgAA8LEDUACxA2AAsgAhAlAAsAC8UDAQJ/IABB2AJqIgItAAAiAyAAQdABampBiAEgA2sQOSACQQA6AABBAToAACAAQdcCaiICIAItAABBgAFyOgAAIAAgACkDACAAKQDQAYU3AwAgACAAKQMIIABB2AFqKQAAhTcDCCAAIAApAxAgAEHgAWopAACFNwMQIAAgACkDGCAAQegBaikAAIU3AxggACAAKQMgIABB8AFqKQAAhTcDICAAIAApAyggAEH4AWopAACFNwMoIAAgACkDMCAAQYACaikAAIU3AzAgACAAKQM4IABBiAJqKQAAhTcDOCAAIAApA0AgAEGQAmopAACFNwNAIAAgACkDSCAAQZgCaikAAIU3A0ggACAAKQNQIABBoAJqKQAAhTcDUCAAIAApA1ggAEGoAmopAACFNwNYIAAgACkDYCAAQbACaikAAIU3A2AgACAAKQNoIABBuAJqKQAAhTcDaCAAIAApA3AgAEHAAmopAACFNwNwIAAgACkDeCAAQcgCaikAAIU3A3ggACAAKQOAASAAQdACaikAAIU3A4ABIAAgACgCyAEQByABIAApAwA3AAAgASAAKQMINwAIIAEgACkDEDcAECABIAApAxg3ABgLmQMCBX8BfiMAQbABayIBJAACQAJAIAAEQCAAKAIAIgNBf0YNASAAIANBAWo2AgAgAEEoaikDACEGIAFByABqIABBMGoQHyABQShqIABBEGopAwA3AwAgAUEwaiAAQRhqKQMANwMAIAFBOGogAEEgaikDADcDACABQYgBaiAALQBwOgAAIAEgBjcDQCABIAApAwg3AyAgAUGoAWoiBEIANwMAIAFBoAFqIgNCADcDACABQZgBaiICQgA3AwAgAUIANwOQASABQSBqIAFBkAFqEAogAUEYaiIFIAQpAwA3AwAgAUEQaiIEIAMpAwA3AwAgAUEIaiIDIAIpAwA3AwAgASABKQOQATcDAEHBi8EALQAAGkEgEAQiAkUNAiACIAEpAwA3AAAgAkEYaiAFKQMANwAAIAJBEGogBCkDADcAACACQQhqIAMpAwA3AAAgACAAKAIAQQFrNgIAQcGLwQAtAAAaQRAQBCIARQ0CIABCoICAgIAENwIIIAAgAjYCBCAAQQA2AgAgAUGwAWokACAADwsQNQALEDYACwAL9gIBBX8jAEGgA2siASQAAkACQCAABEAgACgCACICQX9GDQEgACACQQFqNgIAIABB0AFqKAIAIQQgAUHwAWogAEHYAWoQKCAAQeACai0AACECIAFBIGoiBSAAQQhqQcgBEDggAUH4AmogAjoAACABIAQ2AugBIAFBmANqIgRCADcDACABQZADaiICQgA3AwAgAUGIA2oiA0IANwMAIAFCADcDgAMgBSABQYADahAQIAFBGGoiBSAEKQMANwMAIAFBEGoiBCACKQMANwMAIAFBCGoiAiADKQMANwMAIAEgASkDgAM3AwBBwYvBAC0AABpBIBAEIgNFDQIgAyABKQMANwAAIANBGGogBSkDADcAACADQRBqIAQpAwA3AAAgA0EIaiACKQMANwAAIAAgACgCAEEBazYCAEHBi8EALQAAGkEQEAQiAEUNAiAAQqCAgICABDcCCCAAIAM2AgQgAEEANgIAIAFBoANqJAAgAA8LEDUACxA2AAsAC+MCAgR/AX4jAEGgAWsiASQAAkACQCAABEAgACgCACIDQX9GDQEgACADQQFqNgIAIAFBOGogAEEgaigCADYCACABQTBqIABBGGopAwA3AwAgASAAQRBqKQMANwMoIAApAwghBSABQUBrIABBKGoQHyABQYABaiAAQegAai0AADoAACABIAU3AyAgAUGYAWoiA0EANgIAIAFBkAFqIgJCADcDACABQgA3A4gBIAFBIGogAUGIAWoQFyABQRhqIgQgAygCADYCACABQRBqIgMgAikDADcDACABIAEpA4gBNwMIQcGLwQAtAAAaQRQQBCICRQ0CIAIgASkDCDcAACACQRBqIAQoAgA2AAAgAkEIaiADKQMANwAAIAAgACgCAEEBazYCAEHBi8EALQAAGkEQEAQiAEUNAiAAQpSAgIDAAjcCCCAAIAI2AgQgAEEANgIAIAFBoAFqJAAgAA8LEDUACxA2AAsAC+MCAgR/AX4jAEGgAWsiASQAAkACQCAABEAgACgCACIDQX9GDQEgACADQQFqNgIAIAFBOGogAEEgaigCADYCACABQTBqIABBGGopAwA3AwAgASAAQRBqKQMANwMoIAApAwghBSABQUBrIABBKGoQHyABQYABaiAAQegAai0AADoAACABIAU3AyAgAUGYAWoiA0EANgIAIAFBkAFqIgJCADcDACABQgA3A4gBIAFBIGogAUGIAWoQCyABQRhqIgQgAygCADYCACABQRBqIgMgAikDADcDACABIAEpA4gBNwMIQcGLwQAtAAAaQRQQBCICRQ0CIAIgASkDCDcAACACQRBqIAQoAgA2AAAgAkEIaiADKQMANwAAIAAgACgCAEEBazYCAEHBi8EALQAAGkEQEAQiAEUNAiAAQpSAgIDAAjcCCCAAIAI2AgQgAEEANgIAIAFBoAFqJAAgAA8LEDUACxA2AAsAC7ECAQd/IwBBEGsiBiQAAkACQAJAAkACQAJAIABFDQAgACgCAA0BIABBfzYCACABRQ0AIAEoAgAiAkF/Rg0BIAEgAkEBajYCACABQQRqKAIAIQQgAUEMaigCACECIAYgAEEIajYCDCAAQdgBaiEHQYgBIABB4AJqLQAAIgNrIgUgAk0EQCADDQMMBAsgAyAHaiAEIAIQOCACIANqIQMMBAsQNQALEDYACyADIAdqIAQgBRA4IAZBDGogB0EBEBsgBCAFaiEEIAIgBWshAgsgAiACQYgBbiIFQYgBbCIIayEDIAJBiAFPBEAgBkEMaiAEIAUQGwsgA0GJAU8NASAHIAQgCGogAxA4CyAAIAM6AOACIAEgASgCAEEBazYCACAAQQA2AgAgBkEQaiQADwsgAxAlAAuyAgEHfwJAAkACQAJAAkAgAEUNACAAKAIADQEgAEF/NgIAIAFFDQAgASgCACICQX9GDQEgASACQQFqNgIAIABBMGohBiABQQRqKAIAIQQgAUEMaigCACICQcAAIABB8ABqLQAAIgNrIgVPBEAgAEEIaiEHIAMNAwwECyADIAZqIAQgAhA4IAIgA2ohAwwECxA1AAsQNgALIAMgBmogBCAFEDggAEEoaiIDIAMpAwBCAXw3AwAgByAGQQEQASAEIAVqIQQgAiAFayECCyACQT9xIQMgBCACQUBxaiEFIAJBwABJBEAgBiAFIAMQOAwBCyAAQShqIgggCCkDACACQQZ2IgKtfDcDACAHIAQgAhABIAYgBSADEDgLIAAgAzoAcCABIAEoAgBBAWs2AgAgAEEANgIAC68CAgV/AX4jAEHgAGsiAiQAIAApAwAhByAAQSBqIgQgAEHgAGotAAAiA2oiBUGAAToAACACQRhqIABBGGooAgA2AgAgAkEQaiAAQRBqKQIANwMAIAIgACkCCDcDCCADQT9zIgYEQCAFQQFqIAYQORoLIAOtQgOGIAdCCYaEIQcCQCADQThzQQhPBEAgAEHYAGogBzcAACACQQhqIAQQAgwBCyACQQhqIgMgBBACIAJB0ABqQgA3AwAgAkHIAGpCADcDACACQUBrQgA3AwAgAkE4akIANwMAIAJBMGpCADcDACACQShqQgA3AwAgAkIANwMgIAIgBzcDWCADIAJBIGoQAgsgAEEAOgBgIAEgAigCCDYAACABIAIpAgw3AAQgASACKQIUNwAMIAJB4ABqJAALsAIBBn8CQAJAAkACQAJAIABFDQAgACgCAA0BIABBfzYCACABRQ0AIAEoAgAiAkF/Rg0BIAEgAkEBajYCACAAQShqIQYgAUEEaigCACECIAFBDGooAgAiA0HAACAAQegAai0AACIEayIFTwRAIAQNAwwECyAEIAZqIAIgAxA4IAMgBGohBAwECxA1AAsQNgALIAQgBmogAiAFEDggACAAKQMIQgF8NwMIIABBEGogBhACIAMgBWshAyACIAVqIQILIANBP3EhBCACIANBQHEiBWohByADQcAATwRAIAAgACkDCCADQQZ2rXw3AwggAEEQaiEDA0AgAyACEAIgAkFAayECIAVBQGoiBQ0ACwsgBiAHIAQQOAsgACAEOgBoIAEgASgCAEEBazYCACAAQQA2AgALpwIBBX8CQAJAAkACQAJAIABFDQAgACgCAA0BIABBfzYCACABRQ0AIAEoAgAiAkF/Rg0BIAEgAkEBajYCACAAQShqIQYgAUEEaigCACEEIAFBDGooAgAiAkHAACAAQegAai0AACIDayIFTwRAIAMNAwwECyADIAZqIAQgAhA4IAIgA2ohAwwECxA1AAsQNgALIAMgBmogBCAFEDggACAAKQMIQgF8NwMIIABBEGogBkEBEAMgBCAFaiEEIAIgBWshAgsgAkE/cSEDIAQgAkFAcWohBSACQcAASQRAIAYgBSADEDgMAQsgACAAKQMIIAJBBnYiAq18NwMIIABBEGogBCACEAMgBiAFIAMQOAsgACADOgBoIAEgASgCAEEBazYCACAAQQA2AgALsAIBBH9BHyECIABCADcCECABQf///wdNBEAgAUEGIAFBCHZnIgNrdkEBcSADQQF0a0E+aiECCyAAIAI2AhwgAkECdEH4h8EAaiEEAkACQAJAAkBBlIvBACgCACIFQQEgAnQiA3EEQCAEKAIAIgMoAgRBeHEgAUcNASADIQIMAgtBlIvBACADIAVyNgIAIAQgADYCACAAIAQ2AhgMAwsgAUEZIAJBAXZrQR9xQQAgAkEfRxt0IQQDQCADIARBHXZBBHFqQRBqIgUoAgAiAkUNAiAEQQF0IQQgAiEDIAIoAgRBeHEgAUcNAAsLIAIoAggiASAANgIMIAIgADYCCCAAQQA2AhggACACNgIMIAAgATYCCA8LIAUgADYCACAAIAM2AhgLIAAgADYCDCAAIAA2AggLxgIAIAIEQCABIAJBiAFsaiECIAAoAgAhAANAIAAgACkDACABKQAAhTcDACAAIAApAwggASkACIU3AwggACAAKQMQIAEpABCFNwMQIAAgACkDGCABKQAYhTcDGCAAIAApAyAgASkAIIU3AyAgACAAKQMoIAEpACiFNwMoIAAgACkDMCABKQAwhTcDMCAAIAApAzggASkAOIU3AzggACAAKQNAIAEpAECFNwNAIAAgACkDSCABKQBIhTcDSCAAIAApA1AgASkAUIU3A1AgACAAKQNYIAEpAFiFNwNYIAAgACkDYCABKQBghTcDYCAAIAApA2ggASkAaIU3A2ggACAAKQNwIAEpAHCFNwNwIAAgACkDeCABKQB4hTcDeCAAIAApA4ABIAEpAIABhTcDgAEgACAAKALIARAHIAFBiAFqIgEgAkcNAAsLC4ACAgJ/AX4jAEHwAWsiASQAAkACQCAABEAgACgCACICQX9GDQEgACACQQFqNgIAIABBKGopAwAhAyABQaABaiAAQTBqEB8gAUGAAWogAEEQaikDADcDACABQYgBaiAAQRhqKQMANwMAIAFBkAFqIABBIGopAwA3AwAgASADNwOYASABIAApAwg3A3ggASAALQBwOgDgASABQQhqIgIgAUH4AGpB8AAQOCAAIAAoAgBBAWs2AgAgAUH8AGogAkHwABA4QcGLwQAtAAAaQfgAEAQiAEUNAiAAQQA2AgAgAEEEaiABQfgAakH0ABA4IAFB8AFqJAAgAA8LEDUACxA2AAsAC/IBAgJ/AX4jAEHgAWsiASQAAkACQCAABEAgACgCACICQX9GDQEgACACQQFqNgIAIAFBiAFqIABBIGooAgA2AgAgAUGAAWogAEEYaikDADcDACABIABBEGopAwA3A3ggACkDCCEDIAFBkAFqIABBKGoQHyABIAM3A3AgASAAQegAai0AADoA0AEgAUEIaiICIAFB8ABqQegAEDggACAAKAIAQQFrNgIAIAFB9ABqIAJB6AAQOEHBi8EALQAAGkHwABAEIgBFDQIgAEEANgIAIABBBGogAUHwAGpB7AAQOCABQeABaiQAIAAPCxA1AAsQNgALAAvZAQEEfyMAQdAFayIBJAACQAJAIAAEQCAAKAIAIgJBf0YNASAAIAJBAWo2AgAgAEHQAWooAgAhAiABQbgEaiAAQdgBahAoIABB4AJqLQAAIQMgAUHoAmoiBCAAQQhqQcgBEDggASADOgDABSABIAI2ArAEIAFBCGoiAiAEQeACEDggACAAKAIAQQFrNgIAIAFB7AJqIAJB4AIQOEHBi8EALQAAGkHoAhAEIgBFDQIgAEEANgIAIABBBGogAUHoAmpB5AIQOCABQdAFaiQAIAAPCxA1AAsQNgALAAu8AQECfyMAQdAAayICQQA2AkhBBCEDA0AgAiADakEEaiABIANqQQRrKAAANgIAIAIgAzYCSCADQQRqIgNBxABHDQALIAAgAikDCDcAACAAQThqIAJBQGspAwA3AAAgAEEwaiACQThqKQMANwAAIABBKGogAkEwaikDADcAACAAQSBqIAJBKGopAwA3AAAgAEEYaiACQSBqKQMANwAAIABBEGogAkEYaikDADcAACAAQQhqIAJBEGopAwA3AAAL3QEBAn8jAEGQAWsiACQAIABBxABqQgA3AgAgAEE8akIANwIAIABBNGpCADcCACAAQSxqQgA3AgAgAEEkakIANwIAIABBHGpCADcCACAAQRRqQgA3AgAgAEIANwIMIABBzABqIABBCGpBxAAQOEHBi8EALQAAGkHwABAEIgFFBEAACyABQgA3AgggAUEANgIAIAFBmIXBACkDADcCECABQRhqQaCFwQApAwA3AgAgAUEgakGohcEAKAIANgIAIAFBJGogAEHMAGpBxAAQOCABQQA6AGggAEGQAWokACABC9kBAQJ/IwBBkAFrIgAkACAAQcQAakIANwIAIABBPGpCADcCACAAQTRqQgA3AgAgAEEsakIANwIAIABBJGpCADcCACAAQRxqQgA3AgAgAEEUakIANwIAIABCADcCDCAAQcwAaiAAQQhqQcQAEDhBwYvBAC0AABpB8AAQBCIBRQRAAAsgAUHww8uefDYCICABQv6568XpjpWZEDcCGCABQoHGlLqW8ermbzcCECABQgA3AgggAUEANgIAIAFBJGogAEHMAGpBxAAQOCABQQA6AGggAEGQAWokACABC8QBAQJ/IwBBMGsiACQAQcGLwQAtAAAaIABBKGpByIXBACkDADcCACAAQSBqQcCFwQApAwA3AgAgAEEYakG4hcEAKQMANwIAIABBsIXBACkDADcCEEH4ABAEIgFFBEAACyABQQA2AgAgASAAKQIMNwIEIAFBDGogAEEUaikCADcCACABQRRqIABBHGopAgA3AgAgAUEcaiAAQSRqKQIANwIAIAFBJGogAEEsaigCADYCACABQShqQckAEDkaIABBMGokACABC4UBAQJ/IwBB4AJrIgEkACABQZgBakGIARA5IAFBCGogAUGUAWpBjAEQOEHIARA5GkHBi8EALQAAGkHoAhAEIgBFBEAACyAAQQA2AgAgAEEEaiABQZQBakHMARA4IABBGDYC0AEgAEHUAWogAUEIakGMARA4IABBADoA4AIgAUHgAmokACAAC28BBH8jAEEQayIBJAACQCAABEAgACgCACIDQX9GDQEgACADQQFqNgIAIABBBGooAgAhAiAAQQxqKAIAIQQgAUEANgIIIAFCADcDACABIAIgBBAFIAEoAgggACADNgIAIAFBEGokAA8LEDUACxA2AAtwAQF/IwBBMGsiASQAIAEgADYCACABQYgBNgIEIAFBFGpCAjcCACABQSxqQQE2AgAgAUECNgIMIAFBnILAADYCCCABQQE2AiQgASABQSBqNgIQIAEgAUEEajYCKCABIAE2AiAgAUEIakGAgMAAEC4AC2oBAX8CQAJAIABFDQAgACgCAA0BIABBfzYCACABRQ0AIAEoAgAiAkF/Rg0BIAEgAkEBajYCACAAQQhqIAFBBGooAgAgAUEMaigCABAFIAEgASgCAEEBazYCACAAQQA2AgAPCxA1AAsQNgALYAIBfwF+AkACQCAABEAgACgCAEF/Rg0BQcGLwQAtAAAaIABBEGooAgAhASAAQQhqKQMAIQJBGBAEIgBFDQIgACABNgIQIAAgAjcDCCAAQQA2AgAgAA8LEDUACxA2AAsAC1kBAn8jAEGQAWsiAiQAIAJBADYCiAFBBCEDA0AgAiAD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3aFnRmlpTtf4AeCiAPgdM5GQs8ElWJpQtDA0iZbCSxgHquXqs2LMeyIKYg7a85+fS5sxbf9TGPxuO7bGCdE4V5i5lqUscb80vRkRQUXg7NDUiEIiYEBrs/EoxReo5a2GOY0DdI1FKuUcLYSQ5NR5AXW81/PBdP5iUBxQWDf23smmnnA7ElZZqoM+9997xwpO6q+kvF5njS3PDyMOG4Nyn4rr3G0+I/X8r0tbiVeyphjG2gjqchIhe+N6j0GEkAHQFfivIqEwhrMwWCjGyKHVV1nJe6XtAVI0fGn8kCWklAG0zDrzAAQTYpFsvRdplUCG+P3udEw1x+XdXWnfurfnTivfSbyfF2AtDn/OWPaGM8ln7p070ya0qkJOGnNgvGXi8dTLEEUc4oHUdEz0LI2xZb3lH5cJLTYGmEWYPP+vFq1ux7hf2g+RzktnP7uznsIqIvZs2JY+RUkHVuvtXpuDfM/zLY57OwQf6lOqahKqV/uDwvkJNwrQmKZifqLBiPAzUOBeweQod1B1QNkljbkktBzRikaoGaPXOXENQSByb3VuZF9jb3VudCBncmVhdGVyIHRoYW4gS0VDQ0FLX0ZfUk9VTkRfQ09VTlQgaXMgbm90IHN1cHBvcnRlZCEvdXNyL2xvY2FsL2NhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9rZWNjYWstMC4xLjQvc3JjL2xpYi5ycwBtQRAAVgAAAOsAAAAJAAAAAAAAAAEAAAAAAAAAgoAAAAAAAACKgAAAAAAAgACAAIAAAACAi4AAAAAAAAABAACAAAAAAIGAAIAAAACACYAAAAAAAICKAAAAAAAAAIgAAAAAAAAACYAAgAAAAAAKAACAAAAAAIuAAIAAAAAAiwAAAAAAAICJgAAAAAAAgAOAAAAAAACAAoAAAAAAAICAAAAAAAAAgAqAAAAAAAAACgAAgAAAAICBgACAAAAAgICAAAAAAACAAQAAgAAAAAAIgACAAAAAgAEjRWeJq83v/ty6mHZUMhDw4dLDAAAAAGfmCWqFrme7cvNuPDr1T6V/Ug5RjGgFm6vZgx8ZzeBbL3Vzci9sb2NhbC9jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYmxvY2stYnVmZmVyLTAuMTAuMy9zcmMvbGliLnJzY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZWxpYnJhcnkvc3RkL3NyYy9wYW5pY2tpbmcucnNYQxAAHAAAAFACAAAeAAAAbnVsbCBwb2ludGVyIHBhc3NlZCB0byBydXN0cmVjdXJzaXZlIHVzZSBvZiBhbiBvYmplY3QgZGV0ZWN0ZWQgd2hpY2ggd291bGQgbGVhZCB0byB1bnNhZmUgYWxpYXNpbmcgaW4gcnVzdAB7CXByb2R1Y2VycwIIbGFuZ3VhZ2UBBFJ1c3QADHByb2Nlc3NlZC1ieQMFcnVzdGMdMS43MS4wICg4ZWRlM2FhZTIgMjAyMy0wNy0xMikGd2FscnVzBjAuMTkuMAx3YXNtLWJpbmRnZW4SMC4yLjg3IChmMGE4YWUzYjkpACwPdGFyZ2V0X2ZlYXR1cmVzAisPbXV0YWJsZS1nbG9iYWxzKwhzaWduLWV4dA==";


//# sourceMappingURL=morax.wasm.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/option/dist/esm/mods/option/none.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@hazae41/option/dist/esm/mods/option/none.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   None: () => (/* binding */ None),
/* harmony export */   NoneError: () => (/* binding */ NoneError)
/* harmony export */ });
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");


class NoneError extends Error {
    constructor() {
        super(`Option is a None`);
    }
}
class None {
    inner;
    /**
     * An empty value
     */
    constructor(inner = undefined) {
        this.inner = inner;
    }
    /**
     * Create a `None`
     * @returns `None`
     */
    static new() {
        return new None();
    }
    static from(init) {
        return new None();
    }
    /**
     * Type guard for `Some`
     * @returns `true` if `Some`, `false` if `None`
     */
    isSome() {
        return false;
    }
    /**
     * Returns `true` if the option is a `Some` and the value inside of it matches a predicate
     * @param somePredicate
     * @returns `true` if `Some` and `await somePredicate(this.inner)`, `None` otherwise
     */
    async isSomeAnd(somePredicate) {
        return false;
    }
    /**
     * Returns `true` if the option is a `Some` and the value inside of it matches a predicate
     * @param somePredicate
     * @returns `true` if `Some` and `somePredicate(this.inner)`, `None` otherwise
     */
    isSomeAndSync(somePredicate) {
        return false;
    }
    /**
     * Type guard for `None`
     * @returns `true` if `None`, `false` if `Some`
     */
    isNone() {
        return true;
    }
    /**
     * Compile-time safely get `this.inner`
     * @returns `this.inner`
     */
    get() {
        return this.inner;
    }
    /**
     * Returns an iterator over the possibly contained value
     * @yields `this.inner` if `Some`
     */
    *[Symbol.iterator]() {
        return;
    }
    /**
     * Get the inner value if `Some`, throw `Error(message)` otherwise
     * @param message
     * @returns `this.inner` if `Some`
     * @throws `Error(message)` if `None`
     */
    expect(message) {
        throw new Error(message);
    }
    /**
     * Get the inner value or throw a NoneError
     * @returns `this.inner` if `Some`
     * @throws `NoneError` if `None`
     */
    unwrap() {
        throw new Error(`A None has been unwrapped`);
    }
    /**
     * Get the inner value or a default one
     * @param value
     * @returns `this.inner` if `Some`, `value` if `None`
     */
    unwrapOr(value) {
        return value;
    }
    /**
     * Returns the contained `Some` value or computes it from a closure
     * @param noneCallback
     * @returns `this.inner` if `Some`, `await noneCallback()` if `None`
     */
    async unwrapOrElse(noneCallback) {
        return await noneCallback();
    }
    /**
     * Returns the contained `Some` value or computes it from a closure
     * @param noneCallback
     * @returns `this.inner` if `Some`, `noneCallback()` if `None`
     */
    unwrapOrElseSync(noneCallback) {
        return noneCallback();
    }
    /**
     * Transform `Option<T>` into `Result<T, NoneError>`
     * @returns `Ok(this.inner)` if `Some`, `Err(NoneError)` if `None`
     */
    ok() {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(new NoneError());
    }
    /**
     * Transform `Option<T>` into `Result<T, E>`
     * @param error
     * @returns `Ok(this.inner)` if `Some`, `Err(error)` if `None`
     */
    okOr(error) {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(error);
    }
    /**
     * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
     * @param noneCallback
     * @returns `Ok(this.inner)` if `Some`, `Err(await noneCallback())` is `None`
     */
    async okOrElse(noneCallback) {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(await noneCallback());
    }
    /**
     * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
     * @param noneCallback
     * @returns `Ok(this.inner)` if `Some`, `Err(noneCallback())` is `None`
     */
    okOrElseSync(noneCallback) {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Err(noneCallback());
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `somePredicate` with the wrapped value
     * @param somePredicate
     * @returns `Some` if `Some` and `await somePredicate(this.inner)`, `None` otherwise
     */
    async filter(somePredicate) {
        return this;
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `somePredicate` with the wrapped value
     * @param somePredicate
     * @returns `Some` if `Some` and `somePredicate(this.inner)`, `None` otherwise
     */
    filterSync(somePredicate) {
        return this;
    }
    /**
     * Transform `Option<Promise<T>>` into `Promise<Option<T>>`
     * @returns `Promise<Option<T>>`
     */
    async await() {
        return this;
    }
    /**
     * Returns `true` if the option is a `Some` value containing the given value
     * @param value
     * @returns `true` if `Some` and `this.inner === value`, `None` otherwise
     */
    contains(value) {
        return false;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param someCallback
     * @returns `this`
     */
    async inspect(someCallback) {
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param someCallback
     * @returns `this`
     */
    inspectSync(someCallback) {
        return this;
    }
    /**
     * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`)
     * @param someMapper
     * @returns `Some(await someMapper(this.inner))` if `Some`, `this` if `None`
     */
    async map(someMapper) {
        return this;
    }
    /**
     * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`)
     * @param someMapper
     * @returns `Some(someMapper(this.inner))` if `Some`, `this` if `None`
     */
    mapSync(someMapper) {
        return this;
    }
    /**
     * Returns the provided default result (if none), or applies a function to the contained value (if any)
     * @param value
     * @param someMapper
     * @returns `value` if `None`, `await someMapper(this.inner)` if `Some`
     */
    async mapOr(value, someMapper) {
        return value;
    }
    /**
     * Returns the provided default result (if none), or applies a function to the contained value (if any)
     * @param value
     * @param someMapper
     * @returns `value` if `None`, `someMapper(this.inner)` if `Some`
     */
    mapOrSync(value, someMapper) {
        return value;
    }
    /**
     * Computes a default function result (if none), or applies a different function to the contained value (if any)
     * @param noneCallback
     * @param someMapper
     * @returns `await someMapper(this.inner)` if `Some`, `await noneCallback()` if `None`
     */
    async mapOrElse(noneCallback, someMapper) {
        return await noneCallback();
    }
    /**
     * Computes a default function result (if none), or applies a different function to the contained value (if any)
     * @param noneCallback
     * @param someMapper
     * @returns `someMapper(this.inner)` if `Some`, `noneCallback()` if `None`
     */
    mapOrElseSync(noneCallback, someMapper) {
        return noneCallback();
    }
    /**
     * Returns `None` if the option is `None`, otherwise returns `value`
     * @param value
     * @returns `None` if `None`, `value` if `Some`
     */
    and(value) {
        return this;
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `someMapper` with the wrapped value and returns the result
     * @param someMapper
     * @returns `None` if `None`, `await someMapper(this.inner)` if `Some`
     */
    async andThen(someMapper) {
        return this;
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `someMapper` with the wrapped value and returns the result
     * @param someMapper
     * @returns `None` if `None`, `someMapper(this.inner)` if `Some`
     */
    andThenSync(someMapper) {
        return this;
    }
    /**
     * Returns `this` if `Some`, otherwise returns `value`
     * @param value
     * @returns `this` if `Some`, `value` if `None`
     */
    or(value) {
        return value;
    }
    /**
     * Returns `this` if `Some`, otherwise calls `noneCallback` and returns the result
     * @param noneCallback
     * @returns `this` if `Some`, `await noneCallback()` if `None`
     */
    async orElse(noneCallback) {
        return await noneCallback();
    }
    /**
     * Returns `this` if `Some`, otherwise calls `noneCallback` and returns the result
     * @param noneCallback
     * @returns `this` if `Some`, `noneCallback()` if `None`
     */
    orElseSync(noneCallback) {
        return noneCallback();
    }
    /**
     * Returns `Some` if exactly one of the options is `Some`, otherwise returns `None`
     * @param value
     * @returns `None` if both are `Some` or both are `None`, the only `Some` otherwise
     */
    xor(value) {
        return value;
    }
    /**
     * Zips `this` with another `Option`
     * @param other
     * @returns `Some([this.inner, other.inner])` if both are `Some`, `None` if one of them is `None`
     */
    zip(other) {
        return this;
    }
}


//# sourceMappingURL=none.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/option/dist/esm/mods/option/option.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/option/dist/esm/mods/option/option.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Option: () => (/* binding */ Option)
/* harmony export */ });
/* harmony import */ var _none_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./none.mjs */ "./node_modules/@hazae41/option/dist/esm/mods/option/none.mjs");
/* harmony import */ var _some_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./some.mjs */ "./node_modules/@hazae41/option/dist/esm/mods/option/some.mjs");



var Option;
(function (Option) {
    function from(init) {
        if ("inner" in init)
            return new _some_mjs__WEBPACK_IMPORTED_MODULE_0__.Some(init.inner);
        return new _none_mjs__WEBPACK_IMPORTED_MODULE_1__.None();
    }
    Option.from = from;
    /**
     * Create an Option from a nullable value
     * @param inner
     * @returns `Some<T>` if `T`, `None` if `undefined`
     */
    function wrap(inner) {
        if (inner == null)
            return new _none_mjs__WEBPACK_IMPORTED_MODULE_1__.None();
        return new _some_mjs__WEBPACK_IMPORTED_MODULE_0__.Some(inner);
    }
    Option.wrap = wrap;
    async function map(inner, mapper) {
        return Option.wrap(inner).map(mapper).then(o => o.get());
    }
    Option.map = map;
    function mapSync(inner, mapper) {
        return Option.wrap(inner).mapSync(mapper).get();
    }
    Option.mapSync = mapSync;
    function unwrap(inner) {
        return Option.wrap(inner).unwrap();
    }
    Option.unwrap = unwrap;
})(Option || (Option = {}));


//# sourceMappingURL=option.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/option/dist/esm/mods/option/some.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@hazae41/option/dist/esm/mods/option/some.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Some: () => (/* binding */ Some)
/* harmony export */ });
/* harmony import */ var _hazae41_result__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hazae41/result */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");
/* harmony import */ var _none_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./none.mjs */ "./node_modules/@hazae41/option/dist/esm/mods/option/none.mjs");



class Some {
    inner;
    /**
     * An existing value
     * @param inner
     */
    constructor(inner) {
        this.inner = inner;
    }
    /**
     * Create a `Some`
     * @param inner
     * @returns `Some(inner)`
     */
    static new(inner) {
        return new Some(inner);
    }
    static from(init) {
        return new Some(init.inner);
    }
    /**
     * Type guard for `Some`
     * @returns `true` if `Some`, `false` if `None`
     */
    isSome() {
        return true;
    }
    /**
     * Returns `true` if the option is a `Some` and the value inside of it matches a predicate
     * @param somePredicate
     * @returns `true` if `Some` and `await somePredicate(this.inner)`, `None` otherwise
     */
    async isSomeAnd(somePredicate) {
        return await somePredicate(this.inner);
    }
    /**
     * Returns `true` if the option is a `Some` and the value inside of it matches a predicate
     * @param somePredicate
     * @returns `true` if `Some` and `somePredicate(this.inner)`, `None` otherwise
     */
    isSomeAndSync(somePredicate) {
        return somePredicate(this.inner);
    }
    /**
     * Type guard for `None`
     * @returns `true` if `None`, `false` if `Some`
     */
    isNone() {
        return false;
    }
    /**
     * Compile-time safely get `this.inner`
     * @returns `this.inner`
     */
    get() {
        return this.inner;
    }
    /**
     * Returns an iterator over the possibly contained value
     * @yields `this.inner` if `Some`
     */
    *[Symbol.iterator]() {
        yield this.inner;
    }
    /**
     * Get the inner value if `Some`, throw `Error(message)` otherwise
     * @param message
     * @returns `this.inner` if `Some`
     * @throws `Error(message)` if `None`
     */
    expect(message) {
        return this.inner;
    }
    /**
     * Get the inner value or throw a NoneError
     * @returns `this.inner` if `Some`
     * @throws `NoneError` if `None`
     */
    unwrap() {
        return this.inner;
    }
    /**
     * Get the inner value or a default one
     * @param value
     * @returns `this.inner` if `Some`, `value` if `None`
     */
    unwrapOr(value) {
        return this.inner;
    }
    /**
     * Returns the contained `Some` value or computes it from a closure
     * @param noneCallback
     * @returns `this.inner` if `Some`, `await noneCallback()` if `None`
     */
    async unwrapOrElse(noneCallback) {
        return this.inner;
    }
    /**
     * Returns the contained `Some` value or computes it from a closure
     * @param noneCallback
     * @returns `this.inner` if `Some`, `noneCallback()` if `None`
     */
    unwrapOrElseSync(noneCallback) {
        return this.inner;
    }
    /**
     * Transform `Option<T>` into `Result<T, NoneError>`
     * @returns `Ok(this.inner)` if `Some`, `Err(NoneError)` if `None`
     */
    ok() {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Ok(this.inner);
    }
    /**
     * Transform `Option<T>` into `Result<T, E>`
     * @param error
     * @returns `Ok(this.inner)` if `Some`, `Err(error)` if `None`
     */
    okOr(error) {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Ok(this.inner);
    }
    /**
     * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
     * @param noneCallback
     * @returns `Ok(this.inner)` if `Some`, `Err(await noneCallback())` is `None`
     */
    async okOrElse(noneCallback) {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Ok(this.inner);
    }
    /**
     * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
     * @param noneCallback
     * @returns `Ok(this.inner)` if `Some`, `Err(noneCallback())` is `None`
     */
    okOrElseSync(noneCallback) {
        return new _hazae41_result__WEBPACK_IMPORTED_MODULE_0__.Ok(this.inner);
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `somePredicate` with the wrapped value
     * @param somePredicate
     * @returns `Some` if `Some` and `await somePredicate(this.inner)`, `None` otherwise
     */
    async filter(somePredicate) {
        if (await somePredicate(this.inner))
            return this;
        else
            return new _none_mjs__WEBPACK_IMPORTED_MODULE_1__.None();
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `somePredicate` with the wrapped value
     * @param somePredicate
     * @returns `Some` if `Some` and `somePredicate(this.inner)`, `None` otherwise
     */
    filterSync(somePredicate) {
        if (somePredicate(this.inner))
            return this;
        else
            return new _none_mjs__WEBPACK_IMPORTED_MODULE_1__.None();
    }
    /**
     * Transform `Option<Promise<T>>` into `Promise<Option<T>>`
     * @returns `Promise<Option<T>>`
     */
    async await() {
        return new Some(await this.inner);
    }
    /**
     * Returns `true` if the option is a `Some` value containing the given value
     * @param value
     * @returns `true` if `Some` and `this.inner === value`, `None` otherwise
     */
    contains(value) {
        return this.inner === value;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param someCallback
     * @returns `this`
     */
    async inspect(someCallback) {
        await someCallback(this.inner);
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param someCallback
     * @returns `this`
     */
    inspectSync(someCallback) {
        someCallback(this.inner);
        return this;
    }
    /**
     * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`)
     * @param someMapper
     * @returns `Some(await someMapper(this.inner))` if `Some`, `this` if `None`
     */
    async map(someMapper) {
        return new Some(await someMapper(this.inner));
    }
    /**
     * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`)
     * @param someMapper
     * @returns `Some(someMapper(this.inner))` if `Some`, `this` if `None`
     */
    mapSync(someMapper) {
        return new Some(someMapper(this.inner));
    }
    /**
     * Returns the provided default result (if none), or applies a function to the contained value (if any)
     * @param value
     * @param someMapper
     * @returns `value` if `None`, `await someMapper(this.inner)` if `Some`
     */
    async mapOr(value, someMapper) {
        return await someMapper(this.inner);
    }
    /**
     * Returns the provided default result (if none), or applies a function to the contained value (if any)
     * @param value
     * @param someMapper
     * @returns `value` if `None`, `someMapper(this.inner)` if `Some`
     */
    mapOrSync(value, someMapper) {
        return someMapper(this.inner);
    }
    /**
     * Computes a default function result (if none), or applies a different function to the contained value (if any)
     * @param noneCallback
     * @param someMapper
     * @returns `await someMapper(this.inner)` if `Some`, `await noneCallback()` if `None`
     */
    async mapOrElse(noneCallback, someMapper) {
        return await someMapper(this.inner);
    }
    /**
     * Computes a default function result (if none), or applies a different function to the contained value (if any)
     * @param noneCallback
     * @param someMapper
     * @returns `someMapper(this.inner)` if `Some`, `noneCallback()` if `None`
     */
    mapOrElseSync(noneCallback, someMapper) {
        return someMapper(this.inner);
    }
    /**
     * Returns `None` if the option is `None`, otherwise returns `value`
     * @param value
     * @returns `None` if `None`, `value` if `Some`
     */
    and(value) {
        return value;
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `someMapper` with the wrapped value and returns the result
     * @param someMapper
     * @returns `None` if `None`, `await someMapper(this.inner)` if `Some`
     */
    async andThen(someMapper) {
        return await someMapper(this.inner);
    }
    /**
     * Returns `None` if the option is `None`, otherwise calls `someMapper` with the wrapped value and returns the result
     * @param someMapper
     * @returns `None` if `None`, `someMapper(this.inner)` if `Some`
     */
    andThenSync(someMapper) {
        return someMapper(this.inner);
    }
    /**
     * Returns `this` if `Some`, otherwise returns `value`
     * @param value
     * @returns `this` if `Some`, `value` if `None`
     */
    or(value) {
        return this;
    }
    /**
     * Returns `this` if `Some`, otherwise calls `noneCallback` and returns the result
     * @param noneCallback
     * @returns `this` if `Some`, `await noneCallback()` if `None`
     */
    async orElse(noneCallback) {
        return this;
    }
    /**
     * Returns `this` if `Some`, otherwise calls `noneCallback` and returns the result
     * @param noneCallback
     * @returns `this` if `Some`, `noneCallback()` if `None`
     */
    orElseSync(noneCallback) {
        return this;
    }
    /**
     * Returns `Some` if exactly one of the options is `Some`, otherwise returns `None`
     * @param value
     * @returns `None` if both are `Some` or both are `None`, the only `Some` otherwise
     */
    xor(value) {
        if (value.isSome())
            return new _none_mjs__WEBPACK_IMPORTED_MODULE_1__.None();
        else
            return this;
    }
    /**
     * Zips `this` with another `Option`
     * @param other
     * @returns `Some([this.inner, other.inner])` if both are `Some`, `None` if one of them is `None`
     */
    zip(other) {
        if (other.isSome())
            return new Some([this.inner, other.inner]);
        else
            return other;
    }
}


//# sourceMappingURL=some.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Err: () => (/* binding */ Err)
/* harmony export */ });
/* harmony import */ var _hazae41_option__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/option */ "./node_modules/@hazae41/option/dist/esm/mods/option/none.mjs");
/* harmony import */ var _hazae41_option__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/option */ "./node_modules/@hazae41/option/dist/esm/mods/option/some.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/errors.mjs");
/* harmony import */ var _result_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./result.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs");




class Err {
    #inner;
    #timeout;
    /**
     * A failure
     * @param inner
     */
    constructor(inner) {
        this.#inner = inner;
        if (!_result_mjs__WEBPACK_IMPORTED_MODULE_0__.Result.debug)
            return;
        const error = new Error(`An Err has not been handled properly`);
        this.#timeout = setTimeout(() => { throw error; }, 1000);
    }
    /**
     * Create an empty `Err`
     * @returns `Err(void)`
     */
    static void() {
        return new Err(undefined);
    }
    /**
     * Create an `Err`
     * @param inner
     * @returns `Err(inner)`
     */
    static new(inner) {
        return new Err(inner);
    }
    /**
     * Create an `Err` with an `Error` inside
     * @param message
     * @param options
     * @returns `Err<Error>`
     */
    static error(message, options) {
        return new Err(new Error(message, options));
    }
    get inner() {
        return this.#inner;
    }
    /**
     * Set this result as handled
     */
    ignore() {
        if (!this.#timeout)
            return this;
        clearTimeout(this.#timeout);
        this.#timeout = undefined;
        return this;
    }
    /**
     * Type guard for `Ok`
     * @returns `true` if `Ok`, `false` if `Err`
     */
    isOk() {
        return false;
    }
    /**
     * Returns true if the result is `Ok` and the value inside of it matches a predicate
     * @param okPredicate
     * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
     */
    async isOkAnd(okPredicate) {
        return false;
    }
    /**
     * Returns true if the result is `Ok` and the value inside of it matches a predicate
     * @param okPredicate
     * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
     */
    isOkAndSync(okPredicate) {
        return false;
    }
    /**
     * Type guard for `Err`
     * @returns `true` if `Err`, `false` if `Ok`
     */
    isErr() {
        return true;
    }
    /**
     * Returns true if the result is `Err` and the value inside of it matches a predicate
     * @param errPredicate
     * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
     */
    async isErrAnd(errPredicate) {
        return await errPredicate(this.inner);
    }
    /**
     * Returns true if the result is `Err` and the value inside of it matches a predicate
     * @param errPredicate
     * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
     */
    isErrAndSync(errPredicate) {
        return errPredicate(this.inner);
    }
    /**
     * Compile-time safely get Ok's inner type
     * @returns `this.inner`
     * @throws if `this` is `Err`
     */
    get() {
        throw new _errors_mjs__WEBPACK_IMPORTED_MODULE_1__.Panic();
    }
    /**
     * Compile-time safely get Err's inner type
     * @returns `this.inner`
     * @throws if `this` is `Ok`
     */
    getErr() {
        this.ignore();
        return this.inner;
    }
    /**
     * Transform `Result<T, E>` into `Option<T>`
     * @returns `Some(this.inner)` if `Ok`, `None` if `Err`
     */
    ok() {
        this.ignore();
        return new _hazae41_option__WEBPACK_IMPORTED_MODULE_2__.None();
    }
    /**
     * Transform `Result<T, E>` into `Option<E>`
     * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
     */
    err() {
        this.ignore();
        return new _hazae41_option__WEBPACK_IMPORTED_MODULE_3__.Some(this.inner);
    }
    /**
     * Returns an iterator over the possibly contained value
     * @yields `this.inner` if `Ok`
     */
    *[Symbol.iterator]() {
        this.ignore();
        return;
    }
    /**
     * Transform `Result<T,E>` into `[T,E]`
     * @returns `[this.inner, undefined]` if `Ok`, `[undefined, this.inner]` if `Err`
     */
    split() {
        this.ignore();
        return [undefined, this.inner];
    }
    /**
     * Returns true if the result is an `Ok` value containing the given value
     * @param value
     * @returns `true` if `Ok` and `this.inner === value`, `false` otherwise
     */
    contains(value) {
        return false;
    }
    /**
     * Returns true if the result is an `Err` value containing the given value
     * @param value
     * @returns `true` if `Err` and `this.inner === value`, `false` otherwise
     */
    containsErr(value) {
        return this.inner === value;
    }
    /**
     * Get the inner value or throw to the closest `Result.unthrow`
     * @param thrower The thrower from `Result.unthrow`
     * @returns `this.inner` if `Ok`
     * @throws `undefined` if `Err`
     * @see Result.unthrow
     * @see Result.unthrowSync
     */
    throw(thrower) {
        thrower(this);
        throw this;
    }
    /**
     * Get the inner value or throw the inner error wrapped inside another Error
     * @param message
     * @returns `this.inner` if `Ok`, `Error(message, { cause: this.inner })` if `Err`
     */
    expect(message) {
        this.ignore();
        throw new Error(message, { cause: this.inner });
    }
    /**
     * Get the inner error or throw the inner value wrapped inside another Error
     * @param message
     * @returns `this.inner` if `Err`, `Error(message, { cause: this.inner })` if `Ok`
     */
    expectErr(message) {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner value or panic
     * @returns `this.inner` if `Ok`
     * @throws `this.inner` if `Err`
     */
    unwrap() {
        this.ignore();
        throw this.inner;
    }
    /**
     * Get the inner error or panic
     * @returns `this.inner` if `Err`
     * @throws `this.inner` if `Ok`
     */
    unwrapErr() {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner value or a default one
     * @param value
     * @returns `this.inner` if `Ok`, `value` if `Err`
     */
    unwrapOr(value) {
        this.ignore();
        return value;
    }
    /**
     * Get the inner value or compute a default one from the inner error
     * @param errMapper
     * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
     * @throws if `await errMapper(this.inner)` throws
     */
    async unwrapOrElse(errMapper) {
        this.ignore();
        return await errMapper(this.inner);
    }
    /**
     * Get the inner value or compute a default one from the inner error
     * @param errMapper
     * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
     * @throws if `errMapper(this.inner)` throws
     */
    unwrapOrElseSync(errMapper) {
        this.ignore();
        return errMapper(this.inner);
    }
    /**
     * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
     * @returns `await this.inner` if `Ok`, `this` if `Err`
     */
    async await() {
        return this;
    }
    /**
     * Transform Result<T, Promise<E>> into Promise<Result<T, E>>
     * @returns `await this.inner` if `Err`, `this` if `Ok`
     */
    async awaitErr() {
        return new Err(await this.inner);
    }
    /**
     * Transform Result<Promise<T>, Promise<E>> into Promise<Result<T, E>>
     * @returns `await this.inner`
     */
    async awaitAll() {
        return await this.awaitErr();
    }
    /**
     * Transform `Result<T, E>` into `Result<void, E>`
     * @returns `Ok<void>` if `Ok<T>`, `Err<E>` if `E<E>`
     */
    clear() {
        return this;
    }
    /**
     * Transform `Result<T, E>` into `Result<T, void>`
     * @returns `Ok<T>` if `Ok<T>`, `Err<void>` if `E<E>`
     */
    clearErr() {
        this.ignore();
        return Err.void();
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param okCallback
     * @returns `this`
     */
    async inspect(okCallback) {
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param okCallback
     * @returns `this`
     */
    inspectSync(okCallback) {
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Err`
     * @param errCallback
     * @returns `this`
     */
    async inspectErr(errCallback) {
        await errCallback(this.inner);
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Err`
     * @param errCallback
     * @returns `this`
     */
    inspectErrSync(errCallback) {
        errCallback(this.inner);
        return this;
    }
    /**
     * Return a new `Ok` but with the given `inner`
     * @param inner
     * @returns `Ok(inner)` if `Ok`, `this` if `Err`
     */
    set(inner) {
        return this;
    }
    /**
     * Return a new `Err` but with the given `inner`
     * @param inner
     * @returns `Err(inner)` if `Err`, `this` if `Ok`
     */
    setErr(inner) {
        return new Err(inner);
    }
    /**
     * Map the inner value into another
     * @param okMapper
     * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
     * @throws if `await okMapper(this.inner)` throws
     */
    async map(okMapper) {
        return this;
    }
    /**
     * Map the inner value into another
     * @param okMapper
     * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
     * @throws if `okMapper(this.inner)` throws
     */
    mapSync(okMapper) {
        return this;
    }
    /**
     * Map the inner error into another
     * @param errMapper
     * @returns `Err(await errMapper(this.inner))` if `Err`, `this` if `Ok`
     * @throws if `await errMapper(this.inner)` throws
     */
    async mapErr(errMapper) {
        this.ignore();
        return new Err(await errMapper(this.inner));
    }
    /**
     * Map the inner error into another
     * @param errMapper
     * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
     * @throws if `errMapper(this.inner)` throws
     */
    mapErrSync(errMapper) {
        this.ignore();
        return new Err(errMapper(this.inner));
    }
    /**
     * Map the inner value into another, or a default one
     * @param value
     * @param okMapper
     * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
     * @throws if `await okMapper(this.inner)` throws
     */
    async mapOr(value, okMapper) {
        this.ignore();
        return value;
    }
    /**
     * Map the inner value into another, or a default one
     * @param value
     * @param okMapper
     * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
     * @throws if `okMapper(this.inner)` throws
     */
    mapOrSync(value, okMapper) {
        this.ignore();
        return value;
    }
    /**
     * Map the inner value into another, or a default one
     * @param errMapper
     * @param okMapper
     * @returns `await okMapper(this.inner)` if `Ok`, `await errMapper(this.inner)` if `Err`
     * @throws if `await okMapper(this.inner)` or `await errMapper(this.inner)` throws
     */
    async mapOrElse(errMapper, okMapper) {
        this.ignore();
        return await errMapper(this.inner);
    }
    /**
     * Map the inner value into another, or a default one
     * @param errMapper
     * @param okMapper
     * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
     * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
     */
    mapOrElseSync(errMapper, okMapper) {
        this.ignore();
        return errMapper(this.inner);
    }
    /**
     * Return `value` if `Ok`, return `this` if `Err`
     * @param value
     * @returns `value` if `Ok`, `this` if `Err`
     */
    and(value) {
        return this;
    }
    /**
     * Return `await okMapper(this.inner)` if `Ok`, return `this` if `Err`
     * @param okMapper
     * @returns `await okMapper(this.inner)` if `Ok`, `this` if `Err`
     * @throws if `await okMapper(this.inner)` throws
     */
    async andThen(okMapper) {
        return this;
    }
    /**
     * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
     * @param okMapper
     * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
     * @throws if `okMapper(this.inner)` throws
     */
    andThenSync(okMapper) {
        return this;
    }
    /**
     * Return `value` if `Err`, return `this` if `Ok`
     * @param value
     * @returns `value` if `Err`, `this` if `Ok`
     */
    or(value) {
        this.ignore();
        return value;
    }
    /**
     * Return `await errMapper(this.inner)` if `Err`, return `this` if `Ok`
     * @param errMapper
     * @returns `await errMapper(this.inner)` if `Err`, `this` if `Ok`
     * @throws if `await errMapper(this.inner)` throws
     */
    async orElse(errMapper) {
        this.ignore();
        return await errMapper(this.inner);
    }
    /**
     * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
     * @param errMapper
     * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
     * @throws if `errMapper(this.inner)` throws
     */
    orElseSync(errMapper) {
        this.ignore();
        return errMapper(this.inner);
    }
    /**
     * Transform Result<Result<T, E1>, E2> into Result<T, E1 | E2>
     * @param result
     * @returns `this` if `Err`, `this.inner` if `Ok`
     */
    flatten() {
        return this;
    }
}


//# sourceMappingURL=err.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/result/dist/esm/mods/result/errors.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/result/dist/esm/mods/result/errors.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssertError: () => (/* binding */ AssertError),
/* harmony export */   Catched: () => (/* binding */ Catched),
/* harmony export */   Panic: () => (/* binding */ Panic),
/* harmony export */   Unimplemented: () => (/* binding */ Unimplemented)
/* harmony export */ });
/* harmony import */ var _err_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./err.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");


class Unimplemented extends Error {
    #class = Unimplemented;
    name = this.#class.name;
    constructor(options) {
        super(`Something is not implemented`, options);
    }
}
class AssertError extends Error {
    #class = AssertError;
    name = this.#class.name;
    constructor(options) {
        super(`Some assertion failed`, options);
    }
}
class Panic extends Error {
    #class = Panic;
    name = this.#class.name;
    static from(cause) {
        return new Panic(`Something was not expected`, { cause });
    }
    static fromAndThrow(cause) {
        throw new Panic(`Something was not expected`, { cause });
    }
}
class Catched extends Error {
    #class = Catched;
    name = this.#class.name;
    constructor(options) {
        super(`Something has been catched`, options);
    }
    static from(cause) {
        return new Catched({ cause });
    }
    static fromAndThrow(cause) {
        throw new Catched({ cause });
    }
    /**
     * Throw if `Catched`, wrap in `Err` otherwise
     * @param error
     * @returns `Err(error)` if not `Catched`
     * @throws `error.cause` if `Catched`
     */
    static throwOrErr(error) {
        if (error instanceof Catched)
            throw error.cause;
        return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(error);
    }
}


//# sourceMappingURL=errors.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ok: () => (/* binding */ Ok)
/* harmony export */ });
/* harmony import */ var _hazae41_option__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hazae41/option */ "./node_modules/@hazae41/option/dist/esm/mods/option/some.mjs");
/* harmony import */ var _hazae41_option__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/option */ "./node_modules/@hazae41/option/dist/esm/mods/option/none.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/errors.mjs");
/* harmony import */ var _result_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./result.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs");




class Ok {
    #inner;
    #timeout;
    /**
     * A success
     * @param inner
     */
    constructor(inner) {
        this.#inner = inner;
        if (!_result_mjs__WEBPACK_IMPORTED_MODULE_0__.Result.debug)
            return;
        const error = new Error(`An Ok has not been handled properly`);
        this.#timeout = setTimeout(() => { throw error; }, 1000);
    }
    /**
     * Create an empty `Ok`
     * @returns `Ok(void)`
     */
    static void() {
        return new Ok(undefined);
    }
    /**
     * Create an `Ok`
     * @param inner
     * @returns `Ok(inner)`
     */
    static new(inner) {
        return new Ok(inner);
    }
    get inner() {
        return this.#inner;
    }
    /**
     * Set this result as handled
     */
    ignore() {
        if (!this.#timeout)
            return this;
        clearTimeout(this.#timeout);
        this.#timeout = undefined;
        return this;
    }
    /**
     * Type guard for `Ok`
     * @returns `true` if `Ok`, `false` if `Err`
     */
    isOk() {
        return true;
    }
    /**
     * Returns true if the result is `Ok` and the value inside of it matches a predicate
     * @param okPredicate
     * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
     */
    async isOkAnd(okPredicate) {
        return await okPredicate(this.inner);
    }
    /**
     * Returns true if the result is `Ok` and the value inside of it matches a predicate
     * @param okPredicate
     * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
     */
    isOkAndSync(okPredicate) {
        return okPredicate(this.inner);
    }
    /**
     * Type guard for `Err`
     * @returns `true` if `Err`, `false` if `Ok`
     */
    isErr() {
        return false;
    }
    /**
     * Returns true if the result is `Err` and the value inside of it matches a predicate
     * @param errPredicate
     * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
     */
    async isErrAnd(errPredicate) {
        return false;
    }
    /**
     * Returns true if the result is `Err` and the value inside of it matches a predicate
     * @param errPredicate
     * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
     */
    isErrAndSync(errPredicate) {
        return false;
    }
    /**
     * Compile-time safely get Ok's inner type
     * @returns `this.inner`
     * @throws if `this` is `Err`
     */
    get() {
        this.ignore();
        return this.inner;
    }
    /**
     * Compile-time safely get Err's inner type
     * @returns `this.inner`
     * @throws if `this` is `Ok`
     */
    getErr() {
        throw new _errors_mjs__WEBPACK_IMPORTED_MODULE_1__.Panic();
    }
    /**
     * Transform `Result<T, E>` into `Option<T>`
     * @returns `Some(this.inner)` if `Ok`, `None` if `Err`
     */
    ok() {
        this.ignore();
        return new _hazae41_option__WEBPACK_IMPORTED_MODULE_2__.Some(this.inner);
    }
    /**
     * Transform `Result<T, E>` into `Option<E>`
     * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
     */
    err() {
        this.ignore();
        return new _hazae41_option__WEBPACK_IMPORTED_MODULE_3__.None();
    }
    /**
     * Returns an iterator over the possibly contained value
     * @yields `this.inner` if `Ok`
     */
    *[Symbol.iterator]() {
        this.ignore();
        yield this.inner;
    }
    /**
     * Transform `Result<T,E>` into `[T,E]`
     * @returns `[this.inner, undefined]` if `Ok`, `[undefined, this.inner]` if `Err`
     */
    split() {
        this.ignore();
        return [this.inner, undefined];
    }
    /**
     * Returns true if the result is an `Ok` value containing the given value
     * @param value
     * @returns `true` if `Ok` and `this.inner === value`, `false` otherwise
     */
    contains(value) {
        return this.inner === value;
    }
    /**
     * Returns true if the result is an `Err` value containing the given value
     * @param value
     * @returns `true` if `Err` and `this.inner === value`, `false` otherwise
     */
    containsErr(value) {
        return false;
    }
    /**
     * Just like `unwrap` but it throws to the closest `Result.unthrow`
     * @returns `this.inner` if `Ok`
     * @throws `this` if `Err`
     * @see Result.unthrow
     * @see Result.unthrowSync
     */
    throw(thrower) {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner value or throw the inner error wrapped inside another Error
     * @param message
     * @returns `this.inner` if `Ok`, `Error(message, { cause: this.inner })` if `Err`
     */
    expect(message) {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner error or throw the inner value wrapped inside another Error
     * @param message
     * @returns `this.inner` if `Err`, `Error(message, { cause: this.inner })` if `Ok`
     */
    expectErr(message) {
        this.ignore();
        throw new Error(message, { cause: this.inner });
    }
    /**
     * Get the inner value or panic
     * @returns `this.inner` if `Ok`
     * @throws `this.inner` if `Err`
     */
    unwrap() {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner error or panic
     * @returns `this.inner` if `Err`
     * @throws `this.inner` if `Ok`
     */
    unwrapErr() {
        this.ignore();
        throw this.inner;
    }
    /**
     * Get the inner value or a default one
     * @param value
     * @returns `this.inner` if `Ok`, `value` if `Err`
     */
    unwrapOr(value) {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner value or compute a default one from the inner error
     * @param errMapper
     * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
     * @throws if `await errMapper(this.inner)` throws
     */
    async unwrapOrElse(errMapper) {
        this.ignore();
        return this.inner;
    }
    /**
     * Get the inner value or compute a default one from the inner error
     * @param errMapper
     * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
     * @throws if `errMapper(this.inner)` throws
     */
    unwrapOrElseSync(errMapper) {
        this.ignore();
        return this.inner;
    }
    /**
     * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
     * @returns `await this.inner` if `Ok`, `this` if `Err`
     */
    async await() {
        return new Ok(await this.inner);
    }
    /**
     * Transform Result<T, Promise<E>> into Promise<Result<T, E>>
     * @returns `await this.inner` if `Err`, `this` if `Ok`
     */
    async awaitErr() {
        return this;
    }
    /**
     * Transform Result<Promise<T>, Promise<E>> into Promise<Result<T, E>>
     * @returns `await this.inner`
     */
    async awaitAll() {
        return await this.await();
    }
    /**
     * Transform `Result<T, E>` into `Result<void, E>`
     * @returns `Ok<void>` if `Ok<T>`, `Err<E>` if `E<E>`
     */
    clear() {
        this.ignore();
        return Ok.void();
    }
    /**
     * Transform `Result<T, E>` into `Result<T, void>`
     * @returns `Ok<T>` if `Ok<T>`, `Err<void>` if `E<E>`
     */
    clearErr() {
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param okCallback
     * @returns `this`
     */
    async inspect(okCallback) {
        await okCallback(this.inner);
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Ok`
     * @param okCallback
     * @returns `this`
     */
    inspectSync(okCallback) {
        okCallback(this.inner);
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Err`
     * @param errCallback
     * @returns `this`
     */
    async inspectErr(errCallback) {
        return this;
    }
    /**
     * Calls the given callback with the inner value if `Err`
     * @param errCallback
     * @returns `this`
     */
    inspectErrSync(errCallback) {
        return this;
    }
    /**
     * Return a new `Ok` but with the given `inner`
     * @param inner
     * @returns `Ok(inner)` if `Ok`, `this` if `Err`
     */
    set(inner) {
        return new Ok(inner);
    }
    /**
     * Return a new `Err` but with the given `inner`
     * @param inner
     * @returns `Err(inner)` if `Err`, `this` if `Ok`
     */
    setErr(inner) {
        return this;
    }
    /**
     * Map the inner value into another
     * @param okMapper
     * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
     * @throws if `await okMapper(this.inner)` throws
     */
    async map(okMapper) {
        this.ignore();
        return new Ok(await okMapper(this.inner));
    }
    /**
     * Map the inner value into another
     * @param okMapper
     * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
     * @throws if `okMapper(this.inner)` throws
     */
    mapSync(okMapper) {
        this.ignore();
        return new Ok(okMapper(this.inner));
    }
    /**
     * Map the inner error into another
     * @param errMapper
     * @returns `Err(await errMapper(this.inner))` if `Err`, `this` if `Ok`
     * @throws if `await errMapper(this.inner)` throws
     */
    async mapErr(errMapper) {
        return this;
    }
    /**
     * Map the inner error into another
     * @param errMapper
     * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
     * @throws if `errMapper(this.inner)` throws
     */
    mapErrSync(errMapper) {
        return this;
    }
    /**
     * Map the inner value into another, or a default one
     * @param value
     * @param okMapper
     * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
     * @throws if `await okMapper(this.inner)` throws
     */
    async mapOr(value, okMapper) {
        this.ignore();
        return await okMapper(this.inner);
    }
    /**
     * Map the inner value into another, or a default one
     * @param value
     * @param okMapper
     * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
     * @throws if `okMapper(this.inner)` throws
     */
    mapOrSync(value, okMapper) {
        this.ignore();
        return okMapper(this.inner);
    }
    /**
     * Map the inner value into another, or a default one
     * @param errMapper
     * @param okMapper
     * @returns `await okMapper(this.inner)` if `Ok`, `await errMapper(this.inner)` if `Err`
     * @throws if `await okMapper(this.inner)` or `await errMapper(this.inner)` throws
     */
    async mapOrElse(errMapper, okMapper) {
        this.ignore();
        return await okMapper(this.inner);
    }
    /**
     * Map the inner value into another, or a default one
     * @param errMapper
     * @param okMapper
     * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
     * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
     */
    mapOrElseSync(errMapper, okMapper) {
        this.ignore();
        return okMapper(this.inner);
    }
    /**
     * Return `value` if `Ok`, return `this` if `Err`
     * @param value
     * @returns `value` if `Ok`, `this` if `Err`
     */
    and(value) {
        this.ignore();
        return value;
    }
    /**
     * Return `await okMapper(this.inner)` if `Ok`, return `this` if `Err`
     * @param okMapper
     * @returns `await okMapper(this.inner)` if `Ok`, `this` if `Err`
     * @throws if `await okMapper(this.inner)` throws
     */
    async andThen(okMapper) {
        this.ignore();
        return await okMapper(this.inner);
    }
    /**
     * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
     * @param okMapper
     * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
     * @throws if `okMapper(this.inner)` throws
     */
    andThenSync(okMapper) {
        this.ignore();
        return okMapper(this.inner);
    }
    /**
     * Return `value` if `Err`, return `this` if `Ok`
     * @param value
     * @returns `value` if `Err`, `this` if `Ok`
     */
    or(value) {
        return this;
    }
    /**
     * Return `await errMapper(this.inner)` if `Err`, return `this` if `Ok`
     * @param errMapper
     * @returns `await errMapper(this.inner)` if `Err`, `this` if `Ok`
     * @throws if `await errMapper(this.inner)` throws
     */
    async orElse(errMapper) {
        return this;
    }
    /**
     * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
     * @param errMapper
     * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
     * @throws if `errMapper(this.inner)` throws
     */
    orElseSync(errMapper) {
        return this;
    }
    /**
     * Transform Result<Result<T, E1>, E2> into Result<T, E1 | E2>
     * @param result
     * @returns `this` if `Err`, `this.inner` if `Ok`
     */
    flatten() {
        return this.inner;
    }
}


//# sourceMappingURL=ok.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs":
/*!**********************************************************************!*\
  !*** ./node_modules/@hazae41/result/dist/esm/mods/result/result.mjs ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Result: () => (/* binding */ Result)
/* harmony export */ });
/* harmony import */ var _hazae41_option__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hazae41/option */ "./node_modules/@hazae41/option/dist/esm/mods/option/option.mjs");
/* harmony import */ var _err_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./err.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/err.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/errors.mjs");
/* harmony import */ var _ok_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ok.mjs */ "./node_modules/@hazae41/result/dist/esm/mods/result/ok.mjs");





var Result;
(function (Result) {
    Result.debug = false;
    /**
     * Create a Result from a maybe Error value
     * @param inner
     * @returns `Ok<T>` if `T`, `Err<Error>` if `Error`
     */
    function from(inner) {
        if (inner instanceof Error)
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(inner);
        else
            return new _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok(inner);
    }
    Result.from = from;
    /**
     * Create a Result from a boolean
     * @param value
     * @returns
     */
    function assert(value) {
        return value ? _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok.void() : new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(new _errors_mjs__WEBPACK_IMPORTED_MODULE_2__.AssertError());
    }
    Result.assert = assert;
    function rewrap(wrapper) {
        try {
            return new _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok(wrapper.unwrap());
        }
        catch (error) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(error);
        }
    }
    Result.rewrap = rewrap;
    /**
     * Catch an Err thrown from Err.throw
     * @param callback
     * @param type
     * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
     * @see Err.throw
     */
    async function unthrow(callback) {
        let ref;
        try {
            return await callback((e) => ref = e);
        }
        catch (e) {
            if (ref !== undefined)
                return ref;
            throw e;
        }
    }
    Result.unthrow = unthrow;
    /**
     * Catch an Err thrown from Err.throw
     * @param callback
     * @param type
     * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
     * @see Err.throw
     */
    function unthrowSync(callback) {
        let ref;
        try {
            return callback((e) => ref = e);
        }
        catch (e) {
            if (ref !== undefined)
                return ref;
            throw e;
        }
    }
    Result.unthrowSync = unthrowSync;
    /**
     * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<unknown>
     * @param callback
     * @returns
     */
    async function runAndWrap(callback) {
        try {
            return new _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok(await callback());
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(e);
        }
    }
    Result.runAndWrap = runAndWrap;
    /**
     * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<unknown>
     * @param callback
     * @returns
     */
    function runAndWrapSync(callback) {
        try {
            return new _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok(callback());
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(e);
        }
    }
    Result.runAndWrapSync = runAndWrapSync;
    /**
     * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<Catched>
     * @param callback
     * @returns
     */
    async function runAndDoubleWrap(callback) {
        try {
            return new _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok(await callback());
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_2__.Catched.from(e));
        }
    }
    Result.runAndDoubleWrap = runAndDoubleWrap;
    /**
     * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<Catched>
     * @param callback
     * @returns
     */
    function runAndDoubleWrapSync(callback) {
        try {
            return new _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok(callback());
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_2__.Catched.from(e));
        }
    }
    Result.runAndDoubleWrapSync = runAndDoubleWrapSync;
    /**
     * Run a callback and wrap any thrown error in Err<unknown>
     * @param callback
     * @returns
     */
    async function runOrWrap(callback) {
        try {
            return await callback();
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(e);
        }
    }
    Result.runOrWrap = runOrWrap;
    /**
     * Run a callback and wrap any thrown error in Err<unknown>
     * @param callback
     * @returns
     */
    function runOrWrapSync(callback) {
        try {
            return callback();
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(e);
        }
    }
    Result.runOrWrapSync = runOrWrapSync;
    /**
     * Run a callback and wrap any thrown error in Err<unknown>
     * @param callback
     * @returns
     */
    async function runOrDoubleWrap(callback) {
        try {
            return await callback();
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_2__.Catched.from(e));
        }
    }
    Result.runOrDoubleWrap = runOrDoubleWrap;
    /**
     * Run a callback and wrap any thrown error in Err<unknown>
     * @param callback
     * @returns
     */
    function runOrDoubleWrapSync(callback) {
        try {
            return callback();
        }
        catch (e) {
            return new _err_mjs__WEBPACK_IMPORTED_MODULE_0__.Err(_errors_mjs__WEBPACK_IMPORTED_MODULE_2__.Catched.from(e));
        }
    }
    Result.runOrDoubleWrapSync = runOrDoubleWrapSync;
    /**
     * Transform `Iterable<Result<T,E>` into `Result<Array<T>, E>`
     * @param iterable
     * @returns `Result<Array<T>, E>`
     */
    function all(iterable) {
        return collect(iterate(iterable));
    }
    Result.all = all;
    function maybeAll(iterable) {
        return maybeCollect(maybeIterate(iterable));
    }
    Result.maybeAll = maybeAll;
    /**
     * Transform `Iterable<Result<T,E>` into `Iterator<T, Result<void, E>>`
     * @param iterable
     * @returns `Iterator<T, Result<void, E>>`
     */
    function* iterate(iterable) {
        for (const result of iterable) {
            if (result.isOk())
                yield result.get();
            else
                return result;
        }
        return _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok.void();
    }
    Result.iterate = iterate;
    function* maybeIterate(iterable) {
        for (const result of iterable) {
            if (result == null)
                return result;
            else if (result.isOk())
                yield result.get();
            else
                return result;
        }
        return _ok_mjs__WEBPACK_IMPORTED_MODULE_1__.Ok.void();
    }
    Result.maybeIterate = maybeIterate;
    /**
     * Transform `Iterator<T, Result<void, E>>` into `Result<Array<T>, E>`
     * @param iterator `Result<Array<T>, E>`
     */
    function collect(iterator) {
        const array = new Array();
        let result = iterator.next();
        for (; !result.done; result = iterator.next())
            array.push(result.value);
        return result.value.set(array);
    }
    Result.collect = collect;
    function maybeCollect(iterator) {
        const array = new Array();
        let result = iterator.next();
        for (; !result.done; result = iterator.next())
            array.push(result.value);
        return _hazae41_option__WEBPACK_IMPORTED_MODULE_3__.Option.mapSync(result.value, result => result.set(array));
    }
    Result.maybeCollect = maybeCollect;
})(Result || (Result = {}));


//# sourceMappingURL=result.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/symbol-dispose-polyfill/dist/esm/index.mjs":
/*!**************************************************************************!*\
  !*** ./node_modules/@hazae41/symbol-dispose-polyfill/dist/esm/index.mjs ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mods_symbol_dispose_polyfill_polyfill_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mods/symbol-dispose-polyfill/polyfill.mjs */ "./node_modules/@hazae41/symbol-dispose-polyfill/dist/esm/mods/symbol-dispose-polyfill/polyfill.mjs");

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ "./node_modules/@hazae41/symbol-dispose-polyfill/dist/esm/mods/symbol-dispose-polyfill/polyfill.mjs":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@hazae41/symbol-dispose-polyfill/dist/esm/mods/symbol-dispose-polyfill/polyfill.mjs ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
if (typeof Symbol.dispose !== "symbol")
    Object.defineProperty(Symbol, "dispose", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Symbol.for("dispose")
    });
if (typeof Symbol.asyncDispose !== "symbol")
    Object.defineProperty(Symbol, "asyncDispose", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Symbol.for("asyncDispose")
    });
//# sourceMappingURL=polyfill.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("03b0737a3a7b42e4699d")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = __webpack_require__.hmrS_importScripts = __webpack_require__.hmrS_importScripts || {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		// no chunk loading
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var success = false;
/******/ 			self["webpackHotUpdateexample_next_website"] = (_, moreModules, runtime) => {
/******/ 				for(var moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						currentUpdate[moduleId] = moreModules[moduleId];
/******/ 						if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 					}
/******/ 				}
/******/ 				if(runtime) currentUpdateRuntime.push(runtime);
/******/ 				success = true;
/******/ 			};
/******/ 			// start update chunk loading
/******/ 			importScripts(__webpack_require__.p + __webpack_require__.hu(chunkId));
/******/ 			if(!success) throw new Error("Loading update chunk failed for unknown reason");
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.importScripsHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.importScrips = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.importScrips = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.importScripsHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/worker/index.ts");
/******/ 	
/******/ })()
;