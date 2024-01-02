class LeftPanel{
    constructor(){

    }
    createLeftPanel(): TileLayerDefinition[] {
        let leftsidebar = (document.getElementById("leftsidebar") as any) as SVGElement;
        let main = { g: leftsidebar, anchors: [], mode: LevelModes.left };
        return [main];
    }
    fillLeftPanel(){

    }
}
