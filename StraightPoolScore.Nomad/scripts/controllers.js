var spsControllers = angular.module("spsControllers", []);

spsControllers.controller("homeCtrl", ["$scope",
    function ($scope) {
    }
]);

spsControllers.controller("newGameCtrl", ["$scope",
    function ($scope) {

    }
]);

spsControllers.controller("findGameCtrl", ["$scope",
    function ($scope) {

    }
]);

spsControllers.controller("viewGameCtrl", ["$scope", "$routeParams", "$games",
    function ($scope, $routeParams, $games) {
        var g = $games.load($routeParams.gameId);
        angular.extend($scope, g);

        $scope.canSwitch = function () {
            return $scope.scoring.isOpeningRack && $scope.scoring.ballsRemaining == $scope.scoring.maxBalls;
        };

        $scope.switchPlayers = function () {
            var p1 = $scope.player1;
            $scope.player1 = $scope.player2;
            $scope.player2 = p1;
        };

        $scope.undo = function () {
            // TODO : maintain a stack of commands that can be undone
        };

        $scope.visiblePanel = "scoring";

        $scope.scoring = {
            inc: function () {
                if ($scope.scoring.ballsRemaining < $scope.scoring.maxBalls)
                    $scope.scoring.ballsRemaining++;
            },

            dec: function () {
                if ($scope.scoring.ballsRemaining > 1)
                    $scope.scoring.ballsRemaining--;
            },

            miss: function () {
                $scope.scoring.isOpeningRack = false;
                $scope.scoring.isAfterNewRack = false;
                $scope.scoring.isAfterBreakingFoul = false;
            },

            foul: function () {
                $scope.scoring.isOpeningRack = false;
                $scope.scoring.isAfterNewRack = false;
                $scope.scoring.isAfterBreakingFoul = false;
            },

            safe: function () {
                $scope.scoring.isOpeningRack = false;
                $scope.scoring.isAfterNewRack = false;
                $scope.scoring.isAfterBreakingFoul = false;
            },

            breakingFoul: function () {
                $scope.scoring.isAfterBreakingFoul = true;
                $scope.scoring.isOpeningRack = false;
            },

            rebreak: function () {
                $scope.scoring.isAfterBreakingFoul = false;
                $scope.scoring.isOpeningRack = true;
            },

            newRack: function () {
                $scope.scoring.isOpeningRack = false;
                $scope.scoring.isAfterNewRack = true;
            },

            with15thBall: function () { },
            // TODO: How to implement newRack-with-15th-ball
        };
    }
]);

spsControllers.controller("profileCtrl", ["$scope",
    function ($scope) {

    }
]);

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
                    player1: {
                        name: "Robert",
                        score: 88,
                        foul1: false,
                        foul2: false,
                        foul3: false,
                        image: "",
                    },
                    player2: {
                        name: "Taylor",
                        score: 66,
                        foul1: true,
                        foul2: true,
                        foul3: false,
                        image: "",
                    },
                    scoring: {
                        maxBalls: 15,
                        ballsRemaining: 15,
                        isOpeningRack: true,
                        isAfterBreakingFoul: false,
                        isAfterNewRack: false,
                    },
                    innings: [
                        {
                            num: 1,
                            p1: { score: 0, ballsMade: 0, ending: "BreakingFoul" },
                            p2: { score: 0, ballsMade: 0, ending: "BreakingFoul" }
                        }
                    ],
                    stats: [
                        { name: "Total Balls", p1: 88, p2: 68 }
                    ]
                };
            }
        };
    }
);
