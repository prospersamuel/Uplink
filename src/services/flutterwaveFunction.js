const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
admin.initializeApp();

exports.verifyFlutterwavePayment = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
  }

  const { transaction_id } = data;
  
  try {
    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        'Authorization': `Bearer ${functions.config().flutterwave.secret_key}`
      }
    });

    const paymentData = response.data.data;
    
    if (paymentData.status === 'successful' && 
        paymentData.amount === paymentData.charged_amount && 
        paymentData.currency === 'NGN') {
      
      // Update user's balance in Firestore
      const userId = context.auth.uid;
      const amount = paymentData.amount;
      
      await admin.firestore().runTransaction(async (transaction) => {
        const userRef = admin.firestore().doc(`users/${userId}`);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'User not found');
        }
        
        const currentBalance = userDoc.data().balance || 0;
        const newBalance = currentBalance + amount;
        
        transaction.update(userRef, { balance: newBalance });
        
        // Record the transaction
        const txRef = admin.firestore().collection(`users/${userId}/transactions`).doc();
        transaction.set(txRef, {
          amount: amount,
          type: 'deposit',
          status: 'completed',
          flutterwave_ref: paymentData.tx_ref,
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      return { success: true, message: 'Payment verified and balance updated' };
    } else {
      throw new functions.https.HttpsError('failed-precondition', 'Payment verification failed');
    }
  } catch (error) {
    console.error('Verification error:', error);
    throw new functions.https.HttpsError('internal', 'Payment verification failed');
  }
});