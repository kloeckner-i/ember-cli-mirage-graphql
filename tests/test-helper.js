import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

window.fetch = fetch; // Stub fetch for Pretender

setApplication(Application.create(config.APP));

start();
