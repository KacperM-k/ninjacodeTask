import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//Apex methods
import getContactsList from "@salesforce/apex/PhoneNumbersTableController.getContactsList";
import insertContact from "@salesforce/apex/PhoneNumbersTableController.insertContact";
import updateContact from "@salesforce/apex/PhoneNumbersTableController.updateContact";
import deleteContact from "@salesforce/apex/PhoneNumbersTableController.deleteContact";
import deleteContacts from "@salesforce/apex/PhoneNumbersTableController.deleteContacts";
//labels
import ADD_CONTACT from '@salesforce/label/c.Add_Contact';
import EDIT from '@salesforce/label/c.Edit';
import DELETE from '@salesforce/label/c.Delete';
import FIRST_NAME from '@salesforce/label/c.First_Name';
import LAST_NAME from '@salesforce/label/c.Last_Name';
import EMAIL from '@salesforce/label/c.Email';
import PHONE from '@salesforce/label/c.Phone';
import ADDRESS from '@salesforce/label/c.Address';
import INDEX from '@salesforce/label/c.Index';
import CREATED_DATE from '@salesforce/label/c.Created_Date';
import DELETE_CONTACTS from '@salesforce/label/c.Delete_Contacts';

const label = {
    EDIT,
    DELETE,
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    PHONE,
    ADDRESS,
    INDEX,
    CREATED_DATE
 };

const actions = [
    { label: label.EDIT, name: 'edit' },
    { label: label.DELETE, name: 'delete' },
];

const columns = [
    { label: label.INDEX, fieldName: 'number' },
    { label: label.FIRST_NAME, fieldName: 'firstName'},
    { label: label.LAST_NAME, fieldName: 'lastName', sortable: true},
    { label: label.PHONE, fieldName: 'phoneNumber' },
    { label: label.EMAIL, fieldName: 'email', type: 'email' },
    { label: label.ADDRESS, fieldName: 'address' },
    { label: label.CREATED_DATE, fieldName: 'createdDate', type: 'date', sortable: true},
    { type: 'action', typeAttributes: { rowActions: actions}},
];

export default class PhoneNumbersTable extends LightningElement {
    label = {
        ADD_CONTACT,
        DELETE_CONTACTS
    };

    @track data = [];
    columns = columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    @track contactToEdit;
    showContactModal = false;
    newContactModal = false;
    editContactModal = false;
    showDeleteModal = false;
    
    connectedCallback(){
        getContactsList()
            .then((result => {
                this.data = this.prepareContactsData(result);
            }))
            .catch((error) => {
                this.showWarningToast();
            })
    }

    prepareContactsData(contacts){
        let tableData = [];
        let index = 1;
        contacts.forEach(contact =>{
            tableData.push({id: contact.Id, number: index, firstName: contact.FirstName, lastName: contact.LastName, phoneNumber: contact.Phone, email: contact.Email, address: contact.MailingStreet, createdDate: contact.CreatedDate});
            index++;
        });
        return tableData;
    }

    handleNewContact(){
        this.showContactModal = true;
        this.newContactModal = true;
    }

    createContact(event){
        let contact = event.detail;
        if(contact){
            insertContact({contact: JSON.stringify(contact)})
                    .then(((result) => {
                        this.showContactModal = false;
                        this.newContactModal = false;
                        this.connectedCallback();
                        this.showSuccessToast();
                    }))
                    .catch((error) => {
                        this.showContactModal = false;
                        this.newContactModal = false;
                        this.showWarningToast();
                    })
        }
    }

    editContact(event){
        let contact = event.detail;
        let contactId = contact.id;
        if(contact && contactId){
            updateContact({contactId: contactId, updatedFields: JSON.stringify(contact)})
                    .then(((result) => {
                        this.showContactModal = false;
                        this.editContactModal = false;
                        this.connectedCallback();
                        this.showSuccessToast();
                    }))
                    .catch((error) => {
                        this.showContactModal = false;
                        this.newConeditContactModaltactModal = false;
                        this.showWarningToast();
                    })
        }
    }

    getContactToEdit(id){
        if(id){
            this.data.forEach(contact =>{
                if(contact.id == id){
                    this.contactToEdit = contact;
                }
            });
        }
    }

    deleteContacts(event){
        let contacts = event.detail;
        deleteContacts({contacts:  JSON.stringify(contacts)})
                    .then(((result) => {
                        this.showDeleteModal = false;
                        this.connectedCallback();
                        this.showSuccessToast();
                    }))
                    .catch((error) => {
                        this.showDeleteModal = false;
                        this.showWarningToast();
                    })
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const {id} = row;
        switch (actionName) {
            case 'edit':
                this.getContactToEdit(id);
                this.showContactModal = true;
                this.editContactModal = true;
                break;
            case 'delete':
                deleteContact({contactId: id})
                    .then(((result) => {
                        this.connectedCallback();
                        this.showSuccessToast();
                    }))
                    .catch((error) => {
                        this.showWarningToast();
                    })
                break;
        }
    }

    openDeleteModal(){
        this.showDeleteModal = true;
    }

    closeModal() {
        this.showDeleteModal = false;
    }

    closeContactModal(){
        this.showContactModal = false;
        this.newContactModal = false;
        this.editContactModal = false;
    }

    showSuccessToast(){
        const evt = new ShowToastEvent({
            title: 'Toast Success',
            message: 'Opearion sucessful',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showWarningToast() {
        const evt = new ShowToastEvent({
            title: 'Toast Warning',
            message: 'Some problem',
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };
            return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}