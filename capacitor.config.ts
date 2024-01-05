import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.escasan.app',
  appName: 'EscasanFactura',
  webDir: 'dist/factura-app',
  /*server: {
    androidScheme: 'https'
  }*/
  bundledWebRuntime: false
};

export default config;
