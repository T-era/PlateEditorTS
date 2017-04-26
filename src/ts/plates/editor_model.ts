/// <reference path='../../lib/tools.d.ts'/>
/// <reference path='logical_pos.ts'/>

module plates {
  export interface PlateItemAt {
    item :PlateItem;
    at :LogicalPos;
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
      var logicalMax = toLogicalSize(this.config, config.editorSize, Math.floor);
      this.maxX = logicalMax.lWidth;
      this.maxY = logicalMax.lHeight;
    }

    getDuplicated(item :PlateItem, lPos :LogicalPos) :PlateItemAt[] {
      return this._getAround(lPos, item);
    }

    put(item :PlateItem, lPos :LogicalPos) {
      var itemAt = { item: item, at: lPos };
      var logicalSize = toLogicalSize(this.config, item.size, Math.ceil);

      _forEachUnit(logicalSize, function(dx :number, dy :number) {
        this._put(_shiftLogicalPos(lPos, dx, dy), itemAt);
      }.bind(this));
    }

    list() :PlateItemAt[][] {
      return this.listContents;
    }

    dropAt(lPos :LogicalPos, replace? :PlateItem) :PlateItemAt {
      var target :PlateItemAt = (function(that) {
        if (replace) {
          var dup = that._getAround(lPos, replace);
          if (dup.length === 1) {
            return dup[0];
          } else {
            return null;
          }
        } else {
          return that._get(lPos);
        }
      })(this);

      if (target != null) {
        var item = target.item;
        var itemSize = toLogicalSize(this.config, item.size, Math.ceil);
        _forEachUnit(itemSize, function(dx :number, dy :number) {
          this._put(_shiftLogicalPos(target.at, dx, dy), null);
        }.bind(this));
        return target;
      }
      return null;
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
      var logicalSize = toLogicalSize(this.config, item.size);
      var dup :PlateItemAt[] = [];
      _forEachUnit(logicalSize, function(dx :number, dy :number) {
        var itemAt = this._get(_shiftLogicalPos(lPos, dx, dy));
        if (itemAt != null && dup.indexOf(itemAt) < 0) {
          dup.push(itemAt);
        }
      }.bind(this));

      return dup;
    }
  }

  function _forEachUnit(logicalSize :LogicalSize, f:(dx :number, dy :number) => void) :void {
    for (var dy= 0; dy < logicalSize.lHeight; dy ++) {
      for (var dx = 0; dx < logicalSize.lWidth; dx ++) {
        f(dx, dy);
      }
    }
  }

  function _shiftLogicalPos(lPos :LogicalPos, dx :number, dy :number) :LogicalPos {
    return { lx: lPos.lx + dx, ly: lPos.ly + dy };
  }
}
