import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page','page_size','go','node'],
  page: 1,
  page_size: 20,
  go: '', // TODO: error messaging, scroll-on-nav (fiddly as both 'didTransition' and 'activate' are too early)
  node: '',

  _pageParams: function() {
    let db = this.get('model').database, count = db.assertionCount;

    let page        = this.get('page'),
        page_size   = this.get('page_size'),
        chosen      = this.get('go'),
        chosen_slug = this.get('node'),
        chosen_sym  = chosen && db.scoper.lookup(chosen),
        chosen_stmt;

    page = (page === (page | 0) && page > 0) ? page : 1;
    page_size = (page_size === (page_size | 0) && page_size > 0) ? page_size : 1; // TODO better way to validate?

    if (chosen_sym && chosen_sym.labelled && chosen_sym.labelled.isAssertion) {
      chosen_stmt = chosen_sym.labelled;
      // override page
      page = 1 + Math.floor((chosen_stmt.pinkNumber - 1) / page_size);
    }

    let chosen_node = chosen_slug && db.outlineNodes.filter(n => n.slug === chosen_slug)[0];
    if (chosen_node) {
      let owning_stmt = chosen_node.statement;
      while (owning_stmt && !owning_stmt.isAssertion) {
        owning_stmt = owning_stmt.next;
      }
      if (!owning_stmt) {
        owning_stmt = db.assertionCount > 0 ? db.statementByPinkNumber(db.assertionCount) : null;
      }
      page = owning_stmt ? 1 + Math.floor((owning_stmt.pinkNumber - 1) / page_size) : 1;
      chosen_stmt = null;
    }

    return { db: db, count: count, page: page, page_size: page_size, chosen_stmt: chosen_stmt, chosen_node: chosen_node };
  }.property('model','go','page','page_size','node'), // TODO change tracking (counts)

  activeStatement: Ember.computed('_pageParams', function() { return this.get('_pageParams').chosen_stmt; }),

  pageContent: function() {
    let out = [], p = this.get('_pageParams');
    let first = Math.max(1, Math.min(p.count, 1 + (p.page - 1) * p.page_size));
    let last = Math.max(1, Math.min(p.count, p.page * p.page_size));
    let run = [];

    for (let i = first; i <= last; i++) {
      let stmt = p.db.statementByPinkNumber(i);
      let prev_asn_index = i === 1 ? -1 : p.db.statementByPinkNumber(i-1).index;

      let headers_skipped = [];
      for (let node = stmt.outlineNode;
          node && !node.path.filter(n => n.ordinal === 0).length && node.statement.index > prev_asn_index;
          node = node.statement.prev && node.statement.prev.outlineNode) {
        headers_skipped.push(node);
      }

      if (headers_skipped.length) {
        if (run.length) {
          out.push({ statements: run });
          run = [];
        }
        while (headers_skipped.length) {
          let hdr = headers_skipped.pop();
          out.push({ outlineNode: hdr, chosen: hdr === p.chosen_node });
        }
      }
      else if (i === first) {
        // find the last (real) header.  May have to go back a way
        let node = stmt.outlineNode;
        while (node && node.path.filter(n => n.ordinal === 0).length) {
          node = node.statement.prev && node.statement.prev.outlineNode;
        }
        if (node) {
          out.push({ outlineNode: node, continued: true });
        }
      }

      run.push(stmt);
    }
    if (run.length) {
      out.push({ statements: run });
      run = [];
    }
    return out;
  }.property('_pageParams'),

  pageCount: function() {
    let p = this.get('_pageParams');
    return Math.ceil(p.count / p.page_size);
  }.property('_pageParams'),

  effectivePage: Ember.computed('_pageParams', {
    get() { return this.get('_pageParams').page; },
    set(name, value) {
      this.setProperties({ page: value, node: '', go: '' });
      return value;
    }
  }),
});
