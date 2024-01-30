/*https://github.com/CoderLine/alphaTab
import { UnsupportedFormatError } from '@src/importer/UnsupportedFormatError';
import { AccentuationType } from '@src/model/AccentuationType';
import { Automation, AutomationType } from '@src/model/Automation';
import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { BendPoint } from '@src/model/BendPoint';
import { BrushType } from '@src/model/BrushType';
import { Chord } from '@src/model/Chord';
import { Clef } from '@src/model/Clef';
import { Color } from '@src/model/Color';
import { CrescendoType } from '@src/model/CrescendoType';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { Fermata, FermataType } from '@src/model/Fermata';
import { Fingers } from '@src/model/Fingers';
import { GraceType } from '@src/model/GraceType';
import { HarmonicType } from '@src/model/HarmonicType';
import { KeySignature } from '@src/model/KeySignature';
import { KeySignatureType } from '@src/model/KeySignatureType';
import { Lyrics } from '@src/model/Lyrics';
import { MasterBar } from '@src/model/MasterBar';
import { Note } from '@src/model/Note';
import { Ottavia } from '@src/model/Ottavia';
import { PickStroke } from '@src/model/PickStroke';
import { Score } from '@src/model/Score';
import { Section } from '@src/model/Section';
import { SimileMark } from '@src/model/SimileMark';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { Staff } from '@src/model/Staff';
import { Track } from '@src/model/Track';
import { TripletFeel } from '@src/model/TripletFeel';
import { VibratoType } from '@src/model/VibratoType';
import { Voice } from '@src/model/Voice';
import { Settings } from '@src/Settings';
import { XmlDocument } from '@src/xml/XmlDocument';

import { XmlNode, XmlNodeType } from '@src/xml/XmlNode';
import { MidiUtils } from '@src/midi/MidiUtils';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { NoteAccidentalMode } from '@src/model/NoteAccidentalMode';
import { PercussionMapper } from '@src/model/PercussionMapper';
import { InstrumentArticulation } from '@src/model/InstrumentArticulation';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { TextBaseline } from '@src/platform/ICanvas';
import { BeatCloner } from '@src/generated/model/BeatCloner';
import { NoteCloner } from '@src/generated/model/NoteCloner';
import { Logger } from '@src/Logger';
*/
class XmlWriter {
	public static write(xml: XmlNode, indention: string, xmlHeader: boolean): string {
		const writer = new XmlWriter(indention, xmlHeader);
		writer.writeNode(xml);
		return writer.toString();
	}

	// NOTE: we use the string.join variant rather than the
	// string concatenation for IE performnace concerns
	private _result: string[] = [];
	private _indention: string;
	private _xmlHeader: boolean;

	private _isStartOfLine: boolean;
	private _currentIndention: string;

	public constructor(indention: string, xmlHeader: boolean) {
		this._indention = indention;
		this._xmlHeader = xmlHeader;
		this._currentIndention = '';
		this._isStartOfLine = true;
	}

	public writeNode(xml: XmlNode) {
		switch (xml.nodeType) {
			case XmlNodeType.None:
				break;
			case XmlNodeType.Element:
				if (this._result.length > 0) {
					this.writeLine();
				}
				this.write(`<${xml.localName}`);
				for (const [name, value] of xml.attributes) {
					this.write(` ${name}="`);
					this.writeAttributeValue(value);
					this.write('"');
				}

				if (xml.childNodes.length === 0) {
					this.write('/>');
				} else {
					this.write('>');
					if (xml.childNodes.length === 1 && !xml.firstElement) {
						this.writeNode(xml.childNodes[0]);
					} else {
						this.indent();
						for (const child of xml.childNodes) {
							// skip text nodes in case of multiple children
							if (child.nodeType === XmlNodeType.Element) {
								this.writeNode(child);
							}
						}
						this.unindend();
						this.writeLine();
					}
					this.write(`</${xml.localName}>`);
				}
				break;
			case XmlNodeType.Text:
				if (xml.value) {
					this.write(xml.value);
				}
				break;
			case XmlNodeType.CDATA:
				if (xml.value !== null) {
					this.write(`<![CDATA[${xml.value}]]>`);
				}
				break;
			case XmlNodeType.Document:
				if (this._xmlHeader) {
					this.write('<?xml version="1.0" encoding="utf-8"?>');
				}
				for (const child of xml.childNodes) {
					this.writeNode(child);
				}
				break;
			case XmlNodeType.DocumentType:
				this.write(`<!DOCTYPE ${xml.value}>`);
				break;
		}
	}

	private unindend() {
		this._currentIndention = this._currentIndention.substr(
			0,
			this._currentIndention.length - this._indention.length
		);
	}
	private indent() {
		this._currentIndention += this._indention;
	}

	private writeAttributeValue(value: string) {
		for (let i = 0; i < value.length; i++) {
			const c = value.charAt(i);
			switch (c) {
				case '<':
					this._result.push('&lt;');
					break;
				case '>':
					this._result.push('&gt;');
					break;
				case '&':
					this._result.push('&amp;');
					break;
				case "'":
					this._result.push('&apos;');
					break;
				case '"':
					this._result.push('&quot;');
					break;
				default:
					this._result.push(c);
					break;
			}
		}
	}

	private write(s: string) {
		if (this._isStartOfLine) {
			this._result.push(this._currentIndention);
		}
		this._result.push(s);
		this._isStartOfLine = false;
	}

	private writeLine(s: string | null = null) {
		if (s) {
			this.write(s);
		}
		if (this._indention.length > 0 && !this._isStartOfLine) {
			this._result.push('\n');
			this._isStartOfLine = true;
		}
	}

	public toString() {
		return this._result.join('');//.trimRight();
	}
}
enum AlphaTabErrorType {
	General,
	Format,
	AlphaTex
}
class AlphaTabError extends Error {
	public inner: Error | null;
	public type: AlphaTabErrorType;

	public constructor(type: AlphaTabErrorType, message: string | null = "", inner?: Error) {
		// @ts-ignore
		super(message ?? "", { cause: inner });
		this.type = type;
		this.inner = inner ?? null;
		Object.setPrototypeOf(this, AlphaTabError.prototype);
	}
}
class XmlError extends AlphaTabError {
	public xml: string;
	public pos: number = 0;

	public constructor(message: string, xml: string, pos: number) {
		super(AlphaTabErrorType.Format, message);
		this.xml = xml;
		this.pos = pos;
		Object.setPrototypeOf(this, XmlError.prototype);
	}
}
enum XmlState {
	IgnoreSpaces,
	Begin,
	BeginNode,
	TagName,
	Body,
	AttribName,
	Equals,
	AttvalBegin,
	AttribVal,
	Childs,
	Close,
	WaitEnd,
	WaitEndRet,
	Pcdata,
	Header,
	Comment,
	Doctype,
	Cdata,
	Escape
}
class XmlParser {
	public static readonly CharCodeLF: number = 10;
	public static readonly CharCodeTab: number = 9;
	public static readonly CharCodeCR: number = 13;
	public static readonly CharCodeSpace: number = 32;
	public static readonly CharCodeLowerThan: number = 60;
	public static readonly CharCodeAmp: number = 38;
	public static readonly CharCodeBrackedClose: number = 93;
	public static readonly CharCodeBrackedOpen: number = 91;
	public static readonly CharCodeGreaterThan: number = 62;
	public static readonly CharCodeExclamation: number = 33;
	public static readonly CharCodeUpperD: number = 68;
	public static readonly CharCodeLowerD: number = 100;
	public static readonly CharCodeMinus: number = 45;
	public static readonly CharCodeQuestion: number = 63;
	public static readonly CharCodeSlash: number = 47;
	public static readonly CharCodeEquals: number = 61;
	public static readonly CharCodeDoubleQuote: number = 34;
	public static readonly CharCodeSingleQuote: number = 39;
	public static readonly CharCodeSharp: number = 35;
	public static readonly CharCodeLowerX: number = 120;
	public static readonly CharCodeLowerA: number = 97;
	public static readonly CharCodeLowerZ: number = 122;
	public static readonly CharCodeUpperA: number = 65;
	public static readonly CharCodeUpperZ: number = 90;
	public static readonly CharCode0: number = 48;
	public static readonly CharCode9: number = 57;
	public static readonly CharCodeColon: number = 58;
	public static readonly CharCodeDot: number = 46;
	public static readonly CharCodeUnderscore: number = 95;
	public static readonly CharCodeSemi: number = 59;

	private static Escapes: Map<string, string> = new Map<string, string>([
		['lt', '<'],
		['gt', '>'],
		['amp', '&'],
		['quot', '"'],
		['apos', "'"]
	]);

	public static parse(str: string, p: number, parent: XmlNode): number {
		let c: number = str.charCodeAt(p);
		let state: XmlState = XmlState.Begin;
		let next: XmlState = XmlState.Begin;
		let start: number = 0;
		let buf: string = '';
		let escapeNext: XmlState = XmlState.Begin;
		let xml: XmlNode | null = null;
		let aname: string | null = null;

		let nbrackets: number = 0;

		let attrValQuote: number = 0;

		while (p < str.length) {
			c = str.charCodeAt(p);
			switch (state) {
				case XmlState.IgnoreSpaces:
					switch (c) {
						case XmlParser.CharCodeLF:
						case XmlParser.CharCodeCR:
						case XmlParser.CharCodeTab:
						case XmlParser.CharCodeSpace:
							break;
						default:
							state = next;
							continue;
					}
					break;

				case XmlState.Begin:
					switch (c) {
						case XmlParser.CharCodeLowerThan:
							state = XmlState.IgnoreSpaces;
							next = XmlState.BeginNode;
							break;
						default:
							start = p;
							state = XmlState.Pcdata;
							continue;
					}
					break;

				case XmlState.Pcdata:
					if (c === XmlParser.CharCodeLowerThan) {
						buf += str.substr(start, p - start);
						let child: XmlNode = new XmlNode();
						child.nodeType = XmlNodeType.Text;
						child.value = buf;
						buf = '';
						parent.addChild(child);
						state = XmlState.IgnoreSpaces;
						next = XmlState.BeginNode;
					} else if (c === XmlParser.CharCodeAmp) {
						buf += str.substr(start, p - start);
						state = XmlState.Escape;
						escapeNext = XmlState.Pcdata;
						start = p + 1;
					}
					break;

				case XmlState.Cdata:
					if (
						c === XmlParser.CharCodeBrackedClose &&
						str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedClose &&
						str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan
					) {
						// ]]>
						let child: XmlNode = new XmlNode();
						child.nodeType = XmlNodeType.CDATA;
						child.value = str.substr(start, p - start);
						parent.addChild(child);
						p += 2;
						state = XmlState.Begin;
					}
					break;

				case XmlState.BeginNode:
					switch (c) {
						case XmlParser.CharCodeExclamation:
							if (str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedOpen) {
								p += 2;
								if (str.substr(p, 6).toUpperCase() !== 'CDATA[') {
									throw new XmlError('Expected <![CDATA[', str, p);
								}
								p += 5;
								state = XmlState.Cdata;
								start = p + 1;
							} else if (
								str.charCodeAt(p + 1) === XmlParser.CharCodeUpperD ||
								str.charCodeAt(p + 1) === XmlParser.CharCodeLowerD
							) {
								if (str.substr(p + 2, 6).toUpperCase() !== 'OCTYPE') {
									throw new XmlError('Expected <!DOCTYPE', str, p);
								}
								p += 8;
								state = XmlState.Doctype;
								start = p + 1;
							} else if (
								str.charCodeAt(p + 1) !== XmlParser.CharCodeMinus ||
								str.charCodeAt(p + 2) !== XmlParser.CharCodeMinus
							) {
								throw new XmlError('Expected <!--', str, p);
							} else {
								p += 2;
								state = XmlState.Comment;
								start = p + 1;
							}
							break;
						case XmlParser.CharCodeQuestion:
							state = XmlState.Header;
							start = p;
							break;
						case XmlParser.CharCodeSlash:
							if (!parent) {
								throw new XmlError('Expected node name', str, p);
							}
							start = p + 1;
							state = XmlState.IgnoreSpaces;
							next = XmlState.Close;
							break;
						default:
							state = XmlState.TagName;
							start = p;
							continue;
					}
					break;

				case XmlState.TagName:
					if (!XmlParser.isValidChar(c)) {
						if (p === start) {
							throw new XmlError('Expected node name', str, p);
						}
						xml = new XmlNode();
						xml.nodeType = XmlNodeType.Element;
						xml.localName = str.substr(start, p - start);
						parent.addChild(xml);
						state = XmlState.IgnoreSpaces;
						next = XmlState.Body;
						continue;
					}
					break;

				case XmlState.Body:
					switch (c) {
						case XmlParser.CharCodeSlash:
							state = XmlState.WaitEnd;
							break;
						case XmlParser.CharCodeGreaterThan:
							state = XmlState.Childs;
							break;
						default:
							state = XmlState.AttribName;
							start = p;
							continue;
					}
					break;

				case XmlState.AttribName:
					if (!XmlParser.isValidChar(c)) {
						if (start === p) {
							throw new XmlError('Expected attribute name', str, p);
						}
						let tmp: string = str.substr(start, p - start);
						aname = tmp;
						if (xml!.attributes.has(aname)) {
							throw new XmlError(`Duplicate attribute [${aname}]`, str, p);
						}
						state = XmlState.IgnoreSpaces;
						next = XmlState.Equals;
						continue;
					}
					break;

				case XmlState.Equals:
					switch (c) {
						case XmlParser.CharCodeEquals:
							state = XmlState.IgnoreSpaces;
							next = XmlState.AttvalBegin;
							break;
						default:
							throw new XmlError('Expected =', str, p);
					}
					break;

				case XmlState.AttvalBegin:
					switch (c) {
						case XmlParser.CharCodeDoubleQuote:
						case XmlParser.CharCodeSingleQuote:
							buf = '';
							state = XmlState.AttribVal;
							start = p + 1;
							attrValQuote = c;
							break;
					}
					break;

				case XmlState.AttribVal:
					switch (c) {
						case XmlParser.CharCodeAmp:
							buf += str.substr(start, p - start);
							state = XmlState.Escape;
							escapeNext = XmlState.AttribVal;
							start = p + 1;
							break;
						default:
							if (c === attrValQuote) {
								buf += str.substr(start, p - start);
								let value: string = buf;
								buf = '';
								xml!.attributes.set(aname!, value);
								state = XmlState.IgnoreSpaces;
								next = XmlState.Body;
							}
							break;
					}
					break;

				case XmlState.Childs:
					p = XmlParser.parse(str, p, xml!);
					start = p;
					state = XmlState.Begin;
					break;

				case XmlState.WaitEnd:
					switch (c) {
						case XmlParser.CharCodeGreaterThan:
							state = XmlState.Begin;
							break;
						default:
							throw new XmlError('Expected >', str, p);
					}
					break;

				case XmlState.WaitEndRet:
					switch (c) {
						case XmlParser.CharCodeGreaterThan:
							return p;
						default:
							throw new XmlError('Expected >', str, p);
					}

				case XmlState.Close:
					if (!XmlParser.isValidChar(c)) {
						if (start === p) {
							throw new XmlError('Expected node name', str, p);
						}
						let v: string = str.substr(start, p - start);
						if (v !== parent.localName) {
							throw new XmlError('Expected </' + parent.localName + '>', str, p);
						}
						state = XmlState.IgnoreSpaces;
						next = XmlState.WaitEndRet;
						continue;
					}
					break;

				case XmlState.Comment:
					if (
						c === XmlParser.CharCodeMinus &&
						str.charCodeAt(p + 1) === XmlParser.CharCodeMinus &&
						str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan
					) {
						p += 2;
						state = XmlState.Begin;
					}
					break;

				case XmlState.Doctype:
					if (c === XmlParser.CharCodeBrackedOpen) {
						nbrackets++;
					} else if (c === XmlParser.CharCodeBrackedClose) {
						nbrackets--;
					} else if (c === XmlParser.CharCodeGreaterThan && nbrackets === 0) {
						// >
						let node: XmlNode = new XmlNode();
						node.nodeType = XmlNodeType.DocumentType;
						node.value = str.substr(start, p - start);
						parent.addChild(node);
						state = XmlState.Begin;
					}
					break;

				case XmlState.Header:
					if (c === XmlParser.CharCodeQuestion && str.charCodeAt(p + 1) === XmlParser.CharCodeGreaterThan) {
						p++;
						state = XmlState.Begin;
					}
					break;

				case XmlState.Escape:
					if (c === XmlParser.CharCodeSemi) {
						let s: string = str.substr(start, p - start);
						if (s.charCodeAt(0) === XmlParser.CharCodeSharp) {
							let code: number =
								s.charCodeAt(1) === XmlParser.CharCodeLowerX
									? parseInt('0' + s.substr(1, s.length - 1))
									: parseInt(s.substr(1, s.length - 1));
							buf += String.fromCharCode(code);
						} else if (XmlParser.Escapes.has(s)) {
							buf += XmlParser.Escapes.get(s);
						} else {
							buf += ('&' + s + ';')?.toString();
						}
						start = p + 1;
						state = escapeNext;
					} else if (!XmlParser.isValidChar(c) && c !== XmlParser.CharCodeSharp) {
						buf += '&';
						buf += str.substr(start, p - start);
						p--;
						start = p + 1;
						state = escapeNext;
					}
					break;
			}

			p++;
		}

		if (state === XmlState.Begin) {
			start = p;
			state = XmlState.Pcdata;
		}

		if (state === XmlState.Pcdata) {
			if (p !== start) {
				buf += str.substr(start, p - start);
				let node: XmlNode = new XmlNode();
				node.nodeType = XmlNodeType.Text;
				node.value = buf;
				parent.addChild(node);
			}
			return p;
		}
		if (state === XmlState.Escape && escapeNext === XmlState.Pcdata) {
			buf += '&';
			buf += str.substr(start, p - start);
			let node: XmlNode = new XmlNode();
			node.nodeType = XmlNodeType.Text;
			node.value = buf;
			parent.addChild(node);
			return p;
		}
		throw new XmlError('Unexpected end', str, p);
	}

	private static isValidChar(c: number): boolean {
		return (
			(c >= XmlParser.CharCodeLowerA && c <= XmlParser.CharCodeLowerZ) ||
			(c >= XmlParser.CharCodeUpperA && c <= XmlParser.CharCodeUpperZ) ||
			(c >= XmlParser.CharCode0 && c <= XmlParser.CharCode9) ||
			c === XmlParser.CharCodeColon ||
			c === XmlParser.CharCodeDot ||
			c === XmlParser.CharCodeUnderscore ||
			c === XmlParser.CharCodeMinus
		);
	}
}
enum XmlNodeType {
	None,
	Element,
	Text,
	CDATA,
	Document,
	DocumentType,
}
class XmlNode {
	public nodeType: XmlNodeType = XmlNodeType.None;
	public localName: string | null = null;
	public value: string | null = null;
	public childNodes: XmlNode[] = [];
	public attributes: Map<string, string> = new Map<string, string>();
	public firstChild: XmlNode | null = null;
	public firstElement: XmlNode | null = null;

	public addChild(node: XmlNode): void {
		this.childNodes.push(node);
		this.firstChild = node;
		if (node.nodeType === XmlNodeType.Element || node.nodeType === XmlNodeType.CDATA) {
			this.firstElement = node;
		}
	}

	public getAttribute(name: string): string {
		if (this.attributes.has(name)) {
			return this.attributes.get(name)!;
		}
		return '';
	}

	public getElementsByTagName(name: string, recursive: boolean = false): XmlNode[] {
		let tags: XmlNode[] = [];
		this.searchElementsByTagName(this.childNodes, tags, name, recursive);
		return tags;
	}

	private searchElementsByTagName(all: XmlNode[], result: XmlNode[], name: string, recursive: boolean = false): void {
		for (let c of all) {
			if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
				result.push(c);
			}
			if (recursive) {
				this.searchElementsByTagName(c.childNodes, result, name, true);
			}
		}
	}

	public findChildElement(name: string): XmlNode | null {
		for (let c of this.childNodes) {
			if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
				return c;
			}
		}
		return null;
	}

	public addElement(name: string): XmlNode {
		const newNode = new XmlNode();
		newNode.nodeType = XmlNodeType.Element;
		newNode.localName = name;
		this.addChild(newNode);
		return newNode;
	}

	public get innerText(): string {
		if (this.nodeType === XmlNodeType.Element || this.nodeType === XmlNodeType.Document) {
			if (this.firstElement && this.firstElement.nodeType === XmlNodeType.CDATA) {
				return this.firstElement.innerText;
			}
			let txt: string = '';
			for (let c of this.childNodes) {
				txt += c.innerText?.toString();
			}
			let s: string = txt;
			return s.trim();
		}
		return this.value ?? '';
	}


	public set innerText(value: string) {
		const textNode = new XmlNode();
		textNode.nodeType = XmlNodeType.Text;
		textNode.value = value;
		this.childNodes = [textNode];
	}

	public setCData(s: string) {
		const textNode = new XmlNode();
		textNode.nodeType = XmlNodeType.CDATA;
		textNode.value = s;
		this.childNodes = [textNode];
	}
}
class XmlDocument extends XmlNode {
	public constructor() {
		super();
		this.nodeType = XmlNodeType.Document;
	}

	public parse(xml: string) {
		XmlParser.parse(xml, 0, this);
	}

	public override toString() {
		return this.toFormattedString();
	}

	public toFormattedString(indention: string = '', xmlHeader: boolean = false): string {
		return XmlWriter.write(this, indention, xmlHeader);
	}
}
class PlaybackInformation {
	/**
	 * Gets or sets the volume (0-16)
	 */
	public volume: number = 15;

	/**
	 * Gets or sets the balance (0-16; 8=center)
	 */
	public balance: number = 8;

	/**
	 * Gets or sets the midi port to use.
	 */
	public port: number = 1;

	/**
	 * Gets or sets the midi program to use.
	 */
	public program: number = 0;

	/**
	 * Gets or sets the primary channel for all normal midi events.
	 */
	public primaryChannel: number = 0;

	/**
	 * Gets or sets the secondary channel for special midi events.
	 */
	public secondaryChannel: number = 0;

	/**
	 * Gets or sets whether the track is muted.
	 */
	public isMute: boolean = false;

	/**
	 * Gets or sets whether the track is playing alone.
	 */
	public isSolo: boolean = false;
}
class Tuning {
	private static _sevenStrings: Tuning[] = [];
	private static _sixStrings: Tuning[] = [];
	private static _fiveStrings: Tuning[] = [];
	private static _fourStrings: Tuning[] = [];
	private static _defaultTunings: Map<number, Tuning> = new Map();

	public static readonly defaultAccidentals: string[] = ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''];
	public static readonly defaultSteps: string[] = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];

	public static getTextForTuning(tuning: number, includeOctave: boolean): string {
		let parts = Tuning.getTextPartsForTuning(tuning);
		return includeOctave ? parts.join('') : parts[0];
	}

	public static getTextPartsForTuning(tuning: number, octaveShift: number = -1): string[] {
		let octave: number = (tuning / 12) | 0;
		let note: number = tuning % 12;
		let notes: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
		return [notes[note], (octave + octaveShift).toString()];
	}

	/**
	 * Gets the default tuning for the given string count.
	 * @param stringCount The string count.
	 * @returns The tuning for the given string count or null if the string count is not defined.
	 */
	public static getDefaultTuningFor(stringCount: number): Tuning | null {
		if (Tuning._defaultTunings.has(stringCount)) {
			return Tuning._defaultTunings.get(stringCount)!;
		}
		return null;
	}

	/**
	 * Gets a list of all tuning presets for a given stirng count.
	 * @param stringCount The string count.
	 * @returns The list of known tunings for the given string count or an empty list if the string count is not defined.
	 */
	public static getPresetsFor(stringCount: number): Tuning[] {
		switch (stringCount) {
			case 7:
				return Tuning._sevenStrings;
			case 6:
				return Tuning._sixStrings;
			case 5:
				return Tuning._fiveStrings;
			case 4:
				return Tuning._fourStrings;
		}
		return [];
	}

	public static initialize(): void {
		Tuning._defaultTunings.set(
			7,
			new Tuning('Guitar 7 strings', [64, 59, 55, 50, 45, 40, 35], true)
		);

		Tuning._sevenStrings.push(Tuning._defaultTunings.get(7)!);
		Tuning._defaultTunings.set(
			6,
			new Tuning('Guitar Standard Tuning', [64, 59, 55, 50, 45, 40], true)
		);

		Tuning._sixStrings.push(Tuning._defaultTunings.get(6)!);
		Tuning._sixStrings.push(new Tuning('Guitar Tune down ½ step', [63, 58, 54, 49, 44, 39], false));
		Tuning._sixStrings.push(new Tuning('Guitar Tune down 1 step', [62, 57, 53, 48, 43, 38], false));
		Tuning._sixStrings.push(new Tuning('Guitar Tune down 2 step', [60, 55, 51, 46, 41, 36], false));
		Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning', [64, 59, 55, 50, 45, 38], false));
		Tuning._sixStrings.push(
			new Tuning('Guitar Dropped D Tuning variant', [64, 57, 55, 50, 45, 38], false)
		);
		Tuning._sixStrings.push(
			new Tuning('Guitar Double Dropped D Tuning', [62, 59, 55, 50, 45, 38], false)
		);
		Tuning._sixStrings.push(new Tuning('Guitar Dropped E Tuning', [66, 61, 57, 52, 47, 40], false));
		Tuning._sixStrings.push(new Tuning('Guitar Dropped C Tuning', [62, 57, 53, 48, 43, 36], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open C Tuning', [64, 60, 55, 48, 43, 36], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open Cm Tuning', [63, 60, 55, 48, 43, 36], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open C6 Tuning', [64, 57, 55, 48, 43, 36], false));
		Tuning._sixStrings.push(
			new Tuning('Guitar Open Cmaj7 Tuning', [64, 59, 55, 52, 43, 36], false)
		);
		Tuning._sixStrings.push(new Tuning('Guitar Open D Tuning', [62, 57, 54, 50, 45, 38], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open Dm Tuning', [62, 57, 53, 50, 45, 38], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open D5 Tuning', [62, 57, 50, 50, 45, 38], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open D6 Tuning', [62, 59, 54, 50, 45, 38], false));
		Tuning._sixStrings.push(
			new Tuning('Guitar Open Dsus4 Tuning', [62, 57, 55, 50, 45, 38], false)
		);
		Tuning._sixStrings.push(new Tuning('Guitar Open E Tuning', [64, 59, 56, 52, 47, 40], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open Em Tuning', [64, 59, 55, 52, 47, 40], false));
		Tuning._sixStrings.push(
			new Tuning('Guitar Open Esus11 Tuning', [64, 59, 55, 52, 45, 40], false)
		);
		Tuning._sixStrings.push(new Tuning('Guitar Open F Tuning', [65, 60, 53, 48, 45, 41], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open G Tuning', [62, 59, 55, 50, 43, 38], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open Gm Tuning', [62, 58, 55, 50, 43, 38], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open G6 Tuning', [64, 59, 55, 50, 43, 38], false));
		Tuning._sixStrings.push(
			new Tuning('Guitar Open Gsus4 Tuning', [62, 60, 55, 50, 43, 38], false)
		);
		Tuning._sixStrings.push(new Tuning('Guitar Open A Tuning', [64, 61, 57, 52, 45, 40], false));
		Tuning._sixStrings.push(new Tuning('Guitar Open Am Tuning', [64, 60, 57, 52, 45, 40], false));
		Tuning._sixStrings.push(new Tuning('Guitar Nashville Tuning', [64, 59, 67, 62, 57, 52], false));
		Tuning._sixStrings.push(new Tuning('Bass 6 Strings Tuning', [48, 43, 38, 33, 28, 23], false));
		Tuning._sixStrings.push(new Tuning('Lute or Vihuela Tuning', [64, 59, 54, 50, 45, 40], false));

		Tuning._defaultTunings.set(5, new Tuning('Bass 5 Strings Tuning', [43, 38, 33, 28, 23], true));
		Tuning._fiveStrings.push(Tuning._defaultTunings.get(5)!);
		Tuning._fiveStrings.push(new Tuning('Banjo Dropped C Tuning', [62, 59, 55, 48, 67], false));
		Tuning._fiveStrings.push(new Tuning('Banjo Open D Tuning', [62, 57, 54, 50, 69], false));
		Tuning._fiveStrings.push(new Tuning('Banjo Open G Tuning', [62, 59, 55, 50, 67], false));
		Tuning._fiveStrings.push(new Tuning('Banjo G Minor Tuning', [62, 58, 55, 50, 67], false));
		Tuning._fiveStrings.push(new Tuning('Banjo G Modal Tuning', [62, 57, 55, 50, 67], false));

		Tuning._defaultTunings.set(4, new Tuning('Bass Standard Tuning', [43, 38, 33, 28], true));
		Tuning._fourStrings.push(Tuning._defaultTunings.get(4)!);
		Tuning._fourStrings.push(new Tuning('Bass Tune down ½ step', [42, 37, 32, 27], false));
		Tuning._fourStrings.push(new Tuning('Bass Tune down 1 step', [41, 36, 31, 26], false));
		Tuning._fourStrings.push(new Tuning('Bass Tune down 2 step', [39, 34, 29, 24], false));
		Tuning._fourStrings.push(new Tuning('Bass Dropped D Tuning', [43, 38, 33, 26], false));
		Tuning._fourStrings.push(new Tuning('Ukulele C Tuning', [45, 40, 36, 43], false));
		Tuning._fourStrings.push(new Tuning('Ukulele G Tuning', [52, 47, 43, 38], false));
		Tuning._fourStrings.push(new Tuning('Mandolin Standard Tuning', [64, 57, 50, 43], false));
		Tuning._fourStrings.push(new Tuning('Mandolin or Violin Tuning', [76, 69, 62, 55], false));
		Tuning._fourStrings.push(new Tuning('Viola Tuning', [69, 62, 55, 48], false));
		Tuning._fourStrings.push(new Tuning('Cello Tuning', [57, 50, 43, 36], false));
	}

	/**
	 * Tries to find a known tuning by a given list of tuning values.
	 * @param strings The values defining the tuning.
	 * @returns The known tuning.
	 */
	public static findTuning(strings: number[]): Tuning | null {
		let tunings: Tuning[] = Tuning.getPresetsFor(strings.length);
		for (let t: number = 0, tc: number = tunings.length; t < tc; t++) {
			let tuning: Tuning = tunings[t];
			let equals: boolean = true;
			for (let i: number = 0, j: number = strings.length; i < j; i++) {
				if (strings[i] !== tuning.tunings[i]) {
					equals = false;
					break;
				}
			}
			if (equals) {
				return tuning;
			}
		}
		return null;
	}

	/**
	 * Gets or sets whether this is the standard tuning for this number of strings.
	 */
	public isStandard: boolean;

	/**
	 * Gets or sets the name of the tuning.
	 */
	public name: string;

	/**
	 * Gets or sets the values for each string of the instrument.
	 */
	public tunings: number[];

	/**
	 * Initializes a new instance of the {@link Tuning} class.
	 * @param name The name.
	 * @param tuning The tuning.
	 * @param isStandard if set to`true`[is standard].
	 */
	public constructor(name: string = '', tuning: number[] | null = null, isStandard: boolean = false) {
		this.isStandard = isStandard;
		this.name = name;
		this.tunings = tuning ?? [];
	}

	/**
	 * Tries to detect the name and standard flag of the tuning from a known tuning list based
	 * on the string values. 
	 */
	public finish() {
		const knownTuning = Tuning.findTuning(this.tunings);
		if (knownTuning) {
			this.name = knownTuning.name;
			this.isStandard = knownTuning.isStandard;
		}
		this.name = this.name.trim();
	}
}
class BendPointCloner {
	public static clone(original: BendPoint): BendPoint {
		const clone = new BendPoint();
		clone.offset = original.offset;
		clone.value = original.value;
		return clone;
	}
}
class NoteCloner {
	public static clone(original: Note): Note {
		const clone = new Note();
		clone.index = original.index;
		clone.accentuated = original.accentuated;
		clone.bendType = original.bendType;
		clone.bendStyle = original.bendStyle;
		clone.isContinuedBend = original.isContinuedBend;
		if (original.bendPoints) {
			clone.bendPoints = [];
			for (const i of original.bendPoints!) {
				clone.addBendPoint(BendPointCloner.clone(i));
			}
		}
		clone.fret = original.fret;
		clone.string = original.string;
		clone.octave = original.octave;
		clone.tone = original.tone;
		clone.percussionArticulation = original.percussionArticulation;
		clone.isVisible = original.isVisible;
		clone.isLeftHandTapped = original.isLeftHandTapped;
		clone.isHammerPullOrigin = original.isHammerPullOrigin;
		clone.isSlurDestination = original.isSlurDestination;
		clone.harmonicType = original.harmonicType;
		clone.harmonicValue = original.harmonicValue;
		clone.isGhost = original.isGhost;
		clone.isLetRing = original.isLetRing;
		clone.isPalmMute = original.isPalmMute;
		clone.isDead = original.isDead;
		clone.isStaccato = original.isStaccato;
		clone.slideInType = original.slideInType;
		clone.slideOutType = original.slideOutType;
		clone.vibrato = original.vibrato;
		clone.isTieDestination = original.isTieDestination;
		clone.leftHandFinger = original.leftHandFinger;
		clone.rightHandFinger = original.rightHandFinger;
		clone.isFingering = original.isFingering;
		clone.trillValue = original.trillValue;
		clone.trillSpeed = original.trillSpeed;
		clone.durationPercent = original.durationPercent;
		clone.accidentalMode = original.accidentalMode;
		clone.dynamics = original.dynamics;
		return clone;
	}
}
class AutomationCloner {
	public static clone(original: Automation): Automation {
		const clone = new Automation();
		clone.isLinear = original.isLinear;
		clone.type = original.type;
		clone.value = original.value;
		clone.ratioPosition = original.ratioPosition;
		clone.text = original.text;
		return clone;
	}
}
class BeatCloner {
	public static clone(original: Beat): Beat {
		const clone = new Beat();
		clone.index = original.index;
		clone.notes = [];
		for (const i of original.notes!) {
			clone.addNote(NoteCloner.clone(i));
		}
		clone.isEmpty = original.isEmpty;
		clone.whammyStyle = original.whammyStyle;
		clone.ottava = original.ottava;
		clone.isLegatoOrigin = original.isLegatoOrigin;
		clone.duration = original.duration;
		clone.isLetRing = original.isLetRing;
		clone.isPalmMute = original.isPalmMute;
		clone.automations = [];
		for (const i of original.automations!) {
			clone.automations.push(AutomationCloner.clone(i));
		}
		clone.dots = original.dots;
		clone.fadeIn = original.fadeIn;
		clone.lyrics = original.lyrics ? original.lyrics.slice() : null;
		clone.hasRasgueado = original.hasRasgueado;
		clone.pop = original.pop;
		clone.slap = original.slap;
		clone.tap = original.tap;
		clone.text = original.text;
		clone.brushType = original.brushType;
		clone.brushDuration = original.brushDuration;
		clone.tupletDenominator = original.tupletDenominator;
		clone.tupletNumerator = original.tupletNumerator;
		clone.isContinuedWhammy = original.isContinuedWhammy;
		clone.whammyBarType = original.whammyBarType;
		if (original.whammyBarPoints) {
			clone.whammyBarPoints = [];
			for (const i of original.whammyBarPoints!) {
				clone.addWhammyBarPoint(BendPointCloner.clone(i));
			}
		}
		clone.vibrato = original.vibrato;
		clone.chordId = original.chordId;
		clone.graceType = original.graceType;
		clone.pickStroke = original.pickStroke;
		clone.tremoloSpeed = original.tremoloSpeed;
		clone.crescendo = original.crescendo;
		clone.displayStart = original.displayStart;
		clone.playbackStart = original.playbackStart;
		clone.displayDuration = original.displayDuration;
		clone.playbackDuration = original.playbackDuration;
		clone.dynamics = original.dynamics;
		clone.invertBeamDirection = original.invertBeamDirection;
		clone.preferredBeamDirection = original.preferredBeamDirection;
		clone.isEffectSlurOrigin = original.isEffectSlurOrigin;
		clone.beamingMode = original.beamingMode;
		return clone;
	}
}
enum BeatBeamingMode {
	/**
	 * Automatic beaming based on the timing rules.
	 */
	Auto,
	/**
	 * Force a split to the next beat.
	 */
	ForceSplitToNext,
	/**
	 * Force a merge with the next beat.
	 */
	ForceMergeWithNext
}
enum BeamDirection {
	Up,
	Down
}
enum CrescendoType {
	/**
	 * No crescendo applied.
	 */
	None,
	/**
	 * Normal crescendo applied.
	 */
	Crescendo,
	/**
	 * Normal decrescendo applied.
	 */
	Decrescendo
}
class Chord {
	/**
	 * Gets or sets the name of the chord
	 */
	public name: string = '';

	/**
	 * Indicates the first fret of the chord diagram.
	 */
	public firstFret: number = 1;

	/**
	 * Gets or sets the frets played on the individual strings for this chord.
	 * - The order in this list goes from the highest string to the lowest string.
	 * - -1 indicates that the string is not played.
	 */
	public strings: number[] = [];

	/**
	 * Gets or sets a list of frets where the finger should hold a barre
	 */
	public barreFrets: number[] = [];

	/**
	 * Gets or sets the staff the chord belongs to.
	 * @json_ignore
	 */
	public staff!: Staff;

	/**
	 * Gets or sets whether the chord name is shown above the chord diagram.
	 */
	public showName: boolean = true;

	/**
	 * Gets or sets whether the chord diagram is shown.
	 */
	public showDiagram: boolean = true;

	/**
	 * Gets or sets whether the fingering is shown below the chord diagram.
	 */
	public showFingering: boolean = true;
	/**
	 * Gets a unique id for this chord based on its properties.
	 */
	public get uniqueId(): string {
		const properties = [
			this.name,
			this.firstFret.toString(),
			this.strings.join(','),
			this.barreFrets.join(','),
			this.showDiagram.toString(),
			this.showFingering.toString(),
			this.showName.toString()
		];
		return properties.join('|');
	}
}
enum WhammyType {
	/**
	 * No whammy at all
	 */
	None,
	/**
	 * Individual points define the whammy in a flexible manner.
	 * This system was mainly used in Guitar Pro 3-5
	 */
	Custom,
	/**
	 * Simple dive to a lower or higher note.
	 */
	Dive,
	/**
	 * A dive to a lower or higher note and releasing it back to normal.
	 */
	Dip,
	/**
	 * Continue to hold the whammy at the position from a previous whammy.
	 */
	Hold,
	/**
	 * Dive to a lower or higher note before playing it.
	 */
	Predive,
	/**
	 * Dive to a lower or higher note before playing it, then change to another
	 * note.
	 */
	PrediveDive
}
class TupletGroup {
	private static readonly HalfTicks: number = 1920;
	private static readonly QuarterTicks: number = 960;
	private static readonly EighthTicks: number = 480;
	private static readonly SixteenthTicks: number = 240;
	private static readonly ThirtySecondTicks: number = 120;
	private static readonly SixtyFourthTicks: number = 60;
	private static readonly OneHundredTwentyEighthTicks: number = 30;
	private static readonly TwoHundredFiftySixthTicks: number = 15;

	private static AllTicks: number[] = [
		TupletGroup.HalfTicks,
		TupletGroup.QuarterTicks,
		TupletGroup.EighthTicks,
		TupletGroup.SixteenthTicks,
		TupletGroup.ThirtySecondTicks,
		TupletGroup.SixtyFourthTicks,
		TupletGroup.OneHundredTwentyEighthTicks,
		TupletGroup.TwoHundredFiftySixthTicks
	];

	private _isEqualLengthTuplet: boolean = true;

	public totalDuration: number = 0;

	/**
	 * Gets or sets the list of beats contained in this group.
	 */
	public beats: Beat[] = [];

	/**
	 * Gets or sets the voice this group belongs to.
	 */
	public voice: Voice;

	/**
	 * Gets a value indicating whether the tuplet group is fully filled.
	 */
	public isFull: boolean = false;

	/**
	 * Initializes a new instance of the {@link TupletGroup} class.
	 * @param voice The voice this group belongs to.
	 */
	public constructor(voice: Voice) {
		this.voice = voice;
	}

	public check(beat: Beat): boolean {
		if (this.beats.length === 0) {
			// accept first beat
			this.beats.push(beat);
			this.totalDuration += beat.playbackDuration;
			return true;
		}
		if (beat.graceType !== GraceType.None) {
			// grace notes do not break tuplet group, but also do not contribute to them.
			return true;
		}
		if (
			beat.voice !== this.voice ||
			this.isFull ||
			beat.tupletNumerator !== this.beats[0].tupletNumerator ||
			beat.tupletDenominator !== this.beats[0].tupletDenominator
		) {
			// only same tuplets are potentially accepted
			return false;
		}
		// TBH: I do not really know how the 100% tuplet grouping of Guitar Pro might work
		// it sometimes has really strange rules where notes filling 3 quarters, are considered a full 3:2 tuplet
		// in alphaTab we have now 2 rules where we consider a tuplet full:
		// 1. if all beats have the same length, the tuplet must contain N notes of an N:M tuplet
		// 2. if we have mixed beats, we check if the current set of beats, matches a N:M tuplet
		//    by checking all potential note durations.
		// this logic is very likely not 100% correct but for most cases the tuplets
		// appeared correct.
		if (beat.playbackDuration !== this.beats[0].playbackDuration) {
			this._isEqualLengthTuplet = false;
		}
		this.beats.push(beat);
		this.totalDuration += beat.playbackDuration;
		if (this._isEqualLengthTuplet) {
			if (this.beats.length === this.beats[0].tupletNumerator) {
				this.isFull = true;
			}
		} else {
			let factor: number = (this.beats[0].tupletNumerator / this.beats[0].tupletDenominator) | 0;
			for (let potentialMatch of TupletGroup.AllTicks) {
				if (this.totalDuration === potentialMatch * factor) {
					this.isFull = true;
					break;
				}
			}
		}
		return true;
	}
}
enum BrushType {
	/**
	 * No brush.
	 */
	None,
	/**
	 * Normal brush up.
	 */
	BrushUp,
	/**
	 * Normal brush down.
	 */
	BrushDown,
	/**
	 * Arpeggio up.
	 */
	ArpeggioUp,
	/**
	 * Arpeggio down.
	 */
	ArpeggioDown
}
enum PickStroke {
	/**
	 * No pickstroke used.
	 */
	None,
	/**
	 * Pickstroke up.
	 */
	Up,
	/**
	 * Pickstroke down
	 */
	Down
}
class GeneralMidi {
	private static _values: Map<string, number> = new Map([
		['acousticgrandpiano', 0], ['brightacousticpiano', 1], ['electricgrandpiano', 2],
		['honkytonkpiano', 3], ['electricpiano1', 4], ['electricpiano2', 5], ['harpsichord', 6],
		['clavinet', 7], ['celesta', 8], ['glockenspiel', 9], ['musicbox', 10], ['vibraphone', 11],
		['marimba', 12], ['xylophone', 13], ['tubularbells', 14], ['dulcimer', 15],
		['drawbarorgan', 16], ['percussiveorgan', 17], ['rockorgan', 18], ['churchorgan', 19],
		['reedorgan', 20], ['accordion', 21], ['harmonica', 22], ['tangoaccordion', 23],
		['acousticguitarnylon', 24], ['acousticguitarsteel', 25], ['electricguitarjazz', 26],
		['electricguitarclean', 27], ['electricguitarmuted', 28], ['overdrivenguitar', 29],
		['distortionguitar', 30], ['guitarharmonics', 31], ['acousticbass', 32],
		['electricbassfinger', 33], ['electricbasspick', 34], ['fretlessbass', 35],
		['slapbass1', 36], ['slapbass2', 37], ['synthbass1', 38], ['synthbass2', 39],
		['violin', 40], ['viola', 41], ['cello', 42], ['contrabass', 43], ['tremolostrings', 44],
		['pizzicatostrings', 45], ['orchestralharp', 46], ['timpani', 47], ['stringensemble1', 48],
		['stringensemble2', 49], ['synthstrings1', 50], ['synthstrings2', 51], ['choiraahs', 52],
		['voiceoohs', 53], ['synthvoice', 54], ['orchestrahit', 55], ['trumpet', 56],
		['trombone', 57], ['tuba', 58], ['mutedtrumpet', 59], ['frenchhorn', 60],
		['brasssection', 61], ['synthbrass1', 62], ['synthbrass2', 63], ['sopranosax', 64],
		['altosax', 65], ['tenorsax', 66], ['baritonesax', 67], ['oboe', 68], ['englishhorn', 69],
		['bassoon', 70], ['clarinet', 71], ['piccolo', 72], ['flute', 73], ['recorder', 74],
		['panflute', 75], ['blownbottle', 76], ['shakuhachi', 77], ['whistle', 78], ['ocarina', 79],
		['lead1square', 80], ['lead2sawtooth', 81], ['lead3calliope', 82], ['lead4chiff', 83],
		['lead5charang', 84], ['lead6voice', 85], ['lead7fifths', 86], ['lead8bassandlead', 87],
		['pad1newage', 88], ['pad2warm', 89], ['pad3polysynth', 90], ['pad4choir', 91],
		['pad5bowed', 92], ['pad6metallic', 93], ['pad7halo', 94], ['pad8sweep', 95],
		['fx1rain', 96], ['fx2soundtrack', 97], ['fx3crystal', 98], ['fx4atmosphere', 99],
		['fx5brightness', 100], ['fx6goblins', 101], ['fx7echoes', 102], ['fx8scifi', 103],
		['sitar', 104], ['banjo', 105], ['shamisen', 106], ['koto', 107], ['kalimba', 108],
		['bagpipe', 109], ['fiddle', 110], ['shanai', 111], ['tinklebell', 112], ['agogo', 113],
		['steeldrums', 114], ['woodblock', 115], ['taikodrum', 116], ['melodictom', 117],
		['synthdrum', 118], ['reversecymbal', 119], ['guitarfretnoise', 120], ['breathnoise', 121],
		['seashore', 122], ['birdtweet', 123], ['telephonering', 124], ['helicopter', 125],
		['applause', 126], ['gunshot', 127]
	]);

	public static getValue(name: string): number {
		if (!GeneralMidi._values) {
			GeneralMidi._values = new Map<string, number>();
		}
		name = name.toLowerCase();//.replaceAll(' ', '');
		return GeneralMidi._values.has(name) ? GeneralMidi._values.get(name)! : 0;
	}

	public static isPiano(program: number): boolean {
		return program <= 7 || program >= 16 && program <= 23;
	}

	public static isGuitar(program: number): boolean {
		return program >= 24 && program <= 39 || program === 105 || program === 43;
	}
}
enum TabRhythmMode {
	/**
	 * Rhythm notation is hidden.
	 */
	Hidden,
	/**
	 * Rhythm notation is shown with individual beams per beat.
	 */
	ShowWithBeams,
	/**
	 * Rhythm notation is shown and behaves like normal score notation with connected bars.
	 */
	ShowWithBars
}

enum NotationElement {
	/**
	 * The score title shown at the start of the music sheet.
	 */
	ScoreTitle,

	/**
	 * The score subtitle shown at the start of the music sheet.
	 */
	ScoreSubTitle,

	/**
	 * The score artist shown at the start of the music sheet.
	 */
	ScoreArtist,

	/**
	 * The score album shown at the start of the music sheet.
	 */
	ScoreAlbum,

	/**
	 * The score words author shown at the start of the music sheet.
	 */
	ScoreWords,

	/**
	 * The score music author shown at the start of the music sheet.
	 */
	ScoreMusic,

	/**
	 * The score words&music author shown at the start of the music sheet.
	 */
	ScoreWordsAndMusic,

	/**
	 * The score copyright owner shown at the start of the music sheet.
	 */
	ScoreCopyright,

	/**
	 * The tuning information of the guitar shown
	 * above the staves.
	 */
	GuitarTuning,

	/**
	 * The track names which are shown in the accolade.
	 */
	TrackNames,

	/**
	 * The chord diagrams for guitars. Usually shown
	 * below the score info.
	 */
	ChordDiagrams,

	/**
	 * Parenthesis that are shown for tied bends
	 * if they are preceeded by bends.
	 */
	ParenthesisOnTiedBends,

	/**
	 * The tab number for tied notes if the
	 * bend of a note is increased at that point.
	 */
	TabNotesOnTiedBends,

	/**
	 * Zero tab numbers on "dive whammys".
	 */
	ZerosOnDiveWhammys,

	/**
	 * The alternate endings information on repeats shown above the staff.
	 */
	EffectAlternateEndings,

	/**
	 * The information about the fret on which the capo is placed shown above the staff.
	 */
	EffectCapo,

	/**
	 * The chord names shown above beats shown above the staff.
	 */
	EffectChordNames,

	/**
	 * The crescendo/decrescendo angle  shown above the staff.
	 */
	EffectCrescendo,

	/**
	 * The beat dynamics  shown above the staff.
	 */
	EffectDynamics,

	/**
	 * The curved angle for fade in/out effects  shown above the staff.
	 */
	EffectFadeIn,

	/**
	 * The fermata symbol shown above the staff.
	 */
	EffectFermata,

	/**
	 * The fingering information.
	 */
	EffectFingering,

	/**
	 * The harmonics names shown above the staff.
	 * (does not represent the harmonic note heads)
	 */
	EffectHarmonics,

	/**
	 * The let ring name and line above the staff.
	 */
	EffectLetRing,

	/**
	 * The lyrics of the track shown above the staff.
	 */
	EffectLyrics,

	/**
	 * The section markers shown above the staff.
	 */
	EffectMarker,

	/**
	 * The ottava symbol and lines shown above the staff.
	 */
	EffectOttavia,

	/**
	 * The palm mute name and line shown above the staff.
	 */
	EffectPalmMute,

	/**
	 * The pick slide information shown above the staff.
	 * (does not control the pick slide lines)
	 */
	EffectPickSlide,

	/**
	 * The pick stroke symbols shown above the staff.
	 */
	EffectPickStroke,

	/**
	 * The slight beat vibrato waves shown above the staff.
	 */
	EffectSlightBeatVibrato,

	/**
	 * The slight note vibrato waves shown above the staff.
	 */
	EffectSlightNoteVibrato,

	/**
	 * The tap/slap/pop effect names shown above the staff.
	 */
	EffectTap,

	/**
	 * The tempo information shown above the staff.
	 */
	EffectTempo,

	/**
	 * The additional beat text shown above the staff.
	 */
	EffectText,

	/**
	 * The trill name and waves shown above the staff.
	 */
	EffectTrill,

	/**
	 * The triplet feel symbol shown above the staff.
	 */
	EffectTripletFeel,

	/**
	 * The whammy bar information shown above the staff.
	 * (does not control the whammy lines shown within the staff)
	 */
	EffectWhammyBar,

	/**
	 * The wide beat vibrato waves shown above the staff.
	 */
	EffectWideBeatVibrato,

	/**
	 * The wide note vibrato waves shown above the staff.
	 */
	EffectWideNoteVibrato,

	/**
	 * The left hand tap symbol shown above the staff.
	 */
	EffectLeftHandTap
}
enum FingeringMode {
	/**
	 * Fingerings will be shown in the standard notation staff.
	 */
	ScoreDefault,
	/**
	 * Fingerings will be shown in the standard notation staff. Piano finger style is enforced, where
	 * fingers are rendered as 1-5 instead of p,i,m,a,c and T,1,2,3,4.
	 */
	ScoreForcePiano,
	/**
	 * Fingerings will be shown in a effect band above the tabs in case
	 * they have only a single note on the beat.
	 */
	SingleNoteEffectBand,
	/**
	 * Fingerings will be shown in a effect band above the tabs in case
	 * they have only a single note on the beat. Piano finger style is enforced, where
	 * fingers are rendered as 1-5 instead of p,i,m,a,c and T,1,2,3,4.
	 */
	SingleNoteEffectBandForcePiano
}

class NotationSettings {
	/**
	 * Gets or sets the mode to use for display and play music notation elements.
	 */
	public notationMode: NotationMode = NotationMode.GuitarPro;

	/**
	 * Gets or sets the fingering mode to use.
	 */
	public fingeringMode: FingeringMode = FingeringMode.ScoreDefault;

	/**
	 * Gets or sets the configuration on whether music notation elements are visible or not.
	 * If notation elements are not specified, the default configuration will be applied.
	 */
	public elements: Map<NotationElement, boolean> = new Map();

	/**
	 * Gets the default configuration of the {@see notationElements} setting. Do not modify
	 * this map as it might not result in the expected side effects.
	 * If items are not listed explicitly in this list, they are considered visible.
	 */
	public static defaultElements: Map<NotationElement, boolean> = new Map([
		[NotationElement.ZerosOnDiveWhammys, false]
	]);

	/**
	 * Whether to show rhythm notation in the guitar tablature.
	 */
	public rhythmMode: TabRhythmMode = TabRhythmMode.Hidden;

	/**
	 * The height of the rythm bars.
	 */
	public rhythmHeight: number = 15;

	/**
	 * The transposition pitch offsets for the individual tracks.
	 * They apply to rendering and playback.
	 */
	public transpositionPitches: number[] = [];

	/**
	 * The transposition pitch offsets for the individual tracks.
	 * They apply to rendering only.
	 */
	public displayTranspositionPitches: number[] = [];

	/**
	 * If set to true the guitar tabs on grace beats are rendered smaller.
	 */
	public smallGraceTabNotes: boolean = true;

	/**
	 * If set to true bend arrows expand to the end of the last tied note
	 * of the string. Otherwise they end on the next beat.
	 */
	public extendBendArrowsOnTiedNotes: boolean = true;

	/**
	 * If set to true, line effects (like w/bar, let-ring etc)
	 * are drawn until the end of the beat instead of the start.
	 */
	public extendLineEffectsToBeatEnd: boolean = false;

	/**
	 * Gets or sets the height for slurs. The factor is multiplied with the a logarithmic distance
	 * between slur start and end.
	 */
	public slurHeight: number = 5.0;

	/**
	 * Gets whether the given music notation element should be shown
	 * @param element the element to check
	 * @returns true if the element should be shown, otherwise false.
	 */
	public isNotationElementVisible(element: NotationElement): boolean {
		if (this.elements.has(element)) {
			return this.elements.get(element)!;
		}
		if (NotationSettings.defaultElements.has(element)) {
			return NotationSettings.defaultElements.get(element)!;
		}
		return true;
	}
}
enum NotationMode {
	/**
	 * Music elements will be displayed and played as in Guitar Pro.
	 */
	GuitarPro,

	/**
	 * Music elements will be displayed and played as in traditional songbooks.
	 * Changes:
	 * 1. Bends
	 *   For bends additional grace beats are introduced.
	 *   Bends are categorized into gradual and fast bends.
	 *   - Gradual bends are indicated by beat text "grad" or "grad.". Bend will sound along the beat duration.
	 *   - Fast bends are done right before the next note. If the next note is tied even on-beat of the next note.
	 * 2. Whammy Bars
	 *   Dips are shown as simple annotation over the beats
	 *   Whammy Bars are categorized into gradual and fast.
	 *   - Gradual whammys are indicated by beat text "grad" or "grad.". Whammys will sound along the beat duration.
	 *   - Fast whammys are done right the beat.
	 * 3. Let Ring
	 *   Tied notes with let ring are not shown in standard notation
	 *   Let ring does not cause a longer playback, duration is defined via tied notes.
	 */
	SongBook
}

class Lazy<T> {
	private _factory: () => T;
	private _value: T | undefined = undefined;

	public constructor(factory: () => T) {
		this._factory = factory;
	}

	public get value(): T {
		if (this._value === undefined) {
			this._value = this._factory();
		}
		return this._value;
	}
}
class TuningParseResult {
	public note: string | null = null;
	public noteValue: number = 0;
	public octave: number = 0;

	public get realValue(): number {
		return this.octave * 12 + this.noteValue;
	}
}
class ModelUtils {
	public static getIndex(duration: Duration): number {
		let index: number = 0;
		let value: number = duration;
		if (value < 0) {
			return index;
		}
		return Math.log2(duration) | 0;
	}

	public static keySignatureIsFlat(ks: number): boolean {
		return ks < 0;
	}

	public static keySignatureIsNatural(ks: number): boolean {
		return ks === 0;
	}

	public static keySignatureIsSharp(ks: number): boolean {
		return ks > 0;
	}

	public static applyPitchOffsets(settings: Settings, score: Score): void {
		for (let i: number = 0; i < score.tracks.length; i++) {
			if (i < settings.notation.displayTranspositionPitches.length) {
				for (let staff of score.tracks[i].staves) {
					staff.displayTranspositionPitch = -settings.notation.displayTranspositionPitches[i];
				}
			}
			if (i < settings.notation.transpositionPitches.length) {
				for (let staff of score.tracks[i].staves) {
					staff.transpositionPitch = -settings.notation.transpositionPitches[i];
				}
			}
		}
	}

	public static fingerToString(settings: Settings, beat: Beat, finger: Fingers, leftHand: boolean): string | null {
		if (
			settings.notation.fingeringMode === FingeringMode.ScoreForcePiano ||
			settings.notation.fingeringMode === FingeringMode.SingleNoteEffectBandForcePiano ||
			GeneralMidi.isPiano(beat.voice.bar.staff.track.playbackInfo.program)
		) {
			switch (finger) {
				case Fingers.Unknown:
				case Fingers.NoOrDead:
					return null;
				case Fingers.Thumb:
					return '1';
				case Fingers.IndexFinger:
					return '2';
				case Fingers.MiddleFinger:
					return '3';
				case Fingers.AnnularFinger:
					return '4';
				case Fingers.LittleFinger:
					return '5';
				default:
					return null;
			}
		}
		if (leftHand) {
			switch (finger) {
				case Fingers.Unknown:
				case Fingers.NoOrDead:
					return '0';
				case Fingers.Thumb:
					return 'T';
				case Fingers.IndexFinger:
					return '1';
				case Fingers.MiddleFinger:
					return '2';
				case Fingers.AnnularFinger:
					return '3';
				case Fingers.LittleFinger:
					return '4';
				default:
					return null;
			}
		}
		switch (finger) {
			case Fingers.Unknown:
			case Fingers.NoOrDead:
				return null;
			case Fingers.Thumb:
				return 'p';
			case Fingers.IndexFinger:
				return 'i';
			case Fingers.MiddleFinger:
				return 'm';
			case Fingers.AnnularFinger:
				return 'a';
			case Fingers.LittleFinger:
				return 'c';
			default:
				return null;
		}
	}

	/**
	 * Checks if the given string is a tuning inticator.
	 * @param name
	 */
	public static isTuning(name: string): boolean {
		return !!ModelUtils.parseTuning(name);
	}

	public static parseTuning(name: string): TuningParseResult | null {
		let note: string = '';
		let octave: string = '';
		for (let i: number = 0; i < name.length; i++) {
			let c: number = name.charCodeAt(i);
			if (c >= 0x30 && c <= 0x39 /* 0-9 */) {
				// number without note?
				if (!note) {
					return null;
				}
				octave += String.fromCharCode(c);
			} else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a) || c === 0x23) /* A-Za-Z# */ {
				note += String.fromCharCode(c);
			} else {
				return null;
			}
		}
		if (!octave || !note) {
			return null;
		}
		let result: TuningParseResult = new TuningParseResult();
		result.octave = parseInt(octave) + 1;
		result.note = note.toLowerCase();
		result.noteValue = ModelUtils.getToneForText(result.note);
		return result;
	}

	public static getTuningForText(str: string): number {
		let result: TuningParseResult | null = ModelUtils.parseTuning(str);
		if (!result) {
			return -1;
		}
		return result.realValue;
	}

	public static getToneForText(note: string): number {
		switch (note.toLowerCase()) {
			case 'c':
				return 0;
			case 'c#':
			case 'db':
				return 1;
			case 'd':
				return 2;
			case 'd#':
			case 'eb':
				return 3;
			case 'e':
				return 4;
			case 'f':
				return 5;
			case 'f#':
			case 'gb':
				return 6;
			case 'g':
				return 7;
			case 'g#':
			case 'ab':
				return 8;
			case 'a':
				return 9;
			case 'a#':
			case 'bb':
				return 10;
			case 'b':
				return 11;
			default:
				return 0;
		}
	}

	public static newGuid(): string {
		return (
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			'-' +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			'-' +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			'-' +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			'-' +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1) +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1)
		);
	}

	public static isAlmostEqualTo(a: number, b: number): boolean {
		return Math.abs(a - b) < 0.00001;
	}

	public static toHexString(n: number, digits: number = 0): string {
		let s: string = '';
		let hexChars: string = '0123456789ABCDEF';
		do {
			s = String.fromCharCode(hexChars.charCodeAt(n & 15)) + s;
			n = n >> 4;
		} while (n > 0);
		while (s.length < digits) {
			s = '0' + s;
		}
		return s;
	}
}
enum DynamicValue {
	/**
	 * pianississimo (very very soft)
	 */
	PPP,
	/**
	 * pianissimo (very soft)
	 */
	PP,
	/**
	 * piano (soft)
	 */
	P,
	/**
	 * mezzo-piano (half soft)
	 */
	MP,
	/**
	 * mezzo-forte (half loud)
	 */
	MF,
	/**
	 * forte (loud)
	 */
	F,
	/**
	 * fortissimo (very loud)
	 */
	FF,
	/**
	 * fortississimo (very very loud)
	 */
	FFF
}
enum NoteAccidentalMode {
	/**
	 * Accidentals are calculated automatically.
	 */
	Default,
	/**
	 * This will try to ensure that no accidental is shown.
	 */
	ForceNone,
	/**
	 * This will move the note one line down and applies a Naturalize.
	 */
	ForceNatural,
	/**
	 * This will move the note one line down and applies a Sharp.
	 */
	ForceSharp,
	/**
	 * This will move the note to be shown 2 half-notes deeper with a double sharp symbol
	 */
	ForceDoubleSharp,
	/**
	 * This will move the note one line up and applies a Flat.
	 */
	ForceFlat,
	/**
	 * This will move the note two half notes up with a double flag symbol.
	 */
	ForceDoubleFlat,
}
enum Fingers {
	/**
	 * Unknown type (not documented)
	 */
	Unknown = -2,
	/**
	 * No finger, dead note
	 */
	NoOrDead = -1,
	/**
	 * The thumb
	 */
	Thumb = 0,
	/**
	 * The index finger
	 */
	IndexFinger = 1,
	/**
	 * The middle finger
	 */
	MiddleFinger = 2,
	/**
	 * The annular finger
	 */
	AnnularFinger = 3,
	/**
	 * The little finger
	 */
	LittleFinger = 4
}
enum VibratoType {
	/**
	 * No vibrato.
	 */
	None,
	/**
	 * A slight vibrato.
	 */
	Slight,
	/**
	 * A wide vibrato.
	 */
	Wide
}
enum SlideOutType {
	/**
	 * No slide.
	 */
	None,
	/**
	 * Shift slide to next note on same string
	 */
	Shift,
	/**
	 * Legato slide to next note on same string.
	 */
	Legato,
	/**
	 * Slide out from the note from upwards on the same string.
	 */
	OutUp,
	/**
	 * Slide out from the note from downwards on the same string.
	 */
	OutDown,
	/**
	 * Pickslide down on this note
	 */
	PickSlideDown,
	/**
	 * Pickslide up on this note
	 */
	PickSlideUp
}
enum SlideInType {
	/**
	 * No slide.
	 */
	None,
	/**
	 * Slide into the note from below on the same string.
	 */
	IntoFromBelow,
	/**
	 * Slide into the note from above on the same string.
	 */
	IntoFromAbove
}
enum HarmonicType {
	/**
	 * No harmonics.
	 */
	None,
	/**
	 * Natural harmonic
	 */
	Natural,
	/**
	 * Artificial harmonic
	 */
	Artificial,
	/**
	 * Pinch harmonics
	 */
	Pinch,
	/**
	 * Tap harmonics
	 */
	Tap,
	/**
	 * Semi harmonics
	 */
	Semi,
	/**
	 * Feedback harmonics
	 */
	Feedback
}
enum TextBaseline {
	/**
	 * Text is aligned on top.
	 */
	Top,
	/**
	 * Text is aligned middle
	 */
	Middle,
	/**
	 * Text is aligend on the bottom.
	 */
	Bottom
}

enum MusicFontSymbol {
	None = -1,

	GClef = 0xe050,
	CClef = 0xe05c,
	FClef = 0xe062,
	UnpitchedPercussionClef1 = 0xe069,
	SixStringTabClef = 0xe06d,
	FourStringTabClef = 0xe06e,

	TimeSig0 = 0xe080,
	TimeSig1 = 0xe081,
	TimeSig2 = 0xe082,
	TimeSig3 = 0xe083,
	TimeSig4 = 0xe084,
	TimeSig5 = 0xe085,
	TimeSig6 = 0xe086,
	TimeSig7 = 0xe087,
	TimeSig8 = 0xe088,
	TimeSig9 = 0xe089,
	TimeSigCommon = 0xe08a,
	TimeSigCutCommon = 0xe08b,

	NoteheadDoubleWholeSquare = 0xe0a1,
	NoteheadDoubleWhole = 0xe0a0,
	NoteheadWhole = 0xe0a2,
	NoteheadHalf = 0xe0a3,
	NoteheadBlack = 0xe0a4,
	NoteheadNull = 0xe0a5,
	NoteheadXOrnate = 0xe0aa,
	NoteheadTriangleUpWhole = 0xe0bb,
	NoteheadTriangleUpHalf = 0xe0bc,
	NoteheadTriangleUpBlack = 0xe0be,
	NoteheadDiamondBlackWide = 0xe0dc,
	NoteheadDiamondWhite = 0xe0dd,
	NoteheadDiamondWhiteWide = 0xe0de,
	NoteheadCircleX = 0xe0b3,
	NoteheadXWhole = 0xe0a7,
	NoteheadXHalf = 0xe0a8,
	NoteheadXBlack = 0xe0a9,
	NoteheadParenthesis = 0xe0ce,
	NoteheadSlashedBlack2 = 0xe0d0,
	NoteheadCircleSlash = 0xe0f7,
	NoteheadHeavyX = 0xe0f8,
	NoteheadHeavyXHat = 0xe0f9,

	NoteQuarterUp = 0xe1d5,
	NoteEighthUp = 0xe1d7,

	Tremolo3 = 0xe222,
	Tremolo2 = 0xe221,
	Tremolo1 = 0xe220,

	FlagEighthUp = 0xe240,
	FlagEighthDown = 0xe241,
	FlagSixteenthUp = 0xe242,
	FlagSixteenthDown = 0xe243,
	FlagThirtySecondUp = 0xe244,
	FlagThirtySecondDown = 0xe245,
	FlagSixtyFourthUp = 0xe246,
	FlagSixtyFourthDown = 0xe247,
	FlagOneHundredTwentyEighthUp = 0xe248,
	FlagOneHundredTwentyEighthDown = 0xe249,
	FlagTwoHundredFiftySixthUp = 0xe24a,
	FlagTwoHundredFiftySixthDown = 0xe24b,

	AccidentalFlat = 0xe260,
	AccidentalNatural = 0xe261,
	AccidentalSharp = 0xe262,
	AccidentalDoubleSharp = 0xe263,
	AccidentalDoubleFlat = 0xe264,
	AccidentalQuarterToneFlatArrowUp = 0xe270,
	AccidentalQuarterToneSharpArrowUp = 0xe274,
	AccidentalQuarterToneNaturalArrowUp = 0xe272,

	ArticAccentAbove = 0xe4a0,
	ArticStaccatoAbove = 0xe4a2,
	ArticMarcatoAbove = 0xe4ac,

	FermataAbove = 0xe4c0,
	FermataShortAbove = 0xe4c4,
	FermataLongAbove = 0xe4c6,

	RestLonga = 0xe4e1,
	RestDoubleWhole = 0xe4e2,
	RestWhole = 0xe4e3,
	RestHalf = 0xe4e4,
	RestQuarter = 0xe4e5,
	RestEighth = 0xe4e6,
	RestSixteenth = 0xe4e7,
	RestThirtySecond = 0xe4e8,
	RestSixtyFourth = 0xe4e9,
	RestOneHundredTwentyEighth = 0xe4ea,
	RestTwoHundredFiftySixth = 0xe4eb,

	Repeat1Bar = 0xe500,
	Repeat2Bars = 0xe501,

	Ottava = 0xe510,
	OttavaAlta = 0xe511,
	OttavaBassaVb = 0xe51c,
	Quindicesima = 0xe514,
	QuindicesimaAlta = 0xe515,

	DynamicPPP = 0xe52a,
	DynamicPP = 0xe52b,
	DynamicPiano = 0xe520,
	DynamicMP = 0xe52c,
	DynamicMF = 0xe52d,
	DynamicForte = 0xe522,
	DynamicFF = 0xe52f,
	DynamicFFF = 0xe530,

	OrnamentTrill = 0xe566,

	StringsDownBow = 0xe610,
	StringsUpBow = 0xe612,

	PictEdgeOfCymbal = 0xe729,

	GuitarString0 = 0xe833,
	GuitarString1 = 0xe834,
	GuitarString2 = 0xe835,
	GuitarString3 = 0xe836,
	GuitarString4 = 0xe837,
	GuitarString5 = 0xe838,
	GuitarString6 = 0xe839,
	GuitarString7 = 0xe83A,
	GuitarString8 = 0xe83B,
	GuitarString9 = 0xe83C,

	GuitarGolpe = 0xe842,

	FretboardX = 0xe859,
	FretboardO = 0xe85a,

	WiggleTrill = 0xeaa4,
	WiggleVibratoMediumFast = 0xeade,

	OctaveBaselineM = 0xec95,
	OctaveBaselineB = 0xec93
}
class InstrumentArticulation {
	/**
	 * Gets or sets the type of the element for which this articulation is for.
	 */
	public elementType: string;
	/**
	 * Gets or sets the line the note head should be shown for standard notation
	 */
	public staffLine: number;
	/**
	 * Gets or sets the note head to display by default. 
	 */
	public noteHeadDefault: MusicFontSymbol;
	/**
	 * Gets or sets the note head to display for half duration notes. 
	 */
	public noteHeadHalf: MusicFontSymbol;
	/**
	 * Gets or sets the note head to display for whole duration notes. 
	 */
	public noteHeadWhole: MusicFontSymbol;
	/**
	 * Gets or sets which additional technique symbol should be placed for the note head. 
	 */
	public techniqueSymbol: MusicFontSymbol;
	/**
	 * Gets or sets where the technique symbol should be placed. 
	 */
	public techniqueSymbolPlacement: TextBaseline;
	/**
	 * Gets or sets which midi number to use when playing the note.
	 */
	public outputMidiNumber: number;

	public constructor(
		elementType: string = "",
		staffLine: number = 0,
		outputMidiNumber: number = 0,
		noteHeadDefault: MusicFontSymbol = MusicFontSymbol.None,
		noteHeadHalf: MusicFontSymbol = MusicFontSymbol.None,
		noteHeadWhole: MusicFontSymbol = MusicFontSymbol.None,
		techniqueSymbol: MusicFontSymbol = MusicFontSymbol.None,
		techniqueSymbolPlacement: TextBaseline = TextBaseline.Middle) {
		this.elementType = elementType;
		this.outputMidiNumber = outputMidiNumber;
		this.staffLine = staffLine;
		this.noteHeadDefault = noteHeadDefault;
		this.noteHeadHalf = noteHeadHalf !== MusicFontSymbol.None ? noteHeadHalf : noteHeadDefault;
		this.noteHeadWhole = noteHeadWhole !== MusicFontSymbol.None ? noteHeadWhole : noteHeadDefault;
		this.techniqueSymbol = techniqueSymbol;
		this.techniqueSymbolPlacement = techniqueSymbolPlacement;
	}

	public getSymbol(duration: Duration): MusicFontSymbol {
		switch (duration) {
			case Duration.Whole:
				return this.noteHeadWhole;
			case Duration.Half:
				return this.noteHeadHalf;
			default:
				return this.noteHeadDefault;
		}
	}
}
class PercussionMapper {
	private static gp6ElementAndVariationToArticulation: number[][] = [
		// known GP6 elements and variations, analyzed from a GPX test file
		// with all instruments inside manually aligned with the same names of articulations in GP7
		// [{articulation index}]   // [{element number}] => {element name} ({variation[0]}, {variation[1]}, {variation[2]})
		[35, 35, 35], // [0] => Kick (hit, unused, unused) 
		[38, 91, 37], // [1] => Snare (hit, rim shot, side stick)
		[99, 100, 99], // [2] => Cowbell low (hit, tip, unused)
		[56, 100, 56], // [3] => Cowbell medium (hit, tip, unused)
		[102, 103, 102], // [4] => Cowbell high (hit, tip, unused)
		[43, 43, 43], // [5] => Tom very low (hit, unused, unused)
		[45, 45, 45], // [6] => Tom low (hit, unused, unused)
		[47, 47, 47], // [7] => Tom medium (hit, unused, unused)
		[48, 48, 48], // [8] => Tom high (hit, unused, unused)
		[50, 50, 50], // [9] => Tom very high (hit, unused, unused)
		[42, 92, 46], // [10] => Hihat (closed, half, open)
		[44, 44, 44], // [11] => Pedal hihat (hit, unused, unused)
		[57, 98, 57], // [12] => Crash medium (hit, choke, unused)
		[49, 97, 49], // [13] => Crash high (hit, choke, unused)
		[55, 95, 55], // [14] => Splash (hit, choke, unused)
		[51, 93, 127], // [15] => Ride (middle, edge, bell)
		[52, 96, 52], // [16] => China (hit, choke, unused)
	];


	public static articulationFromElementVariation(element: number, variation: number): number {
		if (element < PercussionMapper.gp6ElementAndVariationToArticulation.length) {
			if (variation >= PercussionMapper.gp6ElementAndVariationToArticulation.length) {
				variation = 0;
			}
			return PercussionMapper.gp6ElementAndVariationToArticulation[element][variation];
		}
		// unknown combination, should not happen, fallback to some default value (Snare hit)
		return 38;
	}

	/*
	 * This map was generated using the following steps: 
	 * 1. Make a new GP7 file with a drumkit track
	 * 2. Add one note for each midi value using the instrument panel
	 * 3. Load the file in alphaTab and set a breakpoint in the GP7 importer. 
	 * 4. Use the following snipped in the console to generate the map initializer (fix enums manually): 
	 * parser = new DOMParser();
	 * xmlDoc = parser.parseFromString(xml, 'text/xml');
	 * articulations = xmlDoc.getElementsByTagName('Articulation');
	 * existingArticulations = new Map();
	 * s = '';
	 * for(let i = 0; i < articulations.length; i++) {
	 *     const articulation = articulations[i];
	 *     let midi = articulation.getElementsByTagName('InputMidiNumbers');
	 * 	if(midi.length === 1) {
	 * 		midi = midi[0].textContent;
	 *      const elementType = articulation.parentElement.parentElement.getElementsByTagName('Type')[0].textContent;
	 *      const outputMidiNumber = articulation.getElementsByTagName('OutputMidiNumber')[0].textContent;
	 * 		const staffLine = articulation.getElementsByTagName('StaffLine')[0].textContent;
	 * 		const techniqueSymbol = articulation.getElementsByTagName('TechniqueSymbol')[0].textContent;
	 * 		const techniquePlacement = articulation.getElementsByTagName('TechniquePlacement')[0].textContent;
	 * 		const noteHeads = articulation.getElementsByTagName('Noteheads')[0].textContent.split(' ').map(n=>n = 'MusicFontSymbol.' + n);
	 * 		if(!existingArticulations.has(midi)) {
	 *        if(techniqueSymbol) {
	 * 		    s += `['${elementType}', ${midi}, new InstrumentArticulation(${staffLine}, ${outputMidiNumber}, ${noteHeads[0]}, ${noteHeads[1]}, ${noteHeads[2]}, ${techniqueSymbol}, ${techniquePlacement})],\r\n`;
	 *        }
	 *        else {
	 * 		    s += `['${elementType}', ${midi}, new InstrumentArticulation(${staffLine}, ${outputMidiNumber}, ${noteHeads[0]}, ${noteHeads[1]}, ${noteHeads[2]})],\r\n`;
	 *        }
	 * 		  existingArticulations.set(midi, true);
	 * 		}
	 * 	}
	 * }
	 * copy(s)
	 */
	public static instrumentArticulations: Map<number, InstrumentArticulation> = new Map([
		[38, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[37, new InstrumentArticulation("snare", 3, 37, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[91, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
		[42, new InstrumentArticulation("hiHat", -1, 42, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[92, new InstrumentArticulation("hiHat", -1, 46, MusicFontSymbol.NoteheadCircleSlash, MusicFontSymbol.NoteheadCircleSlash, MusicFontSymbol.NoteheadCircleSlash)],
		[46, new InstrumentArticulation("hiHat", -1, 46, MusicFontSymbol.NoteheadCircleX, MusicFontSymbol.NoteheadCircleX, MusicFontSymbol.NoteheadCircleX)],
		[44, new InstrumentArticulation("hiHat", 9, 44, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[35, new InstrumentArticulation("kickDrum", 8, 35, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[36, new InstrumentArticulation("kickDrum", 7, 36, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[50, new InstrumentArticulation("tom", 1, 50, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[48, new InstrumentArticulation("tom", 2, 48, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[47, new InstrumentArticulation("tom", 4, 47, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[45, new InstrumentArticulation("tom", 5, 45, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[43, new InstrumentArticulation("tom", 6, 43, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[93, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.PictEdgeOfCymbal, TextBaseline.Bottom)],
		[51, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[53, new InstrumentArticulation("ride", 0, 53, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
		[94, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Top)],
		[55, new InstrumentArticulation("splash", -2, 55, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[95, new InstrumentArticulation("splash", -2, 55, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
		[52, new InstrumentArticulation("china", -3, 52, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat)],
		[96, new InstrumentArticulation("china", -3, 52, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat)],
		[49, new InstrumentArticulation("crash", -2, 49, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX)],
		[97, new InstrumentArticulation("crash", -2, 49, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
		[57, new InstrumentArticulation("crash", -1, 57, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX)],
		[98, new InstrumentArticulation("crash", -1, 57, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
		[99, new InstrumentArticulation("cowbell", 1, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
		[100, new InstrumentArticulation("cowbell", 1, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
		[56, new InstrumentArticulation("cowbell", 0, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
		[101, new InstrumentArticulation("cowbell", 0, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
		[102, new InstrumentArticulation("cowbell", -1, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
		[103, new InstrumentArticulation("cowbell", -1, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
		[77, new InstrumentArticulation("woodblock", -9, 77, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
		[76, new InstrumentArticulation("woodblock", -10, 76, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
		[60, new InstrumentArticulation("bongo", -4, 60, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[104, new InstrumentArticulation("bongo", -5, 60, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
		[105, new InstrumentArticulation("bongo", -6, 60, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[61, new InstrumentArticulation("bongo", -7, 61, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[106, new InstrumentArticulation("bongo", -8, 61, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
		[107, new InstrumentArticulation("bongo", -16, 61, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[66, new InstrumentArticulation("timbale", 10, 66, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[65, new InstrumentArticulation("timbale", 9, 65, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[68, new InstrumentArticulation("agogo", 12, 68, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[67, new InstrumentArticulation("agogo", 11, 67, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[64, new InstrumentArticulation("conga", 17, 64, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[108, new InstrumentArticulation("conga", 16, 64, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[109, new InstrumentArticulation("conga", 15, 64, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
		[63, new InstrumentArticulation("conga", 14, 63, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[110, new InstrumentArticulation("conga", 13, 63, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[62, new InstrumentArticulation("conga", 19, 62, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
		[72, new InstrumentArticulation("whistle", -11, 72, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[71, new InstrumentArticulation("whistle", -17, 71, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[73, new InstrumentArticulation("guiro", 38, 73, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[74, new InstrumentArticulation("guiro", 37, 74, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[86, new InstrumentArticulation("surdo", 36, 86, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[87, new InstrumentArticulation("surdo", 35, 87, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
		[54, new InstrumentArticulation("tambourine", 3, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
		[111, new InstrumentArticulation("tambourine", 2, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
		[112, new InstrumentArticulation("tambourine", 1, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.StringsDownBow, TextBaseline.Bottom)],
		[113, new InstrumentArticulation("tambourine", -7, 54, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[79, new InstrumentArticulation("cuica", 30, 79, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[78, new InstrumentArticulation("cuica", 29, 78, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[58, new InstrumentArticulation("vibraslap", 28, 58, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[81, new InstrumentArticulation("triangle", 27, 81, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[80, new InstrumentArticulation("triangle", 26, 80, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
		[114, new InstrumentArticulation("grancassa", 25, 43, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[115, new InstrumentArticulation("piatti", 18, 49, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[116, new InstrumentArticulation("piatti", 24, 49, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[69, new InstrumentArticulation("cabasa", 23, 69, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[117, new InstrumentArticulation("cabasa", 22, 69, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
		[85, new InstrumentArticulation("castanets", 21, 85, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[75, new InstrumentArticulation("claves", 20, 75, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[70, new InstrumentArticulation("maraca", -12, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[118, new InstrumentArticulation("maraca", -13, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
		[119, new InstrumentArticulation("maraca", -14, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[120, new InstrumentArticulation("maraca", -15, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
		[82, new InstrumentArticulation("shaker", -23, 54, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[122, new InstrumentArticulation("shaker", -24, 54, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
		[84, new InstrumentArticulation("bellTree", -18, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[123, new InstrumentArticulation("bellTree", -19, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
		[83, new InstrumentArticulation("jingleBell", -20, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[124, new InstrumentArticulation("unpitched", -21, 62, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.GuitarGolpe, TextBaseline.Top)],
		[125, new InstrumentArticulation("unpitched", -22, 62, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.GuitarGolpe, TextBaseline.Bottom)],
		[39, new InstrumentArticulation("handClap", 3, 39, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[40, new InstrumentArticulation("snare", 3, 40, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[31, new InstrumentArticulation("snare", 3, 40, MusicFontSymbol.NoteheadSlashedBlack2, MusicFontSymbol.NoteheadSlashedBlack2, MusicFontSymbol.NoteheadSlashedBlack2)],
		[41, new InstrumentArticulation("tom", 5, 41, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
		[59, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.PictEdgeOfCymbal, TextBaseline.Bottom)],
		[126, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[127, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
		[29, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Top)],
		[30, new InstrumentArticulation("crash", -3, 49, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[33, new InstrumentArticulation("snare", 3, 37, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
		[34, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadBlack)]
	]);


	public static getArticulation(n: Note): InstrumentArticulation | null {
		const articulationIndex = n.percussionArticulation;

		const trackArticulations = n.beat.voice.bar.staff.track.percussionArticulations;
		if (articulationIndex < trackArticulations.length) {
			return trackArticulations[articulationIndex];
		}

		return PercussionMapper.getArticulationByValue(articulationIndex);;
	}

	public static getElementAndVariation(n: Note): number[] {
		const articulation = PercussionMapper.getArticulation(n);
		if (!articulation) {
			return [-1, -1];
		}

		// search for the first element/variation combination with the same midi output 
		for (let element = 0; element < PercussionMapper.gp6ElementAndVariationToArticulation.length; element++) {
			const variations = PercussionMapper.gp6ElementAndVariationToArticulation[element];
			for (let variation = 0; variation < variations.length; variation++) {
				const gp6Articulation = PercussionMapper.getArticulationByValue(variations[variation]);
				if (gp6Articulation?.outputMidiNumber === articulation.outputMidiNumber) {
					return [element, variation];
				}
			}
		}

		return [-1, -1];
	}

	public static getArticulationByValue(midiNumber: number): InstrumentArticulation | null {
		if (PercussionMapper.instrumentArticulations.has(midiNumber)) {
			return PercussionMapper.instrumentArticulations.get(midiNumber)!;
		}
		return null;
	}
}
enum BendType {
	/**
	 * No bend at all
	 */
	None,
	/**
	 * Individual points define the bends in a flexible manner.
	 * This system was mainly used in Guitar Pro 3-5
	 */
	Custom,
	/**
	 * Simple Bend from an unbended string to a higher note.
	 */
	Bend,
	/**
	 * Release of a bend that was started on an earlier note.
	 */
	Release,
	/**
	 * A bend that starts from an unbended string,
	 * and also releases the bend after some time.
	 */
	BendRelease,
	/**
	 * Holds a bend that was started on an earlier note
	 */
	Hold,
	/**
	 * A bend that is already started before the note is played then it is held until the end.
	 */
	Prebend,
	/**
	 * A bend that is already started before the note is played and
	 * bends even further, then it is held until the end.
	 */
	PrebendBend,
	/**
	 * A bend that is already started before the note is played and
	 * then releases the bend to a lower note where it is held until the end.
	 */
	PrebendRelease
}
enum AccentuationType {
	/**
	 * No accentuation
	 */
	None,
	/**
	 * Normal accentuation
	 */
	Normal,
	/**
	 * Heavy accentuation
	 */
	Heavy
}
enum BendStyle {
	/**
	 * The bends are as described by the bend points
	 */
	Default,
	/**
	 * The bends are gradual over the beat duration.
	 */
	Gradual,
	/**
	 * The bends are done fast before the next note.
	 */
	Fast,
}
class NoteIdBag {
	public tieDestinationNoteId: number = -1;
	public tieOriginNoteId: number = -1;
	public slurDestinationNoteId: number = -1;
	public slurOriginNoteId: number = -1;
	public hammerPullDestinationNoteId: number = -1;
	public hammerPullOriginNoteId: number = -1;
}
class ImporterSettings {
	/**
	 * The text encoding to use when decoding strings. By default UTF-8 is used.
	 */
	public encoding: string = 'utf-8';

	/**
	 * If part-groups should be merged into a single track.
	 */
	public mergePartGroupsInMusicXml: boolean = false;

	/**
	 * If set to true, text annotations on beats are attempted to be parsed as
	 * lyrics considering spaces as separators and removing underscores.
	 * If a track/staff has explicit lyrics the beat texts will not be detected as lyrics. 
	 */
	public beatTextAsLyrics: boolean = false;
}
class Settings {
	/**
	 * The core settings control the general behavior of alphatab like
	 * what modules are active.
	 * @json_on_parent
	 * @json_partial_names
	 */
	//public readonly core: CoreSettings = new CoreSettings();

	/**
	 * The display settings control how the general layout and display of alphaTab is done.
	 * @json_on_parent
	 * @json_partial_names
	 */
	//public readonly display: DisplaySettings = new DisplaySettings();

	/**
	 * The notation settings control how various music notation elements are shown and behaving.
	 * @json_partial_names
	 */
	public readonly notation: NotationSettings = new NotationSettings();

	/**
	 * All settings related to importers that decode file formats.
	 * @json_partial_names
	 */
	public readonly importer: ImporterSettings = new ImporterSettings();

	/**
	 * Contains all player related settings
	 * @json_partial_names
	 */
	//public player: PlayerSettings = new PlayerSettings();
	/*
		public setSongBookModeSettings(): void {
			this.notation.notationMode = NotationMode.SongBook;
			this.notation.smallGraceTabNotes = false;
			this.notation.fingeringMode = FingeringMode.SingleNoteEffectBand;
			this.notation.extendBendArrowsOnTiedNotes = false;
			this.notation.elements.set(NotationElement.ParenthesisOnTiedBends, false);
			this.notation.elements.set(NotationElement.TabNotesOnTiedBends, false);
			this.notation.elements.set(NotationElement.ZerosOnDiveWhammys, true);
		}*/
	/*
		public static get songBook(): Settings {
			let settings: Settings = new Settings();
			settings.setSongBookModeSettings();
			return settings;
		}*/

	/**
	 * @target web
	 */
	/* public fillFromJson(json: any): void {
		 SettingsSerializer.fromJson(this, json);
	 }*/
}
enum Duration {
	/**
	 * A quadruple whole note duration
	 */
	QuadrupleWhole = -4,
	/**
	 * A double whole note duration
	 */
	DoubleWhole = -2,
	/**
	 * A whole note duration
	 */
	Whole = 1,
	/**
	 * A 1/2 note duration
	 */
	Half = 2,
	/**
	 * A 1/4 note duration
	 */
	Quarter = 4,
	/**
	 * A 1/8 note duration
	 */
	Eighth = 8,
	/**
	 * A 1/16 note duration
	 */
	Sixteenth = 16,
	/**
	 * A 1/32 note duration
	 */
	ThirtySecond = 32,
	/**
	 * A 1/64 note duration
	 */
	SixtyFourth = 64,
	/**
	 * A 1/128 note duration
	 */
	OneHundredTwentyEighth = 128,
	/**
	 * A 1/256 note duration
	 */
	TwoHundredFiftySixth = 256
}
enum KeySignature {
	/**
	 * Cb (7 flats)
	 */
	Cb = -7,
	/**
	 * Gb (6 flats)
	 */
	Gb = -6,
	/**
	 * Db (5 flats)
	 */
	Db = -5,
	/**
	 * Ab (4 flats)
	 */
	Ab = -4,
	/**
	 * Eb (3 flats)
	 */
	Eb = -3,
	/**
	 * Bb (2 flats)
	 */
	Bb = -2,
	/**
	 * F (1 flat)
	 */
	F = -1,
	/**
	 * C (no signs)
	 */
	C = 0,
	/**
	 * G (1 sharp)
	 */
	G = 1,
	/**
	 * D (2 sharp)
	 */
	D = 2,
	/**
	 * A (3 sharp)
	 */
	A = 3,
	/**
	 * E (4 sharp)
	 */
	E = 4,
	/**
	 * B (5 sharp)
	 */
	B = 5,
	/**
	 * F# (6 sharp)
	 */
	FSharp = 6,
	/**
	 * C# (7 sharp)
	 */
	CSharp = 7
}
enum KeySignatureType {
	/**
	 * Major
	 */
	Major,
	/**
	 * Minor
	 */
	Minor
}
enum TripletFeel {
	/**
	 * No triplet feel
	 */
	NoTripletFeel,
	/**
	 * Triplet 16th
	 */
	Triplet16th,
	/**
	 * Triplet 8th
	 */
	Triplet8th,
	/**
	 * Dotted 16th
	 */
	Dotted16th,
	/**
	 * Dotted 8th
	 */
	Dotted8th,
	/**
	 * Scottish 16th
	 */
	Scottish16th,
	/**
	 * Scottish 8th
	 */
	Scottish8th
}
class Section {
	/**
	 * Gets or sets the marker ID for this section.
	 */
	public marker: string = '';

	/**
	 * Gets or sets the descriptional text of this section.
	 */
	public text: string = '';
}
class Automation {
	/**
	 * Gets or sets whether the automation is applied linear.
	 */
	public isLinear: boolean = false;

	/**
	 * Gets or sets the type of the automation.
	 */
	public type: AutomationType = AutomationType.Tempo;

	/**
	 * Gets or sets the target value of the automation.
	 */
	public value: number = 0;

	/**
	 * Gets or sets the relative position of of the automation.
	 */
	public ratioPosition: number = 0;

	/**
	 * Gets or sets the additional text of the automation.
	 */
	public text: string = '';

	public static buildTempoAutomation(
		isLinear: boolean,
		ratioPosition: number,
		value: number,
		reference: number
	): Automation {
		if (reference < 1 || reference > 5) {
			reference = 2;
		}
		let references: Float32Array = new Float32Array([1, 0.5, 1.0, 1.5, 2.0, 3.0]);
		let automation: Automation = new Automation();
		automation.type = AutomationType.Tempo;
		automation.isLinear = isLinear;
		automation.ratioPosition = ratioPosition;
		automation.value = value * references[reference];
		return automation;
	}


	public static buildInstrumentAutomation(
		isLinear: boolean,
		ratioPosition: number,
		value: number
	): Automation {
		let automation: Automation = new Automation();
		automation.type = AutomationType.Instrument;
		automation.isLinear = isLinear;
		automation.ratioPosition = ratioPosition;
		automation.value = value;
		return automation;
	}
}
enum AutomationType {
	/**
	 * Tempo change.
	 */
	Tempo,
	/**
	 * Colume change.
	 */
	Volume,
	/**
	 * Instrument change.
	 */
	Instrument,
	/**
	 * Balance change.
	 */
	Balance
}
enum FermataType {
	/**
	 * A short fermata (triangle symbol)
	 */
	Short,
	/**
	 * A medium fermata (round symbol)
	 */
	Medium,
	/**
	 * A long fermata (rectangular symbol)
	 */
	Long
}
class Fermata {
	/**
	 * Gets or sets the type of fermata.
	 */
	public type: FermataType = FermataType.Short;

	/**
	 * Gets or sets the actual lenght of the fermata.
	 */
	public length: number = 0;
}
class MidiUtils {
	public static readonly QuarterTime: number = 960;
	private static readonly MinVelocity: number = 15;
	private static readonly VelocityIncrement: number = 16;

	/**
	 * Converts the given midi tick duration into milliseconds.
	 * @param ticks The duration in midi ticks
	 * @param tempo The current tempo in BPM.
	 * @returns The converted duration in milliseconds.
	 */
	public static ticksToMillis(ticks: number, tempo: number): number {
		return (ticks * (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
	}

	/**
	 * Converts the given midi tick duration into milliseconds.
	 * @param millis The duration in milliseconds
	 * @param tempo The current tempo in BPM.
	 * @returns The converted duration in midi ticks.
	 */
	public static millisToTicks(millis: number, tempo: number): number {
		return (millis / (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
	}

	/**
	 * Converts a duration value to its ticks equivalent.
	 */
	public static toTicks(duration: Duration): number {
		return MidiUtils.valueToTicks(duration);
	}

	/**
	 * Converts a numerical value to its ticks equivalent.
	 * @param duration the numerical proportion to convert. (i.E. timesignature denominator, note duration,...)
	 */
	public static valueToTicks(duration: number): number {
		let denomninator: number = duration;
		if (denomninator < 0) {
			denomninator = 1 / -denomninator;
		}
		return (MidiUtils.QuarterTime * (4.0 / denomninator)) | 0;
	}

	public static applyDot(ticks: number, doubleDotted: boolean): number {
		if (doubleDotted) {
			return ticks + ((ticks / 4) | 0) * 3;
		}
		return ticks + ((ticks / 2) | 0);
	}

	public static applyTuplet(ticks: number, numerator: number, denominator: number): number {
		return ((ticks * denominator) / numerator) | 0;
	}

	public static removeTuplet(ticks: number, numerator: number, denominator: number): number {
		return ((ticks * numerator) / denominator) | 0;
	}

	public static dynamicToVelocity(dynamicsSteps: number): number {
		return MidiUtils.MinVelocity + dynamicsSteps * MidiUtils.VelocityIncrement;
	}
}
class MasterBar {
	public static readonly MaxAlternateEndings: number = 8;
	/**
	 * Gets or sets the bitflag for the alternate endings. Each bit defines for which repeat counts
	 * the bar is played.
	 */
	public alternateEndings: number = 0;

	/**
	 * Gets or sets the next masterbar in the song.
	 * @json_ignore
	 */
	public nextMasterBar: MasterBar | null = null;

	/**
	 * Gets or sets the next masterbar in the song.
	 * @json_ignore
	 */
	public previousMasterBar: MasterBar | null = null;

	/**
	 * Gets the zero based index of the masterbar.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the key signature used on all bars.
	 */
	public keySignature: KeySignature = KeySignature.C;

	/**
	 * Gets or sets the type of key signature (major/minor)
	 */
	public keySignatureType: KeySignatureType = KeySignatureType.Major;

	/**
	 * Gets or sets whether a double bar is shown for this masterbar.
	 */
	public isDoubleBar: boolean = false;

	/**
	 * Gets or sets whether a repeat section starts on this masterbar.
	 */
	public isRepeatStart: boolean = false;

	public get isRepeatEnd(): boolean {
		return this.repeatCount > 0;
	}

	/**
	 * Gets or sets the number of repeats for the current repeat section.
	 */
	public repeatCount: number = 0;

	/**
	 * Gets or sets the repeat group this bar belongs to.
	 * @json_ignore
	 */
	public repeatGroup!: RepeatGroup;

	/**
	 * Gets or sets the time signature numerator.
	 */
	public timeSignatureNumerator: number = 4;

	/**
	 * Gets or sets the time signature denominiator.
	 */
	public timeSignatureDenominator: number = 4;

	/**
	 * Gets or sets whether this is bar has a common time signature.
	 */
	public timeSignatureCommon: boolean = false;

	/**
	 * Gets or sets the triplet feel that is valid for this bar.
	 */
	public tripletFeel: TripletFeel = TripletFeel.NoTripletFeel;

	/**
	 * Gets or sets the new section information for this bar.
	 */
	public section: Section | null = null;

	public get isSectionStart(): boolean {
		return !!this.section;
	}

	/**
	 * Gets or sets the tempo automation for this bar.
	 */
	public tempoAutomation: Automation | null = null;

	/**
	 * Gets or sets the reference to the score this song belongs to.
	 * @json_ignore
	 */
	public score!: Score;

	/**
	 * Gets or sets the fermatas for this bar. The key is the offset of the fermata in midi ticks.
	 * @json_add addFermata
	 */
	public fermata: Map<number, Fermata> | null = null;

	/**
	 * The timeline position of the voice within the whole score. (unit: midi ticks)
	 */
	public start: number = 0;

	/**
	 * Gets or sets a value indicating whether the master bar is an anacrusis (aka. pickup bar)
	 */
	public isAnacrusis: boolean = false;

	/**
	 * Gets a percentual scale for the size of the bars when displayed in a multi-track layout.
	 */
	public displayScale: number = 1;

	/**
	 * An absolute width of the bar to use when displaying in a multi-track layout.
	 */
	public displayWidth: number = -1;

	/**
	 * Calculates the time spent in this bar. (unit: midi ticks)
	 */
	public calculateDuration(respectAnacrusis: boolean = true): number {
		if (this.isAnacrusis && respectAnacrusis) {
			let duration: number = 0;
			for (let track of this.score.tracks) {
				for (let staff of track.staves) {
					let barDuration: number =
						this.index < staff.bars.length ? staff.bars[this.index].calculateDuration() : 0;
					if (barDuration > duration) {
						duration = barDuration;
					}
				}
			}
			return duration;
		}
		return this.timeSignatureNumerator * MidiUtils.valueToTicks(this.timeSignatureDenominator);
	}

	/**
	 * Adds a fermata to the masterbar.
	 * @param offset The offset of the fermata within the bar in midi ticks.
	 * @param fermata The fermata.
	 */
	public addFermata(offset: number, fermata: Fermata): void {
		let fermataMap = this.fermata;
		if (fermataMap === null) {
			fermataMap = new Map<number, Fermata>();
			this.fermata = fermataMap;
		}
		fermataMap.set(offset, fermata);
	}

	/**
	 * Gets the fermata for a given beat.
	 * @param beat The beat to get the fermata for.
	 * @returns
	 */
	public getFermata(beat: Beat): Fermata | null {
		const fermataMap = this.fermata;
		if (fermataMap === null) {
			return null;
		}
		if (fermataMap.has(beat.playbackStart)) {
			return fermataMap.get(beat.playbackStart)!;
		}
		return null;
	}
}
enum Clef {
	/**
	 * Neutral clef.
	 */
	Neutral,
	/**
	 * C3 clef
	 */
	C3,
	/**
	 * C4 clef
	 */
	C4,
	/**
	 * F4 clef
	 */
	F4,
	/**
	 * G2 clef
	 */
	G2
}
enum Ottavia {
	/**
	 * 2 octaves higher
	 */
	_15ma,
	/**
	 * 1 octave higher
	 */
	_8va,
	/**
	 * Normal
	 */
	Regular,
	/**
	 * 1 octave lower
	 */
	_8vb,
	/**
	 * 2 octaves lower.
	 */
	_15mb
}
enum SimileMark {
	/**
	 * No simile mark is applied
	 */
	None,
	/**
	 * A simple simile mark. The previous bar is repeated.
	 */
	Simple,
	/**
	 * A double simile mark. This value is assigned to the first
	 * bar of the 2 repeat bars.
	 */
	FirstOfDouble,
	/**
	 * A double simile mark. This value is assigned to the second
	 * bar of the 2 repeat bars.
	 */
	SecondOfDouble
}
class Bar {
	private static _globalBarId: number = 0;

	/**
	 * Gets or sets the unique id of this bar.
	 */
	public id: number = Bar._globalBarId++;

	/**
	 * Gets or sets the zero-based index of this bar within the staff.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the next bar that comes after this bar.
	 * @json_ignore
	 */
	public nextBar: Bar | null = null;

	/**
	 * Gets or sets the previous bar that comes before this bar.
	 * @json_ignore
	 */
	public previousBar: Bar | null = null;

	/**
	 * Gets or sets the clef on this bar.
	 */
	public clef: Clef = Clef.G2;

	/**
	 * Gets or sets the ottava applied to the clef.
	 */
	public clefOttava: Ottavia = Ottavia.Regular;

	/**
	 * Gets or sets the reference to the parent staff.
	 * @json_ignore
	 */
	public staff!: Staff;

	/**
	 * Gets or sets the list of voices contained in this bar.
	 * @json_add addVoice
	 */
	public voices: Voice[] = [];

	/**
	 * Gets or sets the simile mark on this bar.
	 */
	public simileMark: SimileMark = SimileMark.None;

	/**
	 * Gets a value indicating whether this bar contains multiple voices with notes.
	 * @json_ignore
	 */
	public isMultiVoice: boolean = false;

	/**
	 * A relative scale for the size of the bar when displayed. The scale is relative 
	 * within a single line (system/stave group). The sum of all scales in one line make the total width,
	 * and then this individual scale gives the relative size.
	 */
	public displayScale: number = 1;

	/**
	 * An absolute width of the bar to use when displaying in single track display scenarios.
	 */
	public displayWidth: number = -1;

	public get masterBar(): MasterBar {
		return this.staff.track.score.masterBars[this.index];
	}

	public get isEmpty(): boolean {
		for (let i: number = 0, j: number = this.voices.length; i < j; i++) {
			if (!this.voices[i].isEmpty) {
				return false;
			}
		}
		return true;
	}

	public addVoice(voice: Voice): void {
		voice.bar = this;
		voice.index = this.voices.length;
		this.voices.push(voice);
	}

	public finish(settings: Settings, sharedDataBag: Map<string, unknown> | null = null): void {
		this.isMultiVoice = false;
		for (let i: number = 0, j: number = this.voices.length; i < j; i++) {
			let voice: Voice = this.voices[i];
			voice.finish(settings, sharedDataBag);
			if (i > 0 && !voice.isEmpty) {
				this.isMultiVoice = true;
			}
		}
	}

	public calculateDuration(): number {
		let duration: number = 0;
		for (let voice of this.voices) {
			let voiceDuration: number = voice.calculateDuration();
			if (voiceDuration > duration) {
				duration = voiceDuration;
			}
		}
		return duration;
	}
}
class GraceGroup {
	/**
	 * All beats within this group.
	 */
	public beats: Beat[] = [];

	/**
	 * Gets a unique ID for this grace group.
	 */
	public id: string = 'empty';

	/**
	 * true if the grace beat are followed by a normal beat within the same
	 * bar.
	 */
	public isComplete: boolean = false;

	/**
	 * Adds a new beat to this group
	 * @param beat The beat to add
	 */
	public addBeat(beat: Beat) {
		beat.graceIndex = this.beats.length;
		beat.graceGroup = this;
		this.beats.push(beat);
	}

	public finish() {
		if (this.beats.length > 0) {
			this.id = this.beats[0].absoluteDisplayStart + '_' + this.beats[0].voice.index;
		}
	}
}
enum GraceType {
	/**
	 * No grace, normal beat.
	 */
	None,
	/**
	 * The beat contains on-beat grace notes.
	 */
	OnBeat,
	/**
	 * The beat contains before-beat grace notes.
	 */
	BeforeBeat,
	/**
	 * The beat contains very special bend-grace notes used in SongBook style displays.
	 */
	BendGrace
}
class Voice {
	private _beatLookup!: Map<number, Beat>;

	private static _globalBarId: number = 0;

	/**
	 * Gets or sets the unique id of this bar.
	 */
	public id: number = Voice._globalBarId++;

	/**
	 * Gets or sets the zero-based index of this voice within the bar.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the reference to the bar this voice belongs to.
	 * @json_ignore
	 */
	public bar!: Bar;

	/**
	 * Gets or sets the list of beats contained in this voice.
	 * @json_add addBeat
	 */
	public beats: Beat[] = [];

	/**
	 * Gets or sets a value indicating whether this voice is empty.
	 */
	public isEmpty: boolean = true;

	public insertBeat(after: Beat, newBeat: Beat): void {
		newBeat.nextBeat = after.nextBeat;
		if (newBeat.nextBeat) {
			newBeat.nextBeat.previousBeat = newBeat;
		}
		newBeat.previousBeat = after;
		newBeat.voice = this;
		after.nextBeat = newBeat;
		this.beats.splice(after.index + 1, 0, newBeat);
	}

	public addBeat(beat: Beat): void {
		beat.voice = this;
		beat.index = this.beats.length;
		this.beats.push(beat);
		if (!beat.isEmpty) {
			this.isEmpty = false;
		}
	}

	private chain(beat: Beat, sharedDataBag: Map<string, unknown> | null = null): void {
		if (!this.bar) {
			return;
		}
		if (beat.index < this.beats.length - 1) {
			beat.nextBeat = this.beats[beat.index + 1];
			beat.nextBeat.previousBeat = beat;
		} else if (beat.isLastOfVoice && beat.voice.bar.nextBar) {
			let nextVoice: Voice = this.bar.nextBar!.voices[this.index];
			if (nextVoice.beats.length > 0) {
				beat.nextBeat = nextVoice.beats[0];
				beat.nextBeat.previousBeat = beat;
			} else {
				beat.nextBeat!.previousBeat = beat;
			}
		}

		beat.chain(sharedDataBag);
	}

	public addGraceBeat(beat: Beat): void {
		if (this.beats.length === 0) {
			this.addBeat(beat);
			return;
		}
		// remove last beat
		let lastBeat: Beat = this.beats[this.beats.length - 1];
		this.beats.splice(this.beats.length - 1, 1);
		// insert grace beat
		this.addBeat(beat);
		// reinsert last beat
		this.addBeat(lastBeat);
		this.isEmpty = false;
	}

	public getBeatAtPlaybackStart(playbackStart: number): Beat | null {
		if (this._beatLookup.has(playbackStart)) {
			return this._beatLookup.get(playbackStart)!;
		}
		return null;
	}

	public finish(settings: Settings, sharedDataBag: Map<string, unknown> | null = null): void {
		this._beatLookup = new Map<number, Beat>();
		let currentGraceGroup: GraceGroup | null = null;
		for (let index: number = 0; index < this.beats.length; index++) {
			let beat: Beat = this.beats[index];
			beat.index = index;
			this.chain(beat, sharedDataBag);
			if (beat.graceType === GraceType.None) {
				beat.graceGroup = currentGraceGroup;
				if (currentGraceGroup) {
					currentGraceGroup.isComplete = true;
				}
				currentGraceGroup = null;
			} else {
				if (!currentGraceGroup) {
					currentGraceGroup = new GraceGroup();
				}
				currentGraceGroup.addBeat(beat);
			}
		}

		let currentDisplayTick: number = 0;
		let currentPlaybackTick: number = 0;
		for (let i: number = 0; i < this.beats.length; i++) {
			let beat: Beat = this.beats[i];
			beat.index = i;
			beat.finish(settings, sharedDataBag);

			// if this beat is a non-grace but has grace notes
			// we need to first steal the duration from the right beat
			// and place the grace beats correctly
			if (beat.graceType === GraceType.None) {
				if (beat.graceGroup) {
					const firstGraceBeat = beat.graceGroup!.beats[0];
					const lastGraceBeat = beat.graceGroup!.beats[beat.graceGroup!.beats.length - 1];
					if (firstGraceBeat.graceType !== GraceType.BendGrace) {
						// find out the stolen duration first
						let stolenDuration: number =
							lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration - firstGraceBeat.playbackStart;

						switch (firstGraceBeat.graceType) {
							case GraceType.BeforeBeat:
								// steal duration from previous beat and then place grace beats newly
								if (firstGraceBeat.previousBeat) {
									firstGraceBeat.previousBeat.playbackDuration -= stolenDuration;
									// place beats starting after new beat end
									if (firstGraceBeat.previousBeat.voice == this) {
										currentPlaybackTick =
											firstGraceBeat.previousBeat.playbackStart +
											firstGraceBeat.previousBeat.playbackDuration;
									} else {
										// stealing into the previous bar
										currentPlaybackTick = -stolenDuration;
									}
								} else {
									// before-beat on start is somehow not possible as it causes negative ticks
									currentPlaybackTick = -stolenDuration;
								}

								for (const graceBeat of beat.graceGroup!.beats) {
									this._beatLookup.delete(graceBeat.playbackStart);
									graceBeat.playbackStart = currentPlaybackTick;
									this._beatLookup.set(graceBeat.playbackStart, beat);
									currentPlaybackTick += graceBeat.playbackDuration;
								}

								break;
							case GraceType.OnBeat:
								// steal duration from current beat
								beat.playbackDuration -= stolenDuration;
								if (lastGraceBeat.voice === this) {
									// with changed durations, update current position to be after the last grace beat
									currentPlaybackTick = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration;
								} else {
									// if last grace beat is on the previous bar, we shift the time back to have the note played earlier
									currentPlaybackTick = -stolenDuration;
								}
								break;
						}
					}
				}

				beat.displayStart = currentDisplayTick;
				beat.playbackStart = currentPlaybackTick;

				if (beat.fermata) {
					this.bar.masterBar.addFermata(beat.playbackStart, beat.fermata);
				} else {
					beat.fermata = this.bar.masterBar.getFermata(beat);
				}

				this._beatLookup.set(beat.playbackStart, beat);
			} else {
				beat.displayStart = currentDisplayTick;
				beat.playbackStart = currentPlaybackTick;
			}

			beat.finishTuplet();
			if (beat.graceGroup) {
				beat.graceGroup.finish();
			}
			currentDisplayTick += beat.displayDuration;
			currentPlaybackTick += beat.playbackDuration;
		}
	}

	public calculateDuration(): number {
		if (this.isEmpty || this.beats.length === 0) {
			return 0;
		}
		let lastBeat: Beat = this.beats[this.beats.length - 1];
		let firstBeat: Beat = this.beats[0];
		return lastBeat.playbackStart + lastBeat.playbackDuration - firstBeat.playbackStart;
	}
}
class Note {
	public static GlobalNoteId: number = 0;
	/**
	 * Gets or sets the unique id of this note.
	 * @clone_ignore
	 */
	public id: number = Note.GlobalNoteId++;

	/**
	 * Gets or sets the zero-based index of this note within the beat.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the accentuation of this note.
	 */
	public accentuated: AccentuationType = AccentuationType.None;

	/**
	 * Gets or sets the bend type for this note.
	 */
	public bendType: BendType = BendType.None;

	/**
	 * Gets or sets the bend style for this note.
	 */
	public bendStyle: BendStyle = BendStyle.Default;

	/**
	 * Gets or sets the note from which this note continues the bend.
	 * @clone_ignore
	 * @json_ignore
	 */
	public bendOrigin: Note | null = null;

	/**
	 * Gets or sets whether this note continues a bend from a previous note.
	 */
	public isContinuedBend: boolean = false;

	/**
	 * Gets or sets a list of the points defining the bend behavior.
	 * @clone_add addBendPoint
	 * @json_add addBendPoint
	 */
	public bendPoints: BendPoint[] | null = null;

	/**
	 * Gets or sets the bend point with the highest bend value.
	 * @clone_ignore
	 * @json_ignore
	 */
	public maxBendPoint: BendPoint | null = null;

	public get hasBend(): boolean {
		return this.bendPoints !== null && this.bendType !== BendType.None;
	}

	public get isStringed(): boolean {
		return this.string >= 0;
	}

	/**
	 * Gets or sets the fret on which this note is played on the instrument.
	 * 0 is the nut.
	 */
	public fret: number = -1;

	/**
	 * Gets or sets the string number where the note is placed.
	 * 1 is the lowest string on the guitar and the bottom line on the tablature.
	 * It then increases the the number of strings on available on the track.
	 */
	public string: number = -1;

	public get isPiano(): boolean {
		return !this.isStringed && this.octave >= 0 && this.tone >= 0;
	}

	/**
	 * Gets or sets the octave on which this note is played.
	 */
	public octave: number = -1;

	/**
	 * Gets or sets the tone of this note within the octave.
	 */
	public tone: number = -1;

	public get isPercussion(): boolean {
		return !this.isStringed && this.percussionArticulation >= 0;
	}

	/**
	 * Gets or sets the percusson element.
	 * @deprecated
	 */
	public get element(): number {
		return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[0] : -1;
	}

	/**
	 * Gets or sets the variation of this note.
	 * @deprecated
	 */
	public get variation(): number {
		return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[1] : -1;
	}

	/**
	 * Gets or sets the index of percussion articulation in the related `track.percussionArticulations`.
	 * If the articulation is not listed in `track.percussionArticulations` the following list based on GP7 applies:
	 * - 029 Ride (choke)
	 * - 030 Cymbal (hit)
	 * - 031 Snare (side stick)
	 * - 033 Snare (side stick)
	 * - 034 Snare (hit)
	 * - 035 Kick (hit)
	 * - 036 Kick (hit)
	 * - 037 Snare (side stick)
	 * - 038 Snare (hit)
	 * - 039 Hand Clap (hit)
	 * - 040 Snare (hit)
	 * - 041 Low Floor Tom (hit)
	 * - 042 Hi-Hat (closed)
	 * - 043 Very Low Tom (hit)
	 * - 044 Pedal Hi-Hat (hit)
	 * - 045 Low Tom (hit)
	 * - 046 Hi-Hat (open)
	 * - 047 Mid Tom (hit)
	 * - 048 High Tom (hit)
	 * - 049 Crash high (hit)
	 * - 050 High Floor Tom (hit)
	 * - 051 Ride (middle)
	 * - 052 China (hit)
	 * - 053 Ride (bell)
	 * - 054 Tambourine (hit)
	 * - 055 Splash (hit)
	 * - 056 Cowbell medium (hit)
	 * - 057 Crash medium (hit)
	 * - 058 Vibraslap (hit)
	 * - 059 Ride (edge)
	 * - 060 Hand (hit)
	 * - 061 Hand (hit)
	 * - 062 Conga high (mute)
	 * - 063 Conga high (hit)
	 * - 064 Conga low (hit)
	 * - 065 Timbale high (hit)
	 * - 066 Timbale low (hit)
	 * - 067 Agogo high (hit)
	 * - 068 Agogo tow (hit)
	 * - 069 Cabasa (hit)
	 * - 070 Left Maraca (hit)
	 * - 071 Whistle high (hit)
	 * - 072 Whistle low (hit)
	 * - 073 Guiro (hit)
	 * - 074 Guiro (scrap-return)
	 * - 075 Claves (hit)
	 * - 076 Woodblock high (hit)
	 * - 077 Woodblock low (hit)
	 * - 078 Cuica (mute)
	 * - 079 Cuica (open)
	 * - 080 Triangle (rnute)
	 * - 081 Triangle (hit)
	 * - 082 Shaker (hit)
	 * - 083 Tinkle Bell (hat)
	 * - 083 Jingle Bell (hit)
	 * - 084 Bell Tree (hit)
	 * - 085 Castanets (hit)
	 * - 086 Surdo (hit)
	 * - 087 Surdo (mute)
	 * - 091 Snare (rim shot)
	 * - 092 Hi-Hat (half)
	 * - 093 Ride (edge)
	 * - 094 Ride (choke)
	 * - 095 Splash (choke)
	 * - 096 China (choke)
	 * - 097 Crash high (choke)
	 * - 098 Crash medium (choke)
	 * - 099 Cowbell low (hit)
	 * - 100 Cowbell low (tip)
	 * - 101 Cowbell medium (tip)
	 * - 102 Cowbell high (hit)
	 * - 103 Cowbell high (tip)
	 * - 104 Hand (mute)
	 * - 105 Hand (slap)
	 * - 106 Hand (mute)
	 * - 107 Hand (slap)
	 * - 108 Conga low (slap)
	 * - 109 Conga low (mute)
	 * - 110 Conga high (slap)
	 * - 111 Tambourine (return)
	 * - 112 Tambourine (roll)
	 * - 113 Tambourine (hand)
	 * - 114 Grancassa (hit)
	 * - 115 Piatti (hat)
	 * - 116 Piatti (hand)
	 * - 117 Cabasa (return)
	 * - 118 Left Maraca (return)
	 * - 119 Right Maraca (hit)
	 * - 120 Right Maraca (return)
	 * - 122 Shaker (return)
	 * - 123 Bell Tee (return)
	 * - 124 Golpe (thumb)
	 * - 125 Golpe (finger)
	 * - 126 Ride (middle)
	 * - 127 Ride (bell)
	 */
	public percussionArticulation: number = -1;

	/**
	 * Gets or sets whether this note is visible on the music sheet.
	 */
	public isVisible: boolean = true;

	/**
	 * Gets a value indicating whether the note is left hand tapped.
	 */
	public isLeftHandTapped: boolean = false;

	/**
	 * Gets or sets whether this note starts a hammeron or pulloff.
	 */
	public isHammerPullOrigin: boolean = false;

	public get isHammerPullDestination(): boolean {
		return !!this.hammerPullOrigin;
	}

	/**
	 * Gets the origin of the hammeron/pulloff of this note.
	 * @clone_ignore
	 * @json_ignore
	 */
	public hammerPullOrigin: Note | null = null;

	/**
	 * Gets the destination for the hammeron/pullof started by this note.
	 * @clone_ignore
	 * @json_ignore
	 */
	public hammerPullDestination: Note | null = null;

	public get isSlurOrigin(): boolean {
		return !!this.slurDestination;
	}

	/**
	 * Gets or sets whether this note finishes a slur.
	 */
	public isSlurDestination: boolean = false;

	/**
	 * Gets or sets the note where the slur of this note starts.
	 * @clone_ignore
	 * @json_ignore
	 */
	public slurOrigin: Note | null = null;

	/**
	 * Gets or sets the note where the slur of this note ends.
	 * @clone_ignore
	 * @json_ignore
	 */
	public slurDestination: Note | null = null;

	public get isHarmonic(): boolean {
		return this.harmonicType !== HarmonicType.None;
	}

	/**
	 * Gets or sets the harmonic type applied to this note.
	 */
	public harmonicType: HarmonicType = HarmonicType.None;

	/**
	 * Gets or sets the value defining the harmonic pitch.
	 */
	public harmonicValue: number = 0;

	/**
	 * Gets or sets whether the note is a ghost note and shown in parenthesis. Also this will make the note a bit more silent.
	 */
	public isGhost: boolean = false;

	/**
	 * Gets or sets whether this note has a let-ring effect.
	 */
	public isLetRing: boolean = false;

	/**
	 * Gets or sets the destination note for the let-ring effect.
	 * @clone_ignore
	 * @json_ignore
	 */
	public letRingDestination: Note | null = null;

	/**
	 * Gets or sets whether this note has a palm-mute effect.
	 */
	public isPalmMute: boolean = false;

	/**
	 * Gets or sets the destination note for the palm-mute effect.
	 * @clone_ignore
	 * @json_ignore
	 */
	public palmMuteDestination: Note | null = null;

	/**
	 * Gets or sets whether the note is shown and played as dead note.
	 */
	public isDead: boolean = false;

	/**
	 * Gets or sets whether the note is played as staccato.
	 */
	public isStaccato: boolean = false;

	/**
	 * Gets or sets the slide-in type this note is played with.
	 */
	public slideInType: SlideInType = SlideInType.None;

	/**
	 * Gets or sets the slide-out type this note is played with.
	 */
	public slideOutType: SlideOutType = SlideOutType.None;

	/**
	 * Gets or sets the target note for several slide types.
	 * @clone_ignore
	 * @json_ignore
	 */
	public slideTarget: Note | null = null;

	/**
	 * Gets or sets the source note for several slide types.
	 * @clone_ignore
	 * @json_ignore
	 */
	public slideOrigin: Note | null = null;

	/**
	 * Gets or sets whether a vibrato is played on the note.
	 */
	public vibrato: VibratoType = VibratoType.None;

	/**
	 * Gets the origin of the tied if this note is tied.
	 * @clone_ignore
	 * @json_ignore
	 */
	public tieOrigin: Note | null = null;

	/**
	 * Gets the desination of the tie.
	 * @clone_ignore
	 * @json_ignore 
	 */
	public tieDestination: Note | null = null;

	/**
	 * Gets or sets whether this note is ends a tied note.
	 */
	public isTieDestination: boolean = false;

	public get isTieOrigin(): boolean {
		return this.tieDestination !== null;
	}

	/**
	 * Gets or sets the fingers used for this note on the left hand.
	 */
	public leftHandFinger: Fingers = Fingers.Unknown;

	/**
	 * Gets or sets the fingers used for this note on the right hand.
	 */
	public rightHandFinger: Fingers = Fingers.Unknown;

	/**
	 * Gets or sets whether this note has fingering defined.
	 */
	public isFingering: boolean = false;

	/**
	 * Gets or sets the target note value for the trill effect.
	 */
	public trillValue: number = -1;

	public get trillFret(): number {
		return this.trillValue - this.stringTuning;
	}

	public get isTrill(): boolean {
		return this.trillValue >= 0;
	}

	/**
	 * Gets or sets the speed of the trill effect.
	 */
	public trillSpeed: Duration = Duration.ThirtySecond;

	/**
	 * Gets or sets the percentual duration of the note relative to the overall beat duration .
	 */
	public durationPercent: number = 1;

	/**
	 * Gets or sets how accidetnals for this note should  be handled.
	 */
	public accidentalMode: NoteAccidentalMode = NoteAccidentalMode.Default;

	/**
	 * Gets or sets the reference to the parent beat to which this note belongs to.
	 * @clone_ignore
	 * @json_ignore
	 */
	public beat!: Beat;

	/**
	 * Gets or sets the dynamics for this note.
	 */
	public dynamics: DynamicValue = DynamicValue.F;

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public isEffectSlurOrigin: boolean = false;

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public hasEffectSlur: boolean = false;

	public get isEffectSlurDestination(): boolean {
		return !!this.effectSlurOrigin;
	}

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public effectSlurOrigin: Note | null = null;

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public effectSlurDestination: Note | null = null;

	public get stringTuning(): number {
		return this.beat.voice.bar.staff.capo + Note.getStringTuning(this.beat.voice.bar.staff, this.string);
	}

	public static getStringTuning(staff: Staff, noteString: number): number {
		if (staff.tuning.length > 0) {
			return staff.tuning[staff.tuning.length - (noteString - 1) - 1];
		}
		return 0;
	}

	public get realValue(): number {
		return this.calculateRealValue(true, true);
	}

	public get realValueWithoutHarmonic(): number {
		return this.calculateRealValue(true, false);
	}

	/**
	 * Calculates the real note value of this note as midi key respecting the given options.
	 * @param applyTranspositionPitch Whether or not to apply the transposition pitch of the current staff. 
	 * @param applyHarmonic Whether or not to apply harmonic pitches to the note. 
	 * @returns The calculated note value as midi key.
	 */
	public calculateRealValue(applyTranspositionPitch: boolean, applyHarmonic: boolean): number {
		const transpositionPitch = applyTranspositionPitch ? this.beat.voice.bar.staff.transpositionPitch : 0;

		if (applyHarmonic) {
			let realValue = this.calculateRealValue(applyTranspositionPitch, false);
			if (this.isStringed) {
				if (this.harmonicType === HarmonicType.Natural) {
					realValue = this.harmonicPitch + this.stringTuning - transpositionPitch;
				} else {
					realValue += this.harmonicPitch;
				}
			}
			return realValue;
		}
		else {
			if (this.isPercussion) {
				return this.percussionArticulation;
			}
			if (this.isStringed) {
				return this.fret + this.stringTuning - transpositionPitch;
			}
			if (this.isPiano) {
				return this.octave * 12 + this.tone - transpositionPitch;
			}
			return 0;
		}
	}

	public get harmonicPitch(): number {
		if (this.harmonicType === HarmonicType.None || !this.isStringed) {
			return 0;
		}
		let value: number = this.harmonicValue;
		// add semitones to reach corresponding harmonic frets
		if (ModelUtils.isAlmostEqualTo(value, 2.4)) {
			return 36;
		}
		if (ModelUtils.isAlmostEqualTo(value, 2.7)) {
			// Fret 3 2nd octave + minor seventh
			return 34;
		}
		if (value < 3) {
			// no natural harmonics below fret 3
			return 0;
		}
		if (value <= 3.5) {
			// Fret 3 2nd octave + fifth
			return 31;
		}
		if (value <= 4) {
			return 28;
		}
		if (value <= 5) {
			return 24;
		}
		if (value <= 6) {
			return 34;
		}
		if (value <= 7) {
			return 19;
		}
		if (value <= 8.5) {
			return 36;
		}
		if (value <= 9) {
			return 28;
		}
		if (value <= 10) {
			return 34;
		}
		if (value <= 11) {
			return 0;
		}
		if (value <= 12) {
			return 12;
		}
		if (value < 14) {
			// fret 13,14 stay
			return 0;
		}
		if (value <= 15) {
			return 34;
		}
		if (value <= 16) {
			return 28;
		}
		if (value <= 17) {
			return 36;
		}
		if (value <= 18) {
			return 0;
		}
		if (value <= 19) {
			return 19;
		}
		if (value <= 21) {
			//  20,21 stay
			return 0;
		}
		if (value <= 22) {
			return 36;
		}
		if (value <= 24) {
			return 24;
		}
		return 0;
	}

	public get initialBendValue(): number {
		if (this.hasBend) {
			return Math.floor(this.bendPoints![0].value / 2);
		} else if (this.bendOrigin) {
			return Math.floor(this.bendOrigin.bendPoints![this.bendOrigin.bendPoints!.length - 1].value / 2);
		} else if (this.isTieDestination && this.tieOrigin!.bendOrigin) {
			return Math.floor(this.tieOrigin!.bendOrigin.bendPoints![this.tieOrigin!.bendOrigin.bendPoints!.length - 1].value / 2);
		} else if (this.beat.hasWhammyBar) {
			return Math.floor(this.beat.whammyBarPoints![0].value / 2);
		} else if (this.beat.isContinuedWhammy) {
			return Math.floor(this.beat.previousBeat!.whammyBarPoints![this.beat.previousBeat!.whammyBarPoints!.length - 1].value / 2);
		}
		return 0;
	}

	public get displayValue(): number {
		return this.displayValueWithoutBend + this.initialBendValue;
	}

	public get displayValueWithoutBend(): number {
		let noteValue: number = this.realValue;
		if (this.harmonicType !== HarmonicType.Natural && this.harmonicType !== HarmonicType.None) {
			noteValue -= this.harmonicPitch;
		}
		switch (this.beat.ottava) {
			case Ottavia._15ma:
				noteValue -= 24;
				break;
			case Ottavia._8va:
				noteValue -= 12;
				break;
			case Ottavia.Regular:
				break;
			case Ottavia._8vb:
				noteValue += 12;
				break;
			case Ottavia._15mb:
				noteValue += 24;
				break;
		}
		switch (this.beat.voice.bar.clefOttava) {
			case Ottavia._15ma:
				noteValue -= 24;
				break;
			case Ottavia._8va:
				noteValue -= 12;
				break;
			case Ottavia.Regular:
				break;
			case Ottavia._8vb:
				noteValue += 12;
				break;
			case Ottavia._15mb:
				noteValue += 24;
				break;
		}
		return noteValue - this.beat.voice.bar.staff.displayTranspositionPitch;
	}

	public get hasQuarterToneOffset(): boolean {
		if (this.hasBend) {
			return this.bendPoints![0].value % 2 !== 0;
		}
		if (this.bendOrigin) {
			return this.bendOrigin.bendPoints![this.bendOrigin.bendPoints!.length - 1].value % 2 !== 0;
		}
		if (this.beat.hasWhammyBar) {
			return this.beat.whammyBarPoints![0].value % 2 !== 0;
		}
		if (this.beat.isContinuedWhammy) {
			return (
				this.beat.previousBeat!.whammyBarPoints![this.beat.previousBeat!.whammyBarPoints!.length - 1].value %
				2 !==
				0
			);
		}
		return false;
	}

	public addBendPoint(point: BendPoint): void {
		let points = this.bendPoints;
		if (points === null) {
			points = [];
			this.bendPoints = points;
		}
		points.push(point);
		if (!this.maxBendPoint || point.value > this.maxBendPoint.value) {
			this.maxBendPoint = point;
		}
		if (this.bendType === BendType.None) {
			this.bendType = BendType.Custom;
		}
	}

	public finish(settings: Settings, sharedDataBag: Map<string, unknown> | null = null): void {
		let nextNoteOnLine: Lazy<Note | null> = new Lazy<Note | null>(() => Note.nextNoteOnSameLine(this));
		let isSongBook: boolean = settings && settings.notation.notationMode === NotationMode.SongBook;

		// connect ties
		if (this.isTieDestination) {
			this.chain(sharedDataBag);
			// implicit let ring
			if (isSongBook && this.tieOrigin && this.tieOrigin.isLetRing) {
				this.isLetRing = true;
			}
		}
		// connect letring
		if (this.isLetRing) {
			if (!nextNoteOnLine.value || !nextNoteOnLine.value.isLetRing) {
				this.letRingDestination = this;
			} else {
				this.letRingDestination = nextNoteOnLine.value;
			}
			if (isSongBook && this.isTieDestination && !this.tieOrigin!.hasBend) {
				this.isVisible = false;
			}
		}
		// connect palmmute
		if (this.isPalmMute) {
			if (!nextNoteOnLine.value || !nextNoteOnLine.value.isPalmMute) {
				this.palmMuteDestination = this;
			} else {
				this.palmMuteDestination = nextNoteOnLine.value;
			}
		}
		// set hammeron/pulloffs
		if (this.isHammerPullOrigin) {
			let hammerPullDestination = Note.findHammerPullDestination(this);
			if (!hammerPullDestination) {
				this.isHammerPullOrigin = false;
			} else {
				this.hammerPullDestination = hammerPullDestination;
				hammerPullDestination.hammerPullOrigin = this;
			}
		}
		// set slides
		switch (this.slideOutType) {
			case SlideOutType.Shift:
			case SlideOutType.Legato:
				this.slideTarget = nextNoteOnLine.value;
				if (!this.slideTarget) {
					this.slideOutType = SlideOutType.None;
				} else {
					this.slideTarget.slideOrigin = this;
				}
				break;
		}
		let effectSlurDestination: Note | null = null;
		if (this.isHammerPullOrigin && this.hammerPullDestination) {
			effectSlurDestination = this.hammerPullDestination;
		} else if (this.slideOutType === SlideOutType.Legato && this.slideTarget) {
			effectSlurDestination = this.slideTarget;
		}
		if (effectSlurDestination) {
			this.hasEffectSlur = true;
			if (this.effectSlurOrigin && this.beat.pickStroke === PickStroke.None) {
				this.effectSlurOrigin.effectSlurDestination = effectSlurDestination;
				this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
				this.effectSlurOrigin = null;
			} else {
				this.isEffectSlurOrigin = true;
				this.effectSlurDestination = effectSlurDestination;
				this.effectSlurDestination.effectSlurOrigin = this;
			}
		}
		// try to detect what kind of bend was used and cleans unneeded points if required
		// Guitar Pro 6 and above (gpif.xml) uses exactly 4 points to define all bends
		const points = this.bendPoints;
		if (points != null && points.length > 0 && this.bendType === BendType.Custom) {
			let isContinuedBend: boolean = this.isTieDestination && this.tieOrigin!.hasBend;
			this.isContinuedBend = isContinuedBend;
			if (points.length === 4) {
				let origin: BendPoint = points[0];
				let middle1: BendPoint = points[1];
				let middle2: BendPoint = points[2];
				let destination: BendPoint = points[3];
				// the middle points are used for holds, anything else is a new feature we do not support yet
				if (middle1.value === middle2.value) {
					// bend higher?
					if (destination.value > origin.value) {
						if (middle1.value > destination.value) {
							this.bendType = BendType.BendRelease;
						} else if (!isContinuedBend && origin.value > 0) {
							this.bendType = BendType.PrebendBend;
							points.splice(2, 1);
							points.splice(1, 1);
						} else {
							this.bendType = BendType.Bend;
							points.splice(2, 1);
							points.splice(1, 1);
						}
					} else if (destination.value < origin.value) {
						// origin must be > 0 otherwise it's no release, we cannot bend negative
						if (isContinuedBend) {
							this.bendType = BendType.Release;
							points.splice(2, 1);
							points.splice(1, 1);
						} else {
							this.bendType = BendType.PrebendRelease;
							points.splice(2, 1);
							points.splice(1, 1);
						}
					} else {
						if (middle1.value > origin.value) {
							this.bendType = BendType.BendRelease;
						} else if (origin.value > 0 && !isContinuedBend) {
							this.bendType = BendType.Prebend;
							points.splice(2, 1);
							points.splice(1, 1);
						} else {
							this.bendType = BendType.Hold;
							points.splice(2, 1);
							points.splice(1, 1);
						}
					}
				} else {
					//Logger.warning('Model', 'Unsupported bend type detected, fallback to custom', null);
				}
			} else if (points.length === 2) {
				let origin: BendPoint = points[0];
				let destination: BendPoint = points[1];
				// bend higher?
				if (destination.value > origin.value) {
					if (!isContinuedBend && origin.value > 0) {
						this.bendType = BendType.PrebendBend;
					} else {
						this.bendType = BendType.Bend;
					}
				} else if (destination.value < origin.value) {
					// origin must be > 0 otherwise it's no release, we cannot bend negative
					if (isContinuedBend) {
						this.bendType = BendType.Release;
					} else {
						this.bendType = BendType.PrebendRelease;
					}
				} else {
					this.bendType = BendType.Hold;
				}
			}
		} else if (points === null || points.length === 0) {
			this.bendType = BendType.None;
		}

		// initial bend pitch offsets and forced accidentals don't play well together
		// we reset it
		if (this.initialBendValue > 0) {
			this.accidentalMode = NoteAccidentalMode.Default;
		}
	}

	private static readonly MaxOffsetForSameLineSearch: number = 3;

	public static nextNoteOnSameLine(note: Note): Note | null {
		let nextBeat: Beat | null = note.beat.nextBeat;
		// keep searching in same bar
		while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
			let noteOnString: Note | null = nextBeat.getNoteOnString(note.string);
			if (noteOnString) {
				return noteOnString;
			}
			nextBeat = nextBeat.nextBeat;
		}
		return null;
	}

	static findHammerPullDestination(note: Note): Note | null {
		// For Hammer-Pull destinations we have 2 potential candidates
		// 1. A note on the same string
		// 2. A note on a different string, but with a left-hand-tapping applied

		// for the second case we have a special logic to search for notes:
		// 1. We first search on lower strings, then on higher strings
		// 2. If we find a note with a left-hand-tap applied it becomes the target
		// 3. If we find a note without a left-hand-tap we stop searching in this direction

		let nextBeat: Beat | null = note.beat.nextBeat;
		// keep searching in same bar
		while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
			// 1. same string first
			let noteOnString: Note | null = nextBeat.getNoteOnString(note.string);
			if (noteOnString) {
				return noteOnString;
			}

			// 2. search toward lower strings
			for (let str = note.string; str > 0; str--) {
				noteOnString = nextBeat.getNoteOnString(str);
				if (noteOnString) {
					if (noteOnString.isLeftHandTapped) {
						return noteOnString;
					} else {
						break;
					}
				}
			}

			// 3. search toward higher strings
			for (let str = note.string; str <= note.beat.voice.bar.staff.tuning.length; str++) {
				noteOnString = nextBeat.getNoteOnString(str);
				if (noteOnString) {
					if (noteOnString.isLeftHandTapped) {
						return noteOnString;
					} else {
						break;
					}
				}
			}

			// nothing found, search on next beat
			nextBeat = nextBeat.nextBeat;
		}
		return null;
	}

	public static findTieOrigin(note: Note): Note | null {
		let previousBeat: Beat | null = note.beat.previousBeat;
		// keep searching in same bar
		while (
			previousBeat &&
			previousBeat.voice.bar.index >= note.beat.voice.bar.index - Note.MaxOffsetForSameLineSearch
		) {
			if (note.isStringed) {
				let noteOnString: Note | null = previousBeat.getNoteOnString(note.string);
				if (noteOnString) {
					return noteOnString;
				}
			} else {
				if (note.octave === -1 && note.tone === -1) {
					// if the note has no value (e.g. alphaTex dash tie), we try to find a matching
					// note on the previous beat by index.
					if (note.index < previousBeat.notes.length) {
						return previousBeat.notes[note.index];
					}
				} else {
					let noteWithValue: Note | null = previousBeat.getNoteWithRealValue(note.realValue);
					if (noteWithValue) {
						return noteWithValue;
					}
				}
			}
			previousBeat = previousBeat.previousBeat;
		}
		return null;
	}

	private static NoteIdLookupKey = 'NoteIdLookup';

	private _noteIdBag: NoteIdBag | null = null;
	public chain(sharedDataBag: Map<string, unknown> | null = null) {
		// mainly for backwards compat in case we reach this code from somewhere outside.
		if (sharedDataBag === null) {
			return;
		}

		// if we have some IDs from a serialization flow,
		// we need to lookup/register the notes correctly
		if (this._noteIdBag !== null) {
			// get or create lookup
			let noteIdLookup: Map<number, Note>;
			if (sharedDataBag.has(Note.NoteIdLookupKey)) {
				noteIdLookup = sharedDataBag.get(Note.NoteIdLookupKey) as Map<number, Note>;
			} else {
				noteIdLookup = new Map<number, Note>();
				sharedDataBag.set(Note.NoteIdLookupKey, noteIdLookup);
			}

			// if this note is a source note for any effect, remember it for later
			// the destination note will look it up for linking
			if (this._noteIdBag.hammerPullDestinationNoteId !== -1 ||
				this._noteIdBag.tieDestinationNoteId !== -1 ||
				this._noteIdBag.slurDestinationNoteId !== -1) {
				noteIdLookup.set(this.id, this);
			}

			// on any effect destiniation, lookup the origin which should already be 
			// registered
			if (this._noteIdBag.hammerPullOriginNoteId !== -1) {
				this.hammerPullOrigin = noteIdLookup.get(this._noteIdBag.hammerPullOriginNoteId)!;
				this.hammerPullOrigin.hammerPullDestination = this;
			}
			if (this._noteIdBag.tieOriginNoteId !== -1) {
				this.tieOrigin = noteIdLookup.get(this._noteIdBag.tieOriginNoteId)!;
				this.tieOrigin.tieDestination = this;
			}
			if (this._noteIdBag.slurOriginNoteId !== -1) {
				this.slurOrigin = noteIdLookup.get(this._noteIdBag.slurOriginNoteId)!;
				this.slurOrigin.slurDestination = this;
			}

			this._noteIdBag = null; // not needed anymore
		} else {
			// no tie destination at all?
			if (!this.isTieDestination && this.tieOrigin === null) {
				return;
			}

			let tieOrigin = this.tieOrigin ?? Note.findTieOrigin(this);
			if (!tieOrigin) {
				this.isTieDestination = false;
			} else {
				tieOrigin.tieDestination = this;
				this.tieOrigin = tieOrigin;
				this.fret = tieOrigin.fret;
				this.octave = tieOrigin.octave;
				this.tone = tieOrigin.tone;
				if (tieOrigin.hasBend) {
					this.bendOrigin = this.tieOrigin;
				}
			}
		}
	}

	/**
	 * @internal
	 */
	public toJson(o: Map<string, unknown>) {
		// inject linked note ids into JSON
		if (this.tieDestination !== null) {
			o.set('tiedestinationnoteid', this.tieDestination.id);
		}
		if (this.tieOrigin !== null) {
			o.set('tieoriginnoteid', this.tieOrigin.id);
		}
		if (this.slurDestination !== null) {
			o.set('slurdestinationnoteid', this.slurDestination.id);
		}
		if (this.slurOrigin !== null) {
			o.set('sluroriginnoteid', this.slurOrigin.id);
		}
		if (this.hammerPullOrigin !== null) {
			o.set('hammerpulloriginnoteid', this.hammerPullOrigin.id);
		}
		if (this.hammerPullDestination !== null) {
			o.set('hammerpulldestinationnoteid', this.hammerPullDestination.id);
		}
	}

	/**
	 * @internal
	 */
	public setProperty(property: string, v: unknown): boolean {
		switch (property) {
			case "tiedestinationnoteid":
				if (this._noteIdBag == null) {
					this._noteIdBag = new NoteIdBag();
				}
				this._noteIdBag.tieDestinationNoteId = v as number;
				return true;
			case "tieoriginnoteid":
				if (this._noteIdBag == null) {
					this._noteIdBag = new NoteIdBag();
				}
				this._noteIdBag.tieOriginNoteId = v as number;
				return true;

			case "slurdestinationnoteid":
				if (this._noteIdBag == null) {
					this._noteIdBag = new NoteIdBag();
				}
				this._noteIdBag.slurDestinationNoteId = v as number;
				return true;
			case "sluroriginnoteid":
				if (this._noteIdBag == null) {
					this._noteIdBag = new NoteIdBag();
				}
				this._noteIdBag.slurOriginNoteId = v as number;
				return true;

			case "hammerpulloriginnoteid":
				if (this._noteIdBag == null) {
					this._noteIdBag = new NoteIdBag();
				}
				this._noteIdBag.hammerPullOriginNoteId = v as number;
				return true;
			case "hammerpulldestinationnoteid":
				if (this._noteIdBag == null) {
					this._noteIdBag = new NoteIdBag();
				}
				this._noteIdBag.hammerPullDestinationNoteId = v as number;
				return true;
		}
		return false;
	}
}
class Beat {
	private static _globalBeatId: number = 0;

	/**
	 * Gets or sets the unique id of this beat.
	 * @clone_ignore
	 */
	public id: number = Beat._globalBeatId++;

	/**
	 * Gets or sets the zero-based index of this beat within the voice.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the previous beat within the whole song.
	 * @json_ignore
	 * @clone_ignore
	 */
	public previousBeat: Beat | null = null;

	/**
	 * Gets or sets the next beat within the whole song.
	 * @json_ignore
	 * @clone_ignore
	 */
	public nextBeat: Beat | null = null;

	public get isLastOfVoice(): boolean {
		return this.index === this.voice.beats.length - 1;
	}

	/**
	 * Gets or sets the reference to the parent voice this beat belongs to.
	 * @json_ignore
	 * @clone_ignore
	 */
	public voice!: Voice;

	/**
	 * Gets or sets the list of notes contained in this beat.
	 * @json_add addNote
	 * @clone_add addNote
	 */
	public notes: Note[] = [];

	/**
	 * Gets the lookup where the notes per string are registered.
	 * If this staff contains string based notes this lookup allows fast access.
	 * @json_ignore
	 */
	public readonly noteStringLookup: Map<number, Note> = new Map();

	/**
	 * Gets the lookup where the notes per value are registered.
	 * If this staff contains string based notes this lookup allows fast access.
	 * @json_ignore
	 */
	public readonly noteValueLookup: Map<number, Note> = new Map();

	/**
	 * Gets or sets a value indicating whether this beat is considered empty.
	 */
	public isEmpty: boolean = false;

	/**
	 * Gets or sets which whammy bar style should be used for this bar.
	 */
	public whammyStyle: BendStyle = BendStyle.Default;

	/**
	 * Gets or sets the ottava applied to this beat.
	 */
	public ottava: Ottavia = Ottavia.Regular;

	/**
	 * Gets or sets the fermata applied to this beat.
	 * @clone_ignore
	 * @json_ignore
	 */
	public fermata: Fermata | null = null;

	/**
	 * Gets a value indicating whether this beat starts a legato slur.
	 */
	public isLegatoOrigin: boolean = false;

	public get isLegatoDestination(): boolean {
		return !!this.previousBeat && this.previousBeat.isLegatoOrigin;
	}

	/**
	 * Gets or sets the note with the lowest pitch in this beat. Only visible notes are considered.
	 * @json_ignore
	 * @clone_ignore
	 */
	public minNote: Note | null = null;

	/**
	 * Gets or sets the note with the highest pitch in this beat. Only visible notes are considered.
	 * @json_ignore
	 * @clone_ignore
	 */
	public maxNote: Note | null = null;

	/**
	 * Gets or sets the note with the highest string number in this beat. Only visible notes are considered.
	 * @json_ignore
	 * @clone_ignore
	 */
	public maxStringNote: Note | null = null;

	/**
	 * Gets or sets the note with the lowest string number in this beat. Only visible notes are considered.
	 * @json_ignore
	 * @clone_ignore
	 */
	public minStringNote: Note | null = null;

	/**
	 * Gets or sets the duration of this beat.
	 */
	public duration: Duration = Duration.Quarter;

	public get isRest(): boolean {
		return this.isEmpty || this.notes.length === 0;
	}

	/**
	 * Gets a value indicating whether this beat is a full bar rest.
	 */
	public get isFullBarRest(): boolean {
		return this.isRest && this.voice.beats.length === 1 && this.duration === Duration.Whole;
	}

	/**
	 * Gets or sets whether any note in this beat has a let-ring applied.
	 * @json_ignore
	 */
	public isLetRing: boolean = false;

	/**
	 * Gets or sets whether any note in this beat has a palm-mute paplied.
	 * @json_ignore
	 */
	public isPalmMute: boolean = false;

	/**
	 * Gets or sets a list of all automations on this beat.
	 */
	public automations: Automation[] = [];

	/**
	 * Gets or sets the number of dots applied to the duration of this beat.
	 */
	public dots: number = 0;

	/**
	 * Gets or sets a value indicating whether this beat is fade-in.
	 */
	public fadeIn: boolean = false;

	/**
	 * Gets or sets the lyrics shown on this beat.
	 */
	public lyrics: string[] | null = null;

	/**
	 * Gets or sets a value indicating whether the beat is played in rasgueado style.
	 */
	public hasRasgueado: boolean = false;

	/**
	 * Gets or sets a value indicating whether the notes on this beat are played with a pop-style (bass).
	 */
	public pop: boolean = false;

	/**
	 * Gets or sets a value indicating whether the notes on this beat are played with a slap-style (bass).
	 */
	public slap: boolean = false;

	/**
	 * Gets or sets a value indicating whether the notes on this beat are played with a tap-style (bass).
	 */
	public tap: boolean = false;

	/**
	 * Gets or sets the text annotation shown on this beat.
	 */
	public text: string | null = null;

	/**
	 * Gets or sets the brush type applied to the notes of this beat.
	 */
	public brushType: BrushType = BrushType.None;

	/**
	 * Gets or sets the duration of the brush between the notes in midi ticks.
	 */
	public brushDuration: number = 0;

	/**
	 * Gets or sets the tuplet denominator.
	 */
	public tupletDenominator: number = -1;

	/**
	 * Gets or sets the tuplet numerator.
	 */
	public tupletNumerator: number = -1;

	public get hasTuplet(): boolean {
		return (
			!(this.tupletDenominator === -1 && this.tupletNumerator === -1) &&
			!(this.tupletDenominator === 1 && this.tupletNumerator === 1)
		);
	}

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public tupletGroup: TupletGroup | null = null;

	/**
	 * Gets or sets whether this beat continues a whammy effect.
	 */
	public isContinuedWhammy: boolean = false;

	/**
	 * Gets or sets the whammy bar style of this beat.
	 */
	public whammyBarType: WhammyType = WhammyType.None;

	/**
	 * Gets or sets the points defining the whammy bar usage.
	 * @json_add addWhammyBarPoint
	 * @clone_add addWhammyBarPoint
	 */
	public whammyBarPoints: BendPoint[] | null = null;

	/**
	 * Gets or sets the highest point with for the highest whammy bar value.
	 * @json_ignore
	 * @clone_ignore
	 */
	public maxWhammyPoint: BendPoint | null = null;

	/**
	 * Gets or sets the highest point with for the lowest whammy bar value.
	 * @json_ignore
	 * @clone_ignore
	 */
	public minWhammyPoint: BendPoint | null = null;

	public get hasWhammyBar(): boolean {
		return this.whammyBarPoints !== null && this.whammyBarType !== WhammyType.None;
	}

	/**
	 * Gets or sets the vibrato effect used on this beat.
	 */
	public vibrato: VibratoType = VibratoType.None;

	/**
	 * Gets or sets the ID of the chord used on this beat.
	 */
	public chordId: string | null = null;

	public get hasChord(): boolean {
		return !!this.chordId;
	}

	public get chord(): Chord | null {
		return this.chordId ? this.voice.bar.staff.getChord(this.chordId)! : null;
	}

	/**
	 * Gets or sets the grace style of this beat.
	 */
	public graceType: GraceType = GraceType.None;

	/**
	 * Gets or sets the grace group this beat belongs to.
	 * If this beat is not a grace note, it holds the group which belongs to this beat.
	 * @json_ignore
	 * @clone_ignore
	 */
	public graceGroup: GraceGroup | null = null;

	/**
	 * Gets or sets the index of this beat within the grace group if
	 * this is a grace beat.
	 * @json_ignore
	 * @clone_ignore
	 */
	public graceIndex: number = -1;

	/**
	 * Gets or sets the pickstroke applied on this beat.
	 */
	public pickStroke: PickStroke = PickStroke.None;

	public get isTremolo(): boolean {
		return !!this.tremoloSpeed;
	}

	/**
	 * Gets or sets the speed of the tremolo effect.
	 */
	public tremoloSpeed: Duration | null = null;

	/**
	 * Gets or sets whether a crescendo/decrescendo is applied on this beat.
	 */
	public crescendo: CrescendoType = CrescendoType.None;

	/**
	 * The timeline position of the voice within the current bar as it is displayed. (unit: midi ticks)
	 * This might differ from the actual playback time due to special grace types.
	 */
	public displayStart: number = 0;

	/**
	 * The timeline position of the voice within the current bar as it is played. (unit: midi ticks)
	 * This might differ from the actual playback time due to special grace types.
	 */
	public playbackStart: number = 0;

	/**
	 * Gets or sets the duration that is used for the display of this beat. It defines the size/width of the beat in
	 * the music sheet. (unit: midi ticks).
	 */
	public displayDuration: number = 0;

	/**
	 * Gets or sets the duration that the note is played during the audio generation.
	 */
	public playbackDuration: number = 0;

	public get absoluteDisplayStart(): number {
		return this.voice.bar.masterBar.start + this.displayStart;
	}

	public get absolutePlaybackStart(): number {
		return this.voice.bar.masterBar.start + this.playbackStart;
	}

	/**
	 * Gets or sets the dynamics applied to this beat.
	 */
	public dynamics: DynamicValue = DynamicValue.F;

	/**
	 * Gets or sets a value indicating whether the beam direction should be inverted.
	 */
	public invertBeamDirection: boolean = false;

	/**
	 * Gets or sets the preferred beam direction as specified in the input source.
	 */
	public preferredBeamDirection: BeamDirection | null = null;

	/**
	 * @json_ignore
	 */
	public isEffectSlurOrigin: boolean = false;

	public get isEffectSlurDestination(): boolean {
		return !!this.effectSlurOrigin;
	}

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public effectSlurOrigin: Beat | null = null;

	/**
	 * @clone_ignore
	 * @json_ignore
	 */
	public effectSlurDestination: Beat | null = null;

	/**
	 * Gets or sets how the beaming should be done for this beat.
	 */
	public beamingMode: BeatBeamingMode = BeatBeamingMode.Auto;

	public addWhammyBarPoint(point: BendPoint): void {
		let points = this.whammyBarPoints;
		if (points === null) {
			points = [];
			this.whammyBarPoints = points;
		}
		points.push(point);
		if (!this.maxWhammyPoint || point.value > this.maxWhammyPoint.value) {
			this.maxWhammyPoint = point;
		}
		if (!this.minWhammyPoint || point.value < this.minWhammyPoint.value) {
			this.minWhammyPoint = point;
		}
		if (this.whammyBarType === WhammyType.None) {
			this.whammyBarType = WhammyType.Custom;
		}
	}

	public removeWhammyBarPoint(index: number): void {
		// check index
		const points = this.whammyBarPoints;
		if (points === null || index < 0 || index >= points.length) {
			return;
		}

		// remove point
		points.splice(index, 1);
		let point: BendPoint = points[index];

		// update maxWhammy point if required
		if (point === this.maxWhammyPoint) {
			this.maxWhammyPoint = null;
			for (let currentPoint of points) {
				if (!this.maxWhammyPoint || currentPoint.value > this.maxWhammyPoint.value) {
					this.maxWhammyPoint = currentPoint;
				}
			}
		}

		if (point === this.minWhammyPoint) {
			this.minWhammyPoint = null;
			for (let currentPoint of points) {
				if (!this.minWhammyPoint || currentPoint.value < this.minWhammyPoint.value) {
					this.minWhammyPoint = currentPoint;
				}
			}
		}
	}

	public addNote(note: Note): void {
		note.beat = this;
		note.index = this.notes.length;
		this.notes.push(note);
		if (note.isStringed) {
			this.noteStringLookup.set(note.string, note);
		}
	}

	public removeNote(note: Note): void {
		let index: number = this.notes.indexOf(note);
		if (index >= 0) {
			this.notes.splice(index, 1);
			if (note.isStringed) {
				this.noteStringLookup.delete(note.string);
			}
		}
	}

	public getAutomation(type: AutomationType): Automation | null {
		for (let i: number = 0, j: number = this.automations.length; i < j; i++) {
			let automation: Automation = this.automations[i];
			if (automation.type === type) {
				return automation;
			}
		}
		return null;
	}

	public getNoteOnString(noteString: number): Note | null {
		if (this.noteStringLookup.has(noteString)) {
			return this.noteStringLookup.get(noteString)!;
		}
		return null;
	}

	private calculateDuration(): number {
		if (this.isFullBarRest) {
			return this.voice.bar.masterBar.calculateDuration();
		}
		let ticks: number = MidiUtils.toTicks(this.duration);
		if (this.dots === 2) {
			ticks = MidiUtils.applyDot(ticks, true);
		} else if (this.dots === 1) {
			ticks = MidiUtils.applyDot(ticks, false);
		}
		if (this.tupletDenominator > 0 && this.tupletNumerator >= 0) {
			ticks = MidiUtils.applyTuplet(ticks, this.tupletNumerator, this.tupletDenominator);
		}
		return ticks;
	}

	public updateDurations(): void {
		let ticks: number = this.calculateDuration();
		this.playbackDuration = ticks;

		switch (this.graceType) {
			case GraceType.BeforeBeat:
			case GraceType.OnBeat:
				switch (this.duration) {
					case Duration.Sixteenth:
						this.playbackDuration = MidiUtils.toTicks(Duration.SixtyFourth);
						break;
					case Duration.ThirtySecond:
						this.playbackDuration = MidiUtils.toTicks(Duration.OneHundredTwentyEighth);
						break;
					default:
						this.playbackDuration = MidiUtils.toTicks(Duration.ThirtySecond);
						break;
				}
				this.displayDuration = 0;
				break;
			case GraceType.BendGrace:
				this.playbackDuration /= 2;
				this.displayDuration = 0;
				break;
			default:
				this.displayDuration = ticks;
				let previous: Beat | null = this.previousBeat;
				if (previous && previous.graceType === GraceType.BendGrace) {
					this.playbackDuration = previous.playbackDuration;
				}
				break;
		}
	}

	public finishTuplet(): void {
		let previousBeat: Beat | null = this.previousBeat;
		let currentTupletGroup: TupletGroup | null = previousBeat ? previousBeat.tupletGroup : null;
		if (this.hasTuplet || (this.graceType !== GraceType.None && currentTupletGroup)) {
			if (!previousBeat || !currentTupletGroup || !currentTupletGroup.check(this)) {
				currentTupletGroup = new TupletGroup(this.voice);
				currentTupletGroup.check(this);
			}
			this.tupletGroup = currentTupletGroup;
		}
	}

	public finish(settings: Settings, sharedDataBag: Map<string, unknown> | null = null): void {
		if (this.getAutomation(AutomationType.Instrument) === null &&
			this.index === 0 &&
			this.voice.index === 0 &&
			this.voice.bar.index === 0 &&
			this.voice.bar.staff.index === 0
		) {
			this.automations.push(
				Automation.buildInstrumentAutomation(false, 0, this.voice.bar.staff.track.playbackInfo.program)
			);
		}

		switch (this.graceType) {
			case GraceType.OnBeat:
			case GraceType.BeforeBeat:
				let numberOfGraceBeats: number = this.graceGroup!.beats.length;
				// set right duration for beaming/display
				if (numberOfGraceBeats === 1) {
					this.duration = Duration.Eighth;
				} else if (numberOfGraceBeats === 2) {
					this.duration = Duration.Sixteenth;
				} else {
					this.duration = Duration.ThirtySecond;
				}
				break;
		}

		let displayMode: NotationMode = !settings ? NotationMode.GuitarPro : settings.notation.notationMode;
		let isGradual: boolean = this.text === 'grad' || this.text === 'grad.';
		if (isGradual && displayMode === NotationMode.SongBook) {
			this.text = '';
		}
		let needCopyBeatForBend: boolean = false;
		this.minNote = null;
		this.maxNote = null;
		this.minStringNote = null;
		this.maxStringNote = null;
		let visibleNotes: number = 0;
		let isEffectSlurBeat: boolean = false;
		for (let i: number = 0, j: number = this.notes.length; i < j; i++) {
			let note: Note = this.notes[i];
			note.dynamics = this.dynamics;
			note.finish(settings, sharedDataBag);
			if (note.isLetRing) {
				this.isLetRing = true;
			}
			if (note.isPalmMute) {
				this.isPalmMute = true;
			}
			if (displayMode === NotationMode.SongBook && note.hasBend && this.graceType !== GraceType.BendGrace) {
				if (!note.isTieOrigin) {
					switch (note.bendType) {
						case BendType.Bend:
						case BendType.PrebendRelease:
						case BendType.PrebendBend:
							needCopyBeatForBend = true;
							break;
					}
				}
				if (isGradual || note.bendStyle === BendStyle.Gradual) {
					isGradual = true;
					note.bendStyle = BendStyle.Gradual;
					needCopyBeatForBend = false;
				} else {
					note.bendStyle = BendStyle.Fast;
				}
			}
			if (note.isVisible) {
				visibleNotes++;
				if (!this.minNote || note.realValue < this.minNote.realValue) {
					this.minNote = note;
				}
				if (!this.maxNote || note.realValue > this.maxNote.realValue) {
					this.maxNote = note;
				}
				if (!this.minStringNote || note.string < this.minStringNote.string) {
					this.minStringNote = note;
				}
				if (!this.maxStringNote || note.string > this.maxStringNote.string) {
					this.maxStringNote = note;
				}
				if (note.hasEffectSlur) {
					isEffectSlurBeat = true;
				}
			}
		}
		if (isEffectSlurBeat) {
			if (this.effectSlurOrigin) {
				this.effectSlurOrigin.effectSlurDestination = this.nextBeat;
				if (this.effectSlurOrigin.effectSlurDestination) {
					this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
				}
				this.effectSlurOrigin = null;
			} else {
				this.isEffectSlurOrigin = true;
				this.effectSlurDestination = this.nextBeat;
				if (this.effectSlurDestination) {
					this.effectSlurDestination.effectSlurOrigin = this;
				}
			}
		}
		if (this.notes.length > 0 && visibleNotes === 0) {
			this.isEmpty = true;
		}
		// we need to clean al letring/palmmute flags for rests
		// in case the effect is not continued on this beat
		if (!this.isRest && (!this.isLetRing || !this.isPalmMute)) {
			let currentBeat: Beat | null = this.previousBeat;
			while (currentBeat && currentBeat.isRest) {
				if (!this.isLetRing) {
					currentBeat.isLetRing = false;
				}
				if (!this.isPalmMute) {
					currentBeat.isPalmMute = false;
				}
				currentBeat = currentBeat.previousBeat;
			}
		} else if (
			this.isRest &&
			this.previousBeat &&
			settings &&
			settings.notation.notationMode === NotationMode.GuitarPro
		) {
			if (this.previousBeat.isLetRing) {
				this.isLetRing = true;
			}
			if (this.previousBeat.isPalmMute) {
				this.isPalmMute = true;
			}
		}
		// try to detect what kind of bend was used and cleans unneeded points if required
		// Guitar Pro 6 and above (gpif.xml) uses exactly 4 points to define all whammys
		const points = this.whammyBarPoints;
		if (points !== null && points.length > 0 && this.whammyBarType === WhammyType.Custom) {
			if (displayMode === NotationMode.SongBook) {
				this.whammyStyle = isGradual ? BendStyle.Gradual : BendStyle.Fast;
			}
			let isContinuedWhammy: boolean = !!this.previousBeat && this.previousBeat.hasWhammyBar;
			this.isContinuedWhammy = isContinuedWhammy;
			if (points.length === 4) {
				let origin: BendPoint = points[0];
				let middle1: BendPoint = points[1];
				let middle2: BendPoint = points[2];
				let destination: BendPoint = points[3];
				// the middle points are used for holds, anything else is a new feature we do not support yet
				if (middle1.value === middle2.value) {
					// constant decrease or increase
					if (
						(origin.value < middle1.value && middle1.value < destination.value) ||
						(origin.value > middle1.value && middle1.value > destination.value)
					) {
						if (origin.value !== 0 && !isContinuedWhammy) {
							this.whammyBarType = WhammyType.PrediveDive;
						} else {
							this.whammyBarType = WhammyType.Dive;
						}
						points.splice(2, 1);
						points.splice(1, 1);
					} else if (
						(origin.value > middle1.value && middle1.value < destination.value) ||
						(origin.value < middle1.value && middle1.value > destination.value)
					) {
						this.whammyBarType = WhammyType.Dip;
						if (middle1.offset === middle2.offset || displayMode === NotationMode.SongBook) {
							points.splice(2, 1);
						}
					} else if (origin.value === middle1.value && middle1.value === destination.value) {
						if (origin.value !== 0 && !isContinuedWhammy) {
							this.whammyBarType = WhammyType.Predive;
						} else {
							this.whammyBarType = WhammyType.Hold;
						}
						points.splice(2, 1);
						points.splice(1, 1);
					}
				}
			}
		}
		this.updateDurations();
		if (needCopyBeatForBend) {
			// if this beat is a simple bend convert it to a grace beat
			// and generate a placeholder beat with tied notes
			let cloneBeat: Beat = BeatCloner.clone(this);
			cloneBeat.id = Beat._globalBeatId++;
			cloneBeat.pickStroke = PickStroke.None;
			for (let i: number = 0, j: number = cloneBeat.notes.length; i < j; i++) {
				let cloneNote: Note = cloneBeat.notes[i];
				let note: Note = this.notes[i];

				// remove bend on cloned note
				cloneNote.bendType = BendType.None;
				cloneNote.maxBendPoint = null;
				cloneNote.bendPoints = null;
				cloneNote.bendStyle = BendStyle.Default;
				cloneNote.id = Note.GlobalNoteId++;

				// fix ties
				if (note.isTieOrigin) {
					cloneNote.tieDestination = note.tieDestination!;
					note.tieDestination!.tieOrigin = cloneNote;
				}
				if (note.isTieDestination) {
					cloneNote.tieOrigin = note.tieOrigin ? note.tieOrigin : null;
					note.tieOrigin!.tieDestination = cloneNote;
				}

				// if the note has a bend which is continued on the next note
				// we need to convert this note into a hold bend
				if (note.hasBend && note.isTieOrigin) {
					let tieDestination: Note | null = Note.findTieOrigin(note);
					if (tieDestination && tieDestination.hasBend) {
						cloneNote.bendType = BendType.Hold;
						let lastPoint: BendPoint = note.bendPoints![note.bendPoints!.length - 1];
						cloneNote.addBendPoint(new BendPoint(0, lastPoint.value));
						cloneNote.addBendPoint(new BendPoint(BendPoint.MaxPosition, lastPoint.value));
					}
				}
				// mark as tied note
				cloneNote.isTieDestination = true;
			}
			this.graceType = GraceType.BendGrace;
			this.graceGroup = new GraceGroup();
			this.graceGroup.addBeat(this);
			this.graceGroup.isComplete = true;
			this.graceGroup.finish();
			this.updateDurations();
			this.voice.insertBeat(this, cloneBeat);

			// ensure cloned beat has also a grace simple grace group for itself
			// (see Voice.finish where every beat gets one)
			// this ensures later that grace rods are assigned correctly to this beat. 
			cloneBeat.graceGroup = new GraceGroup();
			cloneBeat.graceGroup.addBeat(this);
			cloneBeat.graceGroup.isComplete = true;
			cloneBeat.graceGroup.finish();
		}
	}

	/**
	 * Checks whether the current beat is timewise before the given beat.
	 * @param beat
	 * @returns
	 */
	public isBefore(beat: Beat): boolean {
		return (
			this.voice.bar.index < beat.voice.bar.index ||
			(beat.voice.bar.index === this.voice.bar.index && this.index < beat.index)
		);
	}

	/**
	 * Checks whether the current beat is timewise after the given beat.
	 * @param beat
	 * @returns
	 */
	public isAfter(beat: Beat): boolean {
		return (
			this.voice.bar.index > beat.voice.bar.index ||
			(beat.voice.bar.index === this.voice.bar.index && this.index > beat.index)
		);
	}

	public hasNoteOnString(noteString: number): boolean {
		return this.noteStringLookup.has(noteString);
	}

	// TODO: can be likely eliminated
	public getNoteWithRealValue(noteRealValue: number): Note | null {
		if (this.noteValueLookup.has(noteRealValue)) {
			return this.noteValueLookup.get(noteRealValue)!;
		}
		return null;
	}

	public chain(sharedDataBag: Map<string, unknown> | null = null) {
		for (const n of this.notes) {
			this.noteValueLookup.set(n.realValue, n);
			n.chain(sharedDataBag);
		}
	}
}
class RepeatGroup {
	/**
	 * All masterbars repeated within this group
	 */
	public masterBars: MasterBar[] = [];

	/**
	 * the masterbars which opens the group.
	 */
	public opening: MasterBar | null = null;

	/**
	 * a list of masterbars which open the group.
	 * @deprecated There can only be one opening, use the opening property instead
	 */
	public get openings(): MasterBar[] {
		const opening = this.opening;
		return opening ? [opening] : [];
	}

	/**
	 * a list of masterbars which close the group.
	 */
	public closings: MasterBar[] = [];

	/**
	 * Gets whether this repeat group is really opened as a repeat. 
	 */
	public get isOpened(): boolean { return this.opening?.isRepeatStart === true; }

	/**
	 * true if the repeat group was closed well
	 */
	public isClosed: boolean = false;

	public addMasterBar(masterBar: MasterBar): void {
		if (this.opening === null) {
			this.opening = masterBar;
		}
		this.masterBars.push(masterBar);
		masterBar.repeatGroup = this;
		if (masterBar.isRepeatEnd) {
			this.closings.push(masterBar);
			this.isClosed = true;
		}
	}
}
/**
 * This structure represents a duration within a gpif
 */
class GpifRhythm {
	public id: string = '';
	public dots: number = 0;
	public tupletDenominator: number = -1;
	public tupletNumerator: number = -1;
	public value: Duration = Duration.Quarter;
}

class GpifSound {
	public name: string = '';
	public path: string = '';
	public role: string = '';
	public get uniqueId(): string {
		return this.path + ';' + this.name + ';' + this.role;
	}

	public program: number = 0;
}
class BendPoint {
	public static readonly MaxPosition: number = 60;
	public static readonly MaxValue: number = 12;

	/**
	 * Gets or sets offset of the point relative to the note duration (0-60)
	 */
	public offset: number;

	/**
	 * Gets or sets the 1/4 note value offsets for the bend.
	 */
	public value: number;

	/**
	 * Initializes a new instance of the {@link BendPoint} class.
	 * @param offset The offset.
	 * @param value The value.
	 */
	public constructor(offset: number = 0, value: number = 0) {
		this.offset = offset;
		this.value = value;
	}
}
class RenderStylesheet {
	/**
	 * Gets or sets whether dynamics are hidden.
	 */
	public hideDynamics: boolean = false;
}
enum LyricsState {
	IgnoreSpaces,
	Begin,
	Text,
	Comment,
	Dash
}

class Lyrics {
	private static readonly CharCodeLF: number = 10;
	private static readonly CharCodeTab: number = 9;
	private static readonly CharCodeCR: number = 13;
	private static readonly CharCodeSpace: number = 32;
	private static readonly CharCodeBrackedClose: number = 93;
	private static readonly CharCodeBrackedOpen: number = 91;
	private static readonly CharCodeDash: number = 45;

	/**
	 * Gets or sets he start bar on which the lyrics should begin.
	 */
	public startBar: number = 0;

	/**
	 * Gets or sets the raw lyrics text in Guitar Pro format.
	 * (spaces split word syllables, plus merge syllables, [..] are comments)
	 */
	public text: string = '';

	/**
	 * Gets or sets the prepared chunks of the lyrics to apply to beats.
	 */
	public chunks!: string[];

	public finish(skipEmptyEntries: boolean = false): void {
		this.chunks = [];
		this.parse(this.text, 0, this.chunks, skipEmptyEntries);
	}

	private parse(str: string, p: number, chunks: string[], skipEmptyEntries: boolean): void {
		if (!str) {
			return;
		}

		let state: LyricsState = LyricsState.Begin;
		let next: LyricsState = LyricsState.Begin;
		let skipSpace: boolean = false;
		let start: number = 0;

		while (p < str.length) {
			let c: number = str.charCodeAt(p);
			switch (state) {
				case LyricsState.IgnoreSpaces:
					switch (c) {
						case Lyrics.CharCodeLF:
						case Lyrics.CharCodeCR:
						case Lyrics.CharCodeTab:
							break;
						case Lyrics.CharCodeSpace:
							if (!skipSpace) {
								state = next;
								continue;
							}
							break;
						default:
							skipSpace = false;
							state = next;
							continue;
					}
					break;
				case LyricsState.Begin:
					switch (c) {
						case Lyrics.CharCodeBrackedOpen:
							state = LyricsState.Comment;
							break;
						default:
							start = p;
							state = LyricsState.Text;
							continue;
					}
					break;
				case LyricsState.Comment:
					switch (c) {
						case Lyrics.CharCodeBrackedClose:
							state = LyricsState.Begin;
							break;
					}
					break;
				case LyricsState.Text:
					switch (c) {
						case Lyrics.CharCodeDash:
							state = LyricsState.Dash;
							break;
						case Lyrics.CharCodeCR:
						case Lyrics.CharCodeLF:
						case Lyrics.CharCodeSpace:
							let txt: string = str.substr(start, p - start);
							this.addChunk(txt, skipEmptyEntries);
							state = LyricsState.IgnoreSpaces;
							next = LyricsState.Begin;
							break;
					}
					break;
				case LyricsState.Dash:
					switch (c) {
						case Lyrics.CharCodeDash:
							break;
						default:
							let txt: string = str.substr(start, p - start);
							this.addChunk(txt, skipEmptyEntries);
							skipSpace = true;
							state = LyricsState.IgnoreSpaces;
							next = LyricsState.Begin;
							continue;
					}
					break;
			}
			p += 1;
		}

		if (state === LyricsState.Text) {
			if (p !== start) {
				this.addChunk(str.substr(start, p - start), skipEmptyEntries);
			}
		}
	}
	private addChunk(txt: string, skipEmptyEntries: boolean) {
		txt = this.prepareChunk(txt);
		if (!skipEmptyEntries || (txt.length > 0 && txt !== '-')) {
			this.chunks.push(txt);
		}
	}

	private prepareChunk(txt: string): string {
		let chunk = txt.split('+').join(' ');

		// trim off trailing _ like "You____" becomes "You"
		let endLength = chunk.length;
		while (endLength > 0 && chunk.charAt(endLength - 1) === '_') {
			endLength--;
		}

		return endLength !== chunk.length ? chunk.substr(0, endLength) : chunk;
	}
}
class Staff {
	/**
	 * Gets or sets the zero-based index of this staff within the track.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the reference to the track this staff belongs to.
	 * @json_ignore
	 */
	public track!: Track;

	/**
	 * Gets or sets a list of all bars contained in this staff.
	 * @json_add addBar
	 */
	public bars: Bar[] = [];

	/**
	 * Gets or sets a list of all chords defined for this staff. {@link Beat.chordId} refers to entries in this lookup.
	 * @json_add addChord
	 */
	public chords: Map<string, Chord> | null = null;

	/**
	 * Gets or sets the fret on which a capo is set.
	 */
	public capo: number = 0;

	/**
	 * Gets or sets the number of semitones this track should be
	 * transposed. This applies to rendering and playback.
	 */
	public transpositionPitch: number = 0;

	/**
	 * Gets or sets the number of semitones this track should be
	 * transposed. This applies only to rendering.
	 */
	public displayTranspositionPitch: number = 0;

	/**
	 * Get or set the guitar tuning of the guitar. This tuning also indicates the number of strings shown in the
	 * guitar tablature. Unlike the {@link Note.string} property this array directly represents
	 * the order of the tracks shown in the tablature. The first item is the most top tablature line.
	 */
	public stringTuning: Tuning = new Tuning('', [], false);

	/**
	 * Get or set the values of the related guitar tuning.
	 */
	public get tuning(): number[] {
		return this.stringTuning.tunings;
	}

	/**
	 * Gets or sets the name of the tuning.
	 */
	public get tuningName(): string {
		return this.stringTuning.name;
	}

	public get isStringed(): boolean {
		return this.stringTuning.tunings.length > 0;
	}

	/**
	 * Gets or sets whether the tabs are shown.
	 */
	public showTablature: boolean = true;

	/**
	 * Gets or sets whether the standard notation is shown.
	 */
	public showStandardNotation: boolean = true;

	/**
	 * Gets or sets whether the staff contains percussion notation
	 */
	public isPercussion: boolean = false;

	/**
	 * The number of lines shown for the standard notation.
	 * For some percussion instruments this number might vary.
	 */
	public standardNotationLineCount: number = 5;

	public finish(settings: Settings, sharedDataBag: Map<string, unknown> | null = null): void {
		this.stringTuning.finish();
		for (let i: number = 0, j: number = this.bars.length; i < j; i++) {
			this.bars[i].finish(settings, sharedDataBag);
		}
	}

	public addChord(chordId: string, chord: Chord): void {
		chord.staff = this;
		let chordMap = this.chords;
		if (chordMap === null) {
			chordMap = new Map<string, Chord>();
			this.chords = chordMap;
		}
		chordMap.set(chordId, chord);
	}

	public hasChord(chordId: string): boolean {
		return this.chords?.has(chordId) ?? false
	}

	public getChord(chordId: string): Chord | null {
		return this.chords?.get(chordId) ?? null
	}


	public addBar(bar: Bar): void {
		let bars: Bar[] = this.bars;
		bar.staff = this;
		bar.index = bars.length;
		if (bars.length > 0) {
			bar.previousBar = bars[bars.length - 1];
			bar.previousBar.nextBar = bar;
		}
		bars.push(bar);
	}
}
class Track {
	private static readonly ShortNameMaxLength: number = 10;
	/**
	 * Gets or sets the zero-based index of this track.
	 * @json_ignore
	 */
	public index: number = 0;

	/**
	 * Gets or sets the reference this track belongs to.
	 * @json_ignore
	 */
	public score!: Score;

	/**
	 * Gets or sets the list of staffs that are defined for this track.
	 * @json_add addStaff
	 */
	public staves: Staff[] = [];

	/**
	 * Gets or sets the playback information for this track.
	 */
	public playbackInfo: PlaybackInformation = new PlaybackInformation();

	/**
	 * Gets or sets the display color defined for this track.
	 */
	//public color: Color = new Color(200, 0, 0, 255);

	/**
	 * Gets or sets the long name of this track.
	 */
	public name: string = '';

	/**
	 * Gets or sets the short name of this track.
	 */
	public shortName: string = '';

	/**
	 * Defines how many bars are placed into the systems (rows) when displaying
	 * the track unless a value is set in the systemsLayout.
	 */
	public defaultSystemsLayout: number = 3;

	/**
	 * Defines how many bars are placed into the systems (rows) when displaying
	 * the track.
	 */
	public systemsLayout: number[] = [];

	/**
	 * Gets or sets a mapping on which staff liens particular percussion instruments
	 * should be shown.
	 */
	public percussionArticulations: InstrumentArticulation[] = [];

	public ensureStaveCount(staveCount: number): void {
		while (this.staves.length < staveCount) {
			this.addStaff(new Staff());
		}
	}

	public addStaff(staff: Staff): void {
		staff.index = this.staves.length;
		staff.track = this;
		this.staves.push(staff);
	}

	public finish(settings: Settings, sharedDataBag: Map<string, unknown> | null = null): void {
		if (!this.shortName) {
			this.shortName = this.name;
			if (this.shortName.length > Track.ShortNameMaxLength) {
				this.shortName = this.shortName.substr(0, Track.ShortNameMaxLength);
			}
		}
		for (let i: number = 0, j: number = this.staves.length; i < j; i++) {
			this.staves[i].finish(settings, sharedDataBag);
		}
	}

	public applyLyrics(lyrics: Lyrics[]): void {
		for (let lyric of lyrics) {
			lyric.finish();
		}
		let staff: Staff = this.staves[0];
		for (let li: number = 0; li < lyrics.length; li++) {
			let lyric: Lyrics = lyrics[li];
			if (lyric.startBar >= 0 && lyric.startBar < staff.bars.length) {
				let beat: Beat | null = staff.bars[lyric.startBar].voices[0].beats[0];
				for (let ci: number = 0; ci < lyric.chunks.length && beat; ci++) {
					// skip rests and empty beats
					while (beat && (beat.isEmpty || beat.isRest)) {
						beat = beat.nextBeat;
					}
					// mismatch between chunks and beats might lead to missing beats
					if (beat) {
						// initialize lyrics list for beat if required
						if (!beat.lyrics) {
							beat.lyrics = new Array<string>(lyrics.length);
							beat.lyrics.fill("");
						}
						// assign chunk
						beat.lyrics[li] = lyric.chunks[ci];
						beat = beat.nextBeat;
					}
				}
			}
		}
	}
}
class Score {
	private _currentRepeatGroup: RepeatGroup | null = null;
	private _openedRepeatGroups: RepeatGroup[] = [];
	private _properlyOpenedRepeatGroups: number = 0;

	/**
	 * The album of this song.
	 */
	public album: string = '';

	/**
	 * The artist who performs this song.
	 */
	public artist: string = '';

	/**
	 * The owner of the copyright of this song.
	 */
	public copyright: string = '';

	/**
	 * Additional instructions
	 */
	public instructions: string = '';

	/**
	 * The author of the music.
	 */
	public music: string = '';

	/**
	 * Some additional notes about the song.
	 */
	public notices: string = '';

	/**
	 * The subtitle of the song.
	 */
	public subTitle: string = '';

	/**
	 * The title of the song.
	 */
	public title: string = '';

	/**
	 * The author of the song lyrics
	 */
	public words: string = '';

	/**
	 * The author of this tablature.
	 */
	public tab: string = '';

	/**
	 * Gets or sets the global tempo of the song in BPM. The tempo might change via {@link MasterBar.tempo}.
	 */
	public tempo: number = 120;

	/**
	 * Gets or sets the name/label of the tempo.
	 */
	public tempoLabel: string = '';

	/**
	 * Gets or sets a list of all masterbars contained in this song.
	 * @json_add addMasterBar
	 */
	public masterBars: MasterBar[] = [];

	/**
	 * Gets or sets a list of all tracks contained in this song.
	 * @json_add addTrack
	 */
	public tracks: Track[] = [];

	/**
	 * Defines how many bars are placed into the systems (rows) when displaying
	 * multiple tracks unless a value is set in the systemsLayout.
	 */
	public defaultSystemsLayout: number = 3;

	/**
	 * Defines how many bars are placed into the systems (rows) when displaying
	 * multiple tracks.
	 */
	public systemsLayout: number[] = [];


	/**
	 * Gets or sets the rendering stylesheet for this song.
	 */
	public stylesheet: RenderStylesheet = new RenderStylesheet();

	public rebuildRepeatGroups(): void {
		this._currentRepeatGroup = null;
		this._openedRepeatGroups = [];
		this._properlyOpenedRepeatGroups = 0;
		for (const bar of this.masterBars) {
			this.addMasterBarToRepeatGroups(bar);
		}
	}

	public addMasterBar(bar: MasterBar): void {
		bar.score = this;
		bar.index = this.masterBars.length;
		if (this.masterBars.length !== 0) {
			bar.previousMasterBar = this.masterBars[this.masterBars.length - 1];
			bar.previousMasterBar.nextMasterBar = bar;
			// TODO: this will not work on anacrusis. Correct anacrusis durations are only working
			// when there are beats with playback positions already computed which requires full finish
			// chicken-egg problem here. temporarily forcing anacrusis length here to 0
			bar.start =
				bar.previousMasterBar.start +
				(bar.previousMasterBar.isAnacrusis ? 0 : bar.previousMasterBar.calculateDuration());
		}

		this.addMasterBarToRepeatGroups(bar);

		this.masterBars.push(bar);
	}

	/**
	 * Adds the given bar correctly into the current repeat group setup.
	 * @param bar
	 */
	private addMasterBarToRepeatGroups(bar: MasterBar) {
		// handling the repeats is quite tricky due to many invalid combinations a user might define
		// there are also some complexities due to nested repeats and repeats with multiple endings but only one opening.
		// all scenarios are handled below.

		// NOTE: In all paths we need to ensure that the bar is added to some repeat group

		// start a new repeat group if really a repeat is started
		// or we don't have a group.
		if (bar.isRepeatStart) {
			// if the current group was already closed (this opening doesn't cause nesting)
			// we consider the group as completed
			if (this._currentRepeatGroup?.isClosed) {
				this._openedRepeatGroups.pop();
				this._properlyOpenedRepeatGroups--;
			}
			this._currentRepeatGroup = new RepeatGroup();
			this._openedRepeatGroups.push(this._currentRepeatGroup);
			this._properlyOpenedRepeatGroups++;
		} else if (!this._currentRepeatGroup) {
			this._currentRepeatGroup = new RepeatGroup();
			this._openedRepeatGroups.push(this._currentRepeatGroup);
		}

		// close current group if there was one started
		this._currentRepeatGroup.addMasterBar(bar);

		// handle repeat ends
		if (bar.isRepeatEnd) {
			// if we have nested repeat groups a repeat end
			// will treat the group as completed
			if (this._properlyOpenedRepeatGroups > 1) {
				this._openedRepeatGroups.pop();
				this._properlyOpenedRepeatGroups--;
				// restore outer group in cases like "open open close close"
				this._currentRepeatGroup =
					this._openedRepeatGroups.length > 0
						? this._openedRepeatGroups[this._openedRepeatGroups.length - 1]
						: null;
			}
			// else: if only one group is opened, this group stays active for 
			// scenarios like open close bar close
		}
	}

	public addTrack(track: Track): void {
		track.score = this;
		track.index = this.tracks.length;
		this.tracks.push(track);
	}

	public finish(settings: Settings): void {
		const sharedDataBag = new Map<string, unknown>();
		for (let i: number = 0, j: number = this.tracks.length; i < j; i++) {
			this.tracks[i].finish(settings, sharedDataBag);
		}
	}
}
/**
 * This class can parse a score.gpif xml file into the model structure
 */
 class GpifParser {
	private static readonly InvalidId: string = '-1';

	/**
	 * GPX range: 0-100
	 * Internal range: 0 - 60
	 */
	private static readonly BendPointPositionFactor: number = BendPoint.MaxPosition / 100.0;

	/**
	 * GPIF: 25 per quarternote
	 * Internal Range: 1 per quarter note
	 */
	private static readonly BendPointValueFactor: number = 1 / 25.0;

	public score!: Score;

	private _masterTrackAutomations!: Map<number, Automation[]>;
	private _automationsPerTrackIdAndBarIndex!: Map<string, Map<number, Automation[]>>;
	private _tracksMapping!: string[];
	private _tracksById!: Map<string, Track>;
	private _masterBars!: MasterBar[];
	private _barsOfMasterBar!: Array<string[]>;
	private _barsById!: Map<string, Bar>;
	private _voicesOfBar!: Map<string, string[]>;
	private _voiceById!: Map<string, Voice>;
	private _beatsOfVoice!: Map<string, string[]>;
	private _rhythmOfBeat!: Map<string, string>;
	private _beatById!: Map<string, Beat>;
	private _rhythmById!: Map<string, GpifRhythm>;
	private _noteById!: Map<string, Note>;
	private _notesOfBeat!: Map<string, string[]>;
	private _tappedNotes!: Map<string, boolean>;
	private _lyricsByTrack!: Map<string, Lyrics[]>;
	private _soundsByTrack!: Map<string, Map<string, GpifSound>>;
	private _hasAnacrusis: boolean = false;
	private _articulationByName!: Map<string, InstrumentArticulation>;
	private _skipApplyLyrics: boolean = false;

	public parseXml(xml: string, settings: Settings): void {
		this._masterTrackAutomations = new Map<number, Automation[]>();
		this._automationsPerTrackIdAndBarIndex = new Map<string, Map<number, Automation[]>>();
		this._tracksMapping = [];
		this._tracksById = new Map<string, Track>();
		this._masterBars = [];
		this._barsOfMasterBar = [];
		this._voicesOfBar = new Map<string, string[]>();
		this._barsById = new Map<string, Bar>();
		this._voiceById = new Map<string, Voice>();
		this._beatsOfVoice = new Map<string, string[]>();
		this._beatById = new Map<string, Beat>();
		this._rhythmOfBeat = new Map<string, string>();
		this._rhythmById = new Map<string, GpifRhythm>();
		this._notesOfBeat = new Map<string, string[]>();
		this._noteById = new Map<string, Note>();
		this._tappedNotes = new Map<string, boolean>();
		this._lyricsByTrack = new Map<string, Lyrics[]>();
		this._soundsByTrack = new Map<string, Map<string, GpifSound>>();
		this._skipApplyLyrics = false;

		let dom: XmlDocument = new XmlDocument();
		try {
			dom.parse(xml);
		} catch (ee) {
			throw new //UnsupportedFormat
				Error('Could not parse XML');//, ee );//as Error);
		}

		this.parseDom(dom);
		this.buildModel();
		this.score.finish(settings);
		if (!this._skipApplyLyrics && this._lyricsByTrack.size > 0) {
			for (const [t, lyrics] of this._lyricsByTrack) {
				let track: Track = this._tracksById.get(t)!;
				track.applyLyrics(lyrics);
			}
		}
	}

	private parseDom(dom: XmlDocument): void {
		let root: XmlNode | null = dom.firstElement;
		if (!root) {
			return;
		}
		// the XML uses IDs for referring elements within the
		//  Therefore we do the parsing in 2 steps:
		// - at first we read all model elements and store them by ID in a lookup table
		// - after that we need to join up the information.
		if (root.localName === 'GPIF') {
			this.score = new Score();
			// parse all children
			for (let n of root.childNodes) {
				if (n.nodeType === XmlNodeType.Element) {
					switch (n.localName) {
						case 'Score':
							this.parseScoreNode(n);
							break;
						case 'MasterTrack':
							this.parseMasterTrackNode(n);
							break;
						case 'Tracks':
							this.parseTracksNode(n);
							break;
						case 'MasterBars':
							this.parseMasterBarsNode(n);
							break;
						case 'Bars':
							this.parseBars(n);
							break;
						case 'Voices':
							this.parseVoices(n);
							break;
						case 'Beats':
							this.parseBeats(n);
							break;
						case 'Notes':
							this.parseNotes(n);
							break;
						case 'Rhythms':
							this.parseRhythms(n);
							break;
					}
				}
			}
		} else {
			throw new //UnsupportedFormat
				Error('Root node of XML was not GPIF');
		}
	}

	//
	// <Score>...</Score>
	//
	private parseScoreNode(element: XmlNode): void {
		for (let c of element.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Title':
						this.score.title = c.firstChild!.innerText;
						break;
					case 'SubTitle':
						this.score.subTitle = c.firstChild!.innerText;
						break;
					case 'Artist':
						this.score.artist = c.firstChild!.innerText;
						break;
					case 'Album':
						this.score.album = c.firstChild!.innerText;
						break;
					case 'Words':
						this.score.words = c.firstChild!.innerText;
						break;
					case 'Music':
						this.score.music = c.firstChild!.innerText;
						break;
					case 'WordsAndMusic':
						if (c.firstChild && c.firstChild.innerText !== '') {
							let wordsAndMusic: string = c.firstChild.innerText;
							if (wordsAndMusic && !this.score.words) {
								this.score.words = wordsAndMusic;
							}
							if (wordsAndMusic && !this.score.music) {
								this.score.music = wordsAndMusic;
							}
						}
						break;
					case 'Copyright':
						this.score.copyright = c.firstChild!.innerText;
						break;
					case 'Tabber':
						this.score.tab = c.firstChild!.innerText;
						break;
					case 'Instructions':
						this.score.instructions = c.firstChild!.innerText;
						break;
					case 'Notices':
						this.score.notices = c.firstChild!.innerText;
						break;
					case 'ScoreSystemsDefaultLayout':
						this.score.defaultSystemsLayout = parseInt(c.innerText);
						break;
					case 'ScoreSystemsLayout':
						this.score.systemsLayout = c.innerText.split(' ').map(i => parseInt(i));
						break;

				}
			}
		}
	}

	//
	// <MasterTrack>...</MasterTrack>
	//
	private parseMasterTrackNode(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Automations':
						this.parseAutomations(c, this._masterTrackAutomations, null);
						break;
					case 'Tracks':
						this._tracksMapping = c.innerText.split(' ');
						break;
					case 'Anacrusis':
						this._hasAnacrusis = true;
						break;
				}
			}
		}
	}

	private parseAutomations(node: XmlNode, automations: Map<number, Automation[]>, sounds: Map<string, GpifSound> | null): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Automation':
						this.parseAutomation(c, automations, sounds);
						break;
				}
			}
		}
	}

	private parseAutomation(node: XmlNode, automations: Map<number, Automation[]>, sounds: Map<string, GpifSound> | null): void {
		let type: string | null = null;
		let isLinear: boolean = false;
		let barIndex: number = -1;
		let ratioPosition: number = 0;
		let numberValue: number = 0;
		let textValue: string | null = null;
		let reference: number = 0;
		let text: string | null = null;
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Type':
						type = c.innerText;
						break;
					case 'Linear':
						isLinear = c.innerText.toLowerCase() === 'true';
						break;
					case 'Bar':
						barIndex = parseInt(c.innerText);
						break;
					case 'Position':
						ratioPosition = parseFloat(c.innerText);
						break;
					case 'Value':
						if (c.firstElement && c.firstElement.nodeType === XmlNodeType.CDATA) {
							textValue = c.innerText;
						} else {
							let parts: string[] = c.innerText.split(' ');
							// Issue 391: Some GPX files might have
							// single floating point value.
							if (parts.length === 1) {
								numberValue = parseFloat(parts[0]);
								reference = 1;
							} else {
								numberValue = parseFloat(parts[0]);
								reference = parseInt(parts[1]);
							}
						}
						break;
					case 'Text':
						text = c.innerText;
						break;
				}
			}
		}
		if (!type) {
			return;
		}
		let automation: Automation | null = null;
		switch (type) {
			case 'Tempo':
				automation = Automation.buildTempoAutomation(isLinear, ratioPosition, numberValue, reference);
				break;
			case 'Sound':
				if (textValue && sounds && sounds.has(textValue)) {
					automation = Automation.buildInstrumentAutomation(isLinear, ratioPosition, sounds.get(textValue)!.program);
				}
				break;
		}
		if (automation) {
			if (text) {
				automation.text = text;
			}

			if (barIndex >= 0) {
				if (!automations.has(barIndex)) {
					automations.set(barIndex, []);
				}
				automations.get(barIndex)!.push(automation);
			}
		}
	}

	//
	// <Tracks>...</Tracks>
	//
	private parseTracksNode(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Track':
						this.parseTrack(c);
						break;
				}
			}
		}
	}

	private parseTrack(node: XmlNode): void {
		this._articulationByName = new Map<string, InstrumentArticulation>();

		let track: Track = new Track();
		track.ensureStaveCount(1);
		let staff: Staff = track.staves[0];
		staff.showStandardNotation = true;
		let trackId: string = node.getAttribute('id');

		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Name':
						track.name = c.innerText;
						break;
					case 'Color':
						let parts: string[] = c.innerText.split(' ');
						if (parts.length >= 3) {
							let r: number = parseInt(parts[0]);
							let g: number = parseInt(parts[1]);
							let b: number = parseInt(parts[2]);
							//track.color = new Color(r, g, b, 0xff);
						}
						break;
					case 'Instrument':
						let instrumentName: string = c.getAttribute('ref');
						if (instrumentName.endsWith('-gs') || instrumentName.endsWith('GrandStaff')) {
							track.ensureStaveCount(2);
							track.staves[1].showStandardNotation = true;
						}
						break;
					case 'InstrumentSet':
						this.parseInstrumentSet(track, c);
						break;
					case 'NotationPatch':
						this.parseNotationPatch(track, c);
						break;
					case 'ShortName':
						track.shortName = c.innerText;
						break;
					case 'SystemsDefautLayout': // not a typo by alphaTab, this is a typo in the GPIF files.
						track.defaultSystemsLayout = parseInt(c.innerText);
						break;
					case 'SystemsLayout':
						track.systemsLayout = c.innerText.split(' ').map(i => parseInt(i));
						break;
					case 'Lyrics':
						this.parseLyrics(trackId, c);
						break;
					case 'Properties':
						this.parseTrackProperties(track, c);
						break;
					case 'GeneralMidi':
					case 'MidiConnection':
					case 'MIDISettings':
						this.parseGeneralMidi(track, c);
						break;
					case 'Sounds':
						this.parseSounds(trackId, track, c);
						break;
					case 'PlaybackState':
						let state: string = c.innerText;
						track.playbackInfo.isSolo = state === 'Solo';
						track.playbackInfo.isMute = state === 'Mute';
						break;
					case 'PartSounding':
						this.parsePartSounding(track, c);
						break;
					case 'Staves':
						this.parseStaves(track, c);
						break;
					case 'Transpose':
						this.parseTranspose(track, c);
						break;
					case 'RSE':
						this.parseRSE(track, c);
						break;
					case 'Automations':
						this.parseTrackAutomations(trackId, c);
						break;
				}
			}
		}
		this._tracksById.set(trackId, track);
	}

	private parseTrackAutomations(trackId: string, c: XmlNode) {
		const trackAutomations = new Map<number, Automation[]>()
		this._automationsPerTrackIdAndBarIndex.set(trackId, trackAutomations)
		this.parseAutomations(c, trackAutomations, this._soundsByTrack.get(trackId)!);
	}

	private parseNotationPatch(track: Track, node: XmlNode) {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'LineCount':
						const lineCount = parseInt(c.innerText);
						for (let staff of track.staves) {
							staff.standardNotationLineCount = lineCount;
						}
						break;
					case 'Elements':
						this.parseElements(track, c);
						break;
				}
			}
		}
	}

	private parseInstrumentSet(track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Type':
						switch (c.innerText) {
							case 'drumKit':
								for (let staff of track.staves) {
									staff.isPercussion = true;
								}
								break;
						}
						if (c.innerText === 'drumKit') {
							for (let staff of track.staves) {
								staff.isPercussion = true;
							}
						}
						break;
					case 'Elements':
						this.parseElements(track, c);
						break;
					case 'LineCount':
						const lineCount = parseInt(c.innerText);
						for (let staff of track.staves) {
							staff.standardNotationLineCount = lineCount;
						}
						break;
				}
			}
		}
	}
	private parseElements(track: Track, node: XmlNode) {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Element':
						this.parseElement(track, c);
						break;
				}
			}
		}
	}

	private parseElement(track: Track, node: XmlNode) {
		const typeElement = node.findChildElement('Type');
		const type = typeElement ? typeElement.innerText : "";
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Name':
					case 'Articulations':
						this.parseArticulations(track, c, type);
						break;
				}
			}
		}
	}
	private parseArticulations(track: Track, node: XmlNode, elementType: string) {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Articulation':
						this.parseArticulation(track, c, elementType);
						break;
				}
			}
		}
	}

	private parseArticulation(track: Track, node: XmlNode, elementType: string) {
		const articulation = new InstrumentArticulation();
		articulation.outputMidiNumber = -1;
		articulation.elementType = elementType;
		let name = '';
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				const txt = c.innerText;
				switch (c.localName) {
					case 'Name':
						name = c.innerText;
						break;
					case 'OutputMidiNumber':
						if (txt.length > 0) {
							articulation.outputMidiNumber = parseInt(txt);
						}
						break;
					case 'TechniqueSymbol':
						articulation.techniqueSymbol = this.parseTechniqueSymbol(txt);
						break;
					case 'TechniquePlacement':
						switch (txt) {
							case 'outside':
								articulation.techniqueSymbolPlacement = TextBaseline.Bottom;
								break;
							case 'inside':
								articulation.techniqueSymbolPlacement = TextBaseline.Middle;
								break;
							case 'above':
								articulation.techniqueSymbolPlacement = TextBaseline.Bottom;
								break;
							case 'below':
								articulation.techniqueSymbolPlacement = TextBaseline.Top;
								break;
						}
						break;
					case 'Noteheads':
						const noteHeadsTxt = txt.split(' ');
						if (noteHeadsTxt.length >= 1) {
							articulation.noteHeadDefault = this.parseNoteHead(noteHeadsTxt[0]);
						}
						if (noteHeadsTxt.length >= 2) {
							articulation.noteHeadHalf = this.parseNoteHead(noteHeadsTxt[1]);
						}
						if (noteHeadsTxt.length >= 3) {
							articulation.noteHeadWhole = this.parseNoteHead(noteHeadsTxt[2]);
						}

						if (articulation.noteHeadHalf == MusicFontSymbol.None) {
							articulation.noteHeadHalf = articulation.noteHeadDefault;
						}

						if (articulation.noteHeadWhole == MusicFontSymbol.None) {
							articulation.noteHeadWhole = articulation.noteHeadDefault;
						}

						break;
					case 'StaffLine':
						if (txt.length > 0) {
							articulation.staffLine = parseInt(txt);
						}
						break;
				}
			}
		}

		if (articulation.outputMidiNumber !== -1) {
			track.percussionArticulations.push(articulation);
			if (name.length > 0) {
				this._articulationByName.set(name, articulation);
			}
		} else if (name.length > 0 && this._articulationByName.has(name)) {
			this._articulationByName.get(name)!.staffLine = articulation.staffLine;
		}
	}

	private parseTechniqueSymbol(txt: string): MusicFontSymbol {
		switch (txt) {
			case 'pictEdgeOfCymbal':
				return MusicFontSymbol.PictEdgeOfCymbal;
			case 'articStaccatoAbove':
				return MusicFontSymbol.ArticStaccatoAbove;
			case 'noteheadParenthesis':
				return MusicFontSymbol.NoteheadParenthesis;
			case 'stringsUpBow':
				return MusicFontSymbol.StringsUpBow;
			case 'stringsDownBow':
				return MusicFontSymbol.StringsDownBow;
			case 'guitarGolpe':
				return MusicFontSymbol.GuitarGolpe;
			default:
				return MusicFontSymbol.None;
		}
	}

	private parseNoteHead(txt: string): MusicFontSymbol {
		switch (txt) {
			case 'noteheadDoubleWholeSquare':
				return MusicFontSymbol.NoteheadDoubleWholeSquare;
			case 'noteheadDoubleWhole':
				return MusicFontSymbol.NoteheadDoubleWhole;
			case 'noteheadWhole':
				return MusicFontSymbol.NoteheadWhole;
			case 'noteheadHalf':
				return MusicFontSymbol.NoteheadHalf;
			case 'noteheadBlack':
				return MusicFontSymbol.NoteheadBlack;
			case 'noteheadNull':
				return MusicFontSymbol.NoteheadNull;
			case 'noteheadXOrnate':
				return MusicFontSymbol.NoteheadXOrnate;
			case 'noteheadTriangleUpWhole':
				return MusicFontSymbol.NoteheadTriangleUpWhole;
			case 'noteheadTriangleUpHalf':
				return MusicFontSymbol.NoteheadTriangleUpHalf;
			case 'noteheadTriangleUpBlack':
				return MusicFontSymbol.NoteheadTriangleUpBlack;
			case 'noteheadDiamondBlackWide':
				return MusicFontSymbol.NoteheadDiamondBlackWide;
			case 'noteheadDiamondWhite':
				return MusicFontSymbol.NoteheadDiamondWhite;
			case 'noteheadDiamondWhiteWide':
				return MusicFontSymbol.NoteheadDiamondWhiteWide;
			case 'noteheadCircleX':
				return MusicFontSymbol.NoteheadCircleX;
			case 'noteheadXWhole':
				return MusicFontSymbol.NoteheadXWhole;
			case 'noteheadXHalf':
				return MusicFontSymbol.NoteheadXHalf;
			case 'noteheadXBlack':
				return MusicFontSymbol.NoteheadXBlack;
			case 'noteheadParenthesis':
				return MusicFontSymbol.NoteheadParenthesis;
			case 'noteheadSlashedBlack2':
				return MusicFontSymbol.NoteheadSlashedBlack2;
			case 'noteheadCircleSlash':
				return MusicFontSymbol.NoteheadCircleSlash;
			case 'noteheadHeavyX':
				return MusicFontSymbol.NoteheadHeavyX;
			case 'noteheadHeavyXHat':
				return MusicFontSymbol.NoteheadHeavyXHat;
			default:
				//Logger.warning('GPIF', 'Unknown notehead symbol', txt);
				return MusicFontSymbol.None;
		}
	}

	private parseStaves(track: Track, node: XmlNode): void {
		let staffIndex: number = 0;
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Staff':
						track.ensureStaveCount(staffIndex + 1);
						let staff: Staff = track.staves[staffIndex];
						this.parseStaff(staff, c);
						staffIndex++;
						break;
				}
			}
		}
	}

	private parseStaff(staff: Staff, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Properties':
						this.parseStaffProperties(staff, c);
						break;
				}
			}
		}
	}

	private parseStaffProperties(staff: Staff, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Property':
						this.parseStaffProperty(staff, c);
						break;
				}
			}
		}
	}

	private parseStaffProperty(staff: Staff, node: XmlNode): void {
		let propertyName: string = node.getAttribute('name');
		switch (propertyName) {
			case 'Tuning':
				for (let c of node.childNodes) {
					if (c.nodeType === XmlNodeType.Element) {
						switch (c.localName) {
							case 'Pitches':
								let tuningParts: string[] = node.findChildElement('Pitches')!.innerText.split(' ');
								let tuning = new Array<number>(tuningParts.length);
								for (let i: number = 0; i < tuning.length; i++) {
									tuning[tuning.length - 1 - i] = parseInt(tuningParts[i]);
								}
								staff.stringTuning.tunings = tuning;
								break;
							case 'Label':
								staff.stringTuning.name = c.innerText;
								break;
						}
					}
				}

				if (!staff.isPercussion) {
					staff.showTablature = true;
				}

				break;
			case 'DiagramCollection':
			case 'ChordCollection':
				this.parseDiagramCollectionForStaff(staff, node);
				break;
			case 'CapoFret':
				let capo: number = parseInt(node.findChildElement('Fret')!.innerText);
				staff.capo = capo;
				break;
		}
	}

	private parseLyrics(trackId: string, node: XmlNode): void {
		let tracks: Lyrics[] = [];
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Line':
						tracks.push(this.parseLyricsLine(c));
						break;
				}
			}
		}
		this._lyricsByTrack.set(trackId, tracks);
	}

	private parseLyricsLine(node: XmlNode): Lyrics {
		let lyrics: Lyrics = new Lyrics();
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Offset':
						lyrics.startBar = parseInt(c.innerText);
						break;
					case 'Text':
						lyrics.text = c.innerText;
						break;
				}
			}
		}
		return lyrics;
	}

	private parseDiagramCollectionForTrack(track: Track, node: XmlNode): void {
		let items: XmlNode = node.findChildElement('Items')!;
		for (let c of items.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Item':
						this.parseDiagramItemForTrack(track, c);
						break;
				}
			}
		}
	}

	private parseDiagramCollectionForStaff(staff: Staff, node: XmlNode): void {
		let items: XmlNode = node.findChildElement('Items')!;
		for (let c of items.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Item':
						this.parseDiagramItemForStaff(staff, c);
						break;
				}
			}
		}
	}

	private parseDiagramItemForTrack(track: Track, node: XmlNode): void {
		let chord: Chord = new Chord();
		let chordId: string = node.getAttribute('id');
		for (let staff of track.staves) {
			staff.addChord(chordId, chord);
		}
		this.parseDiagramItemForChord(chord, node);
	}

	private parseDiagramItemForStaff(staff: Staff, node: XmlNode): void {
		let chord: Chord = new Chord();
		let chordId: string = node.getAttribute('id');
		staff.addChord(chordId, chord);
		this.parseDiagramItemForChord(chord, node);
	}

	private parseDiagramItemForChord(chord: Chord, node: XmlNode): void {
		chord.name = node.getAttribute('name');

		let diagram = node.findChildElement('Diagram');
		if (!diagram) {
			chord.showDiagram = false;
			chord.showFingering = false;
			return;
		}
		let stringCount: number = parseInt(diagram.getAttribute('stringCount'));
		let baseFret: number = parseInt(diagram.getAttribute('baseFret'));
		chord.firstFret = baseFret + 1;
		for (let i: number = 0; i < stringCount; i++) {
			chord.strings.push(-1);
		}
		for (let c of diagram.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Fret':
						let guitarString: number = parseInt(c.getAttribute('string'));
						chord.strings[stringCount - guitarString - 1] = baseFret + parseInt(c.getAttribute('fret'));
						break;
					case 'Fingering':
						let existingFingers: Map<Fingers, boolean> = new Map<Fingers, boolean>();
						for (let p of c.childNodes) {
							if (p.nodeType === XmlNodeType.Element) {
								switch (p.localName) {
									case 'Position':
										let finger: Fingers = Fingers.Unknown;
										let fret: number = baseFret + parseInt(p.getAttribute('fret'));
										switch (p.getAttribute('finger')) {
											case 'Index':
												finger = Fingers.IndexFinger;
												break;
											case 'Middle':
												finger = Fingers.MiddleFinger;
												break;
											case 'Rank':
												finger = Fingers.AnnularFinger;
												break;
											case 'Pinky':
												finger = Fingers.LittleFinger;
												break;
											case 'Thumb':
												finger = Fingers.Thumb;
												break;
											case 'None':
												break;
										}
										if (finger !== Fingers.Unknown) {
											if (existingFingers.has(finger)) {
												chord.barreFrets.push(fret);
											} else {
												existingFingers.set(finger, true);
											}
										}
										break;
								}
							}
						}
						break;
					case 'Property':
						switch (c.getAttribute('name')) {
							case 'ShowName':
								chord.showName = c.getAttribute('value') === 'true';
								break;
							case 'ShowDiagram':
								chord.showDiagram = c.getAttribute('value') === 'true';
								break;
							case 'ShowFingering':
								chord.showFingering = c.getAttribute('value') === 'true';
								break;
						}
						break;
				}
			}
		}
	}

	private parseTrackProperties(track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Property':
						this.parseTrackProperty(track, c);
						break;
				}
			}
		}
	}

	private parseTrackProperty(track: Track, node: XmlNode): void {
		let propertyName: string = node.getAttribute('name');
		switch (propertyName) {
			case 'Tuning':
				let tuningParts: string[] = node.findChildElement('Pitches')!.innerText.split(' ');
				let tuning = new Array<number>(tuningParts.length);
				for (let i: number = 0; i < tuning.length; i++) {
					tuning[tuning.length - 1 - i] = parseInt(tuningParts[i]);
				}
				for (let staff of track.staves) {
					staff.stringTuning.tunings = tuning;
					staff.showStandardNotation = true;
					staff.showTablature = true;
				}
				break;
			case 'DiagramCollection':
			case 'ChordCollection':
				this.parseDiagramCollectionForTrack(track, node);
				break;
			case 'CapoFret':
				let capo: number = parseInt(node.findChildElement('Fret')!.innerText);
				for (let staff of track.staves) {
					staff.capo = capo;
				}
				break;
		}
	}

	private parseGeneralMidi(track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Program':
						track.playbackInfo.program = parseInt(c.innerText);
						break;
					case 'Port':
						track.playbackInfo.port = parseInt(c.innerText);
						break;
					case 'PrimaryChannel':
						track.playbackInfo.primaryChannel = parseInt(c.innerText);
						break;
					case 'SecondaryChannel':
						track.playbackInfo.secondaryChannel = parseInt(c.innerText);
						break;
				}
			}
		}
		let isPercussion: boolean = node.getAttribute('table') === 'Percussion';
		if (isPercussion) {
			for (let staff of track.staves) {
				staff.isPercussion = true;
			}
		}
	}

	private parseSounds(trackId: string, track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Sound':
						this.parseSound(trackId, track, c);
						break;
				}
			}
		}
	}

	private parseSound(trackId: string, track: Track, node: XmlNode): void {
		const sound = new GpifSound();
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Name':
						sound.name = c.innerText;
						break;
					case 'Path':
						sound.path = c.innerText;
						break;
					case 'Role':
						sound.role = c.innerText;
						break;
					case 'MIDI':
						this.parseSoundMidi(sound, c);
						break;
				}
			}
		}

		if (sound.role === 'Factory' || track.playbackInfo.program === 0) {
			track.playbackInfo.program = sound.program;
		}

		if (!this._soundsByTrack.has(trackId)) {
			this._soundsByTrack.set(trackId, new Map<string, GpifSound>());
		}

		this._soundsByTrack.get(trackId)!.set(sound.uniqueId, sound);
	}

	private parseSoundMidi(sound: GpifSound, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Program':
						sound.program = parseInt(c.innerText);
						break;
				}
			}
		}
	}

	private parsePartSounding(track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'TranspositionPitch':
						for (let staff of track.staves) {
							staff.displayTranspositionPitch = parseInt(c.innerText);
						}
						break;
				}
			}
		}
	}

	private parseTranspose(track: Track, node: XmlNode): void {
		let octave: number = 0;
		let chromatic: number = 0;
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Chromatic':
						chromatic = parseInt(c.innerText);
						break;
					case 'Octave':
						octave = parseInt(c.innerText);
						break;
				}
			}
		}
		for (let staff of track.staves) {
			staff.displayTranspositionPitch = octave * 12 + chromatic;
		}
	}

	private parseRSE(track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'ChannelStrip':
						this.parseChannelStrip(track, c);
						break;
				}
			}
		}
	}

	private parseChannelStrip(track: Track, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Parameters':
						this.parseChannelStripParameters(track, c);
						break;
				}
			}
		}
	}

	private parseChannelStripParameters(track: Track, node: XmlNode): void {
		if (node.firstChild && node.firstChild.value) {
			let parameters = node.firstChild.value.split(' ');
			if (parameters.length >= 12) {
				track.playbackInfo.balance = Math.floor(parseFloat(parameters[11]) * 16);
				track.playbackInfo.volume = Math.floor(parseFloat(parameters[12]) * 16);
			}
		}
	}

	//
	// <MasterBars>...</MasterBars>
	//
	private parseMasterBarsNode(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'MasterBar':
						this.parseMasterBar(c);
						break;
				}
			}
		}
	}

	private parseMasterBar(node: XmlNode): void {
		let masterBar: MasterBar = new MasterBar();
		if (this._masterBars.length === 0 && this._hasAnacrusis) {
			masterBar.isAnacrusis = true;
		}
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Time':
						let timeParts: string[] = c.innerText.split('/');
						masterBar.timeSignatureNumerator = parseInt(timeParts[0]);
						masterBar.timeSignatureDenominator = parseInt(timeParts[1]);
						break;
					case 'DoubleBar':
						masterBar.isDoubleBar = true;
						break;
					case 'Section':
						masterBar.section = new Section();
						masterBar.section.marker = c.findChildElement('Letter')!.innerText;
						masterBar.section.text = c.findChildElement('Text')!.innerText;
						break;
					case 'Repeat':
						if (c.getAttribute('start').toLowerCase() === 'true') {
							masterBar.isRepeatStart = true;
						}
						if (c.getAttribute('end').toLowerCase() === 'true' && c.getAttribute('count')) {
							masterBar.repeatCount = parseInt(c.getAttribute('count'));
						}
						break;
					case 'AlternateEndings':
						let alternateEndings: string[] = c.innerText.split(' ');
						let i: number = 0;
						for (let k: number = 0; k < alternateEndings.length; k++) {
							i = i | (1 << (-1 + parseInt(alternateEndings[k])));
						}
						masterBar.alternateEndings = i;
						break;
					case 'Bars':
						this._barsOfMasterBar.push(c.innerText.split(' '));
						break;
					case 'TripletFeel':
						switch (c.innerText) {
							case 'NoTripletFeel':
								masterBar.tripletFeel = TripletFeel.NoTripletFeel;
								break;
							case 'Triplet8th':
								masterBar.tripletFeel = TripletFeel.Triplet8th;
								break;
							case 'Triplet16th':
								masterBar.tripletFeel = TripletFeel.Triplet16th;
								break;
							case 'Dotted8th':
								masterBar.tripletFeel = TripletFeel.Dotted8th;
								break;
							case 'Dotted16th':
								masterBar.tripletFeel = TripletFeel.Dotted16th;
								break;
							case 'Scottish8th':
								masterBar.tripletFeel = TripletFeel.Scottish8th;
								break;
							case 'Scottish16th':
								masterBar.tripletFeel = TripletFeel.Scottish16th;
								break;
						}
						break;
					case 'Key':
						masterBar.keySignature = parseInt(
							c.findChildElement('AccidentalCount')!.innerText
						) as KeySignature;
						let mode: XmlNode = c.findChildElement('Mode')!;
						if (mode) {
							switch (mode.innerText.toLowerCase()) {
								case 'major':
									masterBar.keySignatureType = KeySignatureType.Major;
									break;
								case 'minor':
									masterBar.keySignatureType = KeySignatureType.Minor;
									break;
							}
						}
						break;
					case 'Fermatas':
						this.parseFermatas(masterBar, c);
						break;
					case "XProperties":
						this.parseMasterBarXProperties(c, masterBar);
						break;

				}
			}
		}
		this._masterBars.push(masterBar);
	}

	private parseFermatas(masterBar: MasterBar, node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Fermata':
						this.parseFermata(masterBar, c);
						break;
				}
			}
		}
	}

	private parseFermata(masterBar: MasterBar, node: XmlNode): void {
		let offset: number = 0;
		let fermata: Fermata = new Fermata();
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Type':
						switch (c.innerText) {
							case 'Short':
								fermata.type = FermataType.Short;
								break;
							case 'Medium':
								fermata.type = FermataType.Medium;
								break;
							case 'Long':
								fermata.type = FermataType.Long;
								break;
						}
						break;
					case 'Length':
						fermata.length = parseFloat(c.innerText);
						break;
					case 'Offset':
						let parts: string[] = c.innerText.split('/');
						if (parts.length === 2) {
							let numerator: number = parseInt(parts[0]);
							let denominator: number = parseInt(parts[1]);
							offset = ((numerator / denominator) * MidiUtils.QuarterTime) | 0;
						}
						break;
				}
			}
		}
		masterBar.addFermata(offset, fermata);
	}

	//
	// <Bars>...</Bars>
	//
	private parseBars(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Bar':
						this.parseBar(c);
						break;
				}
			}
		}
	}

	private parseBar(node: XmlNode): void {
		let bar: Bar = new Bar();
		let barId: string = node.getAttribute('id');
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Voices':
						this._voicesOfBar.set(barId, c.innerText.split(' '));
						break;
					case 'Clef':
						switch (c.innerText) {
							case 'Neutral':
								bar.clef = Clef.Neutral;
								break;
							case 'G2':
								bar.clef = Clef.G2;
								break;
							case 'F4':
								bar.clef = Clef.F4;
								break;
							case 'C4':
								bar.clef = Clef.C4;
								break;
							case 'C3':
								bar.clef = Clef.C3;
								break;
						}
						break;
					case 'Ottavia':
						switch (c.innerText) {
							case '8va':
								bar.clefOttava = Ottavia._8va;
								break;
							case '15ma':
								bar.clefOttava = Ottavia._15ma;
								break;
							case '8vb':
								bar.clefOttava = Ottavia._8vb;
								break;
							case '15mb':
								bar.clefOttava = Ottavia._15mb;
								break;
						}
						break;
					case 'SimileMark':
						switch (c.innerText) {
							case 'Simple':
								bar.simileMark = SimileMark.Simple;
								break;
							case 'FirstOfDouble':
								bar.simileMark = SimileMark.FirstOfDouble;
								break;
							case 'SecondOfDouble':
								bar.simileMark = SimileMark.SecondOfDouble;
								break;
						}
						break;
					case "XProperties":
						this.parseBarXProperties(c, bar);
						break;
				}
			}
		}
		this._barsById.set(barId, bar);
	}

	//
	// <Voices>...</Voices>
	//
	private parseVoices(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Voice':
						this.parseVoice(c);
						break;
				}
			}
		}
	}

	private parseVoice(node: XmlNode): void {
		let voice: Voice = new Voice();
		let voiceId: string = node.getAttribute('id');
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Beats':
						this._beatsOfVoice.set(voiceId, c.innerText.split(' '));
						break;
				}
			}
		}
		this._voiceById.set(voiceId, voice);
	}

	//
	// <Beats>...</Beats>
	//
	private parseBeats(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Beat':
						this.parseBeat(c);
						break;
				}
			}
		}
	}

	private parseBeat(node: XmlNode): void {
		let beat: Beat = new Beat();
		let beatId: string = node.getAttribute('id');
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Notes':
						this._notesOfBeat.set(beatId, c.innerText.split(' '));
						break;
					case 'Rhythm':
						this._rhythmOfBeat.set(beatId, c.getAttribute('ref'));
						break;
					case 'Fadding':
						if (c.innerText === 'FadeIn') {
							beat.fadeIn = true;
						}
						break;
					case 'Tremolo':
						switch (c.innerText) {
							case '1/2':
								beat.tremoloSpeed = Duration.Eighth;
								break;
							case '1/4':
								beat.tremoloSpeed = Duration.Sixteenth;
								break;
							case '1/8':
								beat.tremoloSpeed = Duration.ThirtySecond;
								break;
						}
						break;
					case 'Chord':
						beat.chordId = c.innerText;
						break;
					case 'Hairpin':
						switch (c.innerText) {
							case 'Crescendo':
								beat.crescendo = CrescendoType.Crescendo;
								break;
							case 'Decrescendo':
								beat.crescendo = CrescendoType.Decrescendo;
								break;
						}
						break;
					case 'Arpeggio':
						if (c.innerText === 'Up') {
							beat.brushType = BrushType.ArpeggioUp;
						} else {
							beat.brushType = BrushType.ArpeggioDown;
						}
						break;
					case 'Properties':
						this.parseBeatProperties(c, beat);
						break;
					case 'XProperties':
						this.parseBeatXProperties(c, beat);
						break;
					case 'FreeText':
						beat.text = c.innerText;
						break;
					case 'TransposedPitchStemOrientation':
						switch (c.innerText) {
							case 'Upward':
								beat.preferredBeamDirection = BeamDirection.Up;
								break;
							case 'Downward':
								beat.preferredBeamDirection = BeamDirection.Down;
								break;
						}
						break;
					case 'Dynamic':
						switch (c.innerText) {
							case 'PPP':
								beat.dynamics = DynamicValue.PPP;
								break;
							case 'PP':
								beat.dynamics = DynamicValue.PP;
								break;
							case 'P':
								beat.dynamics = DynamicValue.P;
								break;
							case 'MP':
								beat.dynamics = DynamicValue.MP;
								break;
							case 'MF':
								beat.dynamics = DynamicValue.MF;
								break;
							case 'F':
								beat.dynamics = DynamicValue.F;
								break;
							case 'FF':
								beat.dynamics = DynamicValue.FF;
								break;
							case 'FFF':
								beat.dynamics = DynamicValue.FFF;
								break;
						}
						break;
					case 'GraceNotes':
						switch (c.innerText) {
							case 'OnBeat':
								beat.graceType = GraceType.OnBeat;
								break;
							case 'BeforeBeat':
								beat.graceType = GraceType.BeforeBeat;
								break;
						}
						break;
					case 'Legato':
						if (c.getAttribute('origin') === 'true') {
							beat.isLegatoOrigin = true;
						}
						break;
					case 'Whammy':
						let whammyOrigin: BendPoint = new BendPoint(0, 0);
						whammyOrigin.value = this.toBendValue(parseFloat(c.getAttribute('originValue')));
						whammyOrigin.offset = this.toBendOffset(parseFloat(c.getAttribute('originOffset')));
						beat.addWhammyBarPoint(whammyOrigin);
						let whammyMiddle1: BendPoint = new BendPoint(0, 0);
						whammyMiddle1.value = this.toBendValue(parseFloat(c.getAttribute('middleValue')));
						whammyMiddle1.offset = this.toBendOffset(parseFloat(c.getAttribute('middleOffset1')));
						beat.addWhammyBarPoint(whammyMiddle1);
						let whammyMiddle2: BendPoint = new BendPoint(0, 0);
						whammyMiddle2.value = this.toBendValue(parseFloat(c.getAttribute('middleValue')));
						whammyMiddle2.offset = this.toBendOffset(parseFloat(c.getAttribute('middleOffset2')));
						beat.addWhammyBarPoint(whammyMiddle2);
						let whammyDestination: BendPoint = new BendPoint(0, 0);
						whammyDestination.value = this.toBendValue(parseFloat(c.getAttribute('destinationValue')));
						whammyDestination.offset = this.toBendOffset(parseFloat(c.getAttribute('destinationOffset')));
						beat.addWhammyBarPoint(whammyDestination);
						break;
					case 'Ottavia':
						switch (c.innerText) {
							case '8va':
								beat.ottava = Ottavia._8va;
								break;
							case '8vb':
								beat.ottava = Ottavia._8vb;
								break;
							case '15ma':
								beat.ottava = Ottavia._15ma;
								break;
							case '15mb':
								beat.ottava = Ottavia._15mb;
								break;
						}
						break;
					case 'Lyrics':
						beat.lyrics = this.parseBeatLyrics(c);
						this._skipApplyLyrics = true;
						break;
				}
			}
		}
		this._beatById.set(beatId, beat);
	}

	private parseBeatLyrics(node: XmlNode): string[] {
		const lines: string[] = [];

		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Line':
						lines.push(c.innerText);
						break;
				}
			}
		}

		return lines;
	}

	private parseBeatXProperties(node: XmlNode, beat: Beat): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'XProperty':
						let id: string = c.getAttribute('id');
						let value: number = 0;
						switch (id) {
							case '1124204545':
								value = parseInt(c.findChildElement('Int')!.innerText);
								beat.invertBeamDirection = value === 1;
								break;
							case '687935489':
								value = parseInt(c.findChildElement('Int')!.innerText);
								beat.brushDuration = value;
								break;
						}
						break;
				}
			}
		}
	}


	private parseBarXProperties(node: XmlNode, bar: Bar) {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'XProperty':
						const id: string = c.getAttribute('id');
						switch (id) {
							case '1124139520':
								const childNode = c.findChildElement('Double') ?? c.findChildElement('Float');
								bar.displayScale = parseFloat(childNode!.innerText);
								break;
						}
						break;
				}
			}
		}
	}

	private parseMasterBarXProperties(node: XmlNode, masterBar: MasterBar) {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'XProperty':
						const id: string = c.getAttribute('id');
						switch (id) {
							case '1124073984':
								masterBar.displayScale = parseFloat(c.findChildElement('Double')!.innerText);
								break;
						}
						break;
				}
			}
		}
	}

	private parseBeatProperties(node: XmlNode, beat: Beat): void {
		let isWhammy: boolean = false;
		let whammyOrigin: BendPoint | null = null;
		let whammyMiddleValue: number | null = null;
		let whammyMiddleOffset1: number | null = null;
		let whammyMiddleOffset2: number | null = null;
		let whammyDestination: BendPoint | null = null;
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Property':
						let name: string = c.getAttribute('name');
						switch (name) {
							case 'Brush':
								if (c.findChildElement('Direction')!.innerText === 'Up') {
									beat.brushType = BrushType.BrushUp;
								} else {
									beat.brushType = BrushType.BrushDown;
								}
								break;
							case 'PickStroke':
								if (c.findChildElement('Direction')!.innerText === 'Up') {
									beat.pickStroke = PickStroke.Up;
								} else {
									beat.pickStroke = PickStroke.Down;
								}
								break;
							case 'Slapped':
								if (c.findChildElement('Enable')) {
									beat.slap = true;
								}
								break;
							case 'Popped':
								if (c.findChildElement('Enable')) {
									beat.pop = true;
								}
								break;
							case 'VibratoWTremBar':
								switch (c.findChildElement('Strength')!.innerText) {
									case 'Wide':
										beat.vibrato = VibratoType.Wide;
										break;
									case 'Slight':
										beat.vibrato = VibratoType.Slight;
										break;
								}
								break;
							case 'WhammyBar':
								isWhammy = true;
								break;
							case 'WhammyBarExtend':
								// not clear what this is used for
								break;
							case 'WhammyBarOriginValue':
								if (!whammyOrigin) {
									whammyOrigin = new BendPoint(0, 0);
								}
								whammyOrigin.value = this.toBendValue(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'WhammyBarOriginOffset':
								if (!whammyOrigin) {
									whammyOrigin = new BendPoint(0, 0);
								}
								whammyOrigin.offset = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'WhammyBarMiddleValue':
								whammyMiddleValue = this.toBendValue(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'WhammyBarMiddleOffset1':
								whammyMiddleOffset1 = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'WhammyBarMiddleOffset2':
								whammyMiddleOffset2 = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'WhammyBarDestinationValue':
								if (!whammyDestination) {
									whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
								}
								whammyDestination.value = this.toBendValue(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'WhammyBarDestinationOffset':
								if (!whammyDestination) {
									whammyDestination = new BendPoint(0, 0);
								}
								whammyDestination.offset = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
						}
						break;
				}
			}
		}
		if (isWhammy) {
			if (!whammyOrigin) {
				whammyOrigin = new BendPoint(0, 0);
			}
			if (!whammyDestination) {
				whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
			}
			beat.addWhammyBarPoint(whammyOrigin);
			if (whammyMiddleOffset1 && whammyMiddleValue) {
				beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset1, whammyMiddleValue));
			}
			if (whammyMiddleOffset2 && whammyMiddleValue) {
				beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset2, whammyMiddleValue));
			}
			if (!whammyMiddleOffset1 && !whammyMiddleOffset2 && whammyMiddleValue) {
				beat.addWhammyBarPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, whammyMiddleValue));
			}
			beat.addWhammyBarPoint(whammyDestination);
		}
	}

	//
	// <Notes>...</Notes>
	//
	private parseNotes(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Note':
						this.parseNote(c);
						break;
				}
			}
		}
	}

	private parseNote(node: XmlNode): void {
		let note: Note = new Note();
		let noteId: string = node.getAttribute('id');
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Properties':
						this.parseNoteProperties(c, note, noteId);
						break;
					case 'AntiAccent':
						if (c.innerText.toLowerCase() === 'normal') {
							note.isGhost = true;
						}
						break;
					case 'LetRing':
						note.isLetRing = true;
						break;
					case 'Trill':
						note.trillValue = parseInt(c.innerText);
						note.trillSpeed = Duration.Sixteenth;
						break;
					case 'Accent':
						let accentFlags: number = parseInt(c.innerText);
						if ((accentFlags & 0x01) !== 0) {
							note.isStaccato = true;
						}
						if ((accentFlags & 0x04) !== 0) {
							note.accentuated = AccentuationType.Heavy;
						}
						if ((accentFlags & 0x08) !== 0) {
							note.accentuated = AccentuationType.Normal;
						}
						break;
					case 'Tie':
						if (c.getAttribute('destination').toLowerCase() === 'true') {
							note.isTieDestination = true;
						}
						break;
					case 'Vibrato':
						switch (c.innerText) {
							case 'Slight':
								note.vibrato = VibratoType.Slight;
								break;
							case 'Wide':
								note.vibrato = VibratoType.Wide;
								break;
						}
						break;
					case 'LeftFingering':
						note.isFingering = true;
						switch (c.innerText) {
							case 'P':
								note.leftHandFinger = Fingers.Thumb;
								break;
							case 'I':
								note.leftHandFinger = Fingers.IndexFinger;
								break;
							case 'M':
								note.leftHandFinger = Fingers.MiddleFinger;
								break;
							case 'A':
								note.leftHandFinger = Fingers.AnnularFinger;
								break;
							case 'C':
								note.leftHandFinger = Fingers.LittleFinger;
								break;
						}
						break;
					case 'RightFingering':
						note.isFingering = true;
						switch (c.innerText) {
							case 'P':
								note.rightHandFinger = Fingers.Thumb;
								break;
							case 'I':
								note.rightHandFinger = Fingers.IndexFinger;
								break;
							case 'M':
								note.rightHandFinger = Fingers.MiddleFinger;
								break;
							case 'A':
								note.rightHandFinger = Fingers.AnnularFinger;
								break;
							case 'C':
								note.rightHandFinger = Fingers.LittleFinger;
								break;
						}
						break;
					case 'InstrumentArticulation':
						note.percussionArticulation = parseInt(c.innerText);
						break;
				}
			}
		}
		this._noteById.set(noteId, note);
	}

	private parseNoteProperties(node: XmlNode, note: Note, noteId: string): void {
		let isBended: boolean = false;
		let bendOrigin: BendPoint | null = null;
		let bendMiddleValue: number | null = null;
		let bendMiddleOffset1: number | null = null;
		let bendMiddleOffset2: number | null = null;
		let bendDestination: BendPoint | null = null;

		// GP6 had percussion as element+variation
		let element: number = -1;
		let variation: number = -1;
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Property':
						let name: string = c.getAttribute('name');
						switch (name) {
							case 'String':
								note.string = parseInt(c.findChildElement('String')!.innerText) + 1;
								break;
							case 'Fret':
								note.fret = parseInt(c.findChildElement('Fret')!.innerText);
								break;
							case 'Element':
								element = parseInt(c.findChildElement('Element')!.innerText);
								break;
							case 'Variation':
								variation = parseInt(c.findChildElement('Variation')!.innerText);
								break;
							case 'Tapped':
								this._tappedNotes.set(noteId, true);
								break;
							case 'HarmonicType':
								let htype: XmlNode = c.findChildElement('HType')!;
								if (htype) {
									switch (htype.innerText) {
										case 'NoHarmonic':
											note.harmonicType = HarmonicType.None;
											break;
										case 'Natural':
											note.harmonicType = HarmonicType.Natural;
											break;
										case 'Artificial':
											note.harmonicType = HarmonicType.Artificial;
											break;
										case 'Pinch':
											note.harmonicType = HarmonicType.Pinch;
											break;
										case 'Tap':
											note.harmonicType = HarmonicType.Tap;
											break;
										case 'Semi':
											note.harmonicType = HarmonicType.Semi;
											break;
										case 'Feedback':
											note.harmonicType = HarmonicType.Feedback;
											break;
									}
								}
								break;
							case 'HarmonicFret':
								let hfret: XmlNode = c.findChildElement('HFret')!;
								if (hfret) {
									note.harmonicValue = parseFloat(hfret.innerText);
								}
								break;
							case 'Muted':
								if (c.findChildElement('Enable')) {
									note.isDead = true;
								}
								break;
							case 'PalmMuted':
								if (c.findChildElement('Enable')) {
									note.isPalmMute = true;
								}
								break;
							case 'Octave':
								note.octave = parseInt(c.findChildElement('Number')!.innerText);
								// when exporting GP6 from GP7 the tone might be missing
								if (note.tone === -1) {
									note.tone = 0;
								}
								break;
							case 'Tone':
								note.tone = parseInt(c.findChildElement('Step')!.innerText);
								break;
							case 'ConcertPitch':
								this.parseConcertPitch(c, note);
								break;
							case 'Bended':
								isBended = true;
								break;
							case 'BendOriginValue':
								if (!bendOrigin) {
									bendOrigin = new BendPoint(0, 0);
								}
								bendOrigin.value = this.toBendValue(parseFloat(c.findChildElement('Float')!.innerText));
								break;
							case 'BendOriginOffset':
								if (!bendOrigin) {
									bendOrigin = new BendPoint(0, 0);
								}
								bendOrigin.offset = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'BendMiddleValue':
								bendMiddleValue = this.toBendValue(parseFloat(c.findChildElement('Float')!.innerText));
								break;
							case 'BendMiddleOffset1':
								bendMiddleOffset1 = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'BendMiddleOffset2':
								bendMiddleOffset2 = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'BendDestinationValue':
								if (!bendDestination) {
									bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
								}
								bendDestination.value = this.toBendValue(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'BendDestinationOffset':
								if (!bendDestination) {
									bendDestination = new BendPoint(0, 0);
								}
								bendDestination.offset = this.toBendOffset(
									parseFloat(c.findChildElement('Float')!.innerText)
								);
								break;
							case 'HopoOrigin':
								if (c.findChildElement('Enable')) {
									note.isHammerPullOrigin = true;
								}
								break;
							case 'HopoDestination':
								// NOTE: gets automatically calculated
								// if (FindChildElement(node, "Enable"))
								//     note.isHammerPullDestination = true;
								break;
							case 'LeftHandTapped':
								note.isLeftHandTapped = true;
								break;
							case 'Slide':
								let slideFlags: number = parseInt(c.findChildElement('Flags')!.innerText);
								if ((slideFlags & 1) !== 0) {
									note.slideOutType = SlideOutType.Shift;
								} else if ((slideFlags & 2) !== 0) {
									note.slideOutType = SlideOutType.Legato;
								} else if ((slideFlags & 4) !== 0) {
									note.slideOutType = SlideOutType.OutDown;
								} else if ((slideFlags & 8) !== 0) {
									note.slideOutType = SlideOutType.OutUp;
								}
								if ((slideFlags & 16) !== 0) {
									note.slideInType = SlideInType.IntoFromBelow;
								} else if ((slideFlags & 32) !== 0) {
									note.slideInType = SlideInType.IntoFromAbove;
								}
								if ((slideFlags & 64) !== 0) {
									note.slideOutType = SlideOutType.PickSlideDown;
								} else if ((slideFlags & 128) !== 0) {
									note.slideOutType = SlideOutType.PickSlideUp;
								}
								break;
						}
						break;
				}
			}
		}

		if (isBended) {
			if (!bendOrigin) {
				bendOrigin = new BendPoint(0, 0);
			}
			if (!bendDestination) {
				bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
			}
			note.addBendPoint(bendOrigin);
			if (bendMiddleOffset1 && bendMiddleValue) {
				note.addBendPoint(new BendPoint(bendMiddleOffset1, bendMiddleValue));
			}
			if (bendMiddleOffset2 && bendMiddleValue) {
				note.addBendPoint(new BendPoint(bendMiddleOffset2, bendMiddleValue));
			}
			if (!bendMiddleOffset1 && !bendMiddleOffset2 && bendMiddleValue) {
				note.addBendPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, bendMiddleValue));
			}
			note.addBendPoint(bendDestination);
		}

		// map GP6 element and variation combos to midi numbers
		if (element !== -1 && variation !== -1) {
			note.percussionArticulation = PercussionMapper.articulationFromElementVariation(element, variation);
		}
	}

	private parseConcertPitch(node: XmlNode, note: Note) {
		const pitch = node.findChildElement('Pitch');
		if (pitch) {
			for (let c of pitch.childNodes) {
				if (c.nodeType === XmlNodeType.Element) {
					switch (c.localName) {
						case 'Accidental':
							switch (c.innerText) {
								case 'x':
									note.accidentalMode = NoteAccidentalMode.ForceDoubleSharp;
									break;
								case '#':
									note.accidentalMode = NoteAccidentalMode.ForceSharp;
									break;
								case 'b':
									note.accidentalMode = NoteAccidentalMode.ForceFlat;
									break;
								case 'bb':
									note.accidentalMode = NoteAccidentalMode.ForceDoubleFlat;
									break;
							}
							break;
					}
				}
			}
		}
	}

	private toBendValue(gpxValue: number): number {
		return (gpxValue * GpifParser.BendPointValueFactor) | 0;
	}

	private toBendOffset(gpxOffset: number): number {
		return (gpxOffset * GpifParser.BendPointPositionFactor);
	}

	private parseRhythms(node: XmlNode): void {
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'Rhythm':
						this.parseRhythm(c);
						break;
				}
			}
		}
	}

	private parseRhythm(node: XmlNode): void {
		let rhythm: GpifRhythm = new GpifRhythm();
		let rhythmId: string = node.getAttribute('id');
		rhythm.id = rhythmId;
		for (let c of node.childNodes) {
			if (c.nodeType === XmlNodeType.Element) {
				switch (c.localName) {
					case 'NoteValue':
						switch (c.innerText) {
							case 'Long':
								rhythm.value = Duration.QuadrupleWhole;
								break;
							case 'DoubleWhole':
								rhythm.value = Duration.DoubleWhole;
								break;
							case 'Whole':
								rhythm.value = Duration.Whole;
								break;
							case 'Half':
								rhythm.value = Duration.Half;
								break;
							case 'Quarter':
								rhythm.value = Duration.Quarter;
								break;
							case 'Eighth':
								rhythm.value = Duration.Eighth;
								break;
							case '16th':
								rhythm.value = Duration.Sixteenth;
								break;
							case '32nd':
								rhythm.value = Duration.ThirtySecond;
								break;
							case '64th':
								rhythm.value = Duration.SixtyFourth;
								break;
							case '128th':
								rhythm.value = Duration.OneHundredTwentyEighth;
								break;
							case '256th':
								rhythm.value = Duration.TwoHundredFiftySixth;
								break;
						}
						break;
					case 'PrimaryTuplet':
						rhythm.tupletNumerator = parseInt(c.getAttribute('num'));
						rhythm.tupletDenominator = parseInt(c.getAttribute('den'));
						break;
					case 'AugmentationDot':
						rhythm.dots = parseInt(c.getAttribute('count'));
						break;
				}
			}
		}
		this._rhythmById.set(rhythmId, rhythm);
	}

	private buildModel(): void {
		// build score
		for (let i: number = 0, j: number = this._masterBars.length; i < j; i++) {
			let masterBar: MasterBar = this._masterBars[i];
			this.score.addMasterBar(masterBar);
		}
		// add tracks to score
		for (let trackId of this._tracksMapping) {
			if (!trackId) {
				continue;
			}
			let track: Track = this._tracksById.get(trackId)!;
			this.score.addTrack(track);
		}
		// process all masterbars
		for (let barIds of this._barsOfMasterBar) {
			// add all bars of masterbar vertically to all tracks
			let staffIndex: number = 0;
			for (
				let barIndex: number = 0, trackIndex: number = 0;
				barIndex < barIds.length && trackIndex < this.score.tracks.length;
				barIndex++
			) {
				let barId: string = barIds[barIndex];
				if (barId !== GpifParser.InvalidId) {
					let bar: Bar = this._barsById.get(barId)!;
					let track: Track = this.score.tracks[trackIndex];
					let staff: Staff = track.staves[staffIndex];
					staff.addBar(bar);
					if (this._voicesOfBar.has(barId)) {
						// add voices to bars
						for (let voiceId of this._voicesOfBar.get(barId)!) {
							if (voiceId !== GpifParser.InvalidId) {
								let voice: Voice = this._voiceById.get(voiceId)!;
								bar.addVoice(voice);
								if (this._beatsOfVoice.has(voiceId)) {
									// add beats to voices
									for (let beatId of this._beatsOfVoice.get(voiceId)!) {
										if (beatId !== GpifParser.InvalidId) {
											// important! we clone the beat because beats get reused
											// in gp6, our model needs to have unique beats.
											let beat: Beat = BeatCloner.clone(this._beatById.get(beatId)!);
											voice.addBeat(beat);
											let rhythmId: string = this._rhythmOfBeat.get(beatId)!;
											let rhythm: GpifRhythm = this._rhythmById.get(rhythmId)!;
											// set beat duration
											beat.duration = rhythm.value;
											beat.dots = rhythm.dots;
											beat.tupletNumerator = rhythm.tupletNumerator;
											beat.tupletDenominator = rhythm.tupletDenominator;
											// add notes to beat
											if (this._notesOfBeat.has(beatId)) {
												for (let noteId of this._notesOfBeat.get(beatId)!) {
													if (noteId !== GpifParser.InvalidId) {
														const note = NoteCloner.clone(this._noteById.get(noteId)!);
														// reset midi value for non-percussion staves
														if (staff.isPercussion) {
															note.fret = -1;
															note.string = -1;
														} else {
															note.percussionArticulation = -1;
														}
														beat.addNote(note);
														if (this._tappedNotes.has(noteId)) {
															beat.tap = true;
														}
													}
												}
											}
										}
									}
								}
							} else {
								// invalid voice -> empty voice
								let voice: Voice = new Voice();
								bar.addVoice(voice);
								let beat: Beat = new Beat();
								beat.isEmpty = true;
								beat.duration = Duration.Quarter;
								voice.addBeat(beat);
							}
						}
					}
					// stave is full? -> next track
					if (staffIndex === track.staves.length - 1) {
						trackIndex++;
						staffIndex = 0;
					} else {
						staffIndex++;
					}
				} else {
					// no bar for track
					trackIndex++;
				}
			}
		}

		// clear out percussion articulations where not needed 
		// and add automations
		for (let trackId of this._tracksMapping) {
			if (!trackId) {
				continue;
			}
			let track: Track = this._tracksById.get(trackId)!;

			let hasPercussion = false;
			for (const staff of track.staves) {
				if (staff.isPercussion) {
					hasPercussion = true;
					break;
				}
			}
			if (!hasPercussion) {
				track.percussionArticulations = [];
			}

			if (this._automationsPerTrackIdAndBarIndex.has(trackId)) {
				const trackAutomations = this._automationsPerTrackIdAndBarIndex.get(trackId)!;
				for (const [barNumber, automations] of trackAutomations) {
					if (track.staves.length > 0 && barNumber < track.staves[0].bars.length) {
						const bar = track.staves[0].bars[barNumber];
						if (bar.voices.length > 0 && bar.voices[0].beats.length > 0) {
							const beat = bar.voices[0].beats[0];
							for (const a of automations) {
								beat.automations.push(a);
							}
						}
					}
				}
			}
		}

		// build masterbar automations
		for (const [barNumber, automations] of this._masterTrackAutomations) {
			let masterBar: MasterBar = this.score.masterBars[barNumber];
			for (let i: number = 0, j: number = automations.length; i < j; i++) {
				let automation: Automation = automations[i];
				if (automation.type === AutomationType.Tempo) {
					if (barNumber === 0) {
						this.score.tempo = automation.value | 0;
						if (automation.text) {
							this.score.tempoLabel = automation.text;
						}
					}
					masterBar.tempoAutomation = automation;
				}
			}
		}
	}
}
interface IWriteable {

	/**
	 * Gets the current number of written bytes. 
	 */
	readonly bytesWritten: number;

	/**
	 * Write a single byte to the stream.
	 * @param value The value to write.
	 */
	writeByte(value: number): void;

	/**
	 * Write data from the given buffer.
	 * @param buffer The buffer to get the data from.
	 * @param offset The offset where to start reading the data.
	 * @param count The number of bytes to write
	 */
	write(buffer: Uint8Array, offset: number, count: number): void;
}
interface IReadable {
	/**
	 * Gets or sets the current read position relative in the stream.
	 */
	position: number;

	/**
	 * Gets the total number of bytes contained in the stream.
	 */
	readonly length: number;

	/**
	 * Resets the stream for reading the data from the beginning.
	 */
	reset(): void;

	/**
	 * Skip the given number of bytes.
	 * @param offset The number of bytes to skip.
	 */
	skip(offset: number): void;

	/**
	 * Read a single byte from the data stream.
	 * @returns The value of the next byte or -1 if there is no more data.
	 */
	readByte(): number;

	/**
	 * Reads the given number of bytes from the stream into the given buffer.
	 * @param buffer The buffer to fill.
	 * @param offset The offset in the buffer where to start writing.
	 * @param count The number of bytes to read.
	 * @returns
	 */
	read(buffer: Uint8Array, offset: number, count: number): number;

	/**
	 * Reads the remaining data.
	 * @returns
	 */
	readAll(): Uint8Array;
}
class TypeConversions {

	private static _conversionBuffer: ArrayBuffer = new ArrayBuffer(8);
	private static _conversionByteArray: Uint8Array = new Uint8Array(TypeConversions._conversionBuffer);
	private static _dataView = new DataView(TypeConversions._conversionBuffer);

	public static float64ToBytes(v: number): Uint8Array {
		TypeConversions._dataView.setFloat64(0, v, true);
		return this._conversionByteArray;
	}

	public static bytesToFloat64(bytes: Uint8Array): number {
		TypeConversions._conversionByteArray.set(bytes, 0);
		throw TypeConversions._dataView.getFloat64(0, true);
	}

	public static uint16ToInt16(v: number): number {
		TypeConversions._dataView.setUint16(0, v, true);
		return TypeConversions._dataView.getInt16(0, true);
	}

	public static int16ToUint32(v: number): number {
		TypeConversions._dataView.setInt16(0, v, true);
		return TypeConversions._dataView.getUint32(0, true);
	}

	public static int32ToUint16(v: number): number {
		TypeConversions._dataView.setInt32(0, v, true);
		return TypeConversions._dataView.getUint16(0, true);
	}

	public static int32ToInt16(v: number): number {
		TypeConversions._dataView.setInt32(0, v, true);
		return TypeConversions._dataView.getInt16(0, true);
	}

	public static int32ToUint32(v: number): number {
		TypeConversions._dataView.setInt32(0, v, true);
		return TypeConversions._dataView.getUint32(0, true);
	}

	public static uint8ToInt8(v: number): number {
		TypeConversions._dataView.setUint8(0, v);
		return TypeConversions._dataView.getInt8(0);
	}
}
abstract class ScoreImporter {
	protected data!: IReadable;
	protected settings!: Settings;

	/**
	 * Initializes the importer with the given data and settings.
	 */
	public init(data: IReadable, settings: Settings): void {
		this.data = data;
		this.settings = settings;
	}

	public abstract get name(): string;

	/**
	 * Reads the {@link Score} contained in the data.
	 * @returns The score that was contained in the data.
	 */
	public abstract readScore(): Score;
}
class IOHelper {
	public static readInt32BE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		let ch3: number = input.readByte();
		let ch4: number = input.readByte();
		return (ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4;
	}

	public static readInt32LE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		let ch3: number = input.readByte();
		let ch4: number = input.readByte();
		return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
	}

	public static readUInt32LE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		let ch3: number = input.readByte();
		let ch4: number = input.readByte();
		return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
	}

	public static decodeUInt32LE(data: Uint8Array, index: number): number {
		let ch1: number = data[index];
		let ch2: number = data[index + 1];
		let ch3: number = data[index + 2];
		let ch4: number = data[index + 3];
		return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
	}

	public static readUInt16LE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		return TypeConversions.int32ToUint16((ch2 << 8) | ch1);
	}

	public static readInt16LE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		return TypeConversions.int32ToInt16((ch2 << 8) | ch1);
	}

	public static readUInt32BE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		let ch3: number = input.readByte();
		let ch4: number = input.readByte();
		return TypeConversions.int32ToUint32((ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4);
	}

	public static readUInt16BE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
	}

	public static readInt16BE(input: IReadable): number {
		let ch1: number = input.readByte();
		let ch2: number = input.readByte();
		return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
	}

	public static readByteArray(input: IReadable, length: number): Uint8Array {
		let v: Uint8Array = new Uint8Array(length);
		input.read(v, 0, length);
		return v;
	}

	public static read8BitChars(input: IReadable, length: number): string {
		let b: Uint8Array = new Uint8Array(length);
		input.read(b, 0, b.length);
		return IOHelper.toString(b, 'utf-8');
	}

	public static read8BitString(input: IReadable): string {
		let s: string = '';
		let c: number = input.readByte();
		while (c !== 0) {
			s += String.fromCharCode(c);
			c = input.readByte();
		}
		return s;
	}

	public static read8BitStringLength(input: IReadable, length: number): string {
		let s: string = '';
		let z: number = -1;
		for (let i: number = 0; i < length; i++) {
			let c: number = input.readByte();
			if (c === 0 && z === -1) {
				z = i;
			}
			s += String.fromCharCode(c);
		}
		let t: string = s;
		if (z >= 0) {
			return t.substr(0, z);
		}
		return t;
	}

	public static readSInt8(input: IReadable): number {
		let v: number = input.readByte();
		return ((v & 255) >> 7) * -256 + (v & 255);
	}

	public static readInt24(input: Uint8Array, index: number): number {
		let i: number = input[index] | (input[index + 1] << 8) | (input[index + 2] << 16);
		if ((i & 0x800000) === 0x800000) {
			i = i | (0xff << 24);
		}
		return i;
	}

	public static readInt16(input: Uint8Array, index: number): number {
		return TypeConversions.int32ToInt16(input[index] | (input[index + 1] << 8));
	}

	public static toString(data: Uint8Array, encoding: string): string {
		let detectedEncoding: string | null = IOHelper.detectEncoding(data);
		if (detectedEncoding) {
			encoding = detectedEncoding;
		}
		if (!encoding) {
			encoding = 'utf-8';
		}
		let decoder: TextDecoder = new TextDecoder(encoding);
		return decoder.decode(data.buffer);
	}

	private static detectEncoding(data: Uint8Array): string | null {
		if (data.length > 2 && data[0] === 0xfe && data[1] === 0xff) {
			return 'utf-16be';
		}
		if (data.length > 2 && data[0] === 0xff && data[1] === 0xfe) {
			return 'utf-16le';
		}
		if (data.length > 4 && data[0] === 0x00 && data[1] === 0x00 && data[2] === 0xfe && data[3] === 0xff) {
			return 'utf-32be';
		}
		if (data.length > 4 && data[0] === 0xff && data[1] === 0xfe && data[2] === 0x00 && data[3] === 0x00) {
			return 'utf-32le';
		}
		return null;
	}

	public static stringToBytes(str: string): Uint8Array {
		let decoder: TextEncoder = new TextEncoder();
		return decoder.encode(str);
	}

	public static writeInt32BE(o: IWriteable, v: number) {
		o.writeByte((v >> 24) & 0xff);
		o.writeByte((v >> 16) & 0xff);
		o.writeByte((v >> 8) & 0xff);
		o.writeByte((v >> 0) & 0xff);
	}

	public static writeInt32LE(o: IWriteable, v: number) {
		o.writeByte((v >> 0) & 0xff);
		o.writeByte((v >> 8) & 0xff);
		o.writeByte((v >> 16) & 0xff);
		o.writeByte((v >> 24) & 0xff);
	}

	public static writeUInt16LE(o: IWriteable, v: number) {
		o.writeByte((v >> 0) & 0xff);
		o.writeByte((v >> 8) & 0xff);
	}

	public static writeInt16LE(o: IWriteable, v: number) {
		o.writeByte((v >> 0) & 0xff);
		o.writeByte((v >> 8) & 0xff);
	}

	public static writeInt16BE(o: IWriteable, v: number) {
		o.writeByte((v >> 8) & 0xff);
		o.writeByte((v >> 0) & 0xff);
	}
}
class Gp3To5Importer extends ScoreImporter {
	private static readonly VersionString: string = 'FICHIER GUITAR PRO ';
	private _versionNumber: number = 0;
	private _score!: Score;
	private _globalTripletFeel: TripletFeel = TripletFeel.NoTripletFeel;
	private _lyricsTrack: number = 0;
	private _lyrics: Lyrics[] = [];
	private _barCount: number = 0;
	private _trackCount: number = 0;
	private _playbackInfos: PlaybackInformation[] = [];

	private _beatTextChunksByTrack: Map<number, string[]> = new Map<number, string[]>();

	public get name(): string {
		return 'Guitar Pro 3-5';
	}

	public constructor() {
		super();
	}

	public readScore(): Score {
		this.readVersion();
		this._score = new Score();
		// basic song info
		this.readScoreInformation();
		// triplet feel before Gp5
		if (this._versionNumber < 500) {
			this._globalTripletFeel = GpBinaryHelpers.gpReadBool(this.data)
				? TripletFeel.Triplet8th
				: TripletFeel.NoTripletFeel;
		}
		// beat lyrics
		if (this._versionNumber >= 400) {
			this.readLyrics();
		}
		// rse master settings since GP5.1
		if (this._versionNumber >= 510) {
			// master volume (4)
			// master effect (4)
			// master equalizer (10)
			// master equalizer preset (1)
			this.data.skip(19);
		}
		// page setup since GP5
		if (this._versionNumber >= 500) {
			this.readPageSetup();
			this._score.tempoLabel = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
		}
		// tempo stuff
		this._score.tempo = IOHelper.readInt32LE(this.data);
		if (this._versionNumber >= 510) {
			GpBinaryHelpers.gpReadBool(this.data); // hide tempo?
		}
		// keysignature and octave
		IOHelper.readInt32LE(this.data);
		if (this._versionNumber >= 400) {
			this.data.readByte();
		}
		this.readPlaybackInfos();
		// repetition stuff
		if (this._versionNumber >= 500) {
			// "Coda" bar index (2)
			// "Double Coda" bar index (2)
			// "Segno" bar index (2)
			// "Segno Segno" bar index (2)
			// "Fine" bar index (2)
			// "Da Capo" bar index (2)
			// "Da Capo al Coda" bar index (2)
			// "Da Capo al Double Coda" bar index (2)
			// "Da Capo al Fine" bar index (2)
			// "Da Segno" bar index (2)
			// "Da Segno al Coda" bar index (2)
			// "Da Segno al Double Coda" bar index (2)
			// "Da Segno al Fine "bar index (2)
			// "Da Segno Segno" bar index (2)
			// "Da Segno Segno al Coda" bar index (2)
			// "Da Segno Segno al Double Coda" bar index (2)
			// "Da Segno Segno al Fine" bar index (2)
			// "Da Coda" bar index (2)
			// "Da Double Coda" bar index (2)
			this.data.skip(38);
			// unknown (4)
			this.data.skip(4);
		}
		// contents
		this._barCount = IOHelper.readInt32LE(this.data);
		this._trackCount = IOHelper.readInt32LE(this.data);
		this.readMasterBars();
		this.readTracks();
		this.readBars();

		// To be more in line with the GP7 structure we create an
		// initial tempo automation on the first masterbar
		if (this._score.masterBars.length > 0) {
			this._score.masterBars[0].tempoAutomation = Automation.buildTempoAutomation(false, 0, this._score.tempo, 2);
			this._score.masterBars[0].tempoAutomation.text = this._score.tempoLabel;
		}

		this._score.finish(this.settings);
		if (this._lyrics && this._lyricsTrack >= 0) {
			this._score.tracks[this._lyricsTrack].applyLyrics(this._lyrics);
		}
		return this._score;
	}

	public readVersion(): void {
		let version: string = GpBinaryHelpers.gpReadStringByteLength(this.data, 30, this.settings.importer.encoding);
		if (!version.startsWith(Gp3To5Importer.VersionString)) {
			throw new //UnsupportedFormat
				Error('Unsupported format');
		}
		version = version.substr(Gp3To5Importer.VersionString.length + 1);
		let dot: number = version.indexOf(String.fromCharCode(46));
		this._versionNumber = 100 * parseInt(version.substr(0, dot)) + parseInt(version.substr(dot + 1));
		//Logger.debug(this.name, 'Guitar Pro version ' + version + ' detected');
	}

	public readScoreInformation(): void {
		this._score.title = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.subTitle = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.artist = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.album = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.words = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.music =
			this._versionNumber >= 500
				? GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)
				: this._score.words;
		this._score.copyright = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.tab = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		this._score.instructions = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
		let noticeLines: number = IOHelper.readInt32LE(this.data);
		let notice: string = '';
		for (let i: number = 0; i < noticeLines; i++) {
			if (i > 0) {
				notice += '\r\n';
			}
			notice += GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)?.toString();
		}
		this._score.notices = notice;
	}

	public readLyrics(): void {
		this._lyrics = [];
		this._lyricsTrack = IOHelper.readInt32LE(this.data) - 1;
		for (let i: number = 0; i < 5; i++) {
			let lyrics: Lyrics = new Lyrics();
			lyrics.startBar = IOHelper.readInt32LE(this.data) - 1;
			lyrics.text = GpBinaryHelpers.gpReadStringInt(this.data, this.settings.importer.encoding);
			this._lyrics.push(lyrics);
		}
	}

	public readPageSetup(): void {
		// Page Width (4)
		// Page Heigth (4)
		// Padding Left (4)
		// Padding Right (4)
		// Padding Top (4)
		// Padding Bottom (4)
		// Size Proportion(4)
		// Header and Footer display flags (2)
		this.data.skip(30);
		// title format
		// subtitle format
		// artist format
		// album format
		// words format
		// music format
		// words and music format
		// copyright format
		// pagpublic enumber format
		for (let i: number = 0; i < 10; i++) {
			GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
		}
	}

	public readPlaybackInfos(): void {
		this._playbackInfos = [];
		for (let i: number = 0; i < 64; i++) {
			let info: PlaybackInformation = new PlaybackInformation();
			info.primaryChannel = i;
			info.secondaryChannel = i;
			info.program = IOHelper.readInt32LE(this.data);
			info.volume = this.data.readByte();
			info.balance = this.data.readByte();
			this.data.skip(6);
			this._playbackInfos.push(info);
		}
	}

	public readMasterBars(): void {
		for (let i: number = 0; i < this._barCount; i++) {
			this.readMasterBar();
		}
	}

	public readMasterBar(): void {
		let previousMasterBar: MasterBar | null = null;
		if (this._score.masterBars.length > 0) {
			previousMasterBar = this._score.masterBars[this._score.masterBars.length - 1];
		}
		let newMasterBar: MasterBar = new MasterBar();
		let flags: number = this.data.readByte();
		// time signature
		if ((flags & 0x01) !== 0) {
			newMasterBar.timeSignatureNumerator = this.data.readByte();
		} else if (previousMasterBar) {
			newMasterBar.timeSignatureNumerator = previousMasterBar.timeSignatureNumerator;
		}
		if ((flags & 0x02) !== 0) {
			newMasterBar.timeSignatureDenominator = this.data.readByte();
		} else if (previousMasterBar) {
			newMasterBar.timeSignatureDenominator = previousMasterBar.timeSignatureDenominator;
		}
		// repeatings
		newMasterBar.isRepeatStart = (flags & 0x04) !== 0;
		if ((flags & 0x08) !== 0) {
			newMasterBar.repeatCount = this.data.readByte() + (this._versionNumber >= 500 ? 0 : 1);
		}
		// alternate endings (pre GP5)
		if ((flags & 0x10) !== 0 && this._versionNumber < 500) {
			let currentMasterBar: MasterBar | null = previousMasterBar;
			// get the already existing alternatives to ignore them
			let existentAlternatives: number = 0;
			while (currentMasterBar) {
				// found another repeat ending?
				if (currentMasterBar.isRepeatEnd && currentMasterBar !== previousMasterBar) {
					break;
				}
				// found the opening?
				if (currentMasterBar.isRepeatStart) {
					break;
				}
				existentAlternatives = existentAlternatives | currentMasterBar.alternateEndings;
				currentMasterBar = currentMasterBar.previousMasterBar;
			}
			// now calculate the alternative for this bar
			let repeatAlternative: number = 0;
			let repeatMask: number = this.data.readByte();
			for (let i: number = 0; i < 8; i++) {
				// only add the repeating if it is not existing
				let repeating: number = 1 << i;
				if (repeatMask > i && (existentAlternatives & repeating) === 0) {
					repeatAlternative = repeatAlternative | repeating;
				}
			}
			newMasterBar.alternateEndings = repeatAlternative;
		}
		// marker
		if ((flags & 0x20) !== 0) {
			let section: Section = new Section();
			section.text = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
			section.marker = '';
			//GpBinaryHelpers.gpReadColor(this.data, false);
			newMasterBar.section = section;
		}
		// keysignature
		if ((flags & 0x40) !== 0) {
			newMasterBar.keySignature = IOHelper.readSInt8(this.data) as KeySignature;
			newMasterBar.keySignatureType = this.data.readByte() as KeySignatureType;
		} else if (previousMasterBar) {
			newMasterBar.keySignature = previousMasterBar.keySignature;
			newMasterBar.keySignatureType = previousMasterBar.keySignatureType;
		}
		if (this._versionNumber >= 500 && (flags & 0x03) !== 0) {
			this.data.skip(4);
		}
		// better alternate ending mask in GP5
		if (this._versionNumber >= 500) {
			newMasterBar.alternateEndings = this.data.readByte();
		}
		// tripletfeel
		if (this._versionNumber >= 500) {
			let tripletFeel: number = this.data.readByte();
			switch (tripletFeel) {
				case 1:
					newMasterBar.tripletFeel = TripletFeel.Triplet8th;
					break;
				case 2:
					newMasterBar.tripletFeel = TripletFeel.Triplet16th;
					break;
			}
			this.data.readByte();
		} else {
			newMasterBar.tripletFeel = this._globalTripletFeel;
		}
		newMasterBar.isDoubleBar = (flags & 0x80) !== 0;

		this._score.addMasterBar(newMasterBar);
	}

	public readTracks(): void {
		for (let i: number = 0; i < this._trackCount; i++) {
			this.readTrack();
		}
	}

	public readTrack(): void {
		let newTrack: Track = new Track();
		newTrack.ensureStaveCount(1);
		this._score.addTrack(newTrack);
		let mainStaff: Staff = newTrack.staves[0];
		let flags: number = this.data.readByte();
		newTrack.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 40, this.settings.importer.encoding);
		if ((flags & 0x01) !== 0) {
			mainStaff.isPercussion = true;
		}
		let stringCount: number = IOHelper.readInt32LE(this.data);
		let tuning: number[] = [];
		for (let i: number = 0; i < 7; i++) {
			let stringTuning: number = IOHelper.readInt32LE(this.data);
			if (stringCount > i) {
				tuning.push(stringTuning);
			}
		}
		mainStaff.stringTuning.tunings = tuning;

		let port: number = IOHelper.readInt32LE(this.data);
		let index: number = IOHelper.readInt32LE(this.data) - 1;
		let effectChannel: number = IOHelper.readInt32LE(this.data) - 1;
		this.data.skip(4); // Fretcount

		if (index >= 0 && index < this._playbackInfos.length) {
			let info: PlaybackInformation = this._playbackInfos[index];
			info.port = port;
			info.isSolo = (flags & 0x10) !== 0;
			info.isMute = (flags & 0x20) !== 0;
			info.secondaryChannel = effectChannel;
			if (GeneralMidi.isGuitar(info.program)) {
				mainStaff.displayTranspositionPitch = -12;
			}
			newTrack.playbackInfo = info;
		}
		mainStaff.capo = IOHelper.readInt32LE(this.data);
		//newTrack.color = GpBinaryHelpers.gpReadColor(this.data, false);
		if (this._versionNumber >= 500) {
			// flags for
			//  0x01 -> show tablature
			//  0x02 -> show standard notation
			this.data.readByte();
			// flags for
			//  0x02 -> auto let ring
			//  0x04 -> auto brush
			this.data.readByte();
			// unknown
			this.data.skip(43);
		}
		// unknown
		if (this._versionNumber >= 510) {
			this.data.skip(4);
			GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
			GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
		}
	}

	public readBars(): void {
		for (let i: number = 0; i < this._barCount; i++) {
			for (let t: number = 0; t < this._trackCount; t++) {
				this.readBar(this._score.tracks[t]);
			}
		}
	}

	public readBar(track: Track): void {
		let newBar: Bar = new Bar();
		let mainStaff: Staff = track.staves[0];
		if (mainStaff.isPercussion) {
			newBar.clef = Clef.Neutral;
		}
		mainStaff.addBar(newBar);
		let voiceCount: number = 1;
		if (this._versionNumber >= 500) {
			this.data.readByte();
			voiceCount = 2;
		}
		for (let v: number = 0; v < voiceCount; v++) {
			this.readVoice(track, newBar);
		}
	}

	public readVoice(track: Track, bar: Bar): void {
		let beatCount: number = IOHelper.readInt32LE(this.data);
		if (beatCount === 0) {
			return;
		}
		let newVoice: Voice = new Voice();
		bar.addVoice(newVoice);
		for (let i: number = 0; i < beatCount; i++) {
			this.readBeat(track, bar, newVoice);
		}
	}

	public readBeat(track: Track, bar: Bar, voice: Voice): void {
		let newBeat: Beat = new Beat();
		let flags: number = this.data.readByte();
		if ((flags & 0x01) !== 0) {
			newBeat.dots = 1;
		}
		if ((flags & 0x40) !== 0) {
			let type: number = this.data.readByte();
			newBeat.isEmpty = (type & 0x02) === 0;
		}
		voice.addBeat(newBeat);
		let duration: number = IOHelper.readSInt8(this.data);
		switch (duration) {
			case -2:
				newBeat.duration = Duration.Whole;
				break;
			case -1:
				newBeat.duration = Duration.Half;
				break;
			case 0:
				newBeat.duration = Duration.Quarter;
				break;
			case 1:
				newBeat.duration = Duration.Eighth;
				break;
			case 2:
				newBeat.duration = Duration.Sixteenth;
				break;
			case 3:
				newBeat.duration = Duration.ThirtySecond;
				break;
			case 4:
				newBeat.duration = Duration.SixtyFourth;
				break;
			default:
				newBeat.duration = Duration.Quarter;
				break;
		}
		if ((flags & 0x20) !== 0) {
			newBeat.tupletNumerator = IOHelper.readInt32LE(this.data);
			switch (newBeat.tupletNumerator) {
				case 1:
					newBeat.tupletDenominator = 1;
					break;
				case 3:
					newBeat.tupletDenominator = 2;
					break;
				case 5:
				case 6:
				case 7:
					newBeat.tupletDenominator = 4;
					break;
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
					newBeat.tupletDenominator = 8;
					break;
				case 2:
				case 4:
				case 8:
					break;
				default:
					newBeat.tupletNumerator = 1;
					newBeat.tupletDenominator = 1;
					break;
			}
		}
		if ((flags & 0x02) !== 0) {
			this.readChord(newBeat);
		}

		let beatTextAsLyrics = this.settings.importer.beatTextAsLyrics
			&& track.index !== this._lyricsTrack; // detect if not lyrics track

		if ((flags & 0x04) !== 0) {
			const text = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
			if (beatTextAsLyrics) {

				const lyrics = new Lyrics();
				lyrics.text = text.trim();
				lyrics.finish(true);

				// push them in reverse order to the store for applying them 
				// to the next beats being read 
				const beatLyrics: string[] = [];
				for (let i = lyrics.chunks.length - 1; i >= 0; i--) {
					beatLyrics.push(lyrics.chunks[i]);
				}
				this._beatTextChunksByTrack.set(track.index, beatLyrics);

			} else {
				newBeat.text = text;
			}
		}


		let allNoteHarmonicType = HarmonicType.None;
		if ((flags & 0x08) !== 0) {
			allNoteHarmonicType = this.readBeatEffects(newBeat);
		}
		if ((flags & 0x10) !== 0) {
			this.readMixTableChange(newBeat);
		}
		let stringFlags: number = this.data.readByte();
		for (let i: number = 6; i >= 0; i--) {
			if ((stringFlags & (1 << i)) !== 0 && 6 - i < bar.staff.tuning.length) {
				const note = this.readNote(track, bar, voice, newBeat, 6 - i);
				if (allNoteHarmonicType !== HarmonicType.None) {
					note.harmonicType = allNoteHarmonicType;
					if (note.harmonicType === HarmonicType.Natural) {
						note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
					}
				}
			}
		}
		if (this._versionNumber >= 500) {
			this.data.readByte();
			let flag: number = this.data.readByte();
			if ((flag & 0x08) !== 0) {
				this.data.readByte();
			}
		}

		if (beatTextAsLyrics && !newBeat.isRest &&
			this._beatTextChunksByTrack.has(track.index) &&
			this._beatTextChunksByTrack.get(track.index)!.length > 0) {
			newBeat.lyrics = [this._beatTextChunksByTrack.get(track.index)!.pop()!];
		}
	}

	public readChord(beat: Beat): void {
		let chord: Chord = new Chord();
		let chordId: string = ModelUtils.newGuid();
		if (this._versionNumber >= 500) {
			this.data.skip(17);
			chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
			this.data.skip(4);
			chord.firstFret = IOHelper.readInt32LE(this.data);
			for (let i: number = 0; i < 7; i++) {
				let fret: number = IOHelper.readInt32LE(this.data);
				if (i < beat.voice.bar.staff.tuning.length) {
					chord.strings.push(fret);
				}
			}
			let numberOfBarres: number = this.data.readByte();
			let barreFrets: Uint8Array = new Uint8Array(5);
			this.data.read(barreFrets, 0, barreFrets.length);
			for (let i: number = 0; i < numberOfBarres; i++) {
				chord.barreFrets.push(barreFrets[i]);
			}
			this.data.skip(26);
		} else {
			if (this.data.readByte() !== 0) {
				// gp4
				if (this._versionNumber >= 400) {
					// Sharp (1)
					// Unused (3)
					// Root (1)
					// Major/Minor (1)
					// Nin,Eleven or Thirteen (1)
					// Bass (4)
					// Diminished/Augmented (4)
					// Add (1)
					this.data.skip(16);
					chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
					// Unused (2)
					// Fifth (1)
					// Ninth (1)
					// Eleventh (1)
					this.data.skip(4);
					chord.firstFret = IOHelper.readInt32LE(this.data);
					for (let i: number = 0; i < 7; i++) {
						let fret: number = IOHelper.readInt32LE(this.data);
						if (i < beat.voice.bar.staff.tuning.length) {
							chord.strings.push(fret);
						}
					}
					let numberOfBarres: number = this.data.readByte();
					let barreFrets: Uint8Array = new Uint8Array(5);
					this.data.read(barreFrets, 0, barreFrets.length);
					for (let i: number = 0; i < numberOfBarres; i++) {
						chord.barreFrets.push(barreFrets[i]);
					}
					// Barree end (5)
					// Omission1,3,5,7,9,11,13 (7)
					// Unused (1)
					// Fingering (7)
					// Show Diagram Fingering (1)
					// ??
					this.data.skip(26);
				} else {
					// unknown
					this.data.skip(25);
					chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 34, this.settings.importer.encoding);
					chord.firstFret = IOHelper.readInt32LE(this.data);
					for (let i: number = 0; i < 6; i++) {
						let fret: number = IOHelper.readInt32LE(this.data);
						if (i < beat.voice.bar.staff.tuning.length) {
							chord.strings.push(fret);
						}
					}
					// unknown
					this.data.skip(36);
				}
			} else {
				let strings: number = this._versionNumber >= 406 ? 7 : 6;
				chord.name = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
				chord.firstFret = IOHelper.readInt32LE(this.data);
				if (chord.firstFret > 0) {
					for (let i: number = 0; i < strings; i++) {
						let fret: number = IOHelper.readInt32LE(this.data);
						if (i < beat.voice.bar.staff.tuning.length) {
							chord.strings.push(fret);
						}
					}
				}
			}
		}
		if (chord.name) {
			beat.chordId = chordId;
			beat.voice.bar.staff.addChord(beat.chordId, chord);
		}
	}

	public readBeatEffects(beat: Beat): HarmonicType {
		let flags: number = this.data.readByte();
		let flags2: number = 0;
		if (this._versionNumber >= 400) {
			flags2 = this.data.readByte();
		}
		beat.fadeIn = (flags & 0x10) !== 0;
		if ((this._versionNumber < 400 && (flags & 0x01) !== 0) || (flags & 0x02) !== 0) {
			beat.vibrato = VibratoType.Slight;
		}
		beat.hasRasgueado = (flags2 & 0x01) !== 0;
		if ((flags & 0x20) !== 0 && this._versionNumber >= 400) {
			let slapPop: number = IOHelper.readSInt8(this.data);
			switch (slapPop) {
				case 1:
					beat.tap = true;
					break;
				case 2:
					beat.slap = true;
					break;
				case 3:
					beat.pop = true;
					break;
			}
		} else if ((flags & 0x20) !== 0) {
			let slapPop: number = IOHelper.readSInt8(this.data);
			switch (slapPop) {
				case 1:
					beat.tap = true;
					break;
				case 2:
					beat.slap = true;
					break;
				case 3:
					beat.pop = true;
					break;
			}
			this.data.skip(4);
		}
		if ((flags2 & 0x04) !== 0) {
			this.readTremoloBarEffect(beat);
		}
		if ((flags & 0x40) !== 0) {
			let strokeUp: number = 0;
			let strokeDown: number = 0;
			if (this._versionNumber < 500) {
				strokeDown = this.data.readByte();
				strokeUp = this.data.readByte();
			} else {
				strokeUp = this.data.readByte();
				strokeDown = this.data.readByte();
			}
			if (strokeUp > 0) {
				beat.brushType = BrushType.BrushUp;
				beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeUp);
			} else if (strokeDown > 0) {
				beat.brushType = BrushType.BrushDown;
				beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeDown);
			}
		}
		if ((flags2 & 0x02) !== 0) {
			switch (IOHelper.readSInt8(this.data)) {
				case 0:
					beat.pickStroke = PickStroke.None;
					break;
				case 1:
					beat.pickStroke = PickStroke.Up;
					break;
				case 2:
					beat.pickStroke = PickStroke.Down;
					break;
			}
		}

		if (this._versionNumber < 400) {
			if ((flags & 0x04) !== 0) {
				return HarmonicType.Natural;
			} else if ((flags & 0x08) !== 0) {
				return HarmonicType.Artificial;
			}
		}

		return HarmonicType.None;
	}

	public readTremoloBarEffect(beat: Beat): void {
		this.data.readByte(); // type

		IOHelper.readInt32LE(this.data); // value

		let pointCount: number = IOHelper.readInt32LE(this.data);
		if (pointCount > 0) {
			for (let i: number = 0; i < pointCount; i++) {
				let point: BendPoint = new BendPoint(0, 0);
				point.offset = IOHelper.readInt32LE(this.data); // 0...60

				point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0; // 0..12 (amount of quarters)

				GpBinaryHelpers.gpReadBool(this.data); // vibrato

				beat.addWhammyBarPoint(point);
			}
		}
	}

	private static toStrokeValue(value: number): number {
		switch (value) {
			case 1:
				return 30;
			case 2:
				return 30;
			case 3:
				return 60;
			case 4:
				return 120;
			case 5:
				return 240;
			case 6:
				return 480;
			default:
				return 0;
		}
	}

	public readMixTableChange(beat: Beat): void {
		let tableChange: MixTableChange = new MixTableChange();
		tableChange.instrument = IOHelper.readSInt8(this.data);
		if (this._versionNumber >= 500) {
			this.data.skip(16); // Rse Info
		}
		tableChange.volume = IOHelper.readSInt8(this.data);
		tableChange.balance = IOHelper.readSInt8(this.data);
		let chorus: number = IOHelper.readSInt8(this.data);
		let reverb: number = IOHelper.readSInt8(this.data);
		let phaser: number = IOHelper.readSInt8(this.data);
		let tremolo: number = IOHelper.readSInt8(this.data);
		if (this._versionNumber >= 500) {
			tableChange.tempoName = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
		}
		tableChange.tempo = IOHelper.readInt32LE(this.data);
		// durations
		if (tableChange.volume >= 0) {
			this.data.readByte();
		}
		if (tableChange.balance >= 0) {
			this.data.readByte();
		}
		if (chorus >= 0) {
			this.data.readByte();
		}
		if (reverb >= 0) {
			this.data.readByte();
		}
		if (phaser >= 0) {
			this.data.readByte();
		}
		if (tremolo >= 0) {
			this.data.readByte();
		}
		if (tableChange.tempo >= 0) {
			tableChange.duration = IOHelper.readSInt8(this.data);
			if (this._versionNumber >= 510) {
				this.data.readByte(); // hideTempo (bool)
			}
		}
		if (this._versionNumber >= 400) {
			this.data.readByte(); // all tracks flag
		}
		// unknown
		if (this._versionNumber >= 500) {
			this.data.readByte();
		}
		// unknown
		if (this._versionNumber >= 510) {
			GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
			GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
		}
		if (tableChange.volume >= 0) {
			let volumeAutomation: Automation = new Automation();
			volumeAutomation.isLinear = true;
			volumeAutomation.type = AutomationType.Volume;
			volumeAutomation.value = tableChange.volume;
			beat.automations.push(volumeAutomation);
		}
		if (tableChange.balance >= 0) {
			let balanceAutomation: Automation = new Automation();
			balanceAutomation.isLinear = true;
			balanceAutomation.type = AutomationType.Balance;
			balanceAutomation.value = tableChange.balance;
			beat.automations.push(balanceAutomation);
		}
		if (tableChange.instrument >= 0) {
			let instrumentAutomation: Automation = new Automation();
			instrumentAutomation.isLinear = true;
			instrumentAutomation.type = AutomationType.Instrument;
			instrumentAutomation.value = tableChange.instrument;
			beat.automations.push(instrumentAutomation);
		}
		if (tableChange.tempo >= 0) {
			let tempoAutomation: Automation = new Automation();
			tempoAutomation.isLinear = true;
			tempoAutomation.type = AutomationType.Tempo;
			tempoAutomation.value = tableChange.tempo;
			beat.automations.push(tempoAutomation);
			beat.voice.bar.masterBar.tempoAutomation = tempoAutomation;
		}
	}

	public readNote(track: Track, bar: Bar, voice: Voice, beat: Beat, stringIndex: number): Note {
		let newNote: Note = new Note();
		newNote.string = bar.staff.tuning.length - stringIndex;
		let flags: number = this.data.readByte();
		if ((flags & 0x02) !== 0) {
			newNote.accentuated = AccentuationType.Heavy;
		} else if ((flags & 0x40) !== 0) {
			newNote.accentuated = AccentuationType.Normal;
		}
		newNote.isGhost = (flags & 0x04) !== 0;
		if ((flags & 0x20) !== 0) {
			let noteType: number = this.data.readByte();
			if (noteType === 3) {
				newNote.isDead = true;
			} else if (noteType === 2) {
				newNote.isTieDestination = true;
			}
		}
		if ((flags & 0x01) !== 0 && this._versionNumber < 500) {
			this.data.readByte(); // duration

			this.data.readByte(); // tuplet
		}
		if ((flags & 0x10) !== 0) {
			let dynamicNumber: number = IOHelper.readSInt8(this.data);
			newNote.dynamics = this.toDynamicValue(dynamicNumber);
			beat.dynamics = newNote.dynamics;
		}
		if ((flags & 0x20) !== 0) {
			newNote.fret = IOHelper.readSInt8(this.data);
		}
		if ((flags & 0x80) !== 0) {
			newNote.leftHandFinger = IOHelper.readSInt8(this.data) as Fingers;
			newNote.rightHandFinger = IOHelper.readSInt8(this.data) as Fingers;
			newNote.isFingering = true;
		}
		let swapAccidentals = false;
		if (this._versionNumber >= 500) {
			if ((flags & 0x01) !== 0) {
				newNote.durationPercent = GpBinaryHelpers.gpReadDouble(this.data);
			}
			let flags2: number = this.data.readByte();
			swapAccidentals = (flags2 & 0x02) !== 0;
		}
		beat.addNote(newNote);
		if ((flags & 0x08) !== 0) {
			this.readNoteEffects(track, voice, beat, newNote);
		}

		if (bar.staff.isPercussion) {
			newNote.percussionArticulation = newNote.fret;
			newNote.string = -1;
			newNote.fret = -1;
		}
		if (swapAccidentals) {
			const accidental = Tuning.defaultAccidentals[newNote.realValueWithoutHarmonic % 12];
			if (accidental === '#') {
				newNote.accidentalMode = NoteAccidentalMode.ForceFlat;
			} else if (accidental === 'b') {
				newNote.accidentalMode = NoteAccidentalMode.ForceSharp;
			}
			// Note: forcing no sign to sharp not supported
		}
		return newNote;
	}

	public toDynamicValue(value: number): DynamicValue {
		switch (value) {
			case 1:
				return DynamicValue.PPP;
			case 2:
				return DynamicValue.PP;
			case 3:
				return DynamicValue.P;
			case 4:
				return DynamicValue.MP;
			case 5:
				return DynamicValue.MF;
			case 6:
				return DynamicValue.F;
			case 7:
				return DynamicValue.FF;
			case 8:
				return DynamicValue.FFF;
			default:
				return DynamicValue.F;
		}
	}

	public readNoteEffects(track: Track, voice: Voice, beat: Beat, note: Note): void {
		let flags: number = this.data.readByte();
		let flags2: number = 0;
		if (this._versionNumber >= 400) {
			flags2 = this.data.readByte();
		}
		if ((flags & 0x01) !== 0) {
			this.readBend(note);
		}
		if ((flags & 0x10) !== 0) {
			this.readGrace(voice, note);
		}
		if ((flags2 & 0x04) !== 0) {
			this.readTremoloPicking(beat);
		}
		if ((flags2 & 0x08) !== 0) {
			this.readSlide(note);
		} else if (this._versionNumber < 400) {
			if ((flags & 0x04) !== 0) {
				note.slideOutType = SlideOutType.Shift;
			}
		}
		if ((flags2 & 0x10) !== 0) {
			this.readArtificialHarmonic(note);
		}
		if ((flags2 & 0x20) !== 0) {
			this.readTrill(note);
		}
		note.isLetRing = (flags & 0x08) !== 0;
		note.isHammerPullOrigin = (flags & 0x02) !== 0;
		if ((flags2 & 0x40) !== 0) {
			note.vibrato = VibratoType.Slight;
		}
		note.isPalmMute = (flags2 & 0x02) !== 0;
		note.isStaccato = (flags2 & 0x01) !== 0;
	}

	private static readonly BendStep: number = 25;

	public readBend(note: Note): void {
		this.data.readByte(); // type

		IOHelper.readInt32LE(this.data); // value

		let pointCount: number = IOHelper.readInt32LE(this.data);
		if (pointCount > 0) {
			for (let i: number = 0; i < pointCount; i++) {
				let point: BendPoint = new BendPoint(0, 0);
				point.offset = IOHelper.readInt32LE(this.data); // 0...60

				point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0; // 0..12 (amount of quarters)

				GpBinaryHelpers.gpReadBool(this.data); // vibrato

				note.addBendPoint(point);
			}
		}
	}

	public readGrace(voice: Voice, note: Note): void {
		let graceBeat: Beat = new Beat();
		let graceNote: Note = new Note();
		graceNote.string = note.string;
		graceNote.fret = IOHelper.readSInt8(this.data);
		graceBeat.duration = Duration.ThirtySecond;
		graceBeat.dynamics = this.toDynamicValue(IOHelper.readSInt8(this.data));
		let transition: number = IOHelper.readSInt8(this.data);
		switch (transition) {
			case 0:
				break;
			case 1:
				graceNote.slideOutType = SlideOutType.Legato;
				graceNote.slideTarget = note;
				break;
			case 2:
				break;
			case 3:
				graceNote.isHammerPullOrigin = true;
				break;
		}
		graceNote.dynamics = graceBeat.dynamics;
		this.data.skip(1); // duration

		if (this._versionNumber < 500) {
			graceBeat.graceType = GraceType.BeforeBeat;
		} else {
			let flags: number = this.data.readByte();
			graceNote.isDead = (flags & 0x01) !== 0;
			graceBeat.graceType = (flags & 0x02) !== 0 ? GraceType.OnBeat : GraceType.BeforeBeat;
		}
		voice.addGraceBeat(graceBeat);
		graceBeat.addNote(graceNote);
	}

	public readTremoloPicking(beat: Beat): void {
		let speed: number = this.data.readByte();
		switch (speed) {
			case 1:
				beat.tremoloSpeed = Duration.Eighth;
				break;
			case 2:
				beat.tremoloSpeed = Duration.Sixteenth;
				break;
			case 3:
				beat.tremoloSpeed = Duration.ThirtySecond;
				break;
		}
	}

	public readSlide(note: Note): void {
		if (this._versionNumber >= 500) {
			let type: number = IOHelper.readSInt8(this.data);
			if ((type & 1) !== 0) {
				note.slideOutType = SlideOutType.Shift;
			} else if ((type & 2) !== 0) {
				note.slideOutType = SlideOutType.Legato;
			} else if ((type & 4) !== 0) {
				note.slideOutType = SlideOutType.OutDown;
			} else if ((type & 8) !== 0) {
				note.slideOutType = SlideOutType.OutUp;
			}
			if ((type & 16) !== 0) {
				note.slideInType = SlideInType.IntoFromBelow;
			} else if ((type & 32) !== 0) {
				note.slideInType = SlideInType.IntoFromAbove;
			}
		} else {
			let type: number = IOHelper.readSInt8(this.data);
			switch (type) {
				case 1:
					note.slideOutType = SlideOutType.Shift;
					break;
				case 2:
					note.slideOutType = SlideOutType.Legato;
					break;
				case 3:
					note.slideOutType = SlideOutType.OutDown;
					break;
				case 4:
					note.slideOutType = SlideOutType.OutUp;
					break;
				case -1:
					note.slideInType = SlideInType.IntoFromBelow;
					break;
				case -2:
					note.slideInType = SlideInType.IntoFromAbove;
					break;
			}
		}
	}

	public readArtificialHarmonic(note: Note): void {
		let type: number = this.data.readByte();
		if (this._versionNumber >= 500) {
			switch (type) {
				case 1:
					note.harmonicType = HarmonicType.Natural;
					note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
					break;
				case 2:
                    /*let _harmonicTone: number = */ this.data.readByte();
                    /*let _harmonicKey: number =  */ this.data.readByte();
                    /*let _harmonicOctaveOffset: number = */ this.data.readByte();
					note.harmonicType = HarmonicType.Artificial;
					break;
				case 3:
					note.harmonicType = HarmonicType.Tap;
					note.harmonicValue = this.deltaFretToHarmonicValue(this.data.readByte());
					break;
				case 4:
					note.harmonicType = HarmonicType.Pinch;
					note.harmonicValue = 12;
					break;
				case 5:
					note.harmonicType = HarmonicType.Semi;
					note.harmonicValue = 12;
					break;
			}
		} else if (this._versionNumber >= 400) {
			switch (type) {
				case 1:
					note.harmonicType = HarmonicType.Natural;
					break;
				case 3:
					note.harmonicType = HarmonicType.Tap;
					break;
				case 4:
					note.harmonicType = HarmonicType.Pinch;
					break;
				case 5:
					note.harmonicType = HarmonicType.Semi;
					break;
				case 15:
					note.harmonicType = HarmonicType.Artificial;
					break;
				case 17:
					note.harmonicType = HarmonicType.Artificial;
					break;
				case 22:
					note.harmonicType = HarmonicType.Artificial;
					break;
			}
		}
	}

	public deltaFretToHarmonicValue(deltaFret: number): number {
		switch (deltaFret) {
			case 2:
				return 2.4;
			case 3:
				return 3.2;
			case 4:
			case 5:
			case 7:
			case 9:
			case 12:
			case 16:
			case 17:
			case 19:
			case 24:
				return deltaFret;
			case 8:
				return 8.2;
			case 10:
				return 9.6;
			case 14:
			case 15:
				return 14.7;
			case 21:
			case 22:
				return 21.7;
			default:
				return 12;
		}
	}

	public readTrill(note: Note): void {
		note.trillValue = this.data.readByte() + note.stringTuning;
		switch (this.data.readByte()) {
			case 1:
				note.trillSpeed = Duration.Sixteenth;
				break;
			case 2:
				note.trillSpeed = Duration.ThirtySecond;
				break;
			case 3:
				note.trillSpeed = Duration.SixtyFourth;
				break;
		}
	}
}

 class GpBinaryHelpers {
	public static gpReadDouble(data: IReadable): number {
		let bytes: Uint8Array = new Uint8Array(8);
		data.read(bytes, 0, bytes.length);

		let array: Float64Array = new Float64Array(bytes.buffer);
		return array[0];
	}

	public static gpReadFloat(data: IReadable): number {
		let bytes: Uint8Array = new Uint8Array(4);
		bytes[3] = data.readByte();
		bytes[2] = data.readByte();
		bytes[2] = data.readByte();
		bytes[1] = data.readByte();

		let array: Float32Array = new Float32Array(bytes.buffer);
		return array[0];
	}
	/*
		public static gpReadColor(data: IReadable, readAlpha: boolean = false): Color {
			let r: number = data.readByte();
			let g: number = data.readByte();
			let b: number = data.readByte();
			let a: number = 255;
			if (readAlpha) {
				a = data.readByte();
			} else {
				data.skip(1);
			}
			return new Color(r, g, b, a);
		}
	*/
	public static gpReadBool(data: IReadable): boolean {
		return data.readByte() !== 0;
	}

	/**
	 * Skips an integer (4byte) and reads a string using
	 * a bytesize
	 */
	public static gpReadStringIntUnused(data: IReadable, encoding: string): string {
		data.skip(4);
		return GpBinaryHelpers.gpReadString(data, data.readByte(), encoding);
	}

	/**
	 * Reads an integer as size, and then the string itself
	 */
	public static gpReadStringInt(data: IReadable, encoding: string): string {
		return GpBinaryHelpers.gpReadString(data, IOHelper.readInt32LE(data), encoding);
	}

	/**
	 * Reads an integer as size, skips a byte and reads the string itself
	 */
	public static gpReadStringIntByte(data: IReadable, encoding: string): string {
		let length: number = IOHelper.readInt32LE(data) - 1;
		data.readByte();
		return GpBinaryHelpers.gpReadString(data, length, encoding);
	}

	public static gpReadString(data: IReadable, length: number, encoding: string): string {
		let b: Uint8Array = new Uint8Array(length);
		data.read(b, 0, b.length);
		return IOHelper.toString(b, encoding);
	}

	public static gpWriteString(data: IWriteable, s: string): void {
		const encoded = IOHelper.stringToBytes(s);
		data.writeByte(s.length);
		data.write(encoded, 0, encoded.length);
	}

	/**
	 * Reads a byte as size and the string itself.
	 * Additionally it is ensured the specified amount of bytes is read.
	 * @param data the data to read from.
	 * @param length the amount of bytes to read
	 * @param encoding The encoding to use to decode the byte into a string
	 * @returns
	 */
	public static gpReadStringByteLength(data: IReadable, length: number, encoding: string): string {
		let stringLength: number = data.readByte();
		let s: string = GpBinaryHelpers.gpReadString(data, stringLength, encoding);
		if (stringLength < length) {
			data.skip(length - stringLength);
		}
		return s;
	}
}

/**
 * A mixtablechange describes several track changes.
 */
class MixTableChange {
	public volume: number = -1;
	public balance: number = -1;
	public instrument: number = -1;
	public tempoName: string = '';
	public tempo: number = -1;
	public duration: number = -1;
}
class GPImporter {
	load(arrayBuffer: ArrayBuffer) {
		let test: Gp3To5Importer = new Gp3To5Importer();
		let data: IReadable;
		
		let  settings: Settings;
		test.init(data,settings);
	}
	convertProject(title: string, comment: string): MZXBX_Project {
		console.log('GPImporter.convertProject', this);
		let project: MZXBX_Project = {
			title: title + ' ' + comment
			, timeline: []
			, tracks: []
			, percussions: []
			, filters: []
			, comments: []
		};
		return project;
	}
}
function newGPparser(arrayBuffer: ArrayBuffer) {
	console.log("newGPparser");
	let pp = new GPImporter();
	pp.load(arrayBuffer);
	return pp;
}
