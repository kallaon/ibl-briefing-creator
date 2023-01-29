import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBLRequest } from '../models/models';

@Injectable()
export class DataService {
  private readonly _API_URL = 'https://ogcie.iblsoft.com/ria/opmetquery';

  constructor(private readonly _httpClient: HttpClient) {}

  postData(data: IBLRequest): Observable<any> {
    return this._httpClient.post<any>(this._API_URL, data);
  }
}
