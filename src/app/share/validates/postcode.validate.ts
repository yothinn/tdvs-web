import { AbstractControl, ValidatorFn } from "@angular/forms";

export function validatePostCode(myArray: any[]): ValidatorFn {
    if (myArray.length === 0) return null;
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        let selectboxValue = c.value;
        //console.log(myArray);
        //console.log(selectboxValue);
        let pickedOrNot = myArray.filter((alias) => {
        return alias.postcode === selectboxValue;
        });
        //console.log(pickedOrNot.length);
        if (pickedOrNot.length > 0) {
        // everything's fine. return no error. therefore it's null.
        return null;
        } else {
        //there's no matching selectboxvalue selected. so return match error.
        return { match: true };
        }
};
}