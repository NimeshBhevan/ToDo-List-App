import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit, OnDestroy {
  // @ViewChild('exampleModal')
  // exampleModal!: ElementRef;
  taskform: FormGroup = new FormGroup({});
  taskList: Task[] = [];
  editmode: boolean = false;
  task_id: string | undefined = '';

  constructor(
    private fb: FormBuilder,
    private task: TaskService,
    private localstorage: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskform = this.fb.group({
      title: [''],
      description: [''],
      done: [false],
      date: [new Date().toISOString()],
    });
    this.getTask();
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     if (this.exampleModal) {
  //       this.exampleModal.nativeElement.addEventListener(
  //         'hidden.bs.modal',
  //         () => {
  //           this.resetform(), (this.editmode = false);
  //         }
  //       );
  //     }

  //   }, 0)

  // }

  ngOnDestroy(): void {}
  // POST method
  addTask() {
    this.task.newTask(this.taskform.value).subscribe(() => {
      this.resetform();
      this.getTask();
    });
  }

  editTask(task: Task) {
    this.editmode = true;
    this.task_id = task.id;
    this.taskform.setValue({
      title: task.title,
      description: task.description,
      done: task.done,
      date: task.date,
    });
  }

  updateTask() {
    const todoTask: Task = {
      id: this.task_id,
      title: this.taskform.controls['title'].value,
      description: this.taskform.controls['description'].value,
      done: this.taskform.controls['done'].value,
      date: this.taskform.controls['date'].value,
    };

    this.task.updateTask(todoTask).subscribe(() => {
      this.task_id = '';
      this.resetform();
      this.getTask();
    });
  }

  // GET method
  private getTask() {
    this.task.getTask().subscribe((response) => {
      return (this.taskList = response);
    });
  }

  // DELETE method
  deleteTask(id: any) {
    this.task.deleteTask(id).subscribe(() => {
      this.getTask();
    });
  }

  close() {
    this.resetform();
  }
  // reset the form to its initial values after submitting it
  private resetform() {
    this.taskform.reset({
      done: false,
      date: new Date().toISOString(),
    });
    this.editmode = false;
  }

  logout() {
    this.localstorage.removeToken();
    this.router.navigate(['/login']);
  }
}
