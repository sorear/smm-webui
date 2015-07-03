import Ember from 'ember';
import {MMOMStatement} from 'smm';
const CLICK_CLASS = 'math-string--subexp--clicked';

export default Ember.Component.extend({
  tagName: 'span',
  prefs: Ember.inject.service(),
  htmlified: Ember.computed('statement', 'prefs.mathDisplay', function () {
    let stmt = this.get('statement');
    let parse = (stmt.isAssertion || stmt.type === MMOMStatement.ESSENTIAL) ? stmt.assertionParseTree : null;

    if (parse) {
      return Ember.String.htmlSafe(
        Ember.Handlebars.Utils.escapeExpression(stmt.math[0]) + ' ' +
        this._recurse(parse)
      );
    }
    else {
      let str = stmt.math || [];
      return Ember.String.htmlSafe(str.map(sym => this._tokenDef(sym)).join(''));
    }
  }),

  click(e) {
    if (e.target && Ember.$(e.target).hasClass('math-string--subexp')) {
      Ember.$('.'+CLICK_CLASS).removeClass(CLICK_CLASS);
      Ember.$(e.target).addClass(CLICK_CLASS);
    }
  },

  _tokenDef(sym) {
    let db = this.get('statement').database;
    let mode = this.get('prefs.mathDisplay');
    if (mode === 'latexdef' || mode === 'althtmldef' || mode === 'htmldef') {
      let def = db.metadata.tokenDef(mode, sym);
      return Ember.Handlebars.Utils.escapeExpression(def === null ? sym : def);
    }
    else {
      return ' ' + Ember.Handlebars.Utils.escapeExpression(sym) + ' ';
    }
  },

  _recurse(parse) {
    let recipe = parse.syntax_axiom.parsingRule;
    let out = [];
    for (let i = 0; i < recipe.slots.length; i++) {
      let slot = recipe.slots[i];
      out.push(slot.index >= 0 ? this._recurse(parse.children[slot.index]) : this._tokenDef(slot.lit));
    }
    return '<span class="math-string--subexp">' + out.join(' ') + '</span>';
  },
});
