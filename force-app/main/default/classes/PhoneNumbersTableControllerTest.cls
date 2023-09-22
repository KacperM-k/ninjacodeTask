@isTest
public with sharing class PhoneNumbersTableControllerTest {
    
    @isTest
    static void getContactsListSuccessCase(){
        List<Contact> contacts = new List<Contact>();
        for(Integer i=0; i<6; i++){
            Contact contact = new Contact(FirstName='Name' + i, LastName='Lastname' + i);
            contacts.add(contact);
        }
        insert contacts;
        Test.startTest();
            List<Contact> result = PhoneNumbersTableController.getContactsList();
        Test.stopTest();

        System.assertNotEquals(null, result);
        System.assertEquals(contacts.size(), [SELECT Id FROM Contact].size());
        
    }

    @isTest
    static void insertContactSuccessCase(){
        String contact = '{"FirstName":"Name","LastName":"Lastname","Phone":"333-656-777","Email":"name@gmail.com","MailingStreet":"namestreet 22"}';
        Test.startTest();
            PhoneNumbersTableController.insertContact(contact);
        Test.stopTest();

        System.assertEquals(1, [SELECT Id FROM Contact].size());

    }

    @isTest
    static void insertContactsErrorCase(){
        String contact = '';
        Test.startTest();
            try{
                PhoneNumbersTableController.insertContact(contact);
            } catch (AuraHandledException ex) {
                System.assertNotEquals(null, ex.getMessage());
            }  
        Test.stopTest();
    }

    @isTest
    static void updateContactSuccessCase(){
        Contact contact = new Contact(FirstName='Name', LastName='Lastname' ,Phone='333-656-777' ,Email='name@gmail.com', MailingStreet='namestreet 22');
        insert contact;
        String updatedFields='{"Phone":"111-222-333","Email":"change@gmail.com"}';
        String contactId = contact.Id;

        Test.startTest();
            PhoneNumbersTableController.updateContact(contactId, updatedFields);
        Test.stopTest();

        Contact con = [SELECT Phone, Email FROM Contact WHERE Id=:contactId][0];
        System.assertEquals('111-222-333', con.Phone);
        System.assertEquals('change@gmail.com', con.Email);
    }

    @isTest
    static void updateContactNullIdCase(){
        Contact contact = new Contact(FirstName='Name', LastName='Lastname' ,Phone='333-656-777' ,Email='name@gmail.com', MailingStreet='namestreet 22');
        insert contact;
        String updatedFields='{"Phone":"111-222-333","Email":"change@gmail.com"}';
        String contactId = null;

        Test.startTest();
            try{
                PhoneNumbersTableController.updateContact(contactId, updatedFields);
            } catch (AuraHandledException ex) {
                System.assertNotEquals(null, ex.getMessage());
            }  
        Test.stopTest();
    }

    @isTest
    static void updateContactNoFieldsCase(){
        Contact contact = new Contact(FirstName='Name', LastName='Lastname' ,Phone='333-656-777' ,Email='name@gmail.com', MailingStreet='namestreet 22');
        insert contact;
        String updatedFields=null;
        String contactId = contact.Id;

        Test.startTest();
            try{
                PhoneNumbersTableController.updateContact(contactId, updatedFields);
            } catch (AuraHandledException ex) {
                System.assertNotEquals(null, ex.getMessage());
            }  
        Test.stopTest();
    }

    @isTest
    static void deleteContactsSuccessCase(){
        List<Contact> contacts = new List<Contact>();
        for(Integer i=0; i<6; i++){
            Contact contact = new Contact(FirstName='Name' + i, LastName='Lastname' + i);
            contacts.add(contact);
        }
        insert contacts;
        String serializedContacts = JSON.serialize(contacts);
        System.assertEquals(6, [SELECT Id FROM Contact].size());
        Test.startTest();
            PhoneNumbersTableController.deleteContacts(serializedContacts);
        Test.stopTest();
        System.assertEquals(0, [SELECT Id FROM Contact].size());
    }

    @isTest
    static void deleteContactsNullIdCase(){
        Test.startTest();
            try{
                PhoneNumbersTableController.deleteContacts(null);
            } catch (AuraHandledException ex) {
                System.assertNotEquals(null, ex.getMessage());
            }  
        Test.stopTest();
    }

    @isTest
    static void deleteContactSuccessCase(){
        Contact contact = new Contact(FirstName='Name', LastName='Lastname' ,Phone='333-656-777' ,Email='name@gmail.com', MailingStreet='namestreet 22');
        insert contact;
        String contactId = contact.Id;
        System.assertEquals(1, [SELECT Phone, Email FROM Contact WHERE Id=:contactId].size());
        Test.startTest();
            PhoneNumbersTableController.deleteContact(contactId);
        Test.stopTest();
        System.assertEquals(0, [SELECT Phone, Email FROM Contact WHERE Id=:contactId].size());

    }

    @isTest
    static void deleteContactNullIdCase(){
        Test.startTest();
            try{
                PhoneNumbersTableController.deleteContact(null);
            } catch (AuraHandledException ex) {
                System.assertNotEquals(null, ex.getMessage());
            }  
        Test.stopTest();
    }
}