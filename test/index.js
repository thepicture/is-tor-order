const assert = require("node:assert");
const { it } = require("node:test");

const isTorOrder = require("../index");

it("should return true with node:http library headers", () => {
  const expected = true;
  const headers = {
    host: "",
    "user-agent": "",
    accept: "",
    "accept-language": "",
    "accept-encoding": "",
    referer: "",
    "content-type": "",
    "content-length": "",
    origin: "",
    connection: "",
    "upgrade-insecure-requests": "",
  };

  const actual = isTorOrder(headers);

  assert.strictEqual(expected, actual);
});

it("should ignore casing", () => {
  const expected = true;
  const headers = {
    HOST: "",
    "User-Agent": "",
    aCcEpT: "",
    "accept-language": "",
    "accept-encoding": "",
    referer: "",
    "content-type": "",
    "content-length": "",
    origin: "",
    connection: "",
    "upgrade-insecure-requests": "",
  };

  const actual = isTorOrder(headers);

  assert.strictEqual(expected, actual);
});

it("should return false with non-tor order", () => {
  const expected = false;
  const headers = {
    "accept-language": "",
    "user-agent": "",
    "accept-encoding": "",
    host: "",
    accept: "",
  };

  const actual = isTorOrder(headers);

  assert.strictEqual(expected, actual);
});

it("should work with arrays", () => {
  const expected = true;
  const headers = [
    "host",
    "user-agent",
    "accept",
    "accept-language",
    "accept-encoding",
    "referer",
    "content-type",
    "content-length",
    "origin",
    "connection",
    "upgrade-insecure-requests",
  ];

  const actual = isTorOrder(headers);

  assert.strictEqual(expected, actual);
});

it("should work with entries", () => {
  const expected = true;
  const headers = [
    ["host", ""],
    ["user-agent", ""],
    ["accept", ""],
    ["accept-language", ""],
    ["accept-encoding", ""],
    ["referer", ""],
    ["content-type", ""],
    ["content-length", ""],
    ["origin", ""],
    ["connection", ""],
    ["upgrade-insecure-requests", ""],
  ];

  const actual = isTorOrder(headers);

  assert.strictEqual(expected, actual);
});

it("should throw on unknown entries", () => {
  const expected = {
    message: "Input protocol is unknown",
  };
  const headers = [
    ["host", ""],
    ["accept", ""],
    ["accept-language", Object.apply],
    ["user-agent", ""],
    ["accept-encoding", ""],
  ];

  const actual = () => isTorOrder(headers);

  assert.throws(actual, expected);
});

it("should throw on unknown protocol", () => {
  const expected = {
    message: "Input protocol is unknown",
  };
  const headers = [
    "host",
    "accept-language",
    Object.apply,
    "accept",
    "accept-encoding",
  ];

  const actual = () => isTorOrder(headers);

  assert.throws(actual, expected);
});

it("should work with rawHeaders entries", () => {
  const expected = true;
  const headers = [
    "user-agent",
    "this is invalid because there can be only one",
    "Host",
    "127.0.0.1:8000",
    "User-Agent",
    "curl/7.22.0",
    "ACCEPT",
    "*",
    "accept-language",
    "",
    "ACCEPT-lAnGuAgE",
    "en",
    "ACCEPT-encoding",
    "gzip",
    "referer",
    "",
    "content-type",
    "",
    "content-length",
    "",
    "origin",
    "",
    "connection",
    "",
    "upgrade-insecure-requests",
    "",
  ];

  const actual = isTorOrder(headers, { areRawHeaders: true });

  assert.strictEqual(expected, actual);
});

it("should throw on unknown rawHeaders entries", () => {
  const expected = {
    message: "Input protocol is unknown",
  };
  const headers = [
    "user-agent",
    "this is invalid because there can be only one",
    "Host",
    "127.0.0.1:8000",
    "accept-language",
    "",
    Object.apply,
    "curl/7.22.0",
    "ACCEPT",
    "*",
    "ACCEPT-encoding",
    "gzip",
  ];

  const actual = () => isTorOrder(headers, { areRawHeaders: true });

  assert.throws(actual, expected);
});

it("should throw on odd rawHeaders entries", () => {
  const expected = {
    message: "Input protocol is unknown",
  };
  const headers = [
    "user-agent",
    "this is invalid because there can be only one",
    "Host",
    "127.0.0.1:8000",
    "accept-language",
    "",
    "ACCEPT",
    "*",
    "ACCEPT-encoding",
    "gzip",
    "node",
  ];

  const actual = () => isTorOrder(headers, { areRawHeaders: true });

  assert.throws(actual, expected);
});
