import Ember from 'ember';
import {MMOMStatement} from 'smm';
const CLICK_CLASS = 'math-string--subexp--clicked';
export default Ember.Component.extend({
  tagName: 'span',
  prefs: Ember.inject.service(),
  htmlified: Ember.computed('statement', 'prefs.mathDisplay', function () {
    let stmt = this.get('statement');
    let parse = (stmt.isAssertion || stmt.type === MMOMStatement.ESSENTIAL) ? stmt.assertionParseTree : null;
    let mode = this.get('prefs.mathDisplay');
    let blob;

    if (parse) {
      blob = DOMPurify.sanitize(this._tokenDef(stmt.math[0]) + this._recurse(parse), this.get('DOMPurifyConfig'));
    }
    else {
      blob = (stmt.math || []).map(sym => this._tokenDef(sym)).join('');
    }

    if (mode !== 'htmldef' && mode !== 'althtmldef') blob = `<code>${blob}</code>`;
    return Ember.String.htmlSafe(blob);
  }),

  click(e) {
    let tgt = e.target && Ember.$(e.target).closest('.math-string--subexp');
    if (tgt) {
      Ember.$('.'+CLICK_CLASS).removeClass(CLICK_CLASS);
      tgt.addClass(CLICK_CLASS);
    }
  },

  _tokenDef(sym) {
    let db = this.get('statement').database;
    let mode = this.get('prefs.mathDisplay');
    if (mode === 'althtmldef' || mode === 'htmldef') {
      let def = db.metadata.tokenDef(mode, sym);
      return def !== null ? def : Ember.Handlebars.Utils.escapeExpression(sym);
    }
    else if (mode === 'latexdef') {
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

  DOMPurifyConfig: {
    ALLOWED_TAGS: ['u','i','b','img','sub','sup','span','small','font'],
    ALLOWED_ATTR: ['alt','title','src','align','width','height','color','size','style','class'],
    ALLOW_DATA_ATTR: false,
  },
});
