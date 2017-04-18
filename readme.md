
* 以下の各値の比は、それぞれ整数になることを期待しています。
  * config.unitWidth : config.editorWidth
  * config.unitWidth : (各plateItem).width
  * config.unitHeight : config.editorHeight
  * config.unitHeight : (各plateItem).height
* 各plateItemの描画内容(コンストラクタの第一引数で指定するコールバック)は、以下の制限を受けます。
  * 自らのwidth, height 内に収まる必要があります。はみ出してしまった場合、消えるべき状況でも描画が残る可能性があります。
    * 特に境界付近で描画を行う場合、描画設定(例えばcontext.lineWidthとか)によっては意図せずはみ出す場合があるので注意してください。
