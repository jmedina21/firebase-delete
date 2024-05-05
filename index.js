const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require(process.env.LOCAL_GCP_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

function deleteAllUsers(nextPageToken) {
    admin.auth().listUsers(1000, nextPageToken)
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                admin.auth().deleteUser(userRecord.uid)
                    .then(() => {
                        console.log(`Successfully deleted user ${userRecord.uid}`);
                    })
                    .catch((error) => {
                        console.log('Error deleting user:', error);
                    });
            });
            if (listUsersResult.pageToken) {
                deleteAllUsers(listUsersResult.pageToken);
            }
        })
        .catch((error) => {
            console.log('Error listing users:', error);
        });
}

deleteAllUsers();
