public with sharing class PhoneNumbersTableController {

    @AuraEnabled()
    public static List<Contact> getContactsList(){
            return [SELECT Id, FirstName, LastName, Phone, Email, MailingStreet, CreatedDate FROM Contact];
    }

    @AuraEnabled
    public static void insertContact(String contact){
        try {
            Map<String, String> contactMap = (Map<String, String>)JSON.deserialize(contact, Map<String, String>.class);
            if(!contactMap.isEmpty()){
                Contact newContact = new Contact();
                for(String field : contactMap.keySet()){
                    newContact.put(field, contactMap.get(field));
                }
                insert newContact;
            }
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void updateContact(String contactId, String updatedFields){
        try {
            Map<String,String> fieldsMap = (Map<String,String>)JSON.deserialize(updatedFields, Map<String,String>.class);
            if(!fieldsMap.isEmpty()){
                Contact contact = [SELECT Id, FirstName, LastName, Phone, Email, MailingStreet, CreatedDate FROM Contact WHERE Id = :contactId][0];
                for(String field : fieldsMap.keySet()){
                    contact.put(field, fieldsMap.get(field));
                }
                update contact;
            }
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteContact(String contactId){
        try {
            if(String.isBlank(contactId)){
                throw new AuraHandledException('Null Id');
            }
            List<Contact> contact = [SELECT Id FROM Contact WHERE Id = :contactId];
            delete contact;
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}