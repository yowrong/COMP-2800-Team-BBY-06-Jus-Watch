/* Mock Firestore for Firebase functions unit testing from https://www.npmjs.com/package/firestore-jest-mock */

const { mockFirebase } = require('firestore-jest-mock');

// Import the mock versions of the functions you expect to be called
const { mockCollection, mockDoc, mockSet, mockAdd } = require('firestore-jest-mock/mocks/firestore');

mockFirebase({
    database: {
        users: [
        {
            uid: 'zMFM5BxLDBcKnKXa4B2WH36KNWS2',
            name: 'Test User',
            email: 'testuser4@jw.com',
        },
        {
            uid: 'Bjak8WiHFRY52ScuYiVfgcDPmps1',
            name: 'Test User2',
            email: 'testuser2@jw.com',
        },
        ],
        groups: [
        {
            groupName: 'Test Group',
            groupDescription: 'Comedy movie club',
            chosenMovie: "hello",
        }
        ],
    },
});

const firebase = require('firebase');
const db = firebase.firestore();
const usersRef = db.collection('users');
const groupRef = db.collection('groups');

beforeAll(() => {
    usersRef.doc('zMFM5BxLDBcKnKXa4B2WH36KNWS2').get()
        .then(() => {
                usersRef.doc('zMFM5BxLDBcKnKXa4B2WH36KNWS2').set({
                    name: 'Test User',
                    email: 'testuser4@jw.com',
                    uid: 'zMFM5BxLDBcKnKXa4B2WH36KNWS2',
                    groupDescription: "",
                    groupId: "",
                    groupName: ""
                }).catch(function(err) {console.log(err);});
        });
    groupRef.add({
        groupName: 'Test Group 2',
        groupDescription: 'Drama movie club',
        chosenMovie: "hi",
    });
})

test('test firestore reference collections', () => {
    return db
        .collection('users')
        .doc('zMFM5BxLDBcKnKXa4B2WH36KNWS2')
        .get()
        .then(() => {
        // Assert that a collection was referenced
        expect(mockCollection).toHaveBeenNthCalledWith(1, 'users');

        }).catch(function(err) {
            console.log(err);
        });
});

test('test firestore reference documents', () => {
    return db
        .collection('users')
        .doc('zMFM5BxLDBcKnKXa4B2WH36KNWS2')
        .get()
        .then(() => {
        // Assert that a document ID was referenced
        expect(mockDoc).toHaveBeenCalledWith('zMFM5BxLDBcKnKXa4B2WH36KNWS2');
        
        }).catch(function(err) {
            console.log(err);
        });
});

test('test firestore function .set', () => {
    return db
        .collection('users')
        .doc('zMFM5BxLDBcKnKXa4B2WH36KNWS2')
        .get()
        .then(() => {
        // Assert that a document was updated
        expect(mockSet).toHaveBeenCalledWith({ "name": "Test User", "email": "testuser4@jw.com", "uid": "zMFM5BxLDBcKnKXa4B2WH36KNWS2", "groupDescription": "", "groupId": "", "groupName": ""});

        }).catch(function(err) {
            console.log(err);
        });
});

test('test firestore function .add', () => {
    return db
        .collection('groups')
        .get()
        .then(() => {
        // Assert that a document was updated
        expect(mockAdd).toHaveBeenCalledWith({ "groupName": 'Test Group 2', "groupDescription": 'Drama movie club', "chosenMovie": "hi"});

        }).catch(function(err) {
            console.log(err);
        });
});


// Run tests using `jest --env=node`