import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { GlobalService } from '../_service/global.service';

@Component({
  selector: 'app-course-manager',
  templateUrl: './course-manager.component.html',
  styleUrls: ['./course-manager.component.css']
})
export class CourseManagerComponent implements OnInit {
  courseList = [];
  baseUrl = "/course";

  
  // for modal
  display = 'none';
  id;
  courseName;
  courseId;
  courseStatus;
  industrailSector;
  courseLevel;
  course_duration;
  startDate;
  endDate;
  noOfApplicants;
  noOfStdCertified;
  batchNo;
  trainingLocation;
  trainers;
  @ViewChild('myModal') myModal;
    private modalRef;

   // for datatable
   @ViewChildren(DataTableDirective)
   dtElements: QueryList<DataTableDirective>;
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   dtTrigger1: Subject<any> = new Subject();
   isDtInitialized:boolean = false;
   isDtInitialized1:boolean = false;

  constructor(private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private modalService: ModalManager) { }

  ngOnInit(): void {
    this.getCourseList();
  }

  getCourseList(){
        this.globalService.getRequest(this.baseUrl +'/list')
      .subscribe(data => {
        this.courseList = data;
        this.dtTrigger.next();
      })
  }
  onCloseHandled() {
    this.display = 'none';
    this.modalService.close(this.modalRef);
  }
  openModal(object: any) {
    this.display = 'block';
    //modal data
    this.courseName = object.courseName;
    this.id =  object.id;
    this.industrailSector = object.industrailSector;
    this.courseId =object.courseId
    this.courseLevel = object.courseLevel
    this.courseStatus =object.courseStatus
    this.endDate =object.endDate
    this.startDate = object.startDate
    this.trainingLocation =object.trainingLocation
    this.noOfApplicants = object.noOfApplicants
    this.noOfStdCertified = object.noOfStdCertified
    this.batchNo = object .batchNo
    this.trainers = object.trainers.trainerName

    this.modalRef = this.modalService.open(this.myModal, {

      //modal properties
      size: "lg",
      modalClass: 'mymodal',
      hideCloseButton: false,
      centered: true,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
  })
  }

  

}
