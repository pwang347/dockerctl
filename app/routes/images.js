import Ember from "ember";

export default Ember.Route.extend({
  model() {
    return Ember.$.post("http://localhost:3000/api/v1/listImages");
  }
});
