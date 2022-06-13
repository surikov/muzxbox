class XV {
	name: string;
	value: string;
	content: XV[];
	constructor(name: string, value: string, children: XV[]) {
		this.name = name;
		this.value = value;
		this.content = children;
	}
	clone(): XV {
		var r = new XV('', '', []);
		r.name = this.name;
		r.value = this.value;
		r.content = [];
		for (var i = 0; i < this.content.length; i++) {
			r.content.push(this.content[i].clone());
		}
		return r;
	}
	first(name: string): XV {
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				return this.content[i];
			}
		}
		return new XV('', '', []);
	}
	exists(name: string): boolean {
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				return true;
			}
		}
		return false;
	}
	every(name: string): XV[] {
		let r: XV[] = [];
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				r.push(this.content[i]);
			}
		}
		return r;
	}
	seek(name: string, subname: string, subvalue: string): XV {
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				var t = this.content[i].first(subname);
				if (t.value == subvalue) {
					return this.content[i];
				}
			}
		}
		return new XV('', '', []);
	}
	readDocChildren(node: any): XV[] {
		let children: XV[] = [];
		if (node.children) {
			for (let i = 0; i < node.children.length; i++) {
				let c = node.children[i];
				let t = '';
				if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
					t = ('' + c.childNodes[0].nodeValue).trim();
				}
				children.push(new XV(c.localName, t, this.readDocChildren(c)));
			}
		}
		if (node.attributes) {
			for (let i = 0; i < node.attributes.length; i++) {
				let a = node.attributes[i];
				children.push(new XV(a.localName, a.value, []));
			}
		}
		return children;
	}
	fill(document: Document) {
		var tt: XV[] = this.readDocChildren(document);
		if (tt.length > 0) {
			this.name = tt[0].name;
			this.value = tt[0].value;
			this.content = tt[0].content;
		}
	}
}


