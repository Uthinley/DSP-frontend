import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { ModalManager } from 'ngb-modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_service/auth.service';
import { GlobalService } from '../_service/global.service';
// import {Chart} from '';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isStudent = false;
  isAdmin = false;
  labels = [];
  barLabels = [];
  data = [];
  barData=[];
  searchForm: FormGroup;
  isValid : boolean =  false;
  displayViewStd = 'none';
  coursesTakenList = [];
  recommendedCourse = [];
  courseIDTaken = [];
  errorMessage ;
  profileDetail;
  userDetail;
  cid;
  departmentList= [];
  studentDtls = [];
  // report : any;
  obj1 : any;
  obj2 : any;
  obj3: any;
  obj4: any;
  tracerPercentage;
  isSubAdmin = false;
  myChart;
  canvas;
   ctx;
   chart : any;
   
 


  @ViewChild('modalStdDtls') modalStdDtls;
  private modalStdDtlsref;
  // canvas: any;
  // ctx: any;

  
   
  constructor(private authService: AuthService,
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: ModalManager
    ) { }


  ngOnInit(): void {
    this.checkStudent();
    this.checkAdmin();
    this.checkSubAdmin();
    this.searchForm = this.formBuilder.group({
      studentInfo : ['', Validators.required]
    })

  }

  getTotalCourseBySector(){
    this.globalService.getRequest('/master/getTotalCourseBySector').subscribe(data=>{
      for(let d of data){
        this.labels.push(d.obj2);
        this.data.push(d.obj1);
      }
      this.viewChart();
    });
  }
  getTotalbyCourseStatus(){
    this.globalService.getRequest('/master/getTotalbyCourseStatus').subscribe(data=>{
      this.barData.push(data.obj1);
      this.barData.push(data.obj2);
      this.barData.push(data.obj3);
      this.viewChart2();
    });
  }

  ngAfterViewInit() {
    this.getTotalCourseBySector();
    this.getTotalbyCourseStatus();
    
    // this.viewChart2();
  }
  viewChart2(){
     //-------------
    //- DONUT CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    this.canvas = document.getElementById('courseStatus');
    this.ctx = this.canvas.getContext('2d');
     const donutData        = {
      labels: ["Completed", "On-going", "Future"],
      datasets: [
        {
          labels : "",
          data: this.barData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          
          ],
          borderWidth: 1
        }
      ]
    }
     const donutOptions     = {
      maintainAspectRatio : false,
      responsive : true,
    }
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    new Chart(this.ctx, {
      type: 'bar',
      data: donutData,
      options: donutOptions
    })

  }

  viewChart(){
     //-------------
    //- DONUT CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    this.canvas = document.getElementById('mychart');
    this.ctx = this.canvas.getContext('2d');
     const donutData        = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor : ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de','#F39C12','#2E4053','#196F3D','#6E2C00'],
        }
      ]
    }
     const donutOptions     = {
      maintainAspectRatio : false,
      responsive : true,
    }
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    new Chart(this.ctx, {
      type: 'doughnut',
      data: donutData,
      options: donutOptions
    })

  }
 
  checkSubAdmin(){
    const roles = this.authService.getUserRole();
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const subAdminRole = '2';
      if (role === subAdminRole ){
        this.isSubAdmin = true;
      }
      // console.log(roles[index].authority.slice(0, roles[index].authority.indexOf('-')));
    }
  }

  checkStudent(){
    const roles = this.authService.getUserRole();
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const userRole = '3';
      if (role === userRole){
        this.isStudent = true;
        this.getUserCid(this.authService.getUserName());
      }
    }
  }
  checkAdmin() {
    const roles = this.authService.getUserRole();
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index].authority.slice(0, roles[index].authority.indexOf('-'));
      const adminRole = '1';
      if (role === adminRole ){
        this.isAdmin = true;
        this.getReport();
      }
      // console.log(roles[index].authority.slice(0, roles[index].authority.indexOf('-')));
    }
  }

  getReport(){
    this.globalService.getRequest('/home/getReport').subscribe(data=>{
      this.obj1 = data.obj1;
      this.obj2 = data.obj2;
      this.obj3 = data.obj3;
      this.obj4 = data.obj4;
      this.tracerPercentage = data.obj5 + "%";
    });
  }

  getUserCid(username){
    this.globalService.getByParamRequest('/student/findUserDetailByUsername', username).subscribe(data => {
      this.userDetail = data;
      this.cid = data.cid;
      this.getProfile(this.cid);
    });
  }
  getProfile(cid){
    this.globalService.getByParamRequest('/student/findStudentBycid', cid).subscribe(data => {
      this.profileDetail = data;
      // alert(JSON.stringify(data));
    });
  }

  searchStudent(){
    const formData = new FormData();
    formData.append('info', JSON.stringify(this.searchForm.value));
    if(this.searchForm.invalid){
      this.toastr.warning("Please enter in the feild.");
      return;
    }
    this.globalService.getByParamRequest('/student/findStudent',this.searchForm.value.studentInfo).subscribe(data => {
      this.studentDtls = data;
      if (this.studentDtls !== null && Object.keys(data).length!==0){
        this.isValid = false;
    
      }else{
        this.isValid =true;
        this.errorMessage ="Invalid CID or Details not found";
      }
    })
  }

  openModalStd(object, studentId){
    this.coursesTakenList = object.courses;
    //loop to get the department id
    for(let c of object.courses){
      this.courseIDTaken.push(c.courseMaster.courseId);
      if(!this.departmentList.includes(c.courseMaster.department.id)){
          this.departmentList.push(c.courseMaster.department.id);
          // this.recommendedCourse.push(this.getRecommendedCourse(c.courseMaster.department.id));
          this.getRecommendedCourse(c.courseMaster.department.id)
      }
    }
    
    this.departmentList=[];
    // this.getRecommendedCourse(object.courses);
    this.displayViewStd = "block";
    this.modalStdDtlsref = this.modalService.open(this.modalStdDtls, {
       //modal properties
       size: "xl",
       modalClass: 'modalStdDtls',
       hideCloseButton: false,
       centered: true,
       backdrop: true,
       animation: true,
       keyboard: false,
       closeOnOutsideClick: false,
       backdropClass: "modal-backdrop"
    })
    this.recommendedCourse =[];
  }

  getRecommendedCourse(deptid){
       this.globalService.getByParamRequest('/master/getRecommendedCourseByDeptId', deptid).subscribe(data => {
         this.recommendedCourse.push(data);
        //  alert(JSON.stringify(data))
    console.log(this.recommendedCourse)

    });
  }

  addToDepartmentList(deptId){
    this.departmentList.push(deptId);
  }


}
