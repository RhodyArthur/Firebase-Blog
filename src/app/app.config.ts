import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"angular-blog-327dd","appId":"1:704313001442:web:a0913555236c7a7e00e5bb","storageBucket":"angular-blog-327dd.appspot.com","apiKey":"AIzaSyDaQfuSzykxORCVgyq75ElX_0UEUFzYf7Y","authDomain":"angular-blog-327dd.firebaseapp.com","messagingSenderId":"704313001442","measurementId":"G-K8R7318T9M"})), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService,
//      provideAppCheck(() => {
//   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
//   const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
//   return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
// }),
 provideFirestore(() => getFirestore()),
 provideDatabase(() => getDatabase()),
 provideFunctions(() => getFunctions()),
 provideMessaging(() => getMessaging()),
 providePerformance(() => getPerformance()),
 provideStorage(() => getStorage()),
 provideRemoteConfig(() => getRemoteConfig()),
 provideVertexAI(() => getVertexAI())]
};
