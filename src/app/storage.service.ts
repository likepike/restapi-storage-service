import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class StorageService {

  private storage: any;

  constructor(private http: HttpClient) {
      this.storage = {};
  }

  public getCollection(url: string): Observable<any> {

      // ищем по url в хранилище
      if (this.storage.hasOwnProperty(url)) {

        // в хранилище уже есть такой key, возвращаем его subject
        console.log(`Storage key '${url}' found`);
        return this.storage[url].subject;

      } else {

        // если нет такого ключа, создадим в хранилище новый пустой объект и запустим запрос на сервер
        console.log(`Storage key '${url}' NOT found`);
        return this.createCollection(url);

      }

  }

  private createCollection(url: string): Observable<any> {

    // создаем новую запись, в которой будет subject, он будет рассылать результаты подписчикам
    const storageEntry = {
      isLoading: true,
      list: [],
      subject: new ReplaySubject(1)
    };

    // кладем в хранилище новую запись с ключом url, в ней же будет лежать и subject
    this.storage[url] = storageEntry;

    // начинаем запрос
    console.log(`Starting HTTP request for '${url}'`);
    this.http.get(url).subscribe(
      (response: any) => {
        // когда придет ответ - кладем в хранилище и запускаем рассылку
        console.log(`Got response from '${url}'`);
        storageEntry.list = response;
        storageEntry.subject.next(response);
      }
    );

    // возвращаем созданный новый subject
    return storageEntry.subject;
  }

}
