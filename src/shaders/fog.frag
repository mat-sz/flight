#include <common>

uniform sampler2D iTexture;
uniform vec3 iResolution;

vec4 fog(vec2 coord, vec4 screen)
{
    float dy = coord.y;
    return screen * (0.75 - dy * dy);
}

void main()
{
    vec2 p = gl_FragCoord.xy / iResolution.xy;
    gl_FragColor = texture2D(iTexture, p);
    gl_FragColor = fog(p, gl_FragColor);
}