StraightPoolScore
=================

### Backend
* Asp.Net hosted on AppHarbor
  * WebAPI for loading data
  * SignalR real-time updates
* RavenDB hosted at RavenHQ

### Frontend
* game-oriented smartphone-optimized single-page-app
* UI implemented with Bootstrap
* general JS framework ZeptoJS (jQuery compatible replacement)
* ViewModel implemented with KnockoutJS
* Native Android/iOS/WP apps implemented with PhoneGap and available it app stores

### Later
* league organizations
  * roster
  * schedules
  * stats
  * notifications
* desktop site
* stats with graphs, charts
* user profiles

### WebAPI
* Find players
* Create players
* Create Game
* List Games
* View Game (readonly)
* Score Game
* Submit Inning

### SignalR (server -> client)
* Inning ended; every button pressed on the "scoring" view
