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
  export interface EditorModel {
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
      this.maxX = Math.floor(config.editorWidth / config.unitWidth);
      this.maxY = Math.floor(config.editorHeight / config.unitHeight);
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
      var unitWidht = Math.ceil(item.size.width / this.config.unitWidth);
      var unitHeight = Math.ceil(item.size.height / this.config.unitHeight);
      for (var i = 0; i < unitHeight; i ++) {
        for (var j = 0; j < unitWidht; j ++) {
          this._put({ lx: j + lPos.lx, ly: i + lPos.ly }, itemAt);
        }
      }
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
      var unitW = item.size.width / this.config.unitWidth;
      var unitH = item.size.height / this.config.unitHeight;
      var dup :PlateItemAt[] = [];
      for (var iiY = 0; iiY < unitH; iiY ++) {
        for (var iiX = 0; iiX < unitW; iiX ++) {
          var itemAt = this._get({ lx: lPos.lx + iiX, ly: lPos.ly + iiY });
          if (itemAt != null && dup.indexOf(itemAt) < 0) {
            dup.push(itemAt);
          }
        }
      }
      return dup;
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
        target = this.listContents[lPos.ly][lPos.lx]
      }
      if (target != null) {
        var item = target.item;
        var at = target.at;
        var itemW = Math.ceil(item.size.width / this.config.unitWidth);
        var itemH = Math.ceil(item.size.height / this.config.unitHeight);
        for (var cellY = at.ly; cellY < at.ly + itemH; cellY ++) {
          for (var cellX = at.lx; cellX < at.lx + itemW; cellX ++) {
            this._put({ lx: cellX, ly: cellY }, null);
          }
        }
        return target;
      }
    }
  }
}
