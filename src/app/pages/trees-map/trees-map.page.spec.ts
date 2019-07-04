import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreesMapPage } from './trees-map.page';

describe('TreesMapPage', () => {
  let component: TreesMapPage;
  let fixture: ComponentFixture<TreesMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreesMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
