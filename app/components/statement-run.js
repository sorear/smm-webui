import Ember from 'ember';

export default Ember.Component.extend({
  properties: ['statements', 'highlight'],

  statementsData: Ember.computed('statements', 'highlight', function () {
    let out = [];
    let statements = this.get('statements');
    let highlight = this.get('highlight');

    if (!statements.length) { return []; }
    let db = statements[0].database;
    db.scoper._update(); // TODO REALLY NOT API

    for (let i = 0; i < statements.length; i++) {
      let stmt = statements[i];
      let prev = stmt.prev;
      let hyp  = [];
      let frame = db.scoper.getFrame(stmt.index); // TODO NOT API
      frame.mand.forEach(m => {
        if (!m.float) { hyp.push(db.statement(m.stmt)); }
      });

      out.push(Ember.Object.create({
        pinkNumber: stmt.pinkNumber,
        hypotheses: hyp,
        isChosen: stmt === highlight,
        commentText: (prev && prev.isComment) ? prev.commentText : 'NO COMMENT PROVIDED', // TODO ignore "special comments"
        statement: stmt,
        label: stmt.label,
      }));
    }
    return out;
  }),
});
