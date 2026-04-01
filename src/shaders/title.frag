uniform sampler2D tText;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec4 texSample = texture2D(tText, uv);

  float lum = dot(texSample.rgb, vec3(0.299, 0.587, 0.114));
  float mask = lum * texSample.a;

  if (mask < 0.01) discard;

  float faceMask = smoothstep(0.6, 0.85, lum);
  float sideMask = (1.0 - faceMask) * step(0.03, lum);

  float goldWeight = smoothstep(0.35, 0.58, uv.y);
  float platWeight = smoothstep(0.34, 0.25, uv.y);
  float chromeWeight = max(1.0 - goldWeight - platWeight, 0.0);

  vec3 goldDark  = vec3(0.804, 0.498, 0.196);
  vec3 goldBright = vec3(1.0, 0.843, 0.0);
  vec3 goldPale  = vec3(1.0, 0.96, 0.82);

  float goldGrad = smoothstep(0.55, 0.95, uv.y);
  vec3 goldBase = mix(goldDark, goldBright, goldGrad);
  float goldSweepPos = uv.x + sin(uv.y * 4.0) * 0.05;
  float goldSweep = pow(sin(goldSweepPos * 6.2832 - uTime * 0.6) * 0.5 + 0.5, 12.0) * 0.55;
  float goldSpec = pow(sin(uv.x * 20.0 + uv.y * 8.0 + uTime * 1.8) * 0.5 + 0.5, 30.0) * 0.25;
  vec3 goldColor = goldBase + goldSweep * goldPale + goldSpec * vec3(1.0, 0.98, 0.9);

  vec3 chromeWarm = vec3(0.92, 0.88, 0.78);
  vec3 chromeHi   = vec3(1.0, 0.97, 0.90);
  float chromeSweep = pow(sin(uv.x * 6.2832 - uTime * 0.9 + 1.5) * 0.5 + 0.5, 10.0) * 0.35;
  vec3 chromeColor = chromeWarm + chromeSweep * chromeHi;

  vec3 platDark   = vec3(0.290, 0.290, 0.322);
  vec3 platBright = vec3(0.898, 0.894, 0.886);
  vec3 platHi     = vec3(1.0, 1.0, 1.0);

  float platGrad = smoothstep(0.05, 0.40, uv.y);
  vec3 platBase = mix(platDark, platBright, platGrad);
  float platSweepPos = uv.x + sin(uv.y * 3.0) * 0.04;
  float platSweep = pow(sin(platSweepPos * 6.2832 - uTime * 0.45 + 3.14) * 0.5 + 0.5, 14.0) * 0.45;
  float platSpec = pow(sin(uv.x * 18.0 - uv.y * 6.0 - uTime * 1.3) * 0.5 + 0.5, 35.0) * 0.2;
  vec3 platColor = platBase + platSweep * platHi + platSpec * vec3(0.92, 0.94, 1.0);

  vec3 color = goldColor * goldWeight + chromeColor * chromeWeight + platColor * platWeight;
  vec3 sideColor = color * 0.35 * vec3(0.9, 0.85, 0.8);
  color = mix(sideColor, color, faceMask);
  color += smoothstep(0.55, 0.65, lum) * (1.0 - smoothstep(0.75, 0.85, lum)) * vec3(1.0, 0.95, 0.85) * 0.15;

  float spotX = fract(uTime * 0.08);
  color += exp(-pow(uv.x - spotX, 2.0) * 80.0) * 0.35 * (1.0 - abs(uv.y - 0.5) * 0.6) * vec3(1.0, 0.95, 0.85);

  float glitterSeed = hash(floor(uv * 200.0) + floor(uTime * 6.0));
  if (glitterSeed > 0.995) {
    color += pow(sin(uTime * 15.0 + glitterSeed * 628.318) * 0.5 + 0.5, 3.0) * 0.18 * mix(vec3(0.9, 0.93, 1.0), vec3(1.0, 0.92, 0.7), goldWeight);
  }

  color *= 1.0 - dot(uv - 0.5, uv - 0.5) * 0.8;
  color = pow(color, vec3(0.95));

  gl_FragColor = vec4(color, smoothstep(0.02, 0.15, mask) * mask);
}
