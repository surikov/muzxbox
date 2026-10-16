class RPPWriter {
	composeReaperProject(zvoogProject: Zvoog_Project): string {
		let rpp = new TreeValue('REAPER_PROJECT', '', []).advance('_', ['0.1', '"6.13/OSX64"', '1596463849']);
		rpp.first('_RIPPLE').advance('_', ['0']);
		rpp.first('_GROUPOVERRIDE').advance('_', ['0', '0', '0']);
		rpp.first('RECORD_CFG');
		rpp.first('METRONOME').advance('_', ['6', '2']);
		rpp.first('METRONOME').first('_VOL').advance('_', ['0.25', '0.125']);
		rpp.first('METRONOME').first('_FREQ').advance('_', ['800', '1600', '1']);
		rpp.first('METRONOME').first('_BEATLEN').advance('_', ['4']);
		rpp.first('METRONOME').first('_SAMPLES').advance('_', ['""', '""']);
		rpp.first('METRONOME').first('_PATTERN').advance('_', ['2863311530', '2863311529']);
		return this.rpp2text('', rpp);
	}
	rpp2text(pad: string, tree: TreeValue): string {
		let crlf = '\r\n';
		let rpptxt = '';
		let rline = pad + '<' + tree.name;
		for (let ii = 0; ii < tree.content.length; ii++) {
			if (tree.content[ii].name == '_') {
				rline = rline + ' ' + tree.content[ii].value;
			}
		}
		//console.log(rline);
		rpptxt = rpptxt + rline;
		for (let kk = 0; kk < tree.content.length; kk++) {
			let subtree = tree.content[kk];
			if (subtree.name == '_') {
				//
			} else {
				if (subtree.name.startsWith('_')) {
					//console.log(pad + '  ' + tree.content[ii].name.substring(1));
					let subline = pad + '  ' + subtree.name.substring(1);
					for (let nn = 0; nn < subtree.content.length; nn++) {
						if (subtree.content[nn].name == '_') {
							subline = subline + ' ' + subtree.content[nn].value;
						}
					}
					//console.log(subline);
					rpptxt = rpptxt + crlf + subline;
				} else {
					rpptxt = rpptxt + crlf + this.rpp2text(pad + '  ', subtree);
				}
			}
		}
		//console.log(pad + '>');
		rpptxt = rpptxt + crlf + pad + '>';
		return rpptxt;
	}
	/*
	dumpRPP(pad: string, tree: TreeValue) {
		//tree.dump('', '	');
		let rline = pad + '<' + tree.name;
		for (let ii = 0; ii < tree.content.length; ii++) {
			if (tree.content[ii].name == '_') {
				rline = rline + ' ' + tree.content[ii].value;
			}
		}
		console.log(rline);
		for (let kk = 0; kk < tree.content.length; kk++) {
			let subtree = tree.content[kk];
			if (subtree.name == '_') {
				//
			} else {
				if (subtree.name.startsWith('_')) {
					//console.log(pad + '  ' + tree.content[ii].name.substring(1));
					let subline = pad + '  ' + subtree.name.substring(1);
					for (let nn = 0; nn < subtree.content.length; nn++) {
						if (subtree.content[nn].name == '_') {
							subline = subline + ' ' + subtree.content[nn].value;
						}
					}
					console.log(subline);
				} else {
					this.dumpRPP(pad + '  ', subtree);
				}
			}
		}
		console.log(pad + '>');
	}
	*/
	/*
	function startTest() {
		let rpp = new TreeValue('REAPER_PROJECT', '', []).advance('_', ['0.1', '"6.13/OSX64"', '1596463849']);
		rpp.first('_RIPPLE').advance('_', ['0']);
		rpp.first('_GROUPOVERRIDE').advance('_', ['0', '0', '0']);
		rpp.first('RECORD_CFG');
		rpp.first('METRONOME').advance('_', ['6', '2']);
		rpp.first('METRONOME').first('_VOL').advance('_', ['0.25', '0.125']);
		rpp.first('METRONOME').first('_FREQ').advance('_', ['800', '1600', '1']);
		rpp.first('METRONOME').first('_BEATLEN').advance('_', ['4']);
		rpp.first('METRONOME').first('_SAMPLES').advance('_', ['""', '""']);
		rpp.first('METRONOME').first('_PATTERN').advance('_', ['2863311530', '2863311529']);
	
	
		//rpp.content.push(new TreeValue('_','0.1',[]));
		dumpRPP('', rpp);
	}
	*/

}
