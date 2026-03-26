---
layout: post
title: "How I Broke Better Player (Without Actually Replacing It)"
date: 2026-03-25
categories: [flutter, android, video, drm]
tags: [flutter, exoplayer, iptv, drm, dash, clearkey]
---

I started the weekend with a simple idea:

> “I’ll tweak an open source IPTV Flutter project a bit and call it a day.”

Yeah… no.

---

The project was using Better Player.  
At first glance, everything looked fine:

- streams were playing
- DASH (`.mpd`) worked
- even DRM (ClearKey) was supported

So naturally, I assumed the hard parts were already solved.

They weren’t.

---

## The First Problem

The stream had multiple audio tracks.

The player had… one.

No selector.  
No API.  
No indication that multiple tracks even existed.

Just:

> “Here’s your audio. Enjoy.”

---

## Trying Alternatives (Spoiler: Didn’t Work)

First stop: `video_player`.

- simple
- official
- useless for this case

No real support for:
- advanced DASH
- DRM
- track selection

---

Then I tried `media_kit`.

This one looked promising:

- multiple audio tracks ✔️  
- subtitles ✔️  
- clean API ✔️  

But then:

> DRM: nope.

And not “kind of no”.  
More like:

> “This is not part of the stack.”

Because on Android, DRM lives in a completely different world.

---

## The Realization

At that point it became obvious:

> If I want proper DASH + DRM, I’m using ExoPlayer.

And Better Player… was already using it.

---

So the question changed from:

> “Which library should I use?”

to:

> “What is this library hiding from me?”

---

## The Hack (Yes, Reflection)

```kotlin
val pluginClass = Class.forName("com.sarthak.better_player_enhanced.BetterPlayerPlugin")
val videoPlayersField = pluginClass.getDeclaredField("videoPlayers")
videoPlayersField.isAccessible = true

val videoPlayers = videoPlayersField.get(pluginInstance) as LongSparseArray<Any>
val betterPlayer = videoPlayers[textureId]

val exoPlayerField = betterPlayer.javaClass.getDeclaredField("exoPlayer")
exoPlayerField.isAccessible = true

val exoPlayer = exoPlayerField.get(betterPlayer) as ExoPlayer
```

Yes, it’s reflection.  
Yes, it’s ugly.  
Yes, it works.

---

## The Result

- Multi-audio ✔️  
- Subtitles ✔️  
- DRM ✔️  

Without replacing Better Player.

---

## Conclusion

Sometimes the problem isn’t the tool.

It’s how much of it you’re allowed to see.

And when you need more:

> you either switch tools…  
> or go deeper.

I went deeper.

So far… it works 😄
