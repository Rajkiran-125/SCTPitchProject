import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { spnamekey, externalAPI } from './global/json-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { log } from 'console';
import { environment } from 'src/environments/environment';



@Injectable()
export class MonitorInterceptor implements HttpInterceptor {
  currentResponse: string;
  URLval = environment.base_url + 'ApiConsoleStore'
  // URLval = 'https://cx1.unfyd.com:3001/api/ApiConsoleStore';
  // URLval = 'https://cx2.unfyd.com/api/hub-admin/ApiConsoleStore';
  // URLval = 'http://localhost:3001/api/ApiConsoleStore';

  IsAPIconsoleOn =true;
  constructor(private http: HttpClient

  ) { }



  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  this.IsApiConsoleONfunc()
  
    const begin = performance.now();
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.currentResponse = JSON.stringify(event.body, null, "\t");

        }
        return event;
      }),
      finalize(() => {
        if(this.IsAPIconsoleOn !== true) return;

        if(request.url.includes(environment.base_url)
            || request.url.includes(environment.base_url1)
            || request.url.includes(environment.base_url1)
            || request.url.includes(environment.master_url)){
              this.logRequestTime(begin, request.url, request.method, request.body, this.currentResponse);              
              
        } else{
          this.externalAPI(begin,request,this.currentResponse,0)
        }
      }),
      catchError((error: HttpErrorResponse) => {

        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          // console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          // console.log('This is server side error');
          // console.error("Failed Endpoint", request.url)
          // console.error("Error", error)


          errorMsg = `Error Code: ${error.error.code},  Message: ${error.error.message}`;
        }



        // console.error(errorMsg);

        if(this.IsAPIconsoleOn == true){

        let str = request.url.split('/').pop()
        let param = request.body;
        let ReqURL = this.URLval;
        let response = errorMsg.replace(/'/g, "");
        let url = request.url;
        const requestDuration = "FAILED";
        let failstatus = 1;

        param = this.getDecrypted('123456$#@$^@1ERF', param)
        // response =    JSON.stringify(this.getDecrypted('123456$#@$^@1ERF',JSON.parse(response)))


          //  console.log('Api',str,param,ReqURL,response,url,requestDuration,failstatus);
          if(request.url.includes(environment.base_url)
              || request.url.includes(environment.base_url1)
              || request.url.includes(environment.base_url1)
              || request.url.includes(environment.master_url)){
                this.ApiFunction(str, param, ReqURL, response, url, requestDuration, failstatus)
          } else{
            this.externalAPI(begin,request,response,1)
            // console.log("request:",request,response);
            // alert('other')
          }
        }

        return throwError(error);

      })
    );
  }

  private logRequestTime(startTime: number, url: string, method: string, param: Object, response: string) {
    const requestDuration = `${performance.now() - startTime}`;

    // console.log(url);
    let str = url.split('/').pop()

    let ReqURL = this.URLval;
    let failstatus = 0;



    // Performance Testing

    //  if ((performance.now() - startTime) > 3000) {
    //   console.log(`HTTP ${method} - ${url} \n Parameters: ${JSON.stringify(param, null, "\t")} `);
    //   console.log(`%c${requestDuration}  milliseconds`, "font-weight: bold; font-size: 50px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)");
    // } else {
    //   console.log(`HTTP ${method} - ${url} \n Parameters: ${JSON.stringify(param, null, "\t")}`);
    //   console.log(`%c${requestDuration}  milliseconds`, "color: blue;font-family:serif; font-size: 30px");
    // }

    // console.log('this.getDecrypt Rquest',this.getDecrypted('123456$#@$^@1ERF',param));
    // console.log('this.getDecrypt Rsponse',this.getDecrypted('123456$#@$^@1ERF',JSON.parse(response)));
    // console.log('Api','str == ',str,'param == ',param,'ReqURL == ',ReqURL,'response == ',response,'url == ',url,'requestDuration == ',requestDuration,'failstatus == ',failstatus);

    param = this.getDecrypted('123456$#@$^@1ERF', param)
    response = JSON.stringify(this.getDecrypted('123456$#@$^@1ERF', JSON.parse(response)))

    let res: any;
    res = response
    if (res?.code !== 400 && res?.code !== 401 && res?.code !== 500 && res?.code !== 501 && res?.code !== 413) {
      // console.log("str:",str,"\nparam:", param, "\nReqURL:",ReqURL, "\nresponse:",response, "\nurl:",url, "\nrequestDuration:",requestDuration,"\nfailstatus:", failstatus);
      this.ApiFunction(str, param, ReqURL, response, url, requestDuration, failstatus)
    }

  }

  externalAPI(begin,request,currentResponse,failStatus){
    const requestDuration = `${performance.now() - begin}`;
    let action = request.method
    if(request.body.hasOwnProperty('data')){
      if(request.body.data.hasOwnProperty('parameters')){
        if(request.body.data.parameters.hasOwnProperty('flag')){
          action = request.body.data.parameters.flag
        }
      }
    } else if(request.body.hasOwnProperty('storedproc')){
      action = request.body.storedproc
    }
    let str = request.url.split('/').pop()
    let type = 'Other'
    let module = 'Other'
    let keyName = 'Other'
    externalAPI.forEach(element => {
      if(request.url.includes(element.url)){
        type = element.type
        keyName = element.keyName
        module = element.module
      }
    });
    let obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          FLAG: "INSERT",
          Type: type,
          Category: "External",
          SubCategory: "",
          Module: module,
          KeyName: keyName,
          URL: request.url,
          RequestType: request.method,
          Header: JSON.stringify(request.headers.headers),
          AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
          RequestFormat: "JSON",
          SampleRequest: JSON.stringify(request.body),
          SampleResponse: JSON.stringify(currentResponse),
          ProductId: 11,
          ProcessId: 1,
          IsDeleted: false,
          CreatedBy: "1",
          PublicIP: "",
          PrivateIP: "",
          BrowserName: "",
          BrowserVersion: "",
          Action: action,
          FailureStatus: failStatus,
          ResponseTime: Math.round(Number(requestDuration))
        }
      }

    }

    // console.log("external request:", obj);
    this.apiCall(obj)

  }

  apiCall(obj){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('authtoken')
      })
    }
    let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
    return this.http.post(this.URLval, { data: encryptdata }, httpOptions).subscribe((e: any) => {

    })
  }

  ApiFunction(str, param, ReqURL, response, url, requestDuration, failstatus) {
    var obj = {};

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('authtoken')
      })
    }


    if (str == "update" || str == "securitycompliance" || str == "delete") {

      let action;
      if (str == "update") {
        action = "UPDATE"
      }
      if (str == "securitycompliance") {
        action = "INSERT"
      }
      if (str == "delete") {
        action = "DELETE"
      }



      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Security and Compliance",
            KeyName: "Security and Compliance",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    if(param && param.hasOwnProperty('data')){
    if (param?.["data"]?.filename == "branding") {

      let action = param?.["data"]?.flag

      if (param?.["data"]?.flag == "get") {
        action = "GET"
      }
      if (param?.["data"]?.flag == "insert") {
        action = "INSERT"
      }


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Branding",
            KeyName: "Branding",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    if (param?.["data"]?.filename == "security-and-compliance") {
      let action = param?.["data"]?.flag
      if (param?.["data"]?.flag == "get") {
        action = "GET"
      }
      else if (param?.["data"]?.flag == "update") {
        action = "UPDATE"
      }
      else if (param?.["data"]?.flag == "insert") {
        action = "INSERT"
      }
      else if (param?.["data"]?.flag == "delete") {
        action = "DELETE"
      }
      else {
        action = param?.["data"]?.flag
      }


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Security and Compliance",
            KeyName: "Security and Compliance",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    if((param?.["data"]?.hasOwnProperty('spname') || param?.["data"]?.hasOwnProperty('SPNAME')) && (param?.["data"]?.parameters.hasOwnProperty('flag') || param?.["data"]?.parameters.hasOwnProperty('FLAG'))){
    if (param?.["data"]?.spname == "skillmaster" && (param?.["data"]?.parameters.flag == "INSERTSKILL" || param?.["data"]?.parameters.flag == "UPDATESKILL"
      || param?.["data"]?.parameters.flag == "DELETESKILL" || param?.["data"]?.parameters.flag == "GETALLSKILL"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE_SKILL")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GETALLSKILL") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERTSKILL") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATESKILL") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETESKILL") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE_SKILL") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Skills",
            KeyName: "Skills",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })


    }


    else if (param?.["data"]?.spname == "hierarchy" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Hierarchy",
            KeyName: "Hierarchy",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    else if (param?.["data"]?.spname == "blockcontent" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Block Content",
            KeyName: "Block Content",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }
    else if (param?.["data"]?.spname == "broadcast" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Broadcast",
            KeyName: "Broadcast",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    else if (param?.["data"]?.spname == "module" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Hub Modules",
            KeyName: "Hub Modules",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    else if (param?.["data"]?.spname == "notification" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Notification",
            KeyName: "Notification",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    else if (param?.["data"]?.spname == "notificationcategory" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Notification Events",
            KeyName: "Notification Events",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if ((param?.["data"]?.spname && param?.["data"]?.spname.toUpperCase() == "USP_UNFYD_NOTIFICATION_EVENTS" || param?.["data"]?.spname == "notificationevents") && (param?.["data"]?.parameters.flag && param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Notification Events",
            KeyName: "Notification Events",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if ((param?.["data"]?.spname && param?.["data"]?.spname.toUpperCase() == "USP_UNFYD_NOTIFICATION_FIELDS" || param?.["data"]?.spname == "notificationfield") && (param?.["data"]?.parameters.flag && param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET" || param?.["data"]?.parameters.flag == "GET_INTERNAL" || param?.["data"]?.parameters.flag == "GET_EXTERNAL") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Notification Events",
            KeyName: "Notification Events",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if (param?.["data"]?.spname == "scheduler" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Scheduler",
            KeyName: "Scheduler",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if (param?.["data"]?.spname == "accesscontrol" && (param?.["data"]?.parameters.FLAG == "INSERT_HUB_ACCESS" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT_HUB_ACCESS") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }

      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Pivilege",
            KeyName: "Pivilege",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if ((param?.["data"]?.spname == "usp_unfyd_module_map" || param?.["data"]?.spname == "modulemap") && (param?.["data"]?.parameters.FLAG == "INSERT_MAPPING_DATA" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE_MAPPING_DATA" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE_MAPPING_DATA" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT_MAPPING_DATA") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE_MAPPING_DATA") {
        action = "DELETE"
      }

      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Pivilege",
            KeyName: "Pivilege",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }



    else if (param?.["data"]?.spname == "schedule" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }

      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Schedule",
            KeyName: "Schedule",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    else if (param?.["data"]?.spname == "scortemplate" && (param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.flag == "Delete" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "Delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Scor Template",
            KeyName: "Scor Template",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if (param?.["data"]?.spname == "scorcategory" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Scor Template",
            KeyName: "Scor Template",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }


    else if (param?.["data"]?.spname == "scortemplate" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Scor Template",
            KeyName: "Scor Template",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {
      })

    }

    else if (param?.["data"]?.spname == "sla" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Service Level Agreement",
            KeyName: "Service Level Agreement",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })


    }


    else if (param?.["data"]?.spname == "slacategory" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Service Level Agreement",
            KeyName: "Service Level Agreement",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })


    }


    else if (param?.["data"]?.spname == "group" && (param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "User Groups",
            KeyName: "User Groups",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })


    }

    else if (param?.["data"]?.spname == "admusers" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE_USER_PERSONALDETAILS"
      || param?.["data"]?.parameters.flag == "DELETEUSER" || param?.["data"]?.parameters.flag == "UPDATE_USER_CCDETAIL" || param?.["data"]?.parameters.flag == "GETUSERBYID"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GETALLUSERS" || param?.["data"]?.parameters.flag == "GETLOCKEDUSERS" || param?.["data"]?.parameters.flag == "GETRESETPASSWORDUSERS")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "GETALLUSERS" || param?.["data"]?.parameters.flag == "GETLOCKEDUSERS" || param?.["data"]?.parameters.flag == "GETRESETPASSWORDUSERS" || param?.["data"]?.parameters.flag == "GETUSERBYID") {
        action = "GET"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE_USER_PERSONALDETAILS" || param?.["data"]?.parameters.flag == "UPDATE_USER_CCDETAIL") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETEUSER") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Users",
            KeyName: "Users",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })


    }

    else if (param?.["data"]?.spname == "userproduct" && (param?.["data"]?.parameters.flag == "update" || param?.["data"]?.parameters.flag == "GET_USER_PRODUCT"
      || param?.["data"]?.parameters.flag == "DELETEUSER" || param?.["data"]?.parameters.flag == "UPDATE_USER_CCDETAIL"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "update") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "GET_USER_PRODUCT") {
        action = "GET"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE_USER_PERSONALDETAILS") {
        action = "UPDATE"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE_USER_CCDETAIL") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETEUSER") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Users",
            KeyName: "Users",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })


    }

    else if (param?.["data"]?.spname == "customerproduct" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "get"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "get") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Products",
            KeyName: "Products",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })


    }
    else if (param?.["data"]?.spname == "greetingcat" && (param?.["data"]?.parameters.flag == "insert" || param?.["data"]?.parameters.flag == "update"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "get"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "get") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "insert") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "update") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Greetings",
            KeyName: "Greetings",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }


      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "greetings" && (param?.["data"]?.parameters.flag == "insert" || param?.["data"]?.parameters.flag == "update"
      || param?.["data"]?.parameters.flag == "delete" || param?.["data"]?.parameters.flag == "get"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "get") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "insert") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "update") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Greetings",
            KeyName: "Greetings",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }


      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "usrfieldchooser" && (param?.["data"]?.parameters.flag == "GET") && (param?.["data"]?.parameters.modulename == "TranscriptsReport")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "LIST"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Transcript",
            KeyName: "Transcript",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }


      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })



    }

    else if (param?.["data"]?.spname == "alertmsgconfig" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Alert Message",
            KeyName: "Alert Message",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "generalsetting" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "General Setting",
            KeyName: "General Setting",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "appsetting" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET_TREE_MODULE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "UPDATE_MODULE_DATA")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "UPDATE_MODULE_DATA") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "GET_TREE_MODULE") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "App Setting",
            KeyName: "App Setting",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "localization" && (param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET_MODULE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.FLAG == "UPDATE_MODULE")) {

      let action = ""
      if (param?.["data"]?.parameters.FLAG == "UPDATE_MODULE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "GET_MODULE") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Localization",
            KeyName: "Localization",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "localization" && (param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "BULK_EDIT" || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""

      if (param?.["data"]?.parameters.FLAG == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Localization",
            KeyName: "Localization",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "maskingrule" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "Delete" || param?.["data"]?.parameters.flag == "BULK_EDIT"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "Delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Masking Rule",
            KeyName: "Masking Rule",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: JSON.stringify(response),
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "cannedresponse" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "BULK_EDIT"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Works",
            Category: "Works",
            SubCategory: "",
            Module: "Canned Messages",
            KeyName: "Canned Messages",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "notready" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "BULK_EDIT"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Works",
            Category: "Works",
            SubCategory: "",
            Module: "Not Ready",
            KeyName: "Not Ready",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "pushurl" && (param?.["data"]?.parameters.flag == "INSERTPUSHURL" || param?.["data"]?.parameters.flag == "UPDATEPUSHURL"
      || param?.["data"]?.parameters.flag == "DELETEPUSHURL" || param?.["data"]?.parameters.flag == "BULK_EDIT"
      || param?.["data"]?.parameters.flag == "DELETEBULKURL" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "PUSHURLMASTEREXPORT")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "PUSHURLMASTEREXPORT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERTPUSHURL") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATEPUSHURL") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETEPUSHURL") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "DELETEBULKURL") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Works",
            Category: "Works",
            SubCategory: "",
            Module: "Quick Links",
            KeyName: "Quick Links",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if ((param?.["data"]?.spname == "channelconfig" || param?.["data"]?.spname == "usp_unfyd_channel_config") && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE_CHANNELSOURCE_MST" || param?.["data"]?.parameters.flag == "GET_CHANNEL_DATA"
      || param?.["data"]?.parameters.flag == "DELETEBULKURL" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "PUSHURLMASTEREXPORT")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "PUSHURLMASTEREXPORT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "GET_CHANNEL_DATA") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE_CHANNELSOURCE_MST") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "DELETEBULKURL") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Channel Configuration",
            KeyName: "Channel Configuration",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "cclocation" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "BULK_EDIT"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Contact Center Location",
            KeyName: "Contact Center Location",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if ((param?.["data"]?.spname == "module" || param?.["data"]?.spname == "usp_unfyd_form_module") && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "BULK_EDIT"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "GET")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Hub Modules",
            KeyName: "Hub Modules",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "customerproductgrp" && (param?.["data"]?.parameters.flag == "INSERT_PRODUCT_GROUP" || param?.["data"]?.parameters.FLAG == "UPDATE_PRODUCT_GROUP" || param?.["data"]?.parameters.flag == "UPDATE_CATEGORY" || param?.["data"]?.parameters.flag == "UPDATE_SUB_CATEGORY"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET_CATEGORY" || param?.["data"]?.parameters.flag == "INSERT_CATEGORY" || param?.["data"]?.parameters.flag == "INSERT_SUB_CATEGORY"
      || param?.["data"]?.parameters.flag == "BULK_EDIT" || param?.["data"]?.parameters.flag == "GET_PRODUCT_GROUP" || param?.["data"]?.parameters.flag == "BULK_DELETE"
      || param?.["data"]?.parameters.flag == "DELETE_PRODUCT_GROUP" || param?.["data"]?.parameters.flag == "DELETE_SUB_CATEGORY" || param?.["data"]?.parameters.flag == "DELETE_CATEGORY"
      || param?.["data"]?.parameters.flag == "CATEGORY_BULK_DELETE" || param?.["data"]?.parameters.flag == "SUBCATEGORY_BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GET_CATEGORY") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT_CATEGORY") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "INSERT_SUB_CATEGORY") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "GET_PRODUCT_GROUP") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT_PRODUCT_GROUP") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "UPDATE_PRODUCT_GROUP" || param?.["data"]?.parameters.flag == "UPDATE_CATEGORY" || param?.["data"]?.parameters.flag == "UPDATE_SUB_CATEGORY") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "DELETE_PRODUCT_GROUP" || param?.["data"]?.parameters.flag == "DELETE_SUB_CATEGORY" || param?.["data"]?.parameters.flag == "DELETE_CATEGORY") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "CATEGORY_BULK_DELETE" || param?.["data"]?.parameters.flag == "SUBCATEGORY_BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Product Group",
            KeyName: "Product Group",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "tenant" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "BULK_EDIT" || param?.["data"]?.parameters.flag == "getall")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "getall") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Tenant",
            KeyName: "Tenant",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "USP_UNFYD_PRODUCTS_PROCESSMAPPING" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "BULK_EDIT" || param?.["data"]?.parameters.flag == "getall")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "getall") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Tenant",
            KeyName: "Tenant",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "BULK_EDIT" || param?.["data"]?.parameters.flag == "getall")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "getall") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Tenant",
            KeyName: "Tenant",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "usp_unfyd_role_process_mapping" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "BULK_EDIT" || param?.["data"]?.parameters.flag == "getall")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "getall") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Tenant",
            KeyName: "Tenant",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "featurecontrol" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "INSERT_CHILD_MODULE" || param?.["data"]?.parameters.flag == "GET_CHILD_MODULE" || param?.["data"]?.parameters.flag == "DELETE"
      || param?.["data"]?.parameters.flag == "GET_MODULE"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "INSERT_PARENT_MODULE" || param?.["data"]?.parameters.flag == "UPDATE_MODULE")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "INSERT_PARENT_MODULE") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "INSERT_CHILD_MODULE") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "GET_CHILD_MODULE") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "UPDATE_MODULE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "GET_MODULE") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Feature Controls",
            Category: "Feature Controls",
            SubCategory: "",
            Module: "Feature Controls",
            KeyName: "Feature Controls",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "configmanager" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "INSERT_CHILD_MODULE" || param?.["data"]?.parameters.flag == "GET_CHILD_MODULE" || param?.["data"]?.parameters.flag == "DELETE"
      || param?.["data"]?.parameters.flag == "GETCONFIGVALUE" || param?.["data"]?.parameters.flag == "UPDATE_CHANNELWISE_CONFIG" || param?.["data"]?.parameters.flag == "UPDATECONFIG")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "UPDATE_CHANNELWISE_CONFIG") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "INSERT_CHILD_MODULE") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "GET_CHILD_MODULE") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "UPDATECONFIG") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "GETCONFIGVALUE") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "",
            Module: "Config Manager",
            KeyName: "Config Manager",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "datacollectionform" && (param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "Update"
      || param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "getformcategory" || param?.["data"]?.parameters.FLAG == "DELETE"
      || param?.["data"]?.parameters.FLAG == "delete" || param?.["data"]?.parameters.FLAG == "Delete" || param?.["data"]?.parameters.FLAG == "get")) {

      let action = ""
      if (param?.["data"]?.parameters.FLAG == "Delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.FLAG == "getformcategory") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "get") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "Update") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE") {
        action = "DELETE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Works",
            Category: "Works",
            SubCategory: "",
            Module: "Dynamic Forms",
            KeyName: "Dynamic Forms",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "hsmtemplate" && (param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "Update"
      || param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "getformcategory" || param?.["data"]?.parameters.FLAG == "DELETE"
      || param?.["data"]?.parameters.FLAG == "delete" || param?.["data"]?.parameters.FLAG == "Delete" || param?.["data"]?.parameters.FLAG == "GET_HSM"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "HSM_BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.FLAG == "Delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.FLAG == "getformcategory") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "GET_HSM") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "delete") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.FLAG == "Update") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE") {
        action = "DELETE"
      }

      if (param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "HSM_BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "HSM Template",
            KeyName: "HSM Template",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }




    else if (param?.["data"]?.spname == "broadcast" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
      || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
      || param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
      || param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

      let action = ""
      if (param?.["data"]?.parameters.FLAG == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.FLAG == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "GET") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERT") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.flag == "UPDATE") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETE") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Master Data Management",
            Category: "Master Data Management",
            SubCategory: "",
            Module: "Broadcast",
            KeyName: "Broadcast",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "USP_UNFYD_BUSINESSORCHESTRATION" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
    || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
    || param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
    || param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET"
    || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

    let action = ""
    if (param?.["data"]?.parameters.FLAG == "GET") {
      action = "GET"
    }
    if (param?.["data"]?.parameters.FLAG == "INSERT") {
      action = "INSERT"
    }
    if (param?.["data"]?.parameters.FLAG == "UPDATE") {
      action = "UPDATE"
    }
    if (param?.["data"]?.parameters.FLAG == "DELETE") {
      action = "DELETE"
    }
    if (param?.["data"]?.parameters.flag == "GET") {
      action = "GET"
    }
    if (param?.["data"]?.parameters.flag == "INSERT") {
      action = "INSERT"
    }
    if (param?.["data"]?.parameters.flag == "UPDATE") {
      action = "UPDATE"
    }
    if (param?.["data"]?.parameters.flag == "DELETE") {
      action = "DELETE"
    }
    if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
      action = "BULK DELETE"
    }
    if (param?.["data"]?.parameters.flag == "ACTIVATE") {
      action = "ACTIVATE"
    }

    obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          FLAG: "INSERT",
          Type: "Master Data Management",
          Category: "Master Data Management",
          SubCategory: "",
          Module: "Business Orchestration",
          KeyName: "Business Orchestration",
          URL: url,
          RequestType: "POST",
          Header: "Authorization",
          AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
          RequestFormat: "JSON",
          SampleRequest: JSON.stringify(param),
          SampleResponse: response,
          ProductId: 11,
          ProcessId: 1,
          IsDeleted: false,
          CreatedBy: "1",
          PublicIP: "",
          PrivateIP: "",
          BrowserName: "",
          BrowserVersion: "",
          Action: action,
          FailureStatus: failstatus,
          ResponseTime: Math.round(Number(requestDuration))
        }
      }

    }

    let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
    return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

    })

  }

  else if (param?.["data"]?.spname == "USP_EXTERNAL_APP" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
  || param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
  || param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
  || param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET"
  || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

  let action = ""
  if (param?.["data"]?.parameters.FLAG == "GET") {
    action = "GET"
  }
  if (param?.["data"]?.parameters.FLAG == "INSERT") {
    action = "INSERT"
  }
  if (param?.["data"]?.parameters.FLAG == "UPDATE") {
    action = "UPDATE"
  }
  if (param?.["data"]?.parameters.FLAG == "DELETE") {
    action = "DELETE"
  }
  if (param?.["data"]?.parameters.flag == "GET") {
    action = "GET"
  }
  if (param?.["data"]?.parameters.flag == "INSERT") {
    action = "INSERT"
  }
  if (param?.["data"]?.parameters.flag == "UPDATE") {
    action = "UPDATE"
  }
  if (param?.["data"]?.parameters.flag == "DELETE") {
    action = "DELETE"
  }
  if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
    action = "BULK DELETE"
  }
  if (param?.["data"]?.parameters.flag == "ACTIVATE") {
    action = "ACTIVATE"
  }

  obj = {
    data: {
      spname: "USP_UNFYD_API_CONSOLE",
      parameters: {
        FLAG: "INSERT",
        Type: "Master Data Management",
        Category: "Master Data Management",
        SubCategory: "",
        Module: "External Apps",
        KeyName: "External Apps",
        URL: url,
        RequestType: "POST",
        Header: "Authorization",
        AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
        RequestFormat: "JSON",
        SampleRequest: JSON.stringify(param),
        SampleResponse: response,
        ProductId: 11,
        ProcessId: 1,
        IsDeleted: false,
        CreatedBy: "1",
        PublicIP: "",
        PrivateIP: "",
        BrowserName: "",
        BrowserVersion: "",
        Action: action,
        FailureStatus: failstatus,
        ResponseTime: Math.round(Number(requestDuration))
      }
    }

  }

  let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
  return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

  })

}

else if (param?.["data"]?.spname == "UNFYD_ADM_RM_BASED_ROUTING_V1" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
|| param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
|| param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
|| param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET"
|| param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

let action = ""
if (param?.["data"]?.parameters.FLAG == "GET") {
  action = "GET"
}
if (param?.["data"]?.parameters.FLAG == "INSERT") {
  action = "INSERT"
}
if (param?.["data"]?.parameters.FLAG == "UPDATE") {
  action = "UPDATE"
}
if (param?.["data"]?.parameters.FLAG == "DELETE") {
  action = "DELETE"
}
if (param?.["data"]?.parameters.flag == "GET") {
  action = "GET"
}
if (param?.["data"]?.parameters.flag == "INSERT") {
  action = "INSERT"
}
if (param?.["data"]?.parameters.flag == "UPDATE") {
  action = "UPDATE"
}
if (param?.["data"]?.parameters.flag == "DELETE") {
  action = "DELETE"
}
if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
  action = "BULK DELETE"
}
if (param?.["data"]?.parameters.flag == "ACTIVATE") {
  action = "ACTIVATE"
}

obj = {
  data: {
    spname: "USP_UNFYD_API_CONSOLE",
    parameters: {
      FLAG: "INSERT",
      Type: "Master Data Management",
      Category: "Master Data Management",
      SubCategory: "",
      Module: "RM Mapping",
      KeyName: "RM Mapping",
      URL: url,
      RequestType: "POST",
      Header: "Authorization",
      AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
      RequestFormat: "JSON",
      SampleRequest: JSON.stringify(param),
      SampleResponse: response,
      ProductId: 11,
      ProcessId: 1,
      IsDeleted: false,
      CreatedBy: "1",
      PublicIP: "",
      PrivateIP: "",
      BrowserName: "",
      BrowserVersion: "",
      Action: action,
      FailureStatus: failstatus,
      ResponseTime: Math.round(Number(requestDuration))
    }
  }

}

let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

})

}


else if (param?.["data"]?.spname == "usp_unfyd_form_structure" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
|| param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
|| param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
|| param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET"
|| param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

let action = ""
if (param?.["data"]?.parameters.FLAG == "GET") {
  action = "GET"
}
if (param?.["data"]?.parameters.FLAG == "INSERT") {
  action = "INSERT"
}
if (param?.["data"]?.parameters.FLAG == "UPDATE") {
  action = "UPDATE"
}
if (param?.["data"]?.parameters.FLAG == "DELETE") {
  action = "DELETE"
}
if (param?.["data"]?.parameters.flag == "GET") {
  action = "GET"
}
if (param?.["data"]?.parameters.flag == "INSERT") {
  action = "INSERT"
}
if (param?.["data"]?.parameters.flag == "UPDATE") {
  action = "UPDATE"
}
if (param?.["data"]?.parameters.flag == "DELETE") {
  action = "DELETE"
}
if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
  action = "BULK DELETE"
}
if (param?.["data"]?.parameters.flag == "ACTIVATE") {
  action = "ACTIVATE"
}

obj = {
  data: {
    spname: "USP_UNFYD_API_CONSOLE",
    parameters: {
      FLAG: "INSERT",
      Type: "Master Data Management",
      Category: "Master Data Management",
      SubCategory: "",
      Module: "Structure",
      KeyName: "Structure",
      URL: url,
      RequestType: "POST",
      Header: "Authorization",
      AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
      RequestFormat: "JSON",
      SampleRequest: JSON.stringify(param),
      SampleResponse: response,
      ProductId: 11,
      ProcessId: 1,
      IsDeleted: false,
      CreatedBy: "1",
      PublicIP: "",
      PrivateIP: "",
      BrowserName: "",
      BrowserVersion: "",
      Action: action,
      FailureStatus: failstatus,
      ResponseTime: Math.round(Number(requestDuration))
    }
  }

}

let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

})

}


else if (param?.["data"]?.spname == "taskgroup" && (param?.["data"]?.parameters.flag == "INSERT" || param?.["data"]?.parameters.flag == "UPDATE"
|| param?.["data"]?.parameters.flag == "DELETE" || param?.["data"]?.parameters.flag == "GET"
|| param?.["data"]?.parameters.FLAG == "INSERT" || param?.["data"]?.parameters.FLAG == "UPDATE"
|| param?.["data"]?.parameters.FLAG == "DELETE" || param?.["data"]?.parameters.FLAG == "GET"
|| param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE")) {

let action = ""
if (param?.["data"]?.parameters.FLAG == "GET") {
  action = "GET"
}
if (param?.["data"]?.parameters.FLAG == "INSERT") {
  action = "INSERT"
}
if (param?.["data"]?.parameters.FLAG == "UPDATE") {
  action = "UPDATE"
}
if (param?.["data"]?.parameters.FLAG == "DELETE") {
  action = "DELETE"
}
if (param?.["data"]?.parameters.flag == "GET") {
  action = "GET"
}
if (param?.["data"]?.parameters.flag == "INSERT") {
  action = "INSERT"
}
if (param?.["data"]?.parameters.flag == "UPDATE") {
  action = "UPDATE"
}
if (param?.["data"]?.parameters.flag == "DELETE") {
  action = "DELETE"
}
if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
  action = "BULK DELETE"
}
if (param?.["data"]?.parameters.flag == "ACTIVATE") {
  action = "ACTIVATE"
}

obj = {
  data: {
    spname: "USP_UNFYD_API_CONSOLE",
    parameters: {
      FLAG: "INSERT",
      Type: "Works",
      Category: "Works",
      SubCategory: "",
      Module: "Task Groups",
      KeyName: "Task Groups",
      URL: url,
      RequestType: "POST",
      Header: "Authorization",
      AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
      RequestFormat: "JSON",
      SampleRequest: JSON.stringify(param),
      SampleResponse: response,
      ProductId: 11,
      ProcessId: 1,
      IsDeleted: false,
      CreatedBy: "1",
      PublicIP: "",
      PrivateIP: "",
      BrowserName: "",
      BrowserVersion: "",
      Action: action,
      FailureStatus: failstatus,
      ResponseTime: Math.round(Number(requestDuration))
    }
  }

}

let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

})

}












    else if (param?.["data"]?.spname == "admholidays" && (param?.["data"]?.parameters.flag == "INSERTHOLIDAY" || param?.["data"]?.parameters.flag == "UPDATEHOLIDAY"
      || param?.["data"]?.parameters.flag == "DELETEHOLIDAY"
      || param?.["data"]?.parameters.flag == "BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE" || param?.["data"]?.parameters.flag == "BULK_EDIT" || param?.["data"]?.parameters.flag == "GETALLHOLIDAYS")) {

      let action = ""
      if (param?.["data"]?.parameters.flag == "GETALLHOLIDAYS") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "BULK_EDIT") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.flag == "INSERTHOLIDAY") {
        action = "INSERT"
      }
      else if (param?.["data"]?.parameters.flag == "UPDATEHOLIDAY") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "DELETEHOLIDAY") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "Config Manager",
            Module: "Holiday",
            KeyName: "Holiday",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "offline" && (param?.["data"]?.parameters.FLAG == "INSERT_OFFLINE_HRS" || param?.["data"]?.parameters.FLAG == "DELETE_OFFLINE_HRS"
      || param?.["data"]?.parameters.FLAG == "UPDATE_OFFLINE_HRS" || param?.["data"]?.parameters.FLAG == "GETALLOFFLINEHRS"
      || param?.["data"]?.parameters.flag == "OFFLINE_HRS_BULK_DELETE" || param?.["data"]?.parameters.FLAG == "ACTIVATE_OFFLINEHRS")) {

      let action = ""

      if (param?.["data"]?.parameters.FLAG == "UPDATE_OFFLINE_HRS") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.FLAG == "GETALLOFFLINEHRS") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "INSERT_OFFLINE_HRS") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE_OFFLINE_HRS") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.flag == "OFFLINE_HRS_BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.FLAG == "ACTIVATE_OFFLINEHRS") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "Config Manager",
            Module: "Online Hours",
            KeyName: "Online Hours",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "offline" && (param?.["data"]?.parameters.FLAG == "UPDATE_OFFLINE_DAYS" || param?.["data"]?.parameters.FLAG == "DELETE_OFFLINE_DAYS"
      || param?.["data"]?.parameters.FLAG == "GETALLOFFLINEDAYS" || param?.["data"]?.parameters.FLAG == "INSERTOFFLINEDAYS" || param?.["data"]?.parameters.flag == "OFFLINE_DAYS_BULK_DELETE" || param?.["data"]?.parameters.flag == "ACTIVATE_OFFLINEDAYS")) {

      let action = ""
      if (param?.["data"]?.parameters.FLAG == "INSERTOFFLINEDAYS") {
        action = "INSERT"
      }
      if (param?.["data"]?.parameters.FLAG == "GETALLOFFLINEDAYS") {
        action = "GET"
      }
      if (param?.["data"]?.parameters.FLAG == "DELETE_OFFLINE_DAYS") {
        action = "DELETE"
      }
      if (param?.["data"]?.parameters.FLAG == "UPDATE_OFFLINE_DAYS") {
        action = "UPDATE"
      }
      if (param?.["data"]?.parameters.flag == "OFFLINE_DAYS_BULK_DELETE") {
        action = "BULK DELETE"
      }
      if (param?.["data"]?.parameters.flag == "ACTIVATE_OFFLINEDAYS") {
        action = "ACTIVATE"
      }

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Setting",
            Category: "Setting",
            SubCategory: "Config Manager",
            Module: "Offline Days",
            KeyName: "Offline Days",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "rptv1agentperform") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Agent Performance",
            KeyName: "Agent Performance",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "rptv1agentstatus") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Agent Status",
            KeyName: "Agent Status",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "agentutilizationdash") {

      let action = param?.["data"]?.parameters.FLAG

      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Agent Utilization",
            KeyName: "Agent Utilization",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "lgbotreport") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Bot",
            KeyName: "Bot",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "hsmssummarydetails") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "HSM Summary",
            KeyName: "HSM Summary",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "hourlyinteractioncount") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Hourly Wise Interaction",
            KeyName: "Hourly Wise Interaction",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "interaction") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Interaction Details",
            KeyName: "Interaction Details",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "agentloginlogout") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Login/Logout",
            KeyName: "Login/Logout",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "rptv1noteready") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Not Ready Breakup",
            KeyName: "Not Ready Breakup",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "rptv1offlinemsg") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Offline Interactions",
            KeyName: "Offline Interactions",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "rptv1abandoned") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Overruled/Abandoned",
            KeyName: "Overruled/Abandoned",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "Transcript") {

      let action = param?.["data"]?.parameters.FLAG


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Reports",
            Category: "Reports",
            SubCategory: "",
            Module: "Agent Performance",
            KeyName: "Agent Performance",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }


    else if (param?.["data"]?.spname == "UNFYD_ADM_REALTIMEDASHBOARD_V2") {

      let action = param?.["data"]?.parameters.hasOwnProperty('FLAG') ?  param?.["data"]?.parameters.FLAG : param?.["data"]?.parameters.flag


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Dashboard",
            Category: "Works",
            SubCategory: "",
            Module: "Works",
            KeyName: "Works",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "realtimedashboard") {

      let action = param?.["data"]?.parameters.hasOwnProperty('FLAG') ?  param?.["data"]?.parameters.FLAG : param?.["data"]?.parameters.flag


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Dashboard",
            Category: "Works",
            SubCategory: "",
            Module: "Works",
            KeyName: "Works",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

    else if (param?.["data"]?.spname == "dashboardgraphs") {

      let action = param?.["data"]?.parameters.hasOwnProperty('FLAG') ?  param?.["data"]?.parameters.FLAG : param?.["data"]?.parameters.flag


      obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            FLAG: "INSERT",
            Type: "Dashboard",
            Category: "Works",
            SubCategory: "",
            Module: "Works",
            KeyName: "Works",
            URL: url,
            RequestType: "POST",
            Header: "Authorization",
            AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
            RequestFormat: "JSON",
            SampleRequest: JSON.stringify(param),
            SampleResponse: response,
            ProductId: 11,
            ProcessId: 1,
            IsDeleted: false,
            CreatedBy: "1",
            PublicIP: "",
            PrivateIP: "",
            BrowserName: "",
            BrowserVersion: "",
            Action: action,
            FailureStatus: failstatus,
            ResponseTime: Math.round(Number(requestDuration))
          }
        }

      }

      let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
      return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

      })

    }

  } else if(param && param.hasOwnProperty('data') && param.data.hasOwnProperty('parameters') && (param?.["data"]?.parameters.hasOwnProperty('flag') || param?.["data"]?.parameters.hasOwnProperty('FLAG'))){
      if (param?.["data"]?.parameters.flag == "REALTIME") {

        let action = param?.["data"]?.parameters.hasOwnProperty('FLAG') ?  param?.["data"]?.parameters.FLAG : param?.["data"]?.parameters.flag


        obj = {
          data: {
            spname: "USP_UNFYD_API_CONSOLE",
            parameters: {
              FLAG: "INSERT",
              Type: "Dashboard",
              Category: "BOT",
              SubCategory: "",
              Module: "BOT",
              KeyName: "BOT",
              URL: url,
              RequestType: "POST",
              Header: "Authorization",
              AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
              RequestFormat: "JSON",
              SampleRequest: JSON.stringify(param),
              SampleResponse: response,
              ProductId: 11,
              ProcessId: 1,
              IsDeleted: false,
              CreatedBy: "1",
              PublicIP: "",
              PrivateIP: "",
              BrowserName: "",
              BrowserVersion: "",
              Action: action,
              FailureStatus: failstatus,
              ResponseTime: Math.round(Number(requestDuration))
            }
          }

        }

        let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
        return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

        })

      }

      else if (param?.["data"]?.parameters.flag == "REALTIME") {

        let action = param?.["data"]?.parameters.hasOwnProperty('FLAG') ?  param?.["data"]?.parameters.FLAG : param?.["data"]?.parameters.flag

        obj = {
          data: {
            spname: "USP_UNFYD_API_CONSOLE",
            parameters: {
              FLAG: "INSERT",
              Type: "Dashboard",
              Category: "BOT",
              SubCategory: "",
              Module: "BOT",
              KeyName: "BOT",
              URL: url,
              RequestType: "POST",
              Header: "Authorization",
              AuthToken: 'bearer ' + localStorage.getItem('authtoken'),
              RequestFormat: "JSON",
              SampleRequest: JSON.stringify(param),
              SampleResponse: response,
              ProductId: 11,
              ProcessId: 1,
              IsDeleted: false,
              CreatedBy: "1",
              PublicIP: "",
              PrivateIP: "",
              BrowserName: "",
              BrowserVersion: "",
              Action: action,
              FailureStatus: failstatus,
              ResponseTime: Math.round(Number(requestDuration))
            }
          }

        }

        let encryptdata = this.setEncrypted('123456$#@$^@1ERF', JSON.stringify(obj))
        return this.http.post(ReqURL, { data: encryptdata }, httpOptions).subscribe((e: any) => {

        })

      }
    }
  }
    // else if()





    // Uncomment to call API

    //       return this.http.post("https://nipunuat.unfyd.com:3001/api/index", obj, httpOptions).subscribe((e : any) => {

    // })


  }




  getDecrypted(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);

    if (value?.results) {
      var decrypted = CryptoJS.AES.decrypt(value.results, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      let decrpted = decrypted.toString(CryptoJS.enc.Utf8);
      if (decrpted !== "") {
        let jsonparse = JSON.parse(decrpted)
        value.results = jsonparse;
      }

      return value;
    }

    if (value?.message) {
      var decrypted = CryptoJS.AES.decrypt(value.message, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      let decrpted = decrypted.toString(CryptoJS.enc.Utf8);
      if (decrpted !== "") {
        let jsonparse = JSON.parse(decrpted)
        value.message = jsonparse;
      }

      return value;
    }


    if (value?.data) {
      var decrypted = CryptoJS.AES.decrypt(value.data, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      let decrpted = decrypted.toString(CryptoJS.enc.Utf8);
      if (decrpted !== "") {
        let jsonparse = JSON.parse(decrpted)
        if (jsonparse.data) {
          value.data = jsonparse.data;
        } else {
          value.data = jsonparse;
        }
      }

      return value;
    }


    // return decrypted.toString(CryptoJS.enc.Utf8);
  }


  setEncrypted(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return encrypted.toString();
  }

  IsApiConsoleONfunc(){
    try{
    let LocalStorageData = localStorage.getItem('masterConfig');
      if(LocalStorageData){
        let ParseData = JSON.parse(LocalStorageData)
          if(ParseData?.Isapiconsoleon)
          {
            this.IsAPIconsoleOn = ParseData.Isapiconsoleon == "true" ? true : false
          }
      }
   }catch(err){
    console.log('IsApiConsoleONfunc Errr',err);    
   }

  }


}







