HEADERS = {
    'content-type': 'text/xml; charset=utf-8',
    'SOAPAction': 'SystemGetStatus'
}

BODY = """<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ns67:SystemGetStatusReq xmlns:ns67="SystemGetStatus" Cmd="Start" OpV="01.00.00">
    </ns67:SystemGetStatusReq>
   </s:Body>
</s:Envelope>"""
