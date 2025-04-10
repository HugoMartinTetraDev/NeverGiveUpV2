import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  username = 'Guest';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Get the current user from the auth service
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.username = `${currentUser.firstName} ${currentUser.lastName}`;
    }
  }
} 