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
        var game = $games.load($routeParams.gameId);
        angular.extend($scope, game);

        $scope.currentPlayer = (game.currentPlayer == game.player1.id) ? $scope.player1 : $scope.player2;
        $scope.currentPlayer.isActive = true;

        $scope.canSwitch = function () {
            return $scope.scoring.isOpeningRack && $scope.scoring.ballsRemaining == $scope.scoring.maxBalls;
        };

        $scope.switchPlayers = function () {
            var p1 = $scope.player1;
            $scope.player1 = $scope.player2;
            $scope.player2 = p1;
            $scope.player1.isActive = true;
            $scope.player2.isActive = false;
        };

        $scope.undo = function () {
            // TODO : maintain a stack of commands that can be undone
        };

        $scope.visiblePanel = "scoring";

        $scope.scoring.inc = function () {
            if ($scope.scoring.ballsRemaining < $scope.scoring.maxBalls)
                $scope.scoring.ballsRemaining++;
        };

        $scope.scoring.dec = function () {
            if ($scope.scoring.ballsRemaining > 2)
                $scope.scoring.ballsRemaining--;
        };

        $scope.scoring.miss = function () {
            updateScore();
            resetFouls();
            switchPlayers();
        };

        $scope.scoring.foul = function () {
            updateScore();
            var cp = $scope.currentPlayer;
            cp.fouls++;
            cp.score--;

            if (cp.fouls == 3)
            {
                cp.score -= 15;
                cp.fouls = 0;

                $scope.scoring.ballsRemaining = 15;
                $scope.scoring.maxBalls = 15;
                $scope.scoring.isOpeningRack = true;
                return;
            }

            switchPlayers();
        };

        $scope.scoring.safe = function () {
            updateScore();
            resetFouls();
            switchPlayers();
        };

        $scope.scoring.breakingFoul = function () {
            $scope.currentPlayer.score -= 2;
            $scope.scoring.isAfterBreakingFoul = true;
            $scope.scoring.isOpeningRack = false;
            switchPlayers();
        };

        $scope.scoring.rebreak = function () {
            $scope.scoring.isAfterBreakingFoul = false;
            $scope.scoring.isOpeningRack = true;
            switchPlayers();
        };

        $scope.scoring.newRack = function () {
            $scope.scoring.ballsRemaining = 1;
            updateScore();
            $scope.scoring.isAfterNewRack = true;

            $scope.scoring.ballsRemaining = 15;
            $scope.scoring.maxBalls = $scope.scoring.ballsRemaining;
        };

        $scope.scoring.with15thBall = function () {
            $scope.scoring.isAfterNewRack = false;
            $scope.currentPlayer.score++;
        };

        function updateScore()
        {
            var diff = $scope.scoring.maxBalls - $scope.scoring.ballsRemaining;
            $scope.currentPlayer.score += diff;

            if (diff > 0)
                resetFouls();

            $scope.scoring.maxBalls = $scope.scoring.ballsRemaining;

            $scope.scoring.isOpeningRack = false;
            $scope.scoring.isAfterNewRack = false;
            $scope.scoring.isAfterBreakingFoul = false;
        }

        function resetFouls()
        {
            $scope.currentPlayer.fouls = 0;
        }

        function switchPlayers()
        {
            $scope.currentPlayer.isActive = false;
            $scope.currentPlayer = ($scope.currentPlayer == $scope.player1) ? $scope.player2 : $scope.player1;
            $scope.currentPlayer.isActive = true;
        }
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
                        id: "players/1",
                        name: "Robert",
                        score: 0,
                        fouls: 0,
                        image: "",
                    },
                    player2: {
                        id:"players/2",
                        name: "Taylor",
                        score: 0,
                        fouls: 0,
                        image: "",
                    },
                    currentPlayer:"players/1",
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
                        { name: "Total Balls", p1: 88, p2: 68 },
                        { name: "Handicap", p1: 0, p2: 0 },
                        { name: "High Run", p1: 0, p2: 0 },
                        { name: "Avg. Run", p1: 0, p2: 0 },
                        { name: "Total Fouls", p1: 0, p2: 0 },
                        { name: "Total Safes", p1: 0, p2: 0 },
                        { name: "Successful Safes", p1: 0, p2: 0 },
                        { name: "Balls b/w Errorrs", p1: 0, p2: 0 },
                        { name: "StdDev Run", p1: 0, p2: 0 },
                    ]
                };
            }
        };
    }
);
