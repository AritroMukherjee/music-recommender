# Music recommender

[![Build Status](https://travis-ci.org/wachunga/music-recommender.svg?branch=master)](https://travis-ci.org/wachunga/music-recommender)

A recommendation engine for a fictional social music player service. This service does not have explicit ratings; the only inputs are:
  * what the user has listened to
  * which other users they follow

## Design notes

Goals: keep it simple, maximize discovery of new songs, prefer explainable recommendations.

I went for a hybrid approach similar to what Netflix does: offer up a variety of explainable recommendations. For example, "because you listened to X", "popular songs", "top jazz". Giving the user options is desirable. The engine also handles new users who haven't listened to anything or followed anyone yet.

Implementation:
  * I opted to preemptively make apis async (with Promises) because switching later when a db is introduced would be a pain. That's a refactoring I've done many times before. The trade-off is more complexity up front.
  * I opted to use classes where we will want additional properties and methods later.
  * I structured the server code according to feature (follow, listen) rather than role (model, controller) because I find that organization scales better, and all related code is together.
  * We will eventually have a User, userModel etc but without a list of users (eg users.json), there was no need to introduce this yet. This means, however, there's no verification that users exist in code such as followModel, which makes me a tad uncomfortable.

## Install

Just `npm install` to get going. No globals required, but you'll need Node 6.x.

As you would expect:
`npm start` to start the server
`npm test` to lint and run the unit/integration tests. Prefix with `DEBUG=recommend*` if you want logging.

## Future work

  * Scalability: Currently everything is in memory, which obviously doesn't scale. Some of the recommenders iterate through all music or all listens, which also won't scale.
  * There are so many recommendation approaches to try. For example, I'd like to build a similarUsersRecommender using something like kNN.
  * Additional metadata would open up more possibilities: listen count, listen timestamp, music artist/release date, user location, etc.

