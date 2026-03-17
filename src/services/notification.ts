/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title: string, body: string) => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico', // Fallback to favicon
        badge: '/favicon.ico',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
};

/**
 * Future-ready: Check if it's a birthday and notify
 */
export const checkAndNotifyBirthday = (name: string) => {
  sendNotification(
    '🎉 Happy Birthday!',
    `Today is ${name}'s special day ❤️`
  );
};
