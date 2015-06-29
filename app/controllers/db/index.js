import Ember from 'ember';
import {MMOMStatement} from 'MMOM';
import 'Numberer';
import 'Scoper';

export default Ember.Controller.extend({
  queryParams: ['page','page_size'],
  page: 1,
  page_size: 20,

  _pageParams: function() {
    let db = this.get('model').database,
        count = db.numberer.counts[MMOMStatement.AXIOM] + db.numberer.counts[MMOMStatement.PROVABLE]; // TODO should have a maxPink

    let page      = this.get('page'),
        page_size = this.get('page_size');

    page = (page === (page | 0) && page > 0) ? page : 1;
    page_size = (page_size === (page_size | 0) && page_size > 0) ? page_size : 1; // TODO better way to validate?

    return { db: db, count: count, page: page, page_size: page_size };
  }.property('model','page','page_size'), // TODO change tracking (counts)

  pageContent: function() {
    let out = [], p = this.get('_pageParams');
    let first = Math.max(1, Math.min(p.count, 1 + (p.page - 1) * p.page_size));
    let last = Math.max(1, Math.min(p.count, p.page * p.page_size));
    p.db.scoper._update(); // TODO REALLY NOT API

    for (let i = first; i <= last; i++) {
      let stmt = p.db.statementByPinkNumber(i);
      let prev = stmt.index > 0 ? p.db.statement(stmt.index - 1) : null; // TODO should be API
      let hyp  = [];
      let frame = p.db.scoper.getFrame(stmt.index); // TODO NOT API
      frame.mand.forEach(m => {
        if (!m.float) hyp.push(p.db.statement(m.stmt).math.join(' '));
      });

      out.push(Ember.Object.create({
        pinkNumber: stmt.pinkNumber,
        math: stmt.math.join(' '),
        hypotheses: hyp,
        commentText: (prev && prev.isComment) ? prev.commentText : 'NO COMMENT PROVIDED',
        statement: stmt,
        label: stmt.label,
      }));
    }
    return out;
  }.property('_pageParams'),

  pageCount: function() {
    let p = this.get('_pageParams');
    return Math.ceil(p.count / p.page_size);
  }.property('_pageParams'),
});
