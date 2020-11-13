const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

const expect = chai.expect;

const ItemsService = require('../items.service');
const Item = require('../../models/item.model');

describe('Items Service', function () {
  describe('Create an item', function () {});
  describe('Get item', function () {});
  describe('Get items list', function () {});
  describe('Update item info', function () {});
  describe('Delete an item', function () {});
});
