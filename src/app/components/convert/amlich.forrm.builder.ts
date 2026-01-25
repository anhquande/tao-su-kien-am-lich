import { inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

// define the type of the FormGroup
export type AmlichFormGroup = FormGroup<{
  amlichEvents: FormControl<string>;
  startYear: FormControl<number>;
  endYear: FormControl<number | null>;
}>;
// get type of form value
export type AmlichFormValue = AmlichFormGroup['value'];

export class AmlichFormBuilder {

  private fb = inject(FormBuilder);

  public build(sampleInput: string, initStartYear: number, initEndYear: number | null): AmlichFormGroup {
    return this.fb.nonNullable.group({
      amlichEvents: this.fb.control<string>(sampleInput, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      startYear: this.fb.control<number>(initStartYear, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1900), Validators.max(3000)],
      }),
      endYear: this.fb.control<number | null>(initEndYear, {
        nonNullable: false,
        validators: [Validators.min(1900), Validators.max(3000)],
      }),
    });
  };
}