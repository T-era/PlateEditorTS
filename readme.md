
## plates の設定
* 以下の各値の比は、それぞれ整数になることを期待しています。
  * config.unitWidth : config.editorWidth
  * config.unitWidth : (各plateItem).width
  * config.unitHeight : config.editorHeight
  * config.unitHeight : (各plateItem).height
* 各plateItemの描画内容(コンストラクタの第一引数で指定するコールバック)は、以下の制限を受けます。
  * 自らのwidth, height 内に収まる必要があります。はみ出してしまった場合、消えるべき状況でも描画が残る可能性があります。
    * 特に境界付近で描画を行う場合、描画設定(例えばcontext.lineWidthとか)によっては意図せずはみ出す場合があるので注意してください。

## scroll の設定
 * config.scroll の描画は、スクロールの中身を描画するための clip 領域を作るために使用します。
  * 標準的には、context.rect をすることになるはずですが、自動的には補完しません。
 * スクロール方向にあまりにも小さいと、スクロールバーの表示が壊れます。
  * 現実装では4px 以下だと表示できません。
    * スクロールバー表示のためのlineCapをやめれば、この制約は外せます。
