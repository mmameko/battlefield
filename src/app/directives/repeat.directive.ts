import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[repeat]'
})
export class RepeatDirective implements OnInit {
  @Input() repeat: number;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {}

  ngOnInit() {
    const initialCount = this.repeat;

    if (!this.repeat) {
      this.viewContainer.clear();
    }

    while (this.repeat) {
      this.viewContainer
        .createEmbeddedView(this.templateRef, { index: initialCount - this.repeat });
      this.repeat--;
    }
  }
}
