#include <common>

uniform sampler2D iTexture;
uniform vec3 iResolution;

vec4 vignette(vec2 coord, vec4 screen)
{
    float dx = 1.3 * abs(coord.x - .5);
    float dy = 1.3 * abs(coord.y - .5);
    return screen * (1.0 - dx * dx - dy * dy);
}

void main()
{
    vec2 p = gl_FragCoord.xy / iResolution.xy;
    gl_FragColor = texture2D(iTexture, p);
    gl_FragColor = vignette(p, gl_FragColor);
}