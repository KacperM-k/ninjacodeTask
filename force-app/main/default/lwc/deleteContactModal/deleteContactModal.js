import { LightningElement, api } from 'lwc';

export default class DeleteContactModal extends LightningElement {
    @api showDeleteModal;
    @api successDeleteModal
    @api errorDeleteModal;

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}