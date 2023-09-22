import { LightningElement, api,track } from 'lwc';
//labels
import CREATE_NEW_CONTACT from '@salesforce/label/c.Create_new_contact';
import EDIT_CONTACT from '@salesforce/label/c.Edit_contact';
import FIRST_NAME from '@salesforce/label/c.First_Name';
import LAST_NAME from '@salesforce/label/c.Last_Name';
import EMAIL from '@salesforce/label/c.Email';
import PHONE from '@salesforce/label/c.Phone';
import ADDRESS from '@salesforce/label/c.Address';

export default class ContactModal extends LightningElement {
    label = {
       CREATE_NEW_CONTACT,
       EDIT_CONTACT,
       FIRST_NAME,
       LAST_NAME,
       EMAIL,
       PHONE,
       ADDRESS
    };
    @api showContactModal;
    @api newContactModal;
    @api editContactModal;
    @api contactToEdit;
    @track saveButtonDisabled = this.isInputValid();
    contact = {};

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
            this.contact[inputField.name] = inputField.value;
        });
        if(this.editContactModal && this.contactToEdit){
            this.contact['id'] = this.contactToEdit.id;
        }
        return isValid;
    }

    createContact(){
        if(this.isInputValid() && this.newContactModal) {
            this.dispatchEvent(new CustomEvent('createcontact', {detail: this.contact}));
        }else if(this.isInputValid() && this.editContactModal){
            this.dispatchEvent(new CustomEvent('editcontact', {detail: this.contact}));
        }
    }
}