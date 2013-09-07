using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore
{
    public class Turn : IEquatable<Turn>
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

        public override bool Equals(object obj)
        {
            if (obj is Turn)
                return Equals(obj as Turn);

            return false;
        }

        public override int GetHashCode()
        {
            return EqualityComparer<string>.Default.GetHashCode(PlayerId)
            ^ EqualityComparer<EndingType>.Default.GetHashCode(Ending)
            ^ EqualityComparer<int>.Default.GetHashCode(BallsMade);
        }

        public override string ToString()
        {
            return string.Format("{0} made {1} balls; {2}", PlayerId, BallsMade, Ending);
        }

        public bool Equals(Turn other)
        {
            return (this.PlayerId == other.PlayerId
                && this.BallsMade == other.BallsMade
                && this.Ending == other.Ending);
        }
    }
}
