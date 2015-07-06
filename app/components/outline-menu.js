import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ol',
  classNames: ['outline-menu--list'],
  outlineNodes: null,
  depthLimit: 99,
  dbwrap: null,

  children: Ember.computed('depthLimit', 'outlineNodes', function() {
    let reduced = this.get('depthLimit') - 1;
    if (reduced < 0) { return []; }

    return this.get('outlineNodes').map(ch =>
      Ember.Object.create({
        node: ch, depthLimit: reduced, children: (reduced && ch.children.length) ? ch.children : null,
        slug: ch.slug, title: ch.title, indices: ch.path.map(x => x.ordinal).join('.'),
      }));
  }),
});
