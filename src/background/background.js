window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

import 'babel-polyfill';
import GeorideAPI from './georide.api.js';

(async () => {
  window.gapi = await new GeorideAPI();

  gapi.addSocketOnReady(() => {
    console.log('background is ready to notify');
    gapi.socket.on('lockedPosition', (d) => {
      console.log('notification locked pos');
      // let notification = new Notification(`${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`, {
      //   tag: `lockedPosition-${Math.random()}`,
      //   lang: 'fr',
      //   icon: chrome.runtime.getURL('images/georide128.png')
      // });

      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("assets/icons/icon-48.png"),
        "title": `${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`,
        "message": `${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`
      });
    });

    gapi.socket.on('alarm', (d) => {
      let notification = new Notification(`Vibration détectée sur ${d.trackerName}`, {
        tag: `alarm-${Math.random()}`,
        lang: 'fr',
        icon: browser.runtime.getURL('images/georide128.png')
      })
      // notification.onclick = function() { window.open('https://www.google.com/maps/search/?api=1&query='+d.lockedLatitude+','+d.lockedLongitude) }
    });

  },'background');
})();
