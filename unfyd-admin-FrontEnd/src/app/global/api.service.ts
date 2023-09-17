import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError,EMPTY, from, of } from 'rxjs';
import { catchError, retry, map, switchMap, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {spnamekey,endpoint} from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';
import { TokenExpiredDialogComponent } from 'src/app/components/dialog/tokenExpiredDialog';
import { Router } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  spnamekey:any
  endpoint:any
  tokenExpiredVar = false;
  userDetails;
  campaignId:any;
  campaignListTableIndex:any;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {
    Object.assign(this, { spnamekey,endpoint});
    setInterval(() => {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'bearer ' + localStorage.getItem('authtoken')
        })
      };
    }, 10);
  }



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('authtoken')
    })
  };

  NoTokenhttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };



////CX1/////////////////////////////

  public post(endPoint, data): Observable<any>{
    if(endPoint == 'upload'){
      return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => {this.handleError(e); return throwError(e); })
      )
    } else if(endPoint == 'pitch/index'){
      return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => { this.handleError(e);      
          return throwError(e); })
      )
    }
    else if (endPoint == 'pitch/upload') {
      return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
        tap((response: any) => { if (response) { this.GetSetTokenLocalStorage(response); } }),
        catchError((e:any) => {
          this.handleError(e);
          return throwError(e);
        })
      )
    }
    else if(endPoint == 'securitycompliance'){

      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
      return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
        map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => {this.handleError(e); return throwError(e); })
      );

    }else if(endPoint == 'securitycompliance/update'){
      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
      return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
        map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => {this.handleError(e); return throwError(e); })
      );

    }else if(endPoint == 'securitycompliance/delete'){
      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
      return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
        map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => {this.handleError(e); return throwError(e); })
      );
    }else if(endPoint == 'otherservice'){

      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
      return this.http.post(environment.base_url + endPoint, dataobj, this.NoTokenhttpOptions).pipe(
        map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
        catchError(e => {this.handleError(e); return throwError(e); })
      );

    }else if(endPoint == 'notification'){
      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
          return this.http.post('http://localhost:8989/api/ReportScheduler/NotificationManager', dataobj).pipe(
            tap((response: any) => {if(response){return response}}),
            catchError(e => {this.handleError(e); return throwError(e); })
          );
    }else if(endPoint == 'ScheduleInsertRedis'){
      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
      return this.http.post(environment.base_url3 + 'ScheduleApi', dataobj, this.httpOptions).pipe(
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => {this.handleError(e); return throwError(e); })
        );
    }else if(endPoint == 'pitch/upload'){

      return this.http.post('https://nipunuat.unfyd.com:3001/api/' + endPoint, data, this.httpOptions).pipe(
        tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        catchError(e => {this.handleError(e); return throwError(e); })

      );
    }else if(endPoint == 'branding'){
      let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
      let dataobj = {data: encrpytedjson}
      return this.http.post(environment.base_url + endPoint, dataobj, this.NoTokenhttpOptions).pipe(
        map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
        catchError(e => {this.handleError(e); return throwError(e); })
      );

    }else if(Object.keys(spnamekey).includes(data.data.spname)){
      data.data.spname = spnamekey[data.data.spname];

      if(
      data.data.spname == 'usp_unfyd_user_session' || data.data.spname == 'usersession' ||
      data.data.spname == 'unfyd_logout_inactive_user' || data.data.spname == 'logoutinactiveuser' ||
      data.data.spname == 'usp_unfyd_login_logout' || data.data.spname == 'loginout'  ||
      data.data.spname == 'usp_unfyd_alert_msg_config'  || data.data.spname == 'alertmsgconfig' )
      {
          // return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
          //   catchError(this.handleError)
          // );

          let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
          let dataobj = {data: encrpytedjson}

          return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
            map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
            catchError(e => {this.handleError(e); return throwError(e); })
          );
      }
      else{
          let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
          let dataobj = {data: encrpytedjson}

          return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
            map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
            tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
            catchError(e => {this.handleError(e); return throwError(e); })
          );
      }

    }else{

      if(
        data.data.spname == 'usp_unfyd_user_session' || data.data.spname == 'usersession' ||
        data.data.spname == 'unfyd_logout_inactive_user' || data.data.spname == 'logoutinactiveuser' ||
        data.data.spname == 'usp_unfyd_login_logout' || data.data.spname == 'loginout'  ||
        data.data.spname == 'usp_unfyd_alert_msg_config'  || data.data.spname == 'alertmsgconfig' )
        {
            // return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
            //   catchError(this.handleError)
            // );

            let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
            let dataobj = {data: encrpytedjson}
            return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
              map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
              catchError(e => {this.handleError(e); return throwError(e); })
            );
        }
        else{
            let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
            let dataobj = {data: encrpytedjson}
            return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
              map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
              tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
              catchError(e => {this.handleError(e); return throwError(e); })
            );

         }
     }
  }


   LoginLogout(endPoint, data,authtoken): Observable<any> {
    const loginhttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + authtoken
      })
    };
      if(Object.keys(spnamekey).includes(data.data.spname)){
            //   data.data.spname = spnamekey[data.data.spname];
            // return this.http.post(environment.base_url + endPoint, data, loginhttpOptions).pipe(
            //   tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
            //   catchError(e => {this.handleError(e); return throwError(e); })
            // );
            let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
            let dataobj = {data: encrpytedjson}
            return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
              map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
              tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
              catchError(e => {this.handleError(e); return throwError(e); })
            );
      }
      else{
        // return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
        //   tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
        //   catchError(e => {this.handleError(e); return throwError(e); })
        // );
        let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
        let dataobj = {data: encrpytedjson}
        return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
          map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
          tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
          catchError(e => {this.handleError(e); return throwError(e); })
        );
      }
  }


  ForgotPassword(endPoint, data): Observable<any> {
  // return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //   catchError(e => {this.handleError(e); return throwError(e); })
  // );
  let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
  let dataobj = {data: encrpytedjson}
  return this.http.post(environment.base_url + endPoint, dataobj, this.httpOptions).pipe(
    map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)   ),
    tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
    catchError(e => {this.handleError(e); return throwError(e); })
  );

}





  ////////NipunUat////////NipunUat
  ////////NipunUat////////NipunUat
  // public post(endPoint, data): Observable<any>{
  //   if(endPoint == 'upload'){
  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //     )
  //   }else if(endPoint == 'securitycompliance'){
  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //         );
  //   }else if(endPoint == 'securitycompliance/update'){
  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //         );
  //   }else if(endPoint == 'securitycompliance/delete'){
  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //         );
  //   }else if(endPoint == 'otherservice'){
  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //     );
  //   }else if(endPoint == 'notification'){
  //     return this.http.post('http://localhost:3010/notification', data).pipe(
  //       tap((response: any) => {if(response){return response}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //     );
  //   }else if(endPoint == 'ScheduleInsertRedis'){
  //     return this.http.post('http://localhost:3001/api/ScheduleInsertRedis', data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //     );
  //   }else if(Object.keys(spnamekey).includes(data.data.spname)){
  //     data.data.spname = spnamekey[data.data.spname];

  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //     );
  //   }else{

  //     ///////Without SPKEY//////////
  //     return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //       tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //       catchError(e => {this.handleError(e); return throwError(e); })
  //     );
  //     //////////////////////////////

  //    }


  // }

  // LoginLogout(endPoint, data,authtoken): Observable<any> {
  // //NipunUat
  //   const loginhttpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'bearer ' + authtoken
  //     })
  //   };
  //     if(Object.keys(spnamekey).includes(data.data.spname)){
  //             data.data.spname = spnamekey[data.data.spname];
  //           return this.http.post(environment.base_url + endPoint, data, loginhttpOptions).pipe(
  //             tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //             catchError(e => {this.handleError(e); return throwError(e); })
  //           );
  //     }
  //     else{
  //       return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //         tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //         catchError(e => {this.handleError(e); return throwError(e); })
  //       );
  //     }
  // }

  // ForgotPassword(endPoint, data): Observable<any> {
  // return this.http.post(environment.base_url + endPoint, data, this.httpOptions).pipe(
  //   catchError(e => {this.handleError(e); return throwError(e); })
  // );
  // }
//   ////////NipunUat////////NipunUat
//   ////////NipunUat////////NipunUat




public pm2Api(endPoint, data): Observable<any>{
  let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',  JSON.stringify(data))
  let dataobj = {data: encrpytedjson}
  return this.http.post(environment.base_url + 'pm2Api/'+ endPoint, dataobj, this.httpOptions).pipe(
    tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
    catchError(e => {this.handleError(e); return throwError(e); })
    );
}


getPostmanMethod(url, body): Observable<any> {
  return this.http.get(url, body).pipe(
    catchError(e => {this.handleError(e); return throwError(e); })
  );
}
postPostmanMethod(url, body, header): Observable<Object> {
  return this.http.post(url, body, header).pipe(
    catchError(e => {this.handleError(e); return throwError(e); })
  );
}
putPostmanMethod(url, body, header, id): Observable<Object> {
  return this.http.put(url + '/' + id, body, header).pipe(
    catchError(e => {this.handleError(e); return throwError(e); })
  );
}
deletePostmanMethod(url, id): Observable<any> {
  return this.http.delete(url + '/' + id).pipe(
    catchError(e => {this.handleError(e); return throwError(e); })
  );
}


  public dynamicDashboard(url, data): Observable<any>{

    if(Object.keys(spnamekey).includes(data.data.spname)){
      data.data.spname = spnamekey[data.data.spname];

        if(data.data.spname == 'realtimedashboard' || data.data.spname == 'dashboardgraphs' || data.data.spname == 'UNFYD_ADM_REALTIMEDASHBOARD_Details_V2'|| data.data.spname == 'realtimedashboardv2'|| data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_Details_V2_EXPORT' || data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_DETAILS_V2_EXPORT')
        {
            let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
            let dataobj = {data: encrpytedjson}

            return this.http.post(url, dataobj, this.httpOptions).pipe(
              map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)),
              catchError(e => {this.handleError(e); return throwError(e); })
            );
         }
        else{
            return this.http.post(url, data, this.httpOptions).pipe(
              catchError(e => {this.handleError(e); return throwError(e); })
            );
        }
    }else{

        if(data.data.spname == 'realtimedashboard' || data.data.spname == 'dashboardgraphs' || data.data.spname == 'UNFYD_ADM_REALTIMEDASHBOARD_Details_V2' || data.data.spname == 'realtimedashboardv2' || data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_Details_V2_EXPORT' || data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_DETAILS_V2_EXPORT')
        {
              let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
              let dataobj = {data: encrpytedjson}

              return this.http.post(url, dataobj, this.httpOptions).pipe(
                map(response =>  this.getDecrypted('123456$#@$^@1ERF',response)),
                tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
                catchError(e => {this.handleError(e); return throwError(e); })
              );
        }
        else{
              return this.http.post(url, data, this.httpOptions).pipe(
                tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
                catchError(e => {this.handleError(e); return throwError(e); })
              );
        }
     }
  }

  public rawApi(url, data): Observable<any> {
    if (data) {
      //data.data.spname = spnamekey[data.data.spname];

      return this.http.post(url, data, { responseType: 'text' }).pipe(
        catchError(e => { this.handleError(e); return throwError(e); })
      );
    } else {

      ///////Without SPKEY//////////
      return this.http.post(url, data, { responseType: 'text' }).pipe(
        catchError(e => { this.handleError(e); return throwError(e); })
      );
      //////////////////////////////

    }

  }


  //////NipunUat//////NipunUat//////NipunUat
  // public dynamicDashboard(url, data): Observable<any>{

  //   if(Object.keys(spnamekey).includes(data.data.spname)){
  //     data.data.spname = spnamekey[data.data.spname];

  //       if(data.data.spname == 'realtimedashboard' || data.data.spname == 'dashboardgraphs' || data.data.spname == 'UNFYD_ADM_REALTIMEDASHBOARD_Details_V2'|| data.data.spname == 'realtimedashboardv2'|| data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_Details_V2_EXPORT' || data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_DETAILS_V2_EXPORT')
  //       {
  //           // let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
  //           // let dataobj = {data: encrpytedjson}

  //           return this.http.post(url, data, this.httpOptions).pipe(
  //             catchError(e => {this.handleError(e); return throwError(e); })
  //           );
  //        }
  //       else{
  //           return this.http.post(url, data, this.httpOptions).pipe(
  //             catchError(e => {this.handleError(e); return throwError(e); })
  //           );
  //       }
  //   }else{

  //       if(data.data.spname == 'realtimedashboard' || data.data.spname == 'dashboardgraphs' || data.data.spname == 'UNFYD_ADM_REALTIMEDASHBOARD_Details_V2' || data.data.spname == 'realtimedashboardv2' || data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_Details_V2_EXPORT' || data.data.spname =='UNFYD_ADM_REALTIMEDASHBOARD_DETAILS_V2_EXPORT')
  //       {
  //             // let encrpytedjson =   this.setEncrypted('123456$#@$^@1ERF',   JSON.stringify(data))
  //             // let dataobj = {data: encrpytedjson}

  //             return this.http.post(url, data, this.httpOptions).pipe(
  //               tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //               catchError(e => {this.handleError(e); return throwError(e); })
  //             );
  //       }
  //       else{
  //             return this.http.post(url, data, this.httpOptions).pipe(
  //               tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
  //               catchError(e => {this.handleError(e); return throwError(e); })
  //             );
  //       }
  //    }




  // }
  //////NipunUat//////NipunUat//////NipunUat







  public postAuth(endPoint, data){
    return this.http.post(environment.base_url2 + endPoint, data, this.httpOptions).pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }

  public post1(endPoint, data){
    return this.http.post(environment.base_url1 + endPoint, data).pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }
  public get1(endPoint){
    return this.http.get(environment.base_url1 + endPoint).pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }
  public getWithFilter(endPoint, data){
    return this.http.get(environment.base_url1 + endPoint + JSON.stringify(data)).pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }
  public put(endPoint, id, data){
    return this.http.put(environment.base_url1 + endPoint + id, data).pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }
  public postMaster(endPoint, data){
    return this.http.post(environment.master_url + endPoint, data).pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }
  postData(spName: string, query: any): Observable<any> {
    let loginDbReqParams={
      "storedproc": spName,
      "table": "",
      "type": "single",
      "query": query,
      "processingType": "callSp"
    }
    // const url = `${environment.link_url}`;
    return this.http.post<any>('url', loginDbReqParams)
  }

  postDataForLink(endPoint:any,spName: string, query: any): Observable<any> {
    let loginDbReqParams={
      "storedproc": spName,
      "table": "",
      "type": "single",
      "query": query,
      "processingType": "callSp"
    }
    // const url = `${environment.link_url2}` + endPoint;
    return this.http.post<any>('url', loginDbReqParams)
  }

  getIpAddress() {
    return this.http.get('https://api.ipify.org/?format=json').pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }

  getIpAddress2() {
    return this.http.get('https://jsonip.com/').pipe(
      tap((response: any) => {if(response){this.GetSetTokenLocalStorage(response);}}),
      catchError(e => {this.handleError(e); return throwError(e); })
    );
  }

  handleError(error) {

    let errorMessage:any;
    if (error.error instanceof ErrorEvent) {
      errorMessage = {message: `${error.error.message}`};
    } else {
      errorMessage = {code: `${error.status}`, message: `${error.message}`};
    }
    if (error?.error?.code == 401 || errorMessage?.code == 401) {
      this.tokenExpired()
    }
    if (error?.code == 401 || errorMessage?.code == 401) {
      this.tokenExpired()
    }
    return throwError(error);
  }

  tokenExpired() {
    let dialogRef
    if(!this.tokenExpiredVar){
      this.tokenExpiredVar = true
      dialogRef = this.dialog.open(TokenExpiredDialogComponent, {
        data:{
          "type": "alertView",
          "data": {
            "data": {
              "alertMsg": "TokenExpired",
              "alertMsgDur": "",
              "alertMsgPos": "center",
              "alertMsgType": "popup",
              "alertMsgSubType": "information",
              "description": "Your session has expired. Please relogin.",
              "language": "en",
              "msgBody": "Your session has expired. Please relogin.",
              "msgHead": "Session Expired",
              "selectBtn": "OK",
              "icon": "assets/images/icons/warning.png"
            }
          },
          inUse: true
        },

        width: "30vw",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((status) => {
        if (status) {
          this.tokenExpiredVar = false
        this.logout()
        }
      });
    }
  }


  logout(){
    this.userDetails = this.getUser();
    let a = this.getHawker()

    var obj1 = {
      data: {
        spname: "usp_unfyd_user_session",
        parameters: {
          flag: 'LOGOUT',
          userid: this.userDetails.Id,
        }
      }
    }
    this.post('index', obj1).subscribe(res => {
      if (res.code == 200) {
      }
    }, (error) => {
    })
    var obj2 = {
      data: {
        spname: "unfyd_logout_inactive_user",
        parameters: {
          flag: 'LOGOUT',
          AGENTID: this.userDetails.Id,
        }
      }
    }
    this.post('index', obj2).subscribe(res => {
      if (res.code == 200) {
      }
    }, (error) => {
    })


    localStorage.removeItem('menu');
    localStorage.removeItem('refreshDashboard');
    localStorage.removeItem('TenantChannel');
    localStorage.removeItem('authtoken');
    localStorage.removeItem('masterConfig');
    localStorage.removeItem('userConfig');
    localStorage.removeItem('labels');
    localStorage.removeItem('userChannelName');
    localStorage.removeItem('UserProfile');
    localStorage.removeItem('userLanguageName');
    localStorage.removeItem('parent_menu');
    localStorage.removeItem('products');
    localStorage.removeItem('authuser');
    localStorage.removeItem('localizationData');
    localStorage.removeItem('lang');
    localStorage.removeItem('authtoken');
    localStorage.removeItem('languagesByTenant');
    this.dialog.closeAll();
    if (a) {
      this.router.navigate(['beneficiary-login'])
    } else {
        this.router.navigate(['']);
    }
  }


  GetSetTokenLocalStorage(response)
  {
    if(response)
    {
      if(response.results?.TokenIndex)
      {
        if(response.results?.TokenIndex == undefined || response.results?.TokenIndex == '' || response.results?.TokenIndex == null )
        {}
        else{
          localStorage.removeItem("authtoken");
          localStorage.setItem("authtoken",response.results?.TokenIndex);
        }
      }
    }
  }
  getHawker(): string | false {
    let a = JSON.parse(localStorage.getItem('hawker'))
    return a;
  }
  getUser(): string | null {
    return JSON.parse(this.getDecryptedUser('123456$#@$^@1ERF', localStorage.getItem('authuser')));
  }

  getDecryptedUser(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  getDecrypted(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);

    if(value?.results){
        var decrypted = CryptoJS.AES.decrypt(value.results, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        let decrpted = decrypted.toString(CryptoJS.enc.Utf8);
        if(decrpted !== "")
        {
        let jsonparse = JSON.parse(decrpted)
        value.results = jsonparse;
        }

        return value;
    }
    if(value?.message){
        var decrypted = CryptoJS.AES.decrypt(value.message, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        let decrpted = decrypted.toString(CryptoJS.enc.Utf8);
        if(decrpted !== "")
        {
        let jsonparse = JSON.parse(decrpted)
        value.message = jsonparse;
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

}
