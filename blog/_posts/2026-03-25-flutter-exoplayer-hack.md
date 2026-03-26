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

## Suddenly… Audio Tracks Exist

Once I had the real ExoPlayer:

```kotlin
exoPlayer.currentTracks.groups
    .filter { it.type == C.TRACK_TYPE_AUDIO }
```

And just like that:

👉 all audio tracks showed up

They were always there.
Better Player just didn’t expose them.

---

Selecting one was straightforward:

```kotlin
trackSelector.parameters = trackSelector.buildUponParameters()
    .setOverrideForType(
        TrackSelectionOverride(group.mediaTrackGroup, 0)
    )
    .build()
```

Done.

---

## Wiring It Through MainActivity

I exposed this through a MethodChannel.

Now Flutter can:

- get audio tracks
- get subtitle tracks
- select tracks
- listen for subtitle cues

Example:

```kotlin
when (call.method) {

    "getAudioTracks" -> {
        val tracks = exoPlayer.currentTracks.groups
            .filter { it.type == C.TRACK_TYPE_AUDIO }
            .mapIndexed { i, group ->
                val fmt = group.getTrackFormat(0)
                mapOf(
                    "groupIndex" to i,
                    "language" to (fmt.language ?: "und"),
                    "label" to (fmt.label ?: "Audio $i")
                )
            }
        result.success(tracks)
    }

    "selectAudioTrack" -> {
        val groupIndex = call.argument<Int>("groupIndex")!!
        val group = audioGroups[groupIndex]

        trackSelector.parameters = trackSelector.buildUponParameters()
            .setOverrideForType(
                TrackSelectionOverride(group.mediaTrackGroup, 0)
            )
            .build()

        result.success(null)
    }
}
```

---

## Flutter Side (Still Using Better Player)

Here’s the funny part:

I didn’t remove Better Player.

```kotlin
_betterPlayerController = BetterPlayerController(config);

_betterPlayerController!.setupDataSource(
  BetterPlayerDataSource(
    BetterPlayerDataSourceType.network,
    url,
    videoFormat: BetterPlayerVideoFormat.dash,
    drmConfiguration: BetterPlayerDrmConfiguration(
      drmType: BetterPlayerDrmType.clearKey,
      clearKey: jwk,
    ),
  ),
);
```

It still handles:

- rendering
- lifecycle
- texture management

But now I can fetch native tracks:

```kotlin
final audios = await _betterPlayerController!.getNativeAudioTracks();
final subs = await _betterPlayerController!.getNativeSubtitleTracks();
```

And render them:

```kotlin
ListTile(
  title: Text(track['label']),
  onTap: () {
    _betterPlayerController!
        .selectNativeAudioTrack(track['groupIndex']);
  },
)
```

---

## Subtitles (Custom Rendering)

Better Player wasn’t handling subtitles well either.

So I listened directly from ExoPlayer:

```kotlin
override fun onCues(cueGroup: CueGroup) {
    val text = cueGroup.cues
        .mapNotNull { it.text?.toString() }
        .joinToString("\n")

    channel.invokeMethod("onSubtitleCue", text)
}
```

Then rendered them in Flutter:

```kotlin
if (_subtitlesActive && _currentSubtitle.isNotEmpty)
  Positioned(
    bottom: 60,
    child: Text(_currentSubtitle),
  )
```

---

## What This Became

Without really planning it, I ended up with:

```kotlin
Flutter UI
   ↓
Better Player (render + lifecycle)
   ↓
ExoPlayer (actual control)
```

---

## The Takeaway

I didn’t:

- switch frameworks
- rewrite everything in Kotlin
- abandon Flutter

I just:

> stopped treating the plugin as a black box

---

Better Player isn’t bad.
But its abstraction:

- hides too much
- simplifies too aggressively
- breaks down in complex scenarios

---

## Conclusion

Sometimes the problem isn’t the tool.

It’s how much of it you’re allowed to see.

And when you need more:

> you either switch tools…  
> or go deeper.

I went deeper.

So far… it works 😄

## The Result

- Multi-audio ✔️  
- Subtitles ✔️  
- DRM ✔️  

Without replacing Better Player.

