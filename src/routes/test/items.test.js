const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const expect = chai.expect;

chai.use(chaiAsPromised);

const server = require('../../config/express');
const Item = require('../../models/item.model');

describe('Items Endpoints', function () {
  describe('POST /items', function () {});
  describe('GET /items/:id', function () {});
  describe('GET /items', function () {});
  describe('PUT /items/:id', function () {});
  describe('DELETE /items/:id', function () {});
});
