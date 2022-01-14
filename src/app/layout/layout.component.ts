import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  currentUser;

  constructor(private http: HttpClient,public authService: AuthService,private _snackBar: MatSnackBar) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getUser();
  }


  async logout(){
    try{
      this.authService.doLogout();
    }catch(e) {
      console.log(e);
      this._snackBar.open(`Something went wrong please try again`, 'close' , {duration: 2000});
    }
  }
}
