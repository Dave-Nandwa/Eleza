import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTreesPage } from './user-trees.page';

describe('UserTreesPage', () => {
  let component: UserTreesPage;
  let fixture: ComponentFixture<UserTreesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTreesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTreesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
