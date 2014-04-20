/// <reference path="rx.js" />
/// <reference path="angular.js" />
/// <reference path="rx.aggregates.js" />
/// <reference path="rx.coincidence.js" />
/// <reference path="rx.binding.js" />

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

// TODO: update the "active" mechanism

spsControllers.controller("viewGameCtrl", ["$scope", "$routeParams", "$games",
    function ($scope, $routeParams, $games) {        
        var game = $games.load($routeParams.gameId);
        initializeScope(game);

        function initializeScope(game)
        {
            $scope.game = game;
            $scope.currentPlayer = getCurrentPlayer();
            $scope.ballsRemaining = game.ballsRemaining;
            $scope.isOpeningRack = game.turns.length == 0 || game.turns[game.turns.length - 1].ending == "ThreeConsecutiveFouls";
            $scope.isAfterBreakingFoul = game.turns.length > 0 && game.turns[game.turns.length - 1].ending == "BreakingFoul";
            $scope.isAfterNewRack = game.turns.length > 0 && game.turns[game.turns.length - 1].ending == "NewRack";
        }

        function getCurrentPlayer()
        {
            return (game.currentPlayerId == game.player1.id) ? game.player1 : game.player2;
        }

        function moveToNextPlayer() {
            game.currentPlayerId = (game.currentPlayerId == game.player1.id) ? game.player2.id : game.player1.id;
            $scope.currentPlayer = getCurrentPlayer();
        }

        $scope.canSwitch = function () {
            return game.turns.length == 0;
        };

        $scope.switchPlayers = function () {
            var p1 = game.player1;
            game.player1 = game.player2;
            game.player2 = p1;
            game.currentPlayerId = game.player1.id;
            $scope.currentPlayer = getCurrentPlayer();
        };

        $scope.undo = function () {
            // TODO : maintain a stack of commands that can be undone
            // pop a turn off of the turns array and update the game state to 
        };

        $scope.inc = function () {
            if ($scope.ballsRemaining < game.ballsRemaining)
                $scope.ballsRemaining++;
        };

        $scope.dec = function () {
            if ($scope.ballsRemaining > 2)
                $scope.ballsRemaining--;
        };

        $scope.endTurn = function (endingType)
        {
            if (endingType == "NewRack")
            {
                $scope.ballsRemaining = 1;
            }

            var ballsMade = game.ballsRemaining - $scope.ballsRemaining;

            var turn = updateStats($scope.currentPlayer, ballsMade, endingType);

            game.turns.push(turn);
            _lastInnings = null;
            _lastStats = null;

            $scope.isOpeningRack = false;
            $scope.isAfterBreakingFoul = false;
            $scope.isAfterNewRack = false;

            // only switch players if this wasn't a 'NewRack' or a 3-foul
            switch (turn.ending) {
                case "Miss":
                case "Foul":
                case "Safety":
                    game.ballsRemaining -= ballsMade;
                    moveToNextPlayer();
                    break;
                case "BreakingFoul":
                    $scope.isAfterBreakingFoul = true;
                    moveToNextPlayer();
                    break;
                case "Pass":
                    $scope.isOpeningRack = true;
                    moveToNextPlayer();
                    break;
                case "ThreeConsecutiveFouls":
                    $scope.isOpeningRack = true;
                    game.ballsRemaining = 15;
                    break;
                case "NewRack":
                    $scope.isAfterNewRack = true;
                    game.ballsRemaining = 15;
                    break;
            }

            $scope.ballsRemaining = game.ballsRemaining;

            //game.$save();

            return turn;
        };

        function updateStats(player, ballsMade, ending)
        {
            player.totalBallsMade += ballsMade;
            player.score += ballsMade;

            if (ballsMade > 0 || ending != "Foul") {
                player.consecutiveFouls = 0;
            }

            switch (ending) {
                case "BreakingFoul":
                    player.score -= 2;
                    player.totalFouls++;
                    break;
                case "Foul":
                    player.totalFouls++;
                    player.consecutiveFouls++;
                    player.score--;
                    if (player.consecutiveFouls == 3) {
                        player.score -= 15;
                        player.consecutiveFouls = 0;
                        ending = "ThreeConsecutiveFouls";
                    }
                    break;
                case "Miss":
                    player.totalMisses += 1;
                    break;
                case "Safety":
                    player.totalSafeties += 1;
                    break;
            }

            if (player.score >= game.Limit) {
                ending = "Win";
            }

            var turn = {
                playerId: player.id,
                ending: ending,
                ballsMade: ballsMade,
                score: player.score,
            };

            if (ending != "NewRack") {
                player.highRun = Math.max(player.highRun, turn.ballsMade);
            }
            
            return turn;
        }

        var _lastInnings = null;
        $scope.getInnings = function () {
            if (_lastInnings)
                return _lastInnings;

            var innings = [];
            var i = {};
            var last = null;
            for (var n = 0; n < game.turns.length; n++)
            {
                var t = game.turns[n];

                if (last != null && (t.playerId == last.playerId || last.playerId == game.player2.id)) {
                    innings.push(i);
                    i = {};
                }

                if (t.playerId == game.player1.id)
                    i.p1 = t;
                else
                    i.p2 = t;

                last = t;
            }

            innings.push(i);
            _lastInnings = innings;
            return innings;
        };

        var _lastStats = null;
        $scope.getStats = function () {
            if (_lastStats)
                return _lastStats;

            function getRuns(player, turns)
            {
                var pturns = turns.select(function (t) { return t.playerId; }).distinctUntilChanged().publish();
                var opening = pturns.where(function (p) { return p == player.id; });
                var closing = function (w) { return pturns.firstOrDefault(function (p) { return w != p; }, 0); };
                pturns.connect();
                return turns.window(opening, closing)
                    .selectMany(function (w) {
                        return w.sum(function (t) {
                            return t.ballsMade;
                        });
                    })
                    .defaultIfEmpty(0);
            }

            var stats = [
                {
                    name:"Total Balls",
                    func: function (player, turns) {
                        return turns.where(function (t) { return t.playerId == player.id; })
                            .sum(function (t) { return t.ballsMade; });
                    }
                },
                //{
                //    name:"Handicap",
                //    func:function (player, turns) { return Rx.Observable.return(0); }
                //},
                {
                    name:"High Run",
                    func: function (player, turns) {
                        return getRuns(player, turns).max();
                    },
                },
                {
                    name:"Avg. Run",
                    func: function (player, turns) {
                        return getRuns(player, turns).average();
                    },
                },
                {
                    name:"Total Fouls",
                    func: function (player, turns) { return Rx.Observable.return(player.totalFouls); },
                },
                {
                    name:"Total Safes",
                    func: function (player, turns) { return Rx.Observable.return(player.totalSafeties); },
                },
                {
                    name:"Effective Safes",
                    func: function (player, turns) {
                        return turns.zip(turns.skip(1), function (x, y) { return { x: x, y: y }; })
                            .where(function (pair) { return pair.x.playerId == player.id && pair.x.ending == "Safety" && pair.y.ballsMade == 0; })
                            .count();
                    },
                },
                //{
                //    name:"Balls b/w Errors",
                //    func: function (player, turns) { return Rx.Observable.return(0); },
                //},
                {
                    name:"StdDev Run",
                    func: function (player, turns) {
                        return getRuns(player, turns).average()
                            .selectMany(function (mean) {
                                return getRuns(player, turns).select(function (r) {
                                    return Math.pow(r - mean, 2);
                                })
                                    .average()
                                    .select(function (mean2) {
                                        return Math.sqrt(mean2);
                                    })
                        });
                    },
                },
            ];

            var turns = Rx.Observable.fromArray(game.turns);

            _lastStats = [];
            Rx.Observable.fromArray(stats)
                .select(function (s) {
                    var result = {name:s.name};
                    s.func(game.player1, turns).subscribe(function (r) { result.p1 = r; });
                    s.func(game.player2, turns).subscribe(function (r) { result.p2 = r; });
                    return result;
                }).subscribe(function (s) { _lastStats.push(s); });

            return _lastStats;
        };

        $scope.with15thBall = function () {
            $scope.isAfterNewRack = false;
            $scope.currentPlayer.score++;
            var lastTurn = game.turns[game.turns.length - 1];
            lastTurn.ballsMade++;
            lastTurn.score++;
        };
    }
]);

spsControllers.controller("profileCtrl", ["$scope",
    function ($scope) {

    }
]);
