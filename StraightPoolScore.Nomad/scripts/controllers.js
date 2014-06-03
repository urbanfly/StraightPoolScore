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

spsControllers.controller("viewGameCtrl", ["$scope", "$routeParams", "$games", "$filter",
    function ($scope, $routeParams, $games, $filter) {        
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
                    explain3Fouls();
                    break;
                case "NewRack":
                    $scope.isAfterNewRack = true;
                    game.ballsRemaining = 15;
                    game.rackCount++;
                    break;
            }

            $scope.ballsRemaining = game.ballsRemaining;

            //game.$save();
            
            warnOn2Fouls();

            return turn;
        };

        function warnOn2Fouls()
        {
            window.setTimeout(function(){
                if ($scope.currentPlayer.consecutiveFouls == 2)
                {
                    alert("Player on 2 fouls!");
                }
            }, 100);
        }

        function explain3Fouls()
        {
            alert("Three consecutive fouls!\n- 15 point penalty\n- re-rack all 15 balls\n- fouling player breaks under opening break rules");
        }

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

            function getRuns(turns, player) {
                var playerChanges = turns.select(function (t) { return t.playerId; }).distinctUntilChanged();

                var runs = turns.groupByUntil(function (t) { return t.playerId; }, null, function (g) { return playerChanges.skip(1); })
                    .selectMany(function (g) {
                        return g.aggregate(function (acc, t) {
                            return {
                                playerId: t.playerId,
                                ballsMade: t.ballsMade + acc.ballsMade,
                                ending: t.ending,
                            };
                        });
                    });

                if (player)
                {
                    runs = runs.where(function (r) { return r.playerId == player.id; })
                        .defaultIfEmpty({ playerId: player.Id, ballsMade: 0 });
                }

                return runs;
            }

            //function getEffectiveRuns(turns, player) {
            //    var runs = getRuns(turns).publish();

            //    var effRuns = runs.groupByUntil(
            //        function (r) { return r.playerId; },
            //        null,
            //        function (g) {
            //            return runs.skipWhile(function (r) {
            //                return (r.playerId == g.key && r.ending == "Safety") || (r.playerId != g.key && r.ballsMade == 0);
            //            });
            //        })
            //        .selectMany(function (g) {
            //            g.toArray().subscribe(function (x) { console.info(g.key); console.info(x); });
            //            return g.aggregate(function (acc, t) {
            //                return {
            //                    playerId: t.playerId,
            //                    ballsMade: t.ballsMade + acc.ballsMade,
            //                    ending: t.ending,
            //                };
            //            });
            //        });

            //    if (player) {
            //        effRuns = effRuns
            //            .where(function (r) { return r.playerId == player.id; })
            //            .defaultIfEmpty({ playerId: player.Id, ballsMade: 0 });
            //    }

            //    runs.connect();

            //    return effRuns;
            //}

            var stats = [
                {
                    name:"Total Balls",
                    func: function (player, turns) {
                        return turns.where(function (t) { return t.playerId == player.id; })
                            .sum(function (t) { return t.ballsMade; });
                    },
                    round: 0,
                },
                {
                    name:"High Run",
                    func: function (player, turns) {
                        return getRuns(turns, player)
                            .select(function (r) { return r.ballsMade; })
                            .max();
                    },
                    round: 0,
                },
                {
                    name:"Avg. Run",
                    func: function (player, turns) {
                        return getRuns(turns, player)
                            .select(function (r) { return r.ballsMade; })
                            .average();
                    },
                    round: 2,
                },
                {
                    name: "StdDev Run",
                    func: function (player, turns) {
                        var runs = getRuns(turns, player).select(function (r) { return r.ballsMade; });
                        return runs.average()
                            .selectMany(function (mean) {
                                return runs.select(function (r) {
                                    return Math.pow(r - mean, 2);
                                })
                                    .average()
                                    .select(function (mean2) {
                                        return Math.sqrt(mean2);
                                    })
                            });
                    },
                    round: 2,
                },
                {
                    name:"Total Fouls",
                    func: function (player, turns) { return Rx.Observable.return(player.totalFouls); },
                    round: 0,
                },
                {
                    name:"Total Safes",
                    func: function (player, turns) { return Rx.Observable.return(player.totalSafeties); },
                    round: 0,
                },
                {
                    name:"Effective Safes",
                    func: function (player, turns) {
                        return turns.zip(turns.skip(1), function (x, y) { return { x: x, y: y }; })
                            .where(function (pair) { return pair.x.playerId == player.id && pair.x.ending == "Safety" && pair.y.ballsMade == 0; })
                            .count();
                    },
                    round: 0,
                },
                //{
                //    name: "Eff. High Run",
                //    func: function (player, turns) {
                //        return getEffectiveRuns(turns, player)
                //            .select(function (r) { return r.ballsMade; })
                //            .max();
                //    },
                //    round: 0,
                //},
                //{
                //    name: "Eff. Avg. Run",
                //    func: function (player, turns) {
                //        return getEffectiveRuns(turns, player)
                //            .select(function (r) { return r.ballsMade; })
                //            .average();
                //    },
                //    round: 2,
                //},
                //{
                //    name: "Eff. StdDev Run",
                //    func: function (player, turns) {
                //        var runs = getEffectiveRuns(turns, player).select(function (r) { return r.ballsMade; });
                //        return getEffectiveRuns(turns, player).select(function (r) { return r.ballsMade; }).average()
                //            .selectMany(function (mean) {
                //                return getEffectiveRuns(turns, player).select(function (r) { return r.ballsMade; }).select(function (r) {
                //                    return Math.pow(r - mean, 2);
                //                })
                //                    .average()
                //                    .select(function (mean2) {
                //                        return Math.sqrt(mean2);
                //                    })
                //            });
                //    },
                //    round: 2,
                //},
            ];

            var turns = Rx.Observable.fromArray(game.turns);

            _lastStats = [];
            Rx.Observable.fromArray(stats)
                .select(function (s) {
                    var result = {name:s.name};
                    s.func(game.player1, turns).subscribe(function (r) {
                        result.p1 = $filter("number")(r, s.round || 0);
                    });
                    s.func(game.player2, turns).subscribe(function (r) {
                        result.p2 = $filter("number")(r, s.round || 0);
                    });
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
