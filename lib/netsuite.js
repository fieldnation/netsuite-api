const soap = require('soap');
const TokenPassport = require('./tokenPassport');
const TokenPassportSignature = require('./tokenPassportSignature');

let wsdlVersion = '';

module.exports = {
  TokenPassport,
  TokenPassportSignature,
  getSoapClient,
  getWSDL
};

/**
 * Get the wsdl URI
 * @param  {String} hostname    
 * @param  {String} version 
 * @return {URI}
 */
function getWSDL(hostname, version) {
  if (!hostname) {
    throw new Error(`${CANNOT_GET_WSDL}. The hostname is required.`);
  }

  if (!version) {
    throw new Error(`${CANNOT_GET_WSDL}. The version is required.`);
  }

  let validHost = hostname;
  if (hostname.substr(-1) === '/') {
    validHost = hostname.substr(0, hostname.length - 1);
  } 

  setWSDLVersion(version);
  return encodeURI(`${validHost}/wsdl/v${version}_0/netsuite.wsdl`);
}

const CANNOT_GET_WSDL = 'Cannot get the WSDL URI';

/**
 * Get a soap client
 * @param  {String} wsdl
 * @return {Promise.<Error, Client>}
 */
function getSoapClient(wsdl) {
  if (!wsdlVersion) {
    setWSDLVersion(stripWSDLVersion(wsdl));
  }
  
  return new Promise((resolve, reject) => {
    soap.createClient(wsdl, (err, client) => {
      if (err) return reject(err);

      // Set some additional namespaces to support TBA
      client.wsdl.definitions.xmlns.ns = 'ns';
      client.wsdl.definitions.xmlns.core = `urn:core_${wsdlVersion}.platform.webservices.netsuite.com`;
      client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap();

      return resolve(client);
    });
  });
}

/**
 * Strip the WSDL version from the wsdl string.
 * Fallback in case a caller doesn't use the getWSDL method to generate the wsdl string.
 * @param  {String} wsdl The WSDL URI
 * @return {String}
 */
function stripWSDLVersion(wsdl) {
  const start = wsdl.lastIndexOf('v') + 1;
  const end = wsdl.lastIndexOf('_0');
  const version = wsdl.substring(start, end);

  return version ? version : '2016_1';
}

function setWSDLVersion(version) {
  wsdlVersion = version;
}
