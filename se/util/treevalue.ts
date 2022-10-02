class TreeValue {
	name: string;
	value: string;
	content: TreeValue[];
	constructor(name: string, value: string, children: TreeValue[]) {
		this.name = name;
		this.value = value;
		this.content = children;
	}
	clone(): TreeValue {
		var r = new TreeValue('', '', []);
		r.name = this.name;
		r.value = this.value;
		r.content = [];
		for (var i = 0; i < this.content.length; i++) {
			r.content.push(this.content[i].clone());
		}
		return r;
	}
	first(name: string): TreeValue {
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				return this.content[i];
			}
		}
		return new TreeValue('', '', []);
	}
	exists(name: string): boolean {
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				return true;
			}
		}
		return false;
	}
	every(name: string): TreeValue[] {
		let r: TreeValue[] = [];
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				r.push(this.content[i]);
			}
		}
		return r;
	}
	seek(name: string, subname: string, subvalue: string): TreeValue {
		for (let i = 0; i < this.content.length; i++) {
			if (this.content[i].name == name) {
				var t = this.content[i].first(subname);
				if (t.value == subvalue) {
					return this.content[i];
				}
			}
		}
		return new TreeValue('', '', []);
	}
	readDocChildren(node: any): TreeValue[] {
		let children: TreeValue[] = [];
		if (node.children) {
			for (let i = 0; i < node.children.length; i++) {
				let c = node.children[i];
				let t = '';
				if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
					t = ('' + c.childNodes[0].nodeValue).trim();
				}
				children.push(new TreeValue(c.localName, t, this.readDocChildren(c)));
			}
		}
		if (node.attributes) {
			for (let i = 0; i < node.attributes.length; i++) {
				let a = node.attributes[i];
				children.push(new TreeValue(a.localName, a.value, []));
			}
		}
		return children;
	}
	fill(document: Document) {
		var tt: TreeValue[] = this.readDocChildren(document);
		if (tt.length > 0) {
			this.name = tt[0].name;
			this.value = tt[0].value;
			this.content = tt[0].content;
		}
	}
}


