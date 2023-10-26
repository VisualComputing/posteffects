precision mediump float;

uniform sampler2D tex;
uniform float xPixels;
uniform float yPixels;

varying vec2 texcoords2;

void main() {
        vec2 texCoords = vec2(floor(texcoords2.s * xPixels) / xPixels, floor(texcoords2.t * yPixels) / yPixels);
        gl_FragColor = texture2D(tex, texCoords);
}