using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore
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
            BallsRemaining = 15;
            CurrentPlayerId = player1.Id;
        }

        public int Id { get; set; }

        public int Limit { get; set; }

        public Player Player1 { get; set; }
        public Player Player2 { get; set; }

        public LinkedList<Turn> Turns { get; set; }

        public int BallsRemaining { get; set; }
        public int NumberOfInnings { get; set; }

        public string CurrentPlayerId { get; set; }
        public Player GetCurrentPlayer()
        {
            return CurrentPlayerId == Player1.Id ? Player1 : Player2;
        }

        public void NextPlayer()
        {
            CurrentPlayerId = CurrentPlayerId == Player1.Id ? Player2.Id : Player1.Id;
        }

        public Turn EndTurn(int ballsRemaining, EndingType ending)
        {
            int ballsMade = BallsRemaining - ballsRemaining;
            BallsRemaining -= ballsMade;
            if (BallsRemaining <= 1)
            {
                BallsRemaining = 15; // new rack
            }

            var currentPlayer = GetCurrentPlayer();
            var turn = currentPlayer.UpdateStats(this, ballsMade, ending);

            // only add the turn if it's not a continuation of the previous 'NewRack' turn
            if (Turns.Last == null || Turns.Last.Value != turn)
                Turns.AddLast(turn);

            // only switch players if this wasn't a 'NewRack' or a 3-foul
            if (ending != EndingType.NewRack && turn.Ending != EndingType.ThreeConsecutiveFouls)
                NextPlayer();

            return turn;
        }
    }
}