import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChangePassword } from '../entity/change-password';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public changePassword(
    oldpassword: string,
    newpassword: string
  ): Promise<void> {
    const changePassword: ChangePassword = {
      oldpassword,
      newpassword,
    };
    return new Promise<void>((resolve, reject) => {
      this.http
        .put<ChangePassword>(
          environment.apiEndpoint + '/user/password',
          changePassword
        )
        .subscribe(
          (data) => {
            resolve();
          },
          (error) => {
            console.log(error);
            reject();
          }
        );
    });
  }

  public unconnectMailAddress(mailAddress: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .delete<void>(environment.apiEndpoint + '/user/mail/' + mailAddress)
        .subscribe(
          (data) => {
            resolve();
          },
          (error) => {
            console.log(error);
            reject();
          }
        );
    });
  }

  public getNewConnectPassword(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.http
        .get(environment.apiEndpoint + '/user/connectpassword', {
          responseType: 'text',
        })
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            console.log(error);
            reject();
          }
        );
    });
  }
}
