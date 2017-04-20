module scroll {
  var LOWER_LIMIT = 0.01;
  export interface Speed {
    dx :number;
    dy :number;
  }

  export function slowDown(config :ScrollConfig, arg :Speed) :Speed {
    return {
      dx: arg.dx * config.viscosity,
      dy: arg.dy * config.viscosity
    };
  }
  export function move(owner :Scroll, pointer :tools.Pointer, speed :Speed) :tools.Pointer {
    var pos = pointer.at(owner);
    var x = Math.max(Math.min(pos.x + speed.dx, 0), owner.limitX);
    var y = Math.max(Math.min(pos.y + speed.dy, 0), owner.limitY);
    var pos = new tools.Pos(x, y, owner);
    return pos.pointer();
  }
  export function stopped(speed :Speed) :boolean {
    return (Math.abs(speed.dx) < LOWER_LIMIT
        && Math.abs(speed.dy) < LOWER_LIMIT);
  }
}
