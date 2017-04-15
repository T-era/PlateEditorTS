/// <reference path="canvas_tools.d.ts" />
/// <reference path="hover.d.ts" />
declare module plates {
    interface Config {
        iconHeight: number;
        plateWidth: number;
        unitHeight: number;
        selections: PlateItem[];
        editors: EditorConfig[];
    }
    interface EditorConfig {
        drawIcon: canvas_tools.Drawing;
        themeCol: canvas_tools.Color;
    }
    class PlateItem implements canvas_tools.CanvasItem {
        drawPath: canvas_tools.Drawing;
        height: number;
        config: Config;
        pointer: canvas_tools.Pointer;
        drawConfig: canvas_tools.DrawConfig;
        constructor(drawPath: canvas_tools.Drawing, config: Config, pointer: canvas_tools.Pointer, height: number, drawConfig?: canvas_tools.DrawConfig);
        draw(context: CanvasRenderingContext2D, at: canvas_tools.Pointer, drawConfig?: canvas_tools.DrawConfig): void;
        isOn(pos: canvas_tools.Pos): boolean;
    }
}
declare module plates {
    interface PlateItemAt {
        item: PlateItem;
        at: number;
    }
    interface EditorModel {
        canAdd(item: PlateItem, y: number): OverwriteStatus;
        put(item: PlateItem, y: number): any;
        list(): PlateItem[];
        dropAt(y: number): PlateItemAt;
    }
    function newEditorModel(config: Config, maxY: number): EditorModel;
    enum OverwriteStatus {
        Empty = 0,
        Locked = 1,
        Replace = 2,
    }
}
declare module plates {
    interface Editor extends canvas_tools.CanvasItem {
        model: EditorModel;
        tryAdd(item: PlateItem, pos: canvas_tools.Pos): any;
        tryRmv(pos: canvas_tools.Pos): PlateItem;
        draw(): any;
        isOn(pos: canvas_tools.Pos): boolean;
    }
    function newEditor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, config: Config, index: number, editor: EditorConfig, getOnMouse: () => PlateItem): Editor;
}
declare module plates {
    class Pallet implements canvas_tools.CanvasItem {
        pointer: canvas_tools.Pointer;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        config: Config;
        selections: PlateItem[];
        constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, config: Config, pointer: canvas_tools.Pointer);
        getSelection(pointer: canvas_tools.Pointer): PlateItem;
        isOn(pos: canvas_tools.Pos): boolean;
        drawItems(): void;
    }
}
declare module plates {
    class PlateEditor {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        hover: hover.Hover;
        editors: Editor[];
        config: Config;
        onMouse: PlateItem;
        pallet: Pallet;
        constructor(canvas: HTMLCanvasElement, config: Config);
        holdOnMouse(pointer: canvas_tools.Pointer): PlateItem;
        put(pointer: canvas_tools.Pointer, item: PlateItem): void;
    }
}
