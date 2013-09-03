using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore.Web.Models
{
    public class StraightPoolGame
    {
        /// <summary>
        /// Initializes a new instance of the StraightPoolGame class.
        /// </summary>
        public StraightPoolGame(Player player1, Player player2, int limit)
        {
            Turns = new LinkedList<Turn>();
            Player1 = player1;
            Player2 = player2;
            Limit = limit;
        }

        public string Id { get; set; }

        public int Limit { get; set; }

        public Player Player1 { get; set; }
        public Player Player2 { get; set; }

        public LinkedList<Turn> Turns { get; set; }
    }
}