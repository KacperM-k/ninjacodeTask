import { LightningElement, api } from 'lwc';
import FIRST_NAME from '@salesforce/label/c.First_Name';
import LAST_NAME from '@salesforce/label/c.Last_Name';
import EMAIL from '@salesforce/label/c.Email';
import PHONE from '@salesforce/label/c.Phone';
import ADDRESS from '@salesforce/label/c.Address';
import INDEX from '@salesforce/label/c.Index';
import CREATED_DATE from '@salesforce/label/c.Created_Date';
import DELETE from '@salesforce/label/c.Delete';

const label = {
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    PHONE,
    ADDRESS,
    INDEX,
    CREATED_DATE
 };
const columns = [
    { label: label.INDEX, fieldName: 'number' },
    { label: label.FIRST_NAME, fieldName: 'firstName'},
    { label: label.LAST_NAME, fieldName: 'lastName'},
    { label: label.PHONE, fieldName: 'phoneNumber' },
    { label: label.EMAIL, fieldName: 'email', type: 'email' },
    { label: label.ADDRESS, fieldName: 'address' },
    { label: label.CREATED_DATE, fieldName: 'createdDate', type: 'date'},
];

export default class DeleteContactsModule extends LightningElement {
    label = {
        DELETE
     };
    @api tableData;
    @api showDeleteModal;
    columns = columns;
    rowOffset = 0;

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    deleteContacts(){
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        this.dispatchEvent(new CustomEvent('deletecontacts', {detail: selectedRecords}));
    }
}