module plates {
  export interface LogicalPos {
    lx: number,
    ly: number
  }
  export interface LogicalSize {
    lWidth: number;
    lHeight: number;
  }

  function noRound(x :number) :number {
    return x;
  }
  export function toLogicalPos(config :Config, pos :tools.Pos, round ?:(number) => number) :LogicalPos {
    var rawX = pos.x / config.unitSize.width;
    var rawY = pos.y / config.unitSize.height;
    round = round || noRound;
    return { lx: round(rawX), ly: round(rawY) };
  }
  export function toLogicalSize(config :Config, size :tools.Size, round ?:(number) => number) :LogicalSize {
    var rawW = size.width / config.unitSize.width;
    var rawH = size.height / config.unitSize.height;
    round = round || noRound;
    return { lWidth: round(rawW), lHeight: round(rawH) };
  }

  export function fromLogicalPos(config :Config, lPos :LogicalPos, owner :tools.CanvasItem) :tools.Pos {
    var left = lPos.lx * config.unitSize.width;
    var top = lPos.ly * config.unitSize.height;
    return new tools.Pos(left, top, owner);
  }
}
