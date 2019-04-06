import 'babel-polyfill';
import GeorideAPI from './georide.api';


(async () => {
  window.gapi = await new GeorideAPI();

  window.gapi.addSocketOnReady(() => {
    console.log('background is ready to notify');

    window.gapi.socket.on('lockedPosition', (d) => {
      console.log(window);
      console.log('notification locked pos');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.extension.getURL('assets/icons/icon-48.png'),
        title: `${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`,
        message: `${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`,
      });
    });

    window.gapi.socket.on('alarm', (d) => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.extension.getURL('assets/icons/icon-48.png'),
        title: `Vibration détectée sur ${d.trackerName}`,
        message: `Vibration détectée sur ${d.trackerName}`,
      });
    });
  }, 'background');
})();
