#include <common>

uniform sampler2D iTexture;
uniform vec3 iResolution;
uniform float iTime;

vec2 fisheye(vec2 coord, float str)
{
    vec2 neg1to1 = coord;
    neg1to1 = (neg1to1 - 0.5) * 2.0;
    
    vec2 offset;
    offset.x = ( pow(neg1to1.y,2.0)) * str * (neg1to1.x);
    offset.y = ( pow(neg1to1.x,2.0)) * str * (neg1to1.y);
    
    return coord + offset;
}

vec4 scanline(vec2 coord, vec4 screen)
{
    const float scale = .0025;
    const float amt = 0.05;
    const float spd = 1.0;
    
    screen.rgb += sin((coord.y / scale - (iTime * spd * 6.28))) * amt;
    return screen;
}

void main()
{
    vec2 p = gl_FragCoord.xy / iResolution.xy;
    p = fisheye(p, 0.1);
    gl_FragColor = texture2D(iTexture, p);
    
    gl_FragColor = scanline(p, gl_FragColor);
    gl_FragColor.a = 0.5;
}