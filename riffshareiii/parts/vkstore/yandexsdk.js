/*! For license information please see sdk-suggest-latest.js.LICENSE.txt */
console.log('ya');
! function () {
	"use strict";
	parseInt(null === (t = navigator) || void 0 === t ? void 0 : t.userAgent.toLowerCase().split("msie")[1], 10);
	var t;

	function r(t) {
		console.log('init', 6);
		return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
				return typeof t
			} :
			function (t) {
				return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
			},
			r(t)
	}

	function e(t, r) {
		console.log('init', 7);
		(null == r || r > t.length) && (r = t.length);
		for (var e = 0, n = Array(r); e < r; e++)
			n[e] = t[e];
		return n
	}

	function n() {
		console.log('init', 8);
		n = function () {
			return e
		};
		var t,
			e = {},
			o = Object.prototype,
			i = o.hasOwnProperty,
			a = Object.defineProperty || function (t, r, e) {
				t[r] = e.value
			},
			c = "function" == typeof Symbol ? Symbol : {},
			u = c.iterator || "@@iterator",
			s = c.asyncIterator || "@@asyncIterator",
			l = c.toStringTag || "@@toStringTag";

		function f(t, r, e) {
			console.log('init', 9);
			return Object.defineProperty(t, r, {
					value: e,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}),
				t[r]
		}
		try {
			f({}, "")
		} catch (t) {
			f = function (t, r, e) {
				return t[r] = e
			}
		}

		function h(t, r, e, n) {
			console.log('init', 11);
			var o = r && r.prototype instanceof w ? r : w,
				i = Object.create(o.prototype),
				c = new j(n || []);
			return a(i, "_invoke", {
					value: O(t, e, c)
				}),
				i
		}

		function p(t, r, e) {
			console.log('init', 10);
			try {
				return {
					type: "normal",
					arg: t.call(r, e)
				}
			} catch (t) {
				return {
					type: "throw",
					arg: t
				}
			}
		}
		e.wrap = h;
		var d = "suspendedStart",
			y = "suspendedYield",
			v = "executing",
			g = "completed",
			m = {};

		function w() {
			console.log('init', 12);
		}

		function b() {
			console.log('init', 13);
		}

		function S() {
			console.log('init', 14);
		}
		var E = {};
		f(E, u, (function () {
			return this
		}));
		var x = Object.getPrototypeOf,
			_ = x && x(x(P([])));
		_ && _ !== o && i.call(_, u) && (E = _);
		var L = S.prototype = w.prototype = Object.create(E);

		function T(t) {
			["next", "throw", "return"].forEach((function (r) {
				f(t, r, (function (t) {
					return this._invoke(r, t)
				}))
			}))
		}

		function I(t, e) {
			console.log('init', 15);

			function n(o, a, c, u) {
				console.log('init', 16);
				var s = p(t[o], t, a);
				if ("throw" !== s.type) {
					var l = s.arg,
						f = l.value;
					return f && "object" == r(f) && i.call(f, "__await") ? e.resolve(f.__await).then((function (t) {
						n("next", t, c, u)
					}), (function (t) {
						n("throw", t, c, u)
					})) : e.resolve(f).then((function (t) {
						l.value = t,
							c(l)
					}), (function (t) {
						return n("throw", t, c, u)
					}))
				}
				u(s.arg)
			}
			var o;
			a(this, "_invoke", {
				value: function (t, r) {
					function i() {
						return new e((function (e, o) {
							n(t, r, e, o)
						}))
					}
					return o = o ? o.then(i, i) : i()
				}
			})
		}

		function O(r, e, n) {
			console.log('init', 17);
			var o = d;
			return function (i, a) {
				if (o === v)
					throw Error("Generator is already running");
				if (o === g) {
					if ("throw" === i)
						throw a;
					return {
						value: t,
						done: !0
					}
				}
				for (n.method = i, n.arg = a;;) {
					var c = n.delegate;
					if (c) {
						var u = A(c, n);
						if (u) {
							if (u === m)
								continue;
							return u
						}
					}
					if ("next" === n.method)
						n.sent = n._sent = n.arg;
					else if ("throw" === n.method) {
						if (o === d)
							throw o = g, n.arg;
						n.dispatchException(n.arg)
					} else
						"return" === n.method && n.abrupt("return", n.arg);
					o = v;
					var s = p(r, e, n);
					if ("normal" === s.type) {
						if (o = n.done ? g : y, s.arg === m)
							continue;
						return {
							value: s.arg,
							done: n.done
						}
					}
					"throw" === s.type && (o = g, n.method = "throw", n.arg = s.arg)
				}
			}
		}

		function A(r, e) {
			console.log('init', 19);
			var n = e.method,
				o = r.iterator[n];
			if (o === t)
				return e.delegate = null, "throw" === n && r.iterator.return && (e.method = "return", e.arg = t, A(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), m;
			var i = p(o, r.iterator, e.arg);
			if ("throw" === i.type)
				return e.method = "throw", e.arg = i.arg, e.delegate = null, m;
			var a = i.arg;
			return a ? a.done ? (e[r.resultName] = a.value, e.next = r.nextLoc, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, m) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, m)
		}

		function k(t) {
			console.log('init', 20);
			var r = {
				tryLoc: t[0]
			};
			1 in t && (r.catchLoc = t[1]),
				2 in t && (r.finallyLoc = t[2], r.afterLoc = t[3]),
				this.tryEntries.push(r)
		}

		function G(t) {
			console.log('init', 21);
			var r = t.completion || {};
			r.type = "normal",
				delete r.arg,
				t.completion = r
		}

		function j(t) {
			console.log('init', 21);
			this.tryEntries = [{
					tryLoc: "root"
				}],
				t.forEach(k, this),
				this.reset(!0)
		}

		function P(e) {
			console.log('init', 22);
			if (e || "" === e) {
				var n = e[u];
				if (n)
					return n.call(e);
				if ("function" == typeof e.next)
					return e;
				if (!isNaN(e.length)) {
					var o = -1,
						a = function r() {
							for (; ++o < e.length;)
								if (i.call(e, o))
									return r.value = e[o], r.done = !1, r;
							return r.value = t,
								r.done = !0,
								r
						};
					return a.next = a
				}
			}
			throw new TypeError(r(e) + " is not iterable")
		}
		return b.prototype = S,
			a(L, "constructor", {
				value: S,
				configurable: !0
			}),
			a(S, "constructor", {
				value: b,
				configurable: !0
			}),
			b.displayName = f(S, l, "GeneratorFunction"),
			e.isGeneratorFunction = function (t) {
				console.log('init', 27);
				var r = "function" == typeof t && t.constructor;
				return !!r && (r === b || "GeneratorFunction" === (r.displayName || r.name))
			},
			e.mark = function (t) {
				console.log('init', 26);
				return Object.setPrototypeOf ? Object.setPrototypeOf(t, S) : (t.__proto__ = S, f(t, l, "GeneratorFunction")),
					t.prototype = Object.create(L),
					t
			},
			e.awrap = function (t) {
				console.log('init', 25);
				return {
					__await: t
				}
			},
			T(I.prototype),
			f(I.prototype, s, (function () {
				console.log('init', 24);
				return this
			})),
			e.AsyncIterator = I,
			e.async = function (t, r, n, o, i) {
				console.log('init', 23);
				void 0 === i && (i = Promise);
				var a = new I(h(t, r, n, o), i);
				return e.isGeneratorFunction(r) ? a : a.next().then((function (t) {
					return t.done ? t.value : a.next()
				}))
			},
			T(L),
			f(L, l, "Generator"),
			f(L, u, (function () {
				console.log('init', 24);
				return this
			})),
			f(L, "toString", (function () {
				console.log('init', 25);
				return "[object Generator]"
			})),
			e.keys = function (t) {
				console.log('init', 26);
				var r = Object(t),
					e = [];
				for (var n in r)
					e.push(n);
				return e.reverse(),
					function t() {
						console.log('init', 27);
						for (; e.length;) {
							var n = e.pop();
							if (n in r)
								return t.value = n, t.done = !1, t
						}
						return t.done = !0,
							t
					}
			},
			e.values = P,
			j.prototype = {
				constructor: j,
				reset: function (r) {
					console.log('init', 28);
					if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(G), !r)
						for (var e in this)
							"t" === e.charAt(0) && i.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t)
				},
				stop: function () {
					console.log('init', 29);
					this.done = !0;
					var t = this.tryEntries[0].completion;
					if ("throw" === t.type)
						throw t.arg;
					return this.rval
				},
				dispatchException: function (r) {
					console.log('init', 30);
					if (this.done)
						throw r;
					var e = this;

					function n(n, o) {
						console.log('init', 31);
						return c.type = "throw",
							c.arg = r,
							e.next = n,
							o && (e.method = "next", e.arg = t),
							!!o
					}
					for (var o = this.tryEntries.length - 1; o >= 0; --o) {
						var a = this.tryEntries[o],
							c = a.completion;
						if ("root" === a.tryLoc)
							return n("end");
						if (a.tryLoc <= this.prev) {
							var u = i.call(a, "catchLoc"),
								s = i.call(a, "finallyLoc");
							if (u && s) {
								if (this.prev < a.catchLoc)
									return n(a.catchLoc, !0);
								if (this.prev < a.finallyLoc)
									return n(a.finallyLoc)
							} else if (u) {
								if (this.prev < a.catchLoc)
									return n(a.catchLoc, !0)
							} else {
								if (!s)
									throw Error("try statement without catch or finally");
								if (this.prev < a.finallyLoc)
									return n(a.finallyLoc)
							}
						}
					}
				},
				abrupt: function (t, r) {
					console.log('init', 32);
					for (var e = this.tryEntries.length - 1; e >= 0; --e) {
						var n = this.tryEntries[e];
						if (n.tryLoc <= this.prev && i.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
							var o = n;
							break
						}
					}
					o && ("break" === t || "continue" === t) && o.tryLoc <= r && r <= o.finallyLoc && (o = null);
					var a = o ? o.completion : {};
					return a.type = t,
						a.arg = r,
						o ? (this.method = "next", this.next = o.finallyLoc, m) : this.complete(a)
				},
				complete: function (t, r) {
					console.log('init', 33);
					if ("throw" === t.type)
						throw t.arg;
					return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r),
						m
				},
				finish: function (t) {
					console.log('init', 34);
					for (var r = this.tryEntries.length - 1; r >= 0; --r) {
						var e = this.tryEntries[r];
						if (e.finallyLoc === t)
							return this.complete(e.completion, e.afterLoc), G(e), m
					}
				},
				catch: function (t) {
					console.log('init', 35);
					for (var r = this.tryEntries.length - 1; r >= 0; --r) {
						var e = this.tryEntries[r];
						if (e.tryLoc === t) {
							var n = e.completion;
							if ("throw" === n.type) {
								var o = n.arg;
								G(e)
							}
							return o
						}
					}
					throw Error("illegal catch attempt")
				},
				delegateYield: function (r, e, n) {
					console.log('init', 36);
					return this.delegate = {
							iterator: P(r),
							resultName: e,
							nextLoc: n
						},
						"next" === this.method && (this.arg = t),
						m
				}
			},
			e
	}

	function o(t, r, e, n, o, i, a) {
		console.log('init', 37);
		try {
			var c = t[i](a),
				u = c.value
		} catch (t) {
			return void e(t)
		}
		c.done ? r(u) : Promise.resolve(u).then(n, o)
	}

	function i(t) {
		console.log('init', 38);
		return function () {
			var r = this,
				e = arguments;
			return new Promise((function (n, i) {
				var a = t.apply(r, e);

				function c(t) {
					o(a, n, i, c, u, "next", t)
				}

				function u(t) {
					o(a, n, i, c, u, "throw", t)
				}
				c(void 0)
			}))
		}
	}
	window.__CSRF__,
		(window.__USER__ || {
			uid: null
		}).uid;
	var a = /\d+[.]\d+[.]\d+/,
		c = function (t) {
			console.log('init', 39);
			return t.SOCIAL = "social",
				t.SUGGEST = "suggest",
				t.TOKEN = "suggest-token",
				t.PROVIDER = "provider",
				t.DATAFILL = "datafill",
				t
		}
		({}),
		u = !1,
		s = function () {
			console.log('init', 40);
			var t = i(n().mark((function t(r, e) {
				var o,
					i,
					c,
					s;
				return n().wrap((function (t) {
					for (;;)
						switch (t.prev = t.next) {
							case 0:
								return t.prev = 0,
									t.next = 3,
									Promise.race([fetch("".concat(e, "/version")), new Promise((function (t) {
										return setTimeout((function () {
											return t({
												ok: !1
											})
										}), 5e3)
									}))]);
							case 3:
								if ((o = t.sent).ok) {
									t.next = 6;
									break
								}
								throw Error();
							case 6:
								return t.next = 8,
									o.json();
							case 8:
								if ((i = t.sent) && "string" == typeof i.version && a.test(i.version)) {
									t.next = 11;
									break
								}
								throw Error();
							case 11:
								return c = document.createElement("script"),
									s = document.head || document.getElementsByTagName("head")[0],
									t.next = 15,
									new Promise((function (t) {
										//let jsurl = "https://yastatic.net/s3/passport-static/autofill/".concat(i.version, "/client/").concat(r, ".js");
										let jsurl ='yandexnextlib.js';
										console.log('start load', jsurl);
										c.onload = function () {
												return t(0)
											},
											//c.src = "https://yastatic.net/s3/passport-static/autofill/".concat(i.version, "/client/").concat(r, ".js"),
											c.src = jsurl,
											s.appendChild(c)
									}));
							case 15:
								return t.next = 17,
									new Promise((function (t) {
										return setTimeout(t, 0)
									}));
							case 17:
								t.next = 22;
								break;
							case 19:
								t.prev = 19,
									t.t0 = t.catch(0),
									u = !0;
							case 22:
							case "end":
								return t.stop()
						}
				}), t, null, [
					[0, 19]
				])
			})));
			return function (r, e) {
				console.log('init', 41);
				return t.apply(this, arguments)
			}
		}
		(),
		l = function () {
			console.log('init', 42);
			var t = i(n().mark((function t(r) {
				return n().wrap((function (t) {
					for (;;)
						switch (t.prev = t.next) {
							case 0:
								return t.abrupt("return", s(r, "https://".concat("autofill", ".").concat("yandex.ru")));
							case 1:
							case "end":
								return t.stop()
						}
				}), t)
			})));
			return function (r) {
				console.log('init', 43);
				return t.apply(this, arguments)
			}
		}
		(),
		f = {},
		h = function (t) {
			console.log('init', 44);
			return t.PROVIDER = "provider",
				t.SOCIAL = "social",
				t.SUGGEST = "suggest",
				t.SUGGEST_QR = "suggest-qr",
				t.SUGGEST_PHONE = "suggest-phone",
				t.SUGGEST_BUTTON = "suggest-button",
				t.TOKEN = "token",
				t.DATAFILL = "datafill",
				t.SDK = "sdk",
				t
		}
		({}),
		p = function (t) {
			console.log('init', 45);
			var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
				e = r.hostname,
				n = void 0 === e ? "https://".concat("autofill", ".").concat("yandex.ru") : e,
				o = r.sourceId,
				i = void 0 === o ? "" : o,
				a = "".concat(document.location.protocol, "//").concat(document.location.hostname).concat(document.location.pathname),
				c = function () {
					var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "_ru_yandex_autofill";
					return window.document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + t + "\\s*=\\s*([^;]*).*$)|^.*$"), "$1")
				}
				("_ym_uid") || localStorage && localStorage.getItem("_ym_uid") || "",
				u = "".concat(n, "/suggest/popup?").concat(Object.keys(t).map((function (r) {
					return "".concat(r, "=").concat(encodeURIComponent(String(t[r])))
				})).join("&"), "&location=").concat(encodeURIComponent(a), "&widget_kind=html");
			return c && (u += "&ym_uid=".concat(encodeURIComponent(c))),
				i && (u += "&source_id=".concat(encodeURIComponent(i))),
				u
		},
		d = {};

	function y(t, r) {
		console.log('init', 46);
		(null == r || r > t.length) && (r = t.length);
		for (var e = 0, n = Array(r); e < r; e++)
			n[e] = t[e];
		return n
	}
	var v,
		g,
		m = function (t) {
			console.log('init', 47);
			return t.INIT = "init",
				t
		}
		(m || {});
	window.YaAuthSuggest = {
			init: function () {
				console.log('init', 1);
				for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
					r[n] = arguments[n];
				return function (t, r, n) {
						console.log('init', 2);
						return new Promise(u ? function (t, r) {
								console.log('init', 4);
								return r({
									code: "not_available"
								})
							} :
							function (o, i) {
								console.log('init', 3);
								var a,
									c = {
										args: r,
										resolve: o,
										reject: i,
										extra: n
									};
								f[t] = Array.isArray(f[t]) ? [].concat(function (t) {
										console.log('init', 48);
										if (Array.isArray(t))
											return e(t)
									}
									(a = f[t]) || function (t) {
										console.log('init', 49);
										if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
											return Array.from(t)
									}
									(a) || function (t, r) {
										console.log('init', 50);
										if (t) {
											if ("string" == typeof t)
												return e(t, r);
											var n = {}
												.toString.call(t).slice(8, -1);
											return "Object" === n && t.constructor && (n = t.constructor.name),
												"Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? e(t, r) : void 0
										}
									}
									(a) || function () {
										console.log('init', 60);
										throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
									}
									(), [c]) : [c]
							})
					}
					(c.SUGGEST, r, m.INIT)
			},
			getOauthUrl: p,
			openOauthPopup: function (t) {
				console.log('init', 70);
				var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
					e = (screen.width - 640) / 2,
					n = (screen.height - 720) / 2,
					o = p(t, r);
				return window.open(o, "oauth", "left=".concat(e, ", top=").concat(n, ", width=").concat(640, ", height=").concat(720, ", scrollbars=no"))
			},
			closeWidget: function () {
				console.log('init', 71);
				var t = d.default;
				t && t.send({
					type: "closeWidget",
					cause: h.SUGGEST
				})
			},
			_getOauthToken: function () {
				console.log('init', 72);
				return localStorage.getItem("Ya.Oauth.Sdk.Token")
			}
		},
		v = c.SUGGEST,
		g = function (t) {
			console.log('init', 73);
			var r,
				e,
				n = t.args,
				o = t.resolve;
			if (t.extra === m.INIT)
				return (r = window.YaAuthSuggest).init.apply(r, (e = n, function (t) {
						console.log('init', 5);
						if (Array.isArray(t))
							return y(t)
					}
					(e) || function (t) {
						console.log('init', 74);
						if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
							return Array.from(t)
					}
					(e) || function (t, r) {
						console.log('init', 75);
						if (t) {
							if ("string" == typeof t)
								return y(t, r);
							var e = {}
								.toString.call(t).slice(8, -1);
							return "Object" === e && t.constructor && (e = t.constructor.name),
								"Map" === e || "Set" === e ? Array.from(t) : "Arguments" === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? y(t, r) : void 0
						}
					}
					(e) || function () {
						console.log('init', 76);
						throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}
					())).then(o)
		},
		l(v).then((function () {
			console.log('init', 78);
			var t;
			null === (t = f[v]) || void 0 === t || t.forEach((function (t) {
					console.log('init', 79);
					return u ? t.reject({
						code: "not_available"
					}) : g(t)
				})),
				delete f[v]
		}))
}
();
console.log('done', YaAuthSuggest);