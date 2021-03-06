import { Component, OnDestroy, OnInit } from '@angular/core';  // Importing libraries
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from 'src/app/services/backend.service';
import { External } from 'src/interfaces/database';

import { ResizedEvent } from 'angular-resize-event';

@Component({                                              // Angular stuff: Needs to be declared for every components
  selector: 'app-register',         // How we are going to use this component inside HTML(<app-register></app-register>)
  templateUrl: './register.component.html',   // Linking this .ts file with HTML file
  styleUrls: ['./register.component.scss']    // Linking this .ts file with CSS file
})
export class RegisterComponent implements OnInit, OnDestroy {  //To act as JS from the page
  width: any;
  height: any;

  public currentUrl: SafeResourceUrl; // This is just the syntax, declaring the variables and assigning it 
  public showInfo = '';

  private routeSubscription: Subscription;  // This is variable that can be subscribed by the others and pass information

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.showInfo = paramMap.get('form') ?? '';
      this.updateState();
    });
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {}

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  updateState() {
    const form = this.showInfo.charAt(0).toUpperCase() + this.showInfo.slice(1);
    this.api
      .getExternal(`registration${form}Form`)
      .then((result: External[]) => this.updateSrc(result[0].value));
  }

  changeUrl(param: string) {
    this.router.navigate(['/register', param]);
  }

  updateSrc(url: string) {
    const oldUrl = (this.currentUrl as any)
      ?.changingThisBreaksApplicationSecurity;
    if (oldUrl !== '' && oldUrl === url) {
      return;
    }
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
