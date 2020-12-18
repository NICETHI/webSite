import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('popupRouterOutlet', { read: ViewContainerRef })
  private popupRouterOutlet: ViewContainerRef;
  @ViewChild('popupContainer', { read: ViewContainerRef })
  private popupContainer: ViewContainerRef;

  public showOutlet: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  openSideRoute(event: any) {
    this.showOutlet = true;
  }

  closeSideRoute(event: any) {
    this.showOutlet = false;
  }
}
