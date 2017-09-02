import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("images");
  this.route("containers");
  this.route("orchestrations");
  this.route("builds");
  this.route('home');
});

export default Router;
