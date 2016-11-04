(function() {
  window._app.prototype.renderLegalArea = function(type, cbs) {
    var rendered;
    if (type == null) {
      type = 'tou';
    }
    if (cbs == null) {
      cbs = {};
    }
    switch (type) {
      case 'tou':
        Mustache.parse(this.templates.legal_tou);
        rendered = Mustache.render(this.templates.legal_tou, {});
        break;
      case 'pp':
        Mustache.parse(this.templates.legal_pp);
        rendered = Mustache.render(this.templates.legal_pp, {});
        break;
      case 'disclaimer':
        Mustache.parse(this.templates.legal_disclaimer);
        rendered = Mustache.render(this.templates.legal_disclaimer, {});
        break;
      case 'cp':
        Mustache.parse(this.templates.legal_cp);
        rendered = Mustache.render(this.templates.legal_cp, {});
    }
    this.layout.$legalArea.append(rendered);
    if (typeof cbs.rendered === 'function') {
      return cbs.rendered();
    }
  };

}).call(this);
