import { AbstractControl } from "@angular/forms";

export function ValidatePID(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if(control.value.length === 0){
    return null;
  }
  let total = 0;
  let iPID;
  let chk;
  let Validchk;
  iPID = control.value;
  Validchk = iPID.substr(12, 1);
  var j = 0;
  var pidcut;
  for (var n = 0; n < 12; n++) {
    pidcut = parseInt(iPID.substr(j, 1));
    total = total + pidcut * (13 - n);
    j++;
  }

  chk = 11 - (total % 11);

  if (chk == 10) {
    chk = 0;
  } else if (chk == 11) {
    chk = 1;
  }
  if (chk != Validchk) {
    return { validPID: true };
  } else {
    return null;
  }
}

