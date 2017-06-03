# Contra 2000

Here I was playing around with an Online Multiplayer game. The idea was multiplayer contra. Like the NES classic....with this spin: everybody would hop into the same level, play as the contra guy, and try to shoot each other.

These are the things I was wanting to try out ...

* MelonJS - a framework for browser games (two thumbs up)
* Spring 5 and Pivotal Reactor - server to handle the client connections (two more thumbs up)
* Let my 7 year old help...he's been begging me to learn...and I think he might of learned a thing or two.

I havent worked on this for a few months...so Im calling it done for now. Hopefully somebody can make use of the source code. 
Here are a couple videos. 

[Video 1: Multiplayer - me vs my son](https://youtu.be/60zqe3LxqGM)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=60zqe3LxqGM" target="_blank"><img src="https://i.ytimg.com/vi/60zqe3LxqGM/1.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

[Video 2: Survivor - single player mode](https://youtu.be/2Bsm8jT5KpY)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=2Bsm8jT5KpY" target="_blank"><img src="https://i.ytimg.com/vi/2Bsm8jT5KpY/2.jpg?time=1496505268693"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>


# Project Contents

Contra-Client

* this folder holds the game client
* runs with node builds with grunt

Contra-Server

* this folder holds the game server
* runs with java builds with maven

# Notes

I hosted this thing on a free AWS box.
The performance was pretty solid...got several players playing together and it didnt lag...the bullets hit well.
