import Ember from 'ember';
import {MMOMStatement} from 'smm';
const CLICK_CLASS = 'math-string--subexp--clicked';

export default Ember.Component.extend({
  tagName: 'span',
  htmlified: Ember.computed('statement', function () {
    let stmt = this.get('statement');
    if (!stmt.isAssertion && stmt.type !== MMOMStatement.ESSENTIAL) {
      return (stmt.math || []).join(' ');
    }
    let parse = stmt.assertionParseTree;
    if (!parse) {
      return stmt.math.join(' ');
    }

    return Ember.String.htmlSafe(
      Ember.Handlebars.Utils.escapeExpression(stmt.math[0]) + ' ' +
      this._recurse(parse)
    );
  }),

  click(e) {
    if (e.target && Ember.$(e.target).hasClass('math-string--subexp')) {
      Ember.$('.'+CLICK_CLASS).removeClass(CLICK_CLASS);
      Ember.$(e.target).addClass(CLICK_CLASS);
    }
  },

  _recurse(parse) {
    let recipe = parse.syntax_axiom.parsingRule;
    let out = [];
    for (let i = 0; i < recipe.slots.length; i++) {
      let slot = recipe.slots[i];
      out.push(slot.index >= 0 ? this._recurse(parse.children[slot.index]) : Ember.Handlebars.Utils.escapeExpression(slot.lit));
    }
    return '<span class="math-string--subexp">' + out.join(' ') + '</span>';
  },
});
