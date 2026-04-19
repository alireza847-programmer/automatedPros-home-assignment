/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { freezeEnabled, screensEnabled } from 'react-native-screens';

screensEnabled(true);
freezeEnabled(true);

AppRegistry.registerComponent(appName, () => App);
