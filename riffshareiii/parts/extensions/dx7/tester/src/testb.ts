/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 *
 * Algebraic solver by Dmitry Baranovskiy
 * http://dmitry.baranovskiy.com/bezier-easing.html
 */
/*
function LinearEasing(x: number) {
	return x;
}

let { cbrt, sqrt, PI: π } = Math;

// Solve cubic bezier x(t) = x for t using Cardano's formula
// Parameters are precomputed coefficients from the bezier control points
let x2t = (x: number, a: number, b: number, c: number, d: number) => {
	let q = a + b * x;
	let s = q ** 2 + c;
	if (s > 0) {
		let root = sqrt(s);
		return cbrt(q + root) + cbrt(q - root) - d;
	}
	let l = cbrt(sqrt(q * q - s));
	let angle = q ? Math.atan(sqrt(-s) / q) : -π / 2;
	let φ;
	if (b < 0) {
		φ = (q > 0 ? 2 * π : π) - angle;
	} else if (d < 0) {
		φ = (q > 0 ? 2 * π : -3 * π) + angle;
	} else {
		φ = (q > 0 ? 0 : π) + angle;
	}
	return 2 * l * Math.cos(φ / 3) - d;
};

let Y = (t: number, ay: number, by: number, cy: number) => ((ay * t + 3 * by) * t + cy) * t;

function bezier(mX1: number, mY1: number, mX2: number, mY2: number) {
	if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
		throw new Error("bezier x values must be in [0, 1] range");
	}

	if (mX1 === mY1 && mX2 === mY2) {
		return LinearEasing;
	}

	let a = 6 * (3 * mX1 - 3 * mX2 + 1);
	let b = 6 * (mX2 - 2 * mX1);
	let c = 3 * mX1;

	let a2 = a * a;
	let b2 = b * b;

	let d = b / a;
	let e = (3 * b * c) / a2 - (b2 * b) / (a2 * a);
	let w1 = (2 * c) / a - b2 / a2;
	let w = w1 * w1 * w1;
	let o = 3 / a;

	let ay = 3 * mY1 - 3 * mY2 + 1;
	let by = mY2 - 2 * mY1;
	let cy = 3 * mY1;

	let X2T = a ? x2t : LinearEasing;

	return function BezierEasing(x: number) {
		if (x === 0 || x === 1) {
			return x;
		}
		return Y(X2T(x, e, o, w, d), ay, by, cy);
	};
}
*/
//
function _Y(t: number, ay: number, by: number, cy: number): number {
	return ((ay * t + 3 * by) * t + cy) * t;
}
function _x2t(xx: number, aa: number, bb: number, cc: number, dd: number): number {
	let qq = aa + bb * xx;
	//let s = q ** 2 + c;
	let ss = Math.pow(qq, 2) + cc;
	if (ss > 0) {
		let root = Math.sqrt(ss);
		return Math.cbrt(qq + root) + Math.cbrt(qq - root) - dd;
	}
	let ll = Math.cbrt(Math.sqrt(qq * qq - ss));
	let angle = qq ? Math.atan(Math.sqrt(-ss) / qq) : -Math.PI / 2;
	let ff;
	if (bb < 0) {
		//ff = (qq > 0 ? 2 * Math.PI : Math.PI) - angle;
		if (qq > 0) {
			ff = 2 * Math.PI - angle;
		} else {
			ff = Math.PI - angle;
		}
	} else {
		if (dd < 0) {
			//ff = (qq > 0 ? 2 * Math.PI : -3 * Math.PI) + angle;
			if (qq > 0) {
				ff = 2 * Math.PI + angle;
			} else {
				ff = -3 * Math.PI + angle;
			}
		} else {
			//ff = (qq > 0 ? 0 : Math.PI) + angle;
			if (qq > 0) {
				ff = angle;
			} else {
				ff = Math.PI + angle;
			}
		}
	}
	return 2 * ll * Math.cos(ff / 3) - dd;
};
function yBezier(xx: number, mX1: number, mY1: number, mX2: number, mY2: number): number {
	if (xx === 0 || xx === 1) {
		return xx;
	}
	if (mX1 === mY1 && mX2 === mY2) {
		//return LinearEasing;
		return xx;
	}

	let aa = 6 * (3 * mX1 - 3 * mX2 + 1);
	let bb = 6 * (mX2 - 2 * mX1);
	let cc = 3 * mX1;

	let a2 = aa * aa;
	let b2 = bb * bb;

	let dd = bb / aa;
	let ee = (3 * bb * cc) / a2 - (b2 * bb) / (a2 * aa);
	let w1 = (2 * cc) / aa - b2 / a2;
	let ww = w1 * w1 * w1;
	let oo = 3 / aa;

	let ay = 3 * mY1 - 3 * mY2 + 1;
	let by = mY2 - 2 * mY1;
	let cy = 3 * mY1;

	//let X2T = aa ? x2t : LinearEasing;
	if (aa) {
		return _Y(_x2t(xx, ee, oo, ww, dd), ay, by, cy);
	} else {
		return _Y(xx, ay, by, cy);
	}
	//return Y(X2T(xx, ee, oo, ww, dd), ay, by, cy);
};
