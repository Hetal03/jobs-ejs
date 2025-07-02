let chai_obj = null;

const get_chai = async () => {
  if (!chai_obj) {
    const { expect, use } = await import("chai");
    const chaiHttp = await import("chai-http");

    // Apply chai-http plugin to chai only once
    const chai = use(chaiHttp.default);
    chai_obj = {
      expect: expect,
      request: chai.request,
    };
  }
  return chai_obj;
};

module.exports = get_chai;

/*let chai_obj = null;

const get_chai = () => {
  if (!chai_obj) {
    const chai = require("chai");
    const chaiHttp = require("chai-http");

    chai.use(chaiHttp);
    chai_obj = {
      expect: chai.expect,
      request: chai.request,
    };
  }
  return chai_obj;
};

module.exports = get_chai;
*/