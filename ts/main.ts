console.log('MuzXBox v1.01');
let firstAnchor: TileAnchor;
let menuAnchor: TileAnchor;
let tileLevel: TileLevel;
class MuzXBox{
	zInputDeviceHandler:ZInputDeviceHandler;
	constructor() {
		console.log('start');
	}
	initAll() {
		console.log('initAll');
		let me=this;
		this.zInputDeviceHandler=new ZInputDeviceHandler();
		this.createUI();
	}
	createUI(){
		let layers: TileLayerDefinition[] = [];
		let backgroundLayerGroup: SVGElement = (document.getElementById('backgroundLayerGroup') as any) as SVGElement;
		let minZoom: number = 1;
		let maxZoom: number = 100;
		firstAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
		menuAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
		layers.push({ g: backgroundLayerGroup, anchors: [firstAnchor] });
		layers.push({ g: backgroundLayerGroup, anchors: [menuAnchor] });
		tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
			, 1000, 1000
			, minZoom, minZoom, maxZoom
			, layers);
		let txt: TileText = { x: 1, y: 8, css: 'fontSize8' + ' fillColorContent', text: 'Text label' };
		firstAnchor.content.push(txt);
		let backRectangle: TileRectangle = {
			x: 0
			, y: 0
			, w: 1000
			, h: 1000
			, rx: 11
			, ry: 11
			, css: 'debug'
		};
		firstAnchor.content.push(backRectangle);
		let menuButton: TileRectangle = {
			x: 0
			, y: 0
			, w: 10
			, h: 10
			, rx: 3
			, ry: 3
			, css: 'debug'
			, action: this.openMenu
		};
		firstAnchor.content.push(menuButton);
		menuAnchor.content.push({ x: 9 , y: 10 , w: 16 , h: 11 , rx: 1 , ry: 1 , css: 'debug' , action: (x:number,y:number)=>{console.log(x,y);}, dragY:true });
		menuAnchor.content.push({ x: 10 , y: 11 , w: 4 , h: 4 , rx: 1 , ry: 1 , css: 'debug' , action: ()=>{this.testChooser(10,11);} });
		menuAnchor.content.push({ x: 10 , y: 16 , w: 4 , h: 4 , rx: 1 , ry: 1 , css: 'debug' , action: ()=>{this.testChooser(10,16);} });
		menuAnchor.content.push({ x: 15 , y: 11 , w: 4 , h: 4 , rx: 1 , ry: 1 , css: 'debug' , action: ()=>{this.testChooser(15,11);} });
		menuAnchor.content.push({ x: 15 , y: 16 , w: 4 , h: 4 , rx: 1 , ry: 1 , css: 'debug' , action: ()=>{this.testChooser(15,16);} });
		menuAnchor.content.push({ x: 20 , y: 11 , w: 4 , h: 4 , rx: 1 , ry: 1 , css: 'debug' , action: ()=>{this.testChooser(20,11);} });
		menuAnchor.content.push({ x: 20 , y: 16 , w: 4 , h: 4 , rx: 1 , ry: 1 , css: 'debug' , action: ()=>{this.testChooser(20,16);} });
	}
	testChooser(xx:number,yy){
		console.log('testChooser',xx,yy);
	}
	openMenu() {
		//console.log('openMenu');
		(document.getElementById('menuContentDiv') as any).style.visibility = 'visible';
		(document.getElementById('menuDiv1') as any).style.width = '100%';
	}
	closeMenu() {
		//console.log('closeMenu');
		(document.getElementById('menuDiv1') as any).style.width = '0%';
	}
}
window['MuzXBox'] = new MuzXBox();
