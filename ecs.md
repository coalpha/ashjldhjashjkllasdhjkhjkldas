# ecs

the main thing of this thing.

it's basically the central command center or a God class if you will.
fuck your oop principals that's how I'm doing it.

this is going to first query the database to load all of the todo thingies
basically this ecs is going to be a nice layer between the database and the
better objects that are being given out.

ideally, we want to query the db as little as possible because it's only there
for storage.

the ecs is going to be doing a lot of writing to the database though.

it'll be the one managing deletion and basically everything else.

I'm not sure that I really want to be giving out classes from the ECS
the ecs is just going to give out objects and you shouldn't change them?

nah maybe I'll give out full classes with a pointer to it's ecs?
