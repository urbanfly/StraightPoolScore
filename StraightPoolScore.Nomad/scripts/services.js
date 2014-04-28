
//var spsServices = angular.module("spsServices", ["ngResource"]);

//spsServices.factory("$games", ["$resource",
//    function ($resource) {
//        return $resource("games/:gameId", {}, {
//            query: { method: "GET", params: { phoneId: "" }, isArray: true }
//        });
//    }
//]);

var spsServices = angular.module("spsServices", []);

spsServices.factory("$games",
    function () {
        return {
            load: function (gameId) {
                return {
                    id: gameId,
                    limit: 80,
                    player1: {
                        id: "players/1",
                        name: "Robert",
                        score: 0,
                        consecutiveFouls: 0,
                        totalBallsMade:0,
                        totalFouls: 0,
                        totalMisses: 0,
                        totalSafeties: 0,
                        image: "",
                    },
                    player2: {
                        id: "players/2",
                        name: "Taylor",
                        score: 0,
                        consecutiveFouls: 0,
                        totalBallsMade: 0,
                        totalFouls: 0,
                        totalMisses: 0,
                        totalSafeties: 0,
                        image: "",
                    },
                    currentPlayerId: "players/1",
                    ballsRemaining: 15,
                    rackCount: 1,
                    turns: [
                    ],
                };
            }
        };
    }
);
