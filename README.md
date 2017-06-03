# Contra 2000

Here I was playing around with an Online Multiplayer game. The idea was multiplayer contra. Like the NES classic....with this spin: everybody would hop into the same level, play as the contra guy, and try to shoot each other.

These are the things I was wanting to try out ...

* MelonJS - a framework for browser games (two thumbs up)
* Spring 5 and Pivotal Reactor - server to handle the client connections (two more thumbs up)


# Project Contents

Contra-Client

* this folder holds the game client
* runs with node builds with grunt

Contra-Server

* this folder holds the game server
* runs with java builds with maven

# Notes

I hosted this thing on a free AWS box.
The performance was pretty amazing...got several players playing together and it was extremely performant (probably wouldnt scale that nice). 
