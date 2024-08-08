const { Container } = require('../../lib');
const { commonSandboxTests }  = require('../common/sandbox');

commonSandboxTests(new Container(), true);
