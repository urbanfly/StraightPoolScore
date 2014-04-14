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
            };

            if (ending != "NewRack") {
                player.highRun = Math.max(player.highRun, turn.ballsMade);
            }
            
            return turn;
        }

        $scope.with15thBall = function () {
            $scope.isAfterNewRack = false;
            $scope.currentPlayer.score++;
            game.turns[game.turns.length - 1].ballsMade++;
        };
    }
]);

spsControllers.controller("profileCtrl", ["$scope",
    function ($scope) {

    }
]);
