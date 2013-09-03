using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore.Web.Models
{
    public class PlayerStats
    {
        private readonly LinkedList<Turn> _turns;
        private readonly string _player;
        private readonly IEnumerable<Turn> _playerTurns;
        private readonly int _handicap;
        
        /// <summary>
        /// Initializes a new instance of the PlayerStats class.
        /// </summary>
        public PlayerStats(LinkedList<Turn> turns, Player player)
        {
            _handicap = player.Handicap;
            _player = player.Id;
            _turns = turns;
            _playerTurns = _turns.Where(t => t.Player == _player);
        }

        public int NumberOfSafeties { get { return _playerTurns.Count(t => t.Ending == EndingType.Safety); } }
        public int NumberOfFouls { get { return _playerTurns.Count(t => t.Ending == EndingType.Foul); } }
        public int NumberOfMisses { get { return _playerTurns.Count(t => t.Ending == EndingType.Miss); } }
        public int NumberOfBallsMade { get { return _playerTurns.Sum(t => t.BallsMade); } }
        
        public int HighRun { get { return _playerTurns.Select(t => t.BallsMade).DefaultIfEmpty().Max(); } }
        public double BallsPerInning { get { return _playerTurns.Select(t => t.BallsMade).DefaultIfEmpty().Average(); } }

        public double HighRunWithSafeties { get { return BallsBetweenErrors.DefaultIfEmpty().Max(); } }
        public double AverageBallsBetweenErrors { get { return BallsBetweenErrors.DefaultIfEmpty().Average(); } }

        public int Score { get { return NumberOfBallsMade - NumberOfFouls + _handicap; } }

        public IEnumerable<int> BallsBetweenErrors 
        { 
            get 
            {
                var count = 0;
                bool waitingForEndOfInning = false;
                foreach (var turn in _turns.SkipWhile(t => t.Player != _player))
                {
                    if (turn.Player == _player)
                    {
                        count += turn.BallsMade;
                        if (turn.Ending == EndingType.Safety)
                        {
                            waitingForEndOfInning = true;
                        }
                        else
                        {
                            yield return count;
                            count = 0;
                        }
                    }
                    else
                    {
                        waitingForEndOfInning = false;
                        if (turn.BallsMade > 0 && count > 0) // opponent made any balls
                        {
                            yield return count;
                            count = 0;
                        }
                    }
                }

                if (waitingForEndOfInning)
                    yield return count;
            }
        }
    }
}
