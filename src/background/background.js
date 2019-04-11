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
        iconUrl: chrome.extension.getURL('../assets/icons/icon-48.png'),
        title: `${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`,
        message: `${d.trackerName} ${d.isLocked ? 'Verrouillée' : 'Déverrouillée'}`,
      });
    });

    window.gapi.socket.on('alarm', (d) => {
      let message;

      switch (d.name) {
        case 'vibration':
          message = `Vibration détectée sur ${d.trackerName}`;
          break;
        case 'exitZone':
          message = `Sortie de zone pour ${d.trackerName}`;
          break;
        case 'crash':
          message = `Chute détectée sur ${d.trackerName}`;
          break;
        case 'crashParking':
          message = `Chute parking détectée sur ${d.trackerName}`;
          break;
        case 'deviceOffline':
          message = `${d.trackerName} déconnectée du réseau`;
          break;
        case 'deviceOnline':
          message = `${d.trackerName} reconnectée au réseau`;
          break;
        case 'powerCut':
          message = `Alimentation coupée sur ${d.trackerName}`;
          break;
        default:
          console.error(`Not found ${d.name}`);
      }

      if (message) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.extension.getURL('../assets/icons/icon-48.png'),
          title: message,
        });
      }
    });
  }, 'background');
})();
