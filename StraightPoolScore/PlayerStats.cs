using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Linq;
using System.Reactive.PlatformServices;

namespace StraightPoolScore
{
    public class PlayerStats
    {
        private readonly LinkedList<Turn> _turns;
        private readonly string _playerId;
        private readonly IEnumerable<Turn> _playerTurns;
        
        /// <summary>
        /// Initializes a new instance of the PlayerStats class.
        /// </summary>
        public PlayerStats(LinkedList<Turn> turns, Player player)
        {
            Handicap = player.Handicap;
            _playerId = player.Id;
            _turns = turns;
            _playerTurns = _turns.Where(t => t.PlayerId == _playerId);
        }

        public int Handicap { get; set; }

        public int NumberOfSafeties { get { return _playerTurns.Count(t => t.Ending == EndingType.Safety); } }
        public int NumberOfFouls { get { return _playerTurns.Count(t => t.Ending == EndingType.Foul); } }
        public int NumberOfMisses { get { return _playerTurns.Count(t => t.Ending == EndingType.Miss); } }
        public int NumberOfBallsMade { get { return _playerTurns.Sum(t => t.BallsMade); } }
        public int NumberOfInnings { get { return _playerTurns.Count(); } }

        public int HighRun { get { return _playerTurns.Select(t => t.BallsMade).DefaultIfEmpty().Max(); } }
        public double AverageBallsPerInning { get { return _playerTurns.Select(t => t.BallsMade).DefaultIfEmpty().Average(); } }

        public double HighRunWithSafeties { get { return BallsBetweenErrors.DefaultIfEmpty().Max(); } }
        public double AverageBallsBetweenErrors { get { return BallsBetweenErrors.DefaultIfEmpty().Average(); } }

        public int Score { get { return NumberOfBallsMade - NumberOfFouls + Handicap; } }

        private IEnumerable<int> BallsBetweenErrors 
        { 
            get 
            {
                var count = 0;
                bool waitingForEndOfInning = false;
                foreach (var turn in _turns.SkipWhile(t => t.PlayerId != _playerId))
                {
                    if (turn.PlayerId == _playerId)
                    {
                        count += turn.BallsMade;
                        if (turn.Ending == EndingType.Safety)
                        {
                            waitingForEndOfInning = true;
                        }
                        else
                        {
                            waitingForEndOfInning = false;
                            yield return count;
                            count = 0;
                        }
                    }
                    else
                    {
                        if (waitingForEndOfInning && turn.BallsMade > 0) // opponent made any balls
                        {
                            waitingForEndOfInning = false;
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
