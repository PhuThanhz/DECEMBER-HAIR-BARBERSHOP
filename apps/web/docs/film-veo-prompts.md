# Film section — Veo 3 prompts

Section `film` (`src/components/sections/film.tsx`) sits between **Experience** and **Menu**.

**Message on screen:** "Praha 1 · po setmění" — **"Město nechte za dveřmi."** / "Leave the city at the door."

**Story (one continuous shot, no people):** a cold, blue, rainy Prague evening. The camera itself glides along
an empty wet cobblestone street to a softly glowing shop front, the glass door swings open by itself, and the camera
drifts inside. The picture turns from cold blue to calm, light warmth: ivory travertine, pale stone, soft white-gold light.
The rain fades to a hush. Meaning: here the noise and the rush stay outside — this hour is yours.

No people at all (so nothing ever sits under the text), and the palette is deliberately **light and neutral, not brown**:
ivory, pale travertine, soft stone grey, brushed steel, olive green, a touch of champagne gold.
The website plays it **once, muted**, then holds the last frame (a "Play video" button replays it).

Generate **two versions**, because the text sits in a different place on each device:

| Device  | Aspect | Empty area for text     | Movement happens in |
| ------- | ------ | ----------------------- | ------------------- |
| Desktop | 16:9   | left ~40 % of the frame | right ~60 %         |
| Phone   | 9:16   | top ~40 % of the frame  | lower ~60 %         |

If Veo returns 8 seconds instead of 10, that is fine.

---

## Prompt 1 — Desktop (16:9)

```
Cinematic 16:9 single continuous shot, 10 seconds, shot on an ARRI Alexa with a 35mm anamorphic lens, shallow depth of field, gentle film grain, smooth slow gimbal movement. No people anywhere in the shot.
Prague Old Town at blue hour in light rain: an empty narrow street of wet cobblestones reflecting street lamps, pale stone facades, cold blue-grey tones, soft mist.
Composition: the LEFT 40% of the frame stays dark and calm the whole time — the shadowed side of a stone wall and the wet street, nothing happening there.
In the RIGHT part of the frame the camera glides forward at walking pace toward a softly glowing shop front with tall arched windows and a glass door. The glass door slowly swings open on its own, and the camera drifts through the doorway.
As we pass the threshold the light shifts smoothly from cold blue to a calm, soft, light warmth.
Inside: a quiet, bright, minimal luxury barbershop with no one inside — honed ivory travertine walls, tall arched mirrors with a soft white-gold backlit glow, pale stone floor, brushed steel barber chairs with light sand-coloured upholstery, a small olive tree, a few folded white towels.
Final 2 seconds: the camera settles and holds still on the calm interior while the glass door gently closes behind, rain softly visible through the glass.
Colour: cold blue-grey outside; inside light and airy — ivory, pale travertine, soft stone grey, brushed steel, olive green, a subtle touch of champagne gold. Avoid dark brown, avoid heavy orange or amber tint, keep the image light and clean. Elegant and calm, like a luxury fashion house film.
No people, no hands, no faces. No text, no signs with readable words, no logos, no subtitles, no watermark. No cuts, no camera shake.
Sound: soft rain on the street that becomes muffled and quiet once the door closes. No music.
```

## Prompt 2 — Phone (9:16)

```
Cinematic vertical 9:16 single continuous shot, 10 seconds, shot on an ARRI Alexa with a 35mm lens, shallow depth of field, gentle film grain, smooth slow gimbal movement. No people anywhere in the shot.
Prague Old Town at blue hour in light rain: an empty narrow street of wet cobblestones reflecting street lamps, pale stone facades, cold blue-grey tones, soft mist.
Composition: the TOP 40% of the frame stays dark and calm the whole time — night sky and the shadowed upper facade of a stone building, nothing happening there.
In the LOWER 60% of the frame the camera glides forward at walking pace toward a softly glowing shop door with an arched glass window. The glass door slowly swings open on its own, and the camera drifts through the doorway.
As we pass the threshold the light shifts smoothly from cold blue to a calm, soft, light warmth.
Inside: a quiet, bright, minimal luxury barbershop with no one inside — honed ivory travertine walls, the lower part of tall arched mirrors with a soft white-gold backlit glow, pale stone floor, brushed steel barber chairs with light sand-coloured upholstery, a small olive tree.
Final 2 seconds: the camera settles and holds still on the calm interior while the glass door gently closes behind.
Colour: cold blue-grey outside; inside light and airy — ivory, pale travertine, soft stone grey, brushed steel, olive green, a subtle touch of champagne gold. Avoid dark brown, avoid heavy orange or amber tint, keep the image light and clean. Elegant and calm, like a luxury fashion house film.
No people, no hands, no faces. No text, no signs with readable words, no logos, no subtitles, no watermark. No cuts, no camera shake.
Sound: soft rain on the street that becomes muffled and quiet once the door closes. No music.
```

---

## After generating

1. Save the downloads as `film-desktop-raw.mp4` and `film-mobile-raw.mp4` in `apps/web/public/videos/`.
2. Compress them (no audio track, fast start) and grab the **last** frame as poster (the calm interior). From `apps/web/public/videos/`:

```bash
ffmpeg -y -i film-desktop-raw.mp4 -an -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart film-desktop.mp4
```

```bash
ffmpeg -y -i film-mobile-raw.mp4 -an -vf "scale=1080:-2" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart film-mobile.mp4
```

```bash
ffmpeg -y -sseof -0.1 -i film-desktop.mp4 -frames:v 1 -q:v 3 film-desktop-poster.jpg
```

```bash
ffmpeg -y -sseof -0.1 -i film-mobile.mp4 -frames:v 1 -q:v 3 film-mobile-poster.jpg
```

3. Delete the `-raw` files, then set `ready: true` in `filmVideo` (`src/content/images.ts`).
   If you make a seamless looping clip instead, also set `loop: true`.

Target sizes: desktop ≤ 6 MB, phone ≤ 4 MB.
