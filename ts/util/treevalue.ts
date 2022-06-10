class Extra {
	name: string;
	value: string;
	brood: Extra[];
	constructor(name: string, value: string, children: Extra[]) {
		this.name = name;
		this.value = value;
		this.brood = children;
	}
	clone(): Extra {
		var r = new Extra('', '', []);
		r.name = this.name;
		r.value = this.value;
		r.brood = [];
		for (var i = 0; i < this.brood.length; i++) {
			r.brood.push(this.brood[i].clone());
		}
		return r;
	}
	first(name: string): Extra {
		for (let i = 0; i < this.brood.length; i++) {
			if (this.brood[i].name == name) {
				return this.brood[i];
			}
		}
		return new Extra('', '', []);
	}
	every(name: string): Extra[] {
		let r: Extra[] = [];
		for (let i = 0; i < this.brood.length; i++) {
			if (this.brood[i].name == name) {
				r.push(this.brood[i]);
			}
		}
		return r;
	}
	seek(name: string, subname: string, subvalue: string): Extra {
		for (let i = 0; i < this.brood.length; i++) {
			if (this.brood[i].name == name) {
				var t = this.brood[i].first(subname);
				if (t.value == subvalue) {
					return this.brood[i];
				}
			}
		}
		return new Extra('', '', []);
	}
	readDocChildren(node: any): Extra[] {
		let children: Extra[] = [];
		if (node.children) {
			for (let i = 0; i < node.children.length; i++) {
				let c = node.children[i];
				let t = '';
				if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
					t = ('' + c.childNodes[0].nodeValue).trim();
				}
				children.push(new Extra(c.localName, t, this.readDocChildren(c)));
			}
		}
		if (node.attributes) {
			for (let i = 0; i < node.attributes.length; i++) {
				let a = node.attributes[i];
				children.push(new Extra(a.localName, a.value, []));
			}
		}
		return children;
	}
	fill(document: Document) {
		var tt: Extra[] = this.readDocChildren(document);
		if (tt.length > 0) {
			this.name = tt[0].name;
			this.value = tt[0].value;
			this.brood = tt[0].brood;
		}
	}
}


