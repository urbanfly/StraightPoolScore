
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
                    turns: [
                    ],
                    //scoring: {
                    //    maxBalls: 15,
                    //    ballsRemaining: 15,
                    //    isOpeningRack: true,
                    //    isAfterBreakingFoul: false,
                    //    isAfterNewRack: false,
                    //},
                    //innings: [
                    //    {
                    //        num: 1,
                    //        p1: { score: 0, ballsMade: 0, ending: "BreakingFoul" },
                    //        p2: { score: 0, ballsMade: 0, ending: "BreakingFoul" }
                    //    }
                    //],
                    //stats: [
                    //    { name: "Total Balls", p1: 88, p2: 68 },
                    //    { name: "Handicap", p1: 0, p2: 0 },
                    //    { name: "High Run", p1: 0, p2: 0 },
                    //    { name: "Avg. Run", p1: 0, p2: 0 },
                    //    { name: "Total Fouls", p1: 0, p2: 0 },
                    //    { name: "Total Safes", p1: 0, p2: 0 },
                    //    { name: "Successful Safes", p1: 0, p2: 0 },
                    //    { name: "Balls b/w Errorrs", p1: 0, p2: 0 },
                    //    { name: "StdDev Run", p1: 0, p2: 0 },
                    //]
                };
            }
        };
    }
);
