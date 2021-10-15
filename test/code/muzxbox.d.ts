declare class MuzXBox {
    zInputDeviceHandler: ZInputDeviceHandler;
    constructor();
    initAll(): void;
}
declare class ZInputDeviceHandler {
    constructor();
    processKeyboardEvent(keyboardEvent: KeyboardEvent): void;
    processKeyX(): void;
    processKeyY(): void;
    processKeyA(): void;
    processKeyB(): void;
    processAnyPlus(): void;
    processAnyMinus(): void;
    processArrowLeft(): void;
    processArrowRight(): void;
    processArrowUp(): void;
    processArrowDown(): void;
}
