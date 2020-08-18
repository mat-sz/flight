import { WebGLRenderer } from 'three';

import scanlines from './scanlines.frag';
import vignette from './vignette.frag';
import fog from './fog.frag';

import createShader from '../functions/createShader';

export const createShaders = (renderer: WebGLRenderer) => [
  createShader(renderer, fog),
  createShader(renderer, scanlines),
  createShader(renderer, vignette),
];

export default createShaders;
