precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

const float AMBIENT_INTENSITY = 0.8;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
             mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
  for (int i = 0; i < 5; ++i) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.y, u_resolution.x);

  vec3 baseColor = vec3(0.015, 0.012, 0.025);
  vec3 beamColor = vec3(1.0, 0.92, 0.75);
  vec3 screenGlowColor = vec3(0.15, 0.2, 0.35);

  float flicker = 1.0
    + 0.03 * sin(u_time * 11.7)
    + 0.015 * sin(u_time * 23.3)
    + 0.008 * sin(u_time * 37.1)
    + 0.02 * sin(u_time * 5.9) * hash(floor(u_time * 4.0));

  vec2 projectorPos = vec2(0.0, 1.8);
  float distToProjector = length(p - projectorPos);
  float mainBeam = smoothstep(3.0, 0.0, distToProjector) * 0.18;
  float beamDir = smoothstep(-0.2, 1.8, p.y);
  mainBeam *= mix(0.3, 1.0, beamDir);

  float streak = exp(-abs(p.y - 0.3) * 8.0) * smoothstep(1.5, 0.0, abs(p.x)) * 0.06;
  vec3 streakColor = streak * vec3(0.4, 0.5, 0.8);
  streakColor *= 0.7 + 0.3 * sin(u_time * 0.4);

  // particles
  float dust = 0.0;
  for(float i = 0.0; i < 24.0; i++) {
    vec2 dPos = vec2(hash(i * 13.1), hash(i * 47.7));
    dPos.y = fract(dPos.y - u_time * (0.03 + 0.015 * hash(i * 7.3)));
    dPos.x += sin(u_time * (0.2 + hash(i * 3.1) * 0.3) + i) * 0.06;
    vec2 uvP = p - (dPos * 2.0 - 1.0) * 1.5;
    float particleSize = 0.0008 + 0.0005 * hash(i * 19.3);
    float pulse = 0.7 + 0.3 * sin(u_time * (1.0 + hash(i * 11.0)) + i * 2.0);
    dust += (particleSize / length(uvP)) * pulse;
  }

  float screenGlow = smoothstep(1.2, -0.5, p.y + 1.2) * 0.12;


  // domain warping
  vec2 q = vec2(
    fbm(p * 0.4 + vec2(u_time * 0.03, u_time * 0.02)),
    fbm(p * 0.4 + vec2(1.7, 9.2) + vec2(u_time * 0.02, u_time * 0.04))
  );
  
  vec2 r = vec2(
    fbm(p * 0.4 + 4.0 * q + vec2(u_time * 0.01, u_time * 0.015) + vec2(8.3, 2.8)),
    fbm(p * 0.4 + 4.0 * q + vec2(u_time * 0.015, u_time * 0.01) + vec2(2.4, 1.3))
  );

  float f = fbm(p * 0.3 + 4.0 * r);
  
  vec3 color1 = vec3(0.08, 0.04, 0.15);
  vec3 color2 = vec3(0.25, 0.10, 0.45);
  vec3 color3 = vec3(0.10, 0.20, 0.50);
  
  vec3 ambientLight = mix(color1, color2, f);
  ambientLight = mix(ambientLight, color3, dot(q, q));
  
  // highlights
  float glow = pow(f, 3.0) * 1.5;
  ambientLight += vec3(0.3, 0.2, 0.6) * glow;
  ambientLight *= AMBIENT_INTENSITY;

  float grain = hash(uv.x * uv.y * u_time) * 0.03;
  float scanline = sin(uv.y * u_resolution.y * 0.8) * 0.01;
  float breathing = 1.0 + 0.04 * sin(u_time * 0.8) + 0.01 * sin(u_time * 1.3);

  vec3 color = baseColor;
  color += ambientLight;
  color += screenGlowColor * screenGlow;
  color += dust * vec3(1.0, 0.88, 0.65) * 0.25; 
  color += streakColor;

  color -= grain;
  color += scanline;
  color *= breathing;

  // gradient
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 warmShift = vec3(0.02, 0.01, -0.01);
  vec3 coolShift = vec3(-0.005, 0.0, 0.01);
  float highlightMask = smoothstep(0.03, 0.12, luminance);
  float shadowMask = 1.0 - smoothstep(0.0, 0.06, luminance);
  color += warmShift * highlightMask * 0.5;
  color += coolShift * shadowMask * 0.5;

  // vignette
  float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
  vignette = pow(vignette * 15.0, 0.35);
  vec3 vignetteColor = mix(vec3(0.85, 0.88, 1.0), vec3(1.0, 0.98, 0.95), vignette);
  color *= vignette * vignetteColor;

  color = clamp(color, 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
