import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/global/auth.service';
import { DatePipe } from '@angular/common';
import { NgxSummernoteModule } from 'ngx-summernote';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  userDetails: any;
  loginLoader: boolean = false;
  imgLoader: boolean[] = [];
  headerLoader: boolean = false;
  loginImg: any;
  form: FormGroup;
  Img: any;
  headerImg: any;
  loader: boolean = false;
  description:any;
  constructor(private common: CommonService, private api: ApiService, private formBuilder: FormBuilder,
    private auth: AuthService, public datepipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.form = this.formBuilder.group({
      productgroup: ['', [Validators.nullValidator]],
      category: ['', [Validators.nullValidator]],
      subcategory: ['', [Validators.nullValidator]],
      name: ['', [Validators.nullValidator]],
      loginImgStatus: ['', [Validators.nullValidator]],
      description: ['', [Validators.nullValidator]],
      buybutton: ['', [Validators.nullValidator]],
      buylink: ['', [Validators.nullValidator]],
      fromDate: ['', [Validators.nullValidator]],
      toDate: ['', [Validators.nullValidator]],
      status: ['', [Validators.nullValidator]],
    })
  }


  directUpload(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_branding_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {

      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("File Size");
          } else {
           
              this.loginLoader = true;
           
           

            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                
                  this.loginImg = res.results.URL;
                  this.loginLoader = false;
                  this.form.get('loginImgStatus').patchValue(this.loginImg);
               
              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }
}
