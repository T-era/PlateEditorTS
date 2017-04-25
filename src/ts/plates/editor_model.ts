/// <reference path='../../lib/tools.d.ts'/>

module plates {
  export interface LogicalPos {
    lx: number,
    ly: number
  }
  export interface PlateItemAt {
    item :PlateItem;
    at :LogicalPos;
  }
  interface UnitSize {
    unitWidth: number;
    unitHeight: number;
  }

  export interface EditorModel {
    maxX :number;
    maxY :number;
    getDuplicated(item :PlateItem, lPos :LogicalPos) :PlateItemAt[];

    put(item :PlateItem, lPos :LogicalPos);
    list() :PlateItemAt[][];
    dropAt(lPos :LogicalPos, replace ?:PlateItem) :PlateItemAt;
  }
  export function newEditorModel(config :Config) :EditorModel {
    return new _EditorModel(config);
  }

  class _EditorModel implements EditorModel {
    listContents :PlateItemAt[][] = [];
    maxX :number;
    maxY :number;
    config :Config;

    constructor(config :Config) {
      this.config = config;
      var unitMax = this._toUnitSize(config.editorSize, Math.floor);
      this.maxX = unitMax.unitWidth;
      this.maxY = unitMax.unitHeight;
    }

    getDuplicated(item :PlateItem, lPos :LogicalPos) :PlateItemAt[] {
      var dup = this._getAround(lPos, item);

      return dup;
    }

    put(item :PlateItem, lPos :LogicalPos) {
      var itemAt = {
        item: item,
        at: lPos
      };
      var unitSize = this._toUnitSize(item.size, Math.ceil);
      for (var i = 0; i < unitSize.unitHeight; i ++) {
        for (var j = 0; j < unitSize.unitWidth; j ++) {
          this._put({ lx: j + lPos.lx, ly: i + lPos.ly }, itemAt);
        }
      }
    }

    list() :PlateItemAt[][] {
      return this.listContents;
    }

    dropAt(lPos :LogicalPos, replace? :PlateItem) :PlateItemAt {
      var target :PlateItemAt;
      if (replace != null) {
        var dup = this._getAround(lPos, replace);
        if (dup.length === 1) {
          target = dup[0];
        } else {
          return null;
        }
      } else {
        target = this._get(lPos);
      }
      if (target != null) {
        var item = target.item;
        var at = target.at;
        var itemSize = this._toUnitSize(item.size, Math.ceil);
        for (var cellY = at.ly; cellY < at.ly + itemSize.unitHeight; cellY ++) {
          for (var cellX = at.lx; cellX < at.lx + itemSize.unitWidth; cellX ++) {
            this._put({ lx: cellX, ly: cellY }, null);
          }
        }
        return target;
      }
    }

    _toUnitSize(size :tools.Size, round ?:(number) => number) :UnitSize {
      var rawW = size.width / this.config.unitSize.width;
      var rawH = size.height / this.config.unitSize.height;
      return {
        unitWidth: round ? round(rawW) : rawW,
        unitHeight: round ? round(rawH) : rawH };
    }
    _put(lPos :LogicalPos, itemAt :PlateItemAt) {
      if (! this.listContents[lPos.ly]) {
        this.listContents[lPos.ly] = [];
      }
      this.listContents[lPos.ly][lPos.lx] = itemAt;
    }
    _get(lPos :LogicalPos) :PlateItemAt {
      if (0 <= lPos.ly && lPos.ly < this.listContents.length) {
        var list = this.listContents[lPos.ly];
        if (list && 0 <= lPos.lx && lPos.lx < list.length) {
          return list[lPos.lx];
        }
      }
      return null;
    }
    _getAround(lPos :LogicalPos, item :PlateItem) :PlateItemAt[] {
      var unitSize = this._toUnitSize(item.size);
      var dup :PlateItemAt[] = [];
      for (var iiY = 0; iiY < unitSize.unitHeight; iiY ++) {
        for (var iiX = 0; iiX < unitSize.unitWidth; iiX ++) {
          var itemAt = this._get({ lx: lPos.lx + iiX, ly: lPos.ly + iiY });
          if (itemAt != null && dup.indexOf(itemAt) < 0) {
            dup.push(itemAt);
          }
        }
      }
      return dup;
    }
  }
}
