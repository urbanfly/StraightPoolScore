using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore
{
    public static class Extensions
    {
        public static bool HasGameBeenWon(this StraightPoolGame game)
        {
            return game.GetPlayerStats(game.Player1).Score >= game.Limit
                || game.GetPlayerStats(game.Player2).Score >= game.Limit;
        }

        public static PlayerStats GetPlayerStats(this StraightPoolGame game, Player player)
        {
            return new PlayerStats(game.Turns, player);
        }

        public static Turn EndTurn(this StraightPoolGame game, int ballsRemaining, EndingType ending)
        {
            var lastTurn = game.Turns.Last;
            var lastPlayer = lastTurn == null ? null : lastTurn.Value.PlayerId;
            var lastEnding = lastTurn == null ? (EndingType?)null : lastTurn.Value.Ending;

            int ballsAtStartOfTurn = 15 - (game.Turns.Sum(t => t.BallsMade) % 14);
            int ballsMade = ballsAtStartOfTurn - ballsRemaining;

            if (lastEnding == EndingType.NewRack)
            {
                lastTurn.Value.Ending = ending;
                lastTurn.Value.BallsMade += ballsMade;

                return lastTurn.Value;
            }
            else
            {
                var currentPlayer = lastPlayer == game.Player1.Id ? game.Player2 : game.Player1;
                Turn newTurn = new Turn(currentPlayer.Id, ballsMade, ending);
                game.Turns.AddLast(newTurn);
                return newTurn;
            }
        }
    }
}
