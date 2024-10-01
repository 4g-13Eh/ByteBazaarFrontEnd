import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../models/user.model";
import {jwtDecode} from "jwt-decode";
import {TokenService} from "./token.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient:HttpClient = inject(HttpClient);
  private token: string | null = inject(TokenService).getToken();
  private username: string | undefined = this.extractUsername(this.token);

  public getUserByEmail(): Observable<UserModel>{
    return this.httpClient.get<UserModel>(`http://localhost:8080/api/users/email/${this.username}`)
  }

  private extractUsername(token: string | null): string | undefined {
    if (!token) return;
    return jwtDecode(token).sub;
  }
}
