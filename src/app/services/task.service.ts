import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  newTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.api}/todo`, task);
  }

  getTask(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.api}/todo`);
  }

  deleteTask(id: any): Observable<Task> {
    return this.http.delete(`${this.api}/todo/${id}`);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.api}/todo/${task.id}`, task);
  }
}
