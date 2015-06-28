import Ember from 'ember';
import {MMOMStatement} from 'MMOM';
import 'Numberer';

export default Ember.Controller.extend({
  queryParams: ['page','page_size'],
  page: 1,
  page_size: 50,

  _pageParams: function() {
    let db = this.get('model').database,
        count = db.numberer.counts[MMOMStatement.AXIOM] + db.numberer.counts[MMOMStatement.PROVABLE]; // TODO should have a maxPink

    let page      = this.get('page'),
        page_size = this.get('page_size');

    page = (page === (page | 0) && page > 0) ? page : 1;
    page_size = (page_size === (page_size | 0) && page_size > 0) ? page_size : 1; // TODO better way to validate?

    return { db: db, count: count, page: page, page_size: page_size };
  }.property('model','page','page_size'),

  pageContent: function() {
    let out = [], p = this.get('_pageParams');
    let first = Math.max(1, Math.min(p.count, 1 + (p.page - 1) * p.page_size));
    let last = Math.max(1, Math.min(p.count, p.page * p.page_size));

    for (let i = first; i <= last; i++) {
      out.push(p.db.statementByPinkNumber(i));
    }
    return out;
  }.property('_pageParams'),

  pageCount: function() {
    let p = this.get('_pageParams');
    return Math.ceil(p.count / p.page_size);
  }.property('_pageParams'),
});
