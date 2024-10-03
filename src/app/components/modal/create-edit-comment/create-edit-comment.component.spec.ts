import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCommentComponent } from './create-edit-comment.component';

describe('CreateEditCommentComponent', () => {
  let component: CreateEditCommentComponent;
  let fixture: ComponentFixture<CreateEditCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
