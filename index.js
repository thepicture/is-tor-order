module.exports = (headers, { areRawHeaders } = { areRawHeaders: false }) => {
  let indexOfAccept,
    indexOfHost,
    indexOfUserAgent,
    indexOfAcceptLanguage,
    indexOfAcceptEncoding,
    indexOfConnection,
    indexOfDnt,
    indexOfContentLength,
    indexOfContentType,
    indexOfOrigin,
    indexOfReferer,
    indexOfUpgradeInsecureRequests;

  let keys;

  let isUnknownInputProtocol = true;

  const isNodeHttpLibrary =
    typeof headers === "object" && !Array.isArray(headers);
  Object.values(headers).every((value) => typeof value === "string");

  const isArrayOfHeaderKeys =
    Array.isArray(headers) &&
    headers.every((value) => typeof value === "string");

  const isInputOfEntries =
    Array.isArray(headers) &&
    headers.every(
      (entry) =>
        entry.length === 2 && entry.every((value) => typeof value === "string")
    );

  if (isNodeHttpLibrary) {
    isUnknownInputProtocol = false;

    keys = Object.keys(headers).map((key) => key.toLowerCase());
  } else if (isArrayOfHeaderKeys && !areRawHeaders) {
    isUnknownInputProtocol = false;

    keys = headers.map((value) => value.toLowerCase());
  } else if (isInputOfEntries) {
    isUnknownInputProtocol = false;

    keys = Object.keys(Object.fromEntries(headers)).map((value) =>
      value.toLowerCase()
    );
  } else if (areRawHeaders) {
    if (headers.some((value) => typeof value !== "string")) {
      throwUnknownInputProtocolError();
    }

    if (headers.length % 2) {
      throwUnknownInputProtocolError();
    }

    isUnknownInputProtocol = false;

    let headerSet = {};

    for (const key of headers
      .filter((_, index) => !(index % 2))
      .map((value) => value.toLowerCase())) {
      delete headerSet[key];
      headerSet[key] = "";
    }

    keys = Object.keys(headerSet).map((value) => value.toLowerCase());
  }

  if (isUnknownInputProtocol) {
    throwUnknownInputProtocolError();
  }

  if (keys.indexOf("accept") !== -1) {
    indexOfAccept = keys.indexOf("accept");
  }

  if (keys.indexOf("host") !== -1) {
    indexOfHost = keys.indexOf("host");
  }

  if (keys.indexOf("user-agent") !== -1) {
    indexOfUserAgent = keys.indexOf("user-agent");
  }

  if (keys.indexOf("accept-language") !== -1) {
    indexOfAcceptLanguage = keys.indexOf("accept-language");
  }

  if (keys.indexOf("accept-encoding") !== -1) {
    indexOfAcceptEncoding = keys.indexOf("accept-encoding");
  }

  if (keys.indexOf("connection") !== -1) {
    indexOfConnection = keys.indexOf("connection");
  }

  if (keys.indexOf("dnt") !== -1) {
    indexOfDnt = keys.indexOf("dnt");
  }

  if (keys.indexOf("content-length") !== -1) {
    indexOfContentLength = keys.indexOf("content-length");
  }

  if (keys.indexOf("content-type") !== -1) {
    indexOfContentType = keys.indexOf("content-type");
  }

  if (keys.indexOf("origin") !== -1) {
    indexOfOrigin = keys.indexOf("origin");
  }

  if (keys.indexOf("referer") !== -1) {
    indexOfReferer = keys.indexOf("referer");
  }

  if (keys.indexOf("upgrade-insecure-requests") !== -1) {
    indexOfUpgradeInsecureRequests = keys.indexOf("upgrade-insecure-requests");
  }

  const isLinuxTor =
    (indexOfHost < indexOfUserAgent &&
      indexOfUserAgent < indexOfAccept &&
      indexOfAccept < indexOfAcceptLanguage &&
      indexOfAcceptLanguage < indexOfAcceptEncoding &&
      indexOfAcceptEncoding < indexOfReferer &&
      indexOfReferer < indexOfContentType &&
      indexOfContentType < indexOfOrigin &&
      indexOfOrigin < indexOfContentLength &&
      indexOfContentLength < indexOfConnection &&
      !indexOfDnt) ||
    (indexOfHost < indexOfUserAgent &&
      indexOfUserAgent < indexOfAccept &&
      indexOfAccept < indexOfAcceptLanguage &&
      indexOfAcceptLanguage < indexOfAcceptEncoding &&
      indexOfAcceptEncoding < indexOfReferer &&
      indexOfReferer < indexOfContentType &&
      indexOfContentType < indexOfContentLength &&
      indexOfContentLength < indexOfOrigin &&
      indexOfOrigin < indexOfConnection &&
      indexOfConnection < indexOfUpgradeInsecureRequests &&
      !indexOfDnt);

  const isSafariTor =
    (indexOfHost < indexOfConnection &&
      indexOfConnection < indexOfAccept &&
      indexOfAccept < indexOfUserAgent &&
      indexOfUserAgent < indexOfAcceptEncoding &&
      indexOfAcceptEncoding < indexOfAcceptLanguage) ||
    (indexOfHost < indexOfAccept &&
      indexOfAccept < indexOfUserAgent &&
      indexOfUserAgent < indexOfAcceptLanguage &&
      indexOfAcceptLanguage < indexOfAcceptEncoding &&
      indexOfAcceptEncoding < indexOfConnection) ||
    (indexOfHost < indexOfDnt &&
      indexOfDnt < indexOfAccept &&
      indexOfAccept < indexOfUserAgent &&
      indexOfUserAgent < indexOfAcceptLanguage &&
      indexOfAcceptLanguage < indexOfAcceptEncoding &&
      indexOfAcceptEncoding < indexOfConnection);

  return !!(isLinuxTor || isSafariTor);
};

const throwUnknownInputProtocolError = () => {
  throw new Error("Input protocol is unknown");
};
