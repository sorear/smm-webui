import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page','page_size','go'],
  page: 1,
  page_size: 20,
  go: null, // TODO: error messaging, scroll-on-nav (fiddly as both 'didTransition' and 'activate' are too early)

  _pageParams: function() {
    let db = this.get('model').database, count = db.assertionCount;

    let page        = this.get('page'),
        page_size   = this.get('page_size'),
        chosen      = this.get('go'),
        chosen_sym  = chosen && db.scoper.lookup(chosen),
        chosen_stmt;

    page = (page === (page | 0) && page > 0) ? page : 1;
    page_size = (page_size === (page_size | 0) && page_size > 0) ? page_size : 1; // TODO better way to validate?

    if (chosen_sym && chosen_sym.labelled && chosen_sym.labelled.isAssertion) {
      chosen_stmt = chosen_sym.labelled;
      // override page
      page = 1 + Math.floor((chosen_stmt.pinkNumber - 1) / page_size);
    }

    return { db: db, count: count, page: page, page_size: page_size, chosen_stmt: chosen_stmt };
  }.property('model','go','page','page_size'), // TODO change tracking (counts)

  activeStatement: Ember.computed('_pageParams', function() { return this.get('_pageParams').chosen_stmt; }),

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

  effectivePage: function(name, value) {
    if (arguments.length > 1) {
      // setting page clears go
      this.setProperties({ page: value, go: null });
    }
    return this.get('_pageParams').page;
  }.property('_pageParams'),
});
