const { Requester, Validator } = require('@chainlink/external-adapter')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('dotenv').config()
var host_url = process.env.HOST_URL

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  action: ['action'],
  value: ['value'],
  dc_erc725_id: false,
  dh_erc725_id: false,
  limit: false,
  page: false,
  sort: false,
  exportType: false,
  ercVersion: false,
  limit: false,
  Identity_like: false,
  order: false,
  export: false,
  offer_id: false,
  OfferId_like: false,
  TransactionHash_like: false,
  HolderIdentity_like: false,
  includeNodeUptime: false,
  holdingAddress: false,
  holdingStorageAddress: false,
  litigationStorageAddress: false,
  EventName_like: false,
  RelatedEntity_like: false,
  RelatedEntity2_like: false,
  endpoint: false
}

const createRequest = (input, callback) => {
 // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input, customParams)
  const jobRunID = validator.validated.id;
  const action = validator.validated.data.action;
  var endpoint;

  console.log(action);

  if(action == 'getHoldingAddress'){
     endpoint = '/api/Contracts/GetHoldingAddress'

  }else if(action == 'getHoldingAddresses'){
     endpoint = '/api/Contracts/GetHoldingAddresses'

  }else if(action == 'getHoldingStorageAddresses'){
     endpoint = '/api/Contracts/GetHoldingStorageAddresses'

  }else if(action == 'getLitigationStorageAddresses'){
     endpoint = '/api/Contracts/GetLitigationStorageAddresses'

  }else if(action == 'getDC'){
    const dc_erc725_id = validator.validated.data.dc_erc725_id;
    endpoint = '/api/nodes/DataCreator/' +dc_erc725_id //dc_erc725_id

  }else if(action == 'getDataCreators'){
    const ercVersion = validator.validated.data.ercVersion;
    const limit = validator.validated.data.limit;
    const page = validator.validated.data.page;
    var query = '&'

    if(validator.validated.data.dc_erc725_id){
      dc_erc725_id = validator.validated.data.dc_erc725_id
      query = query+'identity='+dc_erc725_id+'&'
    }

    if(validator.validated.data.Identity_like){
      var identity_like = validator.validated.data.Identity_like
      query = query+'Identity_like='+identity_like+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(query == '&'){
      endpoint = '/api/nodes/DataCreators?ercVersion='+ercVersion+'&_limit='+limit+'&_page='+page
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataCreators?ercVersion='+ercVersion+'&_limit='+limit+'&_page='+page + query
    }

  }else if(action == 'getDCJobs'){
    const dc_erc725_id = validator.validated.data.dc_erc725_id;
    var query = '?'

    if(validator.validated.data.limit){
      limit = validator.validated.data.limit
      query = query+'_limit='+limit+'&'
    }

    if(validator.validated.data.page){
      page = validator.validated.data.page
      query = query+'_page='+page+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(validator.validated.data.OfferId_like){
      var offerId_like = validator.validated.data.OfferId_like
      query = query+'OfferId_like='+offerId_like+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataCreator/'+dc_erc725_id+'/Jobs'
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataCreator/'+dc_erc725_id+'/Jobs'+query
    }

  }else if(action == 'getDCProfileTransfers'){
    const dc_erc725_id = validator.validated.data.dc_erc725_id;
    var query = '?'

    if(validator.validated.data.TransactionHash_like){
      transactionHash_like = validator.validated.data.TransactionHash_like
      query = query+'TransactionHash_like='+transactionHash_like+'&'
    }

    if(validator.validated.data.limit){
      limit = validator.validated.data.limit
      query = query+'_limit='+limit+'&'
    }

    if(validator.validated.data.page){
      page = validator.validated.data.page
      query = query+'_page='+page+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataCreator/'+dc_erc725_id+'/ProfileTransfers'
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataCreator/'+dc_erc725_id+'/ProfileTransfers'+query
    }

  }else if(action == 'getDCLitigations'){
    const dc_erc725_id = validator.validated.data.dc_erc725_id;
    var query = '?'

    if(validator.validated.data.limit){
      limit = validator.validated.data.limit
      query = query+'_limit='+limit+'&'
    }

    if(validator.validated.data.page){
      page = validator.validated.data.page
      query = query+'_page='+page+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(validator.validated.data.OfferId_like){
      var offerId_like = validator.validated.data.OfferId_like
      query = query+'OfferId_like='+offerId_like+'&'
    }

    if(validator.validated.data.HolderIdentity_like){
      var holderIdentity_like = validator.validated.data.HolderIdentity_like
      query = query+'HolderIdentity_like='+holderIdentity_like+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataCreator/'+dc_erc725_id+'/Litigations'
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataCreator/'+dc_erc725_id+'/Litigations'+query
    }

  }else if(action == 'getDataHolders'){
    const ercVersion = validator.validated.data.ercVersion;
    const limit = validator.validated.data.limit;
    const page = validator.validated.data.page;
    var query = '&'

    if(validator.validated.data.dh_erc725_id){
      const dh_erc725_id = validator.validated.data.dh_erc725_id;
      query = query+'identity='+dh_erc725_id+'&'
    }

    if(validator.validated.data.Identity_like){
      var identity_like = validator.validated.data.Identity_like
      query = query+'Identity_like='+identity_like+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(query == '&'){
      endpoint = '/api/nodes/Dataholders?ercVersion='+ercVersion+'&_limit='+limit+'&_page='+page
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/Dataholders?ercVersion='+ercVersion+'&_limit='+limit+'&_page='+page + query
    }

  }else if(action == 'getDH'){
    const dh_erc725_id = validator.validated.data.dh_erc725_id;
    var query = '?'

    if(validator.validated.data.includeNodeUptime){
      includeNodeUptime = validator.validated.data.includeNodeUptime
      query = query+'includeNodeUptime='+includeNodeUptime+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+query
    }

  }else if(action == 'getDHJobs'){
    const dh_erc725_id = validator.validated.data.dh_erc725_id;
    const limit = validator.validated.data.limit;
    const page = validator.validated.data.page;
    var query = '&'

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(validator.validated.data.OfferId_like){
      var offerId_like = validator.validated.data.OfferId_like
      query = query+'OfferId_like='+offerId_like+'&'
    }

    if(query == '&'){
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/jobs?_limit='+limit+'&_page='+page
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/jobs?_limit='+limit+'&_page='+page+query
    }

  }else if(action == 'getDHPayouts'){
    const dh_erc725_id = validator.validated.data.dh_erc725_id;
    var query = '?'

    if(validator.validated.data.limit){
      limit = validator.validated.data.limit
      query = query+'_limit='+limit+'&'
    }

    if(validator.validated.data.page){
      page = validator.validated.data.page
      query = query+'_page='+page+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(validator.validated.data.OfferId_like){
      var offerId_like = validator.validated.data.OfferId_like
      query = query+'OfferId_like='+offerId_like+'&'
    }

    if(validator.validated.data.TransactionHash_like){
      var transactionHash_like = validator.validated.data.TransactionHash_like
      query = query+'TransactionHash_like='+transactionHash_like+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/payouts'
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/payouts'+query
    }

  }else if(action == 'getDHProfileTransfers'){
    const dh_erc725_id = validator.validated.data.dh_erc725_id;
    var query = '?'

    if(validator.validated.data.limit){
      limit = validator.validated.data.limit
      query = query+'_limit='+limit+'&'
    }

    if(validator.validated.data.page){
      page = validator.validated.data.page
      query = query+'_page='+page+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'_export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'_exportType='+exportType+'&'
    }

    if(validator.validated.data.OfferId_like){
      var offerId_like = validator.validated.data.OfferId_like
      query = query+'_OfferId_like='+offerId_like+'&'
    }

    if(validator.validated.data.TransactionHash_like){
      transactionHash_like = validator.validated.data.TransactionHash_like
      query = query+'TransactionHash_like='+transactionHash_like+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/profiletransfers'
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/profiletransfers'+query
    }

  }else if(action == 'getDHLitigations'){
    const dh_erc725_id = validator.validated.data.dh_erc725_id;
    var query = '?'

    if(validator.validated.data.limit){
      limit = validator.validated.data.limit
      query = query+'_limit='+limit+'&'
    }

    if(validator.validated.data.page){
      page = validator.validated.data.page
      query = query+'_page='+page+'&'
    }

    if(validator.validated.data.sort){
      sort = validator.validated.data.sort
      query = query+'_sort='+sort+'&'
    }

    if(validator.validated.data.order){
      order = validator.validated.data.order
      query = query+'_order='+order+'&'
    }

    if(validator.validated.data.export){
      exp = validator.validated.data.export
      query = query+'export='+exp+'&'
    }

    if(validator.validated.data.exportType){
      exportType = validator.validated.data.exportType
      query = query+'exportType='+exportType+'&'
    }

    if(validator.validated.data.OfferId_like){
      var offerId_like = validator.validated.data.OfferId_like
      query = query+'OfferId_like='+offerId_like+'&'
    }

    if(query == '?'){
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/litigations'
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataHolder/'+dh_erc725_id+'/litigations'+query
    }

  }else if(action == 'getCanTryPayout'){
    const dh_erc725_id = validator.validated.data.dh_erc725_id;
    const offer_id = validator.validated.data.offer_id;
    const holdingAddress = validator.validated.data.holdingAddress;
    var query = '&'

    if(validator.validated.data.holdingStorageAddress){
      holdingStorageAddress = validator.validated.data.holdingStorageAddress
      query = query+'holdingStorageAddress='+holdingStorageAddress+'&'
    }

    if(validator.validated.data.litigationStorageAddress){
      litigationStorageAddress = validator.validated.data.litigationStorageAddress
      query = query+'litigationStorageAddress='+litigationStorageAddress+'&'
    }

    if(query == '&'){
      endpoint = '/api/nodes/DataHolder/CanTryPayout?identity='+dh_erc725_id+'&offerId='+offer_id
    }else{
      query = query.slice(0, -1);
      endpoint = '/api/nodes/DataHolder/CanTryPayout?identity='+dh_erc725_id+'&offerId='+offer_id + query
    }

  }else if(action == 'getJob'){
    const offer_id = validator.validated.data.offer_id;
    endpoint = '/api/Job/detail/'+offer_id //offer_id

  }

  const url = host_url + endpoint
  console.log(url);

  const params = {
    //fsym,
    //tsyms
  }

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'
  const config = {
    url,
    params
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      const value = validator.validated.data.value;
      console.log(value); //identity
      console.log(response.data); //json response

      if(action == 'getHoldingAddress' ||
        action == 'getDH' ||
        action == 'getJob' ||
        action == 'getCanTryPayout'){
          response.data.result = Requester.getResult(response.data,[value]);

      }else{
        response.data.result = Requester.getResult(response.data[0],[value]);
      }

        callback(response.status, Requester.success(jobRunID, response));

    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
