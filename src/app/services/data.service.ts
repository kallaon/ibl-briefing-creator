import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class DataService {
  private readonly _API_URL = 'https://ogcie.iblsoft.com/ria/opmetquery';

  constructor(
    private readonly _httpClient: HttpClient,
  ) {}

  postData(data: any): Observable<any> {
    return this._httpClient.post<any>(this._API_URL, data);
  }
}