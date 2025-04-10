import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPurchaseComponent} from './customer-purchase.component';

describe('CustomerPurchaseComponent', () => {
  let component: CustomerPurchaseComponent;
  let fixture: ComponentFixture<CustomerPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
