#include <common>
 
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

vec4 vignette(vec2 coord, vec4 screen)
{
    float dx = 1.3 * abs(coord.x - .5);
    float dy = 1.3 * abs(coord.y - .5);
    return screen * (1.0 - dx * dx - dy * dy);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = fragCoord.xy / iResolution.xy;
    p = fisheye(p, 0.03);
    
    fragColor = vignette(p, scanline(p, fragColor));
    fragColor.a = 0.5;
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}