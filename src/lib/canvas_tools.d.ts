declare module canvas_tools {
    interface CanvasItem {
        pointer: canvas_tools.Pointer;
        isOn(pos: canvas_tools.Pos): boolean;
    }
    class Pos {
        x: number;
        y: number;
        owner: CanvasItem;
        constructor(x: number, y: number, owner: CanvasItem);
        toString(): string;
    }
    class Pointer {
        cx: number;
        cy: number;
        constructor(cx: number, cy: number);
        at(area: CanvasItem): Pos;
        atTop(): Pos;
    }
    function toPointer(e: MouseEvent, canvas: HTMLCanvasElement): Pointer;
}
declare module canvas_tools {
    function event_chain<T>(f1: (ev: T) => any, f2: (ev: T) => any): (ev: T) => any;
}
declare module canvas_tools {
    class Color {
        r: number;
        g: number;
        b: number;
        constructor(r: number, g: number, b: number);
        lighten(): Color;
        darken(): Color;
        ish(another: Color): Color;
        toString(): string;
    }
    var RED: Color;
    var BLACK: Color;
}
declare module canvas_tools {
    interface Shadow {
        blur: number;
        offsetX: number;
        offsetY: number;
    }
    interface DrawConfig {
        lineWidth?: number;
        lineDash?: number[];
        color?: Color;
        shadow?: Shadow;
    }
    function mergeConfig(a: DrawConfig, b: DrawConfig): DrawConfig;
    function line(context: CanvasRenderingContext2D, from: Pointer, to: Pointer, config?: DrawConfig): void;
    function circle(context: CanvasRenderingContext2D, center: Pointer, r: number, config?: DrawConfig): void;
}
declare module canvas_tools {
    interface Drawing {
        (context: CanvasRenderingContext2D, pointer: Pointer, config?: DrawConfig): any;
    }
}
