---
layout: post
title: "Why I Start 20 Projects and Finish 3 (and Why That's Okay)"
date: 2026-09-03 13:09:00 -0300
categories: [meta, blog]
tags: [meta, sarcasm, indieDev, career]
---

![My collection of abandoned projects](blog/assets/images/thomas-edison-homer.jpg)

I have a problem. It's not serious, it doesn't hurt, but it's there, like a zombie process nobody killed: accumulating GitHub repositories that I open every now and then just to remind myself they exist and feel a perfectly manageable pang of guilt.

The problem is this: I start projects the way I breathe, without thinking, without asking for permission. And I finish, at best, one out of every six. The other five remain in a state that a cardiologist would describe as "stable but unconscious."

So, to keep this from being abstract, here's a representative sample of the zoo I currently have active:

* A reverse proxy built from scratch with `net/http`, without any libraries, "to understand how it really works" (spoiler: I still don't fully understand it, but after three months of saying "it's almost done," I can't exactly admit it to anyone now).

* A P2P streaming system over WebRTC DataChannels with peer selection based on scoring, because apparently what my life was missing was reinventing BitTorrent, but worse, and without any users.

* An app like Rocksmith, but with chords synchronized over YouTube videos.

* A private BitTorrent tracker with a Discord bot next to it, because a big project never comes alone, it comes with children.

* A vinyl price scraper, so I can complain about how expensive records are and which seller has them cheaper, obviously without actually buying anything.

* An events and concerts scraper, so I can make myself miserable and see how expensive it is to go see that indie band I only know and that costs more than 100 USD.

And that's what I can remember off the top of my head. I'm probably missing a few. Being almost 40 doesn't come alone, just like my Alzheimer's.

**## Why me?**

No idea. I guess for a long time I thought it was a lack of discipline. Now it's more about not having enough time, and whenever I do have some free time, wanting to do 40 things at the same time. But basically, I have a brain that confuses "interest" with "lifelong commitment" every time a new shiny problem appears.

The dopamine of a new project isn't in finishing it. It's in the first week, when everything is still a promise: when the problem is purely conceptual and you haven't yet hit the horrifying detail that's going to make you hate the project three weeks later. Starting a project is the cheapest, nicest part and, let's be honest, the only part my brain actually feels like paying for.

Then there's the contrast. My day-to-day job is fintech: Lambdas, Step Functions, DynamoDB, YAML at two in the morning. It's a job I like, but it lives in the world of "solving someone else's business problem." Personal projects are my playground — that's where my real interest in streaming and media engineering lives, which has absolutely nothing to do with what the company I work for gets paid for. So when I start a new project in this area, technically I'm not avoiding anything — I'm going back to something I actually enjoy. The problem is that I have a special and obsessive interest in too many things at once, and absolutely no ability to say "no, not this week."

And finally, there's pure technical curiosity. I've always had that curiosity about how certain things were built, which is very different from the need to actually finish something. Sometimes what I want isn't "a finished product for the world," I just want to *know how it works under the hood*, down to the last detail, obsessively. Once I understand the mechanism, my motivation to polish it and make it nice for other humans falls off a cliff like a service nobody asked for.

**## The Last of Us**

It's not all a graveyard. Some projects actually reached a usable or semi-zombie state, and looking back, they have something in common: they were small, had a visible finish line, or solved something I personally needed in an urgent way.

The vinyl price scraper is the perfect example: it was born out of a real and recurring pain (not knowing whether the record I want is actually a good deal or whether someone is ripping me off), had a ridiculously limited scope, and the day it worked, it worked. It didn't need to be pretty or scalable, it just needed to warn me before I spent money I didn't have on an overpriced record.

The pattern repeats: when a project is born from "I need to solve this for myself, right now, this week," it tends to survive. When it is born from "hey, wouldn't it be cool if I could make something work like this?" my brain loses interest as soon as it understands the underlying problem, and the rest becomes an eternal theoretical exercise.

Now, "survive" has a particular definition in my dictionary, because scrapers have their own problem, and the problem is me: I'm cheap as hell. I'm not going to pay for a VPS, an instance, or anything with a recurring monthly cost for something that isn't sellable, has no other users, and that I only use a couple of times a month so I don't buy an overpriced vinyl or find out too late about a show that's already sold out. So instead of living in the cloud like it's supposed to, these scrapers run as cron jobs on some old Linux PC.

**## Plants vs. Zombies**

Then there's the rest. The reverse proxy that I got halfway through understanding. The P2P system that has a peer-scoring architecture more elaborate than some projects that actually charge money and have investors. The concert scraper that was supposed to notify me about every show in the country and that, the last time I looked at it, was notifying me about a show that had happened two months earlier. Things I started, learned a lot from, and then abandoned with the same tranquility with which you leave a dirty plate "for later."

I didn't delete them. They're still there, like a stuffed dog in the living room. I learned something from each of them — even if it's just "this was harder than I thought" or, more honestly, "what I really wanted was to understand it, not have it."

**## Question!**

****And why don't you make some of those side projects into tutorials or courses, so you can learn something with less drama?****

Because I'm not interested in pre-chewed challenges. I like the challenge itself, not the feeling of completing a checklist that someone else already solved for me. A side project cloned from a tutorial is like having the same duplicate sticker that millions of developers on the internet have: clone Netflix number 4,582, todo app number 9,213. All lined up on the same shelf, indistinguishable from one another, like the Buzz Lightyear joke in Toy Story when he realizes he's just another toy from an entire production line. I'd rather have my original failures, thanks.

![Buzz lightyears Store](blog/assets/images/a-store-full-of-buzz-lightyears.jpg)

**## The Final Cut**

I don't know if this can be cured. Again, it's not just a lack of discipline. If I ever manage to finish everything I start, it'll be because I've run out of ideas, or because I finally decided to blame television or TikTok for my lack of imagination. If I stumble across an interesting technical problem tomorrow, I'll most likely create a new repository instead of going back and finishing one of the six I already have open.

The point isn't to end this post with a promise that someday I'll finish everything — I don't even have the excuse of saying "I'll finish it by the end of the year." It's September, this is pure and genuine off-season overconfidence. I've already made a similar promise before, and we all know how that ended — just like the ["Stuff's Coming (Eventually)" post]({% post_url 2025-07-29-stuff-coming %}), followed by months of radio silence.

I'm simply going to accept that I'm someone who collects the beginnings of projects with the same obsession with which I collect vinyl records: I don't always listen to them all the way through, but I need to own them.
