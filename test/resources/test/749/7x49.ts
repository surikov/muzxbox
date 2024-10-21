declare var datahtml:string;
//tsc C:\Users\surikov\Desktop\7x49.html.ts C:\Users\surikov\Desktop\7x49.ts --target esnext --outfile C:\Users\surikov\Desktop\7x49run.js
//node C:\Users\surikov\Desktop\7x49run.js
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
        let tv = new TreeValue(name, '', []);
        this.content.push(tv);
        return tv;
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
		//console.log('readDocChildren',node);
        let children: TreeValue[] = [];
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let c = node.childNodes[i];
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
    fillFromDocument(document: Document) {
        var tt: TreeValue[] = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.content = tt[0].content;
        }
    }
    fillFromXMLstring(xml: string) {
        var windowDOMParser = new window.DOMParser();
        var dom = windowDOMParser.parseFromString(xml, "text/xml");
		//console.log('fillFromXMLstring',dom);
		//console.dir(dom);
        //this.readDocChildren(dom.childNodes);
		this.content=this.readDocChildren(dom);
    };
    readObjectChildren(oo: Object) {
        //console.log('oo', oo);
        if (oo) {
            let keys: string[] = Object.keys(oo);
            for (let ii = 0; ii < keys.length; ii++) {
                let key: string = keys[ii];
                let value: any = oo[keys[ii]];
                if (Array.isArray(value)) {
                    //console.log('array', ii, key, value);
                    for (let nn = 0; nn < value.length; nn++) {
                        let subValue = value[nn];
                        let tv = new TreeValue(key, '', []);
                        if (Array.isArray(subValue)) {
                            tv.readObjectChildren(subValue);
                        } else {
                            if (typeof value === 'object') {
                                tv.readObjectChildren(subValue);
                            } else {
                                tv.value = '' + subValue;
                            }
                        }
                        this.content.push(tv);
                    }
                } else {
                    if (typeof value === 'object') {
                        //console.log('object', ii, key, value);
                        let tv = new TreeValue(key, '', []);
                        tv.readObjectChildren(value);
                        this.content.push(tv);
                    } else {
                        //console.log('raw', ii, key, value);
                        this.content.push(new TreeValue(key, '' + value, []));
                        //let tv=new TreeValue(key,''+value,[]);
                    }
                }

            }
        }
    }
    fillFromJSONstring(json: string) {
        let oo: Object = JSON.parse(json);
        //console.log(oo);
        this.readObjectChildren(oo);
    }
    dump(pad: string, symbol: string) {
        console.log(pad, this.name, ':', this.value);
        for (var i = 0; i < this.content.length; i++) {
            this.content[i].dump(pad + symbol, symbol);
        }
    };
}
type BallsRow = {
	key: string;
	balls: number[];
};
function rundump(){
	let cellCount=49;
	let rows:BallsRow[]=[{key:'start',balls:[]}];
	//console.log(datahtml.length);
	let tree=new TreeValue('','',[]);
	tree.fillFromXMLstring(datahtml);
	//tree.dump(' ',' ');
	let list:TreeValue[]=tree.first('div').every('div');
	for(let ii=0;ii<list.length;ii++){
		let ballsRow:BallsRow={key:list[ii].first('div').first('button').value,balls:[]};
		rows.push(ballsRow);
		//console.log(list[ii].first('div').first('button').value);
		if(list[ii].every('div').length>0){
			let buttons=list[ii].every('div')[1].first('div').every('button');
			for(let kk=0;kk<buttons.length;kk++){
				if(buttons[kk].first('class').value.indexOf('BtnNumber_active')>-1){
					//console.log(kk,buttons[kk].value);
					ballsRow.balls.push(kk+1);
				}
			}
			//console.log(list[ii].every('div')[1].first('div').every('button'));
		}
	}
	console.log(JSON.stringify(rows));
}


