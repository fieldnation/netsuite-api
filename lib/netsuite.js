const soap = require('soap');
const TokenPassport = require('./tokenPassport');
const TokenPassportSignature = require('./tokenPassportSignature');

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

  return encodeURI(`${validHost}/wsdl/v${version}_0/netsuite.wsdl`);
}

const CANNOT_GET_WSDL = 'Cannot get the WSDL URI';

/**
 * Get a soap client
 * @param  {String} wsdl
 * @return {Promise.<Error, Client>}
 */
function getSoapClient(wsdl) {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdl, (err, client) => {
      if (err) return reject(err);
      return resolve(client);
    });
  });
}
