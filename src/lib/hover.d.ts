/// <reference path="canvas_tools.d.ts" />
declare module hover {
    interface Hover {
        setHoverImage(drawImg: canvas_tools.Drawing): any;
        setHover(hovering: boolean): any;
        save(): any;
        update<T>(f: () => T): T;
    }
    function newHover(canvas: HTMLCanvasElement): Hover;
}
