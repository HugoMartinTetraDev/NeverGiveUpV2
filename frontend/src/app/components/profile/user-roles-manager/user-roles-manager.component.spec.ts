import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesManagerComponent } from './user-roles-manager.component';

describe('UserRolesManagerComponent', () => {
  let component: UserRolesManagerComponent;
  let fixture: ComponentFixture<UserRolesManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRolesManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRolesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
