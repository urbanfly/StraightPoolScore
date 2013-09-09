using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore
{
    public class Player : IEquatable<Player>
    {
        /// <summary>
        /// Initializes a new instance of the Player class.
        /// </summary>
        public Player(string name, int handicap = 0)
        {
            Name = name;
            Handicap = handicap;
            
            Score = handicap;
            ConsecutiveFouls = 0;
            TotalSafeties = 0;
            TotalFouls = 0;
            TotalMisses = 0;
            TotalBallsMade = 0;
            HighRun = 0;
            //HighRunWithSafeties = 0;
            AverageBallsPerInning = 0d;
            //AverageBallsBetweenErrors = 0d;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public int Handicap { get; set; }

        public int Score { get; set; }
        public int ConsecutiveFouls { get; set; }
        public int TotalSafeties { get; set; }
        public int TotalFouls { get; set; }
        public int TotalMisses { get; set; }
        public int TotalBallsMade { get; set; }
        public int HighRun { get; set; }
        //public int HighRunWithSafeties { get; set; }
        public double AverageBallsPerInning { get; set; }
        //public double AverageBallsBetweenErrors { get; set; }

        public Turn UpdateStats(StraightPoolGame game, int ballsMade, EndingType ending)
        {
            TotalBallsMade += ballsMade;
            Score += ballsMade;
            
            if (ballsMade > 0 || ending != EndingType.Foul)
            {
                ConsecutiveFouls = 0;
            }
            
            switch (ending)
            {
                case EndingType.BreakingFoul:
                    Score -= 2;
                    TotalFouls++;
                    break;
                case EndingType.Foul:
                    TotalFouls++;
                    ConsecutiveFouls++;
                    Score--;
                    if (ConsecutiveFouls == 3)
                    {
                        Score -= 15;
                        ConsecutiveFouls = 0;
                        ending = EndingType.ThreeConsecutiveFouls;
                    }
                    break;
                case EndingType.Miss:
                    TotalMisses += 1;
                    break;
                case EndingType.Safety:
                    TotalSafeties += 1;
                    break;
            }

            if (Score >= game.Limit)
            {
                ending = EndingType.Win;
            }

            // if the last turn was by the same user, combine turns
            var turn = game.Turns.Last == null ? null : game.Turns.Last.Value;
            if (turn != null && turn.PlayerId == Id)
            {
                turn.Ending = ending;
                turn.BallsMade += ballsMade;
            }
            else
            {
                turn = new Turn(Id, ballsMade, ending);
            }

            if (ending != EndingType.NewRack)
            {
                HighRun = Math.Max(HighRun, turn.BallsMade);
            }

            return turn;
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Player))
                return false;

            return Equals(obj as Player);
        }

        public override int GetHashCode()
        {
            return EqualityComparer<string>.Default.GetHashCode(Id)
                ^ EqualityComparer<string>.Default.GetHashCode(Name)
                ^ EqualityComparer<int>.Default.GetHashCode(Handicap);
        }

        public override string ToString()
        {
            return string.Format("{1} ({0}); Handicap = {2}", Id, Name, Handicap);
        }

        public bool Equals(Player other)
        {
            return Id == other.Id
                && Name == other.Name
                && Handicap == other.Handicap;
        }
    }
}
