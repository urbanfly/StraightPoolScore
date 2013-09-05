using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore
{
    public class Turn
    {
        /// <summary>
        /// Initializes a new instance of the Turn class.
        /// </summary>
        public Turn(string player, int ballsMade, EndingType ending)
        {
            PlayerId = player;
            Ending = ending;
            BallsMade = ballsMade;
        }

        public string PlayerId { get; set; }
        public EndingType Ending { get; set; }
        public int BallsMade { get; set; }
    }
}
