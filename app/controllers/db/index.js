import Ember from 'ember';
import {MMOMStatement} from 'MMOM';
import 'Numberer';

export default Ember.Controller.extend({
  assertions: function() {
    let out = [], db = this.get('model').database, count = db.numberer.counts[MMOMStatement.AXIOM] + db.numberer.counts[MMOMStatement.PROVABLE]; // TODO should have a maxPink
    for (let i = 1; i <= count; i++) {
      out.push(db.statementByPinkNumber(i));
    }
    return out;
  }.property('model'),
});
