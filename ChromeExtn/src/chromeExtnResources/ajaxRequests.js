var domainUrl = "//172.26.119.66:8000"
//getFieldApi Integration
function getFieldApi (functionName) {
    _$.ajax({
        type: "GET",
        url: domainUrl + "/tivo_spider/get_field/",
        dataType: "json",
        success: function(data) {
          functionName(data);
        }
    })
}


function splitApi (functionName, postData, selectedFn = null) {
  _$.ajax(domainUrl + "/vcrawler/functions/split/", {
      type: 'GET',
      crossDomain: true,
      ContentType: "application/json; charset=UTF-8",
      data: postData,
      success: function(response) {
        functionName(response, selectedFn)
      }
  })
}
