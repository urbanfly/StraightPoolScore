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
    }
}
