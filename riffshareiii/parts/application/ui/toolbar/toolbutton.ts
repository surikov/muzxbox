class ToolBarButton {
  
    stick: number;
    position: number;
 
    iconLabelButton: IconLabelButton;
    constructor(labels: string[], stick: number, position: number, action: (nn: number) => void) {
        this.iconLabelButton = new IconLabelButton(labels, 'toolBarButtonCircle', 'toolBarButtonLabel', action);
        
        this.stick = stick;
        this.position = position;
        
    }
    resize(viewWIdth: number, viewHeight: number) {
        let x0 = viewWIdth / 2 - 0.5 + this.position;
        if (this.stick > 0) {
            x0 = viewWIdth - 1 - this.position;
        } else {
            if (this.stick < 0) {
                x0 = 0 + this.position;
            }
        }
        
        this.iconLabelButton.resize(x0, viewHeight - 1, 1);
    }
   
}

