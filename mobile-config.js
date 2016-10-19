App.accessRule("*");
App.setPreference("orientation", "portrait");

App.info({
  	id: 'com.the.dish',
  	name: 'thedish',
  	description: 'share dishes over social network',
  	author: 'SmartData Enterprise',
  	website: 'www.smartdatainc.com'
});

App.icons({
	'android_mdpi': 'icons/icon-48.png',
	'android_hdpi': 'icons/icon-72.png',
  'android_xhdpi': 'icons/icon-96.png',
  'android_xxhdpi': 'icons/icon-144.png',
  'android_xxxhdpi': 'icons/icon-192.png'
});

App.launchScreens({
  'android_mdpi_portrait': 'splash/splash-mdpi.png',
  'android_hdpi_portrait': 'splash/splash-hdpi.png',
	'android_xhdpi_portrait': 'splash/splash-xhdpi.png',
  'android_xxhdpi_portrait': 'splash/splash-xxhdpi.png'
});