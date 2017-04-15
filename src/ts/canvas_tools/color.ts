module canvas_tools {
  export class Color {
    r :number;
    g :number;
    b :number;
    constructor(r :number, g :number, b :number) {
      this.r = r;
      this.g = g;
      this.b = b;
    }
    lighten() :Color {
      return new Color(
        Math.ceil(255 - (255 - this.r) / 4),
        Math.ceil(255 - (255 - this.g) / 4),
        Math.ceil(255 - (255 - this.b) / 4));
    }
    darken() :Color {
      return new Color(
        Math.ceil(this.r / 2),
        Math.ceil(this.g / 2),
        Math.ceil(this.b / 2));
    }
    ish(another :Color) :Color {
      return new Color(
        Math.ceil((this.r + another.r) / 2),
        Math.ceil((this.g + another.g) / 2),
        Math.ceil((this.b + another.b) / 2));
    }
    toString() :string {
      return '#' + chars(this.r) + chars(this.g) + chars(this.b);

      function chars(c) {
        return ('0' + c.toString(16)).slice(-2);
      }
    }
  }
  export var RED :Color = new Color(255, 0, 0);
  export var BLACK :Color = new Color(0, 0, 0);
}
