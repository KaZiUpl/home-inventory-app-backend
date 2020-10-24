const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const expect = chai.expect;

chai.use(chaiAsPromised);

const server = require('../../config/express');
