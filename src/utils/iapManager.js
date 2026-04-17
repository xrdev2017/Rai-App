import { Platform } from 'react-native';
import {
  purchaseErrorListener,
  requestPurchase,
} from 'react-native-iap';
import * as RNIap from 'react-native-iap';

export const subscriptionSkus = Platform.select({
  android: ['rai_basic', 'rai_pro'],
  ios: ['rai_basic_month', 'rai_basic_year', 'rai_pro_month', 'rai_pro_year'],
});

/**
 * Initializes the connection to the In-App Purchase store.
 * Should be called once when the app starts.
 * @returns {Promise<boolean>} True if connection was successful.
 */
export const initializeIAP = async () => {
  try {
    return await initConnection();
  } catch (err) {
    console.error('IAP: Connection Error:', err);
    return false;
  }
};

/**
 * Fetches the available subscription products from the store.
 * @returns {Promise<Array>} List of subscription products.
 */
export const fetchSubscriptions = async () => {
  try {
    return await fetchProducts({ skus: subscriptionSkus, type: 'subs' });
  } catch (err) {
    console.error('IAP: Fetch Error:', err);
    return [];
  }
};

/**
 * Requests a subscription purchase for a specific SKU.
 * Note: Results are handled via the purchaseUpdatedListener.
 * @param {string} sku The product identifier (e.g. 'rai_basic')
 * @param {string} basePlanId The base plan ID for Android
 * @param {string} offerToken The offer token for Android
 */
export const buySubscription = async (sku, basePlanId, offerToken) => {
  try {
    const requestPayload = {
      request: {
        apple: { sku },
        google: {
          skus: [sku],
          ...(offerToken ? { subscriptionOffers: [{ sku, offerToken }] } : {})
        }
      },
      type: 'subs'
    };

    return await requestPurchase(requestPayload);
  } catch (err) {
    console.error('IAP: Request Error:', err);
    throw err;
  }
};

/**
 * Finishes a transaction by acknowledging it with the store.
 * This prevents automatic refunds on Android.
 * @param {Object} purchase The purchase object received from the listener.
 */
export const handleFinishTransaction = async (purchase) => {
  try {
    await finishTransaction({ purchase, isConsumable: false });
  } catch (err) {
    console.error('Error finishing transaction:', err);
  }
};

/**
 * Sets up the global purchase event listeners.
 * @param {Function} onSuccess Callback triggered after successful acknowledgment.
 * @param {Function} onError Callback triggered on purchase failure.
 * @returns {Object} Subscriptions to be removed on cleanup.
 */
export const setupPurchaseListeners = (onSuccess, onError) => {
  const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
    const receipt = purchase.purchaseToken;
    if (receipt) {
      try {
        // Here you would typically verify the receipt with your server
        await handleFinishTransaction(purchase);
        if (onSuccess) onSuccess(purchase);
      } catch (ackErr) {
        console.error('Ack Error:', ackErr);
      }
    }
  });

  const purchaseErrorSubscription = purchaseErrorListener((error) => {
    console.error('Purchase Error:', error);
    if (onError) onError(error);
  });

  return { purchaseUpdateSubscription, purchaseErrorSubscription };
};
