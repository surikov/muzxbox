console.log('start');


//import fs from "node:fs";
//import path from "node:path";

// NOTE: `region` and `marker` come from the Python `reathon.helper` module,
// which has no direct JavaScript equivalent here. Provide implementations
// with the same behavior before using addMarker/addRegion.
function marker(index, time, name, color) {
	throw new Error("marker() helper from reathon.helper is not implemented in JavaScript");
}

function region(index, start, end, name, color) {
	throw new Error("region() helper from reathon.helper is not implemented in JavaScript");
}

class ReaperNode {
	// JavaScript cannot touch `this` before `super()`, so child validation and
	// naming are done by subclasses after `super(kwargs)`, followed by `this.add(...)`.
	nodes: string[];
	props: string[];
	parents: string[];
	name: string;
	constructor(nodesToAdd,kwargs ) {
		this.nodes = [];
		this.props = [];
		this.parents = [];
		this.add(nodesToAdd);
		for (const [prop, value] of Object.entries(kwargs)) {
			let v = value;
			if (typeof v === "string") {
				v = `"${v}"`;
			}
			this.props.push([prop.toUpperCase(), v]);
		}
	}

	add(...nodesToAdd) {
		for (const node of nodesToAdd) {
			if (node instanceof this.validChildren) {
				this.nodes.push(node);
				node.parents.push(this); // add `this` to the parents of the node
			} else {
				console.log(`You cannot add a ${node.name} to a ${this.name}`);
			}
		}
		return this;
	}
}

class ReaperProject extends ReaperNode {
	constructor(nodesToAdd = [], kwargs = {}) {
		super(kwargs);
		this.name = "REAPER_PROJECT";
		this.validChildren = Track;
		this.string = "";
		this.add(...nodesToAdd);
	}

	traverse(origin) {
		this.string += `<${origin.name}\n`;

		for (const [key, value] of origin.props) {
			this.string += `${key} ${value}\n`;
		}

		for (const node of origin.nodes) {
			this.traverse(node);
		}
		this.string += ">\n";
	}

	write(filePath) {
		this.traverse(this);
		fs.writeFileSync(filePath, this.string, { encoding: "utf8" });
	}

	addMarker(index, time, name, color = 0) {
		const newMarker = marker(index, time, name, color);
		this.props.push(newMarker);
	}

	addRegion(index, start, end, name, color = 0) {
		const newRegion = region(index, start, end, name, color);
		this.props.push(...newRegion);
	}
}

class ReaperTrack extends ReaperNode {
	constructor(nodesToAdd = [], kwargs = {}) {
		super(kwargs);
		this.name = "TRACK";
		this.validChildren = Item;
		this.add(...nodesToAdd);
	}
}

class ReaperItem extends ReaperNode {
	constructor(nodesToAdd = [], kwargs = {}) {
		super(kwargs);
		this.name = "ITEM";
		this.validChildren = Source;
		this.add(...nodesToAdd);
	}
}

class ReaperSource extends ReaperNode {
	constructor(nodesToAdd = [], kwargs = {}) {
		super(kwargs);
		this.validChildren = Source;
		this.extensionLookup = {
			".wav": "WAVE",
			".wave": "WAVE",
			".aiff": "WAVE",
			".aif": "WAVE",
			".mp3": "MP3",
			".ogg": "VORBIS",
			".flac": "FLAC",
		};
		this.file = kwargs.file;
		this.processExtension();
		this.add(...nodesToAdd);
	}

	processExtension() {
		// Path values are plain strings in JavaScript; path.extname mirrors Path.suffix.
		const ext = path.extname(this.file);
		if (Object.prototype.hasOwnProperty.call(this.extensionLookup, ext)) {
			this.name = `SOURCE ${this.extensionLookup[ext]}`;
		} else {
			this.name = "SOURCE SECTION";
		}
	}
}

//export { Node, Project, Track, Item, Source };