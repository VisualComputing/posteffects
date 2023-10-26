precision mediump float;

uniform sampler2D rtex;
uniform sampler2D tex;
uniform vec2 lightPositionOnScreen;
uniform float lightDirDOTviewDir;

varying vec2 texcoords2;

const int NUM_SAMPLES = 255;

void main(void){
	vec4 origColor = texture2D(tex, texcoords2.st);
	vec4 raysColor = texture2D(rtex, texcoords2.st);

	if (lightDirDOTviewDir>0.0){
		float exposure = 0.5/float(NUM_SAMPLES);
		float decay = 1.0;
		float density	= 1.0;
		float weight	= 6.0;
		float illuminationDecay = 1.0;

		vec2 deltaTextCoord = vec2( texcoords2.st - lightPositionOnScreen);
		vec2 textCoo = texcoords2.st;
        deltaTextCoord *= 1.0 / float(NUM_SAMPLES) * density;

		for(int i=0; i < NUM_SAMPLES ; i++)
		{
			textCoo -= deltaTextCoord;
			vec4 tsample = texture2D(rtex, textCoo );
			tsample *= illuminationDecay * weight;
			raysColor += tsample;
			illuminationDecay *= decay;
		}
		raysColor *= exposure * lightDirDOTviewDir;
		float p = 0.3 *raysColor.g + 0.59*raysColor.r + 0.11*raysColor.b;
		gl_FragColor = origColor + p;
	} else {
		gl_FragColor = origColor;
        }
}
